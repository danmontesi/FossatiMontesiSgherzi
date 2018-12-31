const express = require('express')
const runsRouter = express.Router()
const {
	createRun,
	joinRun,
	getAllRuns,
	getRunParamsFromRequest,
	runPresenceMiddleware,
	getRunnersPosition,
	getPositionParametersFromRequest,
	setRunnerPositions
} = require('../../managers/runs/RunManager')
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
	const response = await getAllRuns()
	res
	.status(200)
	.send(response)
})

runsRouter.get('/positions', authorizationMiddleware('individual'), runPresenceMiddleware(), async (req, res, next) => {

	try {
		const response = await getRunnersPosition(req.query.run_id)
		res
		.status(200)
		.send(response)
	} catch(err){
		console.log("[ERROR /positions GET]")
		console.log(err)
		next(err)
	}
})

runsRouter.post('/positions', authorizationMiddleware('run_organizer'), runPresenceMiddleware(), async (req, res, next) => {

	try {
		const {
			runId,
			positions
		} = getPositionParametersFromRequest(req.body)

		const response = await setRunnerPositions(runId, positions)

		res
		.status(200)
		.send(response)

	} catch (err) {
		next(err)
	}

})

runsRouter.post('/join', authorizationMiddleware('individual'), async (req, res, next) => {
	try {
		const {
			id
		} = getActor(req.body.auth_token)
		const response = await joinRun(req.body.run_id, id)
		res.status(200).send(response)
	} catch (err) {
		next(err)
	}
})

runsRouter.post('/run', authorizationMiddleware('run_organizer'), async (req, res, next) => {
	try {
		const {
			authToken,
			startTime,
			endTime,
			description,
			path
		} = getRunParamsFromRequest(req.body)

		const runOrganizer = getActor(authToken)
		const response = await createRun(runOrganizer, startTime, endTime, description, path)

		res
		.status(200)
		.send(response)
	} catch (err) {
		next(err)
	}
})


module.exports = runsRouter