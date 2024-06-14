"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");
const CheckOutService = require("../services/checkout.service");

class CartController {
  checkoutReview = async (req, res) => {
    new SuccessResponse({
      message: "Get checkout successfully!",
      metadata: await CheckOutService.checkOutReview(req.body)
    }).send(res);
  };

}

module.exports = new CartController();
