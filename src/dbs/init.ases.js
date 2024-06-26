const { SendEmailCommand, SESClient } = require("@aws-sdk/client-ses");
const { config } = require("dotenv");

config();
// Create SES service object.
const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
  },
});

const createSendEmailCommand = ({
  fromAddress,
  toAddresses,
  ccAddresses = [],
  body,
  subject,
  replyToAddresses = [],
}) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: ccAddresses instanceof Array ? ccAddresses : [ccAddresses],
      ToAddresses: toAddresses instanceof Array ? toAddresses : [toAddresses],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: body,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses:
      replyToAddresses instanceof Array ? replyToAddresses : [replyToAddresses],
  });
};

module.exports = {
  createSendEmailCommand,
  sesClient,
};
