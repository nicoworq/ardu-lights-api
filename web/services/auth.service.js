const jwt = require('jsonwebtoken')

function generateToken (userId, username) {
  const newToken = jwt.sign({
    name: username,
    id: userId
  }, process.env.TOKEN_SECRET)

  return newToken
}

function validateToken (token) {
  try {
    const valid = jwt.verify(token, process.env.TOKEN_SECRET)
    if (Object.prototype.hasOwnProperty.call(valid, 'name')) {
      return true
    }
    return false
  } catch (err) {
    console.log(err.message)
    return false
  }
}

module.exports = {
  generateToken,
  validateToken
}
