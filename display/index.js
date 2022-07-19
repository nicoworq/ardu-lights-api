
const data = require('../data-crawler/index')
const mqttServer = require('../mqtt-server/index')

const temperatureService = require('../web/services/temperature.service')
// const humidityService = require('../web/services/humidity.service')
// const pressureService = require('../web/services/pressure.service')

function cycleDisplay () {
  const interval = 20000
  const awaiter = 5000

  setInterval(async () => {
    showTemperature()

    await new Promise(resolve => setTimeout(resolve, awaiter))

    showCrypto()

    await new Promise(resolve => setTimeout(resolve, awaiter))

    showTime()
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
  const message = now.getHours() + ':' + now.getMinutes()
  mqttServer.sendMessage('/casa/pantalla/reloj', message)
}

function showTemperature () {
  temperatureService.getLastTemperature().then((temp) => {
    mqttServer.sendMessage('/casa/pantalla/temperatura', (temp.value).toString())
  })
}

module.exports = {
  cycleDisplay
}
