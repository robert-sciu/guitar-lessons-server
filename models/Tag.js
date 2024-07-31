module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    "Tag",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  Tag.associate = (models) => {
    Tag.belongsToMany(models.Task, {
      through: "Task_tag",
      foreignKey: "tag_id",
      otherKey: "task_id",
      allowNull: false,
    });
  };
  return Tag;
};
