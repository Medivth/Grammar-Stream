// Year 8 "school focus": the areas from her maths report (red: Pythagoras problem solving and
// reverse percentages; amber: drawing linear graphs and parallel lines, gradient and intercept,
// estimation, lines of symmetry, solving equations, using a calculator; green: angles in
// triangles and fraction calculations). Targeted generators for the skills the main course
// covers only in passing; the rest reuse js/gen/y8maths*.js. Same contract: (level 1..3, rng)
// -> question with `explain` and worked `steps`. Every answer is computed from the question's
// own numbers, with exact integer arithmetic where rounding is involved.

import { Frac } from '../core/fraction.js';

const neg = (n) => (n < 0 ? `−${-n}` : String(n));
const paren = (n) => (n < 0 ? `(−${-n})` : String(n));
const sgn = (n) => (n < 0 ? ` − ${-n}` : ` + ${n}`);
const F = (n, d = 1) => new Frac(n, d).simplify();
const tex = (f) => (f.d === 1 ? neg(f.n) : `${f.n < 0 ? '−' : ''}${Math.abs(f.n)}/${f.d}`);
const an = (w) => (/^[aeiou]/i.test(w) ? `an ${w}` : `a ${w}`);
const comma = (s) => String(s).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const money = (p) => `£${comma(p % 100 ? (p / 100).toFixed(2) : String(p / 100))}`;
const norm = (t) => String(t).normalize('NFKC').toLowerCase().replace(/[−–]/g, '-').replace(/\s+/g, ' ').trim();

function choice(prompt, correct, wrongs, rng, extra = {}) {
  const seen = new Set([norm(correct)]);
  const ws = [];
  for (const w of wrongs) if (!seen.has(norm(w))) { seen.add(norm(w)); ws.push({ text: w }); }
  return { kind: 'choice', prompt, options: rng.shuffle([{ text: correct, correct: true }, ...ws.slice(0, 4)]), ...extra };
}
const num = (prompt, value, explain, steps, extra = {}) => ({ kind: 'typed', prompt, numeric: { value: String(value), form: 'any' }, explain, steps, ...extra });
const fracQ = (prompt, f, explain, steps, extra = {}) => ({ kind: 'typed', prompt, numeric: { value: f.toString(), form: 'simplest' }, explain, steps, placeholder: 'e.g. 3 or -1/2', ...extra });
const pairQ = (prompt, P, explain, steps, extra = {}) => ({ kind: 'typed', prompt, pair: P, answer: `(${P[0]}, ${P[1]})`, placeholder: '(x, y)', explain, steps, ...extra });

/** √n to 1 decimal place, or null when n is a perfect square or sits too near a rounding boundary. */
function root1dp(n) {
  const r = Math.sqrt(n);
  if (Number.isInteger(r)) return null;
  const t = r * 10;
  if (Math.abs(t - Math.floor(t) - 0.5) < 0.02) return null;
  return (Math.round(t) / 10).toFixed(1);
}
/** a ÷ b (integers, b > 0) rounded to d decimal places, as text; null near a boundary. */
function divRound(a, b, d) {
  const p = 10 ** d, scaled = (a * p) / b, frac = scaled - Math.floor(scaled);
  if (Math.abs(frac - 0.5) < 1e-6) return null;
  const r = Math.round(scaled);
  const s = (Math.abs(r) / p).toFixed(d);
  return r < 0 ? `-${s}` : s;
}
/** "y = 3x − 2" style, with the usual tidy forms for 1, −1 and 0. */
function lineEq(m, c) {
  const mx = typeof m === 'object' ? (m.n === 0 ? '' : m.d === 1 ? (m.n === 1 ? 'x' : m.n === -1 ? '−x' : `${neg(m.n)}x`) : `${m.n < 0 ? '−' : ''}{{${Math.abs(m.n)}/${m.d}}}x`)
    : m === 0 ? '' : m === 1 ? 'x' : m === -1 ? '−x' : `${neg(m)}x`;
  if (!mx) return `y = ${neg(c)}`;
  return `y = ${mx}${c === 0 ? '' : sgn(c)}`;
}

const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [12, 16, 20], [20, 21, 29]];

