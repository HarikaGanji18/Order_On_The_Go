const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ================= DATABASE CONNECTION =================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

// ================= ROUTES =================

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/restaurants", require("./routes/restaurantRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));

// ================= ROOT ROUTE =================

app.get("/", (req, res) => {
    res.send("SB Foods API Running...");
});

// ================= SERVER =================

const PORT = process.env.PORT || 6001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

