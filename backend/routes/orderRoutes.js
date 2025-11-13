import express from "express";
import {
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getAllOrders
} from "../controllers/orderController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.get("/all", authMiddleware("admin"), getAllOrders);
// Get all orders of logged-in user
router.get("/", authMiddleware(), getUserOrders);

// Get single order details
router.get("/:id", authMiddleware(), getOrderById);


// Place a new order
router.post("/", authMiddleware(), createOrder);

// Update order status (Admin only)
router.put("/:id/status", authMiddleware("admin"), updateOrderStatus);

export default router;
