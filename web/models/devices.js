const mongoose = require('mongoose')

const deviceSchema = new mongoose.Schema({
  name: String,
  topic: String,
  status: Boolean
})

module.exports = mongoose.model('Device', deviceSchema)
