const db = require("../loaders/db");

const reset = async (email) => {
  const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return user;
};

module.exports = { reset };
