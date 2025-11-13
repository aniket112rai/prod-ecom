import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware("admin"), getAllUsers);       


export default router;
