import express from "express";
import {
  getReviewsByProduct,
  addReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all reviews for a product
router.get("/:productId", getReviewsByProduct);

// Add a review (user must be logged in)
router.post("/", authMiddleware(), addReview);

// Delete a review (admin or review owner)
router.delete("/:id", authMiddleware(), deleteReview);

export default router;

