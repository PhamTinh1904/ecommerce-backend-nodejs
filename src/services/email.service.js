const { replace } = require("lodash");
const { NotFoundError } = require("../core/error.response");
const { transport } = require("../dbs/init.nodemailer");
const { newOtp } = require("./otp.service");
const { getTemplate } = require("./template.service");
const { replacePlacehoder } = require("../utils");
const { createSendEmailCommand } = require("../dbs/init.ases");

const sendVerifyEmail = async ({ toAddress, subject, html }) => {
  const mailOptions = {
    fromAddress: 'phamtinhpy2017@gmail.com',
    toAddresses: toAddress,
    html,
    subject,
  };
  const sendEmailCommand = createSendEmailCommand(mailOptions);

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (e) {
    console.error("Failed to send email.");
    return e;
  }
};

const sendEmailLinkVerify = async ({
  html,
  toEmail = "phamtinhpy2022@gmail.com",
  subject = "Xac nhan email dang ky",
  text = "Xac nhan email dang ky",
}) => {
  try {
    const mailOptions = {
      from: '"shopDEV" <phamtinhpy2017@gmail.com>',
      to: toEmail,
      subject,
      text,
      html,
    };

    transport.sendMail(mailOptions, (err, info) => {
      if (err) {
        return console.log(`Loi gui mail:`, err);
      }

      console.log(`Message sent::`, info.messageId);
    });
  } catch (error) {
    console.error("Error sending mail:", error);
    return error;
  }
};

const sendEmailToken = async ({ email = null }) => {
  try {
    //1. get token
    const token = await newOtp({ email });

    //2. get template
    const template = await getTemplate({
      tem_name: "HTML EMAIL TOKEN",
    });

    if (!template) throw new NotFoundError("Template not found");
    console.log(template);
    //3. replace placeholder with params
    const content = replacePlacehoder(template.tem_html, {
      link_verify: `http://127.0.0.1:3000/v1/api/user/welcome-back?token=${token.otp_token}`,
    });
    //4. send email
    console.log(email);
    // sendVerifyEmail({
    //   toAddress: email,
    //   subject: "Vui lòng xác nhận địa chỉ Email đăng ký shopDEV",
    //   html: content,
    // }).catch((err) => console.log(err));
    sendEmailLinkVerify({
      html: content,
      toEmail: email,
      subject: "Vui lòng xác nhận địa chỉ Email đăng ký shopDEV",
    }).catch((err) => console.log(err));

    return 1;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendEmailToken,
};
