USE sa_tertiary_db;

-- 1. Modify schema column lengths and ensure application_url is present
ALTER TABLE institutions MODIFY COLUMN institution_type VARCHAR(50);
ALTER TABLE institutions MODIFY COLUMN application_url VARCHAR(255);

-- 2. Clear existing entries
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE institutions;
SET FOREIGN_KEY_CHECKS = 1;

-- 3. Insert All 34 Institutions across all 9 Provinces
INSERT INTO institutions 
  (name, institution_type, province, application_status, application_fee, opening_date, closing_date, website_url, application_url)
VALUES 
  -- WESTERN CAPE (5)
  ('University of Cape Town (UCT)', 'University', 'Western Cape', 'Open', 100.00, '2026-04-01', '2026-09-30', 'https://www.uct.ac.za', 'https://applyonline.uct.ac.za/'),
  ('Stellenbosch University (SU)', 'University', 'Western Cape', 'Closed', 100.00, '2026-04-01', '2026-07-31', 'https://www.sun.ac.za', 'https://www.sun.ac.za/english/maties/apply'),
  ('Cape Peninsula University of Technology (CPUT)', 'University', 'Western Cape', 'Closed', 150.00, '2026-05-01', '2026-08-31', 'https://www.cput.ac.za', 'https://www.cput.ac.za/study/apply'),
  ('University of the Western Cape (UWC)', 'University', 'Western Cape', 'Open', 0.00, '2026-04-01', '2026-09-30', 'https://www.uwc.ac.za', 'https://www.uwc.ac.za/study/apply'),
  ('False Bay TVET College', 'TVET College', 'Western Cape', 'Open', 0.00, '2026-01-15', '2026-10-31', 'https://www.falsebaycollege.co.za', 'https://www.falsebaycollege.co.za/apply'),

  -- GAUTENG (8)
  ('University of the Witwatersrand (Wits)', 'University', 'Gauteng', 'Open', 100.00, '2026-03-01', '2026-09-30', 'https://www.wits.ac.za', 'https://www.wits.ac.za/undergraduate/apply-to-wits/'),
  ('University of Johannesburg (UJ)', 'University', 'Gauteng', 'Open', 0.00, '2026-04-01', '2026-10-31', 'https://www.uj.ac.za', 'https://www.uj.ac.za/admission-aid/undergraduate/'),
  ('Tshwane University of Technology (TUT)', 'University', 'Gauteng', 'Open', 240.00, '2026-04-01', '2026-09-30', 'https://www.tut.ac.za', 'https://www.tut.ac.za/study-at-tut/apply'),
  ('University of Pretoria (UP)', 'University', 'Gauteng', 'Open', 300.00, '2026-04-01', '2026-09-30', 'https://www.up.ac.za', 'https://www.up.ac.za/online-application'),
  ('University of South Africa (UNISA)', 'University', 'Gauteng', 'Open', 135.00, '2026-09-01', '2026-11-30', 'https://www.unisa.ac.za', 'https://www.unisa.ac.za/sites/corporate/default/Apply-for-admission'),
  ('Sefako Makgatho Health Sciences University (SMU)', 'University', 'Gauteng', 'Open', 200.00, '2026-04-01', '2026-09-30', 'https://www.smu.ac.za', 'https://www.smu.ac.za/online-application/'),
  ('Vaal University of Technology (VUT)', 'University', 'Gauteng', 'Open', 100.00, '2026-04-01', '2026-09-30', 'https://www.vut.ac.za', 'https://www.vut.ac.za/apply-to-vut/'),
  ('IIE Varsity College (Sandton)', 'Private College', 'Gauteng', 'Open', 400.00, '2026-01-01', '2026-12-15', 'https://www.varsitycollege.co.za', 'https://www.varsitycollege.co.za/apply'),

  -- KWAZULU-NATAL (4)
  ('University of KwaZulu-Natal (UKZN)', 'University', 'KwaZulu-Natal', 'Open', 210.00, '2026-04-01', '2026-09-30', 'https://www.ukzn.ac.za', 'https://cao.ac.za/'),
  ('Durban University of Technology (DUT)', 'University', 'KwaZulu-Natal', 'Open', 220.00, '2026-04-01', '2026-09-30', 'https://www.dut.ac.za', 'https://cao.ac.za/'),
  ('University of Zululand (UNIZULU)', 'University', 'KwaZulu-Natal', 'Open', 250.00, '2026-04-01', '2026-09-30', 'https://www.unizulu.ac.za', 'https://cao.ac.za/'),
  ('Mangosuthu University of Technology (MUT)', 'University', 'KwaZulu-Natal', 'Open', 220.00, '2026-04-01', '2026-09-30', 'https://www.mut.ac.za', 'https://cao.ac.za/'),

  -- EASTERN CAPE (4)
  ('Nelson Mandela University (NMU)', 'University', 'Eastern Cape', 'Open', 0.00, '2026-04-01', '2026-09-30', 'https://www.mandela.ac.za', 'https://applyonline.mandela.ac.za/'),
  ('Rhodes University (RU)', 'University', 'Eastern Cape', 'Open', 100.00, '2026-04-01', '2026-09-30', 'https://www.ru.ac.za', 'https://ross.ru.ac.za/'),
  ('University of Fort Hare (UFH)', 'University', 'Eastern Cape', 'Open', 0.00, '2026-04-01', '2026-10-31', 'https://www.ufh.ac.za', 'https://www.ufh.ac.za/apply/'),
  ('Walter Sisulu University (WSU)', 'University', 'Eastern Cape', 'Open', 0.00, '2026-04-01', '2026-09-30', 'https://www.wsu.ac.za', 'https://connect.wsu.ac.za/'),

  -- FREE STATE (2)
  ('University of the Free State (UFS)', 'University', 'Free State', 'Open', 0.00, '2026-04-01', '2026-09-30', 'https://www.ufs.ac.za', 'https://apply.ufs.ac.za/'),
  ('Central University of Technology (CUT)', 'University', 'Free State', 'Open', 0.00, '2026-04-01', '2026-09-30', 'https://www.cut.ac.za', 'https://www.cut.ac.za/apply'),

  -- NORTH WEST (2)
  ('North-West University (NWU)', 'University', 'North West', 'Open', 0.00, '2026-04-01', '2026-09-30', 'https://www.nwu.ac.za', 'https://studies.nwu.ac.za/undergraduate-studies/apply'),
  ('Orbit TVET College', 'TVET College', 'North West', 'Open', 0.00, '2026-01-15', '2026-10-31', 'https://www.orbitcollege.co.za', 'https://www.orbitcollege.co.za/apply/'),

  -- LIMPOPO (2)
  ('University of Limpopo (UL)', 'University', 'Limpopo', 'Open', 200.00, '2026-04-01', '2026-09-30', 'https://www.ul.ac.za', 'https://www.ul.ac.za/index.php?entity=apply'),
  ('University of Venda (UNIVEN)', 'University', 'Limpopo', 'Open', 100.00, '2026-04-01', '2026-09-30', 'https://www.univen.ac.za', 'https://www.univen.ac.za/apply/'),

  -- MPUMALANGA (2)
  ('University of Mpumalanga (UMP)', 'University', 'Mpumalanga', 'Open', 150.00, '2026-04-01', '2026-11-30', 'https://www.ump.ac.za', 'https://www.ump.ac.za/apply-now'),
  ('Ehlanzeni TVET College', 'TVET College', 'Mpumalanga', 'Open', 0.00, '2026-01-15', '2026-10-31', 'https://www.ehlanzenicollege.co.za', 'https://www.ehlanzenicollege.co.za/apply/'),

  -- NORTHERN CAPE (2)
  ('Sol Plaatje University (SPU)', 'University', 'Northern Cape', 'Open', 100.00, '2026-04-01', '2026-11-30', 'https://www.spu.ac.za', 'https://www.spu.ac.za/index.php/how-to-apply/'),
  ('Northern Cape Urban TVET College', 'TVET College', 'Northern Cape', 'Open', 0.00, '2026-01-15', '2026-10-31', 'https://www.ncucollege.edu.za', 'https://www.ncucollege.edu.za/apply/'),

  -- PRIVATE COLLEGES (3)
  ('Eduvos (Tyger Valley Campus)', 'Private College', 'Western Cape', 'Open', 0.00, '2026-01-01', '2026-11-30', 'https://www.eduvos.com', 'https://www.eduvos.com/apply-now/'),
  ('MANCOSA (Johannesburg Campus)', 'Private College', 'Gauteng', 'Open', 0.00, '2026-01-01', '2026-11-30', 'https://www.mancosa.co.za', 'https://www.mancosa.co.za/apply-now/'),
  ('Rosebank College', 'Private College', 'Gauteng', 'Open', 0.00, '2026-01-01', '2026-11-30', 'https://www.rosebankcollege.co.za', 'https://www.rosebankcollege.co.za/apply');
  
  
  USE sa_tertiary_db;

