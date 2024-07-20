module.exports = (sequelize, DataTypes) => {
  const Calendar = sequelize.define("Calendar", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    weekday: {
      type: DataTypes.STRING,
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
    availability_from: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    availability_to: {
      type: DataTypes.TIME,
      allowNull: true,
    },
  });

  return Calendar;
};
