 const mysql = require('mysql2');
 const path = require('path');
 require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3307,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sa_tertiary_db'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        return;
    }

    console.log('Connected to ApplyDirect-SA database');
});

module.exports = db;
