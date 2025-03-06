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
      regular_lesson_price_pl: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      permanent_lesson_price_60_min_pl: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      permanent_lesson_price_90_min_pl: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      permanent_lesson_price_120_min_pl: {
        type: DataTypes.DECIMAL(10, 2),
      },
      regular_lesson_price_en: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      permanent_lesson_price_60_min_en: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      permanent_lesson_price_90_min_en: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      permanent_lesson_price_120_min_en: {
        type: DataTypes.DECIMAL(10, 2),
      },
    },
    {
      timestamps: false,
    }
  );

  return Pricing;
};
