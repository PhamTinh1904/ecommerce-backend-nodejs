"use strict";

const express = require("express");

const router = express.Router();

const { asyncHandler } = require("../../auth/checkAuth");

const { grantAccess } = require("../../middlewares/rbac");
const {
  newRole,
  listRoles,
  newResource,
  listResources,
} = require("../../controllers/rbac.controller");

// router.use(authenticationV2);

router.post("/role", asyncHandler(newRole));
router.get("/role", asyncHandler(listRoles));

router.post("/resource", asyncHandler(newResource));
router.get("/resource", asyncHandler(listResources));

module.exports = router;
