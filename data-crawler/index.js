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

/*
function getWeatherForecast (lat, long) {
  const apiUrl = process.env.WEATHER_URL
  const apiKey = process.env.WEATHER_KEY

  const url = apiUrl + '?lat=' + lat
}
*/

module.exports = {
  getCryptoCurrencies
}
