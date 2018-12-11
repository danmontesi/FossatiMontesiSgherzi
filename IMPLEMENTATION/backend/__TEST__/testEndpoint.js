const fetch = require('node-fetch')

fetch('http://localhost:12345/auth/login?action=user_not_found', {
  method: 'post'
})
  .then(res => res.json())
  .then(console.log)