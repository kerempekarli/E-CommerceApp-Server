const {
  getAll,
  add,
  update,
  get,
  remove,
  addComment,
  likeTheProductService,
  addToWishlistService,
  getProductLikesService,
} = require("../services/product");
const { addSellerProduct } = require("../services/sellers_products_join");
const cartService = require("../services/cart");

const getAllProducts = async (req, res) => {
  try {
    const data = await getAll(req, res);
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
    res.status(201).send("Ekleme işlemi başarılı");
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
const commentToProduct = async (req, res) => {
  await addComment(req);
  res.status(200).send("Yorum başarıyla eklendi");
};
const likeTheProduct = async (req, res) => {
  const productId = req.params.id;
  const userId = req.user.id;
  await likeTheProductService(productId, userId, res);
};
const addToWishlist = async (req, res) => {
  const productId = req.params.id; // URL'deki productId parametresini alın
  const userId = req.user.id; // İstekteki kullanıcı ID'si
  await addToWishlistService(productId, userId, res);
};

const addToCart = async (req, res) => {
  try {
    const cardId = await cartService.getOrCreateCart(req.user.id);
    const result = await cartService.addToCart(cardId, req.params.id, 1);
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send(err);
  }
};
const decreaseFromCart = async (req, res) => {
  try {
    const cardId = await cartService.getOrCreateCart(req.user.id);
    const result = await cartService.decreaseCartItemQuantity(
      cardId,
      req.params.id,
      1
    );
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send(err);
  }
};

const getProductLikes = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const data = await getProductLikesService(userId);
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(400).send("Hata");
    throw error;
  }
};
module.exports = {
  getAllProducts,
  addProduct,
  updateProduct,
  getProduct,
  removeProduct,
  likeTheProduct,
  commentToProduct,
  addToWishlist,
  addToCart,
  decreaseFromCart,
  getProductLikes,
};
