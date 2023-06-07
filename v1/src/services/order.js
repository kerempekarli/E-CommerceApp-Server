const db = require("../loaders/db");

const orderCartItems = async (userId, cartItems) => {
  try {
    // Sipariş verildiği tarihi ve saatini al
    const orderDate = new Date();

    // Sipariş verme işlemlerini yap
    const orderQuery =
      "INSERT INTO orders (user_id, order_date, status, total_amount) VALUES ($1, $2, $3, $4) RETURNING id";
    const orderValues = [userId, orderDate, "pending", 0]; // Durumu "pending" olarak ayarla, total_amount değeri başlangıçta 0 olarak ayarlandı
    const orderResult = await db.query(orderQuery, orderValues);
    const orderId = orderResult.rows[0].id;

    let totalAmount = 0; // Toplam miktarı takip etmek için bir değişken oluştur

    for (const cartItem of cartItems) {
      const { product_id, quantity } = cartItem;

      // Ürünün fiyatını ve diğer bilgilerini veritabanından al
      const productQuery = "SELECT price FROM products WHERE id = $1";
      const productValues = [product_id];
      const productResult = await db.query(productQuery, productValues);
      const productPrice = productResult.rows[0].price;

      const orderDetailQuery =
        "INSERT INTO order_details (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)";
      const orderDetailValues = [orderId, product_id, quantity, productPrice];
      await db.query(orderDetailQuery, orderDetailValues);

      // Toplam miktarı güncelle
      totalAmount += productPrice * quantity;
    }

    // Siparişin toplam miktarını güncelle
    const updateTotalAmountQuery =
      "UPDATE orders SET total_amount = $1 WHERE id = $2";
    const updateTotalAmountValues = [totalAmount, orderId];
    await db.query(updateTotalAmountQuery, updateTotalAmountValues);

    return true; // Sipariş verme işlemi başarılı olduysa true döndür
  } catch (error) {
    console.error("Sipariş verme işlemi başarısız oldu:", error);
    return false; // Sipariş verme işlemi başarısız olduysa false döndür
  }
};

module.exports = { orderCartItems };
