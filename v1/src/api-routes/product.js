const express = require("express");
const {
  getAllProducts,
  addProduct,
  updateProduct,
  getProduct,
  deleteProduct,
} = require("../controllers/product");
const router = express.Router();
router.route("/").get(getAllProducts);
router.route("/").post(addProduct);
router.put("/", updateProduct);
router.get("/:id", getProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