export const Y8_FOCUS_GENERATORS = {
  // ---- Pythagoras: problem solving (red) -------------------------------------------------
  y8fPythagPS(level, rng) {
    const G = Y8_FOCUS_GENERATORS;
    if (level === 1) {
      const [a, b, c] = rng.pick(TRIPLES);
      const kind = rng.pick(['ladder', 'field', 'walk', 'screen']);
      if (kind === 'ladder') {
        return num(`A ${c} m ladder leans against a vertical wall. Its foot is ${a} m from the wall, on flat ground. How high up the wall does the ladder reach?`, b,
          `The wall, the ground and the ladder make a right-angled triangle; the ladder is the hypotenuse. Height² = ${c}² − ${a}² = ${c * c} − ${a * a} = ${b * b}, so the height is √${b * b} = ${b} m.`,
          ['Sketch it: wall, ground and ladder make a right-angled triangle. The ladder, opposite the right angle, is the hypotenuse.', `You want a shorter side, so SUBTRACT: ${c}² − ${a}² = ${c * c} − ${a * a} = ${b * b}.`, `√${b * b} = ${b} m.`],
          { unit: 'm', diagram: { type: 'righttri', left: '? (wall)', bottom: `${a} m`, hyp: `${c} m ladder` } });
      }
      if (kind === 'field') {
        const k = rng.pick([5, 10]);
        return num(`A rectangular field is ${b * k} m long and ${a * k} m wide. A path runs straight across it from one corner to the opposite corner. How long is the path?`, c * k,
          `The diagonal cuts the rectangle into two right-angled triangles. Path² = ${b * k}² + ${a * k}² = ${(b * k) ** 2} + ${(a * k) ** 2} = ${(c * k) ** 2}, so the path is ${c * k} m.`,
          ['The diagonal of a rectangle is the hypotenuse of a right-angled triangle made by two sides.', `ADD the squares: ${(b * k) ** 2} + ${(a * k) ** 2} = ${(c * k) ** 2}.`, `√${(c * k) ** 2} = ${c * k} m.`],
          { unit: 'm', diagram: { type: 'righttri', left: `${a * k} m`, bottom: `${b * k} m`, hyp: '? (path)' } });
      }
      if (kind === 'walk') {
        return num(`Leda walks ${b} km due north, then ${a} km due east. How far is she from where she started, in a straight line?`, c,
          `North and east are at right angles, so the straight-line distance is the hypotenuse: √(${b}² + ${a}²) = √${c * c} = ${c} km.`,
          ['North then east makes a right angle.', `${b}² + ${a}² = ${b * b} + ${a * a} = ${c * c}.`, `√${c * c} = ${c} km.`], { unit: 'km' });
      }
      return num(`A rectangular screen is ${b * 2} cm wide and ${a * 2} cm tall. Screens are measured by their diagonal. How long is this one’s diagonal?`, c * 2,
        `Diagonal² = ${b * 2}² + ${a * 2}² = ${(b * 2) ** 2} + ${(a * 2) ** 2} = ${(c * 2) ** 2}, so the diagonal is ${c * 2} cm.`,
        ['The diagonal is the hypotenuse of the right-angled triangle made by the width and height.', `${(b * 2) ** 2} + ${(a * 2) ** 2} = ${(c * 2) ** 2}.`, `√${(c * 2) ** 2} = ${c * 2} cm.`], { unit: 'cm' });
    }
    if (level === 2) {
      const kind = rng.pick(['ladder1dp', 'isosceles', 'coords', 'ramp']);
      if (kind === 'ladder1dp') {
        const L = rng.int(5, 9), foot = rng.int(4, 2 * L - 3) / 2; // half-metres, always shorter than the ladder
        const h2 = L * L - foot * foot, ans = root1dp(h2);
        if (!ans || foot >= L) return G.y8fPythagPS(level, rng);
        return num(`A ${L} m ladder leans against a wall with its foot ${foot} m from the wall. How high up the wall does it reach? Give your answer to 1 decimal place.`, ans,
          `Height² = ${L}² − ${foot}² = ${L * L} − ${foot * foot} = ${h2}. Height = √${h2} = ${Math.sqrt(h2).toFixed(4)}… ≈ ${ans} m.`,
          ['The ladder is the hypotenuse; the height is a shorter side, so subtract.', `${L}² − ${foot}² = ${h2}.`, `√${h2} = ${Math.sqrt(h2).toFixed(4)}…, so ${ans} m to 1 d.p.`],
          { unit: 'm', diagram: { type: 'righttri', left: '?', bottom: `${foot} m`, hyp: `${L} m` } });
      }
      if (kind === 'isosceles') {
        const [a, b, c] = rng.pick([[5, 12, 13], [3, 4, 5], [8, 15, 17], [6, 8, 10], [9, 12, 15], [12, 16, 20]]);
        return num(`An isosceles triangle has two sides of ${c} cm and a base of ${2 * a} cm. What is its perpendicular height?`, b,
          `The height cuts the base in half, making two right-angled triangles with hypotenuse ${c} cm and base ${a} cm. Height² = ${c}² − ${a}² = ${c * c - a * a}, so the height is ${b} cm.`,
          [`The height from the top meets the base at its midpoint: half the base is ${a} cm.`, `Right-angled triangle: hypotenuse ${c}, one side ${a}. Subtract: ${c * c} − ${a * a} = ${b * b}.`, `√${b * b} = ${b} cm.`],
          { unit: 'cm', diagram: { type: 'righttri', left: '? (height)', bottom: `${a} cm (half the base)`, hyp: `${c} cm` } });
      }
      if (kind === 'coords') {
        const x1 = rng.int(-5, 3), y1 = rng.int(-5, 3), dx = rng.int(2, 7), dy = rng.int(1, 7), d2 = dx * dx + dy * dy, ans = root1dp(d2);
        if (!ans) return G.y8fPythagPS(level, rng);
        return num(`Find the distance between A(${neg(x1)}, ${neg(y1)}) and B(${neg(x1 + dx)}, ${neg(y1 + dy)}). Give your answer to 1 decimal place.`, ans,
          `Across ${dx}, up ${dy}: AB = √(${dx}² + ${dy}²) = √${d2} = ${Math.sqrt(d2).toFixed(4)}… ≈ ${ans}.`,
          ['Draw a right-angled triangle with AB as the hypotenuse.', `Horizontal: ${neg(x1 + dx)} − ${paren(x1)} = ${dx}. Vertical: ${neg(y1 + dy)} − ${paren(y1)} = ${dy}.`, `√(${dx * dx} + ${dy * dy}) = √${d2} ≈ ${ans}.`]);
      }
      const run = rng.int(3, 12), rise = rng.pick([1, 1.5, 2]), r2 = run * run + rise * rise, ans = root1dp(r2);
      if (!ans) return G.y8fPythagPS(level, rng);
      return num(`A ramp rises ${rise} m over a horizontal distance of ${run} m. How long is the sloping surface of the ramp? Give your answer to 1 decimal place.`, ans,
        `Slope² = ${run}² + ${rise}² = ${run * run} + ${rise * rise} = ${r2}. Slope = √${r2} = ${Math.sqrt(r2).toFixed(4)}… ≈ ${ans} m.`,
        ['The sloping surface is the hypotenuse.', `ADD: ${run * run} + ${rise * rise} = ${r2}.`, `√${r2} ≈ ${ans} m.`], { unit: 'm', diagram: { type: 'righttri', left: `${rise} m`, bottom: `${run} m`, hyp: '?' } });
    }
    const kind = rng.pick(['perimeter', 'area', 'fits', 'rectangle']);
    if (kind === 'perimeter') {
      const [a, b, c] = rng.pick(TRIPLES);
      return num(`A right-angled triangle has a hypotenuse of ${c} cm and one other side of ${a} cm. Find its perimeter.`, a + b + c,
        `First the missing side: √(${c}² − ${a}²) = √${b * b} = ${b} cm. Perimeter = ${a} + ${b} + ${c} = ${a + b + c} cm.`,
        ['Two steps: find the missing side, then add all three.', `Missing side: ${c * c} − ${a * a} = ${b * b}, so ${b} cm.`, `Perimeter: ${a} + ${b} + ${c} = ${a + b + c} cm.`], { unit: 'cm' });
    }
    if (kind === 'area') {
      const [a, b, c] = rng.pick([[5, 12, 13], [3, 4, 5], [8, 15, 17], [6, 8, 10], [9, 12, 15]]);
      return num(`An isosceles triangle has sides ${c} cm, ${c} cm and ${2 * a} cm. Find its area.`, a * b,
        `Height: half the base is ${a}, so h = √(${c}² − ${a}²) = ${b} cm. Area = ½ × base × height = ½ × ${2 * a} × ${b} = ${a * b} cm².`,
        [`Split it down the middle: half the base is ${a} cm.`, `Height = √(${c * c} − ${a * a}) = ${b} cm.`, `Area = ½ × ${2 * a} × ${b} = ${a * b} cm².`], { unit: 'cm²' });
    }
    if (kind === 'fits') {
      const w = rng.int(6, 12) / 10, h = rng.int(8, 16) / 10, d2 = w * w + h * h, d = Math.sqrt(d2);
      const pole = Math.round((d + rng.pick([-0.15, -0.08, 0.06, 0.12])) * 10) / 10;
      if (Math.abs(pole - d) < 0.03) return G.y8fPythagPS(level, rng);
      const fits = pole <= d;
      return choice(`The bottom of a rectangular box is ${w.toFixed(1)} m by ${h.toFixed(1)} m. Will a straight ${pole.toFixed(1)} m rod lie flat on the bottom of the box?`, fits ? 'Yes' : 'No', [fits ? 'No' : 'Yes'], rng, {
        explain: `The longest straight line that fits flat is the diagonal of the base: √(${w.toFixed(1)}² + ${h.toFixed(1)}²) = √${d2.toFixed(2)} ≈ ${d.toFixed(2)} m. ${fits ? `${pole.toFixed(1)} m is shorter, so yes.` : `${pole.toFixed(1)} m is longer, so no.`}`,
        steps: ['The longest thing that fits is the diagonal.', `Diagonal = √(${(w * w).toFixed(2)} + ${(h * h).toFixed(2)}) ≈ ${d.toFixed(2)} m.`, `Compare with ${pole.toFixed(1)} m: ${fits ? 'it fits' : 'too long'}.`],
      });
    }
    const [a, b, c] = rng.pick(TRIPLES);
    return num(`A rectangle has a diagonal of ${c} cm and a width of ${a} cm. Find its area.`, a * b,
      `The length is √(${c}² − ${a}²) = √${b * b} = ${b} cm. Area = ${a} × ${b} = ${a * b} cm².`,
      ['The diagonal and two sides make a right-angled triangle.', `Length = √(${c * c} − ${a * a}) = ${b} cm.`, `Area = ${a} × ${b} = ${a * b} cm².`], { unit: 'cm²' });
  },

  // ---- reverse percentages (red) ------------------------------------------------------------
  y8fReversePct(level, rng) {
    const G = Y8_FOCUS_GENERATORS;
    if (level === 1) {
      const kind = rng.pick(['sale', 'rise', 'partof', 'which']);
      if (kind === 'sale') {
        const p = rng.pick([10, 20, 25, 30, 40, 50]), o = rng.int(3, 30) * 10, now = (o * (100 - p)) / 100;
        if (!Number.isInteger(now)) return G.y8fReversePct(level, rng);
        return num(`In a ${p}% off sale, a pair of trainers costs £${now}. What was the original price?`, o,
          `After ${p}% off, £${now} is ${100 - p}% of the original. 1% = £${now} ÷ ${100 - p}, so 100% = £${now} ÷ ${100 - p} × 100 = £${o}. (Or divide by the multiplier ${(100 - p) / 100}.)`,
          [`The sale price is ${100 - p}% of the ORIGINAL price.`, `1% of the original = £${now} ÷ ${100 - p} = ${money(o)}.`, `100% = £${o}. Check: ${p}% of £${o} is £${o - now}, and £${o} − £${o - now} = £${now}.`], { unit: '£', unitBefore: true });
      }
      if (kind === 'rise') {
        const p = rng.pick([5, 10, 20, 25]), o = rng.int(10, 60) * 20, now = (o * (100 + p)) / 100;
        if (!Number.isInteger(now)) return G.y8fReversePct(level, rng);
        return num(`After a ${p}% pay rise, Iris earns £${comma(now)} a month. What did she earn before the rise?`, o,
          `£${comma(now)} is ${100 + p}% of her old pay. Divide by the multiplier ${(100 + p) / 100}: £${comma(now)} ÷ ${(100 + p) / 100} = £${comma(o)}.`,
          [`Old pay = 100%; new pay = ${100 + p}%.`, `So £${comma(now)} = ${100 + p}% and 1% = £${comma(now)} ÷ ${100 + p}.`, `100% = £${comma(o)}.`], { unit: '£', unitBefore: true });
      }
      if (kind === 'partof') {
        const p = rng.pick([5, 15, 20, 35, 40, 45, 60, 75]), whole = rng.int(2, 20) * 20, part = (whole * p) / 100;
        if (!Number.isInteger(part)) return G.y8fReversePct(level, rng);
        return num(`${p}% of a number is ${part}. What is the number?`, whole, `${part} is ${p}%, so 1% is ${part} ÷ ${p} and 100% is ${part} ÷ ${p} × 100 = ${whole}.`,
          [`${p}% → ${part}.`, `1% → ${part} ÷ ${p}.`, `100% → ${whole}.`]);
      }
      const p = rng.pick([15, 20, 25, 40]), up = rng.chance(0.5), now = rng.int(4, 20) * 10, m = up ? (100 + p) / 100 : (100 - p) / 100, m2 = up ? (100 - p) / 100 : (100 + p) / 100;
      return choice(`A price after a ${p}% ${up ? 'increase' : 'decrease'} is £${now}. Which calculation gives the original price?`, `£${now} ÷ ${m}`, [`£${now} × ${m}`, `£${now} ÷ ${m2}`, `£${now} ${up ? '−' : '+'} ${p}% of £${now}`, `£${now} × ${m2}`], rng, {
        explain: `The new price is ${up ? 100 + p : 100 - p}% of the original, so new = original × ${m}. To go back, DIVIDE by ${m}. Taking ${p}% of the new price is the classic mistake: the ${p}% was of the original.`,
        steps: [`New = original × ${m}.`, `Undo a multiplication by dividing: original = new ÷ ${m}.`, `£${now} ÷ ${m}.`],
      });
    }
    if (level === 2) {
      const kind = rng.pick(['vat', 'population', 'mistake']);
      if (kind === 'vat') {
        const o = rng.int(8, 60) * 5, now = (o * 120) / 100;
        return num(`A bike costs £${now} including VAT at 20%. What is the price before VAT?`, o,
          `Including VAT is 120% of the price before VAT: £${now} ÷ 1.2 = £${o}. (Not £${now} − 20% of £${now}: that 20% would be of the wrong amount.)`,
          ['Price before VAT = 100%; with VAT = 120%.', `£${now} ÷ 1.2 = £${o}.`, `Check: 20% of £${o} is £${o / 5}, and £${o} + £${o / 5} = £${now}.`], { unit: '£', unitBefore: true });
      }
      if (kind === 'population') {
        const p = rng.pick([4, 5, 8, 12, 15, 35]), o = rng.int(2, 40) * 500, down = rng.chance(0.5), now = (o * (down ? 100 - p : 100 + p)) / 100;
        if (!Number.isInteger(now)) return G.y8fReversePct(level, rng);
        return num(`The number of visitors to a museum ${down ? 'fell' : 'rose'} by ${p}% to ${comma(now)}. How many visitors were there before?`, o,
          `${comma(now)} is ${down ? 100 - p : 100 + p}% of the old number: ${comma(now)} ÷ ${(down ? 100 - p : 100 + p) / 100} = ${comma(o)}.`,
          [`Multiplier: ${(down ? 100 - p : 100 + p) / 100}.`, `Old × ${(down ? 100 - p : 100 + p) / 100} = ${comma(now)}.`, `Old = ${comma(now)} ÷ ${(down ? 100 - p : 100 + p) / 100} = ${comma(o)}.`]);
      }
      const p = rng.pick([20, 25, 10]), o = rng.int(4, 30) * 20, now = (o * (100 - p)) / 100, wrong = now + (now * p) / 100;
      if (!Number.isInteger(wrong) || wrong === o) return G.y8fReversePct(level, rng);
      return num(`Dan says: “The sale price is £${now} after ${p}% off, so the original was £${now} + ${p}% of £${now} = £${wrong}.” What was the original price really?`, o,
        `Dan took ${p}% of the SALE price, but the ${p}% was taken off the original. £${now} is ${100 - p}% of the original, so the original is £${now} ÷ ${(100 - p) / 100} = £${o}.`,
        [`£${now} is ${100 - p}% of the original.`, `Original = £${now} ÷ ${(100 - p) / 100}.`, `= £${o}. Check: ${p}% of £${o} is £${o - now}; £${o} − £${o - now} = £${now}. Dan’s £${wrong} fails this check.`], { unit: '£', unitBefore: true });
    }
    const kind = rng.pick(['twostep', 'profit', 'saved']);
    if (kind === 'twostep') {
      const a = rng.pick([10, 20, 25, 50]), b = rng.pick([10, 20, 25]), o = rng.int(2, 30) * 20, now = (o * (100 + a) * (100 - b)) / 10000;
      if (!Number.isInteger(now)) return G.y8fReversePct(level, rng);
      const m = ((100 + a) * (100 - b)) / 10000;
      return num(`A price is increased by ${a}%, then reduced by ${b}% in a sale. It now costs £${now}. What was the original price?`, o,
        `Overall multiplier: ${(100 + a) / 100} × ${(100 - b) / 100} = ${m}. Original = £${now} ÷ ${m} = £${o}.`,
        [`Up ${a}%: × ${(100 + a) / 100}. Down ${b}%: × ${(100 - b) / 100}.`, `Together: × ${m}.`, `Original = £${now} ÷ ${m} = £${o}.`], { unit: '£', unitBefore: true });
    }
    if (kind === 'profit') {
      const p = rng.pick([20, 25, 30, 40, 60]), cost = rng.int(2, 40) * 5, sell = (cost * (100 + p)) / 100;
      if (!Number.isInteger(sell)) return G.y8fReversePct(level, rng);
      return num(`A shop sells a lamp for £${sell}, making a ${p}% profit on what it paid. What did the shop pay for the lamp?`, cost,
        `Profit is a percentage of the cost price, so £${sell} is ${100 + p}% of the cost: £${sell} ÷ ${(100 + p) / 100} = £${cost}.`,
        ['Cost price = 100%.', `Selling price = ${100 + p}% = £${sell}.`, `Cost = £${sell} ÷ ${(100 + p) / 100} = £${cost}.`], { unit: '£', unitBefore: true });
    }
    const p = rng.pick([15, 20, 30, 35, 40]), o = rng.int(5, 40) * 20, now = (o * (100 - p)) / 100;
    if (!Number.isInteger(now)) return G.y8fReversePct(level, rng);
    return num(`A tablet is reduced by ${p}% to £${now}. How much money is saved?`, o - now,
      `First find the original: £${now} ÷ ${(100 - p) / 100} = £${o}. Saving = £${o} − £${now} = £${o - now}.`,
      [`£${now} is ${100 - p}% of the original.`, `Original = £${now} ÷ ${(100 - p) / 100} = £${o}.`, `Saving = £${o - now} (which is ${p}% of £${o}).`], { unit: '£', unitBefore: true });
  },

  // ---- drawing linear graphs and parallel lines (amber) -------------------------------------
  y8fLinearGraphs(level, rng) {
    const G = Y8_FOCUS_GENERATORS;
    const m = rng.pick([-3, -2, -1, 1, 2, 3, 4]), c = rng.int(-5, 6);
    if (level === 1) {
      const kind = rng.pick(['table', 'onLine', 'vertical']);
      if (kind === 'table') {
        const x = rng.int(-3, 4);
        return num(`To draw y = ${lineEq(m, c).slice(4)}, Zoe makes a table of values. What is y when x = ${neg(x)}?`, m * x + c,
          `Substitute x = ${neg(x)}: y = ${neg(m)} × ${paren(x)}${sgn(c)} = ${neg(m * x)}${sgn(c)} = ${neg(m * x + c)}.`,
          [`Replace x with ${paren(x)}.`, `${neg(m)} × ${paren(x)} = ${neg(m * x)}.`, `${neg(m * x)}${sgn(c)} = ${neg(m * x + c)}. Plot (${neg(x)}, ${neg(m * x + c)}).`]);
      }
      if (kind === 'onLine') {
        const x = rng.int(-2, 4), y = m * x + c;
        return choice(`Which point lies on the line ${lineEq(m, c)}?`, `(${neg(x)}, ${neg(y)})`, [`(${neg(y)}, ${neg(x)})`, `(${neg(x)}, ${neg(y + 1)})`, `(${neg(x + 1)}, ${neg(y - 1)})`, `(0, ${neg(c + 1)})`], rng, {
          explain: `Put x = ${neg(x)} into the equation: y = ${neg(m * x + c)}. So (${neg(x)}, ${neg(y)}) is on the line.`,
          steps: ['A point is on a line if its x and y fit the equation.', `x = ${neg(x)} gives y = ${neg(y)}.`, `(${neg(x)}, ${neg(y)}).`],
        });
      }
      const k = rng.pick([-4, -3, -2, 2, 3, 5]), vert = rng.chance(0.5);
      return choice(`Which of these lines is ${vert ? 'vertical' : 'horizontal'}?`, vert ? `x = ${neg(k)}` : `y = ${neg(k)}`, [vert ? `y = ${neg(k)}` : `x = ${neg(k)}`, `y = ${neg(k)}x`, `y = x${sgn(k)}`], rng, {
        explain: vert ? `On x = ${neg(k)} every point has x-coordinate ${neg(k)}, whatever y is: a vertical line through ${neg(k)} on the x-axis.` : `On y = ${neg(k)} every point has y-coordinate ${neg(k)}: a horizontal line through ${neg(k)} on the y-axis.`,
        steps: ['x = a number: every point has that x, so the line goes straight up and down.', 'y = a number: every point has that y, so the line goes straight across.', vert ? `x = ${neg(k)} is vertical.` : `y = ${neg(k)} is horizontal.`],
      });
    }
    if (level === 2) {
      const kind = rng.pick(['parallel', 'xint', 'picture', 'rearrParallel']);
      if (kind === 'parallel') {
        const c2 = c === 2 ? -3 : 2;
        return choice(`Which line is parallel to ${lineEq(m, c)}?`, lineEq(m, c2), [lineEq(-m, c), lineEq(c2 === 0 ? 1 : c2, m), lineEq(F(1, Math.abs(m) === 1 ? 2 : m), c)], rng, {
          explain: `Parallel lines have the same gradient. ${lineEq(m, c)} has gradient ${neg(m)}, and so does ${lineEq(m, c2)}: only the y-intercept is different.`,
          steps: ['Parallel lines never meet: they have the same steepness.', `The gradient of ${lineEq(m, c)} is ${neg(m)} (the number in front of x).`, `Look for gradient ${neg(m)}: ${lineEq(m, c2)}.`],
        });
      }
      if (kind === 'xint') {
        const X = rng.int(-4, 5), mm = rng.pick([1, 2, 3, -2, 4]), cc = -mm * X;
        if (cc === 0) return G.y8fLinearGraphs(level, rng);
        return num(`Where does ${lineEq(mm, cc)} cross the x-axis? Give the x-value.`, X,
          `On the x-axis y = 0: 0 = ${neg(mm)}x${sgn(cc)}, so ${neg(mm)}x = ${neg(-cc)} and x = ${neg(X)}.`,
          ['Every point on the x-axis has y = 0.', `0 = ${neg(mm)}x${sgn(cc)}.`, `x = ${neg(X)}. (Plotting both intercepts is a quick way to draw a line.)`]);
      }
      if (kind === 'picture') {
        const mm = rng.pick([-2, -1, 1, 2, 3]), cc = rng.int(-3, 3);
        return choice('Which equation matches the line drawn?', lineEq(mm, cc), [lineEq(-mm, cc), lineEq(mm, cc === 0 ? 2 : -cc), lineEq(mm === 1 ? 2 : 1, cc)], rng, {
          explain: `It crosses the y-axis at ${neg(cc)} (c = ${neg(cc)}) and goes ${mm > 0 ? 'up' : 'down'} ${Math.abs(mm)} for every 1 to the right (m = ${neg(mm)}): ${lineEq(mm, cc)}.`,
          steps: [`y-intercept: ${neg(cc)}.`, `Gradient: ${mm > 0 ? 'up' : 'down'} ${Math.abs(mm)} for each 1 across = ${neg(mm)}.`, lineEq(mm, cc)],
          diagram: { type: 'graph', range: [-6, 6], lines: [{ m: mm, c: cc }] },
        });
      }
      const k = rng.pick([2, 3]), mm = rng.pick([1, 2, -1, 3]), cc = rng.int(-4, 4);
      return choice(`Which line is parallel to ${k}y = ${neg(k * mm)}x${sgn(k * cc + 1)}?`.replace(/= 1x/, '= x').replace(/= −1x/, '= −x'), lineEq(mm, cc - 2 === 0 ? 3 : cc - 2), [lineEq(k * mm, cc), lineEq(-mm, cc), lineEq(F(mm, k), cc)], rng, {
        explain: `Rearrange into y = mx + c by dividing by ${k}: the gradient is ${neg(mm)}. A parallel line has gradient ${neg(mm)}.`,
        steps: [`Divide everything by ${k} to get y on its own.`, `The gradient is ${neg(k * mm)} ÷ ${k} = ${neg(mm)}.`, `Parallel: gradient ${neg(mm)}.`],
      });
    }
    const kind = rng.pick(['throughPoint', 'areParallel', 'intercepts']);
    if (kind === 'throughPoint') {
      const x0 = rng.int(-3, 4), y0 = rng.int(-6, 8), cc = y0 - m * x0;
      return choice(`Which line is parallel to ${lineEq(m, c)} and passes through (${neg(x0)}, ${neg(y0)})?`, lineEq(m, cc), [lineEq(m, c), lineEq(m, y0), lineEq(-m, y0 + m * x0), lineEq(m, cc + 2)], rng, {
        explain: `Same gradient, ${neg(m)}. Then ${neg(y0)} = ${neg(m)} × ${paren(x0)} + c gives c = ${neg(cc)}: ${lineEq(m, cc)}.`,
        steps: [`Parallel, so m = ${neg(m)}: y = ${neg(m)}x + c.`, `Substitute (${neg(x0)}, ${neg(y0)}): ${neg(y0)} = ${neg(m * x0)} + c.`, `c = ${neg(cc)}: ${lineEq(m, cc)}.`],
      });
    }
    if (kind === 'areParallel') {
      const yes = rng.chance(0.5), a = rng.pick([2, 3, 4]), mm = rng.pick([1, 2, 3]), c1 = rng.int(1, 6), c2 = rng.int(-5, 5);
      const m2 = yes ? mm : mm + 1;
      return choice(`Are the lines ${a}y = ${a * mm}x + ${a * c1} and y − ${m2 === 1 ? '' : m2}x = ${neg(c2)} parallel?`, yes ? 'Yes' : 'No', [yes ? 'No' : 'Yes'], rng, {
        explain: `Rearrange both into y = mx + c. The first: ${lineEq(mm, c1)}, gradient ${mm}. The second: ${lineEq(m2, c2)}, gradient ${m2}. ${yes ? 'Same gradient: parallel.' : 'Different gradients: not parallel.'}`,
        steps: [`First line ÷ ${a}: gradient ${mm}.`, `Second line: add ${m2 === 1 ? '' : m2}x to both sides: gradient ${m2}.`, yes ? 'Equal gradients: parallel.' : 'Different gradients: they will cross.'],
      });
    }
    const a = rng.pick([2, 3, 4, 5]), b = rng.pick([2, 3, 4, 5, 6]), k = a * b * rng.pick([1, 2]);
    return pairQ(`To draw ${a}x + ${b}y = ${k}, find where it crosses the x-axis. Give the point as (x, y).`, [k / a, 0],
      `On the x-axis y = 0, so ${a}x = ${k} and x = ${k / a}: the point (${k / a}, 0). (It crosses the y-axis at (0, ${k / b}). Join the two points to draw it.)`,
      ['On the x-axis, y = 0.', `${a}x = ${k}, so x = ${k / a}.`, `(${k / a}, 0); and x = 0 gives (0, ${k / b}).`]);
  },

  // ---- gradient and y-intercept (amber) -----------------------------------------------------
  y8fGradient(level, rng) {
    const G = Y8_FOCUS_GENERATORS;
    if (level === 1) {
      const kind = rng.pick(['backwards', 'noC', 'write', 'context']);
      if (kind === 'backwards') {
        const m = rng.pick([-4, -3, -2, 2, 3, 5]), c = rng.int(1, 9), askM = rng.chance(0.5);
        return num(`What is the ${askM ? 'gradient' : 'y-intercept'} of y = ${c}${sgn(m).replace(/ (\d+)$/, ' $1')}x?`.replace(/([+−]) 1x/, '$1 x'), askM ? m : c,
          `Reorder as y = ${neg(m)}x + ${c}. ${askM ? `The gradient is the number multiplying x: ${neg(m)} (keep its sign).` : `The y-intercept is the number on its own: ${c}.`}`,
          ['The order does not matter: rewrite as y = mx + c.', `y = ${neg(m)}x + ${c}.`, askM ? `m = ${neg(m)}.` : `c = ${c}.`]);
      }
      if (kind === 'noC') {
        const m = rng.pick([2, 3, -4, 5, -1]);
        return num(`Where does y = ${neg(m)}x cross the y-axis? Give the y-value.`.replace('y = 1x', 'y = x').replace('y = −1x', 'y = −x'), 0,
          `There is no number added, so c = 0: the line passes through the origin (0, 0).`, ['y = mx + c with nothing added means c = 0.', 'At x = 0, y = 0.', 'It crosses at 0: through the origin.']);
      }
      if (kind === 'write') {
        const m = rng.pick([-3, -2, 2, 3, 4, 5]), c = rng.pick([-5, -4, -2, -1, 1, 3, 6]);
        return choice(`A line has gradient ${neg(m)} and crosses the y-axis at (0, ${neg(c)}). What is its equation?`, lineEq(m, c), [lineEq(c, m), lineEq(-m, c), lineEq(m, -c), `x = ${neg(m)}y${sgn(c)}`], rng, {
          explain: `In y = mx + c, m is the gradient (${neg(m)}) and c the y-intercept (${neg(c)}): ${lineEq(m, c)}.`,
          steps: ['y = mx + c.', `m = ${neg(m)}, c = ${neg(c)}.`, lineEq(m, c)],
        });
      }
      const rate = rng.pick([2, 3, 4]), fixed = rng.pick([3, 4, 5]);
      const askRate = rng.chance(0.5);
      return choice(`A taxi’s fare is C = ${rate}d + ${fixed}, where C is the cost in pounds and d is the distance in miles. What does the ${askRate ? rate : fixed} tell you?`,
        askRate ? `Each mile costs £${rate}` : `There is a fixed charge of £${fixed}`, askRate ? [`There is a fixed charge of £${rate}`, `The taxi travels ${rate} miles`, `The whole fare is £${rate}`] : [`Each mile costs £${fixed}`, `The journey is ${fixed} miles`, `The fare goes up by £${fixed} a mile`], rng, {
          explain: `C = ${rate}d + ${fixed} is a straight line: the gradient ${rate} is the rate (£${rate} for each extra mile) and the intercept ${fixed} is the cost when d = 0 (a fixed charge of £${fixed}).`,
          steps: ['Gradient = how much C goes up for each 1 that d goes up.', `So the ${rate} means £${rate} per mile.`, `The ${fixed} is C when d = 0: the fixed charge.`],
        });
    }
    if (level === 2) {
      const kind = rng.pick(['graph', 'twopoints', 'rearranged']);
      if (kind === 'graph') {
        const m = rng.pick([F(2), F(-1), F(3), F(-2), F(1, 2), F(-1, 2), F(1, 3)]), c = rng.int(-3, 3);
        return fracQ('What is the gradient of the line drawn?', m,
          `Pick two points where the line crosses grid corners. For every ${m.d} to the right it goes ${m.n > 0 ? 'up' : 'down'} ${Math.abs(m.n)}: gradient = ${m.n > 0 ? '' : '−'}${Math.abs(m.n)} ÷ ${m.d} = ${tex(m)}.`,
          ['Find two points on the line exactly on grid corners.', `Going right ${m.d}, it goes ${m.n > 0 ? 'up' : 'down'} ${Math.abs(m.n)}.`, `Gradient = up ÷ across = ${tex(m)}${m.n < 0 ? ' (negative: it slopes down)' : ''}.`],
          { diagram: { type: 'graph', range: [-6, 6], lines: [{ m: m.n / m.d, c }] } });
      }
      if (kind === 'twopoints') {
        const x1 = rng.int(-4, 3), y1 = rng.int(-5, 5), dx = rng.int(1, 5), dy = rng.int(-8, 8);
        if (dy === 0) return G.y8fGradient(level, rng);
        const g = F(dy, dx);
        return fracQ(`Find the gradient of the line through (${neg(x1)}, ${neg(y1)}) and (${neg(x1 + dx)}, ${neg(y1 + dy)}).`, g,
          `Gradient = change in y ÷ change in x = (${neg(y1 + dy)} − ${paren(y1)}) ÷ (${neg(x1 + dx)} − ${paren(x1)}) = ${neg(dy)} ÷ ${dx} = ${tex(g)}.`,
          ['Gradient = (y₂ − y₁) ÷ (x₂ − x₁).', `y: ${neg(y1 + dy)} − ${paren(y1)} = ${neg(dy)}; x: ${neg(x1 + dx)} − ${paren(x1)} = ${dx}.`, `${neg(dy)} ÷ ${dx} = ${tex(g)}.`]);
      }
      const [eq, g, how] = rng.pick([
        ['3x + 2y = 8', F(-3, 2), '2y = −3x + 8, so y = −{{3/2}}x + 4'],
        ['2y − 6x = 5', F(3), '2y = 6x + 5, so y = 3x + {{5/2}}'],
        ['x + 4y = 12', F(-1, 4), '4y = −x + 12, so y = −{{1/4}}x + 3'],
        ['5x − y = 2', F(5), 'y = 5x − 2'],
        ['6x + 3y = 9', F(-2), '3y = −6x + 9, so y = −2x + 3'],
      ]);
      return fracQ(`What is the gradient of the line ${eq}?`, g, `Rearrange to y = mx + c: ${how}. The gradient is ${tex(g)}.`, ['Get y on its own.', how, `m = ${tex(g)}.`]);
    }
    const kind = rng.pick(['equation', 'interceptFromPoint', 'compare']);
    if (kind === 'equation') {
      const m = rng.pick([-3, -2, -1, 2, 3, 4]), c = rng.int(-5, 6), x1 = rng.int(-2, 2), x2 = x1 + rng.int(1, 3);
      const y1 = m * x1 + c, y2 = m * x2 + c;
      return choice(`Find the equation of the line through (${neg(x1)}, ${neg(y1)}) and (${neg(x2)}, ${neg(y2)}).`, lineEq(m, c), [lineEq(m, y1), lineEq(-m, c), lineEq(F(1, m), c), lineEq(m, c + 1)], rng, {
        explain: `Gradient = (${neg(y2)} − ${paren(y1)}) ÷ (${neg(x2)} − ${paren(x1)}) = ${neg(y2 - y1)} ÷ ${x2 - x1} = ${neg(m)}. Then ${neg(y1)} = ${neg(m)} × ${paren(x1)} + c gives c = ${neg(c)}.`,
        steps: [`Gradient: ${neg(y2 - y1)} ÷ ${x2 - x1} = ${neg(m)}.`, `Substitute (${neg(x1)}, ${neg(y1)}) into y = ${neg(m)}x + c.`, `c = ${neg(c)}: ${lineEq(m, c)}.`],
      });
    }
    if (kind === 'interceptFromPoint') {
      const m = rng.pick([-3, -2, 2, 3, 5]), x0 = rng.int(1, 5), c = rng.int(-6, 8), y0 = m * x0 + c;
      return num(`A line with gradient ${neg(m)} passes through (${x0}, ${neg(y0)}). What is its y-intercept?`, c,
        `y = ${neg(m)}x + c. Substitute: ${neg(y0)} = ${neg(m)} × ${x0} + c = ${neg(m * x0)} + c, so c = ${neg(y0)} − ${paren(m * x0)} = ${neg(c)}.`,
        [`Start with y = ${neg(m)}x + c.`, `Put in x = ${x0}, y = ${neg(y0)}: ${neg(y0)} = ${neg(m * x0)} + c.`, `c = ${neg(c)}.`]);
    }
    const a = rng.pick([2, 3, 4]), b = rng.pick([-3, -2, -1, 1]), c1 = rng.int(1, 4), c2 = rng.int(-4, -1);
    return choice(`Which line is steeper: y = ${a}x${sgn(c1)} or y = ${neg(b)}x${sgn(c2)}?`.replace(' 1x', ' x').replace('−1x', '−x'), `y = ${a}x${sgn(c1)}`, [`y = ${neg(b)}x${sgn(c2)}`.replace('−1x', '−x').replace(' 1x', ' x'), 'They are equally steep'], rng, {
      explain: `Steepness is the size of the gradient, ignoring its sign: ${a} against ${Math.abs(b)}. ${a} > ${Math.abs(b)}, so y = ${a}x${sgn(c1)} is steeper. The intercepts do not affect steepness.`,
      steps: ['Compare the gradients (the numbers in front of x).', `Sizes: ${a} and ${Math.abs(b)} (a minus sign only means it slopes down).`, `${a} is bigger: steeper.`],
    });
  },

  // ---- estimation (amber, alongside y8nEstimate) --------------------------------------------
  y8fEstimate(level, rng) {
    const G = Y8_FOCUS_GENERATORS;
    if (level === 1) {
      const kind = rng.pick(['round', 'sqrt']);
      if (kind === 'round') {
        const [n, r] = rng.pick([[0.0473, '0.05'], [3.82, '4'], [68.9, '70'], [0.316, '0.3'], [251, '300'], [7462, '7000'], [0.0081, '0.008'], [15.6, '20'], [948, '900'], [0.649, '0.6']]);
        return num(`Round ${n} to 1 significant figure.`, r, `The first non-zero digit is the first significant figure. Look at the next digit to decide whether to round up: ${n} ≈ ${r}.`,
          ['Find the first digit that is not zero.', 'Look at the digit after it: 5 or more rounds up.', `${n} ≈ ${r}.`]);
      }
      const s = rng.pick([20, 30, 40, 50, 60, 70, 80, 90, 110, 130, 150]), lo = Math.floor(Math.sqrt(s));
      return choice(`√${s} lies between which two whole numbers?`, `${lo} and ${lo + 1}`, [`${lo - 1} and ${lo}`, `${lo + 1} and ${lo + 2}`, `${Math.floor(s / 2) - 1} and ${Math.floor(s / 2)}`], rng, {
        explain: `${lo}² = ${lo * lo} and ${lo + 1}² = ${(lo + 1) ** 2}. ${s} is between them, so √${s} is between ${lo} and ${lo + 1}${s - lo * lo < (lo + 1) ** 2 - s ? `, nearer ${lo}` : `, nearer ${lo + 1}`}.`,
        steps: ['List square numbers near it.', `${lo * lo} < ${s} < ${(lo + 1) ** 2}.`, `So ${lo} < √${s} < ${lo + 1}.`],
      });
    }
    if (level === 2) {
      const kind = rng.pick(['decimalDiv', 'money']);
      if (kind === 'decimalDiv') {
        const [a, ar] = rng.pick([[38.7, 40], [61.2, 60], [19.4, 20], [82.3, 80], [297, 300]]), [b, br] = rng.pick([[0.48, 0.5], [0.21, 0.2], [0.53, 0.5], [0.19, 0.2], [0.096, 0.1]]);
        const est = Math.round(ar / br);
        return num(`Estimate ${a} ÷ ${b} by rounding each number to 1 significant figure.`, est,
          `${a} ≈ ${ar} and ${b} ≈ ${br}. ${ar} ÷ ${br} = ${est}. Dividing by a number less than 1 makes the answer BIGGER.`,
          [`Round: ${a} ≈ ${ar}, ${b} ≈ ${br}.`, `${ar} ÷ ${br}: how many ${br}s make ${ar}?`, `${est}: more than ${ar}, because ${br} is less than 1.`]);
      }
      const n = rng.int(3, 9), p = rng.pick([1.97, 2.99, 4.95, 3.49, 6.98]), r = Math.round(p);
      return num(`Estimate the cost of ${n} items at £${p.toFixed(2)} each. Give your estimate in pounds.`, n * r,
        `£${p.toFixed(2)} ≈ £${r}, so ${n} × £${r} = £${n * r}. (The real total is a little ${p < r ? 'less' : 'more'}.)`,
        [`Round £${p.toFixed(2)} to £${r}.`, `${n} × £${r} = £${n * r}.`, `Estimate: about £${n * r}.`], { unit: '£', unitBefore: true });
    }
    const kind = rng.pick(['overUnder', 'check']);
    if (kind === 'overUnder') {
      const [q, ans, why] = rng.pick([
        ['Mia estimates 38.6 × 4.2 as 40 × 4. Is her estimate bigger or smaller than the exact answer?', 'It cannot be sure from rounding alone: check it', '38.6 was rounded UP and 4.2 was rounded DOWN, so the effects pull in opposite ways. (Here 40 × 4 = 160 and the exact answer is 162.12, so it is slightly smaller.)'],
        ['Theo estimates 6.7 × 8.8 as 7 × 9. Is his estimate bigger or smaller than the exact answer?', 'Bigger', 'Both numbers were rounded UP, so the estimate (63) is bigger than the exact answer (58.96).'],
        ['Ada estimates 41.2 ÷ 7.9 as 40 ÷ 8. Is her estimate bigger or smaller than the exact answer?', 'Smaller', 'The number divided was rounded DOWN (smaller) and the divisor UP (bigger): both make the answer smaller. 40 ÷ 8 = 5; exactly it is 5.21…'],
        ['Kit estimates 3.2 × 5.1 as 3 × 5. Is his estimate bigger or smaller than the exact answer?', 'Smaller', 'Both numbers were rounded DOWN, so 15 is smaller than the exact answer, 16.32.'],
      ]);
      const opts = ['Bigger', 'Smaller', 'It cannot be sure from rounding alone: check it'];
      return choice(q, ans, opts.filter((o) => o !== ans), rng, { explain: why, steps: ['Look at whether each number was rounded up or down.', 'In a product, rounding both up gives an overestimate; both down, an underestimate.', 'In a division, rounding the divisor up makes the answer smaller.'] });
    }
    const a = rng.int(21, 89), b = rng.int(21, 89), exact = a * b, wrong = exact * 10, sr = (n) => Math.round(n / 10) * 10;
    return choice(`Sam works out ${a} × ${b} and gets ${comma(wrong)}. Use an estimate to decide whether this is sensible.`, `Not sensible: it should be about ${comma(sr(a) * sr(b))}`, [`Sensible: it is close to ${comma(sr(a) * sr(b) * 10)}`, 'Sensible: big numbers make big answers', `Not sensible: it should be about ${comma(sr(a) * sr(b) * 100)}`], rng, {
      explain: `${a} ≈ ${sr(a)} and ${b} ≈ ${sr(b)}, so the answer is about ${comma(sr(a) * sr(b))}. ${comma(wrong)} is ten times too big: the exact answer is ${comma(exact)}.`,
      steps: [`Round: ${a} ≈ ${sr(a)}, ${b} ≈ ${sr(b)}.`, `${sr(a)} × ${sr(b)} = ${comma(sr(a) * sr(b))}.`, `${comma(wrong)} is about ten times that: not sensible.`],
    });
  },

  // ---- lines of symmetry (amber) ------------------------------------------------------------
  y8fSymmetry(level, rng) {
    const SHAPES = [
      ['square', 4, 4], ['rectangle', 2, 2], ['rhombus', 2, 2], ['parallelogram', 0, 2], ['kite', 1, 1], ['isosceles trapezium', 1, 1],
      ['equilateral triangle', 3, 3], ['isosceles triangle', 1, 1], ['scalene triangle', 0, 1],
      ['regular pentagon', 5, 5], ['regular hexagon', 6, 6], ['regular octagon', 8, 8],
    ];
    const SIDES = { 'regular pentagon': 5, 'regular hexagon': 6, 'regular octagon': 8, 'equilateral triangle': 3, square: 4 };
    if (level === 1) {
      const [name, lines] = rng.pick(SHAPES);
      const pic = SIDES[name] ? { diagram: { type: 'polygon', sides: SIDES[name], numbered: false, name } } : {};
      return num(`How many lines of symmetry does ${an(name)} have?`, lines,
        `${an(name)[0].toUpperCase() + an(name).slice(1)} has ${lines === 0 ? 'no lines' : lines === 1 ? '1 line' : `${lines} lines`} of symmetry.${name === 'rectangle' ? ' (Not the diagonals: fold a rectangle along a diagonal and the corners do not meet.)' : ''}${name === 'parallelogram' ? ' Folding along a diagonal or through the middle never matches, though it does have rotational symmetry of order 2.' : ''}${name.startsWith('regular') ? ' A regular polygon has as many lines of symmetry as it has sides.' : ''}`,
        ['A line of symmetry is a fold line where both halves match exactly.', 'Imagine folding along each possible line: through corners, and through the middles of sides.', `${name}: ${lines}.`], pic);
    }
    if (level === 2) {
      const kind = rng.pick(['rotational', 'which', 'regular']);
      if (kind === 'rotational') {
        const [name, , order] = rng.pick(SHAPES);
        return num(`What is the order of rotational symmetry of ${an(name)}?`, order,
          `Turn it through a full circle: it looks exactly the same ${order} time${order === 1 ? '' : 's'}${order === 1 ? ' (only back at the start), so it has no rotational symmetry: order 1' : ''}.`,
          ['Order of rotational symmetry = how many times it fits onto itself in one full turn.', 'Every shape fits once, at the end of the turn, so the smallest order is 1.', `${name}: order ${order}.`]);
      }
      if (kind === 'which') {
        const unique = SHAPES.filter(([n, l, o]) => SHAPES.filter(([, l2, o2]) => l2 === l && o2 === o).length === 1);
        const [name, l, o] = rng.pick(unique);
        const wrongs = rng.shuffle(SHAPES.filter(([n2, l2, o2]) => n2 !== name && !(l2 === l && o2 === o))).slice(0, 3).map(([n2]) => n2);
        return choice(`Which shape has ${l === 0 ? 'no lines' : l === 1 ? 'exactly 1 line' : `${l} lines`} of symmetry and rotational symmetry of order ${o}?`, name, wrongs, rng, {
          explain: `${an(name)[0].toUpperCase() + an(name).slice(1)} has ${l} line${l === 1 ? '' : 's'} of symmetry and rotational symmetry of order ${o}.`,
          steps: ['Check lines of symmetry first (fold lines).', 'Then count how many times it fits onto itself in one full turn.', `Only the ${name} has both.`],
        });
      }
      const n = rng.pick([5, 6, 7, 8, 9, 10, 12]);
      return num(`A regular polygon has ${n} lines of symmetry. How many sides does it have?`, n, `A regular polygon has the same number of lines of symmetry as sides: ${n}. (Its rotational symmetry is order ${n} too.)`,
        ['Regular polygon: all sides and angles equal.', 'Each line of symmetry goes through a corner or the middle of a side.', `${n} lines → ${n} sides.`]);
    }
    const a = rng.int(-6, 6), b = rng.int(-6, 6), k = rng.pick([-3, -2, -1, 1, 2, 3, 4]);
    const kind = rng.pick(['yaxis', 'xaxis', 'xk', 'yk', 'yx']);
    // a point on the mirror line reflects onto itself: no puzzle
    if ((kind === 'yaxis' && a === 0) || (kind === 'xaxis' && b === 0) || (kind === 'xk' && a === k) || (kind === 'yk' && b === k)) return Y8_FOCUS_GENERATORS.y8fSymmetry(level, rng);
    if (kind === 'yaxis') return pairQ(`A shape has a vertex at (${neg(a)}, ${neg(b)}). It is reflected in the y-axis. Where is the image of that vertex?`, [-a, b], `Reflecting in the y-axis keeps y and changes the sign of x: (${neg(-a)}, ${neg(b)}).`, ['The mirror line is the y-axis (x = 0).', 'The point stays the same height and moves to the same distance on the other side.', `(${neg(-a)}, ${neg(b)}).`]);
    if (kind === 'xaxis') return pairQ(`Reflect the point (${neg(a)}, ${neg(b)}) in the x-axis.`, [a, -b], `Reflecting in the x-axis keeps x and changes the sign of y: (${neg(a)}, ${neg(-b)}).`, ['The mirror line is the x-axis (y = 0).', 'Same x; the same distance on the other side of the axis.', `(${neg(a)}, ${neg(-b)}).`]);
    if (kind === 'xk') return pairQ(`A shape is symmetrical about the line x = ${neg(k)}. One corner is at (${neg(a)}, ${neg(b)}). Where is its mirror-image corner?`, [2 * k - a, b], `(${neg(a)}, ${neg(b)}) is ${Math.abs(a - k)} ${a < k ? 'left' : 'right'} of x = ${neg(k)}, so its image is ${Math.abs(a - k)} on the other side: x = ${neg(2 * k - a)}. Same y: (${neg(2 * k - a)}, ${neg(b)}).`, [`x = ${neg(k)} is a vertical mirror line.`, `Distance from it: ${Math.abs(a - k)}.`, `Same distance the other side: (${neg(2 * k - a)}, ${neg(b)}).`]);
    if (kind === 'yk') return pairQ(`Reflect the point (${neg(a)}, ${neg(b)}) in the line y = ${neg(k)}.`, [a, 2 * k - b], `(${neg(a)}, ${neg(b)}) is ${Math.abs(b - k)} ${b < k ? 'below' : 'above'} y = ${neg(k)}, so the image is the same distance ${b < k ? 'above' : 'below'}: (${neg(a)}, ${neg(2 * k - b)}).`, [`y = ${neg(k)} is a horizontal mirror line.`, `Distance from it: ${Math.abs(b - k)}.`, `(${neg(a)}, ${neg(2 * k - b)}).`]);
    if (a === b) return Y8_FOCUS_GENERATORS.y8fSymmetry(level, rng);
    return pairQ(`Reflect the point (${neg(a)}, ${neg(b)}) in the line y = x.`, [b, a], `Reflecting in y = x swaps the coordinates: (${neg(b)}, ${neg(a)}).`, ['y = x is the diagonal line through (0, 0), (1, 1), (2, 2)…', 'A reflection in it swaps x and y.', `(${neg(b)}, ${neg(a)}).`]);
  },

  // ---- using a calculator (amber) -----------------------------------------------------------
  y8fCalculator(level, rng) {
    const G = Y8_FOCUS_GENERATORS;
    if (level === 1) {
      const kind = rng.pick(['order', 'brackets', 'money', 'time']);
      if (kind === 'order') {
        const a = rng.int(5, 20), b = rng.int(2, 9) * rng.int(2, 6), c = rng.pick([2, 3, 6].filter((d) => b % d === 0)) || 2;
        if (b % c) return G.y8fCalculator(level, rng);
        return num(`Mia types ${a} + ${b} ÷ ${c} = into a scientific calculator. What does it show?`, a + b / c,
          `A scientific calculator follows the order of operations: division before addition. ${b} ÷ ${c} = ${b / c}, then ${a} + ${b / c} = ${a + b / c}. (To get (${a} + ${b}) ÷ ${c} you need brackets.)`,
          ['Scientific calculators use BIDMAS.', `Divide first: ${b} ÷ ${c} = ${b / c}.`, `Then add: ${a + b / c}.`]);
      }
      if (kind === 'brackets') {
        const a = rng.int(10, 40), b = rng.int(5, 30), c = rng.int(2, 9);
        return choice(`Which key sequence works out {{${a} + ${b}/${c}}} on a scientific calculator?`, `( ${a} + ${b} ) ÷ ${c} =`, [`${a} + ${b} ÷ ${c} =`, `${a} + ( ${b} ÷ ${c} ) =`, `${a} ÷ ${c} + ${b} =`], rng, {
          explain: `The fraction line means the WHOLE top is divided by ${c}, so the top needs brackets: (${a} + ${b}) ÷ ${c}. Without them the calculator divides only ${b} by ${c}.`,
          steps: ['A fraction line acts like brackets round the top (and round the bottom).', `Put ( ${a} + ${b} ) in brackets.`, `Then ÷ ${c}.`],
        });
      }
      if (kind === 'money') {
        const p = rng.int(1, 19) * 10 + rng.int(1, 99) * 100;
        const shown = String(p / 100).replace(/0$/, '');
        if (!/\.\d$/.test(shown)) return G.y8fCalculator(level, rng);
        return choice(`A calculator gives the answer to a money question in pounds as ${shown}. How do you write it?`, `£${(p / 100).toFixed(2)}`, [`£${Math.floor(p / 100)}.0${shown.split('.')[1]}`, `${Math.round(p / 10)}p`, `£${Math.floor(p / 100)}.${shown.split('.')[1]}p`], rng, {
          explain: `${shown} pounds is ${Math.floor(p / 100)} pounds and ${shown.split('.')[1]}0 pence: money always has two decimal places, £${(p / 100).toFixed(2)}.`,
          steps: ['The calculator drops the final zero.', `0.${shown.split('.')[1]} of a pound = ${shown.split('.')[1]}0p.`, `£${(p / 100).toFixed(2)}.`],
        });
      }
      const h = rng.int(1, 4), q = rng.pick([['25', 15], ['5', 30], ['75', 45], ['2', 12], ['4', 24]]);
      return num(`A calculator shows a time of ${h}.${q[0]} hours. How many minutes is the .${q[0]} part?`, q[1],
        `0.${q[0]} of an hour is 0.${q[0]} × 60 = ${q[1]} minutes, so ${h}.${q[0]} hours is ${h} hours ${q[1]} minutes (not ${h} hours ${q[0]} minutes).`,
        ['An hour has 60 minutes, not 100.', `0.${q[0]} × 60 = ${q[1]}.`, `${h} h ${q[1]} min.`], { unit: 'minutes' });
    }
    if (level === 2) {
      const kind = rng.pick(['fractionLine', 'root', 'powers']);
      if (kind === 'fractionLine') {
        // tenths, so the rounding is exact: (A + B) / (C − D) with A..D in tenths
        const A = rng.int(100, 400), B = rng.int(20, 150), C = rng.int(40, 90), D = rng.int(5, 35);
        const top = A + B, bot = C - D, ans = divRound(top, bot, 2);
        if (!ans || bot <= 0) return G.y8fCalculator(level, rng);
        const t = (n) => (n / 10).toFixed(1);
        return num(`Use a calculator to work out {{${t(A)} + ${t(B)}/${t(C)} − ${t(D)}}}. Give your answer to 2 decimal places.`, ans,
          `Brackets round the top and the bottom: (${t(A)} + ${t(B)}) ÷ (${t(C)} − ${t(D)}) = ${t(top)} ÷ ${t(bot)} = ${(top / bot).toFixed(5)}… ≈ ${ans}.`,
          [`Type it as ( ${t(A)} + ${t(B)} ) ÷ ( ${t(C)} − ${t(D)} ), or use the fraction key.`, `${t(top)} ÷ ${t(bot)} = ${(top / bot).toFixed(5)}…`, `To 2 d.p.: ${ans}.`], { placeholder: 'e.g. 9.23' });
      }
      if (kind === 'root') {
        const a = rng.int(2, 12), b = rng.int(20, 90), s = a * a + b, ans = root1dp(s);
        if (!ans) return G.y8fCalculator(level, rng);
        return num(`Use a calculator to work out √(${a}² + ${b}). Give your answer to 1 decimal place.`, ans,
          `${a}² + ${b} = ${a * a} + ${b} = ${s}, and √${s} = ${Math.sqrt(s).toFixed(4)}… ≈ ${ans}. Make sure the √ covers the whole bracket.`,
          [`Inside the root first: ${a * a} + ${b} = ${s}.`, `√${s} = ${Math.sqrt(s).toFixed(4)}…`, `To 1 d.p.: ${ans}.`]);
      }
      const n = rng.int(2, 6), sq = rng.chance(0.5);
      return choice(`What does a scientific calculator show for ${sq ? `−${n}²` : `(−${n})²`}?`, sq ? `−${n * n}` : String(n * n), [sq ? String(n * n) : `−${n * n}`, `−${2 * n}`, String(2 * n)], rng, {
        explain: sq ? `Without brackets, the calculator squares first (powers before the minus): −${n}² = −(${n}²) = −${n * n}.` : `With brackets the whole −${n} is squared: (−${n}) × (−${n}) = ${n * n}.`,
        steps: ['Powers come before the minus sign unless brackets say otherwise.', sq ? `−${n}² means −(${n} × ${n}).` : `(−${n})² means (−${n}) × (−${n}).`, sq ? `−${n * n}.` : `${n * n}.`],
      });
    }
    const kind = rng.pick(['stdform', 'share', 'coaches']);
    if (kind === 'stdform') {
      const [disp, sf, ordinary, places] = rng.pick([['4.7E−03', '4.7 × 10⁻³', '0.0047', -3], ['3.2E−05', '3.2 × 10⁻⁵', '0.000032', -5], ['6.05E04', '6.05 × 10⁴', '60500', 4], ['1.8E06', '1.8 × 10⁶', '1800000', 6], ['9.1E−02', '9.1 × 10⁻²', '0.091', -2]]);
      return num(`A calculator shows ${disp}, which means ${sf}. Write it as an ordinary number.`, ordinary,
        `${sf}: move the decimal point ${Math.abs(places)} places to the ${places < 0 ? 'left' : 'right'}, giving ${ordinary}.`,
        ['E on a calculator means “× 10 to the power”.', `A ${places < 0 ? 'negative power means a small number: move left' : 'positive power means a big number: move right'} ${Math.abs(places)} places.`, ordinary]);
    }
    if (kind === 'share') {
      const total = rng.pick([100, 50, 200, 10, 25]), n = rng.pick([3, 6, 7, 9]), ans = divRound(total * 100, n, 0);
      if (!ans) return G.y8fCalculator(level, rng);
      const pounds = (Number(ans) / 100).toFixed(2);
      return num(`£${total} is shared equally between ${n} people. The calculator shows ${(total / n).toFixed(7)}. How much does each person get, to the nearest penny?`, pounds,
        `Money is rounded to 2 decimal places (pence): ${(total / n).toFixed(7)} ≈ £${pounds}.`, ['Pounds have two decimal places.', `Look at the third decimal place to round.`, `£${pounds}.`], { unit: '£', unitBefore: true });
    }
    const seats = rng.pick([45, 49, 52, 53, 57]), pupils = rng.int(4, 9) * seats + rng.int(3, seats - 3), q = pupils / seats;
    return num(`${pupils} pupils are going on a trip in ${seats}-seat coaches. The calculator shows ${pupils} ÷ ${seats} = ${q.toFixed(6)}. How many coaches are needed?`, Math.ceil(q),
      `${Math.floor(q)} coaches would leave ${pupils - Math.floor(q) * seats} pupils behind, so ROUND UP: ${Math.ceil(q)} coaches. In context, rounding to the nearest whole number is not always right.`,
      [`${Math.floor(q)} full coaches carry ${Math.floor(q) * seats} pupils.`, `${pupils - Math.floor(q) * seats} pupils still need a seat.`, `So ${Math.ceil(q)} coaches.`]);
  },

  // ---- angles in triangles (green) ----------------------------------------------------------
  y8fTriangles(level, rng) {
    const G = Y8_FOCUS_GENERATORS;
    if (level === 1) {
      const kind = rng.pick(['third', 'isoBase', 'isoApex', 'right']);
      if (kind === 'third') {
        const a = rng.int(25, 95), b = rng.int(20, 150 - a);
        return num(`Two angles of a triangle are ${a}° and ${b}°. Find the third angle.`, 180 - a - b, `Angles in a triangle add up to 180°: 180 − ${a} − ${b} = ${180 - a - b}°.`, ['The three angles of any triangle add to 180°.', `${a} + ${b} = ${a + b}.`, `180 − ${a + b} = ${180 - a - b}°.`], { unit: '°' });
      }
      if (kind === 'isoBase') {
        const apex = 2 * rng.int(10, 70);
        return num(`An isosceles triangle has an angle of ${apex}° between its two equal sides. Find one of the other angles.`, (180 - apex) / 2, `The other two angles are equal (the base angles): (180 − ${apex}) ÷ 2 = ${(180 - apex) / 2}°.`, ['In an isosceles triangle the two base angles are equal.', `180 − ${apex} = ${180 - apex} for the two of them.`, `÷ 2 = ${(180 - apex) / 2}°.`], { unit: '°' });
      }
      if (kind === 'isoApex') {
        const base = rng.int(35, 80);
        return num(`An isosceles triangle has two equal angles of ${base}°. Find the third angle.`, 180 - 2 * base, `180 − ${base} − ${base} = ${180 - 2 * base}°.`, ['Both base angles are given.', `${base} + ${base} = ${2 * base}.`, `180 − ${2 * base} = ${180 - 2 * base}°.`], { unit: '°' });
      }
      const a = rng.int(15, 75);
      return num(`A right-angled triangle has one angle of ${a}°. What is the other non-right angle?`, 90 - a, `The right angle is 90°, so the other two add to 90°: 90 − ${a} = ${90 - a}°.`, ['One angle is 90°.', 'The other two make 180 − 90 = 90°.', `90 − ${a} = ${90 - a}°.`], { unit: '°' });
    }
    if (level === 2) {
      const kind = rng.pick(['exterior', 'ratio', 'algebra', 'straight']);
      if (kind === 'exterior') {
        const a = rng.int(30, 80), b = rng.int(25, 90);
        return num(`In a triangle, two interior angles are ${a}° and ${b}°. One side of the triangle is extended. Find the exterior angle at the third corner.`, a + b, `An exterior angle equals the sum of the two interior angles opposite it: ${a} + ${b} = ${a + b}°. (Check: the third angle is ${180 - a - b}°, and 180 − ${180 - a - b} = ${a + b}°.)`, ['The exterior angle and the third interior angle lie on a straight line.', `Third angle: 180 − ${a} − ${b} = ${180 - a - b}°.`, `Exterior: 180 − ${180 - a - b} = ${a + b}° (= ${a} + ${b}).`], { unit: '°' });
      }
      if (kind === 'ratio') {
        const [p, q, r] = rng.pick([[1, 2, 3], [2, 3, 4], [1, 1, 4], [3, 4, 5], [2, 3, 7], [1, 3, 5]]), s = p + q + r;
        if (180 % s) return G.y8fTriangles(level, rng);
        return num(`The angles of a triangle are in the ratio ${p} : ${q} : ${r}. Find the largest angle.`, (180 / s) * r, `${p} + ${q} + ${r} = ${s} parts make 180°, so 1 part is ${180 / s}°. Largest: ${r} × ${180 / s} = ${(180 / s) * r}°.`, [`Total parts: ${s}.`, `One part: 180 ÷ ${s} = ${180 / s}°.`, `${r} parts: ${(180 / s) * r}°.`], { unit: '°' });
      }
      if (kind === 'algebra') {
        const x = rng.int(10, 30), a = rng.int(1, 3), b = rng.int(1, 3), c = 180 - (a + b) * x;
        if (c <= 10 || c >= 150) return G.y8fTriangles(level, rng);
        return num(`The angles of a triangle are ${a === 1 ? '' : a}x, ${b === 1 ? '' : b}x and ${c}°. Find x.`, x, `${a + b}x + ${c} = 180, so ${a + b}x = ${180 - c} and x = ${x}.`, ['Make an equation: the angles add to 180.', `${a + b}x + ${c} = 180.`, `${a + b}x = ${180 - c}, x = ${x}.`]);
      }
      const ext = rng.int(100, 150), other = rng.int(20, ext - 20);
      return num(`In triangle ABC, side BC is extended to D, so angle ACD = ${ext}°. Angle ABC = ${other}°. Find angle BAC.`, ext - other,
        `Angle ACB = 180 − ${ext} = ${180 - ext}° (angles on a straight line). Then angle BAC = 180 − ${180 - ext} − ${other} = ${ext - other}°. Quicker: the exterior angle equals the two opposite interior angles, so BAC = ${ext} − ${other}.`,
        [`Straight line: angle ACB = 180 − ${ext} = ${180 - ext}°.`, `Triangle: 180 − ${180 - ext} − ${other}.`, `Angle BAC = ${ext - other}°.`], { unit: '°' });
    }
    const kind = rng.pick(['algebra2', 'possible', 'isoAlgebra']);
    if (kind === 'algebra2') {
      const x = rng.int(10, 30), ks = [rng.int(1, 3), rng.int(1, 4), rng.int(1, 3)], d1 = rng.pick([-10, -5, 5, 10, 15]), d2 = rng.pick([-5, 0, 10, 20]);
      const d3 = 180 - (ks[0] + ks[1] + ks[2]) * x - d1 - d2, ds = [d1, d2, d3];
      const angs = ks.map((k, i) => k * x + ds[i]);
      if (d3 < -40 || d3 > 60 || angs.some((a) => a < 15) || new Set(angs).size < 3) return G.y8fTriangles(level, rng);
      const term = (k, d) => `(${k === 1 ? '' : k}x${d === 0 ? '' : sgn(d)})°`;
      const K = ks[0] + ks[1] + ks[2], D = d1 + d2 + d3;
      return num(`The angles of a triangle are ${term(ks[0], d1)}, ${term(ks[1], d2)} and ${term(ks[2], d3)}. Find the largest angle.`, Math.max(...angs),
        `Add them: ${K}x${sgn(D)} = 180, so ${K}x = ${180 - D} and x = ${x}. The angles are ${angs.join('°, ')}°; the largest is ${Math.max(...angs)}°.`,
        [`Add the expressions: ${K}x${sgn(D)}.`, `${K}x${sgn(D)} = 180, so x = ${x}.`, `Substitute: ${angs.join('°, ')}°. Largest: ${Math.max(...angs)}°.`], { unit: '°' });
    }
    if (kind === 'possible') {
      const [q, ans, why] = rng.pick([
        ['Can a triangle have two obtuse angles?', 'No', 'Two obtuse angles already add to more than 180°.'],
        ['Can a triangle have angles of 90°, 45° and 45°?', 'Yes', '90 + 45 + 45 = 180: a right-angled isosceles triangle.'],
        ['Can a triangle have angles of 60°, 70° and 60°?', 'No', '60 + 70 + 60 = 190°, not 180°.'],
        ['Can a right-angled triangle also be equilateral?', 'No', 'An equilateral triangle has three 60° angles: none is 90°.'],
      ]);
      return choice(q, ans, [ans === 'Yes' ? 'No' : 'Yes'], rng, { explain: why, steps: ['Angles in a triangle add to exactly 180°.', 'Check the given angles against that.', ans] });
    }
    const x = rng.int(12, 28), base = 2 * x + 10, apex = 180 - 2 * base;
    if (apex <= 10) return G.y8fTriangles(level, rng);
    return num(`An isosceles triangle has base angles of (2x + 10)° each and a third angle of ${apex}°. Find x.`, x,
      `The angles add to 180: 2(2x + 10) + ${apex} = 180, so 4x + ${20 + apex} = 180, 4x = ${160 - apex} and x = ${x}.`, ['Both base angles are 2x + 10.', `2(2x + 10) + ${apex} = 180.`, `4x = ${160 - apex}, x = ${x}.`]);
  },
};
