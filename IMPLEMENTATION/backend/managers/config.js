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
// process.env.DATABASE_URL + '?ssl=true'
const pool = new Pool({
  connectionString: 'postgres://vznjmxsftdvpwi:e288b5dd0ea5c197b16c072d8804d5571b631e49edb1445f4e234f023aa6e4b6@ec2-54-246-90-194.eu-west-1.compute.amazonaws.com:5432/d8apiieo0cj827?ssl=true', /*process.env.DATABASE_URL || process.env.LOCAL_DATABASE_URL,*/
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