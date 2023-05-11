const express = require("express");
const {
  getAllProducts,
  addProduct,
  updateProduct,
  getProduct,
  removeProduct,
} = require("../controllers/product");
const { authenticateToken } = require("../middlewares/authenticate");
const router = express.Router();
router.route("/").get(authenticateToken, getAllProducts);
router.route("/add").post(authenticateToken, addProduct);
router.route("/:id").put(authenticateToken, updateProduct);
router.get("/:id", getProduct);
router.delete("/:id", removeProduct);

module.exports = router;
