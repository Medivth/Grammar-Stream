// The Year 3 course: it contains all of Year 2, so a child can move up and keep every card.
// Each test file runs in its own process, so switching the course here affects nothing else.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { setCourse, SUBJECTS, COURSE, isStretch } from '../js/core/subjects.js';
import { buildDB, validateDB } from '../js/core/content.js';
import { GENERATORS } from '../js/gen/index.js';
import { present } from '../js/core/present.js';
import { check, correctResponse, checkSentence } from '../js/core/checkers.js';
import { emptyState } from '../js/core/store.js';
import { makeRng } from '../js/core/rng.js';
import { planDay, topicChoices, chooseTopic, questionFor, submit, startSession, finishSession, fsrsFor, dueItems } from '../js/core/session.js';
import { startPlacement, nextProbe, probeQuestion, answerProbe, applyPlacement } from '../js/core/placement.js';
import { milestones, unlockedAccessories } from '../js/core/progress.js';
import { sprintQuestion } from '../js/gen/sprint.js';
import { sprintSeconds } from '../js/core/sprint.js';
import { paperSpec, makePaper, y3Paper } from '../js/gen/paper.js';
import { parseNumber } from '../js/core/fraction.js';
import { assertWellFormed } from './generators.test.mjs';

const root = new URL('../content/', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root)));
const index = read('index-y3.json');
const db = buildDB(index.decks.map(read));
const ks1db = buildDB(read('index-ks1.json').decks.map(read));
const maps = Object.fromEntries(Object.entries(index.maps).map(([k, p]) => [k, read(p)]));
const isY3 = (topicId) => db.topics[topicId]?.deck.startsWith('y3');
setCourse('y3');

test('the Year 3 course: same subjects as Year 2, longer sessions, its own sprint and paper', () => {
  assert.deepEqual(SUBJECTS.map((s) => s.id), ['maths', 'reading', 'spelling', 'science', 'history']);
  assert.equal(COURSE.minutes, 15);
  assert.equal(sprintSeconds(), 60);
  assert.equal(paperSpec().marks, 30);
  assert.ok(COURSE.tools.includes('typing'));
});

test('Year 3 contains all of Year 2, plus its own topics, and is valid', () => {
  assert.deepEqual(validateDB(db, GENERATORS), []);
  for (const id of Object.keys(ks1db.items)) assert.ok(db.items[id], `Year 2 item ${id} is in Year 3`);
  for (const id of Object.keys(ks1db.topics)) assert.ok(db.topics[id], `Year 2 topic ${id} is in Year 3`);
  for (const s of SUBJECTS) {
    const y3 = db.topicOrder[s.id].filter(isY3);
    assert.ok(y3.length >= 10, `${s.id}: ${y3.length} Year 3 topics`);
    assert.ok(y3.some((id) => isStretch(db.topics[id])), `${s.id}: a Year 4 stretch topic`);
  }
  const ids = index.decks.flatMap((p) => (read(p).items || []).map((i) => i.id));
  assert.deepEqual(ids.filter((id, i) => ids.indexOf(id) !== i), [], 'item ids are unique across decks');
  assert.ok(Object.keys(db.items).length > Object.keys(ks1db.items).length + 600);
  const years = db.timeline.events.map((e) => e.year);
  assert.ok(years.length > ks1db.timeline.events.length + 8);
  assert.deepEqual(years, [...years].sort((a, b) => a - b), 'timeline in order');
  assert.ok(db.ladder.length >= 20 && db.rungs.length === 5);
  assert.ok(!index.decks.includes('ks1/reading/books.json'), 'Year 3 has its own reading ladder');
});

test('Year 2 stretch topics are core in Year 3, and still stretch in Year 2', () => {
  const tasters = Object.values(ks1db.topics).filter((t) => t.tier === 'stretch');
  assert.ok(tasters.length >= 10);
  for (const t of tasters) assert.equal(isStretch(db.topics[t.id]), false, t.id);
  setCourse('ks1');
  for (const t of tasters) assert.equal(isStretch(ks1db.topics[t.id]), true, t.id);
  setCourse('y3');
});

test('every Year 3 item can be presented and its own answer is accepted', () => {
  const state = emptyState(20000);
  state.profile = { hero: 'Captain Thunder' };
  const rng = makeRng('y3-content');
  for (const item of Object.values(db.items).filter((i) => isY3(i.topic))) {
    const formats = item.kind === 'fact' ? (item.formats || ['choice', 'cued', 'typed']) : item.kind === 'mapfact' ? (item.formats || ['choose', 'locate', 'name']) : item.kind === 'spell' ? ['cued', 'typed'] : [undefined];
    for (const format of formats) {
      for (let i = 0; i < (item.kind === 'template' ? 40 : 2); i++) {
        const q = present(item, undefined, { db, state, rng, format });
        const label = `${item.id} [${format ?? q.kind}]`;
        assert.ok(!/\{hero\}|undefined|NaN/.test(`${q.prompt} ${q.explain} ${(q.steps || []).join(' ')} ${q.passage || ''}`), `${label}: unfilled text: ${q.prompt}`);
        if (item.kind === 'template') { assertWellFormed(q, label); continue; }
        if (q.kind === 'choice') {
          assert.equal(new Set(q.options.map((o) => (item.kind === 'mcq' ? o.text : o.text.toLowerCase()))).size, q.options.length, `${label}: duplicate options`);
          if (!q.weighted) assert.equal(q.options.filter((o) => o.correct).length, 1, `${label}: one correct`);
        }
        assert.equal(check(q, correctResponse(q)).correct, true, `${label}: own answer accepted`);
      }
    }
  }
  for (const item of Object.values(db.items).filter((i) => i.kind === 'mapfact')) {
    const m = maps[item.map];
    const pool = item.layer === 'markers' ? m.markers : item.layer === 'countries' ? m.features : m[item.layer];
    assert.ok(pool?.some((f) => f.id === item.feature), `${item.id}: ${item.feature}`);
  }
  for (const s of db.sentences) {
    assert.equal(checkSentence(s, s.model).correct, true, `${s.id}: ${checkSentence(s, s.model).failed}`);
    assert.equal(checkSentence(s, 'i dont know').correct, false, s.id);
  }
});

