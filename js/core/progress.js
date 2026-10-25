// Visible progress: what she knows, milestones, timeline and places. Derived only; never stored.

import { topicStatus } from './mastery.js';
import { SUBJECTS, COURSE, isStretch } from './subjects.js';
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
    if (item.kind === 'mapfact' && !['countries', 'features', 'markers', 'rivers', 'continents', 'oceans'].includes(item.layer)) continue;
    if (isKnown(state.cards[item.id])) out[item.map].add(item.feature);
  }
  const totals = { world: new Set(), europe: new Set(), uk: new Set() };
  for (const item of Object.values(db.items)) if (item.map && item.feature && totals[item.map]) totals[item.map].add(item.feature);
  return { known: out, totals };
}

// Milestones are fixed rewards for real achievement (never random). Some unlock companion accessories.
export const MILESTONES = [
  { id: 'first-session', title: 'First steps', desc: 'Finish your first session', goal: 1, measure: (s) => s.sessions.filter((x) => x.completed).length },
  { id: 'first-mastered', title: 'Topic tamer', desc: 'Master your first topic', goal: 1, measure: (s) => Object.values(s.topics).filter((t) => t.state === 'mastered').length, unlock: 'sunglasses' },
  { id: 'hundred', title: 'Century', desc: 'Know 100 things', goal: 100, measure: (s) => learnedCount(s), unlock: 'headphones' },
  { id: 'all-rounder', title: 'All-rounder', desc: 'A secure topic in every subject', goal: 6, measure: (s, db) => SUBJECTS.filter((sub) => Object.entries(s.topics).some(([id, t]) => db.topics[id]?.subject === sub.id && ['proficient', 'mastered'].includes(t.state))).length, unlock: 'beanie' },
  { id: 'globetrotter', title: 'Globetrotter', desc: 'Know 25 countries', goal: 25, measure: (s, db) => { const p = placesStatus(s, db); return p.known.world.size + [...p.known.europe].filter((x) => !p.known.world.has(x)).length; }, unlock: 'explorer' },
  { id: 'time-traveller', title: 'Time traveller', desc: 'Light up 12 events on the timeline', goal: 12, measure: (s, db) => timelineStatus(s, db).events.filter((e) => e.known).length, unlock: 'pirate' },
  { id: 'lab-ready', title: 'Lab ready', desc: 'Secure 5 science topics', goal: 5, measure: (s, db) => Object.entries(s.topics).filter(([id, t]) => db.topics[id]?.subject === 'science' && ['proficient', 'mastered'].includes(t.state)).length, unlock: 'goggles' },
  { id: 'stretch', title: 'Beyond the syllabus', desc: 'Secure 5 stretch topics', goal: 5, measure: (s, db) => Object.entries(s.topics).filter(([id, t]) => isStretch(db.topics[id]) && ['proficient', 'mastered'].includes(t.state)).length, unlock: 'crown' },
  { id: 'typist', title: 'Typist', desc: 'Type 30 words a minute with 95% accuracy', goal: 30, measure: (s) => (s.typing?.best?.wpm) || 0, unlock: 'starglasses' },
  { id: 'speed-reader', title: 'Speed reader', desc: 'Read at 200 words a minute and still get 3 of 4 right', goal: 200, measure: (s) => Math.max(0, ...(s.speed || []).filter((r) => r.total && r.correct / r.total >= 0.75).map((r) => r.wpm)), unlock: 'wings' },
  { id: 'paper', title: 'Test ready', desc: 'Score 32 or more on an arithmetic paper', goal: 32, measure: (s) => Math.max(0, ...(s.papers || []).map((p) => p.score)), unlock: 'bowtie' },
  { id: 'sprinter', title: 'Sprinter', desc: 'Get 20 right in one arithmetic sprint', goal: 20, measure: (s) => Math.max(0, ...(s.sprints || []).map((x) => x.correct)), unlock: 'jetpack' },
  { id: 'joined-up', title: 'Joined-up thinker', desc: 'Get 30 right in topics that mix subjects', goal: 30, measure: (s, db) => s.log.filter((x) => x[3] && db.topics[db.items[x[2]]?.topic]?.links).length, unlock: 'surfboard' },
  { id: 'wordsmith', title: 'Wordsmith', desc: 'Hand in 3 weekly writing pieces', goal: 3, measure: (s) => (s.pieces || []).filter((p) => p.submittedDay).length, unlock: 'wizard' },
  { id: 'bookworm', title: 'Bookworm', desc: 'Finish 3 books', goal: 3, measure: (s) => (s.books || []).filter((b) => b.endDay).length, unlock: 'backpack' },
  { id: 'calibrated', title: 'Know what you know', desc: 'Be right on 20 of your last 25 “Sure” answers', goal: 20, measure: (s) => { const r = s.log.filter((x) => x[7] === 2).slice(-25); return r.filter((x) => x[3]).length; }, unlock: 'owl' },
  { id: 'regular', title: 'Regular', desc: 'Practise on 15 days in one month', goal: 15, measure: (s) => { const m = {}; for (const x of s.sessions) if (x.completed) (m[monthKey(x.day)] ||= new Set()).add(x.day); return Math.max(0, ...Object.values(m).map((v) => v.size)); }, unlock: 'medal' },
  { id: 'five-hundred', title: 'Scholar', desc: 'Know 500 things', goal: 500, measure: (s) => learnedCount(s), unlock: 'gradcap' },
];

