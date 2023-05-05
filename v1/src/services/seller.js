const db = require("../loaders/db");

const insert = (data) => {
  return db.query(
    "INSERT INTO sellers (name, email, password) VALUES ($1, $2, $3);",
    [data.name, data.email, data.password]
  );
};
const login = (data) => {
  console.log(data);
  query = {
    text: "SELECT * FROM sellers WHERE email = $1 AND password = $2",
    values: [data.email, data.password],
  };
  return db.query(query);
};
const getById = (id) => {
  const query = {
    text: "SELECT * FROM sellers WHERE id = $1 LIMIT 1",
    values: ["1"],
  };
  return db.query(query);
};
const getAll = () => {
  return db.query("SELECT * FROM sellers");
};
const remove = (req, res) => {
  const query = {
    text: "DELETE FROM sellers WHERE id = $1",
    values: [req.params.id],
  };

  return db.query(query);
};
const update = (req, res) => {
  const query = {
    text: `UPDATE sellers SET ${Object.keys(req.body)
      .map((key, i) => `${key}=$${i + 1}`)
      .join(", ")} WHERE id=$${Object.keys(req.body).length + 1} RETURNING *`,
    values: [...Object.values(req.body), req.params.id],
  };
  const result = db.query(query);
  return result;
};

module.exports = {
  insert,
  login,
  getById,
  getAll,
  remove,
  update,
};
