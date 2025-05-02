/**
 * Rotas de Planos para o sistema Amor Pet
 * 
 * Este arquivo define as rotas relacionadas ao gerenciamento de planos,
 * incluindo listagem, detalhes e aquisição.
 */

const express = require('express');
const router = express.Router();
const PlanController = require('../controllers/plan.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Rota pública para listar planos ativos
router.get('/active', PlanController.listActive);

// Rota pública para buscar um plano específico
router.get('/:id', PlanController.getById);

// Rotas que requerem autenticação
router.use(verifyToken);

// Rota para adquirir um plano
router.post('/purchase', PlanController.purchase);

// Rota para listar planos adquiridos pelo usuário
router.get('/purchased', PlanController.listPurchased);

// Rota para buscar um plano adquirido específico
router.get('/purchased/:id', PlanController.getPurchasedById);

module.exports = router;
