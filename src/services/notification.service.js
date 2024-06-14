"use strict";

const notificationModel = require("../models/notification.model");

const pushNotiToSystem = async ({
  type = "SHOP-001",
  receiverId = 1,
  senderId = 1,
  options = {},
}) => {
  let noti_content;
  switch (type) {
    case "ORDER-001":
      noti_content = "New order has been created";
      break;
    case "ORDER-002":
      noti_content = "Order has been updated";
      break;
    case "PROMOTION-001":
      noti_content = "New promotion has been created";
      break;
    case "SHOP-001":
      noti_content = "New shop has been created";
      break;
    default:
      noti_content = "New notification";
  }

  const newNoti = await notificationModel.create({
    noti_type: type,
    noti_senderId: senderId,
    noti_receiverId: receiverId,
    noti_content,
    noti_options: options,
  });

  return newNoti;
};

const listNotiByUser = async ({ userId = 1, type = "ALL", isRead = 0 }) => {
  const match = { noti_receiverId: userId };

  if (type !== "ALL") {
    match["noti_type"] = type;
  }

  return await notificationModel.aggregate([
    {
      $match: match,
    },
    {
      $project: {
        noti_type: 1,
        noti_senderId: 1,
        noti_content: 1,
        noti_options: 1,
        createdAt: 1,
      },
    },
  ]);
};
module.exports = {
  pushNotiToSystem,
  listNotiByUser
};
