// A daily allowance for dressing up the companion (the wardrobe, scenes and changing companion),
// so the character never crowds out the learning. Counted per child, per day; a grown-up can
// change the allowance in Settings (0 = no limit).

export const DRESSUP_DEFAULT_MINUTES = 15;
export const DRESSUP_CHOICES = [5, 10, 15, 20, 30, 0];

/** The daily allowance in minutes; 0 means no limit. */
export function dressUpMinutes(settings = {}) {
  const m = settings.dressUpMinutes;
  return Number.isFinite(m) && m >= 0 ? m : DRESSUP_DEFAULT_MINUTES;
}

/** Milliseconds already spent dressing up today. */
export function dressUpUsed(state, today) {
  const d = state.dressUp;
  return d && d.day === today ? d.ms || 0 : 0;
}

/** Milliseconds left today (Infinity with no limit). */
export function dressUpLeft(state, today) {
  const mins = dressUpMinutes(state.settings);
  if (!mins) return Infinity;
  return Math.max(0, mins * 60000 - dressUpUsed(state, today));
}

/** Add time spent; a new day starts from nothing. */
export function addDressUp(state, today, ms) {
  if (!(ms > 0)) return;
  state.dressUp = { day: today, ms: dressUpUsed(state, today) + Math.round(ms) };
}

/** "12 minutes", "1 minute", "less than a minute". */
export function minutesText(ms) {
  const m = Math.floor(ms / 60000);
  return m < 1 ? 'less than a minute' : `${m} minute${m === 1 ? '' : 's'}`;
}
