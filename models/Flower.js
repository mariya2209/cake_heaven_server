const mongoose = require('mongoose');

const flowerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String, default: 'Flowers' },
    subCategory: { type: String, required: true }, // Subcategory: RedRose, Pink Tulips, etc.
}, { timestamps: true });

const Flower = mongoose.model('Flower', flowerSchema);
module.exports = Flower;