const fetch = require('node-fetch')

const {
  connect
} = require('../../managers/config')

const {
  LOCAL_BASE_URL,
  userToken,
  companyToken
} = require('../config')

describe('Retrive company queries', () => {

  beforeEach(() => jest.setTimeout(50000))

  test('Retrieve company queries', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'queries/query?' +
      'auth_token=' + companyToken, {
      method: 'GET',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      })
    })
    res = await res.json()
    expect(res.success).toBe(true)
    expect(res.queries).not.toBe(undefined)
    expect(res.queries.individual).not.toBe(undefined)
    expect(res.queries.radius).not.toBe(undefined)
  })
})

describe('Post an individual query', () => {
  test('Post an individual query - correct', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'queries/query', {
      method: 'POST',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        auth_token: companyToken,
        query: {
          type: 'individual',
          ssn: 'SGHRCM65PD7L858L',
          additional_params: {}
        }
      })
    })
    res = await res.json()
    expect(res.success).toBe(true)
    expect(res.message).toBe('Query successfully posted')
    expect(res.query_id).not.toBe(undefined)
  })

  test('Post an individual query - missing params', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'queries/query', {
      method: 'POST',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        auth_token: companyToken,
        query: {
          type: 'individual',
          additional_params: {}
        }
      })
    })
    res = await res.json()
    expect(res.status).toBe(400)
    expect(res.message).toMatch(/Missing /)
  })

  test('Post an individual query - Invalid ssn or non existent user', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'queries/query', {
      method: 'POST',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        auth_token: companyToken,
        query: {
          type: 'individual',
          ssn: '-1',
          additional_params: {}
        }
      })
    })
    res = await res.json()
    expect(res.status).toBe(404)
    expect(res.message).toBe('User not found')
  })

})

describe('Post an radius query', () => {

  beforeEach(() => jest.setTimeout(50000))

  test('Post an radius query - correct', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'queries/query', {
      method: 'POST',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        auth_token: companyToken,
        query: {
          type: 'radius',
          center_lat: 45.4773403,
          center_long: 9.2335757,
          radius: 100,
          additional_params: {
            heart_rate: {
              bpm: [81, 86]
            }
          }
        }
      })
    })
    res = await res.json()
    console.log(res)
    expect(res.success).toBe(true)
    expect(res.message).toBe('Query successfully posted')
    expect(res.query_id).not.toBe(undefined)
  })

  test('Post an radius query - too restrictive', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'queries/query', {
      method: 'POST',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        auth_token: companyToken,
        query: {
          type: 'radius',
          center_lat: 0.0,
          center_long: 0.0,
          radius: 10,
          additional_params: {
            heart_rate: {
              bpm: [81, 86]
            }
          }
        }
      })
    })
    res = await res.json()
    expect(res.status).toBe(422)
    expect(res.message).toBe('Query too restrictive')
  })

  test('Post a radius query - missing params', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'queries/query', {
      method: 'POST',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        auth_token: companyToken,
        query: {
          type: 'radius',
          center_lat: 45.4773403,
          radius: 10
        }
      })
    })
    res = await res.json()
    expect(res.status).toBe(400)
    expect(res.message).toMatch(/Missing /)
  })

  test('Post an individual query - Invalid ssn or non existent user', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'queries/query', {
      method: 'POST',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        auth_token: companyToken,
        query: {
          type: 'individual',
          ssn: '-1',
          additional_params: {}
        }
      })
    })
    res = await res.json()
    expect(res.status).toBe(404)
    expect(res.message).toBe('User not found')
  })

})

describe('Perform a query', () => {
  test('Perform an individual query - correct', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'queries/query/data?' +
      'auth_token=' + companyToken + '&' +
      'query_id=169', {
      method: 'GET',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      })
    })
    res = await res.json()
    expect(res.success).toBe(true)
    expect(res.data).not.toBe(undefined)
    expect(res.user).not.toBe(undefined)
  })

  test('Perform a query - radius', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'queries/query/data?' +
      'auth_token=' + companyToken + '&' +
      'query_id=73', {
      method: 'GET',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      })
    })
    res = await res.json()
    expect(res.success).toBe(true)
    expect(res.data).not.toBe(undefined)
    // User must be undefined in order for the query to be anonymized
    expect(res.user).toBe(undefined)
  })

})

describe('Pending individual queries', () => {
  test('User retrives its pending query', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'queries/query/individual/pending?' +
      'auth_token=' + userToken, {
      method: 'GET',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      })
    })
    res = await res.json()
    console.log(res)
    expect(res.success).toBe(true)
    expect(res.queries).not.toBe(undefined)
  })
  // test('User allows a pending individual query', async () => {
  //   let res = await fetch(LOCAL_BASE_URL + 'queries/query/individual/pending?', {
  //     method: 'POST',
  //     headers: new fetch.Headers({
  //       'Content-Type': 'application/json'
  //     }),
  //     body: JSON.stringify({
  //       query_id: 201,
  //       auth_token: userToken,
  //       decision: true
  //     })
  //   })
  //   res = await res.json()
  //   console.log(res)
  //   expect(res.success).toBe(true)
  //   expect(res.message).toBe('Response saved')
  //
  // })
  //
  // test('User negates a pending individual query', async () => {
  //   let res = await fetch(LOCAL_BASE_URL + 'queries/query/individual/pending', {
  //     method: 'POST',
  //     headers: new fetch.Headers({
  //       'Content-Type': 'application/json'
  //     }),
  //     body: JSON.stringify({
  //       auth_token: userToken,
  //       query_id: 162,
  //       decision: false
  //     })
  //   })
  //   res = await res.json()
  //   expect(res.success).toBe(true)
  //   expect(res.message).toBe('Response saved')
  //
  // })

})


