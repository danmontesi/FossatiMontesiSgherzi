/**
 * Import to format of the queries
 * to allow multiple insertions
 */
const format = require('pg-format')

const {
  MIN_USER_NUMBER,
  connect
} = require('../config')

/**
 * Required parameters for the queries
 */
const requiredParams = require('./requiredParameters')
/**
 * Template insertion queries
 */
const templateQueries = require('./templateQueries')

const {
  getData
} = require('../individual/IndividualsManager')

/**
 * Creates a query for the given company
 * @param company: JSON The company issuing the query
 * @param query: JSON: The query to perform
 * @returns {Promise<{query_id: *, success: boolean, message: string}>}
 */
async function createQuery(company, query) {
  const client = await connect()
  try {

    await client.query('BEGIN')

    // I have to perform the query at least once to fill the user_query table
    const {
      userList
    } = await performQuery(query)
    console.log('User List')
    console.log(userList)
    // Insert the query into the general `query` database
    const {
      rows: globalQuery
    } = await client.query('INSERT INTO query(company_id, date_generation, valid, query_type) VALUES($1, $2, $3, $4) RETURNING *', [company.id, new Date(), true, query.type])

    const {
      insert_query: insertQuery,
      params
    } = templateQueries[query.type]


    // Insert the query into the specific `query` database
    await client.query(insertQuery, [globalQuery[0].id, ...toQueryArray(query, params)])

    // update user list in query_user
    await updateUserList(userList, globalQuery[0].id)

    await client.query('COMMIT')
    await client.release()

    return {
      success: true,
      message: 'Query successfully posted',
      query_id: globalQuery[0].id
    }

  } catch (err) {
    await client.query('ROLLBACK')
    await client.release()
    throw err
  }

}

/**
 * Formats the query to an array
 * @param query
 * @param params
 * @returns {Array[]}
 */
function toQueryArray(query, params) {
  return params.map(param => query[param])
}

/**
 * Check the existance of every needed parameter
 * in the selected query
 * @param query: JSON
 */
function checkQueryParams(query) {
  if (query && query.type) {
    const { type } = query
    requiredParams[type].forEach(param => {
      if (!(param in query)) {
        let err = new Error(`Missing ${param}`)
        err.status = 400
        throw err
      }
    })
  } else {
    let err = new Error('Missing query in body')
    err.status = 400
    throw err
  }
}

/**
 * Performs the given query
 * @param query: JSON
 * @returns {Promise<{allData: JSON[], userList: Int32Array}>}
 */
async function performQuery(query) {

  // SELECT * FROM query_user as qu, individual_account as ia, gps_coordinates as gc, heart_rate as hr, accelerometer as a WHERE ia.id = qu.user_id AND qu.query_id = $1 AND qu.user_id = gc.user_id AND qu.user_id = a.user_id AND qu.user_id = hr.user_id

  // Checks the query to see if the user number is still higher than MIN_USER_NUMBER
  const userList = await checkQuery(query)

  // Takes all user data
  let allData = await Promise.all(userList.map(async (userId) => await getData(userId)))
  console.log('ALL DATA')
  console.log(allData)
  // Applies query filters to the query
  if (query && !query.additional_params.isEmpty() && query.type !== 'individual') {

    // for every filter imposed by the query
    Object.keys(query.additional_params)
      .forEach(additional_param => {

          // for every element of the filter
          Object.keys(query.additional_params[additional_param])
            .forEach(p => {
              // Take the range of the filter
              let [min, max] = query.additional_params[additional_param][p]

              let i = allData.length
              while (i--) {
                let user = allData[i]
                if (user) {
                  let filtered = user.data[additional_param].filter(el => el[p] >= min && el[p] <= max)
                  // If none of the data respects the constraints
                  if (filtered.length === 0) allData.splice(i, 1)
                }
              }
            })
        }
      )
  }

// Additional feasibility check, after the application of the filters
  if (query.type !== 'individual' && allData.length < MIN_USER_NUMBER) {
    let err = new Error('Query too restrictive')
    err.status = 422
    throw err
  }

  console.log(allData)

  return {
    userList,
    allData
  }

}

/**
 * Retrives the query and then performs it
 * @param queryId: Number
 * @returns {Promise<{allData: JSON[], userList: Int32Array}>}
 */
async function performQueryById(queryId) {

  console.log('Called with queryid ' + queryId)

  const client = await connect()

  try {

    // Retreive the query
    const {
      rows
    } = await client.query(
      'SELECT * ' +
      'FROM query WHERE id = $1', [queryId]
    )

    if (rows.length === 0) {
      let err = new Error('Query not found')
      err.status = 404
      throw err
    }

    // Retreive the full query from the database
    const {
      rows: fullQuery
    } = await client.query(`SELECT * FROM ${rows[0].query_type}_query WHERE id = $1`, [queryId])

    let query = fullQuery[0]
    query.type = rows[0].query_type

    if (query.type === 'individual' && !query.auth) {
      let err = new Error('User hasn\'t allowed this query!')
      err.status = 403
      throw err
    } else {

      // Performs the query
      let data = await performQuery(query)

      // Release the client only after
      // waiting for the query to finish
      await client.release()

      return data
    }
  } catch (err) {
    await client.release()
    throw err
  }
}

/**
 * Updates the list of users in the given query
 * @param userIds: Number List of user
 * @param queryId: Number
 * @returns {Promise<void>}
 */
