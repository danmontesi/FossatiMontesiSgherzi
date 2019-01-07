const fetch = require('node-fetch')

const {
  runOrganizerToken,
  LOCAL_BASE_URL
} = require('../config')

// Registration
fetch(LOCAL_BASE_URL + 'auth/register_run_organizer', {
  method: 'POST',
  headers: new fetch.Headers({
    'Content-Type': 'application/json'
  }),
  body: JSON.stringify({
    email: '10493184@polimi.it',
    password: 'giannimio',
    name: 'Fra',
    surname: 'Sghe'
  })
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.log)

// Login
// fetch(LOCAL_BASE_URL + 'auth/login', {
//   method: 'POST',
//   headers: new fetch.Headers({
//     'Content-Type': 'application/json'
//   }),
//   body: JSON.stringify({
//     email: '10493184@polimi.it',
//     password: 'giannimio',
//     type: 'run_organizer'
//   })
// })
//   .then(res => res.json())
//   .then(console.log)
//   .catch(console.log)