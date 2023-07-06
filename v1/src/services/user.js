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
    values: [id],
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
  let query = "UPDATE users SET ";
  let values = [];
  let index = 1;

  for (let column in req.body) {
    query += `${column} = $${index}, `;
    values.push(req.body[column]);
    index++;
  }

  query = query.slice(0, -2); // Son iki karakteri (", ") kaldır
  query += ` WHERE id = $${index}`;
  values.push(req.body.id);

  return db.query(query, values);
};
const login = (data) => {
  query = {
    text: "SELECT users.*, roles.role_name FROM users JOIN roles ON users.rol_id = roles.rol_id WHERE users.email = $1 AND users.password = $2",
    values: [data.email, data.password],
  };
  return db.query(query);
};
const addUserPhotoService = (filename, id) => {
  const query = "UPDATE users SET user_image = $1 WHERE id = $2";
  const values = [filename, id];
  return db.query(query, values);
};

module.exports = {
  insert,
  getAll,
  getById,
  remove,
  update,
  login,
  addUserPhotoService,
};
