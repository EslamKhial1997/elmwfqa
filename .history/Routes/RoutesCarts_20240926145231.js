const express = require("express");

const {
  createCart,
  getMyCart,
  deleteCart,
  deleteSpecificCartItem,
  updateSpecificCartItemQuantity,

} = require("../Services/CartService");
const { protect } = require("../Services/AuthService");

const Routes = express.Router();
Routes.use(protect);
Routes.route("/").post(createCart).get(getMyCart).delete(deleteCart);

Routes.route("/:id")
  .delete(deleteSpecificCartItem)
  .put(updateSpecificCartItemQuantity);

module.exports = Routes;
