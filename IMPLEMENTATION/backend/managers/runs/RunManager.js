const {
	Pool
} = require('pg')

const {
	ACCEPTING_SUBSCRIPTION,
	RUN_STARTED,
	RUN_ENDED
} = require('./runStatus')

async function connect() {
	return await new Pool({
		connectionString: process.env.DATABASE_URL + '?ssl=true',
		max: 5
	}).connect()
}

async function createRun(runOrganizer, startTime, endTime, runDescription, path) {
	const client = await connect()

	try {
		const {
			rows
		} = await client.query('INSERT INTO run(organizer_id, start_time, end_time, status, description) VALUES($1, $2, $3, $4, $5) RETURNING *', [runOrganizer.id, startTime, endTime, ACCEPTING_SUBSCRIPTION, runDescription])
		path.forEachAsync(async (coord) => {
			await client.query('INSERT INTO run_check_point(run_id, lat, long, description) VALUES($1, $2, $3, $4) RETURNING *', [rows[0].id, coord.lat, coord.long, coord.description ? coord.description : ''])
		})
		await client.query('COMMIT')
		await client.release()

		return {
			success: true,
			run_id: rows[0].id
		}

	} catch (err) {
		await client.query('ROLLBACK')
		await client.release()
		console.log(err)
		throw err
	}

}

async function getAllRuns() {
	const client = await connect()
	const {
		rows: runs
	} = await client.query('SELECT * FROM run WHERE status = $1', [ACCEPTING_SUBSCRIPTION])

	await runs.forEachAsync(async (run) => {
		const {
			rows: runCoordinates
		} = await client.query('SELECT * FROM run_check_point WHERE run_id = $1', [run.id])
		runCoordinates.sort((c1, c2) => c1.id - c2.id)
		run.path = runCoordinates
	})
	return {
		success: true,
		runs: runs
	}

}

async function joinRun(runId, userId) {
	const client = await connect()

	await client.query('BEGIN')

	try {
		const {
			rows: runs
		} = await client.query('SELECT * FROM run WHERE id = $1', [runId])
		console.log(runs)
		if (runs.length !== 1) {
			let err = new Error('Non existing run')
			err.status = 404
			throw err
		}
		await client.query('INSERT INTO run_subscription(run_id, user_id, subscription_date) VALUES($1, $2, $3) RETURNING *', [runId, userId, new Date()])
		await client.query('COMMIT')
		await client.release()
		return {
			success: true,
			message: `Joined run ${ runId }`
		}


	} catch (err) {
		await client.query('ROLLBACK')
		await client.release()
		throw err
	}

}

function getRunParamsFromRequest(reqBody) {

	if (!reqBody.auth_token || !reqBody.time_begin || !reqBody.time_end || !reqBody.description || !reqBody.coordinates) {
		let err = new Error('Missing parameters')
		err.status = 400
		throw err
	}

	return {
		authToken: reqBody.auth_token,
		startTime: reqBody.time_begin,
		endTime: reqBody.time_end,
		description: reqBody.description,
		path: reqBody.coordinates
	}

}

async function getRunnersPosition(run_id) {
	const client = await connect()

	try {
		const {
			rows: runners
		} = await client.query('SELECT * FROM runner_position WHERE run_id = $1', [run_id])

		runners.forEach(r => r.run_id = undefined)

		await client.release()

		return {
			success: true,
			positions: runners
		}

	} catch (err) {
		await client.release()
		throw err
	}

}

// const reqBody = {
// 	run_id: 'runid',
// 	positions: [{
// 		runner: "runnerid",
// 		position: "position"
// 	}]
// }

function getPositionParametersFromRequest(reqBody) {
	if (!reqBody.run_id || !reqBody.positions || typeof reqBody.positions.forEach === 'undefined') {
		let err = new Error('Missing parameters')
		err.status = 400
		throw err
	}

	return {
		runId: reqBody.run_id,
		positions: reqBody.positions
	}

}

async function runnerIsInRun(clientConnection, runId, runnerId) {
	const {
		rows
	} = await clientConnection.query('SELECT * FROM run_subscription WHERE run_id = $1 AND user_id = $2', [runId, runnerId])
	return rows.length >= 1
}

async function setRunnerPositions(runId, positions) {
	const client = await connect()

	try {
		await client.query('BEGIN')

		await positions.forEachAsync(async (p, i) => {

			if (!(await runnerIsInRun(client, runId, p.runner))) {
				let err = new Error(`Runner with id: ${ p.runner } is not in run: ${ runId }`)
				err.status = 404
				throw err
			}

			const {
				rows
			} = await client.query('INSERT INTO runner_position(run_id, runner_id, position) VALUES($1, $2, $3) RETURNING *', [runId, p.runner, p.position])
			console.log('Insert number ' + i)
			console.log(rows)
		})

		await client.query('COMMIT')
		await client.release()

		return {
			success: true,
			message: 'Runners position updated successfully'
		}

	} catch (err) {
		await client.query('ROLLBACK')
		await client.release()
		throw err
	}

}

function runPresenceMiddleware() {
	return async (req, res, next) => {
		if (!req.body.run_id && !req.query.run_id) {
			let err = new Error(`Missing parameter run_id`)
			err.status = 400
			next(err)
		}
		const runId = req.body.run_id || req.query.run_id

		const client = await connect()

		try {
			const {
				rows
			} = await client.query('SELECT * FROM run WHERE id = $1', [runId])

			if (rows.length === 0) {
				let err = new Error('No run with this run_id: ' + runId)
				err.status = 404
				next(err)
			}

			next()

		} catch (err) {
			await client.release()
			next(err)
		}

	}

}

module.exports = {
	createRun,
	joinRun,
	getAllRuns,
	getPositionParametersFromRequest,
	getRunParamsFromRequest,
	runPresenceMiddleware,
	getRunnersPosition,
	setRunnerPositions
}