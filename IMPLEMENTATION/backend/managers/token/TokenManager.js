const jwt = require('jsonwebtoken')
const {
  connect
} = require('../config')

function getActor(authToken) {
  try {
    return jwt.decode(authToken, process.env.JWT_SECRET)
  } catch (err) {
    err.message = 'Token is invalid'
    err.status = 401
    throw err
  }
}

// id: rows[0].id,
// email: rows[0].email,
// begin_time: new Date()

async function generateToken(id, email, begin_time) {

  const client = await connect()
  const token = jwt.sign({
    id, email, begin_time
  }, process.env.JWT_SECRET, {
    expiresIn: 86400 // By default expire in 24h
  })
  await client.query('INSERT INTO user_token(user_id, value, expiry_date) VALUES($1, $2, $3)', [id, token, new Date(begin_time.getTime() + 60 * 60 * 24 * 1000)])
}

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

function authorizationMiddleware() {
  return async (req, res, next) => {
    const token = req.body.auth_token || req.query.auth_token
    console.log(getActor(token))
    try {

      let isEntity = (await Promise.all(
        Object.keys(arguments)
          .map(async (key) => await isActor(token, arguments[key]))
      ))
        .filter(el => el === true)
        .length >= 1
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
  generateToken,
  isActor,
  getActor,
  authorizationMiddleware
}