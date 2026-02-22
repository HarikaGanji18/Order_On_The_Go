const express = require("express");
const Product = require("../models/Product");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, authorize("restaurant"), async (req, res) => {
    const product = await Product.create(req.body);
    res.json(product);
});

router.get("/", async (req, res) => {
    const products = await Product.find().populate("restaurant");
    res.json(products);
});

router.put("/:id", protect, authorize("restaurant"), async (req, res) => {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(product);
});

router.delete("/:id", protect, authorize("restaurant"), async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

module.exports = router;
