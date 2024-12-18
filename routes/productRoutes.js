const express = require("express");
const {
  getProductById,
  getProductImages,
  getProducts,
  createProduct,
} = require("../controllers/productController");

const router = express.Router();

router.get("/:id", getProductById);
router.get("/images/:id", getProductImages);
router.get("/", getProducts);
router.post("/", createProduct);

// router.get("/:id", getProductImages);

module.exports = router;
