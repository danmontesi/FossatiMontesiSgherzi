const express = require('express')
const queryRouter = express.Router()
const {
  authorizationMiddleware,
  getActor
} = require('../../managers/token/TokenManager')

const {
  checkQueryParams,
  createQuery,
  retriveQueries,
  performQueryById,
  fetchPendingIndividualRequests,
  confirmRequest
} = require('../../managers/query/QueriesManager')

/**
 * METHOD: POST
 * ENDPOINT: /queries/query
 * Tries to post a query for the given company in the database
 *
 * SUCCESS RESPONSE BODY:
 *  {
 *    success: true,
 *    message: 'Query posted successfully',
 *    query_id: ...query_id
 *  }
 *
 *  FAILURE RESPONSE BODY:
 *  {
 *    status: status_code
 *    message: message
 *  }
 * RESPONSE STATUS:
 *  200: Post successful
 *  400: Missing parameters in query | Missing query in body
 *  422: Query too restrictive
 *  500: An generic error occurred
 */
queryRouter.post('/query', authorizationMiddleware('company'), async (req, res, next) => {

  try {
    checkQueryParams(req.body.query)
    const response = await createQuery(getActor(req.body.auth_token), req.body.query)
    res
      .status(200)
      .send(response)
  } catch (err) {
    next(err)
  }

})

/**
 * METHOD: GET
 * ENDPOINT: /queries/query
 * Tries to retrieve all the queries that a company has posted to the database
 *
 * SUCCESS RESPONSE BODY:
 *  {
 *    success: true,
 *    queries: ...allQueries
 *  }
 *
 *  FAILURE RESPONSE BODY:
 *  {
 *    status: status_code
 *    message: message
 *  }
 * RESPONSE STATUS:
 *  200: Post successful
 *  500: An generic error occurred
 */
queryRouter.get('/query', authorizationMiddleware('company'), async (req, res, next) => {
  try {
    console.log(req.body)
    const response = await retriveQueries(getActor(req.query.auth_token))
    res
      .status(200)
      .send(response)
  } catch (err) {
    next(err)
  }
})

/**
 * METHOD: GET
 * ENDPOINT: /queries/query/data
 * Performs the give query
 *
 * SUCCESS RESPONSE BODY:
 *  {
 *    success: true,
 *    data: ...allData
 *  }
 *
 *  FAILURE RESPONSE BODY:
 *  {
 *    status: status_code
 *    message: message
 *  }
 *
 * RESPONSE STATUS:
 *  200: Get successful
 *  404: Query not found
 *  422: Query too restrictive
 *  500: An generic error occurred
 */
queryRouter.get('/query/data', authorizationMiddleware('company'), async (req, res, next) => {
  try {

    let response = {}

    const {
      userList,
      allData
    } = await performQueryById(req.query.query_id)

    if (userList && allData.length > 0) {
      response.success = true
      response.data = allData[0].data
      // If it is an individual query, add the user id to the response
      if (userList.length === 1) response.user = userList[0]

      res
        .status(200)
        .send(response)
    }
  } catch (err) {
    console.log(err.stack)
    next(err)
  }
})

/**
 * METHOD: GET
 * ENDPOINT: /queries/individual/pending
 * Tries to retrieve all individual queries the user hasn't answered
 *
 * SUCCESS RESPONSE BODY:
 *  {
 *    success: true,
 *    data: ...allData
 *  }
 *
 *  FAILURE RESPONSE BODY:
 *  {
 *    status: status_code
 *    message: message
 *  }
 *
 * RESPONSE STATUS:
 *  200: Get successful
 *  500: An generic error occurred
 */
queryRouter.get('/query/individual/pending', authorizationMiddleware('individual'), async (req, res, next) => {
  try {
    const response = await fetchPendingIndividualRequests(getActor(req.query.auth_token).id)
    res
      .status(200)
      .send(response)
  } catch (err) {
    next(err)
  }
})

/**
 * METHOD: POST
 * ENDPOINT: /queries/individual/pending
 * Tries to retrieve all individual queries the user hasn't answered
 *
 * SUCCESS RESPONSE BODY:
 *  {
 *    success: true,
 *    message: 'Response saved'
 *  }
 *
 *  FAILURE RESPONSE BODY:
 *  {
 *    status: status_code
 *    message: message
 *  }
 *
 * RESPONSE STATUS:
 *  200: Get successful
 *  404: Query not found
 *  500: An generic error occurred
 */
queryRouter.post('/query/individual/pending', authorizationMiddleware('individual'), async (req, res, next) => {
  try {
    const response = await confirmRequest(getActor(req.body.auth_token).id, req.body.query_id, req.body.decision)
    res
      .status(200)
      .send(response)
  } catch (err) {
    next(err)
  }
})

module.exports = queryRouter