module.exports = (sequelize, DataTypes) => {
  const Task_tag = sequelize.define(
    "Task_tag",
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
  return Task_tag;
};
