// A KS2-style arithmetic paper: 36 questions, 40 marks, 30 minutes. Pure calculation,
// roughly in the order of difficulty the real papers use. Deterministic from a seed.
// Each question: { n, prompt, value, marks }. `value` is a string parseNumber understands.

import { makeRng } from '../core/rng.js';
import { COURSE } from '../core/subjects.js';

export const PAPER_QUESTIONS = 36;
export const PAPER_MARKS = 40;
export const PAPER_MINUTES = 30;

const g = (a, b) => (b ? g(b, a % b) : a);
const frac = (n, d) => { const k = g(n, d); return `${n / k}/${d / k}`; };
const dec = (hund) => (hund / 100).toString();

export function arithmeticPaper(seed) {
  const r = makeRng(`paper:${seed}`);
  const q = [];
  const add = (prompt, value, marks = 1) => q.push({ n: q.length + 1, prompt, value: String(value), marks });

  // 1-6: fluency
  { const a = r.int(300, 900), b = r.int(100, 600); add(`${a} + ${b} =`, a + b); }
  { const a = r.int(500, 999), b = r.int(100, 499); add(`${a} − ${b} =`, a - b); }
  { const a = r.int(3, 12), b = r.int(3, 12); add(`${a} × ${b} =`, a * b); }
  { const a = r.int(3, 12), b = r.int(3, 12); add(`${a * b} ÷ ${a} =`, b); }
  { const a = r.int(12, 99) * 10; add(`${a} ÷ 10 =`, a / 10); }
  { const a = r.int(101, 999); add(`1000 − ${a} =`, 1000 - a); }
  // 7-14: columns, decimals, simple fractions and percentages
  { const a = r.int(1200, 8900), b = r.int(1100, 7900); add(`${a} + ${b} =`, a + b); }
  { const a = r.int(5000, 9999), b = r.int(1000, 4999); add(`${a} − ${b} =`, a - b); }
  { const a = r.int(11, 99) * 10, b = r.int(101, 999); add(`${dec(a)} + ${dec(b)} =`, dec(a + b)); }
  { const a = r.int(2, 90) * 10; add(`10% of ${a} =`, a / 10); }
  { const d = r.pick([2, 4, 5, 10]), a = d * r.int(20, 300); add(`{{1/${d}}} of ${a} =`, a / d); }
  { const a = r.int(12, 48), b = r.pick([5, 6, 8, 9]); add(`${a} × ${b} =`, a * b); }
  { const a = r.int(2, 90) * 100; add(`${a} ÷ 100 =`, a / 100); }
  { const a = r.pick([4, 5, 6, 7, 8, 9, 11, 12]); add(`${a}² =`, a * a); }
  // 15-24: fractions, decimals, percentages, order of operations
  { const d = r.pick([8, 10, 12]), d2 = d / r.pick([2, 4].filter((k) => d % k === 0)); let n1 = r.int(1, 5), n2 = r.int(1, d2 - 1); while (g(n1, d) !== 1) n1 = r.int(1, 5); while (g(n2, d2) !== 1) n2 = r.int(1, d2 - 1); add(`{{${n1}/${d}}} + {{${n2}/${d2}}} =`, frac(n1 + n2 * (d / d2), d)); }
  { const d = r.pick([6, 8, 10, 12]), d2 = r.pick([2, 3, 4].filter((k) => d % k === 0)); const n1 = r.int(Math.ceil(d / d2) + 1, d - 1), n2 = 1; if (n1 - n2 * (d / d2) <= 0) add(`{{5/6}} − {{1/3}} =`, '1/2'); else add(`{{${n1}/${d}}} − {{${n2}/${d2}}} =`, frac(n1 - n2 * (d / d2), d)); }
  { const a = r.int(1, 4), b = r.int(a + 1, 6), c = r.int(1, 4), d = r.int(c + 1, 7); add(`{{${a}/${b}}} × {{${c}/${d}}} =`, frac(a * c, b * d)); }
  { const w1 = r.int(1, 3), w2 = r.int(1, 2), d = r.pick([4, 5, 8]), n1 = r.int(1, d - 1), n2 = r.int(1, d - 1); const top = (w1 + w2) * d + n1 + n2; add(`${w1} {{${n1}/${d}}} + ${w2} {{${n2}/${d}}} =`, frac(top, d)); }
  { const d = r.pick([4, 5, 8]), n = r.int(1, d - 1), a = d * r.int(20, 120); add(`{{${n}/${d}}} of ${a} =`, (a * n) / d); }
  { const p = r.pick([15, 20, 25, 30, 35, 40, 45, 60, 75]), a = r.int(2, 9) * 100; add(`${p}% of ${a} =`, (p * a) / 100); }
  { const a = r.int(11, 99), b = r.int(3, 9); add(`${dec(a * 10)} × ${b} =`, dec(a * 10 * b)); }
  { const a = r.int(2, 99); add(`${dec(a)} × 100 =`, a); }
  { const b = r.int(3, 9), a = b * r.int(11, 99); add(`${dec(a * 10)} ÷ ${b} =`, dec((a * 10) / b)); }
  { const a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 9); add(`${a} + ${b} × ${c} =`, a + b * c); }
  // 25-36: harder, including the four 2-mark written methods
  { const a = r.int(12, 25), b = r.int(12, 40); add(`${a} × ? = ${a * b}`, b); }
  { const a = r.int(2134, 4987); let b = r.int(21, 49); while (b % 10 === 0) b = r.int(21, 49); add(`${a} × ${b} =`, a * b, 2); }
  { const d = r.int(12, 24), k = r.int(80, 300); add(`${d * k} ÷ ${d} =`, k, 2); }
  { const a = r.int(2, 9), b = r.int(2, 9); add(`${a}² + ${b}² =`, a * a + b * b); }
  { const a = r.pick([2, 3, 4, 5]); add(`${a}³ =`, a ** 3); }
  { const d = r.pick([8, 10, 12]), half = d / 2; let n1 = r.int(3, d - 1), n2 = r.int(1, half - 1); while (g(n1, d) !== 1) n1 = r.int(3, d - 1); while (g(n2, half) !== 1) n2 = r.int(1, half - 1); const v = n1 - n2 * 2; if (v <= 0) add(`{{3/4}} − {{1/8}} =`, '5/8'); else add(`{{${n1}/${d}}} − {{${n2}/${half}}} =`, frac(v, d)); }
  { const a = r.pick([1000000, 2000000, 3000000]), b = r.int(1, 999); add(`${a} − ${b} =`, a - b); }
  { const a = r.int(2, 9) / 10, b = r.int(3, 9); add(`${a} × ${b} =`, dec(Math.round(a * 10) * b * 10)); }
  { const p = r.pick([5, 15, 35, 65, 85]), a = r.int(2, 8) * 200; add(`${p}% of ${a} =`, (p * a) / 100); }
  { const a = r.int(23, 89); let b = r.int(21, 69); while (b % 10 === 0) b = r.int(21, 69); add(`${a} × ${b} =`, a * b, 2); }
  { const d = r.int(21, 45), k = r.int(30, 120); add(`${d * k} ÷ ${d} =`, k, 2); }
  { const a = r.int(2, 6), b = r.int(2, 6), c = r.int(2, 9); add(`(${a} + ${b}) × ${c} − ${c} =`, (a + b) * c - c); }

  if (q.length !== PAPER_QUESTIONS) throw new Error(`paper has ${q.length} questions`);
  const marks = q.reduce((s, x) => s + x.marks, 0);
  if (marks !== PAPER_MARKS) throw new Error(`paper has ${marks} marks`);
  return q;
}

