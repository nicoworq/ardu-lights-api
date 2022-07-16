
const HumidityModel = require('../models/humidity')

async function newHumidity (device, value) {
  const currentDate = new Date()

  const newHumidityModel = new HumidityModel({
    device,
    value,
    date: currentDate
  })

  return await newHumidityModel.save()
}

async function getLastHumidity () {
  const lastTemp = await HumidityModel.findOne().sort({ field: 'asc', _id: -1 }).limit(1)

  return lastTemp
}

module.exports = {
  newHumidity,
  getLastHumidity
}
