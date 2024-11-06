const express = require('express');
const router = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const adminController = require('../controllers/adminController');

// Add new product (Cakes, Flowers, Recipes)
router.post('/products', adminMiddleware, adminController.addProduct);

// Update existing product
router.put('/products/:id', adminMiddleware, adminController.updateProduct);

// Delete a product
router.delete('/products/:id', adminMiddleware, adminController.deleteProduct);

// Get all products
router.get('/products', adminController.getProducts);

// Get products by category/subcategory
router.get('/products/category/:category/:subCategory', adminController.getProductsByCategory);

module.exports = router;


