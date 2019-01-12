const {
  checkQueryParams
} = require('../../managers/query/QueriesManager')

describe('Valid query', () => {
  test('Individual', () => {
    expect(() =>
      checkQueryParams(
        {
          ssn: 'AAA',
          type: 'individual'
        }
      )
    ).not.toThrow()
  })

  test('Radius', () => {
    expect(() => {
      checkQueryParams(
        {
          'center_lat': 1234,
          'center_long': 4321,
          'radius': 1,
          'type': 'radius'
        }
      )
    }).not.toThrow()
  })
})

describe('missing params', () => {
  test('Individual', () => {
    expect(() => checkQueryParams(
      {
        ssn: 'AAA'
      }
    )).toThrow()
  })

  test('Radius', () => {
    expect(() => checkQueryParams(
      {
        'center_long': 4321
      })
    ).toThrow()
  })


  test('Empty', () => {
    expect(() => checkQueryParams(
      {})
    ).toThrow()
  })

})
