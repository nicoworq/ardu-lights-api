const mongoose = require('mongoose')

const deviceSchema = new mongoose.Schema({
  owner: String,
  name: String,
  topic: String,
  lastPayload: String
})

module.exports = mongoose.model('Device', deviceSchema)
