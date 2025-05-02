/**
 * Middleware de administrador para o sistema Amor Pet
 * 
 * Este arquivo contém o middleware para verificar se o usuário
 * tem permissões de administrador.
 */

/**
 * Middleware para verificar se o usuário é administrador
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função para passar para o próximo middleware
 */
exports.adminMiddleware = (req, res, next) => {
  try {
    // Verificar se o userRole foi definido pelo middleware de autenticação
    if (!req.userRole) {
      return res.status(401).json({
        success: false,
        message: 'Acesso não autorizado. Faça login novamente.'
      });
    }
    
    // Verificar se o usuário é administrador
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas administradores podem acessar este recurso.'
      });
    }
    
    // Passar para o próximo middleware
    next();
  } catch (error) {
    console.error('Erro no middleware de administrador:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar permissões de administrador.',
      error: error.message
    });
  }
};
