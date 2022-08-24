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

function getMostImportantWeatherId (weatherOptions) {
  const storm = weatherOptions.filter(option => option.toString().startsWith(2))

  if (storm.length) {
    return storm[0]
  }

  const drizzle = weatherOptions.filter(option => option.toString().startsWith(3))

  if (drizzle.length) {
    return drizzle[0]
  }

  const rain = weatherOptions.filter(option => option.toString().startsWith(5))

  if (rain.length) {
    return rain[0]
  }

  const atmosfere = weatherOptions.filter(option => option.toString().startsWith(7))

  if (atmosfere.length) {
    return atmosfere[0]
  }

  const clouds = weatherOptions.filter(option => option.toString().startsWith(8))

  if (clouds.length) {
    return clouds[0]
  }
}

function getCurrentWeather (lat, long) {
  const apiUrl = process.env.CURRENT_WEATHER_URL
  const apiKey = process.env.WEATHER_KEY

  const url = `${apiUrl}?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric&lang=es`

  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      response.setEncoding('utf8')
      let rawData = ''
      response.on('data', (chunk) => { rawData += chunk })
      response.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData)

          const dataToSend = {
            temp: parsedData.main.temp,
            pressure: parsedData.main.pressure,
            humidity: parsedData.main.humidity,
            wind: parsedData.main.wind
          }

          resolve(dataToSend)
        } catch (e) {
          reject(e.message)
          console.error(e)
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

            // precipitation

            if (dates[date].precipitation === undefined) {
              dates[date].precipitation = []
            }

            if (day.pop > 0.5) {
              const precipitationTime = day.dt_txt.split(' ')[1].slice(0, -3)
              dates[date].precipitation.push({ probability: day.pop, time: precipitationTime })
            }

            // tMin
            if (dates[date].tMin === undefined) {
              dates[date].tMin = []
            }
            dates[date].tMin.push(day.main.temp_min)

            // tMax
            if (dates[date].tMax === undefined) {
              dates[date].tMax = []
            }
            dates[date].tMax.push(day.main.temp_max)

            // weather

            if (dates[date].weather === undefined) {
              dates[date].weather = []
            }

            dates[date].weather.push(day.weather[0].id)
          })

          const daysToSend = []

          Object.entries(dates).forEach(date => {
            date[1].tMin.sort((a, b) => { return a - b })
            date[1].tMax.sort((a, b) => { return b - a })

            // date[1].precipitation.sort((a, b) => { return b.probability - a.probability })

            const dateObject = new Date(date[0])

            daysToSend.push({
              date: date[0],
              day: daysOfWeek[dateObject.getDay()],
              tMin: date[1].tMin[0].toFixed(0),
              tMax: date[1].tMax[0].toFixed(0),
              precipitation: date[1].precipitation,
              weather: getMostImportantWeatherId(date[1].weather)
            })
          })
          resolve(daysToSend)
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
  getWeatherForecast,
  getCurrentWeather
}
