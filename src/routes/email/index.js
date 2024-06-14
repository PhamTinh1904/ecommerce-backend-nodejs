"use strict";

const express = require("express");

const router = express.Router();

const { asyncHandler } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const { newTemplate } = require("../../controllers/email.controller");

// router.use(authenticationV2);
router.post("/new_template", asyncHandler(newTemplate));

module.exports = router;
