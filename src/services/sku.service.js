"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const SKU_MODEL = require("../models/sku.model");
const { randomProductId } = require("../utils");
const _ = require("lodash");

const newSku = async ({ spu_id, sku_list }) => {
  const convert_sku_list = sku_list.map((sku) => {
    return {
      ...sku,
      product_id: spu_id,
      sku_id: `${spu_id}.${randomProductId()}`,
    };
  });

  const skus = await SKU_MODEL.create(convert_sku_list);
  if (!skus) throw new BadRequestError("Create sku failed!");

  return skus;
};

const oneSku = async ({ sku_id, product_id }) => {
  const sku = await SKU_MODEL.findOne({
    sku_id,
    product_id,
  }).lean(); // .lean chuyển về json để sử dụng được thư viện lodash

  if (!sku) throw new NotFoundError("Sku not found!");

  return _.omit(sku, ["__v", "updatedAt", "createdAt", "isDelete"]);
};

const allSkuBySpuId = async ({ product_id }) => {
  const skus = await SKU_MODEL.find({ product_id }).lean();

  if(!skus) throw new NotFoundError('skus not found');

  return skus;
};

module.exports = {
  newSku,
  oneSku,
  allSkuBySpuId
};
