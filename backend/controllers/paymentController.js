import { prisma } from "../utils/prismaClient.js";
import {
  getRazorpayInstance,
  getRazorpayKeyId,
  verifyRazorpaySignature,
} from "../utils/razorpay.js";

const getValidatedOrderData = async ({ userId, items, addressId }) => {
  if (!items?.length || !addressId) {
    const error = new Error("Missing order details");
    error.statusCode = 400;
    throw error;
  }

  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!address) {
    const error = new Error("Invalid address selected");
    error.statusCode = 400;
    throw error;
  }

  const productIds = items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, price: true, stock: true, name: true },
  });

  const itemsToCreate = items.map((item) => {
    const quantity = parseInt(item.quantity, 10);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Invalid item quantity");
    }

    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }
    if (product.stock < quantity) {
      throw new Error(`Only ${product.stock} item(s) left for ${product.name}`);
    }

    return {
      productId: item.productId,
      quantity,
      price: product.price,
    };
  });

  const total = itemsToCreate.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return { itemsToCreate, total };
};

// POST /api/payments/razorpay/order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { items, addressId, paymentMethod = "Razorpay" } = req.body;
    const userId = req.userId;
    const { itemsToCreate, total } = await getValidatedOrderData({ userId, items, addressId });
    const razorpay = getRazorpayInstance();

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId,
        paymentMethod,
      },
    });

    const order = await prisma.order.create({
      data: {
        user: { connect: { id: userId } },
        total,
        status: "Payment Pending",
        address: { connect: { id: addressId } },
        payment: {
          create: {
            provider: "Razorpay",
            status: "Created",
            amount: total,
            razorpayOrderId: razorpayOrder.id,
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

    res.status(201).json({
      key: getRazorpayKeyId(),
      order,
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: "Error creating Razorpay order",
      error: err.message,
    });
  }
};

// POST /api/payments/razorpay/verify
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    } = req.body;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: "Missing Razorpay verification details" });
    }

    const isValid = verifyRazorpaySignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.userId,
        payment: { razorpayOrderId },
      },
      include: { items: true, payment: true },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found for this payment" });
    }

    if (order.payment?.status === "Paid") {
      return res.json(order);
    }

    const confirmedOrder = await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        const updated = await tx.product.updateMany({
          where: {
            id: item.productId,
            stock: { gte: item.quantity },
          },
          data: { stock: { decrement: item.quantity } },
        });

        if (updated.count === 0) {
          throw new Error("Product stock changed. Please contact support for this payment.");
        }
      }

      await tx.payment.update({
        where: { id: order.payment.id },
        data: {
          status: "Paid",
          razorpayPaymentId,
        },
      });

      const cart = await tx.cart.findUnique({ where: { userId: req.userId } });
      if (cart) {
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      }

      return tx.order.update({
        where: { id: order.id },
        data: { status: "Confirmed" },
        include: {
          items: { include: { product: true } },
          address: true,
          payment: true,
        },
      });
    });

    res.json(confirmedOrder);
  } catch (err) {
    res.status(500).json({ message: "Error verifying payment", error: err.message });
  }
};

// POST /api/payments
export const processPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;

    // Fetch order to get amount
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ message: "Order not found" });

    // TODO: Integrate actual payment gateway (Stripe/Razorpay)
    const payment = await prisma.payment.create({
      data: {
        orderId,
        provider: paymentMethod,
        status: "completed", // for now, assume success
        amount: order.total,
      },
    });

    // Optionally update order status
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "shipped" }, // or keep as pending
    });

    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: "Error processing payment", error: err.message });
  }
};

// GET /api/payments/:id
export const getPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { order: true },
    });

    if (!payment) return res.status(404).json({ message: "Payment not found" });

    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: "Error fetching payment", error: err.message });
  }
};
