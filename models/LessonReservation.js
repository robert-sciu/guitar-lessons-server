module.exports = (sequelize, DataTypes) => {
  const LessonReservation = sequelize.define("LessonReservation", {
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

  LessonReservation.associate = (models) => {
    LessonReservation.belongsTo(models.User, {
      foreignKey: "user_id",
      allowNull: false,
    });
  };

  return LessonReservation;
};
