// The family goal and notes from a grown-up. Pure helpers: the screens read every child's save,
// pass the states in here, and write back only the shared reward flag (and a grown-up's notes).
// The goal is cooperative: contributions are shown in a fixed order (the order children were
// added), never ranked, and the reward goes to every child when the family total reaches it.

import { weekStart } from './dates.js';
import { COURSES } from './subjects.js';

export const GOAL_TYPES = {
  reading: { label: 'Reading minutes', unit: 'minute', line: (n) => `Read ${n} minutes together this week`, you: (n) => (n ? `You read ${n} minute${n === 1 ? '' : 's'} of it` : 'Every minute you read fills the bar') },
  sessions: { label: 'Daily sessions finished', unit: 'session', line: (n) => `Finish ${n} sessions together this week`, you: (n) => (n ? `You finished ${n} session${n === 1 ? '' : 's'} of them` : 'Every session you finish fills the bar') },
  topics: { label: 'Topics made secure', unit: 'topic', line: (n) => `Make ${n} topics secure together this week`, you: (n) => (n ? `You made ${n} topic${n === 1 ? '' : 's'} secure` : 'Every topic you make secure fills the bar') },
};

// a comfortable week for one child, by age: the family target is the sum, rounded
const PER_CHILD = {
  reading: { young: 70, y6: 100, y8: 120 },
  sessions: { young: 4, y6: 5, y8: 5 },
  topics: { young: 1.5, y6: 2, y8: 2 },
};
const band = (course) => (COURSES[course]?.young ? 'young' : course === 'y8' ? 'y8' : 'y6');

/** The suggested target for these courses (one entry per child). */
export function suggestedTarget(type, courses) {
  const per = PER_CHILD[type] || PER_CHILD.reading;
  const sum = courses.reduce((a, c) => a + per[band(c)], 0);
  if (type !== 'reading') return Math.max(1, Math.round(sum));
  return Math.max(30, sum > 100 ? Math.round(sum / 25) * 25 : Math.round(sum / 10) * 10);
}

export const emptyFamily = () => ({ goal: { type: 'reading', target: null }, signoff: '', weeks: [] });
/** Device-wide family settings, with anything missing filled in (older or damaged data). */
export function normalFamily(f) {
  const base = emptyFamily();
  if (!f || typeof f !== 'object') return base;
  const type = GOAL_TYPES[f.goal?.type] ? f.goal.type : 'reading';
  const target = Number.isFinite(f.goal?.target) && f.goal.target > 0 ? Math.round(f.goal.target) : null;
  return { goal: { type, target }, signoff: typeof f.signoff === 'string' ? f.signoff : '', weeks: Array.isArray(f.weeks) ? f.weeks : [] };
}

const inWeek = (day, ws) => day >= ws && day < ws + 7;

/** How much one child added to a goal of this type in the week starting ws. */
export function contribution(state, type, ws) {
  if (!state) return 0;
  if (type === 'sessions') return (state.sessions || []).filter((s) => s.completed && inWeek(s.day, ws)).length;
  // placement marks topics it finds already known as secure: that is not this week's work
  if (type === 'topics') return Object.values(state.topics || {}).filter((t) => t && !t.assumed && t.profDay != null && inWeek(t.profDay, ws) && ['proficient', 'mastered'].includes(t.state)).length;
  return (state.reading || []).filter((r) => inWeek(r.day, ws)).reduce((a, r) => a + (+r.minutes || 0), 0);
}

/**
 * The family's week: children = [{ id, course, state }] in profile order. The goal's own target,
 * or the suggestion for these children when the grown-up has not set one.
 */
export function familyWeek(children, goal, ws) {
  const type = GOAL_TYPES[goal?.type] ? goal.type : 'reading';
  const target = goal?.target || suggestedTarget(type, children.map((c) => c.course));
  const parts = children.map((c) => ({ id: c.id, amount: contribution(c.state, type, ws) }));
  const total = parts.reduce((a, p) => a + p.amount, 0);
  return { ws, type, target, total, reached: total >= target, parts };
}

export const KEEP_WEEKS = 6;
/**
 * Note this week's result in the family record (kept for a few weeks). A week that was reached
 * stays reached, even if a later change (a new target) would say otherwise. Returns true if it changed.
 */
export function recordWeek(family, week, today) {
  const at = family.weeks.findIndex((w) => w.ws === week.ws);
  const old = at >= 0 ? family.weeks[at] : null;
  const next = { ws: week.ws, type: week.type, target: week.target, total: week.total, reached: !!(old?.reached || week.reached), reachedDay: old?.reachedDay ?? (week.reached ? today : null) };
  if (old?.reached) Object.assign(next, { type: old.type, target: old.target, total: Math.max(old.total, old.type === week.type ? week.total : 0) });
  if (old && JSON.stringify(old) === JSON.stringify(next)) return false;
  if (at >= 0) family.weeks[at] = next; else family.weeks.push(next);
  family.weeks.sort((a, b) => a.ws - b.ws);
  while (family.weeks.length > KEEP_WEEKS) family.weeks.shift();
  return true;
}

/** Weeks the family has reached its goal. */
export const goalsReached = (family) => family.weeks.filter((w) => w.reached).length;

// --- the reward: fixed, the same for every child, and never taken away -------------------
export const FAMILY_SCENE = 'picnic';
export const familyOf = (state) => ({ reward: null, celebrated: [], ...(state.family || {}) });
export const hasFamilyReward = (state) => state.family?.reward != null;

/** Set the shared reward flag (the one thing written into every child's save). True if it was new. */
export function grantReward(state, today) {
  if (hasFamilyReward(state)) return false;
  state.family = { ...familyOf(state), reward: today };
  return true;
}

/** A reached week this child has not celebrated yet: this week, or last week if they missed it. */
export function celebrationDue(state, family, today) {
  const ws = weekStart(today);
  const seen = new Set(familyOf(state).celebrated);
  return family.weeks.filter((w) => w.reached && w.ws >= ws - 7 && !seen.has(w.ws)).at(-1) || null;
}

export function markCelebrated(state, ws) {
  const f = familyOf(state);
  state.family = { ...f, celebrated: [...new Set([...f.celebrated, ws])].sort((a, b) => a - b).slice(-KEEP_WEEKS) };
}

// --- notes and stickers from a grown-up -----------------------------------------------------
export const NOTE_MAX = 200;
const KEEP_NOTES = 30;

/** A note (and/or sticker) for this child. `at` is a timestamp, so two on one day keep their order. */
export function addNote(state, { text = '', sticker = null, from = '' }, today, at = Date.now()) {
  const t = String(text).trim().slice(0, NOTE_MAX);
  if (!t && !sticker) return null;
  const note = { id: `n${at.toString(36)}`, day: today, at, text: t, sticker: sticker || null, from: String(from).trim().slice(0, 30), shown: null, thanked: null };
  state.notes = [...(state.notes || []), note].slice(-KEEP_NOTES);
  return note;
}

/** The oldest note not yet popped up on the home screen. */
export const nextNewNote = (state) => (state.notes || []).find((n) => n.shown == null) || null;
export function markShown(note, today) { if (note.shown == null) note.shown = today; }
export function thankNote(note, today) {
  markShown(note, today);
  if (note.thanked == null) note.thanked = today;
}
/** What the grown-up sees: waiting, seen, or thanked. */
export const noteStatus = (note) => (note.thanked != null ? 'thanked' : note.shown != null ? 'seen' : 'waiting');
export const signedBy = (note) => (note.from ? note.from : 'your grown-up');
