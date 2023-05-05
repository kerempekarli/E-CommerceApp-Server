const express = require("express");
const router = express.Router();
const {
  registerSeller,
  getAllSellers,
  getSeller,
  deleteSeller,
  updateSeller,
  loginSeller,
} = require("../controllers/seller");
router.route("/").get(getAllSellers);
router.route("/register").post(registerSeller);
router.put("/:id", updateSeller);
router.post("/login", loginSeller);
router.get("/:id", getSeller);
router.delete("/:id", deleteSeller);

module.exports = router;
