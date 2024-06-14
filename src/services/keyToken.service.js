"use strict";

const keytokenModel = require("../models/keytoken.model");
const {
  Types: { ObjectId },
  Types,
} = require("mongoose");
class KeyTokenService { 
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });

      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };

      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error.message;
    }
  };

  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({
      user: new Types.ObjectId(userId),
    });
  };

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne({ _id: new ObjectId(id) });
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel.find({ refreshTokenUsed: refreshToken }).lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken });
  };

  static deleteById = async (userId) => {
    return await keytokenModel.deleteOne({ _id: new ObjectId(userId) });
  };
}

module.exports = KeyTokenService;
