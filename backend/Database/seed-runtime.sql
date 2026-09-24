-- ApplyDirect-SA runtime seed data
-- Idempotent: wipes and re-seeds the runtime data the site needs
-- (plans, demo users, one paid premium order, graduate jobs).
USE sa_tertiary_db;

DELETE FROM job_applications;
DELETE FROM payments;
DELETE FROM orders;
DELETE FROM jobs;
DELETE FROM packages;
DELETE FROM users;

-- Subscription plans (Basic = free, Premium = priced => unlocks graduate jobs)
INSERT INTO packages (id, name, price, description, max_universities, features, highlighted) VALUES
(1, 'Basic', 0.00, 'Essential guidance to start your university journey with confidence. Track one institution at a time.', 1,
 '["Access to all university listings","Application status reminders","Email reminders","Career pathway guidance","Community support"]', 0),
(2, 'Premium', 500.00, 'Unlock the full ApplyDirect SA experience: graduate job access, fast-tracked applications and personal concierge support.', 5,
 '["Everything in Basic","Unlimited institution tracking","Graduate jobs access","Fast-track applications","Priority email support","Instant SMS & WhatsApp reminders"]', 1);

-- Demo users (passwords: password123 / password123 / admin123)
INSERT INTO users (first_name, last_name, email, password, phone, university, field_of_study, channel, is_premium, status, role) VALUES
('Thabo', 'Molefe', 'thabo@email.com', '$2b$10$lDyIfAbskW0VCoan1KTmf.jhf1I1qFtv6BY8XfROCaF1dKuK7HugK', '072 000 1234', 'University of Cape Town', 'Information Technology & Computer Science', 'whatsapp', 0, 'approved', 'student'),
('Zanele', 'Khumalo', 'zanele@email.com', '$2b$10$lDyIfAbskW0VCoan1KTmf.jhf1I1qFtv6BY8XfROCaF1dKuK7HugK', '083 111 2222', 'University of Pretoria', 'Business & Finance', 'whatsapp', 0, 'approved', 'student'),
('Admin', 'UniApply', 'admin@uniapply.co.za', '$2b$10$ChSFB4ktk3EMAaMVzW6Bt.gmItYf0fVqZ.uFrrRKDeMiSXe.P6wmO', NULL, NULL, NULL, 'whatsapp', 0, 'approved', 'admin');

-- Thabo holds a PAID Premium order (graduate jobs unlocked for the demo)
INSERT INTO orders (user_id, package_id, amount, status, payment_method)
SELECT id, 2, 500.00, 'paid', 'credit_card' FROM users WHERE email = 'thabo@email.com';
SET @thabo_order = LAST_INSERT_ID();
INSERT INTO payments (order_id, amount, method, status, transaction_ref, card_last_four)
VALUES (@thabo_order, 500.00, 'credit_card', 'success', 'SEED-100001', '4242');
UPDATE users SET is_premium = 1 WHERE email = 'thabo@email.com';

-- Graduate jobs (Premium-only section)
INSERT INTO jobs (title, company, location, field, type, salary, description, active) VALUES
('Junior Software Developer', 'Takealot', 'Cape Town', 'Information Technology & Computer Science', 'full-time', 'R 25,000 - R 35,000 pm', 'Join the engineering team building high-traffic e-commerce applications in React and Node. Grow your career with a dynamic SaaS platform serving students across South Africa.', 1),
('Graduate Data Analyst', 'Vodacom', 'Johannesburg', 'Information Technology & Computer Science', 'full-time', 'R 22,000 - R 30,000 pm', 'Analyse network and customer data to drive insights. Strong SQL and Excel skills required, Python is a bonus. Structured 12-month graduate programme.', 1),
('Accounting Graduate Programme', 'Deloitte', 'Durban', 'Business & Finance', 'full-time', 'R 20,000 - R 28,000 pm', 'Rotational audit and advisory programme for recent accounting graduates. SAICA-accredited training with mentorship from qualified chartered accountants.', 1),
('Marketing Intern', 'Naspers', 'Cape Town', 'Marketing & Communications', 'internship', 'R 12,000 pm', 'Hands-on digital marketing internship: content creation, social media and campaign analytics. Perfect for graduates wanting a career in media.', 1),
('Graduate Civil Engineer', 'Murray & Roberts', 'Pretoria', 'Engineering', 'full-time', 'R 30,000 - R 38,000 pm', 'Work on major infrastructure projects across South Africa. ECSA-accredited training office with a structured graduate development programme.', 1),
('HR Graduate Trainee', 'Standard Bank', 'Johannesburg', 'Business & Finance', 'full-time', 'R 18,000 - R 24,000 pm', 'Rotational exposure across recruitment, employee relations and learning & development within the people function of Africa\'s largest bank.', 1);