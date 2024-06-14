"use strict";

const { BadRequestError } = require("../core/error.response");
const { CREATED, SuccessResponse } = require("../core/success.response");

const {
  uploadImageFromLocal,
  uploadImageFromUrl,
  uploadImageFromLocalS3
} = require("../services/upload.service");

class UploadController {

  uploadImage = async (req, res) => {
    new SuccessResponse({
      message: "Upload image successfully!",
      metadata: await uploadImageFromUrl(),
    }).send(res);
  };

  uploadFileThumb = async (req, res) => {
    const { file } = req
    console.log(file);
    if (!file) throw new BadRequestError("File not found!");
    new SuccessResponse({
      message: "Upload image successfully!",
      metadata: await uploadImageFromLocal({
        path: file.path,
      }),
    }).send(res);
  };

  uploadFileThumbS3 = async (req, res) => {
    const { file } = req
    // Random name using cryto
  
  
    if (!file) throw new BadRequestError("File not found!");
    new SuccessResponse({
      message: "Upload image successfully!",
      metadata: await uploadImageFromLocalS3({
        file
      }),
    }).send(res);
  };

}

module.exports = new UploadController();
