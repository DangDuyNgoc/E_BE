import express from "express";
import {
  getAllOrder,
  getOrderSingle,
  placeOrder,
  updateStatus,
} from "../controllers/orderController.js";
import { isAdmin, isAuthenticated } from "./../middlewares/authMiddleware.js";

const orderRoute = express.Router();

orderRoute.post("/place-order", isAuthenticated, placeOrder);
orderRoute.get("/get-order/:id", isAuthenticated, getOrderSingle);
orderRoute.get("/get-all-order", isAuthenticated, getAllOrder);
orderRoute.put("/update-status-order/:id", isAuthenticated, isAdmin, updateStatus);

export default orderRoute;
