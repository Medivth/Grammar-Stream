import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Frac, parseNumber } from '../js/core/fraction.js';
import { check, normalise } from '../js/core/checkers.js';
import { recordTopicAttempt, newTopicState, isAvailable } from '../js/core/mastery.js';
import { pSuccess, eloUpdate, chooseByTarget } from '../js/core/elo.js';
import { makeRng } from '../js/core/rng.js';
import { weekStart, dayNumber, dayToISO } from '../js/core/dates.js';

test('fractions: arithmetic and parsing', () => {
  assert.ok(new Frac(1, 2).add(new Frac(1, 3)).eq(new Frac(5, 6)));
  assert.equal(new Frac(6, 8).simplify().toString(), '3/4');
  assert.ok(parseNumber('1 3/4').value.eq(new Frac(7, 4)));
  assert.ok(parseNumber('−2.5').value.eq(new Frac(-5, 2)));
  assert.ok(parseNumber('1,250').value.eq(new Frac(1250)));
  assert.equal(parseNumber('abc'), null);
  assert.equal(parseNumber('3/0'), null);
  assert.equal(new Frac(7, 4).toTex({ mixed: true }), '1{{3/4}}');
});

test('typed answers: case, spacing, near misses, strict spelling', () => {
  const q = { kind: 'typed', answer: 'Budapest', accept: [] };
  assert.equal(check(q, '  budapest. ').correct, true);
  assert.equal(check(q, 'Budapset').correct, false);
  assert.equal(check(q, 'Budapes').near, true);
  const spell = { kind: 'typed', answer: 'necessary', strict: true };
  assert.equal(check(spell, 'neccessary').correct, false);
  assert.equal(normalise('It’s  FINE!'), "it's fine");
});

test('numeric answers respect the required form', () => {
  const q = { kind: 'typed', numeric: { value: '3/4', form: 'simplest' } };
  assert.equal(check(q, '3/4').correct, true);
  assert.equal(check(q, '0.75').correct, true);
  const r = check(q, '6/8');
  assert.equal(r.correct, false);
  assert.equal(r.score, 0.5);
  const m = { kind: 'typed', numeric: { value: '7/4', form: 'mixed' } };
  assert.equal(check(m, '7/4').correct, false);
  assert.equal(check(m, '1 3/4').correct, true);
});

test('weighted choice gives partial credit', () => {
  const q = { kind: 'choice', weighted: true, options: [{ text: 'a', weight: 3 }, { text: 'b', weight: 1 }] };
  assert.equal(check(q, 0).correct, true);
  assert.ok(Math.abs(check(q, 1).score - 1 / 3) < 1e-9);
});

test('sentence checks report each failed rule', () => {
  const q = {
    kind: 'sentence',
    checks: [{ type: 'includesAny', words: ['which', 'who'], msg: 'Use a relative pronoun.' }, { type: 'capital' }, { type: 'endPunct' }],
  };
  assert.equal(check(q, 'The dog, which was old, slept.').correct, true);
  const r = check(q, 'the dog slept');
  assert.equal(r.failed.length, 3);
});

test('mastery: five straight correct answers reach proficient; mastery needs delayed passes', () => {
  let t = newTopicState();
  for (let i = 0; i < 4; i++) t = recordTopicAttempt(t, true, 10);
  assert.equal(t.state, 'learning');
  t = recordTopicAttempt(t, true, 10);
  assert.equal(t.state, 'proficient');
  t = recordTopicAttempt(t, true, 11);
  assert.equal(t.delayed, 0, 'too soon to count');
  t = recordTopicAttempt(t, true, 14);
  t = recordTopicAttempt(t, true, 16);
  assert.equal(t.state, 'mastered');
  assert.ok(isAvailable({ prereqs: ['a'] }, { a: t }));
  assert.ok(!isAvailable({ prereqs: ['a', 'b'] }, { a: t }));
});

test('elo: correct answers raise ability, selection targets about 77%', () => {
  const { learner, item } = eloUpdate({ ability: 0, attempts: 0 }, { difficulty: 0, attempts: 0 }, true);
  assert.ok(learner.ability > 0 && item.difficulty < 0);
  const rng = makeRng(3);
  const cands = [-3, -1.5, -1.2, 0, 1, 2].map((d, i) => ({ id: i, difficulty: d }));
  for (let i = 0; i < 20; i++) {
    const c = chooseByTarget(cands, 0, rng, { spread: 2 });
    assert.ok([-1.5, -1.2].includes(c.difficulty), 'nearest to 0.77 success');
  }
  assert.ok(pSuccess(0, 0, 0.25) > pSuccess(0, 0));
});

test('dates: Monday week start', () => {
  const mon = dayNumber(new Date(2026, 9, 19, 12)); // Monday 19 Oct 2026
  assert.equal(dayToISO(mon), '2026-10-19');
  assert.equal(weekStart(mon), mon);
  assert.equal(weekStart(mon + 6), mon);
});
