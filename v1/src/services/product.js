const db = require("../loaders/db");

const getAll = async (req, res) => {
  return db.query("SELECT * FROM products");
};
const addProduct = async (req, res) => {
  const { name, description, price } = req.body;

  return await db.query(
    "INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING *",
    [name, description, price]
  );
};
const update = async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  try {
    const result = await db.query(
      "UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4 RETURNING *",
      [name, description, price, id]
    );
    return result.rows[0];
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
const get = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("SELECT * FROM products WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Product not found" });
    } else {
      return result.rows[0];
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
const remove = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("DELETE FROM products WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Product not found" });
    } else {
      return res.status(204).send("Başarıyla silindi");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getAllSellerProductsBySellerId = async (req) => {
  const query = `
  SELECT p.*
  FROM products AS p
  JOIN sellers_products_join AS spj ON p.id = spj.product_id
  WHERE spj.seller_id = $1
`;
  const values = [req.params.sellerId];
  const result = await db.query(query, values);

  // Return the products
  return result.rows;
};

module.exports = {
  getAll,
  addProduct,
  update,
  get,
  remove,
  getAllSellerProductsBySellerId,
};
