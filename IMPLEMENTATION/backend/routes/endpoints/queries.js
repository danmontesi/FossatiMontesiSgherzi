const express = require('express')
const queryRouter = express.Router()

const QUERY_POST = require('../../__runtime_tests__/stub_endpoint/queries/query_POST')
const QUERY_GET = require('../../__runtime_tests__/stub_endpoint/queries/query_GET')

const {
  isTestEnabled
} = require('../../utils/testUtils')

const QueryManager = require('../../managers/query/QueriesManager')

queryRouter.post('/query',async (req, res, next) => {

  new QueryManager(req.body).createQuery()

  const action = isTestEnabled(req)
  if (action) {
    res
      .status(QUERY_POST[action].status)
      .send(QUERY_POST[action])
    return
  }
  // TODO: Implement
})

queryRouter.get('/query', (req, res, next) => {
  const action = isTestEnabled(req)
  if (action) {
    res
      .status(QUERY_GET[action].status)
      .send(QUERY_GET[action])
    return
  }
  // TODO: Implement
})
module.exports = queryRouter