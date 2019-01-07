const express = require('express')
const authRouter = express.Router()

const {
  registerUser,
  registerCompany,
  registerRunOrganizer,
  verify,
  login
} = require('../../managers/authentication/AuthenticationManager')


/**
 * METHOD: POST
 * ENDPOINT: /auth/login
 * Tries to log in the actor if he posts the required parameters
 *
 * SUCCESS RESPONSE BODY:
 *  {
 *    success: true,
 *    auth_token: ...authToken
 *  }
 *
 *  FAILURE RESPONSE BODY:
 *  {
 *    status: ...status code
 *    message: message
 *  }
 * RESPONSE STATUS:
 *  200: User login successful
 *  403: Wrong username or password
 *  500: An error occurred
 */
authRouter.post('/login', async (req, res, next) => {
  try {
    // const user = new AuthenticationManager(req.body, req.body.type, 'login')
    const token = await login(req.body)
    // const authToken = await user.login()
    res.status(200).send({
      success: true,
      auth_token: token
    })
  } catch (err) {
    next(err)
  }
})

/**
 * METHOD: POST
 * ENDPOINT: /auth/register_user
 * Tries to registers an individual user if if the request's body has the required parameters
 *
 * SUCCESS RESPONSE BODY:
 *  {
 *    success: true,
 *    auth_token: ...authToken
 *  }
 *
 *  FAILURE RESPONSE BODY:
 *  {
 *    status: ...status code
 *    message: message
 *  }
 *
 * RESPONSE STATUS:
 *  200: Actor login successful
 *  403: Wrong username or password
 *  500: An error occurred
 */
authRouter.post('/register_user', async (req, res, next) => {
  try {
    // const user = new AuthenticationManager(req.body)
    // user.checkValidRegParams()
    // let auth_token = await user.register()
    const token = await registerUser(req.body)
    res.status(200).send({
      success: true,
      auth_token: token
    })
  } catch (err) {
    next(err)
  }
})

/**
 * METHOD: POST
 * ENDPOINT: /auth/register_company
 * Tries to registers a company if if the request's body has the required parameters
 *
 * SUCCESS RESPONSE BODY:
 *  {
 *    success: true,
 *    auth_token: ...authToken
 *  }
 *
 *  FAILURE RESPONSE BODY:
 *  {
 *    status: ...status code
 *    message: message
 *  }
 *
 * RESPONSE STATUS:
 *  200: Actor login successful
 *  403: Wrong username or password
 *  500: An error occurred
 */
authRouter.post('/register_company', async (req, res, next) => {
  try {
    // const company = new AuthenticationManager(req.body, 'company', 'registration')
    // company.checkValidRegParams()
    let auth_token = await registerCompany(req.body)
    res.status(200).send({
      status: 200,
      success: true,
      auth_token: auth_token
    })
  } catch (err) {
    next(err)
  }
})

/**
 * METHOD: POST
 * ENDPOINT: /auth/register_user
 * Tries to registers a run organizer if if the request's body has the required parameters
 *
 * SUCCESS RESPONSE BODY:
 *  {
 *    success: true,
 *    auth_token: ...authToken
 *  }
 *
 *  FAILURE RESPONSE BODY:
 *  {
 *    status: ...status code
 *    message: message
 *  }
 *
 * RESPONSE STATUS:
 *  200: Actor login successful
 *  403: Wrong username or password
 *  500: An error occurred
 */
authRouter.post('/register_run_organizer', async (req, res, next) => {

  try {
    // const runOrganizer = new AuthenticationManager(req.body, 'run_organizer', 'registration')
    // runOrganizer.checkValidRegParams()
    // let auth_token = await runOrganizer.register()
    const token = await registerRunOrganizer(req.body)
    res.status(200).send({
      success: true,
      auth_token: token
    })
  } catch (err) {
    next(err)
  }

})



/**
 * METHOD: GET
 * ENDPOINT: /auth/verify
 * Verifies the actor account
 *
 * SUCCESS RESPONSE BODY:
 *  {
 *    success: true,
 *    message: 'Account verified'
 *  }
 *
 *  FAILURE RESPONSE BODY:
 *  {
 *    status: ...status code
 *    message: message
 *  }
 * RESPONSE STATUS:
 *  200: Verification successful
 *  401: Code is invalid
 *  500: An error occurred
 */
authRouter.get('/verify', async (req, res, next) => {

  try {
    let message = await verify(req.query.mail, req.query.code, req.query.type)
    res
      .status(200)
      .send(message)
  } catch (err) {
    console.log(err)
    throw err
  }
})

module.exports = authRouter

