-- Schema do Banco de Dados - Sistema Amor Pet
-- Este arquivo contém os comandos SQL para criar todas as tabelas do sistema

-- Tabela de usuários (tutores e administradores)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'tutor',
    google_id VARCHAR(100),
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de pets
CREATE TABLE pets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(50) NOT NULL,
    breed VARCHAR(100),
    age INTEGER,
    weight DECIMAL(5,2),
    photo_url VARCHAR(255),
    observations TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pets_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de serviços
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration INTEGER NOT NULL, -- duração em minutos
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de planos
CREATE TABLE plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    service_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    validity_months INTEGER NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_plans_service_id FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT
);

-- Tabela de planos adquiridos
CREATE TABLE plans_purchased (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    plan_id INTEGER NOT NULL,
    services_remaining INTEGER NOT NULL,
    expiration_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_plans_purchased_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_plans_purchased_plan_id FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE RESTRICT
);

-- Tabela de configurações de horários
CREATE TABLE schedule_settings (
    id SERIAL PRIMARY KEY,
    day_of_week INTEGER NOT NULL, -- 0 = domingo, 1 = segunda, etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_appointments INTEGER NOT NULL,
    interval_minutes INTEGER NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de datas bloqueadas
CREATE TABLE blocked_dates (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de agendamentos
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    pet_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    plan_purchase_id INTEGER,
    observations TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appointments_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_appointments_pet_id FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE RESTRICT,
    CONSTRAINT fk_appointments_service_id FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT,
    CONSTRAINT fk_appointments_plan_purchase_id FOREIGN KEY (plan_purchase_id) REFERENCES plans_purchased(id) ON DELETE SET NULL
);

-- Tabela de pagamentos
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    appointment_id INTEGER,
    plan_purchase_id INTEGER,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'pix',
    pix_code TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    transaction_id VARCHAR(100),
    payment_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_payments_appointment_id FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
    CONSTRAINT fk_payments_plan_purchase_id FOREIGN KEY (plan_purchase_id) REFERENCES plans_purchased(id) ON DELETE SET NULL
);

-- Criação de índices para otimização de consultas
CREATE INDEX idx_pets_user_id ON pets(user_id);
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_pet_id ON appointments(pet_id);
CREATE INDEX idx_appointments_service_id ON appointments(service_id);
CREATE INDEX idx_plans_purchased_user_id ON plans_purchased(user_id);
CREATE INDEX idx_plans_purchased_plan_id ON plans_purchased(plan_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);

CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_plans_purchased_status ON plans_purchased(status);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_users_email ON users(email);

-- Comentário: Este schema cria todas as tabelas necessárias para o sistema Amor Pet,
-- incluindo relacionamentos, restrições e índices para otimização de consultas.
