/**
 * Modelo de Pagamento para o sistema Amor Pet
 * 
 * Este arquivo define o modelo de dados para os pagamentos realizados pelos tutores
 * utilizando Sequelize ORM para interagir com o banco de dados PostgreSQL.
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
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
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: 'O valor deve ser um número decimal'
        },
        min: {
          args: [0],
          msg: 'O valor não pode ser negativo'
        }
      }
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'pix',
      validate: {
        isIn: {
          args: [['pix', 'credit_card', 'debit_card', 'cash']],
          msg: 'Método de pagamento inválido'
        }
      }
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: {
          args: [['pending', 'completed', 'failed', 'refunded']],
          msg: 'Status inválido'
        }
      }
    },
    transaction_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'ID da transação no provedor de pagamento'
    },
    payment_provider: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Nome do provedor de pagamento'
    },
    payment_details: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Detalhes adicionais do pagamento'
    }
  }, {
    tableName: 'payments',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: 'idx_payment_user',
        fields: ['user_id']
      },
      {
        name: 'idx_payment_status',
        fields: ['status']
      },
      {
        name: 'idx_payment_date',
        fields: ['payment_date']
      }
    ]
  });

  // Associações com outros modelos
  Payment.associate = (models) => {
    // Um pagamento pertence a um usuário
    Payment.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    // Um pagamento pode estar associado a um agendamento
    Payment.hasOne(models.Appointment, {
      foreignKey: 'payment_id',
      as: 'appointment'
    });

    // Um pagamento pode estar associado a um plano adquirido
    Payment.hasOne(models.PlanPurchased, {
      foreignKey: 'payment_id',
      as: 'plan_purchased'
    });
  };

  return Payment;
};
