const express = require("express");
const {
  getAllProducts,
  addProduct,
  updateProduct,
  commentToProduct,
  getProduct,
  removeProduct,
  likeTheProduct,
  addToWishlist,
  addToCart,
  decreaseFromCart,
} = require("../controllers/product");
const { authenticateToken } = require("../middlewares/authenticate");
const { storage } = require("../scripts/utils/fileHelper");
const multer = require("multer");
const uploadFile = multer({ storage: storage });
const router = express.Router();
router.route("/").get(authenticateToken, getAllProducts);
router
  .route("/add")
  .post(authenticateToken, uploadFile.single("photo"), addProduct);
router.route("/:id").put(authenticateToken, updateProduct);
router.get("/:id", getProduct);
router.delete("/:id", removeProduct);
router.route("/:id/add-comment").post(authenticateToken, commentToProduct);
router.route("/:id/like").post(authenticateToken, likeTheProduct);
router.route("/:id/add-to-wishlist").post(authenticateToken, addToWishlist);
router.route("/:id/add-to-cart").post(authenticateToken, addToCart);
router
  .route("/:id/decrease-cart-item-quantity")
  .post(authenticateToken, decreaseFromCart);

module.exports = router;
