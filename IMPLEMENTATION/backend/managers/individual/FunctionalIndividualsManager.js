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

  // Connect to the pool
  const client = await connect()

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

    // TODO: NOTIFY COMPANIES
    return {
      success: true,
      message: 'Sync successful'
    }

  } catch (err) {
    console.log(err)
    await client.query('ROLLBACK')
    await client.release()
    err.message = 'Invalid data'
    err.status = 422
    throw err
  }

}

module.exports = {
  saveData
}