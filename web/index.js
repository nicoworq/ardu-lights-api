const express = require('express')
const app = express()
const port = process.env.PORT
const bodyParser = require('body-parser')

const loginRouter = require('./routes/login.routes')
const dashboardRouter = require('./routes/dashboard.routes')
const checkToken = require('./middleware/checkToken')

function initWebServer () {
  app.use(bodyParser.json())

  app.get('/', (req, res) => res.send('Hello World!'))

  app.use('/login', loginRouter)
  app.use('/dashboard', checkToken, dashboardRouter)

  app.use(express.static('public'))

  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

module.exports = {
  initWebServer
}