-- 1. Temporarily disable Safe Update Mode
SET SQL_SAFE_UPDATES = 0;

-- 2. Update CPUT details
UPDATE institutions 
SET 
    opening_date = '2026-05-14',
    closing_date = '2026-09-30',
    application_url = 'https://www.cput.ac.za/study/apply',
    faculties = 'Applied Sciences, Business & Management Sciences, Education, Engineering, Health & Wellness Sciences, Informatics & Design'
WHERE name LIKE '%CPUT%' OR name LIKE '%Cape Peninsula%';

-- 3. Set baseline fallback dates for remaining schools
UPDATE institutions 
SET 
    opening_date = COALESCE(opening_date, '2026-04-01'),
    closing_date = COALESCE(closing_date, '2026-09-30')
WHERE opening_date IS NULL OR closing_date IS NULL;

-- 4. Re-enable Safe Update Mode
SET SQL_SAFE_UPDATES = 1;



SET SQL_SAFE_UPDATES = 0;

UPDATE institutions SET application_url = 'https://www.eduvos.com/' WHERE name LIKE '%Eduvos%';
UPDATE institutions SET application_url = 'https://www.tut.ac.za/' WHERE name LIKE '%Tshwane%';
UPDATE institutions SET application_url = 'https://www.varsitycollege.co.za/' WHERE name LIKE '%Varsity College%';
UPDATE institutions SET application_url = 'https://www.cut.ac.za/application-process' WHERE name LIKE '%Central University of Technology%';
UPDATE institutions SET application_url = 'https://studies.nwu.ac.za/' WHERE name LIKE '%North-West%';
UPDATE institutions SET application_url = 'https://www.ul.ac.za/' WHERE name LIKE '%Limpopo%';
UPDATE institutions SET application_url = 'https://www.ump.ac.za/' WHERE name LIKE '%Mpumalanga%';

