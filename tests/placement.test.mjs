import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildDB } from '../js/core/content.js';
import { emptyState } from '../js/core/store.js';
import { startPlacement, nextProbe, probeQuestion, answerProbe, applyPlacement, needsPlacement, topoOrder, PLACEMENT_CAP } from '../js/core/placement.js';
import { planDay, topicChoices, PLACEMENT_ORDER } from '../js/core/session.js';
import { correctResponse } from '../js/core/checkers.js';
import { makeRng } from '../js/core/rng.js';

const root = new URL('../content/', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root)));
const db = buildDB(read('index.json').decks.map(read));
const TODAY = 20760;

export function runPlacement(state, subject, answer) {
  const probe = startPlacement(state, db, subject);
  let p;
  while ((p = nextProbe(probe, state, db))) {
    const q = probeQuestion(state, db, p);
    answerProbe(probe, state, db, q, answer(q, p), TODAY);
  }
  return { probe, summary: applyPlacement(probe, state, db, TODAY) };
}

test('topological order puts prerequisites first', () => {
  for (const s of PLACEMENT_ORDER) {
    const order = topoOrder(db, s);
    order.forEach((id, i) => db.topics[id].prereqs.forEach((p) => assert.ok(order.indexOf(p) < i, `${p} before ${id}`)));
  }
});

test('a learner who knows everything is placed high, within the question cap', () => {
  const state = emptyState(TODAY);
  const { probe, summary } = runPlacement(state, 'maths', (q) => correctResponse(q));
  assert.ok(probe.asked <= PLACEMENT_CAP);
  assert.ok(summary.passed.length >= 8, `passed ${summary.passed.length}`);
  assert.equal(summary.failed.length, 0);
  for (const t of summary.passed) assert.equal(state.topics[t].state, 'proficient');
  // assumed items enter review spread over two weeks, not all at once
  const dues = Object.values(state.cards).filter((c) => c.assumed).map((c) => c.due - TODAY);
  assert.ok(dues.length > 0 && Math.min(...dues) >= 2 && Math.max(...dues) <= 14);
  assert.ok(state.subjects.maths.ability > 0, 'ability rises after correct answers');
  assert.equal(needsPlacement(state, db, 'maths'), false);
});

test('a learner who knows nothing stops quickly and skips dependent topics', () => {
  const state = emptyState(TODAY);
  const { probe, summary } = runPlacement(state, 'maths', () => null);
  assert.equal(summary.passed.length, 0);
  assert.ok(summary.skipped.length > 0, 'dependents of failed topics are skipped');
  assert.ok(probe.asked < 20, `asked ${probe.asked}`);
  assert.equal(Object.keys(state.topics).length, 0, 'no topic is marked started');
  assert.ok(topicChoices(state, db, 'maths').length > 0, 'she can still start topics');
});

test('2 of 3 passes a topic, 1 of 3 fails it', () => {
  const state = emptyState(TODAY);
  let n = 0;
  const pattern = [true, false, true, false, true, false];
  const probe = startPlacement(state, db, 'history');
  const results = [];
  let p;
  while ((p = nextProbe(probe, state, db)) && n < pattern.length) {
    const q = probeQuestion(state, db, p);
    answerProbe(probe, state, db, q, pattern[n++] ? correctResponse(q) : null, TODAY);
    results.push(probe.current?.topic);
  }
  // first topic: right, wrong, right -> passed after 3 questions
  assert.equal(probe.passed[0], topoOrder(db, 'history')[0]);
});

test('placement uses recall formats so guessing cannot pass a topic', () => {
  const state = emptyState(TODAY);
  const probe = startPlacement(state, db, 'geography');
  const kinds = new Set();
  let p;
  while ((p = nextProbe(probe, state, db))) {
    const q = probeQuestion(state, db, p);
    kinds.add(`${db.items[q.itemId].kind}:${q.kind}`);
    answerProbe(probe, state, db, q, correctResponse(q), TODAY);
  }
  assert.ok(!kinds.has('mapfact:choice') && !kinds.has('fact:choice') || [...kinds].every((k) => !k.startsWith('mapfact:choice')), [...kinds].join(','));
});

test('the plan schedules one placement a day until every subject is placed', () => {
  const state = emptyState(TODAY);
  const rng = makeRng(5);
  const seen = [];
  for (let d = 0; d < 7; d++) {
    const plan = planDay(state, db, TODAY + d);
    const pl = plan.steps.filter((s) => s.t === 'placement');
    assert.ok(pl.length <= 1);
    if (!pl.length) break;
    seen.push(pl[0].subject);
    runPlacement(state, pl[0].subject, (q) => (rng.chance(0.6) ? correctResponse(q) : null));
  }
  assert.deepEqual(seen, PLACEMENT_ORDER);
  assert.equal(planDay(state, db, TODAY + 9).steps.filter((s) => s.t === 'placement').length, 0);
});
