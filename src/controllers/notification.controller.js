"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const { listNotiByUser } = require("../services/notification.service");

class NotificationController {
    getListNotiByUser = async (req, res) => {
    new SuccessResponse({
      message: "Get notification successfully!",
      metadata: await listNotiByUser({
        ...req.query,
      }),
    }).send(res);
  };
}

module.exports = new NotificationController();
