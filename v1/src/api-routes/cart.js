const { getAllCartItems } = require("../controllers/cart");
const { authenticateToken } = require("../middlewares/authenticate");
const express = require("express");
const router = express.Router();
router.route("/").get(authenticateToken, getAllCartItems);

module.exports = router;
