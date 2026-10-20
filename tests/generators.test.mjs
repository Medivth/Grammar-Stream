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

test('grid references and compass directions match the drawn diagram', () => {
  const rng = makeRng('grid-verify');
  const NAMES = { '0,1': 'north', '1,1': 'north-east', '1,0': 'east', '1,-1': 'south-east', '0,-1': 'south', '-1,-1': 'south-west', '-1,0': 'west', '-1,1': 'north-west' };
  for (let i = 0; i < 300; i++) {
    const q1 = GENERATORS.gridRef(1, rng);
    const m = q1.diagram.markers[0];
    assert.equal(q1.answer, `${String(q1.diagram.e0 + Math.floor(m.x)).padStart(2, '0')}${String(q1.diagram.n0 + Math.floor(m.y)).padStart(2, '0')}`);
    const q2 = GENERATORS.gridRef(2, rng);
    const p = q2.diagram.markers[0];
    const e = Math.round((q2.diagram.e0 + p.x) * 10), n = Math.round((q2.diagram.n0 + p.y) * 10);
    assert.equal(q2.answer, `${String(e).padStart(3, '0')}${String(n).padStart(3, '0')}`);
    const q3 = GENERATORS.gridRef(3, rng);
    const [a, b] = q3.diagram.markers;
    assert.equal(q3.answer, NAMES[`${Math.sign(b.x - a.x)},${Math.sign(b.y - a.y)}`], q3.prompt);
    assert.ok(q3.prompt.includes(b.label) && q3.prompt.indexOf(b.label) < q3.prompt.indexOf(a.label), 'asks direction OF b FROM a');
  }
});

test('joined-up maths answers are right (independent recomputation)', () => {
  const nums = (s) => (s.match(/−?\d[\d,]*(\.\d+)?/g) || []).map((x) => +x.replace(/,/g, '').replace('−', '-'));
  const rng = makeRng('synoptic-verify');
  for (let i = 0; i < N; i++) {
    for (const level of [1, 2, 3]) {
      const q = GENERATORS.averages(level, rng);
      const xs = nums(q.prompt.split(' of ')[1]);
      const sorted = [...xs].sort((a, b) => a - b);
      const want = level === 1 ? xs.reduce((a, b) => a + b, 0) / xs.length : level === 2 ? sorted[(xs.length - 1) / 2] : sorted.at(-1) - sorted[0];
      assert.equal(+q.numeric.value, want, q.prompt);
      if (level === 3) assert.ok(sorted[0] < 0, `range includes a negative: ${q.prompt}`);
    }
    const g1 = GENERATORS.geoStats(1, rng);
    const data = g1.prompt.includes('£') ? nums(g1.prompt).filter((x) => x >= 100) : nums(g1.prompt.split(':')[1]);
    assert.equal(+g1.numeric.value, data.reduce((a, b) => a + b, 0) / data.length, g1.prompt);
    assert.ok(Number.isInteger(+g1.numeric.value));
    const g3 = GENERATORS.geoStats(3, rng);
    const [a, b] = nums(g3.prompt);
    assert.equal(+g3.numeric.value, g3.prompt.includes('density') ? a / b : ((b - a) / a) * 100, g3.prompt);
    const h2 = GENERATORS.historyMaths(2, rng);
    const bc = [...h2.prompt.matchAll(/(\d+) BC/g)].map((m) => +m[1]), ad = [...h2.prompt.matchAll(/AD (\d+)/g)].map((m) => +m[1]);
    assert.equal(+h2.numeric.value, ad.length ? bc[0] + ad[0] - 1 : Math.abs(bc[0] - bc[1]), h2.prompt);
  }
});

