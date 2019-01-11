const {
  getLastPosition
} = require('../individual/IndividualsManager')

/**
 * Connect to the database
 */
const {
  connect
} = require('../config')

/**
 * Constants for the run status
 */
const {
  ACCEPTING_SUBSCRIPTION,
  RUN_STARTED,
  RUN_ENDED
} = require('./runStatus')

/**
 * Creates a run
 * @param runOrganizer JSON
 * @param startTime Date
 * @param endTime Date
 * @param runDescription string
 * @param path Array<JSON>
 * @returns {Promise<{run_id: *, success: boolean}>}
 */
async function createRun(runOrganizer, startTime, endTime, runDescription, path) {
  const client = await connect()

  try {
    const {
      rows
    } = await client.query('INSERT INTO run(organizer_id, start_time, end_time, description) VALUES($1, $2, $3, $4) RETURNING *', [runOrganizer.id, startTime, endTime, runDescription])
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
    throw err
  }

}

/**
 * Retrieves all runs for the user or run organzier
 * @param position
 * @param organizerId?
 * @returns {Promise<{success: boolean, runs: *}>}
 */
async function getAllRuns(position, organizerId = undefined) {
  const client = await connect()

  let queryTemplate = ''
  let queryParams = [new Date()]

  // Depending on if the actor is a run_organizer or an individual, change the query to perform
  if (organizerId) {
    queryTemplate = 'SELECT * FROM run WHERE end_time > $1 AND organizer_id = $2'
    queryParams.push(organizerId)
  } else {
    queryTemplate = 'SELECT * FROM run WHERE end_time > $1'
  }

  try {

    const {
      rows: runs
    } = await client.query(queryTemplate, queryParams)

    // Adds the status
    runs.forEach(run => {
      if (new Date(run.start_time) > new Date()) run.status = ACCEPTING_SUBSCRIPTION
      else if (new Date(run.start_time) < new Date() && new Date(run.end_time) > new Date()) run.status = RUN_STARTED
      else run.status = RUN_ENDED
    })

    // Get all coordinates, sort them and add them to the path
    await runs.forEachAsync(async (run) => {
      const {
        rows: runCoordinates
      } = await client.query('SELECT * FROM run_check_point WHERE run_id = $1', [run.id])
      runCoordinates.sort((c1, c2) => c1.id - c2.id)
      run.path = runCoordinates
    })

    let runsInRange = runs.filter(run => isRunInRange(run.path, position))
    await client.release()
    return {
      success: true,
      runs: runsInRange
    }
  } catch (err) {
    await client.release()
    throw err
  }

}

/**
 * Allorws the user, given the userId and the runId, to join the run
 * @param runId: String
 * @param userId: String
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function joinRun(runId, userId) {
  const client = await connect()

  await client.query('BEGIN')

  try {
    const {
      rows: runs
    } = await client.query('SELECT * FROM run WHERE id = $1 AND end_time > $2', [runId, new Date()])

    if (runs.length !== 1) {
      let err = new Error('There isn\'t any run available with that id atm')
      err.status = 404
      throw err
    }

    // Subscribe the user to the run by inserting it in the table
    await client.query('INSERT INTO run_subscription(run_id, user_id, subscription_date) VALUES($1, $2, $3) RETURNING *', [runId, userId, new Date()])
    await client.query('COMMIT')
    await client.release()
    return {
      success: true,
      message: `Joined run ${runId}`
    }
  } catch (err) {
    if (err.message.includes('duplicate key value violates')) err.message = 'You cannot join a run you\'ve already joined'
    await client.query('ROLLBACK')
    await client.release()
    throw err
  }

}

/**
 * Extract run details from the request
 * @param reqBody
 * @returns {{path: *, authToken: *, description: (string), startTime: (Date), endTime: (Date)}}
 */
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

/**
 * Gets the last position of the runner, given the run_id
 * @param run_id
 * @returns {Promise<{success: boolean, positions}>}
 */
async function getRunnersPosition(run_id) {

  const client = await connect()

  try {
    const {
      rows: runSubs
    } = await client.query('SELECT rs.run_id, rs.user_id, rs.subscription_date, ia.id, ia.name, ia.surname FROM run_subscription as rs, individual_account as ia WHERE rs.run_id = $1 AND rs.user_id = ia.id', [run_id])

    // For each run subscriber
    await runSubs.forEachAsync(async (runSub) => {
      // Get its latest position
      runSub.lastPosition = await getLastPosition(runSub.user_id)
      // Set its name
      runSub.id = runSub.name + ' ' + runSub.surname
      runSub.name = undefined
      runSub.surname = undefined
      runSub.subscription_date = undefined
      runSub.run_id = undefined
    })

    await client.release()

    return {
      success: true,
      positions: runSubs
    }

  } catch (err) {
    console.log('in getRunnserPosition')
    console.log(err)
    await client.release()
    throw err
  }

}

/**
 * Detect if the run is in range
 * @param runCheckpoints
 * @param userCoordinate
 * @param radius
 * @returns {boolean}
 */
function isRunInRange(runCheckpoints, userCoordinate, radius = 10) {
  const LAT_DEGREE = 110.57 // km
  const LONG_DEGREE = 111.32 // km

  let flag = true

  // Check that every checkpoint is whithin the radius
  runCheckpoints.forEach(checkpoint => {
    const distance = Math.sqrt(
      Math.pow((userCoordinate.lat - checkpoint.lat) * LAT_DEGREE, 2) +
      Math.pow((userCoordinate.long - checkpoint.long) * LONG_DEGREE, 2)
    )
    if (distance >= radius) flag = false
  })
  return flag

}

/**
 * Retrieves the run by organizerId
 * @param organizerId
 * @returns {Promise<{success: boolean, runs}>}
 */
async function getRunsByRunOrganizer(organizerId) {
  const client = await connect()

  try {
    const {
      rows
    } = await client.query('SELECT * FROM run WHERE organizer_id = $1 AND end_time > $2', [organizerId, new Date()])

    // Adds the status
    rows.forEach(run => {
      if (new Date(run.start_time) < new Date() && new Date(run.end_time) > new Date()) run.status = RUN_STARTED
      else run.status = ACCEPTING_SUBSCRIPTION
    })

    await client.release()

    return {
      success: true,
      runs: rows
    }

  } catch (e) {
    await client.release()
    throw e
  }

}

/**
 * Middleware to check if the run_id is present in either the body or the query
 * and detect if exists
 * @returns {Function}
 */
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
        throw err
      }
      await client.release()
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
  getRunParamsFromRequest,
  runPresenceMiddleware,
  getRunnersPosition,
  getRunsByRunOrganizer
}