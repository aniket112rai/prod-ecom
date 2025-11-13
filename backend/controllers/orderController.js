// backend/controllers/orderController.js
import { prisma } from "../utils/prismaClient.js";

// GET /api/orders - user's orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      include: {
        items: { include: { product: true } },
        address: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
};
 // backend/controllers/orderController.js

// GET /api/admin/orders - all orders (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await prisma.order.findMany({
      include: {
        items: { include: { product: true } },
        address: true,
        payment: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });
    console.log(orders)
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all orders", error: err.message });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        address: true,
        payment: true,
      },
    });
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only owner or admin can access
    if (order.userId !== req.userId && req.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error fetching order", error: err.message });
  }
};

// POST /api/orders - create order
export const createOrder = async (req, res) => {
  try {
    const { items, addressId, paymentMethod } = req.body;
    const userId = req.userId;

    if (!items?.length || !addressId) {
      return res.status(400).json({ message: "Missing order details" });
    }

    // ✅ Fetch product prices directly from DB
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true },
    });

    // ✅ Build items array with correct prices
    const itemsToCreate = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product?.price || 0,
      };
    });

    // ✅ Correct total calculation
    const total = itemsToCreate.reduce((sum, i) => sum + i.price * i.quantity, 0);

    // ✅ Create order with confirmed payment (since no Razorpay yet)
    const order = await prisma.order.create({
      data: {
        user: { connect: { id: userId } },
        total,
        status: "Confirmed",
        address: { connect: { id: addressId } },
        payment: {
          create: {
            provider: paymentMethod || "COD",
            status: "Paid",
            amount: total,
          },
        },
        items: {
          create: itemsToCreate,
        },
      },
      include: {
        items: { include: { product: true } },
        address: true,
        payment: true,
      },
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Order creation failed:", err);
    res.status(500).json({ message: "Order creation failed", error: err.message });
  }
};

// PUT /api/orders/:id/status (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: { include: { product: true } }, address: true, payment: true },
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error updating order status", error: err.message });
  }
};
