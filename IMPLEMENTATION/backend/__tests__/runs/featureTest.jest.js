const fetch = require('node-fetch')

const {
  LOCAL_BASE_URL,
  runOrganizerToken,
  userToken
} = require('../config')

describe('List of runs', () => {
  beforeEach(() => jest.setTimeout(50000))
  test('run organizer lists its runs', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'runs?'
      + 'auth_token=' + runOrganizerToken,
      {
        method: 'GET',
        headers: new fetch.Headers({
          'Content-Type': 'application/json'
        })
      })

    res = await res.json()
    expect(res.success).toBe(true)
    expect(res.runs).not.toBe(undefined)
  })

  test('user lists runs available', async () => {

    let res = await fetch(LOCAL_BASE_URL + 'runs?'
      + 'auth_token=' + userToken,
      {
        method: 'GET',
        headers: new fetch.Headers({
          'Content-Type': 'application/json'
        })
      })

    res = await res.json()
    expect(res.success).toBe(true)
    expect(res.runs).not.toBe(undefined)
  })

})

describe('Runs position', () => {
  test('runs position - correct', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'runs/positions?' +
      'auth_token=' + userToken + '&' +
      'run_id=' + 60,
      {
        method: 'GET',
        headers: new fetch.Headers({
          'Content-Type': 'application/json'
        })
      })
    res = await res.json()
    expect(res.success).toBe(true)
    expect(res.positions).not.toBe(undefined)

  })

  test('runs position - non existing run', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'runs/positions?' +
      'auth_token=' + userToken + '&' +
      'run_id=' + -1,
      {
        method: 'GET',
        headers: new fetch.Headers({
          'Content-Type': 'application/json'
        })
      })
    res = await res.json()
    expect(res.status).toBe(404)
    expect(res.message).toMatch(/No run /)
  })

})

describe('Join', () => {
  test('Join a run correctly', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'runs/join',
      {
        method: 'POST',
        headers: new fetch.Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          auth_token: userToken,
          run_id: 63
        })
      })
    res = await res.json()
    expect(res.success).toBe(true)
    expect(res.message).toMatch(/Joined run /)
  })

  test('Join a run - Non existant run', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'runs/join',
      {
        method: 'POST',
        headers: new fetch.Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          auth_token: userToken,
          run_id: -1
        })
      })
    res = await res.json()
    expect(res.status).toBe(404)
    expect(res.message).toMatch(/There isn\'t any run available with that id atm/)
  })

})

describe('Create a run', () => {
  test('Create a run - correctly', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'runs/run', {
      method: 'POST',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        auth_token: runOrganizerToken,
        time_begin: new Date(),
        time_end: new Date(),
        description: 'Unbelievably, a run',
        coordinates: [
          {
            lat: 45.4773403,
            long: 9.2335757,
            description: 'Torrescalla\'s position'
          },
          {
            lat: 45.477022,
            long: 9.2338068,
            description: 'Torrescalla\'s position, but, unbelivably, 10mt ahead'
          }
        ]
      })
    })
    res = await res.json()
    expect(res.success).toBe(true)
    expect(res.run_id).not.toBe(undefined)

  })

  test('Create a run - wrong', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'runs/run', {
      method: 'POST',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        auth_token: runOrganizerToken,
        time_end: new Date(),
        description: 'Unbelievably, a run',
        coordinates: [
          {
            lat: 45.4773403,
            long: 9.2335757,
            description: 'Torrescalla\'s position'
          },
          {
            lat: 45.477022,
            long: 9.2338068,
            description: 'Torrescalla\'s position, but, unbelivably, 10mt ahead'
          }
        ]
      })
    })
    res = await res.json()
    expect(res.status).toBe(400)
    expect(res.message).toMatch(/Missing parameters/)

  })

})
