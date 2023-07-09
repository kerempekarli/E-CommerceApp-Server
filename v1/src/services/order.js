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
      const { product_id, quantity, seller_id } = cartItem;

      // Ürünün fiyatını ve diğer bilgilerini veritabanından al
      const productQuery =
        "SELECT spj.price FROM sellers_products_join spj JOIN products p ON p.id = spj.product_id WHERE p.id = $1;";
      const productValues = [product_id];
      const productResult = await db.query(productQuery, productValues);
      const productPrice = productResult.rows[0].price;

      const orderDetailQuery =
        "INSERT INTO order_details (order_id, product_id, quantity, unit_price, seller_id) VALUES ($1, $2, $3, $4, $5)";
      const orderDetailValues = [
        orderId,
        product_id,
        quantity,
        productPrice,
        seller_id,
      ];
      await db.query(orderDetailQuery, orderDetailValues);

      // Toplam miktarı güncelle
      totalAmount += productPrice * quantity;
    }

    console.log("TOTAL AMOUNT ", totalAmount);

    // Siparişin toplam miktarını güncelle
    const updateTotalAmountQuery =
      "UPDATE orders SET total_amount = $1 WHERE id = $2";
    const updateTotalAmountValues = [totalAmount, orderId];
    await db.query(updateTotalAmountQuery, updateTotalAmountValues);

    return { success: true, total_amount: totalAmount }; // Sipariş verme işlemi başarılı olduysa true döndür
  } catch (error) {
    console.error("Sipariş verme işlemi başarısız oldu:", error);
    return { success: false }; // Sipariş verme işlemi başarısız olduysa false döndür
  }
};
const getOrderItemsService = async (orderId) => {
  const query = `
  SELECT od.id, od.order_id, od.product_id, od.quantity, od.unit_price, od.seller_id, p.name as product_name
  FROM order_details od
  INNER JOIN products p ON od.product_id = p.id
  WHERE od.order_id = $1
`;

  const values = [orderId];

  const client = await db.connect();
  const result = await client.query(query, values);

  return result.rows;
};
async function getSellerOrdersWithUserAndProduct(sellerId) {
  try {
    const query = `
      SELECT o.id AS order_id, u.username AS user_username, p.name AS product_name
      FROM orders AS o
      JOIN users AS u ON o.user_id = u.id
      JOIN order_details AS od ON o.id = od.order_id
      JOIN products AS p ON od.product_id = p.id
      WHERE od.seller_id = $1
    `;
    const values = [sellerId];

    const result = await db.query(query, values);

    const orders = result.rows;

    return orders;
  } catch (error) {
    console.error(
      "Satıcının siparişlerini, kullanıcı ve ürün bilgileriyle birlikte alırken bir hata oluştu:",
      error
    );
    throw error;
  }
}

module.exports = {
  orderCartItems,
  getOrderItemsService,
  getSellerOrdersWithUserAndProduct,
};
