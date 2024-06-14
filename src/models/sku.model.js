"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required
const slugify = require("slugify");

const DOCUMENT_NAME = "Sku";

// Declare the Schema of the Mongo model
const skuSchema = new Schema(
  {
    sku_id: { type: String, required: true },
    sku_tier_idx: { type: Array, default: [0] },
    /**
        color = [red, green] = [0 , 1]
        size = [S, M]

        => red + s = [0, 0]
        => red + M = [0, 1]
     */
    sku_default: { type: Boolean, default: true },
    sku_slug: { type: String, default: "" },
    sku_price: { type: String, required: true },
    sku_sort: { type: Number, default: 0 },
    sku_stock: { type: Number, default: 0 },
    product_id: { type: String, required: true },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
    isDelete: { type: Boolean, default: false },
  },
  {
    collation: { locale: "en_US" },
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, skuSchema);
