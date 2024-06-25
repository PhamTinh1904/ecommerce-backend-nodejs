const { createUser } = require("../models/repositories/user.repo");
const USER = require("../models/user.model");
const { getInfoData, convertToObjectIdMongodb } = require("../utils");
const { sendEmailToken } = require("./email.service");
const { checkEmailToken } = require("./otp.service");
const {
  ErrorResponse,
  BadRequestError,
  NotFoundError,
} = require("../core/error.response");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");

class UserService {
  newUser = async ({ email = null, captcha = null }) => {
    const user = await USER.findOne({ email }).lean();

    if (user) {
      throw new BadRequestError("Email already exists");
    }

    const result = await sendEmailToken({ email });

    return {
      token: result,
    };
  };

  checkLoginEmailToken = async ({ token }) => {
    //1. Check token in mode opt
    const { otp_email: email, otp_token } = await checkEmailToken({
      otp_token: token,
    });

    if (!email) throw new NotFoundError("Token not found");
    // //2. Check email exits in user model
    const hasUser = await this.findUserByEmailWithLogin({ email });

    if (hasUser) throw new BadRequestError("Email already exists");

    const passwordHash = await bcrypt.hash(email, 10);
    console.log(email);
    const newUser = await createUser({
      usr_id: 1,
      usr_name: email,
      usr_email: email,
      usr_slug: "sad",
      usr_password: passwordHash,
      usr_role: convertToObjectIdMongodb("663ed8daab4b29afdfcf5114"),
    });

    if (newUser) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      console.log({ privateKey, publicKey });

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        return {
          code: "xxx",
          message: "publicKeyString err",
        };
      }
      const tokens = await createTokenPair(
        { userId: newUser._id, email },
        publicKey,
        privateKey
      );

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "usr_name", "usr_email", "usr_id"],
            object: newUser,
          }),
          tokens,
        },
      };
    }
  };

  findUserByEmailWithLogin = async ({ email }) => {
    const user = await USER.findOne({ email }).lean();

    return user;
  };
}

module.exports = new UserService();
