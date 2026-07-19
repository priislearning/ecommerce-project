require("dotenv").config();
require("./config/env.js");

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "client")));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

module.exports = app;