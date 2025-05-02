/**
 * Rotas de autenticação Google OAuth para o sistema Amor Pet
 * 
 * Este arquivo contém as rotas necessárias para o fluxo de autenticação
 * via Google OAuth, incluindo o início do processo de autenticação,
 * o callback após autenticação bem-sucedida, e o logout.
 */

const express = require('express');
const passport = require('passport');
const router = express.Router();

/**
 * @route   GET /api/auth/google
 * @desc    Iniciar o processo de autenticação com o Google
 * @access  Público
 */
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

/**
 * @route   GET /api/auth/google/callback
 * @desc    Callback após autenticação bem-sucedida com o Google
 * @access  Público
 */
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: false
  }),
  (req, res) => {
    // Após autenticação bem-sucedida, redirecionar para a página inicial
    // com o token JWT como parâmetro de consulta
    const token = req.user.token;
    
    // Armazenar informações do usuário em cookies seguros
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    });
    
    // Redirecionar para a página do tutor com o token
    res.redirect(`/tutor/dashboard.html?auth=google&token=${token}`);
  }
);

/**
 * @route   GET /api/auth/google/success
 * @desc    Rota para verificar se a autenticação foi bem-sucedida
 * @access  Privado
 */
router.get('/google/success', (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "Autenticação bem-sucedida",
      user: req.user
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Usuário não autenticado"
    });
  }
});

/**
 * @route   GET /api/auth/google/failure
 * @desc    Rota para lidar com falhas de autenticação
 * @access  Público
 */
router.get('/google/failure', (req, res) => {
  res.status(401).json({
    success: false,
    message: "Falha na autenticação com o Google"
  });
});

module.exports = router;
