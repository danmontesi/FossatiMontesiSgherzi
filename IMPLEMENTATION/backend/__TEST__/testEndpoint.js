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
fetch(HEROKU_BASE_URL + 'auth/register_user', {
  method: 'POST',
  headers: new fetch.Headers({
    'Content-Type': 'application/json'
  }),
  body: JSON.stringify({
    email: 'francesco.sgherzi@gmail.com',
    password: 'giannimio',
    SSN: 'SGHRCM65PD7L858L',
    name: 'fras',
    surname: 'Sgherzia',
    birthday: new Date(),
    smartwatch: 'Samsung Galaxy BHO'
  })
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.log)
*/


fetch(LOCAL_BASE_URL + 'auth/login', {
  method: 'POST',
  headers: new fetch.Headers({
    'Content-Type': 'application/json'
  }),
  body: JSON.stringify({
    email: 'francesco.sgherzi@gmail.com',
    password: 'giannimio',
    type: 'individual'
  })
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.log)


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
  .catch(console.log)*/

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
