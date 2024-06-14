const amqp = require("amqplib");
const amqp_url = "amqp://localhost";

const consumeOrderdMessage = async () => {
  try {
    const conn = await amqp.connect(amqp_url);
    const channel = await conn.createChannel();

    const queueName = "ordered-queued-message";

    await channel.assertQueue(queueName, { durable: true });

    channel.prefetch(1)

    channel.consume(
      queueName,
      (msg) => {
        const message = msg.content.toString();

        setTimeout(() => {
          console.log(`Proccesding message: ${message}`);
          channel.ack(msg);
        }, Math.random() * 1000);
      }
    );
  } catch (error) {}
};

consumeOrderdMessage().catch((error) => console.error(error));
