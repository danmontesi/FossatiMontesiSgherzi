/**
 * Returns the action to perform if testing is enabled
 * Currently needed only by /subs
 * @param request
 * @returns {*}
 */
function isTestEnabled(request) {
  if (process.env.TEST_API === 'enabled') return request.query.action
}

/**
 * Checks if the variable is undefined or empty
 * @param v
 * @returns {boolean}
 */
function nullOrEmpty(v) {
  return !v || v === ''
}

/**
 * Checks the presence of all needed environmental variables
 * @returns {boolean}
 */
function checkEnviron() {

  console.log('-------------------------Setup-------------------------')

  let environ = [
    'TEST_API',
    'DATABASE_URL',
    'JWT_SECRET',
    'MAIL_PROVIDER',
    'MAIL_ADDR',
    'MAIL_PASSWD',
    'LOCAL',
    'HOST',
    'PORT'
  ]

  for (let el of environ) {
    console.log('Checking the presence of ' + el)
    if (nullOrEmpty(process.env[el])) {
      console.log('MISSING ' + el)
      process.exit(255, 'Missing environmental variable ' + el)
    }
    console.log('Found: ' + process.env[el] + '\n\n')
  }

  console.log('----------------Setup done, launching----------------')

}

module.exports = {
  isTestEnabled,
  checkEnviron
}