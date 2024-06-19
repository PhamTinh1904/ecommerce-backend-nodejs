"use strict";

const { NotFoundError } = require("../core/error.response");

const { findShopById } = require("./shop.service");

const SPU_MODEL = require("../models/spu.model");
const { randomProductId } = require("../utils");
const { newSku, allSkuBySpuId } = require("./sku.service");
const _ = require("lodash");

const newSpu = async ({
  product_id,
  product_name,
  product_thumb,
  product_description,
  product_price,
  product_category,
  product_shop,
  product_attributes,
  product_quantity,
  product_variations,
  sku_list = [],
}) => {
  //1. Check if shop exits
  const foundShop = await findShopById({ shopId: product_shop });
  if (!foundShop) throw new NotFoundError("Shop not found!");

  //2. Create a new SPU
  const spu = await SPU_MODEL.create({
    product_id: randomProductId(),
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_category,
    product_shop,
    product_attributes,
    product_quantity,
    product_variations,
  });

  //3. Get spu_id add to sku.services
  if (spu && sku_list.length) {
    // create new skus
    newSku({ sku_list, spu_id: spu.product_id }).then();
  }

  // 4. Sync data via elasticsearch
  // // Assuming you have an Elasticsearch client instance named "client"
  // await client.index({
  //   index: 'your_index_name',
  //   id: spu._id.toString(),
  //   body: {
  //     // Add the fields you want to sync to Elasticsearch
  //     product_name: spu.product_name,
  //     product_description: spu.product_description,
  //     // Add more fields as needed
  //   }
  // });


  return !!spu;
};

const oneSpu = async ({ spu_id }) => {
  const spu = await SPU_MODEL.findOne({
    product_id: spu_id,
    isPublished: false,
  }).lean();

  if (!spu) throw new NotFoundError("Spu not found!");
 
  const skus = await allSkuBySpuId({ product_id: spu.product_id });

  return {
    spu_info: _.omit(spu, ["__v", "updatedAt", "createdAt", "isDelete"]),
    sku_list: skus.map((sku) => {
      return _.omit(sku, ["__v", "updatedAt", "createdAt", "isDelete"]);
    }),
  };
};

module.exports = { newSpu, oneSpu };
