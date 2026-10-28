// Pictures for generated maths questions, drawn by js/ui/diagrams.js. A generator spreads
// `...pic(diagram, caption)` into its question: the picture is a scaffold shown on the worked
// example and after a wrong answer, never inside the question, so it may show the method and the
// answer. Every number in a picture comes from the question's own numbers.

export const pic = (diagram, caption) => ({ visual: { kind: 'maths', diagram, ...(caption ? { caption } : {}) } });

// Bar model: rows of equal boxes ({ label?, parts, shaded?, text?, total? }), with an optional
// bracketed total over the first row. A box's text is left out when it would not fit in the box
// (the caption then gives the value of one box).
export function bar(rows, total) {
  const maxParts = Math.max(...rows.map((r) => r.parts));
  const unitW = Math.min(64, (420 - (rows.some((r) => r.label) ? 86 : 10) - 20) / maxParts);
  const fit = (r) => {
    if (r.text == null) return r;
    const t = String(r.text);
    if (t.length * 8.5 + 6 > unitW) { const { text, ...rest } = r; return rest; }
    return { ...r, text: t };
  };
  return { type: 'barmodel', ...(total != null ? { total: String(total) } : {}), rows: rows.map(fit) };
}

// Percentages as boxes: 100% cut into the fewest equal boxes that p% fills exactly (25% -> 4 boxes).
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
export const pctBoxes = (p) => 100 / gcd(p, 100);

// An amount before and after a p% rise or fall, in boxes of the same size. `amt` must split
// into pctBoxes(p) whole boxes; `cur` is put in front of every amount (e.g. '£').
export function pctChangeBar(p, amt, up, cur = '') {
  const N = pctBoxes(p), k = (p * N) / 100, after = up ? N + k : N - k, box = amt / N;
  return pic(bar([{ label: 'before', parts: N, text: `${cur}${box}`, total: `${cur}${amt}` }, { label: 'after', parts: after, text: `${cur}${box}`, total: `${cur}${box * after}` }]),
    `Each box is ${100 / N}% = ${cur}${box}. ${up ? 'Add' : 'Take away'} ${k} box${k === 1 ? '' : 'es'}: ${cur}${amt} ${up ? '+' : '−'} ${cur}${box * k} = ${cur}${box * after}.`);
}

// Place-value grid of whole numbers: one row per number, digits lined up on the ones column.
export const pvWhole = (cols, nums, extra = {}) => ({ type: 'pvgrid', cols, rows: nums.map((n) => String(n).split('')), ...extra });

// Place-value grid of decimals. Each number is an integer count of 10^-dp (e.g. 650 with dp 3 is
// 0.65). Columns run from thousands to thousandths as needed; null if a number needs more.
const HEAD = { 3: 'Th', 2: 'H', 1: 'T', 0: 'O', '-1': '1/10', '-2': '1/100', '-3': '1/1000' };
export function pvDecimal(nums, dp, extra = {}) {
  const spans = nums.map((n) => {
    const digit = (e) => (e + dp < 0 ? 0 : Math.floor(n / 10 ** (e + dp)) % 10);
    let hi = 0, lo = 0;
    for (let e = 6; e > 0; e--) if (digit(e)) { hi = e; break; }
    for (let e = -dp; e < 0; e++) if (digit(e)) { lo = e; break; }
    return { digit, hi, lo };
  });
  const hi = Math.max(...spans.map((s) => s.hi)), lo = Math.min(...spans.map((s) => s.lo));
  if (hi > 3 || lo < -3) return null;
  const exps = []; for (let e = hi; e >= lo; e--) exps.push(e);
  const rows = spans.map((s) => exps.map((e) => (e <= s.hi && e >= s.lo ? String(s.digit(e)) : '')));
  return { type: 'pvgrid', cols: exps.map((e) => HEAD[e]), rows, ...(lo < 0 ? { point: exps.indexOf(-1) } : {}), ...extra };
}

// Fraction wall with one shaded fraction per row: pairs [[n, d], …] with different denominators.
export function fracWall(pairs) {
  const rows = [...new Set([1, ...pairs.map(([, d]) => d)])].sort((a, b) => a - b);
  return { type: 'fracwall', rows, shade: Object.fromEntries(pairs.map(([n, d]) => [d, n])) };
}

// Area model (grid method): the rectangle across × down, split by place value.
export const areaModel = (across, down) => ({ type: 'areamodel', across, down });

// Split a whole number by place value: 347 -> [300, 40, 7] (zero parts left out).
export function splitPV(n) {
  const s = String(n), out = [];
  for (let i = 0; i < s.length; i++) if (s[i] !== '0') out.push(+s[i] * 10 ** (s.length - 1 - i));
  return out;
}
