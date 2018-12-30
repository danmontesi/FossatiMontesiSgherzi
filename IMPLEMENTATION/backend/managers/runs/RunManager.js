const {
	Pool
} = require('pg')
const {
	getActor
} = require('../token/TokenManager')
const {
	ACCEPTING_SUBSCRIPTION,
	RUN_STARTED,
	RUN_ENDED
} = require('./runStatus')

Array.prototype.forEachAsync = async function(callback) {
	for (let i = 0; i < this.length; i++) {
		await callback(this[i], i)
	}
}

class RunManager {
	constructor(reqBody) {
		this.runPool = new Pool({
			connectionString: process.env.DATABASE_URL + '?ssl=true',
			max: 5
		})

		if (reqBody.auth_token) {
			try {
				this.runActor = getActor(reqBody.auth_token)
			} catch (err) {
				err.message = 'Token is invalid'
				err.status = 400
				throw err
			}
		} else {
			let err = new Error('Missing Token')
			err.status = 422
			throw err
		}
		if (reqBody.time_begin && reqBody.time_end && reqBody.coordinates && reqBody.description) {
			this.startTime = reqBody.time_begin
			this.endTime = reqBody.time_end
			this.path = reqBody.coordinates
			this.runDescription = reqBody.description
		}
	}

	async createRun() {
		const client = await this.runPool.connect()

		try {
			const {
				rows
			} = await client.query('INSERT INTO run(organizer_id, start_time, end_time, status, description) VALUES($1, $2, $3, $4, $5) RETURNING *', [this.runActor.id, this.startTime, this.endTime, ACCEPTING_SUBSCRIPTION, this.runDescription])
			this.path.forEachAsync(async (coord) => {
				console.log(coord)
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

	static async getAllRuns() {
		const client = await new Pool({
			connectionString: process.env.DATABASE_URL + '?ssl=true',
			max: 5
		}).connect()

		const {
			rows: runs
		} = await client.query('SELECT * FROM run')
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

	static async joinRun(runId, userId) {
		console.log(runId)
		const client = await new Pool({
			connectionString: process.env.DATABASE_URL + '?ssl=true',
			max: 5
		}).connect()

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

			const {
				rows: newRun
			} = await client.query('INSERT INTO run_subscription(run_id, user_id, subscription_date) VALUES($1, $2, $3) RETURNING *', [runId, userId, new Date()])
			return {
				success: true,
				message: `Joined run ${ runId }`
			}
			await client.query('COMMIT')
			await client.release()

		} catch (err) {
			await client.query('ROLLBACK')
			await client.release()
			throw err
		}

	}

}

module.exports = RunManager