// Arithmetic sprint: quick mental questions for the 90-second fluency burst.
// Five levels, from times tables to percentages. Each question is { prompt, value, keypad }.
// `keypad` is true when every answer at that level is a plain positive number (numeric keyboard).

import { COURSE } from '../core/subjects.js';

const neg = (n) => (n < 0 ? `−${-n}` : String(n));

export const SPRINT_LEVELS = 5;

export function sprintQuestion(level, rng, course = COURSE.sprint) {
  const L = Math.max(1, Math.min(SPRINT_LEVELS, level));
  const table = course === 'ks1' ? SPRINT_KS1 : course === 'y3' ? SPRINT_Y3 : SPRINT;
  const pick = rng.pick(table[L - 1]);
  return { ...pick(rng), keypad: course !== 'y6' || L !== 4 };
}

// Year 2 greater depth: bonds, doubles, tens, and the 2, 5, 10 (then 3, 4) tables
const SPRINT_KS1 = [
  [
    (r) => { const a = r.int(0, 10); return { prompt: `${a} + ? = 10`, value: 10 - a }; },
    (r) => { const a = r.int(1, 6), b = r.int(1, 4); return { prompt: `${a} + ${b}`, value: a + b }; },
    (r) => { const a = r.int(4, 10), b = r.int(1, a); return { prompt: `${a} − ${b}`, value: a - b }; },
    (r) => { const a = r.int(1, 5); return { prompt: `Double ${a}`, value: 2 * a }; },
  ],
  [
    (r) => { const a = r.int(0, 20); return { prompt: `${a} + ? = 20`, value: 20 - a }; },
    (r) => { const a = r.int(1, 10); return { prompt: `Double ${a}`, value: 2 * a }; },
    (r) => { const a = r.int(1, 10) * 2; return { prompt: `Half of ${a}`, value: a / 2 }; },
    (r) => { const a = r.int(5, 12), b = r.int(2, 8); return { prompt: `${a} + ${b}`, value: a + b }; },
    (r) => { const a = r.int(11, 20), b = r.int(2, 9); return { prompt: `${a} − ${b}`, value: a - b }; },
  ],
  [
    (r) => { const a = r.int(11, 89); return { prompt: `10 more than ${a}`, value: a + 10 }; },
    (r) => { const a = r.int(11, 99); return { prompt: `10 less than ${a}`, value: a - 10 }; },
    (r) => { const a = r.pick([2, 5, 10]), b = r.int(1, 10); return { prompt: `${b} × ${a}`, value: a * b }; },
    (r) => { const a = r.int(1, 9) * 10; return { prompt: `${a} + ? = 100`, value: 100 - a }; },
    (r) => { const a = r.int(6, 15), b = r.int(4, 9); return { prompt: `${a} + ${b}`, value: a + b }; },
  ],
  [
    (r) => { const a = r.pick([2, 5, 10]), b = r.int(1, 12); return { prompt: `${a * b} ÷ ${a}`, value: b }; },
    (r) => { const a = r.pick([2, 5, 10]), b = r.int(2, 12); return { prompt: `${a} × ${b}`, value: a * b }; },
    (r) => { const a = r.int(21, 89), b = r.int(2, 9); return { prompt: `${a} + ${b}`, value: a + b }; },
    (r) => { const a = r.int(41, 99), t = r.int(1, 4) * 10; return { prompt: `${a} − ${t}`, value: a - t }; },
    (r) => { const a = r.int(5, 25); return { prompt: `Double ${a}`, value: 2 * a }; },
  ],
  [
    (r) => { const a = r.pick([3, 4]), b = r.int(1, 12); return { prompt: `${a} × ${b}`, value: a * b }; },
    (r) => { const a = r.pick([3, 4]), b = r.int(1, 12); return { prompt: `${a * b} ÷ ${a}`, value: b }; },
    (r) => { const a = r.int(11, 44), b = r.int(11, 44); return { prompt: `${a} + ${b}`, value: a + b }; },
    (r) => { const a = r.int(51, 99), b = r.int(11, 49); return { prompt: `${a} − ${b}`, value: a - b }; },
    (r) => { const a = r.int(1, 99) * 2; return { prompt: `Half of ${a}`, value: a / 2 }; },
  ],
];

