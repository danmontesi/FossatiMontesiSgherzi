/**
 * Dependency Import
 */
const format = require('pg-format')
const nm = require('nodemailer')
const { getActor } = require('../../managers/token/TokenManager')

/**
 * Import function that allows to connect to the pool
 * @returns Promise<Pg.Client>
 */
const {
  connect
} = require('../config')

const requiredParams = require('./requiredParams')

/**
 * Allows to save the data of the given user in the database
 * @param auth_token: String
 * @param bodyData: JSON The data to be saved
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function saveData(auth_token, bodyData) {

  // As sometimes the parser fails to recognize that the data are JSON
  // due to the Flutter poorly interpretation of sent data
  // "manual" conversion is necessary here.
  if (typeof bodyData === 'string') bodyData = JSON.parse(bodyData)

  // Retrive  gps_coordinates, accelerometer, heart_rate data from the body
  const {
    gps_coordinates,
    accelerometer,
    heart_rate
  } = bodyData

  const user = getActor(auth_token)

  // Connect to the pool
  const client = await connect()
  try {
    await client.query('BEGIN')

    // Transform bodyData to an array
    const gpsArray = toQueryArray(user.id, gps_coordinates, 'gps_coordinates')
    const accArray = toQueryArray(user.id, accelerometer, 'accelerometer')
    const heartArray = toQueryArray(user.id, heart_rate, 'heart_rate')

    // Inserts into the tables every data received
    await client.query(format('INSERT INTO gps_coordinates(user_id, lat, long, timestamp) VALUES %L RETURNING *', gpsArray))
    await client.query(format('INSERT INTO accelerometer(user_id, timestamp, acc_x, acc_y, acc_z) VALUES %L RETURNING *', accArray))
    await client.query(format('INSERT INTO heart_rate(user_id, timestamp, bpm) VALUES %L RETURNING *', heartArray))

    await client.query('COMMIT')
    await client.release()

    await notifyCompanies(user.id)

    return {
      success: true,
      message: 'Sync successful'
    }

  } catch (err) {
    console.log('ERROR IN POST DATA')
    console.log(err)
    await client.query('ROLLBACK')
    await client.release()
    err.message = 'Invalid data'
    err.status = 422
    throw err
  }

}

/**
 * Notifies companies that updated data are available
 * @param userId
 * @returns {Promise<void>}
 */
async function notifyCompanies(userId) {

  const LAT_DEGREE = 110.57 // km
  const LONG_DEGREE = 111.32 // km


  // Connect to the database
  const client = await connect()

  try {

    // Look for all companies having a query on that individual
    let {
      rows: companies
    } = await client.query('SELECT ca.email ' +
      'FROM query_user as qu, query as q, company_account as ca ' +
      'WHERE qu.user_id = $1 AND qu.query_id = q.id AND q.company_id = ca.id', [userId])

    // Select all the queries in which the user could be, by position
    const lastPos = await getLastPosition(userId)

    // Those are the queries in which the user can now appear
    let {
      rows: queries
    } = await client.query(`SELECT rq.id, email FROM radius_query as rq, query as q, company_account as ca WHERE center_lat BETWEEN $1 - radius / ${LAT_DEGREE} AND $1 + radius / ${LAT_DEGREE} AND center_long BETWEEN $2 - radius / ${LONG_DEGREE} AND $1 + radius / ${LONG_DEGREE} `, [lastPos.lat, lastPos.long])

    queries.forEach(q => {
      if (companies.indexOf({ email: q.email }) === -1) companies.push({ email: q.email })
    })
    // Send an email to all of them
    companies.forEach(company => sendNotificationEmail(company.email))

    await client.release()

  } catch (err) {
    console.log(err)
    await client.release()
    throw err
  }

}

/**
 * Sends the notification email to the companies subscribing a query
 * @param email
 */
function sendNotificationEmail(email) {

  console.log('Sending mail to ' + email)

  const transporter = nm.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_ADDR,
      pass: process.env.MAIL_PASSWD
    }
  })

  const mailOptions = {
    from: process.env.MAIL_ADDR,
    to: email,
    subject: 'Data4Help, new data available',
    html: `<p>New data available for your query, download them on the website</p>`
  }

  transporter.sendMail(mailOptions, (err, info) => {
  })

}

/**
 * Allows the client to retrive its data from the database
 * @param userId: Integer
 * @param fromDate: Date
 * @param toDate: Date
 * @param isIndividualQuery: Boolean If this function is called in the context of an individual query
 * @returns {Promise<{data}>}
 */
async function getData(userId, fromDate = undefined, toDate = undefined, isIndividualQuery = false) {

  const client = await connect()

  let templateEnd = ''
  let paramsEnd = []
  let data = {}

  if (fromDate && toDate) {
    templateEnd = ' AND timestamp BETWEEN $2 AND $3'
    paramsEnd.push(fromDate, toDate)
  }
  try {

    await ['accelerometer', 'heart_rate', 'gps_coordinates'].forEachAsync(async (table) => {
      const {
        rows
      } = await client.query(`SELECT * FROM ${table} WHERE user_id = $1${templateEnd}`, [userId, ...paramsEnd])
      rows.forEach(r => {
        r.user_id = undefined
        r.id = undefined
      })
      data[table] = rows
    })
    await client.release()
    return {
      data
    }
  } catch (err) {
    await client.release()
    throw err
  }

}

/**
 * Allows to retrieve user info
 * @param token: String
 * @returns {Promise<{success: boolean, user: *}>}
 */
async function getUserInfo(token) {

  // Get the user_id
  const {
    id
  } = getActor(token)

  // Connect to the pool
  const client = await connect()

  try {

    const {
      rows
    } = await client.query('SELECT * FROM individual_account WHERE id = $1', [id])

    if (rows.length === 0) {
      let err = new Error('User not found')
      err.status = 404
      throw err
    }

    // Don't send internal id and password
    rows[0].id = undefined
    rows[0].password = undefined

    await client.release()

    return {
      success: true,
      user: rows[0]
    }

  } catch (err) {
    console.log(err)
    await client.release()
    throw err
  }

}

/**
 *
 * @param userId{number} The userid
 * @param el{JSON} The structure to unpack
 * @param type{string} The type of the data
 * @returns {Array}
 */
function toQueryArray(userId, el, type) {

  let template = []

  if (!userId || !el | !type) {
    let err = new Error('Bad formatting passed')
    err.status = 400
    throw err
  }

  el.forEach(e => {
    let elTemplate = [userId]
    requiredParams[type].forEach(p => elTemplate.push(e[p]))
    template.push(elTemplate)
  })

  return template

}

async function getLastPosition(id) {

  const client = await connect()

  try {

    const {
      rows
    } = await client.query('SELECT * FROM gps_coordinates WHERE user_id = $1 ORDER BY timestamp DESC', [id])

    let resp = {
      lat: -9999,
      long: -9999
    }

    if (rows.length !== 0) {
      resp.lat = rows[0].lat
      resp.long = rows[0].long
    }

    await client.release()

    return resp

  } catch (err) {
    console.log('in getLastPosition')
    console.log(err)
    await client.release()
    throw err
  }

}


module.exports = {
  saveData,
  getData,
  getUserInfo,
  getLastPosition,
  toQueryArray
}