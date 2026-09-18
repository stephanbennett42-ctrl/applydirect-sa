/**
 * Database Connection Module
 * Creates a MySQL connection pool using mysql2.
 * Connects to XAMPP's MySQL (port 3307 for this setup).
 */
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3307),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'uniapply',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// Test the connection on startup (logs only — never crashes the server)
pool.getConnection()
  .then(conn => {
    console.log('MySQL connected successfully')
    conn.release()
  })
  .catch(err => {
    console.error('MySQL connection failed:', err.message)
    console.error('Make sure XAMPP MySQL is running on the port set in .env')
  })

export default pool