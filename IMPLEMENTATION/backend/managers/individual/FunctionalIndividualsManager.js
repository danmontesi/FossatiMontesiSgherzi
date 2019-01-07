/**
 * Dependency Import
 */
const jwt = require('jsonwebtoken')
const nm = require('nodemailer')
const { getActor } = require('../../managers/token/TokenManager')

/**
 * Import function that allows to connect to the pool
 * @returns Promise<Pg.Client>
 */
const {
  connect
} = require('../config')

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

    // Inserts into the tables every data received
    gps_coordinates.forEachAsync(async (coordinate) => {
      await client.query('INSERT INTO gps_coordinates(user_id, timestamp, lat, long) VALUES($1, $2, $3, $4) RETURNING *', [user.id, coordinate.timestamp, coordinate.lat, coordinate.long])
    })

    accelerometer.forEachAsync(async (accData) => {
      await client.query('INSERT INTO accelerometer(user_id, timestamp, acc_x, acc_y, acc_z) VALUES($1, $2, $3, $4, $5) RETURNING *', [user.id, accData.timestamp, accData.acc_x, accData.acc_y, accData.acc_z])
    })

    heart_rate.forEachAsync(async (heartData) => {
      await client.query('INSERT INTO heart_rate(user_id, timestamp, bpm) VALUES($1, $2, $3) RETURNING *', [user.id, heartData.timestamp, heartData.bpm])
    })

    await client.query('COMMIT')
    await client.release()

    // TODO: NOTIFY COMPANIES

    return {
      success: true,
      message: 'Sync successful'
    }

  } catch (err) {
    await client.query('ROLLBACK')
    await client.release()
    err.message = 'Invalid data'
    err.status = 422
    throw err
  }

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
 * Allows to retrive user info
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

module.exports = {
  saveData,
  getData,
  getUserInfo
}