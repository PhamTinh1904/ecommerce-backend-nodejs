"use strict";
const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Inventory";

// Declare the Schema of the Mongo model
var inventorySchema = new Schema(
  {
    inven_productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    inven_location: {
      type: String,
      default: "unKnow",
    },
    inven_stock: {
      type: Number,
      required: true,
    },
    inven_shopId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    inven_reservations: {
      type: Array,
      default: [],
    },
  },
  {
    collation: { locale: "en_US" },
    timestamps: true,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, inventorySchema);
