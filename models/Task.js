module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    "Task",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      artist: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      youtube_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      filename: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      notes_pl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      notes_en: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      difficulty_level: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  Task.associate = (models) => {
    Task.belongsToMany(models.User, {
      through: models.UserTask,
      foreignKey: "task_id",
      otherKey: "user_id",
    });
    Task.belongsTo(models.UserTask, {
      foreignKey: "id",
      targetKey: "task_id",
      as: "user_task",
    });
    Task.belongsToMany(models.Tag, {
      through: "TaskTag",
      foreignKey: "task_id",
      otherKey: "tag_id",
    });
  };

  return Task;
};
