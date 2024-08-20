function dateToWeekday(date) {
  return new Date(date).getDay();
}

function weekdayToDate({ weekday, nextWeek = false }) {
  const todayWeekday = new Date().getDay();
  const diff = weekday - todayWeekday;
  if (diff < 0) {
    if (nextWeek) {
      return weekdayToDate({ weekday: weekday + 7 + 7 });
    }
    return weekdayToDate({ weekday: weekday + 7 });
  }
  const date = new Date();
  if (nextWeek) {
    date.setDate(date.getDate() + diff + 7);
    return date.toISOString().split("T")[0];
  }
  date.setDate(date.getDate() + diff);
  return date.toISOString().split("T")[0];
}

function checkForChangedPermanentReservation(
  dataFromPlanInfo,
  dataFromCalendar
) {
  const inconsistent = Object.keys(dataFromPlanInfo).some(
    (key) => dataFromPlanInfo[key] !== dataFromCalendar[key]
  );
  return inconsistent;
}

function checkIfDateIsNextWeek(date) {
  const today = new Date().toISOString().split("T")[0];
  if ((new Date(date) - new Date(today)) / 24 / 60 / 60 / 1000 >= 7) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  dateToWeekday,
  weekdayToDate,
  checkForChangedPermanentReservation,
  checkIfDateIsNextWeek,
};
