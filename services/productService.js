import mongoose from "mongoose";
import productModel from "../models/productModel.js";
import { removeImage } from "../helpers/handleImageHelper.js";
import path from "path";

export const getAllProductService = async () => {
  try {
    const allProducts = await productModel.find({});
    return allProducts;
  } catch (error) {
    throw error;
  }
};

export const getOneProductService = async (id) => {
  try {
    const getOneProduct = await productModel.findById(id);
    return getOneProduct;
  } catch (error) {
    throw error;
  }
};

export const addProductService = async (data, imageUrl) => {
  try {
    const categoryId = mongoose.isValidObjectId(data.category)
      ? new mongoose.Types.ObjectId(String(data.category))
      : null;
    if (!categoryId) {
      throw new Error("Invalid category ID format.");
    }

    const newProduct = new productModel({
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: imageUrl,
      category: categoryId,
      quantity: data.quantity,
      discountedPrice: data.discountedPrice,
      brand: data.brand,
      color: data.color,
    });

    const add = await newProduct.save();
    return add;
  } catch (error) {
    throw error;
  }
};

export const updateProductService = async (id, data, newImageUrl) => {
  try {
    const oldImageUrl = await getUriImage(id);
    let updatedData = { ...data };
    if (newImageUrl && newImageUrl !== oldImageUrl) {
      removeImage(path.basename(oldImageUrl));
      updatedData.imageUrl = newImageUrl;
    }
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updatedData,
      { new: true },
    );
    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

const getUriImage = async (id) => {
  try {
    const product = await productModel.findById(id).select("imageUrl");
    return product?.imageUrl || null;
  } catch (error) {
    console.log(error);
  }
};

export const deleteProductService = async (id) => {
  try {
    const uriImage = await getUriImage(id);
    if (uriImage) {
      const newUriImage = path.basename(uriImage);
      removeImage(newUriImage);
    }
    const deleteProduct = await productModel.findByIdAndDelete(id);
    return deleteProduct;
  } catch (error) {
    throw error;
  }
};

export const searchProductService = async (data) => {
  try {
    let query = {};
    if (data.name) {
      query.name = { $regex: data.name, $options: "i" };
    }
    if (data.category) {
      query.category = data.category;
    }
    if (data.minPrice || data.maxPrice) {
      query.price = {};
      if (data.minPrice) query.price.$gte = parseFloat(data.minPrice);
      if (data.maxPrice) query.price.$lte = parseFloat(data.maxPrice);
    }
    const findProduct = await productModel.find(query);
    return findProduct;
  } catch (error) {
    throw error;
  }
};
