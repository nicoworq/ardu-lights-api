const mqttServer = require('../../mqtt-server/index')
const deviceService = require('../services/device.service')
const authService = require('../services/auth.service')

async function getServerStatus (req, res, next) {
  const serverStatus = mqttServer.getStatus()
  res.send(serverStatus)
}
async function getDevices (req, res, next) {
  try {
    const devices = await _getUserDevices(req)
    res.status(200).send(devices)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
}

async function _getUserDevices (req) {
  const tokenPayload = await authService.getTokenPayload(req.header('auth-token'))

  // we get devices from the logged in user
  const devices = await deviceService.getDevices(tokenPayload.id)

  return devices
}

async function sendMessage (req, res, next) {
  try {
    const requestBody = req.body
    const deviceId = requestBody.deviceId
    const payload = requestBody.payload

    if (deviceId === undefined || payload === undefined) {
      throw new Error()
    }

    const userDevices = await _getUserDevices(req)

    // is owner?
    const isOwner = userDevices.find((device) => device.id === deviceId)

    if (isOwner === undefined) {
      res.status(404).send({ messageSent: false, error: 'Device not found in your devices' })
      return
    }

    const messageSent = await deviceService.sendMessage(deviceId, payload)

    res.status(200).send({ messageSent, payload })
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
}

async function newDevice (req, res, next) {
  try {
    const requestBody = req.body
    const name = requestBody.name
    const topic = requestBody.topic
    const newDevice = await deviceService.newDevice(name, topic)

    res.status(200).send({ created: true, message: 'Created OK!', device: newDevice })
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
}

module.exports = {
  getServerStatus,
  getDevices,
  sendMessage,
  newDevice
}
