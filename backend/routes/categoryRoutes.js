import express from "express";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public route
router.get("/", getAllCategories);

// Admin-only routes
router.post("/", authMiddleware("admin"), createCategory);
router.put("/:id", authMiddleware("admin"), updateCategory);
router.delete("/:id", authMiddleware("admin"), deleteCategory);

export default router;