test('written methods, measures and probability answers are right (independent recomputation)', () => {
  const nums = (s) => (s.match(/−?\d[\d,]*(\.\d+)?/g) || []).map((x) => +x.replace(/,/g, '').replace('−', '-'));
  const rng = makeRng('maths2-verify');
  for (let i = 0; i < N; i++) {
    for (const level of [1, 2, 3]) {
      const m = GENERATORS.longMult(level, rng);
      const [a, b] = nums(m.prompt);
      assert.ok(Math.abs(a * b - +m.numeric.value) < 1e-9, m.prompt);
      const d = GENERATORS.longDiv(level, rng);
      const [n, dv] = nums(d.prompt);
      if (d.prompt.includes('coach')) assert.equal(+d.numeric.value, Math.ceil(n / dv), d.prompt);
      else if (d.prompt.includes('left over')) assert.equal(+d.numeric.value, n % dv, d.prompt);
      else if (d.prompt.includes('mixed')) assert.ok(Math.abs(parseNumber(d.numeric.value).value.valueOf() - n / dv) < 1e-9, d.prompt);
      else assert.equal(+d.numeric.value, n / dv, d.prompt);
      const u = GENERATORS.units(level, rng);
      assert.ok(Number.isFinite(+u.numeric.value) && +u.numeric.value > 0, u.prompt);
      const t = GENERATORS.time(level, rng);
      if (t.answer) assert.match(t.answer, /^\d\d:\d\d$/, t.prompt);
    }
    const a1 = GENERATORS.areaPerimeter(1, rng);
    assert.equal(+a1.numeric.value, a1.prompt.includes('area') ? a1.diagram.w * a1.diagram.h : 2 * (a1.diagram.w + a1.diagram.h));
    const a2 = GENERATORS.areaPerimeter(2, rng);
    assert.equal(+a2.numeric.value, a2.diagram.type === 'tri' ? (a2.diagram.b * a2.diagram.h) / 2 : a2.diagram.b * a2.diagram.h);
    const v1 = GENERATORS.volume(1, rng);
    assert.equal(+v1.numeric.value, v1.diagram.l * v1.diagram.w * v1.diagram.h);
    const c = GENERATORS.coordinates(rng.int(1, 3), rng);
    assert.equal(check(c, `(${c.pair[0]}, ${c.pair[1]})`).correct, true, c.prompt);
    assert.equal(check(c, `${c.pair[0]},${c.pair[1]}`).correct, true);
    assert.equal(check(c, `(${c.pair[0] + 1}, ${c.pair[1]})`).correct, false);
    if (c.prompt.startsWith('What are the coordinates')) { const p = c.diagram.points.find((p) => p.label === c.prompt.match(/point (\w)/)[1]); assert.deepEqual([p.x, p.y], c.pair); }
    const p1 = GENERATORS.probability(1, rng);
    const counts = nums(p1.prompt).slice(0, 3), total = counts.reduce((x, y) => x + y, 0);
    const colour = p1.prompt.match(/it is (\w+)\?/)[1], idx = ['red', 'blue', 'green'].indexOf(colour);
    assert.ok(Math.abs(parseNumber(p1.numeric.value).value.valueOf() - counts[idx] / total) < 1e-9, p1.prompt);
    assert.ok(parseNumber(p1.numeric.value).raw.isSimplest(), `simplest: ${p1.numeric.value}`);
    const ch = GENERATORS.charts(1, rng);
    const vals = ch.diagram.cats.map((x) => x.v);
    if (ch.prompt.includes('altogether')) assert.equal(+ch.numeric.value, vals.reduce((x, y) => x + y, 0));
    const pie = GENERATORS.charts(2, rng);
    assert.equal(pie.diagram.sectors.reduce((x, s) => x + s.deg, 0), 360);
    assert.ok(Number.isInteger(+pie.numeric.value));
  }
  // times: accepted spellings all check, a wrong one does not
  const t2 = GENERATORS.time(2, makeRng('t2'));
  for (const alt of t2.accept) assert.equal(check(t2, alt).correct, true, alt);
  assert.equal(check(t2, '00:01').correct, false);
});
