const dotEnv = require('dotenv')
dotEnv.config()

const dbInit = require('./web/configs/database')

const webServer = require('./web/index.js')

webServer.initWebServer()
