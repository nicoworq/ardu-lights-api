const path = require('path')

/**
 * @deprecated
 *
 */

async function get (req, res, next) {
  res.sendFile(path.join(__dirname + '../../views/dashboard.html'))
}

module.exports = {
  get
}
