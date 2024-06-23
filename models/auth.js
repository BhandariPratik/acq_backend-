module.exports = (connection, DataTypes) => {
    const Register = connection.define(
      'register',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        }
        ,
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isEmail: true
          }
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },

        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        user_type: {
          type: DataTypes.INTEGER,
          allowNull: false,
        }
      },
      {
        timestamps: true
      }
    );
    
    return Register;
  };
  