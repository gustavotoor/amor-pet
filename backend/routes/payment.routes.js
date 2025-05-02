/**
 * Rotas de pagamento via Pix para o sistema Amor Pet
 * 
 * Este arquivo contém as rotas necessárias para o fluxo de pagamento via Pix,
 * incluindo geração de QR Code, verificação de status e processamento de webhooks.
 */

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { adminMiddleware } = require('../middlewares/admin.middleware');

/**
 * @route   POST /api/payments/pix/generate
 * @desc    Gerar QR Code Pix para pagamento
 * @access  Privado (requer autenticação)
 */
router.post('/pix/generate', authMiddleware, paymentController.generatePixPayment);

/**
 * @route   GET /api/payments/:paymentId/status
 * @desc    Verificar status de um pagamento
 * @access  Privado (requer autenticação)
 */
router.get('/:paymentId/status', authMiddleware, paymentController.checkPaymentStatus);

/**
 * @route   POST /api/payments/:paymentId/simulate
 * @desc    Simular pagamento (apenas para modo de teste)
 * @access  Privado (requer autenticação)
 */
router.post('/:paymentId/simulate', authMiddleware, paymentController.simulatePayment);

/**
 * @route   POST /api/payments/pix/webhook
 * @desc    Webhook para receber confirmações de pagamento
 * @access  Público
 */
router.post('/pix/webhook', paymentController.processWebhook);

/**
 * @route   PUT /api/payments/pix/config
 * @desc    Atualizar configurações do Pix
 * @access  Privado (requer autenticação de administrador)
 */
router.put('/pix/config', authMiddleware, adminMiddleware, paymentController.updatePixConfig);

module.exports = router;
