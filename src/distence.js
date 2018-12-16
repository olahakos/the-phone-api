const Gpio = require('pigpio').Gpio;

// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
const MICROSECDONDS_PER_CM = 1e6/34321;

const trigger = new Gpio(17, {mode: Gpio.OUTPUT});
const echo = new Gpio(18, {mode: Gpio.INPUT, alert: true});

let inter = null;
let distence = 0;

const watchHCSR04 = () => {
	let startTick;

	echo.on('alert', (level, tick) => {
		if (level == 1) {
			startTick = tick;
		} else {
			const endTick = tick;
			const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
			// console.log(diff / 2 / MICROSECDONDS_PER_CM);
			distence = diff / 2 / MICROSECDONDS_PER_CM; 
		}
	});
};


const init = () => {
	console.log('distence init');
	trigger.digitalWrite(0); // Make sure trigger is low
	watchHCSR04();
};

const start = (interval = 500) => {
	inter = setInterval(() => {
		  trigger.trigger(10, 1); // Set trigger high for 10 microseconds
	}, interval);
}

const stop = () => {
	clearInterval(inter);
}

const getDistence = () => {
	return distence;
}

module.exports = {
	init,
	start,
	stop,
	getDistence,

}
