// The Year 8 course: seven subjects at grammar-school stretch, Ancient Greek from scratch.
// Each test file runs in its own process, so switching the course here affects nothing else.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { setCourse, SUBJECTS, PLACEMENT_ORDER, COURSE, isStretch } from '../js/core/subjects.js';
import { buildDB, validateDB } from '../js/core/content.js';
import { GENERATORS } from '../js/gen/index.js';
import { present } from '../js/core/present.js';
import { check, correctResponse, checkSentence } from '../js/core/checkers.js';
import { emptyState } from '../js/core/store.js';
import { makeRng } from '../js/core/rng.js';
import { planDay, topicChoices, chooseTopic, questionFor, submit, startSession, finishSession, budgets, fsrsFor, writtenDue } from '../js/core/session.js';
import { startPlacement, nextProbe, probeQuestion, answerProbe, applyPlacement } from '../js/core/placement.js';
import { milestones } from '../js/core/progress.js';
import { sprintQuestion } from '../js/gen/sprint.js';
import { sprintSeconds } from '../js/core/sprint.js';
import { speedPassages } from '../js/core/practice.js';
import { richHTML } from '../js/ui/dom.js';
import { assertWellFormed } from './generators.test.mjs';

setCourse('y8');
const root = new URL('../content/', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root)));
const index = read('index-y8.json');
const db = buildDB(index.decks.map(read));
const maps = Object.fromEntries(Object.entries(index.maps).map(([k, p]) => [k, read(p)]));

test('the Year 8 course: seven subjects, 30-minute sessions, typing and speed reading', () => {
  assert.deepEqual(SUBJECTS.map((s) => s.id), ['english', 'maths', 'science', 'history', 'geography', 'computing', 'greek']);
  assert.ok(!PLACEMENT_ORDER.includes('greek'), 'Greek starts from the beginning');
  assert.equal(COURSE.minutes, 30);
  assert.equal(sprintSeconds(), 90);
  assert.deepEqual(COURSE.tools, ['typing', 'speed']);
  assert.ok(!milestones(emptyState(1), db).some((m) => m.id === 'paper'), 'no arithmetic-paper badge without a paper');
});

test('Year 8 content is valid and substantial in every subject', () => {
  assert.deepEqual(validateDB(db, GENERATORS), []);
  for (const s of SUBJECTS) {
    const ids = db.topicOrder[s.id] || [];
    assert.ok(ids.length >= 14, `${s.id}: ${ids.length} topics`);
    assert.ok(ids.some((id) => isStretch(db.topics[id])), `${s.id}: a stretch topic`);
    const its = Object.values(db.items).filter((i) => i.subject === s.id);
    assert.ok(its.length >= 50 || its.filter((i) => i.kind === 'template').length >= 15, `${s.id}: items`); // generators never run out
  }
  const ids = index.decks.flatMap((p) => (read(p).items || []).map((i) => i.id));
  assert.deepEqual(ids.filter((id, i) => ids.indexOf(id) !== i), [], 'item ids are unique across decks');
  assert.ok(db.ladder.length >= 25 && db.rungs.length === 5);
  assert.ok(db.pieces.length >= 18);
  const types = new Set(db.pieces.map((p) => p.type));
  for (const t of ['narrative', 'viewpoint', 'analytical', 'history', 'science', 'geography']) assert.ok(types.has(t), `a ${t} writing piece`);
  const years = db.timeline.events.map((e) => e.year);
  assert.ok(years.length >= 25);
  assert.deepEqual(years, [...years].sort((a, b) => a - b), 'timeline in order');
  assert.ok(speedPassages(db, []).length >= 6, 'speed reading has passages');
  assert.ok(Object.values(db.items).filter((i) => i.kind === 'written').length >= 10, 'written answers for a grown-up to mark');
});

test('original characters only: nothing from the Percy Jackson books outside the reading list', () => {
  const banned = /\b(Percy(?! Bysshe)|Annabeth|Grover|Thalia|Nico|Clarisse|Tyson|Camp Half-Blood|Camp Jupiter|half-blood|Valdez|Reyna)\b/;
  for (const p of index.decks.filter((p) => !p.endsWith('books.json'))) {
    const text = readFileSync(new URL(p, root), 'utf8');
    const m = text.match(banned);
    assert.equal(m, null, `${p}: ${m?.[0]}`);
  }
});

