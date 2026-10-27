// Challenge and memory: every question in a topic gets taught, new learning keeps coming and
// grows when she is doing well, today's facts are recalled again before the end, and the
// look-back, sentence choices and sprint do not keep repeating themselves.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildDB } from '../js/core/content.js';
import { emptyState } from '../js/core/store.js';
import { planDay, chooseTopic, questionFor, submit, topUpItems, coverage, recentForm, rampBonus, pickNewSubject, CONF } from '../js/core/session.js';
import { recordTopicAttempt } from '../js/core/mastery.js';
import { correctResponse } from '../js/core/checkers.js';
import { makeRng } from '../js/core/rng.js';
import { freshSprintQuestion } from '../js/gen/sprint.js';
import { sprintLevel } from '../js/core/sprint.js';
import { SUBJECTS } from '../js/core/subjects.js';

const read = (p) => JSON.parse(readFileSync(new URL(`../content/${p}`, import.meta.url)));
const db = buildDB(read('index.json').decks.map(read));
const TODAY = 21000;
const factTopic = Object.values(db.topics).find((t) => t.kind === 'facts' && !t.diagnostic && (db.itemsByTopic[t.id] || []).filter((id) => db.items[id].kind === 'fact').length >= 20);
const factIds = db.itemsByTopic[factTopic.id].filter((id) => db.items[id].kind === 'fact');

const formLog = (state, right, n = 40) => { for (let i = 0; i < n; i++) state.log.push([TODAY - 1, 0, 'x', i < right * n ? 1 : 0, 3]); };

test('a topic is secure only once half its questions are taught, and mastered only when all are', () => {
  let t;
  for (let i = 0; i < 8; i++) t = recordTopicAttempt(t, true, TODAY, { mixed: false, coverage: 0.3 });
  assert.equal(t.state, 'learning', 'right answers alone are not enough');
  t = recordTopicAttempt(t, true, TODAY, { mixed: false, coverage: 0.5 });
  assert.equal(t.state, 'proficient');
  for (let i = 0; i < 4; i++) t = recordTopicAttempt(t, true, TODAY + 5, { coverage: 0.8 });
  assert.equal(t.state, 'proficient', 'not mastered while questions are untaught');
  t = recordTopicAttempt(t, true, TODAY + 6, { coverage: 1 });
  assert.equal(t.state, 'mastered');
});

test('untaught questions in secure topics are fed in, a few at a time, across subjects', () => {
  const state = emptyState(TODAY);
  state.topics[factTopic.id] = { state: 'mastered', ema: 0.9, n: 20 };
  state.cards[factIds[0]] = { state: 'review', s: 5, d: 5, lastDay: TODAY - 3, due: TODAY + 5 };
  const ids = topUpItems(state, db, 4);
  assert.ok(ids.length >= 1 && ids.length <= 3, 'at most three from one topic');
  for (const id of ids) { assert.equal(db.items[id].topic, factTopic.id); assert.ok(!state.cards[id]); }
  assert.ok(coverage(state, db, factTopic.id) < 0.2);
  const plan = planDay(state, db, TODAY);
  const fed = plan.steps.filter((s) => s.topUp && s.t === 'quiz').map((s) => s.id);
  assert.deepEqual(fed.sort(), ids.slice(0, fed.length).sort());
  // while she is finding things hard, none are added
  const tough = emptyState(TODAY);
  tough.topics[factTopic.id] = state.topics[factTopic.id];
  formLog(tough, 0.5);
  assert.equal(planDay(tough, db, TODAY).steps.filter((s) => s.topUp).length, 0);
});

test('strong form means more new learning: bigger batches, fewer easy reviews', () => {
  const state = emptyState(TODAY);
  assert.equal(recentForm(state, TODAY), null);
  formLog(state, 0.95);
  assert.ok(recentForm(state, TODAY) >= 0.92);
  assert.equal(rampBonus(state, TODAY), 2);
  // a subject with a pile of reviews still gets its turn, just a little later
  for (const s of SUBJECTS) state.subjects[s.id] = { lastNew: TODAY - 1 };
  state.subjects.english.lastNew = TODAY - 10;
  assert.equal(pickNewSubject(state, db, TODAY, { english: 50 }, 5), 'english');
  state.subjects.english.lastNew = TODAY - 2;
  assert.notEqual(pickNewSubject(state, db, TODAY, { english: 50 }, 5), 'english');
});

