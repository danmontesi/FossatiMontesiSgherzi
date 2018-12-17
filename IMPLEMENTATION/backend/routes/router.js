const express = require('express')
const router = express.Router()

const authRouter = require('./endpoints/auth')
const indivRouter = require('./endpoints/indiv')
const queriesRouter = require('./endpoints/queries')
const runsRouter = require('./endpoints/runs')
const subsRouter = require('./endpoints/subs')

router.use('/auth', authRouter)
router.use('/indiv', indivRouter)
router.use('/queries', queriesRouter)
router.use('/runs', runsRouter)
router.use('/subs', subsRouter)

module.exports = router