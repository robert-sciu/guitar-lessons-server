module.exports = (sequelize, DataTypes) => {
  const PageImage = sequelize.define(
    "PageImage",
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
      section: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      filename_desktop: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      size_on_page: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      filename_mobile: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      filename_lazy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      createAt: false,
    }
  );

  return PageImage;
};
