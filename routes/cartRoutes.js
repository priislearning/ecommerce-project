const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getCart,
    addToCart,
    updateCart,
    removeFromCart
} = require("../controllers/cartController");

router.post("/", authMiddleware, addToCart);

router.put("/:id", authMiddleware, updateCart);

router.delete("/:id", authMiddleware, removeFromCart);

router.get("/", authMiddleware, getCart);

module.exports = router;