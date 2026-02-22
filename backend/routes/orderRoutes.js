const express = require("express");
const Order = require("../models/Order");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, async (req, res) => {
    const order = await Order.create({
        ...req.body,
        user: req.user._id,
    });

    res.json(order);
});

router.get("/my", protect, async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).populate("items.product");
    res.json(orders);
});

module.exports = router;
