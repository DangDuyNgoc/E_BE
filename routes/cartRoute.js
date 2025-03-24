import express from "express";
import { isAuthenticated } from "./../middlewares/authMiddleware.js";
import {
  addToCart,
  decreaseQuantity,
  deleteAll,
  deleteCart,
  getCart,
} from "../controllers/cartController.js";

const cartRoute = express.Router();

cartRoute.post("/add", isAuthenticated, addToCart);
cartRoute.get("/get/:id", isAuthenticated, getCart);
cartRoute.post("/decrease", isAuthenticated, decreaseQuantity);
cartRoute.delete("/delete-all", isAuthenticated, deleteAll);
cartRoute.delete("/remove", isAuthenticated, deleteCart);

export default cartRoute;
