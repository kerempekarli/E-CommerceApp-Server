const express = require("express");
const { order, getOrderItems, getOrders } = require("../controllers/order");
const { authenticateToken } = require("../middlewares/authenticate");
const router = express.Router();
router.route("/").post(authenticateToken, order);
router.route("/getOrders").get(authenticateToken, getOrders);
router.route("/get-order/:id").get(authenticateToken, getOrderItems);
router.route("/:id").get(authenticateToken, getOrderItems);
router.route("/:id").put(authenticateToken, getOrderItems);

module.exports = router;
