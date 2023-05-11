const { getAll, add, update, get, remove } = require("../services/product");
const { addSellerProduct } = require("../services/sellers_products_join");

const getAllProducts = async (req, res) => {
  try {
    const data = await getAll(req, res);
    console.log(data);
    res.status(200).send(data.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
const addProduct = async (req, res) => {
  try {
    const data = await add(req, res);
    const product_id = data.rows[0].id;
    const seller_products = await addSellerProduct(req, product_id);
    console.log("seller_products başarıyla eklendi ", seller_products);
    res.status(201).json(data.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
const updateProduct = async (req, res) => {
  const result = await update(req, res);
  res.status(200).send(result);
};
const getProduct = async (req, res) => {
  const result = await get(req, res);
  return res.status(200).send(result);
};
const removeProduct = async (req, res) => {
  return await remove(req, res);
};
const getProductsOfSeller = async (req, res) => {};

module.exports = {
  getAllProducts,
  addProduct,
  updateProduct,
  getProduct,
  removeProduct,
};
