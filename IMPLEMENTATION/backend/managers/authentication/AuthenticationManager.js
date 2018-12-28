const requiredParams = require('./requiredParameters')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const nm = require('nodemailer')

const {
  Pool
} = require('pg')

class AuthenticationManager {

  constructor(reqBody, actor = 'individual', action = 'registration') {
    this.authPool = new Pool({
      connectionString: process.env.DATABASE_URL + '?ssl=true',
      max: 5
    })
    this.actor = actor
    this.action = action
    requiredParams[actor][action].forEach(param => {
      if (!(param in reqBody) || reqBody[param] === '') throw new Error(`Missing ${param}`)
      this[param] = (param === 'password' && action === 'registration') ? bcrypt.hashSync(reqBody[param], 8) : reqBody[param]
    })

  }

  sendVerificationMail(mail, code, type) {
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
    })
  }

  checkValidRegParams() {
    switch (this.actor) {
      case 'individual':
        return this._checkValidIndividualRegParams()
      case 'company':
        return this._checkValidCompanyRegParams()
      case 'run_organizer':
        return this._checkValidRunOrganizerRegParams()
      default:
        throw new Error('Unrecognized individual')
    }
  }

  async register() {
    switch (this.actor) {
      case 'individual':
        return await this._registerIndividual()
      case 'company':
        return await this._registerCompany()
      case 'run_organizer':
        return await this._registerRunOrganizer()
      default:
        throw new Error('Unrecognized individual')
    }
  }

  _checkValidIndividualRegParams() {

    if (this.SSN.length !== 16) {
      let err = new Error('SSN Not valid')
      err.status = 422
      throw  err
    }

    if (false) {
      // CHECK IF THE SMARTWATCH IS IN THE SUPPORTED SMARTWATCH LIST
      let err = new Error('Unsupported Smartwatch')
      err.status = 422
      throw  err
    }

  }

  _checkValidCompanyRegParams() {
    // already satisfied
  }

  _checkValidRunOrganizerRegParams() {
    // already satisfied
  }

  async login() {
    const client = await this.authPool.connect()
    try {
      await client.query('BEGIN')
      const {
        rows
      } = await client.query('SELECT * FROM ' + `${this.actor}_account` + ' WHERE email = $1', [this.email])

      if (rows.length === 0) {
        console.log('------------------------------------ USER NOT FOUND ------------------------------------')
        let err = new Error('User Not Found')
        err.status = 404
        throw err
      }
      if (!rows[0].verified) {
        let err = new Error('User not verified')
        err.status = 401
        throw err
      }

      if (await bcrypt.compare(this.password, rows[0].password)) {
        console.log('------------------------------------ PASSWORD VERIFIED ------------------------------------')
        console.log('---------------------------------- GENERATING AUTH TOKEN ----------------------------------')
        const token = jwt.sign({
          id: rows[0].id,
          email: rows[0].email,
          begin_time: new Date()
        }, process.env.JWT_SECRET, {
          expiresIn: 86400 // By default expire in 24h
        })

        await client.query('INSERT INTO user_token(user_id, value, expiry_date) VALUES($1, $2, $3)', [rows[0].id, token, new Date(new Date().getTime() + 60 * 60 * 24 * 1000)])

        await client.query('COMMIT')
        await client.release()
        return token
      }

      let wrongPasswd = new Error('Invalid Credentials')
      wrongPasswd.status = 403
      throw wrongPasswd

    } catch (err) {
      await client.query('ROLLBACK')
      await client.release()
      throw err
    }
  }


  async _registerIndividual() {
    const client = await this.authPool.connect()
    try {
      await client.query('BEGIN')
      const {
        rows
      } = await client.query('INSERT INTO individual_account(email, password, SSN, name, surname, birth_date, smartwatch, automated_sos, verified ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [...this.toArray(), false, false])
      const token = jwt.sign({
        id: rows[0].id,
        email: rows[0].email,
        begin_time: new Date()
      }, process.env.JWT_SECRET, {
        expiresIn: 86400 // By default expire in 24h
      })

      await client.query('INSERT INTO user_token(user_id, value, expiry_date) VALUES($1, $2, $3)', [rows[0].id, token, new Date(new Date().getTime() + 60 * 60 * 24 * 1000)])
      await client.query('COMMIT')
      this.sendVerificationMail(rows[0].email, token, 'individual')
      await client.release()
      return token
    } catch (err) {
      await client.query('ROLLBACK')
      await client.release()
      if (err.message.includes('email')) {
        err.message = 'Mail already in use'
        err.status = 422
      }
      throw err
    }
  }


  async _registerCompany() {
    const client = await this.authPool.connect()
    try {
      await client.query('BEGIN')
      const {
        rows
      } = await client.query('INSERT INTO company_account(email, password, company_name, verified) VALUES($1, $2, $3, $4) RETURNING *', [...this.toArray(), false])
      const token = jwt.sign({
        id: rows[0].id,
        email: rows[0].email,
        begin_time: new Date()
      }, process.env.JWT_SECRET, {
        expiresIn: 86400 // By default expire in 24h
      })
      await client.query('INSERT INTO user_token(user_id, value, expiry_date) VALUES($1, $2, $3)', [rows[0].id, token, new Date(new Date().getTime() + 60 * 60 * 24 * 1000)])
      await client.query('COMMIT')
      this.sendVerificationMail(rows[0].email, token, 'company')
      await client.release()
      return token
    } catch (err) {
      client.query('ROLLBACK')
      client.release()
      if (err.message.includes('duplicate')) {
        err.message = 'Mail already in use'
        err.status = 422
      }
      throw err
    }
  }

  async _registerRunOrganizer() {
    const client = await this.authPool.connect()
    try {
      await client.query('BEGIN')
      const {
        rows
      } = await client.query('INSERT INTO run_organizer_account(email, password, name, surname, verified) VALUES($1, $2, $3, $4, $5) RETURNING *', [...this.toArray(), false])
      const token = jwt.sign({
        id: rows[0].id,
        email: rows[0].email,
        begin_time: new Date()
      }, process.env.JWT_SECRET, {
        expiresIn: 86400 // By default expire in 24h
      })
      await client.query('INSERT INTO user_token(user_id, value, expiry_date) VALUES($1, $2, $3)', [rows[0].id, token, new Date(new Date().getTime() + 60 * 60 * 24 * 1000)])
      await client.query('COMMIT')
      this.sendVerificationMail(rows[0].email, token, 'run_organizer')
      await client.release()
      return token
    } catch (err) {
      client.query('ROLLBACK')
      client.release()
      if (err.message.includes('duplicate')) {
        err.message = 'Mail already in use'
        err.status = 422
      }
      throw err
    }
  }

  static async verify(mail, code, type) {
    const client = await new Pool({
      connectionString: process.env.DATABASE_URL + '?ssl=true',
      max: 5
    }).connect()
    try {
      const decodedPayload = jwt.verify(code, process.env.JWT_SECRET)
      console.log(decodedPayload)
      if (decodedPayload.email === mail) {

        await client.query('BEGIN')
        await client.query('UPDATE' + ` ${type}_account ` + ' SET verified=$1 WHERE email=$2', [true, mail])
        await client.query('COMMIT')
        await client.release()
        return {
          success: true,
          message: 'Email verified'
        }
      }

    } catch (err) {
      err.status = 401
      err.message = 'Code is invalid'
      client.query('ROLLBACK')
      client.release()
      throw err
    }
  }

  toJSON() {
    let template = {}
    requiredParams[this.actor][this.action].forEach(param => template[param] = this[param])
    return template
  }

  toArray() {
    let template = []
    requiredParams[this.actor][this.action].forEach(param => template.push(this[param]))
    return template
  }
}

module.exports = AuthenticationManager