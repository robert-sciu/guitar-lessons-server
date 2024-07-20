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
      },
      artist: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      file: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      notes: {
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
      through: "User_task",
      foreignKey: "task_id",
      otherKey: "user_id",
      allowNull: false,
    });
    Task.belongsToMany(models.Tag, {
      through: "Task_tag",
      foreignKey: "task_id",
      otherKey: "tag_id",
      allowNull: false,
    });
  };

  return Task;
};
