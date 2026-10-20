// The Year 2 course: content, a simulated learner, and the course-specific pieces.
// Each test file runs in its own process, so switching the course here affects nothing else.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { setCourse, SUBJECTS, PLACEMENT_ORDER, COURSE } from '../js/core/subjects.js';
import { buildDB, validateDB } from '../js/core/content.js';
import { GENERATORS } from '../js/gen/index.js';
import { present } from '../js/core/present.js';
import { check, correctResponse, checkSentence } from '../js/core/checkers.js';
import { emptyState, serialize, deserialize } from '../js/core/store.js';
import { makeRng } from '../js/core/rng.js';
import { planDay, topicChoices, chooseTopic, questionFor, submit, startSession, finishSession, budgets, fsrsFor } from '../js/core/session.js';
import { startPlacement, nextProbe, probeQuestion, answerProbe, applyPlacement, topoOrder } from '../js/core/placement.js';
import { milestones, unlockedAccessories, wardrobeAccessories } from '../js/core/progress.js';
import { sprintQuestion } from '../js/gen/sprint.js';
import { sprintSeconds } from '../js/core/sprint.js';
import { ks1Paper, paperSpec, makePaper } from '../js/gen/paper.js';
import { parseNumber } from '../js/core/fraction.js';
import { pr, setPronoun } from '../js/core/pronoun.js';
import { timeWords } from '../js/gen/ks1maths.js';
import { assertWellFormed } from './generators.test.mjs';

setCourse('ks1');
const root = new URL('../content/', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root)));
const index = read('index-ks1.json');
const db = buildDB(index.decks.map(read));
const maps = Object.fromEntries(Object.entries(index.maps).map(([k, p]) => [k, read(p)]));

test('the course switch swaps subjects, placement order and settings in place', () => {
  assert.deepEqual(SUBJECTS.map((s) => s.id), ['maths', 'reading', 'spelling', 'science', 'history']);
  assert.deepEqual(PLACEMENT_ORDER, ['maths', 'reading', 'spelling']);
  assert.equal(COURSE.minutes, 12);
  assert.equal(sprintSeconds(), 60);
  assert.equal(paperSpec().marks, 25);
});

test('Year 2 content is valid, plentiful and every topic has items', () => {
  assert.deepEqual(validateDB(db, GENERATORS), []);
  const ids = index.decks.flatMap((p) => (read(p).items || []).map((i) => i.id));
  assert.deepEqual(ids.filter((id, i) => ids.indexOf(id) !== i), [], 'item ids are unique across decks');
  for (const s of SUBJECTS) assert.ok(db.topicOrder[s.id]?.length >= 18, `${s.id}: ${db.topicOrder[s.id]?.length} topics`);
  assert.ok(Object.keys(db.items).length > 800);
  assert.ok(db.timeline.events.length >= 30);
  const years = db.timeline.events.map((e) => e.year);
  assert.deepEqual(years, [...years].sort((a, b) => a - b), 'timeline events in order');
  assert.ok(db.sentences.length >= 14);
  assert.ok(db.ladder.length >= 20 && db.rungs.length === 5);
  for (const sub of SUBJECTS) assert.ok(db.topicOrder[sub.id].some((id) => db.topics[id].tier === 'stretch'), `${sub.id}: a stretch topic`);
});

test('every Year 2 item can be presented in every format and its own answer is accepted', () => {
  const state = emptyState(20000);
  state.profile = { hero: 'Captain Thunder' };
  const rng = makeRng('ks1-content');
  for (const item of Object.values(db.items)) {
    const formats = item.kind === 'fact' ? (item.formats || ['choice', 'cued', 'typed']) : item.kind === 'mapfact' ? (item.formats || ['choose', 'locate', 'name']) : item.kind === 'spell' ? ['cued', 'typed'] : [undefined];
    for (const format of formats) {
      for (let i = 0; i < (item.kind === 'template' ? 40 : 2); i++) {
        const q = present(item, undefined, { db, state, rng, format });
        const label = `${item.id} [${format ?? q.kind}]`;
        assert.ok(!/\{hero\}|undefined|NaN/.test(`${q.prompt} ${q.explain} ${(q.steps || []).join(' ')} ${q.passage || ''}`), `${label}: unfilled text: ${q.prompt}`);
        if (item.kind === 'template') { assertWellFormed(q, label); continue; }
        if (q.kind === 'choice') {
          // choices are checked by position, so options that differ only in capital letters are fine (that can be the point)
          assert.equal(new Set(q.options.map((o) => (item.kind === 'mcq' ? o.text : o.text.toLowerCase()))).size, q.options.length, `${label}: duplicate options`);
          if (!q.weighted) assert.equal(q.options.filter((o) => o.correct).length, 1, `${label}: one correct`);
        }
        assert.equal(check(q, correctResponse(q)).correct, true, `${label}: own answer accepted`);
      }
    }
  }
});

test('the hero name appears in the word problems', () => {
  const state = emptyState(1);
  state.profile = { hero: 'Captain Thunder' };
  const rng = makeRng('hero');
  let seen = 0;
  for (let i = 0; i < 200; i++) {
    const q = present(db.items['maths.problems.tmpl'], undefined, { db, state, rng, level: 2 });
    if (q.prompt.includes('Captain Thunder')) seen++;
  }
  assert.ok(seen > 20, `hero seen ${seen} times`);
  const story = present(db.items['reading.run.1'], undefined, { db, state, rng });
  assert.ok(story.passage.startsWith('Captain Thunder and the Runaway Train'), 'the hero stars in the story');
});

