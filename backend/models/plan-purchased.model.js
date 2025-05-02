/**
 * Modelo de Plano Adquirido para o sistema Amor Pet
 * 
 * Este arquivo define o modelo de dados para os planos adquiridos pelos tutores
 * utilizando Sequelize ORM para interagir com o banco de dados PostgreSQL.
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PlanPurchased = sequelize.define('PlanPurchased', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'plans',
        key: 'id'
      }
    },
    purchase_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'Data de expiração inválida'
        },
        isAfterPurchaseDate(value) {
          if (new Date(value) <= new Date(this.purchase_date)) {
            throw new Error('A data de expiração deve ser posterior à data de compra');
          }
        }
      }
    },
    total_services: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Número total de serviços incluídos no plano',
      validate: {
        isInt: {
          msg: 'O número de serviços deve ser um número inteiro'
        },
        min: {
          args: [1],
          msg: 'O número de serviços deve ser maior que zero'
        }
      }
    },
    used_services: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: 'O número de serviços utilizados deve ser um número inteiro'
        },
        min: {
          args: [0],
          msg: 'O número de serviços utilizados não pode ser negativo'
        }
      }
    },
    payment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'payments',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'active',
      validate: {
        isIn: {
          args: [['active', 'expired', 'cancelled']],
          msg: 'Status inválido'
        }
      }
    }
  }, {
    tableName: 'plan_purchased',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: 'idx_plan_purchased_user',
        fields: ['user_id']
      },
      {
        name: 'idx_plan_purchased_status',
        fields: ['status']
      }
    ]
  });

  // Associações com outros modelos
  PlanPurchased.associate = (models) => {
    // Um plano adquirido pertence a um usuário
    PlanPurchased.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    // Um plano adquirido pertence a um plano
    PlanPurchased.belongsTo(models.Plan, {
      foreignKey: 'plan_id',
      as: 'plan'
    });

    // Um plano adquirido pode ter um pagamento associado
    PlanPurchased.belongsTo(models.Payment, {
      foreignKey: 'payment_id',
      as: 'payment'
    });

    // Um plano adquirido pode ter vários agendamentos
    PlanPurchased.hasMany(models.Appointment, {
      foreignKey: 'plan_purchased_id',
      as: 'appointments'
    });
  };

  return PlanPurchased;
};
