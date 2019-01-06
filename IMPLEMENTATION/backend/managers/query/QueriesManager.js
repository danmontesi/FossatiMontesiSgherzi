const requiredParams = require('./requiredParameters')
const templateQueries = require('./templateQueries')
const format = require('pg-format')

const {
  MIN_USER_NUMBER
} = require('./config')

const IndividualManager = require('../individual/IndividualsManager')

const {
  getActor
} = require('../token/TokenManager')
const {
  Pool
} = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL + '?ssl=true',
  max: 100
})

async function connect() {
  return await pool.connect()
}

async function createQuery(company, query) {
  const client = await connect()
  try {
    await client.query('BEGIN')


    // I have to perform the query at least once to fill the user_query table
    const {
      userList
    } = await performQuery(query)

    const {
      rows: globalQuery
    } = await client.query('INSERT INTO query(company_id, date_generation, valid, query_type) VALUES($1, $2, $3, $4) RETURNING *', [company.id, new Date(), true, query.type])

    const {
      insert_query: insertQuery,
      params
    } = templateQueries[query.type]

    const {
      rows: newQuery
    } = await client.query(insertQuery, [globalQuery[0].id, ...toQueryArray(query, params)])

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

function toQueryArray(query, params) {
  return params.map(param => query[param])
}

function checkQueryParams(query) {
  if (query && query.type) {
    const {type} = query
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

// {
//   query: {
//     additional_params:{
//       accelerometer: {
//         acc_x: []
//       }
//     ,
//       gps_coordinates: {
//         lat: []
//       }
//     ,
//       heart_rate: {
//         bpm: []
//       }
//     }
//   }
//
// }


async function performQuery(query) {

  const userList = await checkQuery(query)
  let allData = await Promise.all(userList.map(async (userId) => await IndividualManager.FPgetData(userId)))
  if (query && !query.additional_params.isEmpty()) {
    Object.keys(query.additional_params)
      .forEach(param => {
        Object.keys(query.additional_params[param])
          .forEach(value => {
            console.log(value)
            allData.forEach((userData, index) => {
              allData[index].data[param] = userData.data[param].filter(el => el[value] >= query.additional_params[param][value][0] && el[value] <= query.additional_params[param][value][1])
            })
          })
      })
  }

  if (query.type !== 'individual' && allData.length <= MIN_USER_NUMBER) {
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

async function performQueryById(queryId) {
  console.log('Called with queryid ' + queryId)
  const client = await connect()

  try {

    const {
      rows
    } = await client.query(
      'SELECT * ' +
      'FROM query WHERE id = $1', [queryId]
    )

    // rows[0].query_type
    const {
      rows: fullQuery
    } = await client.query(`SELECT * FROM ${rows[0].query_type}_query WHERE id = $1`, [queryId])
    console.log(fullQuery)

    await client.release()

    let query = fullQuery[0]
    query.type = rows[0].query_type

    return await performQuery(query)

  } catch (err) {
    console.log(err)
    await client.release()
    throw err
  }
}

async function updateUserList(userIds, queryId) {

  const client = await connect()

  try {
    await client.query('BEGIN')

    await client.query('DELETE FROM query_user WHERE query_id = $1', [queryId])
    const {
      rows
    } = await client.query(format('INSERT INTO query_user(user_id, query_id) VALUES %L RETURNING *', userIds.map(uid => [uid, queryId])))
    console.log(rows)
    await client.release()
  } catch (err) {
    await client.query('ROLLBACK')
    await client.release()
  }

}

async function checkQuery(query) {
  switch (query.type) {
    case 'individual':
      return await checkIndividualQuery(query)
    case 'regional':
      return await checkRegionalQuery(query)
    case 'radius':
      return await checkRadiusQuery(query)
  }
}

async function checkIndividualQuery(query) {
  const client = await connect()
  try {
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

async function checkRegionalQuery(query) {
}

async function checkRadiusQuery(query) {
  const LAT_DEGREE = 110.57 // km
  const LONG_DEGREE = 111.32 // km

  const client = await connect()

  try {
    const {
      rows: userList
    } = await client.query('SELECT user_id FROM gps_coordinates WHERE lat BETWEEN $1 AND $2 AND long BETWEEN $3 AND $4', [query.center_lat, query.center_lat + query.radius / LAT_DEGREE, query.center_long, query.center_long + query.radius / LONG_DEGREE])
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

async function retriveQueries(company) {
  const client = await connect()
  try {
    await client.query('BEGIN')
    let totalQueries = {}

    const {
      rows: companyQueries
    } = await client.query('SELECT * FROM query WHERE company_id = $1', [company.id])

    await companyQueries.forEachAsync(async (query) => {
      const {
        rows
      } = await client.query(`SELECT * FROM ${query.query_type}_query WHERE id = $1`, [query.id])
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

async function fetchPendingIndividualRequests(userId) {
  const client = await connect()
  try {
    const {
      rows
    } = await client.query('SELECT iq.id, ca.company_name FROM individual_query AS iq, individual_account as ia, query as q, company_account as ca WHERE ia.id = $1 AND ia.SSN = iq.ssn AND iq.auth IS NULL AND q.id = iq.id AND q.company_id = ca.id', [userId])
    console.log(rows)
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

async function confirmRequest(queryId, response) {

  const client = await connect()

  try {

    await client.query('BEGIN')

    const {
      rows
    } = await client.query('UPDATE individual_query SET auth = $1 WHERE id = $2 RETURNING *', [response, queryId])
    console.log(rows)
    await client.query('COMMIT')
    await client.release()

    return {
      success: true,
      message: 'Response saved'
    }

  } catch (err) {
    await client.release()
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