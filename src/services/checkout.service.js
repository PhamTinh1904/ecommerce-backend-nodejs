"use strict";

const { NotFoundError, BadRequestError } = require("../core/error.response");
const { findCartById } = require("../models/repositories/cart.repo");
const { getDiscountAmount } = require("../services/discount.service");
const {
  checkProductByServer,
} = require("../models/repositories/product.repo");
const { acquireLock, releaseLock } = require("./redis.service");
const orderModel = require("../models/order.model");

class CheckOutService {

    /* Payload
    {
        cartId,
        userId,
        shop_order_ids: [
            {
                shopId,
                shop_discount: [],
                item_products: [
                    {
                        price,
                        quantity,
                        productId   
                    }
                ]
            }
             {
                shopId,
                shop_discount: [
                    {
                        "shopId",
                        "discountId",
                        codeId
                    }
                ],
                item_products: [
                    {
                        price,
                        quantity,
                        productId   
                    }
                ]
            }
        ]
    }
    
    */ 
   /*
   1. Create new order [user]
   2. Query Order [user]
   3. Query order using it's id [user]
   4. Update order status [admin]
   */ 
  static async checkOutReview({ cartId, userId, shop_order_ids }) {
    // Check cardId
    const foundCart = findCartById(cartId);
    if (!foundCart) throw new BadRequestError("Cart not found!");

    const checkout_order = {
        totalPrice: 0, // tong tien hang  
        freeShip: 0, // phi van chuuyen
        totalDiscount: 0, // tong tien khuyen mai
        totalCheckout: 0, // tong tien thanh toan
      },
      shop_order_ids_new = []

// Tính tổng tiền bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];

      const checkProductServer = await checkProductByServer(item_products);
      console.log(checkProductServer);
      if (!checkProductServer) throw new BadRequestError("Oder wrong!");

      const checkOutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      checkout_order.totalPrice +=checkOutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkOutPrice,
        priceApplyDiscount: checkOutPrice,
        item_products: checkProductServer,
      };

      if (shop_discounts.length > 0) {
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer,
        });
        // Tổng cộng discount giảm giá
        checkout_order.totalDiscount += discount;

        // Nếu tiền giảm giá lớn hơn 0
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkOutPrice - discount;
        }
      }

      // Tổng thanh toán cuối cùng
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout)
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order  
    }
  }

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {}
  }){
    const {shop_order_ids_new, checkout_order} = await CheckOutService.checkOutReview({
      cartId,
      userId,
      shop_order_ids
    })

    const products = shop_order_ids.flatMap(order=>order.item_products)
    const acquireProduct = []
    for(let i = 0; i < products.length; i++) {
      const {productId, quantity} = products[i]
      const keyLock = await acquireLock(productId, quantity, cartId)
      acquireProduct.push(keyLock ? true : false)
      if(keyLock){
        await releaseLock(keyLock)
      }
    }

    if(acquireLock.includes(false)){
      throw new BadRequestError("Một số sản phẩm đã được cập nhật, vui lòng quay lại giỏ hàng!")
    }
    const newOrder = await orderModel.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new

    })
   
  }


}

module.exports = CheckOutService
