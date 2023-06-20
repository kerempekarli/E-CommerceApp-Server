const notificationService = require("../services/notification");

async function getNotifications(req, res) {
  try {
    const notifications = await notificationService.getNotifications();
    res.json(notifications);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while retrieving notifications." });
  }
}

async function createNotification(req, res) {
  try {
    const { notification_type, seller_id, user_id, content } = req.body;
    const notification = await notificationService.createNotification(
      notification_type,
      seller_id,
      user_id,
      content
    );
    res.status(201).json(notification);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating a notification." });
  }
}

async function updateNotification(req, res) {
  try {
    const id = req.params.id;
    const { seen } = req.body;
    const notification = await notificationService.updateNotification(id, seen);
    res.json(notification);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating a notification." });
  }
}

async function deleteNotification(req, res) {
  try {
    const id = req.params.id;
    await notificationService.deleteNotification(id);
    res.json({ message: "Notification deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting a notification." });
  }
}

async function getSellerNotifications(req, res) {
  try {
    const sellerId = req.query.sellerId;
    const notifications = await notificationService.getSellerNotifications(
      sellerId
    );
    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while retrieving seller notifications.",
    });
  }
}

async function getUserNotifications(req, res) {
  try {
    const userId = req.user.id;
    const notifications = await notificationService.getUserNotifications(
      userId
    );
    console.log("NOTIFICATION ", notifications);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while retrieving user notifications.",
    });
    console.log("ERROR ", error);
  }
}
async function setAllNotificationTrue(req, res) {
  try {
    const result = await notificationService.setAllNotificationTrueService(
      req.user.id
    );
    res.status(200).send({ success: true, data: result });
  } catch (error) {
    console.error("Error setting notifications as seen:", error);
    res.status(400).send({ success: false, message: "Başarısız" });
  }
}

module.exports = {
  getNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  getSellerNotifications,
  getUserNotifications,
  setAllNotificationTrue,
};
