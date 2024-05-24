const amqp = require('amqplib');

consume()
async function consume() {
	try {

		const connectedmq = await amqp.connect("amqp://localhost");
		const channel = await connectedmq.createChannel();
		await channel.assertQueue("file-queue")
		channel.consume("file-queue", (msg) => {
			const filePath = msg.content.toString();

			console.log("messages recieved", msg.content.toString())

			setTimeout(function() {
				console.log(" [x] Done");
			  }, 5 * 1000);
		}, {
			noAck: true
		})
		
	} catch(error) {
		console.log(error)
	}
	
}
module.exports = consume