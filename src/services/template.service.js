const TEMPLATE = require("../models/template.model");
const { htmlEmalToken } = require("../utils/tem.html");

const newTemplate = async ({ tem_id, tem_name }) => {
  //1. check if template exists
  //2. create a new template
  try {
    const newTem = await TEMPLATE.create({
      tem_id,
      tem_name,
      tem_html: htmlEmalToken(),
    });
    return newTem;
  } catch (error) {
    return error;
  }
};

const getTemplate = async ({ tem_name }) => {
  const template = await TEMPLATE.find({
    tem_name,
  });

  return template[0];
};

module.exports = {
  newTemplate,
  getTemplate,
};
