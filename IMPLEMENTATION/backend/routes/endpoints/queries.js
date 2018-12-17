const express = require('express')
const queryRouter = express.Router()

const QUERIES = require('../../__TEST__/stub_endpoint/queries/query')

const {
  isTestEnabled
} = require('../../utils/testUtils')

queryRouter.post('/query', (req, res, next) => {
  const action = isTestEnabled(req)
  if (action) {
    res
      .status(QUERIES[action].status)
      .send(QUERIES[action])
    return
  }
  // TODO: Implement
})

module.exports = queryRouter