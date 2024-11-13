// function planInfoLessonStartAndEndAsFloats(data) {
//   const lessonStart = data.permanent_reservation_start_hour_UTC;
//   const lessonEnd = data.permanent_reservation_end_hour_UTC;
//   return { lessonStart, lessonEnd };
// }

// function checkForOverlapingHours(
//   lessonStart1,
//   lessonEnd1,
//   lessonStart2,
//   lessonEnd2
// ) {
//   console.log(lessonStart1, lessonEnd1, lessonStart2, lessonEnd2);
//   if (
//     (lessonStart1 <= lessonStart2 && lessonEnd1 > lessonStart2) ||
//     (lessonStart1 < lessonEnd2 && lessonEnd1 >= lessonEnd2) ||
//     (lessonStart1 >= lessonStart2 && lessonEnd1 <= lessonEnd2)
//   ) {
//     return true;
//   } else {
//     return false;
//   }
// }

// function planInfoOverlap(updateData, existingPlanInfo) {
//   const {
//     permanent_reservation_start_hour_UTC: lessonStart1,
//     permanent_reservation_end_hour_UTC: lessonEnd1,
//   } = existingPlanInfo;
//   const {
//     permanent_reservation_start_hour_UTC: lessonStart2,
//     permanent_reservation_end_hour_UTC: lessonEnd2,
//   } = updateData;

//   return checkForOverlapingHours(
//     lessonStart1,
//     lessonEnd1,
//     lessonStart2,
//     lessonEnd2
//   );
// }

// module.exports = {
//   planInfoOverlap,
//   checkForOverlapingHours,
// };
