"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const CommentService = require("../services/comment.service");

class CommentController {
  createComment = async (req, res) => {
    new SuccessResponse({
      message: "Create new Comment successfully!",
      metadata: await CommentService.createComment({
        ...req.body,
      }),
    }).send(res);
  };

  getCommentByParentId = async (req, res) => {
    new SuccessResponse({
      message: "Get comment successfully!",
      metadata: await CommentService.getCommentByParentId({
        ...req.query,
      }),
    }).send(res);
  };
}

module.exports = new CommentController();
