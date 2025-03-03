import productModel from "../models/productModel.js";
import cartModel from "./../models/cartModel.js";

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity, color } = req.body;

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    if (!product.color.includes(color)) {
      return res.status(400).send({
        success: false,
        message: `Color ${color} is not available for this product`,
      });
    }

    if (quantity > product.quantity) {
      return res.status(400).send({
        success: false,
        message: `Only ${product.quantity} items available in stock`,
      });
    }

    let cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      cart = new cartModel({
        user: userId,
        items: [],
        totalPrice: 0,
        totalDiscountedPrice: 0,
      });
    }

    const existingCart = cart.items.find(
      (item) => item.product.toString() === productId && item.color === color
    );

    if (existingCart) {
      if (existingCart.quantity + quantity > product.quantity) {
        return res.status(400).send({
          success: false,
          message: `Only ${
            product.quantity - existingCart.quantity
          } more items can be added`,
        });
      }
      existingCart.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        discountedPrice: product.discountedPrice || product.price,
        color,
      });
    }

    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    cart.totalDiscountedPrice = cart.items.reduce(
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

export const getCart = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await cartModel.findById(id).populate("items.product");

    if (!cart) {
      return res.status(404).send({
        success: false,
        message: "Cart not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Cart retrieved successfully",
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

export const decreaseQuantity = async (req, res) => {
  try {
    const { userId, productId, color } = req.body;

    let cart = await cartModel.findOne({ user: userId });

    const product = await productModel.findById(productId);

    if (!cart) {
      return res.status(404).send({
        success: false,
        message: "Cart not found",
      });
    }

    if (!product.color.includes(color)) {
      return res.status(400).send({
        success: false,
        message: `Color ${color} is not available for this product`,
      });
    }

    const indexItem = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );

    if (indexItem === -1) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    if (cart.items[indexItem].quantity > 1) {
      cart.items[indexItem].quantity -= 1;
    } else {
      cart.items.splice(indexItem, 1);
    }

    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    cart.totalDiscountedPrice = cart.items.reduce(
      (sum, item) => sum + item.quantity * (item.discountedPrice || item.price),
      0
    );

    await cart.save();

    res.status(200).send({
      success: true,
      message: "Quantity decreased successfully",
      data: cart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    let cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).send({
        success: false,
        message: "Cart not found",
      });
    }

    console.log("Cart before deletion:", cart.items);

    const newItems = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    console.log("Cart after deletion:", newItems);

    if (newItems.length === cart.items.length) {
      return res.status(404).send({
        success: false,
        message: "Product not found in cart",
      });
    }

    cart.items = newItems;

    if (cart.items.length === 0) {
      await cartModel.findByIdAndDelete(cart._id);
      return res.status(200).send({
        success: true,
        message: "Cart deleted successfully",
      });
    }

    if (cart.items.length > 0) {
      cart.totalPrice = cart.items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );
      cart.totalDiscountedPrice = cart.items.reduce(
        (sum, item) =>
          sum + item.quantity * (item.discountedPrice || item.price),
        0
      );
    }

    await cart.save();

    res.status(200).send({
      success: true,
      message: "Cart item deleted successfully",
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

export const deleteAll = async (req, req) => {
  try {
    const { userId } = req.body;

    const cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).send({
        success: false,
        message: "Cart not found",
      });
    }

    await cartModel.findByIdAndDelete(cart._id);

    res.status(200).send({
      success: true,
      message: "All items in cart deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};
