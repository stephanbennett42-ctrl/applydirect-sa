const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sa_tertiary_db',
    port: process.env.DB_PORT || 3307,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test initial database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("MySQL Connection Error:", err.code, "-", err.message);
  } else {
    console.log("Successfully connected to sa_tertiary_db pool.");
    connection.release();
  }
});

module.exports = db.promise();