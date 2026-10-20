import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildDB } from '../js/core/content.js';
import { emptyState, serialize, deserialize } from '../js/core/store.js';
import { planDay, topicChoices, chooseTopic, questionFor, submit, startSession, finishSession, daysPractisedThisMonth, budgets, interleave, fsrsFor, calibration, CONF } from '../js/core/session.js';
import { correctResponse } from '../js/core/checkers.js';
import { makeRng } from '../js/core/rng.js';
import { startPlacement, nextProbe, probeQuestion, answerProbe, applyPlacement } from '../js/core/placement.js';

const root = new URL('../content/', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root)));
const db = buildDB(read('index.json').decks.map(read));

function wrongResponse(q) {
  switch (q.kind) {
    case 'choice': return q.options.findIndex((o) => !o.correct && !(o.weight > 0));
    case 'typed': return 'zzz';
    case 'order': return q.items.map((_, i) => i).reverse();
    case 'map': return 'nowhere';
    case 'numberline': return q.min;
    case 'cloze': return q.blanks.map(() => 'zzz');
    default: return null;
  }
}

/** Simulated learner: recalls with probability = retrievability (new items 70%). */
function runDay(state, today, rng, { pRight = null } = {}) {
  state.plan = planDay(state, db, today);
  startSession(state, today, today * 864e5);
  const plan = state.plan;
  let prevTopic = null, consecutive = 0, graded = 0;
  while (plan.pos < plan.steps.length) {
    const step = plan.steps[plan.pos];
    if (step.t === 'placement') {
      const probe = startPlacement(state, db, step.subject);
      let pr;
      while ((pr = nextProbe(probe, state, db))) {
        const q = probeQuestion(state, db, pr);
        answerProbe(probe, state, db, q, rng.chance(0.6) ? correctResponse(q) : null, today);
      }
      applyPlacement(probe, state, db, today);
    } else if (step.t === 'choose') {
      const opts = topicChoices(state, db, step.subject);
      if (opts.length) chooseTopic(state, db, rng.pick(opts), today);
    } else if (!['review', 'quiz', 'diag', 'practice', 'faded'].includes(step.t)) {
      prevTopic = null;
    }
    if (['review', 'quiz', 'diag', 'practice', 'faded'].includes(step.t)) {
      const q = questionFor(state, db, step, plan.pos);
      const item = db.items[step.id];
      const plainReview = step.t === 'review' && !step.reask;
      if (plainReview && item.topic === prevTopic) consecutive++;
      prevTopic = plainReview ? item.topic : null;
      const c = state.cards[step.id];
      const p = pRight ?? (c && c.state !== 'new' ? fsrsFor(item.subject).retrievability(c.s, today - c.lastDay) : 0.7);
      const right = rng.chance(p);
      const resp = right ? correctResponse(q) : wrongResponse(q);
      if (q.kind === 'choice' && !right && resp < 0) continue;
      submit(state, db, step, q, resp, { ms: 5000, conf: rng.pick([0, 1, 2]), now: today * 864e5 + plan.pos, today });
      graded++;
    }
    plan.pos++;
  }
  finishSession(state, today * 864e5 + 1e6);
  return { graded, consecutive };
}

test('budgets scale with minutes', () => {
  assert.deepEqual(budgets(25), { reviews: 33, newFacts: 6, practice: 3 });
  assert.ok(budgets(15).reviews < budgets(40).reviews);
});

test('interleave avoids consecutive topics when possible', () => {
  const rng = makeRng(1);
  const list = [...Array(12)].map((_, i) => ({ id: i, topic: `t${i % 3}`, subject: `s${i % 2}` }));
  const out = interleave(list, rng);
  for (let i = 1; i < out.length; i++) assert.notEqual(out[i].topic, out[i - 1].topic);
  assert.equal(out.length, 12);
});

