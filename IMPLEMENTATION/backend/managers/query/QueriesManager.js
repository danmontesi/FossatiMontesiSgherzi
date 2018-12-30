const requiredParams = require('./requiredParameters')
const templateQueries = require('./templateQueries')
const jwt = require('jsonwebtoken')
const {
	getActor
} = require('../token/TokenManager')
const {
	Pool
} = require('pg')
// let queryTemplate = {
//   auth_token: "asdf",
//   query: {
//     type: "age|individual|region|city|radius",
//     min_age: 23,
//     max_age: 25
//   }
// }

// Until javascript decides to implement an async version of forEach...
Array.prototype.forEachAsync = async function(callback) {
	for (let i = 0; i < this.length; i++) {
		await callback(this[i], i)
	}
}


class QueriesManager {
	constructor(reqBody) {
		this.queryPool = new Pool({
			connectionString: process.env.DATABASE_URL + '?ssl=true',
			max: 5
		})

		if (reqBody.auth_token) {
			try {
				this.company = getActor(reqBody.auth_token)
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

		if (reqBody.query && reqBody.query.type) {
			const { query } = reqBody
			const { type } = query

			requiredParams[type].forEach(param => {
				if (!(param in query)) {
					let err = new Error(`Missing ${ param }`)
					err.status = 400
					throw err
				}
			})
			this.query = query
		}
	}

	async createQuery() {
		const client = await this.queryPool.connect()

		try {
			await client.query('BEGIN')
			// Create a new query in the Global Table => query
			const {
				rows: globalQuery
			} = await client.query('INSERT INTO query(company_id, date_generation, valid, query_type) VALUES($1, $2, $3, $4) RETURNING *', [this.company.id, new Date(), false, this.query.type])
			const {
				id: queryId,
				query_type: queryType
			} = globalQuery[0]
			// Now I need to create a query in the proper table
			const {
				insert_query: insertTemplate,
				params
			} = templateQueries[queryType]
			console.log(templateQueries[queryType])
			await client.query(insertTemplate, [queryId, ...this._toQueryArray(params)])

			await client.query('COMMIT')
			await client.release()

			return {
				success: true,
				message: 'Query successfully posted'
			}

		} catch (err) {
			await client.query('ROLLBACK')
			await client.release()
			throw err
		}

	}

	async retriveQueries() {
		const client = await this.queryPool.connect()
		try {
			await client.query('BEGIN')
			let totalQueries = {}

			const {
				rows: companyQueries
			} = await client.query('SELECT * FROM query WHERE company_id = $1', [this.company.id])

			await companyQueries.forEachAsync(async (query) => {
				const {
					rows
				} = await client.query(`SELECT * FROM ${ query.query_type }_query WHERE id = $1`, [query.id])
				totalQueries[query.query_type] = rows
			})

			Object.keys(totalQueries).forEach(key => {
				totalQueries[key].forEach(q => {
					q.id = undefined
				})
			})
			return totalQueries

		} catch (err) {
			await client.query('ROLLBACK')
			await client.release()
		}
	}

	_toQueryArray(params) {
		let template = params.map(param => this.query[param])
		return template
	}

	static async isCompany(authToken) {
	console.log("called isCompany")
		const client = await new Pool({
			connectionString: process.env.DATABASE_URL + '?ssl=true',
			max: 5
		}).connect()

		try {
			let company = jwt.decode(authToken, process.env.JWT_SECRET)
			const {
				rows
			} = await client.query("SELECT * FROM company_account WHERE id = $1", [company.id])
			console.log("--------------------------------")
			console.log(rows)
			console.log("--------------------------------")
			return rows.length >= 1;
		} catch (err) {
		console.log(err)
			err.message = 'Token is invalid'
			err.status = 400
			throw err
		}
	}

}

module.exports = QueriesManager