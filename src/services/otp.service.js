"use strict";
const crypto = require("crypto");
const OTP = require("../models/otp.model");
const { NotFoundError } = require("../core/error.response");

const generatorTokenRandom = () => {
  const token = crypto.randomInt(0, Math.pow(2, 32));

  return token;
};

const newOtp = async ({ email }) => {
  const token = generatorTokenRandom();
  const newToken = await OTP.create({
    otp_token: token,
    otp_email: email,
  });

  return newToken;
};

const checkEmailToken = async ({ otp_token }) => {
  const token = await OTP.findOne({ otp_token });

  if (!token) throw new NotFoundError("Token not found");

  OTP.deleteOne({ otp_token: token }).then();

  return token;
};

module.exports = {
  newOtp,
  checkEmailToken
};
