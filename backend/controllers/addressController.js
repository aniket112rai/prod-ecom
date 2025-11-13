import {prisma} from "../utils/prismaClient.js";

// GET /api/addresses
export const getAddresses = async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.userId },
    });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching addresses", error: err.message });
  }
};

// POST /api/addresses
export const addAddress = async (req, res) => {
  try {
    const { line1, line2, city, state, postal, country } = req.body;

    const address = await prisma.address.create({
      data: {
        userId: req.userId,
        line1,
        line2,
        city,
        state,
        postal,
        country,
      },
    });

    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ message: "Error adding address", error: err.message });
  }
};

// PUT /api/addresses/:id
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Make sure the address belongs to the user
    const address = await prisma.address.findUnique({ where: { id } });
    if (!address) return res.status(404).json({ message: "Address not found" });
    if (address.userId !== req.userId)
      return res.status(403).json({ message: "Access denied" });

    const updated = await prisma.address.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating address", error: err.message });
  }
};

// DELETE /api/addresses/:id
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await prisma.address.findUnique({ where: { id } });
    if (!address) return res.status(404).json({ message: "Address not found" });
    if (address.userId !== req.userId)
      return res.status(403).json({ message: "Access denied" });

    await prisma.address.delete({ where: { id } });

    res.json({ message: "Address deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting address", error: err.message });
  }
};

