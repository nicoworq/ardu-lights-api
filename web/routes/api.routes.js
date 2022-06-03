const express = require('express')
const router = express.Router()

const apiController = require('../controllers/api.controller')

router.get('/mqtt-server-status', apiController.getServerStatus)
router.get('/devices', apiController.getDevices)
router.post('/device', apiController.newDevice)
router.post('/send-message', apiController.sendMessage)

module.exports = router
