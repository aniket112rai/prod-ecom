import bcrypt from "bcryptjs";

import { OAuth2Client } from "google-auth-library";
import { sendToken } from "../utils/jwt.js";
import {prisma} from "../utils/prismaClient.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// REGISTER
export const register = async (req, res) => {
  const { name, email, password,role } = req.body;
  const existing = await prisma.user.findUnique({
    where: { email },
  });
  if (existing)
    return res.status(400).json({
      message: "Email already exists",
    });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, 
      email, 
      password: hashedPassword , 
      role: role || "user",
      provider: "local"},
  });
  sendToken(res, user);
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Invalid credentials" });

  sendToken(res, user);
};


// GET CURRENT USER
export const getMe = async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  console.log("user is there in db")
  res.json(user);
};

// UPDATE PROFILE/PASSWORD
export const updateMe = async (req, res) => {
  const { name, email, password } = req.body;
  const data = {};
  if (name) data.name = name;
  if (email) data.email = email;
  if (password) data.password = await bcrypt.hash(password, 10);

  const user = await prisma.user.update({ where: { id: req.userId }, data });
  res.json(user);
};


// ✅ LOGOUT
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Logout failed" });
  }
};
