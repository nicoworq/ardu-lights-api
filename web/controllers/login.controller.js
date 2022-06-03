const path = require('path')

const authService = require('../services/auth.service')
const userService = require('../services/user.service')

async function get (req, res, next) {
  res.sendFile(path.join(__dirname + '../../views/login.html'))
}

async function post (req, res, next) {
  try {
    const requestBody = req.body

    const username = requestBody.username
    const password = requestBody.password

    if (await userService.loginUser(username, password)) {
      // we are logged in
      const newToken = authService.generateToken(1, username)
      res.status(200).send({ logged: true, message: 'Login OK!', jwt: newToken })
    } else {
      // wrong login
      res.status(403).send({ logged: false, message: 'Wrong credentials', jwt: '' })
    }
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
}

async function newUser (req, res, next) {
  try {
    const requestBody = req.body

    const username = requestBody.username
    const password = requestBody.password

    const newUser = await userService.newUser(username, password)

    res.status(200).send({ user: newUser.username })
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
}

module.exports = {
  get,
  post,
  newUser
}
