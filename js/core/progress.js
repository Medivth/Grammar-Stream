// Visible progress: what she knows, milestones, timeline and places. Derived only; never stored.

import { topicStatus } from './mastery.js';
import { SUBJECTS } from './subjects.js';
import { monthKey } from './dates.js';
import { calibration } from './session.js';

/** An item counts as known once it is in review and has been recalled at least once. */
export const isKnown = (c) => !!c && c.state === 'review' && (c.assumed || c.s >= 2);

export function learnedCount(state) {
  return Object.values(state.cards).filter(isKnown).length;
}

export function subjectStats(state, db, subject) {
  const ids = db.topicOrder[subject] || [];
  const st = ids.map((id) => topicStatus(db.topics[id], state.topics, db));
  const items = ids.flatMap((id) => db.itemsByTopic[id] || []);
  return {
    total: ids.length,
    secure: st.filter((x) => x === 'proficient').length,
    mastered: st.filter((x) => x === 'mastered').length,
    learning: st.filter((x) => x === 'learning').length,
    known: items.filter((i) => isKnown(state.cards[i])).length,
    items: items.length,
  };
}

export function timelineStatus(state, db) {
  const t = db.timeline || { periods: [], events: [] };
  return {
    periods: t.periods,
    events: t.events.map((e) => ({ ...e, known: e.items.some((i) => isKnown(state.cards[i])) })),
  };
}

/** Countries and places she knows, from map and capital questions. */
export function placesStatus(state, db) {
  const out = { world: new Set(), europe: new Set(), uk: new Set() };
  for (const item of Object.values(db.items)) {
    if (!item.map || !item.feature || !out[item.map]) continue;
    if (item.kind !== 'mapfact' && item.kind !== 'fact') continue;
    if (item.kind === 'mapfact' && !['countries', 'features', 'markers', 'rivers'].includes(item.layer)) continue;
    if (isKnown(state.cards[item.id])) out[item.map].add(item.feature);
  }
  const totals = { world: new Set(), europe: new Set(), uk: new Set() };
  for (const item of Object.values(db.items)) if (item.map && item.feature && totals[item.map]) totals[item.map].add(item.feature);
  return { known: out, totals };
}

