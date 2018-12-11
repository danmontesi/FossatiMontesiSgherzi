const express = require("express")
const bodyParser = require('body-parser')
const logger = require("morgan")
const session = require('express-session')
const routes = require('./routes/router')
const {
  debugLog
} = require('./utils/testUtils')
const PORT = 12345

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/', routes)

/**
 * 404 Error Catcher
 */
app.use(function (req, res, next) {
  let err = new Error('File Not Found')
  err.status = 404
  next(err)
})

app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.send(JSON.stringify({
    status: err.status || 500,
    message: err.message
  }))
})

app.listen(PORT, function () {
  console.log('Express app listening on port ' + PORT)
  debugLog('DEBUG ACTIVE')
})