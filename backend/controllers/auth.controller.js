/**
 * Controlador de autenticação para o sistema Amor Pet
 * 
 * Este arquivo contém as funções de controlador para gerenciar autenticação,
 * incluindo registro, login, verificação de email e recuperação de senha.
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { sendEmail } = require('../utils/email.util');
const crypto = require('crypto');

// Função para gerar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'amor-pet-secret',
    { expiresIn: '24h' }
  );
};

// Registro de novo usuário
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    // Verificar se o email já está em uso
    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Este email já está em uso.'
      });
    }
    
    // Criar novo usuário
    const user = await User.create({
      name,
      email,
      password, // Será criptografado pelo hook beforeCreate no modelo
      phone,
      role: 'tutor', // Por padrão, novos usuários são tutores
      active: true,
      email_verified: false // Requer verificação de email
    });
    
    // Gerar token de verificação de email
    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.verification_token = verificationToken;
    await user.save();
    
    // Enviar email de verificação
    await sendEmail(
      user.email,
      'Confirme seu cadastro na Amor Pet',
      `Olá ${user.name},\n\nBem-vindo à Amor Pet! Para confirmar seu cadastro, clique no link abaixo:\n\nhttp://localhost:3000/verificar-email?token=${verificationToken}\n\nEste link expira em 24 horas.\n\nAtenciosamente,\nEquipe Amor Pet`
    );
    
    // Gerar token JWT
    const token = generateToken(user);
    
    // Retornar dados do usuário (sem senha) e token
    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso. Verifique seu email para confirmar o cadastro.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        email_verified: user.email_verified
      },
      token
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar usuário.',
      error: error.message
    });
  }
};

// Login de usuário
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuário pelo email
    const user = await User.findOne({ where: { email } });
    
    // Verificar se o usuário existe
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos.'
      });
    }
    
    // Verificar se o usuário está ativo
    if (!user.active) {
      return res.status(401).json({
        success: false,
        message: 'Sua conta está desativada. Entre em contato com o suporte.'
      });
    }
    
    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos.'
      });
    }
    
    // Atualizar último login
    user.last_login = new Date();
    await user.save();
    
    // Gerar token JWT
    const token = generateToken(user);
    
    // Retornar dados do usuário (sem senha) e token
    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        email_verified: user.email_verified
      },
      token
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login.',
      error: error.message
    });
  }
};

// Verificação de email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    
    // Buscar usuário pelo token de verificação
    const user = await User.findOne({ where: { verification_token: token } });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token de verificação inválido ou expirado.'
      });
    }
    
    // Atualizar status de verificação
    user.email_verified = true;
    user.verification_token = null;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Email verificado com sucesso. Você já pode fazer login.'
    });
  } catch (error) {
    console.error('Erro ao verificar email:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar email.',
      error: error.message
    });
  }
};

// Recuperação de senha
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Buscar usuário pelo email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado.'
      });
    }
    
    // Gerar token de recuperação de senha
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.reset_password_token = resetToken;
    user.reset_password_expires = new Date(Date.now() + 3600000); // 1 hora
    await user.save();
    
    // Enviar email de recuperação de senha
    await sendEmail(
      user.email,
      'Recuperação de Senha - Amor Pet',
      `Olá ${user.name},\n\nVocê solicitou a recuperação de senha. Clique no link abaixo para criar uma nova senha:\n\nhttp://localhost:3000/redefinir-senha?token=${resetToken}\n\nEste link expira em 1 hora.\n\nSe você não solicitou esta recuperação, ignore este email.\n\nAtenciosamente,\nEquipe Amor Pet`
    );
    
    res.status(200).json({
      success: true,
      message: 'Email de recuperação de senha enviado. Verifique sua caixa de entrada.'
    });
  } catch (error) {
    console.error('Erro ao solicitar recuperação de senha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao solicitar recuperação de senha.',
      error: error.message
    });
  }
};

// Redefinição de senha
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    // Buscar usuário pelo token de recuperação
    const user = await User.findOne({
      where: {
        reset_password_token: token,
        reset_password_expires: { $gt: new Date() }
      }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token de recuperação inválido ou expirado.'
      });
    }
    
    // Atualizar senha
    user.password = password; // Será criptografada pelo hook beforeUpdate no modelo
    user.reset_password_token = null;
    user.reset_password_expires = null;
    await user.save();
    
    // Enviar email de confirmação
    await sendEmail(
      user.email,
      'Senha Alterada - Amor Pet',
      `Olá ${user.name},\n\nSua senha foi alterada com sucesso.\n\nSe você não realizou esta alteração, entre em contato com nosso suporte imediatamente.\n\nAtenciosamente,\nEquipe Amor Pet`
    );
    
    res.status(200).json({
      success: true,
      message: 'Senha redefinida com sucesso. Você já pode fazer login com sua nova senha.'
    });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao redefinir senha.',
      error: error.message
    });
  }
};

// Obter perfil do usuário
exports.getProfile = async (req, res) => {
  try {
    // O ID do usuário é obtido do middleware de autenticação
    const userId = req.userId;
    
    // Buscar usuário pelo ID
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password', 'verification_token', 'reset_password_token', 'reset_password_expires'] }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado.'
      });
    }
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter perfil.',
      error: error.message
    });
  }
};

// Atualizar perfil do usuário
exports.updateProfile = async (req, res) => {
  try {
    // O ID do usuário é obtido do middleware de autenticação
    const userId = req.userId;
    
    // Dados que podem ser atualizados
    const { name, phone } = req.body;
    
    // Buscar usuário pelo ID
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado.'
      });
    }
    
    // Atualizar dados
    if (name) user.name = name;
    if (phone) user.phone = phone;
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Perfil atualizado com sucesso.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        email_verified: user.email_verified
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar perfil.',
      error: error.message
    });
  }
};

// Alterar senha
exports.changePassword = async (req, res) => {
  try {
    // O ID do usuário é obtido do middleware de autenticação
    const userId = req.userId;
    
    const { currentPassword, newPassword } = req.body;
    
    // Buscar usuário pelo ID
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado.'
      });
    }
    
    // Verificar senha atual
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Senha atual incorreta.'
      });
    }
    
    // Atualizar senha
    user.password = newPassword; // Será criptografada pelo hook beforeUpdate no modelo
    await user.save();
    
    // Enviar email de confirmação
    await sendEmail(
      user.email,
      'Senha Alterada - Amor Pet',
      `Olá ${user.name},\n\nSua senha foi alterada com sucesso.\n\nSe você não realizou esta alteração, entre em contato com nosso suporte imediatamente.\n\nAtenciosamente,\nEquipe Amor Pet`
    );
    
    res.status(200).json({
      success: true,
      message: 'Senha alterada com sucesso.'
    });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao alterar senha.',
      error: error.message
    });
  }
};