async function updateUserList(userIds, queryId) {

  // if the query is individual I put the user in the query_user database only if he approves
  if (userIds.length === 1) return

  console.log('Updating user List')
  const client = await connect()

  try {
    await client.query('BEGIN')

    // Deletes and replaces the user list for the given query
    await client.query('DELETE FROM query_user WHERE query_id = $1', [queryId])
    const {
      rows
    } = await client.query(format('INSERT INTO query_user(user_id, query_id) VALUES %L RETURNING *', userIds.map(uid => [uid, queryId])))

    await client.query('COMMIT')
    await client.release()

  } catch (err) {
    console.log(err)
    await client.query('ROLLBACK')
    await client.release()

  }

}

/**
 * Check feasibility of the given query
 * @param query
 * @returns {Promise<[]>}
 */
async function checkQuery(query) {
  switch (query.type) {
    case 'individual':
      return await checkIndividualQuery(query)
    case 'radius':
      return await checkRadiusQuery(query)
  }
}

/**
 * Check feasibility of the given individual query
 * @param query
 * @returns {Promise<[]>}
 */
async function checkIndividualQuery(query) {

  const client = await connect()
  try {

    // Look for the presence of the user, given the SSN
    const {
      rows: user
    } = await client.query('SELECT id FROM individual_account WHERE SSN = $1 LIMIT 1', [query.ssn])

    if (user.length === 0) {
      let err = new Error('User not found')
      err.status = 404
      throw err
    }

    await client.release()
    return [user[0].id]

  } catch (err) {
    await client.release()
    throw err
  }

}

/**
 * Check feasibility of the given radius query
 * @param query
 * @returns {Promise<[]>}
 */
async function checkRadiusQuery(query) {
  const LAT_DEGREE = 110.57 // km
  const LONG_DEGREE = 111.32 // km

  const client = await connect()

  try {

    // Check if there are a sufficent number of users
    const {
      rows: userList
    } = await client.query('SELECT DISTINCT user_id FROM gps_coordinates WHERE lat BETWEEN $1 AND $2 AND long BETWEEN $3 AND $4', [query.center_lat, query.center_lat + query.radius / LAT_DEGREE, query.center_long, query.center_long + query.radius / LONG_DEGREE])


    console.log(userList.length)

    if (userList.length < MIN_USER_NUMBER) {
      let err = new Error('Query too restrictive')
      err.status = 422
      throw err
    }

    await client.release()
    return userList.map(u => u.user_id)

  } catch (err) {
    await client.release()
    throw err
  }

}

/**
 * Allows a company to retrieve the id of its past queries
 * @param company: JSON
 * @returns {Promise<{success: boolean, queries}>}
 */
async function retriveQueries(company) {
  const client = await connect()
  try {
    await client.query('BEGIN')
    let totalQueries = {}

    // Select query from the general database
    const {
      rows: companyQueries
    } = await client.query('SELECT * FROM query WHERE company_id = $1', [company.id])

    // Select queries based on type
    await companyQueries.forEachAsync(async (query) => {
      const {
        rows
      } = await client.query(`SELECT * FROM ${query.query_type}_query WHERE id = $1 LIMIT 1`, [query.id])
      if (rows[0]) {
        if (!totalQueries[query.query_type]) totalQueries[query.query_type] = []
        totalQueries[query.query_type].push(rows[0])
      }
    })

    await client.release()

    return {
      success: true,
      queries: totalQueries
    }

  } catch (err) {
    await client.query('ROLLBACK')
    await client.release()
  }
}

/**
 * Allows the client to see all the individual monitoring requests on the given user
 * @param userId: Number
 * @returns {Promise<{success: boolean, queries}>}
 */
async function fetchPendingIndividualRequests(userId) {
  const client = await connect()
  try {

    // Select the pending requests
    const {
      rows
    } = await client.query('SELECT iq.id, ca.company_name FROM individual_query AS iq, individual_account as ia, query as q, company_account as ca WHERE ia.id = $1 AND ia.SSN = iq.ssn AND iq.auth IS NULL AND q.id = iq.id AND q.company_id = ca.id', [userId])

    await client.release()

    return {
      success: true,
      queries: rows
    }

  } catch (err) {
    await client.release()
    throw err
  }

}

/**
 * Allows the client to confirm a request for the given user
 * and the given query
 * @param userId: Number
 * @param queryId: Number
 * @param response
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function confirmRequest(userId, queryId, response) {

  const client = await connect()

  try {

    await client.query('BEGIN')

    // const {
    //   rows
    // } = await client.query(
    //   'SELECT * ' +
    //   'FROM individual_account as ia, individual_query as iq ' +
    //   'WHERE ia.id = $1 AND iq.id = $2 AND ia.ssn = iq.ssn', [userId, queryId]
    // )
    // console.log(rows)


    await client.query('UPDATE individual_query SET auth = $1 WHERE id = $2 RETURNING *', [response, queryId])

    if (response) {
      await client.query('INSERT INTO query_user(query_id, user_id) VALUES($1, $2) RETURNING *', [queryId, userId])
    }

    await client.query('COMMIT')
    await client.release()

    return {
      success: true,
      message: 'Response saved'
    }

  } catch (err) {
    console.log(err)
    await client.release()
    err.message = 'Query not found'
    err.status = 404
    throw err
  }

}

module.exports = {
  checkQueryParams,
  createQuery,
  retriveQueries,
  performQueryById,
  fetchPendingIndividualRequests,
  confirmRequest
}