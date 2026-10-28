// Year 2 maths generators (greater depth, stretching into Year 3), themed on racing cars,
// space adventures and superheroes. Same contract as maths.js. "{hero}" is replaced with the
// child's own superhero name when the question is shown (js/core/present.js).

import { pic, bar, pvWhole, fracWall } from './pictures.js';

const pad = (n) => String(n).padStart(2, '0');
const pv = (n, unit) => `${n} ${unit}${n === 1 ? '' : 's'}`; // 1 ten, 2 tens
const money = (p) => (p >= 100 ? `£${(p / 100).toFixed(2)}` : `${p}p`);
const CARS = ['Turbo', 'Blaze', 'Sparky', 'Rusty', 'Zoom'];
const SPACE = ['Captain Nova', 'Bleep the robot', 'Commander Zara'];
const HOUR_WORD = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

function choice(prompt, correct, wrongs, rng, extra = {}) {
  const seen = new Set([correct]);
  const ws = wrongs.map((w) => (typeof w === 'string' ? { text: w } : w)).filter((w) => !seen.has(w.text) && seen.add(w.text));
  const options = rng.shuffle([{ text: correct, correct: true }, ...ws]);
  return { kind: 'choice', prompt, options, ...extra };
}
const typed = (prompt, value, explain, steps, extra = {}) => ({ kind: 'typed', prompt, numeric: { value: String(value), form: 'any' }, explain, steps, ...extra });
// a counting pattern on the hundred square: the given numbers shaded, the answer ringed (only when all fit on 1–100)
const countSquare = (shown, answer, caption) => ([...shown, answer].every((v) => v >= 1 && v <= 100) ? pic({ type: 'hundredsq', shade: shown, ring: [answer] }, caption) : {});

/** Clock time in words, the way Year 2 says it. */
export function timeWords(h, m) {
  const next = (h % 12) + 1;
  if (m === 0) return `${h} o’clock`;
  if (m === 15) return `quarter past ${h}`;
  if (m === 30) return `half past ${h}`;
  if (m === 45) return `quarter to ${next}`;
  if (m < 30) return `${m} minutes past ${h}`;
  return `${60 - m} minutes to ${next}`;
}

