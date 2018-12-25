const requiredParams = require('./requiredParameters')
const {
  Pool
} = require('pg')

class IndividualsManager {
  constructor(reqBody, actor = 'individual', action = 'registration') {
    this.indivPool = new Pool({
      connectionString: process.env.DATABASE_URL + '?ssl=true',
      max: 5
    })
    this.actor = actor
    this.action = action
    requiredParams[actor][action].forEach(param => {
      if (!(param in reqBody) || reqBody[param] === '') throw new Error(`Missing ${param}`)
      this[param] = reqBody[param]
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

  _checkValidIndividualRegParams() {
    /*
        let fiscalCode = new RegExp('^(?:(?:[B-DF-HJ-NP-TV-Z]|[AEIOU])[AEIOU][AEIOUX]|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}[\\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[1256LMRS][\\dLMNP-V])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM])(?:[A-MZ][1-9MNP-V][\\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$/i')
    */
    if (this.SSN.length === 16) return true
    return false

  }

  _checkValidCompanyRegParams() {
    return false
  }

  _checkValidRunOrganizerRegParams() {
    return false
  }

  login() {

  }

  async register() {
    const client = await this.indivPool.connect()
    await client.query('BEGIN')
    console.log('Template to insert')
    console.log([...this.toArray(), false, false])
    const {
      rows
    } = await client.query('INSERT INTO individual_account(email, password, SSN, name, surname, birth_date, smartwatch, automated_sos, verified ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [...this.toArray(), false, false])
    // TODO: Take the id with rows[0].id and create a token for the account, insert it in the token struct and return it to the user.
    // TODO: Add a few try catch blocks.
    console.log('Rows')
    console.log(rows)

    await client.release()
    /* console.log('Client connected')
     client.release()
     return 200*/
    return 200
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

module.exports = IndividualsManager