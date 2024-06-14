"use strict";
const nodemailer = require("nodemailer");
const AWS = require("aws-sdk");
require("dotenv").config;

AWS.config.update({
  accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
  region: "ap-southeast-1",
});

let ses = new AWS.SES({ apiVersion: '2010-12-01' });

const transport = nodemailer.createTransport({
  SES: { ses, aws: { region: "ap-southeast-1" } },
});

module.exports = {
  transport,
};