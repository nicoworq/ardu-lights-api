const jwt = require('jsonwebtoken')

function generateToken (userId, username) {
  const newToken = jwt.sign({
    name: username,
    id: userId
  }, process.env.TOKEN_SECRET, { expiresIn: '7 days' })

  return newToken
}

async function validateToken (token) {
  try {
    const valid = await jwt.verify(token, process.env.TOKEN_SECRET)

    if (Object.prototype.hasOwnProperty.call(valid, 'name')) {
      return true
    }
    return false
  } catch (err) {
    console.log(err)
    return false
  }
}

async function getTokenPayload (token) {
  try {
    const decoded = jwt.decode(token + 'a')
    return decoded
  } catch (err) {
    console.log(err.message)
    return false
  }
}

module.exports = {
  generateToken,
  validateToken,
  getTokenPayload
}
