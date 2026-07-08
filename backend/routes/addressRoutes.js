import express from "express";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all addresses of logged-in user
router.get("/", authMiddleware(), getAddresses);

// Add a new address
router.post("/", authMiddleware(), addAddress);

// Update an address
router.put("/:id", authMiddleware(), updateAddress);

// Delete an address
router.delete("/:id", authMiddleware(), deleteAddress);

export default router;
