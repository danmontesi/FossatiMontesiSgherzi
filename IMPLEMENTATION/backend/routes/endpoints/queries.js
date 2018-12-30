const express = require('express')
const queryRouter = express.Router()
const {
	authorizationMiddleware
} = require('../../managers/token/TokenManager')

const QueryManager = require('../../managers/query/QueriesManager')

queryRouter.use(authorizationMiddleware('company'))

queryRouter.post('/query', async (req, res, next) => {

	if (await QueryManager.isCompany(req.body.auth_token)) {
		let client = new QueryManager(req.body)
		let response = await client.createQuery()
		res
		.status(200)
		.send(response)
	} else {
		let err = new Error('Unauthorized')
		err.status = 401
		next(err)
	}
})

queryRouter.get('/query', async (req, res, next) => {

	let client = new QueryManager(req.query)
	let response = await client.retriveQueries()
	res
	.status(200)
	.send({
		success: true,
		queries: response
	})
	// TODO: Implement
})
module.exports = queryRouter