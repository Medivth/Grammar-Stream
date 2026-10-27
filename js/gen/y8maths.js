// Year 8 maths generators for a strong grammar-school Year 8: number, algebra, geometry,
// probability and statistics at KS3 depth, and GCSE Higher tasters for the stretch tier.
// Same contract as maths.js: (level 1..3, rng) -> question with `explain` and worked `steps`.
// Algebraic answers set `algebra: true` (spacing ignored) and are stored with ASCII '-';
// prompts and explanations show '−'. Examples lean on Greek myth (original characters only).

import { Frac, gcd, lcm } from '../core/fraction.js';

const neg = (n) => (n < 0 ? `−${-n}` : String(n));
const paren = (n) => (n < 0 ? `(−${-n})` : String(n));
const sgn = (n) => (n < 0 ? ` − ${-n}` : ` + ${n}`);
const show = (s) => String(s).replace(/-/g, '−');
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const NAMES = { opp: 'opposite', adj: 'adjacent', hyp: 'hypotenuse' };
const sup = (n) => (n < 0 ? '⁻' : '') + String(Math.abs(n)).split('').map((d) => SUP[+d]).join('');
const F = (n, d = 1) => new Frac(n, d).simplify();
const tex = (f, mixed = false) => show(f.toTex({ mixed }));
/** 'an' when the number is said with a vowel sound: an 8, an 11, an 18, an 80–89, an 800… */
const an = (n) => (/^8/.test(String(n)) || (/^1[18]/.test(String(n)) && String(n).length % 3 === 2) ? 'an' : 'a');
const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const nth = (n) => `${n}${[11, 12, 13].includes(n % 100) ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th'}`;
const comma = (s) => String(s).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/** Exact decimal text from an integer count of 10^-scale units ("-12.5" style, ASCII minus). */
function dp(num, scale = 2) {
  const sign = num < 0 ? '-' : '';
  num = Math.abs(num);
  const p = 10 ** scale, whole = Math.floor(num / p);
  const frac = String(num % p).padStart(scale, '0').replace(/0+$/, '');
  return sign + (frac ? `${whole}.${frac}` : String(whole));
}
/** Pounds with exactly two decimal places ("5.40", never "5.4"), for answers; money() adds £ and commas. */
const pounds = (pence) => (pence / 100).toFixed(2);
const money = (pence) => `£${comma(pounds(pence))}`;
/** "= 12.5" when n ÷ d stops within 2 decimal places, otherwise "≈ 12.33" (rounded to 2 dp). */
function quot(n, d) {
  const sign = n * d < 0 ? '−' : '', c = Math.abs(n) * 100, a = Math.abs(d);
  if (c % a === 0) return `= ${sign}${dp(c / a, 2)}`;
  const t = Math.round(c / a);
  return `≈ ${sign}${Math.floor(t / 100)}.${String(t % 100).padStart(2, '0')}`;
}

const norm = (t) => String(t).normalize('NFKC').toLowerCase().replace(/[−–]/g, '-').replace(/\s+/g, ' ').trim();
function choice(prompt, correct, wrongs, rng, extra = {}) {
  const seen = new Set([norm(correct)]);
  const ws = [];
  for (const w of wrongs) {
    const o = typeof w === 'string' ? { text: w } : w;
    if (!seen.has(norm(o.text))) { seen.add(norm(o.text)); ws.push(o); }
  }
  return { kind: 'choice', prompt, options: rng.shuffle([{ text: correct, correct: true }, ...ws.slice(0, 4)]), ...extra };
}
const num = (prompt, value, explain, steps, extra = {}) => ({ kind: 'typed', prompt, numeric: { value: String(value), form: 'any' }, explain, steps, ...extra });
const fracQ = (prompt, f, explain, steps, extra = {}) => ({ kind: 'typed', prompt, numeric: { value: f.toString(), form: 'simplest' }, explain, steps, placeholder: 'e.g. 3/4', ...extra });
const alg = (prompt, { answer, accept }, explain, steps, extra = {}) => ({ kind: 'typed', prompt, answer, accept: withPowers(accept.concat(answer)), algebra: true, explain, steps, placeholder: 'e.g. 3x + 2', ...extra });
const pairQ = (prompt, P, explain, steps, extra = {}) => ({ kind: 'typed', prompt, pair: P, answer: `(${P[0]}, ${P[1]})`, placeholder: '(x, y)', explain, steps, ...extra });

/** Accept x^2 as well as x² (the checker folds ² to 2, so "x2" is accepted automatically). */
function withPowers(list) {
  const out = new Set(list);
  for (const a of list) if (/[²³]/.test(a)) out.add(a.replace(/²/g, '^2').replace(/³/g, '^3'));
  return [...out];
}

