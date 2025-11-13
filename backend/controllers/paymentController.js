import {prisma} from "../utils/prismaClient.js";

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

