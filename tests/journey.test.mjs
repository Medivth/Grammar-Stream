// The journey map's state and layout: which stone is current, which stones show, which regions are open.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildDB } from '../js/core/content.js';
import { emptyState } from '../js/core/store.js';
import { setCourse, COURSES, SUBJECTS, isStretch } from '../js/core/subjects.js';
import { stoneWindow, regionModel, journeyModel, regionLabel, mapLayout, slotPoints, spurPt, journeySVG, LAYOUT } from '../js/ui/journey.js';

const root = new URL('../content/', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root)));
const dbFor = (id) => { setCourse(id); return buildDB(read(COURSES[id].index.replace('content/', '')).decks.map(read)); };
const secure = (day = 1, state = 'proficient') => ({ ema: 0.9, n: 6, state, profDay: day, delayed: 0, started: day });
const learning = (day) => ({ ema: 0.6, n: 3, state: 'learning', profDay: null, delayed: 0, started: day });
const coreOf = (db, s) => db.topicOrder[s].filter((id) => !isStretch(db.topics[id]) && !db.topics[id].bonus);

test('the window of stones: a fixed number of places, the current stone two in, "+N" markers for the rest', () => {
  assert.deepEqual(stoneWindow(5, 0, 7), { a: 0, b: 5, before: 0, after: 0 });
  assert.deepEqual(stoneWindow(38, 0, 7), { a: 0, b: 6, before: 0, after: 32 });
  assert.deepEqual(stoneWindow(38, 10, 7), { a: 8, b: 13, before: 8, after: 25 });
  assert.deepEqual(stoneWindow(38, 37, 7), { a: 32, b: 38, before: 32, after: 0 });
  for (const n of [8, 20, 69]) for (let idx = 0; idx < n; idx++) {
    const w = stoneWindow(n, idx, 7);
    const places = (w.b - w.a) + (w.before ? 1 : 0) + (w.after ? 1 : 0);
    assert.equal(places, 7, `n ${n} idx ${idx}`);
    assert.ok(idx >= w.a && idx < w.b, `current shows: n ${n} idx ${idx}`);
    assert.equal(w.before + (w.b - w.a) + w.after, n);
  }
});

test('Year 6: the current stone is the most recently started topic, else the next one open', () => {
  const db = dbFor('y6');
  const s = emptyState(100);
  const ids = coreOf(db, 'maths');
  let r = regionModel(s, db, 'maths');
  assert.equal(r.current, ids.find((id) => db.topics[id].prereqs.length === 0), 'fresh: the first open topic');
  assert.equal(r.reached, false);
  assert.equal(r.before, 0);
  ids.slice(0, 12).forEach((id) => { s.topics[id] = secure(); });
  s.topics[ids[12]] = learning(50);
  s.topics[ids[14]] = learning(60);
  r = regionModel(s, db, 'maths');
  assert.equal(r.current, ids[14], 'the later start wins');
  assert.equal(r.stones.findIndex((x) => x.id === r.current), 2, 'two stones show behind it');
  assert.equal(r.before, 12);
  assert.equal(r.beforeSecure, true);
  assert.equal(r.secure, 12);
  assert.ok(r.reached);
  assert.match(regionLabel({ ...r, name: 'Maths', region: 'Number Peaks', open: true }), /^Maths, Number Peaks: 12 of \d+ topics secure$/);
});

test('a finished road shows its end, and the stretch path opens', () => {
  const db = dbFor('y6');
  const s = emptyState(100);
  for (const id of coreOf(db, 'geography')) s.topics[id] = secure(1, 'mastered');
  const r = regionModel(s, db, 'geography');
  assert.ok(r.complete);
  assert.equal(r.after, 0);
  assert.equal(r.stones.at(-1).id, coreOf(db, 'geography').at(-1));
  assert.ok(r.stones.every((x) => x.status === 'mastered'));
  assert.equal(r.mastered, coreOf(db, 'geography').length);
  assert.ok(r.stretch.total >= 4 && r.stretch.stones.length === 3);
  assert.equal(r.stretch.stones.find((x) => x.id === r.current)?.status, 'available', 'the next step is up the stretch path');
});

test('bonus topics stay off the road: a badge of their own', () => {
  const db = dbFor('y6');
  const r = regionModel(emptyState(100), db, 'science');
  assert.ok(!r.stones.some((x) => db.topics[x.id].bonus));
  assert.equal(r.bonus.total, 8);
  assert.ok(db.topics[r.bonus.next].bonus);
  assert.equal(regionModel(emptyState(100), db, 'english').bonus, null);
});

test('Years 2/3: regions open once reached, and the companion stands on the latest topic', () => {
  const db = dbFor('ks1');
  const s = emptyState(100);
  let m = journeyModel(s, db, SUBJECTS);
  assert.deepEqual(m.regions.map((r) => r.open), [true, false, false, false, false], 'the first region is open from the start');
  assert.equal(m.here, 'maths');
  assert.equal(m.regions.filter((r) => r.here).length, 1);
  s.topics[coreOf(db, 'reading')[0]] = learning(40);
  s.topics[coreOf(db, 'spelling')[0]] = secure(30);
  s.topics[coreOf(db, 'maths')[0]] = learning(20);
  m = journeyModel(s, db, SUBJECTS);
  assert.deepEqual(m.regions.map((r) => r.open), [true, true, true, false, false]);
  assert.equal(m.here, 'reading', 'started most recently');
  assert.equal(m.regions.find((r) => r.here).current, coreOf(db, 'reading')[0]);
  assert.match(regionLabel(m.regions[4]), /0 of \d+ topics secure\. Not started yet$/);
});

test('Year 8: seven regions on one road; layouts keep every stone inside its region', () => {
  const db = dbFor('y8');
  const s = emptyState(100);
  coreOf(db, 'greek').slice(0, 20).forEach((id) => { s.topics[id] = secure(); });
  s.topics[coreOf(db, 'greek')[20]] = learning(70);
  const m = journeyModel(s, db, SUBJECTS);
  assert.equal(m.regions.length, 7);
  assert.equal(m.here, 'greek');
  for (const L of [LAYOUT.phone, LAYOUT.tablet]) {
    const { cells, w, h } = mapLayout(7, L);
    assert.equal(cells.length, 7);
    for (const c of cells) assert.ok(c.x >= 0 && c.x + L.cw <= w && c.y >= 0 && c.y + L.ch <= h);
    // the road snakes: each row runs the other way from the one before
    assert.ok(cells.every((c, i) => c.dir === (Math.floor(i / L.cols) % 2 ? -1 : 1)));
    const svg = journeySVG(journeyModel(s, db, SUBJECTS, { slots: L.slots }), L, { name: 'Glaukos' });
    assert.equal(svg.match(/role="button"/g).length, 7, 'each region is a button');
    assert.equal(svg.match(/class="jr-companion"/g).length, 1, 'one companion on the map');
    assert.ok(svg.length < 200000, `light: ${svg.length} characters`);
  }
  for (const L of Object.values(LAYOUT)) for (const dir of [1, -1]) {
    const pts = [...slotPoints(L.slots, L, dir), ...[0, 1, 2].map((k) => spurPt(L, dir, k))];
    for (const p of pts) assert.ok(p.x - L.r >= 0 && p.x + L.r <= L.cw && p.y - L.r - 24 >= 0 && p.y + L.r <= L.ch, `${p.x},${p.y} inside, with room for the summit flag`);
  }
});
