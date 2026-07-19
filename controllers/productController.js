const streamifier = require("streamifier");
const Product = require("../models/product");
const cloudinary = require("../config/cloudinary");
const { redisClient } = require("../db/redis");
const clearProductCache = async () => {

    const keys = await redisClient.keys("products:*");

    if (keys.length > 0) {

        await redisClient.del(keys);

    }

};
const createProduct = async (req, res) => {
    try {

        const {
            name,
            brand,
            category,
            price,
            stock,
            description,
        } = req.body;
        if (!req.file) {
    return res.status(400).json({
        message: "Please upload an image",
    });
}
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "products",
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            streamifier
                .createReadStream(req.file.buffer)
                .pipe(uploadStream);
        });

        const product = await Product.create({
            name,
            brand,
            category,
            price,
            stock,
            description,
            image: result.secure_url
        });

        await clearProductCache();

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

        // Data from the form
        const updateData = {
            name: req.body.name,
            brand: req.body.brand,
            category: req.body.category,
            price: req.body.price,
            stock: req.body.stock,
            description: req.body.description,
        };

        // If a new image was selected, upload it
        if (req.file) {

            const result = await new Promise((resolve, reject) => {

                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "products",
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );

                streamifier
                    .createReadStream(req.file.buffer)
                    .pipe(uploadStream);

            });

            updateData.image = result.secure_url;

        }

        // Update product in MongoDB
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        await clearProductCache();

        res.json({
            message: "Product updated successfully",
            product,
        });

    } catch (err) {

        res.status(500).json({
            message: err.message,
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

        await clearProductCache();

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
    const brand = req.query.brand;
   const sort = req.query.sort;
    const search = req.query.search;
  console.log("Search received by backend:", search);
    const limit = Number(req.query.limit) || 3;
  
   const filter = {};

    if (search) {
        filter.name = {
            $regex: search,
            $options: "i"
        };
    }

    const sortOption = {};

    if (brand) {
    filter.brand = brand;
}
if (sort === "price_asc") {
    sortOption.price = 1;
}
else if (sort === "price_desc") {
    sortOption.price = -1;
}
else if (sort === "rating") {
    sortOption.rating = -1;
}
    const skip = (page - 1) * limit;
    const cacheKey = `products:${page}:${limit}:${sort}:${search}`;
    try {


        const cachedProducts = await redisClient.get(cacheKey);

        if (cachedProducts) {

            console.log("Cache Hit");

            return res.json(JSON.parse(cachedProducts));

        }

        console.log("Cache Miss");

        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);
        const products = await Product.find(filter).sort(sortOption)
              .sort(sortOption)
        .skip(skip)
            .limit(limit);


        await redisClient.set(
            "products",
            JSON.stringify({
                products,
                currentPage: page,
                totalPages,
                totalProducts
            })
        );

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