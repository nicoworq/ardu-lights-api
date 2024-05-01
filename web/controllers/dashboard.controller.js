const path = require('path')

const display = require('../../display/index')
const mqttServer = require('../../mqtt-server/index')

async function get (req, res, next) {
 display.initCycle()
  res.sendFile(path.join(__dirname + '../../views/dashboard.html'))
}

async function post(req,res,next){

	let action = req.body.action;
	let value = req.body.value;

	console.log(req.body.action);
	display.stopCycle();

	if(action ==='color'){
		mqttServer.sendMessage('/casa/pantalla/color', value)

	}


	res.json({
        message: 'Received POST request'+action+' '+value
    });
	
}

module.exports = {
  get,post
}
