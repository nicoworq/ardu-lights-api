const dotEnv = require('dotenv')
dotEnv.config()

const dbInit = require('./web/configs/database')

const webServer = require('./web/index.js')
const mqttServer = require('./mqtt-server/index')
const display = require('./display/index')

const cron = require('node-cron')

webServer.initWebServer()
mqttServer.initServer()

cron.schedule('*/4 * * * * *', () => {
  display.cycleDisplay()
})
