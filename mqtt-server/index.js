const aedes = require('aedes')()
const mqttServer = require('net').createServer(aedes.handle)
const mqttPort = process.env.MQTT_PORT

const functions = require('./functions')

async function initServer () {
  await mqttServer.listen(mqttPort, function () {
    console.log('MQTT server UP and running on port', mqttPort)
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
  console.log('Client Disconnected: \x1b[31m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
})

function onMessage (message, client) {
  console.log(message.topic)
  switch (message.topic) {
    case '/casa/temperatura':

      functions.saveTemperature(message, client.id)

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
  // aedes.publish({ topic: 'casa/luces/1', payload: params.luz1 })
  console.log('sendMessage', topic, payload)
  return await aedes.publish({ topic, payload })
}

module.exports = {
  initServer,
  getStatus,
  sendMessage
}
