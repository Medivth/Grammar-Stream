// Maths question generators. Each takes (level 1..3, rng) and returns a question:
// { kind, prompt, numeric | options | target..., explain, steps }.
// `steps` is a first-person worked solution used for worked and faded examples.
// Prompts use {{n/d}} for stacked fractions.

import { Frac, gcd, lcm } from '../core/fraction.js';
import { pic, bar, pvDecimal, fracWall, pctBoxes, pctChangeBar } from './pictures.js';

const tex = (f, opts) => f.toTex(opts);
const neg = (n) => (n < 0 ? `−${-n}` : String(n));
const paren = (n) => (n < 0 ? `(−${-n})` : String(n));
const pv = (n, unit) => `${n} ${unit}${n === 1 ? '' : 's'}`; // 1 ten, 2 tens

/** Integer thousandths -> decimal string ("0.65", "3", "-1.2"). */
function dec(th) {
  const sign = th < 0 ? '−' : '';
  th = Math.abs(th);
  const whole = Math.floor(th / 1000);
  const frac = String(th % 1000).padStart(3, '0').replace(/0+$/, '');
  return sign + (frac ? `${whole}.${frac}` : String(whole));
}
const decPlain = (th) => dec(th).replace('−', '-');

// optional picture: nothing when the diagram could not be drawn
const picIf = (diagram, caption) => (diagram ? pic(diagram, caption) : {});
// p% of amt: 100% is cut into equal boxes, p% of them shaded
function pctBar(p, amt) {
  const N = pctBoxes(p), k = (p * N) / 100;
  return pic(bar([{ parts: N, shaded: k, text: amt / N }], amt), `100% is ${N} equal boxes, so each box is ${100 / N}% = ${amt / N}. ${p}% is ${k} box${k === 1 ? '' : 'es'}: ${(amt * p) / 100}.`);
}
// equivalent fractions on a fraction wall, while the smaller pieces are still big enough to label
const equivWall = (n, d, k) => (d * k <= 16 ? pic(fracWall([[n, d], [n * k, d * k]]), `{{${n}/${d}}} covers the same length as {{${n * k}/${d * k}}}.`) : {});
// a fraction of an amount: d equal boxes of `unit`, n of them shaded
const fracBar = (n, d, unit) => pic(bar([{ parts: d, shaded: n, text: unit }], d * unit), `${d * unit} in ${d} equal boxes: ${unit} in each. {{${n}/${d}}} is ${n === 1 ? 'one box' : `${n} boxes`}: ${n * unit}.`);

function choice(prompt, correctText, wrongs, rng, extra = {}) {
  const opts = rng.shuffle([{ text: correctText, correct: true }, ...wrongs.map((w) => (typeof w === 'string' ? { text: w } : w))]);
  return { kind: 'choice', prompt, options: opts, ...extra };
}

function distinct(rng, n, make) {
  const seen = new Set();
  const out = [];
  let guard = 0;
  while (out.length < n && guard++ < 500) {
    const v = make();
    const key = JSON.stringify(v);
    if (!seen.has(key)) { seen.add(key); out.push(v); }
  }
  return out;
}

