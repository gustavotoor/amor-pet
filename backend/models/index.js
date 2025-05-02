/**
 * Arquivo de configuração para o banco de dados do sistema Amor Pet
 * 
 * Este arquivo configura a conexão com o banco de dados PostgreSQL
 * usando o Sequelize ORM.
 */

const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

// Configuração do banco de dados
const dbConfig = {
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'amor_pet',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  port: process.env.DB_PORT || 5432,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// Criar instância do Sequelize
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    logging: dbConfig.logging,
    define: dbConfig.define,
    pool: dbConfig.pool
  }
);

// Testar conexão
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    return true;
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection,
  dbConfig
};