test('the Year 3 sprint and paper are right', () => {
  for (let level = 1; level <= 5; level++) {
    const rng = makeRng(`y3sprint${level}`);
    for (let i = 0; i < 300; i++) {
      const q = sprintQuestion(level, rng);
      assert.ok(Number.isInteger(q.value) && q.value >= 0 && q.value <= 1000, `L${level} ${q.prompt} = ${q.value}`);
      assert.equal(q.keypad, true);
    }
  }
  const ops = { '+': (a, b) => a + b, '−': (a, b) => a - b, '×': (a, b) => a * b, '÷': (a, b) => a / b };
  for (let i = 0; i < 200; i++) {
    const qs = makePaper(`s${i}`);
    assert.equal(qs.length, 30);
    for (const q of qs) {
      const v = parseNumber(q.value);
      assert.ok(v && !/^-/.test(q.value), `${q.prompt} => ${q.value}`);
      const m = q.prompt.match(/^(\d+) ([+−×÷]) (\d+) =$/);
      if (m) assert.equal(+q.value, ops[m[2]](+m[1], +m[3]), q.prompt);
    }
  }
  assert.deepEqual(y3Paper('x'), y3Paper('x'), 'deterministic');
});

test('moving up keeps his badges and accessories', () => {
  const s = emptyState(1);
  setCourse('ks1');
  const before = milestones(s, ks1db).map((m) => m.id);
  setCourse('y3');
  const after = milestones(s, db).map((m) => m.id);
  for (const id of before) assert.ok(after.includes(id), id);
  assert.ok(after.includes('typist'));
  for (const a of ['racehelmet', 'cape', 'mask']) assert.ok(unlockedAccessories(s, db).has(a));
});

/** Simulate `days` days of 15-minute sessions, answering correctly with the review probability. */
function simulate(state, sdb, start, days, rng, counts) {
  for (let d = 0; d < days; d++) {
    if (d % 7 === 5) continue;
    const today = start + d;
    state.plan = planDay(state, sdb, today);
    startSession(state, today, today * 864e5);
    const plan = state.plan;
    while (plan.pos < plan.steps.length) {
      const st = plan.steps[plan.pos];
      counts[st.t] = (counts[st.t] || 0) + 1;
      if (st.t === 'placement') {
        const probe = startPlacement(state, sdb, st.subject);
        for (let p; (p = nextProbe(probe, state, sdb));) { const q = probeQuestion(state, sdb, p); answerProbe(probe, state, sdb, q, rng.chance(0.6) ? correctResponse(q) : null, today); }
        applyPlacement(probe, state, sdb, today);
      } else if (st.t === 'choose') {
        const o = topicChoices(state, sdb, st.subject);
        if (o.length) chooseTopic(state, sdb, rng.pick(o), today);
      } else if (['review', 'quiz', 'diag', 'practice', 'faded'].includes(st.t)) {
        const q = questionFor(state, sdb, st, plan.pos);
        const c = state.cards[st.id];
        const p = c && c.state !== 'new' ? fsrsFor(sdb.items[st.id].subject).retrievability(c.s, today - c.lastDay) : 0.8;
        const right = rng.chance(p);
        submit(state, sdb, st, q, right ? correctResponse(q) : q.kind === 'choice' ? q.options.findIndex((o) => !o.correct) : q.kind === 'order' ? q.items.map((_, i) => i).reverse() : 'zzz', { ms: 6000, conf: 1, now: today * 864e5 + plan.pos, today });
      }
      plan.pos++;
    }
    finishSession(state, today * 864e5 + 15 * 60000);
  }
}

test('100 days of Year 2, then moving up: cards carry over, no new placement, Year 3 topics begin', () => {
  const start = 20800;
  const state = emptyState(start);
  state.course = 'ks1';
  state.settings.sessionMinutes = 12;
  state.profile = { childName: 'Test', hero: 'Captain Thunder', companion: { name: 'Zoom' } };
  const rng = makeRng('move-up');
  setCourse('ks1');
  simulate(state, ks1db, start, 100, rng, {});
  const cardsBefore = Object.keys(state.cards).length;
  assert.ok(cardsBefore > 150);

  setCourse('y3');
  state.course = 'y3';
  state.settings.sessionMinutes = 15;
  const counts = {};
  simulate(state, db, start + 100, 100, rng, counts);
  assert.equal(counts.placement || 0, 0, 'no second placement after moving up');
  assert.ok(Object.keys(state.cards).length > cardsBefore + 100, `cards ${cardsBefore} -> ${Object.keys(state.cards).length}`);
  const y3Started = Object.keys(state.topics).filter(isY3);
  for (const s of SUBJECTS) assert.ok(y3Started.some((id) => db.topics[id].subject === s.id), `${s.id}: a Year 3 topic started`);
  // Year 2 cards are still reviewed in Year 3
  assert.ok(dueItems(state, db, start + 260).some((x) => !isY3(x.topic)), 'Year 2 items still come up for review');
});
