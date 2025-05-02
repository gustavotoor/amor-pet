/**
 * Modelo simplificado de usuário para o sistema Amor Pet
 * 
 * Este arquivo define o modelo de usuário usando Sequelize ORM.
 */

const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const { sequelize } = require('./index');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true // Pode ser nulo para usuários que usam apenas Google OAuth
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('tutor', 'admin'),
    defaultValue: 'tutor'
  },
  google_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verification_token: {
    type: DataTypes.STRING,
    allowNull: true
  },
  reset_password_token: {
    type: DataTypes.STRING,
    allowNull: true
  },
  reset_password_expires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true
});

// Hook para criptografar senha antes de criar usuário
User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

// Hook para criptografar senha antes de atualizar usuário
User.beforeUpdate(async (user) => {
  if (user.changed('password') && user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

module.exports = User;
