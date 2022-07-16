const mongoose = require('mongoose')

const pressureSchema = new mongoose.Schema({
  device: String,
  value: Number,
  date: Date
})

module.exports = mongoose.model('Pressure', pressureSchema)
