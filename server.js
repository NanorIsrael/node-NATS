// index.js
const express = require('express');
const amqp = require('amqplib')
const {writeFile} = require('fs/promises')
const fileUpload = require('express-fileupload');
const {join} = require('path')


const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({ createParentPath: true }));


async function sendToFileQueue(filePath) {
	const connection = await amqp.connect('amqp://localhost');
	const channel = await connection.createChannel();
	await channel.assertQueue('file-queue');
	await channel.sendToQueue('file-queue', Buffer.from(filePath));

	setTimeout(() => {
		console.log("file sent to queue.")
		process.exit(0)
	}, 500)
}
app.post('/upload', async (req, res) => {
	if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({error: "No files were uploaded."});
    }
	const uploadedFile =  req.files.file;
	const fileDir = "./files/"
	const outputPath = join(fileDir, `${uploadedFile.name}`);

	try {
		// await writeFile("/files", file);
		uploadedFile.mv(outputPath, (err) => {
			if (err) {
				console.log(err)
				return res.status(500).send('File upload failed');
			}
		});
		console.log(outputPath)
		await sendToFileQueue(outputPath);
		res.json({message: 'File uploaded!'});

	} catch(error) {
		console.log(error)
		res.status(500).json({error: "An error occured. File upload failed"})
	}
});

const port = 8000;
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
