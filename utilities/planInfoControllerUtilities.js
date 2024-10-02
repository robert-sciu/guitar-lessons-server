function planInfoLessonStartAndEndAsFloats(data) {
  const lessonStart =
    data.permanent_reservation_hour + data.permanent_reservation_minute / 60;
  const lessonEnd =
    data.permanent_reservation_hour +
    data.permanent_reservation_minute / 60 +
    data.permanent_reservation_lesson_length / 60;
  return { lessonStart, lessonEnd };
}

function checkForOverlapingHours(
  lessonStart1,
  lessonEnd1,
  lessonStart2,
  lessonEnd2
) {
  if (
    (lessonStart1 <= lessonStart2 && lessonEnd1 > lessonStart2) ||
    (lessonStart1 < lessonEnd2 && lessonEnd1 >= lessonEnd2) ||
    (lessonStart1 >= lessonStart2 && lessonEnd1 <= lessonEnd2)
  ) {
    return true;
  } else {
    return false;
  }
}

function planInfoOverlap(updateData, existingPlanInfo) {
  const { lessonStart: lessonStart1, lessonEnd: lessonEnd1 } =
    planInfoLessonStartAndEndAsFloats(existingPlanInfo);
  const { lessonStart: lessonStart2, lessonEnd: lessonEnd2 } =
    planInfoLessonStartAndEndAsFloats(updateData);

  return checkForOverlapingHours(
    lessonStart1,
    lessonEnd1,
    lessonStart2,
    lessonEnd2
  );
}

module.exports = {
  planInfoOverlap,
  checkForOverlapingHours,
};
