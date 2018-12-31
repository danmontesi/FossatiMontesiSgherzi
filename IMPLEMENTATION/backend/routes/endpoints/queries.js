const express = require('express')
const queryRouter = express.Router()
const {
	authorizationMiddleware
} = require('../../managers/token/TokenManager')

const QueryManager = require('../../managers/query/QueriesManager')

queryRouter.use(authorizationMiddleware('company'))

queryRouter.post('/query', async (req, res, next) => {
	let client = new QueryManager(req.body)
	let response = await client.createQuery()
	res
	.status(200)
	.send(response)

})

queryRouter.get('/query', async (req, res, next) => {
	let client = new QueryManager(req.query)
	let response = await client.retriveQueries()
	res
	.status(200)
	.send(response)
})
module.exports = queryRouter