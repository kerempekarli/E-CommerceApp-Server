const db = require("../loaders/db");

module.exports = {
  async createProduct(name, description, price, images) {
    const query = {
      text: "INSERT INTO products (name, description, price, images) VALUES ($1, $2, $3, $4) RETURNING *",
      values: [name, description, price, images],
    };
    const { rows } = await db.query(query);
    return rows[0];
  },

  async getProduct(id) {
    const query = {
      text: "SELECT * FROM products WHERE id = $1",
      values: [id],
    };
    const { rows } = await db.query(query);
    return rows[0];
  },

  async getProducts() {
    const query = {
      text: "SELECT * FROM products",
    };
    const { rows } = await db.query(query);
    return rows;
  },

  async updateProduct(id, name, description, price, images) {
    const query = {
      text: "UPDATE products SET name = $2, description = $3, price = $4, images = $5 WHERE id = $1 RETURNING *",
      values: [id, name, description, price, images],
    };
    const { rows } = await db.query(query);
    return rows[0];
  },

  async deleteProduct(id) {
    const query = {
      text: "DELETE FROM products WHERE id = $1",
      values: [id],
    };
    return await db.query(query);
  },
};
