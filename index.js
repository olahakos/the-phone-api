const express = require('express')
const app = express()
const { spawn } = require('child_process');
const kill = require('tree-kill');

const player = require('play-sound')(opts = {})
const distence = require('./src/distence');

const port = process.env.PORT || 3334;
const ip = process.env.IP || '192.168.1.161';
const Gpio = require('onoff').Gpio;


const button = new Gpio(4, 'in', 'both');

const init = () => {
	distence.init();
//	distence.start();
}

let phoneStatus = false;
let audio;

app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
});

const calculateDistence = () => {
	const d = distence.getDistence();
	if (d<2) return phoneStatus;

	if (d < 6 || d > 1000) {
		if (audio) {
			kill(audio.pid);
			audio = null;
		}
		return false;
	}
		
	if(!audio) audio = spawn('omxplayer', ['/home/pi/Documents/projects/the-phone-api/assets/SampleAudio_0.4mb.mp3']);
	return true;
};

app.get('/', (req, res) => {
	try {
		phoneStatus = calculateDistence();
//		console.log('phoneStatus', phoneStatus);
	} catch (e) {
		console.log('something went wrong', e);
	}
	res.json({message: phoneStatus});
});

app.listen(port, ip, () => console.log(`Example app listening on port ${ip}:${port}!`));

init();
