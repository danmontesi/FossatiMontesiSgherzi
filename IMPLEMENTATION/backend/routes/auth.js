const express = require('express');
const authRouter = express.Router();

const loginTemplate = require('../__TEST__/stub_endpoint/auth/login')
const registerCompany = require('../__TEST__/stub_endpoint/auth/register_company')
const registerRunOrganizer = require('../__TEST__/stub_endpoint/auth/register_run_organizer')
const registerUser = require('../__TEST__/stub_endpoint/auth/register_user')
const verify = require('../__TEST__/stub_endpoint/auth/verify')
const {
  isTestEnabled
} = require('../utils/testUtils')

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

authRouter.get('/user', (req, res, next) => {
  res.send(JSON.stringify({
    status: 200,
    message: 'Hit /auth/user',
  }));
})

module.exports = authRouter

