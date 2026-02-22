const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");

// GET all restaurants
router.get("/", async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CREATE restaurant
router.post("/", async (req, res) => {
    try {
        const restaurant = new Restaurant(req.body);
        await restaurant.save();
        res.status(201).json(restaurant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
