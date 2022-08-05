
const data = require('../data-crawler/index')
const mqttServer = require('../mqtt-server/index')

const temperatureService = require('../web/services/temperature.service')
const humidityService = require('../web/services/humidity.service')
const pressureService = require('../web/services/pressure.service')

const getPixels = require('get-pixels')

let isRunning = false
async function cycleDisplay () {
  if (isRunning) {
    console.log('task is already running')
    return
  }

  isRunning = true

  await showCrypto()

  await timer(5000)

  showTime()

  await timer(5000)

  showHumidity()

  await timer(5000)

  showTemperature()

  await timer(5000)

  showPressure()

  await timer(5000)

  await showWeather()

  isRunning = false
}

const cryptoStore = {}
async function showCrypto () {
  const messages = await data.getCryptoCurrencies(['ETH', 'BTC']).then((response) => {
    const messages = []
    response.forEach(async (crypto) => {
      let trend = 'up'
      if (cryptoStore !== undefined && crypto.symbol in cryptoStore) {
        // existe

        if (parseFloat(crypto.value) > cryptoStore[crypto.symbol]) {
          trend = 'up'
        } else {
          trend = 'down'
        }
      }
      cryptoStore[crypto.symbol] = crypto.value

      messages.push(crypto.symbol + '|$' + crypto.value + '|' + trend)
    })
    return messages
  })

  for (let i = 0; i < messages.length; i++) {
    console.log(messages[i])
    mqttServer.sendMessage('/casa/pantalla/cotizacion', messages[i])
    await timer(5000)
  }
}

const timer = ms => new Promise(resolve => setTimeout(resolve, ms))

async function showWeather () {
  const days = await data.getWeatherForecast(-32.8833888, -60.6865821)

  for (let i = 0; i < days.length; i++) {
    mqttServer.sendMessage('/casa/pantalla/pronostico/temp', `${days[i].day}|${days[i].tMin}|${days[i].tMax}`)
    await timer(5000)
    if (days[i].precipitation.probability > 10) {
      mqttServer.sendMessage('/casa/pantalla/pronostico/precipitacion', `${days[i].day}|${days[i].precipitation.probability}|${days[i].precipitation.time}`)
      await timer(5000)
    }
  }
}

function showTime () {
  const now = new Date()
  const minutes = now.getMinutes() > 9 ? now.getMinutes() : '0' + now.getMinutes()
  const message = now.getHours() + ':' + minutes
  mqttServer.sendMessage('/casa/pantalla/reloj', message)
}

function showTemperature () {
  temperatureService.getLastTemperature().then((temp) => {
    mqttServer.sendMessage('/casa/pantalla/temperatura', temp.value.toFixed(1))
  })
}

function showPressure () {
  pressureService.getLastPressure().then((press) => {
    mqttServer.sendMessage('/casa/pantalla/presion', press.value.toFixed(1))
  })
}

function showHumidity () {
  humidityService.getLastHumidity().then((hum) => {
    mqttServer.sendMessage('/casa/pantalla/humedad', hum.value.toFixed(0))
  })
}

function showImage () {
  let colorString

  getPixels('display/btc.png', function (err, pixels) {
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

module.exports = {
  cycleDisplay,
  showImage
}