SET SQL_SAFE_UPDATES = 1;


-- Disable Safe Updates temporarily for bulk execution
SET SQL_SAFE_UPDATES = 0;

-- 1. Western Cape Institutions
UPDATE institutions SET opening_date = '2026-04-01', closing_date = '2026-07-31' WHERE name LIKE '%Cape Town%' AND name NOT LIKE '%Technology%';
UPDATE institutions SET opening_date = '2026-04-01', closing_date = '2026-07-31' WHERE name LIKE '%Stellenbosch%';
UPDATE institutions SET opening_date = '2026-04-01', closing_date = '2026-09-30' WHERE name LIKE '%Western Cape%';
UPDATE institutions SET opening_date = '2026-05-11', closing_date = '2026-09-30' WHERE name LIKE '%Cape Peninsula%';

-- 2. Gauteng Institutions
UPDATE institutions SET opening_date = '2026-03-01', closing_date = '2026-09-30' WHERE name LIKE '%Witwatersrand%' OR name LIKE '%Wits%';
UPDATE institutions SET opening_date = '2026-04-01', closing_date = '2026-10-31' WHERE name LIKE '%Johannesburg%';
UPDATE institutions SET opening_date = '2026-04-01', closing_date = '2026-09-30' WHERE name LIKE '%Pretoria%';
UPDATE institutions SET opening_date = '2026-04-01', closing_date = '2026-09-30' WHERE name LIKE '%Tshwane%';
UPDATE institutions SET opening_date = '2026-04-01', closing_date = '2026-09-30' WHERE name LIKE '%Vaal%';

