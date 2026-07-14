const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");
router.post(
    "/",
    authMiddleware,
    authorize("admin"),
    createProduct
);
router.get("/", getProducts);

router.get("/:id", getProductById);
router.delete(
    "/:id",
    authMiddleware,
    authorize("admin"),
    deleteProduct
);
module.exports = router;