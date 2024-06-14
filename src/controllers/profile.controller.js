"use strict";

const { BadRequestError } = require("../core/error.response");
const { CREATED, SuccessResponse } = require("../core/success.response");

const profiles = [
  {
    name: "Ronaldol",
    age: 39,
  },
  {
    name: "Messi",
    age: 24,
  },
  {
    name: "Bellingham",
    age: 21,
  },
];

class ProfileController {
  getProfiles = (req, res) => {
    new SuccessResponse({
      message: "Profile successfully!",
      metadata: profiles,
    }).send(res);
  };

  getProfile = (req, res) => {
    new SuccessResponse({
      message: "Profile successfully!",
      metadata: {
        name: "Messi",
        age: 24,
      },
    }).send(res);
  };
}

module.exports = new ProfileController();