-- 3. KwaZulu-Natal Institutions
UPDATE institutions SET opening_date = '2026-04-01', closing_date = '2026-09-30' WHERE name LIKE '%KwaZulu-Natal%' OR name LIKE '%UKZN%';
UPDATE institutions SET opening_date = '2026-04-01', closing_date = '2026-09-30' WHERE name LIKE '%Durban University%';
UPDATE institutions SET opening_date = '2026-04-01', closing_date = '2026-09-30' WHERE name LIKE '%Zululand%';
UPDATE institutions SET opening_date = '2026-04-01', closing_date = '2026-09-30' WHERE name LIKE '%Mangosuthu%';

-- 4. Eastern Cape & Free State Institutions
UPDATE institutions SET opening_date = '2026-04-01', closing_date = '2026-09-30' WHERE name LIKE '%Rhodes%';
UPDATE institutions SET opening_date = '2026-04-01', closing_date = '2026-09-30' WHERE name LIKE '%Nelson Mandela%';
UPDATE institutions SET opening_date = '2026-04-01', closing_date = '2026-09-30' WHERE name LIKE '%Fort Hare%';
UPDATE institutions SET opening_date = '2026-04-01', closing_date = '2026-09-30' WHERE name LIKE '%Walter Sisulu%';
UPDATE institutions SET opening_date = '2026-04-01', closing_date = '2026-09-30' WHERE name LIKE '%Free State%';
UPDATE institutions SET opening_date = '2026-04-01', closing_date = '2026-09-30' WHERE name LIKE '%Central University of Technology%';

-- 5. Limpopo, Mpumalanga, North-West, Northern Cape & Distance Learning
UPDATE institutions SET opening_date = '2026-04-01', closing_date = '2026-09-30' WHERE name LIKE '%North-West%';
UPDATE institutions SET opening_date = '2026-04-01', closing_date = '2026-09-30' WHERE name LIKE '%Limpopo%';
UPDATE institutions SET opening_date = '2026-04-01', closing_date = '2026-09-30' WHERE name LIKE '%Venda%';
UPDATE institutions SET opening_date = '2026-04-01', closing_date = '2026-09-30' WHERE name LIKE '%Sol Plaatje%';
UPDATE institutions SET opening_date = '2026-04-01', closing_date = '2026-09-30' WHERE name LIKE '%Mpumalanga%';
UPDATE institutions SET opening_date = '2026-09-01', closing_date = '2026-11-30' WHERE name LIKE '%South Africa%' OR name LIKE '%UNISA%';

-- 6. TVET Colleges (General Standard Cycle)
UPDATE institutions SET opening_date = '2026-09-01', closing_date = '2026-10-31' WHERE institution_type = 'TVET College' OR name LIKE '%College%' OR name LIKE '%TVET%';

-- 7. Fallback for any remaining unassigned records
UPDATE institutions 
SET opening_date = '2026-04-01', closing_date = '2026-09-30' 
WHERE opening_date IS NULL;

-- Re-enable Safe Updates
SET SQL_SAFE_UPDATES = 1;