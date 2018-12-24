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

fetch(HEROKU_BASE_URL + 'queries/query?action=success', {
  method: 'GET'
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.log)