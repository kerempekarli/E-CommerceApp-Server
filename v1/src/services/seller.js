const db = require("../loaders/db");

const insert = (data) => {
  return db.query(
    "INSERT INTO sellers (name, email, password) VALUES ($1, $2, $3);",
    [data.name, data.email, data.password]
  );
};
const login = (data) => {
  query = {
    text: "SELECT sellers.*, roles.rol_adı FROM sellers JOIN roles ON sellers.rol_id = roles.rol_id WHERE sellers.email = $1 AND sellers.password = $2",
    values: [data.email, data.password],
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
  getAll,
  remove,
  update,
};
