// Year 3 maths generators (greater depth, with Year 4 tasters at level 3 and in the stretch
// topics). Same contract as ks1maths.js: (level 1-3, rng) -> a typed or choice question with
// an explanation and worked steps. "{hero}" becomes the child's own superhero name in present().

import { timeWords } from './ks1maths.js';

const money = (p) => (p >= 100 ? `£${(p / 100).toFixed(2)}` : `${p}p`);
const pad = (n) => String(n).padStart(2, '0');
const RACERS = ['Turbo', 'Blaze', 'Rosa', 'Captain Nova', 'Bleep the droid', '{hero}'];
function choice(prompt, correct, wrongs, rng, extra = {}) {
  const seen = new Set([correct]);
  const ws = wrongs.map((w) => (typeof w === 'string' ? { text: w } : w)).filter((w) => !seen.has(w.text) && seen.add(w.text));
  return { kind: 'choice', prompt, options: rng.shuffle([{ text: correct, correct: true }, ...ws]), ...extra };
}
const typed = (prompt, value, explain, steps, extra = {}) => ({ kind: 'typed', prompt, numeric: { value: String(value), form: 'any' }, explain, steps, ...extra });
const neg = (n) => (n < 0 ? `−${-n}` : String(n));
const digits = (n) => String(n).split('').map(Number);
const distinctDigits = (n) => new Set(String(n)).size === String(n).length;
const PLACE = ['hundreds', 'tens', 'ones'];

// column steps for a + b or a − b (3-digit)
function addSteps(a, b) {
  const [ah, at, ao] = digits(a), [bh, bt, bo] = digits(b);
  const o = ao + bo, c1 = o >= 10 ? 1 : 0, t = at + bt + c1, c2 = t >= 10 ? 1 : 0, hh = ah + bh + c2;
  return [
    `Ones: ${ao} + ${bo} = ${o}${c1 ? `. I write ${o % 10} and carry 1 ten.` : '.'}`,
    `Tens: ${at} + ${bt}${c1 ? ' + 1' : ''} = ${t}${c2 ? `. I write ${t % 10} and carry 1 hundred.` : '.'}`,
    `Hundreds: ${ah} + ${bh}${c2 ? ' + 1' : ''} = ${hh}. The answer is ${a + b}.`,
  ];
}
function subSteps(a, b) {
  const [ah, at, ao] = digits(a), [bh, bt, bo] = digits(b);
  const ex1 = ao < bo, t = at - (ex1 ? 1 : 0), ex2 = t < bt;
  return [
    ex1 ? `Ones: ${ao} − ${bo} won’t go, so I exchange a ten for 10 ones: ${ao + 10} − ${bo} = ${ao + 10 - bo}.` : `Ones: ${ao} − ${bo} = ${ao - bo}.`,
    ex2 ? `Tens: ${t} − ${bt} won’t go, so I exchange a hundred for 10 tens: ${t + 10} − ${bt} = ${t + 10 - bt}.` : `Tens: ${t} − ${bt} = ${t - bt}.`,
    `Hundreds: ${ah - (ex2 ? 1 : 0)} − ${bh} = ${ah - (ex2 ? 1 : 0) - bh}. The answer is ${a - b}. Check: ${a - b} + ${b} = ${a}.`,
  ];
}
// an a + b with exactly the exchanges asked for (ones and/or tens), answer below 1000
function addPair(rng, onesCarry, tensCarry) {
  for (;;) {
    const a = rng.int(101, 899), b = rng.int(101, 899);
    const [, at, ao] = digits(a), [, bt, bo] = digits(b);
    const c1 = ao + bo >= 10, c2 = at + bt + (c1 ? 1 : 0) >= 10;
    if (c1 === onesCarry && c2 === tensCarry && a + b <= 999) return [a, b];
  }
}
function subPair(rng, onesEx, tensEx) {
  for (;;) {
    const a = rng.int(300, 999), b = rng.int(101, a - 100);
    const [, at, ao] = digits(a), [, bt, bo] = digits(b);
    const e1 = ao < bo, e2 = at - (e1 ? 1 : 0) < bt;
    if (e1 === onesEx && e2 === tensEx) return [a, b];
  }
}

