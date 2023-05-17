const db = require("../loaders/db");

class CartService {
  constructor() {
    this.cart = null;
  }

  async getOrCreateCart(userId) {
    if (!this.cart) {
      // Kullanıcının cart'ını veritabanından al veya oluştur
      const query = "SELECT id FROM carts WHERE user_id = $1";
      const values = [userId];
      const result = await db.query(query, values);

      if (result.rows.length > 0) {
        this.cart = result.rows[0];
      } else {
        const createQuery =
          "INSERT INTO carts (user_id) VALUES ($1) RETURNING id";
        const createValues = [userId];
        const createResult = await db.query(createQuery, createValues);
        this.cart = createResult.rows[0];
      }
    }

    return this.cart.id;
  }

  async addToCart(cartId, productId, quantity) {
    const existingCartItemQuery =
      "SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2";
    const existingCartItemValues = [cartId, productId];
    const existingCartItemResult = await db.query(
      existingCartItemQuery,
      existingCartItemValues
    );

    if (existingCartItemResult.rows.length > 0) {
      const existingCartItem = existingCartItemResult.rows[0];
      const newQuantity = existingCartItem.quantity + quantity;

      const updateCartItemQuery =
        "UPDATE cart_items SET quantity = $1 WHERE id = $2";
      const updateCartItemValues = [newQuantity, existingCartItem.id];
      await db.query(updateCartItemQuery, updateCartItemValues);
    } else {
      const insertCartItemQuery =
        "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)";
      const insertCartItemValues = [cartId, productId, quantity];
      await db.query(insertCartItemQuery, insertCartItemValues);
    }
  }
}

// Singleton örneğini oluştur
const cartService = new CartService();

// Diğer dosyalardan kullanılabilmesi için export et
module.exports = cartService;
