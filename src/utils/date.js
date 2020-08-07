// @flow
import {
  format,
  min,
  max,
  startOfDay,
  endOfDay,
  isValid,
  isBefore,
  isAfter,
  differenceInCalendarDays,
  differenceInMinutes,
  addDays,
  addWeeks,
  addMonths,
} from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

export {
  min as earliest,
  max as latest,
  isBefore,
  isAfter,
  differenceInCalendarDays,
  differenceInMinutes,
  addDays,
  addWeeks,
  addMonths,
  startOfDay,
  format,
  isValid,
};

export const isValidDate = (date: any): boolean => !!date && isValid(new Date(date));

export const isDateObject = (date: any): boolean => date instanceof Date;

export const formatDateInputToDateObjectWithTimezone = (
  date: ?string,
  timeZone: string
): Date | null =>
  !!date && isValidDate(date)
    ? zonedTimeToUtc(
        new Date(
          parseInt(date.substring(0, 4), 10),
          parseInt(date.substring(5, 7), 10) - 1,
          parseInt(date.substring(8, 10), 10)
        ),
        timeZone
      )
    : null;

// (2020-01-01T12:12, +09:00) => Date Object with Timezone
export const formatDatetimeInputToDateObjectWithTimezone = (
  date: ?string,
  timeZone: string
): Date | null =>
  !!date && isValidDate(date)
    ? zonedTimeToUtc(
        new Date(
          parseInt(date.substring(0, 4), 10),
          parseInt(date.substring(5, 7), 10) - 1,
          parseInt(date.substring(8, 10), 10),
          parseInt(date.substring(11, 13), 10),
          parseInt(date.substring(14, 16), 10)
        ),
        timeZone
      )
    : null;

// (Date Object with Timezone, +09:00) => 2020-01-01T12:12
export const formatDateObjectWithTimezoneToDatetimeInput = (
  date: ?Date,
  timezone: string
): string =>
  !!date && isValid(new Date(date))
    ? format(zonedTimeToUtc(date, timezone), "yyyy-MM-dd'T'HH:mm")
    : '';

export const formatUTCDateToDateObjectWithTimezone = (
  date: ?string,
  timezone: string
): Date | null => {
  if (!!date && isValidDate(date)) {
    if (date.substring(date.length - 1, date.length) === 'Z') {
      return utcToZonedTime(date, timezone);
    }
    return new Date(date);
  }
  return null;
};

export const formatDateObjectWithTimezoneForMutation = (date: ?Date): string | null =>
  !!date && isValidDate(date) ? format(date, "yyyy-MM-dd'T'HH:mmxxx") : null;

export const formatToDateInput = (date: string): string =>
  isValid(new Date(date)) ? format(new Date(date), 'yyyy-MM-dd') : '';

export const formatToDateTimeInput = (date: string): string =>
  isValid(new Date(date))
    ? format(
        new Date(
          parseInt(date.substring(0, 4), 10),
          parseInt(date.substring(5, 7), 10) - 1,
          parseInt(date.substring(8, 10), 10),
          parseInt(date.substring(11, 13), 10),
          parseInt(date.substring(14, 16), 10)
        ),
        "yyyy-MM-dd'T'HH:mm"
      )
    : '';

export const formatDatetimeForMutation = (date: string): string => {
  return format(
    new Date(
      parseInt(date.substring(0, 4), 10),
      parseInt(date.substring(5, 7), 10) - 1,
      parseInt(date.substring(8, 10), 10),
      parseInt(date.substring(11, 13), 10),
      parseInt(date.substring(14, 16), 10)
    ),
    "yyyy-MM-dd'T'HH:mm:'00Z'"
  );
};

export const formatDateToGraphql = (date: Date): string => format(date, "yyyy-MM-dd'T'HH:mm:ssxxx");

export const formatToDateLabel = (date: string): string => format(new Date(date), 'dd/MM/yyyy');
// We need to convert to UTC timezone for backend
const utcTimeZone = 'UTC';
export const formatFromDate = (date: string): Date =>
  zonedTimeToUtc(startOfDay(new Date(date)), utcTimeZone);
export const formatEndDate = (date: string): Date =>
  zonedTimeToUtc(endOfDay(new Date(date)), utcTimeZone);

export const startOfToday = (): Date => zonedTimeToUtc(startOfDay(new Date()), utcTimeZone);

export const todayForDateInput = (): string =>
  formatToDateInput(zonedTimeToUtc(startOfDay(new Date()), utcTimeZone));

// --- date binding utils ---
const DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss'Z";
export const calculateDate = ({
  date: selectedDate,
  duration,
  offset = 0,
}: {
  date: ?Date | ?string,
  duration: 'days' | 'weeks' | 'months',
  offset: number,
}) => {
  if (!selectedDate) return null;

  const date = new Date(selectedDate);

  if (!isValid(date)) {
    return null;
  }

  switch (duration) {
    case 'weeks':
      return format(startOfDay(addWeeks(date, offset)), DATE_FORMAT);

    case 'months':
      return format(startOfDay(addMonths(date, offset)), DATE_FORMAT);

    default:
      return format(startOfDay(addDays(date, offset)), DATE_FORMAT);
  }
};

export const findDuration = ({
  months,
  weeks,
}: {
  months: number,
  weeks: number,
}): 'days' | 'weeks' | 'months' => {
  let duration = 'days';
  if (Math.abs(months) > 0) {
    duration = 'months';
  } else if (Math.abs(weeks) > 0) {
    duration = 'weeks';
  }
  return duration;
};

export const calculateNewDate = ({
  date,
  dateInterval,
}: {
  date: ?string,
  dateInterval?: Object,
}) => {
  const { months, weeks, days } = dateInterval || {};
  return calculateDate({
    date,
    duration: findDuration({ months, weeks }),
    offset: months || weeks || days,
  });
};

export const calculateDueDate = (freeTimeStartDate: string, freeTimeDuration: number = 0) =>
  addDays(new Date(freeTimeStartDate), freeTimeDuration);
