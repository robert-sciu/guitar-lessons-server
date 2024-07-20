module.exports = (sequelize, DataTypes) => {
  const Lesson_reservation = sequelize.define("Lesson_reservation", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    no_account_reservation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    rescheduled_by_user: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    canceled_by_user: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    rescheduled_by_teacher: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    canceled_by_teacher: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });

  Lesson_reservation.associate = (models) => {
    Lesson_reservation.belongsTo(models.User, {
      foreignKey: "user_id",
      allowNull: false,
    });
  };

  return Lesson_reservation;
};
