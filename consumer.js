const amqp = require('amqplib');

consume()
async function consume() {
	try {

		const connectedmq = await amqp.connect("amqp://localhost");
		const channel = await connectedmq.createChannel();
		// const result = await channel.assertQueue("jobs")
		channel.consume("jobs", (msg) => {
			var secs = msg.content.toString().split('.').length - 1;

			console.log("messages recieved", msg.content.toString())

			setTimeout(function() {
				console.log(" [x] Done");
			  }, secs * 1000);
		}, {
			noAck: true
		})
		
	} catch(error) {
		console.log(error)
	}
	
}
module.exports = consume