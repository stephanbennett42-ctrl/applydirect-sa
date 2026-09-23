CREATE DATABASE IF NOT EXISTS sa_tertiary_db;
USE sa_tertiary_db;

-- 1. Safely Drop All Existing Tables
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS student_subjects;
DROP TABLE IF EXISTS student_profiles;
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS application_reminders;
DROP TABLE IF EXISTS institution_reminders;
DROP TABLE IF EXISTS placements;
DROP TABLE IF EXISTS job_applications;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS packages;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS institutions;
SET FOREIGN_KEY_CHECKS = 1;

-- 2. Create Institutions Table
CREATE TABLE institutions (
  institution_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  institution_type VARCHAR(50),
  province VARCHAR(100),
  application_status VARCHAR(50) DEFAULT 'Closed',
  application_fee DECIMAL(10,2) DEFAULT 0.00,
  opening_date DATE,
  closing_date DATE,
  website_url VARCHAR(255),
  application_url VARCHAR(255),
  faculties TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Users Table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(30),
  university VARCHAR(255),
  field_of_study VARCHAR(150),
  channel ENUM('sms', 'whatsapp', 'both') DEFAULT 'whatsapp',
  is_premium BOOLEAN DEFAULT FALSE,
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  role ENUM('student','admin') DEFAULT 'student',
  registered_date DATE DEFAULT (CURRENT_DATE),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Create Profile & Messaging Tables
CREATE TABLE student_profiles (
  profile_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
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
);

CREATE TABLE student_subjects (
  subject_id INT AUTO_INCREMENT PRIMARY KEY,
  profile_id INT NOT NULL,
  subject_name VARCHAR(100),
  mark DECIMAL(5,2),
  grade VARCHAR(10),
  FOREIGN KEY (profile_id) REFERENCES student_profiles(profile_id) ON DELETE CASCADE
);

CREATE TABLE contact_messages (
  message_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  full_name VARCHAR(100),
  email VARCHAR(255),
  subject VARCHAR(200),
  message TEXT,
  status ENUM('unread','read','replied','closed') DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 5. Create Reminder Tables
CREATE TABLE institution_reminders (
  reminder_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  institution_id INT NOT NULL,
  notify_on_open BOOLEAN DEFAULT TRUE,
  notify_on_close BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (institution_id) REFERENCES institutions(institution_id) ON DELETE CASCADE,
  UNIQUE(user_id, institution_id)
);

CREATE TABLE application_reminders (
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
);

-- 6. Create Subscription & Payment Tables
CREATE TABLE packages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  max_universities INT DEFAULT 1,
  features JSON,
  highlighted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
);

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
);

-- 7. Create Jobs & Placements Tables
CREATE TABLE jobs (
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
);

CREATE TABLE placements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  job_id INT NOT NULL,
  salary DECIMAL(12,2) NOT NULL,
  employment_start DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

CREATE TABLE job_applications (
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
);

-- 8. Insert Complete Institution Records
INSERT INTO institutions 
  (name, institution_type, province, application_status, application_fee, opening_date, closing_date, website_url, application_url, faculties)
