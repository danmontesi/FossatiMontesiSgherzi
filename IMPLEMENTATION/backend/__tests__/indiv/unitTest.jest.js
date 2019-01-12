const {
  toQueryArray
} = require('../../managers/individual/IndividualsManager')

const data = {
  gps_coordinates: [
    {
      lat: 45.4772669,
      long: 9.2343508,
      timestamp: new Date()
    }
  ],
  accelerometer: [
    {
      timestamp: new Date(2014, 0, 1),
      acc_x: -2,
      acc_y: 2.123,
      acc_z: 141
    }, {
      timestamp: new Date(),
      acc_x: -12,
      acc_y: 5.123,
      acc_z: 11
    }
  ],
  heart_rate: [
    {
      timestamp: new Date(2014, 0, 1),
      bpm: 80
    }, {
      timestamp: new Date(),
      bpm: 84
    }
  ]
}

describe('Expected behaviour', () => {

  test('Should return an array with the same data', () => {

    let gps = toQueryArray(1, data.gps_coordinates, 'gps_coordinates')
    let hr = toQueryArray(1, data.heart_rate, 'heart_rate')
    let acc = toQueryArray(1, data.accelerometer, 'accelerometer')

    for (let i of Array(data.gps_coordinates.length).keys()) {
      expect(1).toBe(gps[i][0])
      expect(data.gps_coordinates[i].lat).toBe(gps[i][1])
      expect(data.gps_coordinates[i].long).toBe(gps[i][2])
      expect(data.gps_coordinates[i].timestamp).toBe(gps[i][3])
    }

    for (let i of Array(data.heart_rate.length).keys()) {
      expect(1).toBe(hr[i][0])
      expect(data.heart_rate[i].timestamp).toBe(hr[i][1])
      expect(data.heart_rate[i].bpm).toBe(hr[i][2])
    }

    for (let i of Array(data.accelerometer.length).keys()) {
      expect(1).toBe(acc[i][0])
      expect(data.accelerometer[i].timestamp).toBe(acc[i][1])
      expect(data.accelerometer[i].acc_x).toBe(acc[i][2])
      expect(data.accelerometer[i].acc_y).toBe(acc[i][3])
      expect(data.accelerometer[i].acc_z).toBe(acc[i][4])
    }

  })
})

describe('Bad arguments passed', () => {
  test('Invalid type passed', () => {
    expect(() => toQueryArray(1, data.gps_coordinates, 'a')).toThrow()
  })

  test('Bad data passed', () => {
    expect(() => toQueryArray(1, null, 'individual')).toThrow()
  })

  test('Bad userid passed', () => {
    expect(() => toQueryArray(undefined, data.gps_coordinates, 'individual')).toThrow()
  })

})