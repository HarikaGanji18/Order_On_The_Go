const Cart = require("../models/cart");

exports.addToCart = async (req, res) => {
    const item = await Cart.create({
        user: req.user._id,
        product: req.body.product,
        quantity: req.body.quantity
    });

    res.status(201).json(item);
};

exports.getCart = async (req, res) => {
    const cart = await Cart.find({ user: req.user._id }).populate("product");
    res.json(cart);
};
