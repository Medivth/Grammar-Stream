// Year 2 greater depth: tricky scales, deducing new ×/÷ facts, balancing number sentences,
// sum-and-difference problems, multi-step "which is more?", time to 5 minutes. Same contract as
// ks1maths.js. Bar models here use sized pieces (js/ui/diagrams.js barModel `segs`) so two
// amounts sit on one scale and the extra bit can be seen.

import { pic, pvWhole } from './pictures.js';

const pad = (n) => String(n).padStart(2, '0');
const money = (p) => (p >= 100 ? `£${(p / 100).toFixed(2)}` : `${p}p`);
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
function choice(prompt, correct, wrongs, rng, extra = {}) {
  const seen = new Set([correct]);
  const ws = wrongs.map((w) => (typeof w === 'string' ? { text: w } : w)).filter((w) => !seen.has(w.text) && seen.add(w.text));
  return { kind: 'choice', prompt, options: rng.shuffle([{ text: correct, correct: true }, ...ws]), ...extra };
}
const typed = (prompt, value, explain, steps, extra = {}) => ({ kind: 'typed', prompt, numeric: { value: String(value), form: 'any' }, explain, steps, ...extra });
// a bar model of sized pieces: rows [{ label?, segs: [{ v, text?, shaded?, mark?, out? }] }]
const segBar = (rows, extra = {}) => ({ type: 'barmodel', rows, ...extra });
const seg = (v, text = v, more = {}) => ({ v, text: String(text), ...more });
const groups = (n, size, text = size) => Array.from({ length: n }, () => seg(size, text));

// ---------------------------------------------------------------- scales
// [thing, unit, step, marks between numbers, marks on the scale]
const SCALES = {
  1: [['ruler', 'cm', 1, 5, 20], ['thermometer', '°C', 2, 5, 20], ['jug', 'ml', 50, 2, 10], ['scales', 'kg', 5, 2, 10], ['scales', 'g', 100, 5, 10]],
  2: [['ruler', 'cm', 1, 10, 30], ['thermometer', '°C', 2, 10, 30], ['jug', 'ml', 20, 5, 25], ['scales', 'g', 50, 10, 20], ['scales', 'kg', 2, 5, 25], ['jug', 'ml', 100, 5, 10]],
  3: [['jug', 'ml', 10, 5, 20], ['jug', 'ml', 20, 5, 25], ['scales', 'g', 100, 5, 10], ['scales', 'g', 20, 5, 25], ['thermometer', '°C', 10, 5, 10], ['ruler', 'cm', 2, 5, 15], ['jug', 'ml', 50, 10, 20]],
};
const SCALE_ASK = {
  ruler: ['How long is the toy racing car? Read the ruler at the arrow.', 'How long is the dinosaur bone? Read the ruler at the arrow.'],
  thermometer: ['What temperature does the thermometer show?', 'How warm is it inside the space station? Read the thermometer.'],
  jug: ['How much water is in Sir Rowan’s jug?', 'How much juice is in the jug?'],
  scales: ['How heavy is the bag of moon rocks?', 'How heavy is the box of dinosaur eggs?'],
};
const SCALE_NAME = { ruler: 'ruler', thermometer: 'thermometer', jug: 'jug', scales: 'weighing scale' };
const unitSay = (v, u) => `${v}${u === '°C' ? '°C' : ` ${u}`}`;

function scaleSetup(rng, level) {
  const [thing, unit, step, every, marks] = rng.pick(SCALES[level]);
  const max = step * marks, gap = step * every;
  const labels = Array.from({ length: marks / every + 1 }, (_, i) => i * gap);
  return { thing, unit, step, every, marks, max, gap, labels };
}
// "work out what each mark is worth first", then count on from the number before the arrow
function worthSteps(sc) {
  return `The numbers go up in ${sc.gap}s, with ${sc.every} jumps between them. ${sc.gap} ÷ ${sc.every} = ${sc.step}, so each mark is worth ${unitSay(sc.step, sc.unit)}.`;
}

// ---------------------------------------------------------------- clocks
const WORD = { 5: 'five', 10: 'ten', 20: 'twenty', 25: 'twenty-five' };
/** A 5-minute time as it is said: "twenty-five past 4", "quarter to 9", "6 o’clock". */
export function saidTime(h, m) {
  const next = (h % 12) + 1;
  if (m === 0) return `${h} o’clock`;
  if (m === 15) return `quarter past ${h}`;
  if (m === 30) return `half past ${h}`;
  if (m === 45) return `quarter to ${next}`;
  return m < 30 ? `${WORD[m]} past ${h}` : `${WORD[60 - m]} to ${next}`;
}
const digital = (h, m) => `${h}:${pad(m)}`;
const addMins = (h, m, d) => { const t = (((h % 12) * 60 + m + d) % 720 + 720) % 720; return [Math.floor(t / 60) || 12, t % 60]; };
function handsExplain(h, m) {
  const next = (h % 12) + 1;
  if (m === 0) return `The long hand points to 12 and the short hand points to ${h}: ${h} o’clock.`;
  if (m <= 30) return `The long hand points to ${m / 5}. Counting in 5s from 12: ${Array.from({ length: m / 5 }, (_, i) => 5 * (i + 1)).join(', ')}. That is ${m} minutes past. The short hand has gone past ${h}, so it is ${saidTime(h, m)}.`;
  return `The long hand points to ${m / 5}. From there on to 12 is ${(60 - m) / 5} jump${m === 55 ? '' : 's'} of 5: ${60 - m} minutes to the next hour. The short hand is nearly at ${next}, so it is ${saidTime(h, m)}.`;
}

// ---------------------------------------------------------------- word problems
const PAIRS = [['Maya', 'Sam'], ['Jack', 'Sam'], ['Turbo', 'Blaze'], ['Rosa', 'Maya'], ['Bleep', 'Zoom']];
const THINGS = ['stickers', 'dinosaur cards', 'space stickers', 'marbles', 'gold coins', 'conkers'];
// money is in whole pounds here
const amt = (n, cash) => (cash ? `£${n}` : String(n));

// equal amounts packed two ways: [packs, size, packs, size]
const SAME = [[4, 5, 2, 10], [6, 5, 3, 10], [5, 2, 2, 5], [2, 10, 4, 5], [3, 10, 6, 5], [4, 10, 8, 5], [10, 2, 2, 10]];
const PACKS = [['packets', 'biscuits'], ['sheets', 'stickers'], ['bags', 'sweets'], ['nests', 'dinosaur eggs'], ['bags', 'gold coins'], ['boxes', 'moon rocks']];

