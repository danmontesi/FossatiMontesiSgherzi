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
  setRunnerPositions,
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