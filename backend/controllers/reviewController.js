import { prisma } from "../utils/prismaClient.js";

// ✅ GET /api/reviews/:productId
export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: "Error fetching reviews", error: err.message });
  }
};

// ✅ POST /api/reviews
export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const review = await prisma.review.create({
      data: {
        userId: req.userId, // auth middleware se aayega
        productId,
        rating: Number(rating),
        comment,
      },
    });

    // 🔄 Update product’s average rating
    const allReviews = await prisma.review.findMany({
      where: { productId },
    });

    const avgRating =
      allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0;

    await prisma.product.update({
      where: { id: productId },
      data: { rating: avgRating },
    });

    res.status(201).json(review);
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ message: "Error adding review", error: err.message });
  }
};

// ✅ DELETE /api/reviews/:id
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) return res.status(404).json({ message: "Review not found" });

    // ✅ Only admin or review owner can delete
    if (req.role !== "admin" && review.userId !== req.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Delete the review
    await prisma.review.delete({ where: { id } });

    // 🔄 Recalculate average rating
    const remaining = await prisma.review.findMany({
      where: { productId: review.productId },
    });

    const newAvg =
      remaining.length > 0
        ? remaining.reduce((sum, r) => sum + r.rating, 0) / remaining.length
        : 0;

    await prisma.product.update({
      where: { id: review.productId },
      data: { rating: newAvg },
    });

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ message: "Error deleting review", error: err.message });
  }
};
