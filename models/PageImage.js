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
      filenameDesktop: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      filenameMobile: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      filenameLazy: {
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
