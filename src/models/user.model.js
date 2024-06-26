"use strict";

const { Type } = require("@aws-sdk/client-s3");
const { Schema, model, Types } = require("mongoose"); // Erase if already required


const DOCUMENT_NAME = "User";

// Declare the Schema of the Mongo model
var userSchema = new Schema(
  {
    usr_id: { type: Number, required: true },
    usr_slug: { type: String, required: true },
    usr_name: { type: String, default: "" },
    usr_password: { type: String, default: "" },
    usr_salf: { type: String, default: "" },
    usr_email: { type: String, required: true },
    usr_phone: { type: String, default: "" },
    usr_sex: { type: String, default: "" },
    usr_avatar: { type: String, default: "" },
    usr_date_of_birth: { type: Date, default: null },
    
    usr_role: { type: Schema.Types.ObjectId, ref: "Role" },
    // usr_role: { type: String, default: "" },

    usr_status: {
      type: String,
      default: "pending",
      enum: ["pending", "active", "block"],
    },
  },
  {
    collation: { locale: "en_US" },
    timestamps: true,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, userSchema);
