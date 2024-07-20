module.exports = (sequelize, DataTypes) => {
  const Page_image = sequelize.define("Page_image", {
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
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Page_image;
};
