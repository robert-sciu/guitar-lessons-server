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
      new_email_temp: {
        type: DataTypes.STRING,
        allowNull: true,
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
      change_email_token: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      change_email_token_expiry: {
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
    User.belongsToMany(models.Task, {
      through: models.UserTask,
      foreignKey: "user_id",
      otherKey: "task_id",
    });
    User.hasOne(models.PlanInfo, {
      foreignKey: "user_id",
      allowNull: false,
    });
    User.hasMany(models.LessonReservation, {
      foreignKey: "user_id",
      allowNull: false,
    });
  };

  return User;
};
