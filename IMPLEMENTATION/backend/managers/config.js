/**
 * Dependency Import
 */
const { Pool } = require('pg')


const MIN_USER_NUMBER = 0

/**
 * Create a connection pool for the database
 * @type {PG.Pool}
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL + '?ssl=true',
  max: 10
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