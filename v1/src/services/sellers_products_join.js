const db = require("../loaders/db");

const addSellerProduct = async (req, product_id) => {
  const insertSellerProductQuery =
    "INSERT INTO sellers_products_join (seller_id, product_id) VALUES ($1, $2)";
  const user = await db.query(insertSellerProductQuery, [
    req.user.id,
    product_id,
  ]);

  return user;
};

module.exports = { addSellerProduct };
