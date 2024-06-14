const amqp = require("amqplib");
const amqp_url = "amqp://localhost";

const receiveVideo = async () => {
  try {
    // 1. Create Connect
    const conn = await amqp.connect(amqp_url);
    // 2. Create Channel
    const channel = await conn.createChannel();

    // 3. Create exchange
    const nameExchange = "video";

    await channel.assertExchange(nameExchange, "fanout", {
      durable: false,
    });

    // 4. Create queue
    const { queue } = await channel.assertQueue("", {
      exclusive: true,
    });

    console.log(`nameQueue: ${queue}`);


    // 5. Bingding
    await channel.bindQueue(queue, nameExchange, "");

    await channel.consume(
      queue,
      (msg) => {
        console.log(`Message: ${msg.content.toString()}`);
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.error(error.message);
  }
};

receiveVideo();
