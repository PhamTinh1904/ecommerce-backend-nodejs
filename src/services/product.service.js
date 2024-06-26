"use strict";

const { clothing, product, electronic } = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");

class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case "Clothing":
        return new Clothing(payload).createProduct();
      case "Electronic":
        return new Electronic(payload).createProduct();
      default:
        throw new BadRequestError("Invalid Product type: " + type);
    }
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_type,
    product_shop,
    product_attributes,
    product_quantity,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
    this.product_quantity = product_quantity;
  }

  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newCloting = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newCloting) throw new BadRequestError("Create clothing failed!");

    const newProduct = await super.createProduct(newCloting._id);
    if (!newProduct) throw new BadRequestError("Create Product failed!");

    return newProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) throw new BadRequestError("Create electronic failed!");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("Create Product failed!");

    return newProduct;
  }
}

module.exports = ProductFactory;
