// Placement: a short adaptive walk through a subject's topic graph.
// Each probed topic gets 2-3 questions: 2/2 passes, 0/2 fails, otherwise a third decides.
// Topics after a failed prerequisite are skipped. Passed topics are "assumed known":
// their items enter review with low stability, so spaced review verifies them
// rather than testing everything now.

import { check } from './checkers.js';
import { present } from './present.js';
import { eloUpdate } from './elo.js';
import { makeRng } from './rng.js';

export const PLACEMENT_CAP = 24;
const PROBE_LEVEL = 2; // greater-depth Year 6 for generated skills

/** A subject's topics in an order where prerequisites come first. Topics that build on another
 * subject (joined-up topics) are left out: they unlock through that subject's own progress. */
export function topoOrder(db, subject) {
  const ids = db.topicOrder[subject] || [];
  const out = [], seen = new Set();
  const visit = (id) => {
    const t = db.topics[id];
    if (seen.has(id) || !t || t.subject !== subject || t.prereqs.some((p) => db.topics[p]?.subject !== subject)) return;
    seen.add(id);
    for (const p of db.topics[id].prereqs) visit(p);
    out.push(id);
  };
  ids.forEach(visit);
  return out;
}

function probeItems(db, topicId) {
  const t = db.topics[topicId];
  const ids = (db.itemsByTopic[topicId] || []).filter((id) => !(t.diagnostic || []).includes(id));
  const tmpl = ids.filter((id) => db.items[id].kind === 'template');
  return tmpl.length ? tmpl : ids.filter((id) => !db.items[id].reserve);
}

export function needsPlacement(state, db, subject) {
  if (state.subjects[subject]?.placed) return false;
  return topoOrder(db, subject).some((id) => !state.topics[id]);
}

export function startPlacement(state, db, subject) {
  const queue = topoOrder(db, subject).filter((id) => !state.topics[id] && probeItems(db, id).length);
  return { subject, queue, current: null, passed: [], failed: [], skipped: [], asked: 0, done: queue.length === 0 };
}

/** Advance to the next question, or mark the probe done. Returns { itemId, level, seed } or null. */
export function nextProbe(probe, state, db) {
  if (probe.done) return null;
  if (probe.current && probe.current.results.length < needed(probe.current.results)) return question(probe, db);
  if (probe.current) finishTopic(probe, db);
  while (probe.queue.length) {
    if (probe.asked >= PLACEMENT_CAP) break;
    const tid = probe.queue.shift();
    const blocked = db.topics[tid].prereqs.some((p) => probe.failed.includes(p) || probe.skipped.includes(p));
    if (blocked) { probe.skipped.push(tid); continue; }
    const rng = makeRng(`probe:${tid}:${state.created}`);
    probe.current = { topic: tid, items: rng.sample(probeItems(db, tid), 3), results: [] };
    return question(probe, db);
  }
  probe.current = null;
  probe.done = true;
  return null;
}

function needed(results) {
  if (results.length < 2) return 2;
  const right = results.filter(Boolean).length;
  return right === 1 && results.length === 2 ? 3 : results.length;
}

function question(probe, db) {
  const cur = probe.current;
  const n = cur.results.length;
  const itemId = cur.items[n % cur.items.length];
  return { itemId, level: db.items[itemId].kind === 'template' ? PROBE_LEVEL : undefined, seed: `${cur.topic}:${n}` };
}

function finishTopic(probe, db) {
  const cur = probe.current;
  const right = cur.results.filter(Boolean).length;
  if (right >= 2) probe.passed.push(cur.topic);
  else probe.failed.push(cur.topic);
  probe.current = null;
}

/** The question for a probe: recall formats only, so guessing can't pass a topic. */
export function probeQuestion(state, db, p) {
  const item = db.items[p.itemId];
  const format = item.kind === 'fact' ? (item.formats && !item.formats.includes('cued') ? item.formats[0] : 'cued')
    : item.kind === 'mapfact' ? 'locate' : item.kind === 'spell' ? 'cued' : undefined;
  return present(item, undefined, { db, state, rng: makeRng(`pq:${p.seed}:${state.created}`), level: p.level, format });
}

/** Record one answer. "I haven't learned this" passes response = null. */
export function answerProbe(probe, state, db, q, response, today, now = Date.now()) {
  const res = response == null ? { correct: false } : check(q, response);
  probe.current.results.push(!!res.correct);
  probe.asked += 1;
  const item = db.items[q.itemId];
  state.log.push([today, now, q.itemId, res.correct ? 1 : 0, null, null, null, null, 'placement', q.level ?? null]);
  if (item.kind === 'template' && q.level != null) {
    const key = `${item.id}@${q.level}`;
    const idx = item.levels.indexOf(q.level);
    const tState = state.templates[key] || { difficulty: item.seed?.[idx] ?? q.level - 2, attempts: 0 };
    const subj = state.subjects[item.subject] || { ability: 0, attempts: 0, lastNew: null };
    const { learner, item: it } = eloUpdate(subj, tState, !!res.correct, q.guess);
    state.subjects[item.subject] = { ...subj, ...learner };
    state.templates[key] = it;
  }
  return res;
}

/** Apply the results: passed topics become secure, their items enter light review. */
export function applyPlacement(probe, state, db, today) {
  const rng = makeRng(`apply:${probe.subject}:${today}`);
  for (const tid of probe.passed) {
    state.topics[tid] = { ema: 0.8, n: 0, state: 'proficient', profDay: today, delayed: 0, started: today, assumed: true };
    for (const id of db.itemsByTopic[tid] || []) {
      if (state.cards[id]) continue;
      // low stability, due dates spread over the next two weeks
      state.cards[id] = { state: 'review', s: 2 + rng.next() * 2, d: 5, lastDay: today, due: today + rng.int(2, 14), ivl: 0, reps: 0, lapses: 0, assumed: true };
    }
  }
  const subj = (state.subjects[probe.subject] ||= { ability: 0, attempts: 0, lastNew: null });
  subj.placed = today;
  return { passed: probe.passed, failed: probe.failed, skipped: probe.skipped };
}
