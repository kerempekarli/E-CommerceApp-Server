const express = require("express");
const { returnRole } = require("../controllers/role");
const { authenticateToken } = require("../middlewares/authenticate");
const router = express.Router();
router.route("/learn-role").get(authenticateToken, returnRole);

module.exports = router;
