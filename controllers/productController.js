const Product = require('../models/Product');

// Add Product (Admin only)
exports.addProduct = async (req, res) => {
    console.log('Received product data:', req.body); // Add this line
    const { name, description, price, category, stock, image, deliveryDate, shape, creamType, egg, sugarFree, quantity } = req.body;
    try {
        const product = new Product({ name, description, price, category, stock, image, deliveryDate, shape, creamType, egg, sugarFree, quantity });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update Product (Admin only)
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, stock, image, deliveryDate, shape, creamType, egg, sugarFree, quantity } = req.body;
    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.stock = stock || product.stock;
        product.image = image || product.image;
        product.deliveryDate = deliveryDate || product.deliveryDate;
        product.shape = shape || product.shape;
        product.creamType = creamType || product.creamType;
        product.egg = egg !== undefined ? egg : product.egg;
        product.quantity = quantity || product.quantity;

        await product.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Delete Product (Admin only)
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        await product.remove();
        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get All Products (Public)
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get Product by ID (Public)
exports.getProductById = async (req, res) => {
    console.log('Fetching product with ID:', req.params.id);
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            console.log('Product not found for ID:', req.params.id);
            return res.status(404).json({ message: 'Product not found' });
        }
        console.log('Product found:', product);
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add rating to a product (Authenticated users)
exports.addProductRating = async (req, res) => {
    const { rating, comment } = req.body;
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        const newRating = {
            user: req.user ? req.user.id : 'Anonymous',
            rating,
            comment
        };

        product.ratings.push(newRating);
        await product.save();

        res.status(201).json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get products by category (public)
exports.getProductsByCategory = async (req, res) => {
    const { category, subcategory } = req.params;
    console.log('Fetching products for category:', category, 'and subcategory:', subcategory);
    try {
        const products = await Product.find({ 
            category: category,
            subCategory: subcategory 
        });
        console.log('Found products:', products.length);
        res.json(products);
    } catch (err) {
        console.error('Error fetching products by category:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
