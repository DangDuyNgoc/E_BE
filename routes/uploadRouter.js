import express from "express";
import { createComments } from "../controllers/uploadController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const commentRoute = express.Router();

commentRoute.post("/create-comment", isAuthenticated, createComments);

export default commentRoute;
