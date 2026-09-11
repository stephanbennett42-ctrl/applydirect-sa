require('dotenv').config();

const express = require('express');
const cors = require('cors');

const db = require('./config/db');
const portfolioRoutes = require('./routes/profile');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/portfolio', portfolioRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'ApplyDirect-SA Backend is running'
    });
});

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});