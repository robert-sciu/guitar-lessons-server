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
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      start_UTC: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_UTC: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_permanent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      rescheduled_by_user: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      rescheduled_by_teacher: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      canceled_by_teacher: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      free_edit_expiry: {
        type: DataTypes.DATE,
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
