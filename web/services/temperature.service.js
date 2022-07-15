
const TemperatureModel = require('../models/temperature')

async function newTemperature (device, value) {
  const currentDate = new Date()

  const newTemperatureModel = new TemperatureModel({
    device,
    value,
    date: currentDate
  })

  return await newTemperatureModel.save()
}

module.exports = {
  newTemperature
}