export const Y3_GENERATORS = {
  y3Place(level, rng) {
    if (level === 1) {
      const kind = rng.pick(['value', 'partition', 'more']);
      if (kind === 'value') {
        let n; do n = rng.int(111, 999); while (!distinctDigits(n) || String(n).includes('0'));
        const i = rng.int(0, 2), d = digits(n)[i], v = d * [100, 10, 1][i];
        return typed(`In ${n}, what is the value of the digit ${d}?`, v, `The ${d} is in the ${PLACE[i]} place, so it is worth ${v}.`, [`${n} = ${digits(n)[0] * 100} + ${digits(n)[1] * 10} + ${digits(n)[2]}.`, `The ${d} is in the ${PLACE[i]} column.`, `So it is worth ${v}.`]);
      }
      if (kind === 'partition') {
        const h = rng.int(1, 9), t = rng.int(0, 9), o = rng.int(1, 9), n = h * 100 + t * 10 + o;
        return typed(`${h * 100} + ${t * 10} + ${o} =`, n, `${h} hundreds, ${t} tens and ${o} ones make ${n}.`, [`${h * 100} is ${h} hundreds.`, `${t * 10} is ${t} tens, and ${o} is ${o} ones.`, `Together: ${n}.`]);
      }
      const k = rng.pick([10, 100]), up = rng.chance(0.5);
      let n; do n = rng.int(210, 789); while ((k === 10 && (up ? digits(n)[1] === 9 : digits(n)[1] === 0)));
      const v = up ? n + k : n - k;
      return typed(`What is ${k} ${up ? 'more' : 'less'} than ${n}?`, v, `Only the ${k === 10 ? 'tens' : 'hundreds'} digit changes: ${n} → ${v}.`, [`${k} is one ${k === 10 ? 'ten' : 'hundred'}.`, `The ${k === 10 ? 'tens' : 'hundreds'} digit goes ${up ? 'up' : 'down'} by 1.`, `${v}.`]);
    }
    if (level === 2) {
      const kind = rng.pick(['order', 'missing', 'cross']);
      if (kind === 'order') {
        let ds; do ds = [rng.int(1, 9), rng.int(1, 9), rng.int(0, 9)]; while (new Set(ds).size < 3);
        const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map((p) => p.map((i) => ds[i])).filter((p) => p[0] !== 0).map((p) => +p.join(''));
        const nums = rng.shuffle(perms).slice(0, 4), big = rng.chance(0.5);
        const right = big ? Math.max(...nums) : Math.min(...nums);
        return choice(`${rng.pick(RACERS)} made these numbers from the digits ${ds.join(', ')}. Which is the ${big ? 'greatest' : 'smallest'}?`, String(right), nums.filter((x) => x !== right).map(String), rng, {
          explain: `Compare the hundreds first, then the tens, then the ones. The ${big ? 'greatest' : 'smallest'} is ${right}.`,
          steps: ['I look at the hundreds digits first.', 'If two are the same, I look at the tens.', `${[...nums].sort((x, y) => (big ? y - x : x - y)).join(', ')}.`],
        });
      }
      if (kind === 'missing') {
        const h = rng.int(2, 9), t = rng.int(1, 9), o = rng.int(1, 9), n = h * 100 + t * 10 + o;
        if (rng.chance(0.5)) return typed(`${n} = ${h * 100} + ? + ${o}`, t * 10, `${n} is ${h} hundreds, ${t} tens and ${o} ones, so the missing part is ${t * 10}.`, [`${h * 100} is the hundreds part, ${o} is the ones.`, `The tens digit is ${t}.`, `So the missing number is ${t * 10}.`]);
        return typed(`${n} = ${(h - 1) * 100} + ? + ${o}`, 100 + t * 10, `Only ${h - 1} hundreds are used, so one hundred moves into the middle part: 100 + ${t * 10} = ${100 + t * 10}.`, [`${n} − ${o} = ${n - o}.`, `${n - o} − ${(h - 1) * 100} = ${100 + t * 10}.`, `Check: ${(h - 1) * 100} + ${100 + t * 10} + ${o} = ${n}.`]);
      }
      if (rng.chance(0.5)) { const n = rng.int(1, 8) * 100 + 90 + rng.int(0, 9); return typed(`What is 10 more than ${n}?`, n + 10, `The tens go from 9 to 10, which makes a new hundred: ${n} → ${n + 10}.`, [`${n} has 9 tens.`, '10 tens make a hundred, so the hundreds digit goes up by 1.', `${n + 10}.`]); }
      const n = rng.int(2, 9) * 100 + rng.int(0, 9); return typed(`What is 10 less than ${n}?`, n - 10, `There are no tens, so I exchange a hundred: ${n} → ${n - 10}.`, [`${n} has 0 tens.`, 'I take one hundred and make it 10 tens, then take one ten away.', `${n - 10}.`]);
    }
    const kind = rng.pick(['thousand', 'fourdigit', 'between']);
    if (kind === 'thousand') { const n = rng.int(901, 999); return typed(`What is 100 more than ${n}?`, n + 100, `10 hundreds make a thousand: ${n} + 100 = ${n + 100}.`, [`${n} has 9 hundreds.`, 'One more hundred makes 10 hundreds, which is 1000.', `${n + 100}.`]); }
    if (kind === 'fourdigit') {
      let n; do n = rng.int(1234, 9876); while (!distinctDigits(n) || String(n).includes('0'));
      const i = rng.int(0, 1), d = digits(n)[i], v = d * [1000, 100][i];
      return typed(`In ${n}, what is the value of the digit ${d}?`, v, `The ${d} is in the ${['thousands', 'hundreds'][i]} place: ${v}.`, ['Four-digit numbers have thousands, hundreds, tens and ones.', `The ${d} is in the ${['thousands', 'hundreds'][i]} column.`, `So it is worth ${v}.`]);
    }
    const gap = rng.pick([20, 200]), a = gap === 20 ? rng.int(1, 9) * 100 + rng.int(0, 7) * 10 : rng.int(1, 7) * 100, b = a + gap;
    return typed(`What number is exactly halfway between ${a} and ${b}?`, a + gap / 2, `The gap is ${gap}, and half of ${gap} is ${gap / 2}: ${a} + ${gap / 2} = ${a + gap / 2}.`, [`${b} − ${a} = ${gap}.`, `Half of ${gap} is ${gap / 2}.`, `${a} + ${gap / 2} = ${a + gap / 2}.`]);
  },

  y3Mental(level, rng) {
    if (level === 1) {
      for (;;) {
        const a = rng.int(111, 888), i = rng.int(0, 2), place = [100, 10, 1][i], d = digits(a)[i], up = rng.chance(0.5);
        const k = up ? rng.int(1, 9 - d) : rng.int(1, d);
        if (up ? d === 9 : d === 0) continue;
        const v = up ? a + k * place : a - k * place;
        return typed(`${a} ${up ? '+' : '−'} ${k * place} =`, v, `Only the ${PLACE[i]} digit changes: ${d} ${up ? '+' : '−'} ${k} = ${up ? d + k : d - k}.`, [`${k * place} is ${k} ${PLACE[i]}.`, `The ${PLACE[i]} digit of ${a} is ${d}.`, `${d} ${up ? '+' : '−'} ${k} = ${up ? d + k : d - k}, so the answer is ${v}.`]);
      }
    }
    if (level === 2) {
      if (rng.chance(0.5)) {
        let a, k; do { a = rng.int(150, 880); k = rng.int(2, 9); } while (digits(a)[1] + k < 10 || a + k * 10 > 999);
        return typed(`${a} + ${k * 10} =`, a + k * 10, `${digits(a)[1]} tens + ${k} tens = ${digits(a)[1] + k} tens, which crosses into the next hundred: ${a + k * 10}.`, [`${a} has ${digits(a)[1]} tens.`, `${digits(a)[1]} + ${k} = ${digits(a)[1] + k} tens: that is 1 hundred and ${digits(a)[1] + k - 10} tens.`, `${a + k * 10}.`]);
      }
      let a, k; do { a = rng.int(120, 990); k = rng.int(2, 9); } while (digits(a)[2] >= k || digits(a)[1] === 0);
      return typed(`${a} − ${k} =`, a - k, `There aren’t enough ones, so I cross back over a ten: ${a} − ${digits(a)[2]} = ${a - digits(a)[2]}, then − ${k - digits(a)[2]} more = ${a - k}.`, [`Split ${k} into ${digits(a)[2]} and ${k - digits(a)[2]}.`, `${a} − ${digits(a)[2]} = ${a - digits(a)[2]}.`, `${a - digits(a)[2]} − ${k - digits(a)[2]} = ${a - k}.`]);
    }
    const k = rng.pick([99, 98, 199, 101, 201]), add = rng.chance(0.5);
    const near = Math.round(k / 100) * 100, adj = k - near;
    const a = add ? rng.int(201, 999 - k) : rng.int(k + 101, 999);
    const v = add ? a + k : a - k;
    const adjText = adj < 0 ? `${-adj} less` : `${adj} more`;
    return typed(`${a} ${add ? '+' : '−'} ${k} =`, v, `${k} is ${near} ${adj < 0 ? `take away ${-adj}` : `add ${adj}`}. So ${add ? 'add' : 'take away'} ${near}, then adjust: ${v}.`, [`${k} is close to ${near} (${adjText}).`, `${a} ${add ? '+' : '−'} ${near} = ${add ? a + near : a - near}.`, `Then adjust by ${Math.abs(adj)}: ${v}.`]);
  },

  y3Column(level, rng) {
    if (level === 1) {
      if (rng.chance(0.5)) { const [a, b] = addPair(rng, true, false); return typed(`${a} + ${b} =`, a + b, `Line the numbers up in columns and start with the ones: ${a + b}.`, addSteps(a, b)); }
      const [a, b] = subPair(rng, true, false); return typed(`${a} − ${b} =`, a - b, `Use the column method, exchanging a ten for 10 ones: ${a - b}.`, subSteps(a, b));
    }
    if (level === 2) {
      const kind = rng.pick(['add', 'sub', 'check', 'estimate']);
      if (kind === 'add') { const [a, b] = addPair(rng, true, true); return typed(`${a} + ${b} =`, a + b, `Two exchanges: the ones and the tens both carry. ${a + b}.`, addSteps(a, b)); }
      if (kind === 'sub') { const [a, b] = subPair(rng, true, true); return typed(`${a} − ${b} =`, a - b, `Two exchanges: a ten for ones, then a hundred for tens. ${a - b}.`, subSteps(a, b)); }
      if (kind === 'check') {
        const [a, b] = subPair(rng, true, rng.chance(0.5)), c = a - b, who = rng.pick(RACERS);
        return choice(`${who} works out ${a} − ${b} = ${c}. Which calculation checks the answer?`, `${c} + ${b}`, [`${c} − ${b}`, `${a} + ${b}`, `${a} + ${c}`], rng, {
          explain: `Adding undoes taking away: if ${c} + ${b} makes ${a}, the answer is right.`, steps: ['Addition is the inverse of subtraction.', `Add the answer to the number taken away: ${c} + ${b}.`, `${c} + ${b} = ${a}, so it is right.`],
        });
      }
      let a, b; do { a = rng.int(120, 680); b = rng.int(120, 680); } while ([4, 5].includes(digits(a)[1]) || [4, 5].includes(digits(b)[1]) || a + b > 999);
      const e = Math.round(a / 100) * 100 + Math.round(b / 100) * 100;
      return choice(`Without working it out exactly, what is the best estimate for ${a} + ${b}?`, String(e), [String(e - 100), String(e + 100), String(e * 10)], rng, {
        explain: `Round each number to the nearest hundred: ${Math.round(a / 100) * 100} + ${Math.round(b / 100) * 100} = ${e}. (Exactly, it is ${a + b}.)`, steps: [`${a} rounds to ${Math.round(a / 100) * 100}.`, `${b} rounds to ${Math.round(b / 100) * 100}.`, `${Math.round(a / 100) * 100} + ${Math.round(b / 100) * 100} = ${e}.`],
      });
    }
    if (rng.chance(0.5)) {
      const h = rng.int(4, 9), o = rng.int(0, 4), a = h * 100 + o; let b; do b = rng.int(111, a - 100); while (digits(b)[2] <= o || digits(b)[1] === 0);
      return typed(`${a} − ${b} =`, a - b, `There are no tens to exchange, so a hundred becomes 10 tens first, then a ten becomes 10 ones. ${a - b}.`, [`${a} has 0 tens, so I exchange 1 hundred for 10 tens.`, `Then I exchange 1 ten for 10 ones: ones ${o + 10} − ${digits(b)[2]} = ${o + 10 - digits(b)[2]}.`, `Tens 9 − ${digits(b)[1]} = ${9 - digits(b)[1]}, hundreds ${h - 1} − ${digits(b)[0]} = ${h - 1 - digits(b)[0]}. Answer: ${a - b}.`]);
    }
    const [a, b] = addPair(rng, rng.chance(0.5), true), [h, t, o] = digits(a), s = a + b;
    return typed(`Find the missing digit: ${h}?${o} + ${b} = ${s}`, t, `${s} − ${b} = ${a}, so the missing digit is ${t}.`, ['I can use the inverse: take away to find the missing number.', `${s} − ${b} = ${a}.`, `The tens digit of ${a} is ${t}.`]);
  },

  y3Tables(level, rng) {
    const a = rng.pick([3, 4, 8]);
    if (level === 1) {
      const b = rng.int(2, 12);
      if (rng.chance(0.5)) return typed(`${b} × ${a} =`, a * b, `${b} lots of ${a} = ${a * b}.`, [`I count in ${a}s ${b} times.`, a === 8 ? `Or double ${b} × 4 = ${b * 4}.` : `Or use a fact I know.`, `${b} × ${a} = ${a * b}.`]);
      return typed(`${a * b} ÷ ${a} =`, b, `${b} × ${a} = ${a * b}, so ${a * b} ÷ ${a} = ${b}.`, ['Division is the inverse of multiplication.', `How many ${a}s make ${a * b}?`, `${b}.`]);
    }
    const b = rng.int(2, 9);
    if (level === 2) {
      const kind = rng.pick(['x10', 'div10', 'tens']);
      if (kind === 'x10') return typed(`${a} × ${b * 10} =`, a * b * 10, `${a} × ${b} = ${a * b}, so ${a} × ${b * 10} is ten times bigger: ${a * b * 10}.`, [`I know ${a} × ${b} = ${a * b}.`, `${b * 10} is ten times ${b}.`, `So the answer is ten times ${a * b}: ${a * b * 10}.`]);
      if (kind === 'div10') return typed(`${a * b * 10} ÷ ${a} =`, b * 10, `${a * b} ÷ ${a} = ${b}, so ${a * b * 10} ÷ ${a} = ${b * 10}.`, [`${a * b * 10} is ten times ${a * b}.`, `${a * b} ÷ ${a} = ${b}.`, `So the answer is ten times bigger: ${b * 10}.`]);
      return typed(`${a * 10} × ${b} =`, a * b * 10, `${a} tens × ${b} = ${a * b} tens = ${a * b * 10}.`, [`${a * 10} is ${a} tens.`, `${a} × ${b} = ${a * b}, so ${a * b} tens.`, `${a * b * 10}.`]);
    }
    const kind = rng.pick(['missing', 'double', 'word']);
    if (kind === 'missing') { const c = rng.int(3, 12); return typed(`${a} × ? = ${a * c}`, c, `${a * c} ÷ ${a} = ${c}.`, ['I need the missing factor.', `Divide: ${a * c} ÷ ${a}.`, `${c}. Check: ${a} × ${c} = ${a * c}.`]); }
    if (kind === 'double') { const c = rng.int(3, 12); return typed(`4 × ${c} = ${4 * c}. Use this to work out 8 × ${c}.`, 8 * c, `8 is double 4, so 8 × ${c} is double ${4 * c}: ${8 * c}.`, ['8 is double 4.', `So 8 × ${c} is double 4 × ${c}.`, `Double ${4 * c} = ${8 * c}.`]); }
    const c = rng.int(3, 12);
    const [thing, n] = rng.pick([['a spider has', 8], ['a racing car has', 4], ['a tricycle has', 3]]);
    const item = thing.split(' ')[1];
    return typed(`${thing[0].toUpperCase() + thing.slice(1)} ${n} ${n === 8 ? 'legs' : 'wheels'}. How many ${n === 8 ? 'legs' : 'wheels'} do ${c} ${item === 'spider' ? 'spiders' : item === 'racing' ? 'racing cars' : 'tricycles'} have?`, n * c, `${c} × ${n} = ${n * c}.`, [`Each one has ${n}.`, `${c} lots of ${n}.`, `${c} × ${n} = ${n * c}.`]);
  },

  y3Multiply(level, rng) {
    if (level === 1) {
      if (rng.chance(0.5)) { const t = rng.int(2, 9), k = rng.int(2, 5); return typed(`${t * 10} × ${k} =`, t * 10 * k, `${t} × ${k} = ${t * k}, so ${t} tens × ${k} = ${t * k} tens = ${t * 10 * k}.`, [`${t * 10} is ${t} tens.`, `${t} × ${k} = ${t * k}.`, `${t * k} tens = ${t * 10 * k}.`]); }
      let n, k; do { n = rng.int(11, 43); k = rng.int(2, 3); } while ((n % 10) * k >= 10 || Math.floor(n / 10) * k >= 10 || n % 10 === 0);
      const T = n - (n % 10), O = n % 10;
      return typed(`${n} × ${k} =`, n * k, `Split ${n} into ${T} and ${O}: ${T} × ${k} = ${T * k}, ${O} × ${k} = ${O * k}, total ${n * k}.`, [`${n} = ${T} + ${O}.`, `${T} × ${k} = ${T * k} and ${O} × ${k} = ${O * k}.`, `${T * k} + ${O * k} = ${n * k}.`]);
    }
    const [lo, hi, ks] = level === 2 ? [13, 49, [3, 4, 5, 8]] : [26, 99, [6, 7, 8, 9]];
    let n; do n = rng.int(lo, hi); while (n % 10 === 0);
    const k = rng.pick(ks), T = n - (n % 10), O = n % 10;
    const steps = [`Split ${n} into ${T} and ${O} (a grid helps).`, `${T} × ${k} = ${T * k} and ${O} × ${k} = ${O * k}.`, `${T * k} + ${O * k} = ${n * k}.`];
    if (level === 3 && rng.chance(0.4)) return typed(`A car transporter carries ${k} cars. How many cars are on ${n} transporters?`, n * k, `${n} × ${k} = ${n * k}.`, steps);
    return typed(`${n} × ${k} =`, n * k, `${T} × ${k} = ${T * k}, ${O} × ${k} = ${O * k}, so ${n} × ${k} = ${n * k}.`, steps);
  },

  y3Divide(level, rng) {
    if (level === 1) {
      const d = rng.pick([2, 3, 4, 5, 8, 10]), q = rng.int(2, 12), who = rng.pick(['Captain Nova', '{hero}', 'Rosa']);
      return typed(`${who} shares ${d * q} space crystals equally between ${d} droids. How many does each droid get?`, q, `${d * q} ÷ ${d} = ${q}, because ${q} × ${d} = ${d * q}.`, ['Sharing equally means dividing.', `${d * q} ÷ ${d}.`, `${q} each. Check: ${q} × ${d} = ${d * q}.`]);
    }
    if (level === 2) {
      let d, q; do { d = rng.pick([2, 3, 4, 5]); q = rng.int(13, 24); } while (d * q >= 100);
      const n = d * q, first = d * 10, rest = n - first;
      return typed(`${n} ÷ ${d} =`, q, `Split ${n} into ${first} and ${rest}: ${first} ÷ ${d} = 10 and ${rest} ÷ ${d} = ${rest / d}, so ${q}.`, [`${n} = ${first} + ${rest} (both share easily by ${d}).`, `${first} ÷ ${d} = 10 and ${rest} ÷ ${d} = ${rest / d}.`, `10 + ${rest / d} = ${q}.`]);
    }
    let d, q, r; do { d = rng.pick([3, 4, 5, 6]); q = rng.int(4, 15); r = rng.int(1, d - 1); } while (d * q + r >= 100);
    const n = d * q + r, kind = rng.pick(['rem', 'up', 'down']);
    const steps = [`${d} × ${q} = ${d * q}.`, `${n} − ${d * q} = ${r} left over.`, `${n} ÷ ${d} = ${q} remainder ${r}.`];
    if (kind === 'rem') return typed(`${n} ÷ ${d} = ${q} remainder ?`, r, `${d} × ${q} = ${d * q}, and ${n} − ${d * q} = ${r}.`, steps);
    if (kind === 'up') return typed(`A minibus seats ${d} astronauts. How many minibuses are needed for ${n} astronauts?`, q + 1, `${n} ÷ ${d} = ${q} remainder ${r}. The ${r} left over still need a minibus: ${q + 1}.`, [...steps.slice(0, 2), `The ${r} left over need one more minibus: ${q} + 1 = ${q + 1}.`]);
    return typed(`Rosa packs ${n} wheel nuts into bags of ${d}. How many FULL bags can she make?`, q, `${n} ÷ ${d} = ${q} remainder ${r}, so ${q} full bags (and ${r} nuts left over).`, steps);
  },

  y3Fractions(level, rng) {
    if (level === 1) {
      if (rng.chance(0.6)) { const d = rng.pick([2, 3, 4, 5, 8, 10]), k = rng.int(2, 10); return typed(`{{1/${d}}} of ${d * k} =`, k, `To find {{1/${d}}}, divide by ${d}: ${d * k} ÷ ${d} = ${k}.`, [`{{1/${d}}} means ${d} equal parts.`, `${d * k} ÷ ${d} = ${k}.`, `So {{1/${d}}} of ${d * k} is ${k}.`]); }
      const start = rng.int(1, 6);
      return typed(`Count up in tenths: {{${start}/10}}, {{${start + 1}/10}}, {{${start + 2}/10}}, ?`, `${start + 3}/10`, `Each step adds one tenth: {{${start + 3}/10}}.`, ['Tenths: the whole is split into 10 equal parts.', 'Each step is one more tenth.', `{{${start + 2}/10}} + {{1/10}} = {{${start + 3}/10}}.`]);
    }
    if (level === 2) {
      const d = rng.pick([3, 4, 5, 8, 10]), n = rng.int(2, d - 1), k = rng.int(2, 10);
      return typed(`{{${n}/${d}}} of ${d * k} =`, n * k, `{{1/${d}}} of ${d * k} is ${k}, so {{${n}/${d}}} is ${n} × ${k} = ${n * k}.`, [`First find {{1/${d}}}: ${d * k} ÷ ${d} = ${k}.`, `I need ${n} of those parts.`, `${n} × ${k} = ${n * k}.`]);
    }
    const kind = rng.pick(['whole', 'nonunit-whole', 'measure']);
    if (kind === 'whole') { const d = rng.pick([3, 4, 5, 6, 8]), k = rng.int(3, 12); return typed(`{{1/${d}}} of a number is ${k}. What is the number?`, d * k, `If one part is ${k}, all ${d} parts are ${d} × ${k} = ${d * k}.`, [`The whole has ${d} equal parts.`, `Each part is ${k}.`, `${d} × ${k} = ${d * k}.`]); }
    if (kind === 'nonunit-whole') { const d = rng.pick([4, 5, 8]), n = rng.int(2, d - 1), k = rng.int(2, 9); return typed(`{{${n}/${d}}} of a number is ${n * k}. What is the number?`, d * k, `${n} parts make ${n * k}, so one part is ${k}, and ${d} parts make ${d * k}.`, [`${n} parts = ${n * k}, so 1 part = ${n * k} ÷ ${n} = ${k}.`, `The whole is ${d} parts.`, `${d} × ${k} = ${d * k}.`]); }
    const [what, total, unit] = rng.pick([['1 hour', 60, 'minutes'], ['£1', 100, 'pence'], ['1 metre', 100, 'centimetres']]);
    const d = rng.pick([2, 4, 5, 10].filter((x) => total % x === 0)), n = rng.int(1, d - 1);
    return typed(`How many ${unit} are in {{${n}/${d}}} of ${what}?`, (total * n) / d, `${what} = ${total} ${unit}. {{1/${d}}} is ${total / d}, so {{${n}/${d}}} is ${(total * n) / d}.`, [`${what} is ${total} ${unit}.`, `{{1/${d}}} of ${total} = ${total / d}.`, `${n} × ${total / d} = ${(total * n) / d}.`]);
  },

  y3FracCalc(level, rng) {
    if (level === 1) {
      if (rng.chance(0.5)) { const d = rng.int(5, 12), n1 = rng.int(1, d - 3), n2 = rng.int(1, d - 1 - n1); return typed(`{{${n1}/${d}}} + {{${n2}/${d}}} =`, `${n1 + n2}/${d}`, `The parts are the same size (${d}ths), so add the tops: ${n1} + ${n2} = ${n1 + n2}. {{${n1 + n2}/${d}}}.`, ['The denominators are the same.', `Add the numerators: ${n1} + ${n2} = ${n1 + n2}.`, `The denominator stays ${d}: {{${n1 + n2}/${d}}}.`]); }
      const k = rng.pick([2, 3, 4, 5]); const [n, d] = rng.pick([[1, 2], [1, 4], [1, 3], [3, 4]].filter(([, dd]) => dd * k <= 16));
      return typed(`{{${n}/${d}}} = {{?/${d * k}}}`, n * k, `The bottom was multiplied by ${k}, so the top is too: ${n} × ${k} = ${n * k}.`, [`${d} × ${k} = ${d * k}.`, `Do the same to the top: ${n} × ${k} = ${n * k}.`, `{{${n}/${d}}} = {{${n * k}/${d * k}}}.`]);
    }
    if (level === 2) {
      const kind = rng.pick(['sub', 'compare-same', 'compare-unit']);
      if (kind === 'sub') { const d = rng.int(5, 12), n1 = rng.int(3, d - 1), n2 = rng.int(1, n1 - 1); return typed(`{{${n1}/${d}}} − {{${n2}/${d}}} =`, `${n1 - n2}/${d}`, `Same denominators: take away the tops. ${n1} − ${n2} = ${n1 - n2}, so {{${n1 - n2}/${d}}}.`, ['The parts are the same size.', `${n1} − ${n2} = ${n1 - n2}.`, `{{${n1 - n2}/${d}}}.`]); }
      if (kind === 'compare-same') { const d = rng.int(5, 12); let a, b; do { a = rng.int(1, d - 1); b = rng.int(1, d - 1); } while (a === b); return choice(`Which fraction is greater?`, `{{${Math.max(a, b)}/${d}}}`, [`{{${Math.min(a, b)}/${d}}}`], rng, { explain: `The parts are the same size, so more parts is more: {{${Math.max(a, b)}/${d}}}.`, steps: ['Both are cut into the same size pieces.', `${Math.max(a, b)} pieces is more than ${Math.min(a, b)}.`, `{{${Math.max(a, b)}/${d}}} is greater.`] }); }
      let a, b; do { a = rng.int(2, 10); b = rng.int(2, 10); } while (a === b);
      return choice('Which fraction is greater?', `{{1/${Math.min(a, b)}}}`, [`{{1/${Math.max(a, b)}}}`], rng, { explain: `Cutting into fewer pieces makes each piece bigger, so {{1/${Math.min(a, b)}}} is greater.`, steps: ['Both fractions are one piece.', `Sharing a pizza between ${Math.min(a, b)} gives bigger slices than sharing between ${Math.max(a, b)}.`, `{{1/${Math.min(a, b)}}} > {{1/${Math.max(a, b)}}}.`] });
    }
    const kind = rng.pick(['whole', 'equiv', 'order']);
    if (kind === 'whole') { const d = rng.int(4, 10), n1 = rng.int(1, d - 1); return typed(`{{${n1}/${d}}} + {{${d - n1}/${d}}} =`, 1, `${n1} + ${d - n1} = ${d}, and {{${d}/${d}}} is one whole: 1.`, [`Add the tops: ${n1} + ${d - n1} = ${d}.`, `{{${d}/${d}}} means all ${d} parts.`, 'That is 1 whole.']); }
    if (kind === 'equiv') { const [n, d] = rng.pick([[2, 3], [3, 4], [2, 5], [3, 5], [5, 6]]), k = rng.int(2, 4); return typed(`{{${n}/${d}}} = {{?/${d * k}}}`, n * k, `${d} × ${k} = ${d * k}, so ${n} × ${k} = ${n * k}.`, [`The denominator was multiplied by ${k}.`, `Multiply the numerator by ${k} too.`, `${n * k}.`]); }
    const ds = rng.shuffle([2, 3, 4, 5, 6, 8, 10]).slice(0, 3), small = rng.chance(0.5);
    const right = small ? Math.max(...ds) : Math.min(...ds);
    return choice(`Which is the ${small ? 'smallest' : 'greatest'}: ${ds.map((d) => `{{1/${d}}}`).join(', ')}?`, `{{1/${right}}}`, ds.filter((d) => d !== right).map((d) => `{{1/${d}}}`), rng, {
      explain: `With unit fractions, the bigger the denominator, the smaller the piece. {{1/${right}}} is the ${small ? 'smallest' : 'greatest'}.`, steps: ['All of these are one piece of a whole.', 'More pieces means smaller pieces.', `{{1/${right}}} is the ${small ? 'smallest' : 'greatest'}.`],
    });
  },

  y3Measure(level, rng) {
    if (level === 1) {
      const [from, to, f] = rng.pick([['m', 'cm', 100], ['cm', 'mm', 10], ['kg', 'g', 1000], ['l', 'ml', 1000]]), k = rng.int(2, 9);
      return typed(`${k} ${from} = ? ${to}`, k * f, `1 ${from} = ${f} ${to}, so ${k} ${from} = ${k * f} ${to}.`, [`1 ${from} is ${f} ${to}.`, `${k} lots of ${f}.`, `${k * f} ${to}.`], { unit: to });
    }
    if (level === 2) {
      const kind = rng.pick(['m', 'kg', 'mm', 'add']);
      if (kind === 'm') { const m = rng.int(1, 5), c = rng.int(5, 95); return typed(`${m} m ${c} cm = ? cm`, m * 100 + c, `${m} m = ${m * 100} cm, plus ${c} cm: ${m * 100 + c} cm.`, [`1 m = 100 cm.`, `${m} m = ${m * 100} cm.`, `${m * 100} + ${c} = ${m * 100 + c} cm.`], { unit: 'cm' }); }
      if (kind === 'kg') { const k = rng.int(1, 4), g = rng.int(1, 19) * 50; return typed(`${k} kg ${g} g = ? g`, k * 1000 + g, `${k} kg = ${k * 1000} g, plus ${g} g: ${k * 1000 + g} g.`, ['1 kg = 1000 g.', `${k} kg = ${k * 1000} g.`, `${k * 1000} + ${g} = ${k * 1000 + g} g.`], { unit: 'g' }); }
      if (kind === 'mm') { const c = rng.int(2, 15), m = rng.int(1, 9); return typed(`A beetle is ${c} cm ${m} mm long. How long is it in millimetres?`, c * 10 + m, `${c} cm = ${c * 10} mm, plus ${m} mm: ${c * 10 + m} mm.`, ['1 cm = 10 mm.', `${c} cm = ${c * 10} mm.`, `${c * 10} + ${m} = ${c * 10 + m} mm.`], { unit: 'mm' }); }
      const a = rng.int(4, 20) * 25, b = rng.int(4, 40 - a / 25) * 25;
      return typed(`Rosa pours ${a} ml of oil into an engine, then ${b} ml more. How much is that altogether?`, a + b, `${a} + ${b} = ${a + b} ml.`, ['Both amounts are in ml, so I just add.', `${a} + ${b}.`, `${a + b} ml.`], { unit: 'ml' });
    }
    const kind = rng.pick(['left', 'compare', 'km', 'bags']);
    if (kind === 'left') { const L = rng.int(1, 3), out = rng.int(1, L * 4 - 1) * 250; return typed(`A bottle holds ${L} litre${L > 1 ? 's' : ''} of water. ${rng.pick(RACERS)} drinks ${out} ml. How many millilitres are left?`, L * 1000 - out, `${L} l = ${L * 1000} ml. ${L * 1000} − ${out} = ${L * 1000 - out} ml.`, [`Change litres to millilitres: ${L * 1000} ml.`, `${L * 1000} − ${out}.`, `${L * 1000 - out} ml.`], { unit: 'ml' }); }
    if (kind === 'compare') {
      const m = rng.int(1, 3), c = rng.int(1, 9) * 5, other = m * 100 + c + rng.pick([-1, 1]) * rng.int(2, 9) * 10;
      const first = `${m} m ${c} cm`, a = m * 100 + c;
      return choice(`Which is longer: ${first} or ${other} cm?`, a > other ? first : `${other} cm`, [a > other ? `${other} cm` : first], rng, { explain: `${first} = ${a} cm, and ${a} ${a > other ? '>' : '<'} ${other}.`, steps: ['Change both to the same unit.', `${first} = ${a} cm.`, `${a} cm and ${other} cm: ${Math.max(a, other)} cm is longer.`] });
    }
    if (kind === 'km') { const k = rng.int(2, 9); return typed(`A race is ${k} km long. How many metres is that?`, k * 1000, `1 km = 1000 m, so ${k} km = ${k * 1000} m.`, ['Kilo means a thousand.', '1 km = 1000 m.', `${k} × 1000 = ${k * 1000} m.`], { unit: 'm' }); }
    const n = rng.int(3, 6), g = rng.pick([150, 200, 250, 300]);
    return typed(`A space snack weighs ${g} g. How much do ${n} snacks weigh, in grams?`, n * g, `${n} × ${g} = ${n * g} g.`, [`One weighs ${g} g.`, `${n} × ${g}.`, `${n * g} g${n * g >= 1000 ? ` (that is more than 1 kg)` : ''}.`], { unit: 'g' });
  },

  y3Money(level, rng) {
    if (level === 1) {
      if (rng.chance(0.5)) { const p = rng.int(1, 9), c = rng.int(5, 95); return typed(`How many pence is £${p} and ${c}p?`, p * 100 + c, `£1 = 100p, so £${p} = ${p * 100}p. ${p * 100} + ${c} = ${p * 100 + c}p.`, ['£1 = 100p.', `£${p} = ${p * 100}p.`, `${p * 100} + ${c} = ${p * 100 + c}p.`], { unit: 'p' }); }
      const a = rng.int(15, 85), b = rng.int(10, 95 - a);
      return typed(`A sticker costs ${a}p and a badge costs ${b}p. How much is that altogether, in pence?`, a + b, `${a} + ${b} = ${a + b}p.`, ['I add the two prices.', `${a} + ${b}.`, `${a + b}p.`], { unit: 'p' });
    }
    if (level === 2) {
      if (rng.chance(0.5)) { const pay = rng.pick([200, 500, 1000]), cost = rng.int(20, pay / 5 - 2) * 5; return typed(`A model racing car costs ${money(cost)}. You pay with ${money(pay)}. How much change do you get, in pence?`, pay - cost, `${pay}p − ${cost}p = ${pay - cost}p (${money(pay - cost)}).`, [`${money(pay)} = ${pay}p and ${money(cost)} = ${cost}p.`, `Count on from ${cost} to ${pay}.`, `${pay - cost}p.`], { unit: 'p' }); }
      const a = rng.int(21, 79) * 5, b = rng.int(21, 79) * 5;
      return typed(`A space poster costs ${money(a)} and a rocket kit costs ${money(b)}. How much do they cost altogether, in pence?`, a + b, `${a}p + ${b}p = ${a + b}p (${money(a + b)}).`, [`Change to pence: ${a}p and ${b}p.`, `${a} + ${b}.`, `${a + b}p = ${money(a + b)}.`], { unit: 'p' });
    }
    if (rng.chance(0.5)) {
      const n = rng.int(2, 5), c = rng.int(5, 19) * 5, pay = Math.ceil((n * c + 1) / 100) * 100;
      return typed(`${n} race tickets cost ${money(c)} each. You pay with ${money(pay)}. How much change do you get, in pence?`, pay - n * c, `${n} × ${c}p = ${n * c}p. ${pay} − ${n * c} = ${pay - n * c}p.`, [`First the total: ${n} × ${c}p = ${n * c}p.`, `Then the change from ${pay}p.`, `${pay} − ${n * c} = ${pay - n * c}p.`], { unit: 'p' });
    }
    const k = rng.pick([2, 4, 5]), each = rng.int(15, 60) * 5, total = k * each;
    return typed(`${k} friends share ${money(total)} equally. How many pence does each friend get?`, each, `${money(total)} = ${total}p. ${total} ÷ ${k} = ${each}p.`, [`Change to pence: ${total}p.`, `Share between ${k}: ${total} ÷ ${k}.`, `${each}p each.`], { unit: 'p' });
  },

  y3Time(level, rng) {
    const h = rng.int(1, 11);
    if (level === 1) {
      if (rng.chance(0.7)) {
        let m; do m = rng.int(1, 11) * 5; while ([15, 30, 45].includes(m));
        const right = timeWords(h, m);
        return choice('What time does the clock show?', right, [timeWords(h, (m + 5) % 60 || 10), timeWords((h % 12) + 1, m), timeWords(h, 60 - m === m ? 25 : 60 - m)], rng, { explain: `The short hand is just past ${h} and the long hand is on ${m / 5}, which means ${m} minutes past: ${right}.`, steps: ['The short hand shows the hour.', `The long hand points to ${m / 5}: count in 5s to get ${m} minutes past.`, right], diagram: { type: 'clock', h, m } });
      }
      const morning = rng.chance(0.5), hh = morning ? rng.int(6, 11) : rng.int(1, 8);
      return choice(`${morning ? 'Breakfast' : 'Football practice'} is at ${hh}:${pad(rng.pick([0, 15, 30, 45]))} in the ${morning ? 'morning' : 'afternoon'}. Is that a.m. or p.m.?`, morning ? 'a.m.' : 'p.m.', [morning ? 'p.m.' : 'a.m.'], rng, { explain: 'a.m. is from midnight to midday; p.m. is from midday to midnight.', steps: ['a.m. means before midday.', 'p.m. means after midday.', `${morning ? 'Morning' : 'Afternoon'}, so ${morning ? 'a.m.' : 'p.m.'}`] });
    }
    if (level === 2) {
      if (rng.chance(0.5)) {
        let m; do m = rng.int(2, 58); while (m % 5 === 0);
        const right = timeWords(h, m);
        return choice('What time does the clock show, to the nearest minute?', right, [timeWords(h, m < 30 ? m + 5 : m - 5), timeWords((h % 12) + 1, m), timeWords(h, 60 - m)], rng, { explain: `Count in 5s to the last numbered mark, then count on in 1s: ${right}.`, steps: ['The long hand is between two numbers.', 'I count in 5s, then on in single minutes.', right], diagram: { type: 'clock', h, m } });
      }
      const pm = rng.chance(0.6), m = rng.pick([5, 10, 20, 25, 35, 40, 50, 55]), h24 = pm ? h + 12 : h;
      const right = `${pad(h24)}:${pad(m)}`;
      return choice(`What is ${h}:${pad(m)} ${pm ? 'p.m.' : 'a.m.'} in 24-hour time?`, right, [`${pad(pm ? h : h + 12)}:${pad(m)}`, `${pad(h24 === 23 ? 21 : h24 + 1)}:${pad(m)}`, `${pad(h24)}:${pad(60 - m)}`], rng, { explain: pm ? `For p.m. times, add 12 to the hour: ${h} + 12 = ${h24}, so ${right}.` : `Morning times keep the same hour, with a 0 in front: ${right}.`, steps: ['24-hour clocks count the hours from 0 to 23.', pm ? `After midday, add 12: ${h} + 12 = ${h24}.` : 'Before midday, the hour stays the same.', right] });
    }
    const kind = rng.pick(['duration', 'finish', 'days']);
    if (kind === 'duration') {
      const sh = rng.int(9, 16), sm = rng.int(1, 11) * 5, dur = rng.int(5, 14) * 5, tot = sh * 60 + sm + dur;
      return typed(`The space film starts at ${pad(sh)}:${pad(sm)} and ends at ${pad(Math.floor(tot / 60))}:${pad(tot % 60)}. How many minutes long is it?`, dur, `Count on from ${pad(sh)}:${pad(sm)} to ${pad(Math.floor(tot / 60))}:${pad(tot % 60)}: ${dur} minutes.`, [`From ${pad(sh)}:${pad(sm)} to the next o’clock is ${60 - sm} minutes.`, sm + dur > 60 ? `Then on to ${pad(Math.floor(tot / 60))}:${pad(tot % 60)} is ${tot % 60} more.` : 'It ends before the next o’clock, so I count on directly.', `${dur} minutes.`]);
    }
    if (kind === 'finish') {
      const sh = rng.int(9, 15), sm = rng.pick([15, 30, 40, 45, 50]), dur = rng.pick([25, 35, 40, 50, 55]), tot = sh * 60 + sm + dur;
      const right = `${pad(Math.floor(tot / 60))}:${pad(tot % 60)}`;
      return choice(`The Grand Prix starts at ${pad(sh)}:${pad(sm)} and lasts ${dur} minutes. What time does it finish?`, right, [`${pad(sh)}:${pad((sm + dur) % 60)}`, `${pad(Math.floor(tot / 60) + 1)}:${pad(tot % 60)}`, `${pad(Math.floor(tot / 60))}:${pad((tot + 10) % 60)}`], rng, { explain: `${pad(sh)}:${pad(sm)} + ${dur} minutes = ${right}.`, steps: [`Start at ${pad(sh)}:${pad(sm)}.`, `Count on ${dur} minutes, crossing the hour if needed.`, right] });
    }
    const MONTHS = [['January', 31], ['April', 30], ['June', 30], ['July', 31], ['August', 31], ['September', 30], ['October', 31], ['December', 31]];
    const [a, b] = rng.shuffle(MONTHS).slice(0, 2);
    return typed(`How many days are there in ${a[0]} and ${b[0]} together?`, a[1] + b[1], `${a[0]} has ${a[1]} days and ${b[0]} has ${b[1]}: ${a[1] + b[1]}.`, [`${a[0]}: ${a[1]} days.`, `${b[0]}: ${b[1]} days.`, `${a[1]} + ${b[1]} = ${a[1] + b[1]}.`]);
  },

  y3Angles(level, rng) {
    const angleQ = (prompt, deg) => {
      const right = deg === 90 ? 'a right angle' : deg < 90 ? 'smaller than a right angle' : 'bigger than a right angle';
      return choice(prompt, right, ['a right angle', 'smaller than a right angle', 'bigger than a right angle'], rng, { explain: `Compare it with the corner of a piece of paper (a right angle). This angle is ${right}.`, steps: ['A right angle is a square corner, like the corner of a book.', `This angle is ${deg === 90 ? 'exactly a square corner' : deg < 90 ? 'narrower than a square corner' : 'wider than a square corner'}.`, `So it is ${right}.`], diagram: { type: 'angle', deg } });
    };
    if (level === 1) {
      if (rng.chance(0.5)) { const [turn, n] = rng.pick([['a half turn', 2], ['a full turn', 4], ['a three-quarter turn', 3], ['a quarter turn', 1]]); return typed(`How many right angles make ${turn}?`, n, `A quarter turn is one right angle, so ${turn} is ${n}.`, ['A quarter turn = 1 right angle.', `${turn[2].toUpperCase() + turn.slice(3)} is ${n} quarter turn${n > 1 ? 's' : ''}.`, `${n} right angle${n > 1 ? 's' : ''}.`]); }
      return angleQ('Is this angle a right angle, smaller than a right angle, or bigger?', rng.pick([30, 45, 60, 90, 90, 120, 135, 150]));
    }
    if (level === 2) {
      const kind = rng.pick(['clock', 'compass', 'angle']);
      if (kind === 'angle') return angleQ('Look at the angle. How does it compare with a right angle?', rng.pick([40, 70, 80, 100, 110, 160]));
      if (kind === 'clock') {
        const [hh, right] = rng.pick([[3, 'a right angle'], [9, 'a right angle'], [1, 'smaller than a right angle'], [2, 'smaller than a right angle'], [4, 'bigger than a right angle'], [5, 'bigger than a right angle']]);
        return choice(`At ${hh} o’clock, what angle do the clock hands make?`, right, ['a right angle', 'smaller than a right angle', 'bigger than a right angle'], rng, { explain: `At 3 and 9 o’clock the hands make a right angle. At ${hh} o’clock the angle is ${right}.`, steps: ['The long hand points at 12.', `The short hand points at ${hh}.`, `3 o’clock is a right angle, so ${hh} o’clock is ${right}.`], diagram: { type: 'clock', h: hh, m: 0 } });
      }
      const DIRS = ['north', 'east', 'south', 'west'], s = rng.int(0, 3), n = rng.int(1, 3), cw = rng.chance(0.5), end = DIRS[(s + (cw ? n : -n) + 8) % 4], who = rng.pick(['Bleep', 'Turbo', '{hero}']);
      return choice(`${who} faces ${DIRS[s]} and turns ${n} right angle${n > 1 ? 's' : ''} ${cw ? 'clockwise' : 'anticlockwise'}. Which way is ${who} facing now?`, end, DIRS.filter((d) => d !== end), rng, { explain: `Each right angle is a quarter turn: ${DIRS[s]} → ${end}.`, steps: ['Clockwise: north, east, south, west.', `${n} quarter turn${n > 1 ? 's' : ''} ${cw ? 'clockwise' : 'anticlockwise'} from ${DIRS[s]}.`, `${who} faces ${end}.`] });
    }
    const kind = rng.pick(['degrees', 'minute', 'compass8']);
    if (kind === 'degrees') { const [turn, d] = rng.pick([['a half turn', 180], ['a full turn', 360], ['a three-quarter turn', 270], ['two right angles', 180]]); return typed(`A right angle is 90 degrees. How many degrees are in ${turn}?`, d, `${turn[0] === 't' ? 'Two right angles' : turn[2].toUpperCase() + turn.slice(3)} is ${d / 90} × 90 = ${d} degrees.`, ['A right angle is 90°.', `${turn} is ${d / 90} right angle${d / 90 > 1 ? 's' : ''}.`, `${d / 90} × 90 = ${d}°.`]); }
    if (kind === 'minute') { const [to, n] = rng.pick([[3, 1], [6, 2], [9, 3]]); return typed(`The minute hand turns clockwise from 12 to ${to}. How many right angles has it turned through?`, n, `12 to 3 is one right angle (a quarter turn), so 12 to ${to} is ${n}.`, ['12 to 3 is a quarter turn.', `12 to ${to} is ${n} quarter turn${n > 1 ? 's' : ''}.`, `${n} right angle${n > 1 ? 's' : ''}.`]); }
    const D8 = ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'], s = rng.int(0, 7), half = rng.chance(0.5), cw = rng.chance(0.5);
    const step = half ? 4 : 2, end = D8[(s + (cw ? step : -step) + 16) % 8];
    return choice(`On an 8-point compass, Captain Nova faces ${D8[s]} and makes ${half ? 'a half turn' : 'a quarter turn ' + (cw ? 'clockwise' : 'anticlockwise')}. Which way does she face now?`, end, rng.shuffle(D8.filter((d) => d !== end)).slice(0, 3), rng, { explain: `${half ? 'A half turn faces the opposite way' : 'A quarter turn moves two points round the 8-point compass'}: ${D8[s]} → ${end}.`, steps: ['The 8-point compass adds north-east, south-east, south-west and north-west.', half ? 'A half turn is 4 points round.' : `A quarter turn is 2 points ${cw ? 'clockwise' : 'anticlockwise'}.`, end] });
  },

  y3Stats(level, rng) {
    const sets = [[['Mars', 'Jupiter', 'Saturn', 'Venus'], 'Favourite planet', 'votes', 'get'], [['Turbo', 'Blaze', 'Rosa', 'Zoom'], 'Race points', 'points', 'score'], [['Bleep', 'Zip', 'Zap', 'Pixel'], 'Crystals collected', 'crystals', 'collect']];
    const [cats, title, unit, verb] = rng.pick(sets);
    const ask = (c) => `How many ${unit} did ${c} ${verb}?`;
    if (level < 3 || rng.chance(0.5)) {
      const step = level === 1 ? rng.pick([2, 5]) : level === 2 ? rng.pick([5, 10]) : 10;
      const vals = cats.map(() => rng.int(1, 9) * step + (level === 3 ? 5 : 0));
      if (new Set(vals).size < 4) return Y3_GENERATORS.y3Stats(level, rng);
      const dg = { type: 'bar', title, cats: cats.map((c, i) => ({ label: c, v: vals[i] })), step, ylabel: unit };
      if (level === 1) { const i = rng.int(0, 3); return typed(ask(cats[i]), vals[i], `Read across from the top of the bar: ${vals[i]}.`, ['Find the bar.', `The scale goes up in ${step}s.`, `${vals[i]}.`], { diagram: dg }); }
      const i = rng.int(0, 3); let j; do j = rng.int(0, 3); while (j === i);
      if (level === 3 || rng.chance(0.5)) { const [a, b] = vals[i] > vals[j] ? [i, j] : [j, i]; return typed(`How many more ${unit} did ${cats[a]} ${verb} than ${cats[b]}?`, vals[a] - vals[b], `${vals[a]} − ${vals[b]} = ${vals[a] - vals[b]}.`, [`${cats[a]}: ${vals[a]}${level === 3 ? ' (halfway between two lines)' : ''}.`, `${cats[b]}: ${vals[b]}.`, `${vals[a]} − ${vals[b]} = ${vals[a] - vals[b]}.`], { diagram: dg }); }
      return typed(`How many ${unit} did ${cats[i]} and ${cats[j]} ${verb} altogether?`, vals[i] + vals[j], `${vals[i]} + ${vals[j]} = ${vals[i] + vals[j]}.`, [`${cats[i]}: ${vals[i]}.`, `${cats[j]}: ${vals[j]}.`, `${vals[i]} + ${vals[j]} = ${vals[i] + vals[j]}.`], { diagram: dg });
    }
    const key = 4, vals = cats.map(() => rng.int(2, 10) * 2);
    if (new Set(vals).size < 3) return Y3_GENERATORS.y3Stats(level, rng);
    const dg = { type: 'pictogram', title, rows: cats.map((c, i) => ({ label: c, n: vals[i] })), key, unit };
    const total = vals.reduce((x, y) => x + y, 0);
    return typed(`One star stands for ${key} ${unit}. How many ${unit} altogether?`, total, `Each whole star is ${key} and each half star is ${key / 2}: ${vals.join(' + ')} = ${total}.`, [`A whole star = ${key}, a half star = ${key / 2}.`, `The rows are ${vals.join(', ')}.`, `Total: ${total}.`], { diagram: dg });
  },

  y3Problems(level, rng) {
    const who = rng.pick(RACERS);
    if (level === 1) {
      const a = rng.int(120, 480), b = rng.int(15, 99), c = rng.int(10, 90);
      return typed(`${who} has ${a} race points, wins ${b} more, then loses ${c} for a crash. How many points now?`, a + b - c, `${a} + ${b} = ${a + b}, then ${a + b} − ${c} = ${a + b - c}.`, [`First add: ${a} + ${b} = ${a + b}.`, `Then take away: ${a + b} − ${c}.`, `${a + b - c} points.`]);
    }
    if (level === 2) {
      if (rng.chance(0.5)) { const g = rng.int(3, 6), n = rng.pick([4, 8, 3]), x = rng.int(3, 9); return typed(`{hero} rescues ${g} groups of ${n} people from a flood, then ${x} more people. How many people are rescued altogether?`, g * n + x, `${g} × ${n} = ${g * n}, plus ${x} = ${g * n + x}.`, [`First the groups: ${g} × ${n} = ${g * n}.`, `Then add the ${x} more.`, `${g * n} + ${x} = ${g * n + x}.`]); }
      const b = rng.int(3, 5), n = rng.int(12, 25), used = rng.int(5, b * n - 5);
      return typed(`Rosa has ${b} boxes with ${n} bolts in each. She uses ${used} bolts. How many bolts are left?`, b * n - used, `${b} × ${n} = ${b * n}, then ${b * n} − ${used} = ${b * n - used}.`, [`Total bolts: ${b} × ${n} = ${b * n}.`, `Take away the ${used} used.`, `${b * n - used} left.`]);
    }
    if (rng.chance(0.5)) {
      const d = rng.pick([3, 4, 5]), each = rng.int(12, 19), give = rng.int(2, 9);
      return typed(`Captain Nova has ${d * each} space crystals. She shares them equally between ${d} droids. Each droid then gives ${give} away. How many does each droid have now?`, each - give, `${d * each} ÷ ${d} = ${each}, then ${each} − ${give} = ${each - give}.`, [`Share: ${d * each} ÷ ${d} = ${each} each.`, `Each gives away ${give}.`, `${each} − ${give} = ${each - give}.`]);
    }
    const n = rng.int(3, 8), price = rng.int(3, 9), pay = Math.ceil((n * price + 1) / 10) * 10;
    return typed(`Grand Prix tickets cost £${price} each. Turbo buys ${n} tickets and pays with £${pay}. How many pounds change does he get?`, pay - n * price, `${n} × £${price} = £${n * price}. £${pay} − £${n * price} = £${pay - n * price}.`, [`Cost: ${n} × ${price} = ${n * price} pounds.`, `Change from £${pay}.`, `${pay} − ${n * price} = ${pay - n * price} pounds.`]);
  },

  // --- Year 4 tasters (stretch) ---------------------------------------------------------
  y3TablesY4(level, rng) {
    const a = level === 1 ? rng.pick([6, 11]) : level === 2 ? rng.pick([7, 9, 12]) : rng.pick([6, 7, 9, 11, 12]), b = rng.int(2, 12);
    if (level === 3 && rng.chance(0.5)) return typed(`${a} × ? = ${a * b}`, b, `${a * b} ÷ ${a} = ${b}.`, ['Use the inverse.', `${a * b} ÷ ${a}.`, `${b}.`]);
    const tip = { 6: `6 × ${b} is double 3 × ${b} (${3 * b}).`, 11: `For 11s up to 9, repeat the digit; then 10 × ${b} + ${b}.`, 7: `7 × ${b} = 5 × ${b} + 2 × ${b} = ${5 * b} + ${2 * b}.`, 9: `9 × ${b} = 10 × ${b} − ${b} = ${10 * b} − ${b}.`, 12: `12 × ${b} = 10 × ${b} + 2 × ${b} = ${10 * b} + ${2 * b}.` }[a];
    if (rng.chance(0.5)) return typed(`${a * b} ÷ ${a} =`, b, `${b} × ${a} = ${a * b}, so ${a * b} ÷ ${a} = ${b}.`, ['Division undoes multiplication.', tip, `${b}.`]);
    return typed(`${a} × ${b} =`, a * b, `${a} × ${b} = ${a * b}. ${tip}`, [`I use a fact I know.`, tip, `${a * b}.`]);
  },

  y3Negative(level, rng) {
    if (level === 1) {
      const s = rng.int(1, 3), seq = Array.from({ length: 4 }, (_, i) => s - i), v = s - 4;
      return typed(`Count back in ones: ${seq.map(neg).join(', ')}, ?`, v, `Below 0 the numbers are negative: after ${neg(seq[3])} comes ${neg(v)}.`, ['Each step is 1 less.', `${neg(seq[3])} − 1 = ${neg(v)}.`, 'Negative numbers are less than zero.'], { diagram: { type: 'numline', min: -5, max: 5, step: 1, labels: [-5, 0, 5], mark: v } });
    }
    if (level === 2) {
      const t = rng.int(1, 6), drop = rng.int(t + 1, t + 6), v = t - drop;
      return typed(`At night the temperature on Mars Base is ${t}°C. It falls by ${drop} degrees. What is the temperature now?`, v, `${t} − ${drop}: ${t} down to 0, then ${drop - t} more below zero: ${neg(v)}°C.`, [`Fall ${t} to get to 0.`, `Then fall ${drop - t} more.`, `${neg(v)}°C.`], { unit: '°C', diagram: { type: 'numline', min: -10, max: 10, step: 1, labels: [-10, -5, 0, 5, 10], mark: v } });
    }
    const a = -rng.int(2, 9), b = rng.int(1, 9);
    if (rng.chance(0.5)) return typed(`What is the difference between ${neg(a)}°C and ${b}°C, in degrees?`, b - a, `From ${neg(a)} up to 0 is ${-a}, and from 0 to ${b} is ${b}: ${-a} + ${b} = ${b - a} degrees.`, [`${neg(a)} up to 0: ${-a} degrees.`, `0 up to ${b}: ${b} degrees.`, `${-a} + ${b} = ${b - a}.`]);
    const rise = rng.int(1, -a - 1), v = a + rise;
    return typed(`The temperature is ${neg(a)}°C. It rises by ${rise} degree${rise > 1 ? 's' : ''}. What is it now?`, v, `${neg(a)} + ${rise} = ${neg(v)}°C (still below zero).`, [`Start at ${neg(a)}.`, `Count up ${rise}.`, `${neg(v)}°C.`], { unit: '°C' });
  },

  y3Decimals(level, rng) {
    if (level === 1) {
      const n = rng.int(1, 9);
      if (rng.chance(0.5)) return typed(`Write {{${n}/10}} as a decimal.`, `0.${n}`, `${n} tenths is 0.${n}: the first digit after the decimal point shows tenths.`, ['The first place after the decimal point is tenths.', `${n} tenths: put ${n} in the tenths place.`, `0.${n}.`]);
      return typed(`Write 0.${n} as a fraction: {{?/10}}`, n, `0.${n} means ${n} tenths: {{${n}/10}}.`, ['The digit after the point is tenths.', `0.${n} is ${n} tenths.`, `{{${n}/10}}.`]);
    }
    if (level === 2) {
      if (rng.chance(0.5)) { const n = rng.int(1, 9); return typed(`${n} ÷ 10 =`, `0.${n}`, `Dividing by 10 moves the digit one place to the right: ${n} → 0.${n}.`, ['÷ 10 makes a number ten times smaller.', `${n} ones become ${n} tenths.`, `0.${n}.`]); }
      const a = rng.int(1, 7), b = rng.int(1, 9 - a); return typed(`0.${a} + 0.${b} =`, `0.${a + b}`, `${a} tenths + ${b} tenths = ${a + b} tenths = 0.${a + b}.`, [`0.${a} is ${a} tenths and 0.${b} is ${b} tenths.`, `${a} + ${b} = ${a + b} tenths.`, `0.${a + b}.`]);
    }
    const n = rng.int(11, 99);
    if (n % 10 === 0) return Y3_GENERATORS.y3Decimals(level, rng);
    const s = `0.${pad(n)}`;
    if (rng.chance(0.5)) return typed(`Write {{${n}/100}} as a decimal.`, s, `${n} hundredths is ${s}.`, ['The second place after the point is hundredths.', `${n} hundredths = ${Math.floor(n / 10)} tenths and ${n % 10} hundredths.`, `${s}.`]);
    return typed(`${n} ÷ 100 =`, s, `Dividing by 100 moves the digits two places to the right: ${n} → ${s}.`, ['÷ 100 makes a number a hundred times smaller.', 'The digits move two places to the right.', `${s}.`]);
  },

  y3Area(level, rng) {
    if (level === 1) {
      const rows = rng.int(2, 5), cols = rng.int(2, 6), cells = [];
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) cells.push([r, c]);
      return typed('Each square is 1 square centimetre. What is the area of the shape, in square centimetres?', rows * cols, `Count the squares, or multiply: ${rows} rows of ${cols} = ${rows * cols}.`, ['Area is how many squares cover the shape.', `There are ${rows} rows of ${cols} squares.`, `${rows} × ${cols} = ${rows * cols} square centimetres.`], { unit: 'cm²', diagram: { type: 'squares', rows: rows + 1, cols: cols + 1, cells } });
    }
    if (level === 2) {
      const w = rng.int(3, 6), h = rng.int(3, 5), cw = rng.int(1, w - 1), ch = rng.int(1, h - 1), cells = [];
      for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) if (!(r < ch && c >= w - cw)) cells.push([r, c]);
      return typed('Each square is 1 square centimetre. What is the area of this shape?', cells.length, `It is a ${w} × ${h} rectangle (${w * h}) with a ${cw} × ${ch} corner missing (${cw * ch}): ${w * h} − ${cw * ch} = ${cells.length}.`, ['I can count the squares, or use a rectangle.', `The full rectangle would be ${w} × ${h} = ${w * h}.`, `Take away the missing ${cw * ch}: ${cells.length} square centimetres.`], { unit: 'cm²', diagram: { type: 'squares', rows: h + 1, cols: w + 1, cells } });
    }
    const w = rng.int(3, 9), h = rng.int(2, 8);
    if (rng.chance(0.5)) return typed(`A rectangular race-track infield is ${w} m long and ${h} m wide. What is its area, in square metres?`, w * h, `Area of a rectangle = length × width: ${w} × ${h} = ${w * h} m².`, ['Area counts the squares inside.', `${h} rows of ${w} squares.`, `${w} × ${h} = ${w * h} m².`], { unit: 'm²' });
    return typed(`A rectangle has an area of ${w * h} square centimetres. One side is ${w} cm. How long is the other side?`, h, `${w} × ? = ${w * h}, so the other side is ${w * h} ÷ ${w} = ${h} cm.`, ['Area = length × width.', `${w} × ? = ${w * h}.`, `${w * h} ÷ ${w} = ${h} cm.`], { unit: 'cm' });
  },

  y3Rounding(level, rng) {
    const [to, n] = level === 1 ? [10, rng.int(11, 989)] : level === 2 ? [100, rng.int(101, 989)] : [1000, rng.int(1001, 9899)];
    if (n % to === 0) return Y3_GENERATORS.y3Rounding(level, rng);
    const lo = Math.floor(n / to) * to, hi = lo + to, v = n - lo >= to / 2 ? hi : lo;
    const half = n - lo === to / 2;
    return typed(`Round ${n} to the nearest ${to}.`, v, `${n} is between ${lo} and ${hi}. ${half ? `It is exactly halfway, and halfway rounds up: ${v}.` : `It is closer to ${v}.`}`, [`The ${to}s either side are ${lo} and ${hi}.`, `Halfway is ${lo + to / 2}.`, `${n} ${n >= lo + to / 2 ? 'is at or past' : 'is below'} halfway, so it rounds to ${v}.`]);
  },
};
