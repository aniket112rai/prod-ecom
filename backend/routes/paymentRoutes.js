import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { processPayment, getPayment } from "../controllers/paymentController.js";

const router = express.Router();

// Process a payment
router.post("/", authMiddleware(), processPayment);

// Get payment details by ID
router.get("/:id", authMiddleware(), getPayment);

export default router;