// Year 3 greater depth: the 3, 4 and 8 tables, then all tables to 12, with mental 3-digit work
const SPRINT_Y3 = [
  [
    (r) => { const a = r.pick([2, 3, 4, 5, 10]), b = r.int(1, 12); return { prompt: `${a} × ${b}`, value: a * b }; },
    (r) => { const a = r.int(11, 89); return { prompt: `${a} + ? = 100`, value: 100 - a }; },
    (r) => { const a = r.int(12, 49), b = r.int(12, 49); return { prompt: `${a} + ${b}`, value: a + b }; },
    (r) => { const a = r.int(5, 50); return { prompt: `Double ${a}`, value: 2 * a }; },
  ],
  [
    (r) => { const a = r.pick([3, 4, 8]), b = r.int(1, 12); return { prompt: `${a} × ${b}`, value: a * b }; },
    (r) => { const a = r.pick([3, 4, 8]), b = r.int(1, 12); return { prompt: `${a * b} ÷ ${a}`, value: b }; },
    (r) => { const a = r.int(101, 899), b = r.pick([1, 10, 100]) * r.int(1, 9); return { prompt: `${a} + ${b}`, value: a + b }; },
    (r) => { const a = r.int(51, 99), b = r.int(12, 49); return { prompt: `${a} − ${b}`, value: a - b }; },
  ],
  [
    (r) => { const a = r.pick([3, 4, 8]), b = r.int(2, 9); return { prompt: `${a} × ${b * 10}`, value: a * b * 10 }; },
    (r) => { const a = r.int(2, 9) * 100; return { prompt: `${a} + ? = 1000`, value: 1000 - a }; },
    (r) => { const a = r.int(200, 999), b = r.pick([10, 100]) * r.int(1, 9); return { prompt: `${a} − ${b}`, value: a - b }; },
    (r) => { const d = r.pick([2, 3, 4, 5, 10]), q = r.int(2, 12); return { prompt: `{{1/${d}}} of ${d * q}`, value: q }; },
    (r) => { const a = r.int(2, 12); return { prompt: `${a} × 10`, value: a * 10 }; },
  ],
  [
    (r) => { const a = r.int(2, 12), b = r.int(2, 12); return { prompt: `${a} × ${b}`, value: a * b }; },
    (r) => { const a = r.int(2, 12), b = r.int(2, 12); return { prompt: `${a * b} ÷ ${a}`, value: b }; },
    (r) => { const a = r.int(12, 49); return { prompt: `${a} × 2`, value: 2 * a }; },
    (r) => { const a = r.int(105, 495), b = r.int(105, 495); return { prompt: `${a} + ${b}`, value: a + b }; },
  ],
  [
    (r) => { const a = r.pick([6, 7, 9, 11, 12]), b = r.int(2, 12); return { prompt: `${a} × ${b}`, value: a * b }; },
    (r) => { const a = r.pick([6, 7, 9, 11, 12]), b = r.int(2, 12); return { prompt: `${a * b} ÷ ${a}`, value: b }; },
    (r) => { const a = r.int(11, 29), b = r.int(3, 5); return { prompt: `${a} × ${b}`, value: a * b }; },
    (r) => { const a = r.int(501, 999), b = r.int(101, 499); return { prompt: `${a} − ${b}`, value: a - b }; },
    (r) => { const d = r.pick([3, 4, 5]), n = r.int(2, d - 1), q = r.int(2, 10); return { prompt: `{{${n}/${d}}} of ${d * q}`, value: n * q }; },
  ],
];

