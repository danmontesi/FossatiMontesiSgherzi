const jwt = require('jsonwebtoken')
const {
  connect
} = require('../config')

/**
 * Gets the information on the actor, namely id and mail, by the token
 * @param authToken
 * @returns {Actor}
 */
function getActor(authToken) {
  try {
    return jwt.decode(authToken, process.env.JWT_SECRET)
  } catch (err) {
    err.message = 'Token is invalid'
    err.status = 401
    throw err
  }
}

/**
 * Check if a given actor is the actor given as a parameter
 * @param authToken: String
 * @param actor: String
 * @returns {Promise<boolean>}
 */
async function isActor(authToken, actor) {
  const client = await connect()
  try {
    let decodedActor = jwt.decode(authToken, process.env.JWT_SECRET)
    const {
      rows
    } = await client.query(`SELECT * FROM ${actor}_account WHERE id = $1`, [decodedActor.id])
    await client.release()
    return rows.length >= 1
  } catch (err) {
    await client.release()
    err.message = 'Token is invalid'
    err.status = 400
    throw err
  }

}

/**
 * Prevents all access to the endpoint if the user is not
 * one specified by its arguments
 * @returns {Function}
 */
function authorizationMiddleware() {
  return async (req, res, next) => {
    const token = req.body.auth_token || req.query.auth_token
    try {
      let isEntity = (await Promise.all(
        Object.keys(arguments)
          .map(async (key) => await isActor(token, arguments[key]))
      ))
        .filter(el => el === true)
        .length >= 1

      // If is at least one of the given actors
      // go to the next middleware
      if (isEntity) next()
      else {
        let err = new Error('Unauthorized')
        err.status = 401
        next(err)
      }
    } catch (err) {
      next(err)
    }
  }
}


module.exports = {
  isActor,
  getActor,
  authorizationMiddleware
}