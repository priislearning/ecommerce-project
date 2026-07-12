const Cart = require("../models/Cart");
const Product = require("../models/product");
const { redisClient } = require("../db/redis");

// POST /api/cart
const addToCart = async (req, res) => {
    try {

        const userId = req.user.userId;
        const cartKey = `cart:${userId}`;

        const { id: productId } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        let cart = await Cart.findOne({
            user: userId
        });

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: []
            });
        }

        const existingItem = cart.items.find(
            item => item.productId.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.items.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }

        await cart.save();

        await redisClient.del(cartKey);

        res.status(201).json({
            message: "Product added",
            cart: cart.items
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }
};

// PUT /api/cart/:id
const updateCart = async (req, res) => {

    const userId = req.user.userId;
    const cartKey = `cart:${userId}`;

    const id = req.params.id;

    const { action } = req.body;

    try {

        const cart = await Cart.findOne({
            user: userId
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const item = cart.items.find(
            item => item.productId.toString() === id
        );

        if (!item) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (action === "increase") {

            item.quantity++;

        } else if (action === "decrease") {

            item.quantity--;

            if (item.quantity <= 0) {

                cart.items = cart.items.filter(
                    i => i.productId.toString() !== id
                );

            }

        }

        await cart.save();

        await redisClient.del(cartKey);

        res.json({
            message: "Cart Updated",
            cart: cart.items
        });

    } catch (err) {

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// DELETE /api/cart/:id
const removeFromCart = async (req, res) => {

    const userId = req.user.userId;
    const cartKey = `cart:${userId}`;

    const id = req.params.id;

    try {

        const cart = await Cart.findOne({
            user: userId
        });

        if (!cart) {

            return res.status(404).json({
                message: "Cart not found"
            });

        }

        cart.items = cart.items.filter(
            item => item.productId.toString() !== id
        );

        await cart.save();

        await redisClient.del(cartKey);

        res.json({
            message: "Product removed",
            cart: cart.items
        });

    } catch (err) {

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// GET /api/cart
const getCart = async (req, res) => {

    const userId = req.user.userId;
    const cartKey = `cart:${userId}`;

    try {

        const cachedCart = await redisClient.get(cartKey);

        if (cachedCart) {

            console.log("Cart Cache Hit");

            return res.json(JSON.parse(cachedCart));

        }

        console.log("Cart Cache Miss");

        const cart = await Cart.findOne({
            user: userId
        });

        if (!cart) {
            return res.json([]);
        }

        await redisClient.set(
            cartKey,
            JSON.stringify(cart.items)
        );

        res.json(cart.items);

    } catch (err) {

        res.status(500).json({
            message: "Server Error"
        });

    }

};

module.exports = {
    addToCart,
    updateCart,
    removeFromCart,
    getCart
};