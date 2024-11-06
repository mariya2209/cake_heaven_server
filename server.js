require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/productRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cakeRoutes = require('./routes/cakeRoutes');
const flowerRoutes = require('./routes/flowerRoutes');
const adminMiddleware = require('./middleware/adminMiddleware'); // Change this line

const app = express();

// Middleware
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000', // or your frontend URL
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin', adminMiddleware, adminRoutes);
app.use('/api/cakes', cakeRoutes);
app.use('/api/flowers', flowerRoutes);

// Add this at the end of your server.js file, after all other middleware and route definitions
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
