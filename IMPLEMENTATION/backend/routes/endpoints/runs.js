const express = require('express')
const runsRouter = express.Router()
const {
  createRun,
  joinRun,
  getAllRuns,
  getRunParamsFromRequest,
  runPresenceMiddleware,
  getRunnersPosition,
  getRunsByRunOrganizer
} = require('../../managers/runs/RunManager')

const {
  getLastPosition
} = require('../../managers/individual/IndividualsManager')

const {
  authorizationMiddleware,
  getActor,
  isActor
} = require('../../managers/token/TokenManager')

/**
 * METHOD: GET
 * ENDPOINT: /runs/
 * Tries to retrive runs.
 * If the user is an individual_user it lists all the runs available for subscription in a radius
 * If the user is a run_organizer lists all the runs organized by him
 *
 * SUCCESS RESPONSE BODY:
 *  {
 *    success: true,
 *    runs: ... runs
 *  }
 *
 *  FAILURE RESPONSE BODY:
 *  {
 *    status: status_code
 *    message: message
 *  }
 * RESPONSE STATUS:
 *  200: Get successful
 *  500: An generic error occurred
 */
runsRouter.get('/', authorizationMiddleware('individual', 'run_organizer'), async (req, res, next) => {
  let response
  const {
    id
  } = getActor(req.query.auth_token)
  try {
    if (await isActor(req.query.auth_token, 'run_organizer')) {
      const runs = await getRunsByRunOrganizer(id)
      res
        .status(200)
        .send(runs)
    } else {
      const lastUserPosition = await getLastPosition(id)
      if (req.query.organizer_id) {
        response = await getAllRuns(lastUserPosition, req.query.organizer_id)
      } else {
        response = await getAllRuns(lastUserPosition)
      }
      res
        .status(200)
        .send(response)
    }
  } catch (e) {
    next(e)
  }

})

/**
 * METHOD: POST
 * ENDPOINT: /runs/positions
 * Tries to retrive the position of all the runners in a run.
 *
 * SUCCESS RESPONSE BODY:
 *  {
 *    success: true,
 *    position: ... positions
 *  }
 *
 *  FAILURE RESPONSE BODY:
 *  {
 *    status: status_code
 *    message: message
 *  }
 * RESPONSE STATUS:
 *  200: Get successful
 *  404: Run not found
 *  500: An generic error occurred
 */
runsRouter.get('/positions', authorizationMiddleware('individual'), runPresenceMiddleware(), async (req, res, next) => {

  try {
    const response = await getRunnersPosition(req.query.run_id)
    res
      .status(200)
      .send(response)
  } catch (err) {
    console.log(err)
    next(err)
  }
})

/**
 * METHOD: POST
 * ENDPOINT: /runs/join
 * Tries to join a run for the given user
 *
 * SUCCESS RESPONSE BODY:
 *  {
 *    success: true,
 *    message: message
 *  }
 *
 *  FAILURE RESPONSE BODY:
 *  {
 *    status: status_code
 *    message: message
 *  }
 * RESPONSE STATUS:
 *  200: Get successful
 *  404: Run not found
 *  500: An generic error occurred
 */
runsRouter.post('/join', authorizationMiddleware('individual'), async (req, res, next) => {
  try {
    const {
      id
    } = getActor(req.body.auth_token)
    const response = await joinRun(req.body.run_id, id)
    res
      .status(200)
      .send(response)
  } catch (err) {
    next(err)
  }
})


/**
 * METHOD: POST
 * ENDPOINT: /runs/join
 * Allows the run organizer to create a run
 *
 * SUCCESS RESPONSE BODY:
 *  {
 *    success: true,
 *    message: message
 *  }
 *
 *  FAILURE RESPONSE BODY:
 *  {
 *    status: status_code
 *    message: message
 *  }
 * RESPONSE STATUS:
 *  200: Get successful
 *  404: Run not found
 *  500: An generic error occurred
 */
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