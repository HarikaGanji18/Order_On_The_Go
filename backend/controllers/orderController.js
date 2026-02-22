const Order = require("../models/order");

exports.placeOrder = async (req, res) => {
    const order = await Order.create({
        user: req.user._id,
        items: req.body.items,
        totalAmount: req.body.totalAmount,
        address: req.body.address,
        paymentMethod: req.body.paymentMethod
    });

    res.status(201).json(order);
};

exports.getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
        .populate("items.product");

    res.json(orders);
};
