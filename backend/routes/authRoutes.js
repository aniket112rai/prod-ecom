import express from "express";
import { register, login, getMe, updateMe, logout } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware(), getMe);
router.put("/me", authMiddleware(), updateMe);
router.post("/logout", authMiddleware(), logout);

export default router;

