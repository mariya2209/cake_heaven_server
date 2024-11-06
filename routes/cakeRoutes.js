const express = require('express');
const Cake = require('../models/Cake');
const router = express.Router();

// Get all cakes
router.get('/', async (req, res) => {
    try {
        const cakes = await Cake.find();
        res.json(cakes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get cakes by subcategory
router.get('/:subCategory', async (req, res) => {
    try {
        const cakes = await Cake.find({ subCategory: req.params.subCategory });
        res.json(cakes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;