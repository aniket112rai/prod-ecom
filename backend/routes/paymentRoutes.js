import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createRazorpayOrder,
  getPayment,
  processPayment,
  verifyRazorpayPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/razorpay/order", authMiddleware(), createRazorpayOrder);
router.post("/razorpay/verify", authMiddleware(), verifyRazorpayPayment);

// Process a payment
router.post("/", authMiddleware(), processPayment);

// Get payment details by ID
router.get("/:id", authMiddleware(), getPayment);

export default router;
