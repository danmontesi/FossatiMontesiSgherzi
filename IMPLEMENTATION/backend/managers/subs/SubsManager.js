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

async function getPlanByName(planName) {
  const client = await new Pool({
    connectionString: process.env.DATABASE_URL + '?ssl=true',
    max: 5
  }).connect()

  const {
    rows
  } = await client.query('SELECT * FROM subscription_type WHERE subscription_name = $1', [planName])

  return {
    success: true,
    plans: rows
  }

}

async function getPlans() {
  const client = await new Pool({
    connectionString: process.env.DATABASE_URL + '?ssl=true',
    max: 5
  }).connect()

  const {
    rows
  } = await client.query('SELECT * FROM subscription_type')

  return {
    success: true,
    plans: rows
  }
}

module.exports = {
  getPlanByName,
  getPlans
}