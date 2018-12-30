const requiredParams = require('./requiredParameters')
const jwt = require('jsonwebtoken')
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
        this.company = jwt.decode(reqBody.auth_token, process.env.JWT_SECRET)
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
      const {query} = reqBody
      const {type} = query
      console.log(query)
      console.log(type)
      console.log(requiredParams[type])
      requiredParams[type].forEach(param => {
        console.log('examining ' + param)
        if (!(param in query)) {
          let err = new Error(`Missing ${param}`)
          err.status = 400
          throw err
        }
      })
      this.query = query
    } else {
      let err = new Error('Malformed query')
      err.status = 400
      throw err
    }
  }

  async createQuery() {
    const client = await this.queryPool.connect()

    try {
      await client.query('BEGIN')
      // Create a new query in the Global Table => query
      const {
        rows: globalQuery
      } = await client.query(`INSERT INTO query(company_id, date_generation, valid) VALUES($1, $2, $3) RETURNING *`, [this.company.id, new Date(), false])
      console.log(globalQuery)

      // Now i need to create a query in the proper table

    } catch (err) {
      console.log(err)
      throw err
    }

  }

}

module.exports = QueriesManager