VALUES 
  -- WESTERN CAPE
  ('University of Cape Town (UCT)', 'University', 'Western Cape', 'Open', 100.00, '2026-04-01', '2026-07-31', 'https://www.uct.ac.za', 'https://applyonline.uct.ac.za/', NULL),
  ('Stellenbosch University (SU)', 'University', 'Western Cape', 'Closed', 100.00, '2026-04-01', '2026-07-31', 'https://www.sun.ac.za', 'https://www.sun.ac.za/english/maties/apply', NULL),
  ('Cape Peninsula University of Technology (CPUT)', 'University', 'Western Cape', 'Closed', 150.00, '2026-05-14', '2026-09-30', 'https://www.cput.ac.za', 'https://www.cput.ac.za/study/apply', 'Applied Sciences, Business & Management Sciences, Education, Engineering, Health & Wellness Sciences, Informatics & Design'),
  ('University of the Western Cape (UWC)', 'University', 'Western Cape', 'Open', 0.00, '2026-04-01', '2026-09-30', 'https://www.uwc.ac.za', 'https://www.uwc.ac.za/study/apply', NULL),
  ('False Bay TVET College', 'TVET College', 'Western Cape', 'Open', 0.00, '2026-09-01', '2026-10-31', 'https://www.falsebaycollege.co.za', 'https://www.falsebaycollege.co.za/apply', NULL),
  ('Northlink TVET College', 'TVET College', 'Western Cape', 'Open', 0.00, '2026-01-15', '2026-10-31', 'https://www.northlink.co.za', 'https://www.northlink.co.za/apply/', NULL),
  ('Eduvos (Tyger Valley Campus)', 'Private College', 'Western Cape', 'Open', 0.00, '2026-01-01', '2026-11-30', 'https://www.eduvos.com', 'https://www.eduvos.com/', NULL),

  -- GAUTENG
  ('University of the Witwatersrand (Wits)', 'University', 'Gauteng', 'Open', 100.00, '2026-03-01', '2026-09-30', 'https://www.wits.ac.za', 'https://www.wits.ac.za/undergraduate/apply-to-wits/', NULL),
  ('University of Johannesburg (UJ)', 'University', 'Gauteng', 'Open', 0.00, '2026-04-01', '2026-10-31', 'https://www.uj.ac.za', 'https://www.uj.ac.za/admission-aid/undergraduate/', NULL),
  ('Tshwane University of Technology (TUT)', 'University', 'Gauteng', 'Open', 240.00, '2026-04-01', '2026-09-30', 'https://www.tut.ac.za', 'https://www.tut.ac.za/', NULL),
  ('University of Pretoria (UP)', 'University', 'Gauteng', 'Open', 300.00, '2026-04-01', '2026-09-30', 'https://www.up.ac.za', 'https://www.up.ac.za/online-application', NULL),
  ('University of South Africa (UNISA)', 'University', 'Gauteng', 'Open', 135.00, '2026-09-01', '2026-11-30', 'https://www.unisa.ac.za', 'https://www.unisa.ac.za/sites/corporate/default/Apply-for-admission', NULL),
  ('Sefako Makgatho Health Sciences University (SMU)', 'University', 'Gauteng', 'Open', 200.00, '2026-04-01', '2026-09-30', 'https://www.smu.ac.za', 'https://www.smu.ac.za/online-application/', NULL),
  ('Vaal University of Technology (VUT)', 'University', 'Gauteng', 'Open', 100.00, '2026-04-01', '2026-09-30', 'https://www.vut.ac.za', 'https://www.vut.ac.za/apply-to-vut/', NULL),
  ('IIE Varsity College (Sandton)', 'Private College', 'Gauteng', 'Open', 400.00, '2026-01-01', '2026-12-15', 'https://www.varsitycollege.co.za', 'https://www.varsitycollege.co.za/', NULL),
  ('MANCOSA (Johannesburg Campus)', 'Private College', 'Gauteng', 'Open', 0.00, '2026-01-01', '2026-11-30', 'https://www.mancosa.co.za', 'https://www.mancosa.co.za/apply-now/', NULL),
  ('Rosebank College', 'Private College', 'Gauteng', 'Open', 0.00, '2026-01-01', '2026-11-30', 'https://www.rosebankcollege.co.za', 'https://www.rosebankcollege.co.za/apply', NULL),

  -- KWAZULU-NATAL
  ('University of KwaZulu-Natal (UKZN)', 'University', 'KwaZulu-Natal', 'Open', 210.00, '2026-04-01', '2026-09-30', 'https://www.ukzn.ac.za', 'https://cao.ac.za/', NULL),
  ('Durban University of Technology (DUT)', 'University', 'KwaZulu-Natal', 'Open', 220.00, '2026-04-01', '2026-09-30', 'https://www.dut.ac.za', 'https://cao.ac.za/', NULL),
  ('University of Zululand (UNIZULU)', 'University', 'KwaZulu-Natal', 'Open', 250.00, '2026-04-01', '2026-09-30', 'https://www.unizulu.ac.za', 'https://cao.ac.za/', NULL),
  ('Mangosuthu University of Technology (MUT)', 'University', 'KwaZulu-Natal', 'Open', 220.00, '2026-04-01', '2026-09-30', 'https://www.mut.ac.za', 'https://cao.ac.za/', NULL),

  -- EASTERN CAPE
  ('Nelson Mandela University (NMU)', 'University', 'Eastern Cape', 'Open', 0.00, '2026-04-01', '2026-09-30', 'https://www.mandela.ac.za', 'https://applyonline.mandela.ac.za/', NULL),
  ('Rhodes University (RU)', 'University', 'Eastern Cape', 'Open', 100.00, '2026-04-01', '2026-09-30', 'https://www.ru.ac.za', 'https://ross.ru.ac.za/', NULL),
  ('University of Fort Hare (UFH)', 'University', 'Eastern Cape', 'Open', 0.00, '2026-04-01', '2026-10-31', 'https://www.ufh.ac.za', 'https://www.ufh.ac.za/apply/', NULL),
  ('Walter Sisulu University (WSU)', 'University', 'Eastern Cape', 'Open', 0.00, '2026-04-01', '2026-09-30', 'https://www.wsu.ac.za', 'https://connect.wsu.ac.za/', NULL),

  -- FREE STATE
  ('University of the Free State (UFS)', 'University', 'Free State', 'Open', 0.00, '2026-04-01', '2026-09-30', 'https://www.ufs.ac.za', 'https://apply.ufs.ac.za/', NULL),
  ('Central University of Technology (CUT)', 'University', 'Free State', 'Open', 0.00, '2026-04-01', '2026-09-30', 'https://www.cut.ac.za', 'https://www.cut.ac.za/application-process', NULL),

  -- NORTH WEST
  ('North-West University (NWU)', 'University', 'North West', 'Open', 0.00, '2026-04-01', '2026-09-30', 'https://www.nwu.ac.za', 'https://studies.nwu.ac.za/', NULL),
  ('Orbit TVET College', 'TVET College', 'North West', 'Open', 0.00, '2026-09-01', '2026-10-31', 'https://www.orbitcollege.co.za', 'https://www.orbitcollege.co.za/apply/', NULL),

  -- LIMPOPO
  ('University of Limpopo (UL)', 'University', 'Limpopo', 'Open', 200.00, '2026-04-01', '2026-09-30', 'https://www.ul.ac.za', 'https://www.ul.ac.za/', NULL),
  ('University of Venda (UNIVEN)', 'University', 'Limpopo', 'Open', 100.00, '2026-04-01', '2026-09-30', 'https://www.univen.ac.za', 'https://www.univen.ac.za/apply/', NULL),

  -- MPUMALANGA
  ('University of Mpumalanga (UMP)', 'University', 'Mpumalanga', 'Open', 150.00, '2026-04-01', '2026-11-30', 'https://www.ump.ac.za', 'https://www.ump.ac.za/', NULL),
  ('Ehlanzeni TVET College', 'TVET College', 'Mpumalanga', 'Open', 0.00, '2026-09-01', '2026-10-31', 'https://www.ehlanzenicollege.co.za', 'https://www.ehlanzenicollege.co.za/apply/', NULL),

  -- NORTHERN CAPE
  ('Sol Plaatje University (SPU)', 'University', 'Northern Cape', 'Open', 100.00, '2026-04-01', '2026-11-30', 'https://www.spu.ac.za', 'https://www.spu.ac.za/index.php/how-to-apply/', NULL),
  ('Northern Cape Urban TVET College', 'TVET College', 'Northern Cape', 'Open', 0.00, '2026-09-01', '2026-10-31', 'https://www.ncucollege.edu.za', 'https://www.ncucollege.edu.za/apply/', NULL);