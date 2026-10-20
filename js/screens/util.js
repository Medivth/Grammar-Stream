// Shared screen helpers.

const toMin = (hhmm) => {
  const [hh, mm] = String(hhmm || '00:00').split(':').map(Number);
  return hh * 60 + (mm || 0);
};

/** Returns a message if it is rest time (the hour before bed until morning), otherwise null. */
export function restTime(settings, now = new Date()) {
  const t = now.getHours() * 60 + now.getMinutes();
  const bed = toMin(settings.bedtime || '20:30');
  const lockFrom = (bed - 60 + 1440) % 1440;
  const wake = toMin(settings.earliest || '06:30');
  const locked = lockFrom < wake ? t >= lockFrom && t < wake : t >= lockFrom || t < wake;
  if (!locked) return null;
  return t < wake ? 'It’s too early! Sessions start after breakfast.' : 'Screens rest in the hour before bed. Time for a book instead!';
}
