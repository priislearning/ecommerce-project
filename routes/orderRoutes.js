const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    placeOrder,
    getMyOrders
} = require("../controllers/orderController");

router.post("/", authMiddleware, placeOrder);
router.get("/", authMiddleware, getMyOrders);
module.exports = router;