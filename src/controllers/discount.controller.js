"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class checkoutController {
  createDiscount = async (req, res) => {
    new SuccessResponse({
      message: "Create new Discount successfully!",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCodes = async (req, res) => {
    new SuccessResponse({
      message: "Successfully found code!",
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCodesByProduct = async (req, res) => {
    new SuccessResponse({
      message: "Successfully found code!",
      metadata: await DiscountService.getAllDiscountCodeWithProduct({
        ...req.query,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res) => {
    new SuccessResponse({
      message: "Successfully found code!",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,    
      }),
    }).send(res);
  };
}

module.exports = new checkoutController();
