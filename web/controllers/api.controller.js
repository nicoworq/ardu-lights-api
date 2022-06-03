async function get (req, res, next) {
  res.send('dash get')
}
async function getData (req, res, next) {
  res.send('dash getdata')
}

async function post (req, res, next) {
  res.send('dash post')
}

module.exports = {
  get,
  getData,
  post
}
