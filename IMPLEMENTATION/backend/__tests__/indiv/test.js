const fetch = require('node-fetch')

const {
  userToken,
  LOCAL_BASE_URL
} = require('../config')

fetch(LOCAL_BASE_URL + 'indiv/data', {
  method: 'POST',
  headers: new fetch.Headers({
    'Content-Type': 'application/json'
  }),
  body: JSON.stringify({
    auth_token: userToken,
    data: {
      gps_coordinates: [
        {
          long: 9.263508,

          lat: 45.4972669,
          timestamp: new Date()
        }
      ],
      accelerometer: [
        {
          acc_y: 2.123,
          timestamp: new Date(2014, 0, 1),
          acc_z: 141,
          acc_x: -2
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
  .then(res => res.json())
  .then(console.log)
  .catch(console.log)

// fetch(LOCAL_BASE_URL + 'indiv/data' + '?auth_token=' +
//   userToken +
//   '&begin_date=' + new Date(2014, 0, 0).toISOString() + '&end_date=' + new Date(2014, 0, 1).toISOString(), {
//   method: 'GET',
//   headers: new fetch.Headers({
//     'Content-Type': 'application/json'
//   })
// })
//   .then(res => res.json())
//   .then(console.log)
//   .catch(console.log)
