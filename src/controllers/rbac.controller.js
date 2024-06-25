"use strict";

const { BadRequestError } = require("../core/error.response");
const { CREATED, SuccessResponse } = require("../core/success.response");
const {
  createResource,
  roleList,
  resourceList,
  createRole,
} = require("../services/rbac.service");

/**
 * @desc Creates a new role
 * @param {string} name 
 * @param {*} res 
 * @param {*} next 
 */
const newRole = async (req, res, next) => {
  new SuccessResponse({
    message: "Created resource",
    metadata: await createRole(req.body),
  }).send(res);
};

const listRoles = async (req, res, next) => {
  new SuccessResponse({
    message: "Created resource",
    metadata: await roleList(req.query),
  }).send(res);
};

const newResource = async (req, res, next) => {
  new SuccessResponse({
    message: "Created resource",
    metadata: await createResource(req.body),
  }).send(res);
};

const listResources = async (req, res, next) => {
  new SuccessResponse({
    message: "Get list resource successfully!",
    metadata: await resourceList(req.query),
  }).send(res);
};

module.exports = {
  newRole,
  listRoles,
  newResource,
  listResources,
};
