/**
 * Controlador de Planos para o sistema Amor Pet
 * 
 * Este arquivo contém os métodos para gerenciar planos de serviços,
 * incluindo listagem, detalhes e aquisição.
 */

const { Plan, Service, PlanPurchased, Payment, User } = require('../models');
const { Op } = require('sequelize');

// Controlador de Planos
const PlanController = {
  // Listar todos os planos ativos
  listActive: async (req, res) => {
    try {
      // Buscar planos ativos
      const plans = await Plan.findAll({
        where: { active: true },
        include: [
          { 
            model: Service, 
            as: 'services',
            through: { attributes: [] } // Não incluir atributos da tabela de junção
          }
        ],
        order: [['price', 'ASC']]
      });
      
      return res.status(200).json(plans);
    } catch (error) {
      console.error('Erro ao listar planos:', error);
      return res.status(500).json({ 
        message: 'Erro ao listar planos',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  // Buscar plano por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Buscar o plano
      const plan = await Plan.findOne({
        where: { 
          id,
          active: true
        },
        include: [
          { 
            model: Service, 
            as: 'services',
            through: { attributes: [] }
          }
        ]
      });
      
      if (!plan) {
        return res.status(404).json({ message: 'Plano não encontrado' });
      }
      
      return res.status(200).json(plan);
    } catch (error) {
      console.error('Erro ao buscar plano:', error);
      return res.status(500).json({ 
        message: 'Erro ao buscar plano',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  // Adquirir um plano
  purchase: async (req, res) => {
    try {
      const { plan_id } = req.body;
      const userId = req.user.id;
      
      // Verificar se o plano existe e está ativo
      const plan = await Plan.findOne({
        where: { 
          id: plan_id,
          active: true
        },
        include: [
          { 
            model: Service, 
            as: 'services',
            through: { attributes: [] }
          }
        ]
      });
      
      if (!plan) {
        return res.status(404).json({ message: 'Plano não encontrado ou inativo' });
      }
      
      // Verificar se o usuário existe
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      // Criar um pagamento pendente
      const payment = await Payment.create({
        user_id: userId,
        amount: plan.price,
        payment_method: 'pix',
        status: 'pending'
      });
      
      // Calcular data de expiração
      const purchaseDate = new Date();
      const expiryDate = new Date(purchaseDate);
      expiryDate.setDate(expiryDate.getDate() + plan.validity_days);
      
      // Contar o número total de serviços incluídos no plano
      const totalServices = plan.services.length;
      
      // Criar o plano adquirido
      const planPurchased = await PlanPurchased.create({
        user_id: userId,
        plan_id: plan.id,
        purchase_date: purchaseDate,
        expiry_date: expiryDate,
        total_services: totalServices,
        used_services: 0,
        payment_id: payment.id,
        status: 'active'
      });
      
      // Buscar o plano adquirido com dados relacionados
      const createdPlanPurchased = await PlanPurchased.findByPk(planPurchased.id, {
        include: [
          { model: Plan, as: 'plan' },
          { model: Payment, as: 'payment' }
        ]
      });
      
      return res.status(201).json({
        message: 'Plano adquirido com sucesso',
        plan_purchased: createdPlanPurchased
      });
    } catch (error) {
      console.error('Erro ao adquirir plano:', error);
      return res.status(500).json({ 
        message: 'Erro ao adquirir plano',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  // Listar planos adquiridos pelo usuário
  listPurchased: async (req, res) => {
    try {
      const userId = req.user.id;
      const { status } = req.query;
      
      // Construir filtros
      const where = { user_id: userId };
      
      if (status) {
        where.status = status;
      }
      
      // Buscar planos adquiridos
      const plansPurchased = await PlanPurchased.findAll({
        where,
        include: [
          { model: Plan, as: 'plan' },
          { model: Payment, as: 'payment' }
        ],
        order: [
          ['status', 'ASC'],
          ['expiry_date', 'ASC']
        ]
      });
      
      return res.status(200).json(plansPurchased);
    } catch (error) {
      console.error('Erro ao listar planos adquiridos:', error);
      return res.status(500).json({ 
        message: 'Erro ao listar planos adquiridos',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  // Buscar plano adquirido por ID
  getPurchasedById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      // Buscar o plano adquirido
      const planPurchased = await PlanPurchased.findOne({
        where: { 
          id,
          user_id: userId
        },
        include: [
          { model: Plan, as: 'plan' },
          { model: Payment, as: 'payment' }
        ]
      });
      
      if (!planPurchased) {
        return res.status(404).json({ message: 'Plano adquirido não encontrado' });
      }
      
      return res.status(200).json(planPurchased);
    } catch (error) {
      console.error('Erro ao buscar plano adquirido:', error);
      return res.status(500).json({ 
        message: 'Erro ao buscar plano adquirido',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = PlanController;
