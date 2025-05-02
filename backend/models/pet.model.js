/**
 * Modelo de Pet para o sistema Amor Pet
 * 
 * Este arquivo define o modelo de dados para pets cadastrados pelos tutores
 * utilizando Sequelize ORM para interagir com o banco de dados PostgreSQL.
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pet = sequelize.define('Pet', {
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'O nome do pet é obrigatório'
        }
      }
    },
    species: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'A espécie do pet é obrigatória'
        }
      }
    },
    breed: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: 'A idade deve ser um número inteiro'
        },
        min: {
          args: [0],
          msg: 'A idade não pode ser negativa'
        }
      }
    },
    weight: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        isDecimal: {
          msg: 'O peso deve ser um número decimal'
        },
        min: {
          args: [0.1],
          msg: 'O peso deve ser maior que zero'
        }
      }
    },
    photo_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    observations: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'pets',
    timestamps: true,
    underscored: true
  });

  // Associações com outros modelos
  Pet.associate = (models) => {
    // Um pet pertence a um usuário (tutor)
    Pet.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'tutor'
    });

    // Um pet pode ter vários agendamentos
    Pet.hasMany(models.Appointment, {
      foreignKey: 'pet_id',
      as: 'appointments'
    });
  };

  return Pet;
};
