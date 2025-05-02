# Modelo de Banco de Dados - Sistema Amor Pet

## Visão Geral

Este documento descreve a estrutura do banco de dados PostgreSQL para o sistema de agendamento do pet shop "Amor Pet". O modelo foi projetado para atender todas as funcionalidades solicitadas, incluindo cadastro de usuários e pets, agendamento de serviços, gerenciamento de planos e pagamentos.

## Diagrama de Entidade-Relacionamento

O banco de dados é composto pelas seguintes entidades principais e seus relacionamentos:

```
USERS (Tutores/Administradores)
  ↓ 1:N
PETS
  ↓ 1:N
APPOINTMENTS (Agendamentos)
  ↑ N:1
SERVICES (Serviços)

USERS
  ↓ 1:N
PLANS_PURCHASED (Planos Adquiridos)
  ↑ N:1
PLANS (Planos Disponíveis)

APPOINTMENTS
  ↓ 1:1
PAYMENTS (Pagamentos)
```

## Descrição Detalhada das Tabelas

### 1. users
Armazena informações dos usuários do sistema (tutores e administradores).

| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| id | SERIAL | PRIMARY KEY | Identificador único do usuário |
| name | VARCHAR(100) | NOT NULL | Nome completo do usuário |
| email | VARCHAR(100) | NOT NULL, UNIQUE | E-mail do usuário (usado para login) |
| password | VARCHAR(255) | NOT NULL | Senha criptografada |
| phone | VARCHAR(20) | | Número de telefone |
| role | VARCHAR(20) | NOT NULL, DEFAULT 'tutor' | Função do usuário: 'tutor' ou 'admin' |
| google_id | VARCHAR(100) | | ID do Google (para login via OAuth) |
| email_verified | BOOLEAN | DEFAULT false | Indica se o e-mail foi verificado |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação do registro |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data da última atualização |

**Comentários:**
- A coluna `password` armazena a senha criptografada usando bcrypt
- A coluna `role` diferencia tutores de administradores para controle de acesso
- `google_id` permite autenticação via Google OAuth
- `email_verified` controla se o usuário confirmou seu e-mail

### 2. pets
Armazena informações dos pets cadastrados pelos tutores.

| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| id | SERIAL | PRIMARY KEY | Identificador único do pet |
| user_id | INTEGER | NOT NULL, FOREIGN KEY | ID do tutor (dono do pet) |
| name | VARCHAR(100) | NOT NULL | Nome do pet |
| species | VARCHAR(50) | NOT NULL | Espécie (cão, gato, etc.) |
| breed | VARCHAR(100) | | Raça do pet |
| age | INTEGER | | Idade do pet |
| weight | DECIMAL(5,2) | | Peso do pet em kg |
| photo_url | VARCHAR(255) | | Caminho para a foto do pet |
| observations | TEXT | | Observações especiais sobre o pet |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação do registro |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data da última atualização |

**Comentários:**
- `user_id` estabelece relação com a tabela `users` (um tutor pode ter vários pets)
- `photo_url` armazena o caminho para a imagem do pet no sistema de arquivos
- `observations` permite registrar informações importantes como alergias ou comportamentos específicos

### 3. services
Armazena os tipos de serviços oferecidos pelo pet shop.

| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| id | SERIAL | PRIMARY KEY | Identificador único do serviço |
| name | VARCHAR(100) | NOT NULL | Nome do serviço (ex: "Banho", "Banho e Tosa") |
| description | TEXT | | Descrição detalhada do serviço |
| price | DECIMAL(10,2) | NOT NULL | Preço do serviço em reais |
| duration | INTEGER | NOT NULL | Duração estimada em minutos |
| active | BOOLEAN | NOT NULL, DEFAULT true | Indica se o serviço está ativo |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação do registro |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data da última atualização |

**Comentários:**
- A tabela permite configurar diferentes tipos de serviços com preços e durações específicas
- `active` permite desativar temporariamente um serviço sem removê-lo do banco de dados

### 4. plans
Armazena os planos de serviços disponíveis para compra.

| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| id | SERIAL | PRIMARY KEY | Identificador único do plano |
| name | VARCHAR(100) | NOT NULL | Nome do plano (ex: "Plano 4 Banhos") |
| description | TEXT | | Descrição detalhada do plano |
| service_id | INTEGER | NOT NULL, FOREIGN KEY | ID do serviço relacionado |
| quantity | INTEGER | NOT NULL | Quantidade de serviços incluídos |
| price | DECIMAL(10,2) | NOT NULL | Preço do plano em reais |
| validity_months | INTEGER | NOT NULL | Validade do plano em meses |
| active | BOOLEAN | NOT NULL, DEFAULT true | Indica se o plano está ativo |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação do registro |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data da última atualização |