test('today’s new facts are recalled again before the end, from memory where possible', () => {
  const state = emptyState(TODAY);
  state.plan = planDay(state, db, TODAY);
  state.plan.pos = state.plan.steps.findIndex((s) => s.t === 'choose');
  if (state.plan.pos < 0) { state.plan.steps.unshift({ t: 'choose', subject: factTopic.subject }); state.plan.pos = 0; }
  chooseTopic(state, db, factTopic.id, TODAY);
  const steps = state.plan.steps;
  const recall = steps.map((s, i) => [s, i]).filter(([s]) => s.t === 'recall');
  assert.ok(recall.length >= 3, `${recall.length} recall steps`);
  const lastQuiz = Math.max(...steps.map((s, i) => (s.t === 'quiz' ? i : -1)));
  const sentence = steps.findIndex((s) => ['sentence', 'ritual'].includes(s.t));
  for (const [s, i] of recall) {
    assert.ok(i > lastQuiz && i < sentence, 'after the lesson, before the end');
    const item = db.items[s.id];
    const q = questionFor(state, db, s, i);
    if (item.kind === 'fact' && !item.formats) assert.equal(q.fmt, 'cued', 'asked from memory with a first-letter cue');
  }
});

test('the look-back shows mistakes and guesses, not answers she knew', () => {
  const state = emptyState(TODAY);
  state.plan = { day: TODAY - 1, steps: [{ t: 'quiz', id: factIds[0] }], pos: 0, results: [], reasks: 0 };
  const ask = (id, right, conf) => { const step = { t: 'review', id }; const q = questionFor(state, db, step, 0); submit(state, db, step, q, right ? correctResponse(q) : (q.kind === 'choice' ? q.options.findIndex((o) => !o.correct) : 'zzz'), { conf, today: TODAY - 1 }); };
  ask(factIds[1], true, CONF.think);
  ask(factIds[2], true, CONF.sure);
  ask(factIds[3], true, CONF.guess);
  ask(factIds[4], false, CONF.think);
  const plan = planDay(state, db, TODAY);
  assert.deepEqual(plan.yesterday.map((e) => e.itemId).sort(), [factIds[3], factIds[4]].sort());
});

test('sentence choices move on day by day even if skipped', () => {
  const state = emptyState(TODAY);
  const opts = (d) => planDay(state, db, d).steps.find((s) => s.t === 'sentence')?.options.join();
  assert.notEqual(opts(TODAY), opts(TODAY + 1));
});

test('the sprint avoids repeating recent questions, and accuracy alone moves a young child up', () => {
  const rng = makeRng('fresh');
  const recent = [];
  const seen = [];
  for (let i = 0; i < 40; i++) seen.push(freshSprintQuestion(1, rng, recent).prompt);
  for (let i = 1; i < seen.length; i++) assert.notEqual(seen[i], seen[i - 1]);
  const state = { sprints: [{ level: 1, answered: 9, correct: 9 }, { level: 1, answered: 10, correct: 10 }] };
  assert.equal(sprintLevel(state), 2, 'two near-perfect sprints');
  assert.equal(sprintLevel({ sprints: [{ level: 1, answered: 10, correct: 10 }] }), 1, 'one is not enough');
});

test('Year 6 has memory hooks: every topic in the five core subjects, and most questions', () => {
  for (const subject of ['english', 'maths', 'history', 'geography', 'science']) {
    const topics = db.topicOrder[subject].map((id) => db.topics[id]);
    for (const t of topics) assert.ok(t.hook, `${t.id} has a topic hook`);
    const items = topics.flatMap((t) => db.itemsByTopic[t.id].map((id) => db.items[id])).filter((i) => ['fact', 'mcq', 'order', 'spell'].includes(i.kind));
    const hooked = items.filter((i) => i.hook || i.example).length;
    assert.ok(hooked / items.length >= 0.6, `${subject}: ${hooked} of ${items.length} questions have a hook or example`);
  }
  for (const i of Object.values(db.items)) for (const k of ['hook', 'example']) if (i[k]) assert.ok(!/\{[a-z]+\}|undefined/.test(i[k]) && !/['"]/.test(i[k].replace(/\*\*/g, '')), `${i.id} ${k}: ${i[k]}`);
});
