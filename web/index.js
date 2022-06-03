const express = require('express')
const app = express()
const port = process.env.PORT
const bodyParser = require('body-parser')

const loginRouter = require('./routes/login.routes')
const dashboardRouter = require('./routes/dashboard.routes')
const apiRouter = require('./routes/api.routes')
const checkToken = require('./middleware/checkToken')

function initWebServer () {
  app.use(bodyParser.json())

  app.get('/', (req, res) => res.send('Hello World!'))

  app.use('/login', loginRouter)
  app.use('/dashboard', dashboardRouter)
  app.use('/api', checkToken, apiRouter)

  app.use(express.static('public'))

  app.listen(port, () => console.log('Web server UP and running on port', port))
}

module.exports = {
  initWebServer,
  app
}
