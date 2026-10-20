import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GENERATORS } from '../js/gen/index.js';
import { check, correctResponse, normalise } from '../js/core/checkers.js';
import { parseNumber } from '../js/core/fraction.js';
import { makeRng } from '../js/core/rng.js';
import { centuryOf, ordinal } from '../js/gen/history.js';

const N = 300;
const BAD_TEXT = /undefined|NaN|null|\[object|Infinity/;

export function assertWellFormed(q, label) {
  assert.ok(q.prompt && typeof q.prompt === 'string', `${label}: prompt`);
  const texts = [q.prompt, q.explain, ...(q.steps || []), ...(q.options || []).map((o) => o.text), ...(q.options || []).map((o) => o.feedback || '')];
  for (const t of texts) assert.ok(!BAD_TEXT.test(t ?? ''), `${label}: bad text "${t}"`);
  assert.ok(q.explain, `${label}: explain`);
  assert.ok((q.prompt.match(/\{\{/g) || []).length === (q.prompt.match(/\}\}/g) || []).length, `${label}: unbalanced fraction tokens`);
  if (q.kind === 'choice') {
    const right = q.options.filter((o) => o.correct);
    assert.equal(right.length, 1, `${label}: exactly one correct option`);
    const norm = q.options.map((o) => normalise(o.text));
    assert.equal(new Set(norm).size, norm.length, `${label}: duplicate options ${norm}`);
    assert.ok(q.options.length >= 2);
  }
  if (q.kind === 'typed' && q.numeric) {
    assert.ok(parseNumber(q.numeric.value), `${label}: numeric value parses (${q.numeric.value})`);
  }
  if (q.kind === 'numberline') {
    assert.ok(q.target > q.min && q.target < q.max, `${label}: target inside line`);
  }
  const r = check(q, correctResponse(q));
  assert.equal(r.correct, true, `${label}: correct response accepted`);
  if (q.steps) assert.ok(q.steps.length >= 2, `${label}: worked example has steps`);
}

for (const [name, gen] of Object.entries(GENERATORS)) {
  test(`generator ${name}: ${N} items per level are well formed and self-consistent`, () => {
    for (const level of [1, 2, 3]) {
      const rng = makeRng(`${name}:${level}`);
      for (let i = 0; i < N; i++) {
        const q = gen(level, rng);
        assertWellFormed(q, `${name} L${level} #${i}`);
      }
    }
  });
}

test('maths answers are mathematically right (independent recomputation)', () => {
  const rng = makeRng('verify');
  for (let i = 0; i < 300; i++) {
    const q = GENERATORS.fracAddSub(rng.int(1, 3), rng);
    const m = q.prompt.match(/\{\{(\d+)\/(\d+)\}\} ([+−]) \{\{(\d+)\/(\d+)\}\}/);
    const [a, b, op, c, d] = [+m[1], +m[2], m[3], +m[4], +m[5]];
    const v = op === '+' ? a / b + c / d : a / b - c / d;
    assert.ok(Math.abs(parseNumber(q.numeric.value).value.valueOf() - v) < 1e-12, q.prompt);
  }
  for (let i = 0; i < 300; i++) {
    const q = GENERATORS.equations(rng.int(1, 3), rng);
    const x = +q.numeric.value;
    const [lhs, rhs] = q.prompt.replace('Solve: ', '').split(' = ');
    const ev = (e) => Function('x', 'return ' + e.replace(/−/g, '-').replace(/(\d)x/g, '$1*x'))(x);
    assert.equal(ev(lhs), ev(rhs), q.prompt + ' x=' + x);
  }
  for (let i = 0; i < 300; i++) {
    const q = GENERATORS.orderOps(rng.int(1, 3), rng);
    const expr = q.prompt.replace('Work out ', '').replace(/−/g, '-').replace(/×/g, '*').replace(/÷/g, '/').replace(/(\d+)²/g, '($1**2)');
    assert.equal(Function('return ' + expr)(), +q.numeric.value, q.prompt);
  }
});

test('which-century logic, including the 1900 edge case and BC', () => {
  assert.equal(centuryOf(1066), 11);
  assert.equal(centuryOf(1900), 19);
  assert.equal(centuryOf(2000), 20);
  assert.equal(centuryOf(1901), 20);
  assert.equal(centuryOf(43), 1);
  assert.equal(centuryOf(-55), 1);
  assert.equal(centuryOf(-3000), 30);
  assert.equal(centuryOf(-2560), 26);
  assert.equal(ordinal(21), '21st');
  assert.equal(ordinal(12), '12th');
  assert.equal(ordinal(13), '13th');
  assert.equal(ordinal(3), '3rd');
});