const secureIn = (s, db, pred) => Object.entries(s.topics).filter(([id, t]) => db.topics[id] && pred(db.topics[id]) && ['proficient', 'mastered'].includes(t.state)).length;
const bestSprint = (s) => Math.max(0, ...(s.sprints || []).map((x) => x.correct));

// Year 2: smaller goals, the same fixed-reward rules
export const KS1_MILESTONES = [
  { id: 'first-session', title: 'First lap', desc: 'Finish your first session', goal: 1, measure: (s) => s.sessions.filter((x) => x.completed).length },
  { id: 'first-mastered', title: 'Champion', desc: 'Master your first topic', goal: 1, measure: (s) => Object.values(s.topics).filter((t) => t.state === 'mastered').length, unlock: 'sunglasses' },
  { id: 'fifty', title: 'Fifty facts', desc: 'Know 50 things', goal: 50, measure: (s) => learnedCount(s), unlock: 'headphones' },
  { id: 'all-rounder', title: 'Super all-rounder', desc: 'A secure topic in every subject', goal: 5, measure: (s, db) => SUBJECTS.filter((sub) => secureIn(s, db, (t) => t.subject === sub.id) > 0).length, unlock: 'beanie' },
  { id: 'speed-racer', title: 'Speed racer', desc: 'Get 15 right in one sprint', goal: 15, measure: bestSprint, unlock: 'jetpack' },
  { id: 'typist', title: 'Typist', desc: 'Type 10 words a minute with 95% accuracy', goal: 10, measure: (s) => (s.typing?.best?.wpm) || 0, unlock: 'starglasses' },
  { id: 'explorer', title: 'World explorer', desc: 'Know 10 places on the map', goal: 10, measure: (s, db) => Object.values(db.items).filter((i) => i.kind === 'mapfact' && isKnown(s.cards[i.id])).length, unlock: 'explorer' },
  { id: 'time-traveller', title: 'Time traveller', desc: 'Light up 8 events on the timeline', goal: 8, measure: (s, db) => timelineStatus(s, db).events.filter((e) => e.known).length, unlock: 'knight' },
  { id: 'scientist', title: 'Young scientist', desc: 'Secure 3 science topics', goal: 3, measure: (s, db) => secureIn(s, db, (t) => t.subject === 'science'), unlock: 'goggles' },
  { id: 'bookworm', title: 'Bookworm', desc: 'Finish 5 books', goal: 5, measure: (s) => (s.books || []).filter((b) => b.endDay).length, unlock: 'backpack' },
  { id: 'paper', title: 'Test ready', desc: 'Score 20 or more on a maths paper', goal: 20, measure: (s) => Math.max(0, ...(s.papers || []).map((p) => p.score)), unlock: 'medal' },
  { id: 'regular', title: 'Regular', desc: 'Practise on 12 days in one month', goal: 12, measure: (s) => { const m = {}; for (const x of s.sessions) if (x.completed) (m[monthKey(x.day)] ||= new Set()).add(x.day); return Math.max(0, ...Object.values(m).map((v) => v.size)); }, unlock: 'wings' },
  { id: 'hundred', title: 'Century', desc: 'Know 100 things', goal: 100, measure: (s) => learnedCount(s), unlock: 'gradcap' },
  { id: 'stretch', title: 'Beyond Year 2', desc: 'Secure 3 stretch topics', goal: 3, measure: (s, db) => secureIn(s, db, (t) => isStretch(t)), unlock: 'crown' },
];

// Year 3: the Year 2 badges (so nothing he has earned goes away), with Year 3 goals added
export const Y3_MILESTONES = [
  ...KS1_MILESTONES.map((m) => (m.id === 'stretch' ? { ...m, title: 'Beyond Year 3', desc: 'Secure 3 Year 4 stretch topics' } : m.id === 'typist' ? { ...m, desc: 'Type 15 words a minute with 95% accuracy', goal: 15 } : m)),
  { id: 'sprinter', title: 'Sprinter', desc: 'Get 20 right in one sprint', goal: 20, measure: bestSprint, unlock: 'pirate' },
  { id: 'year3-topics', title: 'Year 3 explorer', desc: 'Secure 10 Year 3 topics', goal: 10, measure: (s, db) => secureIn(s, db, (t) => t.deck?.startsWith('y3')), unlock: 'wizard' },
  { id: 'three-hundred', title: 'Three hundred', desc: 'Know 300 things', goal: 300, measure: (s) => learnedCount(s), unlock: 'scarf' },
];

export const milestoneDefs = () => (COURSE.id === 'y3' ? Y3_MILESTONES : COURSE.young ? KS1_MILESTONES : MILESTONES.filter((m) => m.id !== 'paper' || COURSE.tools.includes('paper')));

export function milestones(state, db) {
  return milestoneDefs().map((m) => {
    const n = m.measure(state, db);
    return { ...m, value: Math.min(n, m.goal), done: n >= m.goal };
  });
}

export const starterAccessories = () => COURSE.starter;

export function unlockedAccessories(state, db) {
  const done = new Set(milestones(state, db).filter((m) => m.done).map((m) => m.id));
  return new Set([...COURSE.starter, ...milestoneDefs().filter((m) => m.unlock && done.has(m.id)).map((m) => m.unlock)]);
}

/** Every accessory this course can ever show: starters plus milestone rewards. */
export const wardrobeAccessories = () => new Set([...COURSE.starter, ...milestoneDefs().filter((m) => m.unlock).map((m) => m.unlock)]);

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
