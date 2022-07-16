
const PressureModel = require('../models/pressure')

async function newPressure (device, value) {
  const currentDate = new Date()

  const newPressureModel = new PressureModel({
    device,
    value,
    date: currentDate
  })

  return await newPressureModel.save()
}

async function getLastPressure () {
  const lastTemp = await PressureModel.findOne().sort({ field: 'asc', _id: -1 }).limit(1)

  return lastTemp
}

module.exports = {
  newPressure,
  getLastPressure
}
