const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
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