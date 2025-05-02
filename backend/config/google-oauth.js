/**
 * Configuração do Google OAuth para o sistema Amor Pet
 * 
 * Este arquivo contém as configurações necessárias para integração com a API do Google OAuth,
 * permitindo que os usuários façam login usando suas contas do Google.
 * 
 * Para um ambiente de produção, substitua as credenciais de exemplo por credenciais reais
 * obtidas no Google Cloud Console (https://console.cloud.google.com/).
 */

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Configurações do Google OAuth
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'exemplo-client-id.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'exemplo-client-secret';
const CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback';

/**
 * Configuração da estratégia de autenticação do Google
 * 
 * Esta função configura o Passport.js para usar a estratégia de autenticação do Google,
 * definindo como os dados do usuário serão processados após o login bem-sucedido.
 */
const setupGoogleStrategy = () => {
  // Serialização do usuário para a sessão
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Desserialização do usuário da sessão
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Configuração da estratégia do Google
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      // Verificar se o usuário já existe no banco de dados
      let user = await User.findOne({ where: { google_id: profile.id } });

      if (user) {
        // Usuário já existe, atualizar informações se necessário
        user.last_login = new Date();
        await user.save();
      } else {
        // Usuário não existe, criar novo usuário
        const email = profile.emails[0].value;
        
        // Verificar se já existe um usuário com este email
        const existingUser = await User.findOne({ where: { email } });
        
        if (existingUser) {
          // Vincular conta do Google ao usuário existente
          existingUser.google_id = profile.id;
          existingUser.last_login = new Date();
          await existingUser.save();
          user = existingUser;
        } else {
          // Criar novo usuário
          user = await User.create({
            name: profile.displayName,
            email: email,
            google_id: profile.id,
            role: 'tutor', // Por padrão, novos usuários são tutores
            email_verified: true, // Email já verificado pelo Google
            active: true,
            last_login: new Date()
          });
        }
      }

      // Gerar token JWT para o usuário
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'amor-pet-secret',
        { expiresIn: '24h' }
      );

      // Adicionar token ao objeto do usuário para uso posterior
      user.token = token;

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
};

/**
 * Middleware para verificar se o usuário está autenticado via Google
 * 
 * Este middleware pode ser usado em rotas que requerem autenticação via Google.
 */
const isGoogleAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Não autorizado. Faça login com o Google.' });
};

module.exports = {
  setupGoogleStrategy,
  isGoogleAuthenticated
};
