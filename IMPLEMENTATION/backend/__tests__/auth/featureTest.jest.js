const fetch = require('node-fetch')

const {
  LOCAL_BASE_URL
} = require('../config')

describe('Should prevent login with an error if the password is wrong', () => {

  test('Company', async () => {
    await fetch(LOCAL_BASE_URL + 'auth/login', {
      method: 'POST',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        email: 'francesco.sgherzi.dev@gmail.com',
        password: 'AAAAA',
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
        email: '10493184@polimi.it',
        password: 'BBBBBBBBB',
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
        email: 'francesco.sgherzi@gmail.com',
        password: 'AAAA',
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
        email: 'francesco.sgherzi.dev@gmail.com',
        password: 'giannimio',
        type: 'company'
      })
    })
      .then(res => res.json())
      .then(res => {
        console.log(res.auth_token)
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
        email: '10493184@polimi.it',
        password: 'giannimio',
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
        email: 'francesco.sgherzi@gmail.com',
        password: 'giannimio',
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