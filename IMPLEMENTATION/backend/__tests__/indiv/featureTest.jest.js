const fetch = require('node-fetch')

const {
  LOCAL_BASE_URL,
  userToken
} = require('../config')

describe('User sends data', () => {
  test('User sends data formatted correctly', async () => {

    let res = await fetch(LOCAL_BASE_URL + 'indiv/data', {
      method: 'POST',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        auth_token: userToken,
        data: {
          gps_coordinates: [
            {
              lat: 45.4772669,
              long: 9.2343508,
              timestamp: new Date()
            }
          ],
          accelerometer: [
            {
              timestamp: new Date(2014, 0, 1),
              acc_x: -2,
              acc_y: 2.123,
              acc_z: 141
            }, {
              timestamp: new Date(),
              acc_x: -12,
              acc_y: 5.123,
              acc_z: 11
            }
          ],
          heart_rate: [
            {
              timestamp: new Date(2014, 0, 1),
              bpm: 80
            }, {
              timestamp: new Date(),
              bpm: 84
            }
          ]
        }
      })
    })
    res = await res.json()
    expect(res.success).toBe(true)
    expect(res.message).toBe('Sync successful')
  })
  test('User sends data formatted badly', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'indiv/data', {
      method: 'POST',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        auth_token: userToken,
        data: {
          gps_coordinates: [
            {
              lat: 45.4772669,
              long: 9.2343508,
              timestamp: new Date()
            }
          ],
          accelerometer: [
            {
              timestamp: new Date(2014, 0, 1),
              acc_x: -2,
              acc_y: 2.123,
              acc_z: 141
            }, {
              timestamp: new Date(),
              acc_x: -12,
              acc_y: 5.123,
              acc_z: 11
            }
          ],
          heart_rate: [
            {
              bpm: 80
            }, {
              timestamp: new Date(),
              bpm: 84
            }
          ]
        }
      })
    })
    res = await res.json()
    expect(res.status).toBe(422)
    expect(res.message).toBe('Invalid data')
  })
})

describe('User wants to retrive his data', () => {
  test('Data retrival', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'indiv/data' + '?auth_token=' +
      userToken +
      '&begin_date=' + new Date(1970, 0, 0).toISOString() + '&end_date=' + new Date(2014, 0, 1).toISOString(), {
      method: 'GET',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      })
    })
    res = await res.json()
    expect(res.success).toBe(true)
    expect(res.data).not.toBe(null)
  })

  test('Data retrival - Malformed', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'indiv/data' + '?auth_token=' +
      userToken +
      '&begin_date=' + new Date(1970, 0, 0).toISOString() + '&end_date=' + 'AAAA', {
      method: 'GET',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      })
    })
    res = await res.json()
    expect(res.status).toBe(500)
  })
})

describe('User wants to retrive it\'s information',  () => {
  test('', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'indiv/user?'
      + 'auth_token=' + userToken,
      {
        method: 'GET',
        headers: new fetch.Headers({
          'Content-Type': 'application/json'
        })
      })
    res = await res.json()

    expect(res.success).toBe(true)
    expect(res.user).not.toBe(null)
  })
})