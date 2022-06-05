const DeviceModel = require('../models/devices')

const mqttServer = require('../../mqtt-server/index')

async function newDevice (name, topic) {
  const newDevice = new DeviceModel({
    name,
    topic
  })

  return await newDevice.save()
}

async function getDevices (ownerId) {
  const devices = await DeviceModel.find({ owner: ownerId }).select('-__v')

  return devices
}

async function getDevice (deviceId) {
  const device = await DeviceModel.find({ _id: deviceId }).select('-__v')

  if (device.length) {
    return device[0]
  }

  return {}
}

async function updateDevice (device) {
  const updatedDevice = await DeviceModel.findOneAndUpdate({ _id: device._id }, {
    topic: device.topic,
    lastPayload: device.lastPayload
  })

  return updatedDevice
}

async function sendMessage (deviceId, payload) {
  const device = await getDevice(deviceId)

  if (device == null) {
    return false
  }
  console.log(device)
  const topic = device.topic

  mqttServer.sendMessage(topic, payload)

  device.lastPayload = payload

  await updateDevice(device)

  return true
}

module.exports = {
  newDevice,
  getDevices,
  getDevice,
  updateDevice,
  sendMessage
}
