const express = require('express')
const authRouter = express.Router()

const AuthenticationManager = require('../../managers/authentication/AuthenticationManager')
const {
  registerUser,
  verify,
  login
} = require('../../managers/authentication/FunctionalAuthenticationManager')


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

authRouter.post('/register_company', async (req, res, next) => {
  try {
    const company = new AuthenticationManager(req.body, 'company', 'registration')
    company.checkValidRegParams()
    let auth_token = await company.register()
    res.status(200).send({
      status: 200,
      success: true,
      auth_token: auth_token
    })
  } catch (err) {
    next(err)
  }
})


authRouter.post('/register_run_organizer', async (req, res, next) => {

  try {
    const runOrganizer = new AuthenticationManager(req.body, 'run_organizer', 'registration')
    runOrganizer.checkValidRegParams()
    let auth_token = await runOrganizer.register()
    res.status(200).send({
      status: 200,
      success: true,
      auth_token: auth_token
    })
  } catch (err) {
    next(err)
  }

})


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

