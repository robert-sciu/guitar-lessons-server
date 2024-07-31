module.exports = (sequelize, DataTypes) => {
  const TaskTag = sequelize.define(
    "TaskTag",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      task_difficulty_level: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tag_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Tag",
          key: "id",
        },
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
  return TaskTag;
};
