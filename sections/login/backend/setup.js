/**
 * Login Database Setup Script
 * Run with: npm run db:setup
 * Creates the uniapply database and the users table this module needs.
 * This script is SAFE to re-run — it never drops tables with data,
 * it only creates missing tables and seeds empty ones.
 * Connects to XAMPP MySQL on port 3307 (see .env).
 */
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

async function setup() {
  console.log('Setting up UniApply Login database...\n')

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3307,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  })

  console.log('Connected to MySQL')

  await conn.query('CREATE DATABASE IF NOT EXISTS uniapply')
  await conn.query('USE uniapply')
  console.log('Database "uniapply" ready\n')

  // ============================================
  // Create tables (IF NOT EXISTS — keeps existing data)
  // ============================================

  await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(30),
      university VARCHAR(255),
      status ENUM('pending','approved','rejected') DEFAULT 'pending',
      role ENUM('student','admin') DEFAULT 'student',
      registered_date DATE DEFAULT (CURRENT_DATE),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `)
  console.log('Table ready: users')

  // ============================================
  // Seed data (only when the tables are empty)
  // ============================================

  const [userCount] = await conn.query('SELECT COUNT(*) AS total FROM users')

  if (Number(userCount[0].total) === 0) {
    const studentHash = await bcrypt.hash('password123', 10)
    await conn.query(
      'INSERT INTO users (first_name, last_name, email, password, phone, university, status, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      ['Thabo', 'Mokoena', 'thabo@email.com', studentHash, '+27 82 123 4567', 'University of Cape Town (UCT)', 'approved', 'student']
    )
    await conn.query(
      'INSERT INTO users (first_name, last_name, email, password, phone, university, status, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      ['Zanele', 'Khumalo', 'zanele@email.com', studentHash, '+27 83 456 7890', 'Stellenbosch University', 'approved', 'student']
    )
    const adminHash = await bcrypt.hash('admin123', 10)
    await conn.query(
      'INSERT INTO users (first_name, last_name, email, password, phone, university, status, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      ['UniApply', 'Admin', 'admin@uniapply.co.za', adminHash, null, null, 'approved', 'admin']
    )
    console.log('Seeded: 2 demo students (password: password123) + 1 admin (password: admin123)')
  } else {
    console.log('Users already exist — skipped seeding')
  }

  console.log('\nDatabase setup complete!')
  console.log('Demo logins:')
  console.log('  thabo@email.com / password123 (student)')
  console.log('  zanele@email.com / password123 (student)')
  console.log('  admin@uniapply.co.za / admin123 (admin)')

  await conn.end()
  process.exit(0)
}

setup().catch(err => {
  console.error('Setup failed:', err.message)
  console.error(`\nMake sure your MySQL server is running on port ${process.env.DB_PORT || 3307}`)
  process.exit(1)
})