// Year 2 reading at greater depth (tools/content-src/ks1/reading4.mjs): inference, prediction,
// linking a story with a fact file, and comparing stories the child has already read.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { setCourse } from '../js/core/subjects.js';
import { buildDB, validateDB } from '../js/core/content.js';
import { GENERATORS } from '../js/gen/index.js';
import { present } from '../js/core/present.js';
import { check, correctResponse } from '../js/core/checkers.js';
import { emptyState } from '../js/core/store.js';
import { makeRng } from '../js/core/rng.js';
import { isAvailable } from '../js/core/mastery.js';

setCourse('ks1');
const root = new URL('../content/', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root)));
const index = read('index-ks1.json');
const db = buildDB(index.decks.map(read));
const PASSAGES = JSON.parse(readFileSync(new URL('../tools/content-src/ks1/passages4.json', import.meta.url)));
const TOPICS = ['reading.detective', 'reading.predict', 'reading.links', 'reading.compare'];
const items = Object.values(db.items).filter((i) => TOPICS.includes(i.topic));
const words = (t) => t.split(/\s+/).filter(Boolean).length;

test('the depth deck is in both courses, with four reading topics and plenty of questions', () => {
  assert.ok(index.decks.includes('ks1/reading/depth.json'));
  assert.ok(read('index-y3.json').decks.includes('ks1/reading/depth.json'), 'Year 3 includes it too');
  assert.deepEqual(validateDB(db, GENERATORS), []);
  for (const id of TOPICS) {
    const t = db.topics[id];
    assert.equal(t.kind, 'reading', id);
    assert.ok(t.intro && t.teach && t.talk, `${id}: intro, teach and talk`);
    assert.match(t.teach, /grown-up/, `${id}: the teach prompt is something to talk about with a grown-up`);
    assert.ok(!t.tier, `${id}: core, not stretch`);
  }
  const count = (id) => db.itemsByTopic[id].length;
  assert.ok(count('reading.detective') >= 25 && count('reading.predict') >= 25 && count('reading.links') >= 20);
  assert.ok(count('reading.compare') >= 8 && count('reading.compare') <= 14);
  assert.ok(items.every((i) => i.id.startsWith('reading.d4.')));
});

test('they open only after the reading they build on', () => {
  const T = (id) => db.topics[id];
  assert.ok(T('reading.detective').prereqs.includes('reading.adventures'));
  assert.ok(T('reading.predict').prereqs.includes('reading.detective'));
  // compare reminds him of fables, adventures and Beatrix Potter: all of those come first
  const before = new Set();
  const walk = (id) => { for (const p of T(id).prereqs) if (!before.has(p)) { before.add(p); walk(p); } };
  walk('reading.compare');
  for (const p of ['reading.fables', 'reading.fables-3', 'reading.adventures', 'reading.stories-2', 'reading.stories-3', 'reading.stories-4', 'reading.potter', 'reading.potter-2']) assert.ok(before.has(p), `compare after ${p}`);
  before.clear();
  walk('reading.links');
  for (const p of ['reading.facts-2', 'reading.stories-3', 'reading.stories-4']) assert.ok(before.has(p), `links after ${p} (its look-back questions)`);
  assert.equal(isAvailable(T('reading.detective'), {}), false);
  const done = Object.fromEntries(T('reading.detective').prereqs.map((p) => [p, { state: 'proficient' }]));
  assert.equal(isAvailable(T('reading.detective'), done), true);
});

test('every item is well formed: one correct option, kind feedback on every wrong one, a passage', () => {
  for (const it of items) {
    assert.ok(['mcq', 'order'].includes(it.kind), `${it.id}: ${it.kind}`);
    assert.ok(it.passage && it.passageSource, `${it.id}: carries its passage`);
    assert.ok(it.explain, `${it.id}: explain`);
    if (it.kind === 'order') { assert.ok(it.items.length >= 4 && new Set(it.items).size === it.items.length, it.id); continue; }
    assert.equal(it.options.length, 3, `${it.id}: three options`);
    assert.equal(it.options.filter((o) => o.correct).length, 1, `${it.id}: one correct`);
    assert.equal(new Set(it.options.map((o) => o.text)).size, 3, `${it.id}: distinct options`);
    for (const o of it.options.filter((x) => !x.correct)) assert.ok(o.feedback && o.feedback.length > 10, `${it.id}: feedback for “${o.text}”`);
    // an option quoted from the text must really be in the text
    for (const o of it.options) {
      const m = o.text.match(/^“(.+?)[.!?]?”$/);
      if (m) assert.ok(it.passage.toLowerCase().includes(m[1].toLowerCase()), `${it.id}: “${m[1]}” is not in its passage`);
    }
  }
  const mcqs = items.filter((i) => i.kind === 'mcq').length;
  assert.ok(items.length - mcqs >= 3, 'some order questions');
});

