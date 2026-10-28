// Maths stretch generators (end of Year 7 into Year 8): algebra, percentages, angles,
// ratio, indices, graphs, fraction arithmetic and circles. Same contract as maths.js.
// Algebraic answers set `algebra: true` so the checker ignores spacing and accepts listed forms.

import { pic, bar, pctChangeBar, pctBoxes } from './pictures.js';

const neg = (n) => (n < 0 ? `−${-n}` : String(n));
const sgn = (n) => (n < 0 ? ` − ${-n}` : ` + ${n}`);
const g = (a, b) => (b ? g(b, a % b) : a);
const hund = (h) => (h / 100).toString(); // integer hundredths -> "21.98"
const PI = 314; // 3.14 in hundredths

// reverse percentage: the price now is some boxes of the original; find one box, then all of them
function reverseBar(p, amt, up) {
  const N = pctBoxes(p), k = (p * N) / 100, now = up ? N + k : N - k, box = amt / N;
  return pic(bar([{ label: 'now', parts: now, text: `£${box}`, total: `£${box * now}` }, { label: 'before', parts: N, text: `£${box}`, total: `£${amt}` }]),
    `Each box is ${100 / N}% of the original. £${box * now} is ${now} box${now === 1 ? '' : 'es'}, so one box is £${box}. The original is ${N} boxes: £${amt}.`);
}

function choice(prompt, correct, wrongs, rng, extra = {}) {
  const options = rng.shuffle([{ text: correct, correct: true }, ...wrongs.map((w) => (typeof w === 'string' ? { text: w } : w))]);
  return { kind: 'choice', prompt, options, ...extra };
}

/** "5x + 4" with the accepted spellings (either order, with or without spaces). */
function linear(a, b, v = 'x') {
  const xs = a === 1 ? v : a === -1 ? `-${v}` : `${a}${v}`;
  if (b === 0) return { answer: xs, accept: [] };
  if (a === 0) return { answer: String(b), accept: [] };
  const main = `${xs}${b < 0 ? ' - ' : ' + '}${Math.abs(b)}`;
  const flipped = `${b}${a < 0 ? ' - ' : ' + '}${a === 1 || a === -1 ? v : `${Math.abs(a)}${v}`}`;
  return { answer: main, accept: [flipped, `${b} + ${xs}`, `+${main}`] };
}
const show = (s) => s.replace(/-/g, '−');
const xk = (k) => (k === 1 ? 'x' : `${k}x`); // a coefficient of 1 is never written
const sgn0 = (n) => (n === 0 ? '' : sgn(n));

