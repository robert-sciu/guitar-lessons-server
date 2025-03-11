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
        allowNull: false,
      },
      // task_difficulty_level: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      // },
      tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  TaskTag.associate = (models) => {
    TaskTag.belongsTo(models.Task, {
      foreignKey: "task_id",
      allowNull: false,
    });
    TaskTag.belongsTo(models.Tag, {
      foreignKey: "tag_id",
      allowNull: false,
    });
  };
  return TaskTag;
};
