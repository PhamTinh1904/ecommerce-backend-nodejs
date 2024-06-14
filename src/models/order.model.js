"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Order";

// Declare the Schema of the Mongo model
var orderSchema = new Schema(
  {
    order_userId: {type: Number, required: true},
    order_checkout: {type: Object, default: {}},
    order_shipping: {type: Object, default: {}},
    order_payment: {type: Object, default: {}},
    order_products: {type: Array, required: true},
    order_trackingNumber: {type: String, default: '#0000118052022'},
    order_status: {type: String, emum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending'}

  },
  {
    collation: { locale: "en_US" },
    timestamps: true,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, orderSchema);
