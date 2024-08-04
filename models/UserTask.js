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
        references: {
          model: "User",
          key: "id",
        },
        allowNull: false,
      },
      task_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Task",
          key: "id",
        },
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

  return UserTask;
};
