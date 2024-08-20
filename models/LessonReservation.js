module.exports = (sequelize, DataTypes) => {
  const LessonReservation = sequelize.define(
    "LessonReservation",
    {
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
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      hour: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      minute: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_permanent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      rescheduled_by_user: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      canceled_by_user: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      rescheduled_by_teacher: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      canceled_by_teacher: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );

  LessonReservation.associate = (models) => {
    LessonReservation.belongsTo(models.User, {
      foreignKey: "user_id",
      allowNull: false,
    });
  };

  return LessonReservation;
};
