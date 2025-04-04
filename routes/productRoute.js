import express from "express";
import {
  addProductController,
  deleteProductController,
  getAllProductController,
  getOneProductController,
  searchProductController,
  updateProductController,
} from "../controllers/productController.js";
import { saveImage } from "../helpers/handleImageHelper.js";
import {
  handleValidationErrors,
  validateFileExistence,
} from "../middlewares/handleValidation.js";
import {
  validateProduct,
  validateProductId,
  validateSearchProduct,
} from "../validation/productValidation.js";
import { isAdmin, isAuthenticated } from "../middlewares/authMiddleware.js";

const productRoute = express.Router();

productRoute.get(
  "/all-products",
  getAllProductController
);

productRoute.get(
  "/get-product/:id",
  getOneProductController
);

productRoute.post(
  "/add-product",
  isAuthenticated,
  isAdmin,
  saveImage.single("imageUrl"),
  validateProduct,
  validateFileExistence,
  handleValidationErrors,
  addProductController,
);
productRoute.put(
  "/update-product/:id",
  isAuthenticated,
  isAdmin,
  validateProductId,
  saveImage.single("imageUrl"),
  validateProduct,
  handleValidationErrors,
  updateProductController,
);
productRoute.delete(
  "/delete-product/:id",
  isAuthenticated,
  isAdmin,
  deleteProductController,
);
productRoute.post(
  "/search-products",
  validateSearchProduct,
  searchProductController,
);

export default productRoute;