// Milestones are fixed rewards for real achievement (never random). Some unlock capybara accessories.
export const MILESTONES = [
  { id: 'first-session', title: 'First steps', desc: 'Finish your first session', goal: 1, measure: (s) => s.sessions.filter((x) => x.completed).length },
  { id: 'first-mastered', title: 'Topic tamer', desc: 'Master your first topic', goal: 1, measure: (s) => Object.values(s.topics).filter((t) => t.state === 'mastered').length, unlock: 'sunglasses' },
  { id: 'hundred', title: 'Century', desc: 'Know 100 things', goal: 100, measure: (s) => learnedCount(s), unlock: 'headphones' },
  { id: 'all-rounder', title: 'All-rounder', desc: 'A secure topic in every subject', goal: SUBJECTS.length, measure: (s, db) => SUBJECTS.filter((sub) => Object.entries(s.topics).some(([id, t]) => db.topics[id]?.subject === sub.id && ['proficient', 'mastered'].includes(t.state))).length, unlock: 'beanie' },
  { id: 'globetrotter', title: 'Globetrotter', desc: 'Know 25 countries', goal: 25, measure: (s, db) => { const p = placesStatus(s, db); return p.known.world.size + [...p.known.europe].filter((x) => !p.known.world.has(x)).length; }, unlock: 'explorer' },
  { id: 'time-traveller', title: 'Time traveller', desc: 'Light up 12 events on the timeline', goal: 12, measure: (s, db) => timelineStatus(s, db).events.filter((e) => e.known).length },
  { id: 'lab-ready', title: 'Lab ready', desc: 'Secure 5 science topics', goal: 5, measure: (s, db) => Object.entries(s.topics).filter(([id, t]) => db.topics[id]?.subject === 'science' && ['proficient', 'mastered'].includes(t.state)).length, unlock: 'goggles' },
  { id: 'stretch', title: 'Beyond the syllabus', desc: 'Secure 5 stretch topics', goal: 5, measure: (s, db) => Object.entries(s.topics).filter(([id, t]) => db.topics[id]?.tier === 'stretch' && ['proficient', 'mastered'].includes(t.state)).length, unlock: 'crown' },
  { id: 'typist', title: 'Typist', desc: 'Type 30 words a minute with 95% accuracy', goal: 30, measure: (s) => (s.typing?.best?.wpm) || 0 },
  { id: 'speed-reader', title: 'Speed reader', desc: 'Read at 200 words a minute and still get 3 of 4 right', goal: 200, measure: (s) => Math.max(0, ...(s.speed || []).filter((r) => r.total && r.correct / r.total >= 0.75).map((r) => r.wpm)) },
  { id: 'paper', title: 'Test ready', desc: 'Score 32 or more on an arithmetic paper', goal: 32, measure: (s) => Math.max(0, ...(s.papers || []).map((p) => p.score)) },
  { id: 'sprinter', title: 'Sprinter', desc: 'Get 20 right in one arithmetic sprint', goal: 20, measure: (s) => Math.max(0, ...(s.sprints || []).map((x) => x.correct)) },
  { id: 'joined-up', title: 'Joined-up thinker', desc: 'Get 30 right in topics that mix subjects', goal: 30, measure: (s, db) => s.log.filter((x) => x[3] && db.topics[db.items[x[2]]?.topic]?.links).length },
  { id: 'wordsmith', title: 'Wordsmith', desc: 'Hand in 3 weekly writing pieces', goal: 3, measure: (s) => (s.pieces || []).filter((p) => p.submittedDay).length },
  { id: 'bookworm', title: 'Bookworm', desc: 'Finish 3 books', goal: 3, measure: (s) => (s.books || []).filter((b) => b.endDay).length, unlock: 'backpack' },
  { id: 'calibrated', title: 'Know what you know', desc: 'Be right on 20 of your last 25 “Sure” answers', goal: 20, measure: (s) => { const r = s.log.filter((x) => x[7] === 2).slice(-25); return r.filter((x) => x[3]).length; } },
  { id: 'regular', title: 'Regular', desc: 'Practise on 15 days in one month', goal: 15, measure: (s) => { const m = {}; for (const x of s.sessions) if (x.completed) (m[monthKey(x.day)] ||= new Set()).add(x.day); return Math.max(0, ...Object.values(m).map((v) => v.size)); } },
  { id: 'five-hundred', title: 'Scholar', desc: 'Know 500 things', goal: 500, measure: (s) => learnedCount(s), unlock: 'gradcap' },
];

export function milestones(state, db) {
  return MILESTONES.map((m) => {
    const n = m.measure(state, db);
    return { ...m, value: Math.min(n, m.goal), done: n >= m.goal };
  });
}

export const STARTER_ACCESSORIES = ['none', 'yuzu', 'flower', 'bow', 'glasses', 'scarf', 'bird'];

export function unlockedAccessories(state, db) {
  const done = new Set(milestones(state, db).filter((m) => m.done).map((m) => m.id));
  return new Set([...STARTER_ACCESSORIES, ...MILESTONES.filter((m) => m.unlock && done.has(m.id)).map((m) => m.unlock)]);
}

/** A short plan summary for the home screen ("18 reviews · 1 new topic · writing"). */
export function planSummary(plan) {
  if (!plan) return [];
  const reviews = plan.steps.filter((s) => s.t === 'review' && !s.reask).length;
  const parts = [];
  if (plan.steps.some((s) => s.t === 'placement')) parts.push('level check');
  if (plan.steps.some((s) => s.t === 'sprint')) parts.push('sprint');
  if (reviews) parts.push(`${reviews} review${reviews === 1 ? '' : 's'}`);
  const news = plan.steps.filter((s) => s.t === 'choose').length;
  if (news) parts.push(`${news} new topic${news === 1 ? '' : 's'}`);
  if (plan.steps.some((s) => s.t === 'sentence')) parts.push('sentence workshop');
  return parts;
}

export { calibration };
