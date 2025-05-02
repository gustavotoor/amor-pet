/**
 * Controlador de Agendamentos para o sistema Amor Pet
 * 
 * Este arquivo contém os métodos para gerenciar agendamentos de serviços,
 * incluindo criação, listagem, atualização e cancelamento.
 */

const { Appointment, Service, Pet, User, PlanPurchased, Payment } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

// Controlador de Agendamentos
const AppointmentController = {
  // Criar novo agendamento
  create: async (req, res) => {
    try {
      const { pet_id, service_id, appointment_date, appointment_time, plan_purchased_id, observations } = req.body;
      const userId = req.user.id;
      
      // Verificar se o pet pertence ao usuário
      const pet = await Pet.findOne({ 
        where: { 
          id: pet_id,
          user_id: userId
        }
      });
      
      if (!pet) {
        return res.status(404).json({ message: 'Pet não encontrado ou não pertence ao usuário' });
      }
      
      // Verificar se o serviço existe e está ativo
      const service = await Service.findOne({
        where: {
          id: service_id,
          active: true
        }
      });
      
      if (!service) {
        return res.status(404).json({ message: 'Serviço não encontrado ou inativo' });
      }
      
      // Verificar disponibilidade do horário
      const isAvailable = await AppointmentController.checkAvailability(appointment_date, appointment_time, service.duration);
      
      if (!isAvailable) {
        return res.status(400).json({ message: 'Horário não disponível' });
      }
      
      // Preparar dados do agendamento
      const appointmentData = {
        user_id: userId,
        pet_id,
        service_id,
        appointment_date,
        appointment_time,
        observations,
        status: 'pending',
        payment_status: 'pending'
      };
      
      // Se um plano foi informado, verificar se é válido
      if (plan_purchased_id) {
        const planPurchased = await PlanPurchased.findOne({
          where: {
            id: plan_purchased_id,
            user_id: userId,
            status: 'active',
            used_services: {
              [Op.lt]: sequelize.col('total_services')
            },
            expiry_date: {
              [Op.gt]: new Date()
            }
          }
        });
        
        if (!planPurchased) {
          return res.status(400).json({ message: 'Plano inválido, expirado ou sem serviços disponíveis' });
        }
        
        // Verificar se o serviço está incluído no plano
        const plan = await planPurchased.getPlan({
          include: [{
            model: Service,
            as: 'services',
            where: { id: service_id }
          }]
        });
        
        if (!plan) {
          return res.status(400).json({ message: 'O serviço selecionado não está incluído neste plano' });
        }
        
        // Adicionar plano ao agendamento
        appointmentData.plan_purchased_id = plan_purchased_id;
        appointmentData.payment_status = 'paid';
        
        // Incrementar serviços utilizados no plano
        await planPurchased.increment('used_services');
        
        // Verificar se o plano foi totalmente utilizado
        if (planPurchased.used_services + 1 >= planPurchased.total_services) {
          await planPurchased.update({ status: 'expired' });
        }
      } else {
        // Se não for usado plano, criar um pagamento pendente
        const payment = await Payment.create({
          user_id: userId,
          amount: service.price,
          payment_method: 'pix',
          status: 'pending'
        });
        
        appointmentData.payment_id = payment.id;
      }
      
      // Criar o agendamento
      const appointment = await Appointment.create(appointmentData);
      
      // Buscar o agendamento com dados relacionados
      const createdAppointment = await Appointment.findByPk(appointment.id, {
        include: [
          { model: Pet, as: 'pet' },
          { model: Service, as: 'service' },
          { model: Payment, as: 'payment' }
        ]
      });
      
      return res.status(201).json({
        message: 'Agendamento criado com sucesso',
        appointment: createdAppointment
      });
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      return res.status(500).json({ 
        message: 'Erro ao criar agendamento',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  // Listar agendamentos do usuário
  listByUser: async (req, res) => {
    try {
      const userId = req.user.id;
      const { status, pet_id, start_date, end_date } = req.query;
      
      // Construir filtros
      const where = { user_id: userId };
      
      if (status) {
        where.status = status;
      }
      
      if (pet_id) {
        where.pet_id = pet_id;
      }
      
      if (start_date && end_date) {
        where.appointment_date = {
          [Op.between]: [start_date, end_date]
        };
      } else if (start_date) {
        where.appointment_date = {
          [Op.gte]: start_date
        };
      } else if (end_date) {
        where.appointment_date = {
          [Op.lte]: end_date
        };
      }
      
      // Buscar agendamentos
      const appointments = await Appointment.findAll({
        where,
        include: [
          { model: Pet, as: 'pet' },
          { model: Service, as: 'service' },
          { model: Payment, as: 'payment' }
        ],
        order: [
          ['appointment_date', 'ASC'],
          ['appointment_time', 'ASC']
        ]
      });
      
      return res.status(200).json(appointments);
    } catch (error) {
      console.error('Erro ao listar agendamentos:', error);
      return res.status(500).json({ 
        message: 'Erro ao listar agendamentos',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  // Buscar agendamento por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      // Buscar o agendamento
      const appointment = await Appointment.findOne({
        where: { 
          id,
          user_id: userId
        },
        include: [
          { model: Pet, as: 'pet' },
          { model: Service, as: 'service' },
          { model: Payment, as: 'payment' },
          { 
            model: PlanPurchased, 
            as: 'plan_purchased',
            include: [{ model: Plan, as: 'plan' }]
          }
        ]
      });
      
      if (!appointment) {
        return res.status(404).json({ message: 'Agendamento não encontrado' });
      }
      
      return res.status(200).json(appointment);
    } catch (error) {
      console.error('Erro ao buscar agendamento:', error);
      return res.status(500).json({ 
        message: 'Erro ao buscar agendamento',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  // Cancelar agendamento
  cancel: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      // Buscar o agendamento
      const appointment = await Appointment.findOne({
        where: { 
          id,
          user_id: userId
        },
        include: [
          { model: Payment, as: 'payment' },
          { model: PlanPurchased, as: 'plan_purchased' }
        ]
      });
      
      if (!appointment) {
        return res.status(404).json({ message: 'Agendamento não encontrado' });
      }
      
      // Verificar se o agendamento já foi cancelado
      if (appointment.status === 'cancelled') {
        return res.status(400).json({ message: 'Este agendamento já foi cancelado' });
      }
      
      // Verificar se o agendamento já foi concluído
      if (appointment.status === 'completed') {
        return res.status(400).json({ message: 'Não é possível cancelar um agendamento já concluído' });
      }
      
      // Verificar se o agendamento é para hoje ou amanhã (política de cancelamento)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const appointmentDate = new Date(appointment.appointment_date);
      appointmentDate.setHours(0, 0, 0, 0);
      
      if (appointmentDate <= tomorrow) {
        return res.status(400).json({ 
          message: 'Não é possível cancelar agendamentos para hoje ou amanhã. Entre em contato com o pet shop.'
        });
      }
      
      // Atualizar status do agendamento
      await appointment.update({ status: 'cancelled' });
      
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
      // Se o agendamento tinha um pagamento pendente ou concluído, marcar como reembolsado
      else if (appointment.payment_id) {
        const payment = appointment.payment;
        if (payment.status === 'completed' || payment.status === 'pending') {
          await payment.update({ status: 'refunded' });
        }
      }
      
      return res.status(200).json({ 
        message: 'Agendamento cancelado com sucesso',
        appointment: await appointment.reload()
      });
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      return res.status(500).json({ 
        message: 'Erro ao cancelar agendamento',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  // Verificar disponibilidade de horários
  checkAvailability: async (date, time, duration) => {
    try {
      // Converter duração para minutos
      const durationMinutes = duration || 60;
      
      // Calcular horário de término
      const [hours, minutes] = time.split(':').map(Number);
      const startTime = new Date();
      startTime.setHours(hours, minutes, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + durationMinutes);
      
      const endTimeStr = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}:00`;
      
      // Verificar se já existe agendamento neste horário
      const existingAppointment = await Appointment.findOne({
        where: {
          appointment_date: date,
          status: {
            [Op.notIn]: ['cancelled']
          },
          [Op.or]: [
            // Verifica se o novo agendamento começa durante um existente
            {
              appointment_time: {
                [Op.between]: [time, endTimeStr]
              }
            },
            // Verifica se o novo agendamento termina durante um existente
            sequelize.literal(`
              TIME(appointment_time) <= TIME('${time}') AND 
              ADDTIME(appointment_time, SEC_TO_TIME(duration * 60)) >= TIME('${time}')
            `)
          ]
        },
        include: [
          { 
            model: Service, 
            as: 'service',
            attributes: ['duration']
          }
        ]
      });
      
      return !existingAppointment;
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      return false;
    }
  },
  
  // Listar horários disponíveis para uma data
  getAvailableSlots: async (req, res) => {
    try {
      const { date, service_id } = req.query;
      
      if (!date) {
        return res.status(400).json({ message: 'Data é obrigatória' });
      }
      
      // Verificar se a data é futura
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        return res.status(400).json({ message: 'A data selecionada deve ser futura' });
      }
      
      // Obter duração do serviço
      let serviceDuration = 60; // Duração padrão em minutos
      
      if (service_id) {
        const service = await Service.findByPk(service_id);
        if (service) {
          serviceDuration = service.duration;
        }
      }
      
      // Obter configurações de horário de funcionamento
      // Em um sistema real, isso viria de uma tabela de configurações
      const businessHours = {
        start: '09:00',
        end: '18:00',
        interval: 30, // Intervalo entre agendamentos em minutos
        excludedDays: [0] // Domingo fechado (0 = Domingo, 6 = Sábado)
      };
      
      // Verificar se a data é um dia excluído
      const dayOfWeek = selectedDate.getDay();
      if (businessHours.excludedDays.includes(dayOfWeek)) {
        return res.status(400).json({ message: 'O pet shop não funciona neste dia' });
      }
      
      // Gerar todos os slots possíveis
      const slots = [];
      const [startHour, startMinute] = businessHours.start.split(':').map(Number);
      const [endHour, endMinute] = businessHours.end.split(':').map(Number);
      
      let currentTime = new Date();
      currentTime.setHours(startHour, startMinute, 0, 0);
      
      const endTime = new Date();
      endTime.setHours(endHour, endMinute, 0, 0);
      
      while (currentTime < endTime) {
        const timeStr = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}:00`;
        
        // Verificar disponibilidade
        const isAvailable = await AppointmentController.checkAvailability(date, timeStr, serviceDuration);
        
        if (isAvailable) {
          slots.push({
            time: timeStr.substring(0, 5),
            available: true
          });
        }
        
        // Avançar para o próximo slot
        currentTime.setMinutes(currentTime.getMinutes() + businessHours.interval);
      }
      
      return res.status(200).json(slots);
    } catch (error) {
      console.error('Erro ao listar horários disponíveis:', error);
      return res.status(500).json({ 
        message: 'Erro ao listar horários disponíveis',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = AppointmentController;
