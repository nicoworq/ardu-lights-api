const aedes = require('aedes')()
const mqttServer = require('net').createServer(aedes.handle)
const mqttPort = 1880
const https = require('https')

mqttServer.listen(mqttPort, function () {
  console.log('server started and listening on port ', mqttPort)
})

// fired when a client connects
aedes.on('client', function (client) {
  console.log('Client Connected: \x1b[33m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
})

// fired when a client disconnects
aedes.on('clientDisconnect', function (client) {
  console.log('Client Disconnected: \x1b[31m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
})

// fired when a message is published
aedes.on('publish', async function (packet, client) {
 // console.log('Client \x1b[31m' + (client ? client.id : 'BROKER_' + aedes.id) + '\x1b[0m has published', packet.payload.toString(), 'on', packet.topic, 'to broker', aedes.id)

  onMessagePublish(packet)
})

function onMessagePublish (packet) {
  if (packet.topic == '/sensores/casa/movimiento') {
    console.log('topic mov!!')
    sendNotification('Movimiento!', 'Movimiento detectado!!!')
  } else {
    console.log('otro topic')
  }
}

function sendNotification (title, body) {
  console.log('send notif!')

  const data = JSON.stringify({
    notification: {
      title,
      body
      // "click_action": "http://127.0.0.1:5501/index.html",
      // "icon": "http://the-link-to-image/icon.png"
    },
    to: 'd89sc2HFj95DHNGBA_cIrG:APA91bE232FxwDUm6JBniaAu8jJb7neBgbCkOjpJG8ePHuJm4u9UV4wpty8wGFDyLEE4aAicmPZcqTRhXXbsbX5DzCJ8s1oiT2l_OCGRd-_eX9X63DlPUq_bJVsmZYyVXd-AwePkp-5t'
  })

  const options = {
    hostname: 'fcm.googleapis.com',
    port: 443,
    path: '/fcm/send',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      Authorization: 'Bearer AAAAiGl4T2M:APA91bHJtijFu-xtUvK7FEd77AaTKj1Jsrc-xeoZNvXpy3k6k9FWPsBkSFXWjop17QN2yAwuN_hsFnjvHemL2IRbu6jIqmNxEVxV_teCFy8wS-ntrTLz-JNDyyCisggId-eYlQoaol_6'
    }
  }

  const req = https.request(options, res => {
    res.on('data', d => {
      process.stdout.write(d)
    })
  })

  req.on('error', error => {
    console.error(error)
  })

  req.write(data)
  req.end()
}

let luz1 = 'off'
let luz2 = 'off'

const http = require('http')

const webPort = 3000
//  const webHost = '198.74.55.112'
const webHost = 'localhost'

const server = http.createServer(function (request, response) {
  // console.dir(request.param)

  if (request.method === 'POST') {
    let body = ''
    request.on('data', function (data) {
      body += data

      const params = parseBodyParams(body)

      luz1 = params.luz1
      luz2 = params.luz2

      aedes.publish({ topic: 'casa/luces/1', payload: params.luz1 })
      aedes.publish({ topic: 'casa/luces/2', payload: params.luz2 })
    })

    request.on('end', function () {
      response.writeHead(301, { Location: `http://${webHost}:${webPort}` })
      response.end()
    })
  } else {
    console.log('GET')
    const html = `
            <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <script>
                let luz1 = '${luz1}';
                let luz2 = '${luz2}';
              </script>
            </head>
              
                <body>
                    <form method="post" action="http://${webHost}:${webPort}">
                    <label>Luz1: <br/>
                    <select name="luz1">
                        <option value="on" ${setSelected('luz1', 'on')}>Prendida</option>
                        <option value="off" ${setSelected('luz1', 'off')}>Apagada</option>
                    </select>    
                    </label><br/>       
                    <label>Luz2: <br/>
                    <select name="luz2">
                        <option value="on" ${setSelected('luz2', 'on')}>Prendida</option>
                        <option value="off" ${setSelected('luz2', 'off')}>Apagada</option>
                    </select>    
                    </label><br/>                
                    
                        <input type="submit" value="Submit" />
                    </form>
                </body>
            </html>`
    response.writeHead(200, { 'Content-Type': 'text/html' })
    response.end(html)
  }
})

function setSelected (luz, estado) {
  switch (luz) {
    case 'luz1':
      return luz1 == estado ? "selected='selected'" : ''

    case 'luz2':
      return luz2 == estado ? "selected='selected'" : ''
  }
}

server.listen(webPort, webHost)
console.log(`Listening at http://${webHost}:${webPort}`)

function parseBodyParams (body) {
  qs = body.split('+').join(' ')

  const params = {}
  let tokens
  const re = /[?&]?([^=]+)=([^&]*)/g

  while (tokens = re.exec(qs)) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2])
  }

  return params
}
