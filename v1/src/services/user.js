const db = require("../loaders/db");

const insert = (data) => {
  //...

  return db.query(
    "INSERT INTO users (username, email, password, first_name, last_name) VALUES ($1, $2, $3, $4, $5);",
    [data.username, data.email, data.password, data.first_name, data.last_name]
  );
};
const getById = (id) => {
  const query = {
    text: "SELECT * FROM users WHERE id = $1 LIMIT 1",
    values: ["1"],
  };
  return db.query(query);
};
const getAll = () => {
  return db.query("SELECT * FROM users");
};
const remove = (req, res) => {
  const query = {
    text: "DELETE FROM users WHERE id = $1",
    values: [req.params.id],
  };

  return db.query(query);
};
const update = (req, res) => {
  const query = {
    text: "UPDATE users SET first_name = $1 WHERE id = $2",
    values: [req.body.first_name, req.body.id],
  };

  return db.query(query);
};

const login = (data) => {
  console.log(data);
  query = {
    text: "SELECT * FROM users WHERE email = $1 AND password = $2",
    values: [data.email, data.password],
  };
  return db.query(query);
};

module.exports = {
  insert,
  getAll,
  getById,
  remove,
  update,
  login,
};
