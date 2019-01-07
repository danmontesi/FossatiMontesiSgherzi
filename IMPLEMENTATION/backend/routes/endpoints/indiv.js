const express = require('express')
const indivRouter = express.Router()

const {
  saveData,
  getData
} = require('../../managers/individual/FunctionalIndividualsManager')

const IndividualsManager = require('../../managers/individual/IndividualsManager')
const {
  authorizationMiddleware
} = require('../../managers/token/TokenManager')

indivRouter.use(authorizationMiddleware('individual'))

indivRouter.post('/data', async (req, res, next) => {
  try {
    console.log('here')
    let message = await saveData(req.body.auth_token, req.body.data)
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

indivRouter.get('/user', async (req, res, next) => {

  try {
    const user = await IndividualsManager.getUserData(req.query.auth_token)
    res
      .status(200)
      .send(user)
  } catch (err) {
    next(err)
  }

})

module.exports = indivRouter

