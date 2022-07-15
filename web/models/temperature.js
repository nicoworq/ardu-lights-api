const mongoose = require('mongoose')

const temperatureSchema = new mongoose.Schema({
  device: String,
  value: Number,
  date: Date
})

module.exports = mongoose.model('Temperature', temperatureSchema)
