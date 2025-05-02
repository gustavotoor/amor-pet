-- Seeds para o Banco de Dados - Sistema Amor Pet
-- Este arquivo contém dados iniciais para popular o banco de dados

-- Inserção de usuário administrador padrão
-- Senha: admin123 (bcrypt hash)
INSERT INTO users (name, email, password, phone, role, email_verified) 
VALUES ('Administrador', 'admin@amorpet.com', '$2a$10$JI9Xfv7Yf4Hm3QN9/Qr4ZO5xRCO.iW5.KNRnpQ5crYrGy.FxO0Tla', '(11) 99999-9999', 'admin', true);

-- Inserção de usuário tutor de exemplo
-- Senha: tutor123 (bcrypt hash)
INSERT INTO users (name, email, password, phone, role, email_verified) 
VALUES ('João Silva', 'joao@exemplo.com', '$2a$10$JI9Xfv7Yf4Hm3QN9/Qr4ZO5xRCO.iW5.KNRnpQ5crYrGy.FxO0Tla', '(11) 98888-8888', 'tutor', true);

-- Inserção de pets de exemplo
INSERT INTO pets (user_id, name, species, breed, age, weight, observations) 
VALUES (2, 'Rex', 'Cão', 'Labrador', 3, 25.5, 'Não gosta de secador muito quente');

INSERT INTO pets (user_id, name, species, breed, age, weight, observations) 
VALUES (2, 'Luna', 'Gato', 'Siamês', 2, 4.2, 'Muito dócil, mas não gosta de água');

-- Inserção de serviços padrão
INSERT INTO services (name, description, price, duration, active) 
VALUES ('Banho', 'Banho completo com shampoo e condicionador especiais', 30.00, 60, true);

INSERT INTO services (name, description, price, duration, active) 
VALUES ('Banho e Tosa', 'Banho completo com tosa higiênica ou tosa da raça', 60.00, 120, true);

-- Inserção de planos padrão
INSERT INTO plans (name, description, service_id, quantity, price, validity_months, active) 
VALUES ('Plano 4 Banhos', 'Pacote com 4 banhos com desconto de 16%', 1, 4, 100.00, 3, true);

INSERT INTO plans (name, description, service_id, quantity, price, validity_months, active) 
VALUES ('Plano 2 Banhos e Tosa', 'Pacote com 2 banhos e tosa com desconto de 16%', 2, 2, 100.00, 2, true);

-- Configuração de horários padrão
-- Segunda a sexta, 8h às 18h
INSERT INTO schedule_settings (day_of_week, start_time, end_time, max_appointments, interval_minutes, active)
VALUES (1, '08:00', '18:00', 4, 30, true);

INSERT INTO schedule_settings (day_of_week, start_time, end_time, max_appointments, interval_minutes, active)
VALUES (2, '08:00', '18:00', 4, 30, true);

INSERT INTO schedule_settings (day_of_week, start_time, end_time, max_appointments, interval_minutes, active)
VALUES (3, '08:00', '18:00', 4, 30, true);

INSERT INTO schedule_settings (day_of_week, start_time, end_time, max_appointments, interval_minutes, active)
VALUES (4, '08:00', '18:00', 4, 30, true);

INSERT INTO schedule_settings (day_of_week, start_time, end_time, max_appointments, interval_minutes, active)
VALUES (5, '08:00', '18:00', 4, 30, true);

-- Sábado, 8h às 12h
INSERT INTO schedule_settings (day_of_week, start_time, end_time, max_appointments, interval_minutes, active)
VALUES (6, '08:00', '12:00', 4, 30, true);

-- Domingo fechado (não inserimos registro para domingo)

-- Exemplo de plano adquirido
INSERT INTO plans_purchased (user_id, plan_id, services_remaining, expiration_date, status)
VALUES (2, 1, 4, CURRENT_DATE + INTERVAL '3 months', 'active');

-- Exemplo de agendamento
INSERT INTO appointments (user_id, pet_id, service_id, appointment_date, appointment_time, status, plan_purchase_id)
VALUES (2, 1, 1, CURRENT_DATE + INTERVAL '2 days', '10:00', 'confirmed', 1);

-- Exemplo de pagamento para o plano adquirido
INSERT INTO payments (user_id, plan_purchase_id, amount, payment_method, status, payment_date)
VALUES (2, 1, 100.00, 'pix', 'confirmed', CURRENT_TIMESTAMP);

-- Comentário: Estes seeds fornecem dados iniciais para o sistema, incluindo:
-- 1. Um usuário administrador e um tutor de exemplo
-- 2. Dois pets associados ao tutor
-- 3. Serviços padrão (banho e banho/tosa)
-- 4. Planos de serviços com desconto
-- 5. Configuração de horários de funcionamento
-- 6. Exemplos de plano adquirido, agendamento e pagamento
--
-- Observação: As senhas estão com hash bcrypt e são:
-- - admin@amorpet.com: admin123
-- - joao@exemplo.com: tutor123
