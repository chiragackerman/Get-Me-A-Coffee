export const IST_TIME_ZONE = "Asia/Kolkata";

const IST_OFFSET_MS = 330 * 60 * 1000;

function toDate(value) {
  let date;

  if (value instanceof Date) {
    date = new Date(value.getTime());
  } else if (typeof value === "number") {
    date = new Date(value);
  } else if (
    typeof value === "string"
    && /^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/i.test(value)
  ) {
    date = new Date(value);
  }

  if (!date || Number.isNaN(date.getTime())) {
    throw new TypeError(
      "Expected a valid Date, timestamp, or timezone-qualified ISO timestamp.",
    );
  }

  return date;
}

export function formatDateIST(value, options = {}) {
  const defaultOptions = Object.keys(options).length === 0
    ? { day: "2-digit", month: "short", year: "numeric" }
    : {};

  return new Intl.DateTimeFormat("en-IN", {
    ...defaultOptions,
    ...options,
    timeZone: IST_TIME_ZONE,
  }).format(toDate(value));
}

export function formatDateTimeIST(value, options = {}) {
  const defaultOptions = Object.keys(options).length === 0
    ? { dateStyle: "medium", timeStyle: "short" }
    : {};

  return new Intl.DateTimeFormat("en-IN", {
    ...defaultOptions,
    ...options,
    timeZone: IST_TIME_ZONE,
  }).format(toDate(value));
}

export function getISTDayRange(dateString) {
  const match = typeof dateString === "string"
    ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString)
    : null;

  if (!match) {
    throw new TypeError("Expected a date in YYYY-MM-DD format.");
  }

  const [, yearString, monthString, dayString] = match;
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);
  const midnightUtc = new Date(0);
  midnightUtc.setUTCFullYear(year, month - 1, day);
  midnightUtc.setUTCHours(0, 0, 0, 0);

  if (
    midnightUtc.getUTCFullYear() !== year
    || midnightUtc.getUTCMonth() !== month - 1
    || midnightUtc.getUTCDate() !== day
  ) {
    throw new TypeError("Expected a valid calendar date in YYYY-MM-DD format.");
  }

  const start = new Date(midnightUtc.getTime() - IST_OFFSET_MS);
  const endExclusive = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  return { start, endExclusive };
}
