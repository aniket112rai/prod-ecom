import {prisma} from "../utils/prismaClient.js";

// GET /api/wishlist
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: req.userId },
      include: { product: true },
    });

    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: "Error fetching wishlist", error: err.message });
  }
};

// POST /api/wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) return res.status(400).json({ message: "Product ID is required" });

    // Check if already in wishlist
    const existing = await prisma.wishlist.findFirst({
      where: { userId: req.userId, productId },
    });

    if (existing) return res.status(400).json({ message: "Product already in wishlist" });

    await prisma.wishlist.create({
      data: { userId: req.userId, productId },
    });

    const updatedWishlist = await prisma.wishlist.findMany({
      where: { userId: req.userId },
      include: { product: true },
    });

    res.json(updatedWishlist);
  } catch (err) {
    res.status(500).json({ message: "Error adding to wishlist", error: err.message });
  }
};

// DELETE /api/wishlist/:id
export const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await prisma.wishlist.findUnique({
      where: { id },
    });

    if (!item || item.userId !== req.userId) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }

    await prisma.wishlist.delete({ where: { id } });

    const updatedWishlist = await prisma.wishlist.findMany({
      where: { userId: req.userId },
      include: { product: true },
    });

    res.json(updatedWishlist);
  } catch (err) {
    res.status(500).json({ message: "Error removing from wishlist", error: err.message });
  }
};
