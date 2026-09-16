USE sa_tertiary_db;

-- 1. Ensure schema supports all fields
ALTER TABLE institutions MODIFY COLUMN institution_type VARCHAR(50);
ALTER TABLE institutions MODIFY COLUMN application_url VARCHAR(255);
ALTER TABLE institutions ADD COLUMN faculties TEXT;

-- 2. Drop dependent tables first, then clear institutions
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS application_reminders;
DROP TABLE IF EXISTS institution_reminders;
DROP TABLE IF EXISTS users;
TRUNCATE TABLE institutions;
SET FOREIGN_KEY_CHECKS = 1;


-- 4. Insert All 34 Institutions
INSERT INTO institutions 
  (name, institution_type, province, application_status, application_fee, opening_date, closing_date, website_url, application_url)
VALUES 
  -- WESTERN CAPE
  ('University of Cape Town (UCT)', 'University', 'Western Cape', 'Open', 100.00, '2026-04-01', '2026-07-31', 'https://www.uct.ac.za', 'https://applyonline.uct.ac.za/'),
  ('Stellenbosch University (SU)', 'University', 'Western Cape', 'Closed', 100.00, '2026-04-01', '2026-07-31', 'https://www.sun.ac.za', 'https://www.sun.ac.za/english/maties/apply'),
  ('Cape Peninsula University of Technology (CPUT)', 'University', 'Western Cape', 'Closed', 150.00, '2026-05-14', '2026-09-30', 'https://www.cput.ac.za', 'https://www.cput.ac.za/study/apply'),
  ('University of the Western Cape (UWC)', 'University', 'Western Cape', 'Open', 0.00, '2026-04-01', '2026-09-30', 'https://www.uwc.ac.za', 'https://www.uwc.ac.za/study/apply'),
  ('False Bay TVET College', 'TVET College', 'Western Cape', 'Open', 0.00, '2026-09-01', '2026-10-31', 'https://www.falsebaycollege.co.za', 'https://www.falsebaycollege.co.za/apply'),

  -- GAUTENG
  ('University of the Witwatersrand (Wits)', 'University', 'Gauteng', 'Open', 100.00, '2026-03-01', '2026-09-30', 'https://www.wits.ac.za', 'https://www.wits.ac.za/undergraduate/apply-to-wits/'),
  ('University of Johannesburg (UJ)', 'University', 'Gauteng', 'Open', 0.00, '2026-04-01', '2026-10-31', 'https://www.uj.ac.za', 'https://www.uj.ac.za/admission-aid/undergraduate/'),
  ('Tshwane University of Technology (TUT)', 'University', 'Gauteng', 'Open', 240.00, '2026-04-01', '2026-09-30', 'https://www.tut.ac.za', 'https://www.tut.ac.za/'),
  ('University of Pretoria (UP)', 'University', 'Gauteng', 'Open', 300.00, '2026-04-01', '2026-09-30', 'https://www.up.ac.za', 'https://www.up.ac.za/online-application'),
  ('University of South Africa (UNISA)', 'University', 'Gauteng', 'Open', 135.00, '2026-09-01', '2026-11-30', 'https://www.unisa.ac.za', 'https://www.unisa.ac.za/sites/corporate/default/Apply-for-admission'),
  ('Sefako Makgatho Health Sciences University (SMU)', 'University', 'Gauteng', 'Open', 200.00, '2026-04-01', '2026-09-30', 'https://www.smu.ac.za', 'https://www.smu.ac.za/online-application/'),
  ('Vaal University of Technology (VUT)', 'University', 'Gauteng', 'Open', 100.00, '2026-04-01', '2026-09-30', 'https://www.vut.ac.za', 'https://www.vut.ac.za/apply-to-vut/'),
  ('IIE Varsity College (Sandton)', 'Private College', 'Gauteng', 'Open', 400.00, '2026-01-01', '2026-12-15', 'https://www.varsitycollege.co.za', 'https://www.varsitycollege.co.za/'),

  -- KWAZULU-NATAL
  ('University of KwaZulu-Natal (UKZN)', 'University', 'KwaZulu-Natal', 'Open', 210.00, '2026-04-01', '2026-09-30', 'https://www.ukzn.ac.za', 'https://cao.ac.za/'),
  ('Durban University of Technology (DUT)', 'University', 'KwaZulu-Natal', 'Open', 220.00, '2026-04-01', '2026-09-30', 'https://www.dut.ac.za', 'https://cao.ac.za/'),
  ('University of Zululand (UNIZULU)', 'University', 'KwaZulu-Natal', 'Open', 250.00, '2026-04-01', '2026-09-30', 'https://www.unizulu.ac.za', 'https://cao.ac.za/'),
  ('Mangosuthu University of Technology (MUT)', 'University', 'KwaZulu-Natal', 'Open', 220.00, '2026-04-01', '2026-09-30', 'https://www.mut.ac.za', 'https://cao.ac.za/'),

  -- EASTERN CAPE
  ('Nelson Mandela University (NMU)', 'University', 'Eastern Cape', 'Open', 0.00, '2026-04-01', '2026-09-30', 'https://www.mandela.ac.za', 'https://applyonline.mandela.ac.za/'),
  ('Rhodes University (RU)', 'University', 'Eastern Cape', 'Open', 100.00, '2026-04-01', '2026-09-30', 'https://www.ru.ac.za', 'https://ross.ru.ac.za/'),
  ('University of Fort Hare (UFH)', 'University', 'Eastern Cape', 'Open', 0.00, '2026-04-01', '2026-10-31', 'https://www.ufh.ac.za', 'https://www.ufh.ac.za/apply/'),
  ('Walter Sisulu University (WSU)', 'University', 'Eastern Cape', 'Open', 0.00, '2026-04-01', '2026-09-30', 'https://www.wsu.ac.za', 'https://connect.wsu.ac.za/'),

  -- FREE STATE
  ('University of the Free State (UFS)', 'University', 'Free State', 'Open', 0.00, '2026-04-01', '2026-09-30', 'https://www.ufs.ac.za', 'https://apply.ufs.ac.za/'),
  ('Central University of Technology (CUT)', 'University', 'Free State', 'Open', 0.00, '2026-04-01', '2026-09-30', 'https://www.cut.ac.za', 'https://www.cut.ac.za/application-process'),

  -- NORTH WEST
  ('North-West University (NWU)', 'University', 'North West', 'Open', 0.00, '2026-04-01', '2026-09-30', 'https://www.nwu.ac.za', 'https://studies.nwu.ac.za/'),
  ('Orbit TVET College', 'TVET College', 'North West', 'Open', 0.00, '2026-09-01', '2026-10-31', 'https://www.orbitcollege.co.za', 'https://www.orbitcollege.co.za/apply/'),

  -- LIMPOPO
  ('University of Limpopo (UL)', 'University', 'Limpopo', 'Open', 200.00, '2026-04-01', '2026-09-30', 'https://www.ul.ac.za', 'https://www.ul.ac.za/'),
  ('University of Venda (UNIVEN)', 'University', 'Limpopo', 'Open', 100.00, '2026-04-01', '2026-09-30', 'https://www.univen.ac.za', 'https://www.univen.ac.za/apply/'),

  -- MPUMALANGA
  ('University of Mpumalanga (UMP)', 'University', 'Mpumalanga', 'Open', 150.00, '2026-04-01', '2026-11-30', 'https://www.ump.ac.za', 'https://www.ump.ac.za/'),
  ('Ehlanzeni TVET College', 'TVET College', 'Mpumalanga', 'Open', 0.00, '2026-09-01', '2026-10-31', 'https://www.ehlanzenicollege.co.za', 'https://www.ehlanzenicollege.co.za/apply/'),

  -- NORTHERN CAPE
  ('Sol Plaatje University (SPU)', 'University', 'Northern Cape', 'Open', 100.00, '2026-04-01', '2026-11-30', 'https://www.spu.ac.za', 'https://www.spu.ac.za/index.php/how-to-apply/'),
  ('Northern Cape Urban TVET College', 'TVET College', 'Northern Cape', 'Open', 0.00, '2026-09-01', '2026-10-31', 'https://www.ncucollege.edu.za', 'https://www.ncucollege.edu.za/apply/'),

  -- PRIVATE COLLEGES
  ('Eduvos (Tyger Valley Campus)', 'Private College', 'Western Cape', 'Open', 0.00, '2026-01-01', '2026-11-30', 'https://www.eduvos.com', 'https://www.eduvos.com/'),
  ('MANCOSA (Johannesburg Campus)', 'Private College', 'Gauteng', 'Open', 0.00, '2026-01-01', '2026-11-30', 'https://www.mancosa.co.za', 'https://www.mancosa.co.za/apply-now/'),
  ('Rosebank College', 'Private College', 'Gauteng', 'Open', 0.00, '2026-01-01', '2026-11-30', 'https://www.rosebankcollege.co.za', 'https://www.rosebankcollege.co.za/apply');

-- 5. Apply Faculty updates
SET SQL_SAFE_UPDATES = 0;

UPDATE institutions 
SET faculties = 'Applied Sciences, Business & Management Sciences, Education, Engineering, Health & Wellness Sciences, Informatics & Design'
WHERE name LIKE '%CPUT%' OR name LIKE '%Cape Peninsula%';

SET SQL_SAFE_UPDATES = 1;

-- 6. User & Reminder Tables Setup
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  channel ENUM('sms', 'whatsapp') DEFAULT 'whatsapp',
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE institution_reminders (
  reminder_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  institution_id INT NOT NULL,
  notify_on_open BOOLEAN DEFAULT TRUE,
  notify_on_close BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
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
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (institution_id) REFERENCES institutions(institution_id) ON DELETE CASCADE
);
