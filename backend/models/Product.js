const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: String,
        price: Number,
        discount: Number,
        image: String,
        category: String,
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
