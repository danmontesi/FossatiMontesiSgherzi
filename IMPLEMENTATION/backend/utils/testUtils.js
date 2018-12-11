function isTestEnabled(request) {
  if (process.env.TEST_API === 'enabled') return request.query.action
}

function debugLog(message) {
  if (process.env.TEST_API === 'enabled') {
    /*const bgBlack = "\x1b[40m"
    const fgRed = "\x1b[31m"*/
    console.log(message)
  }
}

module.exports = {
  isTestEnabled,
  debugLog
}