const fetch = require('node-fetch')

const LOCAL_BASE_URL = 'http://localhost:12345/'
const HEROKU_BASE_URL = 'https://data4halp.herokuapp.com/'

const companyToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjMsImVtYWlsIjoiZnJhbmNlc2NvLnNnaGVyemkuZGV2QGdtYWlsLmNvbSIsImJlZ2luX3RpbWUiOiIyMDE4LTEyLTMwVDE2OjIzOjIzLjMzM1oiLCJpYXQiOjE1NDYxODcwMDMsImV4cCI6MTU0NjI3MzQwM30._Kkrei7_DKT4fLt8zFyq5WZvYwu_I0ZML_d7xJHEOQU'
const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjIsImVtYWlsIjoiZnJhbmNlc2NvLnNnaGVyemlAZ21haWwuY29tIiwiYmVnaW5fdGltZSI6IjIwMTgtMTItMjhUMjM6MTE6NDIuMTk2WiIsImlhdCI6MTU0NjAzODcwMiwiZXhwIjoxNTQ2MTI1MTAyfQ.1EUgQimBcVagi7LlnDRMFTU4jOvAfiXEDE3x5MGpJxE'
const runOrganizerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjQsImVtYWlsIjoiZnJhbmNlc2NvLnNnaGVyemlAdG9ycmVzY2FsbGEuaXQiLCJiZWdpbl90aW1lIjoiMjAxOC0xMi0zMFQxODoxNjo0Ny44NTBaIiwiaWF0IjoxNTQ2MTkzODA3LCJleHAiOjE1NDYyODAyMDd9.TILAsVZAlfa2ihRlH-s0f6bstYGxPjwYQPWuiA5ifRw'

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
// fetch(LOCAL_BASE_URL + 'auth/register_company', {
//   method: 'POST',
//   headers: new fetch.Headers({
//     'Content-Type': 'application/json'
//   }),
//   body: JSON.stringify({
//     email: 'francesco.sgherzi.dev@gmail.com',
//     password: 'giannimio',
//     company_name: 'asdf',
//     type: 'company'
//   })
// })
//   .then(res => res.json())
//   .then(console.log)
//   .catch(console.log)
//
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

// WORKS
// fetch(LOCAL_BASE_URL + 'auth/register_run_organizer', {
//   method: 'POST',
//   headers: new fetch.Headers({
//     'Content-Type': 'application/json'
//   }),
//   body: JSON.stringify({
//     email: '10493184@polimi.it',
//     password: 'giannimio',
//     name: 'Fra',
//     surname: 'Sghe',
//   })
// })
//   .then(res => res.json())
//   .then(console.log)
//   .catch(console.log)

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
// fetch(LOCAL_BASE_URL + 'indiv/data', {
//   method: 'POST',
//   headers: new fetch.Headers({
//     'Content-Type': 'application/json'
//   }),
//   body: JSON.stringify({
//     auth_token: userToken,
//     data: {
//       gps_coordinates: [
//         {
//           lat: 45.4772669,
//           long: 9.2343508,
//           timestamp: new Date()
//         }
//       ],
//       accelerometer: [
//         {
//           timestamp: new Date(2014, 0, 1),
//           acc_x: -2,
//           acc_y: 2.123,
//           acc_z: 141
//         }, {
//           timestamp: new Date(),
//           acc_x: -12,
//           acc_y: 5.123,
//           acc_z: 11
//         }
//       ],
//       heart_rate: [
//         {
//           timestamp: new Date(2014, 0, 1),
//           bpm: 80
//         }, {
//           timestamp: new Date(),
//           bpm: 84
//         }
//       ]
//     }
//   })
// })
//   .then(res => res.json())
//   .then(console.log)
//   .catch(console.log)
//
// fetch(LOCAL_BASE_URL + 'indiv/data' + '?auth_token=' +
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjIsImVtYWlsIjoiZnJhbmNlc2NvLnNnaGVyemlAZ21haWwuY29tIiwiYmVnaW5fdGltZSI6IjIwMTgtMTItMjhUMjM6MTE6NDIuMTk2WiIsImlhdCI6MTU0NjAzODcwMiwiZXhwIjoxNTQ2MTI1MTAyfQ.1EUgQimBcVagi7LlnDRMFTU4jOvAfiXEDE3x5MGpJxE' +
//   '&begin_date=' + new Date(2014, 0, 0).toISOString() + '&end_date=' + new Date(2014, 0, 1).toISOString(), {
//   method: 'GET',
//   headers: new fetch.Headers({
//     'Content-Type': 'application/json'
//   })
// })
//   .then(res => res.json())
//   .then(console.log)
//   .catch(console.log)
// INDIVIDUAL QUERY
// fetch(LOCAL_BASE_URL + 'queries/query', {
// 	method: 'POST',
// 	headers: new fetch.Headers({
// 		'Content-Type': 'application/json'
// 	}),
// 	body: JSON.stringify({
// 		auth_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjIsImVtYWlsIjoiZnJhbmNlc2NvLnNnaGVyemlAZ21haWwuY29tIiwiYmVnaW5fdGltZSI6IjIwMTgtMTItMjhUMjM6MTE6NDIuMTk2WiIsImlhdCI6MTU0NjAzODcwMiwiZXhwIjoxNTQ2MTI1MTAyfQ.1EUgQimBcVagi7LlnDRMFTU4jOvAfiXEDE3x5MGpJxE',
// 		query: {
// 			type: 'individual',
// 			SSN: 'ASDFASDFASDFASDF'
// 		}
// 	})
// })
// .then(res => res.json())
// .then(console.log)
// .catch(console.log)

