const mqttServer = require('../../mqtt-server/index')
const deviceService = require('../services/device.service')

async function getServerStatus (req, res, next) {
  const serverStatus = mqttServer.getStatus()
  res.send(serverStatus)
}
async function getDevices (req, res, next) {
  try {
    const devices = await deviceService.getDevices()

    res.status(200).send(devices)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
}

async function sendMessage (req, res, next) {
  res.send('dash post')
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
