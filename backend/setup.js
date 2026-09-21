/**
 * ApplyDirect SA Student Site — Database Setup Script
 * Run with: npm run db:setup
 * Creates the sa_tertiary_db database and all tables the student backend needs.
 * SAFE to re-run — only creates missing tables and seeds empty ones.
 * Connects to XAMPP MySQL on port 3307 (see backend/.env).
 */
const mysql = require('mysql2/promise')
const dotenv = require('dotenv')

dotenv.config()

async function setup() {
  console.log('Setting up ApplyDirect SA student database...\n')

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3307,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  })

  console.log('Connected to MySQL')

  const dbName = process.env.DB_NAME || 'sa_tertiary_db'
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``)
  await conn.query(`USE \`${dbName}\``)
  console.log(`Database "${dbName}" ready\n`)

  // ============================================
  // Create tables (IF NOT EXISTS — keeps existing data)
  // ============================================

  await conn.query(`
    CREATE TABLE IF NOT EXISTS institutions (
      institution_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      institution_type VARCHAR(50),
      province VARCHAR(50),
      application_status VARCHAR(50) DEFAULT 'Closed',
      application_fee DECIMAL(10, 2) DEFAULT 0.00,
      opening_date DATE,
      closing_date DATE,
      website_url VARCHAR(255),
      application_url VARCHAR(255),
      faculties TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  console.log('Table ready: institutions')

  await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      phone_number VARCHAR(20) UNIQUE NOT NULL,
      channel ENUM('sms', 'whatsapp') DEFAULT 'whatsapp',
      is_premium BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  console.log('Table ready: users')

  await conn.query(`
    CREATE TABLE IF NOT EXISTS institution_reminders (
      reminder_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      institution_id INT NOT NULL,
      notify_on_open BOOLEAN DEFAULT TRUE,
      notify_on_close BOOLEAN DEFAULT TRUE,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY (institution_id) REFERENCES institutions(institution_id) ON DELETE CASCADE,
      UNIQUE(user_id, institution_id)
    )
  `)
  console.log('Table ready: institution_reminders')

  await conn.query(`
    CREATE TABLE IF NOT EXISTS application_reminders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      phone_number VARCHAR(20) NOT NULL,
      channel ENUM('sms', 'whatsapp', 'both') DEFAULT 'whatsapp',
      institution_id INT NOT NULL,
      reminder_days_before INT DEFAULT 7,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY (institution_id) REFERENCES institutions(institution_id) ON DELETE CASCADE
    )
  `)
  console.log('Table ready: application_reminders')

  await conn.query(`
    CREATE TABLE IF NOT EXISTS student_profiles (
      profile_id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      email VARCHAR(255),
      phone VARCHAR(20),
      date_of_birth DATE,
      address VARCHAR(255),
      province VARCHAR(50),
      school_name VARCHAR(255),
      matric_year INT,
      bio TEXT,
      profile_picture VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  console.log('Table ready: student_profiles')

  await conn.query(`
    CREATE TABLE IF NOT EXISTS student_subjects (
      subject_id INT AUTO_INCREMENT PRIMARY KEY,
      profile_id INT NOT NULL,
      subject_name VARCHAR(100),
      mark DECIMAL(5,2),
      grade VARCHAR(10),
      FOREIGN KEY (profile_id) REFERENCES student_profiles(profile_id) ON DELETE CASCADE
    )
  `)
  console.log('Table ready: student_subjects')

  await conn.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      message_id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT,
      full_name VARCHAR(100),
      email VARCHAR(255),
      subject VARCHAR(200),
      message TEXT,
      status ENUM('unread','read','replied','closed') DEFAULT 'unread',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  console.log('Table ready: contact_messages\n')

  // ============================================
  // Seed institutions (only when empty)
  // ============================================

  const [instCount] = await conn.query('SELECT COUNT(*) AS total FROM institutions')

  if (Number(instCount[0].total) === 0) {
    await conn.query(`
      INSERT INTO institutions
        (name, institution_type, province, application_status, application_fee, opening_date, closing_date, website_url, application_url)
      VALUES
        ('University of Cape Town (UCT)', 'University', 'Western Cape', 'Open', 100.00, '2026-04-01', '2026-07-31', 'https://www.uct.ac.za', 'https://applyonline.uct.ac.za/'),
        ('Stellenbosch University (SU)', 'University', 'Western Cape', 'Closed', 100.00, '2026-04-01', '2026-07-31', 'https://www.sun.ac.za', 'https://www.sun.ac.za/english/maties/apply'),
        ('Cape Peninsula University of Technology (CPUT)', 'University', 'Western Cape', 'Closed', 150.00, '2026-05-14', '2026-09-30', 'https://www.cput.ac.za', 'https://www.cput.ac.za/study/apply'),
        ('University of the Western Cape (UWC)', 'University', 'Western Cape', 'Open', 0.00, '2026-04-01', '2026-09-30', 'https://www.uwc.ac.za', 'https://www.uwc.ac.za/study/apply'),
        ('False Bay TVET College', 'TVET College', 'Western Cape', 'Open', 0.00, '2026-09-01', '2026-10-31', 'https://www.falsebaycollege.co.za', 'https://www.falsebaycollege.co.za/apply'),
        ('University of the Witwatersrand (Wits)', 'University', 'Gauteng', 'Open', 100.00, '2026-03-01', '2026-09-30', 'https://www.wits.ac.za', 'https://www.wits.ac.za/undergraduate/apply-to-wits/'),
        ('University of Johannesburg (UJ)', 'University', 'Gauteng', 'Open', 0.00, '2026-04-01', '2026-10-31', 'https://www.uj.ac.za', 'https://www.uj.ac.za/admission-aid/undergraduate/'),
        ('Tshwane University of Technology (TUT)', 'University', 'Gauteng', 'Open', 240.00, '2026-04-01', '2026-09-30', 'https://www.tut.ac.za', 'https://www.tut.ac.za/'),
        ('University of Pretoria (UP)', 'University', 'Gauteng', 'Open', 300.00, '2026-04-01', '2026-09-30', 'https://www.up.ac.za', 'https://www.up.ac.za/online-application'),
        ('University of South Africa (UNISA)', 'University', 'Gauteng', 'Open', 135.00, '2026-09-01', '2026-11-30', 'https://www.unisa.ac.za', 'https://www.unisa.ac.za/sites/corporate/default/Apply-for-admission'),
        ('Sefako Makgatho Health Sciences University (SMU)', 'University', 'Gauteng', 'Open', 200.00, '2026-04-01', '2026-09-30', 'https://www.smu.ac.za', 'https://www.smu.ac.za/online-application/'),
        ('Vaal University of Technology (VUT)', 'University', 'Gauteng', 'Open', 100.00, '2026-04-01', '2026-09-30', 'https://www.vut.ac.za', 'https://www.vut.ac.za/apply-to-vut/'),
        ('IIE Varsity College (Sandton)', 'Private College', 'Gauteng', 'Open', 400.00, '2026-01-01', '2026-12-15', 'https://www.varsitycollege.co.za', 'https://www.varsitycollege.co.za/'),
        ('University of KwaZulu-Natal (UKZN)', 'University', 'KwaZulu-Natal', 'Open', 210.00, '2026-04-01', '2026-09-30', 'https://www.ukzn.ac.za', 'https://cao.ac.za/'),
        ('Durban University of Technology (DUT)', 'University', 'KwaZulu-Natal', 'Open', 220.00, '2026-04-01', '2026-09-30', 'https://www.dut.ac.za', 'https://cao.ac.za/'),
        ('University of Zululand (UNIZULU)', 'University', 'KwaZulu-Natal', 'Open', 250.00, '2026-04-01', '2026-09-30', 'https://www.unizulu.ac.za', 'https://cao.ac.za/'),
        ('Mangosuthu University of Technology (MUT)', 'University', 'KwaZulu-Natal', 'Open', 220.00, '2026-04-01', '2026-09-30', 'https://www.mut.ac.za', 'https://cao.ac.za/'),
        ('Nelson Mandela University (NMU)', 'University', 'Eastern Cape', 'Open', 0.00, '2026-04-01', '2026-09-30', 'https://www.mandela.ac.za', 'https://applyonline.mandela.ac.za/'),
        ('Rhodes University (RU)', 'University', 'Eastern Cape', 'Open', 100.00, '2026-04-01', '2026-09-30', 'https://www.ru.ac.za', 'https://ross.ru.ac.za/'),
        ('University of Fort Hare (UFH)', 'University', 'Eastern Cape', 'Open', 0.00, '2026-04-01', '2026-10-31', 'https://www.ufh.ac.za', 'https://www.ufh.ac.za/apply/'),
        ('Walter Sisulu University (WSU)', 'University', 'Eastern Cape', 'Open', 0.00, '2026-04-01', '2026-09-30', 'https://www.wsu.ac.za', 'https://connect.wsu.ac.za/'),
        ('University of the Free State (UFS)', 'University', 'Free State', 'Open', 0.00, '2026-04-01', '2026-09-30', 'https://www.ufs.ac.za', 'https://apply.ufs.ac.za/'),
        ('Central University of Technology (CUT)', 'University', 'Free State', 'Open', 0.00, '2026-04-01', '2026-09-30', 'https://www.cut.ac.za', 'https://www.cut.ac.za/application-process'),
        ('North-West University (NWU)', 'University', 'North West', 'Open', 0.00, '2026-04-01', '2026-09-30', 'https://www.nwu.ac.za', 'https://studies.nwu.ac.za/'),
        ('Orbit TVET College', 'TVET College', 'North West', 'Open', 0.00, '2026-09-01', '2026-10-31', 'https://www.orbitcollege.co.za', 'https://www.orbitcollege.co.za/apply/'),
        ('University of Limpopo (UL)', 'University', 'Limpopo', 'Open', 200.00, '2026-04-01', '2026-09-30', 'https://www.ul.ac.za', 'https://www.ul.ac.za/'),
        ('University of Venda (UNIVEN)', 'University', 'Limpopo', 'Open', 100.00, '2026-04-01', '2026-09-30', 'https://www.univen.ac.za', 'https://www.univen.ac.za/apply/'),
        ('University of Mpumalanga (UMP)', 'University', 'Mpumalanga', 'Open', 150.00, '2026-04-01', '2026-11-30', 'https://www.ump.ac.za', 'https://www.ump.ac.za/'),
        ('Ehlanzeni TVET College', 'TVET College', 'Mpumalanga', 'Open', 0.00, '2026-09-01', '2026-10-31', 'https://www.ehlanzenicollege.co.za', 'https://www.ehlanzenicollege.co.za/apply/'),
        ('Sol Plaatje University (SPU)', 'University', 'Northern Cape', 'Open', 100.00, '2026-04-01', '2026-11-30', 'https://www.spu.ac.za', 'https://www.spu.ac.za/index.php/how-to-apply/'),
        ('Northern Cape Urban TVET College', 'TVET College', 'Northern Cape', 'Open', 0.00, '2026-09-01', '2026-10-31', 'https://www.ncucollege.edu.za', 'https://www.ncucollege.edu.za/apply/'),
        ('Eduvos (Tyger Valley Campus)', 'Private College', 'Western Cape', 'Open', 0.00, '2026-01-01', '2026-11-30', 'https://www.eduvos.com', 'https://www.eduvos.com/'),
        ('MANCOSA (Johannesburg Campus)', 'Private College', 'Gauteng', 'Open', 0.00, '2026-01-01', '2026-11-30', 'https://www.mancosa.co.za', 'https://www.mancosa.co.za/apply-now/'),
        ('Rosebank College', 'Private College', 'Gauteng', 'Open', 0.00, '2026-01-01', '2026-11-30', 'https://www.rosebankcollege.co.za', 'https://www.rosebankcollege.co.za/apply')
    `)

    await conn.query(`
      UPDATE institutions
      SET faculties = 'Applied Sciences, Business & Management Sciences, Education, Engineering, Health & Wellness Sciences, Informatics & Design'
      WHERE name LIKE '%CPUT%' OR name LIKE '%Cape Peninsula%'
    `)

    console.log('Seeded: 34 institutions')
  } else {
    console.log('Institutions already seeded — skipped')
  }

  console.log('\nStudent database setup complete!')
  console.log(`Database: ${dbName}`)
  console.log('Tables: institutions, users, institution_reminders, application_reminders, student_profiles, student_subjects, contact_messages')

  await conn.end()
  process.exit(0)
}

setup().catch(err => {
  console.error('Setup failed:', err.message)
  console.error(`\nMake sure your MySQL server is running on port ${process.env.DB_PORT || 3307}`)
  process.exit(1)
})