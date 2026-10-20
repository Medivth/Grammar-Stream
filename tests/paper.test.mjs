import { test } from 'node:test';
import assert from 'node:assert/strict';
import { arithmeticPaper, PAPER_QUESTIONS, PAPER_MARKS } from '../js/gen/paper.js';
import { parseNumber } from '../js/core/fraction.js';

test('an arithmetic paper has 36 questions and 40 marks, every answer parses, and papers differ by seed', () => {
  const seen = new Set();
  for (let i = 0; i < 100; i++) {
    const qs = arithmeticPaper(`t${i}`);
    assert.equal(qs.length, PAPER_QUESTIONS);
    assert.equal(qs.reduce((s, q) => s + q.marks, 0), PAPER_MARKS);
    assert.equal(qs.filter((q) => q.marks === 2).length, 4);
    for (const q of qs) {
      assert.ok(parseNumber(q.value), `${q.prompt} => ${q.value}`);
      assert.ok(!/NaN|undefined|Infinity/.test(q.prompt + q.value), q.prompt);
      // every answer is a whole number, a terminating decimal of at most 2 places, or a fraction
      assert.match(q.value, /^-?\d+(\.\d{1,2})?$|^\d+\/\d+$/, `${q.prompt} => ${q.value}`);
    }
    seen.add(qs.map((q) => q.prompt).join('|'));
  }
  assert.equal(seen.size, 100);
  // spot checks with real arithmetic
  const qs = arithmeticPaper('check');
  const nums = (s) => (s.match(/\d+(\.\d+)?/g) || []).map(Number);
  const [a, b] = nums(qs[0].prompt); assert.equal(+qs[0].value, a + b);
  const [c, d] = nums(qs[1].prompt); assert.equal(+qs[1].value, c - d);
  const [e, f] = nums(qs[25].prompt); assert.equal(+qs[25].value, e * f);
  const [g1, g2] = nums(qs[26].prompt); assert.equal(+qs[26].value, g1 / g2);
});
