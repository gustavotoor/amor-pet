/**
 * Controlador para gerenciar pagamentos via Pix no sistema Amor Pet
 * 
 * Este arquivo contém as funções de controlador para lidar com pagamentos via Pix,
 * incluindo geração de QR codes, verificação de status e processamento de webhooks.
 */

const pixPaymentService = require('../services/pix-payment.service');
const Payment = require('../models/payment.model');
const Appointment = require('../models/appointment.model');
const PlanPurchased = require('../models/plan-purchased.model');
const User = require('../models/user.model');
const Plan = require('../models/plan.model');
const { sendEmail } = require('../utils/email.util');

/**
 * Gera um QR Code Pix para pagamento
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 */
exports.generatePixPayment = async (req, res) => {
  try {
    const { amount, description, type, referenceId } = req.body;
    const userId = req.userId; // Obtido do middleware de autenticação
    
    // Validar dados de entrada
    if (!amount || amount <= 0 || !description || !type || !referenceId) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos. Verifique o valor, descrição, tipo e referência.'
      });
    }
    
    // Validar tipo de pagamento
    if (type !== 'appointment' && type !== 'plan') {
      return res.status(400).json({
        success: false,
        message: 'Tipo de pagamento inválido. Use "appointment" ou "plan".'
      });
    }
    
    // Verificar se o referenceId existe e pertence ao usuário
    if (type === 'appointment') {
      const appointment = await Appointment.findOne({
        where: { id: referenceId, user_id: userId }
      });
      
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Agendamento não encontrado ou não pertence ao usuário.'
        });
      }
    } else if (type === 'plan') {
      const plan = await Plan.findByPk(referenceId);
      
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: 'Plano não encontrado.'
        });
      }
    }
    
    // Gerar referência única para o pagamento
    const paymentReference = `${type}_${referenceId}_${Date.now()}`;
    
    // Gerar QR Code Pix
    const pixResult = await pixPaymentService.generateQrCode(
      amount,
      description,
      paymentReference
    );
    
    if (!pixResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao gerar QR Code Pix.',
        error: pixResult.error
      });
    }
    
    // Salvar informações do pagamento no banco de dados
    const payment = await Payment.create({
      user_id: userId,
      reference_type: type,
      reference_id: referenceId,
      payment_reference: paymentReference,
      amount: amount,
      description: description,
      pix_code: pixResult.pixCode,
      qr_code_url: pixResult.qrCodeUrl,
      status: 'pending',
      expires_at: pixResult.expiresAt
    });
    
    // Retornar informações do pagamento
    res.status(200).json({
      success: true,
      message: 'QR Code Pix gerado com sucesso.',
      payment: {
        id: payment.id,
        amount: payment.amount,
        description: payment.description,
        pixCode: payment.pix_code,
        qrCodeUrl: payment.qr_code_url,
        status: payment.status,
        expiresAt: payment.expires_at
      }
    });
  } catch (error) {
    console.error('Erro ao gerar pagamento Pix:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar a solicitação.',
      error: error.message
    });
  }
};

/**
 * Verifica o status de um pagamento Pix
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 */
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.userId; // Obtido do middleware de autenticação
    
    // Buscar pagamento no banco de dados
    const payment = await Payment.findOne({
      where: { id: paymentId, user_id: userId }
    });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Pagamento não encontrado ou não pertence ao usuário.'
      });
    }
    
    // Se o pagamento já foi aprovado, retornar status atual
    if (payment.status === 'approved') {
      return res.status(200).json({
        success: true,
        message: 'Pagamento já aprovado.',
        payment: {
          id: payment.id,
          amount: payment.amount,
          description: payment.description,
          status: payment.status,
          paidAt: payment.paid_at
        }
      });
    }
    
    // Verificar status do pagamento na API do Pix
    const statusResult = await pixPaymentService.checkPaymentStatus(payment.payment_reference);
    
    // Se o pagamento foi aprovado, atualizar no banco de dados
    if (statusResult.success && statusResult.status === 'approved') {
      payment.status = 'approved';
      payment.paid_at = new Date();
      await payment.save();
      
      // Processar o pagamento de acordo com o tipo
      await processApprovedPayment(payment);
      
      return res.status(200).json({
        success: true,
        message: 'Pagamento aprovado com sucesso.',
        payment: {
          id: payment.id,
          amount: payment.amount,
          description: payment.description,
          status: payment.status,
          paidAt: payment.paid_at
        }
      });
    }
    
    // Retornar status atual
    res.status(200).json({
      success: true,
      message: 'Status do pagamento verificado.',
      payment: {
        id: payment.id,
        amount: payment.amount,
        description: payment.description,
        status: payment.status || 'pending',
        expiresAt: payment.expires_at
      }
    });
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar a solicitação.',
      error: error.message
    });
  }
};

