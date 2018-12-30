const express = require('express')
const runsRouter = express.Router()
const RunManager = require('../../managers/runs/RunManager')
const {
	authorizationMiddleware,
	getActor
} = require('../../managers/token/TokenManager')

const JOIN = require('../../__runtime_tests__/stub_endpoint/runs/join')
const POSITIONS = require('../../__runtime_tests__/stub_endpoint/runs/positions')
const ROOT = require('../../__runtime_tests__/stub_endpoint/runs/root')
const RUN = require('../../__runtime_tests__/stub_endpoint/runs/run')

const {
	isTestEnabled
} = require('../../utils/testUtils')

runsRouter.get('/', authorizationMiddleware('individual'), async (req, res, next) => {
	const response = await RunManager.getAllRuns()
	res
	.status(200)
	.send(response)
})

runsRouter.post('/positions', authorizationMiddleware('individual'), (req, res, next) => {
	const action = isTestEnabled(req)
	if (action) {
		res
		.status(POSITIONS[action].status)
		.send(POSITIONS[action])
		return
	}
	// TODO: Implement
})

runsRouter.post('/join', authorizationMiddleware('individual'), async (req, res, next) => {
	try {
		const user = getActor(req.body.auth_token)
		const response = await RunManager.joinRun(req.body.run_id, user.id)
		res.status(200).send(response)
	} catch (err) {
		next(err)
	}
})

runsRouter.post('/run', authorizationMiddleware('run_organizer'), async (req, res, next) => {
	try {
		const run = new RunManager(req.body)
		const response = await run.createRun()
		res
		.status(200)
		.send(response)
	} catch (err) {
		next(err)
	}
})


module.exports = runsRouter