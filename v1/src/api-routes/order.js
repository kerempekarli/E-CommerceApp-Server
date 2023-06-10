const express = require("express");
const { order, getOrderItems } = require("../controllers/order");
const { authenticateToken } = require("../middlewares/authenticate");
const router = express.Router();
router.route("/").post(authenticateToken, order);
router.route("/:id").get(authenticateToken, getOrderItems);

module.exports = router;
