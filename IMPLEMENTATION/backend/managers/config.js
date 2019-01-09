/**
 * Dependency Import
 */
const { Pool } = require('pg')

/**
 * Minimum number of user required to allow the query
 * @type {number}
 */
const MIN_USER_NUMBER = 2

/**
 * Create a connection pool for the database
 * @type {PG.Pool}
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL + '?ssl=true',
  max: 4 // PLEASE KEEP THIS NUMBER UNDER 10, THIS IS A LIMITATION OF POSTGRES FREE TIER ON HEROKU
})

/**
 * Connects to the database
 * @returns {Promise<Client>}
 */
async function connect() {
  return await pool.connect()
}

module.exports = {
  MIN_USER_NUMBER,
  connect
}