const db = require("../loaders/db");
const create = async (req, res) => {
  try {
    const query = "INSERT INTO categories (name) VALUES ($1) RETURNING *";
    const values = [req.body.name];
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (error) {
    console.error(error);
    res.status(500).send("Bir hata oluştu");
  }
};

// Tüm kategorileri alma (READ all)
const getAll = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM categories");
    return rows;
  } catch (error) {
    console.error(error);
    res.status(500).send("Silme işlemi başarısız");
  }
};

// Tek bir kategori alma (READ one)
const get = async (req, res) => {
  try {
    const query = "SELECT * FROM categories WHERE id = $1";
    const values = [req.params.id];
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (error) {
    res.status(500).send("Bir hata oluştu");
  }
};

// Kategori güncelleme (UPDATE)
const update = async (id, name) => {
  try {
    const query = "UPDATE categories SET name = $2 WHERE id = $1 RETURNING *";
    const values = [id, name];
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (error) {
    console.error(error);
  }
};

// Kategori silme (DELETE)
const remove = async (req, res) => {
  try {
    const query = "DELETE FROM categories WHERE id = $1 RETURNING *";
    const values = [req.params.id];
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (error) {
    console.error(error);
    res.status(500).send("Silme işlemi başarısız");
  }
};
module.exports = { create, getAll, get, update, update, remove };
