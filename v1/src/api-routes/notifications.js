const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authenticate");
const {
  createNotification,
  deleteNotification,
  getSellerNotifications,
  getUserNotifications,
  updateNotification,
} = require("../controllers/notification");

router.route("/seller").get(authenticateToken, getSellerNotifications);

router.route("/user").get(authenticateToken, getUserNotifications);

router.route("/").post(createNotification);

router
  .route(":id")
  .put(authenticateToken, updateNotification)
  .delete(authenticateToken, deleteNotification);

module.exports = router;
