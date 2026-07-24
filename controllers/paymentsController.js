import Payment from "../models/PaymentModel.js";
import Order from "../models/OrderModel.js";
import Product from "../models/ProductModel.js";
import axios from "axios";
import crypto from "crypto";




// @desc Initialize Payment
const initializePayment = async (req, res, next) => {
  try {
    const { items, vendorId } = req.body;
    const { email, _id } = req.user;

    const productDocs = await Promise.all(
      items.map((item) => Product.findById(item.product))
    );

    const totalAmount = items.reduce((acc, item, index) => {
      return acc + productDocs[index].price * item.quantity;
    }, 0);

    const reference = `JC-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    const order = await Order.create({
      user: _id,
      vendor: vendorId,
      items: items.map((item, index) => ({
        product: item.product,
        quantity: item.quantity,
        price: productDocs[index].price,
      })),
      totalAmount,
      status: "pending",
    });

    const payment = await Payment.create({
      user: _id,
      order: order._id,
      reference,
      amount: totalAmount,
      status: "pending",
    });

    await Order.findByIdAndUpdate(order._id, { payment: payment._id });

    const paystackRes = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: totalAmount * 100,
        reference,
        callback_url: `${process.env.BASE_URL}/api/payments/verify`,
        metadata: { orderId: order._id },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    await Payment.findByIdAndUpdate(payment._id, {
      paystackRes: paystackRes.data,
    });

    const { authorization_url } = paystackRes.data.data;

    res.status(201).json({
      msg: "Payment initialized successfully",
      authorization_url,
      reference,
      orderId: order._id,
    });
  } catch (error) {
    next(error);
  }
};




// @desc Verify Payment
const verifyPayment = async (req, res, next) => {
  try {
    const { reference } = req.query;

    if (!reference) {
      res.status(400);
      throw new Error("Payment reference is required");
    }

    const paystackRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const { status, metadata } = paystackRes.data.data;
    const orderId = metadata?.orderId;

    if (status === "success") {
      const payment = await Payment.findOneAndUpdate(
        { reference },
        {
          status: "success",
          paystackRes: paystackRes.data,
        },
        { new: true }
      );

      if (orderId) {
        await Order.findByIdAndUpdate(orderId, { status: "paid" });
      }

      return res.status(200).json({
        msg: "Payment verified successfully",
        status: "success",
        payment,
      });
    } else {
      await Payment.findOneAndUpdate(
        { reference },
        {
          status: "failed",
          paystackRes: paystackRes.data,
        }
      );

      if (orderId) {
        await Order.findByIdAndUpdate(orderId, { status: "cancelled" });
      }

      return res.status(400).json({
        msg: "Payment verification failed",
        status: "failed",
      });
    }
  } catch (error) {
    next(error);
  }
};





// @desc Handle Paystack Webhook
const paystackWebhook = async (req, res, next) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    const paystackSignature = req.headers["x-paystack-signature"];

    if (hash !== paystackSignature) {
      return res.status(401).json({ msg: "Invalid webhook signature" });
    }

    const { event, data } = req.body;

    if (event === "charge.success") {
      const { reference, metadata } = data;
      const orderId = metadata?.orderId;

      await Payment.findOneAndUpdate(
        { reference },
        {
          status: "success",
          paystackRes: data,
        }
      );

      if (orderId) {
        await Order.findByIdAndUpdate(orderId, { status: "paid" });
      }
    }

    res.status(200).json({ msg: "Webhook received" });
  } catch (error) {
    next(error);
  }
};






export { initializePayment, verifyPayment, paystackWebhook };