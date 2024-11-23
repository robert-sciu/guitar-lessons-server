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

  // series of checks veryfying the date
  const today = new Date().toISOString().split("T")[0];
  const reservationStartDate = data.start_UTC.split("T")[0];

  if (reservationStartDate < today) {
    return {
      error: true,
      errorMsg: {
        pl: "Data rezerwacji nie może być w przeszłości",
        en: "Reservation date cannot be in the past",
      },
    };
  }
  if (reservationStartDate === today) {
    return {
      error: true,
      errorMsg: {
        pl: "Data rezerwacji nie może być dzisiaj",
        en: "Reservation date cannot be today",
      },
    };
  }
  if (
    Math.abs(
      (new Date(reservationStartDate) - new Date(today)) / (24 * 60 * 60 * 1000)
    ) >= 14
  ) {
    return {
      error: true,
      errorMsg: {
        pl: "Data rezerwacji nie może być dalej jak 14 dni w przyszłości",
        en: "Reservation date cannot be more than 14 days in the future",
      },
    };
  }

  // if date is valid then we check time

  const duration = data.duration;
  if (duration < 30 || duration > 120) {
    return {
      error: true,
      errorMsg: {
        pl: "Długość rezerwacji musi być pomiędzy 30 i 180 minutami",
        en: "Reservation duration must be between 30 and 180 minutes",
      },
    };
  }

  const startHourUTC = "07:00:00";
  const endHourUTC = "21:00:00";

  const reservationStartHour = data.start_UTC.split("T")[1].split(".")[0];
  const reservationEndHour = data.end_UTC.split("T")[1].split(".")[0];

  if (reservationStartHour > reservationEndHour) {
    return {
      error: true,
      errorMsg: {
        pl: "Początkowy czas rezerwacji musi być mniejszy od koncowego czasu rezerwacji",
        en: "Start time of reservation must be less than end time of reservation",
      },
    };
  }

  if (reservationStartHour < startHourUTC || reservationEndHour > endHourUTC) {
    return {
      error: true,
      errorMsg: {
        pl: "Czas rezerwacji musi zawierać się w dostępnych godzinach",
        en: "Reservation time is not within the allowed time frame",
      },
    };
  }

  return {
    error: false,
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
          [Op.lt]: end_UTC,
        },
        end_UTC: {
          [Op.gt]: start_UTC,
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
