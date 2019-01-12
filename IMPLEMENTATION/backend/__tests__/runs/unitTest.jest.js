const {
  getRunParamsFromRequest,
  isRunInRange
} = require('../../managers/runs/RunManager')

const reqBody = {
  auth_token: ' reqBody.auth_token',
  time_begin: new Date(),
  time_end: new Date(),
  description: "reqBody.description 'OR 1 = 1;--",
  coordinates: []}

describe('Extrapolate run parameters from request', () => {
  test('With a correct request body', () => {
    expect(() => {
      getRunParamsFromRequest(reqBody)
    }).not.toThrow()

    let unpacked = getRunParamsFromRequest(reqBody)

    expect(unpacked.authToken).toBe(reqBody.auth_token)
    expect(unpacked.startTime).toBe(reqBody.time_begin)
    expect(unpacked.endTime).toBe(reqBody.time_end)
    expect(unpacked.description).toBe(reqBody.description)
    expect(unpacked.path).toBe(reqBody.coordinates)

  })

  test('With an incorrect request body', () => {
    expect(() => {
      getRunParamsFromRequest({
        auth_token: ' reqBody.auth_token',
        time_end: new Date(),
        description: 'reqBody.description',
        coordinates: []
      })
    }).toThrow()
  })
})

describe('Run in range', () => {

  test('Empty parameters', () => {
    expect(() => isRunInRange({}, {})).toThrow()
  })

  test('Run is in range with default radius', () => {
    expect(isRunInRange([
      {
        lat: 1,
        long: 1
      },
      {
        lat: 1.0001,
        long: 1.0001
      }
    ], {
      lat: 1.00005,
      long: 1.00005
    })).toBe(true)
  })


  test('Run is in range with specified radius [km]', () => {
    expect(isRunInRange([
      {
        lat: 1,
        long: 1
      },
      {
        lat: 1.0001,
        long: 1.0001
      }
    ], {
      lat: 1.1,
      long: 1.1
    }, 1000)).toBe(true)
  })

  test('Run is not in range with specified radius [km]', () => {
    expect(isRunInRange([
      {
        lat: 1,
        long: 1
      },
      {
        lat: 1.0001,
        long: 22
      }
    ], {
      lat: 1.1,
      long: 1.1
    }, 1000)).toBe(false)

  })


  test('Run is not in range with default radius', () => {
    expect(isRunInRange([
      {
        lat: 1,
        long: 1
      },
      {
        lat: 1.0001,
        long: 22
      }
    ], {
      lat: 1.1,
      long: 1.1
    })).toBe(false)
  })

})