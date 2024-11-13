const moment = require("moment-timezone");
const { Op } = require("sequelize");
const { Calendar, LessonReservation } = require("../models");

function checkIfReservationDateIsAllowed(data) {
  // in case the date is somehow invalid to prevent error in moment module
  if (!data.start_UTC || !data.end_UTC) {
    return {
      error: true,
      errorMsg: {
        pl: "Brak daty lub niepoprawny format daty",
        en: "No date or invalid date format",
      },
    };
  }
  // this is the setup for working hours so that users can't reserve outside working hours
  // not really sure if it's a good idea to put it here
  // maybe I'll have some config file later
  const myTimezone = "Europe/Warsaw";
  const localWorkingHoursStart = "08:00:00";
  const localWorkingHoursEnd = "22:00:00";

  // working hours have to be converted to UTC
  // to compare with reservation date which is also in UTC
  const today = new Date().toISOString().split("T")[0];
  const startHourUTC = moment
    .tz(`${today} ${localWorkingHoursStart}`, myTimezone)
    .utc()
    .hour();
  const endHourUTC = moment
    .tz(`${today} ${localWorkingHoursEnd}`, myTimezone)
    .utc()
    .hour();

  const reservationStartDate = data.start_UTC.split("T")[0];
  const reservationStartHour = data.start_UTC.split("T")[1].split(":")[0];
  const reservationEndHour = data.end_UTC.split("T")[1].split(":")[0];

  let error;

  if (reservationStartHour < startHourUTC || reservationEndHour > endHourUTC) {
    error = {
      pl: "Czas rezerwacji musi zawierać się w dostępnych godzinach",
      en: "Reservation time is not within the allowed time frame",
    };
  }
  if (reservationStartDate < today) {
    error = {
      pl: "Data rezerwacji nie może być w przeszłości",
      en: "Reservation date cannot be in the past",
    };
  }
  if (reservationStartDate === today) {
    error = {
      pl: "Data rezerwacji nie może być dzisiaj",
      en: "Reservation date cannot be today",
    };
  }
  if (
    Math.abs(
      (new Date(reservationStartDate) - new Date(today)) / (24 * 60 * 60 * 1000)
    ) >= 14
  ) {
    error = {
      pl: "Data rezerwacji nie może być dalej niż 14 dni w przyszłości",
      en: "Reservation date cannot be more than 14 days in the future",
    };
  }
  return {
    error: error ? true : false,
    errorMsg: error,
  };
}

// function regularReservationStartAndEndAsFloats(data) {
//   const lessonStart = data.hour + data.minute / 60;
//   const lessonEnd = data.hour + data.minute / 60 + data.duration / 60;
//   return { lessonStart, lessonEnd };
// }

// function reservationsOverlap(newReservation, existingReservation) {
//   console.log(newReservation, existingReservation);
//   if (newReservation.id === existingReservation.id) return false;
//   const { lessonStart: lessonStart1, lessonEnd: lessonEnd1 } =
//     regularReservationStartAndEndAsFloats(newReservation);
//   const { lessonStart: lessonStart2, lessonEnd: lessonEnd2 } =
//     regularReservationStartAndEndAsFloats(existingReservation);
//   return checkForOverlapingHours(
//     lessonStart1,
//     lessonEnd1,
//     lessonStart2,
//     lessonEnd2
//   );
// }

/**
 * Checks if the given reservation overlaps with any existing reservations.
 *
 * @param {object} newReservationData
 * The reservation data to check for overlaps with.
 * Must contain start_UTC and end_UTC properties in ISO 8601 format.
 *
 * @returns {Promise<object>}
 * A promise resolving to an object with an error property set to true
 * if there are overlapping reservations and an errorMsg property with a
 * string containing a description of the overlapping reservations.
 * If there are no overlapping reservations, the promise resolves to an
 * object with an error property set to false and an errorMsg property set
 * to null.
 */
async function checkForOverlapingReservations(newReservationData) {
  let overlap;
  const { start_UTC, end_UTC } = newReservationData;
  const overlappingReservations = await LessonReservation.findAll({
    where: {
      [Op.and]: {
        start_UTC: {
          [Op.lte]: end_UTC,
        },
        end_UTC: {
          [Op.gte]: start_UTC,
        },
        id: {
          [Op.ne]: newReservationData?.id || null,
        },
      },
    },
  });
  if (overlappingReservations.length > 0) {
    overlap = overlappingReservations.map((reservation) => {
      return {
        pl: `Konflikt z rezerwacją dokonaną przez ${
          reservation.user_id === newReservationData.user_id
            ? "Ciebie"
            : reservation.username
        }`,
        en: `Conflict with reservation made by ${
          reservation.user_id === newReservationData.user_id
            ? "you"
            : reservation.username
        }
          `,
      };
    });
  }
  return {
    error: overlap ? true : false,
    errorMsg: overlap ? overlap[0] : null,
  };
}

module.exports = {
  checkIfReservationDateIsAllowed,
  checkForOverlapingReservations,
};
