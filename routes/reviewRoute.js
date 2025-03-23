import express from "express";
import {
  addReplyController,
  addReviewController,
  deleteReplyController,
  deleteReviewController,
  getAllReviewByProductId,
  getRepliesByReviewController,
  updateReplyController,
  updateReviewController,
} from "../controllers/reviewController.js";
import { saveImage } from "../helpers/handleImageHelper.js";
import { handleValidationErrors } from "../middlewares/handleValidation.js";
import { isAdmin, isAuthenticated } from "../middlewares/authMiddleware.js";

const reviewRoute = express.Router();

reviewRoute.post(
  "/add-review",
  isAuthenticated,
  isAdmin,
  saveImage.array("image", 5),
  handleValidationErrors,
  addReviewController
);
reviewRoute.get("/get-all-reviews/:productId", getAllReviewByProductId);
reviewRoute.put(
  "/update-review/:id",
  isAuthenticated,
  isAdmin,
  saveImage.array("image", 5),
  handleValidationErrors,
  updateReviewController
);
reviewRoute.delete(
  "/delete-review/:id",
  isAuthenticated,
  isAdmin,
  deleteReviewController
);

// reply route
reviewRoute.post("/add-reply", isAuthenticated, isAdmin, addReplyController);
reviewRoute.put(
  "/update-reply/:id",
  isAuthenticated,
  isAdmin,
  updateReplyController
);
reviewRoute.get(
  "/get-reply/:reviewId",
  isAuthenticated,
  isAdmin,
  getRepliesByReviewController
);
reviewRoute.delete(
  "/delete-reply/:id",
  isAuthenticated,
  isAdmin,
  deleteReplyController
);

export default reviewRoute;
