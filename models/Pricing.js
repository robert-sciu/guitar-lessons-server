module.exports = (sequelize, DataTypes) => {
  const Pricing = sequelize.define(
    "Pricing",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      lesson_price_pln: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 50,
      },
      lesson_price_eur: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
      },
      lesson_price_usd: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 15,
      },
    },
    {
      timestamps: false,
    }
  );

  return Pricing;
};
