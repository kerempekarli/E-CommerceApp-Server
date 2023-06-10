const cart = require("../services/cart");
const { orderCartItems, getOrderItemsService } = require("../services/order");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);
const amqp = require("amqplib");

const order = async (req, res) => {
  const cartId = await cart.getOrCreateCart(req.user.id);
  console.log("cartId ", cartId);
  const cartItems = await cart.getCartItems(cartId);
  console.log("cartItems ", cartItems);
  const result = await orderCartItems(req.user.id, cartItems);

  console.log("RESULT ", result);

  const { amount, id } = req.body;

  console.log("AMOUND AND ID ", result.total_amount);

  try {
    const payment = await stripe.paymentIntents.create({
      amount: result.total_amount * 1000,
      currency: "USD",
      description: "Spatula denem 1510",
      payment_method: id,
      confirm: true,
    });

    console.log("PAYMENT ", payment);
    res.status(200).json({
      message: "Satın alma işlemi başarılı",
      success: true,
    });
  } catch (err) {
    console.log("ERROR ", err);
    res.json("Satın alma işlemi başarısız");
    return; // Hata durumunda fonksiyondan çık
  }

  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queue = "purchase_queue";

    const orderData = {
      userId: req.user.id,
      cartItems: cartItems,
      amount: result.total_amount,
    };

    const orderBuffer = Buffer.from(JSON.stringify(orderData));

    channel.sendToQueue(queue, orderBuffer);
    console.log("Sipariş gönderildi:", orderData);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Hata:", error);
  }

  // res.status(200).send({ success: true, message: "başarılı" });
};

const getOrderItems = async (req, res) => {
  try {
    const orderId = req.params.id;
    console.log(" ORDER_ID ", orderId);
    const orderItems = await getOrderItemsService(orderId);

    res.status(200).json(orderItems);
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { order, getOrderItems };
