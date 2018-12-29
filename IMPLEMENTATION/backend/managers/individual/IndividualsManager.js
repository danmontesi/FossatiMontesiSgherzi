const jwt = require('jsonwebtoken')
const {
  Pool
} = require('pg')

// Until javascript decides to implement an async version of forEach...
Array.prototype.forEachAsync = async function (callback) {
  for (let i = 0; i < this.length; i++) {
    await callback(this[i], i)
  }
}

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

    if ((!reqBody.begin_date || !reqBody.end_date)) {
      let err = new Error('Missing parameters in date')
      err.status = 400
      throw err
    }

    try {
      this.date = {}
      this.date.from = new Date(reqBody.begin_date)
      this.date.to = new Date(reqBody.end_date)
    } catch (err) {
      err.message = 'Invalid date format, required ISO-8601'
      throw err
    }

    if (reqBody.data) this.data = reqBody.data
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
      gps_coordinates.forEachAsync(async (coordinate, i) => {
        client.query('INSERT INTO gps_coordinates(user_id, timestamp, lat, long) VALUES($1, $2, $3, $4) RETURNING *', [this.user.id, coordinate.timestamp, coordinate.lat, coordinate.long])
      })

      accelerometer.forEachAsync(async (accData, i) => {
        client.query('INSERT INTO accelerometer(user_id, timestamp, acc_x, acc_y, acc_z) VALUES($1, $2, $3, $4, $5) RETURNING *', [this.user.id, accData.timestamp, accData.acc_x, accData.acc_y, accData.acc_z])
      })

      heart_rate.forEachAsync(async (heartData, i) => {
        client.query('INSERT INTO heart_rate(user_id, timestamp, bpm) VALUES($1, $2, $3) RETURNING *', [this.user.id, heartData.timestamp, heartData.bpm])
      })

      await client.query('COMMIT')
      await client.release()

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

    console.log(accData)

    return {
      success: true,
      data: {
        accelerometer: accData,
        heart_rate: heartData,
        gps_coordinates: gpsData
      }
    }
  }
}

module.exports = IndividualsManager