const express = require('express');
const { createCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/categoryController');
const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();

router.post('/', adminMiddleware, createCategory);  // Create category
router.get('/', getCategories);                     // Get all categories
router.put('/:id', adminMiddleware, updateCategory); // Update category
router.delete('/:id', adminMiddleware, deleteCategory); // Delete category

module.exports = router;