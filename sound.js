const express = require('express')
const app = express()

const { spawn } = require('child_process');
const kill = require('tree-kill');

const port = process.env.NODE_ENV || 4444

const Gpio = require('onoff').Gpio;
const button = new Gpio(4, 'in', 'both');

let phoneStatus = false;
let audio;

button.watch((err, value) => {
	if (value === 0 ) {
		phoneStatus = false;
		if(!audio) audio = spawn('omxplayer', ['assets/SampleAudio_0.4mb.mp3']);
	} else {
		phoneStatus = true;
		if (audio) {
			kill(audio.pid);
			audio = null;
		}
	}

	console.log(phoneStatus);
});

function changeButton() {
	console.log('change', phoneStatus);
	phoneStatus = !phoneStatus;
	setTimeout(changeButton, 10000);
}

//setTimeout(changeButton, 10000);

app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
});


app.get('/', (req, res) => res.json({message: phoneStatus}))

app.listen(port, '192.168.1.161', () => console.log(`Example app listening on port ${port}!`));
