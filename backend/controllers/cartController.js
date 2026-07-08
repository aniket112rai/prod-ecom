import {prisma} from "../utils/prismaClient.js";

// GET /api/cart
export const getCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.userId },
      include: {
        items: { include: { product: true } },
      },
    });

    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart", error: err.message });
  }
};

// POST /api/cart
export const addItemToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid product or quantity" });
    }

    // Find or create cart
    let cart = await prisma.cart.findUnique({ where: { userId: req.userId } });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.userId },
      });
    }

    // Check if item already exists
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + parseInt(quantity) },
      });
      return res.json(await prisma.cart.findUnique({ where: { id: cart.id }, include: { items: { include: { product: true } } } }));
    }

    // Add new item
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: parseInt(quantity),
      },
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } },
    });

    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: "Error adding item to cart", error: err.message });
  }
};

// PUT /api/cart/:itemId
export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== req.userId) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: parseInt(quantity) },
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: item.cartId },
      include: { items: { include: { product: true } } },
    });

    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: "Error updating cart item", error: err.message });
  }
};

// DELETE /api/cart/:itemId
export const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== req.userId) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await prisma.cartItem.delete({ where: { id: itemId } });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: item.cartId },
      include: { items: { include: { product: true } } },
    });

    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: "Error removing cart item", error: err.message });
  }
};