export const GENERATORS = {
  placeValueDecimals(level, rng) {
    if (level === 1) {
      // classic misconception: "longer decimals are bigger"
      const a1 = rng.int(3, 9);
      const b1 = rng.int(1, a1 - 1);
      const b2 = rng.int(1, 9);
      const A = a1 * 100, B = b1 * 100 + b2 * 10;
      const [x, y] = rng.chance(0.5) ? [A, B] : [B, A];
      return choice(`Which is larger: ${dec(x)} or ${dec(y)}?`, dec(A), [{ text: dec(B), feedback: `${dec(B)} has more digits, but more digits doesn’t mean bigger. Compare tenths first: ${pv(a1, 'tenth')} beats ${b1} tenth${b1 === 1 ? '' : 's'}.` }], rng, {
        explain: `Compare the tenths digit first. ${dec(A)} has ${pv(a1, 'tenth')} and ${dec(B)} has only ${b1} tenth${b1 === 1 ? '' : 's'}, so ${dec(A)} is larger.`,
        steps: [`I line up the decimal points.`, `I compare the tenths: ${pv(a1, 'tenth')} against ${b1} tenth${b1 === 1 ? '' : 's'}.`, `${a1} is more, so ${dec(A)} is larger, even though ${dec(B)} has more digits.`],
        ...picIf(pvDecimal([x, y], 3), `Line up the decimal points and compare the tenths first: ${a1} tenths beats ${b1}.`),
      });
    }
    if (level === 2) {
      const vals = distinct(rng, 4, () => rng.int(1, 3) * 1000 + rng.pick([rng.int(1, 9) * 100, rng.int(10, 99) * 10, rng.int(100, 999)])).map(Number);
      const whole = Math.floor(vals[0] / 1000);
      const fixed = vals.map((v) => whole * 1000 + (v % 1000));
      const uniq = [...new Set(fixed)];
      if (uniq.length < 4) return GENERATORS.placeValueDecimals(2, rng);
      const max = Math.max(...uniq);
      return choice(`Which number is the largest?`, dec(max), uniq.filter((v) => v !== max).map(dec), rng, {
        explain: `All have ${whole} ${whole === 1 ? 'one' : 'ones'}, so compare tenths, then hundredths, then thousandths. ${dec(max)} is largest.`,
        steps: [`All the numbers have ${whole} ${whole === 1 ? 'one' : 'ones'}, so I look at the tenths.`, `I keep comparing digit by digit, left to right.`, `${dec(max)} wins at the first place where they differ.`],
        ...picIf(pvDecimal(uniq, 3), 'Line up the decimal points, then compare the columns from the left.'),
      });
    }
    const n = rng.pick([rng.int(11, 99) * 10, rng.int(101, 999), rng.int(1, 9) * 100 + rng.int(1, 9)]); // thousandths
    const p = rng.pick([10, 100, 1000]);
    const mul = rng.chance(0.5);
    const result = mul ? n * p : n / p;
    const ans = Number.isInteger(result) ? decPlain(result) : (n / 1000 / p).toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
    const shift = String(p).length - 1;
    return {
      kind: 'typed',
      prompt: `${dec(n)} ${mul ? '×' : '÷'} ${p} = ?`,
      numeric: { value: ans, form: 'any' },
      explain: `${mul ? 'Multiplying' : 'Dividing'} by ${p} moves every digit ${shift} place${shift > 1 ? 's' : ''} to the ${mul ? 'left' : 'right'}. The decimal point stays still.`,
      steps: [`${mul ? 'Multiplying' : 'Dividing'} by ${p} makes the number ${p} times ${mul ? 'bigger' : 'smaller'}.`, `So every digit moves ${shift} place${shift > 1 ? 's' : ''} to the ${mul ? 'left' : 'right'}.`, `${dec(n)} ${mul ? '×' : '÷'} ${p} = ${ans}`],
      // in millionths, so both numbers are whole: n thousandths = n × 1000 millionths
      ...picIf(pvDecimal([n * 1000, mul ? n * 1000 * p : (n * 1000) / p], 6, { shift: mul ? shift : -shift }), `${mul ? '×' : '÷'} ${p}: every digit moves ${shift} place${shift > 1 ? 's' : ''} to the ${mul ? 'left' : 'right'}. The decimal point stays still.`),
    };
  },

  negatives(level, rng) {
    if (level === 1) {
      const start = -rng.int(2, 9);
      const rise = rng.int(3, 12);
      const end = start + rise;
      return {
        kind: 'typed',
        prompt: `At 6 am the temperature is ${neg(start)}°C. By midday it has risen by ${rise} degrees. What is the temperature at midday?`,
        numeric: { value: String(end), form: 'any' },
        explain: end < 0 ? `Count up ${rise} from ${neg(start)}: you stop ${-end} below 0, at ${neg(end)}°C.` : `Count up ${rise} from ${neg(start)}: it takes ${-start} to reach 0, then ${rise + start} more. The answer is ${neg(end)}°C.`,
        steps: end < 0 ? [`I start at ${neg(start)} on a number line.`, `I count up ${rise} steps.`, `I stop before reaching 0, at ${neg(end)}.`] : [`I start at ${neg(start)} on a number line.`, `${-start} steps up takes me to 0.`, `I have ${rise + start} more step${rise + start === 1 ? '' : 's'} to go, so I land on ${neg(end)}.`],
      };
    }
    if (level === 2) {
      let a = rng.int(-12, 12) || -4, b = rng.int(1, 12) * (rng.chance(0.5) ? -1 : 1);
      if (a >= 0 && b > 0) b = -b; // every question involves a negative number
      const op = rng.pick(['+', '−']);
      const r = op === '+' ? a + b : a - b;
      const rule = op === '−' && b < 0 ? `Subtracting a negative is the same as adding: ${neg(a)} − ${paren(b)} = ${neg(a)} + ${-b}.` : op === '+' && b < 0 ? `Adding a negative is the same as subtracting: ${neg(a)} + ${paren(b)} = ${neg(a)} − ${-b}.` : `Use a number line.`;
      return {
        kind: 'typed',
        prompt: `${neg(a)} ${op} ${paren(b)} = ?`,
        numeric: { value: String(r), form: 'any' },
        explain: `${rule} The answer is ${neg(r)}.`,
        steps: [rule, `I start at ${neg(a)} and move ${Math.abs(r - a)} ${r > a ? 'up' : 'down'}.`, `${neg(a)} ${op} ${paren(b)} = ${neg(r)}`],
      };
    }
    let a = rng.int(2, 9) * (rng.chance(0.5) ? -1 : 1), b = rng.int(2, 9) * (rng.chance(0.6) ? -1 : 1);
    if (a > 0 && b > 0) { if (rng.chance(0.5)) a = -a; else b = -b; } // every sign-rule question involves a negative number
    const divide = rng.chance(0.4);
    const prod = a * b;
    const [x, y, r] = divide ? [prod, a, b] : [a, b, prod];
    const sym = divide ? '÷' : '×';
    const sameSign = (x < 0) === (y < 0);
    return {
      kind: 'typed',
      prompt: `${neg(x)} ${sym} ${paren(y)} = ?`,
      numeric: { value: String(r), form: 'any' },
      explain: `${sameSign ? 'Same signs give a positive' : 'Different signs give a negative'}. ${Math.abs(x)} ${sym} ${Math.abs(y)} = ${Math.abs(r)}, so the answer is ${neg(r)}.`,
      steps: [`First I ignore the signs: ${Math.abs(x)} ${sym} ${Math.abs(y)} = ${Math.abs(r)}.`, `The signs are ${sameSign ? 'the same, so the answer is positive' : 'different, so the answer is negative'}.`, `${neg(x)} ${sym} ${paren(y)} = ${neg(r)}`],
    };
  },

  fracCompare(level, rng) {
    let a, b;
    if (level === 1) {
      if (rng.chance(0.5)) {
        const d = rng.int(5, 12); const [n1, n2] = rng.sample([...Array(d - 1).keys()].map((i) => i + 1), 2);
        a = new Frac(n1, d); b = new Frac(n2, d);
      } else {
        const n = rng.int(1, 4); const [d1, d2] = rng.sample([3, 4, 5, 6, 7, 8, 9, 10].filter((d) => d > n), 2);
        a = new Frac(n, d1); b = new Frac(n, d2);
      }
    } else if (level === 2) {
      const d1 = rng.pick([2, 3, 4, 5]); const d2 = d1 * rng.pick([2, 3]);
      a = new Frac(rng.int(1, d1 - 1), d1); b = new Frac(rng.int(1, d2 - 1), d2);
      if (a.eq(b)) b = new Frac(b.n + (b.n + 1 < d2 ? 1 : -1), d2);
    } else {
      const [d1, d2] = rng.sample([3, 4, 5, 7, 8, 9], 2);
      a = new Frac(rng.int(1, d1 - 1), d1); b = new Frac(rng.int(1, d2 - 1), d2);
      if (a.eq(b)) return GENERATORS.fracCompare(level, rng);
    }
    const big = a.cmp(b) > 0 ? a : b, small = big === a ? b : a;
    const L = lcm(a.d, b.d);
    const steps = a.d === b.d
      ? [`The denominators are the same, so the pieces are the same size.`, `More pieces means more: ${big.n} beats ${small.n}.`, `${tex(big)} is larger.`]
      : a.n === b.n
        ? [`The numerators are the same: ${a.n} piece${a.n > 1 ? 's' : ''} each.`, `A smaller denominator means bigger pieces.`, `${tex(big)} is larger.`]
        : [`I rewrite both with the same denominator, ${L}.`, `${tex(a)} = ${tex(new Frac(a.n * (L / a.d), L))} and ${tex(b)} = ${tex(new Frac(b.n * (L / b.d), L))}.`, `So ${tex(big)} is larger.`];
    const wrongFb = small.d > big.d
      ? `Careful: a bigger denominator means smaller pieces, not a bigger fraction.`
      : `Not quite. Compare them using a common denominator of ${L}.`;
    return choice(`Which is larger: ${tex(a)} or ${tex(b)}?`, tex(big), [{ text: tex(small), feedback: wrongFb }, { text: 'They are equal', feedback: `They are not equal. Rewrite both over ${L} to check.` }], rng, {
      explain: steps.join(' '),
      steps,
      ...(a.d !== b.d ? pic(fracWall([[a.n, a.d], [b.n, b.d]]), `The shaded ${tex(big)} is longer than the shaded ${tex(small)}.`) : {}),
    });
  },

  fracNumberLine(level, rng) {
    let f, min = 0, max = 1;
    if (level === 1) { const d = rng.pick([2, 3, 4, 5, 8, 10]); f = new Frac(rng.int(1, d - 1), d); }
    else if (level === 2) { max = 2; const d = rng.pick([2, 3, 4, 5]); f = new Frac(rng.int(d + 1, 2 * d - 1), d); }
    else { max = 3; const d = rng.pick([2, 4, 3]); f = new Frac(rng.int(1, 2) * d + rng.int(1, d - 1), d); }
    const label = level === 3 ? tex(f, { mixed: true }) : tex(f);
    return {
      kind: 'numberline',
      prompt: `Put ${label} on the number line.`,
      min, max, ticks: max - min, target: f.valueOf(), tolerance: (max - min) * 0.035, targetLabel: label,
      explain: `${f.n === 1 ? `${label} is 1 part out of ${f.d}` : `${label} is ${f.n} lots of {{1/${f.d}}}`}. Split each whole into ${f.d} equal parts and count ${f.n} part${f.n === 1 ? '' : 's'} from 0.`,
      steps: [`I split each whole into ${f.d} equal parts.`, `Each part is {{1/${f.d}}}.`, `I count ${f.n} part${f.n === 1 ? '' : 's'} from 0 to find ${label}.`],
    };
  },

  fracEquivalent(level, rng) {
    if (level === 1 || level === 3) {
      const d = rng.pick([2, 3, 4, 5, 6, 8]); const n = rng.int(1, d - 1); const k = rng.int(2, level === 1 ? 4 : 9);
      const missingTop = level === 1 || rng.chance(0.5);
      const prompt = missingTop ? `${tex(new Frac(n, d))} = {{?/${d * k}}}` : `${tex(new Frac(n, d))} = {{${n * k}/?}}`;
      const ans = missingTop ? n * k : d * k;
      return {
        kind: 'typed', prompt: `Find the missing number: ${prompt}`, numeric: { value: String(ans), form: 'any' },
        explain: `The ${missingTop ? 'denominator' : 'numerator'} was multiplied by ${k}, so the ${missingTop ? 'numerator' : 'denominator'} must be too: ${missingTop ? n : d} × ${k} = ${ans}.`,
        steps: [`I look at what happened to the ${missingTop ? 'denominator' : 'numerator'}: it was multiplied by ${k}.`, `Whatever I do to the ${missingTop ? 'bottom' : 'top'} I do to the ${missingTop ? 'top' : 'bottom'}, so I multiply the ${missingTop ? 'numerator' : 'denominator'} by ${k} too.`, `${missingTop ? n : d} × ${k} = ${ans}.`],
        ...equivWall(n, d, k),
      };
    }
    const d = rng.pick([3, 4, 5, 6, 7, 8, 9]); let n = rng.int(1, d - 1);
    while (gcd(n, d) !== 1) n = rng.int(1, d - 1);
    const k = rng.int(2, 8);
    const big = new Frac(n * k, d * k);
    return {
      kind: 'typed', prompt: `Simplify ${tex(big)} fully.`, numeric: { value: `${n}/${d}`, form: 'simplest' },
      explain: `The highest common factor of ${n * k} and ${d * k} is ${k}. Divide both by ${k}: ${tex(new Frac(n, d))}.`,
      steps: [`I look for the highest common factor of ${n * k} and ${d * k}. It is ${k}.`, `I divide top and bottom by ${k}.`, `${tex(big)} = ${tex(new Frac(n, d))}.`],
      ...equivWall(n, d, k),
    };
  },

  fracAddSub(level, rng) {
    let a, b;
    if (level === 1) { const d = rng.int(4, 12); const x = rng.int(1, d - 2); a = new Frac(x, d); b = new Frac(rng.int(1, d - x - 1) || 1, d); }
    else if (level === 2) { const d1 = rng.pick([2, 3, 4, 5]); const d2 = d1 * rng.pick([2, 3, 4]); a = new Frac(rng.int(1, d1 - 1), d1); b = new Frac(rng.int(1, d2 - 1), d2); }
    else { const [d1, d2] = rng.sample([2, 3, 4, 5, 6], 2); a = new Frac(rng.int(1, d1 - 1), d1); b = new Frac(rng.int(1, d2 - 1), d2); }
    const subtract = rng.chance(0.4);
    if (subtract && a.cmp(b) < 0) [a, b] = [b, a];
    if (subtract && a.eq(b)) return GENERATORS.fracAddSub(level, rng);
    const r = subtract ? a.sub(b) : a.add(b);
    const L = lcm(a.d, b.d);
    const A = new Frac(a.n * (L / a.d), L), B = new Frac(b.n * (L / b.d), L);
    const raw = new Frac(subtract ? A.n - B.n : A.n + B.n, L);
    const steps = [
      a.d === b.d ? `The denominators are already the same.` : `I need a common denominator. The lowest is ${L}.`,
      a.d === b.d ? `I ${subtract ? 'subtract' : 'add'} the numerators and keep the denominator.` : `${tex(a)} = ${tex(A)} and ${tex(b)} = ${tex(B)}.`,
      `${tex(A)} ${subtract ? '−' : '+'} ${tex(B)} = ${tex(raw)}${raw.isSimplest() ? '' : `, which simplifies to ${tex(r)}`}.`,
    ];
    return {
      kind: 'typed', prompt: `${tex(a)} ${subtract ? '−' : '+'} ${tex(b)} = ?  (simplest form)`, numeric: { value: r.toString(), form: 'simplest' },
      explain: steps.join(' ') + (a.d !== b.d ? ' Never add the denominators.' : ''),
      steps,
    };
  },

  fracMultiply(level, rng) {
    if (level === 1) {
      const d = rng.int(3, 9); const n = rng.int(1, d - 1); const w = rng.int(2, 6);
      const r = new Frac(n * w, d).simplify();
      return {
        kind: 'typed', prompt: `${tex(new Frac(n, d))} × ${w} = ?  (simplest form)`, numeric: { value: r.toString(), form: 'simplest' },
        explain: `${w} lots of ${tex(new Frac(n, d))} is ${tex(new Frac(n * w, d))}${new Frac(n * w, d).isSimplest() ? '' : ` = ${tex(r)}`}. Only the numerator is multiplied.`,
        steps: [`${w} lots of ${tex(new Frac(n, d))} means ${w} × ${n} = ${n * w} pieces of size {{1/${d}}}.`, `So the answer is ${tex(new Frac(n * w, d))}; the denominator stays the same.`, new Frac(n * w, d).isSimplest() ? `That is already in simplest form.` : `This simplifies to ${tex(r)}.`],
      };
    }
    if (level === 2) {
      const [d1, d2] = [rng.int(2, 9), rng.int(2, 9)]; const a = new Frac(rng.int(1, d1 - 1), d1), b = new Frac(rng.int(1, d2 - 1), d2);
      const r = a.mul(b);
      return {
        kind: 'typed', prompt: `${tex(a)} × ${tex(b)} = ?  (simplest form)`, numeric: { value: r.toString(), form: 'simplest' },
        explain: `Multiply the numerators and multiply the denominators: ${tex(new Frac(a.n * b.n, a.d * b.d))}${r.d !== a.d * b.d ? ` = ${tex(r)}` : ''}.`,
        steps: [`Numerators: ${a.n} × ${b.n} = ${a.n * b.n}.`, `Denominators: ${a.d} × ${b.d} = ${a.d * b.d}.`, `${tex(new Frac(a.n * b.n, a.d * b.d))}${r.d !== a.d * b.d ? ` simplifies to ${tex(r)}` : ' is already simplest'}.`],
      };
    }
    const d = rng.int(2, 9); const a = new Frac(rng.int(1, d - 1), d); const w = rng.int(2, 5);
    const r = a.div(w);
    return {
      kind: 'typed', prompt: `${tex(a)} ÷ ${w} = ?  (simplest form)`, numeric: { value: r.toString(), form: 'simplest' },
      explain: `Dividing by ${w} is the same as multiplying by {{1/${w}}}: ${tex(a)} × {{1/${w}}} = ${tex(r)}.`,
      steps: [`Dividing by ${w} means splitting into ${w} equal parts.`, `That is the same as multiplying by {{1/${w}}}.`, `${tex(a)} × {{1/${w}}} = ${tex(new Frac(a.n, a.d * w))}${r.d !== a.d * w ? ` = ${tex(r)}` : ''}.`],
    };
  },

  fracOfAmount(level, rng) {
    const d = rng.pick([2, 3, 4, 5, 6, 8, 10]); const unit = rng.int(2, 12); const total = d * unit;
    if (level === 1) {
      return {
        kind: 'typed', prompt: `What is {{1/${d}}} of ${total}?`, numeric: { value: String(unit), form: 'any' },
        explain: `To find {{1/${d}}}, divide by ${d}: ${total} ÷ ${d} = ${unit}.`,
        steps: [`{{1/${d}}} means one of ${d} equal parts.`, `I divide ${total} by ${d}.`, `${total} ÷ ${d} = ${unit}.`],
        ...fracBar(1, d, unit),
      };
    }
    const n = d === 2 ? 1 : rng.int(2, d - 1);
    const part = n * unit;
    if (level === 2) {
      return {
        kind: 'typed', prompt: `What is ${tex(new Frac(n, d))} of ${total}?`, numeric: { value: String(part), form: 'any' },
        explain: `Divide by the denominator, then multiply by the numerator: ${total} ÷ ${d} = ${unit}, and ${unit} × ${n} = ${part}.`,
        steps: [`First I find {{1/${d}}}: ${total} ÷ ${d} = ${unit}.`, `I need ${n} of those parts.`, `${unit} × ${n} = ${part}.`],
        ...fracBar(n, d, unit),
      };
    }
    return {
      kind: 'typed', prompt: `${tex(new Frac(n, d))} of a number is ${part}. What is the number?`, numeric: { value: String(total), form: 'any' },
      explain: n === 1 ? `One part is ${part}. The whole is ${d} parts: ${unit} × ${d} = ${total}.` : `${n} parts make ${part}, so one part is ${part} ÷ ${n} = ${unit}. The whole is ${d} parts: ${unit} × ${d} = ${total}.`,
      steps: n === 1 ? [`${tex(new Frac(n, d))} is one of ${d} equal parts, and it is worth ${part}.`, `The whole is ${d} of those parts.`, `${unit} × ${d} = ${total}.`] : [`${n} equal parts are worth ${part}.`, `So one part is ${part} ÷ ${n} = ${unit}.`, `The whole number is ${d} parts: ${unit} × ${d} = ${total}.`],
      ...pic(bar([{ parts: d, shaded: n, text: unit }], total), `The ${n === 1 ? 'shaded box is' : `${n} shaded boxes are`} ${part}, so one box is ${unit}. The whole is ${d} boxes: ${total}.`),
    };
  },

  fdp(level, rng) {
    if (level === 1) {
      const f = rng.pick([[1, 2], [1, 4], [3, 4], [1, 10], [3, 10], [7, 10], [1, 5], [2, 5], [4, 5], [3, 5]]);
      const pct = (100 * f[0]) / f[1];
      return {
        kind: 'typed', prompt: `Write ${tex(new Frac(f[0], f[1]))} as a percentage.`, numeric: { value: String(pct), form: 'any' }, unit: '%',
        explain: `Per cent means out of 100. ${tex(new Frac(f[0], f[1]))} = ${tex(new Frac(pct, 100))} = ${pct}%.`,
        steps: [`Per cent means “out of 100”.`, `I make the denominator 100: ${tex(new Frac(f[0], f[1]))} = ${tex(new Frac(pct, 100))}.`, `So it is ${pct}%.`],
        ...pic({ type: 'hundredsq', shade: Array.from({ length: pct }, (_, i) => i + 1) }, `${tex(new Frac(f[0], f[1]))} of the hundred square is ${pct} squares out of 100: ${pct}%.`),
      };
    }
    if (level === 2) {
      if (rng.chance(0.5)) {
        const th = rng.pick([rng.int(1, 99) * 10, rng.int(1, 9) * 100, rng.int(101, 999)]);
        const pct = th / 10;
        return {
          kind: 'typed', prompt: `Write ${dec(th)} as a percentage.`, numeric: { value: String(pct), form: 'any' }, unit: '%',
          explain: `Multiply by 100: ${dec(th)} × 100 = ${pct}%.`,
          steps: [`A percentage is a number out of 100.`, `I multiply the decimal by 100.`, `${dec(th)} × 100 = ${pct}, so ${pct}%.`],
        };
      }
      const f = rng.pick([[1, 8], [3, 8], [5, 8], [7, 8], [1, 20], [3, 20], [1, 25], [3, 25], [1, 50]]);
      const th = (1000 * f[0]) / f[1];
      return {
        kind: 'typed', prompt: `Write ${tex(new Frac(f[0], f[1]))} as a decimal.`, numeric: { value: decPlain(th), form: 'decimal' },
        explain: `${f[0]} ÷ ${f[1]} = ${dec(th)}.`,
        steps: [`A fraction is a division: ${f[0]} ÷ ${f[1]}.`, f[1] === 8 ? (f[0] === 1 ? `I divide 1 by 8: 1.000 ÷ 8 = 0.125.` : `{{1/8}} = 0.125, so I multiply by ${f[0]}: ${f[0]} × 0.125 = ${dec(th)}.`) : `I scale to a denominator of 100: ${tex(new Frac(f[0], f[1]))} = ${tex(new Frac((f[0] * 100) / f[1], 100))}.`, `${tex(new Frac(f[0], f[1]))} = ${dec(th)}.`],
      };
    }
    const pool = distinct(rng, 4, () => rng.int(5, 95));
    if (new Set(pool).size < 4) return GENERATORS.fdp(3, rng);
    const forms = pool.map((p, i) => {
      const k = i % 3;
      if (k === 0) return { v: p, text: `${p}%` };
      if (k === 1) return { v: p, text: dec(p * 10) };
      const f = new Frac(p, 100).simplify();
      return { v: p, text: tex(f) };
    });
    const max = forms.reduce((a, b) => (b.v > a.v ? b : a));
    return choice('Which is the largest?', max.text, forms.filter((f) => f !== max).map((f) => f.text), rng, {
      explain: `Convert everything to percentages: ${forms.map((f) => `${f.text} = ${f.v}%`).join(', ')}.`,
      steps: [`I change every number into the same form, percentages.`, forms.map((f) => `${f.text} = ${f.v}%`).join(', ') + '.', `The largest is ${max.text}.`],
    });
  },

  percentOf(level, rng) {
    if (level === 1) {
      const p = rng.pick([10, 50, 25, 20, 1]); const amt = rng.int(2, 30) * (p === 25 ? 4 : p === 1 ? 100 : 10);
      const r = (p * amt) / 100;
      const how = { 10: 'divide by 10', 50: 'halve it', 25: 'halve it, then halve again', 20: 'find 10% and double it', 1: 'divide by 100' }[p];
      return {
        kind: 'typed', prompt: `What is ${p}% of ${amt}?`, numeric: { value: String(r), form: 'any' },
        explain: `To find ${p}%, ${how}: ${r}.`,
        steps: [`${p}% means ${p} out of every 100.`, `A quick way: ${how}.`, `${p}% of ${amt} = ${r}.`],
        ...(p > 1 ? pctBar(p, amt) : {}),
      };
    }
    if (level === 2) {
      const p = rng.pick([5, 15, 35, 45, 75, 30, 60]); const amt = rng.int(2, 20) * 20;
      const r = (p * amt) / 100;
      return {
        kind: 'typed', prompt: `What is ${p}% of ${amt}?`, numeric: { value: String(r), form: 'any' },
        explain: p === 5 ? `10% of ${amt} is ${amt / 10}, and 5% is half of that: ${r}.` : `10% of ${amt} is ${amt / 10}. Build ${p}% from 10%s${p % 10 ? ' and 5%s' : ''}: ${r}.`,
        steps: p === 5 ? [`10% of ${amt} is ${amt / 10}.`, `5% is half of that: ${amt / 20}.`, `So 5% of ${amt} = ${r}.`]
          : [p % 10 ? `10% of ${amt} is ${amt / 10}, and 5% is half of that: ${amt / 20}.` : `10% of ${amt} is ${amt / 10}.`, `${p}% = ${Math.floor(p / 10)} × 10%${p % 10 ? ' + 5%' : ''} = ${Math.floor(p / 10) * amt / 10}${p % 10 ? ` + ${amt / 20}` : ''}.`, `So ${p}% of ${amt} = ${r}.`],
        ...pctBar(p, amt),
      };
    }
    const p = rng.pick([10, 20, 25, 50, 15]); const amt = rng.int(2, 20) * 20; const up = rng.chance(0.5);
    const change = (p * amt) / 100; const r = up ? amt + change : amt - change;
    return {
      kind: 'typed', prompt: `A game costs £${amt}. Its price ${up ? 'rises' : 'is reduced'} by ${p}%. What is the new price in pounds?`, numeric: { value: String(r), form: 'any' }, unit: '£', unitBefore: true,
      explain: `${p}% of £${amt} is £${change}. ${up ? 'Add it' : 'Take it away'}: £${r}.`,
      steps: [`First I find ${p}% of £${amt}: £${change}.`, `The price ${up ? 'goes up, so I add' : 'goes down, so I subtract'}.`, `£${amt} ${up ? '+' : '−'} £${change} = £${r}.`],
      ...pctChangeBar(p, amt, up, '£'),
    };
  },

  orderOps(level, rng) {
    let prompt, value, steps, trap;
    if (level === 1) {
      const a = rng.int(2, 12), b = rng.int(2, 9), c = rng.int(2, 9);
      if (rng.chance(0.5)) { prompt = `${a} + ${b} × ${c}`; value = a + b * c; trap = (a + b) * c; steps = [`Multiplication comes before addition.`, `${b} × ${c} = ${b * c}.`, `${a} + ${b * c} = ${value}.`]; }
      else { prompt = `${a + b * c} − ${b} × ${c}`; value = a; trap = (a + b * c - b) * c; steps = [`Multiplication comes before subtraction.`, `${b} × ${c} = ${b * c}.`, `${a + b * c} − ${b * c} = ${value}.`]; }
    } else if (level === 2) {
      const a = rng.int(2, 9), b = rng.int(2, 9), c = rng.int(2, 6);
      const top = (a + b) * c;
      prompt = `${top * 2} ÷ (${a} + ${b}) − ${c}`; value = (top * 2) / (a + b) - c; trap = null;
      steps = [`Brackets first: ${a} + ${b} = ${a + b}.`, `Then division: ${top * 2} ÷ ${a + b} = ${(top * 2) / (a + b)}.`, `Then subtraction: ${(top * 2) / (a + b)} − ${c} = ${value}.`];
    } else {
      const a = rng.int(2, 6), b = rng.int(2, 5), c = rng.int(1, 9);
      prompt = `${c} + ${a}² × ${b}`; value = c + a * a * b; trap = (c + a * a) * b;
      steps = [`Powers come first: ${a}² = ${a * a}.`, `Then multiplication: ${a * a} × ${b} = ${a * a * b}.`, `Then addition: ${c} + ${a * a * b} = ${value}.`];
    }
    return {
      kind: 'typed', prompt: `Work out ${prompt}`, numeric: { value: String(value), form: 'any' },
      explain: steps.join(' ') + (trap != null ? ` (Working left to right would give ${trap}, which is wrong.)` : ''),
      steps,
    };
  },

  algebraSubstitute(level, rng) {
    const a = rng.int(2, 9), b = rng.int(1, 6);
    if (level === 1) {
      const m = rng.int(2, 6), c = rng.int(1, 9);
      return {
        kind: 'typed', prompt: `If a = ${a}, what is ${m}a + ${c}?`, numeric: { value: String(m * a + c), form: 'any' },
        explain: `${m}a means ${m} × a = ${m * a}. Then add ${c}: ${m * a + c}. (Not ${m}${a} + ${c}!)`,
        steps: [`${m}a means ${m} × a.`, `${m} × ${a} = ${m * a}.`, `${m * a} + ${c} = ${m * a + c}.`],
      };
    }
    if (level === 2) {
      const m = rng.int(2, 5);
      const v = m * a - b;
      return {
        kind: 'typed', prompt: `If a = ${a} and b = ${b}, what is ${m}a − b?`, numeric: { value: String(v), form: 'any' },
        explain: `${m}a = ${m * a}, then subtract b: ${m * a} − ${b} = ${neg(v)}.`,
        steps: [`I replace a with ${a} and b with ${b}.`, `${m}a = ${m} × ${a} = ${m * a}.`, `${m * a} − ${b} = ${neg(v)}.`],
      };
    }
    const bTerm = b === 1 ? 'b' : `${b}b`; // a coefficient of 1 is never written
    const v = rng.chance(0.5) ? { p: `a² + ${bTerm}`, v: a * a + b * b, s: [`a² = ${a} × ${a} = ${a * a}${a === 2 ? '' : ` (not ${a} × 2)`}.`, b === 1 ? 'b = 1.' : `${b}b = ${b} × ${b} = ${b * b}.`, `${a * a} + ${b * b} = ${a * a + b * b}.`] }
      : { p: `3(a + b)`, v: 3 * (a + b), s: [`Brackets first: a + b = ${a} + ${b} = ${a + b}.`, `3(…) means 3 × (…).`, `3 × ${a + b} = ${3 * (a + b)}.`] };
    return {
      kind: 'typed', prompt: `If a = ${a} and b = ${b}, what is ${v.p}?`, numeric: { value: String(v.v), form: 'any' },
      explain: v.s.join(' '), steps: v.s,
    };
  },

  sequences(level, rng) {
    const d = rng.int(2, 9) * (level === 1 && rng.chance(0.3) ? -1 : 1); const start = rng.int(1, 20) + (d < 0 ? 40 : 0);
    const terms = [0, 1, 2, 3].map((i) => start + i * d);
    if (level === 1) {
      return {
        kind: 'typed', prompt: `What is the next term? ${terms.map(neg).join(', ')}, …`, numeric: { value: String(start + 4 * d), form: 'any' },
        explain: `The sequence ${d > 0 ? 'goes up' : 'goes down'} by ${Math.abs(d)} each time: ${neg(terms[3])} ${d > 0 ? '+' : '−'} ${Math.abs(d)} = ${neg(start + 4 * d)}.`,
        steps: [`I find the difference between terms: ${neg(terms[1])} − ${neg(terms[0])} = ${neg(d)}.`, `It is the same every time, so I ${d > 0 ? 'add' : 'subtract'} ${Math.abs(d)} again.`, `${neg(terms[3])} ${d > 0 ? '+' : '−'} ${Math.abs(d)} = ${neg(start + 4 * d)}.`],
      };
    }
    if (level === 2) {
      const n = rng.pick([10, 12, 20, 15]);
      const v = start + (n - 1) * d;
      return {
        kind: 'typed', prompt: `${terms.join(', ')}, … What is the ${n}th term?`, numeric: { value: String(v), form: 'any' },
        explain: `From the 1st term to the ${n}th term there are ${n - 1} jumps of ${d}: ${start} + ${n - 1} × ${d} = ${v}.`,
        steps: [`The sequence goes up by ${d} each time.`, `To get from the 1st term to the ${n}th term I make ${n - 1} jumps, not ${n}.`, `${start} + ${n - 1} × ${d} = ${v}.`],
      };
    }
    const c = start - d;
    const rule = (k, cc) => `${k === 1 ? '' : k}n ${cc < 0 ? '−' : '+'} ${Math.abs(cc)}`.replace(/ \+ 0$/, '');
    const correct = rule(d, c);
    const wrongs = [...new Set([`n + ${d}`, rule(d, start), rule(start, d === start ? 1 : d - start)])].filter((w) => w !== correct).slice(0, 3);
    return choice(`What is the nth term of ${terms.join(', ')}, …?`, correct, wrongs.map((w) => (w === `n + ${d}` ? { text: w, feedback: `“Add ${d}” is the term-to-term rule. The nth term needs ${d}n because each term is ${d} more.` } : w)), rng, {
      explain: `It goes up by ${d}, so it is linked to the ${d} times table: ${d}n gives ${d}, ${2 * d}, ${3 * d}… ${c === 0 ? 'That is exactly the sequence' : `Each term is ${c < 0 ? `${-c} less` : `${c} more`}`}, so the rule is ${correct}.`,
      steps: [`The difference is ${d}, so I start with ${d}n.`, `${d}n gives ${d}, ${2 * d}, ${3 * d}, …${c === 0 ? ', which is exactly the sequence.' : ` but the sequence is ${terms.slice(0, 3).join(', ')}, …`}`, `${c === 0 ? 'Nothing needs adding' : `Each term is ${c < 0 ? `${-c} less` : `${c} more`}`}, so the nth term is ${correct}.`],
    });
  },

  equations(level, rng) {
    const x = rng.int(level === 3 ? -5 : 2, 12) || 3;
    if (level === 1) {
      if (rng.chance(0.5)) {
        const c = rng.int(3, 20);
        return { kind: 'typed', prompt: `Solve: x + ${c} = ${x + c}`, prefix: 'x =', numeric: { value: String(x), form: 'any' }, explain: `Subtract ${c} from both sides: x = ${x + c} − ${c} = ${x}.`, steps: [`I want x on its own.`, `I subtract ${c} from both sides.`, `x = ${x + c} − ${c} = ${x}.`] };
      }
      const m = rng.int(2, 9);
      return { kind: 'typed', prompt: `Solve: ${m}x = ${m * x}`, prefix: 'x =', numeric: { value: String(x), form: 'any' }, explain: `Divide both sides by ${m}: x = ${m * x} ÷ ${m} = ${x}.`, steps: [`${m}x means ${m} × x.`, `To undo × ${m}, I divide both sides by ${m}.`, `x = ${m * x} ÷ ${m} = ${x}.`] };
    }
    if (level === 2) {
      const m = rng.int(2, 9), c = rng.int(1, 15) * (rng.chance(0.3) ? -1 : 1);
      const rhs = m * x + c;
      const lhs = `${m}x ${c < 0 ? '−' : '+'} ${Math.abs(c)}`;
      return {
        kind: 'typed', prompt: `Solve: ${lhs} = ${neg(rhs)}`, prefix: 'x =', numeric: { value: String(x), form: 'any' },
        explain: `${c < 0 ? 'Add' : 'Subtract'} ${Math.abs(c)}: ${m}x = ${m * x}. Divide by ${m}: x = ${x}.`,
        steps: [`First I undo the ${c < 0 ? '−' : '+'} ${Math.abs(c)}: ${m}x = ${neg(rhs)} ${c < 0 ? '+' : '−'} ${Math.abs(c)} = ${m * x}.`, `Then I undo × ${m} by dividing by ${m}.`, `x = ${m * x} ÷ ${m} = ${x}.`],
      };
    }
    const a = rng.int(3, 8), b = rng.int(1, a - 1), c = rng.int(1, 9) * (rng.chance(0.5) ? -1 : 1);
    const d = (a - b) * x + c;
    const xs = (k) => (k === 1 ? 'x' : `${k}x`);
    const fmt = (k, k0) => `${xs(k)} ${k0 < 0 ? '−' : '+'} ${Math.abs(k0)}`;
    const collect = `${xs(a - b)} ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${neg(d)}`;
    if (a - b === 1) {
      // One x is left over, so there is nothing to divide by.
      return {
        kind: 'typed', prompt: `Solve: ${fmt(a, c)} = ${d === 0 ? xs(b) : fmt(b, d)}`, prefix: 'x =', numeric: { value: String(x), form: 'any' },
        explain: `Subtract ${xs(b)} from both sides: ${collect}. ${c < 0 ? 'Add' : 'Subtract'} ${Math.abs(c)}: x = ${neg(x)}.`,
        steps: [`I collect the x terms on one side by subtracting ${xs(b)} from both sides: ${collect}.`, `I ${c < 0 ? 'add' : 'subtract'} ${Math.abs(c)}: x = ${neg(x)}.`, `Check: when x = ${neg(x)}, both sides are ${neg(a * x + c)}.`],
      };
    }
    return {
      kind: 'typed', prompt: `Solve: ${fmt(a, c)} = ${d === 0 ? xs(b) : fmt(b, d)}`, prefix: 'x =', numeric: { value: String(x), form: 'any' },
      explain: `Subtract ${xs(b)} from both sides: ${collect}. Then ${a - b}x = ${neg(d - c)}, so x = ${neg(x)}.`,
      steps: [`I collect the x terms on one side by subtracting ${xs(b)} from both sides: ${collect}.`, `I ${c < 0 ? 'add' : 'subtract'} ${Math.abs(c)}: ${a - b}x = ${neg(d - c)}.`, `I divide by ${a - b}: x = ${neg(x)}.`],
    };
  },

  ratioShare(level, rng) {
    if (level === 1) {
      let p = rng.int(1, 6), q = rng.int(1, 7); while (gcd(p, q) !== 1 || p === q) { p = rng.int(1, 6); q = rng.int(1, 7); }
      const k = rng.int(2, 8);
      return {
        kind: 'typed', prompt: `Write ${p * k} : ${q * k} in its simplest form.`, answer: `${p}:${q}`, accept: [`${p} : ${q}`, `${p} to ${q}`],
        explain: `Both numbers divide by ${k}: ${p * k} ÷ ${k} = ${p} and ${q * k} ÷ ${k} = ${q}, so ${p} : ${q}.`,
        steps: [`I find the highest common factor of ${p * k} and ${q * k}: it is ${k}.`, `I divide both parts by ${k}.`, `${p * k} : ${q * k} = ${p} : ${q}.`],
        placeholder: 'e.g. 2:3',
      };
    }
    if (level === 2) {
      const p = rng.int(1, 5), q = rng.int(p + 1, 7); const unit = rng.int(2, 12); const total = (p + q) * unit;
      return {
        kind: 'typed', prompt: `Share £${total} in the ratio ${p} : ${q}. How much is the larger share?`, numeric: { value: String(q * unit), form: 'any' }, unit: '£', unitBefore: true,
        explain: `There are ${p} + ${q} = ${p + q} parts. One part is £${total} ÷ ${p + q} = £${unit}. The larger share is ${q} parts: £${q * unit}.`,
        steps: [`I add the ratio parts: ${p} + ${q} = ${p + q} parts.`, `One part is £${total} ÷ ${p + q} = £${unit}.`, `The larger share is ${q} × £${unit} = £${q * unit}.`],
        ...pic(bar([{ label: 'smaller', parts: p, text: `£${unit}`, total: `£${p * unit}` }, { label: 'larger', parts: q, text: `£${unit}`, total: `£${q * unit}` }]), `${p} + ${q} = ${p + q} boxes share £${total}, so each box is £${unit}. The larger share is ${q} boxes: £${q * unit}.`),
      };
    }
    let p = rng.int(2, 5), q = rng.int(2, 7); const k = rng.int(2, 6);
    while (gcd(p, q) !== 1) { p = rng.int(2, 5); q = rng.int(2, 7); } // ratio given in simplest form (never 5 : 5)
    return {
      kind: 'typed', prompt: `In a club the ratio of boys to girls is ${p} : ${q}. There are ${p * k} boys. How many girls are there?`, numeric: { value: String(q * k), form: 'any' },
      explain: `${p * k} boys is ${k} lots of ${p}, so there are ${k} lots of ${q} girls: ${q * k}.`,
      steps: [`${p} parts are boys, and ${p} parts = ${p * k} boys.`, `So one part is ${p * k} ÷ ${p} = ${k}.`, `Girls are ${q} parts: ${q} × ${k} = ${q * k}.`],
      ...pic(bar([{ label: 'boys', parts: p, text: k, total: `${p * k} boys` }, { label: 'girls', parts: q, text: k, total: `${q * k} girls` }]), `${p} boxes are ${p * k} boys, so each box is ${k}. The girls are ${q} boxes: ${q * k}.`),
    };
  },

  factorsPrimes(level, rng) {
    if (level === 1) {
      const primes = [7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
      const tricky = [21, 27, 39, 49, 51, 57, 63, 69, 77, 81, 87, 91, 93];
      const n = rng.chance(0.5) ? rng.pick(primes) : rng.pick(tricky);
      const isPrime = primes.includes(n);
      let f = 0; for (let k = 2; k < n; k++) if (n % k === 0) { f = k; break; }
      return {
        kind: 'choice', prompt: `Is ${n} a prime number?`,
        options: [{ text: 'Yes, it is prime', correct: isPrime, feedback: isPrime ? undefined : `${n} = ${f} × ${n / f}, so it has more than two factors.` }, { text: 'No, it is not prime', correct: !isPrime, feedback: isPrime ? `${n} has only two factors, 1 and ${n}, so it is prime.` : undefined }],
        explain: isPrime ? `${n} has exactly two factors, 1 and ${n}. It is prime.` : `${n} = ${f} × ${n / f}. It has more than two factors, so it is not prime.`,
        steps: [`A prime has exactly two factors: 1 and itself.`, `I test small primes: 2, 3, 5, 7…`, isPrime ? `None of them divide ${n}, so it is prime.` : `${f} goes into ${n} (${n} = ${f} × ${n / f}), so it is not prime.`],
      };
    }
    const g = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 12]); let p = rng.int(1, 6), q = rng.int(2, 7); while (gcd(p, q) !== 1 || p === q) { p = rng.int(1, 6); q = rng.int(2, 7); }
    const A = g * p, B = g * q;
    if (level === 2) {
      return {
        kind: 'typed', prompt: `What is the highest common factor of ${A} and ${B}?`, numeric: { value: String(g), form: 'any' },
        explain: `${g} is the biggest number that divides both: ${A} = ${g} × ${p} and ${B} = ${g} × ${q}.`,
        steps: [`I list factors of the smaller number and test each in the bigger.`, `${A} = ${g} × ${p} and ${B} = ${g} × ${q}.`, `The highest common factor is ${g}.`],
      };
    }
    const L = lcm(A, B);
    return {
      kind: 'typed', prompt: `What is the lowest common multiple of ${A} and ${B}?`, numeric: { value: String(L), form: 'any' },
      explain: `List multiples of ${Math.max(A, B)} until one is also a multiple of ${Math.min(A, B)}: ${L}.`,
      steps: [`I list multiples of the bigger number, ${Math.max(A, B)}.`, `I stop at the first one that ${Math.min(A, B)} also divides.`, `The lowest common multiple is ${L}.`],
    };
  },

  angles(level, rng) {
    if (level === 1) {
      const a = rng.int(25, 155);
      return { kind: 'typed', prompt: `Two angles sit on a straight line. One is ${a}°. What is the other?`, numeric: { value: String(180 - a), form: 'any' }, unit: '°', diagram: { type: 'line', known: [a] }, explain: `Angles on a straight line add up to 180°: 180 − ${a} = ${180 - a}°.`, steps: [`Angles on a straight line add up to 180°.`, `So the missing angle is 180° − ${a}°.`, `= ${180 - a}°.`] };
    }
    if (level === 2) {
      const a = rng.int(30, 90), b = rng.int(20, 150 - a);
      return { kind: 'typed', prompt: `A triangle has angles of ${a}° and ${b}°. What is the third angle?`, numeric: { value: String(180 - a - b), form: 'any' }, unit: '°', diagram: { type: 'triangle', known: [a, b] }, explain: `Angles in a triangle add up to 180°: 180 − ${a} − ${b} = ${180 - a - b}°.`, steps: [`Angles in a triangle add up to 180°.`, `${a}° + ${b}° = ${a + b}°.`, `180° − ${a + b}° = ${180 - a - b}°.`] };
    }
    if (rng.chance(0.5)) {
      const a = rng.int(60, 140), b = rng.int(50, 300 - a - 20);
      return { kind: 'typed', prompt: `Three angles meet at a point. Two of them are ${a}° and ${b}°. What is the third?`, numeric: { value: String(360 - a - b), form: 'any' }, unit: '°', diagram: { type: 'point', known: [a, b] }, explain: `Angles around a point add up to 360°: 360 − ${a} − ${b} = ${360 - a - b}°.`, steps: [`Angles around a point add up to 360°.`, `${a}° + ${b}° = ${a + b}°.`, `360° − ${a + b}° = ${360 - a - b}°.`] };
    }
    const apex = rng.int(10, 80) * 2;
    return { kind: 'typed', prompt: `An isosceles triangle has a top angle of ${apex}°. The other two angles are equal. What size is each one?`, numeric: { value: String((180 - apex) / 2), form: 'any' }, unit: '°', diagram: { type: 'isosceles', known: [apex] }, explain: `180 − ${apex} = ${180 - apex}, shared equally between two angles: ${(180 - apex) / 2}° each.`, steps: [`The three angles add up to 180°.`, `The two equal angles share 180° − ${apex}° = ${180 - apex}°.`, `Each one is ${180 - apex}° ÷ 2 = ${(180 - apex) / 2}°.`] };
  },
};
