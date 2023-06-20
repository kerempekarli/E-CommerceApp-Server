const db = require("../loaders/db");

async function getNotifications() {
  const query = "SELECT * FROM notifications";
  const { rows } = await db.query(query);
  return rows;
}

async function createNotification(
  notification_type,
  seller_id,
  user_id,
  content
) {
  const query =
    "INSERT INTO notifications (notification_type, seller_id, user_id, content) VALUES ($1, $2, $3, $4) RETURNING *";
  const values = [notification_type, seller_id, user_id, content];
  const { rows } = await db.query(query, values);
  return rows[0];
}

async function updateNotification(id, seen) {
  const query = "UPDATE notifications SET seen = $1 WHERE id = $2 RETURNING *";
  const values = [seen, id];
  const { rows } = await db.query(query, values);
  return rows[0];
}

async function deleteNotification(id) {
  const query = "DELETE FROM notifications WHERE id = $1";
  const values = [id];
  await db.query(query, values);
}

async function getSellerNotifications(sellerId) {
  const query = "SELECT * FROM notifications WHERE seller_id = $1";
  const values = [sellerId];
  const { rows } = await db.query(query, values);
  return rows;
}

async function getUserNotifications(userId) {
  const query = "SELECT * FROM user_notifications WHERE user_id = $1";
  const values = [userId];
  const { rows } = await db.query(query, values);
  return rows;
}
const setAllNotificationTrueService = async (userId) => {
  const query = `
      UPDATE public.user_notifications
      SET seen = true
      WHERE user_id = $1;
    `;
  const values = [userId];
  await db.query(query, values);
  console.log(`All notifications for user ID ${userId} marked as seen.`);
};

module.exports = {
  getNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  getSellerNotifications,
  getUserNotifications,
  setAllNotificationTrueService,
};