/**
 * Simula um pagamento Pix (apenas para modo de teste)
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 */
exports.simulatePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.userId; // Obtido do middleware de autenticação
    
    // Verificar se o modo de teste está ativado
    if (!pixPaymentService.testMode) {
      return res.status(403).json({
        success: false,
        message: 'Simulação de pagamento só está disponível no modo de teste.'
      });
    }
    
    // Buscar pagamento no banco de dados
    const payment = await Payment.findOne({
      where: { id: paymentId, user_id: userId }
    });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Pagamento não encontrado ou não pertence ao usuário.'
      });
    }
    
    // Se o pagamento já foi aprovado, retornar erro
    if (payment.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Este pagamento já foi aprovado.'
      });
    }
    
    // Simular pagamento
    const simulationResult = await pixPaymentService.simulatePayment(payment.payment_reference);
    
    if (!simulationResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao simular pagamento.',
        error: simulationResult.error
      });
    }
    
    // Atualizar status do pagamento
    payment.status = 'approved';
    payment.paid_at = new Date();
    payment.transaction_id = simulationResult.transactionId;
    await payment.save();
    
    // Processar o pagamento de acordo com o tipo
    await processApprovedPayment(payment);
    
    // Retornar resultado
    res.status(200).json({
      success: true,
      message: 'Pagamento simulado com sucesso.',
      payment: {
        id: payment.id,
        amount: payment.amount,
        description: payment.description,
        status: payment.status,
        paidAt: payment.paid_at
      }
    });
  } catch (error) {
    console.error('Erro ao simular pagamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar a solicitação.',
      error: error.message
    });
  }
};

/**
 * Processa webhook de confirmação de pagamento Pix
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 */
exports.processWebhook = async (req, res) => {
  try {
    const payload = req.body;
    
    // Processar webhook
    const webhookResult = pixPaymentService.processWebhook(payload);
    
    if (!webhookResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Erro ao processar webhook.',
        error: webhookResult.error
      });
    }
    
    // Buscar pagamento no banco de dados
    const payment = await Payment.findOne({
      where: { payment_reference: webhookResult.reference }
    });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Pagamento não encontrado.'
      });
    }
    
    // Atualizar status do pagamento
    if (webhookResult.status === 'approved' && payment.status !== 'approved') {
      payment.status = 'approved';
      payment.paid_at = new Date();
      await payment.save();
      
      // Processar o pagamento de acordo com o tipo
      await processApprovedPayment(payment);
    }
    
    // Retornar confirmação
    res.status(200).json({
      success: true,
      message: 'Webhook processado com sucesso.'
    });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar a solicitação.',
      error: error.message
    });
  }
};

/**
 * Atualiza as configurações do Pix
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 */
exports.updatePixConfig = async (req, res) => {
  try {
    // Verificar se o usuário é administrador
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas administradores podem atualizar configurações do Pix.'
      });
    }
    
    const { pixKey, merchantName, merchantCity, testMode } = req.body;
    
    // Validar dados
    if (!pixKey || !merchantName || !merchantCity) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos. Verifique a chave Pix, nome do beneficiário e cidade.'
      });
    }
    
    // Atualizar configurações
    pixPaymentService.updateConfig({
      pixKey,
      merchantName,
      merchantCity,
      testMode: testMode !== undefined ? testMode : pixPaymentService.testMode
    });
    
    // Retornar confirmação
    res.status(200).json({
      success: true,
      message: 'Configurações do Pix atualizadas com sucesso.',
      config: {
        pixKey: pixPaymentService.pixKey,
        merchantName: pixPaymentService.merchantName,
        merchantCity: pixPaymentService.merchantCity,
        testMode: pixPaymentService.testMode
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar configurações do Pix:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar a solicitação.',
      error: error.message
    });
  }
};

/**
 * Função auxiliar para processar pagamentos aprovados
 * @param {Object} payment - Objeto de pagamento do banco de dados
 */
async function processApprovedPayment(payment) {
  try {
    // Buscar usuário
    const user = await User.findByPk(payment.user_id);
    
    if (!user) {
      console.error('Usuário não encontrado para o pagamento:', payment.id);
      return;
    }
    
    // Processar de acordo com o tipo de pagamento
    if (payment.reference_type === 'appointment') {
      // Atualizar status do agendamento
      const appointment = await Appointment.findByPk(payment.reference_id);
      
      if (appointment) {
        appointment.payment_status = 'paid';
        appointment.payment_id = payment.id;
        await appointment.save();
        
        // Enviar email de confirmação
        await sendEmail(
          user.email,
          'Confirmação de Agendamento - Amor Pet',
          `Olá ${user.name},\n\nSeu agendamento na Amor Pet foi confirmado e pago com sucesso!\n\nDetalhes do agendamento:\n- Data: ${appointment.date}\n- Horário: ${appointment.time}\n- Valor: R$ ${payment.amount.toFixed(2)}\n\nAgradecemos pela preferência!\n\nEquipe Amor Pet`
        );
      }
    } else if (payment.reference_type === 'plan') {
      // Buscar plano
      const plan = await Plan.findByPk(payment.reference_id);
      
      if (plan) {
        // Calcular data de validade (6 meses a partir de hoje)
        const validUntil = new Date();
        validUntil.setMonth(validUntil.getMonth() + 6);
        
        // Criar plano adquirido
        const planPurchased = await PlanPurchased.create({
          user_id: payment.user_id,
          plan_id: plan.id,
          payment_id: payment.id,
          services_total: plan.services_count,
          services_used: 0,
          valid_until: validUntil,
          status: 'active'
        });
        
        // Enviar email de confirmação
        await sendEmail(
          user.email,
          'Confirmação de Compra de Plano - Amor Pet',
          `Olá ${user.name},\n\nSua compra de plano na Amor Pet foi confirmada com sucesso!\n\nDetalhes do plano:\n- Plano: ${plan.name}\n- Serviços incluídos: ${plan.services_count}\n- Validade: ${validUntil.toLocaleDateString()}\n- Valor: R$ ${payment.amount.toFixed(2)}\n\nPara agendar um serviço utilizando seu plano, basta acessar nosso site ou entrar em contato conosco.\n\nAgradecemos pela preferência!\n\nEquipe Amor Pet`
        );
      }
    }
  } catch (error) {
    console.error('Erro ao processar pagamento aprovado:', error);
  }
}
