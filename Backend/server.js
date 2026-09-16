require('dotenv').config();

const express = require('express');
const cors = require('cors');

const db = require('./config/db');

const portfolioRoutes = require('./routes/profile');
const contactRoutes = require('./routes/contact');

const app = express();

app.use(cors());
app.use(express.json());

// Profile / Portfolio API
app.use('/api/portfolio', portfolioRoutes);

// Contact Us API
//app.use('/api/contact', contactRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'ApplyDirect-SA Backend is running'
    });
});

const PORT = process.env.PORT || 3000;

app.use('/api/contact', (req, res, next) => {
    console.log('CONTACT REQUEST:', req.method, req.originalUrl);
    next();
}, contactRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});