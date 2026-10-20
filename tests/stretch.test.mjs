import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildDB } from '../js/core/content.js';
import { emptyState } from '../js/core/store.js';
import { topicStatus, stretchReady, STRETCH_READY_AT } from '../js/core/mastery.js';
import { topicChoices } from '../js/core/session.js';
import { topoOrder } from '../js/core/placement.js';
import { milestones, unlockedAccessories } from '../js/core/progress.js';
import { check } from '../js/core/checkers.js';
import { GENERATORS } from '../js/gen/index.js';
import { makeRng } from '../js/core/rng.js';

const root = new URL('../content/', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root)));
const db = buildDB(read('index.json').decks.map(read));
const secure = (day) => ({ ema: 0.9, n: 6, state: 'proficient', profDay: day, delayed: 0, started: day });

test('every subject has a stretch tier, and it stays locked until most of the subject is secure', () => {
  for (const subject of ['english', 'maths', 'history', 'geography', 'science']) {
    const all = db.topicOrder[subject], stretch = all.filter((id) => db.topics[id].tier === 'stretch'), base = all.filter((id) => db.topics[id].tier !== 'stretch');
    assert.ok(stretch.length >= 4, `${subject}: ${stretch.length} stretch topics`);
    const s = emptyState(500);
    // all prerequisites secure, but only half the subject: still locked
    for (const id of stretch) for (const p of db.topics[id].prereqs) if (db.topics[p].tier !== 'stretch') s.topics[p] = secure(490);
    // top up to just under the threshold
    const need = Math.ceil(base.length * STRETCH_READY_AT) - 1;
    for (const id of base) { if (Object.keys(s.topics).filter((t) => base.includes(t)).length >= need) break; s.topics[id] ||= secure(490); }
    assert.equal(stretchReady(db, s.topics, subject), false, `${subject}: just under the threshold`);
    for (const id of stretch) assert.equal(topicStatus(db.topics[id], s.topics, db), 'locked', `${id} locked at half`);
    assert.ok(!topicChoices(s, db, subject).some((id) => db.topics[id].tier === 'stretch'), `${subject}: not offered`);
    // most of the subject secure: open, provided prerequisites are
    base.slice(0, Math.ceil(base.length * STRETCH_READY_AT)).forEach((id) => { s.topics[id] = secure(490); });
    assert.equal(stretchReady(db, s.topics, subject), true);
    assert.ok(stretch.some((id) => topicStatus(db.topics[id], s.topics, db) === 'available'), `${subject}: something opens`);
    // never probed by placement
    for (const id of topoOrder(db, subject)) assert.notEqual(db.topics[id].tier, 'stretch', `${id} in placement`);
  }
});

test('securing five stretch topics earns the crown', () => {
  const s = emptyState(600);
  const ids = Object.keys(db.topics).filter((id) => db.topics[id].tier === 'stretch').slice(0, 5);
  ids.forEach((id) => { s.topics[id] = secure(590); });
  assert.ok(milestones(s, db).find((m) => m.id === 'stretch').done);
  assert.ok(unlockedAccessories(s, db).has('crown'));
});

test('algebraic answers accept spacing and order variants, reject wrong ones', () => {
  const rng = makeRng('alg');
  for (let i = 0; i < 200; i++) {
    const q = GENERATORS.expand(rng.int(1, 3), rng);
    assert.equal(check(q, q.answer.replace(/\s+/g, '')).correct, true, q.prompt);
    assert.equal(check(q, q.answer + ' ').correct, true);
    assert.equal(check(q, '99x + 99').correct, false);
    const p = GENERATORS.indices(2, rng);
    assert.equal(check(p, p.answer.replace('^', '^{') + '}').correct, true, p.prompt);
  }
  const q = GENERATORS.expand(1, makeRng('e1'));
  const m = q.answer.match(/^(-?\d*)x ([+-]) (\d+)$/);
  if (m) assert.equal(check(q, `${m[2] === '-' ? '-' : ''}${m[3]} + ${m[1]}x`).correct, true, 'reordered');
});

test('parallel-line angles are consistent with the diagram geometry', () => {
  const rng = makeRng('par');
  for (let i = 0; i < 300; i++) {
    const q = GENERATORS.parallelAngles(rng.int(1, 3), rng);
    const { a, known, ask } = q.diagram;
    const rt = known.r === 'rt' || known.r === 'lb' ? a : 180 - a;
    const val = (r) => (r === 'rt' || r === 'lb' ? rt : 180 - rt);
    assert.equal(val(known.r), a);
    assert.equal(+q.numeric.value, val(ask.r), q.prompt);
    assert.ok(!(known.line === ask.line && known.r === ask.r));
  }
});

test('circle and percentage answers are exact decimals', () => {
  const rng = makeRng('circ');
  for (let i = 0; i < 200; i++) {
    for (const lv of [1, 2, 3]) {
      const q = GENERATORS.circles(lv, rng);
      assert.match(q.numeric.value, /^\d+(\.\d{1,2})?$/, q.prompt);
      const p = GENERATORS.percentChange(lv, rng);
      assert.ok(Number.isInteger(+p.numeric.value) || /^\d+\.\d{1,2}$/.test(p.numeric.value), p.prompt);
    }
  }
});
