const express = require('express');
const router = express.Router();
const productController = require('../Controller/product.controller');

// Public: get list of products
router.get('/products', productController.getProducts);

// Admin/Seller: create a product — protected by simple seller key header
router.post('/admin/product', productController.createProduct);

module.exports = router;
