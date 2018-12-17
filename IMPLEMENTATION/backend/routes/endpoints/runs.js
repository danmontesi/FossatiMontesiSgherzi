const express = require('express')
const runsRouter = express.Router()

const JOIN = require('../../__TEST__/stub_endpoint/runs/join')
const POSITIONS = require('../../__TEST__/stub_endpoint/runs/positions')
const ROOT = require('../../__TEST__/stub_endpoint/runs/root')
const RUN = require('../../__TEST__/stub_endpoint/runs/run')

const {
  isTestEnabled
} = require('../../utils/testUtils')

runsRouter.get('/', (req, res, next) => {
  const action = isTestEnabled(req)
  if (action) {
    res
      .status(ROOT[action].status)
      .send(ROOT[action])
    return
  }
  // TODO: Implement
})

runsRouter.post('/positions', (req, res, next) => {
  const action = isTestEnabled(req)
  if (action) {
    res
      .status(POSITIONS[action].status)
      .send(POSITIONS[action])
    return
  }
  // TODO: Implement
})

runsRouter.post('/join', (req, res, next) => {
  const action = isTestEnabled(req)
  if (action) {
    res
      .status(JOIN[action].status)
      .send(JOIN[action])
    return
  }
  // TODO: Implement
})

runsRouter.post('/run', (req, res, next) => {
  const action = isTestEnabled(req)
  if (action) {
    res
      .status(RUN[action].status)
      .send(RUN[action])
    return
  }
  // TODO: Implement
})


module.exports = runsRouter