import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import addressRoutes from "./routes/addressRoutes.js"; 
import paymentRoutes from "./routes/paymentRoutes.js"; 
import cors from 'cors';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes); 
app.use("/api/addresses", addressRoutes); 
app.use("/api/payments", paymentRoutes);


app.listen(port);
