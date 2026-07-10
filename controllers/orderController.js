const { redisClient } = require("../db/redis");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

const placeOrder = async (req, res) => {

    try {

        const userId = req.user.userId;

        const {
            fullname,
            phone,
            address,
            city,
            state,
            pincode
        } = req.body;

        const cart = await Cart.findOne({
            user: userId
        });

        if (!cart || cart.items.length === 0) {

            return res.status(400).json({
                message: "Cart is empty"
            });

        }

        let total = 0;

        cart.items.forEach(item => {
            total += item.price * item.quantity;
        });

        const order = await Order.create({

            user: userId,

            items: cart.items,

            total,

            shippingAddress: {

                fullname,
                phone,
                address,
                city,
                state,
                pincode

            }

        });

        cart.items = [];

        await cart.save();
        await redisClient.del(`cart:${userId}`);

        res.status(201).json({

            message: "Order placed successfully",

            order

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

const getMyOrders = async (req, res) => {

    try {

        const userId = req.user.userId;

        const orders = await Order.find({
            user: userId
        }).sort({ createdAt: -1 });

        res.status(200).json(orders);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {
    placeOrder,
    getMyOrders
};