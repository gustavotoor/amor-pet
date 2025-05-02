/**
 * Middleware de autenticação para o sistema Amor Pet
 * 
 * Este arquivo contém o middleware para verificar tokens JWT
 * e proteger rotas que requerem autenticação.
 */

const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Middleware para verificar token JWT
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função para passar para o próximo middleware
 */
exports.authMiddleware = async (req, res, next) => {
  try {
    // Verificar se o token está presente no cabeçalho Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Acesso não autorizado. Token não fornecido.'
      });
    }
    
    // Extrair token do cabeçalho
    const token = authHeader.split(' ')[1];
    
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'amor-pet-secret');
    
    // Verificar se o usuário existe
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado.'
      });
    }
    
    // Verificar se o usuário está ativo
    if (!user.active) {
      return res.status(401).json({
        success: false,
        message: 'Sua conta está desativada. Entre em contato com o suporte.'
      });
    }
    
    // Adicionar ID e função do usuário à requisição para uso posterior
    req.userId = user.id;
    req.userRole = user.role;
    
    // Passar para o próximo middleware
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado. Faça login novamente.'
      });
    }
    
    console.error('Erro no middleware de autenticação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar autenticação.',
      error: error.message
    });
  }
};
