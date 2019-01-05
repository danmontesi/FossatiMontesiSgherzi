const fetch = require('node-fetch')

const {
  companyToken,
  LOCAL_BASE_URL
} = require('../config')

// fetch(LOCAL_BASE_URL + 'queries/query', {
//   method: 'POST',
//   headers: new fetch.Headers({
//     'Content-Type': 'application/json'
//   }),
//   body: JSON.stringify({
//     auth_token: companyToken,
//     query: {
//       type: 'individual',
//       SSN: 'SGHRCM65PD7L858L',
//       additional_params: {}
//     }
//   })
// })
//   .then(res => res.json())
//   .then(console.log)
//   .catch(console.log)

// fetch(LOCAL_BASE_URL + 'queries/query', {
//   method: 'POST',
//   headers: new fetch.Headers({
//     'Content-Type': 'application/json'
//   }),
//   body: JSON.stringify({
//     auth_token: companyToken,
//     query: {
//       type: 'regional',
//       region: 'Abruzzi',
//       additional_params: {}
//     }
//   })
// })
//   .then(res => res.json())
//   .then(console.log)
//   .catch(console.log)
//

fetch(LOCAL_BASE_URL + 'queries/query', {
  method: 'POST',
  headers: new fetch.Headers({
    'Content-Type': 'application/json'
  }),
  body: JSON.stringify({
    auth_token: companyToken,
    query: {
      type: 'radius',
      center_lat: 45.4773403,
      center_long: 9.2335757,
      radius: 10,
      additional_params: {
        heart_rate: {
          bpm: [81, 86]
        }
      }
    }
  })
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.log)


// fetch(LOCAL_BASE_URL + 'queries/query?' +
//   'auth_token=' + companyToken, {
//   method: 'GET',
//   headers: new fetch.Headers({
//     'Content-Type': 'application/json'
//   })
// })
//   .then(res => res.json())
//   .then(console.log)
//   .catch(console.log)