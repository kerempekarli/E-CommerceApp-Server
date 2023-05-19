const cart = require("../services/cart");
const { orderCartİtems } = require("../services/order");

const order = async (req, res) => {
  const cartId = await cart.getOrCreateCart(req.user.id);
  const cartItems = await cart.getCartItems(cartId);
  const result = await orderCartİtems(req.user.id, cartItems);

  res.status(200).send({ result: result });
};
module.exports = { order };
