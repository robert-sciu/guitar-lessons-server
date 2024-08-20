function planInfoLessonStartAndEndAsIntegers(data) {
  const lessonStart =
    data.permanent_reservation_hour + data.permanent_reservation_minute / 60;
  const lessonEnd =
    data.permanent_reservation_hour +
    data.permanent_reservation_minute / 60 +
    data.permanent_reservation_lesson_length / 60;
  return { lessonStart, lessonEnd };
}

function planInfoOverlap(updateData, existingPlanInfo) {
  const {
    lessonStart: existingPlanInfoLessonStart,
    lessonEnd: existingPlanInfoLessonEnd,
  } = planInfoLessonStartAndEndAsIntegers(existingPlanInfo);
  const {
    lessonStart: updatePlanInfoLessonStart,
    lessonEnd: updatePlanInfoLessonEnd,
  } = planInfoLessonStartAndEndAsIntegers(updateData);
  if (
    (updatePlanInfoLessonStart <= existingPlanInfoLessonStart &&
      updatePlanInfoLessonEnd > existingPlanInfoLessonStart) ||
    (updatePlanInfoLessonStart < existingPlanInfoLessonEnd &&
      updatePlanInfoLessonEnd >= existingPlanInfoLessonEnd) ||
    (updatePlanInfoLessonStart >= existingPlanInfoLessonStart &&
      updatePlanInfoLessonEnd <= existingPlanInfoLessonEnd)
  ) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  planInfoOverlap,
};
