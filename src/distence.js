const pigpio = require('pigpio');
const Gpio = pigpio.Gpio;

// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
const MICROSECDONDS_PER_CM = 1e6/34321;

const trigger = new Gpio(17, {mode: Gpio.OUTPUT});
const echo = new Gpio(18, {mode: Gpio.INPUT, alert: true});

let inter = null;
let distence = 0;

let last = 4;

const watchHCSR04 = () => {
	let startTick;

	echo.on('alert', (level, tick) => {
		if (level == 1) {
			startTick = tick;
		} else {
			const endTick = tick;
			const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
			let nd = diff / 2 / MICROSECDONDS_PER_CM;
			if (nd < 1 || nd > 1000) return;
//			console.log(nd);
			distence = nd;
			last = nd;
		}
	});
};


const init = () => {
	console.log('distence init');
	trigger.digitalWrite(0); // Make sure trigger is low
	triggering();
	watchHCSR04();
};

const triggering = () => {
	trigger.trigger(10, 1); // Set trigger high for 10 microseconds
	setTimeout(triggering, 500);
}

const start = (interval = 500) => {
	triggering();
/** /
	inter = setInterval(() => {
		  trigger.trigger(10, 1); // Set trigger high for 10 microseconds
	}, interval)
/**/
}

const getDistence = () => {
	return distence;
}

module.exports = {
	init,
	start,
	getDistence,
}
