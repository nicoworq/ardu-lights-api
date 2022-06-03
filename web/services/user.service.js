const bcrypt = require('bcrypt')

const UserModel = require('../models/users')

async function newUser (username, password) {
  const salt = await bcrypt.genSalt(10)

  const hashedPass = await bcrypt.hash(password, salt)

  const newUserModel = new UserModel({
    username,
    password: hashedPass
  })

  return await newUserModel.save()
}

async function loginUser (username, password) {
  const existingUser = await UserModel.findOne({ username })

  if (existingUser == null) {
    return false
  }

  const validPassword = await bcrypt.compare(password, existingUser.password)

  if (!validPassword) {
    return false
  }
  return true
}

module.exports = {
  newUser,
  loginUser
}