export const MATHS3_GENERATORS = {
  expand(level, rng) {
    if (level === 1) {
      const a = rng.int(2, 7), b = rng.int(1, 6), c = rng.int(1, 9), d = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4]);
      const { answer, accept } = linear(a + b, c + d);
      return {
        kind: 'typed', prompt: `Simplify: ${a}x + ${c} + ${xk(b)}${sgn(d)}`, answer, accept, algebra: true, placeholder: 'e.g. 3x + 2',
        explain: `Collect the x terms: ${a}x + ${xk(b)} = ${a + b}x. Collect the numbers: ${c}${sgn(d)} = ${neg(c + d)}. So ${show(answer)}.`,
        steps: ['Like terms can be added: x terms with x terms, numbers with numbers.', `${a}x + ${xk(b)} = ${a + b}x, and ${c}${sgn(d)} = ${neg(c + d)}.`, `Answer: ${show(answer)}.`],
      };
    }
    if (level === 2) {
      const a = rng.int(2, 6), b = rng.int(2, 7), c = rng.pick([-7, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
      const { answer, accept } = linear(a * b, a * c);
      return {
        kind: 'typed', prompt: `Expand: ${a}(${b}x${sgn(c)})`, answer, accept, algebra: true, placeholder: 'e.g. 6x + 15',
        explain: `Multiply everything inside the bracket by ${a}: ${a} × ${b}x = ${a * b}x and ${a} × ${neg(c)} = ${neg(a * c)}. So ${show(answer)}.`,
        steps: [`The ${a} outside multiplies BOTH terms inside.`, `${a} × ${b}x = ${a * b}x, and ${a} × ${neg(c)} = ${neg(a * c)}.`, `${show(answer)}.`],
      };
    }
    if (rng.chance(0.5)) {
      const a = rng.int(2, 4), b = rng.int(1, 5), c = rng.int(2, 4), d = rng.pick([-4, -3, -2, -1, 1, 2]);
      const { answer, accept } = linear(a + c, a * b + c * d);
      return {
        kind: 'typed', prompt: `Expand and simplify: ${a}(x${sgn(b)}) + ${c}(x${sgn(d)})`, answer, accept, algebra: true, placeholder: 'e.g. 5x + 3',
        explain: `${a}(x${sgn(b)}) = ${a}x${sgn(a * b)} and ${c}(x${sgn(d)}) = ${c}x${sgn(c * d)}. Add: ${show(answer)}.`,
        steps: [`Expand each bracket: ${a}x${sgn(a * b)} and ${c}x${sgn(c * d)}.`, `Collect: ${a}x + ${c}x = ${a + c}x, and ${a * b}${sgn(c * d)} = ${neg(a * b + c * d)}.`, `${show(answer)}.`],
      };
    }
    const k = rng.int(2, 6), b = rng.int(2, 5), c = rng.int(1, 7);
    if (g(b, c) !== 1) return MATHS3_GENERATORS.expand(3, rng);
    return {
      kind: 'typed', prompt: `Factorise fully: ${k * b}x + ${k * c}`, answer: `${k}(${b}x + ${c})`, accept: [`${k}(${c} + ${b}x)`], algebra: true, placeholder: 'e.g. 3(2x + 3)',
      explain: `The highest common factor of ${k * b} and ${k * c} is ${k}. Take it outside: ${k}(${b}x + ${c}). Check by expanding.`,
      steps: [`Find the biggest number that divides both ${k * b} and ${k * c}: ${k}.`, `${k * b}x ÷ ${k} = ${b}x and ${k * c} ÷ ${k} = ${c}.`, `${k}(${b}x + ${c}). Expanding it gives the original, so it is right.`],
    };
  },

  equations2(level, rng) {
    if (level === 1) {
      const x = rng.int(2, 9), a = rng.int(3, 7), b = rng.int(1, a - 1), c = (a - b) * x;
      return {
        kind: 'typed', prompt: `Solve: ${a}x = ${xk(b)} + ${c}`, prefix: 'x =', numeric: { value: String(x), form: 'any' },
        explain: a - b === 1 ? `Subtract ${xk(b)} from both sides: x = ${c}.` : `Subtract ${xk(b)} from both sides: ${a - b}x = ${c}, so x = ${c} ÷ ${a - b} = ${x}.`,
        steps: ['Get all the x terms on one side by subtracting the smaller one from both sides.', `${a}x − ${xk(b)} = ${xk(a - b)}, so ${xk(a - b)} = ${c}.`, a - b === 1 ? `So x = ${x}. Check: ${a} × ${x} = ${a * x} and ${b === 1 ? '' : `${b} × ${x} + `}${b === 1 ? `${x} + ${c}` : c} = ${a * x}.` : `x = ${c} ÷ ${a - b} = ${x}.`],
      };
    }
    if (level === 2) {
      const x = rng.int(2, 9), a = rng.int(2, 6), b = rng.int(1, a - 1), c = rng.int(1, 9), d = (a - b) * x + c;
      return {
        kind: 'typed', prompt: `Solve: ${a}x + ${c} = ${xk(b)} + ${d}`, prefix: 'x =', numeric: { value: String(x), form: 'any' },
        explain: a - b === 1 ? `Subtract ${xk(b)} from both sides: x + ${c} = ${d}. Subtract ${c}: x = ${x}.` : `Subtract ${xk(b)} from both sides: ${a - b}x + ${c} = ${d}. Subtract ${c}: ${a - b}x = ${d - c}. So x = ${x}.`,
        steps: [`First the x terms: subtract ${xk(b)} from both sides to get ${xk(a - b)} + ${c} = ${d}.`, `Then the numbers: subtract ${c} from both sides to get ${xk(a - b)} = ${d - c}.`, a - b === 1 ? `So x = ${x}. Check: both sides are ${a * x + c}.` : `x = ${d - c} ÷ ${a - b} = ${x}.`],
      };
    }
    const x = rng.pick([-4, -3, -2, 2, 3, 4, 5, 6]), a = rng.int(2, 4), b = rng.int(1, 5), c = rng.int(1, a - 1 || 1), d = a * (x + b) - c * x;
    if (a === c) return MATHS3_GENERATORS.equations2(3, rng);
    return {
      kind: 'typed', prompt: `Solve: ${a}(x + ${b}) = ${xk(c)}${sgn0(d)}`, prefix: 'x =', numeric: { value: String(x), form: 'any' },
      explain: `Expand: ${a}x + ${a * b} = ${xk(c)}${sgn0(d)}. Subtract ${xk(c)}: ${xk(a - c)} + ${a * b} = ${neg(d)}. Subtract ${a * b}: ${a - c === 1 ? `x = ${neg(x)}.` : `${a - c}x = ${neg(d - a * b)}. x = ${neg(x)}.`}`,
      steps: [`Expand the bracket first: ${a}x + ${a * b} = ${xk(c)}${sgn0(d)}.`, `Collect x terms on the left (subtract ${xk(c)}) and numbers on the right (subtract ${a * b}): ${xk(a - c)} = ${neg(d - a * b)}.`, a - c === 1 ? `So x = ${neg(x)}. Check: both sides are ${neg(a * (x + b))}.` : `x = ${neg(d - a * b)} ÷ ${a - c} = ${neg(x)}.`],
    };
  },

  percentChange(level, rng) {
    const amt = rng.int(2, 25) * 20, p = rng.pick([5, 10, 15, 20, 25, 30, 40, 50]);
    if (level === 1) {
      const up = rng.chance(0.5), res = up ? amt + (amt * p) / 100 : amt - (amt * p) / 100;
      const thing = up ? ['A shop raises the price of a £', ' jacket by '] : ['In a sale, a £', ' jacket is reduced by '];
      return {
        kind: 'typed', prompt: `${thing[0]}${amt}${thing[1]}${p}%. What is the new price?`, numeric: { value: String(res), form: 'any' }, unit: '£', unitBefore: true,
        explain: `${p}% of ${amt} = ${(amt * p) / 100}. ${up ? 'Add' : 'Subtract'} it: ${amt} ${up ? '+' : '−'} ${(amt * p) / 100} = £${res}. (Or multiply by ${up ? 1 + p / 100 : 1 - p / 100}.)`,
        steps: [`Find ${p}% of £${amt}: ${amt} ÷ 100 × ${p} = £${(amt * p) / 100}.`, `A ${up ? 'rise' : 'reduction'} means I ${up ? 'add it on' : 'take it off'}.`, `${amt} ${up ? '+' : '−'} ${(amt * p) / 100} = £${res}. Quicker: ${amt} × ${up ? 1 + p / 100 : 1 - p / 100}.`],
        ...pctChangeBar(p, amt, up, '£'),
      };
    }
    if (level === 2) {
      const up = rng.chance(0.6), to = up ? amt + (amt * p) / 100 : amt - (amt * p) / 100;
      return {
        kind: 'typed', prompt: `A town’s population ${up ? 'grew' : 'fell'} from ${amt * 10} to ${to * 10}. What was the percentage ${up ? 'increase' : 'decrease'}?`, numeric: { value: String(p), form: 'any' }, unit: '%',
        explain: `Change = ${Math.abs(to - amt) * 10}. Divide by the ORIGINAL: ${Math.abs(to - amt) * 10} ÷ ${amt * 10} × 100 = ${p}%.`,
        steps: [`Change: ${to * 10} − ${amt * 10} = ${(to - amt) * 10 < 0 ? '−' : ''}${Math.abs(to - amt) * 10}.`, 'Percentage change = change ÷ original × 100. Always the original, never the new value.', `${Math.abs(to - amt) * 10} ÷ ${amt * 10} × 100 = ${p}%.`],
        ...pctChangeBar(p, amt * 10, up),
      };
    }
    const up = rng.chance(0.4), mult = up ? 100 + p : 100 - p, after = (amt * mult) / 100;
    return {
      kind: 'typed', prompt: up ? `After a ${p}% pay rise, Priya earns £${after} a week. What did she earn before?` : `In a sale with ${p}% off, a coat costs £${after}. What was the original price?`, numeric: { value: String(amt), form: 'any' }, unit: '£', unitBefore: true,
      explain: `£${after} is ${mult}% of the original. 1% = ${after} ÷ ${mult} = ${after / mult}. Original = ${after / mult} × 100 = £${amt}. (Not ${p}% of £${after} ${up ? 'taken off' : 'added back'}: that gives the wrong answer.)`,
      steps: [`The ${up ? 'new pay' : 'sale price'} is ${mult}% of the original, not 100%.`, `So 1% of the original = ${after} ÷ ${mult} = ${after / mult}.`, `100% = ${after / mult} × 100 = £${amt}. Check: ${amt} × ${mult / 100} = ${after}.`],
      ...reverseBar(p, amt, up),
    };
  },

  polygons(level, rng) {
    const NAMES = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon', 12: 'dodecagon' };
    if (level === 1) {
      const n = rng.pick([5, 6, 7, 8, 9, 10, 12]);
      return {
        kind: 'typed', prompt: `What do the interior angles of ${/^[aeiou]/.test(NAMES[n]) ? 'an' : 'a'} ${NAMES[n]} (${n} sides) add up to?`, numeric: { value: String((n - 2) * 180), form: 'any' }, unit: '°',
        explain: `${/^[aeiou]/.test(NAMES[n]) ? 'An' : 'A'} ${NAMES[n]} splits into ${n - 2} triangles from one corner, each 180°: ${n - 2} × 180 = ${(n - 2) * 180}°.`,
        steps: [`From one vertex I can draw diagonals that cut the shape into ${n} − 2 = ${n - 2} triangles.`, 'Each triangle’s angles add up to 180°.', `${n - 2} × 180 = ${(n - 2) * 180}°.`],
      };
    }
    if (level === 2) {
      const n = rng.pick([5, 6, 8, 9, 10, 12]);
      return {
        kind: 'typed', prompt: `What is the size of each interior angle of a regular ${NAMES[n]}?`, numeric: { value: String(((n - 2) * 180) / n), form: 'any' }, unit: '°',
        explain: `Interior angles total (${n} − 2) × 180 = ${(n - 2) * 180}°. Regular means all equal, so divide by ${n}: ${((n - 2) * 180) / n}°.`,
        steps: [`Total of the interior angles: (${n} − 2) × 180 = ${(n - 2) * 180}°.`, 'In a regular polygon all the angles are equal, so I share the total between them.', `${(n - 2) * 180} ÷ ${n} = ${((n - 2) * 180) / n}°.`],
      };
    }
    const ext = rng.pick([20, 24, 30, 36, 40, 45, 60, 72]);
    const n = 360 / ext;
    return rng.chance(0.5) ? {
      kind: 'typed', prompt: `Each exterior angle of a regular polygon is ${ext}°. How many sides does it have?`, numeric: { value: String(n), form: 'any' }, unit: 'sides',
      explain: `Exterior angles always add up to 360°: 360 ÷ ${ext} = ${n} sides.`,
      steps: ['Walking round any polygon you turn through 360° in total, so the exterior angles add up to 360°.', `Each one is ${ext}°, so the number of sides is 360 ÷ ${ext}.`, `= ${n} sides.`],
    } : {
      kind: 'typed', prompt: `Each interior angle of a regular polygon is ${180 - ext}°. How many sides does it have?`, numeric: { value: String(n), form: 'any' }, unit: 'sides',
      explain: `Interior + exterior = 180°, so the exterior angle is ${ext}°. 360 ÷ ${ext} = ${n} sides.`,
      steps: [`Interior and exterior angles sit on a straight line: exterior = 180 − ${180 - ext} = ${ext}°.`, 'Exterior angles add up to 360°.', `360 ÷ ${ext} = ${n} sides.`],
    };
  },

  parallelAngles(level, rng) {
    const a = rng.int(35, 145);
    const known = { line: rng.int(0, 1), r: rng.pick(['rt', 'lt', 'lb', 'rb']) };
    // regions at each crossing: 'rt' and 'lb' share one size, 'lt' and 'rb' the other (top line = 0, bottom line = 1);
    // the labelled angle is a, so the size of the 'rt'/'lb' pair follows from where the label sits
    const rtSize = known.r === 'rt' || known.r === 'lb' ? a : 180 - a;
    const val = (r) => (r === 'rt' || r === 'lb' ? rtSize : 180 - rtSize);
    const kinds = level === 1 ? ['vertical', 'corresponding'] : level === 2 ? ['alternate', 'corresponding'] : ['co-interior', 'alternate', 'co-interior'];
    const kind = rng.pick(kinds);
    const opp = { rt: 'lb', lb: 'rt', lt: 'rb', rb: 'lt' };
    const vert = { rt: 'lt', lt: 'rt', lb: 'rb', rb: 'lb' };
    let ask;
    if (kind === 'vertical') ask = { line: known.line, r: opp[known.r] };
    else if (kind === 'corresponding') ask = { line: 1 - known.line, r: known.r };
    else if (kind === 'alternate') { const r = known.line === 0 ? (known.r.endsWith('b') ? opp[known.r] : null) : (known.r.endsWith('t') ? opp[known.r] : null); if (!r) return MATHS3_GENERATORS.parallelAngles(level, rng); ask = { line: 1 - known.line, r }; }
    else { const r = known.line === 0 ? (known.r.endsWith('b') ? vert[opp[known.r]] : null) : (known.r.endsWith('t') ? vert[opp[known.r]] : null); if (!r) return MATHS3_GENERATORS.parallelAngles(level, rng); ask = { line: 1 - known.line, r }; }
    const ans = val(ask.r);
    const RULE = { vertical: 'Vertically opposite angles are equal.', corresponding: 'Corresponding angles (the same position at each crossing, an “F” shape) are equal.', alternate: 'Alternate angles (a “Z” shape) are equal.', 'co-interior': 'Co-interior angles (a “C” shape, inside the parallel lines on the same side) add up to 180°.' };
    return {
      kind: 'typed', prompt: `The two horizontal lines are parallel. Work out the angle marked ?.`, numeric: { value: String(ans), form: 'any' }, unit: '°',
      diagram: { type: 'parallel', a, known, ask },
      explain: `${RULE[kind]} ${kind === 'co-interior' ? `180 − ${a} = ${ans}°.` : `So the angle is ${ans}°.`}`,
      steps: [`I look for the relationship: this pair is ${kind === 'vertical' ? 'vertically opposite' : kind}.`, RULE[kind], kind === 'co-interior' ? `180 − ${a} = ${ans}°.` : `So ? = ${ans}°.`],
    };
  },

  ratio2(level, rng) {
    if (level === 1) {
      const parts = [rng.int(1, 4), rng.int(1, 5), rng.int(2, 6)], tot = parts.reduce((x, y) => x + y, 0), unit = rng.int(3, 12), amount = tot * unit, k = rng.int(0, 2);
      const who = ['Ava', 'Ben', 'Cal'];
      return {
        kind: 'typed', prompt: `£${amount} is shared between Ava, Ben and Cal in the ratio ${parts.join(' : ')}. How much does ${who[k]} get?`, numeric: { value: String(parts[k] * unit), form: 'any' }, unit: '£', unitBefore: true,
        explain: `${parts.join(' + ')} = ${tot} parts. One part = £${amount} ÷ ${tot} = £${unit}. ${who[k]} gets ${parts[k]} part${parts[k] === 1 ? '' : 's'} = £${parts[k] * unit}.`,
        steps: [`Total parts: ${parts.join(' + ')} = ${tot}.`, `One part is £${amount} ÷ ${tot} = £${unit}.`, `${who[k]} has ${parts[k]} part${parts[k] === 1 ? '' : 's'}: ${parts[k]} × £${unit} = £${parts[k] * unit}.`],
        ...pic(bar(parts.map((n, i) => ({ label: who[i], parts: n, text: `£${unit}`, total: `£${n * unit}` }))), `${tot} boxes share £${amount}, so each box is £${unit}. ${who[k]} has ${parts[k]} box${parts[k] === 1 ? '' : 'es'}: £${parts[k] * unit}.`),
      };
    }
    if (level === 2) {
      const a = rng.int(1, 4), b = a + rng.int(1, 4), unit = rng.int(2, 9), diff = (b - a) * unit;
      return {
        kind: 'typed', prompt: `Two friends share some money in the ratio ${a} : ${b}. The second friend gets £${diff} more than the first. How much money is there altogether?`, numeric: { value: String((a + b) * unit), form: 'any' }, unit: '£', unitBefore: true,
        explain: `The difference is ${b} − ${a} = ${b - a} part${b - a > 1 ? 's' : ''} = £${diff}, so one part = £${unit}. Total = ${a + b} parts = £${(a + b) * unit}.`,
        steps: [`The difference between their shares is ${b} − ${a} = ${b - a} part${b - a > 1 ? 's' : ''}.`, `${b - a} part${b - a > 1 ? 's' : ''} = £${diff}, so one part = £${unit}.`, `Altogether there are ${a + b} parts: ${a + b} × £${unit} = £${(a + b) * unit}.`],
        ...pic(bar([{ label: 'first', parts: a, text: `£${unit}`, total: `£${a * unit}` }, { label: 'second', parts: b, text: `£${unit}`, total: `£${b * unit}` }]), `The second friend has ${b - a} more box${b - a === 1 ? '' : 'es'}, worth £${diff}, so each box is £${unit}. ${a + b} boxes altogether: £${(a + b) * unit}.`),
      };
    }
    const g1 = rng.pick([250, 400, 500]), g2 = rng.pick([600, 750, 800, 1000]);
    const u1 = rng.int(15, 30) * 2, u2 = u1 + rng.pick([-8, -6, -4, 4, 6, 8]); // pence per 100 g (even, so prices are whole pence)
    const p1 = (g1 / 100) * u1, p2 = (g2 / 100) * u2;
    const best = u1 < u2 ? 1 : 2;
    const money = (p) => `£${(p / 100).toFixed(2)}`;
    return choice(`Which is better value: ${g1} g of rice for ${money(p1)}, or ${g2} g for ${money(p2)}?`, `${best === 1 ? g1 : g2} g for ${money(best === 1 ? p1 : p2)}`, [`${best === 1 ? g2 : g1} g for ${money(best === 1 ? p2 : p1)}`, 'They are the same value'], rng, {
      explain: `Compare the price per 100 g. ${g1} g: ${money(p1)} ÷ ${g1 / 100} = ${u1}p per 100 g. ${g2} g: ${money(p2)} ÷ ${g2 / 100} = ${u2}p per 100 g. The ${best === 1 ? g1 : g2} g pack is cheaper per 100 g.`,
      steps: ['To compare, I find the price of the SAME amount, say 100 g, for each pack.', `${g1} g pack: ${u1}p per 100 g. ${g2} g pack: ${u2}p per 100 g.`, `${Math.min(u1, u2)}p is less, so the ${best === 1 ? g1 : g2} g pack is better value, even though ${best === 1 ? 'it is smaller' : 'it costs more'}.`],
    });
  },

  indices(level, rng) {
    if (level === 1) {
      const [b, n] = rng.pick([[2, 5], [2, 6], [2, 7], [2, 8], [3, 3], [3, 4], [4, 3], [5, 3], [10, 4], [10, 5], [6, 3], [7, 2], [9, 2]]);
      return {
        kind: 'typed', prompt: `Work out ${b}^{${n}}`, numeric: { value: String(b ** n), form: 'any' },
        explain: `${b}^{${n}} means ${Array(n).fill(b).join(' × ')} = ${(b ** n).toLocaleString('en-GB')}.`,
        steps: [`The small ${n} says how many ${b}s to multiply together.`, `${Array(n).fill(b).join(' × ')}.`, `= ${(b ** n).toLocaleString('en-GB')}.`],
      };
    }
    const b = rng.pick([2, 3, 5, 7, 10, 'a', 'x']);
    if (level === 2) {
      const m = rng.int(2, 6), n = rng.int(2, 6);
      return {
        kind: 'typed', prompt: `Write ${b}^{${m}} × ${b}^{${n}} as a single power of ${b}.`, answer: `${b}^${m + n}`, accept: [`${b}^{${m + n}}`, `${b}**${m + n}`, `${b} to the power ${m + n}`, `${b} to the power of ${m + n}`], algebra: true, placeholder: `e.g. ${b}^7`,
        explain: `${b}^{${m}} is ${m} ${b}s multiplied, ${b}^{${n}} is ${n} more: ${m + n} altogether, so ${b}^{${m + n}}. Rule: when multiplying powers of the same base, ADD the indices.`,
        steps: [`${b}^{${m}} × ${b}^{${n}} = (${m} ${b}s) × (${n} ${b}s) = ${m + n} ${b}s multiplied together.`, 'Same base, multiplying: add the indices.', `${b}^{${m + n}}.`],
      };
    }
    if (rng.chance(0.5)) {
      const m = rng.int(5, 9), n = rng.int(2, m - 1);
      return {
        kind: 'typed', prompt: `Write ${b}^{${m}} ÷ ${b}^{${n}} as a single power of ${b}.`, answer: `${b}^${m - n}`, accept: [`${b}^{${m - n}}`, `${b}**${m - n}`, `${b} to the power ${m - n}`, `${b} to the power of ${m - n}`, m - n === 1 ? String(b) : ''], algebra: true, placeholder: `e.g. ${b}^3`,
        explain: `Dividing cancels ${n} of the ${m} ${b}s, leaving ${m - n}: ${b}^{${m - n}}. Rule: same base, dividing: SUBTRACT the indices.`,
        steps: [`${b}^{${m}} ÷ ${b}^{${n}}: write out the ${b}s and cancel ${n} from top and bottom.`, 'Same base, dividing: subtract the indices.', `${m} − ${n} = ${m - n}, so ${b}^{${m - n}}.`],
      };
    }
    const m = rng.int(2, 4), n = rng.int(2, 4);
    return {
      kind: 'typed', prompt: `Write (${b}^{${m}})^{${n}} as a single power of ${b}.`, answer: `${b}^${m * n}`, accept: [`${b}^{${m * n}}`, `${b}**${m * n}`, `${b} to the power ${m * n}`, `${b} to the power of ${m * n}`], algebra: true, placeholder: `e.g. ${b}^6`,
      explain: `(${b}^{${m}})^{${n}} means ${b}^{${m}} multiplied by itself ${n} times: ${Array(n).fill(`${b}^{${m}}`).join(' × ')} = ${b}^{${m * n}}. Rule: a power of a power: MULTIPLY the indices.`,
      steps: [`(${b}^{${m}})^{${n}} = ${Array(n).fill(`${b}^{${m}}`).join(' × ')}.`, `Multiplying powers adds the indices: ${Array(n).fill(m).join(' + ')} = ${m * n}.`, `${b}^{${m * n}}. Shortcut: multiply the indices.`],
    };
  },

  linearGraphs(level, rng) {
    const m = rng.pick([-3, -2, -1, 1, 2, 3, 4]), c = rng.int(-6, 8);
    const eq = `y = ${m === 1 ? '' : m === -1 ? '−' : neg(m)}x${c === 0 ? '' : sgn(c).replace('-', '−')}`;
    if (level === 1) {
      const x = rng.int(-4, 6);
      return {
        kind: 'typed', prompt: `A line has the equation ${eq}. What is y when x = ${neg(x)}?`, prefix: 'y =', numeric: { value: String(m * x + c), form: 'any' },
        explain: `Substitute x = ${neg(x)}: y = ${neg(m)} × ${neg(x)}${sgn(c).replace('-', '−')} = ${neg(m * x)}${sgn(c).replace('-', '−')} = ${neg(m * x + c)}.`,
        steps: [`Replace x with ${neg(x)}.`, `${neg(m)} × ${neg(x)} = ${neg(m * x)}.`, `${neg(m * x)}${sgn(c).replace('-', '−')} = ${neg(m * x + c)}.`],
      };
    }
    if (level === 2) {
      const x = rng.int(-3, 5), on = rng.chance(0.5), y = m * x + c + (on ? 0 : rng.pick([-3, -2, -1, 1, 2, 3]));
      return choice(`Does the point (${neg(x)}, ${neg(y)}) lie on the line ${eq}?`, on ? 'Yes' : 'No', [on ? 'No' : 'Yes'], rng, {
        diagram: { type: 'axes', range: [-8, 8], points: [{ x, y, label: 'P' }] },
        explain: `Put x = ${neg(x)} into the equation: y = ${neg(m * x + c)}. The point has y = ${neg(y)}, so it ${on ? 'DOES lie on the line' : 'does NOT lie on the line'}.`,
        steps: ['A point is on the line if its coordinates make the equation true.', `x = ${neg(x)} gives y = ${neg(m)} × ${neg(x)}${sgn(c).replace('-', '−')} = ${neg(m * x + c)}.`, `The point’s y is ${neg(y)}: ${on ? 'the same, so yes.' : 'different, so no.'}`],
      });
    }
    const x1 = rng.int(-4, 3), x2 = x1 + rng.int(1, 4), y1 = m * x1 + c, y2 = m * x2 + c;
    return {
      kind: 'typed', prompt: `A straight line passes through (${neg(x1)}, ${neg(y1)}) and (${neg(x2)}, ${neg(y2)}). What is its gradient?`, numeric: { value: String(m), form: 'any' },
      diagram: { type: 'axes', range: [-8, 8], points: [{ x: x1, y: y1, label: 'A' }, { x: x2, y: y2, label: 'B' }] },
      explain: `Gradient = change in y ÷ change in x = (${neg(y2)} − ${neg(y1)}) ÷ (${neg(x2)} − ${neg(x1)}) = ${neg(y2 - y1)} ÷ ${x2 - x1} = ${neg(m)}.`,
      steps: ['Gradient = rise ÷ run: how much y changes for each 1 that x changes.', `Rise: ${neg(y2)} − ${neg(y1)} = ${neg(y2 - y1)}. Run: ${neg(x2)} − ${neg(x1)} = ${x2 - x1}.`, `${neg(y2 - y1)} ÷ ${x2 - x1} = ${neg(m)}.${m < 0 ? ' Negative: the line slopes down.' : ''}`],
    };
  },

  fracMixed(level, rng) {
    const simp = (n, d) => { const k = g(Math.abs(n), d); return [n / k, d / k]; };
    const mixed = (n, d) => { const [a, b] = simp(n, d); const w = Math.floor(a / b), r = a - w * b; return r === 0 ? `${w}` : w === 0 ? `${r}/${b}` : `${w} ${r}/${b}`; };
    const tex = (n, d) => { const [a, b] = simp(n, d); const w = Math.floor(a / b), r = a - w * b; return r === 0 ? `${w}` : w === 0 ? `{{${r}/${b}}}` : `${w} {{${r}/${b}}}`; };
    if (level === 1) {
      const d1 = rng.pick([2, 3, 4, 5, 6, 8]), d2 = rng.pick([2, 3, 4, 6, 8, 10]);
      const w1 = rng.int(1, 3), n1 = rng.int(1, d1 - 1), w2 = rng.int(1, 3), n2 = rng.int(1, d2 - 1);
      if (g(n1, d1) !== 1 || g(n2, d2) !== 1) return MATHS3_GENERATORS.fracMixed(1, rng);
      const L = d1 * d2 / g(d1, d2), top = (w1 * d1 + n1) * (L / d1) + (w2 * d2 + n2) * (L / d2);
      const W = w1 + w2, fs = n1 * (L / d1) + n2 * (L / d2), sum = `{{${n1 * (L / d1)}/${L}}} + {{${n2 * (L / d2)}/${L}}} = {{${fs}/${L}}}`;
      // When the fractions make 1 or more, show the extra whole being carried into the whole numbers.
      const carry = fs < L ? `{{${fs}/${L}}}` : fs === L ? '1' : `1 {{${fs - L}/${L}}}`;
      const raw = fs < L ? `${W} {{${fs}/${L}}}` : fs === L ? `${W + 1}` : `${W + 1} {{${fs - L}/${L}}}`, end = raw === tex(top, L) ? raw : `${raw} = ${tex(top, L)}`;
      return {
        kind: 'typed', prompt: `Work out ${w1} {{${n1}/${d1}}} + ${w2} {{${n2}/${d2}}}. Give your answer as a mixed number in its simplest form.`, numeric: { value: mixed(top, L), form: 'mixed' },
        explain: `Whole numbers: ${w1} + ${w2} = ${W}. Fractions with denominator ${L}: ${sum}${fs >= L ? ` = ${carry}` : ''}. Altogether ${W} + ${carry} = ${end}.`,
        steps: [`Add the whole numbers: ${w1} + ${w2} = ${W}.`, `Add the fractions using a common denominator of ${L}: ${sum}.`, fs < L ? `Put them together and simplify: ${W} + ${carry} = ${end}.` : fs === L ? `{{${fs}/${L}}} is 1 whole, so ${W} + 1 = ${end}.` : `{{${fs}/${L}}} is more than 1: {{${fs}/${L}}} = ${carry}, so ${W} + ${carry} = ${end}.`],
      };
    }
    if (level === 2) {
      const d1 = rng.pick([2, 3, 4, 5]), d2 = rng.pick([3, 4, 5, 6, 7]);
      const n1 = rng.int(1, d1 - 1), n2 = rng.int(1, d2 - 1);
      if (g(n1, d1) !== 1 || g(n2, d2) !== 1) return MATHS3_GENERATORS.fracMixed(2, rng);
      // 'simplest' accepts the improper fraction (21/4) and the mixed number (5 1/4) alike; the stored answer
      // is the mixed number so it matches the last line of the working.
      const raw = `{{${n1 * d2}/${d1 * n2}}}`, fin = tex(n1 * d2, d1 * n2), same = raw === fin;
      const last = same ? `${raw} is already in its simplest form.` : g(n1 * d2, d1 * n2) > 1 ? `Simplify: ${raw} = ${fin}.` : `As a mixed number: ${raw} = ${fin}.`;
      return {
        kind: 'typed', prompt: `Work out {{${n1}/${d1}}} ÷ {{${n2}/${d2}}}. Give your answer in its simplest form.`, numeric: { value: mixed(n1 * d2, d1 * n2), form: 'simplest' },
        explain: `Dividing by a fraction is the same as multiplying by its reciprocal (flip it): {{${n1}/${d1}}} × {{${d2}/${n2}}} = ${raw}${same ? '' : ` = ${fin}`}.`,
        steps: ['Keep the first fraction, change ÷ to ×, flip the second fraction.', `{{${n1}/${d1}}} × {{${d2}/${n2}}} = ${raw}.`, last],
      };
    }
    const w1 = rng.int(1, 3), d1 = rng.pick([2, 3, 4, 5]), n1 = rng.int(1, d1 - 1), d2 = rng.pick([2, 3, 4, 5]), n2 = rng.int(1, d2 - 1), w2 = rng.int(1, 2);
    if (g(n1, d1) !== 1 || g(n2, d2) !== 1) return MATHS3_GENERATORS.fracMixed(3, rng);
    const top1 = w1 * d1 + n1, top2 = w2 * d2 + n2;
    return {
      kind: 'typed', prompt: `Work out ${w1} {{${n1}/${d1}}} × ${w2} {{${n2}/${d2}}}. Give your answer as a mixed number in its simplest form.`, numeric: { value: mixed(top1 * top2, d1 * d2), form: 'mixed' },
      explain: `Change to improper fractions: {{${top1}/${d1}}} × {{${top2}/${d2}}} = {{${top1 * top2}/${d1 * d2}}} = ${tex(top1 * top2, d1 * d2)}.`,
      steps: [`Mixed numbers must become improper fractions first: ${w1} {{${n1}/${d1}}} = {{${top1}/${d1}}} and ${w2} {{${n2}/${d2}}} = {{${top2}/${d2}}}.`, `Multiply tops and bottoms: {{${top1 * top2}/${d1 * d2}}}.`, `Back to a mixed number, simplified: ${tex(top1 * top2, d1 * d2)}.`],
    };
  },

  circles(level, rng) {
    if (level === 1) {
      const byD = rng.chance(0.5), r = rng.int(2, 12), d = byD ? rng.int(3, 20) : 2 * r;
      const C = PI * d;
      return {
        kind: 'typed', prompt: `A circle has a ${byD ? 'diameter' : 'radius'} of ${byD ? d : r} cm. Taking π = 3.14, what is its circumference?`, numeric: { value: hund(C), form: 'any' }, unit: 'cm',
        explain: `Circumference = π × diameter. ${byD ? '' : `Diameter = 2 × ${r} = ${d}. `}3.14 × ${d} = ${hund(C)} cm.`,
        steps: ['Circumference = π × d (or 2 × π × r).', byD ? `d = ${d}, so 3.14 × ${d}.` : `The radius is ${r}, so the diameter is ${d}: 3.14 × ${d}.`, `= ${hund(C)} cm.`],
      };
    }
    if (level === 2) {
      const r = rng.int(2, 12), A = PI * r * r;
      return {
        kind: 'typed', prompt: `A circle has a radius of ${r} cm. Taking π = 3.14, what is its area?`, numeric: { value: hund(A), form: 'any' }, unit: 'cm²',
        explain: `Area = π × r² = 3.14 × ${r}² = 3.14 × ${r * r} = ${hund(A)} cm².`,
        steps: ['Area = π × r². Square the radius FIRST.', `${r}² = ${r * r}, then 3.14 × ${r * r}.`, `= ${hund(A)} cm².`],
      };
    }
    const r = rng.int(2, 10) * 2;
    return rng.chance(0.5) ? {
      kind: 'typed', prompt: `A semicircle has a radius of ${r} cm. Taking π = 3.14, what is its perimeter (the curved edge plus the straight edge)?`, numeric: { value: hund(PI * r + 2 * r * 100), form: 'any' }, unit: 'cm',
      explain: `Curved edge = half of 2 × π × r = π × r = 3.14 × ${r} = ${hund(PI * r)}. Straight edge = diameter = ${2 * r}. Total ${hund(PI * r + 2 * r * 100)} cm.`,
      steps: [`Half the circumference: 3.14 × ${2 * r} ÷ 2 = ${hund(PI * r)} cm.`, `Don’t forget the straight edge, the diameter: ${2 * r} cm.`, `${hund(PI * r)} + ${2 * r} = ${hund(PI * r + 2 * r * 100)} cm.`],
    } : {
      kind: 'typed', prompt: `A quarter circle has a radius of ${r} cm. Taking π = 3.14, what is its area?`, numeric: { value: hund((PI * r * r) / 4), form: 'any' }, unit: 'cm²',
      explain: `Whole circle: 3.14 × ${r}² = ${hund(PI * r * r)}. A quarter of that: ${hund((PI * r * r) / 4)} cm².`,
      steps: [`Area of the whole circle: 3.14 × ${r * r} = ${hund(PI * r * r)} cm².`, 'A quarter circle is a quarter of the area.', `${hund(PI * r * r)} ÷ 4 = ${hund((PI * r * r) / 4)} cm².`],
    };
  },
};
