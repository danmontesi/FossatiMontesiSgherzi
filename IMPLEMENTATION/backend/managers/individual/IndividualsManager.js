const jwt = require('jsonwebtoken')
const {
  Pool
} = require('pg')
const nm = require('nodemailer')
const {
  getActor
} = require('../../managers/token/TokenManager')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL + '?ssl=true',
  max: 5
})

class IndividualsManager {

  constructor(reqBody) {
    this.indivPool = new Pool({
      connectionString: process.env.DATABASE_URL + '?ssl=true',
      max: 5
    })

    if (reqBody.auth_token) {
      try {
        this.user = jwt.decode(reqBody.auth_token, process.env.JWT_SECRET)
      } catch (err) {
        err.message = 'Token is invalid'
        err.status = 400
        throw err
      }
    } else {
      let err = new Error('Missing Token')
      err.status = 422
      throw err
    }

    if (!reqBody.data) {
      if ((!reqBody.begin_date || !reqBody.end_date)) {
        let err = new Error('Missing parameters in date')
        err.status = 400
        throw err
      }
    } else {
      this.data = reqBody.data
    }

    try {
      this.date = {}
      this.date.from = new Date(reqBody.begin_date)
      this.date.to = new Date(reqBody.end_date)
    } catch (err) {
      err.message = 'Invalid date format, required ISO-8601'
      throw err
    }

  }

  async saveData() {
    const client = await this.indivPool.connect()

    if (typeof this.data == 'string') {
      this.data = JSON.parse(this.data)
    }

    const {
      gps_coordinates,
      accelerometer,
      heart_rate
    } = this.data

    try {
      await client.query('BEGIN')
      gps_coordinates.forEachAsync(async (coordinate) => {
        client.query('INSERT INTO gps_coordinates(user_id, timestamp, lat, long) VALUES($1, $2, $3, $4) RETURNING *', [this.user.id, coordinate.timestamp, coordinate.lat, coordinate.long])
      })

      accelerometer.forEachAsync(async (accData) => {
        client.query('INSERT INTO accelerometer(user_id, timestamp, acc_x, acc_y, acc_z) VALUES($1, $2, $3, $4, $5) RETURNING *', [this.user.id, accData.timestamp, accData.acc_x, accData.acc_y, accData.acc_z])
      })

      heart_rate.forEachAsync(async (heartData) => {
        client.query('INSERT INTO heart_rate(user_id, timestamp, bpm) VALUES($1, $2, $3) RETURNING *', [this.user.id, heartData.timestamp, heartData.bpm])
      })

      await client.query('COMMIT')
      await client.release()
      await IndividualsManager.notifyCompanies(this.user.id)

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

  static sendNotificationEmail(mail) {
    console.log('Sending mail to ' + mail)

    const transporter = nm.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_ADDR,
        pass: process.env.MAIL_PASSWD
      }
    })

    const mailOptions = {
      from: process.env.MAIL_ADDR,
      to: mail,
      subject: 'Data4Help, new data available',
      html: `<p>New data available for your query, download them on the website</p>`
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) throw error
    })
  }

  static async notifyCompanies(userId) {
    const client = await IndividualsManager.connect()
    try {
      const {
        rows: companies
      } = await client.query('SELECT ca.email ' +
        'FROM query_user as qu, query as q, company_account as ca ' +
        'WHERE qu.user_id = $1 AND qu.query_id = q.id AND q.company_id = ca.id', [userId])
      companies.forEach(company => IndividualsManager.sendNotificationEmail(company.email))
      await client.release()
    } catch (err) {
      await client.release()
      console.log(err)
      throw err
    }

  }

  async getData() {
    const client = await this.indivPool.connect()

    const {
      rows: accData
    } = await client.query('SELECT * FROM accelerometer WHERE user_id = $1 AND timestamp BETWEEN $2 AND $3', [this.user.id, this.date.from, this.date.to])
    accData.forEach(el => {
      el.user_id = undefined
      el.id = undefined
    })

    const {
      rows: heartData
    } = await client.query('SELECT * FROM heart_rate WHERE user_id = $1 AND timestamp BETWEEN $2 AND $3', [this.user.id, this.date.from, this.date.to])
    heartData.forEach(el => {
      el.user_id = undefined
      el.id = undefined
    })

    const {
      rows: gpsData
    } = await client.query('SELECT * FROM gps_coordinates WHERE user_id = $1 AND timestamp BETWEEN $2 AND $3', [this.user.id, this.date.from, this.date.to])
    gpsData.forEach(el => {
      el.user_id = undefined
      el.id = undefined
    })

    return {
      success: true,
      data: {
        accelerometer: accData,
        heart_rate: heartData,
        gps_coordinates: gpsData
      }
    }
  }

  static async connect() {
    return await pool.connect()
  }

  static async FPgetData(userId, fromDate = undefined, toDate = undefined) {

    const client = await IndividualsManager.connect()

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

  static async getLastPosition(id) {

    const client = await new Pool({
      connectionString: process.env.DATABASE_URL + '?ssl=true',
      max: 5
    }).connect()

    try {

      const {
        rows
      } = await client.query('SELECT * FROM gps_coordinates WHERE user_id = $1 ORDER BY timestamp DESC', [id])

      if (rows.length === 0) {
        let err = new Error(`User hasn't send any position`)
        err.status = 404
        throw err
      }

      return {
        lat: rows[0].lat,
        long: rows[0].long
      }

    } catch (err) {
      await client.release()
      throw err
    }

  }

  static async getUserData(token) {
    const {
      id
    } = getActor(token)
    const client = await new Pool({
      connectionString: process.env.DATABASE_URL + '?ssl=true',
      max: 5
    }).connect()
    try {
      const {
        rows
      } = await client.query('SELECT * FROM individual_account WHERE id = $1', [id])

      if (rows.length === 0) {
        let err = new Error('User not found')
        err.status = 404
        throw err
      }

      rows[0].id = undefined
      rows[0].password = undefined

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

}

module.exports = IndividualsManager