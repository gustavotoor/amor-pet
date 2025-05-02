/**
 * Rotas de Administração para o sistema Amor Pet
 * 
 * Este arquivo define as rotas relacionadas à área administrativa,
 * incluindo dashboard, gerenciamento de usuários, agendamentos, serviços, planos e relatórios.
 */

const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/admin.middleware');

// Todas as rotas administrativas requerem autenticação e permissão de administrador
router.use(verifyToken, isAdmin);

// Dashboard
router.get('/dashboard/stats', AdminController.getDashboardStats);

// Gerenciamento de usuários
router.get('/users', AdminController.listUsers);
router.get('/users/:id', AdminController.getUserDetails);

// Gerenciamento de agendamentos
router.get('/appointments', AdminController.listAllAppointments);
router.put('/appointments/:id/status', AdminController.updateAppointmentStatus);

// Gerenciamento de serviços
router.get('/services', AdminController.listServices);
router.post('/services', AdminController.createService);
router.put('/services/:id', AdminController.updateService);
router.delete('/services/:id', AdminController.deleteService);

// Gerenciamento de planos
router.get('/plans', AdminController.listPlans);
router.post('/plans', AdminController.createPlan);
router.put('/plans/:id', AdminController.updatePlan);
router.delete('/plans/:id', AdminController.deletePlan);

// Relatórios
router.get('/reports/revenue', AdminController.getRevenueReport);
router.get('/reports/appointments', AdminController.getAppointmentsReport);

// Configurações do sistema
router.get('/settings', AdminController.getSystemSettings);
router.put('/settings', AdminController.updateSystemSettings);

module.exports = router;
