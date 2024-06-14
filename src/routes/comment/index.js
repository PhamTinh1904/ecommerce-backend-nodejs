"use strict";

const express = require("express");

const router = express.Router();

const { asyncHandler } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const CommentController = require("../../controllers/comment.controller");

router.use(authenticationV2);
router.post("", asyncHandler(CommentController.createComment));
router.get("", asyncHandler(CommentController.getCommentByParentId));


module.exports = router;
