import {prisma} from "../utils/prismaClient.js";

// GET /api/categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { products: true },
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories", error: err.message });
  }
};

// POST /api/categories (Admin only)
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existing = await prisma.category.findUnique({ where: { name } });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await prisma.category.create({ data: { name } });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: "Error creating category", error: err.message });
  }
};

// PUT /api/categories/:id (Admin only)
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) return res.status(400).json({ message: "Category name is required" });

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name },
    });

    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ message: "Error updating category", error: err.message });
  }
};

// DELETE /api/categories/:id (Admin only)
export const deleteCategory = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check if category has products
      const category = await prisma.category.findUnique({
        where: { id },
        include: { products: true },
      });
  
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      if (category.products.length > 0) {
        return res.status(400).json({
          message: "Cannot delete category with existing products. Remove products first.",
        });
      }
  
      await prisma.category.delete({ where: { id } });
  
      res.json({ message: "Category deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting category", error: err.message });
    }
  };
  