import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All wishlist routes require authentication
router.use(authMiddleware());

// Get user wishlist
router.get("/", getWishlist);

// Add product to wishlist
router.post("/", addToWishlist);

// Remove item from wishlist
router.delete("/:id", removeFromWishlist);

export default router;
