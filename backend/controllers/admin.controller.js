/**
 * Controlador de Administração para o sistema Amor Pet
 * 
 * Este arquivo contém os métodos para gerenciar a área administrativa,
 * incluindo dashboard, relatórios e configurações do sistema.
 */

const { User, Pet, Appointment, Service, Plan, PlanPurchased, Payment } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

// Controlador de Administração
const AdminController = {
  // Dashboard administrativo com estatísticas gerais
  getDashboardStats: async (req, res) => {
    try {
      // Data atual
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Data de início do mês atual
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      // Data de início do mês anterior
      const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      
      // Data de fim do mês anterior
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      
      // Estatísticas de usuários
      const totalUsers = await User.count({
        where: { role: 'tutor' }
      });
      
      const newUsersThisMonth = await User.count({
        where: {
          role: 'tutor',
          created_at: {
            [Op.gte]: startOfMonth
          }
        }
      });
      
      // Estatísticas de pets
      const totalPets = await Pet.count();
      
      // Estatísticas de agendamentos
      const totalAppointments = await Appointment.count();
      
      const appointmentsToday = await Appointment.count({
        where: {
          appointment_date: today,
          status: {
            [Op.ne]: 'cancelled'
          }
        }
      });
      
      const appointmentsThisMonth = await Appointment.count({
        where: {
          appointment_date: {
            [Op.gte]: startOfMonth
          },
          status: {
            [Op.ne]: 'cancelled'
          }
        }
      });
      
      const appointmentsLastMonth = await Appointment.count({
        where: {
          appointment_date: {
            [Op.between]: [startOfLastMonth, endOfLastMonth]
          },
          status: {
            [Op.ne]: 'cancelled'
          }
        }
      });
      
      // Estatísticas de receita
      const revenueThisMonth = await Payment.sum('amount', {
        where: {
          status: 'completed',
          payment_date: {
            [Op.gte]: startOfMonth
          }
        }
      }) || 0;
      
      const revenueLastMonth = await Payment.sum('amount', {
        where: {
          status: 'completed',
          payment_date: {
            [Op.between]: [startOfLastMonth, endOfLastMonth]
          }
        }
      }) || 0;
      
      // Calcular variação percentual de receita
      const revenueChange = revenueLastMonth > 0 
        ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100 
        : 100;
      
      // Calcular variação percentual de agendamentos
      const appointmentsChange = appointmentsLastMonth > 0 
        ? ((appointmentsThisMonth - appointmentsLastMonth) / appointmentsLastMonth) * 100 
        : 100;
      
      // Agendamentos por serviço (para gráfico)
      const appointmentsByService = await Appointment.findAll({
        attributes: [
          'service_id',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        include: [
          {
            model: Service,
            as: 'service',
            attributes: ['name']
          }
        ],
        where: {
          status: {
            [Op.ne]: 'cancelled'
          }
        },
        group: ['service_id', 'service.id'],
        raw: true
      });
      
      // Próximos agendamentos
      const upcomingAppointments = await Appointment.findAll({
        where: {
          appointment_date: {
            [Op.gte]: today
          },
          status: {
            [Op.ne]: 'cancelled'
          }
        },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['name', 'email']
          },
          {
            model: Pet,
            as: 'pet',
            attributes: ['name', 'species', 'breed']
          },
          {
            model: Service,
            as: 'service',
            attributes: ['name', 'price']
          }
        ],
        order: [
          ['appointment_date', 'ASC'],
          ['appointment_time', 'ASC']
        ],
        limit: 5
      });
      
      // Retornar estatísticas
      return res.status(200).json({
        users: {
          total: totalUsers,
          new_this_month: newUsersThisMonth
        },
        pets: {
          total: totalPets
        },
        appointments: {
          total: totalAppointments,
          today: appointmentsToday,
          this_month: appointmentsThisMonth,
          last_month: appointmentsLastMonth,
          change_percentage: appointmentsChange
        },
        revenue: {
          this_month: revenueThisMonth,
          last_month: revenueLastMonth,
          change_percentage: revenueChange
        },
        charts: {
          appointments_by_service: appointmentsByService
        },
        upcoming_appointments: upcomingAppointments
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas do dashboard:', error);
      return res.status(500).json({ 
        message: 'Erro ao buscar estatísticas do dashboard',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  // Listar todos os usuários (tutores)
  listUsers: async (req, res) => {
    try {
      const { search, sort_by, sort_order, page = 1, limit = 10 } = req.query;
      
      // Construir filtros
      const where = { role: 'tutor' };
      
      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { phone: { [Op.iLike]: `%${search}%` } }
        ];
      }
      
      // Configurar ordenação
      let order = [['created_at', 'DESC']];
      
      if (sort_by && sort_order) {
        order = [[sort_by, sort_order]];
      }
      
      // Configurar paginação
      const offset = (page - 1) * limit;
      
      // Buscar usuários
      const { count, rows: users } = await User.findAndCountAll({
        where,
        attributes: { exclude: ['password'] },
        order,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      
      // Calcular total de páginas
      const totalPages = Math.ceil(count / limit);
      
      return res.status(200).json({
        users,
        pagination: {
          total: count,
          per_page: parseInt(limit),
          current_page: parseInt(page),
          total_pages: totalPages
        }
      });
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return res.status(500).json({ 
        message: 'Erro ao listar usuários',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  // Buscar detalhes de um usuário específico
  getUserDetails: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Buscar o usuário
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Pet,
            as: 'pets'
          },
          {
            model: Appointment,
            as: 'appointments',
            include: [
              { model: Service, as: 'service' },
              { model: Pet, as: 'pet' }
            ]
          },
          {
            model: PlanPurchased,
            as: 'plans_purchased',
            include: [
              { model: Plan, as: 'plan' },
              { model: Payment, as: 'payment' }
            ]
          },
          {
            model: Payment,
            as: 'payments'
          }
        ]
      });
      
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      return res.status(200).json(user);
    } catch (error) {
      console.error('Erro ao buscar detalhes do usuário:', error);
      return res.status(500).json({ 
        message: 'Erro ao buscar detalhes do usuário',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  // Gerenciar agendamentos (listar todos)
  listAllAppointments: async (req, res) => {
    try {
      const { status, date, pet_id, user_id, service_id, page = 1, limit = 10 } = req.query;
      
      // Construir filtros
      const where = {};
      
      if (status) {
        where.status = status;
      }
      
      if (date) {
        where.appointment_date = date;
      }
      
      if (pet_id) {
        where.pet_id = pet_id;
      }
      
      if (user_id) {
        where.user_id = user_id;
      }
      
      if (service_id) {
        where.service_id = service_id;
      }
      
      // Configurar paginação
      const offset = (page - 1) * limit;
      
      // Buscar agendamentos
      const { count, rows: appointments } = await Appointment.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone']
          },
          {
            model: Pet,
            as: 'pet',
            attributes: ['id', 'name', 'species', 'breed']
          },
          {
            model: Service,
            as: 'service'
          },
          {
            model: Payment,
            as: 'payment'
          }
        ],
        order: [
          ['appointment_date', 'DESC'],
          ['appointment_time', 'DESC']
        ],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      
      // Calcular total de páginas
      const totalPages = Math.ceil(count / limit);
      
      return res.status(200).json({
        appointments,
        pagination: {
          total: count,
          per_page: parseInt(limit),
          current_page: parseInt(page),
          total_pages: totalPages
        }
      });
    } catch (error) {
      console.error('Erro ao listar agendamentos:', error);
      return res.status(500).json({ 
        message: 'Erro ao listar agendamentos',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  // Atualizar status de um agendamento
  updateAppointmentStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      // Verificar se o status é válido
      const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Status inválido' });
      }
      
      // Buscar o agendamento
      const appointment = await Appointment.findByPk(id, {
        include: [
          { model: PlanPurchased, as: 'plan_purchased' },
          { model: Payment, as: 'payment' }
        ]
      });
      
      if (!appointment) {
        return res.status(404).json({ message: 'Agendamento não encontrado' });
      }
      
      // Atualizar o status
      await appointment.update({ status });
      
      // Se o status for 'cancelled', tratar cancelamento
      if (status === 'cancelled') {
        // Se o agendamento utilizou um plano, devolver o serviço ao plano
        if (appointment.plan_purchased_id) {
          const planPurchased = appointment.plan_purchased;
          await planPurchased.decrement('used_services');
          
          // Se o plano estava expirado por uso completo, reativar
          if (planPurchased.status === 'expired' && 
              planPurchased.used_services - 1 < planPurchased.total_services &&
              new Date(planPurchased.expiry_date) > new Date()) {
            await planPurchased.update({ status: 'active' });
          }
        } 
        // Se o agendamento tinha um pagamento concluído, marcar como reembolsado
        else if (appointment.payment_id && appointment.payment.status === 'completed') {
          await appointment.payment.update({ 
            status: 'refunded',
            payment_details: {
              ...appointment.payment.payment_details,
              refund_date: new Date(),
              refund_by: req.user.name,
              refund_reason: 'Agendamento cancelado pelo administrador'
            }
          });
          
          // Atualizar status de pagamento do agendamento
          await appointment.update({ payment_status: 'refunded' });
        }
      }
      
      // Se o status for 'completed', atualizar pagamento se necessário
      if (status === 'completed' && appointment.payment_id && appointment.payment.status === 'pending') {
        await appointment.payment.update({ status: 'completed' });
        await appointment.update({ payment_status: 'paid' });
      }
      
      // Buscar o agendamento atualizado com relações
      const updatedAppointment = await Appointment.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone']
          },
          {
            model: Pet,
            as: 'pet'
          },
          {
            model: Service,
            as: 'service'
          },
          {
            model: Payment,
            as: 'payment'
          },
          {
            model: PlanPurchased,
            as: 'plan_purchased',
            include: [{ model: Plan, as: 'plan' }]
          }
        ]
      });
      
      return res.status(200).json({
        message: `Status do agendamento atualizado para ${status}`,
        appointment: updatedAppointment
      });
    } catch (error) {
      console.error('Erro ao atualizar status do agendamento:', error);
      return res.status(500).json({ 
        message: 'Erro ao atualizar status do agendamento',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  // Gerenciar serviços (listar, criar, atualizar, excluir)
  listServices: async (req, res) => {
    try {
      const services = await Service.findAll({
        order: [['name', 'ASC']]
      });
      
      return res.status(200).json(services);
    } catch (error) {
      console.error('Erro ao listar serviços:', error);
      return res.status(500).json({ 
        message: 'Erro ao listar serviços',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  createService: async (req, res) => {
    try {
      const { name, description, price, duration, active } = req.body;
      
      // Validar dados
      if (!name || !price || !duration) {
        return res.status(400).json({ message: 'Nome, preço e duração são obrigatórios' });
      }
      
      // Criar o serviço
      const service = await Service.create({
        name,
        description,
        price,
        duration,
        active: active !== undefined ? active : true
      });
      
      return res.status(201).json({
        message: 'Serviço criado com sucesso',
        service
      });
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      return res.status(500).json({ 
        message: 'Erro ao criar serviço',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  updateService: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, price, duration, active } = req.body;
      
      // Buscar o serviço
      const service = await Service.findByPk(id);
      
      if (!service) {
        return res.status(404).json({ message: 'Serviço não encontrado' });
      }
      
      // Atualizar o serviço
      await service.update({
        name: name || service.name,
        description: description !== undefined ? description : service.description,
        price: price || service.price,
        duration: duration || service.duration,
        active: active !== undefined ? active : service.active
      });
      
      return res.status(200).json({
        message: 'Serviço atualizado com sucesso',
        service: await service.reload()
      });
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      return res.status(500).json({ 
        message: 'Erro ao atualizar serviço',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  deleteService: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Buscar o serviço
      const service = await Service.findByPk(id);
      
      if (!service) {
        return res.status(404).json({ message: 'Serviço não encontrado' });
      }
      
      // Verificar se o serviço está sendo usado em agendamentos
      const appointmentsCount = await Appointment.count({
        where: { service_id: id }
      });
      
      if (appointmentsCount > 0) {
        // Em vez de excluir, apenas desativar o serviço
        await service.update({ active: false });
        
        return res.status(200).json({
          message: 'Serviço desativado com sucesso (não pode ser excluído pois está sendo usado em agendamentos)',
          service: await service.reload()
        });
      }
      
      // Excluir o serviço
      await service.destroy();
      
      return res.status(200).json({
        message: 'Serviço excluído com sucesso'
      });
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      return res.status(500).json({ 
        message: 'Erro ao excluir serviço',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  // Gerenciar planos (listar, criar, atualizar, excluir)
  listPlans: async (req, res) => {
    try {
      const plans = await Plan.findAll({
        include: [
          { 
            model: Service, 
            as: 'services',
            through: { attributes: [] }
          }
        ],
        order: [['name', 'ASC']]
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
  
  createPlan: async (req, res) => {
    try {
      const { name, description, price, validity_days, active, service_ids } = req.body;
      
      // Validar dados
      if (!name || !price || !validity_days || !service_ids || !service_ids.length) {
        return res.status(400).json({ message: 'Nome, preço, validade e serviços são obrigatórios' });
      }
      
      // Criar o plano
      const plan = await Plan.create({
        name,
        description,
        price,
        validity_days,
        active: active !== undefined ? active : true
      });
      
      // Associar serviços ao plano
      if (service_ids && service_ids.length > 0) {
        await plan.setServices(service_ids);
      }
      
      // Buscar o plano com serviços associados
      const createdPlan = await Plan.findByPk(plan.id, {
        include: [
          { 
            model: Service, 
            as: 'services',
            through: { attributes: [] }
          }
        ]
      });
      
      return res.status(201).json({
        message: 'Plano criado com sucesso',
        plan: createdPlan
      });
    } catch (error) {
      console.error('Erro ao criar plano:', error);
      return res.status(500).json({ 
        message: 'Erro ao criar plano',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  updatePlan: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, price, validity_days, active, service_ids } = req.body;
      
      // Buscar o plano
      const plan = await Plan.findByPk(id);
      
      if (!plan) {
        return res.status(404).json({ message: 'Plano não encontrado' });
      }
      
      // Atualizar o plano
      await plan.update({
        name: name || plan.name,
        description: description !== undefined ? description : plan.description,
        price: price || plan.price,
        validity_days: validity_days || plan.validity_days,
        active: active !== undefined ? active : plan.active
      });
      
      // Atualizar serviços associados ao plano
      if (service_ids && service_ids.length > 0) {
        await plan.setServices(service_ids);
      }
      
      // Buscar o plano atualizado com serviços associados
      const updatedPlan = await Plan.findByPk(plan.id, {
        include: [
          { 
            model: Service, 
            as: 'services',
            through: { attributes: [] }
          }
        ]
      });
      
      return res.status(200).json({
        message: 'Plano atualizado com sucesso',
        plan: updatedPlan
      });
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);
      return res.status(500).json({ 
        message: 'Erro ao atualizar plano',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  deletePlan: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Buscar o plano
      const plan = await Plan.findByPk(id);
      
      if (!plan) {
        return res.status(404).json({ message: 'Plano não encontrado' });
      }
      
      // Verificar se o plano está sendo usado
      const planPurchasedCount = await PlanPurchased.count({
        where: { plan_id: id }
      });
      
      if (planPurchasedCount > 0) {
        // Em vez de excluir, apenas desativar o plano
        await plan.update({ active: false });
        
        return res.status(200).json({
          message: 'Plano desativado com sucesso (não pode ser excluído pois já foi adquirido por usuários)',
          plan: await plan.reload()
        });
      }
      
      // Remover associações com serviços
      await plan.setServices([]);
      
      // Excluir o plano
      await plan.destroy();
      
      return res.status(200).json({
        message: 'Plano excluído com sucesso'
      });
    } catch (error) {
      console.error('Erro ao excluir plano:', error);
      return res.status(500).json({ 
        message: 'Erro ao excluir plano',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  // Relatórios
  getRevenueReport: async (req, res) => {
    try {
      const { start_date, end_date, group_by = 'day' } = req.query;
      
      // Validar datas
      if (!start_date || !end_date) {
        return res.status(400).json({ message: 'Datas de início e fim são obrigatórias' });
      }
      
      // Definir formato de agrupamento
      let dateFormat;
      switch (group_by) {
        case 'day':
          dateFormat = 'YYYY-MM-DD';
          break;
        case 'week':
          dateFormat = 'YYYY-WW';
          break;
        case 'month':
          dateFormat = 'YYYY-MM';
          break;
        case 'year':
          dateFormat = 'YYYY';
          break;
        default:
          dateFormat = 'YYYY-MM-DD';
      }
      
      // Buscar pagamentos concluídos no período
      const payments = await Payment.findAll({
        attributes: [
          [sequelize.fn('date_trunc', group_by, sequelize.col('payment_date')), 'date'],
          [sequelize.fn('SUM', sequelize.col('amount')), 'total']
        ],
        where: {
          status: 'completed',
          payment_date: {
            [Op.between]: [start_date, end_date]
          }
        },
        group: [sequelize.fn('date_trunc', group_by, sequelize.col('payment_date'))],
        order: [sequelize.fn('date_trunc', group_by, sequelize.col('payment_date'))],
        raw: true
      });
      
      // Calcular total geral
      const totalRevenue = payments.reduce((sum, item) => sum + parseFloat(item.total), 0);
      
      return res.status(200).json({
        report: {
          start_date,
          end_date,
          group_by,
          data: payments,
          total_revenue: totalRevenue
        }
      });
    } catch (error) {
      console.error('Erro ao gerar relatório de receita:', error);
      return res.status(500).json({ 
        message: 'Erro ao gerar relatório de receita',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  getAppointmentsReport: async (req, res) => {
    try {
      const { start_date, end_date, group_by = 'day', service_id } = req.query;
      
      // Validar datas
      if (!start_date || !end_date) {
        return res.status(400).json({ message: 'Datas de início e fim são obrigatórias' });
      }
      
      // Definir formato de agrupamento
      let dateFormat;
      switch (group_by) {
        case 'day':
          dateFormat = 'YYYY-MM-DD';
          break;
        case 'week':
          dateFormat = 'YYYY-WW';
          break;
        case 'month':
          dateFormat = 'YYYY-MM';
          break;
        case 'year':
          dateFormat = 'YYYY';
          break;
        default:
          dateFormat = 'YYYY-MM-DD';
      }
      
      // Construir filtros
      const where = {
        appointment_date: {
          [Op.between]: [start_date, end_date]
        },
        status: {
          [Op.ne]: 'cancelled'
        }
      };
      
      if (service_id) {
        where.service_id = service_id;
      }
      
      // Buscar agendamentos no período
      const appointments = await Appointment.findAll({
        attributes: [
          [sequelize.fn('date_trunc', group_by, sequelize.col('appointment_date')), 'date'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where,
        group: [sequelize.fn('date_trunc', group_by, sequelize.col('appointment_date'))],
        order: [sequelize.fn('date_trunc', group_by, sequelize.col('appointment_date'))],
        raw: true
      });
      
      // Calcular total geral
      const totalAppointments = appointments.reduce((sum, item) => sum + parseInt(item.count), 0);
      
      // Buscar agendamentos por serviço
      const appointmentsByService = await Appointment.findAll({
        attributes: [
          'service_id',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        include: [
          {
            model: Service,
            as: 'service',
            attributes: ['name']
          }
        ],
        where: {
          appointment_date: {
            [Op.between]: [start_date, end_date]
          },
          status: {
            [Op.ne]: 'cancelled'
          }
        },
        group: ['service_id', 'service.id'],
        raw: true
      });
      
      return res.status(200).json({
        report: {
          start_date,
          end_date,
          group_by,
          data: appointments,
          total_appointments: totalAppointments,
          by_service: appointmentsByService
        }
      });
    } catch (error) {
      console.error('Erro ao gerar relatório de agendamentos:', error);
      return res.status(500).json({ 
        message: 'Erro ao gerar relatório de agendamentos',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  // Configurações do sistema
  getSystemSettings: async (req, res) => {
    try {
      // Em um sistema real, aqui seriam buscadas as configurações do banco de dados
      // Para este protótipo, retornaremos configurações padrão
      
      const settings = {
        business_hours: {
          monday: { open: '09:00', close: '18:00', is_open: true },
          tuesday: { open: '09:00', close: '18:00', is_open: true },
          wednesday: { open: '09:00', close: '18:00', is_open: true },
          thursday: { open: '09:00', close: '18:00', is_open: true },
          friday: { open: '09:00', close: '18:00', is_open: true },
          saturday: { open: '09:00', close: '13:00', is_open: true },
          sunday: { open: '00:00', close: '00:00', is_open: false }
        },
        appointment_settings: {
          interval_minutes: 30,
          max_daily_appointments: 20,
          cancellation_policy_hours: 24
        },
        notification_settings: {
          send_reminder_email: true,
          reminder_hours_before: 24,
          send_confirmation_email: true
        },
        payment_settings: {
          pix_key: 'amorpet@exemplo.com',
          pix_recipient_name: 'Amor Pet Serviços LTDA',
          pix_city: 'São Paulo'
        }
      };
      
      return res.status(200).json(settings);
    } catch (error) {
      console.error('Erro ao buscar configurações do sistema:', error);
      return res.status(500).json({ 
        message: 'Erro ao buscar configurações do sistema',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  updateSystemSettings: async (req, res) => {
    try {
      const { business_hours, appointment_settings, notification_settings, payment_settings } = req.body;
      
      // Em um sistema real, aqui seriam atualizadas as configurações no banco de dados
      // Para este protótipo, apenas validaremos os dados e retornaremos sucesso
      
      // Validar horários de funcionamento
      if (business_hours) {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        
        for (const day of days) {
          if (business_hours[day]) {
            const { open, close, is_open } = business_hours[day];
            
            if (is_open) {
              // Validar formato de hora (HH:MM)
              const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
              
              if (!timeRegex.test(open) || !timeRegex.test(close)) {
                return res.status(400).json({ message: `Formato de hora inválido para ${day}` });
              }
              
              // Validar que hora de abertura é anterior à de fechamento
              const openTime = new Date(`2000-01-01T${open}`);
              const closeTime = new Date(`2000-01-01T${close}`);
              
              if (openTime >= closeTime) {
                return res.status(400).json({ message: `Hora de abertura deve ser anterior à de fechamento para ${day}` });
              }
            }
          }
        }
      }
      
      // Validar configurações de agendamento
      if (appointment_settings) {
        const { interval_minutes, max_daily_appointments, cancellation_policy_hours } = appointment_settings;
        
        if (interval_minutes && (interval_minutes < 15 || interval_minutes > 120)) {
          return res.status(400).json({ message: 'Intervalo de agendamento deve estar entre 15 e 120 minutos' });
        }
        
        if (max_daily_appointments && (max_daily_appointments < 1 || max_daily_appointments > 100)) {
          return res.status(400).json({ message: 'Número máximo de agendamentos diários deve estar entre 1 e 100' });
        }
        
        if (cancellation_policy_hours && (cancellation_policy_hours < 0 || cancellation_policy_hours > 72)) {
          return res.status(400).json({ message: 'Política de cancelamento deve estar entre 0 e 72 horas' });
        }
      }
      
      return res.status(200).json({
        message: 'Configurações atualizadas com sucesso',
        settings: {
          business_hours: business_hours || {},
          appointment_settings: appointment_settings || {},
          notification_settings: notification_settings || {},
          payment_settings: payment_settings || {}
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar configurações do sistema:', error);
      return res.status(500).json({ 
        message: 'Erro ao atualizar configurações do sistema',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = AdminController;
