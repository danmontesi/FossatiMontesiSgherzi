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
})