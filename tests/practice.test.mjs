import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildDB } from '../js/core/content.js';
import { TYPING_LESSONS, drillText, keysUpTo, wpm, unlockedLessons, recordLesson, fingerFor, nextSpeed, speedPassages, SPEED_START } from '../js/core/practice.js';

const root = new URL('../content/', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root)));
const db = buildDB(read('index.json').decks.map(read));
const words = Object.values(db.items).filter((i) => i.kind === 'spell').map((i) => i.word);
const sentences = db.sentences.map((s) => s.model);

test('typing drills only use keys learned so far, and every key has a finger', () => {
  for (let i = 0; i < TYPING_LESSONS.length; i++) {
    const text = drillText(i, 'seed', { words, sentences });
    assert.ok(text.split(' ').length >= 25, `${TYPING_LESSONS[i].id}: ${text.split(' ').length} words`);
    if (TYPING_LESSONS[i].keys && !TYPING_LESSONS[i].shift) {
      const allowed = new Set([...keysUpTo(i), ' ']);
      for (const c of text) assert.ok(allowed.has(c), `${TYPING_LESSONS[i].id}: unexpected "${c}"`);
      for (const c of TYPING_LESSONS[i].keys) assert.ok(text.includes(c), `${TYPING_LESSONS[i].id}: new key ${c} drilled`);
    }
  }
  for (const c of 'abcdefghijklmnopqrstuvwxyz;,./ ') assert.ok(fingerFor(c), c);
  assert.equal(wpm(250, 60000), 50);
});

test('lessons unlock at 90% accuracy and the best is kept', () => {
  const t = { lessons: {}, best: null };
  assert.equal(unlockedLessons(t), 1);
  recordLesson(t, 'home', { wpm: 12, acc: 0.8 }, 1);
  assert.equal(unlockedLessons(t), 1);
  recordLesson(t, 'home', { wpm: 10, acc: 0.95 }, 2);
  assert.equal(unlockedLessons(t), 2);
  assert.equal(t.lessons.home.wpm, 12, 'faster attempt kept even though it failed accuracy');
  assert.equal(t.lessons.home.passed, true);
  assert.deepEqual(t.best, { wpm: 10, acc: 0.95, day: 2 });
});

test('speed-reading pace adapts to comprehension and rotates passages', () => {
  assert.equal(nextSpeed([]), SPEED_START);
  assert.equal(nextSpeed([{ wpm: 150, correct: 4, total: 4 }]), 170);
  assert.equal(nextSpeed([{ wpm: 150, correct: 1, total: 4 }]), 130);
  assert.equal(nextSpeed([{ wpm: 150, correct: 2, total: 4 }]), 150);
  const ps = speedPassages(db, []);
  assert.ok(ps.length >= 12, `${ps.length} passages`);
  for (const p of ps) { assert.ok(p.items.length >= 3); assert.ok(!p.passage.startsWith('('), p.key); }
  const again = speedPassages(db, [{ day: 5, passage: ps[0].key }]);
  assert.notEqual(again[0].key, ps[0].key, 'the one just read goes to the back');
});
