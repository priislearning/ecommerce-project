const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const {
    placeOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderController");
router.put(
    "/:id/status",
    authMiddleware,
    authorize("admin"),
    updateOrderStatus
);
router.post("/", authMiddleware, placeOrder);
router.get("/", authMiddleware, getMyOrders);
router.get(
    "/admin",
    authMiddleware,
    authorize("admin"),
    getAllOrders
);
module.exports = router;