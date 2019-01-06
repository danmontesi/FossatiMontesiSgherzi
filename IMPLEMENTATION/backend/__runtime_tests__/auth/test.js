const fetch = require('node-fetch')
const jwt = require('jsonwebtoken')
const LOCAL_BASE_URL = 'http://localhost:12345/'
const HEROKU_BASE_URL = 'https://data4halp.herokuapp.com/'

const TEMPLATE_VERIFICATION_STRING = 'mail=georgemesaclooney@gmail.com&code=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODAsImVtYWlsIjoiZ2VvcmdlbWVzYWNsb29uZXlAZ21haWwuY29tIiwiYmVnaW5fdGltZSI6IjIwMTktMDEtMDZUMjI6Mjc6MDEuMTk1WiIsImlhdCI6MTU0NjgxMzYyMSwiZXhwIjoxNTQ2OTAwMDIxfQ.QGl75wqKnBcB8nKGvE8ZgdsKHTKs4pQHjVOrC-LyS6o&type=individual'

// Test proper registration
// fetch(LOCAL_BASE_URL + 'auth/register_user', {
//   method: 'POST',
//   headers: new fetch.Headers({
//     'Content-Type': 'application/json'
//   }),
//   body: JSON.stringify({
//     email: 'georgemesaclooney@gmail.com',
//     password: 'asdfasdf',
//     SSN: 'AAAABBBBCCCCDDDD',
//     name: 'George',
//     surname: 'Clooney',
//     birthday: new Date(),
//     smartwatch: 'TEST Smartwatch'
//   })
// })
//   .then(res => res.json())
//   .then(console.log)
//   .catch(console.log())

// Verify the token user
// fetch(LOCAL_BASE_URL + 'auth/verify?' + TEMPLATE_VERIFICATION_STRING)
//   .then(res => res.json())
//   .then(console.log)
//   .catch(console.log)

// Login
fetch(LOCAL_BASE_URL + 'auth/login', {
  method: 'POST',
  headers: new fetch.Headers({
    'Content-Type': 'application/json'
  }),
  body: JSON.stringify({
    password: 'giannimio',
    email: 'francesco.sgherzi@gmail.com',
    type: 'individual'
  })
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.log)

