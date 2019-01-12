const fetch = require('node-fetch')

const {
  LOCAL_BASE_URL,
  userToken,
  companyToken
} = require('../config')

const {
  getActor
} = require('../../managers/token/TokenManager')

const {
  connect
} = require('../../managers/config')

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
    // expect(res.queries.individual).not.toBe(undefined)
    // expect(res.queries.radius).not.toBe(undefined)
  })
})

describe('Post an individual query', () => {
  beforeEach(() => jest.setTimeout(50000))

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
          ssn: 'AAAABBBBCCCCDDDD',
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
              bpm: [0, 100]
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

  test('Post an radius query - too restrictive because of additional_param', async () => {
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
          radius: 10,
          additional_params: {
            heart_rate: {
              bpm: [-2, -1]
            },
            accelerometer: {
              acc_x: [-111, -110]
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

})

describe('Perform a query', () => {
  beforeEach(() => jest.setTimeout(50000))

  test('Perform an individual query - correct', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'queries/query/data?' +
      'auth_token=' + companyToken + '&' +
      'query_id=309', {    // const client = await connect()
      // await client.query('DELETE FROM user_data WHERE user_id = 111')
      // await client.release()
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

  test('Perform an individual query - unauthorized', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'queries/query/data?' +
      'auth_token=' + companyToken + '&' +
      'query_id=310', {    // const client = await connect()
      // await client.query('DELETE FROM user_data WHERE user_id = 111')
      // await client.release()
      method: 'GET',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      })
    })
    res = await res.json()
    expect(res.status).toBe(403)
    expect(res.message).toMatch(/User hasn\'t allowed this query!/)
  })

  test('Perform a query - radius', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'queries/query/data?' +
      'auth_token=' + companyToken + '&' +
      'query_id=308', {
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

  beforeEach(() => jest.setTimeout(50000))

  test('User retrives its pending query', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'queries/query/individual/pending?' +
      'auth_token=' + userToken, {
      method: 'GET',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      })
    })
    res = await res.json()
    expect(res.success).toBe(true)
    expect(res.queries).not.toBe(undefined)
  })

  test('User allows a pending individual query', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'queries/query/individual/pending?', {
      method: 'POST',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        query_id: 310,
        auth_token: userToken,
        decision: true
      })
    })
    res = await res.json()
    console.log(res)
    expect(res.success).toBe(true)
    expect(res.message).toBe('Response saved')

    const client = await connect()
    await client.query('UPDATE individual_query SET auth = NULL WHERE id = 310')
    await client.query('DELETE from query_user WHERE user_id = $1 AND query_id = 222', [getActor(userToken).id])
    await client.release()

  })

  test('User negates a pending individual query', async () => {
    let res = await fetch(LOCAL_BASE_URL + 'queries/query/individual/pending', {
      method: 'POST',
      headers: new fetch.Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        auth_token: userToken,
        query_id: 310,
        decision: false
      })
    })
    res = await res.json()
    expect(res.success).toBe(true)
    expect(res.message).toBe('Response saved')
    const client = await connect()
    await client.query('UPDATE individual_query SET auth = NULL WHERE id = 218')
    await client.release()
  })
})


