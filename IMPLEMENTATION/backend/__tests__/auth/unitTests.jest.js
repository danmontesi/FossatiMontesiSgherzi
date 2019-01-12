const {
  checkRequiredParams,
  ACTOR,
  ACTION
} = require('../../managers/authentication/AuthenticationManager')

describe('Actor check of required parameters - REGISTRATION - Wrong', () => {
  test('Should throw an exception due to the missing parameters - Individual', () => {
    expect(() => {
      checkRequiredParams({
        email: 'aaaa0'
      }, ACTOR.INDIVIDUAL, ACTION.REGISTRATION)
    }).toThrow()
  })

  test('Should throw an exception due to the missing parameters - Company', () => {
    expect(() => {
      checkRequiredParams({
        company_name: 'aaaa0',
        password: 'asdf'
      }, ACTOR.COMPANY, ACTION.REGISTRATION)
    }).toThrow()
  })

  test('Should throw an exception due to the missing parameters - Run organizer', () => {
    expect(() => {
      checkRequiredParams({}, ACTOR.RUN_ORGANIZER, ACTION.REGISTRATION)
    }).toThrow()
  })
})

describe('Actor check of required parameters - LOGIN wrong', () => {
  test('Should throw an exception due to the missing parameters - Individual', () => {
    expect(() => {
      checkRequiredParams({
        password: 'a'
      }, ACTOR.INDIVIDUAL, ACTION.REGISTRATION)
    }).toThrow()
  })

  test('Should throw an exception due to the missing parameters - Company', () => {
    expect(() => {
      checkRequiredParams({}, ACTOR.COMPANY, ACTION.REGISTRATION)
    }).toThrow()
  })

  test('Should throw an exception due to the missing parameters - Run organizer', () => {
    expect(() => {
      checkRequiredParams({
        company_name: 'aaaa0',
        password: 'asdf'
      }, ACTOR.RUN_ORGANIZER, ACTION.REGISTRATION)
    }).toThrow()
  })
})

describe('Actor check of required parameters - REGISTRATION - Right', () => {
  test('Parameters not missing - Individual', () => {
    expect(() => {
      checkRequiredParams({
        email: 'a',
        password: 'a',
        SSN: 'a',
        name: 's',
        birthday: new Date(),
        surname: 'a',
        smartwatch: 'a'
      }, ACTOR.INDIVIDUAL, ACTION.REGISTRATION)
    }).not.toThrow()
  })

  test('Parameters not missing - Company', () => {
    expect(() => {
      checkRequiredParams({
        company_name: 'aaaa0',
        email: 'a',
        password: 'asdf'
      }, ACTOR.COMPANY, ACTION.REGISTRATION)
    }).not.toThrow()
  })

  test('Parameters not missing - Run organizer', () => {
    expect(() => {
      checkRequiredParams({
        email: 'a',
        password: 'a',
        name: '2',
        surname: 'asdf'
      }, ACTOR.RUN_ORGANIZER, ACTION.REGISTRATION)
    }).not.toThrow()
  })
})

describe('Actor check of required parameters - LOGIN - Right', () => {
  test('Parameters not missing  - Individual', () => {
    expect(() => {
      checkRequiredParams({
        email: 'a',
        password: 'a',
      }, ACTOR.INDIVIDUAL, ACTION.LOGIN)
    }).not.toThrow()
  })

  test('Parameters not missing  - Company', () => {
    expect(() => {
      checkRequiredParams({
        email: 'a',
        password: 'a'
      }, ACTOR.COMPANY, ACTION.LOGIN)
    }).not.toThrow()
  })

  test('Parameters not missing  - Run organizer', () => {
    expect(() => {
      checkRequiredParams({
        email: 'aaaa0',
        password: 'asdf'
      }, ACTOR.RUN_ORGANIZER, ACTION.LOGIN)
    }).not.toThrow()
  })
})
