// The weekly challenge: a short mixed race, once a week (the week starts on Monday), against a
// ghost of her own run from last time. Questions come from things she already knows well (secure
// topics, facts in review) mixed with sprint-style arithmetic. It is a game on known material, so
// it never changes memory scheduling. Results live in state.challenges:
// [{ week, day, correct, answered, ms, finished, times: [ms of each right answer] }].

import { COURSE } from './subjects.js';
import { weekStart } from './dates.js';
import { makeRng } from './rng.js';
import { isKnown } from './progress.js';
import { sprintLevel } from './sprint.js';

export const CHALLENGE_GOAL = 10; // right answers to reach the finish line
export const CHALLENGE_MS = 120000; // or two minutes, whichever comes first

const THEMES = {
  grandprix: { id: 'grandprix', title: 'Grand Prix', name: 'the Weekly Grand Prix', you: 'your car', ghost: 'the ghost car', finish: 'the chequered flag', pitch: 'Race last week’s you round the track!' },
  rocket: { id: 'rocket', title: 'Rocket race', name: 'the Weekly Rocket Race', you: 'your rocket', ghost: 'the ghost rocket', finish: 'the ringed planet', pitch: 'Race last week’s you to the ringed planet!' },
  olympiad: { id: 'olympiad', title: 'Olympiad', name: 'the Weekly Olympiad', you: 'your chariot', ghost: 'the ghost chariot', finish: 'the victor’s wreath', pitch: 'Race last week’s you round the stadium at Olympia!' },
};
/** Years 2 and 3 race cars, Year 6 flies rockets, Year 8 drives a chariot at Olympia. */
export const challengeTheme = (course = COURSE) => THEMES[course.young ? 'grandprix' : course.id === 'y8' ? 'olympiad' : 'rocket'];

/** This week's result, if she has raced already. */
export const challengeThisWeek = (state, today) => (state.challenges || []).find((c) => c.week === weekStart(today)) || null;

/** The ghost: her most recent run from an earlier week (usually last week's), or null. */
export function ghostFor(state, today) {
  const wk = weekStart(today);
  const earlier = (state.challenges || []).filter((c) => c.week < wk).sort((a, b) => b.week - a.week);
  if (!earlier.length) return null;
  return { ...earlier[0], weeksAgo: Math.round((wk - earlier[0].week) / 7) };
}

/** What the home card needs: open this week or done, the ghost, and when the next one opens. */
export function challengeStatus(state, today) {
  const run = challengeThisWeek(state, today);
  return { open: !run, run, ghost: ghostFor(state, today), nextWeek: weekStart(today) + 7, theme: challengeTheme() };
}

/** Quick questions from what she knows: no pictures, maps or passages, so they can be raced. */
export function challengeItems(state, db, today, n = 12) {
  const secure = (tid) => ['proficient', 'mastered'].includes(state.topics[tid]?.state);
  const ids = Object.entries(state.cards).filter(([id, c]) => {
    const it = db.items[id];
    if (!it || !isKnown(c) || !secure(it.topic)) return false;
    if (it.visual || it.image || it.map || it.passage || it.diagram || db.topics[it.topic]?.kind === 'reading') return false;
    if (String(it.prompt || '').length > 160) return false;
    if (it.kind === 'fact') return !!it.answer && (!it.formats || it.formats.includes('choice')) && ((it.distractors || []).length > 0 || (db.itemsByTopic[it.topic] || []).length > 3);
    return it.kind === 'mcq' && (it.options || []).length > 1;
  }).map(([id]) => id).sort();
  return makeRng(`challenge:${weekStart(today)}:${state.created}`).shuffle(ids).slice(0, n);
}

/**
 * The race's question order: a fact, then a sum, and so on, so both kinds of practice get a turn
 * (all sums when there is nothing secure yet). Entries are { item } or { sum: level }.
 */
export function challengePlan(state, db, today, length = 30) {
  const items = challengeItems(state, db, today);
  const level = Math.max(1, sprintLevel(state) - 1); // a notch easier than the sprint: it is a race
  const out = [];
  let f = 0;
  for (let i = 0; i < length; i++) out.push(i % 2 === 0 && f < items.length ? { item: items[f++] } : { sum: level });
  return { week: weekStart(today), level, steps: out, facts: items.length };
}

/** Where a run had got to `ms` into its race, from 0 (start) to 1 (finish), gliding between right answers. */
export function runPosition(run, ms) {
  if (!run) return 0;
  const t = run.times || [];
  let k = 0;
  while (k < t.length && t[k] <= ms) k++;
  if (k >= t.length) return Math.min(1, k / CHALLENGE_GOAL); // no more right answers to come
  const prev = k ? t[k - 1] : 0;
  return Math.min(1, (k + (ms - prev) / Math.max(1, t[k] - prev)) / CHALLENGE_GOAL);
}

/** Better run first: reaching the finish beats not reaching it; then sooner, or more right. */
export function compareRuns(a, b) {
  if (a.finished !== b.finished) return a.finished ? 1 : -1;
  if (a.finished) return b.ms - a.ms;
  return a.correct - b.correct;
}

/**
 * How this run went against the ghost, in words for a child: { kind: 'first' | 'beat' | 'level'
 * | 'behind', by, unit: 'seconds' | 'answers' }.
 */
export function raceResult(run, ghost) {
  if (!ghost) return { kind: 'first' };
  if (run.finished && ghost.finished) {
    const secs = Math.round((ghost.ms - run.ms) / 1000);
    if (secs === 0) return { kind: 'level' };
    return { kind: secs > 0 ? 'beat' : 'behind', by: Math.abs(secs), unit: 'seconds' };
  }
  if (run.finished !== ghost.finished) {
    const by = Math.max(1, CHALLENGE_GOAL - (run.finished ? ghost.correct : run.correct));
    return { kind: run.finished ? 'beat' : 'behind', by, unit: 'answers' };
  }
  const d = run.correct - ghost.correct;
  return d === 0 ? { kind: 'level' } : { kind: d > 0 ? 'beat' : 'behind', by: Math.abs(d), unit: 'answers' };
}

/** The result line: celebrate a win, warm words otherwise (never a telling-off). */
export function resultLine(res, ghost, theme = challengeTheme()) {
  const who = ghost?.weeksAgo > 1 ? 'your last run' : 'last week’s you';
  const amount = (r) => (r.unit === 'seconds' ? `${r.by} second${r.by === 1 ? '' : 's'}` : String(r.by));
  switch (res.kind) {
    case 'first': return { head: 'Your first run!', text: `Next week you’ll race ${theme.ghost}: this run.` };
    case 'beat': return { head: `You beat ${who} by ${amount(res)}!`, text: 'All that practice is paying off.' };
    case 'level': return { head: `Neck and neck with ${who}!`, text: 'Exactly as good as before. Next week, see if you can edge ahead.' };
    default: return { head: res.unit === 'seconds' ? `${who[0].toUpperCase() + who.slice(1)} was ${amount(res)} quicker this time` : `So close: just ${amount(res)} behind ${who}`, text: 'Every week of practice makes you quicker. Next week you’ll race this run.' };
  }
}

/** Store this week's run (once a week: a second run in the same week is ignored). */
export function recordChallenge(state, run, today) {
  state.challenges ||= [];
  if (challengeThisWeek(state, today)) return false;
  state.challenges.push({ week: weekStart(today), day: today, correct: run.correct, answered: run.answered, ms: Math.round(run.ms), finished: !!run.finished, times: run.times.map(Math.round) });
  return true;
}
