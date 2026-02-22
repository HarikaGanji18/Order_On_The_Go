const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const roleOnly = require("../middleware/roleMiddleware");

const User = require("../models/User");
const Order = require("../models/Order");

// GET all users (admin)
router.get("/users", protect, roleOnly(["admin"]), async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

// GET all orders (admin)
router.get("/orders", protect, roleOnly(["admin"]), async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json(orders);
});

// UPDATE order status (admin)
router.put("/orders/:id/status", protect, roleOnly(["admin"]), async (req, res) => {
  const { status } = req.body;
  const allowed = ["Pending", "Accepted", "Rejected", "Delivered"];
  if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = status;
  await order.save();
  res.json({ message: "Status updated", order });
});

module.exports = router;
