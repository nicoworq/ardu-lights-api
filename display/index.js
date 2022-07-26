
const data = require('../data-crawler/index')
const mqttServer = require('../mqtt-server/index')

const temperatureService = require('../web/services/temperature.service')
const humidityService = require('../web/services/humidity.service')
// const pressureService = require('../web/services/pressure.service')

const getPixels = require('get-pixels')

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

function showImage () {
  let colorString

  getPixels('display/pacman.png', function (err, pixels) {
    if (err) {
      console.log('Bad image path')
      return
    }
    // console.log(pixels)
    for (let x = 0; x < pixels.shape[0]; x++) {
      for (let y = 0; y < pixels.shape[1]; y++) {
        const r = pixels.get(x, y, 0)
        const g = pixels.get(x, y, 1)
        const b = pixels.get(x, y, 2)

        // const rgb = `color: rgb(${r}, ${g}, ${b});`

        colorString += rgbToHex(r, g, b) + ','
      }
    }
    console.log(colorString)
  })
}

function componentToHex (c) {
  if (c === undefined) {
    return '00'
  }
  const hex = c.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

function rgbToHex (r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

showImage()
module.exports = {
  cycleDisplay
}
