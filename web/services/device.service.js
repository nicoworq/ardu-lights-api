const DeviceModel = require('../models/devices')

async function newDevice (name, topic) {
  const newDevice = new DeviceModel({
    name,
    topic
  })

  return await newDevice.save()
}

async function getDevices () {
  const devices = await DeviceModel.find({}).select('-__v')

  return devices
}

module.exports = {
  newDevice,
  getDevices
}
