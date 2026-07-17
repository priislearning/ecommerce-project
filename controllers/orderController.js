const { redisClient } = require("../db/redis");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const getAllOrders = async (req, res) => {

    try {

        const orders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        console.log(orders);
        res.json(orders);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};
const updateOrderStatus = async (req, res) => {
try {

        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Shipped",
            "Delivered"
        ];

        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                message: "Invalid status"
            });

        }

        const order = await Order.findByIdAndUpdate(

            req.params.id,

            {
                status
            },

            {
                new: true
            }

        );

        if (!order) {

            return res.status(404).json({
                message: "Order not found"
            });

        }

        res.json({

            message: "Order status updated",

            order

        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
}

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
    getMyOrders,
    getAllOrders,
    updateOrderStatus
};