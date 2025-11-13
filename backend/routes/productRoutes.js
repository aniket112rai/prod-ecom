import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productcontroller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", authMiddleware("admin"), createProduct);
router.put("/:id", authMiddleware("admin"), updateProduct);
router.delete("/:id", authMiddleware("admin"), deleteProduct);

export default router;
