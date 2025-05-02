/**
 * Modelo de Serviço para o sistema Amor Pet
 * 
 * Este arquivo define o modelo de dados para os serviços oferecidos pelo pet shop
 * utilizando Sequelize ORM para interagir com o banco de dados PostgreSQL.
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Service = sequelize.define('Service', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'O nome do serviço é obrigatório'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: 'O preço deve ser um valor decimal'
        },
        min: {
          args: [0],
          msg: 'O preço não pode ser negativo'
        }
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Duração do serviço em minutos',
      validate: {
        isInt: {
          msg: 'A duração deve ser um número inteiro'
        },
        min: {
          args: [1],
          msg: 'A duração deve ser maior que zero'
        }
      }
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'services',
    timestamps: true,
    underscored: true
  });

  // Associações com outros modelos
  Service.associate = (models) => {
    // Um serviço pode estar em vários agendamentos
    Service.hasMany(models.Appointment, {
      foreignKey: 'service_id',
      as: 'appointments'
    });

    // Um serviço pode estar em vários planos
    Service.belongsToMany(models.Plan, {
      through: 'plan_services',
      foreignKey: 'service_id',
      otherKey: 'plan_id',
      as: 'plans'
    });
  };

  return Service;
};
