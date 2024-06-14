const amqp = require("amqplib");

// const runConsumer = async () => {
//   try {
//     const connection = await amqp.connect("amqp://localhost");
//     const channel = await connection.createChannel();

//     const queueName = "test-topic";
//     await channel.assertQueue(queueName, { durable: true });

//     channel.consume(
//       queueName,
//       (messages) => {
//         console.log(`Received ${messages.content.toString()}`);
//       },
//       {
//         noAck: true,
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };

// runConsumer().catch(console.error);
const amqp_url = "amqp://localhost";

const receiveQueue = async () => {
  try {
    // 1. Create Connect
    const conn = await amqp.connect(amqp_url);
    // 2. Create Channel
    const channel = await conn.createChannel();
    // 3. Create Name queue
    const queueName = "q1";
    // 4. Create Queue
    await channel.assertQueue(queueName, { durable: false });

    // 5. Recieve message to queue
    await channel.consume(
      queueName,
      (msg) => {
        console.log(`Received ${msg.content.toString()}`);
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.error(`Error`, error);
  }
};

receiveQueue();
