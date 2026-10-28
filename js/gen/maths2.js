// Maths generators, part 2: written methods, measures, geometry, data and probability.
// Same contract as maths.js: (level 1..3, rng) -> { kind, prompt, numeric | answer | pair, explain, steps }.
// Diagrams are plain data (`diagram: { type, ... }`) drawn by js/ui/qtypes.js.

import { pic, bar, areaModel } from './pictures.js';

const fmtNum = (n) => n.toLocaleString('en-GB');
const money = (p) => `£${(p / 100).toFixed(2)}`; // pence -> "£3.45"
const pence = (p) => (p / 100).toFixed(2);
const neg = (n) => (n < 0 ? `−${-n}` : String(n));
const pad = (n) => String(n).padStart(2, '0');
const clock = (m) => `${pad(Math.floor(((m % 1440) + 1440) % 1440 / 60))}:${pad(m % 60)}`;
const hm = (m) => (m < 60 ? `${m} minutes` : m % 60 === 0 ? `${m / 60} hour${m >= 120 ? 's' : ''}` : `${Math.floor(m / 60)} hour${m >= 120 ? 's' : ''} ${m % 60} minutes`);

function choice(prompt, correct, wrongs, rng, extra = {}) {
  const options = rng.shuffle([{ text: correct, correct: true }, ...wrongs.map((w) => (typeof w === 'string' ? { text: w } : w))]);
  return { kind: 'choice', prompt, options, ...extra };
}

/** Accepted spellings of a 24-hour time: 19:35, 19.35, 1935, 7:35 pm, 7.35pm. */
function timeAccepts(m) {
  const h = Math.floor(m / 60) % 24, mm = pad(m % 60);
  const h12 = h % 12 === 0 ? 12 : h % 12, ap = h < 12 ? 'am' : 'pm';
  return [`${pad(h)}.${mm}`, `${pad(h)}${mm}`, `${h}:${mm}`, `${h}.${mm}`, `${h12}:${mm} ${ap}`, `${h12}:${mm}${ap}`, `${h12}.${mm} ${ap}`, `${h12}.${mm}${ap}`, `${h12}:${mm}`];
}

// long multiplication as an area: a across, the two-digit number split into tens and ones down
// (the two rows are the two lines of the written method)
const longGrid = (a, bt, bo) => pic(areaModel([a], [bt, bo]), `${fmtNum(a)} × ${bt} = ${fmtNum(a * bt)} and ${fmtNum(a)} × ${bo} = ${fmtNum(a * bo)}. Add the two parts: ${fmtNum(a * (bt + bo))}.`);

const PETS = ['dog', 'cat', 'rabbit', 'hamster', 'fish'];
const TRAVEL = ['walk', 'car', 'bus', 'bike', 'train'];
const COLOURS = ['red', 'blue', 'green', 'yellow'];
const NTH = { 2: 'half', 3: 'third', 4: 'quarter', 5: 'fifth', 8: 'eighth' };