test('60 simulated days: load stays bounded, subjects rotate, no repeats in a row, save round-trips', () => {
  const start = 20759; // 2 Nov 2026
  const state = emptyState(start);
  state.profile = { childName: 'Test', companion: { name: 'Mochi' } };
  const rng = makeRng('sim');
  const newSubjects = [];
  let maxReviews = 0;
  for (let d = 0; d < 60; d++) {
    const today = start + d;
    if ((d % 7) === 5) continue; // a rest day each week
    const before = state.plan;
    const { consecutive } = runDay(state, today, rng);
    const reviews = state.plan.steps.filter((s) => s.t === 'review' && !s.reask).length;
    maxReviews = Math.max(maxReviews, reviews);
    assert.ok(reviews <= budgets(25).reviews, `day ${d}: ${reviews} reviews`);
    // repeats are only avoidable when no topic holds more than half the reviews
    const tc = {};
    for (const st of state.plan.steps.filter((x) => x.t === 'review' && !x.reask)) tc[db.items[st.id].topic] = (tc[db.items[st.id].topic] || 0) + 1;
    if (Math.max(0, ...Object.values(tc)) <= Math.ceil(reviews / 2) - 1) assert.equal(consecutive, 0, `day ${d}: same topic twice in a row`);
    if (state.plan.subject) newSubjects.push(state.plan.subject);
    void before;
  }
  // every subject got new learning, none hogged it
  const counts = {};
  for (const s of newSubjects) counts[s] = (counts[s] || 0) + 1;
  // a subject may run out of new topics (placement skips known ones); otherwise none is starved
  for (const s of ['english', 'maths', 'history', 'geography', 'science']) {
    if (topicChoices(state, db, s).length) assert.ok(counts[s] >= 5, `${s} new-learning days: ${counts[s]}`);
    else assert.ok(counts[s] >= 1, `${s} never got new learning`);
  }
  // progress happened
  const cards = Object.keys(state.cards).length;
  assert.ok(cards > 150, `cards introduced: ${cards}`);
  const proficient = Object.values(state.topics).filter((t) => t.state !== 'learning').length;
  assert.ok(proficient >= 5, `topics proficient or better: ${proficient}`);
  assert.ok(daysPractisedThisMonth(state, start + 59) >= 1);
  // the save survives a round trip, and stays small
  const text = serialize(state);
  assert.deepEqual(deserialize(text).data, JSON.parse(JSON.stringify(state)));
  assert.ok(text.length < 400_000, `save size ${text.length}`);
  const cal = calibration(state);
  assert.ok(cal.sure.n + cal.think.n + cal.guess.n > 0);
});

test('a wrong answer is re-asked later in the same session, once', () => {
  const today = 20759;
  const state = emptyState(today);
  state.plan = planDay(state, db, today);
  startSession(state, today);
  const chooseAt = state.plan.steps.findIndex((s) => s.t === 'choose');
  state.plan.pos = chooseAt;
  chooseTopic(state, db, state.plan.steps[chooseAt].options[0], today);
  const qi = state.plan.steps.findIndex((s) => s.t === 'quiz' || s.t === 'practice');
  state.plan.pos = qi;
  const step = state.plan.steps[qi];
  const q = questionFor(state, db, step, qi);
  const r = submit(state, db, step, q, wrongResponse(q), { ms: 3000, conf: CONF.sure, today });
  assert.equal(r.correct, false);
  assert.equal(r.hyper, true, 'confident error flagged');
  const again = state.plan.steps.filter((s, i) => i > qi && s.id === step.id && s.reask);
  assert.equal(again.length, 1);
});

test('yesterday’s answers appear the next day', () => {
  const today = 20759;
  const state = emptyState(today);
  runDay(state, today, makeRng(2), { pRight: 0.5 });
  const next = planDay(state, db, today + 1);
  assert.equal(next.steps[0].t, 'yesterday');
  assert.ok(next.yesterday.length > 0 && next.yesterday.length <= 8);
});

test('a joined-up question also counts towards the maths topic it uses', () => {
  const today = 20800;
  const state = emptyState(today);
  state.plan = { steps: [{ t: 'review', id: 'geography.gn.stats' }], pos: 0, results: [], reasks: 0 };
  const step = state.plan.steps[0];
  const q = questionFor(state, db, step, 0);
  submit(state, db, step, q, correctResponse(q), { ms: 4000, conf: CONF.sure, today });
  assert.equal(state.topics['geography.by-numbers'].n, 1);
  assert.equal(state.topics['maths.averages'], undefined, 'not started yet, so nothing is credited');
  state.topics['maths.averages'] = { ema: 0.5, n: 3, state: 'learning', profDay: null, delayed: 0, started: today - 5 };
  state.plan.pos = 0;
  submit(state, db, step, q, correctResponse(q), { ms: 4000, conf: CONF.sure, today });
  assert.equal(state.topics['maths.averages'].n, 4);
  assert.ok(state.topics['maths.averages'].ema > 0.5);
});