/** Terms [[coef, 'x'], [coef, '']] -> { answer, accept } in the given order (other orders accepted). */
function expr(terms) {
  const ts = terms.filter(([c]) => c !== 0);
  if (!ts.length) return { answer: '0', accept: [] };
  const fmt = (list) => list.map(([c, v], i) => {
    const a = Math.abs(c);
    const body = v ? (a === 1 ? v : `${a}${v}`) : String(a);
    return i === 0 ? (c < 0 ? '-' : '') + body : (c < 0 ? ' - ' : ' + ') + body;
  }).join('');
  const perms = ts.length === 1 ? [ts] : ts.length === 2 ? [ts, [ts[1], ts[0]]]
    : [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map((p) => p.map((i) => ts[i]));
  const answer = fmt(ts);
  return { answer, accept: perms.slice(1).map(fmt) };
}
const ex = (terms) => show(expr(terms).answer);

function factorise(n) {
  const f = [];
  for (let p = 2; n > 1; p++) { let k = 0; while (n % p === 0) { n /= p; k++; } if (k) f.push([p, k]); }
  return f;
}
const indexForm = (f) => f.map(([p, k]) => (k === 1 ? `${p}` : `${p}${sup(k)}`)).join(' × ');
const valueOf = (f) => f.reduce((a, [p, k]) => a * p ** k, 1);

/** Standard form helpers: mantissa in tenths (10..99) and an exponent. */
const mant = (t) => (t % 10 ? `${Math.floor(t / 10)}.${t % 10}` : String(t / 10));
const sf = (t, e) => `${mant(t)} × 10${sup(e)}`;
function ordinary(t, e) {
  const digits = t % 10 ? String(t) : String(t / 10);
  if (e >= 1) return t % 10 ? String(t) + '0'.repeat(e - 1) : String(t / 10) + '0'.repeat(e);
  return `0.${'0'.repeat(-e - 1)}${digits}`;
}

const G = {
  // ---- primes, HCF and LCM -------------------------------------------------------------
  y8mPrimes(level, rng) {
    if (level === 1) {
      const ps = rng.pick([[2, 3], [2, 5], [2, 3, 5], [2, 7], [3, 5], [2, 3, 7], [2, 11]]);
      const f = ps.map((p) => [p, rng.int(1, p === 2 ? 4 : 2)]);
      if (f.every(([, k]) => k === 1)) f[0][1] = 2;
      const n = valueOf(f);
      if (n > 800 || n < 20) return G.y8mPrimes(level, rng);
      const ladder = [];
      let m = n;
      for (const [p, k] of f) for (let i = 0; i < k; i++) { ladder.push(`${m} ÷ ${p} = ${m / p}`); m /= p; }
      if (rng.chance(0.4)) {
        return num(`${indexForm(f)} = ?`, n, `Multiply it out: ${f.map(([p, k]) => (k === 1 ? `${p} is just ${p}` : `${p}${sup(k)} = ${p ** k}`)).join(', ').replace(/, ([^,]*)$/, ' and $1')}. The product is ${f.map(([p, k]) => p ** k).join(' × ')} = ${n}.`,
          ['A small raised number (an index) says how many times to multiply the prime by itself.', f.map(([p, k]) => `${p}${sup(k)} = ${p ** k}`).join(', ') + '.', `Multiply them together: ${n}.`]);
      }
      const swapped = f.length >= 2 && f[0][1] !== f[1][1] ? indexForm([[f[0][0], f[1][1]], [f[1][0], f[0][1]], ...f.slice(2)]) : null;
      const bumped = indexForm([[f[0][0], f[0][1] + 1], ...f.slice(1)]);
      const composite = f[0][1] >= 2 ? indexForm([[f[0][0] * f[0][0], 1], ...(f[0][1] > 2 ? [[f[0][0], f[0][1] - 2]] : []), ...f.slice(1)]) : `${f[0][0] * f[1][0]} × ${indexForm(f.slice(1).map(([p, k], i) => (i === 0 ? [p, k - 1] : [p, k])).filter(([, k]) => k > 0)) || '1'}`;
      return choice(`Which shows ${n} as a product of its prime factors?`, indexForm(f), [swapped, bumped, { text: composite, feedback: `That multiplies to ${n}, but ${f[0][0] * (f[0][1] >= 2 ? f[0][0] : f[1][0])} is not prime.` }].filter(Boolean), rng, {
        explain: `Keep dividing by primes: ${ladder.join(', ')}. So ${n} = ${indexForm(f)}.`,
        steps: ['Divide by the smallest prime that goes in, again and again.', ladder.join('; ') + '.', `Collect repeated primes as powers: ${indexForm(f)}.`],
      });
    }
    if (level === 2) {
      const g = rng.pick([4, 6, 8, 9, 10, 12, 14, 15, 18, 21]);
      let x = rng.int(2, 9), y = rng.int(2, 9);
      while (x === y || gcd(x, y) !== 1) { x = rng.int(2, 9); y = rng.int(2, 9); }
      const a = g * x, b = g * y;
      const fa = indexForm(factorise(a)), fb = indexForm(factorise(b));
      if (rng.chance(0.5)) {
        return num(`What is the highest common factor (HCF) of ${a} and ${b}?`, g, `${a} = ${fa} and ${b} = ${fb}. The primes they share multiply to ${g}.`,
          [`Write each as a product of primes: ${a} = ${fa}, ${b} = ${fb}.`, 'The HCF uses the primes in BOTH lists (the lower power of each).', `HCF = ${g}.`]);
      }
      return num(`What is the lowest common multiple (LCM) of ${a} and ${b}?`, a * y, `${a} = ${fa} and ${b} = ${fb}. The LCM uses every prime, at its highest power: ${a * y}.`,
        [`Write each as a product of primes: ${a} = ${fa}, ${b} = ${fb}.`, 'The LCM uses every prime that appears, at its highest power.', `LCM = ${a * y}. (Check: HCF × LCM = ${g} × ${a * y} = ${a} × ${b}.)`]);
    }
    const kind = rng.pick(['beacons', 'bags', 'index']);
    if (kind === 'beacons') {
      let [a, b] = rng.sample([12, 15, 18, 20, 24, 30, 36, 40, 45], 2);
      const L = lcm(a, b);
      return num(`The beacon on Mount Ida flashes every ${a} seconds and the beacon on Lemnos every ${b} seconds. They flash together now. How many seconds until they next flash together?`, L,
        `They meet again at the lowest common multiple of ${a} and ${b}: ${L} seconds.`,
        ['“Together again” means a multiple of both numbers: the LCM.', `${a} = ${indexForm(factorise(a))}, ${b} = ${indexForm(factorise(b))}.`, `LCM = ${L} seconds.`]);
    }
    if (kind === 'bags') {
      const g = rng.pick([6, 8, 9, 12, 14, 15, 16, 18]);
      let x = rng.int(3, 9), y = rng.int(3, 9);
      while (x === y || gcd(x, y) !== 1) { x = rng.int(3, 9); y = rng.int(3, 9); }
      return num(`Mira has ${g * x} olives and ${g * y} figs to pack into identical bags for the athletes at Olympia, using every piece of fruit. What is the greatest number of bags she can make?`, g,
        `Each bag gets the same share of both, so the number of bags must divide ${g * x} and ${g * y}: the HCF, ${g}. (Each bag holds ${x} olives and ${y} figs.)`,
        ['Identical bags with nothing left over: the number of bags is a common factor.', '“Greatest” means the highest common factor.', `HCF(${g * x}, ${g * y}) = ${g}.`]);
    }
    const e = [[2, rng.int(1, 4)], [3, rng.int(0, 3)], [5, rng.int(0, 2)]], f2 = [[2, rng.int(1, 4)], [3, rng.int(0, 3)], [5, rng.int(0, 2)]];
    const A = e.filter(([, k]) => k), B = f2.filter(([, k]) => k);
    const h = e.map(([p, k], i) => [p, Math.min(k, f2[i][1])]).filter(([, k]) => k);
    if (!A.length || !B.length || valueOf(A) === valueOf(B)) return G.y8mPrimes(level, rng);
    // a single shared prime to the power 1 would read "2 = 2"
    const hcf = h.length === 1 && h[0][1] === 1 ? `the only shared prime is ${h[0][0]}, and its lower power is just ${h[0][0]}, so HCF = ${h[0][0]}` : `${indexForm(h)} = ${valueOf(h)}`;
    return num(`A = ${indexForm(A)} and B = ${indexForm(B)}. What is the HCF of A and B?`, valueOf(h),
      `Take each shared prime at the LOWER of its two powers: ${hcf}.`,
      ['For the HCF, use only primes in both numbers.', 'Take the lower power of each shared prime.', h.length === 1 && h[0][1] === 1 ? `Only ${h[0][0]} is shared, so HCF = ${h[0][0]}.` : `HCF = ${indexForm(h)} = ${valueOf(h)}.`]);
  },

  // ---- powers, roots and order of operations ---------------------------------------------
  y8mIndices(level, rng) {
    if (level === 1) {
      const kind = rng.pick(['law', 'roots', 'negsq']);
      if (kind === 'law') {
        const b = rng.int(2, 9), m = rng.int(2, 9), n = rng.int(2, 8), op = rng.pick(['×', '÷', 'pow']);
        if (op === 'pow') return num(`(${b}${sup(m)})${sup(n)} = ${b}ⁿ. What is n?`, m * n, `A power of a power: multiply the indices. ${m} × ${n} = ${m * n}.`, [`(${b}${sup(m)})${sup(n)} means ${n} lots of ${b}${sup(m)} multiplied together.`, `That is ${m} × ${n} factors of ${b}.`, `n = ${m * n}.`]);
        if (op === '÷' && m <= n) return G.y8mIndices(level, rng);
        const r = op === '×' ? m + n : m - n;
        return num(`${b}${sup(m)} ${op} ${b}${sup(n)} = ${b}ⁿ. What is n?`, r, `${op === '×' ? 'Multiplying powers of the same number: add' : 'Dividing powers of the same number: subtract'} the indices. ${m} ${op === '×' ? '+' : '−'} ${n} = ${r}.`,
          [`Both are powers of ${b}, so an index law applies.`, op === '×' ? `${m} factors of ${b} times ${n} more makes ${m + n}.` : `${n} of the ${m} factors cancel, leaving ${m - n}.`, `n = ${r}.`]);
      }
      if (kind === 'roots') {
        const a = rng.int(4, 15), c = rng.int(2, 6);
        return num(`√${a * a} + ∛${c ** 3} =`, a + c, `√${a * a} = ${a} because ${a}² = ${a * a}; ∛${c ** 3} = ${c} because ${c}³ = ${c ** 3}. Total ${a + c}.`, [`Square root: what squared gives ${a * a}? ${a}.`, `Cube root: what cubed gives ${c ** 3}? ${c}.`, `${a} + ${c} = ${a + c}.`]);
      }
      const a = rng.int(2, 9), b = rng.int(2, 9);
      return num(`(−${a})² − ${b}² =`, a * a - b * b, `(−${a})² = ${a * a} (a negative times a negative is positive), and ${b}² = ${b * b}. ${a * a} − ${b * b} = ${neg(a * a - b * b)}.`,
        [`The bracket means the whole of −${a} is squared: (−${a}) × (−${a}) = ${a * a}.`, `${b}² = ${b * b}.`, `${a * a} − ${b * b} = ${neg(a * a - b * b)}.`]);
    }
    if (level === 2) {
      const kind = rng.pick(['mult', 'div', 'pow', 'bidmas']);
      const v = rng.pick(['x', 'y', 'a', 'p']);
      if (kind === 'mult') {
        const a = rng.int(2, 7), b = rng.int(2, 7), m = rng.int(2, 6), n = rng.int(2, 6);
        return choice(`Simplify ${a}${v}${sup(m)} × ${b}${v}${sup(n)}`, `${a * b}${v}${sup(m + n)}`, [`${a + b}${v}${sup(m + n)}`, `${a * b}${v}${sup(m * n)}`, `${a + b}${v}${sup(m * n)}`], rng, {
          explain: `Multiply the numbers (${a} × ${b} = ${a * b}) and add the indices (${m} + ${n} = ${m + n}): ${a * b}${v}${sup(m + n)}.`,
          steps: ['Deal with the numbers and the letters separately.', `${a} × ${b} = ${a * b}.`, `${v}${sup(m)} × ${v}${sup(n)} = ${v}${sup(m + n)}, so the answer is ${a * b}${v}${sup(m + n)}.`],
        });
      }
      if (kind === 'div') {
        const b = rng.int(2, 6), q = rng.int(2, 6), n = rng.int(2, 5), m = n + rng.int(1, 5);
        return choice(`Simplify ${b * q}${v}${sup(m)} ÷ ${b}${v}${sup(n)}`, `${q}${v}${sup(m - n)}`, [`${b * q - b}${v}${sup(m - n)}`, `${q}${v}${sup(m + n)}`, `${q}${v}${sup(Math.round(m / n) === 1 ? m : Math.round(m / n))}`], rng, {
          explain: `Divide the numbers (${b * q} ÷ ${b} = ${q}) and subtract the indices (${m} − ${n} = ${m - n}).`,
          steps: ['Numbers and letters separately.', `${b * q} ÷ ${b} = ${q}.`, `${v}${sup(m)} ÷ ${v}${sup(n)} = ${v}${sup(m - n)}.`],
        });
      }
      if (kind === 'pow') {
        const a = rng.int(2, 5), m = rng.int(2, 5), n = rng.int(2, 4);
        return choice(`Simplify (${a}${v}${sup(m)})${sup(n)}`, `${a ** n}${v}${sup(m * n)}`, [`${a * n}${v}${sup(m * n)}`, `${a}${v}${sup(m * n)}`, `${a ** n}${v}${sup(m + n)}`], rng, {
          explain: `Everything inside the bracket is raised to the power ${n}: ${a}${sup(n)} = ${a ** n} and (${v}${sup(m)})${sup(n)} = ${v}${sup(m * n)}.`,
          steps: [`The power ${n} applies to the ${a} AND to ${v}${sup(m)}.`, `${a}${sup(n)} = ${a ** n}.`, `${v}${sup(m)} to the power ${n}: multiply indices, ${v}${sup(m * n)}.`],
        });
      }
      const [r, s] = rng.pick([[2, 2], [2, 4], [2, 8], [3, 3], [3, 9], [4, 4], [4, 8], [4, 16]]), p = rng.int(-6, -2), q = rng.int(-7, 7);
      const val = p * q + r ** 3 / s;
      return num(`${neg(p)} × ${paren(q)} + ${r}³ ÷ ${s} =`, val, `Indices first (${r}³ = ${r ** 3}), then × and ÷ (${neg(p)} × ${paren(q)} = ${neg(p * q)}, ${r ** 3} ÷ ${s} = ${r ** 3 / s}), then add: ${neg(val)}.`,
        [`Order of operations: brackets, indices, then × and ÷, then + and −.`, `${r}³ = ${r ** 3}; ${neg(p)} × ${paren(q)} = ${neg(p * q)}; ${r ** 3} ÷ ${s} = ${r ** 3 / s}.`, `${neg(p * q)} + ${r ** 3 / s} = ${neg(val)}.`]);
    }
    const kind = rng.pick(['negative', 'fractional', 'combined']);
    if (kind === 'negative') {
      const [b, e] = rng.pick([[2, 3], [2, 4], [3, 2], [5, 2], [10, 3], [4, 3], [2, 5]]);
      return fracQ(`Write ${b}${sup(-e)} as a fraction.`, F(1, b ** e), `A negative index means a reciprocal: ${b}${sup(-e)} = 1/${b}${sup(e)} = 1/${b ** e}.`,
        ['A negative index means “one over”.', `${b}${sup(-e)} = 1 ÷ ${b}${sup(e)}.`, `${b}${sup(e)} = ${b ** e}, so the answer is 1/${b ** e}.`]);
    }
    if (kind === 'fractional') {
      const [b, n, d, v] = rng.pick([[27, 1, 3, 3], [16, 3, 4, 8], [8, 2, 3, 4], [25, 3, 2, 125], [32, 2, 5, 4], [81, 3, 4, 27], [64, 2, 3, 16], [4, 3, 2, 8], [9, 3, 2, 27], [125, 2, 3, 25]]);
      const root = Math.round(b ** (1 / d));
      return num(`${b}^{${n}/${d}} =`, v, `The denominator ${d} means the ${d === 2 ? 'square' : d === 3 ? 'cube' : `${d}th`} root, and the numerator ${n} is a power: (${d === 2 ? '√' : d === 3 ? '∛' : `${d}th root of `}${b})${sup(n)} = ${root}${sup(n)} = ${v}.`,
        [`${b}^{${n}/${d}} means take the ${d === 2 ? 'square' : d === 3 ? 'cube' : `${d}th`} root, then raise to the power ${n}.`, `The root of ${b} is ${root}.`, `${root}${sup(n)} = ${v}.`]);
    }
    const b = rng.pick(['x', 'a', 'y']), m = rng.int(3, 7), k = rng.int(-4, -1), n = rng.int(1, 6);
    const r = m + k - n;
    return num(`(${b}${sup(m)} × ${b}${sup(k)}) ÷ ${b}${sup(n)} = ${b}ⁿ. What is n?`, r, `Add for ×, subtract for ÷: ${m} + ${paren(k)} − ${n} = ${neg(r)}.${r < 0 ? ` (So the answer is 1/${b}${sup(-r)}.)` : ''}`,
      ['The index laws work for negative indices too.', `Inside the bracket: ${m} + ${paren(k)} = ${m + k}.`, `Then ${m + k} − ${n} = ${neg(r)}.`]);
  },

  // ---- standard form --------------------------------------------------------------------
  y8mStandardForm(level, rng) {
    const t = rng.int(11, 99), e = rng.int(3, 7);
    if (level === 1) {
      if (rng.chance(0.5)) {
        return num(`Write ${sf(t, e)} as an ordinary number.`, ordinary(t, e), `Multiplying by 10${sup(e)} moves the digits ${e} places to the left: ${comma(ordinary(t, e))}.`,
          [`10${sup(e)} = 1${'0'.repeat(e)}.`, `${mant(t)} × 1${'0'.repeat(e)}: move the digits ${e} places left, filling with zeros.`, `${comma(ordinary(t, e))}.`]);
      }
      const n = ordinary(t, e);
      return choice(`Which is ${comma(n)} written in standard form?`, sf(t, e), [{ text: `${t} × 10${sup(e - 1)}`, feedback: `That equals ${comma(n)}, but the first number must be at least 1 and less than 10.` }, sf(t, e - 1), { text: `0.${t % 10 ? t : t / 10} × 10${sup(e + 1)}`, feedback: 'That equals the right value, but 0.something is less than 1, so it is not standard form.' }], rng, {
        explain: `Standard form is A × 10ⁿ with 1 ≤ A < 10. ${comma(n)} = ${mant(t)} × 10${sup(e)}.`,
        steps: ['Put the decimal point after the first non-zero digit: that gives A.', `A = ${mant(t)}.`, `Count how many places the digits moved: ${e}. So ${sf(t, e)}.`],
      });
    }
    if (level === 2) {
      const en = -rng.int(2, 5);
      const kind = rng.pick(['toOrd', 'toSF', 'order']);
      if (kind === 'toOrd') {
        return num(`Write ${sf(t, en)} as an ordinary number.`, ordinary(t, en), `A negative power of 10 makes it small: move the digits ${-en} places to the right: ${ordinary(t, en)}.`,
          [`10${sup(en)} means divide by 1${'0'.repeat(-en)}.`, `Move the digits ${-en} places right.`, `${ordinary(t, en)}.`]);
      }
      if (kind === 'toSF') {
        return choice(`Which is ${ordinary(t, en)} written in standard form?`, sf(t, en), [sf(t, -en), sf(t, en + 1), sf(t, en - 1)], rng, {
          explain: `The first non-zero digit is ${-en} places after the point, so the power is ${neg(en)}: ${sf(t, en)}.`,
          steps: ['Small numbers have negative powers.', `Move the point so the number is ${mant(t)}: that is ${-en} places.`, `So ${sf(t, en)}.`],
        });
      }
      const opts = rng.sample([[t, e], [rng.int(11, 99), e + 1], [rng.int(11, 99), e - 1], [rng.int(11, 99), -2]], 4);
      const val = ([a, b]) => a * 10 ** b;
      const best = opts.reduce((x, y) => (val(y) > val(x) ? y : x));
      if (opts.some((o) => o !== best && val(o) === val(best))) return G.y8mStandardForm(level, rng);
      return choice('Which number is the largest?', sf(...best), opts.filter((o) => o !== best).map((o) => sf(...o)), rng, {
        explain: `Compare the powers of 10 first: the biggest power wins. ${sf(...best)} is the largest.`,
        steps: ['In standard form, the power of 10 tells you the size.', 'Compare the powers first; only if they match, compare the first numbers.', `${sf(...best)}.`],
      });
    }
    if (rng.chance(0.5)) {
      const a = rng.int(2, 9), b = rng.int(2, 9), m = rng.int(2, 6), n = rng.int(2, 6);
      const p = a * b, right = p >= 10 ? sf(p, m + n + 1) : sf(p * 10, m + n);
      return choice(`(${a} × 10${sup(m)}) × (${b} × 10${sup(n)}) = ? Give the answer in standard form.`, right, [p >= 10 ? { text: `${p} × 10${sup(m + n)}`, feedback: `That is the right value, but ${p} is not between 1 and 10.` } : sf(p * 10, m + n + 1), sf(p >= 10 ? p : p * 10, m * n + (p >= 10 ? 1 : 0)), `${a + b} × 10${sup(m + n)}`], rng, {
        explain: `Multiply the numbers (${a} × ${b} = ${p}) and add the powers (${m} + ${n} = ${m + n}). ${p >= 10 ? `${p} × 10${sup(m + n)} = ${right}.` : `So ${right}.`}`,
        steps: ['Multiply the front numbers; add the powers of 10.', `${a} × ${b} = ${p}; 10${sup(m)} × 10${sup(n)} = 10${sup(m + n)}.`, p >= 10 ? `${p} is too big, so write it as ${mant(p)} × 10: ${right}.` : `Answer: ${right}.`],
      });
    }
    const [a, b, q] = rng.pick([[8, 2, 40], [9, 3, 30], [6, 2, 30], [8, 4, 20], [1, 2, 5], [2, 8, 2.5], [1, 4, 2.5], [1, 5, 2], [3, 6, 5], [6, 8, 7.5]]);
    const m = rng.int(5, 9), n = rng.int(2, 4);
    const right = q >= 10 ? sf(q, m - n) : sf(Math.round(q * 10), m - n - 1);
    const qt = q >= 10 ? q : Math.round(q * 10);
    return choice(`(${a} × 10${sup(m)}) ÷ (${b} × 10${sup(n)}) = ? Give the answer in standard form.`, right, [sf(qt, m - n + (q >= 10 ? 1 : 0)), sf(qt, Math.round(m / n) === m - n ? m + n : Math.round(m / n)), q >= 10 ? sf(qt, m - n - 1) : sf(qt, m + n)], rng, {
      explain: `Divide the numbers (${a} ÷ ${b} = ${a / b}) and subtract the powers (${m} − ${n} = ${m - n}). ${a / b < 1 ? `${a / b} × 10${sup(m - n)} = ${right}.` : `So ${right}.`}`,
      steps: ['Divide the front numbers; subtract the powers of 10.', `${a} ÷ ${b} = ${a / b}; 10${sup(m)} ÷ 10${sup(n)} = 10${sup(m - n)}.`, a / b < 1 ? `${a / b} is less than 1, so it becomes ${mant(qt)} × 10${sup(-1)}: ${right}.` : `Answer: ${right}.`],
    });
  },

  // ---- fractions ----------------------------------------------------------------------
  y8mFractions(level, rng) {
    if (level === 1) {
      let d1 = rng.int(3, 12), d2 = rng.int(3, 12);
      while (d1 === d2 || d1 % d2 === 0 || d2 % d1 === 0) { d1 = rng.int(3, 12); d2 = rng.int(3, 12); }
      let a = F(rng.int(1, d1 - 1), d1), b = F(rng.int(1, d2 - 1), d2);
      const add = rng.chance(0.5);
      if (!add && a.cmp(b) < 0) [a, b] = [b, a];
      if (!add && a.eq(b)) return G.y8mFractions(level, rng);
      const r = add ? a.add(b) : a.sub(b), L = lcm(a.d, b.d);
      return fracQ(`${tex(a)} ${add ? '+' : '−'} ${tex(b)} =`, r, `Use the common denominator ${L}: ${a.n * (L / a.d)}/${L} ${add ? '+' : '−'} ${b.n * (L / b.d)}/${L} = ${tex(r, true)}.`,
        [`The lowest common denominator of ${a.d} and ${b.d} is ${L}.`, `${tex(a)} = ${a.n * (L / a.d)}/${L} and ${tex(b)} = ${b.n * (L / b.d)}/${L}.`, `${add ? 'Add' : 'Subtract'} the numerators and simplify: ${tex(r, true)}.`]);
    }
    if (level === 2) {
      const mixed = () => { const d = rng.int(2, 6); return F(rng.int(1, 3) * d + rng.int(1, d - 1), d); };
      const a = mixed(), b = rng.chance(0.5) ? mixed() : F(rng.int(1, 4), rng.int(5, 9));
      if (b.n === 0) return G.y8mFractions(level, rng);
      const mul = rng.chance(0.5), r = mul ? a.mul(b) : a.div(b);
      return fracQ(`${tex(a, true)} ${mul ? '×' : '÷'} ${tex(b, true)} =`, r,
        `Turn mixed numbers into improper fractions: ${tex(a)} ${mul ? '×' : '÷'} ${tex(b)}. ${mul ? 'Multiply tops and bottoms' : `Flip the second fraction and multiply: ${tex(a)} × ${tex(F(b.d, b.n))}`}. Answer ${tex(r, true)}.`,
        [`Improper fractions first: ${tex(a, true)} = ${tex(a)}${b.d !== 1 && b.n > b.d ? `, ${tex(b, true)} = ${tex(b)}` : ''}.`, mul ? `Multiply: (${a.n} × ${b.n}) / (${a.d} × ${b.d}).` : `Dividing by ${tex(b)} is multiplying by ${tex(F(b.d, b.n))}.`, `Simplify: ${tex(r, true)}.`],
        { placeholder: 'e.g. 2 3/4 or 11/4' });
    }
    if (rng.chance(0.5)) {
      const a = F(1, rng.int(2, 5)).mul(rng.int(1, 2)), c = F(1, rng.int(2, 5));
      if (a.cmp(1) >= 0) return G.y8mFractions(level, rng);
      const left = F(1).sub(a).mul(F(1).sub(c));
      return fracQ(`Theo spends ${tex(a)} of his drachmae on figs, then ${tex(c)} of what is left on a lyre string. What fraction of his money does he still have?`, left,
        `After the figs he has ${tex(F(1).sub(a))} left. He spends ${tex(c)} of that, keeping ${tex(F(1).sub(c))} of it: ${tex(F(1).sub(a))} × ${tex(F(1).sub(c))} = ${tex(left)}.`,
        [`After the figs: 1 − ${tex(a)} = ${tex(F(1).sub(a))} left.`, `“${tex(c)} of what is left” is spent, so he keeps ${tex(F(1).sub(c))} OF it.`, `${tex(F(1).sub(a))} × ${tex(F(1).sub(c))} = ${tex(left)}.`]);
    }
    const m = () => { const d = rng.pick([2, 3, 4, 6, 8]); return F(rng.int(1, 3) * d + rng.int(1, d - 1), d); };
    const a = m(), b = m(), c = F(rng.int(1, 5), 6);
    const r = a.add(b).sub(c), L = lcm(lcm(a.d, b.d), c.d);
    const parts = { 2: 'halves', 3: 'thirds', 4: 'quarters', 6: 'sixths', 8: 'eighths', 12: 'twelfths', 24: 'twenty-fourths' };
    return fracQ(`${tex(a, true)} + ${tex(b, true)} − ${tex(c)} =`, r, `Whole numbers and fractions can be done separately, or convert everything to ${parts[L]}. The answer is ${tex(r, true)}.`,
      [`Find a common denominator for ${a.d}, ${b.d} and ${c.d}: ${L}.`, `Add the mixed numbers: ${tex(a.add(b), true)}.`, `Subtract ${tex(c)}: ${tex(r, true)}.`], { placeholder: 'e.g. 3 5/8 or 29/8' });
  },

  // ---- percentages ----------------------------------------------------------------------
  y8mPercent(level, rng) {
    if (level === 1) {
      if (rng.chance(0.5)) {
        const o = rng.int(2, 20) * 20, p = rng.pick([5, 10, 15, 20, 25, 30, 40, 60, 75]), up = rng.chance(0.5);
        const n = up ? o + (o * p) / 100 : o - (o * p) / 100;
        const what = rng.pick([['visitors came to the games at Olympia', 'visitors'], ['drachmae was the price of a bronze helmet', 'drachmae'], ['ships sailed for Troy', 'ships']]);
        return num(`Last year ${o} ${what[0]}. This year it is ${n}. What is the percentage ${up ? 'increase' : 'decrease'}?`, p,
          `Change ÷ original × 100: ${Math.abs(n - o)} ÷ ${o} × 100 = ${p}%.`,
          [`The change is ${Math.abs(n - o)} ${what[1]}.`, `Divide by the ORIGINAL amount: ${Math.abs(n - o)} ÷ ${o} = ${dp(p, 2)}.`, `× 100 gives ${p}%.`], { unit: '%' });
      }
      const p = rng.pick([3, 7, 12, 15, 35, 4, 17, 60]), up = rng.chance(0.5);
      const right = up ? dp(100 + p, 2) : dp(100 - p, 2);
      return choice(`Which single multiplier ${up ? 'increases' : 'decreases'} an amount by ${p}%?`, right, [dp(p, 2), up ? dp(100 - p, 2) : dp(100 + p, 2), dp(100 + p * 10, 2), String(p)], rng, {
        explain: `${up ? 'An increase' : 'A decrease'} of ${p}% ${up ? 'gives' : 'leaves'} ${up ? 100 + p : 100 - p}% of the original, and ${up ? 100 + p : 100 - p}% = ${right}.`,
        steps: ['The original amount is 100%.', `${up ? 'Add' : 'Take away'} ${p}%: ${up ? 100 + p : 100 - p}%.`, `As a decimal: ${right}.`],
      });
    }
    if (level === 2) {
      if (rng.chance(0.55)) {
        const p = rng.pick([10, 20, 25, 40, 15, 30]), up = rng.chance(0.4), o = rng.int(3, 30) * 20;
        const now = up ? (o * (100 + p)) / 100 : (o * (100 - p)) / 100;
        if (!Number.isInteger(now)) return G.y8mPercent(level, rng);
        return num(`After a ${p}% ${up ? 'increase' : 'discount'}, a shield costs £${now}. What did it cost before?`, o,
          `£${now} is ${up ? 100 + p : 100 - p}% of the original. Divide by the multiplier ${dp(up ? 100 + p : 100 - p, 2)}: £${o}. (Not ${money(now * (up ? 100 - p : 100 + p))}: the ${p}% was of the ORIGINAL price, not the new one.)`,
          [`£${now} is ${up ? 100 + p : 100 - p}% of the original price.`, `1% of the original is £${now} ÷ ${up ? 100 + p : 100 - p} = ${money(o)}.`, `100% = ${money(o)} × 100 = £${o}.`], { unit: '£', unitBefore: true });
      }
      const a = rng.pick([10, 20, 25, 50]), b = rng.pick([10, 20, 25, 50]);
      const overall = (100 + a) * (100 - b) - 10000; // in hundredths of a per cent
      return num(`A price rises by ${a}%, then falls by ${b}%. What is the overall percentage change? (Use a minus sign for a decrease.)`, dp(overall, 2),
        `Multipliers: ${dp(100 + a, 2)} × ${dp(100 - b, 2)} = ${dp((100 + a) * (100 - b), 4)}. That is ${overall < 0 ? 'a decrease' : 'an increase'} of ${dp(Math.abs(overall), 2)}%.`,
        ['Percentages of different amounts cannot just be added.', `Multiply the multipliers: ${dp(100 + a, 2)} × ${dp(100 - b, 2)} = ${dp((100 + a) * (100 - b), 4)}.`, `${dp((100 + a) * (100 - b), 4)} means an overall change of ${show(dp(overall, 2))}%.`], { unit: '%' });
    }
    for (let guard = 0; guard < 50; guard++) {
      const r = rng.pick([2, 4, 5, 10, 20]), n = rng.int(2, 3), down = rng.chance(0.3), P = rng.int(5, 80) * 100;
      let pence = P * 100, ok = true;
      for (let i = 0; i < n; i++) { const next = (pence * (down ? 100 - r : 100 + r)) / 100; if (!Number.isInteger(next)) { ok = false; break; } pence = next; }
      if (!ok) continue;
      const thing = down ? `A merchant’s chariot is worth £${comma(P)}. It loses ${r}% of its value every year.` : `Mira puts £${comma(P)} in a savings account paying ${r}% compound interest each year.`;
      return num(`${thing} What is it worth after ${n} years? Give the exact amount in pounds.`, pounds(pence),
        `Multiply by ${dp(down ? 100 - r : 100 + r, 2)} once for each year: £${comma(P)} × ${dp(down ? 100 - r : 100 + r, 2)}${sup(n)} = ${money(pence)}.`,
        [`Each year the value is multiplied by ${dp(down ? 100 - r : 100 + r, 2)}.`, `After ${n} years: £${comma(P)} × ${dp(down ? 100 - r : 100 + r, 2)}${sup(n)}.`, `= ${money(pence)}.`], { unit: '£', unitBefore: true });
    }
    return G.y8mPercent(2, rng);
  },

  // ---- ratio and proportion -------------------------------------------------------------
  y8mRatio(level, rng) {
    if (level === 1) {
      const kind = rng.pick(['share', 'simplify', 'fraction']);
      if (kind === 'share') {
        const parts = rng.chance(0.5) ? [rng.int(1, 5), rng.int(2, 7)] : [rng.int(1, 4), rng.int(2, 5), rng.int(3, 7)];
        const S = parts.reduce((a, b) => a + b, 0), k = rng.int(3, 25), names = ['Jason', 'Medea', 'Orpheus'].slice(0, parts.length);
        const big = Math.max(...parts), who = names[parts.indexOf(big)];
        return num(`${names.join(', ').replace(/, ([^,]*)$/, ' and $1')} share ${S * k} drachmae in the ratio ${parts.join(' : ')}. How much does ${who} get?`, big * k,
          `${parts.join(' + ')} = ${S} parts. One part is ${S * k} ÷ ${S} = ${k}. ${who} gets ${big} parts: ${big * k}.`,
          [`Total parts: ${parts.join(' + ')} = ${S}.`, `One part: ${S * k} ÷ ${S} = ${k}.`, `${who}: ${big} × ${k} = ${big * k} drachmae.`]);
      }
      if (kind === 'simplify') {
        let a = rng.int(1, 9), b = rng.int(1, 9);
        while (gcd(a, b) !== 1 || a === b) { a = rng.int(1, 9); b = rng.int(1, 9); }
        const k = rng.int(2, 12), k2 = k % 2 === 0 ? k / 2 : null;
        return choice(`Write ${a * k} : ${b * k} in its simplest form.`, `${a} : ${b}`, [`${b} : ${a}`, k2 && k2 > 1 ? `${a * k2} : ${b * k2}` : `${a * k} : ${b}`, `${a + 1} : ${b + 1}`], rng, {
          explain: `Divide both parts by their HCF, ${k}: ${a} : ${b}.`, steps: [`Find the HCF of ${a * k} and ${b * k}: ${k}.`, `${a * k} ÷ ${k} = ${a}, ${b * k} ÷ ${k} = ${b}.`, `${a} : ${b}.`],
        });
      }
      const a = rng.int(1, 7), b = rng.int(1, 9);
      return fracQ(`Owls and snakes on a temple frieze are in the ratio ${a} : ${b}. What fraction of the animals are owls?`, F(a, a + b), `${a} out of every ${a + b} animals are owls: ${tex(F(a, a + b))}.`,
        [`A ratio ${a} : ${b} means ${a + b} parts in total.`, `Owls are ${a} of those parts.`, `Fraction = ${a}/${a + b}${gcd(a, a + b) > 1 ? ` = ${tex(F(a, a + b))}` : ''}.`]);
    }
    if (level === 2) {
      const kind = rng.pick(['best', 'diff', 'direct']);
      if (kind === 'best') {
        const [q1, q2] = rng.sample([250, 400, 500, 600, 750, 1000], 2);
        const u1 = rng.int(15, 45) * 2, u2 = u1 + rng.pick([-1, 1]) * rng.int(2, 5) * 2;
        const p1 = (q1 * u1) / 100, p2 = (q2 * u2) / 100;
        const better = u1 < u2 ? 'A' : 'B';
        return choice(`Ambrosia honey: jar A is ${q1} g for ${money(p1)}, jar B is ${q2} g for ${money(p2)}. Which is better value?`, `Jar ${better}`, ['Jar ' + (better === 'A' ? 'B' : 'A'), { text: 'They are the same value', feedback: `Work out the price of 100 g: ${u1}p and ${u2}p are different.` }], rng, {
          explain: `Price per 100 g: A is ${money(p1)} ÷ ${q1 / 100} = ${u1}p, B is ${money(p2)} ÷ ${q2 / 100} = ${u2}p. Jar ${better} is cheaper per gram.`,
          steps: ['Compare the price of the SAME amount, e.g. 100 g.', `A: ${p1}p ÷ ${q1 / 100} = ${u1}p per 100 g. B: ${p2}p ÷ ${q2 / 100} = ${u2}p per 100 g.`, `Jar ${better} is better value.`],
        });
      }
      if (kind === 'diff') {
        const a = rng.int(2, 6), b = a + rng.int(1, 5), k = rng.int(3, 15);
        return num(`Kit and Theo share some sweets in the ratio ${a} : ${b}. Theo gets ${(b - a) * k} more than Kit. How many sweets are there altogether?`, (a + b) * k,
          `The difference is ${b} − ${a} = ${b - a} parts = ${(b - a) * k}, so one part is ${k}. Altogether ${a + b} parts = ${(a + b) * k}.`,
          [`The difference in parts is ${b - a}.`, `${b - a} parts = ${(b - a) * k}, so 1 part = ${k}.`, `Total = ${a + b} × ${k} = ${(a + b) * k}.`]);
      }
      const n1 = rng.int(3, 8), u = rng.int(3, 40) * 5, n2 = rng.int(9, 20);
      return num(`${n1} jars of olive oil cost ${money(n1 * u)}. How much do ${n2} jars cost?`, pounds(n2 * u), `One jar costs ${money(n1 * u)} ÷ ${n1} = ${money(u)}. ${n2} jars: ${money(n2 * u)}.`,
        [`Find the cost of one jar first (the unitary method).`, `${money(n1 * u)} ÷ ${n1} = ${money(u)}.`, `× ${n2} = ${money(n2 * u)}.`], { unit: '£', unitBefore: true });
    }
    const kind = rng.pick(['inverse', 'combine']);
    if (kind === 'inverse') {
      const P = rng.pick([120, 180, 240, 360, 144, 72, 300]);
      const divs = []; for (let d = 2; d <= 40; d++) if (P % d === 0 && P / d >= 2) divs.push(d);
      const [w1, w2] = rng.sample(divs.filter((d) => d <= 30), 2);
      return num(`${w1} shipwrights can build a trireme in ${P / w1} days. Working at the same rate, how many days would ${w2} shipwrights take?`, P / w2,
        `More workers, fewer days: inverse proportion. The job is ${w1} × ${P / w1} = ${P} worker-days. ${P} ÷ ${w2} = ${P / w2} days.`,
        ['Ask: should more workers take more or less time? Less, so it is inverse proportion.', `Total work = ${w1} × ${P / w1} = ${P} worker-days.`, `${P} ÷ ${w2} = ${P / w2} days.`]);
    }
    const p = rng.int(1, 5), q = rng.int(2, 6), r = rng.int(2, 6), s = rng.int(1, 7);
    // scale both ratios so b becomes LCM(q, r): the smallest whole numbers that make the b parts match
    const L = lcm(q, r), A = (p * L) / q, C = (s * L) / r, g = gcd(A, C);
    if (gcd(p, q) !== 1 || gcd(r, s) !== 1 || A / g === C / g) return G.y8mRatio(level, rng);
    const scaled = (x, y, by) => (by === 1 ? `${x} : ${y} stays as it is` : `${x} : ${y} = ${x * by} : ${y * by}`);
    const match = q === r ? `b is ${q} in both ratios already, so they match.` : `b is ${q} in the first ratio and ${r} in the second. Make both ${L}: ${scaled(p, q, L / q)} and ${scaled(r, s, L / r)}.`;
    return choice(`a : b = ${p} : ${q} and b : c = ${r} : ${s}. What is a : c?`, `${A / g} : ${C / g}`, [`${p} : ${s}`, `${C / g} : ${A / g}`, `${p * s} : ${q * r}`], rng, {
      explain: `${q === r ? 'The b parts already match' : `Make the b parts match: a : b = ${A} : ${L} and b : c = ${L} : ${C}`}. So a : b : c = ${A} : ${L} : ${C} and a : c = ${A} : ${C}${g > 1 ? ` = ${A / g} : ${C / g}` : ''}.`,
      steps: [match, `a : b : c = ${A} : ${L} : ${C}.`, `a : c = ${A} : ${C}${g > 1 ? ` = ${A / g} : ${C / g}` : ''}.`],
    });
  },

  // ---- algebra: simplify, expand, factorise ------------------------------------------------
  y8mAlgebra(level, rng) {
    const nz = (lo, hi) => { let v = 0; while (v === 0) v = rng.int(lo, hi); return v; };
    if (level === 1) {
      if (rng.chance(0.5)) {
        const [u, v] = rng.pick([['a', 'b'], ['x', 'y'], ['m', 'n'], ['p', 'q']]);
        const a1 = nz(-4, 8), b1 = nz(-6, 8), a2 = nz(-6, 6), b2 = nz(-5, 7);
        if (a1 + a2 === 0 || b1 + b2 === 0) return G.y8mAlgebra(level, rng);
        const e = expr([[a1 + a2, u], [b1 + b2, v]]);
        const t = (c, x, first) => (first ? (c < 0 ? '−' : '') : c < 0 ? ' − ' : ' + ') + (Math.abs(c) === 1 ? x : `${Math.abs(c)}${x}`);
        return alg(`Simplify: ${t(a1, u, true)}${t(b1, v)}${t(a2, u)}${t(b2, v)}`, e, `Collect the ${u} terms (${neg(a1)} + ${paren(a2)} = ${neg(a1 + a2)}) and the ${v} terms (${neg(b1)} + ${paren(b2)} = ${neg(b1 + b2)}): ${show(e.answer)}.`,
          ['Only like terms (the same letter) can be combined.', `${u}: ${neg(a1)} + ${paren(a2)} = ${neg(a1 + a2)}. ${v}: ${neg(b1)} + ${paren(b2)} = ${neg(b1 + b2)}.`, `${show(e.answer)}.`]);
      }
      const k = nz(-6, 7), p = rng.int(1, 6), q = nz(-9, 9);
      if (k === 1) return G.y8mAlgebra(level, rng);
      const e = expr([[k * p, 'x'], [k * q, '']]);
      return alg(`Expand: ${neg(k)}(${ex([[p, 'x'], [q, '']])})`, e, `Multiply every term inside by ${neg(k)}: ${neg(k)} × ${p === 1 ? 'x' : `${p}x`} = ${ex([[k * p, 'x']])} and ${neg(k)} × ${paren(q)} = ${neg(k * q)}.`,
        [`The ${neg(k)} multiplies BOTH terms in the bracket.`, `${neg(k)} × ${p === 1 ? 'x' : `${p}x`} = ${ex([[k * p, 'x']])}; ${neg(k)} × ${paren(q)} = ${neg(k * q)}.`, `${show(e.answer)}.`]);
    }
    if (level === 2) {
      if (rng.chance(0.5)) {
        const k1 = rng.int(2, 7), a = nz(-6, 8), k2 = nz(-6, 6), b = nz(-7, 7);
        if (k1 + k2 === 0 || Math.abs(k2) === 1) return G.y8mAlgebra(level, rng);
        const e = expr([[k1 + k2, 'x'], [k1 * a + k2 * b, '']]);
        return alg(`Expand and simplify: ${k1}(${ex([[1, 'x'], [a, '']])})${k2 < 0 ? ' − ' : ' + '}${Math.abs(k2)}(${ex([[1, 'x'], [b, '']])})`, e,
          `${k1}(${ex([[1, 'x'], [a, '']])}) = ${ex([[k1, 'x'], [k1 * a, '']])}; ${neg(k2)}(${ex([[1, 'x'], [b, '']])}) = ${ex([[k2, 'x'], [k2 * b, '']])}. Together: ${show(e.answer)}.`,
          ['Expand each bracket separately, watching the sign in front of the second.', `${ex([[k1, 'x'], [k1 * a, '']])} and ${ex([[k2, 'x'], [k2 * b, '']])}.`, `Collect like terms: ${show(e.answer)}.`]);
      }
      const g = rng.int(2, 9); let p = rng.int(1, 7), q = nz(-9, 9);
      while (gcd(p, Math.abs(q)) !== 1) { p = rng.int(1, 7); q = nz(-9, 9); }
      const inner = expr([[p, 'x'], [q, '']]);
      const ans = { answer: `${g}(${inner.answer})`, accept: inner.accept.map((i) => `${g}(${i})`) };
      return alg(`Factorise fully: ${ex([[g * p, 'x'], [g * q, '']])}`, ans, `The HCF of ${g * p} and ${Math.abs(g * q)} is ${g}: ${g}(${show(inner.answer)}). Check by expanding.`,
        [`Find the highest common factor of ${g * p} and ${Math.abs(g * q)}: ${g}.`, `Divide each term by ${g}: ${ex([[p, 'x']])} and ${neg(q)}.`, `${g}(${show(inner.answer)}).`], { placeholder: 'e.g. 3(2x + 5)' });
    }
    if (rng.chance(0.5)) {
      const a = nz(-4, 5), b = rng.int(1, 5), c = nz(-7, 7), d = nz(-9, 9);
      if (a === 1 && b === 1) return G.y8mAlgebra(level, rng);
      const e = expr([[a * b, 'x²'], [a * c + d, 'x']]);
      const outer = a === 1 ? 'x' : a === -1 ? '−x' : `${neg(a)}x`, tail = d === 1 ? ' + x' : d === -1 ? ' − x' : `${sgn(d)}x`;
      return alg(`Expand and simplify: ${outer}(${ex([[b, 'x'], [c, '']])})${tail}`, e,
        `${ex([[a, 'x']])} × ${ex([[b, 'x']])} = ${ex([[a * b, 'x²']])} and ${ex([[a, 'x']])} × ${paren(c)} = ${ex([[a * c, 'x']])}. Then add ${ex([[d, 'x']])}: ${show(e.answer)}.`,
        ['x × x = x².', `${ex([[a, 'x']])}(${ex([[b, 'x'], [c, '']])}) = ${ex([[a * b, 'x²'], [a * c, 'x']])}.`, `Collect the x terms: ${show(e.answer)}.`], { placeholder: 'e.g. 3x² + 2x' });
    }
    const g = rng.int(2, 6); let p = rng.int(1, 5), q = rng.int(1, 7);
    while (gcd(p, q) !== 1) { p = rng.int(1, 5); q = rng.int(1, 7); }
    if (rng.chance(0.5)) {
      const inner = expr([[p, 'x'], [q, '']]);
      return alg(`Factorise fully: ${ex([[g * p, 'x²'], [g * q, 'x']])}`, { answer: `${g}x(${inner.answer})`, accept: inner.accept.map((i) => `${g}x(${i})`) },
        `Both terms have a factor ${g} AND a factor x: ${g}x(${show(inner.answer)}).`, [`The HCF of ${g * p}x² and ${g * q}x is ${g}x.`, `${g * p}x² ÷ ${g}x = ${ex([[p, 'x']])}; ${g * q}x ÷ ${g}x = ${q}.`, `${g}x(${show(inner.answer)}).`], { placeholder: 'e.g. 2x(3x + 4)' });
    }
    const inner = expr([[p, 'x'], [q, 'y']]);
    return alg(`Factorise fully: ${ex([[g * p, 'x²y'], [g * q, 'xy²']])}`, { answer: `${g}xy(${inner.answer})`, accept: inner.accept.map((i) => `${g}xy(${i})`) },
      `The HCF is ${g}xy: ${g}xy(${show(inner.answer)}).`, [`Common number: ${g}. Common letters: x and y (the lowest power of each).`, `Divide each term by ${g}xy.`, `${g}xy(${show(inner.answer)}).`], { placeholder: 'e.g. 2xy(3x + y)' });
  },

  // ---- substitution and rearranging --------------------------------------------------------
  y8mFormulae(level, rng) {
    if (level === 1) {
      if (rng.chance(0.5)) {
        const a = rng.pick([-5, -4, -3, -2, -1, 2, 3, 4, 5]), b = rng.int(2, 6);
        const [txt, f] = rng.pick([[`2a² − 3b`, () => 2 * a * a - 3 * b], [`a² + ab`, () => a * a + a * b], [`(a − b)²`, () => (a - b) ** 2], [`3a − b²`, () => 3 * a - b * b], [`ab² − a`, () => a * b * b - a]]);
        return num(`If a = ${neg(a)} and b = ${b}, work out ${txt}.`, f(), `Replace each letter with its value${a < 0 ? ', using brackets round negatives' : ''}: the answer is ${neg(f())}.`,
          [a < 0 ? `Put brackets round the negative: a = ${paren(a)}.` : `Substitute a = ${a} and b = ${b}.`, `Indices first, then × and ÷, then + and −.`, `${txt} = ${neg(f())}.`]);
      }
      if (rng.chance(0.5)) {
        const u = rng.int(-5, 12), a = rng.pick([-3, -2, 2, 3, 4, 5]), t = rng.int(2, 9);
        return num(`v = u + at. Find v when u = ${neg(u)}, a = ${neg(a)} and t = ${t}.`, u + a * t, `v = ${neg(u)} + ${paren(a)} × ${t} = ${neg(u)} + ${paren(a * t)} = ${neg(u + a * t)}.`,
          ['Substitute each value.', `at = ${paren(a)} × ${t} = ${neg(a * t)}.`, `v = ${neg(u)} + ${paren(a * t)} = ${neg(u + a * t)}.`]);
      }
      const u = rng.int(0, 10), a = rng.pick([2, 4, 6, 10]), t = rng.int(2, 8);
      const s = u * t + (a * t * t) / 2;
      return num(`s = ut + ½at². Find s when u = ${u}, a = ${a} and t = ${t}.`, s, `ut = ${u * t}; ½at² = ½ × ${a} × ${t * t} = ${(a * t * t) / 2}. s = ${s}.`,
        [`ut = ${u} × ${t} = ${u * t}.`, `t² = ${t * t}, so ½ × ${a} × ${t * t} = ${(a * t * t) / 2}.`, `s = ${u * t} + ${(a * t * t) / 2} = ${s}.`]);
    }
    if (level === 2) {
      if (rng.chance(0.45)) {
        const C = rng.int(-8, 20) * 5, Fh = (9 * C) / 5 + 32;
        if (rng.chance(0.5)) return num(`F = {{9/5}}C + 32 converts Celsius to Fahrenheit. Convert ${neg(C)}°C to Fahrenheit.`, Fh, `{{9/5}} × ${paren(C)} = ${neg((9 * C) / 5)}; + 32 = ${neg(Fh)}°F.`, [`Substitute C = ${neg(C)}.`, `${neg(C)} ÷ 5 × 9 = ${neg((9 * C) / 5)}.`, `${neg((9 * C) / 5)} + 32 = ${neg(Fh)}.`], { unit: '°F' });
        return num(`F = {{9/5}}C + 32. The temperature at the Oracle’s spring is ${neg(Fh)}°F. What is it in Celsius?`, C, `Undo the formula: subtract 32 (${neg(Fh - 32)}), then multiply by {{5/9}}: ${neg(C)}°C.`,
          [`${neg(Fh)} = {{9/5}}C + 32.`, `Subtract 32: ${neg(Fh - 32)} = {{9/5}}C.`, `Multiply by 5 and divide by 9: C = ${neg(C)}.`], { unit: '°C' });
      }
      const a = rng.int(2, 9), b = rng.pick([-9, -7, -5, -4, -3, -2, 2, 3, 4, 5, 7, 8]);
      const right = `x = (y ${b < 0 ? '+' : '−'} ${Math.abs(b)})/${a}`;
      return choice(`Make x the subject of y = ${a}x${sgn(b)}`, right, [`x = (y ${b < 0 ? '−' : '+'} ${Math.abs(b)})/${a}`, `x = ${a}y${sgn(-b)}`, `x = y/${a}${sgn(-b)}`], rng, {
        explain: `Undo the operations in reverse: first ${b < 0 ? `add ${-b}` : `subtract ${b}`}, then divide by ${a}.`,
        steps: [`y = ${a}x${sgn(b)}.`, `${b < 0 ? `Add ${-b} to` : `Subtract ${b} from`} both sides: y${sgn(-b)} = ${a}x.`, `Divide by ${a}: ${right}.`],
      });
    }
    const bank = [
      ['A = πr²', 'r', 'r = √(A/π)', ['r = A/(2π)', 'r = √(Aπ)', 'r = (A/π)²'], ['Divide by π: r² = A/π.', 'Square root both sides.', 'r = √(A/π).']],
      ['v² = u² + 2as', 'a', 'a = (v² − u²)/(2s)', ['a = (v − u)²/(2s)', 'a = v² − u² − 2s', 'a = 2s/(v² − u²)'], ['Subtract u²: v² − u² = 2as.', 'Divide by 2s.', 'a = (v² − u²)/(2s).']],
      ['y = (x + k)/m', 'x', 'x = my − k', ['x = (y − k)/m', 'x = my + k', 'x = m(y − k)'], ['Multiply by m: my = x + k.', 'Subtract k.', 'x = my − k.']],
      ['P = 2(l + w)', 'w', 'w = P/2 − l', ['w = P − 2l', 'w = 2P − l', 'w = (P − l)/2'], ['Divide by 2: P/2 = l + w.', 'Subtract l.', 'w = P/2 − l.']],
      ['E = ½mv²', 'v', 'v = √(2E/m)', ['v = √(E/(2m))', 'v = 2E/m', 'v = (2E/m)²'], ['Multiply by 2: 2E = mv².', 'Divide by m, then square root.', 'v = √(2E/m).']],
      ['y = 5 − 2x', 'x', 'x = (5 − y)/2', ['x = (y − 5)/2', 'x = 5 − y/2', 'x = (5 + y)/2'], ['Add 2x and subtract y: 2x = 5 − y.', 'Divide by 2.', 'x = (5 − y)/2.']],
      ['T = 2π√(l/g)', 'l', 'l = g(T/(2π))²', ['l = g(T/2π)', 'l = gT/(2π)', 'l = (T/(2πg))²'], ['Divide by 2π: T/(2π) = √(l/g).', 'Square both sides: (T/(2π))² = l/g.', 'Multiply by g: l = g(T/(2π))².']],
      ['A = ½(a + b)h', 'h', 'h = 2A/(a + b)', ['h = A/(2(a + b))', 'h = 2A − (a + b)', 'h = (a + b)/(2A)'], ['Multiply by 2: 2A = (a + b)h.', 'Divide by (a + b).', 'h = 2A/(a + b).']],
    ];
    const [f, v, right, wrongs, steps] = rng.pick(bank);
    return choice(`Make ${v} the subject of ${f}.`, right, wrongs, rng, { explain: `Undo the operations around ${v} in reverse order. ${steps.join(' ')}`, steps });
  },

  // ---- linear equations -------------------------------------------------------------------
  y8mEquations(level, rng) {
    const x = rng.int(-9, 12);
    if (level === 1) {
      const kind = rng.pick(['two', 'bracket', 'divide']);
      if (kind === 'two') {
        const a = rng.int(2, 9), b = rng.pick([-15, -9, -7, -4, 3, 5, 8, 11, 14]);
        return num(`Solve ${a}x${sgn(b)} = ${neg(a * x + b)}`, x, `${b < 0 ? `Add ${-b}` : `Subtract ${b}`}: ${a}x = ${neg(a * x)}. Divide by ${a}: x = ${neg(x)}.`,
          [`${b < 0 ? `Add ${-b} to` : `Subtract ${b} from`} both sides: ${a}x = ${neg(a * x)}.`, `Divide both sides by ${a}.`, `x = ${neg(x)}. Check: ${a} × ${paren(x)}${sgn(b)} = ${neg(a * x + b)}.`]);
      }
      if (kind === 'bracket') {
        const a = rng.int(2, 7), b = rng.pick([-6, -4, -3, -2, 1, 2, 5, 7]);
        return num(`Solve ${a}(x${sgn(b)}) = ${neg(a * (x + b))}`, x, `Divide by ${a}: x${sgn(b)} = ${neg(x + b)}. So x = ${neg(x)}.`,
          [`Divide both sides by ${a} (or expand first).`, `x${sgn(b)} = ${neg(x + b)}.`, `x = ${neg(x)}.`]);
      }
      const a = rng.int(2, 6), b = rng.int(-6, 9);
      if (b === 0) return G.y8mEquations(level, rng);
      return num(`Solve x/${a}${sgn(b)} = ${neg(x + b)}`.replace(`x/${a}`, `{{x/${a}}}`), a * x, `${b < 0 ? `Add ${-b}` : `Subtract ${b}`}: {{x/${a}}} = ${neg(x)}. Multiply by ${a}: x = ${neg(a * x)}.`,
        [`${b < 0 ? `Add ${-b}` : `Subtract ${b}`} first: {{x/${a}}} = ${neg(x)}.`, `Multiply both sides by ${a}.`, `x = ${neg(a * x)}.`]);
    }
    if (level === 2) {
      if (rng.chance(0.5)) {
        let a = rng.int(3, 11), c = rng.int(1, 9);
        if (a === c) a++;
        const b = rng.int(-15, 15), d = a * x + b - c * x;
        if (b === 0 || d === 0) return G.y8mEquations(level, rng);
        // subtract the smaller x term, so the x coefficient left over is positive
        const lo = Math.min(a, c), k = Math.abs(a - c), [keep, move] = a > c ? [b, d] : [d, b];
        const after = a > c ? `${ex([[k, 'x']])}${sgn(b)} = ${neg(d)}` : `${neg(b)} = ${ex([[k, 'x']])}${sgn(d)}`;
        return num(`Solve ${a}x${sgn(b)} = ${ex([[c, 'x']])}${sgn(d)}`, x, `Get the x terms on one side: subtract ${ex([[lo, 'x']])}. Then ${after}, so ${k === 1 ? '' : `${ex([[k, 'x']])} = ${neg(move - keep)} and `}x = ${neg(x)}.`,
          [`Subtract ${ex([[lo, 'x']])} from both sides: ${after}.`, `${keep < 0 ? `Add ${-keep}` : `Subtract ${keep}`}: ${ex([[k, 'x']])} = ${neg(move - keep)}.`, `${k === 1 ? 'So' : `Divide by ${k}:`} x = ${neg(x)}.`]);
      }
      let k = rng.int(2, 6), m = rng.int(2, 6);
      if (k === m) m++;
      const p = rng.int(-6, 8), q = (k * (x + p)) / m - x;
      if (!Number.isInteger(q) || p === 0 || q === 0) return G.y8mEquations(level, rng);
      return num(`Solve ${k}(x${sgn(p)}) = ${m}(x${sgn(q)})`, x, `Expand: ${ex([[k, 'x'], [k * p, '']])} = ${ex([[m, 'x'], [m * q, '']])}. Collect: ${ex([[k - m, 'x']])} = ${neg(m * q - k * p)}. x = ${neg(x)}.`,
        [`Expand both brackets: ${ex([[k, 'x'], [k * p, '']])} = ${ex([[m, 'x'], [m * q, '']])}.`, `Collect x terms one side, numbers the other: ${ex([[k - m, 'x']])} = ${neg(m * q - k * p)}.`, `x = ${neg(x)}.`]);
    }
    const kind = rng.pick(['fractions', 'nonint', 'triangle', 'rectangle']);
    if (kind === 'fractions') {
      const b = rng.int(2, 6), d = rng.int(2, 6), a = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      if (b === d) return G.y8mEquations(level, rng);
      const c = ((x + a) * d) / b - x;
      if (!Number.isInteger(c) || c === 0) return G.y8mEquations(level, rng);
      return num(`Solve {{x${sgn(a).replace(' ', '')}/${b}}} = {{x${sgn(c).replace(' ', '')}/${d}}}`.replace(/\{\{x([+−]) /g, '{{x $1 '), x,
        `Cross-multiply: ${d}(x${sgn(a)}) = ${b}(x${sgn(c)}), so ${ex([[d, 'x'], [d * a, '']])} = ${ex([[b, 'x'], [b * c, '']])}, giving x = ${neg(x)}.`,
        [`Multiply both sides by ${b} × ${d} = ${b * d} (cross-multiplying).`, `${ex([[d, 'x'], [d * a, '']])} = ${ex([[b, 'x'], [b * c, '']])}.`, `${ex([[d - b, 'x']])} = ${neg(b * c - d * a)}, so x = ${neg(x)}.`]);
    }
    if (kind === 'nonint') {
      const a = rng.int(4, 9), c = rng.int(1, a - 1), b = rng.int(-9, 9), d = rng.int(-9, 9);
      const sol = F(d - b, a - c);
      if (sol.d === 1 || b === 0 || d === 0) return G.y8mEquations(level, rng);
      return fracQ(`Solve ${a}x${sgn(b)} = ${ex([[c, 'x']])}${sgn(d)}. Give x as a fraction.`, sol, `${a - c}x = ${neg(d - b)}, so x = ${tex(sol, true)}.`,
        [`Subtract ${ex([[c, 'x']])}: ${a - c}x${sgn(b)} = ${neg(d)}.`, `${b < 0 ? `Add ${-b}` : `Subtract ${b}`}: ${a - c}x = ${neg(d - b)}.`, `x = ${neg(d - b)}/${a - c} = ${tex(sol, true)}.`], { placeholder: 'e.g. 7/4' });
    }
    if (kind === 'triangle') {
      const p = rng.int(5, 30), q = rng.int(10, 40), xv = rng.int(20, 40);
      const third = 180 - xv - (2 * xv + p);
      const r = 3 * xv - third;
      if (third <= 0 || r <= 0 || r >= 3 * xv || r === p) return G.y8mEquations(level, rng);
      return num(`The angles of a triangle are x, 2x + ${p} and 3x − ${r} (in degrees). Find x.`, xv, `They add to 180: 6x${sgn(p - r)} = 180, so 6x = ${180 - p + r} and x = ${xv}.`,
        ['Angles in a triangle add up to 180°.', `x + 2x + ${p} + 3x − ${r} = 6x${sgn(p - r)} = 180.`, `6x = ${180 - p + r}, x = ${xv}.`], { unit: '°' });
    }
    const w = rng.int(3, 15), a = rng.int(2, 4), b = rng.pick([-2, -1, 1, 2, 3, 4, 5, 6]), c = rng.int(1, 9);
    if (b + c === 0) return G.y8mEquations(level, rng);
    const L = a * w + b, W = w + c, P = 2 * (L + W);
    return num(`A rectangular racing track at Olympia measures (${a}x${sgn(b)}) m by (x + ${c}) m. Its perimeter is ${P} m. Find x.`, w, `2(${a}x${sgn(b)} + x + ${c}) = ${P}, so ${2 * (a + 1)}x${sgn(2 * (b + c))} = ${P}, and x = ${w}.`,
      ['Perimeter = 2 × (length + width).', `2(${a + 1}x${sgn(b + c)}) = ${P}.`, `${a + 1}x${sgn(b + c)} = ${P / 2}, so x = ${w}.`]);
  },

  // ---- inequalities -------------------------------------------------------------------------
  y8mInequalities(level, rng) {
    const ascii = (s) => s.replace('≤', '<=').replace('≥', '>=');
    const flip = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' };
    const ans = (sym, k) => { const K = String(k); return { answer: `x ${sym} ${K}`, accept: [`x ${ascii(sym)} ${K}`, `${K} ${flip[sym]} x`, `${K} ${ascii(flip[sym])} x`] }; };
    const iq = (prompt, sym, k, explain, steps) => alg(prompt, ans(sym, k), explain, steps, { placeholder: 'e.g. x > 3 (type <= for ≤)' });
    if (level === 1) {
      if (rng.chance(0.6)) {
        const a = rng.int(2, 9), b = rng.pick([-12, -9, -7, -5, -3, -2, 1, 2, 4, 6, 8, 11, 15]), k = rng.int(-5, 9), sym = rng.pick(['<', '>', '≤', '≥']);
        return iq(`Solve ${a}x${sgn(b)} ${sym} ${neg(a * k + b)}`, sym, k, `Solve it like an equation: ${a}x ${sym} ${neg(a * k)}, so x ${sym} ${neg(k)}.`,
          [`${b < 0 ? `Add ${-b}` : `Subtract ${b}`} on both sides: ${a}x ${sym} ${neg(a * k)}.`, `Divide by ${a} (positive, so the sign stays).`, `x ${sym} ${neg(k)}.`]);
      }
      const lo = rng.int(-6, 2), hi = lo + rng.int(3, 8), s1 = rng.pick(['<', '≤']), s2 = rng.pick(['<', '≤']);
      const count = hi - lo + 1 - (s1 === '<' ? 1 : 0) - (s2 === '<' ? 1 : 0);
      const list = []; for (let n = lo; n <= hi; n++) if ((s1 === '≤' || n > lo) && (s2 === '≤' || n < hi)) list.push(neg(n));
      return num(`How many integers n satisfy ${neg(lo)} ${s1} n ${s2} ${neg(hi)}?`, count, `They are ${list.join(', ')}: ${count} integers. (${s1 === '<' ? `${neg(lo)} itself is not included` : `${neg(lo)} is included`}; ${s2 === '<' ? `${neg(hi)} is not` : `${neg(hi)} is`}.)`,
        ['< means “not including”; ≤ means “including”.', `List them: ${list.join(', ')}.`, `That is ${count}.`]);
    }
    if (level === 2) {
      if (rng.chance(0.5)) {
        const a = rng.int(2, 6), k = rng.int(-4, 8), c = rng.int(-10, 10), b = c + a * k, sym = rng.pick(['>', '<', '≥', '≤']);
        return iq(`Solve ${neg(b)} − ${a}x ${sym} ${neg(c)}`, flip[sym], k, `−${a}x ${sym} ${neg(c - b)}. Dividing by a NEGATIVE number reverses the sign: x ${flip[sym]} ${neg(k)}.`,
          [`${b < 0 ? `Add ${-b}` : `Subtract ${b}`}: −${a}x ${sym} ${neg(c - b)}.`, `Divide by −${a}: dividing by a negative flips the inequality.`, `x ${flip[sym]} ${neg(k)}.`]);
      }
      const a = rng.pick([2, 3, 4, 5]), b = rng.int(1, 7) * rng.pick([-1, 1]), L = rng.int(-5, 2), H = L + rng.int(2, 6);
      const count = H - L; // L < x ≤ H
      if (rng.chance(0.5)) {
        return alg(`Solve ${neg(a * L + b)} < ${a}x${sgn(b)} ≤ ${neg(a * H + b)}`, { answer: `${L} < x ≤ ${H}`, accept: [`${L} < x <= ${H}`, `${H} ≥ x > ${L}`, `${H} >= x > ${L}`] },
          `Do the same to all three parts: ${b < 0 ? `add ${-b}` : `subtract ${b}`}, then divide by ${a}: ${neg(L)} < x ≤ ${neg(H)}.`,
          [`${b < 0 ? `Add ${-b} to` : `Subtract ${b} from`} every part: ${neg(a * L)} < ${a}x ≤ ${neg(a * H)}.`, `Divide every part by ${a}.`, `${neg(L)} < x ≤ ${neg(H)}.`], { placeholder: 'e.g. -2 < x <= 4' });
      }
      return num(`How many integers satisfy ${neg(a * L + b)} < ${a}x${sgn(b)} ≤ ${neg(a * H + b)}?`, count, `It simplifies to ${neg(L)} < x ≤ ${neg(H)}, so the integers are ${neg(L + 1)} to ${neg(H)}: ${count} of them.`,
        [`${b < 0 ? `Add ${-b}` : `Subtract ${b}`}, then divide every part by ${a}.`, `${neg(L)} < x ≤ ${neg(H)}.`, `Integers from ${neg(L + 1)} to ${neg(H)}: ${count}.`]);
    }
    if (rng.chance(0.5)) {
      const a = rng.int(4, 9), c = rng.int(1, 3), k = rng.int(-3, 9), d = rng.pick([-9, -6, -4, -1, 2, 3, 5, 7, 9]), b = d + (c - a) * k, sym = rng.pick(['≥', '>', '≤']);
      if (b === 0) return G.y8mInequalities(level, rng);
      return iq(`Solve ${a}x${sgn(b)} ${sym} ${c === 1 ? '' : c}x${sgn(d)}`, sym, k, `${ex([[a - c, 'x']])} ${sym} ${neg(d - b)}, so x ${sym} ${neg(k)}.`,
        [`Subtract ${c === 1 ? '' : c}x from both sides: ${ex([[a - c, 'x']])}${sgn(b)} ${sym} ${neg(d)}.`, `${b < 0 ? `Add ${-b}` : `Subtract ${b}`}: ${ex([[a - c, 'x']])} ${sym} ${neg(d - b)}.`, a - c === 1 ? `So x ${sym} ${neg(k)}.` : `Divide by ${a - c}: x ${sym} ${neg(k)}.`]);
    }
    const M = rng.int(30, 120), a = rng.int(3, 9), f = rng.int(2, 9);
    const n = Math.floor((M - f) / a);
    return num(`Kit has £${M}. Arrows cost £${a} each, plus a one-off £${f} delivery charge. What is the greatest number of arrows Kit can buy?`, n,
      `${a}n + ${f} ≤ ${M}, so ${a}n ≤ ${M - f} and n ≤ ${M - f} ÷ ${a} ${quot(M - f, a)}. The greatest whole number is ${n}.`,
      [`Write an inequality: ${a}n + ${f} ≤ ${M}.`, `${a}n ≤ ${M - f}, so n ≤ ${M - f} ÷ ${a}.`, `Round DOWN (you cannot buy part of an arrow): ${n}.`]);
  },

  // ---- sequences ---------------------------------------------------------------------------
  y8mSequences(level, rng) {
    const d = rng.pick([-7, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]), c = rng.int(-10, 15);
    const t = (n) => d * n + c, five = [1, 2, 3, 4, 5].map((n) => neg(t(n))).join(', ');
    if (level === 1) {
      if (rng.chance(0.55)) {
        return alg(`Find the nth term of the sequence ${five}, …`, expr([[d, 'n'], [c, '']]), `It goes ${d > 0 ? 'up' : 'down'} by ${Math.abs(d)}, so it starts ${neg(d)}n. ${neg(d)} × 1 = ${neg(d)}, and the first term is ${neg(t(1))}, so add ${neg(c)}: ${ex([[d, 'n'], [c, '']])}.`,
          [`The difference between terms is ${neg(d)}, so the rule contains ${neg(d)}n.`, `When n = 1, ${neg(d)}n = ${neg(d)}; the first term is ${neg(t(1))}, so adjust by ${neg(c)}.`, `nth term = ${ex([[d, 'n'], [c, '']])}.`], { placeholder: 'e.g. 3n + 2' });
      }
      const k = rng.pick([20, 50, 100, 37, 64]);
      return num(`The nth term of a sequence is ${ex([[d, 'n'], [c, '']])}. What is the ${k}th term?`, t(k), `Substitute n = ${k}: ${neg(d)} × ${k}${sgn(c)} = ${neg(t(k))}.`, [`Replace n with ${k}.`, `${neg(d)} × ${k} = ${neg(d * k)}.`, `${neg(d * k)}${sgn(c)} = ${neg(t(k))}.`]);
    }
    if (level === 2) {
      const kind = rng.pick(['inseq', 'which', 'geometric']);
      if (kind === 'inseq') {
        const k = rng.int(12, 40), N = t(k) + (rng.chance(0.5) ? 0 : rng.pick([1, -1]));
        const yes = N === t(k);
        return choice(`Is ${neg(N)} a term in the sequence ${five}, …?`, yes ? `Yes: it is term ${k}` : 'No', yes ? ['No', `Yes: it is term ${k + 1}`] : [`Yes: it is term ${k}`, `Yes: it is term ${k + 1}`], rng, {
          explain: `Solve ${ex([[d, 'n'], [c, '']])} = ${neg(N)}: n ${quot(N - c, d)}. ${yes ? 'A whole number, so yes.' : 'Not a whole number, so no.'}`,
          steps: [`nth term: ${ex([[d, 'n'], [c, '']])}.`, `Set it equal to ${neg(N)} and solve for n.`, yes ? `n = ${k}, a whole number: yes, term ${k}.` : 'n is not a whole number, so it is not in the sequence.'],
        });
      }
      if (kind === 'which') {
        const k = rng.int(10, 60);
        return num(`The sequence ${five}, … continues. Which term is ${neg(t(k))}?`, k, `nth term ${ex([[d, 'n'], [c, '']])} = ${neg(t(k))}, so ${neg(d)}n = ${neg(t(k) - c)} and n = ${k}.`,
          [`Find the nth term: ${ex([[d, 'n'], [c, '']])}.`, `Solve ${ex([[d, 'n'], [c, '']])} = ${neg(t(k))}.`, `n = ${k}.`]);
      }
      const a = rng.int(1, 9), r = rng.pick([2, 3, -2, 5]);
      const terms = [0, 1, 2, 3].map((i) => a * r ** i);
      return num(`What is the next term? ${terms.map(neg).join(', ')}, …`, a * r ** 4, `Each term is multiplied by ${neg(r)} (a geometric sequence): ${neg(terms[3])} × ${paren(r)} = ${neg(a * r ** 4)}.`,
        ['Check the differences: they are not constant, so try ratios.', `Each term ÷ the one before = ${neg(r)}.`, `${neg(terms[3])} × ${paren(r)} = ${neg(a * r ** 4)}.`]);
    }
    const a = rng.pick([1, 1, 2, 3]), b = rng.int(-4, 5), cc = rng.int(-5, 8);
    const q = (n) => a * n * n + b * n + cc, six = [1, 2, 3, 4, 5].map((n) => neg(q(n)));
    if (rng.chance(0.5)) {
      const diffs = [1, 2, 3, 4].map((n) => q(n + 1) - q(n));
      return num(`What is the next term of this quadratic sequence? ${six.join(', ')}, …`, q(6), `First differences ${diffs.map(neg).join(', ')} go up by ${2 * a} each time. The next difference is ${neg(diffs[3] + 2 * a)}, so the next term is ${neg(q(6))}.`,
        [`First differences: ${diffs.map(neg).join(', ')}.`, `Second difference: ${2 * a} (constant, so it is quadratic).`, `Next difference ${neg(diffs[3] + 2 * a)}: ${neg(q(5))} + ${paren(diffs[3] + 2 * a)} = ${neg(q(6))}.`]);
    }
    const right = ex([[a, 'n²'], [b, 'n'], [cc, '']]);
    return choice(`Which is the nth term of ${six.join(', ')}, …?`, right, [ex([[a, 'n²'], [b + 1, 'n'], [cc - 1, '']]), ex([[2 * a, 'n²'], [b, 'n'], [cc - a, '']]), ex([[a, 'n²'], [cc, '']]), ex([[b === 0 ? 1 : b, 'n'], [cc + a, '']])], rng, {
      explain: `The second difference is ${2 * a}, so the sequence starts ${a === 1 ? '' : a}n². Subtract ${a === 1 ? '' : a}n² and what is left is ${ex([[b, 'n'], [cc, '']])}. Check n = 1: ${neg(q(1))}.`,
      steps: [`Second difference ${2 * a} ⇒ ${a === 1 ? '' : a}n² (half the second difference).`, `Sequence − ${a === 1 ? '' : a}n²: ${[1, 2, 3].map((n) => neg(b * n + cc)).join(', ')} is linear: ${ex([[b, 'n'], [cc, '']])}.`, `nth term = ${right}.`],
    });
  },

  // ---- straight-line graphs ----------------------------------------------------------------
  y8mGraphs(level, rng) {
    const m = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4, 5]), c = rng.int(-6, 8);
    const line = ex([[m, 'x'], [c, '']]);
    if (level === 1) {
      const kind = rng.pick(['gradient', 'intercept', 'onLine']);
      if (kind === 'gradient') return num(`What is the gradient of y = ${line}?`, m, `In y = mx + c, m is the gradient: ${neg(m)}.`, ['Compare with y = mx + c.', `m is the number in front of x: ${neg(m)}.`, `Gradient = ${neg(m)}${m < 0 ? ' (it slopes down)' : ''}.`]);
      if (kind === 'intercept') return num(`Where does y = ${line} cross the y-axis? Give the y-value.`, c, `On the y-axis x = 0, so y = ${neg(c)}. (That is c in y = mx + c.)`, ['Every point on the y-axis has x = 0.', `y = ${neg(m)} × 0${sgn(c)}.`, `y = ${neg(c)}.`]);
      const x0 = rng.int(-4, 5), y0 = m * x0 + c + (rng.chance(0.5) ? 0 : rng.pick([1, -2]));
      const on = y0 === m * x0 + c;
      return choice(`Does the point (${neg(x0)}, ${neg(y0)}) lie on the line y = ${line}?`, on ? 'Yes' : 'No', [on ? 'No' : 'Yes'], rng, {
        explain: `Substitute x = ${neg(x0)}: y = ${neg(m)} × ${paren(x0)}${sgn(c)} = ${neg(m * x0 + c)}. ${on ? 'That matches, so yes.' : `The point has y = ${neg(y0)}, so no.`}`,
        steps: ['A point is on a line if its coordinates fit the equation.', `x = ${neg(x0)} gives y = ${neg(m * x0 + c)}.`, on ? 'It matches: yes.' : `${neg(y0)} ≠ ${neg(m * x0 + c)}: no.`],
      });
    }
    if (level === 2) {
      const kind = rng.pick(['twopoints', 'rearranged', 'picture']);
      if (kind === 'twopoints') {
        const x1 = rng.int(-5, 4), y1 = rng.int(-6, 6), dx = rng.int(1, 6), dy = rng.int(-9, 9);
        const g = F(dy, dx);
        return fracQ(`What is the gradient of the line through (${neg(x1)}, ${neg(y1)}) and (${neg(x1 + dx)}, ${neg(y1 + dy)})?`, g, `Gradient = change in y ÷ change in x = ${neg(dy)} ÷ ${dx} = ${tex(g)}.`,
          ['Gradient = (change in y) ÷ (change in x).', `Change in y: ${neg(y1 + dy)} − ${paren(y1)} = ${neg(dy)}. Change in x: ${dx}.`, `${neg(dy)} ÷ ${dx} = ${tex(g)}.`], { placeholder: 'e.g. 3 or -1/2' });
      }
      if (kind === 'rearranged') {
        const [eq, g, how] = rng.pick([
          [`2y = ${ex([[2 * m, 'x'], [2 * c, '']])}`, F(m), `Divide by 2: y = ${line}.`],
          [`x + y = ${neg(c)}`, F(-1), `Subtract x: y = −x${sgn(c)}.`],
          [`2x + 3y = 12`, F(-2, 3), 'Subtract 2x and divide by 3: y = −{{2/3}}x + 4.'],
          [`4x − 2y = 6`, F(2), 'Rearrange: 2y = 4x − 6, so y = 2x − 3.'],
          [`3y = x + 9`, F(1, 3), 'Divide by 3: y = {{1/3}}x + 3.'],
        ]);
        return fracQ(`What is the gradient of the line ${eq}?`, g, `Rearrange into y = mx + c. ${how} The gradient is ${tex(g)}.`, ['Get y on its own: y = mx + c.', how, `The gradient is the coefficient of x: ${tex(g)}.`], { placeholder: 'e.g. 3 or -1/2' });
      }
      const mm = rng.pick([-3, -2, -1, 1, 2, 3]), cc = rng.int(-3, 3);
      const right = `y = ${ex([[mm, 'x'], [cc, '']])}`;
      return choice('Which is the equation of this line?', right, [`y = ${ex([[-mm, 'x'], [cc, '']])}`, `y = ${ex([[mm, 'x'], [cc === 0 ? 2 : -cc, '']])}`, `y = ${ex([[cc === 0 ? mm + 1 : cc, 'x'], [mm, '']])}`], rng, {
        explain: `It crosses the y-axis at ${neg(cc)} and goes ${mm > 0 ? 'up' : 'down'} ${Math.abs(mm)} for every 1 across: ${right}.`,
        steps: [`Where does it cross the y-axis? At y = ${neg(cc)}: that is c.`, `For each step right, it goes ${mm > 0 ? 'up' : 'down'} ${Math.abs(mm)}: the gradient is ${neg(mm)}.`, `${right}.`],
        diagram: { type: 'graph', range: [-6, 6], lines: [{ m: mm, c: cc }] },
      });
    }
    const kind = rng.pick(['parallel', 'perpendicular', 'intersect', 'midpoint']);
    if (kind === 'parallel') {
      const x0 = rng.int(-4, 5), y0 = rng.int(-8, 10);
      return num(`A line is parallel to y = ${line} and passes through (${neg(x0)}, ${neg(y0)}). Its equation is y = ${m === 1 ? '' : m === -1 ? '−' : neg(m)}x + c. Find c.`, y0 - m * x0,
        `Parallel lines have the same gradient, ${neg(m)}. Substitute the point: ${neg(y0)} = ${neg(m)} × ${paren(x0)} + c, so c = ${neg(y0 - m * x0)}.`,
        [`Same gradient: ${neg(m)}.`, `${neg(y0)} = ${neg(m * x0)} + c.`, `c = ${neg(y0 - m * x0)}.`]);
    }
    if (kind === 'perpendicular') {
      const g = rng.pick([F(2), F(3), F(-4), F(1, 2), F(-2, 3), F(5), F(-1, 3)]);
      const p = F(-g.d, g.n);
      return fracQ(`What is the gradient of a line perpendicular to one with gradient ${tex(g)}?`, p, `Perpendicular gradients multiply to −1: the negative reciprocal of ${tex(g)} is ${tex(p)}.`,
        ['Perpendicular means at right angles.', 'Their gradients multiply to −1, so flip the fraction and change the sign.', `${tex(p)}.`], { placeholder: 'e.g. -1/2' });
    }
    if (kind === 'intersect') {
      const X = rng.int(-4, 5), m1 = rng.pick([1, 2, 3, -1]), m2 = rng.pick([-3, -2, -1, 4]), c1 = rng.int(-5, 6);
      if (m1 === m2) return G.y8mGraphs(level, rng);
      const Y = m1 * X + c1, c2 = Y - m2 * X;
      return pairQ(`Where do the lines y = ${ex([[m1, 'x'], [c1, '']])} and y = ${ex([[m2, 'x'], [c2, '']])} cross?`, [X, Y], `Set them equal: ${ex([[m1, 'x'], [c1, '']])} = ${ex([[m2, 'x'], [c2, '']])}, so x = ${neg(X)} and y = ${neg(Y)}.`,
        ['Where lines cross, their y-values are equal.', `${neg(m1 - m2)}x = ${neg(c2 - c1)}, so x = ${neg(X)}.`, `y = ${neg(m1)} × ${paren(X)}${sgn(c1)} = ${neg(Y)}: (${neg(X)}, ${neg(Y)}).`]);
    }
    const x1 = rng.int(-6, 4), y1 = rng.int(-6, 6), x2 = x1 + 2 * rng.int(1, 4), y2 = y1 + 2 * rng.int(-4, 4);
    return pairQ(`What is the midpoint of (${neg(x1)}, ${neg(y1)}) and (${neg(x2)}, ${neg(y2)})?`, [(x1 + x2) / 2, (y1 + y2) / 2], `Average the x-values and the y-values: (${neg((x1 + x2) / 2)}, ${neg((y1 + y2) / 2)}).`,
      ['The midpoint is halfway: average each coordinate.', `x: (${neg(x1)} + ${paren(x2)}) ÷ 2 = ${neg((x1 + x2) / 2)}. y: (${neg(y1)} + ${paren(y2)}) ÷ 2 = ${neg((y1 + y2) / 2)}.`, `(${neg((x1 + x2) / 2)}, ${neg((y1 + y2) / 2)}).`]);
  },

  // ---- angles: polygons and parallel lines ----------------------------------------------------
  y8mAngles(level, rng) {
    if (level === 1) {
      const n = rng.pick([5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 36]);
      const kind = rng.pick(['interior', 'exterior', 'sum', 'sides']);
      if (kind === 'sum') { const k = rng.int(5, 14); return num(`What do the interior angles of ${an(k)} ${k}-sided polygon add up to?`, (k - 2) * 180, `It splits into ${k - 2} triangles from one corner: ${k - 2} × 180° = ${(k - 2) * 180}°.`, ['From one vertex, draw diagonals: they make (n − 2) triangles.', `${k} − 2 = ${k - 2} triangles.`, `${k - 2} × 180° = ${(k - 2) * 180}°.`], { unit: '°' }); }
      if (kind === 'exterior') return num(`What is each exterior angle of a regular ${n}-sided polygon?`, 360 / n, `Exterior angles add up to 360°: 360 ÷ ${n} = ${360 / n}°.`, ['Walking round any polygon you turn 360° in total.', `There are ${n} equal turns.`, `360 ÷ ${n} = ${360 / n}°.`], { unit: '°' });
      if (kind === 'sides') return num(`Each exterior angle of a regular polygon is ${360 / n}°. How many sides does it have?`, n, `360 ÷ ${360 / n} = ${n} sides.`, ['The exterior angles add up to 360°.', `Number of sides = 360 ÷ ${360 / n}.`, `${n}.`]);
      return num(`What is each interior angle of a regular ${n}-sided polygon?`, 180 - 360 / n, `Exterior angle 360 ÷ ${n} = ${360 / n}°, so interior = 180 − ${360 / n} = ${180 - 360 / n}°.`, [`Exterior angle: 360 ÷ ${n} = ${360 / n}°.`, 'Interior and exterior angles sit on a straight line: they add to 180°.', `180 − ${360 / n} = ${180 - 360 / n}°.`], { unit: '°' });
    }
    if (level === 2) {
      const kind = rng.pick(['corresponding', 'alternate', 'cointerior', 'isosceles']);
      if (kind === 'isosceles') {
        const apex = rng.int(10, 80) * 2;
        if (rng.chance(0.5)) return num(`An isosceles triangle has a top angle of ${apex}°. What is each of the two equal angles?`, (180 - apex) / 2, `(180 − ${apex}) ÷ 2 = ${(180 - apex) / 2}°.`, ['The two base angles are equal.', `They share 180 − ${apex} = ${180 - apex}°.`, `${180 - apex} ÷ 2 = ${(180 - apex) / 2}°.`], { unit: '°' });
        const base = (180 - apex) / 2;
        return num(`An isosceles triangle has two equal angles of ${base}°. What is the third angle?`, apex, `180 − 2 × ${base} = ${apex}°.`, ['Two angles are each ' + base + '°.', `2 × ${base} = ${2 * base}.`, `180 − ${2 * base} = ${apex}°.`], { unit: '°' });
      }
      const x = rng.int(12, 40), a = rng.int(2, 4), b = rng.int(5, 6), p = rng.int(5, 40);
      if (kind === 'cointerior') {
        const q = 180 - (a + b) * x - p;
        if (q < -60 || q > 60 || q === 0) return G.y8mAngles(level, rng);
        return num(`Two co-interior (allied) angles between parallel lines are (${a}x + ${p})° and (${b}x${sgn(q)})°. Find x.`, x, `Co-interior angles add up to 180°: ${a + b}x${sgn(p + q)} = 180, so x = ${x}.`,
          ['Co-interior angles (a C shape) add up to 180°.', `${a}x + ${p} + ${b}x${sgn(q)} = ${a + b}x${sgn(p + q)} = 180.`, `${a + b}x = ${180 - p - q}, x = ${x}.`]);
      }
      const q = a * x + p - b * x;
      if (q === 0) return G.y8mAngles(level, rng);
      return num(`Two ${kind} angles between parallel lines are (${a}x + ${p})° and (${b}x${sgn(q)})°. Find x.`, x, `${kind === 'corresponding' ? 'Corresponding (F)' : 'Alternate (Z)'} angles are equal: ${a}x + ${p} = ${b}x${sgn(q)}, so x = ${x}.`,
        [`${kind === 'corresponding' ? 'Corresponding angles (an F shape)' : 'Alternate angles (a Z shape)'} are equal.`, `${a}x + ${p} = ${b}x${sgn(q)}.`, b - a === 1 ? `Subtract ${a}x from both sides: x${sgn(q)} = ${p}, so x = ${p}${sgn(-q)} = ${x}.` : `Subtract ${a}x from both sides: ${b - a}x${sgn(q)} = ${p}, so ${b - a}x = ${p - q} and x = ${x}.`]);
    }
    const kind = rng.pick(['ratio', 'pentagon', 'possible']);
    if (kind === 'ratio') {
      const k = rng.pick([2, 3, 4, 5, 8, 9, 11]), e = 180 / (k + 1), n = 360 / e;
      return num(`Each interior angle of a regular polygon is ${k} times its exterior angle. How many sides does it have?`, n, `Interior + exterior = 180, and interior = ${k} × exterior, so ${k + 1} × exterior = 180: exterior = ${e}°, sides = 360 ÷ ${e} = ${n}.`,
        [`Let the exterior angle be e. Then ${k}e + e = 180.`, `${k + 1}e = 180, e = ${e}°.`, `Sides = 360 ÷ ${e} = ${n}.`]);
    }
    if (kind === 'pentagon') {
      const x = rng.int(56, 75), p = rng.int(10, 40);
      const fifth = 540 - (x + 2 * x + (x + p) + 2 * x);
      if (fifth <= 0 || fifth >= 180) return G.y8mAngles(level, rng);
      const r = 3 * x - fifth;
      if (r <= 0 || r === p) return G.y8mAngles(level, rng);
      return num(`A pentagon has angles x, 2x, x + ${p}, 2x and 3x − ${r} (in degrees). Find x.`, x, `Pentagon angles add up to 540°: 9x${sgn(p - r)} = 540, so x = ${x}.`,
        ['A pentagon splits into 3 triangles: 3 × 180 = 540°.', `x + 2x + x + ${p} + 2x + 3x − ${r} = 9x${sgn(p - r)}.`, `9x = ${540 - p + r}, x = ${x}.`], { unit: '°' });
    }
    const a = rng.pick([25, 35, 40, 50, 70, 80, 14, 16]), ok = 360 % a === 0;
    return choice(`Can a regular polygon have an exterior angle of ${a}°?`, ok ? `Yes: it has ${360 / a} sides` : 'No', ok ? ['No', `Yes: it has ${360 / a + 1} sides`] : [`Yes: it has ${Math.round(360 / a)} sides`, `Yes: it has ${Math.round(360 / a) + 1} sides`], rng, {
      explain: `The number of sides would be 360 ÷ ${a} ${quot(360, a)}. ${ok ? 'That is a whole number, so yes.' : 'That is not a whole number, so no.'}`,
      steps: ['Exterior angles of a regular polygon are 360 ÷ (number of sides).', `360 ÷ ${a} ${quot(360, a)}.`, ok ? 'A whole number: yes.' : 'Not a whole number: impossible.'],
    });
  },

  // ---- area: trapezia, circles, compound shapes --------------------------------------------
  y8mArea(level, rng) {
    if (level === 1) {
      if (rng.chance(0.55)) {
        const a = rng.int(3, 12), b = a + rng.int(2, 9);
        let h = rng.int(2, 12);
        if (((a + b) * h) % 2) h += 1;
        const A = ((a + b) * h) / 2;
        if (!Number.isInteger(A)) return G.y8mArea(level, rng);
        return num('What is the area of this trapezium?', A, `Area = ½(a + b)h = ½ × (${a} + ${b}) × ${h} = ${A} cm².`, ['Add the parallel sides.', `${a} + ${b} = ${a + b}; × ${h} = ${(a + b) * h}.`, `Halve it: ${A} cm².`], { unit: 'cm²', diagram: { type: 'trap', a, b, h } });
      }
      const b = rng.int(4, 16), h = rng.int(3, 12);
      if (rng.chance(0.5)) return num('What is the area of this parallelogram?', b * h, `Base × perpendicular height = ${b} × ${h} = ${b * h} cm². (The slanted side is a trap: ignore it.)`, ['Use the PERPENDICULAR height, not the slanted side.', `${b} × ${h}.`, `= ${b * h} cm².`], { unit: 'cm²', diagram: { type: 'para', b, h, s: h + 2 } });
      if ((b * h) % 2) return G.y8mArea(level, rng);
      return num('What is the area of this triangle?', (b * h) / 2, `½ × base × height = ½ × ${b} × ${h} = ${(b * h) / 2} cm².`, ['A triangle is half a rectangle.', `${b} × ${h} = ${b * h}.`, `Half: ${(b * h) / 2} cm².`], { unit: 'cm²', diagram: { type: 'tri', b, h, s: h + 3 } });
    }
    if (level === 2) {
      const r = rng.int(2, 15), useD = rng.chance(0.4), kind = rng.pick(['area', 'circ', 'pi']);
      const given = useD ? `diameter ${2 * r} cm` : `radius ${r} cm`;
      if (kind === 'area') return num(`Archimedes draws a circle with ${given}. Using π = 3.14, what is its area?`, dp(314 * r * r, 2), `A = πr² = 3.14 × ${r}² = 3.14 × ${r * r} = ${dp(314 * r * r, 2)} cm².${useD ? ` (Halve the diameter first: r = ${r}.)` : ''}`,
        [useD ? `Radius = half the diameter = ${r} cm.` : 'Area = πr².', `r² = ${r * r}.`, `3.14 × ${r * r} = ${dp(314 * r * r, 2)} cm².`], { unit: 'cm²' });
      if (kind === 'circ') return num(`A circular shield has ${given}. Using π = 3.14, what is its circumference?`, dp(628 * r, 2), `C = πd = 3.14 × ${2 * r} = ${dp(628 * r, 2)} cm.`,
        ['Circumference = π × diameter.', `d = ${2 * r} cm.`, `3.14 × ${2 * r} = ${dp(628 * r, 2)} cm.`], { unit: 'cm' });
      return choice(`What is the area of a circle with ${given}, in terms of π?`, `${r * r}π cm²`, [`${2 * r}π cm²`, `${4 * r * r}π cm²`, `${r}π cm²`], rng, {
        explain: `A = πr² = π × ${r}² = ${r * r}π cm².${useD ? ' (Use the radius, not the diameter.)' : ''}`, steps: [`r = ${r}.`, `r² = ${r * r}.`, `Area = ${r * r}π cm².`],
      });
    }
    const kind = rng.pick(['semicircle', 'annulus', 'reverse', 'semiperim']);
    if (kind === 'semicircle') {
      const w = 2 * rng.int(2, 8), h = rng.int(4, 15), r = w / 2;
      const A = w * h * 100 + 157 * r * r;
      return num(`A temple doorway is ${an(w)} ${w} m by ${h} m rectangle with a semicircle on top (its diameter is the ${w} m width). Using π = 3.14, what is the total area?`, dp(A, 2),
        `Rectangle ${w * h} m². Semicircle ½ × 3.14 × ${r}² = ${dp(157 * r * r, 2)} m². Total ${dp(A, 2)} m².`,
        [`Rectangle: ${w} × ${h} = ${w * h} m².`, `Semicircle radius ${r}: ½ × 3.14 × ${r * r} = ${dp(157 * r * r, 2)} m².`, `Total: ${dp(A, 2)} m².`], { unit: 'm²' });
    }
    if (kind === 'annulus') {
      const R = rng.int(5, 15), r = rng.int(2, R - 2);
      return num(`A bronze ring has outer radius ${R} cm and inner radius ${r} cm. Its area is kπ cm². What is k?`, R * R - r * r, `Big circle minus small circle: π × ${R}² − π × ${r}² = (${R * R} − ${r * r})π = ${R * R - r * r}π.`,
        [`Outer circle: ${R * R}π.`, `Inner circle: ${r * r}π.`, `Ring: ${R * R - r * r}π, so k = ${R * R - r * r}.`]);
    }
    if (kind === 'reverse') {
      const d = rng.int(3, 30);
      return num(`A circle has circumference ${dp(314 * d, 2)} cm. Using π = 3.14, what is its diameter?`, d, `C = πd, so d = C ÷ π = ${dp(314 * d, 2)} ÷ 3.14 = ${d} cm.`, ['C = π × d.', 'Rearrange: d = C ÷ π.', `${dp(314 * d, 2)} ÷ 3.14 = ${d} cm.`], { unit: 'cm' });
    }
    const r = rng.int(2, 12);
    return num(`What is the perimeter of a semicircle of radius ${r} cm? Use π = 3.14.`, dp(514 * r, 2), `Curved part ½ × 3.14 × ${2 * r} = ${dp(314 * r, 2)} cm, plus the straight diameter ${2 * r} cm: ${dp(514 * r, 2)} cm.`,
      [`Half the circumference: ½ × π × ${2 * r} = ${dp(314 * r, 2)} cm.`, `Don’t forget the straight edge: the diameter, ${2 * r} cm.`, `Total ${dp(514 * r, 2)} cm.`], { unit: 'cm' });
  },

  // ---- volume and surface area ----------------------------------------------------------------
  y8mVolume(level, rng) {
    if (level === 1) {
      const l = rng.int(3, 15), w = rng.int(2, 10), h = rng.int(2, 12);
      if (rng.chance(0.35)) return num('What is the volume of this cuboid?', l * w * h, `Length × width × height = ${l} × ${w} × ${h} = ${l * w * h} cm³.`, ['Volume of a cuboid = l × w × h.', `${l} × ${w} = ${l * w}.`, `× ${h} = ${l * w * h} cm³.`], { unit: 'cm³', diagram: { type: 'cuboid', l, w, h } });
      if (rng.chance(0.5)) return num('What is the total surface area of this cuboid?', 2 * (l * w + l * h + w * h), `Three pairs of faces: 2 × (${l * w} + ${l * h} + ${w * h}) = ${2 * (l * w + l * h + w * h)} cm².`, ['A cuboid has 6 faces in 3 matching pairs.', `${l} × ${w} = ${l * w}, ${l} × ${h} = ${l * h}, ${w} × ${h} = ${w * h}.`, `2 × ${l * w + l * h + w * h} = ${2 * (l * w + l * h + w * h)} cm².`], { unit: 'cm²', diagram: { type: 'cuboid', l, w, h } });
      const b = 2 * rng.int(2, 6), th = rng.int(2, 9), L = rng.int(5, 20);
      return num(`A triangular prism has a triangular end with base ${b} cm and height ${th} cm. It is ${L} cm long. What is its volume?`, (b * th * L) / 2, `Volume = area of cross-section × length = ½ × ${b} × ${th} × ${L} = ${(b * th * L) / 2} cm³.`,
        ['Any prism: area of the cross-section × length.', `Triangle: ½ × ${b} × ${th} = ${(b * th) / 2} cm².`, `× ${L} = ${(b * th * L) / 2} cm³.`], { unit: 'cm³' });
    }
    if (level === 2) {
      const r = rng.int(2, 10), h = rng.int(3, 20), kind = rng.pick(['pi', 'num', 'trap']);
      if (kind === 'num') return num(`A cylindrical column has radius ${r} cm and height ${h} cm. Using π = 3.14, what is its volume?`, dp(314 * r * r * h, 2), `V = πr²h = 3.14 × ${r * r} × ${h} = ${dp(314 * r * r * h, 2)} cm³.`,
        ['A cylinder is a prism with a circular cross-section.', `Circle area: 3.14 × ${r}² = ${dp(314 * r * r, 2)} cm².`, `× ${h} = ${dp(314 * r * r * h, 2)} cm³.`], { unit: 'cm³' });
      if (kind === 'pi') return num(`A cylinder has radius ${r} cm and height ${h} cm. Its volume is kπ cm³. What is k?`, r * r * h, `V = πr²h = π × ${r * r} × ${h} = ${r * r * h}π.`, ['Volume = πr²h.', `r² = ${r * r}.`, `${r * r} × ${h} = ${r * r * h}, so k = ${r * r * h}.`]);
      const a = rng.int(2, 8), b = a + 2 * rng.int(1, 4), th = rng.int(2, 6), L = rng.int(4, 15);
      return num(`A prism has a trapezium cross-section with parallel sides ${a} cm and ${b} cm, ${th} cm apart. It is ${L} cm long. What is its volume?`, ((a + b) * th * L) / 2, `Cross-section ½ × (${a} + ${b}) × ${th} = ${((a + b) * th) / 2} cm²; × ${L} = ${((a + b) * th * L) / 2} cm³.`,
        ['Prism volume = cross-section × length.', `Trapezium: ½(${a} + ${b}) × ${th} = ${((a + b) * th) / 2} cm².`, `× ${L} = ${((a + b) * th * L) / 2} cm³.`], { unit: 'cm³' });
    }
    const kind = rng.pick(['height', 'litres', 'surface']);
    if (kind === 'height') {
      const r = rng.int(2, 8), h = rng.int(2, 15);
      return num(`A cylindrical jar has volume ${r * r * h}π cm³ and radius ${r} cm. How tall is it?`, h, `V = πr²h, so ${r * r * h}π = π × ${r * r} × h and h = ${r * r * h} ÷ ${r * r} = ${h} cm.`, ['Write the formula: V = πr²h.', `${r * r * h}π = ${r * r}πh.`, `h = ${h} cm.`], { unit: 'cm' });
    }
    if (kind === 'litres') {
      const l = rng.int(2, 12) * 10, w = rng.int(2, 8) * 10, h = rng.int(1, 9) * 10;
      const V = l * w * h;
      return num(`A water tank for the Argo is a cuboid ${l} cm × ${w} cm × ${h} cm. How many litres does it hold? (1 litre = 1000 cm³)`, dp(V, 3), `${l} × ${w} × ${h} = ${comma(V)} cm³; ÷ 1000 = ${dp(V, 3)} litres.`,
        [`Volume = ${comma(V)} cm³.`, '1 litre = 1000 cm³.', `${comma(V)} ÷ 1000 = ${dp(V, 3)} litres.`], { unit: 'litres' });
    }
    const r = rng.int(2, 9), h = rng.int(2, 12);
    return num(`A closed cylinder has radius ${r} cm and height ${h} cm. Its total surface area is kπ cm². What is k?`, 2 * r * r + 2 * r * h, `Two circles 2πr² = ${2 * r * r}π, plus the curved side 2πrh = ${2 * r * h}π. Total ${2 * r * r + 2 * r * h}π.`,
      ['Unroll the cylinder: two circles and a rectangle.', `Circles: 2 × π × ${r}² = ${2 * r * r}π. Rectangle: 2π × ${r} × ${h} = ${2 * r * h}π.`, `k = ${2 * r * r + 2 * r * h}.`]);
  },

  // ---- transformations, bearings and scale ----------------------------------------------------
  y8mTransform(level, rng) {
    const x = rng.int(-6, 6), y = rng.int(-6, 6);
    if (x === 0 || y === 0 || x === y) return G.y8mTransform(level, rng);
    const P = `(${neg(x)}, ${neg(y)})`;
    if (level === 1) {
      const kind = rng.pick(['reflectX', 'reflectY', 'bearing', 'translate']);
      if (kind === 'bearing') {
        const b = rng.pick([20, 45, 70, 110, 135, 160, 200, 230, 255, 300, 315, 340]), back = (b + 180) % 360;
        const pad = (v) => String(v).padStart(3, '0');
        return num(`Delphi is on a bearing of ${pad(b)}° from Athens. What is the bearing of Athens from Delphi?`, back, `A back bearing differs by 180°: ${pad(b)} ${b < 180 ? '+' : '−'} 180 = ${pad(back)}°.`,
          ['Bearings are measured clockwise from north, with three figures.', 'Turning round to look back changes the bearing by 180°.', `${pad(b)} ${b < 180 ? '+' : '−'} 180 = ${pad(back)}°.`], { unit: '°' });
      }
      if (kind === 'translate') {
        const dx = rng.int(-5, 5), dy = rng.int(-5, 5);
        if (!dx || !dy) return G.y8mTransform(level, rng);
        return pairQ(`Point P${P} is translated ${Math.abs(dx)} ${dx > 0 ? 'right' : 'left'} and ${Math.abs(dy)} ${dy > 0 ? 'up' : 'down'}. Where does it land?`, [x + dx, y + dy], `Add ${neg(dx)} to x and ${neg(dy)} to y: (${neg(x + dx)}, ${neg(y + dy)}).`, [`x: ${neg(x)} + ${paren(dx)} = ${neg(x + dx)}.`, `y: ${neg(y)} + ${paren(dy)} = ${neg(y + dy)}.`, `(${neg(x + dx)}, ${neg(y + dy)}).`]);
      }
      const a = rng.int(-3, 3);
      if (kind === 'reflectX') return pairQ(`Reflect P${P} in the line x = ${neg(a)}.`, [2 * a - x, y], `P is ${Math.abs(x - a)} ${x > a ? 'right' : 'left'} of the mirror line x = ${neg(a)}, so its image is the same distance on the other side: (${neg(2 * a - x)}, ${neg(y)}).`,
        ['x = a is a vertical line, so y stays the same.', `Distance from the mirror: ${Math.abs(x - a)}.`, `Image: (${neg(2 * a - x)}, ${neg(y)}).`]);
      return pairQ(`Reflect P${P} in the line y = ${neg(a)}.`, [x, 2 * a - y], `y = ${neg(a)} is horizontal; P is ${Math.abs(y - a)} ${y > a ? 'above' : 'below'} it, so the image is (${neg(x)}, ${neg(2 * a - y)}).`,
        ['y = a is a horizontal line, so x stays the same.', `Distance from the mirror: ${Math.abs(y - a)}.`, `Image: (${neg(x)}, ${neg(2 * a - y)}).`]);
    }
    if (level === 2) {
      const kind = rng.pick(['rot90c', 'rot90a', 'rot180', 'yx', 'scale']);
      if (kind === 'scale') {
        const s = rng.pick([10000, 25000, 50000, 200000]), d = rng.int(2, 15);
        return num(`On a map of Crete with scale 1 : ${comma(s)}, the distance from Knossos to the coast is ${d} cm. What is the real distance in km?`, dp(d * s, 5),
          `${d} cm × ${comma(s)} = ${comma(d * s)} cm. 100 000 cm = 1 km, so ${dp(d * s, 5)} km.`, [`Real distance: ${d} × ${comma(s)} = ${comma(d * s)} cm.`, '1 km = 1000 m = 100 000 cm.', `${comma(d * s)} ÷ 100 000 = ${dp(d * s, 5)} km.`], { unit: 'km' });
      }
      const map = { rot90c: [[y, -x], '90° clockwise about the origin', '(x, y) → (y, −x)'], rot90a: [[-y, x], '90° anticlockwise about the origin', '(x, y) → (−y, x)'], rot180: [[-x, -y], '180° about the origin', '(x, y) → (−x, −y)'], yx: [[y, x], null, '(x, y) → (y, x)'] };
      const [R, how, rule] = map[kind];
      return pairQ(kind === 'yx' ? `Reflect P${P} in the line y = x.` : `Rotate P${P} ${how}.`, R, `${rule}, so the image is (${neg(R[0])}, ${neg(R[1])}).`,
        [kind === 'yx' ? 'Reflecting in y = x swaps the coordinates.' : 'Try it with tracing paper, or use the rule.', `The rule is ${rule}.`, `(${neg(R[0])}, ${neg(R[1])}).`]);
    }
    const kind = rng.pick(['enlarge', 'enlargeC', 'areaSF']);
    if (kind === 'areaSF') {
      const k = rng.int(2, 5), A = rng.int(3, 20);
      return num(`A shape with area ${A} cm² is enlarged by scale factor ${k}. What is the area of the image?`, A * k * k, `Lengths are multiplied by ${k}, so areas are multiplied by ${k}² = ${k * k}: ${A * k * k} cm².`,
        [`Every length × ${k}.`, `Area is length × length, so it scales by ${k} × ${k} = ${k * k}.`, `${A} × ${k * k} = ${A * k * k} cm².`], { unit: 'cm²' });
    }
    if (kind === 'enlarge') {
      const k = rng.pick([2, 3, 0.5]);
      if (k === 0.5 && (x % 2 || y % 2)) return G.y8mTransform(level, rng);
      const R = [x * k, y * k];
      return pairQ(`P${P} is enlarged by scale factor ${k === 0.5 ? '½' : k}, centre the origin. Where is its image?`, R, `Multiply both coordinates by ${k === 0.5 ? '½' : k}: (${neg(R[0])}, ${neg(R[1])}).`,
        ['From the origin, every distance is multiplied by the scale factor.', `x: ${neg(x)} × ${k === 0.5 ? '½' : k} = ${neg(R[0])}; y: ${neg(y)} × ${k === 0.5 ? '½' : k} = ${neg(R[1])}.`, `(${neg(R[0])}, ${neg(R[1])}).`]);
    }
    const cx = rng.int(-3, 3), cy = rng.int(-3, 3), k = rng.pick([2, 3]);
    const R = [cx + k * (x - cx), cy + k * (y - cy)];
    const move = (h, v) => `${Math.abs(h)} ${h < 0 ? 'left' : 'right'}, ${Math.abs(v)} ${v < 0 ? 'down' : 'up'}`;
    if (Math.abs(R[0]) > 20 || Math.abs(R[1]) > 20) return G.y8mTransform(level, rng);
    return pairQ(`P${P} is enlarged by scale factor ${k} with centre (${neg(cx)}, ${neg(cy)}). Where is its image?`, R, `From the centre to P is (${neg(x - cx)}, ${neg(y - cy)}). Multiply by ${k}: (${neg(k * (x - cx))}, ${neg(k * (y - cy))}). Add to the centre: (${neg(R[0])}, ${neg(R[1])}).`,
      [`Vector from the centre to P: ${move(x - cx, y - cy)}.`, `× ${k}: ${move(k * (x - cx), k * (y - cy))}.`, `From the centre: (${neg(R[0])}, ${neg(R[1])}).`]);
  },

  // ---- probability ---------------------------------------------------------------------------
  y8mProbability(level, rng) {
    if (level === 1) {
      const kind = rng.pick(['not', 'expected', 'bag']);
      if (kind === 'not') {
        const p = rng.int(3, 97);
        return num(`The probability that the Oracle gives a clear answer is ${dp(p, 2)}. What is the probability that she does NOT?`, dp(100 - p, 2), `Probabilities of “happens” and “doesn’t happen” add up to 1: 1 − ${dp(p, 2)} = ${dp(100 - p, 2)}.`,
          ['P(not A) = 1 − P(A).', `1 − ${dp(p, 2)}.`, `= ${dp(100 - p, 2)}.`]);
      }
      if (kind === 'expected') {
        const d = rng.pick([4, 5, 8, 10, 20]), n = rng.int(1, d - 1), T = d * rng.int(5, 40);
        return num(`The probability a hero’s arrow hits the target is ${tex(F(n, d))}. In ${T} shots, how many hits would you expect?`, (T * F(n, d).n) / F(n, d).d, `Expected = probability × trials = ${tex(F(n, d))} × ${T} = ${(T * F(n, d).n) / F(n, d).d}.`,
          ['Expected frequency = probability × number of trials.', `${tex(F(n, d))} × ${T}.`, `= ${(T * F(n, d).n) / F(n, d).d}.`]);
      }
      const r = rng.int(1, 9), b = rng.int(1, 9), g = rng.int(1, 9), T = r + b + g, col = rng.pick([['red', r], ['blue', b], ['green', g]]);
      return fracQ(`A bag holds ${r} red, ${b} blue and ${g} green gems. One is picked at random. What is the probability it is ${col[0]}?`, F(col[1], T), `${col[1]} of the ${T} gems are ${col[0]}: ${tex(F(col[1], T))}.`, [`Total gems: ${T}.`, `${col[0]}: ${col[1]}.`, `P = ${col[1]}/${T}${gcd(col[1], T) > 1 ? ` = ${tex(F(col[1], T))}` : ''}.`]);
    }
    if (level === 2) {
      const kind = rng.pick(['dice', 'table', 'relfreq']);
      if (kind === 'dice') {
        const s = rng.int(3, 11), over = rng.chance(0.4);
        let count = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (over ? a + b > s : a + b === s) count++;
        return fracQ(`Two fair dice are rolled and the scores added. What is the probability the total is ${over ? `more than ${s}` : s}?`, F(count, 36), `There are 36 equally likely outcomes; ${count} of them give ${over ? `more than ${s}` : `a total of ${s}`}: ${tex(F(count, 36))}.`,
          ['Draw a 6 × 6 sample space: 36 outcomes.', `Count the outcomes that work: ${count}.`, `${count}/36${gcd(count, 36) > 1 ? ` = ${tex(F(count, 36))}` : ''}.`]);
      }
      if (kind === 'table') {
        const a = rng.int(5, 30), b = rng.int(5, 30), rest = 100 - a - b;
        if (rest < 10 || rest % 2) return G.y8mProbability(level, rng);
        return num(`A spinner lands on gold with probability ${dp(a, 2)}, silver with probability ${dp(b, 2)}, and on bronze and copper with equal probability x. Find x.`, dp(rest / 2, 2),
          `All the probabilities add to 1: ${dp(a, 2)} + ${dp(b, 2)} + 2x = 1, so 2x = ${dp(rest, 2)} and x = ${dp(rest / 2, 2)}.`, ['The probabilities of all outcomes add up to 1.', `2x = 1 − ${dp(a, 2)} − ${dp(b, 2)} = ${dp(rest, 2)}.`, `x = ${dp(rest / 2, 2)}.`]);
      }
      const n = rng.pick([20, 40, 50, 80, 200]), k = rng.int(1, n / 2), m = rng.pick([100, 400, 1000]);
      const est = F(k, n), exp = est.mul(m);
      if (exp.d !== 1) return G.y8mProbability(level, rng);
      return num(`A drawing pin is dropped ${n} times and lands point up ${plural(k, 'time')}. Estimate how many times it would land point up in ${m} drops.`, exp.n, `Relative frequency ${k}/${n} = ${tex(est)}. ${tex(est)} × ${m} = ${exp.n}.`,
        [`Estimated probability = ${k} ÷ ${n} = ${tex(est)}.`, 'Expected = probability × trials.', `${tex(est)} × ${m} = ${exp.n}.`]);
    }
    if (rng.chance(0.55)) {
      const N = rng.int(25, 40), a = rng.int(8, 18), b = rng.int(6, 16), c = rng.int(2, Math.min(a, b) - 1), out = N - (a + b - c);
      if (out < 0) return G.y8mProbability(level, rng);
      const kind = rng.pick(['Aonly', 'neither', 'either', 'both']);
      const [cnt, desc] = { Aonly: [a - c, 'study astronomy but NOT Greek'], neither: [out, 'study neither subject'], either: [a + b - c, 'study astronomy or Greek (or both)'], both: [c, 'study both'] }[kind];
      const showVenn = rng.chance(0.5);
      return fracQ(`${showVenn ? 'The Venn diagram shows' : `In a class of ${N},`} ${showVenn ? `a class of ${N}: A = astronomy, G = Greek.` : `${a} study astronomy, ${b} study Greek and ${c} study both.`} One student is chosen at random. What is the probability they ${desc}?`, F(cnt, N),
        `${showVenn ? '' : `Astronomy only: ${a} − ${c} = ${a - c}; Greek only: ${b} − ${c} = ${b - c}; neither: ${N} − ${a + b - c} = ${out}. `}${cnt} of the ${N} students ${desc}: ${tex(F(cnt, N))}.`,
        [showVenn ? 'Read the regions of the diagram.' : `Put the ${c} in the middle first, then fill the rest: ${a - c} astronomy only, ${b - c} Greek only, ${out} outside.`, `The students who ${desc}: ${cnt}.`, `P = ${cnt}/${N}${gcd(cnt, N) > 1 ? ` = ${tex(F(cnt, N))}` : ''}.`],
        showVenn ? { diagram: { type: 'venn', labels: ['A', 'G'], only: [a - c, b - c], both: c, out } } : {});
    }
    const p = F(rng.int(1, 4), rng.int(5, 8)), q = F(rng.int(1, 3), rng.int(4, 6));
    if (rng.chance(0.5)) return fracQ(`The probability Mira wins her race is ${tex(p)}, and the probability Theo wins his (a separate race) is ${tex(q)}. What is the probability they BOTH win?`, p.mul(q), `Independent events: multiply. ${tex(p)} × ${tex(q)} = ${tex(p.mul(q))}.`,
      ['The races don’t affect each other: independent events.', 'P(A and B) = P(A) × P(B).', `${tex(p)} × ${tex(q)} = ${tex(p.mul(q))}.`]);
    const atLeast = F(1).sub(F(1).sub(p).mul(F(1).sub(q)));
    return fracQ(`The probability Mira wins her race is ${tex(p)}, and the probability Theo wins his (a separate race) is ${tex(q)}. What is the probability at least one of them wins?`, atLeast,
      `P(neither) = ${tex(F(1).sub(p))} × ${tex(F(1).sub(q))} = ${tex(F(1).sub(p).mul(F(1).sub(q)))}. So P(at least one) = 1 − that = ${tex(atLeast)}.`,
      ['“At least one” is everything except “neither”.', `P(neither) = ${tex(F(1).sub(p))} × ${tex(F(1).sub(q))} = ${tex(F(1).sub(p).mul(F(1).sub(q)))}.`, `1 − ${tex(F(1).sub(p).mul(F(1).sub(q)))} = ${tex(atLeast)}.`]);
  },

  // ---- statistics ----------------------------------------------------------------------------
  y8mStats(level, rng) {
    if (level === 1) {
      const n = rng.int(5, 8), xs = Array.from({ length: n }, () => rng.int(2, 30));
      const kind = rng.pick(['mean', 'median', 'range', 'missing']);
      const sum = xs.reduce((a, b) => a + b, 0);
      if (kind === 'mean') {
        const fix = (n - (sum % n)) % n; xs[0] += fix;
        const S = sum + fix;
        return num(`Javelin throws (m): ${xs.join(', ')}. What is the mean?`, S / n, `Add them (${S}) and divide by how many there are (${n}): ${S / n}.`, [`Total: ${S}.`, `Number of values: ${n}.`, `${S} ÷ ${n} = ${S / n}.`]);
      }
      if (kind === 'median') {
        const s = [...xs].sort((a, b) => a - b), med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
        return num(`Find the median of: ${xs.join(', ')}`, Number.isInteger(med) ? med : dp(Math.round(med * 10), 1), `In order: ${s.join(', ')}. ${n % 2 ? `The middle one is ${med}.` : `The middle two are ${s[n / 2 - 1]} and ${s[n / 2]}, so the median is ${med}.`}`,
          ['Put the values in order first.', s.join(', ') + '.', n % 2 ? `Middle value: ${med}.` : `Halfway between the middle two: ${med}.`]);
      }
      if (kind === 'range') return num(`Find the range of: ${xs.join(', ')}`, Math.max(...xs) - Math.min(...xs), `Largest − smallest = ${Math.max(...xs)} − ${Math.min(...xs)} = ${Math.max(...xs) - Math.min(...xs)}.`, ['Range = largest − smallest.', `Largest ${Math.max(...xs)}, smallest ${Math.min(...xs)}.`, `${Math.max(...xs) - Math.min(...xs)}.`]);
      const m = rng.int(8, 20), known = xs.slice(0, n - 1), need = m * n - known.reduce((a, b) => a + b, 0);
      if (need < 0) return G.y8mStats(level, rng);
      return num(`${n} numbers have a mean of ${m}. ${n - 1} of them are ${known.join(', ')}. What is the last number?`, need, `The total must be ${m} × ${n} = ${m * n}. The others add to ${m * n - need}, so the last is ${need}.`,
        [`Total = mean × how many = ${m * n}.`, `Known total: ${m * n - need}.`, `Missing: ${m * n} − ${m * n - need} = ${need}.`]);
    }
    if (level === 2) {
      for (let guard = 0; guard < 40; guard++) {
        const vals = [0, 1, 2, 3, 4], fs = vals.map(() => rng.int(1, 12));
        const N = fs.reduce((a, b) => a + b, 0), S = vals.reduce((a, v, i) => a + v * fs[i], 0);
        const table = vals.map((v, i) => `${v} ${v === 1 ? 'goal' : 'goals'}: ${fs[i]} ${fs[i] === 1 ? 'match' : 'matches'}`).join('\n');
        if (rng.chance(0.5)) {
          if ((S * 10) % N) continue;
          return num(`Goals scored by the Athens team:\n${table}\nWhat is the mean number of goals per match?`, dp((S * 10) / N, 1), `Total goals = ${vals.map((v, i) => `${v} × ${fs[i]}`).join(' + ')} = ${S}. Matches = ${N}. Mean = ${S} ÷ ${N} = ${dp((S * 10) / N, 1)}.`,
            ['Multiply each value by its frequency to get the total.', `Total ${S} goals in ${N} matches.`, `${S} ÷ ${N} = ${dp((S * 10) / N, 1)}.`]);
        }
        // only use tables where both middle values are the same, so the median is a whole number
        const at = (k) => { let c2 = 0; for (let i = 0; i < 5; i++) { c2 += fs[i]; if (c2 >= k) return vals[i]; } return vals[4]; };
        const lo = at(Math.floor((N + 1) / 2)), hi = at(Math.ceil((N + 1) / 2));
        if (lo !== hi) continue;
        return num(`Goals scored by the Athens team:\n${table}\nWhat is the median number of goals?`, lo, `There are ${N} matches, so the median is the ${N % 2 ? nth((N + 1) / 2) : `${nth(N / 2)} and ${nth(N / 2 + 1)}`} value. Counting up the frequencies, that is ${lo} ${lo === 1 ? 'goal' : 'goals'}.`,
          [`Total frequency: ${N}.`, `The middle position is ${(N + 1) / 2}.`, `Count along the frequencies until you reach it: ${lo}.`]);
      }
      return G.y8mStats(1, rng);
    }
    for (let guard = 0; guard < 60; guard++) {
      if (rng.chance(0.5)) {
        const mids = [5, 15, 25, 35], fs = mids.map(() => rng.int(2, 15)), N = fs.reduce((a, b) => a + b, 0), S = mids.reduce((a, m, i) => a + m * fs[i], 0);
        if ((S * 10) % N) continue;
        const table = mids.map((m, i) => `${m - 5} < t ≤ ${m + 5}: ${fs[i]}`).join('\n');
        return num(`Times (minutes) for messengers to run from Marathon:\n${table}\nEstimate the mean time.`, dp((S * 10) / N, 1), `Use midpoints ${mids.join(', ')}: Σ(midpoint × frequency) = ${S}, total frequency ${N}. ${S} ÷ ${N} = ${dp((S * 10) / N, 1)} minutes.`,
          ['We don’t know exact times, so use the midpoint of each class.', `Σ(midpoint × frequency) = ${mids.map((m, i) => `${m} × ${fs[i]}`).join(' + ')} = ${S}.`, `÷ ${N} = ${dp((S * 10) / N, 1)} minutes (an estimate).`], { unit: 'min' });
      }
      const n1 = rng.int(10, 30), n2 = rng.int(10, 30), m1 = rng.int(40, 80), m2 = rng.int(40, 80);
      const S = n1 * m1 + n2 * m2;
      // equal class sizes (or equal means) would make averaging the averages work, spoiling the point
      if (n1 === n2 || m1 === m2 || (S * 10) % (n1 + n2)) continue;
      return num(`Class A (${n1} students) has a mean test score of ${m1}. Class B (${n2} students) has a mean of ${m2}. What is the mean score of all ${n1 + n2} students?`, dp((S * 10) / (n1 + n2), 1),
        `Totals: ${n1} × ${m1} = ${n1 * m1} and ${n2} × ${m2} = ${n2 * m2}. Combined ${S} ÷ ${n1 + n2} = ${dp((S * 10) / (n1 + n2), 1)}. (Not just the average of ${m1} and ${m2}: the classes are different sizes.)`,
        ['You can’t average the averages when the groups are different sizes.', `Total marks: ${n1 * m1} + ${n2 * m2} = ${S}.`, `${S} ÷ ${n1 + n2} = ${dp((S * 10) / (n1 + n2), 1)}.`]);
    }
    return G.y8mStats(2, rng);
  },

  // ==== stretch: GCSE Higher tasters ==========================================================
  y8mPythag(level, rng) {
    const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
    if (level < 3) {
      const [a0, b0, c0] = rng.pick(triples), k = a0 >= 7 ? 1 : rng.int(1, 4), a = a0 * k, b = b0 * k, c = c0 * k;
      if (level === 1) return num('Find the length of the hypotenuse.', c, `a² + b² = c²: ${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}, so c = √${c * c} = ${c} cm.`, ['The hypotenuse is the longest side, opposite the right angle.', `${a}² + ${b}² = ${a * a + b * b}.`, `√${c * c} = ${c} cm.`], { unit: 'cm', diagram: { type: 'righttri', left: `${a} cm`, bottom: `${b} cm`, hyp: '?' } });
      if (rng.chance(0.5)) return num('Find the missing side.', a, `The hypotenuse is ${c}, so subtract: ${c}² − ${b}² = ${c * c} − ${b * b} = ${a * a}, and √${a * a} = ${a} cm.`, ['The hypotenuse is given, so SUBTRACT the squares.', `${c * c} − ${b * b} = ${a * a}.`, `√${a * a} = ${a} cm.`], { unit: 'cm', diagram: { type: 'righttri', left: '?', bottom: `${b} cm`, hyp: `${c} cm` } });
      const x1 = rng.int(-5, 3), y1 = rng.int(-5, 3);
      return num(`How far is it from (${neg(x1)}, ${neg(y1)}) to (${neg(x1 + b)}, ${neg(y1 + a)})?`, c, `Across ${b}, up ${a}: distance = √(${b}² + ${a}²) = √${c * c} = ${c}.`, ['Draw a right-angled triangle between the points.', `Across ${b}, up ${a}.`, `√(${b * b} + ${a * a}) = ${c}.`]);
    }
    if (rng.chance(0.35)) {
      const [a0, b0, c0] = rng.pick(triples), right = rng.chance(0.5), c = right ? c0 : c0 + 1;
      return choice(`A triangle has sides ${a0} cm, ${b0} cm and ${c} cm. Is it right-angled?`, right ? 'Yes' : 'No', [right ? 'No' : 'Yes'], rng, {
        explain: `${a0}² + ${b0}² = ${a0 * a0 + b0 * b0} and ${c}² = ${c * c}. ${right ? 'They are equal, so yes (Pythagoras works backwards too).' : 'They are not equal, so no.'}`,
        steps: ['Check whether the two short sides squared add to the longest side squared.', `${a0 * a0} + ${b0 * b0} = ${a0 * a0 + b0 * b0}; ${c}² = ${c * c}.`, right ? 'Equal: right-angled.' : 'Not equal: not right-angled.'],
      });
    }
    let a = rng.int(2, 12), b = rng.int(2, 12), c2 = a * a + b * b;
    if (Number.isInteger(Math.sqrt(c2))) return G.y8mPythag(level, rng);
    const c = (Math.round(Math.sqrt(c2) * 10) / 10).toFixed(1);
    return num('Find the hypotenuse, to 1 decimal place.', c, `√(${a}² + ${b}²) = √${c2} = ${Math.sqrt(c2).toFixed(4)}… ≈ ${c} cm.`, [`${a}² + ${b}² = ${c2}.`, `√${c2} = ${Math.sqrt(c2).toFixed(4)}…`, `To 1 d.p.: ${c} cm.`], { unit: 'cm', diagram: { type: 'righttri', left: `${a} cm`, bottom: `${b} cm`, hyp: '?' } });
  },

  y8mSimultaneous(level, rng) {
    const x = rng.int(-4, 9), y = rng.int(-4, 9);
    if (x === 0 && y === 0) return G.y8mSimultaneous(level, rng); // x + y = 0 and x − y = 0 is no puzzle
    if (level === 1) {
      return pairQ(`Solve: x + y = ${neg(x + y)} and x − y = ${neg(x - y)}. Give your answer as (x, y).`, [x, y], `Add the equations: 2x = ${neg(2 * x)}, so x = ${neg(x)}. Then y = ${neg(x + y)} − ${paren(x)} = ${neg(y)}.`,
        ['Adding the two equations cancels y.', `2x = ${neg(2 * x)}, x = ${neg(x)}.`, `Substitute back: y = ${neg(y)}.`]);
    }
    if (level === 2) {
      const a = rng.int(2, 5), b = rng.int(1, 4), c = rng.int(1, 4);
      if (a === c) return G.y8mSimultaneous(level, rng);
      // subtract the equation with fewer x's from the other, so the x coefficient stays positive
      const k = Math.abs(a - c), sub = a > c ? 'the second from the first' : 'the first from the second';
      const solveX = k === 1 ? `x = ${neg(x)}` : `${k}x = ${neg(k * x)}, so x = ${neg(x)}`;
      return pairQ(`Solve: ${a}x + ${b}y = ${neg(a * x + b * y)} and ${c === 1 ? '' : c}x + ${b}y = ${neg(c * x + b * y)}. Give (x, y).`.replace(/ 1y/g, ' y'), [x, y],
        `The y terms match, so subtract ${sub}: ${solveX}. Then ${b === 1 ? '' : b}y = ${neg(a * x + b * y)} − ${paren(a * x)}, so y = ${neg(y)}.`,
        [`Both equations have the same y term: subtract ${sub} to eliminate it.`, `${solveX}.`, `Substitute: y = ${neg(y)}.`]);
    }
    if (rng.chance(0.5)) {
      const o = rng.int(2, 12), l = rng.int(2, 12), [p, q, r, s] = [rng.int(2, 5), rng.int(1, 4), rng.int(1, 3), rng.int(2, 6)];
      if (p * s === q * r) return G.y8mSimultaneous(level, rng);
      return num(`At the market in Corinth, ${p} owl statues and ${q} ${q === 1 ? 'lyre' : 'lyres'} cost ${p * o + q * l} drachmae; ${r} owl ${r === 1 ? 'statue' : 'statues'} and ${s} lyres cost ${r * o + s * l} drachmae. How much is one owl statue?`, o,
        `Let owls = o, lyres = l: ${p}o + ${q}l = ${p * o + q * l} and ${r}o + ${s}l = ${r * o + s * l}. Eliminate l to find o = ${o} (and l = ${l}).`,
        ['Write two equations with letters for the prices.', `Multiply so the l terms match, then subtract.`, `o = ${o} drachmae (l = ${l}).`]);
    }
    const a = rng.int(2, 5), b = rng.int(2, 5), c = rng.int(2, 5), d = rng.int(-4, -1);
    if (a * d === b * c) return G.y8mSimultaneous(level, rng);
    return pairQ(`Solve: ${a}x + ${b}y = ${neg(a * x + b * y)} and ${c}x${sgn(d)}y = ${neg(c * x + d * y)}. Give (x, y).`.replace(/ − 1y/, ' − y'), [x, y],
      `Multiply to make one pair of coefficients match, then add or subtract. x = ${neg(x)}, y = ${neg(y)}.`,
      [`Multiply the first by ${c} and the second by ${a}, so the x terms are both ${a * c}x.`, `Subtract to find y = ${neg(y)}.`, `Substitute back: x = ${neg(x)}.`]);
  },

  y8mQuadratics(level, rng) {
    const nz = () => rng.pick([-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8]);
    const a = nz(), b = nz();
    const fac = (p) => `(x ${p < 0 ? '-' : '+'} ${Math.abs(p)})`;
    if (level === 1) {
      const e = expr([[1, 'x²'], [a + b, 'x'], [a * b, '']]);
      return alg(`Expand and simplify: ${show(fac(a))}${show(fac(b))}`, e, `Multiply every term by every term: x², ${ex([[b, 'x']])}, ${ex([[a, 'x']])} and ${neg(a * b)}. Collect the x terms: ${show(e.answer)}.`,
        [`x × x = x²; x × ${paren(b)} + ${paren(a)} × x = ${ex([[a + b, 'x']]) || '0'}.`, `${paren(a)} × ${paren(b)} = ${neg(a * b)}.`, `${show(e.answer)}.`], { placeholder: 'e.g. x^2 + 5x + 6' });
    }
    const quad = ex([[1, 'x²'], [a + b, 'x'], [a * b, '']]);
    if (level === 2) {
      return alg(`Factorise: ${quad}`, { answer: `${fac(a)}${fac(b)}`, accept: [`${fac(b)}${fac(a)}`] }, `Find two numbers that multiply to ${neg(a * b)} and add to ${neg(a + b)}: ${neg(a)} and ${neg(b)}. So ${show(fac(a) + fac(b))}.`,
        [`Look for a pair: product ${neg(a * b)}, sum ${neg(a + b)}.`, `${neg(a)} × ${paren(b)} = ${neg(a * b)} and ${neg(a)} + ${paren(b)} = ${neg(a + b)}.`, `${show(fac(a) + fac(b))}.`], { placeholder: 'e.g. (x + 2)(x + 3)' });
    }
    if (rng.chance(0.3)) {
      const k = rng.int(2, 12);
      return choice(`Factorise x² − ${k * k}`, `(x − ${k})(x + ${k})`, [`(x − ${k})²`, `(x + ${k})²`, `(x − ${k * k})(x + 1)`], rng, {
        explain: `The difference of two squares: x² − ${k}² = (x − ${k})(x + ${k}).`, steps: [`${k * k} = ${k}².`, 'a² − b² = (a − b)(a + b).', `(x − ${k})(x + ${k}).`],
      });
    }
    if (a === b) return G.y8mQuadratics(level, rng);
    const sol = (p, q) => `x = ${neg(p)} or x = ${neg(q)}`;
    return choice(`Solve ${quad} = 0`, sol(-a, -b), [sol(a, b), sol(-a, b), sol(a * b, a + b)], rng, {
      explain: `Factorise: ${show(fac(a) + fac(b))} = 0. One bracket must be zero, so x = ${neg(-a)} or x = ${neg(-b)}.`,
      steps: [`Factorise: ${show(fac(a) + fac(b))}.`, 'If two things multiply to 0, one of them is 0.', `${show(fac(a))} = 0 gives x = ${neg(-a)}; ${show(fac(b))} = 0 gives x = ${neg(-b)}.`],
    });
  },

  y8mTrig(level, rng) {
    if (level === 1) {
      const [given, find, ratio] = rng.pick([['hyp', 'opp', 'sin'], ['opp', 'hyp', 'sin'], ['hyp', 'adj', 'cos'], ['adj', 'hyp', 'cos'], ['opp', 'adj', 'tan'], ['adj', 'opp', 'tan']]);
      const v = rng.int(4, 15);
      const lab = { left: '', bottom: '', hyp: '' }, side = { opp: 'left', adj: 'bottom', hyp: 'hyp' };
      lab[side[given]] = `${v} cm`; lab[side[find]] = 'x';
      return choice('Which trigonometric ratio links the angle θ, the side marked x and the length given?', ratio, ['sin', 'cos', 'tan'].filter((r) => r !== ratio), rng, {
        explain: `Relative to θ, the sides involved are the ${NAMES[given]} and the ${NAMES[find]}. SOH CAH TOA gives ${ratio}.`,
        steps: ['Label the sides from θ: opposite, adjacent (next to θ), hypotenuse (longest).', `The two sides involved are the ${NAMES[given]} and the ${NAMES[find]}.`, `SOH CAH TOA: ${ratio}.`],
        diagram: { type: 'righttri', ...lab, angle: true },
      });
    }
    if (level === 2) {
      const h = 2 * rng.int(2, 12), kind = rng.pick(['sin30', 'cos60', 'tan45']);
      if (kind === 'tan45') return num('The marked angle is 45°. Using tan 45° = 1, find x.', h, `tan 45° = opposite ÷ adjacent = 1, so the two shorter sides are equal: x = ${h} cm.`, ['tan θ = opposite ÷ adjacent.', `x ÷ ${h} = 1.`, `x = ${h} cm.`], { unit: 'cm', diagram: { type: 'righttri', left: 'x', bottom: `${h} cm`, hyp: '', angle: true } });
      return num(`The marked angle is ${kind === 'sin30' ? '30' : '60'}°. Using ${kind === 'sin30' ? 'sin 30°' : 'cos 60°'} = 0.5, find x.`, h / 2, `${kind === 'sin30' ? 'sin = opposite ÷ hypotenuse' : 'cos = adjacent ÷ hypotenuse'}: x = ${h} × 0.5 = ${h / 2} cm.`,
        [`${kind === 'sin30' ? 'x is opposite θ; the hypotenuse is given: use sin.' : 'x is adjacent to θ; the hypotenuse is given: use cos.'}`, `x = ${h} × 0.5.`, `x = ${h / 2} cm.`], { unit: 'cm', diagram: { type: 'righttri', ...(kind === 'sin30' ? { left: 'x', bottom: '' } : { left: '', bottom: 'x' }), hyp: `${h} cm`, angle: true } });
    }
    const [q, right, wrongs] = rng.pick([
      ['sin 30°', '1/2', ['√3/2', '√2/2', '1']], ['cos 60°', '1/2', ['√3/2', '√2/2', '0']], ['sin 60°', '√3/2', ['1/2', '√2/2', '√3']],
      ['cos 30°', '√3/2', ['1/2', '√2/2', '√3']], ['tan 45°', '1', ['√2/2', '1/2', '√3']], ['tan 60°', '√3', ['1/√3', '√3/2', '1']], ['sin 45°', '√2/2', ['1/2', '√3/2', '1']], ['tan 30°', '1/√3', ['√3', '1/2', '√3/2']],
    ]);
    return choice(`What is the exact value of ${q}?`, right, wrongs, rng, {
      explain: `Exact values come from two special triangles: half an equilateral triangle (30°, 60°) and half a square (45°). ${q} = ${right}.`,
      steps: ['Draw an equilateral triangle of side 2 and cut it in half: sides 1, √3, 2 (angles 30°, 60°, 90°).', 'Or half a square of side 1: sides 1, 1, √2 (angles 45°, 45°, 90°).', `Read off ${q} = ${right}.`],
    });
  },

  y8mRecurring(level, rng) {
    const dot = (s) => s.split('').map((c) => `${c}̇`).join('');
    if (level === 1) {
      const [f, dec, wrongs] = rng.pick([[F(1, 3), `0.${dot('3')} (0.333…)`, ['3/10', '1/30', '3/9']], [F(2, 3), `0.${dot('6')} (0.666…)`, ['6/10', '3/5', '1/6']], [F(1, 9), `0.${dot('1')} (0.111…)`, ['1/10', '1/11', '9/100']], [F(5, 9), `0.${dot('5')} (0.555…)`, ['5/10', '1/2', '5/11']], [F(1, 6), `0.1${dot('6')} (0.1666…)`, ['16/100', '1/16', '6/10']], [F(1, 11), `0.${dot('09')} (0.0909…)`, ['9/100', '1/9', '9/10']]]);
      return choice(`Which fraction is equal to ${dec}?`, f.toString(), wrongs.filter((w) => !F(...w.split('/').map(Number)).eq(f)), rng, {
        explain: `${f.toString()} = ${dec}. Check by dividing: ${f.n} ÷ ${f.d}.`, steps: [`Divide the numerator by the denominator: ${f.n} ÷ ${f.d}.`, `It gives ${dec}.`, `So ${dec} = ${f.toString()}.`],
      });
    }
    if (level === 2) {
      if (rng.chance(0.5)) {
        const d = rng.int(1, 8);
        return fracQ(`Write 0.${dot(String(d))} (0.${String(d).repeat(3)}…) as a fraction in its simplest form.`, F(d, 9), `Let x = 0.${String(d).repeat(3)}…; 10x = ${d}.${String(d).repeat(3)}…; subtract: 9x = ${d}, so x = ${tex(F(d, 9))}.`,
          [`x = 0.${String(d).repeat(3)}…`, `10x = ${d}.${String(d).repeat(3)}…`, `10x − x = ${d}, so x = ${d}/9${gcd(d, 9) > 1 ? ` = ${tex(F(d, 9))}` : ''}.`]);
      }
      let ab = rng.int(10, 98);
      if (ab % 11 === 0) ab++;
      const s = String(ab);
      return fracQ(`Write 0.${dot(s)} (0.${s.repeat(3)}…) as a fraction in its simplest form.`, F(ab, 99), `Two digits repeat, so use 100x: 100x − x = ${ab}, 99x = ${ab}, x = ${tex(F(ab, 99))}.`,
        [`x = 0.${s}${s}…`, `100x = ${s}.${s}${s}…`, `99x = ${ab}, so x = ${ab}/99${gcd(ab, 99) > 1 ? ` = ${tex(F(ab, 99))}` : ''}.`]);
    }
    // never 9 as the repeating digit: 0.4999… is exactly 0.5, not a true recurring decimal
    const a = rng.int(1, 9), b = rng.int(1, 8);
    if (a === b) return G.y8mRecurring(level, rng);
    const f = F(10 * a + b - a, 90);
    return fracQ(`Write 0.${a}${dot(String(b))} (0.${a}${String(b).repeat(3)}…) as a fraction in its simplest form.`, f, `Let x = 0.${a}${String(b).repeat(3)}…; 100x = ${a}${b}.${String(b).repeat(3)}… and 10x = ${a}.${String(b).repeat(3)}…; subtract: 90x = ${10 * a + b - a}, so x = ${tex(f)}.`,
      ['Only the second digit repeats, so compare 100x and 10x.', `100x − 10x = ${a}${b} − ${a} = ${10 * a + b - a}.`, `x = ${10 * a + b - a}/90${gcd(10 * a + b - a, 90) > 1 ? ` = ${tex(f)}` : ''}.`]);
  },
};

export const Y8_MATHS_GENERATORS = G;
