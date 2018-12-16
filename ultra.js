const express = require('express')
const app = express()
const port = 3334

const Gpio = require('onoff').Gpio;
Gpio.setMode(Gpio.BMC);


app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
});


app.get('/', (req, res) => res.json({message: phoneStatus}))

app.listen(port, '192.168.1.161', () => console.log(`Example app listening on port ${port}!`));
