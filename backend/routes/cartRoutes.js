import express from "express";
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cartController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All cart routes require authentication
router.use(authMiddleware());

// Get user cart
router.get("/", getCart);

// Add item
router.post("/", addItemToCart);

// Update item quantity
router.put("/:itemId", updateCartItem);

// Remove item
router.delete("/:itemId", removeCartItem);

export default router;