export const MATHS2_GENERATORS = {
  // --- written multiplication ---------------------------------------------------
  longMult(level, rng) {
    if (level === 1) {
      const a = rng.pick([...Array(88).keys()].map((k) => k + 12).filter((x) => x % 10)), b = rng.int(3, 9);
      const t = Math.floor(a / 10) * 10, o = a % 10;
      return {
        kind: 'typed', prompt: `${a} × ${b} = ?`, numeric: { value: String(a * b), form: 'any' },
        explain: `Split ${a} into ${t} and ${o}: ${t} × ${b} = ${t * b} and ${o} × ${b} = ${o * b}. Add them: ${a * b}.`,
        steps: [`I split ${a} into ${t} + ${o}.`, `${t} × ${b} = ${t * b}, and ${o} × ${b} = ${o * b}.`, `${t * b} + ${o * b} = ${a * b}.`],
        ...pic(areaModel([t, o], [b]), `${t} × ${b} = ${t * b} and ${o} × ${b} = ${o * b}. Add the parts: ${t * b} + ${o * b} = ${a * b}.`),
      };
    }
    if (level === 2) {
      if (rng.chance(0.35)) {
        // decimals with up to two places times a one-digit number (Year 6)
        const h = rng.int(101, 999), b = rng.int(3, 9);
        if (h % 10 === 0) return MATHS2_GENERATORS.longMult(2, rng);
        const d = String(h / 100), ans = String((h * b) / 100);
        return {
          kind: 'typed', prompt: `${d} × ${b} = ?`, numeric: { value: ans, form: 'any' },
          explain: `Work it out as ${h} × ${b} = ${h * b}, then put the decimal point back: two decimal places gives ${ans}.`,
          steps: [`I ignore the decimal point for now: ${h} × ${b} = ${h * b}.`, `${d} had 2 decimal places, so the answer needs 2 as well.`, `${h * b} becomes ${ans}.`],
        };
      }
      const a = rng.int(12, 99), b = rng.int(12, 49);
      if (b % 10 === 0 || a % 10 === 0) return MATHS2_GENERATORS.longMult(2, rng);
      const bt = Math.floor(b / 10) * 10, bo = b % 10;
      return {
        kind: 'typed', prompt: `${a} × ${b} = ?`, numeric: { value: String(a * b), form: 'any' },
        explain: `${a} × ${bt} = ${a * bt} and ${a} × ${bo} = ${a * bo}. Add: ${a * bt} + ${a * bo} = ${fmtNum(a * b)}.`,
        steps: [`I split ${b} into ${bt} + ${bo}.`, `${a} × ${bt} = ${fmtNum(a * bt)}, and ${a} × ${bo} = ${a * bo}.`, `${fmtNum(a * bt)} + ${a * bo} = ${fmtNum(a * b)}.`],
        ...longGrid(a, bt, bo),
      };
    }
    const a = rng.chance(0.5) ? rng.int(112, 999) : rng.int(1012, 4999), b = rng.int(12, 39);
    if (b % 10 === 0 || a % 10 === 0) return MATHS2_GENERATORS.longMult(3, rng);
    const bt = Math.floor(b / 10) * 10, bo = b % 10;
    return {
      kind: 'typed', prompt: `${fmtNum(a)} × ${b} = ?`, numeric: { value: String(a * b), form: 'any' },
      explain: `${fmtNum(a)} × ${bt} = ${fmtNum(a * bt)} and ${fmtNum(a)} × ${bo} = ${fmtNum(a * bo)}. Add: ${fmtNum(a * b)}.`,
      steps: [`Long multiplication: I multiply by the ${bo} ${bo === 1 ? 'one' : 'ones'}, then by the ${bt / 10} ${bt === 10 ? 'ten' : 'tens'}.`, `${fmtNum(a)} × ${bo} = ${fmtNum(a * bo)}, and ${fmtNum(a)} × ${bt} = ${fmtNum(a * bt)}.`, `${fmtNum(a * bo)} + ${fmtNum(a * bt)} = ${fmtNum(a * b)}.`],
      ...longGrid(a, bt, bo),
    };
  },

  // --- written division ------------------------------------------------------------
  longDiv(level, rng) {
    if (level === 1) {
      const d = rng.int(3, 9), q = rng.int(12, 150), n = q * d;
      const qt = Math.floor(q / 10) * 10, qo = q % 10;
      return {
        kind: 'typed', prompt: `${n} ÷ ${d} = ?`, numeric: { value: String(q), form: 'any' },
        explain: qo ? `${d} × ${qt} = ${qt * d}, leaving ${n - qt * d}; ${d} × ${qo} = ${qo * d}. So ${n} ÷ ${d} = ${q}.` : `${d} × ${qt} = ${n} exactly, so ${n} ÷ ${d} = ${q}.`,
        steps: qo ? [`How many ${d}s in ${n}? I start with a chunk: ${d} × ${qt} = ${qt * d}.`, `${n} − ${qt * d} = ${n - qt * d} left, and ${d} × ${qo} = ${qo * d}.`, `${qt} + ${qo} = ${q}.`]
          : [`How many ${d}s in ${n}? I try a round chunk: ${d} × ${qt} = ${qt * d}.`, `That is exactly ${n}, with nothing left over.`, `So ${n} ÷ ${d} = ${q}.`],
      };
    }
    if (level === 2) {
      const d = rng.int(11, 25), q = rng.int(12, 45), n = q * d;
      const qt = Math.floor(q / 10) * 10, qo = q % 10;
      return {
        kind: 'typed', prompt: `${n} ÷ ${d} = ?`, numeric: { value: String(q), form: 'any' },
        explain: qo ? `${d} × ${qt} = ${qt * d}, leaving ${n - qt * d}; that is ${d} × ${qo}. So the answer is ${q}.` : `${d} × ${qt} = ${n} exactly, so ${n} ÷ ${d} = ${q}, with nothing left over.`,
        steps: qo ? [`Long division: first I take out ${qt} lots of ${d}: ${d} × ${qt} = ${qt * d}.`, `${n} − ${qt * d} = ${n - qt * d}, which is ${d} × ${qo}.`, `${qt} + ${qo} = ${q}, with nothing left over.`]
          : [`Long division: first I take out ${qt} lots of ${d}: ${d} × ${qt} = ${qt * d}.`, `That is exactly ${n}, with nothing left over.`, `So ${n} ÷ ${d} = ${q}.`],
      };
    }
    const d = rng.int(12, 30), q = rng.int(8, 40), r = rng.int(1, d - 1), n = q * d + r;
    const kind = rng.pick(['round-up', 'remainder', 'mixed']);
    if (kind === 'round-up') {
      return {
        kind: 'typed', prompt: `${n} children are going on a trip. Each coach seats ${d}. How many coaches are needed?`, numeric: { value: String(q + 1), form: 'any' },
        explain: `${n} ÷ ${d} = ${q} remainder ${r}. The ${r} left over still need a coach, so round UP: ${q + 1} coaches.`,
        steps: [`${n} ÷ ${d} = ${q} remainder ${r}.`, `${q} full coaches leave ${r} ${r === 1 ? 'child' : 'children'} with no seat.`, `They need one more coach: ${q + 1}.`],
      };
    }
    if (kind === 'remainder') {
      return {
        kind: 'typed', prompt: `${n} sweets are shared equally between ${d} children. How many sweets are left over?`, numeric: { value: String(r), form: 'any' },
        explain: `${d} × ${q} = ${q * d}, and ${n} − ${q * d} = ${r}. Each child gets ${q} and ${r} are left over.`,
        steps: [`How many ${d}s fit in ${n}? ${d} × ${q} = ${q * d}.`, `${n} − ${q * d} = ${r}.`, `So ${r} ${r === 1 ? 'sweet is' : 'sweets are'} left over.`],
      };
    }
    const g = (a, b) => (b ? g(b, a % b) : a), k = g(r, d);
    const simp = k > 1 ? ` = ${q} {{${r / k}/${d / k}}}` : '';
    return {
      kind: 'typed', prompt: `${n} ÷ ${d}. Give your answer as a mixed number.`, numeric: { value: `${q} ${r / k}/${d / k}`, form: 'mixed' },
      explain: `${n} ÷ ${d} = ${q} remainder ${r}. The remainder becomes the fraction ${r}/${d}: ${q} {{${r}/${d}}}${simp}.`,
      steps: [`${d} × ${q} = ${q * d}, so the whole-number part is ${q}.`, `${n} − ${q * d} = ${r} left over.`, `The remainder over the divisor gives the fraction: ${q} {{${r}/${d}}}${simp}.`],
    };
  },

  // --- area and perimeter ---------------------------------------------------------
  areaPerimeter(level, rng) {
    if (level === 1) {
      const w = rng.int(4, 12), hgt = rng.int(2, 9);
      if (w === hgt) return MATHS2_GENERATORS.areaPerimeter(1, rng);
      const area = rng.chance(0.5);
      return area ? {
        kind: 'typed', prompt: `What is the area of this rectangle?`, numeric: { value: String(w * hgt), form: 'any' }, unit: 'cm²', diagram: { type: 'rect', w, h: hgt },
        explain: `Area = length × width = ${w} × ${hgt} = ${w * hgt} cm².`,
        steps: ['Area of a rectangle = length × width.', `${w} × ${hgt}.`, `= ${w * hgt} cm².`],
      } : {
        kind: 'typed', prompt: `What is the perimeter of this rectangle?`, numeric: { value: String(2 * (w + hgt)), form: 'any' }, unit: 'cm', diagram: { type: 'rect', w, h: hgt },
        explain: `Perimeter is the distance all the way round: ${w} + ${hgt} + ${w} + ${hgt} = ${2 * (w + hgt)} cm.`,
        steps: ['Perimeter = all four sides added, or 2 × (length + width).', `${w} + ${hgt} = ${w + hgt}.`, `2 × ${w + hgt} = ${2 * (w + hgt)} cm.`],
      };
    }
    if (level === 2) {
      const b = rng.int(4, 14), hgt = rng.int(3, 10);
      if (rng.chance(0.5)) {
        const bb = b % 2 === 0 ? b : b + 1;
        return {
          kind: 'typed', prompt: 'What is the area of this triangle?', numeric: { value: String((bb * hgt) / 2), form: 'any' }, unit: 'cm²', diagram: { type: 'tri', b: bb, h: hgt, s: hgt + 2 },
          explain: `Area of a triangle = ½ × base × height = ½ × ${bb} × ${hgt} = ${(bb * hgt) / 2} cm². Use the perpendicular height (${hgt} cm), not the sloping side.`,
          steps: ['Area of a triangle = ½ × base × perpendicular height.', `½ × ${bb} × ${hgt}: half of ${bb} is ${bb / 2}.`, `${bb / 2} × ${hgt} = ${(bb * hgt) / 2} cm².`],
        };
      }
      return {
        kind: 'typed', prompt: 'What is the area of this parallelogram?', numeric: { value: String(b * hgt), form: 'any' }, unit: 'cm²', diagram: { type: 'para', b, h: hgt, s: hgt + 2 },
        explain: `Area of a parallelogram = base × perpendicular height = ${b} × ${hgt} = ${b * hgt} cm². The sloping side (${hgt + 2} cm) is a distraction.`,
        steps: ['Area of a parallelogram = base × perpendicular height (the dashed line, not the slanted side).', `${b} × ${hgt}.`, `= ${b * hgt} cm².`],
      };
    }
    if (rng.chance(0.5)) {
      const W = rng.int(8, 14), H = rng.int(6, 12), w = rng.int(3, W - 3), hh = rng.int(2, H - 3);
      return {
        kind: 'typed', prompt: 'What is the area of this L-shape?', numeric: { value: String(W * H - w * hh), form: 'any' }, unit: 'cm²', diagram: { type: 'lshape', W, H, w, h: hh },
        explain: `Whole rectangle ${W} × ${H} = ${W * H} cm², minus the missing corner ${w} × ${hh} = ${w * hh} cm²: ${W * H - w * hh} cm².`,
        steps: [`I imagine the whole rectangle: ${W} × ${H} = ${W * H} cm².`, `The missing corner is ${w} × ${hh} = ${w * hh} cm².`, `${W * H} − ${w * hh} = ${W * H - w * hh} cm².`],
      };
    }
    const w = rng.int(3, 12), hgt = rng.int(2, 9);
    if (w === hgt) return MATHS2_GENERATORS.areaPerimeter(3, rng);
    return {
      kind: 'typed', prompt: `A rectangle has an area of ${w * hgt} cm² and one side of ${w} cm. What is its perimeter?`, numeric: { value: String(2 * (w + hgt)), form: 'any' }, unit: 'cm', diagram: { type: 'rect', w, h: '?', area: w * hgt },
      explain: `The other side is ${w * hgt} ÷ ${w} = ${hgt} cm. Perimeter = 2 × (${w} + ${hgt}) = ${2 * (w + hgt)} cm.`,
      steps: [`Area = length × width, so the missing side is ${w * hgt} ÷ ${w} = ${hgt} cm.`, `Perimeter = 2 × (${w} + ${hgt}).`, `= ${2 * (w + hgt)} cm.`],
    };
  },

  // --- volume ----------------------------------------------------------------------
  volume(level, rng) {
    if (level === 1) {
      const l = rng.int(3, 10), w = rng.int(2, 8), hgt = rng.int(2, 6);
      return {
        kind: 'typed', prompt: 'What is the volume of this cuboid?', numeric: { value: String(l * w * hgt), form: 'any' }, unit: 'cm³', diagram: { type: 'cuboid', l, w, h: hgt },
        explain: `Volume = length × width × height = ${l} × ${w} × ${hgt} = ${l * w * hgt} cm³.`,
        steps: ['Volume of a cuboid = length × width × height.', `${l} × ${w} = ${l * w}.`, `${l * w} × ${hgt} = ${l * w * hgt} cm³.`],
      };
    }
    if (level === 2) {
      if (rng.chance(0.5)) {
        const e = rng.int(2, 9);
        return {
          kind: 'typed', prompt: `A cube has edges of ${e} cm. What is its volume?`, numeric: { value: String(e ** 3), form: 'any' }, unit: 'cm³', diagram: { type: 'cuboid', l: e, w: e, h: e },
          explain: `${e} × ${e} × ${e} = ${e ** 3} cm³. That is ${e} cubed, written ${e}³.`,
          steps: ['A cube has three equal edges, so volume = edge × edge × edge.', `${e} × ${e} = ${e * e}.`, `${e * e} × ${e} = ${e ** 3} cm³.`],
        };
      }
      const l = rng.pick([20, 25, 40, 50]), w = rng.pick([10, 20, 30]), hgt = rng.pick([10, 20, 25, 40]);
      const v = l * w * hgt;
      return {
        kind: 'typed', prompt: `A fish tank is ${l} cm long, ${w} cm wide and ${hgt} cm tall. How many litres of water fill it? (1 litre = 1000 cm³)`, numeric: { value: String(v / 1000), form: 'any' }, unit: 'litres', diagram: { type: 'cuboid', l, w, h: hgt },
        explain: `${l} × ${w} × ${hgt} = ${fmtNum(v)} cm³. Divide by 1000: ${v / 1000} litres.`,
        steps: [`Volume = ${l} × ${w} × ${hgt} = ${fmtNum(v)} cm³.`, '1000 cm³ make 1 litre, so I divide by 1000.', `${fmtNum(v)} ÷ 1000 = ${v / 1000} litres.`],
      };
    }
    const l = rng.int(3, 10), w = rng.int(2, 8), hgt = rng.int(2, 9);
    return {
      kind: 'typed', prompt: `A cuboid has a volume of ${l * w * hgt} cm³. Its base is ${l} cm by ${w} cm. How tall is it?`, numeric: { value: String(hgt), form: 'any' }, unit: 'cm', diagram: { type: 'cuboid', l, w, h: '?' },
      explain: `The base area is ${l} × ${w} = ${l * w} cm². Height = volume ÷ base area = ${l * w * hgt} ÷ ${l * w} = ${hgt} cm.`,
      steps: [`Base area = ${l} × ${w} = ${l * w} cm².`, 'Volume = base area × height, so height = volume ÷ base area.', `${l * w * hgt} ÷ ${l * w} = ${hgt} cm.`],
    };
  },

  // --- coordinates in four quadrants ----------------------------------------------
  coordinates(level, rng) {
    const pts = (n, lo, hi) => {
      const out = [];
      while (out.length < n) { const p = [rng.int(lo, hi), rng.int(lo, hi)]; if (!out.some((o) => o[0] === p[0] && o[1] === p[1]) && !(p[0] === 0 && p[1] === 0)) out.push(p); }
      return out;
    };
    const pair = (p) => `(${neg(p[0])}, ${neg(p[1])})`;
    if (level <= 2) {
      const range = level === 1 ? [0, 8] : [-6, 6];
      const ps = pts(4, ...range);
      const k = rng.int(0, 3), P = ps[k], L = 'ABCD'[k];
      return {
        kind: 'typed', prompt: `What are the coordinates of point ${L}?`, pair: P, answer: pair(P), placeholder: '(x, y)', diagram: { type: 'axes', range, points: ps.map((p, i) => ({ x: p[0], y: p[1], label: 'ABCD'[i] })) },
        explain: `Along the corridor, then up the stairs: ${P[0] < 0 ? `${-P[0]} left` : `${P[0]} right`}, then ${P[1] < 0 ? `${-P[1]} down` : `${P[1]} up`}. ${L} is at ${pair(P)}.${level === 2 ? ' Left of the y-axis the x-value is negative; below the x-axis the y-value is negative.' : ''}`,
        steps: ['Read the x-coordinate first: how far across from the origin.', `${L} is ${P[0] < 0 ? `${-P[0]} to the left` : `${P[0]} to the right`} and ${P[1] < 0 ? `${-P[1]} down` : `${P[1]} up`}.`, `So ${L} = ${pair(P)}.`],
      };
    }
    const kind = rng.pick(['reflect', 'translate', 'vertex']);
    if (kind === 'reflect') {
      const P = pts(1, -6, 6)[0];
      if (P[0] === 0 || P[1] === 0) return MATHS2_GENERATORS.coordinates(3, rng);
      const inX = rng.chance(0.5);
      const R = inX ? [P[0], -P[1]] : [-P[0], P[1]];
      return {
        kind: 'typed', prompt: `Point P is at ${pair(P)}. It is reflected in the ${inX ? 'x' : 'y'}-axis. Where is its image?`, pair: R, answer: pair(R), placeholder: '(x, y)', diagram: { type: 'axes', range: [-6, 6], points: [{ x: P[0], y: P[1], label: 'P' }] },
        explain: `Reflecting in the ${inX ? 'x' : 'y'}-axis flips the ${inX ? 'y' : 'x'}-coordinate’s sign and keeps the other: ${pair(R)}.`,
        steps: [`The ${inX ? 'x' : 'y'}-axis is the mirror line.`, `The point stays the same distance ${inX ? 'above or below' : 'left or right of'} the axis, but on the other side.`, `${pair(P)} becomes ${pair(R)}.`],
      };
    }
    if (kind === 'translate') {
      const P = pts(1, -4, 4)[0];
      const dx = rng.pick([-4, -3, -2, 2, 3, 4]), dy = rng.pick([-4, -3, -2, 2, 3, 4]);
      const R = [P[0] + dx, P[1] + dy];
      return {
        kind: 'typed', prompt: `Point P at ${pair(P)} is translated ${Math.abs(dx)} ${dx > 0 ? 'right' : 'left'} and ${Math.abs(dy)} ${dy > 0 ? 'up' : 'down'}. Where does it land?`, pair: R, answer: pair(R), placeholder: '(x, y)', diagram: { type: 'axes', range: [-8, 8], points: [{ x: P[0], y: P[1], label: 'P' }] },
        explain: `${dx > 0 ? 'Right' : 'Left'} changes x: ${neg(P[0])} ${dx > 0 ? '+' : '−'} ${Math.abs(dx)} = ${neg(R[0])}. ${dy > 0 ? 'Up' : 'Down'} changes y: ${neg(P[1])} ${dy > 0 ? '+' : '−'} ${Math.abs(dy)} = ${neg(R[1])}. New point ${pair(R)}.`,
        steps: [`Moving ${dx > 0 ? 'right adds to' : 'left subtracts from'} the x-coordinate: ${neg(P[0])} ${dx > 0 ? '+' : '−'} ${Math.abs(dx)} = ${neg(R[0])}.`, `Moving ${dy > 0 ? 'up adds to' : 'down subtracts from'} the y-coordinate: ${neg(P[1])} ${dy > 0 ? '+' : '−'} ${Math.abs(dy)} = ${neg(R[1])}.`, `The image is at ${pair(R)}.`],
      };
    }
    const x0 = rng.int(-5, 1), y0 = rng.int(-5, 1), w = rng.int(2, 5), hgt = rng.int(2, 5);
    const A = [x0, y0], B = [x0 + w, y0], C = [x0 + w, y0 + hgt], D = [x0, y0 + hgt];
    return {
      kind: 'typed', prompt: `A, B and C are three corners of a rectangle ABCD. What are the coordinates of D?`, pair: D, answer: pair(D), placeholder: '(x, y)', diagram: { type: 'axes', range: [-6, 6], points: [{ x: A[0], y: A[1], label: 'A' }, { x: B[0], y: B[1], label: 'B' }, { x: C[0], y: C[1], label: 'C' }] },
      explain: `D sits above A and level with C: it shares A’s x-coordinate (${neg(A[0])}) and C’s y-coordinate (${neg(C[1])}). D = ${pair(D)}.`,
      steps: ['In a rectangle, D is directly above A and directly across from C.', `So D has the same x as A (${neg(A[0])}) and the same y as C (${neg(C[1])}).`, `D = ${pair(D)}.`],
    };
  },

  // --- converting units -----------------------------------------------------------
  units(level, rng) {
    const PAIRS = [['km', 'm', 1000, 'kilometre'], ['m', 'cm', 100, 'metre'], ['cm', 'mm', 10, 'centimetre'], ['kg', 'g', 1000, 'kilogram'], ['l', 'ml', 1000, 'litre']];
    if (level === 1) {
      const [big, small, f, name] = rng.pick(PAIRS);
      const down = rng.chance(0.5);
      const v = f === 10 ? rng.int(2, 60) * 5 : rng.pick([rng.int(2, 9) * (f / 10), rng.int(11, 99) * (f / 100 || 1), rng.int(2, 9) * f + rng.int(1, 9) * (f / 10)]);
      if (down) {
        const b = v / f;
        return {
          kind: 'typed', prompt: `${String(b)} ${big} = ? ${small}`, numeric: { value: String(v), form: 'any' }, unit: small,
          explain: `There are ${f} ${small} in a ${name}, so multiply by ${f}: ${b} × ${f} = ${fmtNum(v)} ${small}.`,
          steps: [`1 ${big} = ${f} ${small}.`, `Going to the smaller unit means more of them, so I multiply by ${f}.`, `${b} × ${f} = ${fmtNum(v)} ${small}.`],
        };
      }
      return {
        kind: 'typed', prompt: `${fmtNum(v)} ${small} = ? ${big}`, numeric: { value: String(v / f), form: 'any' }, unit: big,
        explain: `There are ${f} ${small} in a ${name}, so divide by ${f}: ${fmtNum(v)} ÷ ${f} = ${v / f} ${big}.`,
        steps: [`1 ${big} = ${f} ${small}.`, `Going to the bigger unit means fewer of them, so I divide by ${f}.`, `${fmtNum(v)} ÷ ${f} = ${v / f} ${big}.`],
      };
    }
    if (level === 2) {
      const [big, small, f, name] = rng.pick(PAIRS.filter((p) => p[2] === 1000));
      const a = rng.int(11, 59) / 10, b = rng.int(3, 19) * 50;
      const add = rng.chance(0.6);
      const total = add ? a * f + b : a * f - b;
      return {
        kind: 'typed', prompt: `${a} ${big} ${add ? '+' : '−'} ${b} ${small} = ? ${small}`, numeric: { value: String(total), form: 'any' }, unit: small,
        explain: `First make the units the same: ${a} ${big} = ${fmtNum(a * f)} ${small}. Then ${fmtNum(a * f)} ${add ? '+' : '−'} ${b} = ${fmtNum(total)} ${small}.`,
        steps: [`I can’t ${add ? 'add' : 'subtract'} ${big} and ${small} directly, so I change ${a} ${big} into ${small}: × ${f} = ${fmtNum(a * f)}.`, `${fmtNum(a * f)} ${add ? '+' : '−'} ${b}.`, `= ${fmtNum(total)} ${small}.`],
      };
    }
    if (rng.chance(0.5)) {
      const miles = rng.int(2, 16) * 5, km = (miles * 8) / 5;
      const toKm = rng.chance(0.5);
      return toKm ? {
        kind: 'typed', prompt: `5 miles is about 8 km. About how many kilometres is ${miles} miles?`, numeric: { value: String(km), form: 'any' }, unit: 'km',
        explain: `${miles} miles = ${miles / 5} lots of 5 miles, and each is 8 km: ${miles / 5} × 8 = ${km} km.`,
        steps: [`${miles} ÷ 5 = ${miles / 5} groups of 5 miles.`, 'Each group is about 8 km.', `${miles / 5} × 8 = ${km} km.`],
      } : {
        kind: 'typed', prompt: `5 miles is about 8 km. About how many miles is ${km} km?`, numeric: { value: String(miles), form: 'any' }, unit: 'miles',
        explain: `${km} km = ${km / 8} lots of 8 km, and each is 5 miles: ${km / 8} × 5 = ${miles} miles.`,
        steps: [`${km} ÷ 8 = ${km / 8} groups of 8 km.`, 'Each group is about 5 miles.', `${km / 8} × 5 = ${miles} miles.`],
      };
    }
    const glass = rng.pick([200, 250, 300, 125]), litres = rng.pick([1.5, 2, 2.5, 3, 4.5]);
    const n = Math.floor((litres * 1000) / glass);
    return {
      kind: 'typed', prompt: `A ${litres} litre jug is used to fill ${glass} ml glasses. How many full glasses can be poured?`, numeric: { value: String(n), form: 'any' }, unit: 'glasses',
      explain: `${litres} litres = ${fmtNum(litres * 1000)} ml. ${fmtNum(litres * 1000)} ÷ ${glass} = ${((litres * 1000) / glass).toString()}, so ${n} full glasses.`,
      steps: [`Change to the same units: ${litres} l = ${fmtNum(litres * 1000)} ml.`, `${fmtNum(litres * 1000)} ÷ ${glass} = ${((litres * 1000) / glass).toString()}.`, `Only FULL glasses count, so ${n}.`],
    };
  },

  // --- time --------------------------------------------------------------------------
  time(level, rng) {
    if (level === 1) {
      const start = rng.int(7 * 60, 20 * 60), dur = rng.int(3, 30) * 5;
      const s = Math.floor(start / 5) * 5, e = s + dur;
      if (Math.floor(s / 60) === Math.floor(e / 60)) return MATHS2_GENERATORS.time(1, rng);
      const toHour = 60 - (s % 60);
      return {
        kind: 'typed', prompt: `How many minutes are there from ${clock(s)} to ${clock(e)}?`, numeric: { value: String(dur), form: 'any' }, unit: 'minutes',
        explain: `${clock(s)} to ${clock(s + toHour)} is ${toHour} minutes, then ${clock(s + toHour)} to ${clock(e)} is ${dur - toHour} minutes: ${toHour} + ${dur - toHour} = ${dur} minutes.`,
        steps: [`I count on to the next whole hour: ${clock(s)} → ${clock(s + toHour)} is ${toHour} minutes.`, `Then ${clock(s + toHour)} → ${clock(e)} is ${dur - toHour} minutes.`, `${toHour} + ${dur - toHour} = ${dur} minutes.`],
      };
    }
    if (level === 2) {
      const s = rng.int(9 * 60, 20 * 60), dur = rng.int(13, 35) * 5;
      const st = Math.floor(s / 5) * 5, e = st + dur;
      const what = rng.pick(['A film starts', 'A train leaves', 'Swimming starts']);
      const verb = what.startsWith('A train') ? 'arrive' : 'finish';
      return {
        kind: 'typed', prompt: `${what} at ${clock(st)} and ${verb === 'arrive' ? 'the journey takes' : 'lasts'} ${hm(dur)}. What time does it ${verb}? Use the 24-hour clock.`, answer: clock(e), accept: timeAccepts(e), placeholder: 'hh:mm',
        explain: `Add the hours first: ${clock(st)} + ${Math.floor(dur / 60)} h = ${clock(st + Math.floor(dur / 60) * 60)}. Then the ${dur % 60} minutes: ${clock(e)}.`,
        steps: [`First I add the ${Math.floor(dur / 60)} hour${dur >= 120 ? 's' : ''}: ${clock(st)} → ${clock(st + Math.floor(dur / 60) * 60)}.`, `Then I add the ${dur % 60} minutes.`, `${clock(st + Math.floor(dur / 60) * 60)} + ${dur % 60} min = ${clock(e)}.`],
      };
    }
    if (rng.chance(0.5)) {
      const s = rng.int(21 * 60, 23 * 60 + 55), e = rng.int(0, 2 * 60 + 55);
      const st = Math.floor(s / 5) * 5, en = Math.floor(e / 5) * 5, dur = 1440 - st + en;
      return {
        kind: 'typed', prompt: `A night bus leaves at ${clock(st)} and arrives at ${clock(en)} the next morning. How long is the journey, in minutes?`, numeric: { value: String(dur), form: 'any' }, unit: 'minutes',
        explain: `${clock(st)} to midnight is ${1440 - st} minutes, then midnight to ${clock(en)} is ${en} minutes: ${1440 - st} + ${en} = ${dur} minutes (${hm(dur)}).`,
        steps: [`Split at midnight. ${clock(st)} → 00:00 is ${1440 - st} minutes.`, `00:00 → ${clock(en)} is ${en} minutes.`, `${1440 - st} + ${en} = ${dur} minutes, which is ${hm(dur)}.`],
      };
    }
    const a = rng.int(6 * 60, 10 * 60), gapA = rng.int(4, 12) * 5, gapB = rng.int(4, 12) * 5, J = rng.int(4, 12) * 5;
    const s1 = Math.floor(a / 5) * 5, s2 = s1 + gapA, s3 = s2 + gapB;
    const deadline = s2 + J + rng.int(0, gapB / 5 - 1) * 5; // the last bus would arrive too late
    return {
      kind: 'typed', prompt: `Buses leave at ${clock(s1)}, ${clock(s2)} and ${clock(s3)}. The journey takes ${hm(J)}. Ella must arrive by ${clock(deadline)}. What is the latest bus she can catch?`, answer: clock(s2), accept: timeAccepts(s2), placeholder: 'hh:mm',
      explain: `The ${clock(s3)} bus arrives at ${clock(s3 + J)}, too late. The ${clock(s2)} bus arrives at ${clock(s2 + J)}, in time. So the latest she can catch is ${clock(s2)}.`,
      steps: [`I add the journey time to each bus. The ${clock(s3)} bus arrives at ${clock(s3 + J)}: that is after ${clock(deadline)}.`, `The ${clock(s2)} bus arrives at ${clock(s2 + J)}, which is in time.`, `So the latest bus is ${clock(s2)}.`],
    };
  },

  // --- multi-step money problems --------------------------------------------------
  wordProblems(level, rng) {
    if (level === 1) {
      const n = rng.int(2, 4), p = rng.int(24, 99) * 5, cost = n * p;
      const pay = cost <= 500 ? 500 : cost <= 1000 ? 1000 : 2000;
      const item = rng.pick(['notebook', 'pen', 'badge', 'poster', 'comic']);
      return {
        kind: 'typed', prompt: `${n} ${item}s cost ${money(p)} each. Mia pays with a £${pay / 100} note. How much change does she get?`, numeric: { value: pence(pay - cost), form: 'any' }, unit: '£', unitBefore: true,
        explain: `${n} × ${money(p)} = ${money(cost)}. Change: £${pay / 100} − ${money(cost)} = ${money(pay - cost)}.`,
        steps: [`First the total: ${n} × ${money(p)} = ${money(cost)}.`, `Then the change: £${pay / 100}.00 − ${money(cost)}.`, `= ${money(pay - cost)}.`],
      };
    }
    if (level === 2) {
      const packs = rng.pick([3, 4, 5, 6]), unit = rng.int(9, 60) * 5, want = rng.pick([7, 9, 10, 12, 15]);
      if (want % packs === 0) return MATHS2_GENERATORS.wordProblems(2, rng);
      const item = rng.pick(['apples', 'pencils', 'muffins', 'stickers']);
      return {
        kind: 'typed', prompt: `A pack of ${packs} ${item} costs ${money(packs * unit)}. How much would ${want} ${item} cost at the same price each?`, numeric: { value: pence(want * unit), form: 'any' }, unit: '£', unitBefore: true,
        explain: `One costs ${money(packs * unit)} ÷ ${packs} = ${money(unit)}. ${want} × ${money(unit)} = ${money(want * unit)}.`,
        steps: [`First find the price of ONE: ${money(packs * unit)} ÷ ${packs} = ${money(unit)}.`, `Then multiply by ${want}.`, `${want} × ${money(unit)} = ${money(want * unit)}.`],
        ...pic(bar([{ label: 'pack', parts: packs, text: money(unit), total: money(packs * unit) }, { label: `${want} ${item}`, parts: want, text: money(unit), total: money(want * unit) }]), `One box is one of the ${item}: ${money(packs * unit)} ÷ ${packs} = ${money(unit)}. ${want} boxes cost ${want} × ${money(unit)} = ${money(want * unit)}.`),
      };
    }
    const kind = rng.pick(['family', 'inverse', 'saving']);
    if (kind === 'family') {
      const A = rng.int(6, 24) * 100, adults = 2, kids = rng.int(2, 4);
      const total = adults * A + kids * (A / 2);
      return {
        kind: 'typed', prompt: `An adult ticket costs £${A / 100} and a child ticket is half price. How much do ${adults} adults and ${kids} children pay altogether?`, numeric: { value: pence(total), form: 'any' }, unit: '£', unitBefore: true,
        explain: `Adults: ${adults} × £${A / 100} = £${(adults * A) / 100}. Children: ${kids} × ${money(A / 2)} = ${money((kids * A) / 2)}. Total ${money(total)}.`,
        steps: [`Adults: ${adults} × £${A / 100} = £${(adults * A) / 100}.`, `A child ticket is £${A / 100} ÷ 2 = ${money(A / 2)}, so ${kids} children pay ${money((kids * A) / 2)}.`, `£${(adults * A) / 100} + ${money((kids * A) / 2)} = ${money(total)}.`],
        ...pic(bar([{ label: 'adults', parts: 2 * adults, text: money(A / 2), total: money(adults * A) }, { label: 'children', parts: kids, text: money(A / 2), total: money((kids * A) / 2) }]), `Each box is a child ticket, ${money(A / 2)}. An adult ticket is 2 boxes. ${2 * adults + kids} boxes: ${money(total)}.`),
      };
    }
    if (kind === 'inverse') {
      const [num, den] = rng.pick([[3, 5], [2, 3], [3, 4], [5, 8]]), left = rng.int(3, 12) * (den - num);
      const start = (left * den) / (den - num);
      return {
        kind: 'typed', prompt: `Jo spends {{${num}/${den}}} of her money and has £${left} left. How much did she start with?`, numeric: { value: String(start), form: 'any' }, unit: '£', unitBefore: true,
        explain: `If ${num}/${den} is spent, ${den - num}/${den} is left. ${den - num === 1 ? `That 1/${den} is £${left}, so` : `${den - num}/${den} = £${left}, so 1/${den} = £${left / (den - num)} and`} the whole is ${den} × £${left / (den - num)} = £${start}.`,
        steps: [`Spending ${num}/${den} leaves ${den - num}/${den}. That is the £${left}.`, den - num === 1 ? `So one ${NTH[den]} is £${left}.` : `One ${NTH[den]} is £${left} ÷ ${den - num} = £${left / (den - num)}.`, `The whole amount is ${den} × £${left / (den - num)} = £${start}.`],
        ...pic(bar([{ parts: den, shaded: num, text: `£${left / (den - num)}` }], `£${start}`), `The shaded ${num} boxes are spent. The ${den - num} white box${den - num === 1 ? ' is' : 'es are'} the £${left} left, so each box is £${left / (den - num)}. All ${den} boxes: £${start}.`),
      };
    }
    const weekly = rng.int(3, 12) * 50, weeks = rng.int(4, 12), spend = rng.int(5, 30) * 100;
    const total = weekly * weeks;
    if (spend >= total) return MATHS2_GENERATORS.wordProblems(3, rng);
    return {
      kind: 'typed', prompt: `Sam saves ${money(weekly)} every week for ${weeks} weeks, then spends ${money(spend)} on a game. How much is left?`, numeric: { value: pence(total - spend), form: 'any' }, unit: '£', unitBefore: true,
      explain: `Saved: ${weeks} × ${money(weekly)} = ${money(total)}. Left: ${money(total)} − ${money(spend)} = ${money(total - spend)}.`,
      steps: [`Total saved: ${weeks} × ${money(weekly)} = ${money(total)}.`, `Then take away the ${money(spend)} spent.`, `${money(total)} − ${money(spend)} = ${money(total - spend)}.`],
    };
  },

  // --- probability (Year 7) --------------------------------------------------------
  probability(level, rng) {
    const g = (a, b) => (b ? g(b, a % b) : a);
    const frac = (n, d) => { const k = g(n, d); return `${n / k}/${d / k}`; };
    if (level === 1) {
      const counts = COLOURS.slice(0, 3).map(() => rng.int(1, 7));
      const total = counts.reduce((a, b) => a + b, 0);
      const k = rng.int(0, 2);
      return {
        kind: 'typed', prompt: `A bag has ${counts.map((c, i) => `${c} ${COLOURS[i]}`).join(', ')} counters. One is picked without looking. What is the probability it is ${COLOURS[k]}? Give a fraction in its simplest form.`, numeric: { value: frac(counts[k], total), form: 'simplest' },
        explain: `${counts[k]} of the ${total} counters are ${COLOURS[k]}: ${counts[k]}/${total}${frac(counts[k], total) !== `${counts[k]}/${total}` ? ` = ${frac(counts[k], total)}` : ''}.`,
        steps: [`Total counters: ${counts.join(' + ')} = ${total}.`, `${counts[k]} of them are ${COLOURS[k]}, so the probability is ${counts[k]}/${total}.`, `In simplest form: {{${frac(counts[k], total)}}}.`],
      };
    }
    if (level === 2) {
      if (rng.chance(0.5)) {
        const counts = COLOURS.slice(0, 3).map(() => rng.int(1, 7));
        const total = counts.reduce((a, b) => a + b, 0), k = rng.int(0, 2);
        return {
          kind: 'typed', prompt: `A bag has ${counts.map((c, i) => `${c} ${COLOURS[i]}`).join(', ')} counters. What is the probability that a counter picked at random is NOT ${COLOURS[k]}? Give a fraction in its simplest form.`, numeric: { value: frac(total - counts[k], total), form: 'simplest' },
          explain: `${total - counts[k]} of the ${total} counters are not ${COLOURS[k]}: {{${frac(total - counts[k], total)}}}. (Or 1 − ${counts[k]}/${total}.)`,
          steps: [`Total: ${total}. ${counts[k]} are ${COLOURS[k]}, so ${total - counts[k]} are not.`, `Probability = ${total - counts[k]}/${total}.`, `Simplest form: {{${frac(total - counts[k], total)}}}.`],
        };
      }
      const n = rng.pick([6, 8, 10, 12]);
      const kind = rng.pick(['odd', 'more', 'multiple']);
      const limit = rng.int(2, n - 2), m = rng.pick([3, 4]);
      const hits = kind === 'odd' ? Math.ceil(n / 2) : kind === 'more' ? n - limit : Math.floor(n / m);
      const desc = kind === 'odd' ? 'an odd number' : kind === 'more' ? `a number greater than ${limit}` : `a multiple of ${m}`;
      const list = kind === 'odd' ? Array.from({ length: hits }, (_, i) => 2 * i + 1) : kind === 'more' ? Array.from({ length: hits }, (_, i) => limit + 1 + i) : Array.from({ length: hits }, (_, i) => m * (i + 1));
      return {
        kind: 'typed', prompt: `A fair spinner has ${n} equal sections numbered 1 to ${n}. What is the probability of spinning ${desc}? Give a fraction in its simplest form.`, numeric: { value: frac(hits, n), form: 'simplest' },
        explain: `The winning sections are ${list.join(', ')}: ${hits} out of ${n} = {{${frac(hits, n)}}}.`,
        steps: [`I list the sections that count: ${list.join(', ')}.`, `That is ${hits} out of ${n} equally likely sections.`, `${hits}/${n} = {{${frac(hits, n)}}} in simplest form.`],
      };
    }
    const kind = rng.pick(['dice', 'spinner', 'complement']);
    if (kind === 'dice') {
      const rolls = rng.pick([30, 60, 120, 300]), face = rng.int(1, 6);
      return {
        kind: 'typed', prompt: `A fair dice is rolled ${rolls} times. About how many times would you expect to roll a ${face}?`, numeric: { value: String(rolls / 6), form: 'any' },
        explain: `P(${face}) = 1/6, so expect about 1/6 of ${rolls}: ${rolls} ÷ 6 = ${rolls / 6}.`,
        steps: ['Each face has probability 1/6.', `Expected number = probability × number of rolls = 1/6 × ${rolls}.`, `${rolls} ÷ 6 = ${rolls / 6}. (It won’t be exactly that every time: it is what we expect on average.)`],
      };
    }
    if (kind === 'spinner') {
      const [num, den] = rng.pick([[1, 4], [2, 5], [3, 8], [1, 3], [3, 10]]), spins = den * rng.pick([10, 20, 30]);
      return {
        kind: 'typed', prompt: `The probability that a spinner lands on red is {{${num}/${den}}}. It is spun ${spins} times. How many reds would you expect?`, numeric: { value: String((spins * num) / den), form: 'any' },
        explain: `${num}/${den} of ${spins} = ${spins} ÷ ${den} × ${num} = ${(spins * num) / den}.`,
        steps: [`Expected reds = probability × spins = ${num}/${den} of ${spins}.`, `${spins} ÷ ${den} = ${spins / den}.`, `${spins / den} × ${num} = ${(spins * num) / den}.`],
      };
    }
    const p = rng.int(1, 9) / 10;
    const asPct = rng.chance(0.5);
    return asPct ? {
      kind: 'typed', prompt: `The forecast says there is a ${p * 100}% chance of rain tomorrow. What is the chance it does NOT rain?`, numeric: { value: String(100 - p * 100), form: 'any' }, unit: '%',
      explain: `Rain and no rain cover every possibility, so they add to 100%: 100 − ${p * 100} = ${100 - p * 100}%.`,
      steps: ['Either it rains or it doesn’t: the two probabilities add up to 100%.', `100% − ${p * 100}%.`, `= ${100 - p * 100}%.`],
    } : {
      kind: 'typed', prompt: `The probability that a seed grows is ${p}. What is the probability that it does not grow?`, numeric: { value: String(Math.round((1 - p) * 10) / 10), form: 'any' },
      explain: `Probabilities of all outcomes add to 1: 1 − ${p} = ${Math.round((1 - p) * 10) / 10}.`,
      steps: ['The seed either grows or it doesn’t, so the two probabilities add up to 1.', `1 − ${p}.`, `= ${Math.round((1 - p) * 10) / 10}.`],
    };
  },

  // --- reading charts ------------------------------------------------------------------
  charts(level, rng) {
    if (level === 1) {
      const cats = rng.pick([PETS, TRAVEL]);
      const step = rng.pick([2, 5]);
      const vals = cats.map(() => rng.int(1, 8) * step);
      if (new Set(vals).size < 4) return MATHS2_GENERATORS.charts(1, rng);
      const title = cats === PETS ? 'Favourite pets in Year 6' : 'How Year 6 travel to school';
      const dg = { type: 'bar', title, cats: cats.map((c, i) => ({ label: c, v: vals[i] })), step, ylabel: 'pupils' };
      if (rng.chance(0.5)) {
        let [i, j] = rng.sample([0, 1, 2, 3, 4], 2);
        while (vals[i] === vals[j]) [i, j] = rng.sample([0, 1, 2, 3, 4], 2);
        const [hi, lo] = vals[i] > vals[j] ? [i, j] : [j, i];
        return {
          kind: 'typed', prompt: `How many more pupils chose “${cats[hi]}” than “${cats[lo]}”?`, numeric: { value: String(vals[hi] - vals[lo]), form: 'any' }, unit: 'pupils', diagram: dg,
          explain: `${cats[hi]}: ${vals[hi]}. ${cats[lo]}: ${vals[lo]}. Difference ${vals[hi]} − ${vals[lo]} = ${vals[hi] - vals[lo]}. Check the scale: each gridline is ${step}.`,
          steps: [`I read each bar against the scale (it goes up in ${step}s).`, `${cats[hi]} = ${vals[hi]}, ${cats[lo]} = ${vals[lo]}.`, `${vals[hi]} − ${vals[lo]} = ${vals[hi] - vals[lo]} more pupils.`],
        };
      }
      const total = vals.reduce((a, b) => a + b, 0);
      return {
        kind: 'typed', prompt: 'How many pupils took part in the survey altogether?', numeric: { value: String(total), form: 'any' }, unit: 'pupils', diagram: dg,
        explain: `Add every bar: ${vals.join(' + ')} = ${total}.`,
        steps: [`Each bar is a group of pupils, so I read them all: ${vals.join(', ')}.`, 'Then I add them up.', `${vals.join(' + ')} = ${total} pupils.`],
      };
    }
    if (level === 2) {
      const T = rng.pick([24, 48, 72, 120, 240]);
      const sets = [[90, 90, 180], [90, 120, 150], [45, 135, 180], [60, 120, 180], [30, 90, 240], [90, 90, 90, 90], [45, 45, 90, 180], [60, 60, 120, 120], [30, 60, 90, 180]];
      const degs = rng.shuffle(rng.pick(sets));
      const labels = rng.sample(rng.pick([TRAVEL, PETS]), degs.length);
      const k = rng.int(0, degs.length - 1);
      const dg = { type: 'pie', title: `How ${T} pupils ${labels === TRAVEL ? 'travel' : 'voted'}`, sectors: degs.map((d, i) => ({ label: labels[i], deg: d })) };
      const n = (T * degs[k]) / 360;
      const fracOf = degs[k] === 90 ? 'a quarter' : degs[k] === 180 ? 'half' : degs[k] === 120 ? 'a third' : degs[k] === 60 ? 'a sixth' : degs[k] === 45 ? 'an eighth' : degs[k] === 30 ? 'a twelfth' : degs[k] === 240 ? 'two thirds' : degs[k] === 135 ? 'three eighths' : degs[k] === 150 ? 'five twelfths' : `${degs[k]}/360`;
      return {
        kind: 'typed', prompt: `The pie chart shows ${T} pupils. The “${labels[k]}” sector is ${degs[k]}°. How many pupils does it represent?`, numeric: { value: String(n), form: 'any' }, unit: 'pupils', diagram: dg,
        explain: `${degs[k]}° out of 360° is ${fracOf} of the circle, so ${fracOf} of ${T} = ${n} pupils.`,
        steps: ['A whole pie chart is 360°, so I find what fraction of 360° the sector is.', `${degs[k]}/360 = ${fracOf}.`, `${fracOf} of ${T} = ${n} pupils.`],
      };
    }
    const hours = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
    // even values only, so every point sits on a gridline of the 2°C scale; one rise is clearly steepest
    const ups = rng.shuffle([2, 2, 4, 6]), falls = rng.shuffle([2, 2, 4]);
    let t = rng.int(1, 4) * 2;
    const temps = [t];
    for (const r of ups) temps.push((t += r));
    for (const f of falls) temps.push((t -= f));
    temps.splice(7);
    const dg = { type: 'line', title: 'Temperature during one day', xs: hours, ys: temps, ylabel: '°C' };
    const kind = rng.pick(['read', 'change', 'fastest']);
    if (kind === 'read') {
      const i = rng.int(0, 6);
      return {
        kind: 'typed', prompt: `What was the temperature at ${hours[i]}?`, numeric: { value: String(temps[i]), form: 'any' }, unit: '°C', diagram: dg,
        explain: `Go up from ${hours[i]} to the line, then across to the scale: ${temps[i]}°C.`,
        steps: [`I find ${hours[i]} on the bottom axis.`, 'I go straight up to the line, then straight across to the temperature scale.', `It reads ${temps[i]}°C.`],
      };
    }
    if (kind === 'change') {
      const i = rng.int(0, 2), j = rng.int(i + 1, 3);
      return {
        kind: 'typed', prompt: `By how much did the temperature rise between ${hours[i]} and ${hours[j]}?`, numeric: { value: String(temps[j] - temps[i]), form: 'any' }, unit: '°C', diagram: dg,
        explain: `${hours[j]}: ${temps[j]}°C. ${hours[i]}: ${temps[i]}°C. Rise = ${temps[j]} − ${temps[i]} = ${temps[j] - temps[i]}°C.`,
        steps: [`Read both values: ${temps[i]}°C at ${hours[i]} and ${temps[j]}°C at ${hours[j]}.`, 'A rise is the later value minus the earlier one.', `${temps[j]} − ${temps[i]} = ${temps[j] - temps[i]}°C.`],
      };
    }
    // all four rising segments are offered, so the steepest one (the 6) is always on the list
    const rises = temps.slice(1, 5).map((v, i) => v - temps[i]);
    const best = rises.indexOf(Math.max(...rises));
    const seg = (i) => `${hours[i]} to ${hours[i + 1]}`;
    return choice('Between which two times did the temperature rise fastest?', seg(best), [0, 1, 2, 3].filter((i) => i !== best).map(seg), rng, {
      diagram: dg,
      explain: `The steepest upward part of the line is ${seg(best)}: it rose ${rises[best]}°C in two hours. The rises were ${rises.join(', ')}.`,
      steps: ['The fastest rise is where the line is steepest going up.', `The rises were: ${[0, 1, 2, 3].map((i) => `${seg(i)}: ${rises[i]}°C`).join('; ')}.`, `${seg(best)} is the steepest.`],
    });
  },
};
