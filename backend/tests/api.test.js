/**
 * Testes automatizados para o sistema Amor Pet
 * 
 * Este arquivo contém testes para verificar o funcionamento correto
 * das principais funcionalidades do sistema.
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../server');
const { User, Pet, Service, Appointment, Plan, PlanPurchased, Payment } = require('../models');
const pixPaymentService = require('../services/pix-payment.service');
const { sendEmail } = require('../utils/email.util');

// Configurar chai
chai.use(chaiHttp);

// Dados de teste
const testUser = {
  name: 'Usuário Teste',
  email: 'teste@exemplo.com',
  password: 'senha123',
  phone: '11987654321',
  role: 'tutor'
};

const testAdmin = {
  name: 'Admin Teste',
  email: 'admin@amorpet.com.br',
  password: 'admin123',
  phone: '11912345678',
  role: 'admin'
};

const testPet = {
  name: 'Rex',
  species: 'Cachorro',
  breed: 'Labrador',
  age: 3,
  weight: 25.5,
  observations: 'Dócil e brincalhão'
};

// Token para autenticação
let userToken;
let adminToken;
let testUserId;
let testPetId;
let testAppointmentId;
let testPaymentId;

// Testes de autenticação
describe('Testes de Autenticação', () => {
  // Limpar dados de teste antes de começar
  before(async () => {
    try {
      // Limpar usuários de teste anteriores
      await User.destroy({ where: { email: testUser.email } });
      await User.destroy({ where: { email: testAdmin.email } });
      
      // Criar usuário administrador para testes
      await User.create(testAdmin);
    } catch (error) {
      console.error('Erro ao preparar ambiente de testes:', error);
    }
  });
  
  // Teste de registro de usuário
  it('Deve registrar um novo usuário', (done) => {
    chai.request(app)
      .post('/api/auth/register')
      .send(testUser)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.have.property('email', testUser.email);
        expect(res.body).to.have.property('token');
        testUserId = res.body.user.id;
        done();
      });
  });
  
  // Teste de login
  it('Deve fazer login com o usuário registrado', (done) => {
    chai.request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.have.property('email', testUser.email);
        expect(res.body).to.have.property('token');
        userToken = res.body.token;
        done();
      });
  });
  
  // Teste de login como administrador
  it('Deve fazer login como administrador', (done) => {
    chai.request(app)
      .post('/api/auth/login')
      .send({
        email: testAdmin.email,
        password: testAdmin.password
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.have.property('email', testAdmin.email);
        expect(res.body).to.have.property('token');
        adminToken = res.body.token;
        done();
      });
  });
  
  // Teste de acesso a rota protegida
  it('Deve acessar rota protegida com token válido', (done) => {
    chai.request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.have.property('email', testUser.email);
        done();
      });
  });
  
  // Teste de falha ao acessar rota protegida sem token
  it('Deve falhar ao acessar rota protegida sem token', (done) => {
    chai.request(app)
      .get('/api/auth/profile')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success', false);
        done();
      });
  });
});

// Testes de gerenciamento de pets
describe('Testes de Gerenciamento de Pets', () => {
  // Teste de criação de pet
  it('Deve criar um novo pet para o usuário', (done) => {
    chai.request(app)
      .post('/api/pets')
      .set('Authorization', `Bearer ${userToken}`)
      .send(testPet)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('pet');
        expect(res.body.pet).to.have.property('name', testPet.name);
        expect(res.body.pet).to.have.property('user_id', testUserId);
        testPetId = res.body.pet.id;
        done();
      });
  });
  
  // Teste de listagem de pets do usuário
  it('Deve listar os pets do usuário', (done) => {
    chai.request(app)
      .get('/api/pets')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('pets');
        expect(res.body.pets).to.be.an('array');
        expect(res.body.pets).to.have.length.at.least(1);
        expect(res.body.pets[0]).to.have.property('name', testPet.name);
        done();
      });
  });
  
  // Teste de obtenção de detalhes de um pet
  it('Deve obter detalhes de um pet específico', (done) => {
    chai.request(app)
      .get(`/api/pets/${testPetId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('pet');
        expect(res.body.pet).to.have.property('id', testPetId);
        expect(res.body.pet).to.have.property('name', testPet.name);
        done();
      });
  });
  
  // Teste de atualização de pet
  it('Deve atualizar informações de um pet', (done) => {
    const updatedInfo = {
      name: 'Rex Atualizado',
      weight: 26.0,
      observations: 'Muito dócil e brincalhão'
    };
    
    chai.request(app)
      .put(`/api/pets/${testPetId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(updatedInfo)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('pet');
        expect(res.body.pet).to.have.property('name', updatedInfo.name);
        expect(res.body.pet).to.have.property('weight', updatedInfo.weight);
        expect(res.body.pet).to.have.property('observations', updatedInfo.observations);
        done();
      });
  });
});

// Testes de agendamentos
describe('Testes de Agendamentos', () => {
  let testServiceId;
  
  // Criar serviço de teste antes de começar
  before(async () => {
    try {
      // Limpar serviços de teste anteriores
      await Service.destroy({ where: { name: 'Banho Teste' } });
      
      // Criar serviço para testes
      const service = await Service.create({
        name: 'Banho Teste',
        description: 'Serviço de banho para testes',
        price: 50.00,
        duration: 60,
        active: true
      });
      
      testServiceId = service.id;
    } catch (error) {
      console.error('Erro ao preparar ambiente de testes:', error);
    }
  });
  
  // Teste de criação de agendamento
  it('Deve criar um novo agendamento', (done) => {
    // Data para agendamento (amanhã)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const appointmentDate = tomorrow.toISOString().split('T')[0];
    
    const appointmentData = {
      pet_id: testPetId,
      service_id: testServiceId,
      date: appointmentDate,
      time: '10:00',
      notes: 'Agendamento de teste'
    };
    
    chai.request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${userToken}`)
      .send(appointmentData)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('appointment');
        expect(res.body.appointment).to.have.property('pet_id', testPetId);
        expect(res.body.appointment).to.have.property('service_id', testServiceId);
        expect(res.body.appointment).to.have.property('date');
        expect(res.body.appointment).to.have.property('time', appointmentData.time);
        testAppointmentId = res.body.appointment.id;
        done();
      });
  });
  
  // Teste de listagem de agendamentos do usuário
  it('Deve listar os agendamentos do usuário', (done) => {
    chai.request(app)
      .get('/api/appointments')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('appointments');
        expect(res.body.appointments).to.be.an('array');
        expect(res.body.appointments).to.have.length.at.least(1);
        done();
      });
  });
  
  // Teste de obtenção de detalhes de um agendamento
  it('Deve obter detalhes de um agendamento específico', (done) => {
    chai.request(app)
      .get(`/api/appointments/${testAppointmentId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('appointment');
        expect(res.body.appointment).to.have.property('id', testAppointmentId);
        expect(res.body.appointment).to.have.property('pet_id', testPetId);
        expect(res.body.appointment).to.have.property('service_id', testServiceId);
        done();
      });
  });
});

// Testes de pagamentos
describe('Testes de Pagamentos', () => {
  // Teste de geração de pagamento Pix
  it('Deve gerar um QR Code Pix para pagamento de agendamento', (done) => {
    const paymentData = {
      amount: 50.00,
      description: 'Pagamento de banho - Teste',
      type: 'appointment',
      referenceId: testAppointmentId
    };
    
    chai.request(app)
      .post('/api/payments/pix/generate')
      .set('Authorization', `Bearer ${userToken}`)
      .send(paymentData)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('payment');
        expect(res.body.payment).to.have.property('amount', paymentData.amount);
        expect(res.body.payment).to.have.property('description', paymentData.description);
        expect(res.body.payment).to.have.property('pixCode');
        expect(res.body.payment).to.have.property('qrCodeUrl');
        testPaymentId = res.body.payment.id;
        done();
      });
  });
  
  // Teste de verificação de status de pagamento
  it('Deve verificar o status de um pagamento', (done) => {
    chai.request(app)
      .get(`/api/payments/${testPaymentId}/status`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('payment');
        expect(res.body.payment).to.have.property('id', testPaymentId);
        expect(res.body.payment).to.have.property('status');
        done();
      });
  });
  
  // Teste de simulação de pagamento
  it('Deve simular um pagamento com sucesso', (done) => {
    chai.request(app)
      .post(`/api/payments/${testPaymentId}/simulate`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('payment');
        expect(res.body.payment).to.have.property('id', testPaymentId);
        expect(res.body.payment).to.have.property('status', 'approved');
        done();
      });
  });
});

// Testes de área administrativa
describe('Testes de Área Administrativa', () => {
  // Teste de acesso à área administrativa como administrador
  it('Deve permitir acesso à área administrativa para administrador', (done) => {
    chai.request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success', true);
        done();
      });
  });
  
  // Teste de bloqueio de acesso à área administrativa para usuário comum
  it('Deve bloquear acesso à área administrativa para usuário comum', (done) => {
    chai.request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success', false);
        done();
      });
  });
  
  // Teste de listagem de todos os usuários (apenas admin)
  it('Deve listar todos os usuários para administrador', (done) => {
    chai.request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('users');
        expect(res.body.users).to.be.an('array');
        expect(res.body.users).to.have.length.at.least(2); // Admin e usuário de teste
        done();
      });
  });
  
  // Teste de listagem de todos os agendamentos (apenas admin)
  it('Deve listar todos os agendamentos para administrador', (done) => {
    chai.request(app)
      .get('/api/admin/appointments')
      .set('Authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('appointments');
        expect(res.body.appointments).to.be.an('array');
        expect(res.body.appointments).to.have.length.at.least(1);
        done();
      });
  });
});

// Testes de serviço de email
describe('Testes de Serviço de Email', () => {
  // Teste de envio de email
  it('Deve simular o envio de um email de teste', async () => {
    // Configurar modo de teste
    process.env.EMAIL_TEST_MODE = 'true';
    
    const result = await sendEmail(
      'teste@exemplo.com',
      'Email de Teste',
      'Este é um email de teste para verificar o funcionamento do serviço de email.'
    );
    
    expect(result).to.be.an('object');
    expect(result).to.have.property('success', true);
    expect(result).to.have.property('message', 'Email simulado com sucesso (modo de teste)');
  });
});

// Testes de serviço de pagamento Pix
describe('Testes de Serviço de Pagamento Pix', () => {
  // Teste de geração de código Pix
  it('Deve gerar um código Pix válido', () => {
    const pixCode = pixPaymentService.generatePixCode(
      50.00,
      'Teste de Pagamento',
      'teste_123'
    );
    
    expect(pixCode).to.be.a('string');
    expect(pixCode).to.include('BR.GOV.BCB.PIX');
  });
  
  // Teste de simulação de pagamento
  it('Deve simular um pagamento Pix com sucesso', async () => {
    // Garantir que o modo de teste está ativado
    pixPaymentService.testMode = true;
    
    const result = await pixPaymentService.simulatePayment('teste_123');
    
    expect(result).to.be.an('object');
    expect(result).to.have.property('success', true);
    expect(result).to.have.property('reference', 'teste_123');
    expect(result).to.have.property('status', 'approved');
  });
});

// Limpar dados de teste após todos os testes
after(async () => {
  try {
    // Limpar dados de teste
    await User.destroy({ where: { email: testUser.email } });
    await User.destroy({ where: { email: testAdmin.email } });
    await Pet.destroy({ where: { user_id: testUserId } });
    await Appointment.destroy({ where: { id: testAppointmentId } });
    await Payment.destroy({ where: { id: testPaymentId } });
    await Service.destroy({ where: { name: 'Banho Teste' } });
    
    console.log('Ambiente de testes limpo com sucesso.');
  } catch (error) {
    console.error('Erro ao limpar ambiente de testes:', error);
  }
});
