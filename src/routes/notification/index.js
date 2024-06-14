"use strict";

const express = require("express");

const router = express.Router();

const { asyncHandler } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const NotificationController = require("../../controllers/notification.controller");

router.use(authenticationV2);
router.get("", asyncHandler(NotificationController.getListNotiByUser));



module.exports = router;
