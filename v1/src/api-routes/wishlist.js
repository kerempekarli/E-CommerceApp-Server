const express = require("express");
const { authenticateToken } = require("../middlewares/authenticate");
const {
  getWishListItems,
  addItem,
  deleteWishlistItem,
} = require("../controllers/wishlist");

const router = express.Router();
router.route("/getall").get(authenticateToken, getWishListItems);
router.route("/add-item").post(authenticateToken, addItem);
router.route("/delete-item").delete(authenticateToken, deleteWishlistItem);
module.exports = router;
