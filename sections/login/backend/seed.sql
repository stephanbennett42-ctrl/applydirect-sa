-- ============================================
-- UniApply Login — Demo seed data
-- Inserts demo users so the login page works out of the box.
-- Only used if the users table is empty in the uniapply database.
-- ============================================

USE uniapply;

INSERT INTO users (first_name, last_name, email, password, phone, university, status, role)
SELECT * FROM (SELECT 'Thabo', 'Mokoena', 'thabo@email.com', '$2a$10$dummyhashplaceholder', '+27 82 123 4567', 'University of Cape Town (UCT)', 'approved', 'student') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'thabo@email.com');

-- Note: the '$2a$10$dummyhashplaceholder' values above are placeholders.
-- For correct passwords, run `npm run db:setup` instead of this file.
-- It hashes the passwords with bcrypt:  thabo/zanele -> password123, admin -> admin123.