require("dotenv").config();
require("./config/env.js");

const app = require("./app");

const connectDB = require("./db/connect");
const { connectRedis } = require("./db/redis");

const Product = require("./models/product");
const products = require("./data/products");

const PORT = 3000;

async function seedProducts() {
    const count = await Product.countDocuments();

    if (count === 0) {
        await Product.insertMany(products);
        console.log("Products inserted");
    } else {
        console.log("Products already exist");
    }
}

async function start() {
    await connectDB();
    await connectRedis();
    await seedProducts();

    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
}

start();