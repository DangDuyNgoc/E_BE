import Stripe from "stripe";

import orderModel from "./../models/orderModel.js";
import orderDetailModel from "./../models/orderDetailSchema.js";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ||
    "sk_test_51PiS7iDDtMfu9MHZQXprg6WPZzY3xm3almQOoZxiJChyPMq6om6rXvDn1oH7tqmYw0LrmB8z6dCqv33B9TIhWcQA00UufwYzk1",
);

export const placeOrder = async (req, res) => {
  try {
    const { data } = req.body;

    // make payment intent with stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: data.total_amount * 100,
      currency: "usd",
      metadata: {
        company: "E-commerce",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    const newOrder = await orderModel.create({
      user_id: data.user_id,
      shipping_address: data.shipping_address,
      total_amount: data.total_amount,
      payment_intent_id: paymentIntent.id,
      status: "PENDING",
      payment_status: paymentIntent.status === "succeeded" ? "PAID" : "PENDING",
    });

    // order details for each product
    const orderDetails = await orderDetailModel.insertMany(
      data.items.map((item) => ({
        order_id: newOrder._id,
        product_id: item.product_id,
        quantity: item.quantity,
        color: item.color,
        price: item.price,
        discountedPrice: item.discountedPrice,
      })),
    );

    // update order with list of order details
    newOrder.order_details = orderDetails.map((detail) => detail._id);

    await newOrder.save();

    res.status(200).send({
      success: true,
      message: "Order placed successfully",
      data: newOrder,
      payment_status: newOrder.payment_status,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await orderModel.find({ user_id: req.user._id });

    res.status(200).send({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getOrderSingle = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await orderModel.findById(id);

    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Order retrieved successfully",
      data: order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllOrder = async (req, res) => {
  try {
    const orders = await orderModel.find({}).populate("order_details");

    res.status(200).send({
      success: true,
      message: "Orders Found Successfully",
      data: orders,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const orders = await orderModel.findById(id);

    if (!orders) {
      return res.status(404).send({
        success: false,
        message: "Order not found",
      });
    }

    orders.status = status;

    await orders.save();

    res.status(200).send({
      success: true,
      message: "Order status updated successfully",
      data: orders,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};
