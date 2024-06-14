"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class accessController {
  handlerRefreshToken = async (req, res) => {
    // new SuccessResponse({
    //   message: "Get token successfully!",
    //   metadata: await AccessService.handlerRefreshToken(req.body.refreshToken),
    // }).send(res);

    new SuccessResponse({
      message: "Get token successfully",
      metadata: await AccessService.handlerRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };
  logout = async (req, res) => {
    new SuccessResponse({
      message: "Logout successful!",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };
  login = async (req, res) => {
    new SuccessResponse({
      message: "Login successful!",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Regiserted OK!",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
}

module.exports = new accessController();
