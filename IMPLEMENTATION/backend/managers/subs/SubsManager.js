const jwt = require('jsonwebtoken')
const {
	Pool
} = require('pg')

async function getPlans() {
	const client = await new Pool({
		connectionString: process.env.DATABASE_URL + '?ssl=true',
		max: 5
	}).connect()

	const {
		rows
	} = await client.query("SELECT * FROM subscription_type")

	return {
		success: true,
		plans: rows
	}

}

module.exports = {
	getPlans
}