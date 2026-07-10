require("dotenv").config();

const mongoose = require("mongoose");
const fs = require("fs");

const connectDB = require("./db/connect");
const Product = require("./models/Product");

async function importProducts() {
    try {
        await connectDB();

        // Read products.json
        const data = JSON.parse(fs.readFileSync("./products.json", "utf8"));

        // Remove old products
        await Product.deleteMany({});

        // Convert DummyJSON format to YOUR schema
        const products = data.products.map((p) => {
    if (!p.brand) {
        console.log("Missing brand:", p.title);
    }

    return {
        name: p.title,
        price: p.price,
        brand: p.brand || "Generic",
        category: p.category,
        image: p.thumbnail,
        rating: p.rating,
        stock: p.stock
    };
});

        await Product.insertMany(products);

        console.log(`✅ Imported ${products.length} products`);

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}

importProducts();