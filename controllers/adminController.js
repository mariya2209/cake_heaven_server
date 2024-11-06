const Product = require('../models/Product');

// Add new product (Cakes, Flowers, Recipes)
exports.addProduct = async (req, res) => {
    try {
        const { name, description, price, stock, imageUrl, cream, category, subCategory } = req.body;
        const newProduct = new Product({ name, description, price, stock, imageUrl, cream, category, subCategory });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add product' });
    }
};

// Update existing product
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
};

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

// Get product by category/subcategory
exports.getProductsByCategory = async (req, res) => {
    try {
        const { category, subCategory } = req.params;
        const products = await Product.find({ category, subCategory });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};