// --- Year 2: the shape of the old KS1 arithmetic paper (25 questions, 25 marks, about 20 minutes)
export const KS1_SPEC = { questions: 25, marks: 25, minutes: 20, label: 'the end-of-Year-2 arithmetic test', good: 20 };
export const KS2_SPEC = { questions: PAPER_QUESTIONS, marks: PAPER_MARKS, minutes: PAPER_MINUTES, label: 'the Year 6 arithmetic test', good: 32 };
export const Y3_SPEC = { questions: 30, marks: 30, minutes: 25, label: 'a Year 3 arithmetic test', good: 24 };
export const paperSpec = () => ({ ks1: KS1_SPEC, y3: Y3_SPEC }[COURSE.paper] || KS2_SPEC);
export const makePaper = (seed) => ({ ks1: ks1Paper, y3: y3Paper }[COURSE.paper] || arithmeticPaper)(seed);

// --- Year 3: no national test, so a paper in the same style built from the Year 3 calculation objectives
export function y3Paper(seed) {
  const r = makeRng(`y3paper:${seed}`);
  const q = [];
  const add = (prompt, value) => q.push({ n: q.length + 1, prompt, value: String(value), marks: 1 });
  { const a = r.int(21, 79), b = r.int(11, 99 - a); add(`${a} + ${b} =`, a + b); }
  { const a = r.int(41, 99), b = r.int(11, 39); add(`${a} − ${b} =`, a - b); }
  { const a = r.int(101, 899), b = r.int(1, 9); add(`${a} + ${b} =`, a + b); }
  { const a = r.int(110, 890), b = r.int(1, 9) * 10; add(`${a} + ${b} =`, a + b); }
  { const a = r.int(400, 999), b = r.int(1, 3) * 100; add(`${a} − ${b} =`, a - b); }
  { const a = r.pick([3, 4, 8]), b = r.int(2, 12); add(`${a} × ${b} =`, a * b); }
  { const a = r.pick([3, 4, 8]), b = r.int(2, 12); add(`${a * b} ÷ ${a} =`, b); }
  { const a = r.int(2, 12); add(`${a} × 10 =`, a * 10); }
  { const d = r.pick([2, 3, 4, 5, 10]), k = r.int(2, 10); add(`{{1/${d}}} of ${d * k} =`, k); }
  { const a = r.int(101, 499), b = r.int(101, 499); add(`${a} + ${b} =`, a + b); }
  { const a = r.int(600, 999), b = r.int(101, 499); add(`${a} − ${b} =`, a - b); }
  { const a = r.int(2, 9) * 10, b = r.pick([3, 4, 8]); add(`${a} × ${b} =`, a * b); }
  { const a = r.int(12, 29), b = r.pick([2, 3, 4, 5]); add(`${a} × ${b} =`, a * b); }
  { const b = r.pick([2, 3, 4, 5]), k = r.int(12, 25); add(`${b * k} ÷ ${b} =`, k); }
  { const a = r.int(145, 455), b = r.int(146, 445); add(`${a} + ${b} =`, a + b); }
  { const a = r.int(500, 900), b = r.int(105, 395); add(`${a} − ${b} =`, a - b); }
  { const d = r.pick([5, 7, 10]), n = r.int(1, d - 2), m = r.int(1, d - 1 - n); add(`{{${n}/${d}}} + {{${m}/${d}}} =`, `${n + m}/${d}`); }
  { const d = r.pick([5, 8, 10]), n = r.int(3, d - 1), m = r.int(1, n - 1); add(`{{${n}/${d}}} − {{${m}/${d}}} =`, `${n - m}/${d}`); }
  { const d = r.pick([3, 4, 5]), n = r.int(2, d - 1), k = r.int(2, 9); add(`{{${n}/${d}}} of ${d * k} =`, n * k); }
  { const a = r.int(2, 9) * 100, t = 1000; add(`${a} + ? = ${t}`, t - a); }
  { const a = r.int(31, 69), b = r.pick([3, 4, 8]); add(`${a} × ${b} =`, a * b); }
  { const b = r.pick([3, 4, 8]), k = r.int(11, 24); add(`${b * k} ÷ ${b} =`, k); }
  { const a = r.int(2, 9), b = r.int(2, 9); add(`${a} × ${b} × 10 =`, a * b * 10); }
  { const a = r.int(301, 799), b = r.int(1, 99); add(`${a} − ? = ${a - b}`, b); }
  { const a = r.int(1, 9) * 100 + r.int(1, 9) * 10 + r.int(1, 9), b = r.int(1, 9) * 100 + r.int(1, 9) * 10 + r.int(1, 9); const [x, y] = a > b ? [a, b] : [b, a]; add(`${x} − ${y} =`, x - y); }
  { const a = r.int(105, 495); add(`Double ${a} =`, 2 * a); }
  { const a = r.int(101, 499) * 2; add(`Half of ${a} =`, a / 2); }
  { const b = r.pick([3, 4, 5]), k = r.int(4, 9), rem = r.int(1, b - 1); add(`${b * k + rem} ÷ ${b} = ${k} remainder ?`, rem); }
  { const a = r.int(2, 9) * 10; add(`${a} × 4 ÷ 2 =`, a * 2); }
  { const a = r.int(14, 49), b = r.pick([6, 7, 9]); add(`${a} × ${b} =`, a * b); }
  if (q.length !== Y3_SPEC.questions) throw new Error(`y3 paper has ${q.length} questions`);
  return q;
}