export const KS1_GENERATORS = {
  k1Place(level, rng) {
    if (level === 1) {
      const t = rng.int(2, 9), o = rng.int(0, 9), n = t * 10 + o;
      return typed('What number do the blocks show?', n, `${pv(t, 'ten')} make ${t * 10}, and ${pv(o, 'one')}: ${t * 10} + ${o} = ${n}.`,
        [`I count the tens rods: ${pv(t, 'ten')} = ${t * 10}.`, `I count the ones cubes: ${o}.`, `${t * 10} + ${o} = ${n}.`], { diagram: { type: 'tens', tens: t, ones: o } });
    }
    if (level === 2) {
      const kind = rng.pick(['compare', 'value', 'tenmore']);
      if (kind === 'compare') {
        let a = rng.int(11, 99), b = rng.int(11, 99);
        if (rng.chance(0.3)) b = Number(String(a).split('').reverse().join('')) || a;
        const sym = a < b ? '<' : a > b ? '>' : '=';
        return choice(`Which sign goes in the box?   ${a} ☐ ${b}`, sym, ['<', '>', '='], rng, {
          explain: `${a} has ${pv(Math.floor(a / 10), 'ten')} and ${b} has ${pv(Math.floor(b / 10), 'ten')}.${a !== b && Math.floor(a / 10) === Math.floor(b / 10) ? ` The tens are the same, so I compare the ones: ${a % 10} and ${b % 10}.` : ''} ${a === b ? 'They are the same.' : `${Math.max(a, b)} is bigger, and the open mouth of the sign eats the bigger number.`}`,
          steps: ['I compare the tens first.', `${a}: ${pv(Math.floor(a / 10), 'ten')}. ${b}: ${pv(Math.floor(b / 10), 'ten')}.${a !== b && Math.floor(a / 10) === Math.floor(b / 10) ? ` Same tens, so I compare the ones: ${a % 10} and ${b % 10}.` : ''}`, `So ${a} ${sym} ${b}.`],
          ...pic(pvWhole(['T', 'O'], [a, b]), 'Compare the tens first. If the tens are the same, compare the ones.'),
        });
      }
      if (kind === 'value') {
        // no repeated digit (77): the question must point at one place
        let n; do n = rng.int(21, 98); while (n % 11 === 0);
        const d = String(n)[0];
        return typed(`In the number ${n}, what is the value of the digit ${d}?`, +d * 10, `The ${d} is in the tens place, so it is worth ${pv(d, 'ten')}: ${+d * 10}.`,
          [`${n} = ${+d * 10} + ${n % 10}.`, `The ${d} is in the tens column.`, `So it is worth ${+d * 10}.`], pic(pvWhole(['T', 'O'], [n]), `The ${d} is in the tens column: ${pv(+d, 'ten')} = ${+d * 10}.`));
      }
      const n = rng.int(10, 89), up = rng.chance(0.5);
      return typed(`What is 10 ${up ? 'more' : 'less'} than ${up ? n : n + 10}?`, up ? n + 10 : n, `Only the tens digit changes: ${up ? `${n} → ${n + 10}` : `${n + 10} → ${n}`}.`,
        [`10 ${up ? 'more' : 'less'} means one ten ${up ? 'more' : 'fewer'}.`, 'The ones digit stays the same.', `${up ? n : n + 10} → ${up ? n + 10 : n}.`],
        pic(pvWhole(['T', 'O'], up ? [n, n + 10] : [n + 10, n]), `10 ${up ? 'more' : 'less'}: the tens digit goes ${up ? 'up' : 'down'} by 1 and the ones stay the same.`));
    }
    const kind = rng.pick(['partition', 'order', 'blocks']);
    if (kind === 'blocks') {
      const hh = rng.int(1, 3), t = rng.int(0, 9), o = rng.int(0, 9), n = hh * 100 + t * 10 + o;
      return typed('What number do the blocks show?', n, `${hh} hundred${hh > 1 ? 's' : ''}, ${pv(t, 'ten')} and ${pv(o, 'one')}: ${n}.`,
        [`Hundreds: ${hh} → ${hh * 100}.`, `Tens: ${t} → ${t * 10}. Ones: ${o}.`, `${hh * 100} + ${t * 10} + ${o} = ${n}.`], { diagram: { type: 'tens', hundreds: hh, tens: t, ones: o } });
    }
    if (kind === 'partition') {
      const t = rng.int(1, 9), o = rng.int(1, 9), hh = rng.int(1, 9), n = hh * 100 + t * 10 + o;
      return typed(`${n} = ${hh * 100} + ? + ${o}`, t * 10, `${n} is ${hh * 100} + ${t * 10} + ${o}, so the missing part is ${t * 10}.`,
        [`${n} has ${pv(hh, 'hundred')}, ${pv(t, 'ten')} and ${pv(o, 'one')}.`, `The tens are worth ${t * 10}.`, `${hh * 100} + ${t * 10} + ${o} = ${n}.`],
        pic(pvWhole(['H', 'T', 'O'], [n]), `${n} = ${hh * 100} + ${t * 10} + ${o}`));
    }
    const nums = new Set();
    while (nums.size < 3) nums.add(rng.int(30, 99));
    const [a, b, c] = [...nums], sorted = [a, b, c].sort((x, y) => x - y);
    return choice(`Which shows ${a}, ${b} and ${c} in order, smallest first?`, sorted.join(', '), [[...sorted].reverse().join(', '), [sorted[1], sorted[0], sorted[2]].join(', '), [sorted[0], sorted[2], sorted[1]].join(', ')], rng, {
      explain: `Compare the tens first, then the ones: ${sorted.join(' < ')}.`, steps: ['I look at the tens digits first.', 'If the tens are the same, I look at the ones.', sorted.join(', ')],
      ...pic(pvWhole(['T', 'O'], [a, b, c]), 'Line the numbers up and compare the tens digits first.'),
    });
  },

  k1Bonds(level, rng) {
    if (level === 1) {
      const T = rng.pick([10, 20]), a = rng.int(1, T - 1);
      return typed(`${a} + ? = ${T}`, T - a, `${a} and ${T - a} make ${T}.`, [`I count on from ${a} to ${T}.`, `${T} − ${a} = ${T - a}.`, `So ${a} + ${T - a} = ${T}.`],
        pic(bar([{ parts: T, shaded: a }], T), `${a} ${a === 1 ? 'box is' : 'boxes are'} shaded and ${T - a} ${T - a === 1 ? 'is' : 'are'} white: ${a} + ${T - a} = ${T}.`));
    }
    if (level === 2) {
      const a = rng.int(1, 9);
      return typed(`${a} + ${10 - a} = 10, so ${a * 10} + ? = 100`, (10 - a) * 10, `Ten times bigger: ${pv(a, 'ten')} + ${pv(10 - a, 'ten')} = 10 tens = 100.`,
        [`I know ${a} + ${10 - a} = 10.`, `${a * 10} is ${pv(a, 'ten')}, and 100 is 10 tens.`, `So I need ${pv(10 - a, 'ten')}: ${(10 - a) * 10}.`],
        pic(bar([{ parts: 10, shaded: a, text: 10 }], 100), `Each box is 10. ${pv(a, 'ten')} ${a === 1 ? 'is' : 'are'} shaded and ${pv(10 - a, 'ten')} ${a === 9 ? 'is' : 'are'} white: ${a * 10} + ${(10 - a) * 10} = 100.`));
    }
    const a = rng.int(11, 89);
    if (a % 10 === 0) return KS1_GENERATORS.k1Bonds(3, rng);
    return typed(`${a} + ? = 100`, 100 - a, `${a} + ${10 - (a % 10)} = ${a + 10 - (a % 10)}, then on to 100 is ${100 - (a + 10 - (a % 10))} more. ${10 - (a % 10)} + ${100 - (a + 10 - (a % 10))} = ${100 - a}.`,
      [`I jump to the next ten: ${a} + ${10 - (a % 10)} = ${a + 10 - (a % 10)}.`, `Then to 100: + ${100 - (a + 10 - (a % 10))}.`, `Altogether ${10 - (a % 10)} + ${100 - (a + 10 - (a % 10))} = ${100 - a}.`],
      pic({ type: 'hundredsq', shade: Array.from({ length: a }, (_, i) => i + 1) }, `${a} squares are shaded. The ${100 - a} white squares make it up to 100.`));
  },

  k1AddSub(level, rng) {
    if (level === 1) {
      const kind = rng.pick(['add1', 'sub1', 'tens']);
      if (kind === 'add1') { const a = rng.int(21, 85), b = rng.int(1, 9 - (a % 10) || 1); return typed(`${a} + ${b} =`, a + b, `Add the ones: ${a % 10} + ${b} = ${(a % 10) + b}. ${a + b}.`, [`${a} is ${a - (a % 10)} and ${a % 10}.`, `${a % 10} + ${b} = ${(a % 10) + b}.`, `${a - (a % 10)} + ${(a % 10) + b} = ${a + b}.`]); }
      if (kind === 'sub1') { let a; do a = rng.int(21, 99); while (a % 10 === 0); const b = rng.int(1, a % 10); return typed(`${a} − ${b} =`, a - b, `Take ${b} from the ${a % 10} ${a % 10 === 1 ? 'one' : 'ones'}: ${a - b}.`, [`${a} has ${a % 10} ${a % 10 === 1 ? 'one' : 'ones'}.`, `${a % 10} − ${b} = ${(a % 10) - b}.`, `So ${a} − ${b} = ${a - b}.`]); }
      const a = rng.int(12, 59), t = rng.int(1, 4) * 10;
      return typed(`${a} + ${t} =`, a + t, `Adding ${t} adds ${pv(t / 10, 'ten')}; the ones stay the same: ${a + t}.`, [`${t} is ${pv(t / 10, 'ten')}.`, `${a} has ${pv(Math.floor(a / 10), 'ten')}; ${Math.floor(a / 10)} + ${t / 10} = ${pv(Math.floor(a / 10) + t / 10, 'ten')}.`, `${a + t}.`]);
    }
    if (level === 2) {
      if (rng.chance(0.5)) {
        const a = rng.int(15, 68), b = rng.int(12, 29);
        return typed(`${a} + ${b} =`, a + b, `Tens: ${a - (a % 10)} + ${b - (b % 10)} = ${a - (a % 10) + b - (b % 10)}. Ones: ${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)}. Together ${a + b}.`,
          [`I split both numbers into tens and ones.`, `Tens: ${a - (a % 10) + b - (b % 10)}. Ones: ${(a % 10) + (b % 10)}.`, `${a - (a % 10) + b - (b % 10)} + ${(a % 10) + (b % 10)} = ${a + b}.`]);
      }
      const a = rng.int(41, 99), b = rng.int(5, 9);
      if (a % 10 >= b) return KS1_GENERATORS.k1AddSub(2, rng);
      return typed(`${a} − ${b} =`, a - b, `Take ${a % 10} to get to ${a - (a % 10)}, then ${b - (a % 10)} more: ${a - b}.`,
        [`I go back to the ten: ${a} − ${a % 10} = ${a - (a % 10)}.`, `I still need to take ${b - (a % 10)} more.`, `${a - (a % 10)} − ${b - (a % 10)} = ${a - b}.`]);
    }
    const kind = rng.pick(['missing-add', 'missing-sub', 'three']);
    if (kind === 'three') {
      const xs = [rng.int(3, 9), rng.int(3, 9), rng.int(3, 9)];
      const bond = xs.findIndex((x, i) => xs.some((y, j) => j !== i && x + y === 10));
      const tot = xs[0] + xs[1] + xs[2];
      const pj = bond >= 0 ? xs.findIndex((y, j) => j !== bond && xs[bond] + y === 10) : -1;
      const [p1, p2, rest] = bond >= 0 ? [xs[bond], xs[pj], xs[3 - bond - pj]] : xs;
      return typed(`${xs.join(' + ')} =`, tot, bond >= 0 ? `Look for a pair that makes 10 first: ${p1} + ${p2} = 10, then 10 + ${rest} = ${tot}.` : `${xs.join(' + ')} = ${tot}.`,
        ['Adding can be done in any order, so I look for an easy pair first.', `${p1} + ${p2} = ${p1 + p2}.`, `${p1 + p2} + ${rest} = ${tot}.`]);
    }
    if (kind === 'missing-add') {
      const a = rng.int(14, 48), b = rng.int(12, 45);
      return typed(`${a} + ? = ${a + b}`, b, `Use the inverse: ${a + b} − ${a} = ${b}.`, ['Adding and subtracting are inverses: one undoes the other.', `So I work out ${a + b} − ${a}.`, `= ${b}. Check: ${a} + ${b} = ${a + b}.`]);
    }
    const a = rng.int(12, 39), b = rng.int(11, 35);
    return typed(`? − ${a} = ${b}`, a + b, `Use the inverse: ${b} + ${a} = ${a + b}.`, ['The missing number is where I started before taking away.', `So I add back what was taken: ${b} + ${a}.`, `= ${a + b}. Check: ${a + b} − ${a} = ${b}.`]);
  },

  k1Count(level, rng) {
    if (level === 1) {
      const step = rng.pick([2, 5, 10]), start = step * rng.int(0, 6);
      const seq = [0, 1, 2, 3].map((i) => start + i * step);
      return typed(`Count in ${step}s. What comes next?   ${seq.join(', ')}, ?`, start + 4 * step, `Each number is ${step} more: ${seq.at(-1)} + ${step} = ${start + 4 * step}.`, [`The numbers go up by ${step} each time.`, `The last one is ${seq.at(-1)}.`, `${seq.at(-1)} + ${step} = ${start + 4 * step}.`],
        countSquare(seq.filter((v) => v > 0), start + 4 * step, `Counting in ${step}s on the hundred square. The ring is the next number.`));
    }
    if (level === 2) {
      if (rng.chance(0.4)) {
        const n = rng.int(11, 99);
        return choice(`Is ${n} odd or even?`, n % 2 ? 'odd' : 'even', [n % 2 ? 'even' : 'odd'], rng, { explain: `Look at the ones digit: ${n % 10} is ${n % 2 ? 'odd' : 'even'}, so ${n} is ${n % 2 ? 'odd' : 'even'}.`, steps: ['Only the ones digit decides odd or even.', `The ones digit is ${n % 10}.`, `${n % 10} is ${n % 2 ? 'odd' : 'even'}, so ${n} is ${n % 2 ? 'odd' : 'even'}.`] });
      }
      // Counting down never goes below zero: negative numbers are not Year 2 content.
      const step = rng.pick([3, 2, 5, 10]), down = rng.chance(0.5), start = rng.int(down ? Math.max(20, 4 * step) : 20, 60);
      const seq = [0, 1, 2, 3].map((i) => start + (down ? -1 : 1) * i * step);
      const nxt = start + (down ? -1 : 1) * 4 * step;
      return typed(`What comes next?   ${seq.join(', ')}, ?`, nxt, `The rule is ${down ? 'take away' : 'add'} ${step}: ${seq.at(-1)} ${down ? '−' : '+'} ${step} = ${nxt}.`, ['I find the rule by looking at the gaps.', `Each step ${down ? 'goes down' : 'goes up'} by ${step}.`, `${seq.at(-1)} ${down ? '−' : '+'} ${step} = ${nxt}.`],
        countSquare(seq, nxt, `Counting ${down ? 'back' : 'on'} in ${step}s on the hundred square. The ring is the next number.`));
    }
    const step = rng.int(3, 9), start = rng.int(1, 20), k = rng.int(1, 3);
    const seq = [0, 1, 2, 3, 4].map((i) => start + i * step);
    const shown = seq.map((v, i) => (i === k ? '?' : v));
    return typed(`What is the missing number?   ${shown.join(', ')}`, seq[k], `The gap is ${step} each time: ${seq.join(', ')}.`, [`I find the gap between two numbers next to each other: ${step}.`, `The missing number is ${step} more than ${seq[k - 1]}.`, `${seq[k - 1]} + ${step} = ${seq[k]}.`],
      countSquare(seq.filter((_, i) => i !== k), seq[k], `The numbers go up in ${step}s. The ring is the missing number.`));
  },

  k1Times(level, rng) {
    if (level === 1) {
      const cols = rng.pick([2, 5, 10]), rows = rng.int(2, 5);
      const what = rng.pick([['racing cars in the car park', '#d62f3a'], ['planets', '#9a48d6'], ['hero badges', '#2f74e8']]);
      return typed(`There are ${rows} rows of ${cols} ${what[0]}. How many altogether?`, rows * cols, `${rows} rows of ${cols}: ${rows} × ${cols} = ${rows * cols}.`,
        [`I can count in ${cols}s, once for each row.`, Array.from({ length: rows }, (_, i) => (i + 1) * cols).join(', ') + '.', `${rows} × ${cols} = ${rows * cols}.`], { diagram: { type: 'array', rows, cols, colour: what[1] } });
    }
    if (level === 2) {
      const a = rng.pick([2, 5, 10]), b = rng.int(2, 12);
      if (rng.chance(0.5)) return typed(`${b} × ${a} =`, a * b, `${b} lots of ${a} = ${a * b}.`, [`I count in ${a}s, ${b} times.`, Array.from({ length: Math.min(b, 6) }, (_, i) => (i + 1) * a).join(', ') + (b > 6 ? '…' : '.'), `${b} × ${a} = ${a * b}.`],
        pic(bar([{ parts: b, text: a }], a * b), `${b} boxes of ${a}: ${b} × ${a} = ${a * b}.`));
      const thing = rng.pick(['stickers', 'space gems', 'tyres']);
      return typed(`${a * b} ${thing} are shared equally between ${a} friends. How many does each friend get?`, b, `${a * b} ÷ ${a} = ${b}, because ${a} × ${b} = ${a * b}.`,
        ['Sharing equally is dividing.', `I need ${a} × ? = ${a * b}.`, `${a} × ${b} = ${a * b}, so each friend gets ${b}.`],
        pic(bar([{ parts: a, text: b }], a * b), `${a * b} shared into ${a} equal boxes: ${b} in each.`));
    }
    const a = rng.pick([2, 5, 10]), b = rng.int(2, 12);
    const groups = pic(bar([{ parts: b, text: a }], a * b), `${b} groups of ${a} make ${a * b}.`);
    if (rng.chance(0.5)) return typed(`? × ${a} = ${a * b}`, b, `Count in ${a}s until you reach ${a * b}: that takes ${b} jumps. ${a * b} ÷ ${a} = ${b}.`, ['Division undoes multiplication.', `${a * b} ÷ ${a} = ?`, `${b}, because ${b} × ${a} = ${a * b}.`], groups);
    return typed(`How many groups of ${a} are there in ${a * b}?`, b, `${a * b} ÷ ${a} = ${b}.`, [`I count up in ${a}s to ${a * b}.`, `That is ${b} groups.`, `${a * b} ÷ ${a} = ${b}.`], groups);
  },

  k1Frac(level, rng) {
    if (level === 1) {
      const [parts, shaded] = rng.pick([[2, 1], [4, 1], [4, 2], [4, 3], [3, 1], [3, 2]]);
      const shape = rng.pick(['circle', 'rect']);
      const NAMES = { '1/2': '{{1/2}}', '1/4': '{{1/4}}', '2/4': '{{2/4}}', '3/4': '{{3/4}}', '1/3': '{{1/3}}', '2/3': '{{2/3}}' };
      const right = NAMES[`${shaded}/${parts}`];
      const wrongs = Object.values(NAMES).filter((x) => x !== right && !(right === '{{2/4}}' && x === '{{1/2}}') && !(right === '{{1/2}}' && x === '{{2/4}}'));
      return choice('What fraction of the shape is shaded?', right, rng.sample(wrongs, 3), rng, {
        diagram: { type: 'fracshape', shape, parts, shaded },
        explain: `The shape has ${parts} equal parts and ${shaded} ${shaded === 1 ? 'is' : 'are'} shaded: ${right}.${shaded * 2 === parts ? ' That is the same as a half!' : ''}`,
        steps: [`I count the equal parts: ${parts}. That is the bottom number.`, `I count the shaded parts: ${shaded}. That is the top number.`, `So it is ${right}.`],
      });
    }
    if (level === 2) {
      const d = rng.pick([2, 3, 4]), n = d * rng.int(2, 10);
      const thing = rng.pick(['race cars', 'robots', 'hero capes', 'space rocks']);
      return typed(`What is {{1/${d}}} of ${n} ${thing}?`, n / d, `{{1/${d}}} means share into ${d} equal groups: ${n} ÷ ${d} = ${n / d}.`, [`To find {{1/${d}}}, I share into ${d} equal groups.`, `${n} ÷ ${d}.`, `= ${n / d}.`],
        pic(bar([{ parts: d, shaded: 1, text: n / d }], n), `${n} shared into ${d} equal boxes: ${n / d} in each. {{1/${d}}} is one box.`));
    }
    if (rng.chance(0.4)) {
      return choice('Which fraction is the same as {{2/4}}?', '{{1/2}}', ['{{1/4}}', '{{2/3}}', '{{3/4}}'], rng, {
        explain: '2 quarters fill exactly half of a shape, so {{2/4}} = {{1/2}}.', steps: ['Picture a pizza cut into 4 slices.', '2 of the 4 slices is half the pizza.', 'So {{2/4}} = {{1/2}}.'],
        ...pic(fracWall([[1, 2], [2, 4]]), '2 quarters cover the same as 1 half.'),
      });
    }
    const [num, d] = rng.pick([[3, 4], [2, 3], [3, 4], [2, 4]]), n = d * rng.int(2, 6);
    return typed(`What is {{${num}/${d}}} of ${n}?`, (n / d) * num, num === 1 ? `{{1/${d}}} of ${n} is ${n} ÷ ${d} = ${n / d}.` : `{{1/${d}}} of ${n} is ${n / d}, so {{${num}/${d}}} is ${num} × ${n / d} = ${(n / d) * num}.`,
      [`First I find {{1/${d}}}: ${n} ÷ ${d} = ${n / d}.`, `{{${num}/${d}}} is ${num} of those parts.`, `${num} × ${n / d} = ${(n / d) * num}.`],
      pic(bar([{ parts: d, shaded: num, text: n / d }], n), `${n} shared into ${d} equal boxes: ${n / d} in each. {{${num}/${d}}} is ${num} boxes: ${(n / d) * num}.`));
  },

  k1Money(level, rng) {
    if (level === 1) {
      const set = rng.sample([1, 2, 5, 10, 20, 50], rng.int(2, 4)).sort((a, b) => b - a);
      const total = set.reduce((a, b) => a + b, 0);
      return typed('How much money is here, in pence?', total, `${set.map((c) => `${c}p`).join(' + ')} = ${total}p. Start with the biggest coin.`,
        ['I start counting from the biggest coin.', set.map((c) => `${c}p`).join(' + '), `= ${total}p.`], { diagram: { type: 'coins', coins: set }, unit: 'p' });
    }
    if (level === 2) {
      const pay = rng.pick([20, 50, 100]), cost = rng.int(1, pay / 5 - 1) * 5;
      const what = rng.pick(['a toy race car', 'a space sticker', 'a hero badge', 'a rocket lolly']);
      return typed(`${what[0].toUpperCase() + what.slice(1)} costs ${money(cost)}. You pay with ${money(pay)}. How much change do you get, in pence?`, pay - cost, `${money(pay)} − ${money(cost)}: count on from ${cost}p to ${pay}p = ${pay - cost}p.`,
        [`Change is what is left: ${pay}p − ${cost}p.`, `I count on from ${cost} to ${pay}.`, `That is ${pay - cost}p.`], { unit: 'p' });
    }
    const p = rng.int(2, 9) * 10 + rng.pick([0, 5]);
    const pounds = rng.int(1, 3);
    return typed(`{hero} buys a cape for £${pounds} and a mask for ${p}p. How much is that altogether, in pence?`, pounds * 100 + p, `£${pounds} = ${pounds * 100}p. ${pounds * 100}p + ${p}p = ${pounds * 100 + p}p, which is ${money(pounds * 100 + p)}.`,
      [`I change pounds into pence: £${pounds} = ${pounds * 100}p.`, `Then I add the ${p}p.`, `${pounds * 100} + ${p} = ${pounds * 100 + p}p (${money(pounds * 100 + p)}).`], { unit: 'p' });
  },

  k1Time(level, rng) {
    const h = rng.int(1, 12);
    const mins = level === 1 ? rng.pick([0, 30]) : level === 2 ? rng.pick([15, 45, 0, 30]) : rng.pick([5, 10, 20, 25, 35, 40, 50, 55]);
    if (level === 3 && rng.chance(0.35)) {
      const startH = rng.int(1, 9), dur = rng.pick([15, 30, 45]);
      const endM = dur, right = timeWords(startH, endM);
      return choice(`The space race starts at ${startH} o’clock and lasts ${dur} minutes. What time does it finish?`, right, [timeWords(startH + 1, endM), timeWords(startH, (endM + 15) % 60), timeWords(startH + 1, 0)], rng, {
        explain: `${dur} minutes after ${startH} o’clock is ${right}.`, steps: [`I start at ${startH} o’clock.`, `I count on ${dur} minutes round the clock.`, `It finishes at ${right}.`],
      });
    }
    const right = timeWords(h, mins);
    const wrongs = [timeWords((h % 12) + 1, mins), timeWords(h === 1 ? 12 : h - 1, mins), timeWords(h, (mins + 30) % 60)].filter((w) => w !== right);
    return choice('What time does the clock show?', right, wrongs, rng, {
      diagram: { type: 'clock', h, m: mins },
      explain: `The long hand points to ${mins === 0 ? '12' : mins / 5} (${mins} minutes) and the short hand is ${mins === 0 ? `on ${h}` : mins === 30 ? `halfway between ${h} and ${(h % 12) + 1}` : mins > 30 ? `nearly at ${(h % 12) + 1}` : `just past ${h}`}. It is ${right}.`,
      steps: ['The long hand shows the minutes. The short hand shows the hour.', `The long hand points to ${mins === 0 ? '12' : mins / 5}: that is ${mins} minutes${mins ? '' : ', o’clock'}.`, `So it is ${right}.`],
    });
  },

  k1Measure(level, rng) {
    if (level === 1) {
      const items = [['the length of a racing car', 'm', ['cm', 'kg', 'ml']], ['the length of a pencil', 'cm', ['m', 'kg', 'l']], ['how heavy a rocket is', 'kg', ['g', 'cm', 'ml']], ['how heavy a feather is', 'g', ['kg', 'm', 'l']], ['the water in a bath', 'l', ['ml', 'cm', 'kg']], ['the medicine on a spoon', 'ml', ['l', 'kg', 'm']]];
      const [what, unit, wrong] = rng.pick(items);
      const NAME = { m: 'metres (m)', cm: 'centimetres (cm)', kg: 'kilograms (kg)', g: 'grams (g)', l: 'litres (l)', ml: 'millilitres (ml)' };
      return choice(`Which unit would you use to measure ${what}?`, NAME[unit], wrong.map((u) => NAME[u]), rng, { explain: `${NAME[unit]} is the best unit for ${what}.`, steps: ['Length: cm or m. Mass: g or kg. Capacity: ml or l.', `${what[0].toUpperCase() + what.slice(1)} is ${unit === 'm' || unit === 'cm' ? 'a length' : unit === 'kg' || unit === 'g' ? 'a mass' : 'a capacity'}.`, `It is ${['m', 'kg', 'l'].includes(unit) ? 'big' : 'small'}, so ${NAME[unit]}.`] });
    }
    if (level === 2) {
      const a = rng.int(15, 60), b = rng.int(15, 60);
      if (a === b) return KS1_GENERATORS.k1Measure(2, rng);
      const [c1, c2] = rng.sample(CARS, 2);
      return typed(`${c1}’s race track is ${a} m long. ${c2}’s track is ${b} m long. How much longer is the longer track?`, Math.abs(a - b), `${Math.max(a, b)} − ${Math.min(a, b)} = ${Math.abs(a - b)} m.`,
        ['“How much longer” means find the difference.', 'I take the smaller length from the bigger one.', `${Math.max(a, b)} − ${Math.min(a, b)} = ${Math.abs(a - b)} m.`], { unit: 'm' });
    }
    const kind = rng.pick(['cm', 'ml', 'kg']);
    if (kind === 'cm') { const m = rng.int(2, 5); return typed(`How many centimetres are in ${m} metres?`, m * 100, `1 m = 100 cm, so ${m} m = ${m * 100} cm.`, ['1 metre is 100 centimetres.', `${m} metres is ${m} lots of 100.`, `${m * 100} cm.`], { unit: 'cm' }); }
    if (kind === 'ml') return choice('How many millilitres are in half a litre?', '500 ml', ['50 ml', '100 ml', '5 ml'], rng, { explain: '1 litre = 1000 ml, so half a litre is 500 ml.', steps: ['A litre is 1000 ml.', 'Half of 1000 is 500.', 'So half a litre = 500 ml.'] });
    const per = rng.int(2, 5), n = rng.int(3, 5);
    return typed(`${rng.pick(SPACE)}’s rocket needs ${per} kg of fuel for each trip. How much fuel is needed for ${n} trips?`, per * n, `${n} × ${per} = ${per * n} kg.`, [`Each trip needs ${per} kg.`, `${n} trips is ${n} lots of ${per}.`, `${n} × ${per} = ${per * n} kg.`], { unit: 'kg' });
  },

  k1Data(level, rng) {
    const labels = rng.pick([['Turbo', 'Blaze', 'Sparky', 'Zoom'], ['Mars', 'Jupiter', 'Saturn', 'Venus'], ['Mon', 'Tue', 'Wed', 'Thu']]);
    const unit = labels[0] === 'Turbo' ? 'wins' : labels[0] === 'Mars' ? 'votes' : 'rescues';
    const title = unit === 'wins' ? 'Races won' : unit === 'votes' ? 'Favourite planet' : `{hero}’s rescues`;
    const key = level === 1 ? 1 : 2;
    const vals = labels.map(() => (level === 1 ? rng.int(1, 6) : rng.int(1, 6) * 2 + (level === 3 && rng.chance(0.4) ? 1 : 0)));
    if (new Set(vals).size < 3) return KS1_GENERATORS.k1Data(level, rng);
    const dg = { type: 'pictogram', title, rows: labels.map((l, i) => ({ label: l, n: vals[i] })), key, unit };
    if (level < 3 || rng.chance(0.4)) {
      const i = rng.int(0, 3);
      const DAY = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday' };
      const row = DAY[labels[i]] ? `${DAY[labels[i]]}’s row` : labels[i];
      return typed(DAY[labels[i]] ? `How many rescues were there on ${DAY[labels[i]]}?` : `How many ${unit} did ${labels[i]} get?`, vals[i], `Each star is ${key}. ${row} has ${vals[i] % key ? `${Math.floor(vals[i] / key)} and a half stars` : `${vals[i] / key} star${vals[i] === key ? '' : 's'}`}: ${vals[i]}.`,
        [`The key says one star = ${key}.`, `${row} has ${Math.floor(vals[i] / key)} whole star${Math.floor(vals[i] / key) === 1 ? '' : 's'}${vals[i] % key ? ' and a half' : ''}.`, `That is ${vals[i]}.`], { diagram: dg });
    }
    const [i, j] = rng.sample([0, 1, 2, 3], 2);
    const [hi, lo] = vals[i] >= vals[j] ? [i, j] : [j, i];
    return typed(unit === 'rescues' ? `How many more rescues were there on ${labels[hi]} than on ${labels[lo]}?` : `How many more ${unit} did ${labels[hi]} get than ${labels[lo]}?`, vals[hi] - vals[lo], `${labels[hi]}: ${vals[hi]}. ${labels[lo]}: ${vals[lo]}. ${vals[hi]} − ${vals[lo]} = ${vals[hi] - vals[lo]}.`,
      [`Read both rows using the key (one star = ${key}).`, `${labels[hi]} = ${vals[hi]}, ${labels[lo]} = ${vals[lo]}.`, `The difference is ${vals[hi] - vals[lo]}.`], { diagram: dg });
  },

  k1Problems(level, rng) {
    const car = rng.pick(CARS), ship = rng.pick(SPACE);
    if (level === 1) {
      const kind = rng.pick(['laps', 'fuel', 'wheels']);
      if (kind === 'laps') { const total = rng.pick([20, 30, 40, 50]), done = rng.int(5, total - 5); return typed(`The race is ${total} laps. ${car} has driven ${done} laps. How many laps are left?`, total - done, `${total} − ${done} = ${total - done}.`, ['“How many are left” means take away.', `${total} − ${done}.`, `= ${total - done} laps.`]); }
      if (kind === 'fuel') { const a = rng.int(25, 60), b = rng.int(5, 20); return typed(`${car} has ${a} litres of fuel and uses ${b} litres in a race. How many litres are left?`, a - b, `${a} − ${b} = ${a - b} litres.`, ['Using fuel means there is less: take away.', `${a} − ${b}.`, `= ${a - b} litres.`], { unit: 'litres' }); }
      const n = rng.int(3, 9); return typed(`Each racing car has 4 wheels. How many wheels do ${n} cars have?`, 4 * n, `${n} × 4 = ${4 * n}.`, ['Each car has 4 wheels.', `${n} lots of 4.`, `${n} × 4 = ${4 * n}.`], pic(bar([{ parts: n, text: 4 }], 4 * n), `One box for each car, 4 wheels in each: ${n} × 4 = ${4 * n}.`));
    }
    if (level === 2) {
      const kind = rng.pick(['points', 'robots', 'rescue']);
      if (kind === 'points') { const a = rng.int(12, 30), more = rng.int(5, 15); const other = rng.pick(CARS.filter((c) => c !== car)); return typed(`${car} scores ${a} points. ${other} scores ${more} more than ${car}. How many points do they score altogether?`, a + a + more, `${other} scores ${a} + ${more} = ${a + more}. Altogether ${a} + ${a + more} = ${2 * a + more}.`, [`First, ${other}’s score: ${a} + ${more} = ${a + more}.`, `Then add both scores.`, `${a} + ${a + more} = ${2 * a + more}.`]); }
      if (kind === 'robots') { const rows = rng.int(2, 5), per = rng.pick([2, 5, 10]), leave = rng.int(2, rows * per - 1); return typed(`${ship}’s spaceship carries ${rows} rows of ${per} robots. ${leave} robots get off at the space station. How many are still on the ship?`, rows * per - leave, `${rows} × ${per} = ${rows * per} robots, then ${rows * per} − ${leave} = ${rows * per - leave}.`, [`First, how many robots: ${rows} × ${per} = ${rows * per}.`, `Then take away the ${leave} that get off.`, `${rows * per} − ${leave} = ${rows * per - leave}.`]); }
      const mon = rng.int(3, 9); return typed(`{hero} rescues ${mon} cats on Monday and twice as many on Tuesday. How many cats are rescued altogether?`, mon * 3, `Tuesday: double ${mon} = ${mon * 2}. Altogether ${mon} + ${mon * 2} = ${mon * 3}.`, ['“Twice as many” means double.', `Tuesday: ${mon} × 2 = ${mon * 2}.`, `${mon} + ${mon * 2} = ${mon * 3}.`],
        pic(bar([{ label: 'Monday', parts: 1, text: mon, total: String(mon) }, { label: 'Tuesday', parts: 2, text: mon, total: String(mon * 2) }]), `Tuesday is twice Monday: 2 boxes of ${mon}. Altogether 3 boxes: ${mon * 3}.`));
    }
    const kind = rng.pick(['share', 'cost', 'compare']);
    if (kind === 'share') { const teams = rng.pick([2, 3, 4, 5]), each = rng.int(3, 8), extra = rng.int(2, 9); const total = teams * each; return typed(`There are ${total + extra} tyres. ${extra} are flat. The rest are shared equally between ${teams} teams. How many good tyres does each team get?`, each, `${total + extra} − ${extra} = ${total} good tyres. ${total} ÷ ${teams} = ${each}.`, [`First the good tyres: ${total + extra} − ${extra} = ${total}.`, `Then share them: ${total} ÷ ${teams}.`, `= ${each} each.`],
      pic(bar([{ parts: teams, text: each }], `${total} good tyres`), `${total + extra} − ${extra} = ${total} good tyres, shared into ${teams} equal boxes: ${each} in each.`)); }
    if (kind === 'cost') { const a = rng.int(2, 4) * 10, b = rng.int(1, 3) * 5, n = rng.int(2, 3); return typed(`A rocket sticker costs ${a}p and a planet sticker costs ${b}p. {hero} buys ${n} rocket stickers and 1 planet sticker. How much does that cost, in pence?`, n * a + b, `${n} × ${a}p = ${n * a}p, plus ${b}p = ${n * a + b}p.`, [`Rocket stickers: ${n} × ${a} = ${n * a}p.`, `Add the planet sticker: ${n * a} + ${b}.`, `= ${n * a + b}p.`], { unit: 'p' }); }
    const a = rng.int(30, 60), b = rng.int(10, 25), c = rng.int(5, 15);
    return typed(`Captain Nova flies ${a} km on Monday. On Tuesday she flies ${b} km fewer, and on Wednesday ${c} km more than Tuesday. How far does she fly on Wednesday?`, a - b + c, `Tuesday: ${a} − ${b} = ${a - b}. Wednesday: ${a - b} + ${c} = ${a - b + c} km.`, [`Tuesday first: ${a} − ${b} = ${a - b}.`, `Wednesday is ${c} more than Tuesday.`, `${a - b} + ${c} = ${a - b + c} km.`], { unit: 'km' });
  },

  // --- stretch (Year 3) ----------------------------------------------------------------
  k1Times8(level, rng) {
    const a = level === 1 ? 3 : level === 2 ? 4 : rng.pick([3, 4, 8]), b = rng.int(2, 12);
    if (level === 3 && rng.chance(0.5)) return typed(`${a * b} ÷ ${a} =`, b, `${a} × ${b} = ${a * b}, so ${a * b} ÷ ${a} = ${b}.`, ['Division undoes multiplication.', `Which number times ${a} makes ${a * b}?`, `${b}, because ${a} × ${b} = ${a * b}.`]);
    return typed(`${b} × ${a} =`, a * b, a === 8 ? `Double the 4 times table: ${b} × 4 = ${b * 4}, doubled is ${b * 8}.` : a === 4 ? `Double the 2 times table: ${b} × 2 = ${b * 2}, doubled is ${b * 4}.` : `Count in 3s: ${Array.from({ length: Math.min(b, 6) }, (_, i) => 3 * (i + 1)).join(', ')}${b > 6 ? `, … ${a * b}` : ''}. ${b} × 3 = ${a * b}.`,
      [a === 8 ? '× 8 is double × 4.' : a === 4 ? '× 4 is double × 2.' : 'I count in 3s.', a === 8 ? `${b} × 4 = ${b * 4}.` : a === 4 ? `${b} × 2 = ${b * 2}.` : `${b} jumps of 3.`, `${b} × ${a} = ${a * b}.`]);
  },

  k1Column(level, rng) {
    if (level === 1) { const a = rng.int(100, 500), b = rng.int(100, 399); if ((a % 10) + (b % 10) >= 10 || (Math.floor(a / 10) % 10) + (Math.floor(b / 10) % 10) >= 10) return KS1_GENERATORS.k1Column(1, rng); return typed(`${a} + ${b} =`, a + b, `Add each column: hundreds, tens, ones. ${a + b}.`, ['Line up hundreds, tens and ones.', 'Add the ones, then the tens, then the hundreds.', `${a} + ${b} = ${a + b}.`], pic(pvWhole(['H', 'T', 'O'], [a, b, a + b]), `${a} + ${b} = ${a + b}, column by column.`)); }
    if (level === 2) { const a = rng.int(125, 580), b = rng.int(117, 399); return typed(`${a} + ${b} =`, a + b, `Ones: ${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)}${(a % 10) + (b % 10) >= 10 ? ', so carry 1 ten' : ''}. Keep going column by column: ${a + b}.`, ['Line up the columns.', 'If a column makes 10 or more, carry the ten to the next column.', `${a} + ${b} = ${a + b}.`], pic(pvWhole(['H', 'T', 'O'], [a, b, a + b]), `${a} + ${b} = ${a + b}, column by column.`)); }
    const a = rng.int(400, 900), b = rng.int(108, a - 100);
    return typed(`${a} − ${b} =`, a - b, `Subtract column by column, exchanging a ten or a hundred if the top digit is too small. ${a - b}.`, ['Line up the columns, bigger number on top.', 'If the top digit is smaller, exchange 1 from the next column.', `${a} − ${b} = ${a - b}. Check: ${a - b} + ${b} = ${a}.`], pic(pvWhole(['H', 'T', 'O'], [a, b, a - b]), `${a} − ${b} = ${a - b}, column by column.`));
  },

  k1Hundreds(level, rng) {
    if (level === 1) { const n = rng.int(100, 899), up = rng.pick([1, 10, 100]); return typed(`What is ${up} more than ${n}?`, n + up, `Only the ${up === 1 ? 'ones' : up === 10 ? 'tens' : 'hundreds'} change: ${n + up}.`, [`${up} more changes the ${up === 1 ? 'ones' : up === 10 ? 'tens' : 'hundreds'} digit.`, `${n} + ${up}.`, `= ${n + up}.`], pic(pvWhole(['H', 'T', 'O'], [n, n + up]), `${n} + ${up} = ${n + up}`)); }
    if (level === 2) { const n = rng.int(101, 989), d = String(n)[rng.int(0, 2)]; if (d === '0') return KS1_GENERATORS.k1Hundreds(2, rng); const pos = String(n).indexOf(d), val = +d * [100, 10, 1][pos]; return typed(`In ${n}, what is the value of the digit ${d}${String(n).split(d).length > 2 ? ` (the first ${d})` : ''}?`, val, `The ${d} is in the ${['hundreds', 'tens', 'ones'][pos]} place: ${val}.`, [`${n} = ${Math.floor(n / 100) * 100} + ${Math.floor(n / 10) % 10 * 10} + ${n % 10}.`, `The ${d} is in the ${['hundreds', 'tens', 'ones'][pos]} column.`, `It is worth ${val}.`], pic(pvWhole(['H', 'T', 'O'], [n]), `${n} = ${Math.floor(n / 100) * 100} + ${Math.floor(n / 10) % 10 * 10} + ${n % 10}`)); }
    const n = rng.int(10, 99) * 10;
    return typed(`What is ${n} rounded to the nearest hundred?`, Math.round(n / 100) * 100, `${n} is between ${Math.floor(n / 100) * 100} and ${Math.floor(n / 100) * 100 + 100}. The tens digit is ${Math.floor(n / 10) % 10}, so it rounds ${Math.floor(n / 10) % 10 >= 5 ? 'up' : 'down'} to ${Math.round(n / 100) * 100}.`, ['Look at the tens digit.', '5 or more rounds up; less than 5 rounds down.', `${n} → ${Math.round(n / 100) * 100}.`]);
  },
};
