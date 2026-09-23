import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sa_tertiary_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// Test initial database connection
try {
  const connection = await db.getConnection()
  console.log('Successfully connected to sa_tertiary_db pool.')
  connection.release()
} catch (err) {
  console.error('MySQL Connection Error:', err.code, '-', err.message)
}

export default db