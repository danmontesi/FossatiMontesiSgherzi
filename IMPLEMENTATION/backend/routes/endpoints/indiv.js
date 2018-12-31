const express = require('express')
const indivRouter = express.Router()
const IndividualsManager = require('../../managers/individual/IndividualsManager')
const {
  authorizationMiddleware
} = require("../../managers/token/TokenManager")

indivRouter.use(authorizationMiddleware('individual'))

indivRouter.post('/data', async (req, res, next) => {
  try {
    const user = new IndividualsManager(req.body)
    let message = await user.saveData()
    res.status(200).send(message)
  } catch (err) {
    next(err)
  }

})


indivRouter.get('/data', async (req, res, next) => {
  try {
    const user = new IndividualsManager(req.query)
    let message = await user.getData()
    res.status(200).send(message)
  } catch (err) {
    next(err)
  }
})

module.exports = indivRouter

