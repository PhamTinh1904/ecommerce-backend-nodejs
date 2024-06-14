const amqp = require("amqplib");
const messages = "New product 123";
const amqp_url = "amqp://localhost";

// const log = console.log

// console.log = function(){
//   log.apply(console, [new Date()].concat(arguments))
// }

const runProducer = async () => {
  // try {
  //   const connection = await amqp.connect("amqp://localhost");
  //   const channel = await connection.createChannel();

  //   const noticationExchange = "notificationEx";
  //   const notiQueue = "noticationQueueProcess";
  //   const noticationExchangeDLX = "notificationExDLX";
  //   const noticationRoutingKeyDLX = "notificationRoutingKeyDLX";

  //   await channel.assertExchange(noticationExchange, "direct", {
  //     durable: true,
  //   });

  //   const queueResult = await channel.assertQueue(notiQueue, {
  //     exclusive: false,
  //     deadLetterExchange: noticationExchangeDLX,
  //     deadLetterRoutingKey: noticationRoutingKeyDLX,
  //   });

  //   await channel.bindQueue(queueResult.queue, noticationExchange);

  //   const msg = "a new product";
  //   console.log(`producer msg::` + msg);

  //   await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
  //     expiration: "10000",
  //   });

  //   setTimeout(() => {
  //     connection.close();
  //     process.exit(0);
  //   }, 500);
  // } catch (error) {
  //   console.log(error);
  // }
  try {
    const conn = await amqp.connect(amqp_url);
    const channel = await conn.createChannel();

    const notificationExchange = "notificationEx";
    const notiQueue = "notificationQueueProcess";
    const notificationExchangeDLX = "notificationExDLX";
    const notificationRoutingKeyDLX = "notificationRoutingKeyDLX";

    // 1. Create exchange
    await channel.assertExchange(notificationExchange, "direct", {
      durable: true,
    });

    // 2. Create queue
    const queueResult = await channel.assertQueue(notiQueue, {
      exclusive: false, // Cho phep cac ket noi khac truy cap vao cung mot luc hang doi
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX,
    });
    // 3. bindQueue
    await channel.bindQueue(queueResult.queue, notificationExchange);

    // 4. Send message
    const msg = "a new product created!";
    console.log(`Product notfication:: ${msg}`);

    await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: "10000",
    });

    setTimeout(() => {
      conn.close();
      process.exit(0);
    }, 2000);
  } catch (error) {
    console.error(`Error`, error);
  }
};

runProducer().catch(console.error);
