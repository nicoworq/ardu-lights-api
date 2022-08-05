const https = require('https')

function getCryptoCurrencies (simbols) {
  const cryptoSimbolsString = simbols.join(',')

  return new Promise((resolve, reject) => {
    https.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + cryptoSimbolsString + '&tsyms=USD', (response) => {
      response.setEncoding('utf8')
      let rawData = ''
      response.on('data', (chunk) => { rawData += chunk })
      response.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData)

          const cryptoData = []

          Object.entries(parsedData).forEach((key) => {
            const symbol = key[0]
            const value = Math.trunc(key[1].USD).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')

            cryptoData.push({ symbol, value })
          })

          resolve(cryptoData)
        } catch (e) {
          reject(e.message)
          console.error()
        }
      })
    })
  })
}

function getWeatherForecast (lat, long) {
  const apiUrl = process.env.WEATHER_URL
  const apiKey = process.env.WEATHER_KEY

  const url = `${apiUrl}?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric&lang=es`

  const daysOfWeek = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM']

  // https://api.openweathermap.org/data/2.5/forecast?lat=-32.8833888&lon=-60.6865821&appid=bb1b19635789799413663a3d820a3b32&units=metric&lang=es

  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      response.setEncoding('utf8')
      let rawData = ''
      response.on('data', (chunk) => { rawData += chunk })
      response.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData)

          const dates = {}
          parsedData.list.forEach(day => {
            const date = day.dt_txt.split(' ')[0]

            if (dates[date] === undefined) {
              dates[date] = {}
            }

            if (dates[date].precipitation === undefined) {
              dates[date].precipitation = []
            }

            const precipitationTime = new Date(day.dt * 1000)
            dates[date].precipitation.push({ probability: day.pop, time: precipitationTime.getHours() + ':' + '0' + precipitationTime.getMinutes() })

            if (dates[date].tMin === undefined) {
              dates[date].tMin = []
            }
            dates[date].tMin.push(day.main.temp_min)

            if (dates[date].tMax === undefined) {
              dates[date].tMax = []
            }
            dates[date].tMax.push(day.main.temp_max)
          })

          const daysToSend = []

          Object.entries(dates).forEach(date => {
            date[1].tMin.sort((a, b) => { return a - b })
            date[1].tMax.sort((a, b) => { return b - a })

            date[1].precipitation.sort((a, b) => { return b.probability - a.probability })

            const dateObject = new Date(date[0])

            daysToSend.push({
              date: date[0],
              day: daysOfWeek[dateObject.getDay()],
              tMin: date[1].tMin[0].toFixed(1),
              tMax: date[1].tMax[0].toFixed(1),
              precipitation: date[1].precipitation[0]
            })

            resolve(daysToSend)
          })
        } catch (e) {
          reject(e.message)
          console.error(e)
        }
      })
    })
  })
}

module.exports = {
  getCryptoCurrencies,
  getWeatherForecast
}
