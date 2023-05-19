const db = require("../loaders/db");
const orderCartİtems = async (userId, cartItems) => {
  try {
    // Sipariş verildiği tarihi ve saatini al
    const orderDate = new Date();

    // Sipariş verme işlemlerini yap
    const orderQuery =
      "INSERT INTO orders (user_id, order_date) VALUES ($1, $2) RETURNING id";
    const orderValues = [userId, orderDate];
    const orderResult = await db.query(orderQuery, orderValues);
    const orderId = orderResult.rows[0].id;

    for (const cartItem of cartItems) {
      const { product_id, quantity } = cartItem;

      // Ürünün fiyatını ve diğer bilgilerini veritabanından al
      const productQuery = "SELECT price FROM products WHERE id = $1";
      const productValues = [product_id];
      const productResult = await db.query(productQuery, productValues);
      const productPrice = productResult.rows[0].price;

      // Sipariş detayını oluştur
      const orderDetailQuery =
        "INSERT INTO order_details (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)";
      const orderDetailValues = [orderId, product_id, quantity, productPrice];
      await db.query(orderDetailQuery, orderDetailValues);
    }

    return true; // Sipariş verme işlemi başarılı olduysa true döndür
  } catch (error) {
    console.error("Sipariş verme işlemi başarısız oldu:", error);
    return false; // Sipariş verme işlemi başarısız olduysa false döndür
  }
};

module.exports = { orderCartİtems };
