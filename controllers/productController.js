const Product = require("../models/product");
const { redisClient } = require("../db/redis");

const createProduct = async (req, res) => {
    try {

        const {
            name,
            brand,
            category,
            price,
            stock,
            description,
            image
        } = req.body;

        const product = await Product.create({
            name,
            brand,
            category,
            price,
            stock,
            description,
            image
        });

        await redisClient.del("products");

        res.status(201).json({
            message: "Product created successfully",
            product
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};
const updateProduct = async (req, res) => {
    try {

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        await redisClient.del("products");

        res.json({
            message: "Product updated",
            product
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};
const getProducts = async (req, res) => {

    try {

        const cachedProducts = await redisClient.get("products");

        if (cachedProducts) {

            console.log("Cache Hit");

            return res.json(JSON.parse(cachedProducts));

        }

        console.log("Cache Miss");

        const products = await Product.find();

        await redisClient.set(
            "products",
            JSON.stringify(products)
        );

        res.json(products);

    } catch (error) {

        res.status(500).json({
            message: "Server error"
        });

    }

};

const getProductById = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            });

        }

        res.json(product);

    } catch (err) {

        res.status(500).json({
            message: "Server error"
        });

    }

};
const createProduct = async (req, res) => {
    try {

        const product = await Product.create(req.body);

        // Invalidate Redis cache
        await redisClient.del("products");

        res.status(201).json(product);

    } catch (err) {

        res.status(500).json({
            message: "Server Error"
        });

    }
};
module.exports = {
    getProducts,
    getProductById,
    createProduct
};