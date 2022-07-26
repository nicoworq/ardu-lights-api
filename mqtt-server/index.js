const aedes = require('aedes')()
const mqttServer = require('net').createServer(aedes.handle)
const mqttPort = process.env.MQTT_PORT

const temperatureService = require('../web/services/temperature.service')
const humidityService = require('../web/services/humidity.service')
const pressureService = require('../web/services/pressure.service')

async function initServer () {
  await mqttServer.listen(mqttPort, function () {
    console.log('MQTT server V2.0 UP and running on port', mqttPort)
  })
}

let clientsConected = 0
// fired when a client connects
aedes.on('client', function (client) {
  clientsConected++
  // console.log('Client Connected: \x1b[33m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
})

aedes.on('publish', async function (packet, client) {
  console.log('Client \x1b[31m' + (client ? client.id : 'BROKER_' + aedes.id) + '\x1b[0m has published', packet.payload.toString(), 'on', packet.topic, 'to broker', aedes.id)

  onMessage(packet, client)
})

// fired when a client disconnects
aedes.on('clientDisconnect', function (client) {
  clientsConected--
  clientsConected = clientsConected < 0 ? 0 : clientsConected
  // console.log('Client Disconnected: \x1b[31m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
})

function onMessage (message, client) {
  switch (message.topic) {
    case '/casa/temperatura':
      temperatureService.newTemperature(client.id, parseFloat(message.payload.toString()))
      break

    case '/casa/humedad':
      humidityService.newHumidity(client.id, parseFloat(message.payload.toString()))
      break

    case '/casa/presion':
      pressureService.newPressure(client.id, parseFloat(message.payload.toString()))
      break
  }
}

function getStatus () {
  return {
    port: mqttPort,
    clients: clientsConected
  }
}

async function sendMessage (topic, payload) {
  console.log(topic, payload)
  return await aedes.publish({ topic, payload: payload.toString() })
}

module.exports = {
  initServer,
  getStatus,
  sendMessage
}
