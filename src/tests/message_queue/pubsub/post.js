const amqp = require("amqplib");
const amqp_url = "amqp://localhost";

const postVideo = async ({ msg }) => {
  try {
    const conn = await amqp.connect(amqp_url);
    const channel = await conn.createChannel();

    const nameExchange = "video";

    await channel.assertExchange(nameExchange, "fanout", {
      durable: false,
    });

    await channel.publish(nameExchange, "", Buffer.from(msg));

    console.log(`[x] Send message: ${msg}`);

    setTimeout(() => {
      conn.close();
      process.exit(0);
    }, 2000);
  } catch (error) {
    console.error(error.message);
  }
};

const msg = process.argv.slice(2).join(" ") || "Hello Exchange";
postVideo({ msg });
