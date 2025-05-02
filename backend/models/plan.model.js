/**
 * Modelo de Plano para o sistema Amor Pet
 * 
 * Este arquivo define o modelo de dados para os planos de serviços oferecidos
 * utilizando Sequelize ORM para interagir com o banco de dados PostgreSQL.
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Plan = sequelize.define('Plan', {
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
          msg: 'O nome do plano é obrigatório'
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
    validity_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Validade do plano em dias',
      validate: {
        isInt: {
          msg: 'A validade deve ser um número inteiro'
        },
        min: {
          args: [1],
          msg: 'A validade deve ser maior que zero'
        }
      }
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'plans',
    timestamps: true,
    underscored: true
  });

  // Associações com outros modelos
  Plan.associate = (models) => {
    // Um plano pode ter vários serviços
    Plan.belongsToMany(models.Service, {
      through: 'plan_services',
      foreignKey: 'plan_id',
      otherKey: 'service_id',
      as: 'services'
    });

    // Um plano pode ser adquirido várias vezes
    Plan.hasMany(models.PlanPurchased, {
      foreignKey: 'plan_id',
      as: 'purchases'
    });
  };

  return Plan;
};
