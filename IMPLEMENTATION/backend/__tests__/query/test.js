const fetch = require('node-fetch')

const {
  companyToken,
  userToken,
  LOCAL_BASE_URL
} = require('../config')

fetch(LOCAL_BASE_URL + 'queries/query', {
  method: 'POST',
  headers: new fetch.Headers({
    'Content-Type': 'application/json'
  }),
  body: JSON.stringify({
    auth_token: companyToken,
    query: {
      type: 'individual',
      SSN: '1234567890123456',
      additional_params: {}
    }
  })
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.log)
//
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
// fetch(LOCAL_BASE_URL + 'queries/query', {
//   method: 'POST',
//   headers: new fetch.Headers({
//     'Content-Type': 'application/json'
//   }),
//   body: JSON.stringify({
//     auth_token: companyToken,
//     query: {
//       type: 'radius',
//       center_lat: 45.4773403,
//       center_long: 9.2335757,
//       radius: 10,
//       additional_params: {
//         heart_rate: {
//           bpm: [81, 86]
//         }
//       }
//     }
//   })
// })
//   .then(res => res.json())
//   .then(console.log)
//   .catch(console.log)
//

// fetch(LOCAL_BASE_URL + 'queries/query?' +
//   'auth_token=' + companyToken, {
//   method: 'GET',
//   headers: new fetch.Headers({
//     'Content-Type': 'application/json'
//   })
// })
//   .then(res => res.json())
//   .then(r => console.log(r.queries.individual))
//   .catch(console.log)

// fetch(LOCAL_BASE_URL + 'queries/query/data?' +
//   'auth_token=' + companyToken + '&' +
//   'query_id=93', {
//   method: 'GET',
//   headers: new fetch.Headers({
//     'Content-Type': 'application/json'
//   })
// })
//   .then(res => res.json())
//   .then(res => console.log(res.data))
//   .catch(console.log)

// fetch(LOCAL_BASE_URL + 'queries/query/individual/pending?' +
//   'auth_token=' + userToken, {
//   method: 'GET',
//   headers: new fetch.Headers({
//     'Content-Type': 'application/json'
//   })
// })
//   .then(res => res.json())
//   .then(console.log)
//   .catch(console.log)

// fetch(LOCAL_BASE_URL + 'queries/query/individual/pending?' +
//   'auth_token=' + userToken, {
//   method: 'POST',
//   headers: new fetch.Headers({
//     'Content-Type': 'application/json'
//   }),
//   body: JSON.stringify({
//     query_id: 93,
//     decision: true
//   })
// })
//   .then(res => res.json())
//   .then(console.log)
//   .catch(console.log)
