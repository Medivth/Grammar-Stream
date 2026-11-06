// Collectible cards: a card for every topic, facts taken from the topic's own text, sets and
// their fixed prizes, and the album's counts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildDB } from '../js/core/content.js';
import { emptyState } from '../js/core/store.js';
import { COURSES, setCourse } from '../js/core/subjects.js';
import { cardSets, setDefs, allCardIds, collected, setProgress, cardCount, syncCollection, cardFact, sentences, cardRewardAccessories, cardRewardScenes, wonCardRewards, rewardSet, setOfTopic, cardTheme } from '../js/core/cards.js';
import { milestoneDefs, unlocksOf, unlockedAccessories, wardrobeAccessories } from '../js/core/progress.js';
import { EMBLEMS, emblemSVG, emblemFor } from '../js/ui/cardart.js';
import { ACCESSORIES } from '../js/ui/capybara.js';
import { SCENE_BY_ID, REWARD_SCENES, sceneOrder } from '../js/ui/scenes.js';

const root = new URL('../content/', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root)));
const DBS = {};
const dbFor = (course) => (DBS[course] ||= buildDB(read(COURSES[course].index.replace(/^content\//, '')).decks.map(read)));
const secure = { ema: 0.9, n: 6, state: 'proficient', profDay: 1, delayed: 0, started: 1 };
const COURSE_IDS = ['ks1', 'y3', 'y6', 'y8'];

test('every topic has exactly one card, in exactly one set of its own subject', () => {
  for (const id of COURSE_IDS) {
    setCourse(id);
    const db = dbFor(id);
    const sets = cardSets(db);
    const ids = allCardIds(db);
    assert.equal(new Set(ids).size, ids.length, `${id}: no card twice`);
    assert.deepEqual([...ids].sort(), Object.keys(db.topics).sort(), `${id}: a card for every topic`);
    assert.equal(new Set(sets.map((s) => s.id)).size, sets.length, `${id}: set ids are unique`);
    for (const s of sets) {
      assert.ok(s.topics.length >= 2, `${id}: ${s.id} has ${s.topics.length} cards`);
      assert.ok(s.topics.length <= 16, `${id}: ${s.id} has ${s.topics.length} cards`);
      for (const t of s.topics) assert.equal(db.topics[t].subject, s.subject, `${t} is in a ${s.subject} set`);
      for (const e of s.emblems) assert.ok(EMBLEMS[e], `${s.id}: emblem ${e} is drawn`);
    }
    // every subject's last set takes what its rules leave, so a new topic always finds a set
    for (const sub of COURSES[id].subjects) assert.ok(setDefs().some((d) => d.subject === sub.id && !d.m), `${id}: ${sub.id} has a set for the rest`);
    // the themed sub-sets the boy asked for
    if (COURSES[id].young) {
      assert.deepEqual(setOfTopic(db, 'science.dinosaurs')?.name, 'Dinosaurs and fossils');
      assert.deepEqual(setOfTopic(db, 'science.space')?.name, 'Space');
    }
  }
  setCourse('y6');
});

test('Year 3 keeps every Year 2 set and prize, so moving up keeps the collection', () => {
  setCourse('ks1');
  const ks1 = Object.fromEntries(cardSets(dbFor('ks1')).map((s) => [s.id, s]));
  setCourse('y3');
  const y3 = Object.fromEntries(cardSets(dbFor('y3')).map((s) => [s.id, s]));
  for (const [sid, s] of Object.entries(ks1)) {
    assert.ok(y3[sid], `Year 3 has ${sid}`);
    assert.deepEqual(y3[sid].reward, s.reward);
    for (const t of s.topics) assert.ok(y3[sid].topics.includes(t), `${t} stays in ${sid}`);
  }
  assert.equal(cardTheme(), 'young');
  setCourse('y6');
});

test('a card’s fact is a real sentence from the topic’s own hook or intro, short, never made up', () => {
  const norm = (t) => String(t || '').replace(/\s+/g, ' ');
  for (const id of COURSE_IDS) {
    setCourse(id);
    const db = dbFor(id);
    for (const t of Object.values(db.topics)) {
      const f = cardFact(t);
      assert.ok(f.length >= 12, `${t.id}: a fact (${f})`);
      assert.ok(norm(t.hook).includes(f) || norm(t.intro).includes(f), `${t.id}: "${f}" comes from the topic`);
      assert.ok(f.length <= 240, `${t.id}: short (${f.length})`);
    }
  }
  // the choice: a statement over an instruction or a question
  assert.equal(cardFact({ intro: 'Read each one carefully. Dinosaurs ruled the Earth for millions of years. What did they eat?' }), 'Dinosaurs ruled the Earth for millions of years.');
  assert.equal(cardFact({ hook: 'Say it: SKOO-tuh-ree.', intro: 'In 1854 Britain was at war with Russia.' }), 'In 1854 Britain was at war with Russia.');
  assert.equal(cardFact({ hook: 'Rivers carve a V; glaciers carve a U.', intro: 'Ice is powerful.' }), 'Rivers carve a V; glaciers carve a U.');
  assert.deepEqual(sentences('a.m. is before noon. Then 3 p.m. comes. “Go!” she said.'), ['a.m. is before noon.', 'Then 3 p.m. comes.', '“Go!” she said.']);
  setCourse('y6');
});

test('securing a topic earns its card for good; a set completes and stays won', () => {
  setCourse('ks1');
  const db = dbFor('ks1');
  const s = emptyState(100);
  assert.deepEqual(s.collection, {});
  assert.deepEqual(s.cardSets, {});
  assert.equal(cardCount(s, db).have, 0);
  // secure now: it shows straight away, before anything is stored
  s.topics['science.dinosaurs'] = { ...secure };
  assert.ok(collected(s, db).has('science.dinosaurs'));
  assert.deepEqual(syncCollection(s, db, 101), { cards: ['science.dinosaurs'], sets: [] });
  assert.deepEqual(syncCollection(s, db, 102), { cards: [], sets: [] }, 'nothing new the second time');
  assert.equal(s.collection['science.dinosaurs'], 101);
  // a topic that slips back keeps its card
  s.topics['science.dinosaurs'] = { ...secure, state: 'learning' };
  assert.ok(collected(s, db).has('science.dinosaurs'));
  // learning topics and assumed-by-placement topics: only secure ones count
  s.topics['science.space'] = { ...secure, state: 'learning' };
  assert.ok(!collected(s, db).has('science.space'));
  // finish the dinosaur set: its scene is won, and stays won
  s.topics['science.rocks'] = { ...secure, state: 'mastered' };
  const fresh = syncCollection(s, db, 103);
  assert.deepEqual(fresh, { cards: ['science.rocks'], sets: ['yc-dinos'] });
  assert.equal(s.cardSets['yc-dinos'], 103);
  const dino = setProgress(s, db).find((x) => x.id === 'yc-dinos');
  assert.deepEqual([dino.have, dino.total, dino.complete, dino.won], [2, 2, true, true]);
  assert.deepEqual(wonCardRewards(s, db).scenes, ['digsite']);
  // a won set stays won even if new topics join it later (recorded by id)
  const later = { ...s, collection: { 'science.rocks': 103 }, topics: {} };
  assert.ok(setProgress(later, db).find((x) => x.id === 'yc-dinos').won);
  setCourse('y6');
});

test('a full set’s prize unlocks in the wardrobe; prizes are fixed, unique, and not earned any other way', () => {
  for (const id of COURSE_IDS) {
    setCourse(id);
    const db = dbFor(id);
    const starter = new Set(COURSES[id].starter);
    const badges = new Set(milestoneDefs().flatMap(unlocksOf));
    const bonus = new Set(COURSES[id].bonus?.prize || []);
    const acc = cardRewardAccessories();
    assert.equal(new Set(acc).size, acc.length, `${id}: each accessory is one set's prize`);
    for (const a of acc) {
      assert.ok(ACCESSORIES[a], `${id}: ${a} is a real accessory`);
      assert.ok(!starter.has(a) && !badges.has(a) && !bonus.has(a), `${id}: ${a} is not already free or earned another way`);
      assert.ok(wardrobeAccessories().has(a), `${id}: the wardrobe shows ${a}`);
    }
    const scenes = cardRewardScenes().map((x) => x.id);
    assert.equal(new Set(scenes).size, scenes.length);
    for (const sc of scenes) {
      assert.ok(SCENE_BY_ID[sc] && REWARD_SCENES.includes(sc), `${id}: ${sc} is a reward scene`);
      for (const c of COURSE_IDS) { setCourse(c); assert.ok(!sceneOrder().includes(sc), `${sc} is not opened by badges in ${c}`); }
      setCourse(id);
    }
    // nothing collected: no prizes
    assert.deepEqual(wonCardRewards(emptyState(1), db), { acc: [], scenes: [] });
    // collect one set with an accessory: it unlocks, and the rest stay locked
    const set = cardSets(db).find((s) => s.reward?.acc);
    const s = emptyState(1);
    for (const t of set.topics) s.topics[t] = { ...secure };
    const open = unlockedAccessories(s, db);
    assert.ok(open.has(set.reward.acc), `${id}: ${set.id} unlocks ${set.reward.acc}`);
    for (const other of acc) if (other !== set.reward.acc) assert.ok(!open.has(other), `${id}: ${other} is still locked`);
    assert.equal(rewardSet(set.reward.acc).id, set.id);
    // one card short: not yet
    delete s.topics[set.topics[0]];
    assert.ok(!unlockedAccessories(s, db).has(set.reward.acc));
    // the course's share of prizes
    const prized = cardSets(db).filter((x) => x.reward).length;
    assert.ok(prized >= 7, `${id}: ${prized} sets win a prize`);
  }
  setCourse('y8');
  assert.ok(cardSets(dbFor('y8')).every((x) => x.reward), 'every Year 8 set wins something to wear');
  setCourse('y6');
});

test('album counts: per set and in all add up', () => {
  setCourse('y8');
  const db = dbFor('y8');
  const s = emptyState(1);
  const pick = Object.keys(db.topics).filter((_, i) => i % 9 === 0);
  for (const t of pick) s.topics[t] = { ...secure };
  s.collection = { 'greek.alphabet-1': 1, 'no.such-topic': 1 }; // a stored card for a topic since removed is ignored
  const sets = setProgress(s, db);
  const { have, total } = cardCount(s, db);
  assert.equal(total, Object.keys(db.topics).length);
  assert.equal(have, new Set([...pick, 'greek.alphabet-1']).size);
  assert.equal(sets.reduce((a, x) => a + x.have, 0), have);
  assert.equal(sets.reduce((a, x) => a + x.total, 0), total);
  for (const x of sets) assert.ok(x.have <= x.total && x.complete === (x.have === x.total));
  setCourse('y6');
});

test('emblems are small, well-formed SVG, picked steadily per card', () => {
  for (const [id, body] of Object.entries(EMBLEMS)) {
    const svg = emblemSVG(id);
    assert.ok(svg.length < 2500, `${id}: ${svg.length} characters`);
    assert.ok(!/NaN|undefined/.test(svg), id);
    const stack = [];
    for (const [, close, name, , self] of svg.matchAll(/<(\/?)([a-zA-Z]+)([^>]*?)(\/?)>/g)) {
      if (close) assert.equal(stack.pop(), name, `${id}: balanced`); else if (!self) stack.push(name);
    }
    assert.deepEqual(stack, [], id);
    assert.ok(body.length > 20);
  }
  assert.equal(emblemFor('science.dinosaurs', ['dino', 'fossil']), emblemFor('science.dinosaurs', ['dino', 'fossil']));
  assert.equal(emblemFor('x', []), 'star');
});
