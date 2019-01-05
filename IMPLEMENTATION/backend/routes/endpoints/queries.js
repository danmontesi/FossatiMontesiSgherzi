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

queryRouter.get('/query', authorizationMiddleware('company'), async (req, res, next) => {
  try {
    const response = await retriveQueries(getActor(req.query.auth_token))
    res
      .status(200)
      .send(response)
  } catch (err) {
    next(err)
  }
})

queryRouter.get('/query/data', authorizationMiddleware('company'), async (req, res, next) => {
  try {
    const response = await performQueryById(req.query.query_id)
    res.status(200).send(response.allData)
  } catch (err) {
    next(err)
  }
})

queryRouter.get('/query/individual/pending', authorizationMiddleware('individual'), async (req, res, next) => {
  console.log('here')
  try {
    const response = await fetchPendingIndividualRequests(getActor(req.query.auth_token).id)
    res
      .status(200)
      .send(response)
  } catch (err) {
    next(err)
  }
})

queryRouter.post('/query/individual/pending', authorizationMiddleware('individual'), async (req, res, next) => {
  try {
    const response = await confirmRequest(req.body.query_id, req.body.decision)
    res
      .status(200)
      .send(response)
  } catch (err) {
    next(err)
  }
})

module.exports = queryRouter