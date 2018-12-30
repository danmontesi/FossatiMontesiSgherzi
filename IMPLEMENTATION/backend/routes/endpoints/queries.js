const express = require('express')
const queryRouter = express.Router()

const QUERY_POST = require('../../__runtime_tests__/stub_endpoint/queries/query_POST')
const QUERY_GET = require('../../__runtime_tests__/stub_endpoint/queries/query_GET')

const {
	isTestEnabled
} = require('../../utils/testUtils')

const QueryManager = require('../../managers/query/QueriesManager')

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
	.send({
		success: true,
		queries: response
	})
	// TODO: Implement
})
module.exports = queryRouter