// Daily quests and the gentle streak. Everything is worked out from what the child really did
// (sessions, reading log, library, book talks, handwriting, sprints, extra practice): nothing is
// ticked by hand, and nothing is left to chance.
//
// Quests: three a day. The first is always today's session; the other two come from a fixed
// rotation for the course, turning over by day and skipping anything not open today. The choice
// is stored for the day (state.quests) so the card does not change once something is done.
//
// Streak: days with the session finished. Every 7 days of streak earns a rest day (at most 2
// saved). A missed day uses a saved rest day automatically; with none saved the streak quietly
// starts again. It never goes down for today, which is not over yet.

import { COURSE, SUBJECT_BY_ID } from './subjects.js';
import { extraStatus, bonusStatusLine, bonusProgress } from './session.js';
import { sprintDue } from './sprint.js';
import { pieceDue, currentPiece, nextPrompt } from './writing.js';
import { weekStart } from './dates.js';

export const READ_MINUTES = 10;
export const EXTRA_ANSWERS = 5; // answers outside the daily session that count as "practised"
export const CHAPTER_SECONDS = 30; // a chapter turned over sooner than this was not read

// the order the second and third quests come round in; each course uses the ones it has
const ROTATION = ['read', 'extra', 'talk', 'sprint', 'handwriting', 'chapter', 'bonus', 'writing'];

export function questRotation(course = COURSE) {
  return ROTATION.filter((id) => {
    if (id === 'talk') return !!course.young;
    if (id === 'handwriting') return (course.tools || []).includes('handwriting');
    if (id === 'extra') return (course.extra || []).length > 0;
    if (id === 'bonus') return !!course.bonus;
    if (id === 'writing') return !!course.writing;
    return true;
  });
}

const todayPlan = (state, today) => (state.plan?.day === today ? state.plan : null);
export const sessionDoneOn = (state, day) => state.sessions.some((s) => s.day === day && s.completed);

/** Minutes read today: the reading log, which the library reader also writes to. */
export const readingToday = (state, today) => (state.reading || []).filter((r) => r.day === today).reduce((a, r) => a + (r.minutes || 0), 0);

/**
 * Answers given today outside the daily session to items matching `pred` (extra Latin or Greek,
 * the bonus topic): today's log, less what today's session itself answered. Placement checks
 * are part of the session, so they never count.
 */
export function answersOutside(state, db, today, pred) {
  let inLog = 0;
  const log = state.log || [];
  for (let i = log.length - 1; i >= 0 && log[i][0] >= today; i--) {
    const e = log[i];
    if (e[0] === today && e[8] !== 'placement' && db.items[e[2]] && pred(db.items[e[2]])) inLog++;
  }
  const plan = todayPlan(state, today);
  // the session's faded worked examples are graded without a log entry
  const inPlan = plan ? plan.results.filter((r) => r.t !== 'faded' && db.items[r.id] && pred(db.items[r.id])).length : 0;
  return Math.max(0, inLog - inPlan);
}

/** Today's sprint target: her best of the last few sprints, between 5 and 10 (young) or 15. */
export function sprintTarget(state, course = COURSE) {
  const cap = course.young ? 10 : 15;
  const recent = (state.sprints || []).slice(-5).map((s) => s.correct);
  return Math.max(5, Math.min(cap, recent.length ? Math.max(...recent) : 5));
}

/** Can this quest be done today? (Only asked when the day's quests are chosen.) */
function available(id, state, db, today) {
  switch (id) {
    case 'read': case 'talk': case 'handwriting': case 'chapter': return true;
    case 'extra': return (COURSE.extra || []).some((s) => { const st = extraStatus(state, db, today, s); return st.due > 0 || st.fresh; });
    case 'bonus': {
      const bp = bonusProgress(state, db);
      return !!bp?.total && !bp.prized && !bonusStatusLine(state, db, today).empty;
    }
    case 'sprint': {
      const plan = todayPlan(state, today);
      return sprintDue(state) && !(state.sprints || []).some((s) => s.day === today) && !plan?.finished;
    }
    case 'writing': return pieceDue(state, today) && !currentPiece(state) && !!nextPrompt(state, db);
    default: return false;
  }
}

