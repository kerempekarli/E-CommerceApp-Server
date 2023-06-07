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

  async addToCart(cartId, productId, quantity, seller_id) {
    console.log("EKLEME CART ÇALIŞTI");
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
        "INSERT INTO cart_items (cart_id, product_id, quantity, seller_id) VALUES ($1, $2, $3, $4)";
      const insertCartItemValues = [cartId, productId, quantity, seller_id];
      await db.query(insertCartItemQuery, insertCartItemValues);
    }
  }
  async decreaseCartItemQuantity(cartId, productId) {
    try {
      const existingCartItemQuery =
        "SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2";
      const existingCartItemValues = [cartId, productId];
      const existingCartItemResult = await db.query(
        existingCartItemQuery,
        existingCartItemValues
      );

      if (existingCartItemResult.rows.length > 0) {
        const existingCartItem = existingCartItemResult.rows[0];
        const newQuantity = existingCartItem.quantity - 1;

        if (newQuantity > 0) {
          const updateCartItemQuery =
            "UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3";
          const updateCartItemValues = [newQuantity, cartId, productId];
          await db.query(updateCartItemQuery, updateCartItemValues);
        } else {
          const deleteCartItemQuery =
            "DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2";
          const deleteCartItemValues = [cartId, productId];
          await db.query(deleteCartItemQuery, deleteCartItemValues);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  async getCartItems(userId) {
    const cartId = await this.getOrCreateCart(userId);

    const query = `
    SELECT ci.id, ci.product_id, ci.quantity, p.name, spj.price
    FROM cart_items ci
    INNER JOIN products p ON ci.product_id = p.id
    INNER JOIN sellers_products_join spj ON p.id = spj.product_id
    WHERE ci.cart_id = $1;
    
    `;
    const values = [cartId];
    const result = await db.query(query, values);

    return result.rows;
  }
  // Kullanıcının kartındaki öğeleri cart_items tablosundan sil
  async deleteCartItems(cartId) {
    const deleteCartItemsQuery = "DELETE FROM cart_items WHERE cart_id = $1";
    const deleteCartItemsValues = [cartId];
    await db.query(deleteCartItemsQuery, deleteCartItemsValues);
  }
}

// Singleton örneğini oluştur
const cartService = new CartService();

// Diğer dosyalardan kullanılabilmesi için export et
module.exports = cartService;
