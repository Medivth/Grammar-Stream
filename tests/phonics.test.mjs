// Year 2 and 3 phonics follow the Read Write Inc. Speed Sounds, and take turns with stories.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { setCourse } from '../js/core/subjects.js';
import { buildDB } from '../js/core/content.js';
import { emptyState } from '../js/core/store.js';
import { topicChoices } from '../js/core/session.js';

const read = (p) => JSON.parse(readFileSync(new URL(`../content/${p}`, import.meta.url)));
const ks1 = buildDB(read('index-ks1.json').decks.map(read));
const y3Index = read('index-y3.json');
const y3 = buildDB(y3Index.decks.map(read));

test('every Set 2 and Set 3 Speed Sound has its phrase and a word to find', () => {
  const phrases = Object.values(ks1.items).filter((i) => i.id.endsWith('.phrase'));
  const sounds = new Set(phrases.map((i) => i.answer));
  for (const s of ['ay', 'ee', 'igh', 'ow', 'oo', 'ar', 'or', 'air', 'ir', 'ou', 'oy', 'ea', 'oi', 'a-e', 'i-e', 'o-e', 'u-e', 'aw', 'are', 'ur', 'er', 'ai', 'oa', 'ew', 'ire', 'ear', 'ure', 'tion', 'cious', 'e']) assert.ok(sounds.has(s), s);
  assert.ok(phrases.some((i) => i.prompt.includes('may I play')));
  for (const p of phrases) {
    assert.ok(!p.distractors.includes(p.answer), p.id);
    assert.equal(new Set(p.distractors).size, 3, `${p.id}: three different distractors`);
  }
  for (const t of ['reading.rwi-fred', 'reading.rwi-red', 'reading.rwi-alien']) assert.ok(ks1.itemsByTopic[t].length >= 12, t);
});

test('phonics takes turns with other reading topics when choosing', () => {
  setCourse('ks1');
  const choices = topicChoices(emptyState(1), ks1, 'reading');
  assert.ok(choices.some((t) => ks1.topics[t].strand === 'phonics'), choices.join());
  assert.ok(choices.some((t) => !ks1.topics[t].strand), choices.join());
});

test('in Year 3, the Year 2 phonics deck comes last and Year 3 phonics builds on it', () => {
  assert.equal(y3Index.decks.at(-1), 'ks1/reading/phonics.json');
  assert.equal(y3.topics['reading.y3-speedsounds'].strand, 'phonics');
  assert.ok(y3.itemsByTopic['reading.y3-speedsounds'].length >= 20);
  // once Year 2 phonics is done, Year 3 topics are offered before last year's leftovers
  setCourse('y3');
  const state = emptyState(1);
  for (const id of Object.keys(ks1.topics).filter((t) => ks1.topics[t].strand)) state.topics[id] = { state: 'mastered', ema: 0.95, n: 30 };
  const choices = topicChoices(state, y3, 'reading');
  assert.ok(y3.topics[choices[0]].deck.startsWith('y3'), choices.join());
});
