const authService = require('../services/auth.service')

const checkToken = async (req, res, next) => {
  const token = req.header('auth-token')
  if (!token) {
    return res.status(401).send({ error: 'Denied Access' })
  }

  if (await authService.validateToken(token)) {
    next()
  } else {
    return res.status(400).send({ error: 'Invalid Token' })
  };
}

module.exports = checkToken
