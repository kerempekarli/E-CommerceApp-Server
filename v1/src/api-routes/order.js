const express = require("express");
const { order } = require("../controllers/order");
const { authenticateToken } = require("../middlewares/authenticate");
const router = express.Router();
router.route("/").post(authenticateToken, order);

module.exports = router;
