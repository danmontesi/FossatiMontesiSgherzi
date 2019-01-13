/**
 * Dependency Import
 */
const { Pool } = require('pg')

/**
 * Minimum number of user required to allow the query
 * @type {number}
 */
const MIN_USER_NUMBER = process.env.MIN_USER_NUMBER

/**
 * Create a connection pool for the database
 * @type {PG.Pool}
 */
// process.env.DATABASE_URL + '?ssl=true'
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 100
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
