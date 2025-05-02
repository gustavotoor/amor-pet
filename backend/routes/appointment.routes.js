/**
 * Rotas de Agendamento para o sistema Amor Pet
 * 
 * Este arquivo define as rotas relacionadas ao gerenciamento de agendamentos,
 * incluindo criação, listagem, cancelamento e verificação de disponibilidade.
 */

const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/appointment.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Todas as rotas de agendamentos requerem autenticação
router.use(verifyToken);

// Rota para criar um novo agendamento
router.post('/', AppointmentController.create);

// Rota para listar agendamentos do usuário
router.get('/', AppointmentController.listByUser);

// Rota para buscar um agendamento específico
router.get('/:id', AppointmentController.getById);

// Rota para cancelar um agendamento
router.put('/:id/cancel', AppointmentController.cancel);

// Rota para verificar horários disponíveis
router.get('/available-slots', AppointmentController.getAvailableSlots);

module.exports = router;
