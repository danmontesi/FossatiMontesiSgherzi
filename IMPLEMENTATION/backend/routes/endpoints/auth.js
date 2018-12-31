const express = require('express')
const authRouter = express.Router()

const AuthenticationManager = require('../../managers/authentication/AuthenticationManager')

authRouter.post('/login', async (req, res, next) => {
  try {
    const user = new AuthenticationManager(req.body, req.body.type, 'login')
    const authToken = await user.login()
    res.status(200).send({
      status: 200,
      success: true,
      auth_token: authToken
    })
  } catch (err) {
    next(err)
  }

})

authRouter.post('/register_user', async (req, res, next) => {
  try {
    const user = new AuthenticationManager(req.body)
    user.checkValidRegParams()
    let auth_token = await user.register()
    res.status(200).send({
      status: 200,
      success: true,
      auth_token: auth_token
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
  /*
    const action = isTestEnabled(req)
    if (action) {
      res
        .status(registerRunOrganizer[action].status)
        .send(registerRunOrganizer[action])
      return
    }*/

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
    let message = await AuthenticationManager.verify(req.query.mail, req.query.code, req.query.type)
    res
      .status(200)
      .send(message)
  } catch (err) {
    console.log(err)
    throw err
  }
})

module.exports = authRouter

