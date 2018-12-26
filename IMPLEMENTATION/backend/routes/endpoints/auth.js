const express = require('express')
const authRouter = express.Router()
const {
  Pool
} = require('pg')

const DB_ADDR = process.env.DATABASE_URL + '?ssl=true'
const authPool = new Pool({
  connectionString: DB_ADDR,
  max: 5
})

const loginTemplate = require('../../__runtime_tests__/stub_endpoint/auth/login')
const registerCompany = require('../../__runtime_tests__/stub_endpoint/auth/register_company')
const registerRunOrganizer = require('../../__runtime_tests__/stub_endpoint/auth/register_run_organizer')
const registerUser = require('../../__runtime_tests__/stub_endpoint/auth/register_user')
const verify = require('../../__runtime_tests__/stub_endpoint/auth/verify')
const {
  isTestEnabled
} = require('../../utils/testUtils')

const IndividualsManager = require('../../managers/authentication/AuthenticationManager')

/*
authRouter.get('/user', (req, res, next) => {
  res.send(JSON.stringify({
    status: 200,
    message: 'Hit /auth/user',
  }));
})*/

authRouter.post('/login', async (req, res, next) => {
  /*const action = isTestEnabled(req)
  if (action) {
    res
      .status(loginTemplate[action].status)
      .send(loginTemplate[action])
    return
  }
  // TODO: Implement*/

  try {
    const user = new IndividualsManager(req.body, req.body.type, 'login')
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
    const user = new IndividualsManager(req.body)
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
    const company = new IndividualsManager(req.body, req.body.type, 'registration')
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
    const runOrganizer = new IndividualsManager(req.body, req.body.type, 'registration')
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
    let message = await IndividualsManager.verify(req.query.mail, req.query.code, req.query.type)
    res
      .status(200)
      .send(message)
  } catch (err) {
    console.log(err)
    throw err
  }
  /*const action = isTestEnabled(req)
  if (action) {
    res
      .status(verify[action].status)
      .send(verify[action])
    return
  }*/
  // TODO: Implement
})

module.exports = authRouter

