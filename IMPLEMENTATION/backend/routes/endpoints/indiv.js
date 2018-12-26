const express = require('express')
const indivRouter = express.Router()
const IndividualsManager = require('../../managers/individual/IndividualsManager')

const DATA_GET = require('../../__runtime_tests__/stub_endpoint/indiv/data_GET')
const DATA_POST = require('../../__runtime_tests__/stub_endpoint/indiv/data_POST')

const {
  isTestEnabled
} = require('../../utils/testUtils')

indivRouter.post('/data', async (req, res, next) => {
  /*const action = isTestEnabled(req)
  if (action) {
    res
      .status(DATA_POST[action].status)
      .send(DATA_POST[action])
    return
  }
  // TODO: Implement*/
  try {
    const user = new IndividualsManager(req.body)
    let message = await user.saveData()
    res.status(200).send(message)
  } catch (err) {
    next(err)
  }

})


indivRouter.get('/data', async (req, res, next) => {
  /*const action = isTestEnabled(req)
  if (action) {
    res
      .status(DATA_GET[action].status)
      .send(DATA_GET[action])
    return
  }
  // TODO: Implement*/
  try {
    const user = new IndividualsManager(req.query)
    let message = await user.getData()
    res.status(200).send(message)
  } catch (err) {
    next(err)
  }
})

module.exports = indivRouter

