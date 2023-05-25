const cartService = require("../services/cart");

const getAllCartItems = async (req, res) => {
  const userId = req.user.id;
  const cartItems = await cartService.getCartItems(userId);
  console.log(cartItems);
  res.status(200).send(cartItems);
};

module.exports = { getAllCartItems };
