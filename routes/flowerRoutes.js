const express = require('express');
const Flower = require('../models/Flower');
const router = express.Router();

// Get all flowers
router.get('/', async (req, res) => {
    try {
        const flowers = await Flower.find();
        res.json(flowers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get flowers by subcategory
router.get('/:subCategory', async (req, res) => {
    try {
        const flowers = await Flower.find({ subCategory: req.params.subCategory });
        res.json(flowers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;