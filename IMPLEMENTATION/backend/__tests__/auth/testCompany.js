const fetch = require('node-fetch')

const {
  runOrganizerToken,
  LOCAL_BASE_URL
} = require('../config')

const jest = require('jest')

// Registration
// fetch(LOCAL_BASE_URL + 'auth/register_company', {
//   method: 'POST',
//   headers: new fetch.Headers({
//     'Content-Type': 'application/json'
//   }),
//   body: JSON.stringify({
//     email: 'francesco.sgherzi.dev@gmail.com',
//     password: 'giannimio',
//     company_name: 'asdf'
//   })
// })
//   .then(res => res.json())
//   .then(console.log)
//   .catch(console.log)

// Login
// fetch(LOCAL_BASE_URL + 'auth/login', {
//   method: 'POST',
//   headers: new fetch.Headers({
//     'Content-Type': 'application/json'
//   }),
//   body: JSON.stringify({
//     email: 'francesco.sgherzi.dev@gmail.com',
//     password: 'giannimio',
//     type: 'company'
//   })
// })
//   .then(res => res.json())
//   .then(console.log)
//   .catch(console.log)

// Login with invalid password
// fetch(LOCAL_BASE_URL + 'auth/login', {
//   method: 'POST',
//   headers: new fetch.Headers({
//     'Content-Type': 'application/json'
//   }),
//   body: JSON.stringify({
//     email: 'francesco.sgherzi.dev@gmail.com',
//     password: 'AAAAAAAA',
//     type: 'company'
//   })
// })
//   .then(res => res.json())
//   .then(res => {
//     console.log(res)
//   })
//   .catch(console.log)