test('map items point at real features; sentences check their own models', () => {
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

test('clock words, the sprint and the Year 2 paper are right', () => {
  assert.equal(timeWords(3, 0), '3 o’clock');
  assert.equal(timeWords(3, 15), 'quarter past 3');
  assert.equal(timeWords(3, 45), 'quarter to 4');
  assert.equal(timeWords(12, 40), '20 minutes to 1');
  for (let level = 1; level <= 5; level++) {
    const rng = makeRng(`ks1sprint${level}`);
    for (let i = 0; i < 300; i++) {
      const q = sprintQuestion(level, rng);
      assert.ok(Number.isInteger(q.value) && q.value >= 0 && q.value <= 200, `L${level} ${q.prompt} = ${q.value}`);
      assert.equal(q.keypad, true);
    }
  }
  for (let i = 0; i < 100; i++) {
    const qs = makePaper(`s${i}`);
    assert.equal(qs.length, 25);
    for (const q of qs) {
      assert.ok(parseNumber(q.value) && +q.value >= 0 && Number.isInteger(+q.value), `${q.prompt} => ${q.value}`);
      const m = q.prompt.match(/^(\d+) ([+−×÷]) (\d+) =$/);
      if (m) assert.equal(+q.value, { '+': (a, b) => a + b, '−': (a, b) => a - b, '×': (a, b) => a * b, '÷': (a, b) => a / b }[m[2]](+m[1], +m[3]), q.prompt);
    }
  }
  assert.deepEqual(ks1Paper('x').map((q) => q.prompt), ks1Paper('x').map((q) => q.prompt), 'deterministic');
});

test('pronoun tokens read naturally for each choice', () => {
  setPronoun('he');
  assert.equal(pr('Ask {him} what {she} learned, and check {her} work.'), 'Ask him what he learned, and check his work.');
  setPronoun('they');
  assert.equal(pr('{She} remembered it.'), 'Your child remembered it.');
  setPronoun('she');
  assert.equal(pr('{Her} sentences'), 'Her sentences');
});

test('Year 2 badges and wardrobe: his starters, his rewards, no Year 6 extras', () => {
  const s = emptyState(1);
  const ids = milestones(s, db).map((m) => m.id);
  assert.ok(ids.includes('speed-racer') && !ids.includes('typist'));
  const open = unlockedAccessories(s, db);
  for (const a of ['racehelmet', 'cape', 'mask']) assert.ok(open.has(a), a);
  assert.ok(!wardrobeAccessories().has('flower'));
});

test('60 simulated days on the Year 2 course: short sessions, all five subjects, real progress', () => {
  const start = 20800;
  const state = emptyState(start);
  state.course = 'ks1';
  state.settings.sessionMinutes = 12;
  state.profile = { childName: 'Test', hero: 'Captain Thunder', companion: { name: 'Zoom' } };
  const rng = makeRng('ks1-sim');
  const fresh = {};
  for (let d = 0; d < 60; d++) {
    if (d % 7 === 5) continue;
    const today = start + d;
    state.plan = planDay(state, db, today);
    startSession(state, today, today * 864e5);
    const plan = state.plan;
    assert.ok(plan.steps.filter((x) => x.t === 'review').length <= budgets(12).reviews, `day ${d}: too many reviews`);
    while (plan.pos < plan.steps.length) {
      const st = plan.steps[plan.pos];
      if (st.t === 'placement') {
        const probe = startPlacement(state, db, st.subject);
        for (let p; (p = nextProbe(probe, state, db));) { const q = probeQuestion(state, db, p); answerProbe(probe, state, db, q, rng.chance(0.5) ? correctResponse(q) : null, today); }
        assert.ok(probe.asked <= 14 + 2, `placement asked ${probe.asked}`); // the cap is checked between topics
        applyPlacement(probe, state, db, today);
      } else if (st.t === 'choose') {
        const o = topicChoices(state, db, st.subject);
        if (o.length) { chooseTopic(state, db, rng.pick(o), today); fresh[st.subject] = (fresh[st.subject] || 0) + 1; }
      } else if (['review', 'quiz', 'diag', 'practice', 'faded'].includes(st.t)) {
        const q = questionFor(state, db, st, plan.pos);
        const c = state.cards[st.id];
        const p = c && c.state !== 'new' ? fsrsFor(db.items[st.id].subject).retrievability(c.s, today - c.lastDay) : 0.75;
        const right = rng.chance(p);
        let resp = right ? correctResponse(q) : q.kind === 'choice' ? q.options.findIndex((o) => !o.correct) : q.kind === 'order' ? q.items.map((_, i) => i).reverse() : 'zzz';
        submit(state, db, st, q, resp, { ms: 6000, conf: 1, now: today * 864e5 + plan.pos, today });
        void resp;
      }
      plan.pos++;
    }
    finishSession(state, today * 864e5 + 12 * 60000);
  }
  for (const s of SUBJECTS) assert.ok(fresh[s.id] >= 3, `${s.id} new-learning days: ${fresh[s.id] || 0}`);
  assert.ok(Object.keys(state.cards).length > 120, `cards ${Object.keys(state.cards).length}`);
  assert.ok(Object.values(state.topics).filter((t) => t.state !== 'learning').length >= 8);
  for (const s of PLACEMENT_ORDER) for (const id of topoOrder(db, s)) assert.equal(db.topics[id].subject, s);
  const text = serialize(state);
  assert.equal(deserialize(text).data.course, 'ks1');
});
