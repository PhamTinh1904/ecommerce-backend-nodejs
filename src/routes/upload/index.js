"use strict";

const express = require("express");
const ProductController = require("../../controllers/product.controller");
const router = express.Router();

const { asyncHandler } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const uploadController = require("../../controllers/upload.controller");
const { uploadDisk, uploadMemory } = require("../../configs/multi.config");

// router.use(authenticationV2);

router.post("/product", asyncHandler(uploadController.uploadImage));
router.post(
  "/product/thumb",
  uploadDisk.single("file"),
  asyncHandler(uploadController.uploadFileThumb)
);
router.post(
    "/product/bucket",
    uploadMemory.single("file"),
    asyncHandler(uploadController.uploadFileThumbS3)
  );

module.exports = router;
