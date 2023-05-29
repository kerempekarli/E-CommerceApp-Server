const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authenticate");
const {
  registerSeller,
  getAllSellers,
  getSeller,
  deleteSeller,
  sellerProducts,
  updateSeller,
  loginSeller,
  addProductToSeller,
} = require("../controllers/seller");
router.route("/").get(getAllSellers);
router.route("/").post(registerSeller);
router.put("/:id", updateSeller);
router.post("/login", loginSeller);
router.get("/:id", getSeller);

router.delete("/:id", deleteSeller);
router.route("/:sellerId/products").get(authenticateToken, sellerProducts);
router
  .route("/:sellerId/products/add")
  .post(authenticateToken, addProductToSeller);

module.exports = router;
