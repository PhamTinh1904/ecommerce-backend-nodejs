"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required
const slugify = require("slugify");

const DOCUMENT_NAME = "Spu";

// Declare the Schema of the Mongo model
const spuSchema = new Schema(
  {
    product_id: { type: String, default: "" },
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_slug: String,
    product_price: { type: Number, required: true },
    product_category: { type: Array, default: [] },
    product_quantity: { type: Number, required: true },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    /**
      {
        attribute_id: 12345,
        attribute_value: [
            {
                valud_id: 123
            }
        ]
     }
     */
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be above 5.0"],
    },
    product_variations: { type: Array, default: [] },
    /**
        tier_variations: [
            {
                images: [],
                name: color,
                options: [red, green, blue]
            },
            {
                image: [],
                name: size,
                options: [S, M, L, XL]
            }
        ]
     */
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
    isDelete: { type: Boolean, default: false },
  },
  {
    collation: { locale: "en_US" },
    timestamps: true,
  }
);

spuSchema.index({ product_name: "text", product_description: "text" });
spuSchema.pre("save", async function (next) {
  // Generate slug asynchronously
  this.product_slug = slugify(this.product_name, { lower: true });

  next(); // Pass error to Mongoose middleware chain
});

module.exports = model(DOCUMENT_NAME, spuSchema);
