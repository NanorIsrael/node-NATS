// index.js
const express = require('express');
var amqp = require('amqplib/callback_api');


const app = express();
const port = 8000;


app.get('/', async (req, res) => {
  	res.send('Hello there!');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