test('every Year 8 item can be presented and its own answer is accepted', () => {
  const state = emptyState(20000);
  state.profile = { childName: 'Test' };
  const rng = makeRng('y8-content');
  for (const item of Object.values(db.items)) {
    if (item.kind === 'written') { assert.ok(item.model && item.hints?.length, `${item.id}: written answers need hints and a model`); continue; }
    const formats = item.kind === 'fact' ? (item.formats || ['choice', 'cued', 'typed']) : item.kind === 'mapfact' ? (item.formats || ['choose', 'locate', 'name']) : item.kind === 'spell' ? ['cued', 'typed'] : [undefined];
    for (const format of formats) {
      for (let i = 0; i < (item.kind === 'template' ? 30 : 2); i++) {
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
    const pool = item.layer === 'markers' ? m.markers : item.layer === 'countries' ? m.features : m[item.layer] || m.features;
    assert.ok(pool?.some((f) => f.id === item.feature), `${item.id}: ${item.feature}`);
  }
  for (const s of db.sentences) {
    assert.equal(checkSentence(s, s.model).correct, true, `${s.id}: ${checkSentence(s, s.model).failed}`);
    assert.equal(checkSentence(s, 'i dont know').correct, false, s.id);
  }
});

test('the Year 8 sprint: numeric answers, and the full keyboard when an answer can be negative', () => {
  for (let level = 1; level <= 5; level++) {
    const rng = makeRng(`y8sprint${level}`);
    for (let i = 0; i < 400; i++) {
      const q = sprintQuestion(level, rng);
      assert.ok(Number.isFinite(q.value), `L${level} ${q.prompt} = ${q.value}`);
      assert.equal(Math.round(q.value * 100) / 100, q.value, `L${level} ${q.prompt}: tidy answer ${q.value}`);
      if (q.value < 0) assert.equal(q.keypad, false, `L${level} ${q.prompt}: negative answer needs the minus key`);
    }
  }
});

test('written answers: every subject that has them gets a turn, and only once she has met the topic', () => {
  const state = emptyState(100);
  const subjects = [...new Set(Object.values(db.items).filter((i) => i.kind === 'written').map((i) => i.subject))];
  assert.ok(subjects.length >= 4, `written answers in ${subjects.join(', ')}`);
  for (const sub of subjects) {
    const w = Object.values(db.items).find((i) => i.kind === 'written' && i.subject === sub);
    state.topics[w.topic] = { ema: 0.6, n: 3, state: 'learning', started: 90 };
    for (const id of db.itemsByTopic[w.topic].filter((id) => db.items[id].kind !== 'written')) state.cards[id] = { state: 'review', s: 3, d: 5, lastDay: 95, due: 999, reps: 1, lapses: 0 };
  }
  const seen = [];
  for (let day = 100; day < 100 + 7 * subjects.length; day += 4) {
    const id = writtenDue(state, db, day);
    if (!id) continue;
    seen.push(db.items[id].subject);
    state.answers.push({ itemId: id, day, text: 'x' });
  }
  for (const sub of subjects) assert.ok(seen.includes(sub), `${sub} got a written answer: ${seen.join(', ')}`);
  const fresh = emptyState(100);
  const w = Object.values(db.items).find((i) => i.kind === 'written');
  fresh.topics[w.topic] = { ema: 0.5, n: 0, state: 'learning', started: 100 };
  assert.equal(writtenDue(fresh, db, 100), null, 'not before she has answered anything in the topic');
});

test('code in Computing questions is shown as code', () => {
  const html = richHTML('Run this:\n```\nfor i in range(3):\n    print(i ** 2)\n```\nand `x = 3`');
  assert.match(html, /<pre class="code"><code>for i in range\(3\):\n {4}print\(i \*\* 2\)<\/code><\/pre>/);
  assert.match(html, /<code>x = 3<\/code>/);
  assert.ok(!html.includes('<strong>'), 'no bold inside code');
});

test('40 simulated days of 30-minute sessions: every subject gets new learning', () => {
  const start = 20800;
  const state = emptyState(start);
  state.course = 'y8';
  state.settings.sessionMinutes = 30;
  state.profile = { childName: 'Test', companion: { name: 'Glaukos' } };
  const rng = makeRng('y8-sim');
  const fresh = {};
  for (let d = 0; d < 40; d++) {
    if (d % 7 === 5) continue;
    const today = start + d;
    state.plan = planDay(state, db, today);
    startSession(state, today, today * 864e5);
    const plan = state.plan;
    assert.ok(plan.steps.filter((x) => x.t === 'review').length <= budgets(30).reviews, `day ${d}: too many reviews`);
    while (plan.pos < plan.steps.length) {
      const st = plan.steps[plan.pos];
      if (st.t === 'placement') {
        const probe = startPlacement(state, db, st.subject);
        for (let p; (p = nextProbe(probe, state, db));) { const q = probeQuestion(state, db, p); answerProbe(probe, state, db, q, rng.chance(0.6) ? correctResponse(q) : null, today); }
        assert.ok(probe.asked <= COURSE.placementCap + 2, `placement asked ${probe.asked}`);
        applyPlacement(probe, state, db, today);
      } else if (st.t === 'choose') {
        const o = topicChoices(state, db, st.subject);
        if (o.length) { chooseTopic(state, db, rng.pick(o), today); fresh[st.subject] = (fresh[st.subject] || 0) + 1; }
      } else if (['review', 'quiz', 'diag', 'practice', 'faded'].includes(st.t)) {
        const q = questionFor(state, db, st, plan.pos);
        const c = state.cards[st.id];
        const p = c && c.state !== 'new' ? fsrsFor(db.items[st.id].subject).retrievability(c.s, today - c.lastDay) : 0.8;
        submit(state, db, st, q, rng.chance(p) ? correctResponse(q) : q.kind === 'choice' ? q.options.findIndex((o) => !o.correct) : q.kind === 'order' ? q.items.map((_, i) => i).reverse() : 'zzz', { ms: 8000, conf: 1, now: today * 864e5 + plan.pos, today });
      }
      plan.pos++;
    }
    finishSession(state, today * 864e5 + 30 * 60000);
  }
  for (const s of SUBJECTS) assert.ok(fresh[s.id] >= 2, `${s.id} new-learning days: ${fresh[s.id] || 0}`);
  assert.ok(Object.keys(state.cards).length > 150, `cards ${Object.keys(state.cards).length}`);
});
