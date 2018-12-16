const express = require('express')
const app = express()
const player = require('play-sound')(opts = {})

const port = process.env.NODE_ENV || 3334

const Gpio = require('onoff').Gpio;
const button = new Gpio(4, 'in', 'both');

let phoneStatus = false;
let audio;
button.watch((err, value) => {
	if (value === 0 ) {
		phoneStatus = false;
//		audio = player.play('assets/SampleAudio_0.4mb.mp3', (err) => {
//			console.error(err);
//		});
	} else {
		phoneStatus = true;
		if (audio) {
//			audio.pause();
//			audio.kill();
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
