const Product = require("../models/product");

exports.createProduct = async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).json(product);
};

exports.getProducts = async (req, res) => {
    const products = await Product.find().populate("restaurant");
    res.json(products);
};