export const KS1_DEPTH_GENERATORS = {
  k2Scales(level, rng) {
    const sc = scaleSetup(rng, level);
    const kind = level === 3 ? rng.pick(['between', 'between', 'place', 'worth']) : level === 2 && rng.chance(0.25) ? 'worth' : 'read';
    if (kind === 'worth') {
      return typed(`What is each small mark worth on this ${SCALE_NAME[sc.thing]}?`, sc.step, `${worthSteps(sc)}`,
        [`I find two numbers next to each other: ${sc.labels[1] - sc.gap} and ${sc.labels[1]}.`, `I count the jumps between them: ${sc.every}.`, `${sc.gap} ÷ ${sc.every} = ${sc.step}, so each mark is worth ${unitSay(sc.step, sc.unit)}.`],
        { unit: sc.unit, diagram: { type: 'numline', min: 0, max: sc.max, step: sc.step, labels: sc.labels } });
    }
    if (kind === 'place') {
      // place on a mark that has no number: the arrow must land closer to it than to the marks either side
      let k; do k = rng.int(1, sc.marks - 1); while (k % sc.every === 0);
      const v = k * sc.step, base = Math.floor(v / sc.gap) * sc.gap, j = (v - base) / sc.step;
      return {
        kind: 'numberline', prompt: `Put the arrow where ${unitSay(v, sc.unit)} would be on this ${SCALE_NAME[sc.thing]}.`,
        min: 0, max: sc.max, ticks: sc.marks, labels: sc.labels, target: v, tolerance: sc.step * 0.4, targetLabel: unitSay(v, sc.unit),
        explain: `${worthSteps(sc)} ${v} is ${plural(j, 'mark')} after ${base}.`,
        steps: [`First I work out what each mark is worth: ${sc.gap} ÷ ${sc.every} = ${sc.step}.`, `${v} comes after ${base}.`, `I count on ${j} mark${j === 1 ? '' : 's'} from ${base} in ${sc.step}s: ${Array.from({ length: j }, (_, i) => base + (i + 1) * sc.step).join(', ')}.`],
      };
    }
    if (kind === 'between') {
      // the arrow sits halfway between two marks; a sensible estimate is close to halfway
      const k = rng.int(0, sc.marks - 1), lo = k * sc.step, hi = lo + sc.step, v = lo + sc.step / 2;
      return {
        ...typed(`${rng.pick(SCALE_ASK[sc.thing])} The arrow is between two marks: about how much is it?`, v, `${worthSteps(sc)} The arrow is between ${lo} and ${hi}, halfway. Halfway between ${lo} and ${hi} is ${v}, so it is about ${unitSay(v, sc.unit)}.`,
          [`Each mark is worth ${sc.step}: ${sc.gap} ÷ ${sc.every} = ${sc.step}.`, `The arrow is between the marks for ${lo} and ${hi}.`, `It is halfway, and halfway between ${lo} and ${hi} is ${v}.`],
          { unit: sc.unit, prefix: 'about', diagram: { type: 'numline', min: 0, max: sc.max, step: sc.step, labels: sc.labels, mark: v } }),
        numeric: { value: String(v), form: 'any', tol: sc.step / 4 },
      };
    }
    let k; do k = rng.int(1, sc.marks - 1); while (k % sc.every === 0);
    const v = k * sc.step, base = Math.floor(v / sc.gap) * sc.gap, j = (v - base) / sc.step;
    // count from the nearer number: on from the one before, or back from the one after
    const back = j > sc.every / 2, from = back ? base + sc.gap : base, n = back ? sc.every - j : j;
    const counted = Array.from({ length: n }, (_, i) => from + (back ? -1 : 1) * (i + 1) * sc.step).join(', ');
    return typed(rng.pick(SCALE_ASK[sc.thing]), v, `${worthSteps(sc)} The arrow is ${plural(n, 'mark')} ${back ? 'before' : 'after'} ${from}: ${unitSay(v, sc.unit)}.`,
      [`First I work out what each mark is worth: ${sc.gap} ÷ ${sc.every} = ${sc.step}.`, `The arrow is ${plural(n, 'mark')} ${back ? 'before' : 'after'} ${from}.`, `I count ${back ? 'back' : 'on'} in ${sc.step}s from ${from}: ${counted}. It is ${unitSay(v, sc.unit)}.`],
      { unit: sc.unit, diagram: { type: 'numline', min: 0, max: sc.max, step: sc.step, labels: sc.labels, mark: v } });
  },

  k2Deduce(level, rng) {
    const T = rng.pick([2, 5, 10]);
    if (level === 1) {
      const kind = rng.pick(['recall', 'turn', 'inverse', 'divide']), b = rng.int(2, 12), p = T * b;
      const boxes = pic(segBar([{ segs: groups(b, T) }], { total: String(p) }), `${b} groups of ${T} make ${p}.`);
      if (kind === 'recall') return typed(`${b} × ${T} =`, p, `${b} lots of ${T} is ${p}.`, [`I count in ${T}s, ${b} times.`, Array.from({ length: Math.min(b, 6) }, (_, i) => (i + 1) * T).join(', ') + (b > 6 ? '…' : '.'), `${b} × ${T} = ${p}.`], boxes);
      if (kind === 'turn') {
        return typed(`${b} × ${T} = ${p}. What is ${T} × ${b}?`, p, `You can multiply in any order: ${T} × ${b} is the same as ${b} × ${T} = ${p}.`, ['Multiplying can be done in any order.', `${T} rows of ${b} is the same as ${b} rows of ${T}: turn the array round.`, `${T} × ${b} = ${p}.`],
          pic({ type: 'array', rows: Math.min(T, b), cols: Math.max(T, b) }, `${Math.min(T, b)} rows of ${Math.max(T, b)}, or ${Math.max(T, b)} columns of ${Math.min(T, b)}: ${p} either way.`));
      }
      if (kind === 'inverse') {
        const by = rng.chance(0.5) ? b : T, ans = p / by;
        return typed(`${b} × ${T} = ${p}. So what is ${p} ÷ ${by}?`, ans, `× and ÷ undo each other. ${b} × ${T} = ${p}, so ${p} ÷ ${by} = ${ans}.`, ['Multiplying and dividing are inverses.', `${p} is made of ${b} × ${T}.`, `${p} ÷ ${by} gives the other number: ${ans}.`], boxes);
      }
      return typed(`${p} ÷ ${T} =`, b, `How many ${T}s make ${p}? ${b} × ${T} = ${p}, so ${p} ÷ ${T} = ${b}.`, [`I count in ${T}s up to ${p}.`, `That takes ${b} jumps.`, `${p} ÷ ${T} = ${b}.`], boxes);
    }
    if (level === 2) {
      const kind = rng.pick(['double', 'halve', 'tens', 'twos', 'fives', 'divbig']);
      if (kind === 'double') {
        const a = rng.pick([2, 5, 10]), b = rng.int(2, 6), p = a * b;
        return typed(`If ${b} × ${a} = ${p}, what is ${2 * b} × ${a}?`, 2 * p, `${2 * b} is double ${b}, so ${2 * b} × ${a} is double ${p}: ${2 * p}.`, [`${2 * b} groups of ${a} is two lots of ${b} groups of ${a}.`, `So I double ${p}.`, `${p} + ${p} = ${2 * p}.`],
          pic(segBar([{ label: `${b} × ${a}`, segs: [seg(p)] }, { label: `${2 * b} × ${a}`, segs: [seg(p), seg(p)] }]), `${2 * b} × ${a} is two lots of ${b} × ${a}: ${p} + ${p} = ${2 * p}.`));
      }
      if (kind === 'halve') {
        const b = rng.int(2, 12), p = 10 * b;
        return typed(`If ${b} × 10 = ${p}, what is ${b} × 5?`, p / 2, `5 is half of 10, so ${b} × 5 is half of ${b} × 10. Half of ${p} is ${p / 2}.`, ['5 is half of 10.', `So ${b} fives is half of ${b} tens.`, `Half of ${p} = ${p / 2}.`],
          pic(segBar([{ label: `${b} × 10`, segs: [seg(p)] }, { label: `${b} × 5`, segs: [seg(p / 2, p / 2, { shaded: true }), seg(p / 2, '', { out: true })] }]), `${b} × 5 is half of ${b} × 10: half of ${p} is ${p / 2}.`));
      }
      if (kind === 'tens') {
        const b = rng.int(11, 20);
        return typed(`10 × ${b} =`, 10 * b, `× 10 makes a number ten times bigger: the digits move one place to the left. ${b} → ${10 * b}.`, ['I know 10 × a number moves its digits one place left.', `${b} becomes ${10 * b}.`, `10 × ${b} = ${10 * b}.`], pic(pvWhole(['H', 'T', 'O'], [b, 10 * b], { shift: 1 }), `× 10: every digit moves one place to the left, and a 0 fills the ones.`));
      }
      if (kind === 'twos') {
        const b = rng.int(11, 25), t = b - (b % 10), o = b % 10;
        return typed(`2 × ${b} =`, 2 * b, `2 × ${b} is double ${b}. Double ${t} is ${2 * t}${o ? ` and double ${o} is ${2 * o}` : ''}: ${2 * b}.`, ['2 × a number is the same as doubling it.', `Double ${t} = ${2 * t}${o ? `, double ${o} = ${2 * o}` : ''}.`, `${o ? `${2 * t} + ${2 * o} = ` : ''}${2 * b}.`],
          pic(segBar([{ segs: [seg(b), seg(b)] }], { total: String(2 * b) }), `Two lots of ${b}: ${b} + ${b} = ${2 * b}.`));
      }
      if (kind === 'fives') {
        const b = rng.int(11, 15), r = b - 10;
        return typed(`5 × ${b} =`, 5 * b, `Split ${b} into 10 and ${r}. 5 × 10 = 50 and 5 × ${r} = ${5 * r}. 50 + ${5 * r} = ${5 * b}.`, [`${b} = 10 + ${r}.`, `5 × 10 = 50 and 5 × ${r} = ${5 * r}.`, `50 + ${5 * r} = ${5 * b}.`],
          pic(segBar([{ label: `5 × ${b}`, segs: [seg(50, '5 × 10 = 50'), seg(5 * r, 5 * r, { shaded: true })] }], { total: String(5 * b) }), `5 × ${b} is 5 × 10 = 50 and 5 × ${r} = ${5 * r}: ${5 * b} altogether.`));
      }
      // dividing beyond the known facts: split the number into a known part and the rest
      const a = rng.pick([2, 5, 10]), b = a === 10 ? rng.int(11, 20) : a === 5 ? rng.int(11, 14) : rng.int(11, 19), p = a * b, known = a * 10, rest = p - known;
      return typed(`${p} ÷ ${a} =`, b, `Split ${p} into ${known} and ${rest}. ${known} ÷ ${a} = 10 and ${rest} ÷ ${a} = ${rest / a}. 10 + ${rest / a} = ${b}.`, [`${p} = ${known} + ${rest}, and I know ${known} ÷ ${a} = 10.`, `${rest} ÷ ${a} = ${rest / a}.`, `10 + ${rest / a} = ${b}. Check: ${b} × ${a} = ${p}.`],
        pic(segBar([{ segs: [seg(known, `${known} ÷ ${a} = 10`), seg(rest, rest, { shaded: true })] }], { total: String(p) }), `${p} = ${known} + ${rest}. ${known} ÷ ${a} = 10 and ${rest} ÷ ${a} = ${rest / a}: ${b}.`));
    }
    const kind = rng.pick(['tensx', 'fivesbig', 'missing', 'which', 'which', 'chain']);
    if (kind === 'tensx') {
      const [t, a] = rng.pick([[2, 5], [5, 3], [3, 5], [5, 4], [2, 7], [4, 5], [5, 6], [2, 9], [5, 5], [3, 10], [6, 5]]);
      const big = t * 10, swap = rng.chance(0.5);
      return typed(swap ? `${a} × ${big} =` : `${big} × ${a} =`, big * a, `${big} is 10 times ${t}. ${t} × ${a} = ${t * a}, so ${big} × ${a} is ten times bigger: ${big * a}.`, [`${big} = ${t} × 10.`, `${t} × ${a} = ${t * a}.`, `Ten times bigger: ${t * a} × 10 = ${big * a}.`],
        pic(pvWhole(['H', 'T', 'O'], [t * a, big * a], { shift: 1 }), `${t} × ${a} = ${t * a}, so ${big} × ${a} = ${big * a}: ten times bigger.`));
    }
    if (kind === 'fivesbig') {
      const b = rng.int(13, 24);
      return typed(`5 × ${b} =`, 5 * b, `5 is half of 10. 10 × ${b} = ${10 * b}, and half of ${10 * b} is ${5 * b}.`, [`10 × ${b} = ${10 * b}.`, `5 × ${b} is half of that.`, `Half of ${10 * b} = ${5 * b}.`],
        pic(segBar([{ label: `10 × ${b}`, segs: [seg(10 * b)] }, { label: `5 × ${b}`, segs: [seg(5 * b, 5 * b, { shaded: true }), seg(5 * b, '', { out: true })] }]), `5 × ${b} is half of 10 × ${b}: half of ${10 * b} is ${5 * b}.`));
    }
    if (kind === 'missing') {
      const a = rng.pick([2, 5, 10]), b = rng.int(11, a === 5 ? 15 : 19), p = a * b, known = a * 10, rest = p - known;
      return typed(`? × ${a} = ${p}`, b, `How many ${a}s make ${p}? ${known} is 10 lots of ${a}, and ${rest} is ${rest / a} more lots. 10 + ${rest / a} = ${b}.`, [`10 × ${a} = ${known}.`, `${p} − ${known} = ${rest}, and ${rest} ÷ ${a} = ${rest / a}.`, `So ? = 10 + ${rest / a} = ${b}.`],
        pic(segBar([{ segs: [seg(known, `10 × ${a}`), seg(rest, `${rest / a} × ${a}`, { shaded: true })] }], { total: String(p) }), `${p} = 10 lots of ${a} and ${rest / a} more lots: ${b} × ${a} = ${p}.`));
    }
    if (kind === 'chain') {
      const b = rng.int(3, 12), p = 10 * b;
      return typed(`${b} × 10 = ${p}. Use it to work out ${p} ÷ 5.`, 2 * b, `${p} ÷ 10 = ${b}. Groups of 5 are half as big as groups of 10, so there are twice as many: ${2 * b}.`, [`${p} ÷ 10 = ${b}.`, 'A 5 is half of a 10, so each 10 makes two 5s.', `${b} × 2 = ${2 * b}. Check: ${2 * b} × 5 = ${p}.`],
        pic(segBar([{ label: 'tens', segs: groups(b, 10) }, { label: 'fives', segs: groups(2 * b, 5, '') }]), `${p} is ${b} tens or ${2 * b} fives: ${p} ÷ 5 = ${2 * b}.`));
    }
    // which fact helps? the wrong ways are the usual slips
    const how = rng.pick(['split', 'double', 'halve']);
    if (how === 'split') {
      const b = rng.pick([12, 13, 14, 16, 17, 18, 19]), r = b - 10;
      return choice(`Which facts help you work out 5 × ${b}?`, `5 × 10 = 50 and 5 × ${r} = ${5 * r}`, [
        { text: `5 × 1 = 5 and 5 × ${r} = ${5 * r}`, feedback: `${b} is 10 and ${r}, not 1 and ${r}. You need 5 × 10.` },
        { text: `5 + 10 = 15 and 5 + ${r} = ${5 + r}`, feedback: 'Adding is not the same as multiplying. 5 × 10 is 50, not 15.' },
        { text: `5 × 10 = 50 and ${r} × 10 = ${r * 10}`, feedback: `${b} is 10 and ${r}, so you need 5 lots of ${r}, not ${r} lots of 10.` },
      ], rng, {
        explain: `Split ${b} into 10 and ${r}. 5 × 10 = 50 and 5 × ${r} = ${5 * r}, so 5 × ${b} = 50 + ${5 * r} = ${5 * b}.`,
        steps: [`${b} = 10 + ${r}.`, `5 × 10 = 50 and 5 × ${r} = ${5 * r}.`, `Add them: 5 × ${b} = ${5 * b}.`],
        ...pic(segBar([{ label: `5 × ${b}`, segs: [seg(50, '5 × 10 = 50'), seg(5 * r, 5 * r, { shaded: true })] }], { total: String(5 * b) }), `5 × ${b} = 5 × 10 + 5 × ${r} = 50 + ${5 * r} = ${5 * b}.`),
      });
    }
    if (how === 'double') {
      const b = rng.int(13, 29);
      return choice(`Which helps you work out 2 × ${b}?`, `double ${b}`, [
        { text: `half of ${b}`, feedback: `2 × ${b} is two lots of ${b}, so it is bigger than ${b}. Halving makes it smaller.` },
        { text: `${b} + 2`, feedback: `${b} + 2 adds 2 once. 2 × ${b} means ${b} + ${b}.` },
        { text: `${b} × 10, then add 2`, feedback: `${b} × 10 is ten lots of ${b}: far too many.` },
      ], rng, {
        explain: `2 × ${b} means two lots of ${b}: ${b} + ${b}, which is double ${b} = ${2 * b}.`,
        steps: ['× 2 is the same as doubling.', `${b} + ${b}.`, `= ${2 * b}.`],
        ...pic(segBar([{ segs: [seg(b), seg(b)] }], { total: String(2 * b) }), `Two lots of ${b}: double ${b} is ${2 * b}.`),
      });
    }
    const b = rng.int(13, 24);
    return choice(`Which helps you work out 5 × ${b}?`, `10 × ${b} = ${10 * b}, then halve it`, [
      { text: `10 × ${b} = ${10 * b}, then double it`, feedback: `5 is half of 10, so 5 × ${b} is half of 10 × ${b}, not double.` },
      { text: `5 × 10 = 50, then add ${b - 10}`, feedback: `${b} = 10 + ${b - 10}, so you add 5 × ${b - 10} = ${5 * (b - 10)}, not ${b - 10}.` },
      { text: `${b} ÷ 5`, feedback: 'Dividing shares out; 5 × means 5 lots of the number.' },
    ], rng, {
      explain: `5 is half of 10, so 5 × ${b} is half of 10 × ${b}. Half of ${10 * b} is ${5 * b}.`,
      steps: [`10 × ${b} = ${10 * b}.`, '5 is half of 10.', `Half of ${10 * b} = ${5 * b}.`],
      ...pic(segBar([{ label: `10 × ${b}`, segs: [seg(10 * b)] }, { label: `5 × ${b}`, segs: [seg(5 * b, 5 * b, { shaded: true }), seg(5 * b, '', { out: true })] }]), `5 × ${b} is half of 10 × ${b}: ${5 * b}.`),
    });
  },

  k2Balance(level, rng) {
    const sameTotal = (topSegs, botSegs, total, caption) => pic(segBar([{ label: 'left', segs: topSegs }, { label: 'right', segs: botSegs }], { total: String(total) }), caption);
    if (level === 1) {
      const t = rng.int(11, 20), a = rng.int(3, t - 3), c = rng.int(2, t - 2);
      if (c === a) return KS1_DEPTH_GENERATORS.k2Balance(1, rng);
      const b = t - a, ans = t - c, flip = rng.chance(0.4);
      return typed(flip ? `? + ${c} = ${a} + ${b}` : `${a} + ${b} = ${c} + ?`, ans, `The = sign means both sides are the same. ${a} + ${b} = ${t}, so ${c} + ? must make ${t} too: ${t} − ${c} = ${ans}.`,
        [`Work out the full side: ${a} + ${b} = ${t}.`, `The other side must make ${t} as well.`, `${t} − ${c} = ${ans}. Check: ${c} + ${ans} = ${t}.`],
        sameTotal([seg(a), seg(b)], [seg(c), seg(ans, ans, { shaded: true })], t, `Both sides make ${t}. ${c} + ${ans} = ${t}.`));
    }
    const kind = level === 2 ? rng.pick(['near', 'near', 'sub', 'both', 'mult', 'tf']) : rng.pick(['three', 'three', 'subfar', 'mult', 'reason', 'reason']);
    if (kind === 'near') {
      let a; do a = rng.int(21, 79); while (a % 10 === 0);
      const b = rng.int(12, 49), c = a - (a % 10), k = a % 10, ans = b + k;
      return typed(`${a} + ${b} = ${c} + ?`, ans, `${a} is ${k} more than ${c}. So the missing number must be ${k} more than ${b}: ${ans}. (Both sides make ${a + b}.)`,
        [`Compare ${a} and ${c}: ${a} is ${k} more.`, `So the other number must be ${k} more than ${b} to balance.`, `${b} + ${k} = ${ans}. Check: ${c} + ${ans} = ${a + b}.`],
        sameTotal([seg(c), seg(k, k, { mark: true }), seg(b)], [seg(c), seg(ans, ans, { shaded: true })], a + b, `Move the ${k} across: ${b} + ${k} = ${ans}. Both sides make ${a + b}.`));
    }
    if (kind === 'sub' || kind === 'subfar') {
      const a = rng.int(kind === 'sub' ? 40 : 52, 95), b = rng.int(12, a - 15), k = kind === 'sub' ? rng.pick([1, 1, 2, 3]) : rng.pick([2, 3, 5, -2, -3]);
      const d = a - b, askFirst = kind === 'subfar' && rng.chance(0.5);
      const prompt = askFirst ? `${a} − ${b} = ? − ${b + k}` : `${a} − ${b} = ${a + k} − ?`;
      const ans = askFirst ? a + k : b + k, up = k > 0 ? 'up' : 'down', kk = Math.abs(k);
      return typed(prompt, ans, `When you take away, moving BOTH numbers ${up} by the same amount keeps the difference the same. ${a} − ${b} = ${d}, and ${a + k} − ${b + k} = ${d} too.`,
        [askFirst ? `${b} went ${up} by ${kk} to make ${b + k}.` : `${a} went ${up} by ${kk} to make ${a + k}.`, askFirst ? `So ${a} must go ${up} by ${kk} too: ${a + k}.` : `So ${b} must go ${up} by ${kk} too: ${b + k}.`, `Check: ${a + k} − ${b + k} = ${d} and ${a} − ${b} = ${d}.`],
        pic(segBar([{ label: `${a} − ${b}`, segs: [seg(d, d, { shaded: true }), seg(b, b, { out: true })] }, { label: `${a + k} − ${b + k}`, segs: [seg(d, d, { shaded: true }), seg(b + k, b + k, { out: true })] }]), `The dashed part is taken away. Both numbers moved ${up} ${kk}, so the difference (blue) is still ${d}.`));
    }
    if (kind === 'both') {
      const c = rng.int(12, 20), dd = rng.int(2, 6), r = c - dd, b = rng.int(3, r - 3), ans = r - b;
      return typed(`? + ${b} = ${c} − ${dd}`, ans, `Work out the side you can: ${c} − ${dd} = ${r}. Then ? + ${b} = ${r}, so ? = ${r} − ${b} = ${ans}.`,
        [`${c} − ${dd} = ${r}.`, `So ? + ${b} must make ${r}.`, `${r} − ${b} = ${ans}. Check: ${ans} + ${b} = ${r}.`],
        pic(segBar([{ label: `? + ${b}`, segs: [seg(ans, ans, { shaded: true }), seg(b)] }, { label: `${c} − ${dd}`, segs: [seg(r), seg(dd, dd, { out: true })] }]), `${c} − ${dd} = ${r}, and ${ans} + ${b} = ${r}: both sides are the same.`));
    }
    if (kind === 'mult') {
      // a × b = c × ? with every number from the 2, 5 and 10 facts
      const [a, b, c] = rng.pick(level === 2 ? [[2, 10, 4], [5, 2, 10], [10, 2, 4], [2, 5, 10], [4, 5, 2], [10, 3, 5], [5, 4, 10], [2, 6, 4], [10, 4, 5], [6, 5, 10]] : [[10, 4, 5], [5, 8, 10], [2, 10, 5], [10, 6, 5], [4, 10, 5], [5, 6, 10], [2, 12, 4], [10, 5, 2], [8, 5, 10], [3, 10, 5]]);
      const p = a * b, ans = p / c;
      return typed(`${a} × ${b} = ${c} × ?`, ans, `${a} × ${b} = ${p}. So ${c} × ? must make ${p} too: ${p} ÷ ${c} = ${ans}.`,
        [`${a} × ${b} = ${p}.`, `${c} × ? = ${p}.`, `${p} ÷ ${c} = ${ans}. Check: ${c} × ${ans} = ${p}.`],
        pic(segBar([{ label: `${a} × ${b}`, segs: groups(a, b) }, { label: `${c} × ${ans}`, segs: groups(c, ans) }]), `${a} groups of ${b} and ${c} groups of ${ans} are both ${p}.`));
    }
    if (kind === 'three') {
      // 29 + 17 = 15 + 4 + ?: 15 + 4 is a little less than 29, so ? is that much more than 17
      const a = rng.int(25, 69), b = rng.int(12, 39), k = rng.pick([1, 2, 3, 10, 10, 20].filter((x) => a - x >= 14)), cd = a - k;
      const c = rng.int(10, cd - 3), d = cd - c, ans = b + k;
      return typed(`${a} + ${b} = ${c} + ${d} + ?`, ans, `${c} + ${d} = ${cd}, which is ${k} less than ${a}. So ? must be ${k} more than ${b}: ${ans}. (Both sides make ${a + b}.)`,
        [`${c} + ${d} = ${cd}.`, `${cd} is ${k} less than ${a}, so ? is ${k} more than ${b}.`, `${b} + ${k} = ${ans}. Check: ${c} + ${d} + ${ans} = ${a + b}.`],
        sameTotal([seg(cd), seg(k, k, { mark: true }), seg(b)], [seg(c), seg(d), seg(ans, ans, { shaded: true })], a + b, `${a} is ${cd} and ${k} more. ${b} + ${k} = ${ans}. Both sides make ${a + b}.`));
    }
    // true or false (level 2), and why (level 3)
    const sub = rng.chance(0.5), holds = rng.chance(0.5);
    const a = rng.int(31, 89), b = rng.int(sub ? 12 : 5, sub ? Math.min(29, a - 10) : 19), k = rng.pick([1, 1, 2]);
    let lhs, rhs, L, R;
    if (!sub) { [L, R] = [a + b, holds ? (a - k) + (b + k) : (a + k) + (b + k)]; lhs = `${a} + ${b}`; rhs = holds ? `${a - k} + ${b + k}` : `${a + k} + ${b + k}`; }
    else { [L, R] = [a - b, holds ? (a + k) - (b + k) : (a + k) - (b - k)]; lhs = `${a} − ${b}`; rhs = holds ? `${a + k} − ${b + k}` : `${a + k} − ${b - k}`; }
    const eq = `${lhs} = ${rhs}`, why = `${lhs} = ${L} and ${rhs} = ${R}.`;
    const rule = sub ? 'For taking away, BOTH numbers must move the same way to keep the difference the same.' : 'For adding, if one number goes down and the other goes up by the same amount, the total stays the same.';
    const tfPic = pic(segBar([{ label: 'left', segs: sub ? [seg(L, L, { shaded: true })] : [seg(a), seg(b)] }, { label: 'right', segs: sub ? [seg(R, R, { shaded: true })] : (holds ? [seg(a - k), seg(b + k)] : [seg(a + k), seg(b + k)]) }]), `${why} ${L === R ? 'The bars match.' : 'The bars are different lengths.'}`);
    if (kind === 'tf') {
      return choice(`True or false?   ${eq}`, holds ? 'True' : 'False', [holds ? 'False' : 'True'], rng, {
        explain: `${why} ${holds ? 'They are the same, so it is true.' : 'They are different, so it is false.'} ${rule}`,
        steps: ['Work out each side, or look at how the numbers changed.', why, holds ? 'Same: true.' : 'Different: false.'], ...tfPic,
      });
    }
    let right, wrongs;
    if (!sub && holds) {
      right = `True: one number went down ${k} and the other went up ${k}`;
      wrongs = [{ text: 'False: the numbers are different', feedback: `Different numbers can make the same total. ${why}` }, { text: `True: both numbers went up ${k}`, feedback: `Look again: ${a} went down to ${a - k}, and ${b} went up to ${b + k}.` }, { text: `False: ${rhs} is ${R + 1}`, feedback: `Check the adding: ${rhs} = ${R}.` }];
    } else if (!sub) {
      right = `False: both numbers went up ${k}, so the total went up ${2 * k}`;
      wrongs = [{ text: `True: both numbers went up ${k}`, feedback: `If both numbers go up, the total goes up too. ${why}` }, { text: 'True: you can add in any order', feedback: 'Turning round keeps the same numbers. These are different numbers.' }, { text: `False: ${lhs} is ${L + 1}`, feedback: `Check the adding: ${lhs} = ${L}. It is false for a different reason.` }];
    } else if (holds) {
      right = `True: both numbers went up ${k}, so the difference stays the same`;
      wrongs = [{ text: 'False: the numbers are different', feedback: `Different numbers can have the same difference. ${why}` }, { text: `False: ${a + k} is bigger, so the answer is bigger`, feedback: `${b + k} is bigger too, and by the same amount. ${why}` }, { text: `True: one number went up ${k} and the other went down ${k}`, feedback: `Look again: ${b} went UP to ${b + k}.` }];
    } else {
      right = `False: ${a} went up but ${b} went down, so the difference grew by ${2 * k}`;
      wrongs = [{ text: `True: one number went up ${k} and the other went down ${k}`, feedback: `That trick works for adding, not taking away. ${why}` }, { text: 'True: both sides use nearly the same numbers', feedback: `Nearly the same is not the same. ${why}` }, { text: 'False: you can never change the numbers', feedback: `You can, if both numbers move the same way: ${a + k} − ${b + k} = ${L}.` }];
    }
    return choice(`${eq}   Is it true or false, and why?`, right, wrongs, rng, {
      explain: `${why} ${rule}`, steps: [`Look at how ${a} and ${b} changed.`, rule, `${why} ${L === R ? 'True.' : 'False.'}`], ...tfPic,
    });
  },

  k2Think(level, rng) {
    const [A, B] = rng.shuffle(rng.pick(PAIRS)), cash = rng.chance(0.3), thing = rng.pick(THINGS);
    const of = cash ? '' : ` ${thing}`, many = cash ? 'How much' : `How many ${thing}`, unitX = cash ? { unit: '£', unitBefore: true } : {};
    const two = (aSegs, bSegs, extra, caption) => pic(segBar([{ label: A, segs: aSegs }, { label: B, segs: bSegs }], extra), caption);
    if (level === 1) {
      const kind = rng.pick(['more', 'fewer', 'difference']), x = rng.int(8, 30), d = rng.int(2, 9);
      if (kind === 'more') return typed(`${B} has ${amt(x, cash)}${of}. ${A} has ${amt(d, cash)} more than ${B}. ${many} does ${A} have?`, x + d, `${A} has the same as ${B} and ${amt(d, cash)} more: ${x} + ${d} = ${x + d}.`, [`“More than” means ${A} has the bigger amount.`, `${A} = ${x} + ${d}.`, `= ${amt(x + d, cash)}.`],
        { ...unitX, ...two([seg(x, amt(x, cash)), seg(d, amt(d, cash), { mark: true })], [seg(x, amt(x, cash))], {}, `${A}’s bar is ${B}’s bar plus the extra ${amt(d, cash)}: ${amt(x + d, cash)}.`) });
      if (kind === 'fewer') return typed(`${B} has ${amt(x + d, cash)}${of}. ${A} has ${cash ? `£${d} less` : `${d} fewer`} than ${B}. ${many} does ${A} have?`, x, `${A} has ${amt(d, cash)} less than ${B}: ${x + d} − ${d} = ${x}.`, [`${cash ? '“Less than”' : '“Fewer than”'} means ${A} has the smaller amount.`, `${A} = ${x + d} − ${d}.`, `= ${amt(x, cash)}.`],
        { ...unitX, ...two([seg(x, amt(x, cash))], [seg(x, amt(x, cash)), seg(d, amt(d, cash), { mark: true })], {}, `${B}’s bar has an extra ${amt(d, cash)}. Without it, ${A} has ${amt(x, cash)}.`) });
      return typed(`${A} has ${amt(x + d, cash)}${of}. ${B} has ${amt(x, cash)}. ${cash ? 'How much more money' : `How many more ${thing}`} does ${A} have than ${B}?`, d, `Find the difference: ${x + d} − ${x} = ${d}.`, ['“How many more” means find the difference.', `Line the two amounts up: ${x + d} and ${x}.`, `${x + d} − ${x} = ${d}.`],
        { ...unitX, ...two([seg(x, amt(x, cash)), seg(d, '?', { mark: true })], [seg(x, amt(x, cash))], {}, `The bars match up to ${amt(x, cash)}. The extra bit is the difference: ${amt(d, cash)}.`) });
    }
    const kind = level === 2 ? rng.pick(['sumdiff', 'sumdiff', 'twice', 'back', 'total']) : rng.pick(['sumdiff', 'sumdiff', 'times', 'timesdiff']);
    if (kind === 'sumdiff') {
      const s = level === 2 ? rng.int(2, 12) : rng.int(8, 40), d = level === 2 ? rng.int(1, 6) : rng.int(3, 18), N = 2 * s + d, askBig = rng.chance(0.5);
      const X = askBig ? A : B, ans = askBig ? s + d : s;
      return typed(`Together ${A} and ${B} have ${amt(N, cash)}${of}. ${A} has ${amt(d, cash)} more than ${B}. ${many} does ${X} have?`, ans,
        `Take away the extra ${amt(d, cash)}: ${N} − ${d} = ${N - d}. Now they would have the same, so halve it: ${N - d} ÷ 2 = ${s}. ${B} has ${amt(s, cash)} and ${A} has ${amt(s + d, cash)}. Check: ${s} + ${s + d} = ${N}.`,
        [`Draw two bars: ${A}’s is ${amt(d, cash)} longer.`, `Take the extra off: ${N} − ${d} = ${N - d}, which is two equal bars.`, `${N - d} ÷ 2 = ${s}, so ${B} has ${amt(s, cash)} and ${A} has ${amt(s + d, cash)}.`],
        { ...unitX, ...two([seg(s, amt(s, cash)), seg(d, amt(d, cash), { mark: true })], [seg(s, amt(s, cash))], { side: amt(N, cash) }, `Take away the extra ${amt(d, cash)}: ${N} − ${d} = ${N - d}. Two equal bars: ${N - d} ÷ 2 = ${s}. ${B} ${amt(s, cash)}, ${A} ${amt(s + d, cash)}.`) });
    }
    if (kind === 'back') {
      const s = rng.int(6, 40), d = rng.int(3, 15);
      return typed(`${A} has ${amt(d, cash)} more than ${B}. ${A} has ${amt(s + d, cash)}${of}. ${many} does ${B} have?`, s, `${B} has ${amt(d, cash)} less than ${A}: ${s + d} − ${d} = ${s}.`, [`${A} has more, so ${B} has less.`, `${B} = ${s + d} − ${d}.`, `= ${amt(s, cash)}.`],
        { ...unitX, ...two([seg(s, amt(s, cash)), seg(d, amt(d, cash), { mark: true })], [seg(s, '?')], {}, `${A}’s bar is ${amt(s + d, cash)}. Take off the extra ${amt(d, cash)} to get ${B}’s: ${amt(s, cash)}.`) });
    }
    if (kind === 'total') {
      const s = rng.int(6, 30), d = rng.int(3, 12);
      return typed(`${B} has ${amt(s, cash)}${of}. ${A} has ${amt(d, cash)} more than ${B}. ${many} do they have altogether?`, 2 * s + d, `${A} has ${s} + ${d} = ${s + d}. Altogether: ${s} + ${s + d} = ${2 * s + d}.`, [`First ${A}: ${s} + ${d} = ${s + d}.`, `Then add both amounts.`, `${s} + ${s + d} = ${amt(2 * s + d, cash)}.`],
        { ...unitX, ...two([seg(s, amt(s, cash)), seg(d, amt(d, cash), { mark: true })], [seg(s, amt(s, cash))], { side: amt(2 * s + d, cash) }, `${A}: ${amt(s + d, cash)}. ${B}: ${amt(s, cash)}. Altogether ${amt(2 * s + d, cash)}.`) });
    }
    // k times as many: one bar for the smaller amount, k equal bars for the bigger
    const k = kind === 'twice' ? 2 : rng.pick([2, 3, 4, 5]), s = rng.int(2, kind === 'timesdiff' ? 15 : 10), askBig = rng.chance(0.5);
    const times = k === 2 ? 'twice as many' : `${k} times as many`, X = askBig ? A : B, ans = askBig ? k * s : s;
    const bars = (side, caption) => two(groups(k, s, amt(s, cash)), [seg(s, amt(s, cash))], side ? { side } : {}, caption);
    const stuff = cash ? 'money' : thing;
    if (kind === 'timesdiff') {
      const d = (k - 1) * s;
      return typed(`${A} has ${times.replace('many', cash ? 'much' : 'many')} ${stuff} as ${B}. ${A} has ${amt(d, cash)} more than ${B}. ${many} does ${X} have?`, ans,
        `${A} has ${k} bars and ${B} has 1, so the difference is ${k - 1} bar${k === 2 ? '' : 's'}. ${d} ÷ ${k - 1} = ${s}, so one bar is ${s}. ${B} has ${amt(s, cash)} and ${A} has ${amt(k * s, cash)}.`,
        [`Draw it: ${B} has 1 bar, ${A} has ${k} equal bars.`, `The difference is ${k - 1} bar${k === 2 ? '' : 's'} = ${amt(d, cash)}, so one bar is ${d} ÷ ${k - 1} = ${s}.`, `${B}: ${amt(s, cash)}. ${A}: ${k} × ${s} = ${amt(k * s, cash)}.`],
        { ...unitX, ...bars(null, `${A}’s extra ${k - 1} bar${k === 2 ? ' is' : 's are'} ${amt(d, cash)}, so one bar is ${amt(s, cash)}. ${A} has ${amt(k * s, cash)}.`) });
    }
    const N = (k + 1) * s;
    return typed(`${A} has ${times.replace('many', cash ? 'much' : 'many')} ${stuff} as ${B}. Together they have ${amt(N, cash)}. ${many} does ${X} have?`, ans,
      `${B} has 1 bar and ${A} has ${k}: that is ${k + 1} equal bars. ${N} ÷ ${k + 1} = ${s}. ${B} has ${amt(s, cash)} and ${A} has ${amt(k * s, cash)}. Check: ${s} + ${k * s} = ${N}.`,
      [`Draw it: ${B} has 1 bar, ${A} has ${k} bars the same size.`, `${k + 1} equal bars make ${amt(N, cash)}, so one bar is ${N} ÷ ${k + 1} = ${s}.`, `${B}: ${amt(s, cash)}. ${A}: ${k} × ${s} = ${amt(k * s, cash)}.`],
      { ...unitX, ...bars(amt(N, cash), `${k + 1} equal bars make ${amt(N, cash)}: ${N} ÷ ${k + 1} = ${s} in each. ${A} has ${amt(k * s, cash)}.`) });
  },

  k2WhichMore(level, rng) {
    const [pack, item] = rng.pick(PACKS);
    // two amounts of equal groups; sometimes the same, so "the same" is a real answer
    const pair = () => {
      if (rng.chance(0.15)) return rng.pick(SAME);
      const sizes = level === 1 ? [2, 5, 10] : [2, 3, 4, 5, 10], s1 = rng.pick(sizes);
      return [rng.int(2, level === 1 ? 6 : 9), s1, rng.int(2, level === 1 ? 6 : 9), rng.pick(sizes.filter((x) => x !== s1))];
    };
    const packBars = (rows, caption) => pic(segBar(rows.map(([n, sz, lab]) => ({ label: lab ?? `${n} × ${sz}`, segs: groups(n, sz) }))), caption);
    const kind = level === 1 ? 'which' : level === 2 ? rng.pick(['which', 'howmany', 'cheaper', 'cheaper']) : rng.pick(['three', 'after', 'value', 'regroup']);
    if (kind === 'which' || kind === 'howmany') {
      let [n1, s1, n2, s2] = pair();
      if (kind === 'howmany' && n1 * s1 === n2 * s2) n1 += 1;
      const p1 = n1 * s1, p2 = n2 * s2, o1 = `${n1} ${pack} of ${s1}`, o2 = `${n2} ${pack} of ${s2}`;
      const caption = `${n1} × ${s1} = ${p1} and ${n2} × ${s2} = ${p2}. ${p1 === p2 ? 'The bars are the same length.' : `The longer bar has ${Math.abs(p1 - p2)} more.`}`;
      const vis = packBars([[n1, s1], [n2, s2]], caption);
      if (kind === 'howmany') {
        return typed(`Which has more ${item}: ${o1} or ${o2}? How many more ${item} does it have?`, Math.abs(p1 - p2), `${o1}: ${n1} × ${s1} = ${p1}. ${o2}: ${n2} × ${s2} = ${p2}. ${p1 > p2 ? o1 : o2} has more: ${Math.max(p1, p2)} − ${Math.min(p1, p2)} = ${Math.abs(p1 - p2)} more.`,
          [`${n1} × ${s1} = ${p1}.`, `${n2} × ${s2} = ${p2}.`, `${Math.max(p1, p2)} − ${Math.min(p1, p2)} = ${Math.abs(p1 - p2)} more.`], vis);
      }
      const right = p1 === p2 ? 'They are the same' : p1 > p2 ? o1 : o2;
      const fb = { [o1]: `${o1} is ${n1} × ${s1} = ${p1}, and ${o2} is ${n2} × ${s2} = ${p2}.`, [o2]: `${o2} is ${n2} × ${s2} = ${p2}, and ${o1} is ${n1} × ${s1} = ${p1}.`, 'They are the same': `${n1} × ${s1} = ${p1} but ${n2} × ${s2} = ${p2}: not the same.` };
      return choice(`Which gives you more ${item}: ${o1} or ${o2}?`, right, [o1, o2, 'They are the same'].filter((o) => o !== right).map((text) => ({ text, feedback: fb[text] })), rng, {
        explain: `${o1}: ${n1} × ${s1} = ${p1}. ${o2}: ${n2} × ${s2} = ${p2}. ${p1 === p2 ? 'They are the same!' : `${Math.max(p1, p2)} is more.`}`,
        steps: ['Work out how many in each, then compare.', `${n1} × ${s1} = ${p1} and ${n2} × ${s2} = ${p2}.`, p1 === p2 ? 'They are the same.' : `${right} has more.`], ...vis,
      });
    }
    if (kind === 'cheaper') {
      const thing = rng.pick(['dinosaur stickers', 'rocket badges', 'toy cars', 'knight cards']);
      let n1, c1, n2, c2;
      do { [c1, c2] = rng.sample([5, 10, 20, 50], 2); n1 = rng.int(2, 6); n2 = rng.int(2, 6); } while (n1 * c1 === n2 * c2 && rng.chance(0.7));
      const p1 = n1 * c1, p2 = n2 * c2, o1 = `${n1} ${thing} at ${c1}p each`, o2 = `${n2} ${thing} at ${c2}p each`;
      const right = p1 === p2 ? 'They cost the same' : p1 < p2 ? o1 : o2;
      const fb = { [o1]: `${o1} costs ${n1} × ${c1}p = ${money(p1)}, but ${o2} costs ${money(p2)}.`, [o2]: `${o2} costs ${n2} × ${c2}p = ${money(p2)}, but ${o1} costs ${money(p1)}.`, 'They cost the same': `${money(p1)} and ${money(p2)} are not the same.` };
      return choice(`Which costs less: ${o1}, or ${o2}?`, right, [o1, o2, 'They cost the same'].filter((o) => o !== right).map((text) => ({ text, feedback: fb[text] })), rng, {
        explain: `${n1} × ${c1}p = ${money(p1)}. ${n2} × ${c2}p = ${money(p2)}. ${p1 === p2 ? 'They cost the same.' : `${money(Math.min(p1, p2))} is cheaper.`}`,
        steps: ['Work out each total cost.', `${n1} × ${c1}p = ${money(p1)} and ${n2} × ${c2}p = ${money(p2)}.`, p1 === p2 ? 'The same.' : `Less money: ${right}.`],
        ...pic(segBar([{ label: `${n1} × ${c1}p`, segs: groups(n1, c1, `${c1}p`) }, { label: `${n2} × ${c2}p`, segs: groups(n2, c2, `${c2}p`) }]), `${money(p1)} and ${money(p2)}. The shorter bar costs less.`),
      });
    }
    if (kind === 'three') {
      // three racers, each driving laps of a different length; who goes furthest?
      const names = rng.shuffle(['Rosa', 'Turbo', 'Blaze']);
      let laps;
      do laps = [[rng.int(2, 6), 5], [rng.int(2, 5), 10], [rng.int(3, 9), rng.pick([2, 3, 4])]]; while (new Set(laps.map(([n, l]) => n * l)).size < 3);
      laps = rng.shuffle(laps);
      const km = laps.map(([n, l]) => n * l), best = km.indexOf(Math.max(...km));
      const said = laps.map(([n, l], i) => `${names[i]} drives ${n} laps of a ${l} km track.`).join(' ');
      return choice(`${said} Who drives the furthest?`, names[best], names.filter((_, i) => i !== best).map((n) => { const i = names.indexOf(n); return { text: n, feedback: `${n} drives ${laps[i][0]} × ${laps[i][1]} = ${km[i]} km, but ${names[best]} drives ${km[best]} km.` }; }), rng, {
        explain: laps.map(([n, l], i) => `${names[i]}: ${n} × ${l} = ${km[i]} km.`).join(' ') + ` ${names[best]} goes furthest.`,
        steps: ['Work out each distance: laps × length of one lap.', laps.map(([n, l], i) => `${names[i]} ${n} × ${l} = ${km[i]}`).join(', ') + '.', `${km[best]} km is the most: ${names[best]}.`],
        ...packBars(laps.map(([n, l], i) => [n, l, names[i]]), laps.map(([n, l], i) => `${names[i]} ${km[i]} km`).join(', ') + '. The longest bar wins.'),
      });
    }
    if (kind === 'after') {
      // two steps each: groups, then some taken away or added
      const [A, B] = rng.shuffle(['Sir Rowan', 'Captain Nova']);
      let a1, b1, aOut, bIn;
      do { a1 = [rng.int(2, 5), 10]; b1 = [rng.int(3, 8), 5]; aOut = rng.int(3, 12); bIn = rng.int(2, 12); } while (a1[0] * 10 - aOut === b1[0] * 5 + bIn || a1[0] * 10 - aOut < 2);
      const ta = a1[0] * 10 - aOut, tb = b1[0] * 5 + bIn, more = ta > tb ? A : B;
      return typed(`${A} has ${a1[0]} bags of 10 gold coins and spends ${aOut}. ${B} has ${b1[0]} bags of 5 gold coins and finds ${bIn} more. Who has more coins now? How many more? Type how many more.`, Math.abs(ta - tb),
        `${A}: ${a1[0]} × 10 = ${a1[0] * 10}, then ${a1[0] * 10} − ${aOut} = ${ta}. ${B}: ${b1[0]} × 5 = ${b1[0] * 5}, then ${b1[0] * 5} + ${bIn} = ${tb}. ${more} has ${Math.max(ta, tb)} − ${Math.min(ta, tb)} = ${Math.abs(ta - tb)} more.`,
        [`${A}: ${a1[0]} × 10 = ${a1[0] * 10}, take away ${aOut}: ${ta}.`, `${B}: ${b1[0]} × 5 = ${b1[0] * 5}, add ${bIn}: ${tb}.`, `${more} has more: ${Math.max(ta, tb)} − ${Math.min(ta, tb)} = ${Math.abs(ta - tb)}.`],
        pic(segBar([{ label: A.split(' ').pop(), segs: [seg(ta, ta, { shaded: true }), seg(aOut, `−${aOut}`, { out: true })] }, { label: B.split(' ').pop(), segs: [seg(b1[0] * 5, b1[0] * 5), seg(bIn, `+${bIn}`, { mark: true })] }]), `${A} ends with ${ta} and ${B} with ${tb}. The difference is ${Math.abs(ta - tb)}.`));
    }
    if (kind === 'value') {
      const want = rng.pick([20, 30, 40]), p10 = rng.pick([30, 40, 50, 60]), p5 = rng.pick([15, 20, 25, 30]);
      const n10 = want / 10, n5 = want / 5, c10 = n10 * p10, c5 = n5 * p5;
      const o1 = `${n10} packs of 10`, o2 = `${n5} packs of 5`;
      const right = c10 === c5 ? 'It costs the same' : c10 < c5 ? o1 : o2;
      const fb = { [o1]: `${n10} packs of 10 cost ${n10} × ${p10}p = ${money(c10)}, but ${n5} packs of 5 cost ${money(c5)}.`, [o2]: `${n5} packs of 5 cost ${n5} × ${p5}p = ${money(c5)}, but ${n10} packs of 10 cost ${money(c10)}.`, 'It costs the same': `${money(c10)} and ${money(c5)} are different.` };
      return choice(`Packs of 10 stickers cost ${p10}p. Packs of 5 stickers cost ${p5}p. {hero} needs ${want} stickers. Which is the cheapest way to buy them?`, right, [o1, o2, 'It costs the same'].filter((o) => o !== right).map((text) => ({ text, feedback: fb[text] })), rng, {
        explain: `${want} stickers is ${n10} packs of 10 (${n10} × ${p10}p = ${money(c10)}) or ${n5} packs of 5 (${n5} × ${p5}p = ${money(c5)}). ${c10 === c5 ? 'Both cost the same.' : `${money(Math.min(c10, c5))} is cheaper.`}`,
        steps: [`How many packs? ${want} ÷ 10 = ${n10} packs of 10, or ${want} ÷ 5 = ${n5} packs of 5.`, `Cost: ${n10} × ${p10}p = ${money(c10)}; ${n5} × ${p5}p = ${money(c5)}.`, c10 === c5 ? 'The same.' : `Cheapest: ${right}.`],
        ...pic(segBar([{ label: `${n10} × ${p10}p`, segs: groups(n10, p10, `${p10}p`) }, { label: `${n5} × ${p5}p`, segs: groups(n5, p5, `${p5}p`) }]), `${money(c10)} for packs of 10, ${money(c5)} for packs of 5. The shorter bar costs less.`),
      });
    }
    // regroup: the same amount packed a different way
    const [s1, s2] = rng.pick([[5, 10], [2, 10], [10, 5], [2, 5], [10, 2], [5, 2]]);
    const total = rng.int(2, 6) * 10, n1 = total / s1, n2 = total / s2;
    if (n1 > 12 || n2 > 15) return KS1_DEPTH_GENERATORS.k2WhichMore(3, rng);
    return typed(`${n1} ${pack} of ${s1} ${item} is the same as how many ${pack} of ${s2}?`, n2, `${n1} × ${s1} = ${total} ${item}. ${total} ÷ ${s2} = ${n2} ${pack} of ${s2}.`,
      [`First find how many ${item}: ${n1} × ${s1} = ${total}.`, `Then share them into ${pack} of ${s2}.`, `${total} ÷ ${s2} = ${n2}.`],
      packBars([[n1, s1], [n2, s2]], `Both bars are ${total}: ${n1} × ${s1} = ${n2} × ${s2}.`));
  },

  k2Clock5(level, rng) {
    const h = rng.int(1, 12);
    if (level === 1) {
      const m = rng.pick([5, 10, 20, 25, 5, 10, 20, 25, 15, 30]);
      if (rng.chance(0.35)) {
        return typed(`How many minutes past ${h} is it?`, m, handsExplain(h, m), ['The long hand shows the minutes.', `Count in 5s from 12 to where it points: ${Array.from({ length: m / 5 }, (_, i) => 5 * (i + 1)).join(', ')}.`, `${m} minutes past ${h}.`], { unit: 'minutes', diagram: { type: 'clock', h, m } });
      }
      const right = saidTime(h, m);
      return choice('What time does the clock show?', right, [
        { text: saidTime(h, 60 - m === 60 ? 0 : 60 - m), feedback: `The long hand is on the right of the clock, so it is “past” the hour, not “to”.` },
        { text: saidTime((h % 12) + 1, m), feedback: `The short hand has only just gone past ${h}, so the hour is ${h}.` },
        { text: `${plural(m / 5, 'minute')} past ${h}`, feedback: `The long hand points to ${m / 5}, but each number is worth 5 minutes: ${m / 5} × 5 = ${m}.` },
      ], rng, {
        diagram: { type: 'clock', h, m }, explain: handsExplain(h, m),
        steps: ['The long hand shows the minutes; count in 5s.', `It points to ${m / 5}: ${m} minutes past.`, `The short hand is just past ${h}: ${right}.`],
      });
    }
    if (level === 2) {
      const m = rng.pick([5, 10, 20, 25, 35, 40, 50, 55, 35, 40, 50, 55]), next = (h % 12) + 1, kind = rng.pick(['read', 'read', 'digital', 'minsto']);
      const right = saidTime(h, m);
      if (kind === 'minsto' && m > 30) {
        return typed(`How many minutes to ${next} is it?`, 60 - m, handsExplain(h, m), ['The long hand shows the minutes.', `Count on in 5s from where it points round to 12: ${Array.from({ length: (60 - m) / 5 }, (_, i) => 5 * (i + 1)).join(', ')}.`, `${60 - m} minutes to ${next}.`], { unit: 'minutes', diagram: { type: 'clock', h, m } });
      }
      if (kind === 'digital') {
        return choice(`Which time is the same as ${digital(h, m)}?`, right, [
          { text: m > 30 ? `${WORD[60 - m]} past ${next}` : `${WORD[m]} to ${next}`, feedback: m > 30 ? `${digital(h, m)} is before ${next} o’clock, so it is “to ${next}”, not “past ${next}”.` : `${digital(h, m)} is just after ${h} o’clock, so it is “past ${h}”.` },
          { text: m > 30 ? `${WORD[60 - m]} to ${h}` : `${WORD[m]} past ${next}`, feedback: `${digital(h, m)} is ${m} minutes after ${h} o’clock. Check the hour.` },
          { text: m > 30 ? `${WORD[60 - m]} past ${h}` : `${WORD[m]} to ${h}`, feedback: m > 30 ? `${WORD[60 - m]} past ${h} is ${digital(h, 60 - m)}.` : `${WORD[m]} to ${h} is before ${h} o’clock.` },
        ], rng, {
          explain: `${digital(h, m)} means ${m} minutes after ${h} o’clock.${m > 30 ? ` There are ${60 - m} minutes left until ${next} o’clock, so we say ${right}.` : ` We say ${right}.`}`,
          steps: [`${digital(h, m)}: the hour is ${h} and the minutes are ${m}.`, m > 30 ? `${m} minutes past is more than half past, so count on to the next hour: 60 − ${m} = ${60 - m}.` : `${m} minutes past ${h}.`, `${right}.`],
          ...pic({ type: 'clock', h, m }, `${digital(h, m)} is ${right}.`),
        });
      }
      return choice('What time does the clock show?', right, [
        { text: m > 30 ? `${WORD[60 - m]} past ${h}` : `${WORD[m]} to ${next}`, feedback: m > 30 ? 'The long hand is on the left of the clock: it is “to” the next hour.' : 'The long hand is on the right of the clock: it is “past” the hour.' },
        { text: m > 30 ? `${WORD[60 - m]} to ${h}` : `${WORD[m]} past ${next}`, feedback: m > 30 ? `The short hand is nearly at ${next}, so it is ${WORD[60 - m]} to ${next}.` : `The short hand has just gone past ${h}.` },
        { text: m > 30 ? `${m / 5} minutes to ${next}` : `${m / 5} minutes past ${h}`, feedback: `Each number on the clock is worth 5 minutes. The long hand points to ${m / 5}.` },
      ], rng, { diagram: { type: 'clock', h, m }, explain: handsExplain(h, m), steps: ['The long hand shows the minutes.', m > 30 ? `It points to ${m / 5}: ${60 - m} minutes before the next hour.` : `It points to ${m / 5}: ${m} minutes past.`, `${right}.`] });
    }
    const m = rng.int(0, 11) * 5, dur = rng.pick([5, 10, 15, 20, 25, 30]), kind = rng.pick(['later', 'earlier', 'gap', 'gap']);
    if (kind === 'gap') {
      const [eh, em] = addMins(h, m, dur + 5 * rng.int(0, 2)), mins = ((eh % 12) * 60 + em - (h % 12) * 60 - m + 720) % 720;
      return typed(`How many minutes is it from ${saidTime(h, m)} to ${saidTime(eh, em)}?`, mins, `${saidTime(h, m)} is ${digital(h, m)} and ${saidTime(eh, em)} is ${digital(eh, em)}. Counting on in 5s: ${mins} minutes.`,
        [`Start: ${digital(h, m)}. End: ${digital(eh, em)}.`, `${em < m || eh !== h ? `From ${digital(h, m)} to ${(h % 12) + 1} o’clock is ${60 - m} minutes, then ${em} more.` : `${em} − ${m} = ${mins}.`}`, `${mins} minutes.`],
        { unit: 'minutes', visual: [{ kind: 'maths', diagram: { type: 'clock', h, m }, caption: `Start: ${saidTime(h, m)}` }, { kind: 'maths', diagram: { type: 'clock', h: eh, m: em }, caption: `End: ${saidTime(eh, em)}. ${mins} minutes later.` }] });
    }
    const later = kind === 'later', [eh, em] = addMins(h, m, later ? dur : -dur), right = saidTime(eh, em);
    const [wh, wm] = addMins(h, m, later ? -dur : dur), hourSlip = later ? addMins(eh, em, em < m ? -60 : 60) : addMins(eh, em, em > m ? 60 : -60);
    const [sh, sm] = addMins(eh, em, 5);
    const prompt = later ? `The race starts at the time on the clock. It lasts ${dur} minutes. What time does it finish?` : `The rocket landed at the time on the clock. It had been flying for ${dur} minutes. What time did it take off?`;
    return choice(prompt, right, [
      { text: saidTime(wh, wm), feedback: later ? `That is ${dur} minutes EARLIER. The race finishes later than it starts.` : `That is ${dur} minutes LATER. Take-off was before landing.` },
      { text: saidTime(...hourSlip), feedback: `Check the hour: ${saidTime(h, m)} ${later ? '+' : '−'} ${dur} minutes is ${right}.` },
      { text: saidTime(sh, sm), feedback: `Count the 5s carefully: ${dur} minutes is ${dur / 5} jump${dur === 5 ? '' : 's'} of 5.` },
    ], rng, {
      diagram: { type: 'clock', h, m },
      explain: `The clock shows ${saidTime(h, m)} (${digital(h, m)}). ${later ? 'Count on' : 'Count back'} ${dur} minutes in 5s: ${right} (${digital(eh, em)}).`,
      steps: [`The clock shows ${saidTime(h, m)}.`, `${later ? 'Count on' : 'Count back'} ${dur / 5} jump${dur === 5 ? '' : 's'} of 5 minutes${(later ? em < m : em > m) ? `, going ${later ? 'past' : 'back past'} the hour` : ''}.`, `${right}.`],
      visual: [{ kind: 'maths', diagram: { type: 'clock', h, m }, caption: later ? `Start: ${saidTime(h, m)}` : `Landing: ${saidTime(h, m)}` }, { kind: 'maths', diagram: { type: 'clock', h: eh, m: em }, caption: `${later ? 'Finish' : 'Take-off'}: ${right}, ${dur} minutes ${later ? 'later' : 'earlier'}.` }],
    });
  },
};
