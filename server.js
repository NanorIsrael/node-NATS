// index.js
const express = require('express');
const ampq = require('amqplib')
const fileUpload = require('express-fileupload');

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({ createParentPath: true }));


async function sendToFileQueue(filePath) {
	const connection = await amqplib.connect('amqp://localhost');
	const channel = connection.createChannel();
	channel.assertQueue('file-queue');
	channel.sendToQueue('file-queue', Buffer.from(filePath));

	setTimeout(() => {
		console.log("file sent to queue.")
		process.exit(0)
	}, 500)
}
app.post('/upload', async (req, res) => {
	if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
	const file =  req.files
	console.log(file)
  	res.json({message: file.name});
});

const port = 8000;
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
