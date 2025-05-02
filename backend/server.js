/**
 * Arquivo principal do servidor para o sistema Amor Pet
 * 
 * Este arquivo configura e inicia o servidor Express simplificado
 * para demonstração do sistema.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar aplicação Express
const app = express();

// Configurar middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Rota para verificar status do servidor
app.get('/api/status', (req, res) => {
  res.status(200).json({
    status: 'online',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date()
  });
});

// Rota para todas as outras requisições (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor Amor Pet rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('Acesse: http://localhost:' + PORT);
});

module.exports = app;
