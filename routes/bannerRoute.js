import express from "express";
import { isAdmin, isAuthenticated } from "../middlewares/authMiddleware.js";
import { createBanner } from "../controllers/bannerController.js";

const bannerRoute = express.Router();

bannerRoute.post("/create-banner", isAuthenticated, isAdmin, createBanner);

export default bannerRoute;