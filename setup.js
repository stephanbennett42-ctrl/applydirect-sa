/**
 * Database Setup Script
 * Run with: npm run db:setup
 * Creates the uniapply database, tables, and seed data.
 * Connects to XAMPP MySQL (root, no password).
 */
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function setup() {
  console.log('Setting up UniApply database...\n')

  // Connect to MySQL without selecting a database
  const conn = await mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'Rasool14@',
    multipleStatements: true
  })

  console.log('Connected to MySQL')

  // Create database
  await conn.query('CREATE DATABASE IF NOT EXISTS uniapply')
  console.log('Database "uniapply" created')

  await conn.query('USE uniapply')
  console.log('Selected database "uniapply"\n')

  // Drop existing tables (clean setup)
  const dropOrder = ['payments', 'applications', 'orders', 'packages', 'users']
  for (const table of dropOrder) {
    await conn.query(`DROP TABLE IF EXISTS ${table}`)
  }
  console.log('Dropped existing tables')

  // Generate bcrypt hashes for seed passwords
  const adminHash = await bcrypt.hash('admin123', 10)
  const studentHash = await bcrypt.hash('password123', 10)

  // ============================================
  // Create tables
  // ============================================

  await conn.query(`
    CREATE TABLE users (
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
  console.log('Created table: users')

  await conn.query(`
    CREATE TABLE packages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      description TEXT,
      max_universities INT DEFAULT 1,
      features JSON,
      highlighted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  console.log('Created table: packages')

  await conn.query(`
    CREATE TABLE orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      package_id INT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      status ENUM('pending','paid','cancelled','refunded') DEFAULT 'pending',
      payment_method VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (package_id) REFERENCES packages(id)
    )
  `)
  console.log('Created table: orders')

  await conn.query(`
    CREATE TABLE applications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      university VARCHAR(255) NOT NULL,
      program VARCHAR(255) NOT NULL,
      status ENUM('pending','under_review','accepted','rejected') DEFAULT 'pending',
      submitted_date DATE DEFAULT (CURRENT_DATE),
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)
  console.log('Created table: applications')

  await conn.query(`
    CREATE TABLE payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      method VARCHAR(50) NOT NULL,
      card_last_four VARCHAR(4),
      status ENUM('success','failed','pending') DEFAULT 'success',
      transaction_ref VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    )
  `)
  console.log('Created table: payments\n')

  // ============================================
  // Seed data
  // ============================================

  // Insert packages
  await conn.query(`
    INSERT INTO packages (name, price, description, max_universities, features, highlighted) VALUES
    ('Standard', 200.00, 'Application to one university', 1,
     '["Application to 1 university","Document verification","Application submission","Status tracking","Email support"]',
     TRUE),
    ('Gold', 320.00, 'Application to up to 3 universities', 3,
     '["Application to up to 3 universities","Document verification","Application submission","Status tracking","Priority email & phone support","Program matching assistance"]',
     FALSE),
    ('Premium', 450.00, 'Application to up to 5 universities + career guidance', 5,
     '["Application to up to 5 universities","Document verification & optimization","Application submission","Real-time status tracking","Dedicated advisor","Career guidance session","Job placement assistance after graduation"]',
     FALSE)
  `)
  console.log('Seeded: 3 packages')

  // Insert admin
  await conn.query(
    'INSERT INTO users (first_name, last_name, email, password, status, role) VALUES (?, ?, ?, ?, ?, ?)',
    ['System', 'Administrator', 'admin@uniapply.co.za', adminHash, 'approved', 'admin']
  )
  console.log('Seeded: admin (admin@uniapply.co.za / admin123)')

  // Insert demo students
  await conn.query(
    'INSERT INTO users (first_name, last_name, email, password, phone, university, status, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    ['Thabo', 'Mokoena', 'thabo@email.com', studentHash, '+27 82 123 4567', 'University of Cape Town (UCT)', 'approved', 'student']
  )
  await conn.query(
    'INSERT INTO users (first_name, last_name, email, password, phone, university, status, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    ['Zanele', 'Khumalo', 'zanele@email.com', studentHash, '+27 83 456 7890', 'Stellenbosch University', 'approved', 'student']
  )
  await conn.query(
    'INSERT INTO users (first_name, last_name, email, password, phone, university, status, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    ['Lwazi', 'Ndaba', 'lwazi@email.com', studentHash, '+27 84 567 8901', 'Cape Peninsula University of Technology (CPUT)', 'pending', 'student']
  )
  console.log('Seeded: 3 demo students (password: password123)\n')

  // Insert sample applications
  await conn.query(
    'INSERT INTO applications (user_id, university, program, status, notes) VALUES (?, ?, ?, ?, ?)',
    [1, 'University of Cape Town (UCT)', 'Bachelor of Commerce', 'under_review', '']
  )
  await conn.query(
    'INSERT INTO applications (user_id, university, program, status, notes) VALUES (?, ?, ?, ?, ?)',
    [2, 'Stellenbosch University', 'Bachelor of Commerce', 'accepted', 'Strong academic record']
  )
  await conn.query(
    'INSERT INTO applications (user_id, university, program, status, notes) VALUES (?, ?, ?, ?, ?)',
    [3, 'Cape Peninsula University of Technology (CPUT)', 'Diploma in IT', 'pending', '']
  )
  console.log('Seeded: 3 sample applications\n')

  console.log('Database setup complete!')
  console.log('\nDemo accounts:')
  console.log('  Admin:     admin@uniapply.co.za / admin123')
  console.log('  Student 1: thabo@email.com / password123 (approved)')
  console.log('  Student 2: zanele@email.com / password123 (approved)')
  console.log('  Student 3: lwazi@email.com / password123 (pending)')

  await conn.end()
  process.exit(0)
}

setup().catch(err => {
  console.error('Setup failed:', err.message)
  console.error('\nMake sure XAMPP MySQL is running on port 3306')
  process.exit(1)
})
