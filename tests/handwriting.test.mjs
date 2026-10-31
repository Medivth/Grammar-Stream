// Handwriting joins: lesson data, progress, and wiring for the young courses only.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { COURSES } from '../js/core/subjects.js';
import { emptyState } from '../js/core/store.js';
import { HANDWRITING_LESSONS, LESSON_BY_ID, emptyHandwriting, unlockedHandwriting, nextHandwriting, recordHandwriting, handwritingStreak, warmup, handwritingLine, handwritingSummary } from '../js/core/handwriting.js';

const src = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const ASCENDER = /[bdfhklt]/;
const TAIL = /[gjpqy]/;

test('six lessons in UK teaching order, each well formed and about five minutes long', () => {
  assert.deepEqual(HANDWRITING_LESSONS.map((l) => l.kind), ['diagonal', 'horizontal', 'diagonal-tall', 'horizontal-tall', 'break', 'words']);
  assert.equal(new Set(HANDWRITING_LESSONS.map((l) => l.id)).size, HANDWRITING_LESSONS.length);
  for (const l of HANDWRITING_LESSONS) {
    assert.equal(LESSON_BY_ID[l.id], l);
    assert.ok(l.title && l.say && l.say.length <= 140, `${l.id}: a one-line explanation`);
    assert.ok(l.pairs.length >= 3 && l.pairs.length <= 5, `${l.id}: 3–5 joins`);
    assert.ok(l.words.length >= 3 && l.words.length <= 5, `${l.id}: 3–5 practice words`);
    for (const t of [l.demo, ...l.pairs, ...l.words]) assert.match(t, /^[a-z]+$/, `${l.id}: "${t}" is lowercase letters only`);
    assert.equal(new Set([...l.pairs, ...l.words]).size, l.pairs.length + l.words.length, `${l.id}: no repeats`);
  }
});

test('every join is the kind its lesson teaches', () => {
  const pairsOf = (id) => [LESSON_BY_ID[id].demo, ...LESSON_BY_ID[id].pairs];
  for (const p of pairsOf('diag')) { assert.equal(p.length, 2); assert.doesNotMatch(p[0], /[orvw]/, p); assert.doesNotMatch(p[1], ASCENDER, p); }
  for (const p of pairsOf('horiz')) { assert.match(p[0], /[orvw]/, p); assert.doesNotMatch(p[1], ASCENDER, p); }
  for (const p of pairsOf('diag-tall')) { assert.doesNotMatch(p[0], /[orvw]/, p); assert.match(p[1], ASCENDER, p); }
  for (const p of pairsOf('horiz-tall')) { assert.match(p[0], /[orvw]/, p); assert.match(p[1], ASCENDER, p); }
  for (const p of pairsOf('break')) assert.match(p[0], TAIL, p);
  // practice words contain a join of the lesson's kind
  for (const w of LESSON_BY_ID.horiz.words) assert.match(w, /[orvw][^bdfhklt]/, w);
  for (const w of LESSON_BY_ID['horiz-tall'].words) assert.match(w, /[orvw][bdfhklt]/, w);
  for (const w of LESSON_BY_ID['diag-tall'].words) assert.match(w, /[^orvw][bdfhklt]/, w);
  for (const w of LESSON_BY_ID.break.words) assert.match(w, /[gjpqy][a-z]/, w);
  const ends = LESSON_BY_ID.words.pairs;
  assert.ok(['ful', 'less', 'ness', 'ment', 'ly'].every((e) => ends.includes(e)));
  assert.ok(LESSON_BY_ID.words.words.includes('because') && LESSON_BY_ID.words.words.includes('beautiful'));
});

test('progress: lessons open in order, are recorded with dates, and feed the daily warm-up', () => {
  const hw = emptyHandwriting();
  assert.equal(unlockedHandwriting(hw), 1);
  assert.equal(nextHandwriting(hw).index, 0);
  assert.equal(handwritingLine(hw), 'Lesson 1 of 6: diagonal joins');
  assert.equal(warmup(hw, 100), null, 'no warm-up before the first lesson');
  recordHandwriting(hw, 'diag', 100);
  recordHandwriting(hw, 'horiz', 101);
  recordHandwriting(hw, 'diag', 101);
  assert.deepEqual(hw.lessons.diag, { day: 100, last: 101, times: 2 });
  assert.deepEqual(hw.days, [100, 101]);
  assert.equal(unlockedHandwriting(hw), 3);
  assert.equal(handwritingLine(hw), 'Lesson 3 of 6: diagonal joins to tall letters');
  assert.equal(handwritingStreak(hw, 101), 2);
  assert.equal(handwritingStreak(hw, 102), 2, 'the streak holds until the day is over');
  assert.equal(handwritingStreak(hw, 103), 0);
  const w = warmup(hw, 102);
  assert.equal(w.pairs.length, 3);
  assert.equal(w.words.length, 2);
  for (const x of [...w.pairs, ...w.words]) assert.ok(['diag', 'horiz'].includes(x.lesson));
  assert.deepEqual(warmup(hw, 102), w, 'the same warm-up all day');
  recordHandwriting(hw, null, 102);
  assert.deepEqual(hw.days, [100, 101, 102]);
  for (const l of HANDWRITING_LESSONS) recordHandwriting(hw, l.id, 103);
  assert.equal(nextHandwriting(hw), null);
  assert.match(handwritingLine(hw), /^All 6 lessons done · 4 days of practice$/);
  assert.match(handwritingSummary(hw), /^Handwriting joins: 6 of 6 lessons done, 4 days of practice\./);
  assert.equal(handwritingSummary(emptyHandwriting()), null);
  assert.deepEqual(emptyState(1).handwriting, emptyHandwriting());
});

test('the tool is wired for the Year 2 and Year 3 courses only', () => {
  for (const id of ['ks1', 'y3']) assert.ok(COURSES[id].tools.includes('handwriting'), id);
  for (const id of ['y6', 'y8']) assert.ok(!COURSES[id].tools.includes('handwriting'), id);
  assert.match(src('js/main.js'), /case 'handwriting': return handwritingScreen\(app\);/);
  assert.match(src('js/screens/home.js'), /handwriting: \(\) => card\(/);
});

test('the joined and semi-joined fonts are bundled, licensed and cached offline', () => {
  const css = src('css/app.css'), sw = src('sw.js');
  for (const f of ['playwrite-gb-j-latin-400-normal.woff2', 'playwrite-gb-s-latin-400-normal.woff2']) {
    assert.ok(existsSync(new URL(`../fonts/${f}`, import.meta.url)), f);
    assert.ok(css.includes(`url('../fonts/${f}')`), `@font-face for ${f}`);
    assert.ok(sw.includes(`"./fonts/${f}"`), `${f} precached`);
  }
  assert.match(src('fonts/LICENSE-playwrite.txt'), /SIL Open Font License/);
});
