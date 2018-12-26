const fetch = require('node-fetch')

const LOCAL_BASE_URL = 'http://localhost:12345/'
const HEROKU_BASE_URL = 'https://data4halp.herokuapp.com/'

/*
fetch(HEROKU_BASE_URL + 'auth/verify?action=invalid_code', {
  method: 'POST'
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.log)*/
// WORKS W MAIL ALREADY IN USE
/*
fetch(LOCAL_BASE_URL + 'auth/register_user', {
  method: 'POST',
  headers: new fetch.Headers({
    'Content-Type': 'application/json'
  }),
  body: JSON.stringify({
    email: 'francesco.sgherzi@gmail.com',
    password: 'giannimio',
    username: 'blablabla',
    SSN: 'SGHRCM65PD7L858L',
    name: 'fras',
    surname: 'Sgherzi',
    birthday: new Date(),
    smartwatch: 'Samsung Galaxy BHO',
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
    password: 'giannimio',
    username: 'blablabla',
    type: 'individual'
  })
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.log)
*/

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
    auth_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDUsImVtYWlsIjoiZnJhbmNlc2NvLnNnaGVyemlAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMDgkMjJmY04wbFhVUzY2aWxJN3k1bDZkdUpVLlpYQk9hNGZ2MS5SaVc5czBRV2VSTUVYWDJBRW0iLCJiZWdpbl90aW1lIjoiMjAxOC0xMi0yNlQwMDoxODowNy45MTFaIiwiaWF0IjoxNTQ1NzgzNDg3LCJleHAiOjE1NDU4Njk4ODd9.kC5z1bi4sZEDBxKqyYKUc2q3v6fG2AZoJnXy8YJXKCc',
    data: {
      gps_coordinates: [
        {
          lat: 42.1345,
          long: 32.123343,
          timestamp: new Date()
        }, {
          lat: 12.1345,
          long: 39.123343,
          timestamp: new Date()
        }
      ],
      accelerometer: [
        {
          timestamp: new Date(),
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
          timestamp: new Date(),
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
*/


/*
fetch(LOCAL_BASE_URL + 'indiv/data' + '?auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDUsImVtYWlsIjoiZnJhbmNlc2NvLnNnaGVyemlAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMDgkMjJmY04wbFhVUzY2aWxJN3k1bDZkdUpVLlpYQk9hNGZ2MS5SaVc5czBRV2VSTUVYWDJBRW0iLCJiZWdpbl90aW1lIjoiMjAxOC0xMi0yNlQwMDoxODowNy45MTFaIiwiaWF0IjoxNTQ1NzgzNDg3LCJleHAiOjE1NDU4Njk4ODd9.kC5z1bi4sZEDBxKqyYKUc2q3v6fG2AZoJnXy8YJXKCc', {
  method: 'GET',
  headers: new fetch.Headers({
    'Content-Type': 'application/json'
  })
})
  .then(res => res.json())
  .then(data => console.log(data.data))
  .catch(console.log)*/
