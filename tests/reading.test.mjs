import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildDB } from '../js/core/content.js';
import { emptyState, deserialize, checksum } from '../js/core/store.js';
import { planDay, chooseTopic, writtenDue } from '../js/core/session.js';
import { submitAnswer, markAnswer, unseenMarks, answersToMark } from '../js/core/writing.js';
import { topoOrder, startPlacement } from '../js/core/placement.js';

const root = new URL('../content/', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root)));
const db = buildDB(read('index.json').decks.map(read));
const PASSAGES = JSON.parse(readFileSync(new URL('../tools/content-src/passages.json', import.meta.url)));

test('every reading passage is a real extract: 150-500 words, with a source, shared by its questions', () => {
  for (const [k, p] of Object.entries(PASSAGES)) {
    const n = p.passage.split(/\s+/).length;
    assert.ok(n >= 150 && n <= 500, `${k}: ${n} words`);
    assert.match(p.passageSource, /\(1[89]\d\d\)/, `${k}: dated source`);
    assert.ok(!/["']/.test(p.passage), `${k}: straight quotes left in`);
  }
  const reading = Object.values(db.items).filter((i) => db.topics[i.topic]?.kind === 'reading');
  assert.ok(reading.length >= 80);
  for (const t of Object.values(db.topics).filter((t) => t.kind === 'reading' && t.subject === 'english')) {
    const items = db.itemsByTopic[t.id].map((id) => db.items[id]);
    assert.equal(items.filter((i) => i.kind === 'written').length, 2, `${t.id}: two written answers`);
    for (const w of items.filter((i) => i.kind === 'written')) assert.ok(items.filter((i) => i.passage === w.passage && i.kind !== 'written').length >= 5, `${w.id}: questions on its passage`);
  }
});

test('a reading topic quizzes straight from the passage, in order, with no learn card', () => {
  const s = emptyState(300);
  s.topics['english.unseen'] = { ema: 0.9, n: 6, state: 'proficient', profDay: 290, delayed: 0, started: 280 };
  s.plan = planDay(s, db, 300);
  s.plan.pos = 0;
  chooseTopic(s, db, 'english.read-mood', 300);
  const added = s.plan.steps.slice(1, 9);
  assert.equal(added[0].t, 'intro-topic');
  assert.deepEqual(added.slice(1).map((x) => x.t), Array(7).fill('quiz'));
  assert.deepEqual(added.slice(1).map((x) => x.id), ['english.rd.sg1', 'english.rd.sg2', 'english.rd.sg3', 'english.rd.sg4', 'english.rd.sg5', 'english.rd.sg6', 'english.rd.ww1']);
  assert.ok(!s.plan.steps.some((x) => x.id === 'english.rd.sg7'), 'the written answer is never a quiz step');
});

test('a written answer is due once the passage has been read, at most twice a week; marking feeds the topic', () => {
  const s = emptyState(400);
  assert.equal(writtenDue(s, db, 400), null);
  s.topics['english.read-mood'] = { ema: 0.6, n: 3, state: 'learning', profDay: null, delayed: 0, started: 398 };
  assert.equal(writtenDue(s, db, 400), null, 'passage not yet read');
  for (const id of ['english.rd.sg1', 'english.rd.sg2', 'english.rd.sg3']) s.cards[id] = { state: 'review', s: 2, d: 5, lastDay: 399, due: 405 };
  assert.equal(writtenDue(s, db, 400), 'english.rd.sg7');
  assert.ok(planDay(s, db, 400).steps.some((x) => x.t === 'written' && x.id === 'english.rd.sg7'));
  const a = submitAnswer(s, 'english.rd.sg7', 'The garden is hazy and still. '.repeat(8), 400);
  assert.equal(writtenDue(s, db, 401), null, 'answered recently, and nothing else is ready');
  assert.deepEqual(answersToMark(s), [a]);
  const before = s.topics['english.read-mood'].n;
  markAnswer(s, a, { score: 2, note: 'Great quotations.' }, 401, 'english.read-mood');
  assert.equal(s.topics['english.read-mood'].n, before + 1);
  assert.equal(answersToMark(s).length, 0);
  assert.equal(unseenMarks(s).length, 1);
  assert.equal(planDay(s, db, 402).steps[0].t, 'marked');
  // two in a week is the cap
  for (const id of ['english.rd.ww1', 'english.rd.ww2', 'english.rd.ww3']) s.cards[id] = { state: 'review', s: 2, d: 5, lastDay: 401, due: 405 };
  assert.equal(writtenDue(s, db, 402), 'english.rd.ww7');
  submitAnswer(s, 'english.rd.ww7', 'x '.repeat(40), 402);
  s.topics['english.read-tension'] = { ema: 0.6, n: 3, state: 'learning', profDay: null, delayed: 0, started: 402 };
  for (const id of ['english.rd.ti1', 'english.rd.ti2', 'english.rd.ti3']) s.cards[id] = { state: 'review', s: 2, d: 5, lastDay: 402, due: 405 };
  assert.equal(writtenDue(s, db, 403), null, 'already two this week');
  assert.equal(writtenDue(s, db, 408), 'english.rd.ti7');
});

test('written answers are never placement probes, and a v3 save gains the answers field', () => {
  for (const id of topoOrder(db, 'english')) {
    const probe = startPlacement(emptyState(1), db, 'english');
    void probe;
    assert.ok(db.topics[id]);
  }
  const s = emptyState(1);
  s.topics['english.unseen'] = { ema: 0.9, n: 6, state: 'proficient', profDay: 0, delayed: 0, started: 0 };
  const probe = startPlacement(s, db, 'english');
  assert.ok(probe.queue.includes('english.read-mood'));
  const { answers, ...data } = s;
  void answers;
  const body = JSON.stringify(data);
  const v3 = JSON.stringify({ app: 'grammar-stream', schema_version: 3, saved_at: 1, checksum: checksum(body), data });
  assert.deepEqual(deserialize(v3).data.answers, []);
});
