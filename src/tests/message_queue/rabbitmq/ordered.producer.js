const amqp = require("amqplib");
const amqp_url = "amqp://localhost";

const producerOrderdMessage = async () => {
  try {
    const conn = await amqp.connect(amqp_url);
    const channel = await conn.createChannel();

    const queueName = "ordered-queued-message";

    await channel.assertQueue(queueName, { durable: true });

    for (let i = 0; i < 10; i++) {
        
      const msg = `Message sent to queue ${i}`;
      console.log(msg);
      channel.sendToQueue(queueName, Buffer.from(msg), {
        persistent: true,
      });
    }

    setTimeout(() => {
      channel.close();
    }, 1000);
  } catch (error) {}
};

producerOrderdMessage().catch((error) => console.error(error))

