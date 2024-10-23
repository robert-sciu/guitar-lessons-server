module.exports = (sequelize, DataTypes) => {
  const UserTask = sequelize.define(
    "UserTask",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      task_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_notes: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      timestamps: false,
    }
  );

  UserTask.associate = (models) => {
    UserTask.belongsTo(models.User, {
      foreignKey: "user_id",
    });
    UserTask.belongsTo(models.Task, {
      foreignKey: "task_id",
    });
  };

  return UserTask;
};
