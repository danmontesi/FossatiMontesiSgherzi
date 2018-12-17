const fetch = require('node-fetch')

fetch('https://data4halp.herokuapp.com/auth/login?action=user_not_found', {
  method: 'POST'
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.log)