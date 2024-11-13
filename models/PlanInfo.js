module.exports = (sequelize, DataTypes) => {
  const PlanInfo = sequelize.define(
    "PlanInfo",
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
      has_permanent_reservation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      permanent_reservation_weekday: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      permanent_reservation_start_hour_UTC: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      permanent_reservation_end_hour_UTC: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      // permanent_reservation_minute: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      // },
      permanent_reservation_lesson_duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      permanent_reservation_lesson_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      reschedules_left_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      cancelled_lesson_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      regular_discount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      plan_discount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      special_discount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
  PlanInfo.associate = (models) => {
    PlanInfo.belongsTo(models.User, {
      foreignKey: "user_id",
      allowNull: false,
    });
  };

  return PlanInfo;
};
