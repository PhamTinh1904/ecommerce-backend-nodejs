"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "discounts";

// Declare the Schema of the Mongo model
var discountSchema = new Schema(
  {
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: "fixed_amount" },
    discount_value: { type: String, required: true },
    discount_code: { type: String, required: true },
    discount_start_date: { type: Date, required: true },
    discount_end_date: { type: Date, required: true },
    discount_max_uses: { type: Number, required: true }, // Số lượng discount được áp dụng
    discount_uses_count: { type: Number, required: true }, // Số discount đã sử dụng
    discount_users_used: { type: Array, default: [] }, // Ai là người sử dụng
    discount_max_uses_per_user: { type: Number, required: true}, //Số lượng cho phép tối đa được sử dụng
    discount_min_order_value: { type: Number, required: true},
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop'},
    discount_is_active: { type: Boolean, default: true},
    discount_applies_to: { type: String, required: true, enum: ['all', 'specific']},
    discount_product_ids: {type: Array, default: []} // Số sản phẩm được áp dụng

  },
  {
    collation: { locale: "en_US" },
    timestamps: true,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);
