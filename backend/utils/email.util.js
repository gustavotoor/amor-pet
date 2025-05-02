/**
 * Utilitário para envio de emails no sistema Amor Pet
 * 
 * Este arquivo contém funções para envio de emails usando o serviço configurado
 * (SMTP, SendGrid, etc.) para notificações aos usuários.
 */

const nodemailer = require('nodemailer');

// Configurações padrão (devem ser substituídas pelas configurações do banco de dados)
let emailConfig = {
  service: process.env.EMAIL_SERVICE || 'smtp',
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true' || false,
  auth: {
    user: process.env.EMAIL_USER || 'contato@amorpet.com.br',
    pass: process.env.EMAIL_PASSWORD || 'senha_segura'
  },
  senderName: process.env.EMAIL_SENDER_NAME || 'Amor Pet',
  senderEmail: process.env.EMAIL_SENDER_EMAIL || 'contato@amorpet.com.br'
};

// Criar transportador de email
let transporter = nodemailer.createTransport({
  service: emailConfig.service === 'smtp' ? null : emailConfig.service,
  host: emailConfig.service === 'smtp' ? emailConfig.host : null,
  port: emailConfig.service === 'smtp' ? emailConfig.port : null,
  secure: emailConfig.service === 'smtp' ? emailConfig.secure : null,
  auth: {
    user: emailConfig.auth.user,
    pass: emailConfig.auth.pass
  }
});

/**
 * Atualiza as configurações de email
 * @param {Object} config - Novas configurações
 */
const updateEmailConfig = (config) => {
  emailConfig = { ...emailConfig, ...config };
  
  // Recriar transportador com novas configurações
  transporter = nodemailer.createTransport({
    service: emailConfig.service === 'smtp' ? null : emailConfig.service,
    host: emailConfig.service === 'smtp' ? emailConfig.host : null,
    port: emailConfig.service === 'smtp' ? emailConfig.port : null,
    secure: emailConfig.service === 'smtp' ? emailConfig.secure : null,
    auth: {
      user: emailConfig.auth.user,
      pass: emailConfig.auth.pass
    }
  });
};

/**
 * Envia um email
 * @param {string} to - Endereço de email do destinatário
 * @param {string} subject - Assunto do email
 * @param {string} text - Conteúdo do email em texto plano
 * @param {string} html - Conteúdo do email em HTML (opcional)
 * @returns {Promise<Object>} - Resultado do envio
 */
const sendEmail = async (to, subject, text, html = null) => {
  try {
    // Verificar se estamos em modo de teste
    if (process.env.NODE_ENV === 'test' || process.env.EMAIL_TEST_MODE === 'true') {
      console.log('Modo de teste: email não enviado');
      console.log({
        to,
        subject,
        text,
        html: html || 'Não fornecido'
      });
      
      return {
        success: true,
        message: 'Email simulado com sucesso (modo de teste)',
        info: { messageId: `test_${Date.now()}` }
      };
    }
    
    // Configurar email
    const mailOptions = {
      from: `"${emailConfig.senderName}" <${emailConfig.senderEmail}>`,
      to,
      subject,
      text
    };
    
    // Adicionar HTML se fornecido
    if (html) {
      mailOptions.html = html;
    }
    
    // Enviar email
    const info = await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      message: 'Email enviado com sucesso',
      info
    };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    
    return {
      success: false,
      message: 'Erro ao enviar email',
      error: error.message
    };
  }
};

/**
 * Envia um email de teste para verificar a configuração
 * @param {string} to - Endereço de email para teste
 * @returns {Promise<Object>} - Resultado do envio
 */
const sendTestEmail = async (to) => {
  return sendEmail(
    to,
    'Teste de Email - Amor Pet',
    'Este é um email de teste para verificar a configuração do sistema de emails da Amor Pet.',
    '<h1>Teste de Email</h1><p>Este é um email de teste para verificar a configuração do sistema de emails da Amor Pet.</p>'
  );
};

/**
 * Envia um email de boas-vindas para um novo usuário
 * @param {Object} user - Objeto do usuário
 * @returns {Promise<Object>} - Resultado do envio
 */
const sendWelcomeEmail = async (user) => {
  return sendEmail(
    user.email,
    'Bem-vindo à Amor Pet!',
    `Olá ${user.name},\n\nSeja bem-vindo à Amor Pet! Estamos muito felizes em tê-lo como cliente.\n\nAqui na Amor Pet, nos dedicamos a oferecer o melhor cuidado para o seu pet, com serviços de banho e tosa de alta qualidade.\n\nPara agendar um serviço, basta acessar nosso site ou entrar em contato conosco.\n\nAtenciosamente,\nEquipe Amor Pet`,
    `<h1>Bem-vindo à Amor Pet!</h1>
    <p>Olá ${user.name},</p>
    <p>Seja bem-vindo à Amor Pet! Estamos muito felizes em tê-lo como cliente.</p>
    <p>Aqui na Amor Pet, nos dedicamos a oferecer o melhor cuidado para o seu pet, com serviços de banho e tosa de alta qualidade.</p>
    <p>Para agendar um serviço, basta acessar nosso site ou entrar em contato conosco.</p>
    <p>Atenciosamente,<br>Equipe Amor Pet</p>`
  );
};

/**
 * Envia um email de confirmação de agendamento
 * @param {Object} appointment - Objeto do agendamento
 * @param {Object} user - Objeto do usuário
 * @param {Object} pet - Objeto do pet
 * @param {Object} service - Objeto do serviço
 * @returns {Promise<Object>} - Resultado do envio
 */
