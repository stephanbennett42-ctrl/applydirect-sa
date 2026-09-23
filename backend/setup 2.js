/**
 * ApplyDirect SA Master Database Setup Script
 * Run with: npm run db:setup
 * Creates sa_tertiary_db database and all required tables.
 * SAFE to re-run — only creates missing tables and seeds empty ones.
 */
const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')

dotenv.config()

async function setup() {
  console.log('Setting up ApplyDirect SA unified database...\n')

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
  // Create Tables
  // ============================================

  // Institutions
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

  // Unified Users (Auth + Reminders)
  await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      name VARCHAR(100),
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      phone VARCHAR(30),
      phone_number VARCHAR(20) UNIQUE,
      channel ENUM('sms', 'whatsapp') DEFAULT 'whatsapp',
      is_premium BOOLEAN DEFAULT FALSE,
      university VARCHAR(255),
      field_of_study VARCHAR(150),
      status ENUM('pending','approved','rejected') DEFAULT 'approved',
      role ENUM('student','admin') DEFAULT 'student',
      registered_date DATE DEFAULT (CURRENT_DATE),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `)
  console.log('Table ready: users')

  // Institution Reminders
  await conn.query(`
    CREATE TABLE IF NOT EXISTS institution_reminders (
      reminder_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      institution_id INT NOT NULL,
      notify_on_open BOOLEAN DEFAULT TRUE,
      notify_on_close BOOLEAN DEFAULT TRUE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (institution_id) REFERENCES institutions(institution_id) ON DELETE CASCADE,
      UNIQUE(user_id, institution_id)
    )
  `)
  console.log('Table ready: institution_reminders')

  // Application Reminders
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
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (institution_id) REFERENCES institutions(institution_id) ON DELETE CASCADE
    )
  `)
  console.log('Table ready: application_reminders')

  // Packages
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

  // Orders
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

  // Payments
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
  console.log('Table ready: payments')

  // Jobs
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

  // Placements
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

  // Job Applications
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

  // Student Profiles
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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)
  console.log('Table ready: student_profiles')

  // Student Subjects
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

  // Contact Messages
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
  // Seed Data
  // ============================================

  // Seed Institutions
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
    console.log('Seeded: institutions')
  }

  // Seed Packages
  const [pkgCount] = await conn.query('SELECT COUNT(*) AS total FROM packages')
  if (Number(pkgCount[0].total) === 0) {
    await conn.query(`
      INSERT INTO packages (name, price, description, max_universities, features, highlighted) VALUES
      ('Basic', 0.00, 'Application to one university (free)', 1,
       '["Application to 1 university","Document verification","Application submission","Status tracking","Email support"]',
       FALSE),
      ('Premium', 500.00, 'Application to up to 5 universities + career guidance', 5,
       '["Application to up to 5 universities","Document verification & optimization","Application submission","Real-time status tracking","Dedicated advisor","Career guidance session","Job placement assistance after graduation"]',
       TRUE)
    `)
    console.log('Seeded: packages (Basic Free, Premium R500)')
  }

  // Seed Graduate Jobs
  const [jobCount] = await conn.query('SELECT COUNT(*) AS total FROM jobs')
  if (Number(jobCount[0].total) === 0) {
    await conn.query(`
      INSERT INTO jobs (title, company, location, field, type, salary, description) VALUES
      ('Junior Software Developer', 'AfroSoft Solutions', 'Cape Town', 'Information Technology & Computer Science', 'full-time', 'R 240,000 – R 340,000 p/a', 'Build and maintain web applications for local and international clients.'),
      ('IT Support Engineer', 'First National Bank', 'Johannesburg', 'Information Technology & Computer Science', 'full-time', 'R 220,000 – R 300,000 p/a', 'Provide first-line technical support across banking infrastructure.'),
      ('Graduate Civil Engineer', 'AECOM South Africa', 'Midrand', 'Engineering', 'full-time', 'R 320,000 – R 420,000 p/a', 'Join transport and infrastructure teams on national road/water projects.'),
      ('Junior Electrical Engineer', 'Eskom', 'Johannesburg', 'Engineering', 'full-time', 'R 300,000 – R 400,000 p/a', 'Support power delivery engineering in a structured graduate programme.'),
      ('Graduate Financial Analyst', 'Deloitte South Africa', 'Sandton', 'Business & Finance', 'full-time', 'R 350,000 – R 450,000 p/a', 'Work with audit and advisory teams. Strong path to CA(SA).'),
      ('Junior Business Development Consultant', 'Old Mutual', 'Cape Town', 'Business & Finance', 'full-time', 'R 260,000 – R 340,000 p/a', 'Support private clients team with financial planning and portfolio analysis.'),
      ('Marketing Graduate', 'Coca-Cola Beverages South Africa', 'Gqeberha', 'Marketing & Communications', 'full-time', 'R 250,000 – R 330,000 p/a', 'Twelve-month graduate programme across brand and trade marketing.'),
      ('Communications Intern', 'TBWA Hunt Lascaris', 'Cape Town', 'Marketing & Communications', 'internship', 'R 15,000 – R 18,000 / month', 'Support PR and social media desks on national brand accounts.'),
      ('Registered Nurse (Newly Qualified)', 'Netcare Hospitals', 'Durban', 'Health Sciences', 'full-time', 'R 280,000 – R 360,000 p/a', 'Community and ward-based nursing in a leading private hospital group.'),
      ('Physiotherapist (Community Service)', 'Western Cape Department of Health', 'Cape Town', 'contract', 'R 320,000 – R 360,000 p/a', 'Twelve-month community service placement at a district hospital.'),
      ('Candidate Attorney', 'Webber Wentzel', 'Johannesburg', 'Law', 'full-time', 'R 400,000 – R 500,000 p/a', 'Two-year articles with rotations across corporate and dispute resolution.'),
      ('Junior Legal Advisor', 'South African Revenue Service (SARS)', 'Pretoria', 'Law', 'full-time', 'R 380,000 – R 460,000 p/a', 'Advise on tax law interpretation and support disputes.'),
      ('Foundation Phase Teacher', 'Curro Holdings', 'Pretoria', 'Education & Teaching', 'full-time', 'R 240,000 – R 320,000 p/a', 'Teach Grades 1–3 in a well-resourced independent school.'),
      ('Laboratory Technician', 'SGS South Africa', 'Cape Town', 'Science & Mathematics', 'full-time', 'R 220,000 – R 290,000 p/a', 'Perform analytical testing in food and environmental chemistry labs.'),
      ('Youth Development Officer', 'Western Cape Government', 'Cape Town', 'Social Sciences & Humanities', 'full-time', 'R 260,000 – R 340,000 p/a', 'Run programmes supporting youth employment and skills development.'),
      ('Graduate Agronomist', 'Grain SA', 'Bloemfontein', 'Agriculture & Environmental', 'full-time', 'R 280,000 – R 360,000 p/a', 'Work with crop producers on soil health and sustainable farming.')
    `)
    console.log('Seeded: 16 graduate jobs')
  }

  // Seed Demo Users
  const [userCount] = await conn.query("SELECT COUNT(*) AS total FROM users WHERE role = 'student'")
  if (Number(userCount[0].total) === 0) {
    const passwordHash = await bcrypt.hash('password123', 10)
    await conn.query(
      `INSERT INTO users (first_name, last_name, name, email, password, phone, phone_number, university, field_of_study, status, role, is_premium)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Thabo', 'Mokoena', 'Thabo Mokoena', 'thabo@email.com', passwordHash,
        '+27 82 123 4567', '+27821234567', 'University of Cape Town (UCT)',
        'Information Technology & Computer Science', 'approved', 'student', TRUE
      ]
    )
    await conn.query(
      `INSERT INTO users (first_name, last_name, name, email, password, phone, phone_number, university, field_of_study, status, role, is_premium)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Zanele', 'Khumalo', 'Zanele Khumalo', 'zanele@email.com', passwordHash,
        '+27 83 456 7890', '+27834567890', 'Stellenbosch University',
        'Business & Finance', 'approved', 'student', TRUE
      ]
    )
    console.log('Seeded: demo student users (thabo@email.com / zanele@email.com)')
  }

  // Seed Demo Placements
  const [placementCount] = await conn.query('SELECT COUNT(*) AS total FROM placements')
  if (Number(placementCount[0].total) === 0) {
    await conn.query(`
      INSERT INTO placements (student_id, job_id, salary, employment_start)
      SELECT u.id, j.id, 320000.00, '2024-03-01'
      FROM users u, jobs j
      WHERE u.email = 'thabo@email.com' AND j.title = 'Junior Software Developer'
    `)
    await conn.query(`
      INSERT INTO placements (student_id, job_id, salary, employment_start)
      SELECT u.id, j.id, 380000.00, '2025-05-01'
      FROM users u, jobs j
      WHERE u.email = 'zanele@email.com' AND j.title = 'Graduate Financial Analyst'
    `)
    console.log('Seeded: demo placements')
  }

  console.log('\nUnified database setup complete!')
  await conn.end()
  process.exit(0)
}

setup().catch(err => {
  console.error('Setup failed:', err.message)
  console.error(`\nMake sure MySQL is running on port ${process.env.DB_PORT || 3307}`)
  process.exit(1)
})