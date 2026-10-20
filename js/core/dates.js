// Day numbers: whole local days since 1 Jan 1970. All scheduling works in these.

const DAY_MS = 86400000;

export function dayNumber(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / DAY_MS);
}

export function dayToDate(day) {
  const d = new Date(day * DAY_MS);
  // shift back to local midnight
  return new Date(d.getTime() + d.getTimezoneOffset() * 60000);
}

export function dayToISO(day) {
  return new Date(day * DAY_MS).toISOString().slice(0, 10);
}

/** Monday-based week start for a day number (1 Jan 1970 was a Thursday). */
export function weekStart(day) {
  const dow = (day + 3) % 7; // 0 = Monday
  return day - dow;
}

export function monthKey(day) {
  return dayToISO(day).slice(0, 7);
}

export function formatDay(day, opts = { weekday: 'long', day: 'numeric', month: 'long' }) {
  return new Date(day * DAY_MS).toLocaleDateString('en-GB', { ...opts, timeZone: 'UTC' });
}
