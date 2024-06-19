"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");

const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const roleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static handlerRefreshTokenV2 = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user;

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteById(userId);
      throw new ForbiddenError("Something wrong happened !! Please relogin");
    }

    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailureError("Shop not registered!");

    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registered!");

    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user,
      tokens,
    };
  };
  static handlerRefreshToken = async (refreshToken) => {
    // Check xem token đã được sử dụng hay chưa
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    console.log("1", foundToken);
    if (foundToken) {
      const { userId, email } = verifyJWT(refreshToken, foundToken.privateKey);
      console.log({ userId, email });

      await KeyTokenService.deleteById(userId);
      throw new ForbiddenError("Something wrong happened !! Please relogin");
    }

    // Xử lý khi refresh token chưa được sử dụng
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError("Shop not registered! 1");

    const { userId, email } = verifyJWT(refreshToken, holderToken.publicKey);
    console.log("2---", { userId, email });
    // Check userId
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registered! 2");

    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });

    return {
      user: {
        userId,
        email,
      },
      tokens,
    };
  };
  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);

    return delKey;
  };
  /* 
  1. Check email in db
  2. Match password
  3. Create AT,RT and save
  4. Get data return login 
   */
  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });


    if (!foundShop) {
      throw new BadRequestError("Shop not registered!");
    }

    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication failed!");

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const { _id: userId } = foundShop;

    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId,
      privateKey,
      publicKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    const holderShop = await shopModel.findOne({ email });

    if (holderShop) {
      throw new BadRequestError("Error: Shop already registered");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [roleShop.SHOP],
    });

    if (newShop) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      console.log({ privateKey, publicKey });

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
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
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }

    // created token pair
  };
}

module.exports = AccessService;
