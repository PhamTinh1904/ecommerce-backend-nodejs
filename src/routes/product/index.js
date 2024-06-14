"use strict";

const express = require("express");
const ProductController = require("../../controllers/product.controller");
const router = express.Router();

const { asyncHandler } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");

router.get(
  "/search/:keySearch",
  asyncHandler(ProductController.searchProductByUser)
);
router.get("/sku/select_variation", asyncHandler(ProductController.findOneSku));
router.get("/sku", asyncHandler(ProductController.findAllSku));
router.get("/spu/get_spu_info", asyncHandler(ProductController.findOneSpu));



router.get("", asyncHandler(ProductController.findAllProducts));
router.get("/:product_id", asyncHandler(ProductController.findProductById));

router.use(authenticationV2);
router.post("", asyncHandler(ProductController.createProduct));
router.post("/spu/new", asyncHandler(ProductController.createSpu));

router.patch("/:productId", asyncHandler(ProductController.updateProduct));

router.post(
  "/publish/:id",
  asyncHandler(ProductController.publishProductByShop)
);

router.get("/drafts/all", asyncHandler(ProductController.getAllDraftsForShop));
router.get(
  "/published/all",
  asyncHandler(ProductController.getAllPublishForShop)
);

module.exports = router;
