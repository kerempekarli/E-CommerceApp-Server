const express = require("express");
const router = express.Router();
const { resetPassword, forgotPassword } = require("../controllers/account");

router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);

module.exports = router;
