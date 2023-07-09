const cart = require("../services/cart");
const {
  orderCartItems,
  getOrderItemsService,
  getUserOrders,
  getSellerOrdersWithUserAndProduct,
  getUserOrdersWithOrderDetails,
} = require("../services/order");
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
const getOrders = async (req, res) => {
  try {
    console.log("REQ USER ", req.user);
    if (req.user.rol_id == 1) {
      console.log("USER CALISTI ORDERS");
      const result = await getUserOrdersWithOrderDetails(req.user.id);
      res.status(200).send(result);
    }
    if (req.user.rol_id == 2) {
      const result = await getSellerOrdersWithUserAndProduct(req.user.id);
      res.status(200).send(result);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { order, getOrderItems, getOrders };
