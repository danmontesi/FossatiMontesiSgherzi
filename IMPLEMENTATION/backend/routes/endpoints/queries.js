const express = require('express')
const queryRouter = express.Router()
const {
  authorizationMiddleware,
  getActor
} = require('../../managers/token/TokenManager')

const {
  checkQueryParams,
  createQuery,
  retriveQueries
} = require('../../managers/query/QueriesManager')


queryRouter.use(authorizationMiddleware('company'))

queryRouter.post('/query', async (req, res, next) => {

  try {
    checkQueryParams(req.body.query)
    const response = await createQuery(getActor(req.body.auth_token), req.body.query)
    res
      .status(200)
      .send(response)
  } catch (err) {
    next(err)
  }

})

queryRouter.get('/query', async (req, res, next) => {
  const response = await retriveQueries(getActor(req.query.auth_token))
  res
    .status(200)
    .send(response)
})
module.exports = queryRouter