export function ks1Paper(seed) {
  const r = makeRng(`ks1paper:${seed}`);
  const q = [];
  const add = (prompt, value) => q.push({ n: q.length + 1, prompt, value: String(value), marks: 1 });
  { const a = r.int(2, 9), b = r.int(1, 10 - a); add(`${a} + ${b} =`, a + b); }
  { const a = r.int(11, 19), b = r.int(2, 9); add(`${a} − ${b} =`, a - b); }
  { const a = r.int(1, 8) * 10, b = r.int(1, 9 - a / 10) * 10; add(`${a} + ${b} =`, a + b); }
  { const a = r.int(21, 85), b = r.int(1, 9 - (a % 10)); add(`${a} + ${b} =`, a + b); }
  { const a = r.int(21, 99), b = r.int(1, a % 10 || 1); add(`${a} − ${b} =`, a - b); }
  { const a = r.int(6, 9), b = r.int(5, 9); add(`${a} + ${b} =`, a + b); }
  { const a = r.pick([2, 5, 10]), b = r.int(2, 10); add(`${b} × ${a} =`, a * b); }
  { const a = r.pick([2, 5, 10]), b = r.int(2, 10); add(`${a * b} ÷ ${a} =`, b); }
  { const a = r.int(3, 12) * 2; add(`{{1/2}} of ${a} =`, a / 2); }
  { const a = r.int(2, 6) * 10 + r.int(1, 4), b = r.int(1, 3) * 10 + r.int(1, 5); add(`${a} + ${b} =`, a + b); }
  { const a = r.int(5, 9) * 10 + r.int(5, 9), b = r.int(1, 4) * 10 + r.int(1, 4); add(`${a} − ${b} =`, a - b); }
  { const b = r.int(2, 10); add(`10 × ${b} =`, 10 * b); }
  { const a = r.int(2, 5) * 10 + r.int(5, 9), b = r.int(1, 3) * 10 + r.int(3, 9); add(`${a} + ${b} =`, a + b); }
  { const a = r.int(5, 9) * 10 + r.int(0, 4), b = r.int(1, 4) * 10 + r.int(5, 9); add(`${a} − ${b} =`, a - b); }
  { const a = r.int(2, 10) * 4; add(`{{1/4}} of ${a} =`, a / 4); }
  { const a = r.int(1, 4) * 4; add(`{{3/4}} of ${a} =`, (a * 3) / 4); }
  { const a = r.int(1, 8) * 10 + r.int(0, 9), t = r.int(a + 5, 99); add(`${a} + ? = ${t}`, t - a); }
  { const a = r.int(11, 45); add(`Double ${a} =`, 2 * a); }
  { const a = r.int(11, 49) * 2; add(`Half of ${a} =`, a / 2); }
  { const a = r.pick([10, 15, 20, 25, 30]); add(`${a} + ${a} + ${a} =`, 3 * a); }
  { const a = r.pick([3, 4]), b = r.int(2, 10); add(`${a} × ${b} =`, a * b); }
  { const b = r.int(3, 10); add(`5 × ${b} =`, 5 * b); }
  { const a = r.int(5, 9) * 10, b = r.int(1, a / 10 - 1) * 10 + 5; add(`${a} − ${b} =`, a - b); }
  { const a = r.int(2, 8) * 3; add(`{{1/3}} of ${a} =`, a / 3); }
  { const a = r.int(2, 6) * 4; add(`{{2/4}} of ${a} =`, a / 2); }
  if (q.length !== KS1_SPEC.questions) throw new Error(`ks1 paper has ${q.length} questions`);
  return q;
}
