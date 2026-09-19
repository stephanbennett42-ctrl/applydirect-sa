-- ApplyDirect-SA — additional tables required by the profile and contact routes
-- Run against the same database as backend/.env (DB_NAME, default sa_tertiary_db).
-- Safe to run repeatedly: every statement uses CREATE TABLE IF NOT EXISTS.

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
);

CREATE TABLE IF NOT EXISTS student_subjects (
  subject_id INT AUTO_INCREMENT PRIMARY KEY,
  profile_id INT NOT NULL,
  subject_name VARCHAR(100),
  mark DECIMAL(5,2),
  grade VARCHAR(10),
  FOREIGN KEY (profile_id) REFERENCES student_profiles(profile_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS contact_messages (
  message_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  full_name VARCHAR(100),
  email VARCHAR(255),
  subject VARCHAR(200),
  message TEXT,
  status ENUM('unread','read','replied','closed') DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
