const IndividualsManager = require('../../../managers/authentication/AuthenticationManager')
const templateRequests = require('./templateRequests')
const requiredParamsMissing = require('./requiredParamsMissing')

const requiredParams = require('../../../managers/authentication/requiredParameters')

const getRandomString = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

describe('Throwing exceptions when constructed with missing parameters', () => {

  test('Empty object - Registration & Login', () => {
    const actionList = ['registration', 'login']
    const actorList = [
      'individual',
      'company',
      'run_organizer'
    ]

    actionList.forEach(action => {
      actorList.forEach(actor => {
        expect(() => {
          new IndividualsManager({}, actor, action)
        }).toThrowError(/Missing /)
      })
    })
  })

  test('Some missing parameters - Login & Rogistration', () => {
    const actionList = [
      'login',
      'registration'
    ]

    const actorList = [
      'individual',
      'company',
      'run_organizer'
    ]

    actionList.forEach(action => {
      actorList.forEach(actor => {
        expect(() => {
          let templateRequest = {}
          requiredParamsMissing[actor][action].forEach(param => {
            templateRequest[param] = getRandomString()
          })
          new IndividualsManager(templateRequest, actor, action)
        }).toThrowError(/Missing/)
      })
    })
  })

})

describe('Properly removing unwanted parameters from request object', () => {
  test('Additional parameters - Registration', () => {
    const actionList = ['registration', 'login']
    const actorList = [
      'individual',
      'company',
      'run_organizer'
    ]

    actionList.forEach(action => {
      actorList.forEach(actor => {
        expect(Object.keys(
          new IndividualsManager(
            templateRequests['object_params'][action][actor],
            actor,
            action
          ).toJSON()
        )).toEqual(Object.keys(templateRequests['object_params'][action][actor]))
      })
    })
  })
})

