'use strict';

const { BadRequestError } = require("../core/error.response");
const inventoryModel = require("../models/inventory.model");
const { getProductById } = require("../models/repositories/product.repo");

class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = "134 Tran Phu, HCM"
    }){

        const product = await getProductById(productId);
        if(!product) throw BadRequestError('The product does not exits!')

        const query = {inven_shopId: shopId, inven_productId: productId},
        updateSet = {
           $inc: {
            inven_stock: stock
           },
           $set: {
            inven_location: location
           }     
        }, options = {upsert: true, new: true}

        return await inventoryModel.findOneAndUpdate(query, updateSet, options);
    }
}