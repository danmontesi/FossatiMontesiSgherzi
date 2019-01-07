/**
 * Dependency Import
 */
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const nm = require('nodemailer')
const {
  Pool
} = require('pg')

/**
 * Enums definition
 */
const ACTOR = {
  INDIVIDUAL: 'individual',
  RUN_ORGANIZER: 'run_organizer',
  COMPANY: 'company'
}

const ACTION = {
  LOGIN: 'login',
  REGISTRATION: 'registration'
}

/**
 * Import required params for login and registration of actors
 */
const requiredParams = require('./requiredParameters')

/**
 * Create a connection pool for the database
 * @type {PG.Pool}
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL + '?ssl=true',
  max: 5
})

/**
 * Connects to the database
 * @returns {Promise<Client>}
 */
async function connect() {
  return await pool.connect()
}

/**
 * Sends a verification email with a link, by clicking which the client is automatically verified
 * @param mail String: The email to which send the verification code
 * @param code String: The verification code
 * @param type String: The type of actor
 */
function sendVerificationMail(mail, code, type) {
  console.log('Sending mail to ' + mail)

  const transporter = nm.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_ADDR,
      pass: process.env.MAIL_PASSWD
    }
  })

  const mailOptions = {
    from: process.env.MAIL_ADDR,
    to: mail,
    subject: 'Data4Help, account verification',
    html: `<p>Copy the following link in the browser https://data4halp.herokuapp.com/auth/verify?mail=${mail}&code=${code}&type=${type}</p>`
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) throw error
    console.log(info)
  })
}

/**
 * Checks if the body of the request has the proper parameters, otherwise throws an error
 * @param entity: JSON The body of the registration request
 * @param actor: ACTOR.INDIVIDUAL | ACTOR.RUN_ORGANIZER | ACTOR.COMPANY
 * @param action: ACTION.LOGIN | ACTION.REGISTER
 */
function checkRequiredParams(entity, actor, action) {
  requiredParams[actor][action].forEach(param => {
    if (!(param in entity) || entity[param] === '') throw new Error(`Missing ${param}`)
  })
}


/**
 * Registers the given user
 * The body of the request must have the following param
 * @param email: String
 * @param password: String
 * @param SSN: String
 * @param name: String
 * @param surname: String
 * @param birthday: Date
 * @param smartwatch: String
 * @returns {Promise<void>}
 */
async function registerUser({email, password, SSN, name, surname, birthday, smartwatch}) {

  // Check if the required parameters are in the request
  checkRequiredParams(arguments['0'], ACTOR.INDIVIDUAL, ACTION.REGISTRATION)

  // Hash the password
  const pwd = bcrypt.hashSync(password, 8)
  const client = await connect()

  try {

    await client.query('BEGIN')

    // Insert the user into the database
    const {
      rows: user
    } = await client.query(
      'INSERT INTO ' +
      'individual_account(email, password, SSN, name, surname, birth_date, smartwatch, automated_sos, verified ) ' +
      'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [email, pwd, SSN, name, surname, birthday, smartwatch, false, false])

    // Create a token
    const token = jwt.sign({
      id: user[0].id,
      email: user[0].email,
      begin_time: new Date()
    }, process.env.JWT_SECRET, {
      expiresIn: 86400 // Expire in 24h
    })

    // Insert the token into the database and commit the transaction
    await client.query('INSERT INTO user_token(user_id, value, expiry_date) VALUES($1, $2, $3)', [user[0].id, token, new Date(new Date().getTime() + 60 * 60 * 24 * 1000)])
    await client.query('COMMIT')

    sendVerificationMail(user[0].email, token, ACTOR.INDIVIDUAL)

    await client.release()
    return token

  } catch (err) {
    await client.release()
    throw err
  }

}

/**
 * Verify the account via the verification code.
 * @param mail: String
 * @param code: String The verification code sent to the user
 * @param type: ACTOR.INDIVIDUAL | ACTOR.RUN_ORGANIZER | ACTOR.COMPANY
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function verify(mail, code, type) {

  const client = await connect()

  try {

    // Decode and verify the token
    const decodedPayload = jwt.verify(code, process.env.JWT_SECRET)

    console.log(decodedPayload)

    if (decodedPayload.email === mail) {

      // Update and set the verified flag on the database
      await client.query('BEGIN')
      await client.query(`UPDATE ${type}_account SET verified=$1 WHERE email=$2`, [true, mail])
      await client.query('COMMIT')
      await client.release()

      return {
        success: true,
        message: 'Email verified'
      }
    } else throw new Error()

  } catch (err) {
    err.status = 401
    err.message = 'Code is invalid'
    client.query('ROLLBACK')
    client.release()
    throw err
  }
}

/**
 * Logs an actor in and gives him back a token
 * The body of the request must have the following params
 * @param email: String
 * @param password: String
 * @param type: ACTOR.INDIVIDUAL | ACTOR.RUN_ORGANIZER | ACTOR.COMPANY
 * @returns {Promise<void>}
 */
async function login({email, password, type}) {

  // Check if the required parameters are in the request
  checkRequiredParams(arguments['0'], type, ACTION.LOGIN)

  // Connects to the database pool
  const client = await connect()

  try {

    // Begins the transaction
    await client.query('BEGIN')

    const {
      rows: actor
    } = await client.query(`SELECT * FROM ${type}_account WHERE email = $1`, [email])

    // If the user wasn't found on the db, throw an error
    if (actor.length === 0) {
      let err = new Error('User not found')
      err.status = 404
      throw err
    }

    // If the user hasb't verified his account, throw an error
    if (!actor[0].verified) {
      let err = new Error('User not verified')
      err.status = 401
      throw err
    }

    // Compare the password and its hashed version
    if (await bcrypt.compare(password, actor[0].password)) {

      const token = jwt.sign({
        id: actor[0].id,
        email: actor[0].email,
        begin_time: new Date()
      }, process.env.JWT_SECRET, {
        expiresIn: 86400 // By default expire in 24h
      })

      // Push the new token in the database
      await client.query('INSERT INTO user_token(user_id, value, expiry_date) VALUES($1, $2, $3)', [actor[0].id, token, new Date(new Date().getTime() + 60 * 60 * 24 * 1000)])

      // Commit the transaction
      await client.query('COMMIT')
      await client.release()

      return token

    } else {
      let wrongPasswd = new Error('Invalid Credentials')
      wrongPasswd.status = 403
      throw wrongPasswd
    }

  } catch (err) {
    await client.query('ROLLBACK')
    await client.release()
    throw err
  }

}

module.exports = {
  registerUser,
  verify,
  login
}