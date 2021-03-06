
const data = require('../data-crawler/index')
const mqttServer = require('../mqtt-server/index')

const temperatureService = require('../web/services/temperature.service')
const humidityService = require('../web/services/humidity.service')
// const pressureService = require('../web/services/pressure.service')

function cycleDisplay () {
  const interval = 60000
  const awaiter = 15000

  setInterval(async () => {
    showTemperature()

    await new Promise(resolve => setTimeout(resolve, awaiter))

    showCrypto()

    await new Promise(resolve => setTimeout(resolve, 20000))

    showTime()

    await new Promise(resolve => setTimeout(resolve, awaiter))

    showHumidity()
  }, interval)
}

function showCrypto () {
  data.getCryptoCurrencies(['ETH', 'BTC']).then((response) => {
    let message = ''
    response.forEach((crypto) => {
      message += crypto.symbol + ':$' + crypto.value + ' >> '
    })
    mqttServer.sendMessage('/casa/pantalla', message)
  })
}

function showTime () {
  const now = new Date()
  const minutes = now.getMinutes() > 9 ? now.getMinutes() : 0 + now.getMinutes()
  const message = now.getHours() + ':' + minutes
  mqttServer.sendMessage('/casa/pantalla/reloj', message)
}

function showTemperature () {
  temperatureService.getLastTemperature().then((temp) => {
    mqttServer.sendMessage('/casa/pantalla/temperatura', (temp.value).toString())
  })
}

function showHumidity () {
  humidityService.getLastHumidity().then((hum) => {
    mqttServer.sendMessage('/casa/pantalla/temperatura', hum.value + '%')
  })
}

module.exports = {
  cycleDisplay
}