**Comentários:**
- `service_id` estabelece relação com a tabela `services`
- `quantity` define quantos serviços estão incluídos no plano
- `validity_months` define por quantos meses o plano é válido após a compra
- `active` permite desativar temporariamente um plano sem removê-lo do banco de dados

### 5. plans_purchased
Armazena os planos adquiridos pelos tutores.

| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| id | SERIAL | PRIMARY KEY | Identificador único da compra |
| user_id | INTEGER | NOT NULL, FOREIGN KEY | ID do tutor que comprou o plano |
| plan_id | INTEGER | NOT NULL, FOREIGN KEY | ID do plano adquirido |
| services_remaining | INTEGER | NOT NULL | Quantidade de serviços restantes |
| expiration_date | DATE | NOT NULL | Data de expiração do plano |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'active' | Status: 'active', 'expired', 'used' |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação do registro |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data da última atualização |

**Comentários:**
- `user_id` estabelece relação com a tabela `users`
- `plan_id` estabelece relação com a tabela `plans`
- `services_remaining` é decrementado cada vez que um serviço do plano é utilizado
- `expiration_date` é calculada com base na data de compra + validade do plano
- `status` controla se o plano está ativo, expirado ou totalmente utilizado

### 6. schedule_settings
Armazena as configurações de horários disponíveis para agendamento.

| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| id | SERIAL | PRIMARY KEY | Identificador único da configuração |
| day_of_week | INTEGER | NOT NULL | Dia da semana (0-6, onde 0 = domingo) |
| start_time | TIME | NOT NULL | Horário de início dos atendimentos |
| end_time | TIME | NOT NULL | Horário de fim dos atendimentos |
| max_appointments | INTEGER | NOT NULL | Número máximo de agendamentos por hora |
| interval_minutes | INTEGER | NOT NULL | Intervalo entre agendamentos em minutos |
| active | BOOLEAN | NOT NULL, DEFAULT true | Indica se o dia está disponível |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação do registro |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data da última atualização |

**Comentários:**
- Permite configurar horários diferentes para cada dia da semana
- `max_appointments` controla quantos pets podem ser atendidos simultaneamente
- `interval_minutes` define o intervalo entre os horários disponíveis

### 7. blocked_dates
Armazena datas específicas bloqueadas para agendamento.

| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| id | SERIAL | PRIMARY KEY | Identificador único do bloqueio |
| date | DATE | NOT NULL | Data bloqueada |
| reason | VARCHAR(255) | | Motivo do bloqueio |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação do registro |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data da última atualização |

**Comentários:**
- Permite bloquear datas específicas (feriados, manutenção, etc.)
- `reason` armazena o motivo do bloqueio para referência administrativa

### 8. appointments
Armazena os agendamentos de serviços.

| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| id | SERIAL | PRIMARY KEY | Identificador único do agendamento |
| user_id | INTEGER | NOT NULL, FOREIGN KEY | ID do tutor |
| pet_id | INTEGER | NOT NULL, FOREIGN KEY | ID do pet |
| service_id | INTEGER | NOT NULL, FOREIGN KEY | ID do serviço |
| appointment_date | DATE | NOT NULL | Data do agendamento |
| appointment_time | TIME | NOT NULL | Horário do agendamento |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'pending' | Status: 'pending', 'confirmed', 'completed', 'cancelled' |
| plan_purchase_id | INTEGER | FOREIGN KEY | ID do plano utilizado (se aplicável) |
| observations | TEXT | | Observações sobre o agendamento |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação do registro |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data da última atualização |

**Comentários:**
- `user_id` estabelece relação com a tabela `users`
- `pet_id` estabelece relação com a tabela `pets`
- `service_id` estabelece relação com a tabela `services`
- `plan_purchase_id` é preenchido quando o agendamento utiliza um plano pré-pago
- `status` controla o estado atual do agendamento

### 9. payments
Armazena informações sobre pagamentos.

| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| id | SERIAL | PRIMARY KEY | Identificador único do pagamento |
| user_id | INTEGER | NOT NULL, FOREIGN KEY | ID do tutor que realizou o pagamento |
| appointment_id | INTEGER | FOREIGN KEY | ID do agendamento (se for pagamento individual) |
| plan_purchase_id | INTEGER | FOREIGN KEY | ID da compra de plano (se for pagamento de plano) |
| amount | DECIMAL(10,2) | NOT NULL | Valor do pagamento em reais |
| payment_method | VARCHAR(50) | NOT NULL, DEFAULT 'pix' | Método de pagamento |
| pix_code | TEXT | | Código do Pix gerado |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'pending' | Status: 'pending', 'confirmed', 'cancelled', 'refunded' |
| transaction_id | VARCHAR(100) | | ID da transação (fornecido pelo gateway de pagamento) |
| payment_date | TIMESTAMP | | Data e hora da confirmação do pagamento |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação do registro |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data da última atualização |

**Comentários:**
- `user_id` estabelece relação com a tabela `users`
- `appointment_id` ou `plan_purchase_id` são preenchidos dependendo do tipo de pagamento
- `pix_code` armazena o código Pix gerado para o pagamento
- `transaction_id` armazena o identificador da transação fornecido pelo gateway de pagamento
- `payment_date` é preenchido quando o pagamento é confirmado

## Índices e Otimizações

Para melhorar o desempenho do banco de dados, os seguintes índices são recomendados:

```sql
-- Índices para chaves estrangeiras
CREATE INDEX idx_pets_user_id ON pets(user_id);
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_pet_id ON appointments(pet_id);
CREATE INDEX idx_appointments_service_id ON appointments(service_id);
CREATE INDEX idx_plans_purchased_user_id ON plans_purchased(user_id);
CREATE INDEX idx_plans_purchased_plan_id ON plans_purchased(plan_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);

-- Índices para consultas frequentes
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_plans_purchased_status ON plans_purchased(status);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_users_email ON users(email);
```

## Relacionamentos e Integridade Referencial

O banco de dados utiliza chaves estrangeiras para garantir a integridade referencial entre as tabelas:

```sql
-- Relacionamentos da tabela pets
ALTER TABLE pets ADD CONSTRAINT fk_pets_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Relacionamentos da tabela plans_purchased
ALTER TABLE plans_purchased ADD CONSTRAINT fk_plans_purchased_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE plans_purchased ADD CONSTRAINT fk_plans_purchased_plan_id 
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE RESTRICT;

-- Relacionamentos da tabela appointments
ALTER TABLE appointments ADD CONSTRAINT fk_appointments_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE appointments ADD CONSTRAINT fk_appointments_pet_id 
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE RESTRICT;
ALTER TABLE appointments ADD CONSTRAINT fk_appointments_service_id 
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT;
ALTER TABLE appointments ADD CONSTRAINT fk_appointments_plan_purchase_id 
    FOREIGN KEY (plan_purchase_id) REFERENCES plans_purchased(id) ON DELETE SET NULL;

-- Relacionamentos da tabela payments
ALTER TABLE payments ADD CONSTRAINT fk_payments_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE payments ADD CONSTRAINT fk_payments_appointment_id 
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL;
ALTER TABLE payments ADD CONSTRAINT fk_payments_plan_purchase_id 
    FOREIGN KEY (plan_purchase_id) REFERENCES plans_purchased(id) ON DELETE SET NULL;
```

**Comentários sobre os relacionamentos:**
- `ON DELETE CASCADE` para relações pai-filho onde o filho não deve existir sem o pai
- `ON DELETE RESTRICT` para evitar exclusão de registros que estão sendo referenciados
- `ON DELETE SET NULL` para manter histórico mesmo quando o registro relacionado é excluído

## Considerações de Segurança

1. **Senhas**: Armazenadas com criptografia bcrypt
2. **Dados sensíveis**: Informações de pagamento são armazenadas com segurança
3. **Auditoria**: Todas as tabelas possuem campos de data de criação e atualização para auditoria

## Manutenção e Backup

Recomenda-se:
1. Backup diário do banco de dados
2. Verificação periódica de integridade
3. Limpeza de registros antigos ou não utilizados (especialmente pagamentos pendentes expirados)

## Próximos Passos

Após a implementação deste modelo de banco de dados, será necessário:
1. Criar scripts de migração para criar as tabelas
2. Implementar seeds para dados iniciais (serviços padrão, planos, etc.)
3. Desenvolver as APIs que interagirão com o banco de dados
