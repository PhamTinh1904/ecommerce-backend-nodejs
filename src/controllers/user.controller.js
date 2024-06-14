const { SuccessResponse } = require("../core/success.response");
const userService = require("../services/user.service");

class UserController {
  newUser = async (req, res, next) => {
    new SuccessResponse({
      message: "Verify email user",
      metadata: await userService.newUser({ email: req.body.email }),
    }).send(res);
  };

  checkLoginEmailToken = async (req, res, next) => {
    const { token } = req.query;

    new SuccessResponse({
      message: "Login success",
      metadata: await userService.checkLoginEmailToken({ token }),
    }).send(res);
  };
}

module.exports = new UserController();
