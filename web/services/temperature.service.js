
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

async function getLastTemperature () {
  const lastTemp = await TemperatureModel.findOne().sort({ field: 'asc', _id: -1 }).limit(1)

  return lastTemp
}

module.exports = {
  newTemperature,
  getLastTemperature
}
