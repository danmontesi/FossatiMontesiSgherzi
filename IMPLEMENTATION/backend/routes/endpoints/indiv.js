const { getActor } = require('../../managers/token/TokenManager')

const express = require('express')
const indivRouter = express.Router()

const {
  saveData,
  getData,
  getUserInfo
} = require('../../managers/individual/FunctionalIndividualsManager')

const IndividualsManager = require('../../managers/individual/IndividualsManager')
const {
  authorizationMiddleware
} = require('../../managers/token/TokenManager')

indivRouter.use(authorizationMiddleware('individual'))

indivRouter.post('/data', async (req, res, next) => {
  try {
    let message = await saveData(req.body.auth_token, req.body.data)
    res.status(200).send(message)
  } catch (err) {
    console.log(err)
    next(err)
  }

})

indivRouter.get('/data', async (req, res, next) => {
  try {

    if (!req.query.begin_date || !req.query.end_date) {
      let err = new Error('Missing params')
      err.status = 422
      throw err
    }

    const message = await getData(getActor(req.query.auth_token).id, req.query.begin_date, req.query.end_date)

    res.status(200).send({
      success: true,
      data: message.data
    })
  } catch (err) {
    console.log(err)
    next(err)
  }
})

indivRouter.get('/user', async (req, res, next) => {
  try {
    const user = await getUserInfo(req.query.auth_token)
    res
      .status(200)
      .send(user)
  } catch (err) {
    next(err)
  }
})

module.exports = indivRouter

