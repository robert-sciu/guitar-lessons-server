module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      difficulty_clearance_level: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_confirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      reset_password_token: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      reset_password_token_expiry: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      timestamps: false,
    }
  );

  User.associate = (models) => {
    User.hasOne(models.Plan_info, {
      foreignKey: "user_id",
      allowNull: false,
    });
    User.belongsToMany(models.Task, {
      through: "User_task",
      foreignKey: "user_id",
      otherKey: "task_id",
      allowNull: false,
    });
    User.hasMany(models.Lesson_reservation, {
      foreignKey: "user_id",
      allowNull: false,
    });
  };

  return User;
};
