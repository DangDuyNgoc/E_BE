import express from "express";
import { isAuthenticated } from "./../middlewares/authMiddleware.js";
import { addToCart } from "../controllers/cartController.js";

const cartRoute = express.Router();

cartRoute.post("/add", isAuthenticated, addToCart);

export default cartRoute;
