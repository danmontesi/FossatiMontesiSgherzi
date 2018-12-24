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

fetch(LOCAL_BASE_URL + 'auth/register_user', {
  method: 'POST',
  headers: new fetch.Headers({
    'Content-Type': 'application/json'
  }),
  body: JSON.stringify({
    mail: 'asdf@asdf.com',
    password: 'giannimio',
    SSN: 'SGHRCM65P07L858H',
    name: 'fra',
    surname: 'Sgherzi',
    birthday: new Date(),
    smartwatch: 'Samsung Galaxy BHO'
  })
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.log)