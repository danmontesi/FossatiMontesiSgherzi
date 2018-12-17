const express = require('express');
const indivRouter = express.Router();

const DATA_GET = require('../../__TEST__/stub_endpoint/indiv/data_GET')
const DATA_POST = require('../../__TEST__/stub_endpoint/indiv/data_POST')

const {
  isTestEnabled
} = require('../../utils/testUtils')

indivRouter.post('/data', (req, res, next) => {
  const action = isTestEnabled(req)
  if (action) {
    res
      .status(DATA_POST[action].status)
      .send(DATA_POST[action])
    return
  }
  // TODO: Implement
})


indivRouter.get('/data', (req, res, next) => {
  const action = isTestEnabled(req)
  if (action) {
    res
      .status(DATA_GET[action].status)
      .send(DATA_GET[action])
    return
  }
  // TODO: Implement
})







module.exports = indivRouter

