/**
 * Rotas de autenticação para o sistema Amor Pet
 * 
 * Este arquivo define as rotas relacionadas à autenticação de usuários,
 * como registro, login, verificação de e-mail e recuperação de senha.
 */

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');

// Rota para registro de novo usuário
router.post('/register', AuthController.register);

// Rota para login de usuário
router.post('/login', AuthController.login);

// Rota para verificação de e-mail
router.get('/verify-email/:token', AuthController.verifyEmail);

// Rota para solicitação de recuperação de senha
router.post('/forgot-password', AuthController.forgotPassword);

// Rota para redefinição de senha
router.post('/reset-password', AuthController.resetPassword);

// Rota para login com Google OAuth
router.post('/google-login', AuthController.googleLogin);

module.exports = router;
