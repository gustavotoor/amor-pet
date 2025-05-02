/**
 * Configuração de conexão com o banco de dados PostgreSQL
 * 
 * Este arquivo contém as configurações necessárias para conectar
 * a aplicação ao banco de dados PostgreSQL.
 */

require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'amorpet',
    password: process.env.DB_PASSWORD || 'amorpet123',
    database: process.env.DB_NAME || 'amorpet',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: console.log,
    define: {
      timestamps: true,
      underscored: true,
    }
  },
  test: {
    username: process.env.DB_USER || 'amorpet',
    password: process.env.DB_PASSWORD || 'amorpet123',
    database: process.env.DB_NAME || 'amorpet_test',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    }
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
