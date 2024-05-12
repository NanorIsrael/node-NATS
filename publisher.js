const amqp = require('amqplib');

publish()
async function publish() {
	try {
		var msg = process.argv.slice(2).join(' ') || "Hello World!";

		const connectedmq = await amqp.connect('amqp://localhost');
		const channel = await connectedmq.createChannel();
		await channel.assertQueue("jobs")
		channel.sendToQueue("jobs", Buffer.from(msg))
		console.log("messages sent")
	} catch(error) {
		console.log(error)
	}
}
module.exports = publish