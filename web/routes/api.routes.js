const express = require('express')
const router = express.Router()

const apiController = require('../controllers/api.controller')

router.get('/server-status', apiController.getServerStatus)
router.get('/devices', apiController.getDevices)
router.post('/device', apiController.postDevice)

module.exports = router
