const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    cream: { type: String },
    category: { type: String, enum: ['Cakes', 'Flowers', 'Recipes'], required: true },
    subCategory: { type: String, required: true },
    theme: { type: String },
    deliveryDate: { type: Date },
    shape: { type: String },
    eggless: { type: Boolean },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;