/** The day's three quests: the session, then the next two open ones in the rotation. */
export function chooseQuests(state, db, today, course = COURSE) {
  const rot = questRotation(course);
  const list = [{ id: 'session' }];
  const start = rot.length ? (((today * 2) % rot.length) + rot.length) % rot.length : 0;
  for (let k = 0; k < rot.length && list.length < 3; k++) {
    const id = rot[(start + k) % rot.length];
    if (!available(id, state, db, today)) continue;
    list.push(id === 'sprint' ? { id, target: sprintTarget(state, course) } : { id });
  }
  // a day when little is open: reading is always possible
  if (list.length < 3 && !list.some((q) => q.id === 'read')) list.push({ id: 'read' });
  if (list.length < 3 && !list.some((q) => q.id === 'chapter')) list.push({ id: 'chapter' });
  return list;
}

/** Today's quests, chosen once and kept all day (mutates state; save afterwards). */
export function ensureQuests(state, db, today) {
  if (state.quests?.day !== today) state.quests = { day: today, list: chooseQuests(state, db, today), celebrated: false };
  return state.quests;
}

/** One quest's words, where it leads, and whether it is done (from real state only). */
export function questStatus(q, state, db, today, course = COURSE) {
  const extraName = (course.extra || []).map((s) => SUBJECT_BY_ID[s]?.name || s).join(' or ');
  switch (q.id) {
    case 'session': return { ...q, title: 'Finish today’s session', go: '#/play', done: sessionDoneOn(state, today) };
    case 'read': {
      const m = readingToday(state, today);
      return { ...q, title: `Read for ${READ_MINUTES} minutes`, hint: m && m < READ_MINUTES ? `${m} of ${READ_MINUTES} minutes so far` : 'A book of your own, or one from the library', go: '#/reading', done: m >= READ_MINUTES };
    }
    case 'talk': return { ...q, title: 'Have a book talk', hint: 'Chat about your book with your grown-up', go: '#/reading', done: (state.talks || []).some((t) => t.day === today) };
    case 'handwriting': return { ...q, title: 'Do a handwriting lesson', hint: 'A lesson or the warm-up', go: '#/handwriting', done: (state.handwriting?.days || []).includes(today) };
    case 'extra': {
      const n = answersOutside(state, db, today, (it) => (course.extra || []).includes(it.subject));
      const ex = state.extra;
      const finished = ex?.day === today && ex.finished && !ex.bonus && ex.results.length > 0;
      return { ...q, title: `Practise ${extraName}`, hint: 'Any time, as well as today’s session', go: `#/play/${(course.extra || [])[0]}`, done: n >= EXTRA_ANSWERS || finished };
    }
    case 'bonus': {
      const id = course.bonus?.id;
      const n = answersOutside(state, db, today, (it) => db.topics[it.topic]?.bonus === id);
      const ex = state.extra;
      const finished = ex?.day === today && ex.finished && ex.bonus === id && ex.results.length > 0;
      return { ...q, title: `Do a bonus lesson: ${course.bonus?.title || ''}`.trim(), go: '#/play/bonus', done: n >= EXTRA_ANSWERS || finished };
    }
    case 'sprint': {
      const best = Math.max(-1, ...(state.sprints || []).filter((s) => s.day === today).map((s) => s.correct));
      return { ...q, title: `Get ${q.target} right in the sprint`, hint: best >= 0 && best < q.target ? `${best} today: so close!` : 'The sprint is part of today’s session', go: '#/play', done: best >= q.target };
    }
    case 'chapter': return { ...q, title: 'Read a chapter in the library', hint: 'Turn to the next chapter, or finish the book', go: '#/reading', done: (state.chapters || []).some((c) => c.day === today) };
    case 'writing': return { ...q, title: 'Start your weekly writing', go: '#/writing', done: (state.pieces || []).some((p) => p.startDay === today || p.submittedDay === today) };
    default: return { ...q, title: q.id, done: false };
  }
}

