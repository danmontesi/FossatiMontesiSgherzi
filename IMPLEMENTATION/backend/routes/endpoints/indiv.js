const { getActor } = require('../../managers/token/TokenManager')

const express = require('express')
const indivRouter = express.Router()

const {
  saveData,
  getData,
  getUserInfo
} = require('../../managers/individual/IndividualsManager')

const {
  authorizationMiddleware
} = require('../../managers/token/TokenManager')

indivRouter.use(authorizationMiddleware('individual'))

/**
 * METHOD: POST
 * ENDPOINT: /indiv/data
 * Tries to save user data in the database
 *
 * SUCCESS RESPONSE BODY:
 *  {
 *    success: true,
 *    message: 'Sync successful'
 *  }
 *
 *  FAILURE RESPONSE BODY:
 *  {
 *    status: ...status code
 *    message: message
 *  }
 * RESPONSE STATUS:
 *  200: Post successful
 *  422: Invalid data
 *  500: An generic error occurred
 */
indivRouter.post('/data', async (req, res, next) => {
  try {
    let message = await saveData(req.body.auth_token, req.body.data)
    res.status(200).send(message)
  } catch (err) {
    next(err)
  }
})

/**
 * METHOD: GET
 * ENDPOINT: /indiv/data
 * Tries to retrive user data from the database
 *
 * SUCCESS RESPONSE BODY:
 *  {
 *    success: true,
 *    data: ...data
 *  }
 *
 *  FAILURE RESPONSE BODY:
 *  {
 *    status: status_code
 *    message: message
 *  }
 * RESPONSE STATUS:
 *  200: Get successful
 *  500: An generic error occurred
 */
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

/**
 * METHOD: GET
 * ENDPOINT: /indiv/user
 * Tries to save user info from the database
 *
 * SUCCESS RESPONSE BODY:
 *  {
 *    success: true,
 *    user: ...user
 *  }
 *
 *  FAILURE RESPONSE BODY:
 *  {
 *    status: status_code
 *    message: message
 *  }
 * RESPONSE STATUS:
 *  200: Get successful
 *  404: User not found
 *  500: An generic error occurred
 */
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

