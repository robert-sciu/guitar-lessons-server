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
      lesson_language: {
        type: DataTypes.STRING,
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
      permanent_reservation_lesson_duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      reschedules_left_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      completed_lesson_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      cancelled_lesson_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      regular_lesson_balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      permanent_lesson_balance_60_min: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      permanent_lesson_balance_90_min: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      permanent_lesson_balance_120_min: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      discount: {
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
