const temperatureService = require('../web/services/temperature.service')

function saveTemperature (message, device) {
  const value = parseFloat(message.payload.toString())
  temperatureService.newTemperature(device, value)
}

module.exports = {
  saveTemperature
}
