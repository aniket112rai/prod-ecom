import { prisma } from "../utils/prismaClient.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};
