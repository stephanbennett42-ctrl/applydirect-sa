/**
 * Admin Database Setup Script
 * Run with: npm run db:setup
 * Creates the uniapply database and the tables the admin panel needs,
 * and seeds a default admin account when none exists.
 * This script is SAFE to re-run — it never drops tables with data.
 * Connects to XAMPP MySQL on port 3307 (see .env).
 */
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

async function setup() {
  console.log('Setting up UniApply Admin database...\n')

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
      field_of_study VARCHAR(150),
      status ENUM('pending','approved','rejected') DEFAULT 'pending',
      role ENUM('student','admin') DEFAULT 'student',
      registered_date DATE DEFAULT (CURRENT_DATE),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `)
  console.log('Table ready: users')

  // Add field_of_study to existing installs (MySQL has no ADD COLUMN IF NOT EXISTS)
  const [colCheck] = await conn.query(
    `SELECT COUNT(*) AS total FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = 'uniapply' AND TABLE_NAME = 'users' AND COLUMN_NAME = 'field_of_study'`
  )
  if (Number(colCheck[0].total) === 0) {
    await conn.query('ALTER TABLE users ADD COLUMN field_of_study VARCHAR(150)')
    console.log('Column added: users.field_of_study')
  }

  await conn.query(`
    CREATE TABLE IF NOT EXISTS packages (
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
  console.log('Table ready: packages')

  await conn.query(`
    CREATE TABLE IF NOT EXISTS orders (
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
  console.log('Table ready: orders')

  await conn.query(`
    CREATE TABLE IF NOT EXISTS payments (
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
  console.log('Table ready: payments\n')

  await conn.query(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      company VARCHAR(150) NOT NULL,
      location VARCHAR(150),
      field VARCHAR(100) NOT NULL,
      type ENUM('full-time','part-time','internship','contract') DEFAULT 'full-time',
      salary VARCHAR(100),
      description TEXT,
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `)
  console.log('Table ready: jobs')

  await conn.query(`
    CREATE TABLE IF NOT EXISTS placements (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      job_id INT NOT NULL,
      salary DECIMAL(12,2) NOT NULL,
      employment_start DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
    )
  `)
  console.log('Table ready: placements')

  await conn.query(`
    CREATE TABLE IF NOT EXISTS job_applications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      job_id INT NOT NULL,
      student_id INT NOT NULL,
      full_name VARCHAR(200) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(30),
      university VARCHAR(255),
      field_of_study VARCHAR(150),
      cover_letter TEXT NOT NULL,
      experience TEXT,
      status ENUM('pending','shortlisted','rejected','hired') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)
  console.log('Table ready: job_applications')

  const [jobCount] = await conn.query('SELECT COUNT(*) AS total FROM jobs')

  if (Number(jobCount[0].total) === 0) {
    await conn.query(`
      INSERT INTO jobs (title, company, location, field, type, salary, description) VALUES
      ('Junior Software Developer', 'AfroSoft Solutions', 'Cape Town', 'Information Technology & Computer Science', 'full-time', 'R 240,000 – R 340,000 p/a',
       'Build and maintain web applications for local and international clients. Mentorship from senior developers, modern stack (React, Node, MySQL), and a clear growth path to mid-level in 18 months.'),
      ('IT Support Engineer', 'First National Bank', 'Johannesburg', 'Information Technology & Computer Science', 'full-time', 'R 220,000 – R 300,000 p/a',
       'Provide first-line technical support across banking infrastructure. Ideal for a graduate with strong troubleshooting skills and Microsoft/Networking fundamentals.'),
      ('Graduate Civil Engineer', 'AECOM South Africa', 'Midrand', 'Engineering', 'full-time', 'R 320,000 – R 420,000 p/a',
       'Join the transport and infrastructure team working on national road and water projects. Full mentorship towards professional registration with ECSA.'),
      ('Junior Electrical Engineer', 'Eskom', 'Johannesburg', 'Engineering', 'full-time', 'R 300,000 – R 400,000 p/a',
       'Support power delivery engineering in a structured two-year graduate programme. Rotations across Generation, Transmission and Distribution.'),
      ('Graduate Financial Analyst', 'Deloitte South Africa', 'Sandton', 'Business & Finance', 'full-time', 'R 350,000 – R 450,000 p/a',
       'Work with audit and advisory teams on client engagements. Strong path to CA(SA) with a dedicated training office and study support.'),
      ('Junior Business Development Consultant', 'Old Mutual', 'Cape Town', 'Business & Finance', 'full-time', 'R 260,000 – R 340,000 p/a',
       'Support the private clients team with financial planning, portfolio analysis and client reporting. Full licensing and study support provided.'),
      ('Marketing Graduate', 'Coca-Cola Beverages South Africa', 'Gqeberha', 'Marketing & Communications', 'full-time', 'R 250,000 – R 330,000 p/a',
       'Twelve-month graduate programme across brand, digital and trade marketing. Work on real campaigns reaching millions of South Africans.'),
      ('Communications Intern', 'TBWA Hunt Lascaris', 'Cape Town', 'Marketing & Communications', 'internship', 'R 15,000 – R 18,000 / month',
       'Support the PR and social media desks on national brand accounts. A six-to-nine month internship with strong conversion potential.'),
      ('Registered Nurse (Newly Qualified)', 'Netcare Hospitals', 'Durban', 'Health Sciences', 'full-time', 'R 280,000 – R 360,000 p/a',
       'Community and ward-based nursing in a leading private hospital group. Structured preceptorship for newly qualified nurses.'),
      ('Physiotherapist (Community Service)', 'Western Cape Department of Health', 'Cape Town', 'Health Sciences', 'contract', 'R 320,000 – R 360,000 p/a',
       'Twelve-month community service placement at a district hospital. Broad caseload across outpatients, rehabilitation and outreach.'),
      ('Candidate Attorney', 'Webber Wentzel', 'Johannesburg', 'Law', 'full-time', 'R 400,000 – R 500,000 p/a',
       'Two-year articles with rotations across corporate, dispute resolution and employment practice. Leading commercial law firm in Africa.'),
      ('Junior Legal Advisor', 'South African Revenue Service (SARS)', 'Pretoria', 'Law', 'full-time', 'R 380,000 – R 460,000 p/a',
       'Advise on tax law interpretation, review legislative impact and support disputes. LLB graduates with a strong interest in tax are encouraged to apply.'),
      ('Foundation Phase Teacher', 'Curro Holdings', 'Pretoria', 'Education & Teaching', 'full-time', 'R 240,000 – R 320,000 p/a',
       'Teach Grades 1–3 in a well-resourced independent school. Communities of practice, coaching and clear promotion opportunities.'),
      ('Laboratory Technician', 'SGS South Africa', 'Cape Town', 'Science & Mathematics', 'full-time', 'R 220,000 – R 290,000 p/a',
       'Perform analytical testing in food and environmental chemistry labs. BSc graduates with laboratory exposure preferred; full training provided.'),
      ('Youth Development Officer', 'Western Cape Government', 'Cape Town', 'Social Sciences & Humanities', 'full-time', 'R 260,000 – R 340,000 p/a',
       'Design and run programmes that support youth employment and skills development across the province.'),
      ('Graduate Agronomist', 'Grain SA', 'Bloemfontein', 'Agriculture & Environmental', 'full-time', 'R 280,000 – R 360,000 p/a',
       'Work with grains and oilseeds producers on soil health, crop rotation and sustainable farming practices.')
    `)
    console.log('Seeded: 16 graduate jobs')
  } else {
    console.log('Jobs already seeded — skipped')
  }

  // ============================================
  // Seed data (only when the tables are empty)
  // ============================================

  const [pkgCount] = await conn.query('SELECT COUNT(*) AS total FROM packages')

  if (Number(pkgCount[0].total) === 0) {
    await conn.query(`
      INSERT INTO packages (name, price, description, max_universities, features, highlighted) VALUES
      ('Basic', 150.00, 'Application to one university', 1,
       '["Application to 1 university","Document verification","Application submission","Status tracking","Email support"]',
       FALSE),
      ('Standard', 380.00, 'Application to up to 3 universities', 3,
       '["Application to up to 3 universities","Document verification","Application submission","Status tracking","Priority email & phone support","Program matching assistance"]',
       TRUE),
      ('Premium', 500.00, 'Application to up to 5 universities + career guidance', 5,
       '["Application to up to 5 universities","Document verification & optimization","Application submission","Real-time status tracking","Dedicated advisor","Career guidance session","Job placement assistance after graduation"]',
       FALSE)
    `)
    console.log('Seeded: 3 packages')
  } else {
    console.log('Packages already seeded — skipped')
  }

  const [adminCount] = await conn.query("SELECT COUNT(*) AS total FROM users WHERE role = 'admin'")

  if (Number(adminCount[0].total) === 0) {
    const adminHash = await bcrypt.hash('admin123', 10)
    await conn.query(
      'INSERT INTO users (first_name, last_name, email, password, status, role) VALUES (?, ?, ?, ?, ?, ?)',
      ['System', 'Administrator', 'admin@uniapply.co.za', adminHash, 'approved', 'admin']
    )
    console.log('Seeded: admin (admin@uniapply.co.za / admin123)')
  } else {
    console.log('Admins already seeded — skipped')
  }

  console.log('\nDatabase setup complete!')
  console.log('Admin account:')
  console.log('  admin@uniapply.co.za / admin123')

  await conn.end()
  process.exit(0)
}

setup().catch(err => {
  console.error('Setup failed:', err.message)
  console.error(`\nMake sure your MySQL server is running on port ${process.env.DB_PORT || 3307}`)
  process.exit(1)
})