const fetch = require('node-fetch')

const LOCAL_BASE_URL = 'http://localhost:12345/'
const HEROKU_BASE_URL = 'https://data4halp.herokuapp.com/'

// fetch(HEROKU_BASE_URL + 'auth/verify?action=invalid_code', {
//   method: 'POST'
// })
//   .then(res => res.json())
//   .then(console.log)
//   .catch(console.log)
// WORKS W MAIL ALREADY IN USE
// fetch(LOCAL_BASE_URL + 'auth/register_user', {
//   method: 'POST',
//   headers: new fetch.Headers({
//     'Content-Type': 'application/json'
//   }),
//   body: JSON.stringify({
//     email: 'francesco.sgherzi@gmail.com',
//     password: 'giannimio',
//     SSN: 'SGHRCM65PD7L858L',
//     name: 'fras',
//     surname: 'Sgherzi',
//     birthday: new Date(),
//     smartwatch: 'Samsung Galaxy BHO',
//   })
// })
//   .then(res => res.json())
//   .then(console.log)
//   .catch(console.log)
//
//
// fetch(LOCAL_BASE_URL + 'auth/login', {
//   method: 'POST',
//   headers: new fetch.Headers({
//     'Content-Type': 'application/json'
//   }),
//   body: JSON.stringify({
//     password: 'giannimio',
//     email: 'francesco.sgherzi@gmail.com',
//     type: 'individual'
//   })
// })
//   .then(res => res.json())
//   .then(console.log)
//   .catch(console.log)

// WORKS W DUPLICATE PASSWORD
/*
fetch(LOCAL_BASE_URL + 'auth/register_company', {
  method: 'POST',
  headers: new fetch.Headers({
    'Content-Type': 'application/json'
  }),
  body: JSON.stringify({
    email: 'asdf@afSPA.com',
    password: 'giannimio',
    company_name: 'asdf',
    type: 'company'
  })
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.log)
*/

/*
fetch(LOCAL_BASE_URL + 'auth/login', {
  method: 'POST',
  headers: new fetch.Headers({
    'Content-Type': 'application/json'
  }),
  body: JSON.stringify({
    email: 'asdf@afSPA.com',
    password: 'giannimio',
    type: 'company'
  })
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.log)
  */

// WORKS
/*
fetch(LOCAL_BASE_URL + 'auth/register_run_organizer', {
  method: 'POST',
  headers: new fetch.Headers({
    'Content-Type': 'application/json'
  }),
  body: JSON.stringify({
    email: 'asdf@afro.com',
    password: 'giannimio',
    name: 'run',
    surname: 'organizer',
    type: 'run_organizer'
  })
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.log)*/

/*

fetch(LOCAL_BASE_URL + 'auth/login', {
  method: 'POST',
  headers: new fetch.Headers({
    'Content-Type': 'application/json'
  }),
  body: JSON.stringify({
    email: 'asdf@afro.com',
    password: 'giannimio',
    type: 'run_organizer'
  })
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.log)*/


// DATA SAVING
/*
fetch(LOCAL_BASE_URL + 'indiv/data', {
  method: 'POST',
  headers: new fetch.Headers({
    'Content-Type': 'application/json'
  }),
  body: JSON.stringify({
    auth_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjIsImVtYWlsIjoiZnJhbmNlc2NvLnNnaGVyemlAZ21haWwuY29tIiwiYmVnaW5fdGltZSI6IjIwMTgtMTItMjhUMjM6MTE6NDIuMTk2WiIsImlhdCI6MTU0NjAzODcwMiwiZXhwIjoxNTQ2MTI1MTAyfQ.1EUgQimBcVagi7LlnDRMFTU4jOvAfiXEDE3x5MGpJxE',
    data: {
      gps_coordinates: [
        {
          lat: 42.1345,
          long: 32.123343,
          timestamp: new Date(2014, 0, 1)
        }, {
          lat: 12.1345,
          long: 39.123343,
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
  .then(res => res.json())
  .then(console.log)
  .catch(console.log)*/
//
fetch(LOCAL_BASE_URL + 'indiv/data' + '?auth_token=' +
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjIsImVtYWlsIjoiZnJhbmNlc2NvLnNnaGVyemlAZ21haWwuY29tIiwiYmVnaW5fdGltZSI6IjIwMTgtMTItMjhUMjM6MTE6NDIuMTk2WiIsImlhdCI6MTU0NjAzODcwMiwiZXhwIjoxNTQ2MTI1MTAyfQ.1EUgQimBcVagi7LlnDRMFTU4jOvAfiXEDE3x5MGpJxE' +
  '&begin_date=' + new Date(2014, 0, 0).toISOString() + '&end_date=' + new Date(2014, 0, 1).toISOString(), {
  method: 'GET',
  headers: new fetch.Headers({
    'Content-Type': 'application/json'
  })
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.log)
