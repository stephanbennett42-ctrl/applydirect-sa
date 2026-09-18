-- ============================================
-- UniApply Login — Schema
-- Table used by this module:
--   users (for auth)
-- Run in phpMyAdmin or MySQL CLI, or use: npm run db:setup
-- ============================================

CREATE DATABASE IF NOT EXISTS uniapply;
USE uniapply;

-- ============================================
-- Users table — stores students and admins
-- (shared with other modules via the same DB)
-- ============================================
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
);