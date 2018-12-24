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

const loginTemplate = require('../../__TEST__/stub_endpoint/auth/login')
const registerCompany = require('../../__TEST__/stub_endpoint/auth/register_company')
const registerRunOrganizer = require('../../__TEST__/stub_endpoint/auth/register_run_organizer')
const registerUser = require('../../__TEST__/stub_endpoint/auth/register_user')
const verify = require('../../__TEST__/stub_endpoint/auth/verify')
const {
  isTestEnabled
} = require('../../utils/testUtils')

const IndividualsManager = require('../../utils/managers/Individuals/IndividualsManager')

/*
authRouter.get('/user', (req, res, next) => {
  res.send(JSON.stringify({
    status: 200,
    message: 'Hit /auth/user',
  }));
})*/

authRouter.post('/login', (req, res, next) => {
  const action = isTestEnabled(req)
  if (action) {
    res
      .status(loginTemplate[action].status)
      .send(loginTemplate[action])
    return
  }
  // TODO: Implement
})

authRouter.post('/register_user', async (req, res, next) => {

  /*const action = isTestEnabled(req)
  if (action) {
    res
      .status(registerUser[action].status)
      .send(registerUser[action])
    return
  }*/
  // TODO: Implement
  /*try {
    const client = await authPool.connect()
    console.log('Client connected')
    client.release()
  } catch (err) {
    console.log(err)
  }*/
  try {
    const user = new IndividualsManager(req.body)
    if (user.checkValidRegParams()) {
      let response = await user.register()
      res.status(status).send({
        ok: 'OK'
      })
    }
  } catch (err) {
    next(err)
  }
})

authRouter.post('/register_company', (req, res, next) => {

  const action = isTestEnabled(req)
  if (action) {
    res
      .status(registerCompany[action].status)
      .send(registerCompany[action])
    return
  }
  // TODO: Implement
})


authRouter.post('/register_run_organizer', (req, res, next) => {

  const action = isTestEnabled(req)
  if (action) {
    res
      .status(registerRunOrganizer[action].status)
      .send(registerRunOrganizer[action])
    return
  }
  // TODO: Implement
})


authRouter.post('/verify', (req, res, next) => {

  const action = isTestEnabled(req)
  if (action) {
    res
      .status(verify[action].status)
      .send(verify[action])
    return
  }
  // TODO: Implement
})

module.exports = authRouter

