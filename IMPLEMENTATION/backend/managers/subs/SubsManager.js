const jwt = require('jsonwebtoken')
const {
  connect
} = require('../config')


async function getPlanByName(planName) {
  const client = await connect()

  const {
    rows
  } = await client.query('SELECT * FROM subscription_type WHERE subscription_name = $1', [planName])

  return {
    success: true,
    plans: rows
  }

}

async function getPlans() {
  const client = await connect()

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