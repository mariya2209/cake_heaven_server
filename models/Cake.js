const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    cream: { type: String, required: true }, // eggless or regular
    category: { type: String, default: 'Cakes' },
    subCategory: { type: String, required: true }, // Subcategory: PullMeUpCakes, BombCakes, etc.
}, { timestamps: true });

const Cake = mongoose.model('Cake', cakeSchema);
module.exports = Cake;