const fetch = require('node-fetch')
const jwt = require('jsonwebtoken')

const {
  LOCAL_BASE_URL,
  runOrganizerMail,
  companyMail,
  userMail,
  password
} = require('../config')

const {
  connect
} = require('../../managers/config')

describe('Registration', () => {

  beforeEach(() => jest.setTimeout(50000))

  afterEach(async () => {
    const client = await connect()
    await client.query('DELETE FROM individual_account WHERE ssn=\'TESTTESTTESTTEST\'')
    await client.release()
  })

  test('User tries to register', async () => {
    // registration
    let reg = await fetch(LOCAL_BASE_URL + 'auth/register_user', {
      method: 'POST',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        email: 'georgemesaclooney@gmail.com',
        password: 'asdfasdf',
        SSN: 'TESTTESTTESTTEST',
        name: 'George',
        surname: 'Clooney',
        birthday: new Date(),
        smartwatch: 'TEST Smartwatch'
      })
    })
    reg = await reg.json()
    expect(reg.success).toBe(true)
    expect(reg.auth_token).not.toBe(undefined)

  })
})

describe('Should prevent login with an error if the password is wrong', () => {

  test('Company', async () => {
    await fetch(LOCAL_BASE_URL + 'auth/login', {
      method: 'POST',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        email: companyMail,
        password: password + 'A',
        type: 'company'
      })
    })
      .then(res => res.json())
      .then(res => {
        expect(res.status).toBe(403)
        expect(res.message).toBe('Invalid Credentials')
      })
      .catch(console.log)
  })

  test('Run Organizer', async () => {
    await fetch(LOCAL_BASE_URL + 'auth/login', {
      method: 'POST',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        email: runOrganizerMail,
        password: password + 'A',
        type: 'run_organizer'
      })
    })
      .then(res => res.json())
      .then(res => {
        expect(res.status).toBe(403)
        expect(res.message).toBe('Invalid Credentials')
      })
      .catch(console.log)
  })

  test('Individual', async () => {
    await fetch(LOCAL_BASE_URL + 'auth/login', {
      method: 'POST',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        email: userMail,
        password: password + 'A',
        type: 'individual'
      })
    })
      .then(res => res.json())
      .then(res => {
        expect(res.status).toBe(403)
        expect(res.message).toBe('Invalid Credentials')
      })
      .catch(console.log)
  })

})

describe('Should login the actor', () => {

  test('Company', async () => {
    await fetch(LOCAL_BASE_URL + 'auth/login', {
      method: 'POST',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        email: companyMail,
        password: password,
        type: 'company'
      })
    })
      .then(res => res.json())
      .then(res => {
        expect(res.success).toBe(true)
        expect(res.auth_token).not.toBe(null)
      })
      .catch(console.log)
  })

  test('Run Organizer', async () => {
    await fetch(LOCAL_BASE_URL + 'auth/login', {
      method: 'POST',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        email: runOrganizerMail,
        password: password,
        type: 'run_organizer'
      })
    })
      .then(res => res.json())
      .then(res => {
        expect(res.success).toBe(true)
        expect(res.auth_token).not.toBe(null)
      })
      .catch(console.log)
  })

  test('Individual', async () => {
    await fetch(LOCAL_BASE_URL + 'auth/login', {
      method: 'POST',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        email: userMail,
        password: password,
        type: 'individual'
      })
    })
      .then(res => res.json())
      .then(res => {
        expect(res.success).toBe(true)
        expect(res.auth_token).not.toBe(null)
      })
      .catch(console.log)
  })

})