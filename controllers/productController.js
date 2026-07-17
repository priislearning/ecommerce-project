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
const deleteProduct = async (req, res) => {
    try {

        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        await redisClient.del("products");

        res.json({
            message: "Product deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};
const getProducts = async (req, res) => {


    const page = Number(req.query.page) || 1;//browser sent get/api/products there is no ?page so req.query.page is undefined then number(undefined) is nan and nan||1 is page 1

    const limit = Number(req.query.limit) || 3;
    const skip = (page - 1) * limit;
    try {

      // const cachedProducts = await redisClient.get("products");

       // if (cachedProducts) {

         //   console.log("Cache Hit");

          //  return res.json(JSON.parse(cachedProducts));

      //  }

        console.log("Cache Miss");

        const totalProducts = await Product.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);
        const products = await Product.find()
            .skip(skip)
            .limit(limit);


       // await redisClient.set(
        //    "products",
        //    JSON.stringify(products)
        //);

        res.json({
            products,

            currentPage: page,

            totalPages,

            totalProducts
        });

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

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
/**
 Admin
    ↓
DELETE /api/products/:id
    ↓
productRoutes
    ↓
authMiddleware
    ↓
authorize("admin")
    ↓
deleteProduct()
    ↓
MongoDB deletes product
    ↓
Redis cache deleted
    ↓
200 OK
 */