const express = require("express");
const upload = require("../middleware/upload");
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
    upload.single("image"),
    createProduct
);
router.get("/", getProducts);
router.put(
    "/:id",
    authMiddleware,
    authorize("admin"),
     upload.single("image"),
    updateProduct
);
router.get("/:id", getProductById);
router.delete(
    "/:id",
    authMiddleware,
    authorize("admin"),
    deleteProduct
);
module.exports = router;