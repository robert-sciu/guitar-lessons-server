module.exports = (sequelize, DataTypes) => {
  const Calendar = sequelize.define(
    "Calendar",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      weekday: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      is_permanent: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      is_unavailable: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      availability_from: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      availability_to: {
        type: DataTypes.TIME,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      updateAt: false,
    }
  );

  return Calendar;
};