const SPRINT = [
  // 1: tables and number bonds
  [
    (r) => { const a = r.int(2, 12), b = r.int(2, 12); return { prompt: `${a} × ${b}`, value: a * b }; },
    (r) => { const a = r.int(2, 12), b = r.int(2, 12); return { prompt: `${a * b} ÷ ${a}`, value: b }; },
    (r) => { const a = r.int(11, 89), b = r.int(2, 100 - a); return { prompt: `${a} + ${b}`, value: a + b }; },
    (r) => { const a = r.int(20, 99), b = r.int(2, a - 1); return { prompt: `${a} − ${b}`, value: a - b }; },
    (r) => { const a = r.int(1, 99); return { prompt: `${a} + ? = 100`, value: 100 - a }; },
  ],
  // 2: place value, doubles, squares
  [
    (r) => { const a = r.int(2, 12), b = r.int(2, 12); return { prompt: `${a} × ${b}`, value: a * b }; },
    (r) => { const a = r.int(11, 99) / 10, p = r.pick([10, 100]); return { prompt: `${a} × ${p}`, value: a * p }; },
    (r) => { const a = r.int(2, 99) * 10, p = r.pick([10, 100]); return { prompt: `${a} ÷ ${p}`, value: a / p }; },
    (r) => { const a = r.int(12, 99); return { prompt: `Double ${a}`, value: 2 * a }; },
    (r) => { const a = r.int(6, 49) * 2; return { prompt: `Half of ${a}`, value: a / 2 }; },
    (r) => { const a = r.int(2, 15); return { prompt: `${a}²`, value: a * a }; },
    (r) => { const a = r.int(1, 99) * 10; return { prompt: `${a} + ? = 1000`, value: 1000 - a }; },
  ],
  // 3: fractions and simple percentages of amounts
  [
    (r) => { const d = r.pick([2, 3, 4, 5, 10]), q = r.int(2, 12); return { prompt: `{{1/${d}}} of ${d * q}`, value: q }; },
    (r) => { const a = r.int(2, 20) * 10; return { prompt: `50% of ${a}`, value: a / 2 }; },
    (r) => { const a = r.int(2, 50) * 10; return { prompt: `10% of ${a}`, value: a / 10 }; },
    (r) => { const a = r.int(1, 25) * 20; return { prompt: `25% of ${a}`, value: a / 4 }; },
    (r) => { const a = r.int(12, 89), b = r.int(12, 89); return { prompt: `${a} + ${b}`, value: a + b }; },
    (r) => { const a = r.int(3, 9), b = r.int(13, 29); return { prompt: `${a} × ${b}`, value: a * b }; },
    (r) => { const a = r.int(2, 12); return { prompt: `√${a * a}`, value: a }; },
  ],
  // 4: negatives, decimals, order of operations
  [
    (r) => { const a = r.int(-9, 9), b = r.int(1, 9); return { prompt: `${neg(a)} − ${b}`, value: a - b }; },
    (r) => { const a = r.int(-9, 5), b = r.int(1, 9); return { prompt: `${neg(a)} + ${b}`, value: a + b }; },
    (r) => { const a = r.int(-8, -1), b = r.int(2, 6); return { prompt: `${neg(a)} × ${b}`, value: a * b }; },
    (r) => { const a = r.int(1, 99) / 10, b = r.int(1, 99) / 10; return { prompt: `${a} + ${b}`, value: Math.round((a + b) * 10) / 10 }; },
    (r) => { const a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 9); return { prompt: `${a} + ${b} × ${c}`, value: a + b * c }; },
    (r) => { const a = r.int(2, 12), b = r.int(2, 12); return { prompt: `${a} × ${b}`, value: a * b }; },
    (r) => { const a = r.int(2, 9), b = r.int(2, 9); return { prompt: `${a * b * 10} ÷ ${a}`, value: b * 10 }; },
  ],
  // 5: harder percentages, fractions and two-digit multiplication
  [
    (r) => { const a = r.int(2, 30) * 20; return { prompt: `15% of ${a}`, value: (a * 15) / 100 }; },
    (r) => { const a = r.int(1, 20) * 20; return { prompt: `35% of ${a}`, value: (a * 35) / 100 }; },
    (r) => { const d = r.pick([4, 5, 8, 10]), n = r.int(2, d - 1), q = r.int(2, 9); return { prompt: `{{${n}/${d}}} of ${d * q}`, value: n * q }; },
    (r) => { const a = r.int(11, 19), b = r.int(11, 19); return { prompt: `${a} × ${b}`, value: a * b }; },
    (r) => { const a = r.int(2, 9), b = r.int(21, 99); return { prompt: `${a} × ${b}`, value: a * b }; },
    (r) => { const a = r.int(11, 99) / 10, b = r.int(2, 9); return { prompt: `${a} × ${b}`, value: Math.round(a * b * 10) / 10 }; },
    (r) => { const a = r.int(2, 9), b = r.int(2, 9); return { prompt: `${a}² + ${b}`, value: a * a + b }; },
    (r) => { const a = r.int(100, 999), b = r.int(100, 999); return { prompt: `${a} + ${b}`, value: a + b }; },
  ],
];
