import {prisma} from "../utils/prismaClient.js";

// GET /api/products?search=&category=&priceMin=&priceMax=&rating=&page=&limit=&sortBy=&sortOrder=
export const getAllProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      priceMin,
      priceMax,
      rating,
      page,
      limit,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filters = {};
    const allowedSortFields = ["name", "price", "stock", "rating", "createdAt"];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const safeSortOrder = sortOrder === "asc" ? "asc" : "desc";

    if (search) {
      filters.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      filters.category = { name: { equals: category, mode: "insensitive" } };
    }

    if (priceMin || priceMax) {
      filters.price = {};
      if (priceMin) filters.price.gte = parseFloat(priceMin);
      if (priceMax) filters.price.lte = parseFloat(priceMax);
    }

    if (rating) {
      filters.reviews = {
        some: { rating: { gte: parseFloat(rating) } },
      };
    }

    const shouldPaginate = page || limit || req.query.sortBy || req.query.sortOrder;
    const take = Math.min(Math.max(parseInt(limit || "8", 10), 1), 50);
    const currentPage = Math.max(parseInt(page || "1", 10), 1);
    const skip = (currentPage - 1) * take;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: filters,
        include: { category: true, reviews: true },
        orderBy: { [safeSortBy]: safeSortOrder },
        ...(shouldPaginate ? { skip, take } : {}),
      }),
      prisma.product.count({ where: filters }),
    ]);

    if (shouldPaginate) {
      return res.json({
        products,
        pagination: {
          total,
          page: currentPage,
          limit: take,
          totalPages: Math.ceil(total / take),
        },
      });
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, reviews: true },
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product", error: err.message });
  }
};

// POST /api/products (Admin only)
export const createProduct = async (req, res) => {
  try {
    
    const { name, description, price, stock, categoryId, images } = req.body;

    // Optional: Check if category exists
    console.log(req.body)
    console.log("categoryId:", categoryId)
    const categoryExists = await prisma.category.findUnique({ where: { id: categoryId } });
    console.log("jfhbnsdczjkxc,njksdlzkncl")
    if (!categoryExists) return res.status(400).json({ message: "Invalid categoryId" });
    console.log("data is entered")
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        categoryId,
        images,
      },
    });
    console.log("product created")
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "Error creating product", error: err.message });
  }
};

// PUT /api/products/:id (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, categoryId, images } = req.body;

    const data = {};
    if (name) data.name = name;
    if (description) data.description = description;
    if (price) data.price = parseFloat(price);
    if (stock) data.stock = parseInt(stock);
    if (categoryId) {
      // Optional: Validate categoryId
      const categoryExists = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!categoryExists) return res.status(400).json({ message: "Invalid categoryId" });
      data.categoryId = categoryId;
    }
    if (images) data.images = images;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data,
    });

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: "Error updating product", error: err.message });
  }
};

// DELETE /api/products/:id (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({ where: { id } });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
};
