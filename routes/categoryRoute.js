import express from "express";
import {
  createCategory,
  deleteAllCategory,
  deleteCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
} from "../controllers/categoryController.js";
import { isAdmin, isAuthenticated } from "./../middlewares/authMiddleware.js";

const categoryRoute = express.Router();

categoryRoute.post(
  "/create-category",
  isAuthenticated,
  isAdmin,
  createCategory
);

categoryRoute.put(
  "/update-category/:id",
  isAuthenticated,
  isAdmin,
  updateCategory
);

categoryRoute.get(
  "/get-category/:id",
  isAuthenticated,
  isAdmin,
  getSingleCategory
);

categoryRoute.get(
  "/get-all-category",
  isAuthenticated,
  isAdmin,
  getAllCategory
);

categoryRoute.delete(
  "/delete-category/:id",
  isAuthenticated,
  isAdmin,
  deleteCategory
);

categoryRoute.delete(
  "/delete-all-category",
  isAuthenticated,
  isAdmin,
  deleteAllCategory
);

export default categoryRoute;
