const { CREATED, SuccessResponse } = require("../core/success.response");
const { newTemplate } = require("../services/template.service");

class EmailController {
  newTemplate = async (req, res) => {
    new SuccessResponse({
      message: "Create new template successfully!",
      metadata: await newTemplate(req.body),
    }).send(res);
  };
}

module.exports = new EmailController();
