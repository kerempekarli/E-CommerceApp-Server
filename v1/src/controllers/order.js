const cart = require("../services/cart");
const { orderCartİtems } = require("../services/order");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);
const amqp = require("amqplib");
const order = async (req, res) => {
  // const cartId = await cart.getOrCreateCart(req.user.id);
  // const cartItems = await cart.getCartItems(cartId);
  // const result = await orderCartİtems(req.user.id, cartItems);

  // const { amount, id } = req.body;

  // try {
  //   const payment = await stripe.paymentIntents.create({
  //     amount,
  //     currency: "USD",
  //     description: "Spatula denem 1510",
  //     payment_method: id,
  //     confirm: true,
  //   });

  //   console.log(payment);
  //   res.status(200).json({
  //     message: "Satın alma işlemi başarılı",
  //     success: true,
  //   });
  // } catch (err) {
  //   console.log("ERROR ", err);
  //   res.json("Satın alma işlemi başarısız");
  // }

  // console.log("AMOUNT AND ID ", amount, " ", id);

  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queue = "purchase_queue";

    const order = {
      orderId: 123,
      customerName: "John Doe",
      products: ["Product 1", "Product 2"],
    };

    const orderBuffer = Buffer.from(JSON.stringify(order));

    channel.sendToQueue(queue, orderBuffer);
    console.log("Sipariş gönderildi:", order);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Hata:", error);
  }

  res.status(200).send({ success: true, message: "başarılı" });
};
module.exports = { order };
