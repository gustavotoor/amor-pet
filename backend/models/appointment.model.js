/**
 * Modelo de Agendamento para o sistema Amor Pet
 * 
 * Este arquivo define o modelo de dados para os agendamentos de serviços
 * utilizando Sequelize ORM para interagir com o banco de dados PostgreSQL.
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Appointment = sequelize.define('Appointment', {
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
    pet_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pets',
        key: 'id'
      }
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'services',
        key: 'id'
      }
    },
    plan_purchased_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'plan_purchased',
        key: 'id'
      },
      comment: 'ID do plano utilizado para este agendamento, se aplicável'
    },
    appointment_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'Data inválida'
        },
        isAfterToday(value) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const appointmentDate = new Date(value);
          
          if (appointmentDate < today) {
            throw new Error('A data do agendamento não pode ser no passado');
          }
        }
      }
    },
    appointment_time: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        isTime: {
          msg: 'Horário inválido'
        }
      }
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: {
          args: [['pending', 'confirmed', 'completed', 'cancelled']],
          msg: 'Status inválido'
        }
      }
    },
    payment_status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: {
          args: [['pending', 'paid', 'refunded']],
          msg: 'Status de pagamento inválido'
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
    observations: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'appointments',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: 'idx_appointment_date_time',
        fields: ['appointment_date', 'appointment_time']
      },
      {
        name: 'idx_appointment_status',
        fields: ['status']
      }
    ]
  });

  // Associações com outros modelos
  Appointment.associate = (models) => {
    // Um agendamento pertence a um usuário
    Appointment.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    // Um agendamento pertence a um pet
    Appointment.belongsTo(models.Pet, {
      foreignKey: 'pet_id',
      as: 'pet'
    });

    // Um agendamento pertence a um serviço
    Appointment.belongsTo(models.Service, {
      foreignKey: 'service_id',
      as: 'service'
    });

    // Um agendamento pode pertencer a um plano adquirido
    Appointment.belongsTo(models.PlanPurchased, {
      foreignKey: 'plan_purchased_id',
      as: 'plan_purchased'
    });

    // Um agendamento pode ter um pagamento associado
    Appointment.belongsTo(models.Payment, {
      foreignKey: 'payment_id',
      as: 'payment'
    });
  };

  return Appointment;
};
