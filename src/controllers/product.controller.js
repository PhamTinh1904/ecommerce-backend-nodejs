"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/product.service.lvxxx");
const { oneSku, allSkuBySpuId } = require("../services/sku.service");
const { newSpu, oneSpu } = require("../services/spu.service");

class ProductController {

  findOneSpu = async (req, res, next) => {
    const { product_id } = req.query;
    new SuccessResponse({
      message: "Get one spu",
      metadata: await oneSpu({ spu_id: product_id }),
    }).send(res);
  };

  findAllSku = async (req, res, next) => {
    const { product_id } = req.query;
    new SuccessResponse({
      message: "Get all sku",
      metadata: await allSkuBySpuId({ product_id }),
    }).send(res);
  };

  findOneSku = async (req, res, next) => {
    const { sku_id, product_id } = req.query;
    new SuccessResponse({
      message: "Get sku one",
      metadata: await oneSku({ sku_id, product_id }),
    }).send(res);
  };

  createSpu = async (req, res, next) => {
    new SuccessResponse({
      message: "Spu created successfully",
      metadata: await newSpu({ ...req.body, product_shop: req.user.userId }),
    }).send(res);
  };

  createProduct = async (req, res) => {
    // new SuccessResponse({
    //   message: "Get token successfully!",
    //   metadata: await AccessService.handlerRefreshToken(req.body.refreshToken),
    // }).send(res);

    new SuccessResponse({
      message: "Create new Product successfully!",
      metadata: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  updateProduct = async (req, res) => {
    // new SuccessResponse({
    //   message: "Get token successfully!",
    //   metadata: await AccessService.handlerRefreshToken(req.body.refreshToken),
    // }).send(res);

    new SuccessResponse({
      message: "Create new Product successfully!",
      metadata: await ProductServiceV2.updateProduct(
        req.body.product_type,
        req.params.productId,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
  };

  publishProductByShop = async (req, res) => {
    new SuccessResponse({
      message: "Create new Product successfully!",
      metadata: await ProductServiceV2.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  getAllDraftsForShop = async (req, res) => {
    new SuccessResponse({
      message: "Get all draft products successfully!",
      metadata: await ProductServiceV2.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishForShop = async (req, res) => {
    new SuccessResponse({
      message: "Get all draft products successfully!",
      metadata: await ProductServiceV2.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  searchProductByUser = async (req, res) => {
    new SuccessResponse({
      message: "Get all draft products successfully!",
      metadata: await ProductServiceV2.searchProductByUser(req.params),
    }).send(res);
  };

  findAllProducts = async (req, res) => {
    new SuccessResponse({
      message: "Get all products successfully!",
      metadata: await ProductServiceV2.findAllProducts(req.query),
    }).send(res);
  };

  findProductById = async (req, res) => {
    new SuccessResponse({
      message: "Get products successfully!",
      metadata: await ProductServiceV2.findProductById({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
