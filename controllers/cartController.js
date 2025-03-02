import productModel from "../models/productModel.js";
import cartModel from "./../models/cartModel.js";

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      cart = new cartModel({
        user: userId,
        items: [],
        totalPrice: 0,
        totalDiscountedPrice: 0,
      });
    }

    const existingCart = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingCart) {
      existingCart.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        discountedPrice: product.discountedPrice || product.price,
      });
    }

    cart.totalPrice += cart.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    cart.totalDiscountedPrice += cart.items.reduce(
      (sum, item) => sum + item.quantity * (item.discountedPrice || item.price),
      0
    );

    await cart.save();

    res.status(200).send({
      success: true,
      message: "Product added to cart",
      cart: cart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};
