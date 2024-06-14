"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Resource";

// Declare the Schema of the Mongo model

var resourceSchema = new Schema(
  {
    src_name: { type: String, required: true },
    src_slug: { type: String, required: true },
    src_description: { type: String, default: "" },
  },
  {
    collation: { locale: "en_US" },
    timestamps: true,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, resourceSchema);
