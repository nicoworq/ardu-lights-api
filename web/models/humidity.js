const mongoose = require('mongoose')

const humiditySchema = new mongoose.Schema({
  device: String,
  value: Number,
  date: Date
})

module.exports = mongoose.model('Humidity', humiditySchema)
