const express = require('express');
const {
    addProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getProductById,
    addProductRating,
    getProductsByCategory
} = require('../controllers/productController');
const { verifyAdmin } = require('../middleware/authMiddleware'); // Change this line

const router = express.Router();

// Admin routes
router.post('/', verifyAdmin, addProduct); // Change isAdmin to verifyAdmin
router.put('/:id', verifyAdmin, updateProduct); // Change isAdmin to verifyAdmin
router.delete('/:id', verifyAdmin, deleteProduct); // Change isAdmin to verifyAdmin

// Public routes
router.get('/', getProducts);
router.get('/category/:category/:subcategory', getProductsByCategory);
router.get('/:id', getProductById);
router.post('/:id/rating', addProductRating);

module.exports = router;



