"use strict";

const express = require("express");

const router = express.Router();

const { asyncHandler } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const { newUser, checkLoginEmailToken } = require("../../controllers/user.controller");


// router.use(authenticationV2);
router.post("/new_user", asyncHandler(newUser));
router.get("/welcom-back", asyncHandler(checkLoginEmailToken));


module.exports = router;
