"use strict";

const express = require("express");

const router = express.Router();

const { asyncHandler } = require("../../auth/checkAuth");
const profileController = require("../../controllers/profile.controller");
const { grantAccess } = require("../../middlewares/rbac");

// router.use(authenticationV2);

router.get(
  "/viewAny",
  grantAccess("readAny", "profile"),
  profileController.getProfiles
);
router.get(
  "/viewOwn",
  grantAccess("readOwn", "profile"),
  profileController.getProfile
);

module.exports = router;
