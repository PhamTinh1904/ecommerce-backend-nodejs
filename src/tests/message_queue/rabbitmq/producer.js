const amqp = require("amqplib");
const messages = "New product 123";

// const runProducer = async () => {
//   try {
//     const connection = await amqp.connect("amqp://localhost");
//     const channel = await connection.createChannel();

//     const queueName = "test-topic";
//     await channel.assertQueue(queueName, { durable: true });

//     channel.sendToQueue(queueName, Buffer.from(messages));
//     console.log(`Message sent to queue ${messages}`);
//   } catch (error) {
//     console.log(error);
//   }
// };

// runProducer().catch(console.error);

const amqp_url = "amqp://localhost";

const sendQueue = async ({ msg }) => {
  try {
    // 1. Create Connect
    const conn = await amqp.connect(amqp_url);
    // 2. Create Channel
    const channel = await conn.createChannel();
    // 3. Create Name queue
    const queueName = "q1";
    // 4. Create Queue
    await channel.assertQueue(queueName, { durable: true }); // true nghĩa là khi start lại thì queue không mất message

    // 5. Send message to queue
    await channel.sendToQueue(queueName, Buffer.from(msg), {
      // Nếu tác này trong vòng 10 giây không xử lí thì sẽ bị đóng
      // expiration: "10000", // => TTL: Time to live
      persistent: true, // => Durable: true
    });

    //6. Close conn and channel
  } catch (error) {
    console.error(`Error`, error);
  }
};

sendQueue({ msg: "Hello ae" });
