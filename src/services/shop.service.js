const shopModel = require("../models/shop.model");

const findByEmail = async ({
  email,
  select = {
    email: 1,
    password: 2,
    name: 1,
    status: 1,
    roles: 1,
  },
}) => {
  return await shopModel.findOne({ email }).select(select).lean();
};

const findShopById = async ({shopId}) => {
  return await shopModel.findById(shopId).lean();
};

module.exports = {
  findByEmail,
  findShopById
};
