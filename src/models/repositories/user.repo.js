"use strict";

const USER = require("../user.model");

const findUseryEmail = async({email})=>{
  const user = await USER.findOne({usr_email: email});
  return user;
};


const createUser = async ({
  usr_id,
  usr_name,
  usr_email,
  usr_slug,
  usr_password,
  usr_role,
}) => {
  const newUser = await USER.create({
    usr_id,
    usr_name,
    usr_email,
    usr_slug,
    usr_password,
    usr_role,
  });

  return newUser;
};

module.exports = {
  createUser,
  findUseryEmail
};