// AGE QUERY
// fetch(LOCAL_BASE_URL + 'queries/query', {
// 	method: 'POST',
// 	headers: new fetch.Headers({
// 		'Content-Type': 'application/json'
// 	}),
// 	body: JSON.stringify({
// 		auth_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjMsImVtYWlsIjoiZnJhbmNlc2NvLnNnaGVyemkuZGV2QGdtYWlsLmNvbSIsImJlZ2luX3RpbWUiOiIyMDE4LTEyLTMwVDE2OjIzOjIzLjMzM1oiLCJpYXQiOjE1NDYxODcwMDMsImV4cCI6MTU0NjI3MzQwM30._Kkrei7_DKT4fLt8zFyq5WZvYwu_I0ZML_d7xJHEOQU',
// 		query: {
// 			type: 'age',
// 			min_age: 11,
// 			max_age: 22
// 		}
// 	})
// })
// .then(res => res.json())
// .then(console.log)
// .catch(console.log)

// REGIONAL QUERY
// fetch(LOCAL_BASE_URL + 'queries/query', {
// 	method: 'POST',
// 	headers: new fetch.Headers({
// 		'Content-Type': 'application/json'
// 	}),
// 	body: JSON.stringify({
// 		auth_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjMsImVtYWlsIjoiZnJhbmNlc2NvLnNnaGVyemkuZGV2QGdtYWlsLmNvbSIsImJlZ2luX3RpbWUiOiIyMDE4LTEyLTMwVDE2OjIzOjIzLjMzM1oiLCJpYXQiOjE1NDYxODcwMDMsImV4cCI6MTU0NjI3MzQwM30._Kkrei7_DKT4fLt8zFyq5WZvYwu_I0ZML_d7xJHEOQU',
// 		query: {
// 			type: 'regional',
// 			region: 'Abruzzi'
// 		}
// 	})
// })
// .then(res => res.json())
// .then(console.log)
// .catch(console.log)

// RADIUS QUERY
// fetch(LOCAL_BASE_URL + 'queries/query', {
// 	method: 'POST',
// 	headers: new fetch.Headers({
// 		'Content-Type': 'application/json'
// 	}),
// 	body: JSON.stringify({
// 		auth_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjMsImVtYWlsIjoiZnJhbmNlc2NvLnNnaGVyemkuZGV2QGdtYWlsLmNvbSIsImJlZ2luX3RpbWUiOiIyMDE4LTEyLTMwVDE2OjIzOjIzLjMzM1oiLCJpYXQiOjE1NDYxODcwMDMsImV4cCI6MTU0NjI3MzQwM30._Kkrei7_DKT4fLt8zFyq5WZvYwu_I0ZML_d7xJHEOQU',
// 		query: {
// 			type: 'radius',
// 			center_lat: 23.14,
// 			center_long: 151,
// 			radius: 1
// 		}
// 	})
// })
// .then(res => res.json())
// .then(console.log)
// .catch(console.log)

