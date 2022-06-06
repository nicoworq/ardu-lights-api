const express = require('express')
const router = express.Router()

const loginController = require('../controllers/login.controller')

router.get('/', loginController.get)
router.post('/', loginController.post)
router.post('/new-user', loginController.newUser)

module.exports = router
