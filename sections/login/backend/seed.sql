-- ============================================
-- UniApply Login — Demo seed data
-- Inserts demo users so the login page works out of the box.
-- Only used if the users table is empty in the uniapply database.
-- ============================================

USE uniapply;

-- This file is kept for reference only.
-- The real setup script creates valid bcrypt hashes and should be used instead:
--   npm run db:setup
--
-- The setup script seeds these demo accounts:
--   thabo@email.com / password123
--   zanele@email.com / password123
--   admin@uniapply.co.za / admin123

-- Example insert pattern if you ever want to seed manually:
-- INSERT INTO users (first_name, last_name, email, password, phone, university, status, role)
-- VALUES ('Thabo', 'Mokoena', 'thabo@email.com', '$2a$10$REPLACE_WITH_REAL_BCRYPT_HASH', '+27 82 123 4567', 'University of Cape Town (UCT)', 'approved', 'student');