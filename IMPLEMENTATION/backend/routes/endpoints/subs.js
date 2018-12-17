const express = require('express')
const subsRouter = express.Router()

const PLAN_GET = require('../../__TEST__/stub_endpoint/subs/plan_GET')
const PLAN_POST = require('../../__TEST__/stub_endpoint/subs/plan_POST')

const {
  isTestEnabled
} = require('../../utils/testUtils')

subsRouter.get('/plan', (req, res, next) => {
  const action = isTestEnabled(req)
  if (action) {
    res
      .status(PLAN_GET[action].status)
      .send(PLAN_GET[action])
    return
  }
  // TODO: Implement
})

subsRouter.post('/plan', (req, res, next) => {
  const action = isTestEnabled(req)
  if (action) {
    res
      .status(PLAN_POST[action].status)
      .send(PLAN_POST[action])
    return
  }
  // TODO: Implement
})

module.exports = subsRouter