//QUERY RETRIVAL - Should give unauthorized
// fetch(LOCAL_BASE_URL + 'queries/query?' +
// 	'auth_token=' + userToken, {
// 	method: 'GET',
// 	headers: new fetch.Headers({
// 		'Content-Type': 'application/json'
// 	})
// })
// .then(res => res.json())
// .then(console.log)
// .catch(console.log)


// QUERY RETRIVAL
// fetch(LOCAL_BASE_URL + 'queries/query?' +
// 	'auth_token=' + companyToken, {
// 	method: 'GET',
// 	headers: new fetch.Headers({
// 		'Content-Type': 'application/json'
// 	})
// })
// .then(res => res.json())
// .then(console.log)
// .catch(console.log)

// CREATE RUN
//
// fetch(LOCAL_BASE_URL + 'runs/run?', {
//   method: 'POST',
//   headers: new fetch.Headers({
//     'Content-Type': 'application/json'
//   }),
//   body: JSON.stringify({
//     auth_token: runOrganizerToken,
//     time_begin: new Date(),
//     time_end: new Date(),
//     description: 'Unbelievably, a run',
//     coordinates: [
//       {
//         lat: 45.4773403,
//         long: 9.2335757,
//         description: 'Torrescalla\'s position'
//       },
//       {
//         lat: 45.477022,
//         long: 9.2338068,
//         description: 'Torrescalla\'s position, but, unbelivably, 10mt ahead'
//       }
//     ]
//   })
// })
//   .then(res => res.json())
//   .then(console.log)
//   .catch(console.log)


//Get all runs
// fetch(LOCAL_BASE_URL + 'runs?' +
// 	'auth_token=' + userToken,
// 	{
// 		method: 'GET',
// 		headers: new fetch.Headers({
// 			'Content-Type': 'application/json'
// 		}),
// 	})
// .then(res => res.json())
// .then(console.log)
// .catch(console.log)

// fetch(LOCAL_BASE_URL + 'runs/join',
// 	{
// 		method: 'POST',
// 		headers: new fetch.Headers({
// 			'Content-Type': 'application/json'
// 		}),
// 		body: JSON.stringify({
// 			auth_token: userToken,
// 			run_id: '12637489'
// 		})
// 	})
// .then(res => res.json())
// .then(console.log)
// .catch(console.log)


// fetch(LOCAL_BASE_URL + 'runs/positions?' +
// 	'auth_token=' + userToken + '&' +
// 	'run_id=' + 22,
// 	{
// 		method: 'GET',
// 		headers: new fetch.Headers({
// 			'Content-Type': 'application/json'
// 		}),
// 	})
// .then(res => res.json())
// .then(console.log)
// .catch(console.log)

// fetch(LOCAL_BASE_URL + 'runs/positions?' +
// 	'auth_token=' + runOrganizerToken,
// 	{
// 		method: 'POST',
// 		headers: new fetch.Headers({
// 			'Content-Type': 'application/json'
// 		}),
// 		body: JSON.stringify({
// 			run_id: 15,
// 			positions: [{
// 				runner: 12345678,
// 				position: 314
// 			}]
// 		})
// 	})
// .then(res => res.json())
// .then(console.log)
// .catch(console.log)

// Fetching user
// fetch(LOCAL_BASE_URL + 'indiv/user?'
//   + 'auth_token=' + userToken,
//   {
//     method: 'GET',
//     headers: new fetch.Headers({
//       'Content-Type': 'application/json'
//     })
//   })
//   .then(res => res.json())
//   .then(console.log)
//   .catch(console.log)

// Fetching non existing user
// fetch(LOCAL_BASE_URL + 'indiv/user?'
//   + 'auth_token=' + 'userToken',
//   {
//     method: 'GET',
//     headers: new fetch.Headers({
//       'Content-Type': 'application/json'
//     })
//   })
//   .then(res => res.json())
//   .then(console.log)
//   .catch(console.log)

// fetch(LOCAL_BASE_URL + 'runs?'
//   + 'auth_token=' + userToken + '&'
//   + 'organizer_id=64',
//   {
//     method: 'GET',
//     headers: new fetch.Headers({
//       'Content-Type': 'application/json'
//     })
//   })
//   .then(res => res.json())
//   .then(res => console.log(res.runs[0].path))
//   .catch(console.log)