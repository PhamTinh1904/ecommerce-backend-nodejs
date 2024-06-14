"use strict";

const { convertToObjectIdMongodb } = require("../../utils");
const cartModel = require("../cart.model");

const findCartById = async (cardId) => {
  return await cartModel
    .findOne({ _id: convertToObjectIdMongodb(cardId), cart_state: "active" })
    .lean();
};

module.exports = {
    findCartById
}
