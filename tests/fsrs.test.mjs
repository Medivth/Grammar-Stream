import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createFSRS, Rating } from '../js/core/fsrs.js';
import { makeRng } from '../js/core/rng.js';

const ref = JSON.parse(readFileSync(new URL('./fixtures/fsrs_reference.json', import.meta.url)));

test('matches py-fsrs reference values for every case', () => {
  let checked = 0;
  for (const { retention, steps } of ref) {
    const f = createFSRS({ retention, fuzz: false });
    let card;
    for (const st of steps) {
      card = f.review(card, st.rating, st.day);
      assert.ok(Math.abs(card.s - st.s) < 1e-9, `stability ${card.s} vs ${st.s} (day ${st.day})`);
      assert.ok(Math.abs(card.d - st.d) < 1e-9, `difficulty ${card.d} vs ${st.d}`);
      assert.equal(card.ivl, st.ivl, `interval on day ${st.day}`);
      checked++;
    }
  }
  assert.ok(checked > 100);
});

test('a lapse keeps part of the old stability rather than resetting', () => {
  const f = createFSRS({ fuzz: false });
  let c = f.review(undefined, Rating.Good, 0);
  c = f.review(c, Rating.Good, c.due);
  c = f.review(c, Rating.Good, c.due);
  const before = c.s;
  c = f.review(c, Rating.Again, c.due);
  assert.ok(c.s > f.initS(Rating.Again), 'stability after lapse is above a brand new card');
  assert.ok(c.s < before);
  assert.equal(c.lapses, 1);
});

test('retrievability is 0.9 at one stability-length of elapsed time', () => {
  const f = createFSRS();
  assert.ok(Math.abs(f.retrievability(10, 10) - 0.9) < 1e-12);
  assert.equal(f.retrievability(5, 0), 1);
});

test('lower retention target gives longer intervals', () => {
  assert.ok(createFSRS({ retention: 0.85 }).nextInterval(20) > createFSRS({ retention: 0.9 }).nextInterval(20));
});

test('fuzz stays inside the published range and is reproducible', () => {
  const f = createFSRS();
  const a = makeRng(1), b = makeRng(1);
  for (const ivl of [1, 2, 3, 10, 30, 100]) {
    const x = f.fuzzInterval(ivl, a);
    assert.equal(x, f.fuzzInterval(ivl, b));
    if (ivl < 2.5) assert.equal(x, ivl);
    else {
      const delta = 1 + 0.15 * (Math.min(ivl, 7) - 2.5) + 0.1 * Math.max(Math.min(ivl, 20) - 7, 0) + 0.05 * Math.max(ivl - 20, 0);
      assert.ok(x >= Math.max(2, Math.round(ivl - delta)) && x <= Math.round(ivl + delta) + 1, `${ivl} -> ${x}`);
    }
  }
});
