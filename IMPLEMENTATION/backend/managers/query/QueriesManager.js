const requiredParams = require('./requiredParameters')
const templateQueries = require('./templateQueries')
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
			return {
				success: true,
				queries: totalQueries
			}

		} catch (err) {
			await client.query('ROLLBACK')
			await client.release()
		}
	}

	_toQueryArray(params) {
		let template = params.map(param => this.query[param])
		return template
	}
}

module.exports = QueriesManager