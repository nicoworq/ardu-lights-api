
const data = require('../data-crawler/index')
const mqttServer = require('../mqtt-server/index')

const getPixels = require('get-pixels')

let isRunning = false

const availableModules = ['crypto', 'time', 'weather', 'forecast', 'image', 'color', 'taxi', 'farma']

let currentModule = 0

async function cycleDisplay () {
  if (isRunning) {
    console.log('task is already running')
    return
  }

  isRunning = true
  switch (availableModules[currentModule]) {
    case 'crypto':
      await showCrypto()
      break
    case 'time':
      showTime()
      break
    case 'weather':
      await showWeather()
      break
    case 'forecast':
      await showForecast()
      break
    case 'image':
      await showImage()
      break
    case 'color':
      await showColor()
      break
    case 'taxi':
      await showTaxi()
      break
    case 'farma':
      await showFarma()
      break
  }
  isRunning = false
  currentModule++
  if (currentModule > availableModules.length - 1) {
    currentModule = 0
  }
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

async function getForecastIcon (weatherId) {
  let fileName = ''
  switch (weatherId) {
    case 200:
    case 201:
    case 202:
    case 210:
    case 211:
    case 212:
    case 221:
    case 230:
    case 231:
    case 232:
      fileName = 'thunder.png'
      break

    case 300:
    case 301:
    case 302:
      fileName = 'drizzle.png'
      break

    case 310:
    case 311:
    case 312:
    case 313:
    case 314:
    case 321:
      fileName = 'drizzle1.png'
      break
    case 500:
      fileName = 'rain0.png'
      break
    case 501:
    case 502:
      fileName = 'rain1.png'
      break
    case 503:
    case 504:
      fileName = 'rain2.png'
      break

    case 701:
    case 711:
    case 721:
    case 731:
    case 741:
    case 761:
      fileName = 'atmosfere.png'
      break

    case 800:
      fileName = 'sun.png'
      break

    case 801:
      fileName = 'cloud1.png'
      break

    case 802:
      fileName = 'cloud2.png'
      break

    case 803:
    case 804:
      fileName = 'cloud3.png'
      break
  }
  return await readImage(`display/weather/${fileName}`)
}

async function showForecast () {
  const days = await data.getWeatherForecast(-32.8833888, -60.6865821)

  for (let i = 0; i < days.length; i++) {
    const icon = await getForecastIcon(days[i].weather)

    mqttServer.sendMessage('/casa/pantalla/pronostico/dia', `${days[i].day}|${days[i].tMin}|${days[i].tMax}|${icon}`)
    await timer(5000)

    if (days[i].precipitation.length) {
      for (let p = 0; p < days[i].precipitation.length; p++) {
        const prob = (days[i].precipitation[p].probability * 100).toFixed(0)
        const time = days[i].precipitation[p].time
        mqttServer.sendMessage('/casa/pantalla/pronostico/precipitacion', `${days[i].day}|${prob}|${time}`)
        await timer(5000)
      }
    }
  }
}

function showTime () {
  const now = new Date()
  const minutes = now.getMinutes() > 9 ? now.getMinutes() : '0' + now.getMinutes()
  const message = now.getHours() + ':' + minutes
  mqttServer.sendMessage('/casa/pantalla/reloj', message)
}

async function showWeather () {
  const currentWeather = await data.getCurrentWeather(-32.8833888, -60.6865821)

  showTemperature(currentWeather)
  await timer(5000)
  showHumidity(currentWeather)
  await timer(5000)
  showPressure(currentWeather)
  await timer(5000)
}

function showTemperature (currentWeather) {
  mqttServer.sendMessage('/casa/pantalla/temperatura', currentWeather.temp)
}

function showPressure (currentWeather) {
  mqttServer.sendMessage('/casa/pantalla/presion', currentWeather.pressure)
}

function showHumidity (currentWeather) {
  mqttServer.sendMessage('/casa/pantalla/humedad', currentWeather.humidity)
}

async function readImage (path) {
  let colorString = ''

  return new Promise((resolve, reject) => {
    getPixels(path, async function (err, pixels) {
      if (err) {
        console.log('Bad image path')
        reject(err)
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

      resolve(colorString.slice(0, -1))
    })
  })
}

async function showImage () {
  const image = await readImage('display/pacman.png')

  mqttServer.sendMessage('/casa/pantalla/imagen', image)
  await timer(5000)
}

async function showColor () {
  mqttServer.sendMessage('/casa/pantalla/color', '#2C3E50')
  await timer(500)
  mqttServer.sendMessage('/casa/pantalla/color', '#494654')
  await timer(500)
  mqttServer.sendMessage('/casa/pantalla/color', '#FD746C')
  await timer(500)
}

async function showTaxi () {
  mqttServer.sendMessage('/casa/pantalla/taxi', 'hola')
}

async function showFarma () {
  mqttServer.sendMessage('/casa/pantalla/farma', 'hola')
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