export function todaysQuests(state, db, today, course = COURSE) {
  const qs = ensureQuests(state, db, today);
  const list = qs.list.map((q) => questStatus(q, state, db, today, course));
  return { list, done: list.filter((q) => q.done).length, all: list.every((q) => q.done), celebrated: !!qs.celebrated };
}

// --- library chapters -----------------------------------------------------------------

/** A chapter read in the library reader (once per chapter a day). */
export function noteChapter(state, bookId, ch, today) {
  state.chapters ||= [];
  if (state.chapters.some((c) => c.day === today && c.book === bookId && c.ch === ch)) return false;
  state.chapters.push({ day: today, book: bookId, ch });
  return true;
}

// --- the gentle streak ----------------------------------------------------------------
export const REST_EVERY = 7;
export const REST_MAX = 2;

/**
 * The streak up to today. `days` marks each day since the first session: 'done', 'rest' (a saved
 * rest day used) or 'missed'. `fresh` is true when the streak has started again and today's
 * session is not done yet. `toNext` is sessions until the next rest day (null when 2 are saved).
 */
export function streakInfo(state, today) {
  const done = new Set((state.sessions || []).filter((s) => s.completed && s.day <= today).map((s) => s.day));
  const days = {};
  let streak = 0, bank = 0, best = 0, fresh = false, used = 0;
  if (done.size) {
    for (let d = Math.min(...done); d <= today; d++) {
      if (done.has(d)) {
        streak++;
        days[d] = 'done';
        fresh = false;
        if (streak % REST_EVERY === 0) bank = Math.min(REST_MAX, bank + 1);
        best = Math.max(best, streak);
      } else if (d === today) {
        // the day is not over: nothing is used or lost yet
      } else if (streak === 0) {
        days[d] = 'missed';
      } else if (bank > 0) {
        bank--;
        used++;
        days[d] = 'rest';
      } else {
        streak = 0;
        days[d] = 'missed';
        fresh = true;
      }
    }
  }
  return { streak, bank, best, used, fresh, doneToday: done.has(today), toNext: bank >= REST_MAX ? null : REST_EVERY - (streak % REST_EVERY), days };
}

/** The best streak ever (for badges): the streak worked out up to the last session. */
export function bestStreak(state) {
  const days = (state.sessions || []).filter((s) => s.completed).map((s) => s.day);
  return days.length ? streakInfo(state, Math.max(...days)).best : 0;
}

/**
 * The last `weeks` weeks, Monday first, ending with this week: each day as
 * { day, status: 'done' | 'rest' | 'missed' | 'open' (today, not done yet) | 'future' | 'before', today }.
 */
export function streakCalendar(state, today, weeks = 4) {
  const info = streakInfo(state, today);
  const start = weekStart(today) - (weeks - 1) * 7;
  const out = [];
  for (let w = 0; w < weeks; w++) {
    const row = [];
    for (let i = 0; i < 7; i++) {
      const day = start + w * 7 + i;
      const status = info.days[day] || (day > today ? 'future' : day === today ? 'open' : 'before');
      row.push({ day, status, today: day === today });
    }
    out.push(row);
  }
  return { weeks: out, info };
}

/** One kind line about the streak for the quests card (never shaming). */
export function streakLine(info, young = COURSE.young) {
  if (info.fresh) return 'A fresh start today!';
  if (!info.streak) return young ? 'Finish today’s session to start a streak!' : 'Finish today’s session to start a streak.';
  const n = `${info.streak}-day streak`;
  return info.doneToday ? `${n}. See you tomorrow!` : `${n}. Keep it going today!`;
}
