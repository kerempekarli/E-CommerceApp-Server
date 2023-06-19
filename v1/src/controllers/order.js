const cart = require("../services/cart");
const { orderCartItems, getOrderItemsService } = require("../services/order");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);
const amqp = require("amqplib");

const order = async (req, res) => {
  // const cartId = await cart.getOrCreateCart(req.user.id);
  // const cartItems = await cart.getCartItems(cartId);
  // const result = await orderCartItems(req.user.id, cartItems);

  const { amount, payment_id } = req.body;

  // try {
  //   const payment = await stripe.paymentIntents.create({
  //     amount: result.total_amount * 1000,
  //     currency: "USD",
  //     description: "Ödeme denemesi",
  //     payment_method: id,
  //     confirm: true,
  //   });

  //   res.status(200).json({
  //     message: "Satın alma işlemi başarılı",
  //     success: true,
  //   });
  // } catch (err) {
  //   console.log("ERROR ", err);
  //   res.json("Satın alma işlemi başarısız");
  //   return; // Hata durumunda fonksiyondan çık
  // }
  res.status(200).send({ success: true, message: "Sipariş başarıyla alındı" });
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queue = "purchase_queue";

    const orderData = {
      userId: req.user.id,
      payment_id: payment_id,
    };

    const orderBuffer = Buffer.from(JSON.stringify(orderData));

    channel.sendToQueue(queue, orderBuffer);
    console.log("Sipariş gönderildi:", orderData);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Hata:", error);
  }
};

const getOrderItems = async (req, res) => {
  try {
    const orderId = req.params.id;
    const orderItems = await getOrderItemsService(orderId);

    res.status(200).json(orderItems);
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
async function calculateCartItemsTotalPrice(cartItems) {
  try {
    const client = await pool.connect();

    let totalAmount = 0;

    for (const cartItem of cartItems) {
      const { product_id, seller_id, quantity } = cartItem;

      // Seller ve ürün bilgilerini sellers_products_join tablosundan al
      const query = `
        SELECT price
        FROM sellers_products_join
        WHERE seller_id = $1 AND product_id = $2;
      `;
      const values = [seller_id, product_id];
      const result = await client.query(query, values);

      if (result.rows.length > 0) {
        const price = result.rows[0].price;
        const itemTotalPrice = price * quantity;
        totalAmount += itemTotalPrice;
      }
    }

    // Sonuçları döndür
    return totalAmount;
  } catch (error) {
    console.error("Hata:", error);
  } finally {
    client.release();
  }
}

module.exports = { order, getOrderItems };