test('passages: original, 120-280 words, curly quotes, and every one is used', () => {
  const all = items.map((i) => i.passage).join('\n\n');
  for (const [k, p] of Object.entries(PASSAGES)) {
    assert.ok(!/["']/.test(p.passage), `${k}: straight quotes`);
    assert.ok(p.passageSource, `${k}: source`);
    if (!k.startsWith('cmp.')) assert.ok(words(p.passage) >= 120 && words(p.passage) <= 280, `${k}: ${words(p.passage)} words`);
    assert.ok(all.includes(p.passage), `${k}: no item uses this passage`);
  }
  // part 2 of a prediction story comes with part 1, so "which clue in part 1…?" can be answered from the page
  for (const it of items.filter((i) => /\(part 2\)/.test(i.passage))) assert.match(it.passage, /\(part 1\)[\s\S]*\(part 2\)/, it.id);
  for (const it of items.filter((i) => /^Which prediction/.test(i.prompt))) assert.ok(!/\(part 2\)/.test(it.passage), `${it.id}: predicts from part 1 only`);
});

test('compare reminders stay faithful to the stories in the app', () => {
  const app = Object.values(db.items).filter((i) => !TOPICS.includes(i.topic) && i.passage).map((i) => `${i.passageSource}\n${i.passage}`).join('\n');
  // each story named in a reminder is one he has met elsewhere in the course (by its title or its source)
  for (const [k, p] of Object.entries(PASSAGES).filter(([key]) => key.startsWith('cmp.'))) {
    const titles = p.passage.split('\n\n').slice(1).map((para) => para.split('\n')[0]);
    assert.ok(titles.length >= 2, k);
    for (const t of titles) assert.ok(app.includes(t), `${k}: “${t}” is not a story in the app`);
  }
  // quoted lines in the reminders are the app's own words
  for (const q of ['You’re too small to win', 'It’s not about size. It’s about practice.', 'Being small', 'is exactly what we needed today.', 'I would rather eat beans in peace than cake in fear.', 'You don’t need superpowers to be brave', 'You’re a hero too']) assert.ok(app.includes(q), q);
});

test('the right answer is not given away by being the longest option', () => {
  let n = 0, longest = 0, clearly = 0, chance = 0;
  for (const it of items.filter((i) => i.kind === 'mcq')) {
    const c = it.options.find((o) => o.correct).text.length;
    const w = Math.max(...it.options.filter((o) => !o.correct).map((o) => o.text.length));
    n++; chance += 1 / it.options.length;
    if (c > w) longest++;
    if (c > w * 1.3 && c - w >= 8) clearly++;
  }
  assert.ok(longest / n <= chance / n + 0.08, `correct option longest in ${longest} of ${n}`);
  assert.ok(clearly / n <= 0.04, `clearly longest in ${clearly} of ${n}`);
});

test('every item presents, fills the hero name, and accepts its own answer', () => {
  const state = emptyState(20000);
  state.profile = { hero: 'Captain Thunder' };
  const rng = makeRng('depth');
  for (const it of items) {
    const q = present(it, undefined, { db, state, rng });
    const text = `${q.prompt} ${q.passage} ${q.explain} ${(q.options || []).map((o) => `${o.text} ${o.feedback || ''}`).join(' ')}`;
    assert.ok(!/\{hero\}|undefined/.test(text), `${it.id}: unfilled text`);
    assert.equal(check(q, correctResponse(q)).correct, true, it.id);
  }
  const heroes = present(db.items['reading.d4.cmp.9'], undefined, { db, state, rng });
  assert.ok(heroes.passage.includes('Captain Thunder and the Sniffly Day') && heroes.options.some((o) => o.text.includes('Captain Thunder')));
});
