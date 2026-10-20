import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sprintQuestion, SPRINT_LEVELS } from '../js/gen/sprint.js';
import { sprintLevel, sprintBest, recordSprint, sprintDue } from '../js/core/sprint.js';
import { emptyState, deserialize, checksum } from '../js/core/store.js';
import { planDay } from '../js/core/session.js';
import { buildDB } from '../js/core/content.js';
import { makeRng } from '../js/core/rng.js';
import { parseNumber } from '../js/core/fraction.js';
import { readFileSync } from 'node:fs';

const root = new URL('../content/', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root)));
const db = buildDB(read('index.json').decks.map(read));

test('sprint questions are well formed at every level, with sensible answers', () => {
  for (let level = 1; level <= SPRINT_LEVELS; level++) {
    const rng = makeRng(`sprint${level}`);
    for (let i = 0; i < 400; i++) {
      const q = sprintQuestion(level, rng);
      assert.ok(q.prompt && !/undefined|NaN/.test(q.prompt), q.prompt);
      assert.ok(Number.isFinite(q.value), q.prompt);
      assert.ok(parseNumber(String(q.value)), q.prompt);
      assert.ok(Math.abs(q.value) < 100000, q.prompt);
      if (q.keypad) assert.ok(q.value >= 0, `keypad level must not need a minus: ${q.prompt}`);
    }
  }
});

test('the level ladder: up on a strong run, down on a poor one, steady otherwise', () => {
  const s = emptyState(100);
  assert.equal(sprintLevel(s), 1);
  recordSprint(s, { day: 100, level: 1, answered: 20, correct: 19 });
  assert.equal(sprintLevel(s), 2);
  recordSprint(s, { day: 101, level: 2, answered: 12, correct: 10 });
  assert.equal(sprintLevel(s), 2);
  recordSprint(s, { day: 102, level: 2, answered: 10, correct: 4 });
  assert.equal(sprintLevel(s), 1);
  assert.equal(sprintBest(s, 2), 10);
  assert.equal(sprintBest(s, 5), null);
  for (let d = 0; d < 10; d++) recordSprint(s, { day: 110 + d, level: sprintLevel(s), answered: 30, correct: 30 });
  assert.equal(sprintLevel(s), SPRINT_LEVELS);
});

test('a sprint is planned from the second session on, and old saves gain the field', () => {
  const s = emptyState(200);
  assert.equal(sprintDue(s), false);
  assert.ok(!planDay(s, db, 200).steps.some((x) => x.t === 'sprint'));
  s.sessions.push({ day: 200, start: 1, end: 2, answered: 3, correct: 3, completed: true });
  const plan = planDay(s, db, 201);
  assert.equal(plan.steps.filter((x) => x.t === 'sprint').length, 1);
  // a version-2 save (before sprints existed) upgrades cleanly
  const { sprints, ...data } = s;
  void sprints;
  const body = JSON.stringify(data);
  const v2 = JSON.stringify({ app: 'grammar-stream', schema_version: 2, saved_at: 1, checksum: checksum(body), data });
  const back = deserialize(v2).data;
  assert.deepEqual(back.sprints ?? [], []);
});