const sendAppointmentConfirmationEmail = async (appointment, user, pet, service) => {
  // Formatar data e hora
  const date = new Date(appointment.date).toLocaleDateString('pt-BR');
  const time = appointment.time;
  
  return sendEmail(
    user.email,
    'Confirmação de Agendamento - Amor Pet',
    `Olá ${user.name},\n\nSeu agendamento na Amor Pet foi confirmado com sucesso!\n\nDetalhes do agendamento:\n- Data: ${date}\n- Horário: ${time}\n- Pet: ${pet.name}\n- Serviço: ${service.name}\n- Valor: R$ ${service.price.toFixed(2)}\n\nPor favor, chegue com 10 minutos de antecedência.\n\nSe precisar reagendar, entre em contato conosco com pelo menos 24 horas de antecedência.\n\nAtenciosamente,\nEquipe Amor Pet`,
    `<h1>Confirmação de Agendamento</h1>
    <p>Olá ${user.name},</p>
    <p>Seu agendamento na Amor Pet foi confirmado com sucesso!</p>
    <h2>Detalhes do agendamento:</h2>
    <ul>
      <li><strong>Data:</strong> ${date}</li>
      <li><strong>Horário:</strong> ${time}</li>
      <li><strong>Pet:</strong> ${pet.name}</li>
      <li><strong>Serviço:</strong> ${service.name}</li>
      <li><strong>Valor:</strong> R$ ${service.price.toFixed(2)}</li>
    </ul>
    <p>Por favor, chegue com 10 minutos de antecedência.</p>
    <p>Se precisar reagendar, entre em contato conosco com pelo menos 24 horas de antecedência.</p>
    <p>Atenciosamente,<br>Equipe Amor Pet</p>`
  );
};

/**
 * Envia um email de lembrete de agendamento
 * @param {Object} appointment - Objeto do agendamento
 * @param {Object} user - Objeto do usuário
 * @param {Object} pet - Objeto do pet
 * @param {Object} service - Objeto do serviço
 * @returns {Promise<Object>} - Resultado do envio
 */
const sendAppointmentReminderEmail = async (appointment, user, pet, service) => {
  // Formatar data e hora
  const date = new Date(appointment.date).toLocaleDateString('pt-BR');
  const time = appointment.time;
  
  return sendEmail(
    user.email,
    'Lembrete: Seu agendamento na Amor Pet',
    `Olá ${user.name},\n\nEste é um lembrete sobre seu agendamento na Amor Pet para amanhã.\n\nDetalhes do agendamento:\n- Data: ${date}\n- Horário: ${time}\n- Pet: ${pet.name}\n- Serviço: ${service.name}\n\nPor favor, chegue com 10 minutos de antecedência.\n\nSe precisar reagendar, entre em contato conosco o quanto antes.\n\nAtenciosamente,\nEquipe Amor Pet`,
    `<h1>Lembrete de Agendamento</h1>
    <p>Olá ${user.name},</p>
    <p>Este é um lembrete sobre seu agendamento na Amor Pet para amanhã.</p>
    <h2>Detalhes do agendamento:</h2>
    <ul>
      <li><strong>Data:</strong> ${date}</li>
      <li><strong>Horário:</strong> ${time}</li>
      <li><strong>Pet:</strong> ${pet.name}</li>
      <li><strong>Serviço:</strong> ${service.name}</li>
    </ul>
    <p>Por favor, chegue com 10 minutos de antecedência.</p>
    <p>Se precisar reagendar, entre em contato conosco o quanto antes.</p>
    <p>Atenciosamente,<br>Equipe Amor Pet</p>`
  );
};

/**
 * Envia um email de confirmação de compra de plano
 * @param {Object} plan - Objeto do plano
 * @param {Object} planPurchased - Objeto do plano adquirido
 * @param {Object} user - Objeto do usuário
 * @param {Object} payment - Objeto do pagamento
 * @returns {Promise<Object>} - Resultado do envio
 */
const sendPlanPurchaseEmail = async (plan, planPurchased, user, payment) => {
  // Formatar data de validade
  const validUntil = new Date(planPurchased.valid_until).toLocaleDateString('pt-BR');
  
  return sendEmail(
    user.email,
    'Confirmação de Compra de Plano - Amor Pet',
    `Olá ${user.name},\n\nSua compra de plano na Amor Pet foi confirmada com sucesso!\n\nDetalhes do plano:\n- Plano: ${plan.name}\n- Serviços incluídos: ${plan.services_count}\n- Validade: ${validUntil}\n- Valor: R$ ${payment.amount.toFixed(2)}\n\nPara agendar um serviço utilizando seu plano, basta acessar nosso site ou entrar em contato conosco.\n\nAtenciosamente,\nEquipe Amor Pet`,
    `<h1>Confirmação de Compra de Plano</h1>
    <p>Olá ${user.name},</p>
    <p>Sua compra de plano na Amor Pet foi confirmada com sucesso!</p>
    <h2>Detalhes do plano:</h2>
    <ul>
      <li><strong>Plano:</strong> ${plan.name}</li>
      <li><strong>Serviços incluídos:</strong> ${plan.services_count}</li>
      <li><strong>Validade:</strong> ${validUntil}</li>
      <li><strong>Valor:</strong> R$ ${payment.amount.toFixed(2)}</li>
    </ul>
    <p>Para agendar um serviço utilizando seu plano, basta acessar nosso site ou entrar em contato conosco.</p>
    <p>Atenciosamente,<br>Equipe Amor Pet</p>`
  );
};

module.exports = {
  sendEmail,
  sendTestEmail,
  sendWelcomeEmail,
  sendAppointmentConfirmationEmail,
  sendAppointmentReminderEmail,
  sendPlanPurchaseEmail,
  updateEmailConfig
};
