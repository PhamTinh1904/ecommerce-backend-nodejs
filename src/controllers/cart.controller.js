"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  addToCart = async (req, res) => {
    new SuccessResponse({
      message: "Create new cart successfully!",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  update = async (req, res) => {
    new SuccessResponse({
      message: "Update cart successfully!",
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };

  delete = async (req, res) => {
    new SuccessResponse({
      message: "Delete cart successfully!",
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res);
  };

  getListToCart = async (req, res) => {
    new SuccessResponse({
      message: "Delete cart successfully!",
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
