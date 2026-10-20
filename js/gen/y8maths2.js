// Year 8 maths generators, part 2: wider and deeper KS3 for a strong grammar-school Year 8, with
// GCSE Higher tasters (completing the square, surds, geometric sequences, 3D Pythagoras and the
// cosine rule). Same contract as y8maths.js: (level 1..3, rng) -> question with `explain` and
// worked `steps`. Numbers are exact: decimals are built from integer counts, fractions with Frac.
// Examples lean on Greek myth (classical figures and the app's own characters Mira, Theo, Kit).

import { Frac, gcd } from '../core/fraction.js';

const neg = (n) => (n < 0 ? `−${-n}` : String(n));
const paren = (n) => (n < 0 ? `(−${-n})` : String(n));
const show = (s) => String(s).replace(/-/g, '−');
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const SUB = '₀₁₂₃₄₅₆₇₈₉';
const sup = (n) => (n < 0 ? '⁻' : '') + String(Math.abs(n)).split('').map((d) => SUP[+d]).join('');
const subs = (n) => String(n).split('').map((d) => SUB[+d]).join('');
const F = (n, d = 1) => new Frac(n, d).simplify();
const tex = (f) => show(f.toTex());
const comma = (s) => String(s).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/** Exact decimal text from an integer count of 10^-scale units ("-12.5" style, ASCII minus). */
function dp(num, scale = 2) {
  const sign = num < 0 ? '-' : '';
  num = Math.abs(num);
  const p = 10 ** scale, whole = Math.floor(num / p);
  const frac = String(num % p).padStart(scale, '0').replace(/0+$/, '');
  return sign + (frac ? `${whole}.${frac}` : String(whole));
}
/** A fraction as a terminating decimal string, or null if it recurs. */
function fdec(f) {
  let d = f.d, k = 0;
  while (d % 2 === 0) { d /= 2; k++; }
  let j = 0;
  while (d % 5 === 0) { d /= 5; j++; }
  if (d !== 1) return null;
  const scale = Math.max(k, j);
  return dp((f.n * 10 ** scale) / f.d, scale);
}
/** Value text for an exact answer: an integer, a terminating decimal or a fraction "a/b". */
const val = (f) => (f.d === 1 ? String(f.n) : fdec(f) ?? f.toString());
/** How to show an exact number in prose: integer, decimal or stacked fraction. */
const say = (f) => (f.d === 1 ? neg(f.n) : fdec(f) ? show(fdec(f)) : tex(f));

const norm = (t) => String(t).normalize('NFKC').toLowerCase().replace(/[−–]/g, '-').replace(/\s+/g, ' ').trim();
function choice(prompt, correct, wrongs, rng, extra = {}) {
  const seen = new Set([norm(correct)]);
  const ws = [];
  for (const w of wrongs) {
    const o = typeof w === 'string' ? { text: w } : w;
    if (!o.text || seen.has(norm(o.text))) continue;
    seen.add(norm(o.text)); ws.push(o);
  }
  return { kind: 'choice', prompt, options: rng.shuffle([{ text: correct, correct: true }, ...ws.slice(0, 4)]), ...extra };
}
const num = (prompt, value, explain, steps, extra = {}) => ({ kind: 'typed', prompt, numeric: { value: String(value), form: 'any' }, explain, steps, ...extra });
const fracQ = (prompt, f, explain, steps, extra = {}) => ({ kind: 'typed', prompt, numeric: { value: f.toString(), form: 'simplest' }, explain, steps, placeholder: 'e.g. 3/4', ...extra });
const pairQ = (prompt, P, explain, steps, extra = {}) => ({ kind: 'typed', prompt, pair: P, answer: `(${P[0]}, ${P[1]})`, placeholder: '(x, y)', explain, steps, ...extra });
const alg = (prompt, answer, accept, explain, steps, extra = {}) => ({ kind: 'typed', prompt, answer, accept, algebra: true, explain, steps, placeholder: 'e.g. 3x + 2', ...extra });

/** Terms [[coef, 'x'], [coef, '']] -> { answer, accept } (either order accepted). */
function expr(terms) {
  const ts = terms.filter(([c]) => c !== 0);
  if (!ts.length) return { answer: '0', accept: [] };
  const fmt = (list) => list.map(([c, v], i) => {
    const a = Math.abs(c);
    const body = v ? (a === 1 ? v : `${a}${v}`) : String(a);
    return i === 0 ? (c < 0 ? '-' : '') + body : (c < 0 ? ' - ' : ' + ') + body;
  }).join('');
  return { answer: fmt(ts), accept: ts.length === 2 ? [fmt([ts[1], ts[0]])] : [] };
}
const ex = (terms) => show(expr(terms).answer);
/** "ax + b" in display form, e.g. lin(3, -2) = "3x − 2". */
const lin = (a, b, v = 'x') => ex([[a, v], [b, '']]);
/** A coefficient in front of a letter: 1 is not written. */
const co = (c) => (c === 1 ? '' : String(c));

/** Round an integer count of 10^-scale units to `sf` significant figures (half up). */
function roundSf(n, sf) {
  const len = String(Math.abs(n)).length;
  if (len <= sf) return n;
  const f = 10 ** (len - sf);
  return Math.round(n / f) * f;
}
/** Text of n × 10^-scale, tidied. */
const decText = (n, scale) => (scale <= 0 ? String(n * 10 ** -scale) : dp(n, scale));

const G = {
  // ---- compound measures --------------------------------------------------------------------
  y8nCompound(level, rng) {
    if (level === 1) {
      const s = rng.int(4, 18) * 5, t = rng.int(2, 6), d = s * t;
      const who = rng.pick(['Hermes, running with winged sandals,', 'A chariot', 'Odysseus’s ship', 'A courier on the Marathon road']);
      const kind = rng.pick(['speed', 'dist', 'time']);
      if (kind === 'speed') return num(`${who} covers ${d} km in ${t} hours. What is the average speed, in km/h?`, s, `Speed = distance ÷ time = ${d} ÷ ${t} = ${s} km/h.`, ['Speed = distance ÷ time.', `${d} ÷ ${t}.`, `= ${s} km/h.`], { unit: 'km/h' });
      if (kind === 'dist') return num(`${who} travels at ${s} km/h for ${t} hours. How far does it go?`, d, `Distance = speed × time = ${s} × ${t} = ${d} km.`, ['Distance = speed × time.', `${s} × ${t}.`, `= ${d} km.`], { unit: 'km' });
      return num(`${who} travels ${d} km at ${s} km/h. How many hours does it take?`, t, `Time = distance ÷ speed = ${d} ÷ ${s} = ${t} hours.`, ['Time = distance ÷ speed.', `${d} ÷ ${s}.`, `= ${t} hours.`], { unit: 'hours' });
    }
    if (level === 2) {
      const kind = rng.pick(['density', 'mass', 'volume', 'pressure', 'force']);
      if (kind === 'pressure' || kind === 'force') {
        const A = rng.int(2, 10), P = rng.int(5, 50) * 10, Fz = A * P;
        if (kind === 'pressure') return num(`The Colossus statue pushes down with a force of ${comma(Fz)} N on a base of area ${A} m². What pressure does it exert, in N/m²?`, P, `Pressure = force ÷ area = ${comma(Fz)} ÷ ${A} = ${P} N/m².`, ['Pressure = force ÷ area.', `${Fz} ÷ ${A}.`, `= ${P} N/m² (pascals).`], { unit: 'N/m²' });
        return num(`A pressure of ${P} N/m² acts on an area of ${A} m². What is the force, in newtons?`, Fz, `Force = pressure × area = ${P} × ${A} = ${Fz} N.`, ['Rearrange P = F ÷ A to F = P × A.', `${P} × ${A}.`, `= ${Fz} N.`], { unit: 'N' });
      }
      const [metal, rho] = rng.pick([['aluminium', 3], ['iron', 8], ['silver', 10], ['lead', 11], ['gold', 19], ['marble', 3], ['bronze', 9]]);
      const V = rng.int(3, 40), m = rho * V;
      if (kind === 'density') return num(`Hephaestus casts a block of ${metal} with mass ${m} g and volume ${V} cm³. What is its density, in g/cm³?`, rho, `Density = mass ÷ volume = ${m} ÷ ${V} = ${rho} g/cm³.`, ['Density = mass ÷ volume.', `${m} ÷ ${V}.`, `= ${rho} g/cm³.`], { unit: 'g/cm³' });
      if (kind === 'mass') return num(`${metal[0].toUpperCase() + metal.slice(1)} has a density of ${rho} g/cm³. What is the mass of ${V} cm³ of it, in grams?`, m, `Mass = density × volume = ${rho} × ${V} = ${m} g.`, ['Rearrange: mass = density × volume.', `${rho} × ${V}.`, `= ${m} g.`], { unit: 'g' });
      return num(`A ${metal} figurine has mass ${m} g. The density of ${metal} is ${rho} g/cm³. What is its volume, in cm³?`, V, `Volume = mass ÷ density = ${m} ÷ ${rho} = ${V} cm³.`, ['Rearrange: volume = mass ÷ density.', `${m} ÷ ${rho}.`, `= ${V} cm³.`], { unit: 'cm³' });
    }
    const kind = rng.pick(['kmh2ms', 'ms2kmh', 'minutes', 'rate']);
    if (kind === 'kmh2ms') {
      const k = rng.int(1, 8), v = 18 * k;
      return num(`A cheetah-fast chariot reaches ${v} km/h. What is that in metres per second?`, 5 * k, `${v} km/h = ${v * 1000} m in 3600 s, so ${v * 1000} ÷ 3600 = ${5 * k} m/s.`, ['1 km = 1000 m and 1 hour = 3600 s.', `${v} × 1000 = ${v * 1000} m per hour.`, `÷ 3600 = ${5 * k} m/s.`], { unit: 'm/s' });
    }
    if (kind === 'ms2kmh') {
      const v = rng.int(4, 30);
      return num(`A discus flies at ${v} m/s. What is that in km/h?`, dp(36 * v, 1), `Multiply by 3600 (seconds in an hour) and divide by 1000 (metres in a km): ${v} × 3.6 = ${dp(36 * v, 1)} km/h.`, [`${v} m every second is ${v * 3600} m every hour.`, `${v * 3600} m = ${dp(36 * v, 1)} km.`, `So ${dp(36 * v, 1)} km/h.`], { unit: 'km/h' });
    }
    if (kind === 'minutes') {
      const s = rng.pick([30, 40, 45, 60, 80, 90, 120]);
      const mins = rng.pick([15, 20, 30, 40, 45, 50, 75, 90, 100]);
      if ((s * mins) % 60) return G.y8nCompound(level, rng);
      const d = (s * mins) / 60;
      return num(`Theo cycles ${d} km at an average speed of ${s} km/h. How many MINUTES does it take?`, mins, `Time = ${d} ÷ ${s} = ${say(F(d, s))} hours = ${mins} minutes.`, ['Time = distance ÷ speed (in hours).', `${d} ÷ ${s} = ${say(F(d, s))} hours.`, `× 60 = ${mins} minutes.`], { unit: 'minutes' });
    }
    const workers = rng.int(2, 6), rate = rng.int(3, 12), hours = rng.int(2, 8), more = workers + rng.int(1, 4);
    return num(`${workers} builders lay ${workers * rate} stones an hour between them on the temple wall. At the same rate each, how many stones do ${more} builders lay in ${hours} hours?`, more * rate * hours,
      `Each builder lays ${rate} an hour. ${more} builders: ${more * rate} an hour. In ${hours} hours: ${more * rate * hours}.`, [`One builder: ${workers * rate} ÷ ${workers} = ${rate} stones an hour.`, `${more} builders: ${more} × ${rate} = ${more * rate} an hour.`, `× ${hours} hours = ${more * rate * hours}.`]);
  },

  // ---- unit conversions, including area and volume units ------------------------------------------
  y8nUnits(level, rng) {
    if (level === 1) {
      const kind = rng.pick(['km', 'mm', 'kg', 'l']);
      if (kind === 'km') { const t = rng.int(12, 95); return num(`The road from Athens to Marathon is about ${dp(t, 1)} km. How many metres is that?`, t * 100, `1 km = 1000 m, so ${dp(t, 1)} × 1000 = ${comma(t * 100)} m.`, ['1 km = 1000 m.', `Multiply by 1000: move the digits three places.`, `${dp(t, 1)} km = ${comma(t * 100)} m.`], { unit: 'm' }); }
      if (kind === 'mm') { const c = rng.int(15, 250); return num(`A bronze pin is ${dp(c, 1)} cm long. How many millimetres is that?`, c, `1 cm = 10 mm, so ${dp(c, 1)} × 10 = ${c} mm.`, ['1 cm = 10 mm.', 'Multiply by 10.', `${c} mm.`], { unit: 'mm' }); }
      if (kind === 'kg') { const g = rng.int(120, 9500); return num(`A shield weighs ${comma(g)} g. What is that in kilograms?`, dp(g, 3), `1 kg = 1000 g, so ${comma(g)} ÷ 1000 = ${dp(g, 3)} kg.`, ['1 kg = 1000 g.', 'Divide by 1000.', `${dp(g, 3)} kg.`], { unit: 'kg' }); }
      const ml = rng.int(50, 4000);
      return num(`An amphora holds ${comma(ml)} ml of olive oil. How many litres is that?`, dp(ml, 3), `1 litre = 1000 ml, so ${comma(ml)} ÷ 1000 = ${dp(ml, 3)} litres.`, ['1 litre = 1000 ml.', 'Divide by 1000.', `${dp(ml, 3)} litres.`], { unit: 'litres' });
    }
    if (level === 2) {
      const kind = rng.pick(['m2cm2', 'cm2m2', 'mm2cm2', 'trap']);
      if (kind === 'm2cm2') { const t = rng.int(2, 60); return num(`A mosaic covers ${dp(t, 1)} m². How many cm² is that?`, t * 1000, `1 m = 100 cm, so 1 m² = 100 × 100 = 10,000 cm². ${dp(t, 1)} × 10,000 = ${comma(t * 1000)} cm².`, ['Area units square the length factor.', '1 m² = 100 cm × 100 cm = 10,000 cm².', `${dp(t, 1)} × 10,000 = ${comma(t * 1000)} cm².`], { unit: 'cm²' }); }
      if (kind === 'cm2m2') { const c = rng.int(5, 900) * 100; return num(`A floor tile pattern covers ${comma(c)} cm². How many m² is that?`, dp(c, 4), `1 m² = 10,000 cm², so ${comma(c)} ÷ 10,000 = ${dp(c, 4)} m².`, ['1 m² = 10,000 cm².', 'Divide by 10,000.', `${dp(c, 4)} m².`], { unit: 'm²' }); }
      if (kind === 'mm2cm2') { const m = rng.int(30, 2500); return num(`A coin face has area ${comma(m)} mm². What is that in cm²?`, dp(m, 2), `1 cm² = 10 × 10 = 100 mm², so ${comma(m)} ÷ 100 = ${dp(m, 2)} cm².`, ['1 cm = 10 mm, so 1 cm² = 100 mm².', 'Divide by 100.', `${dp(m, 2)} cm².`], { unit: 'cm²' }); }
      return choice('Kit says 1 m² = 100 cm². What is the mistake?', 'It should be 10,000 cm², because 1 m² is 100 cm by 100 cm', ['It should be 1,000 cm², because 1 m = 1,000 cm', 'There is no mistake', 'It should be 10 cm², because area is smaller'], rng, {
        explain: 'A square metre is 100 cm long and 100 cm wide: 100 × 100 = 10,000 cm². Scale factors for area are squared.', steps: ['Draw 1 m² as a square, 1 m each side.', 'Each side is 100 cm.', 'Area = 100 × 100 = 10,000 cm².'],
      });
    }
    const kind = rng.pick(['m3cm3', 'cm3l', 'tank']);
    if (kind === 'm3cm3') { const a = rng.int(2, 9); return num(`How many cm³ are in ${a} m³?`, a * 1000000, `1 m³ = 100 × 100 × 100 = 1,000,000 cm³, so ${a} m³ = ${comma(a * 1000000)} cm³.`, ['Volume units cube the length factor.', '1 m³ = 100³ cm³ = 1,000,000 cm³.', `× ${a} = ${comma(a * 1000000)} cm³.`], { unit: 'cm³' }); }
    if (kind === 'cm3l') { const c = rng.int(5, 900) * 10; return num(`A water jar has volume ${comma(c)} cm³. How many litres does it hold?`, dp(c, 3), `1 litre = 1000 cm³, so ${comma(c)} ÷ 1000 = ${dp(c, 3)} litres.`, ['1 litre = 1000 cm³ (1 ml = 1 cm³).', 'Divide by 1000.', `${dp(c, 3)} litres.`], { unit: 'litres' }); }
    const l = rng.int(10, 30), w = rng.int(5, 15), hgt = rng.int(4, 12);
    return num(`A temple cistern is a cuboid ${dp(l, 1)} m long, ${dp(w, 1)} m wide and ${dp(hgt, 1)} m deep. How many litres of water does it hold when full?`, l * w * hgt,
      `Volume = ${dp(l, 1)} × ${dp(w, 1)} × ${dp(hgt, 1)} = ${dp(l * w * hgt, 3)} m³. 1 m³ = 1000 litres, so ${comma(l * w * hgt)} litres.`,
      ['Find the volume in m³ first.', `${dp(l, 1)} × ${dp(w, 1)} × ${dp(hgt, 1)} = ${dp(l * w * hgt, 3)} m³.`, `1 m³ = 1000 litres: ${comma(l * w * hgt)} litres.`], { unit: 'litres' });
  },

  // ---- significant figures, error intervals and bounds ---------------------------------------------
  y8nBounds(level, rng) {
    if (level === 1) {
      const sf = rng.int(1, 3);
      if (rng.chance(0.5)) {
        const n = rng.int(1000, 999999), r = roundSf(n, sf);
        return num(`Round ${comma(n)} to ${sf} significant figure${sf > 1 ? 's' : ''}.`, r, `The first ${sf} significant figure${sf > 1 ? 's are' : ' is'} kept; look at the next digit to decide whether to round up. ${comma(n)} ≈ ${comma(r)}.`,
          ['Significant figures start at the first non-zero digit.', `Keep ${sf} digit${sf > 1 ? 's' : ''}, check the next one (5 or more rounds up).`, `Fill the gaps with zeros: ${comma(r)}.`]);
      }
      const scale = rng.int(3, 5), n = rng.int(100, 9999), r = roundSf(n, sf);
      return num(`Round ${dp(n, scale)} to ${sf} significant figure${sf > 1 ? 's' : ''}.`, dp(r, scale), `Leading zeros are not significant. The first significant figure is the first non-zero digit. ${dp(n, scale)} ≈ ${dp(r, scale)}.`,
        ['Skip the zeros at the start.', `Keep ${sf} significant figure${sf > 1 ? 's' : ''} and look at the next digit.`, `${dp(r, scale)}.`]);
    }
    if (level === 2) {
      const kind = rng.pick(['cm', 'dp', 'ten', 'interval']);
      if (kind === 'cm') { const x = rng.int(12, 95), up = rng.chance(0.5); return num(`A spear is ${x} cm long, to the nearest centimetre. What is the ${up ? 'upper' : 'lower'} bound of its length?`, dp(up ? 10 * x + 5 : 10 * x - 5, 1), `To the nearest cm means within half a centimetre: from ${dp(10 * x - 5, 1)} cm up to (but not including) ${dp(10 * x + 5, 1)} cm.`, ['Half of the unit is 0.5 cm.', `Lower bound: ${x} − 0.5 = ${dp(10 * x - 5, 1)}.`, `Upper bound: ${x} + 0.5 = ${dp(10 * x + 5, 1)}.`], { unit: 'cm' }); }
      if (kind === 'dp') { const x = rng.int(12, 99), up = rng.chance(0.5); return num(`A rope is ${dp(x, 1)} m to 1 decimal place. What is the ${up ? 'upper' : 'lower'} bound?`, dp(up ? 10 * x + 5 : 10 * x - 5, 2), `To 1 dp means within 0.05: from ${dp(10 * x - 5, 2)} m to ${dp(10 * x + 5, 2)} m.`, ['The unit is 0.1, so half of it is 0.05.', `${dp(x, 1)} − 0.05 = ${dp(10 * x - 5, 2)}.`, `${dp(x, 1)} + 0.05 = ${dp(10 * x + 5, 2)}.`], { unit: 'm' }); }
      if (kind === 'ten') { const x = rng.int(12, 99) * 10, up = rng.chance(0.5); return num(`About ${x} people watched the race at Olympia, to the nearest 10. What is the ${up ? 'upper' : 'lower'} bound?`, up ? x + 5 : x - 5, `To the nearest 10 means within 5: from ${x - 5} up to (not including) ${x + 5}.`, ['Half of 10 is 5.', `${x} − 5 = ${x - 5}.`, `${x} + 5 = ${x + 5} (the upper bound itself would round up).`]); }
      const x = rng.int(20, 80);
      return choice(`x = ${x} rounded to the nearest whole number. Which error interval is correct?`, `${x - 1}.5 ≤ x < ${x}.5`, [`${x - 1}.5 < x ≤ ${x}.5`, `${x - 1} ≤ x < ${x + 1}`, `${x - 1}.5 ≤ x ≤ ${x}.5`, `${x}.5 ≤ x < ${x + 1}.5`], rng, {
        explain: `Anything from ${x - 1}.5 (which rounds up to ${x}) up to but not including ${x}.5 (which would round to ${x + 1}) rounds to ${x}.`, steps: ['Half a unit each side: ± 0.5.', `Lower bound ${x - 1}.5 is included (it rounds up to ${x}).`, `Upper bound ${x}.5 is excluded (it rounds to ${x + 1}).`],
      });
    }
    const a = rng.int(4, 20), b = rng.int(3, 15);
    const kind = rng.pick(['maxArea', 'minArea', 'maxPerim']);
    if (kind === 'maxPerim') return num(`A rectangular arena is ${a} m by ${b} m, each to the nearest metre. What is the greatest possible perimeter?`, 2 * (a + b + 1), `Use the upper bounds: ${a}.5 and ${b}.5. Perimeter = 2 × (${a}.5 + ${b}.5) = ${2 * (a + b + 1)} m.`, ['For the greatest perimeter, use the upper bounds.', `${a}.5 m and ${b}.5 m.`, `2 × (${a}.5 + ${b}.5) = ${2 * (a + b + 1)} m.`], { unit: 'm' });
    if (kind === 'maxArea') { const A = 25 * (2 * a + 1) * (2 * b + 1); return num(`A rectangular arena is ${a} m by ${b} m, each to the nearest metre. What is the greatest possible area?`, dp(A, 2), `Use the upper bounds: ${a}.5 × ${b}.5 = ${dp(A, 2)} m².`, ['For the greatest area, use both upper bounds.', `${a}.5 m and ${b}.5 m.`, `${a}.5 × ${b}.5 = ${dp(A, 2)} m².`], { unit: 'm²' }); }
    const A = 25 * (2 * a - 1) * (2 * b - 1);
    return num(`A rectangular arena is ${a} m by ${b} m, each to the nearest metre. What is the smallest possible area?`, dp(A, 2), `Use the lower bounds: ${a - 1}.5 × ${b - 1}.5 = ${dp(A, 2)} m².`, ['For the smallest area, use both lower bounds.', `${a - 1}.5 m and ${b - 1}.5 m.`, `${a - 1}.5 × ${b - 1}.5 = ${dp(A, 2)} m².`], { unit: 'm²' });
  },

  // ---- estimation by rounding to 1 significant figure ---------------------------------------------
  y8nEstimate(level, rng) {
    // a number near d × 10^e: [text, rounded Frac, rounded text]
    const near = (d, e) => {
      for (;;) {
        const A = d * 100 + rng.int(-30, 30);
        if (A < 100 && d > 1) continue;
        const scale = 2 - e; // A × 10^(e-2)
        if (A % 10 === 0) continue;
        const r = roundSf(A, 1);
        const target = d * 100;
        if (r !== target) continue;
        const text = scale <= 0 ? comma(A * 10 ** -scale) : dp(A, scale);
        const rf = e >= 0 ? F(d * 10 ** e) : F(d, 10 ** -e);
        return [text, rf, say(rf)];
      }
    };
    if (level === 1) {
      const [at, ar, as] = near(rng.int(2, 9), rng.int(0, 2)), [bt, br, bs] = near(rng.int(2, 9), rng.int(0, 1));
      const est = ar.mul(br);
      return num(`Estimate ${at} × ${bt} by rounding each number to 1 significant figure.`, val(est), `${at} ≈ ${as} and ${bt} ≈ ${bs}, so the estimate is ${as} × ${bs} = ${say(est)}.`,
        ['Round each number to 1 significant figure.', `${at} ≈ ${as}; ${bt} ≈ ${bs}.`, `${as} × ${bs} = ${say(est)}.`]);
    }
    for (let tries = 0; tries < 200; tries++) {
      const e1 = level === 2 ? rng.int(0, 2) : rng.int(-1, 2), e2 = level === 2 ? rng.int(0, 1) : rng.int(-1, 1), e3 = level === 2 ? 0 : rng.int(-1, 0);
      const [at, ar, as] = near(rng.int(1, 9), e1), [bt, br, bs] = near(rng.int(1, 9), e2), [ct, cr, cs] = near(rng.int(2, 9), e3);
      const est = ar.mul(br).div(cr);
      if (est.d !== 1 || est.n < 2 || est.n > 200000) continue;
      return num(`Estimate the value of (${at} × ${bt}) ÷ ${ct} by rounding each number to 1 significant figure.`, est.n,
        `${at} ≈ ${as}, ${bt} ≈ ${bs}, ${ct} ≈ ${cs}. (${as} × ${bs}) ÷ ${cs} = ${say(ar.mul(br))} ÷ ${cs} = ${comma(est.n)}.`,
        ['Round every number to 1 significant figure.', `${as} × ${bs} = ${say(ar.mul(br))}.`, `÷ ${cs} = ${comma(est.n)}.${level === 3 ? ' (Dividing by a decimal less than 1 makes the answer bigger.)' : ''}`]);
    }
    return G.y8nEstimate(1, rng);
  },

  // ---- number bases ----------------------------------------------------------------------------
  y8nBases(level, rng) {
    if (level === 1) {
      const n = rng.int(5, 63), bin = n.toString(2);
      if (rng.chance(0.5)) {
        const parts = bin.split('').map((b, i) => (b === '1' ? 2 ** (bin.length - 1 - i) : 0)).filter(Boolean);
        return num(`Convert the binary number ${bin}${subs(2)} to denary (base 10).`, n, `Place values from the right are 1, 2, 4, 8, 16, 32. ${parts.join(' + ')} = ${n}.`, ['Write the place values above the digits: …, 16, 8, 4, 2, 1.', `Add the place values where there is a 1: ${parts.join(' + ')}.`, `= ${n}.`]);
      }
      return num(`Write ${n} in binary.`, bin, `${n} = ${bin.split('').map((b, i) => (b === '1' ? 2 ** (bin.length - 1 - i) : 0)).filter(Boolean).join(' + ')}, so ${n} = ${bin}${subs(2)}.`, ['Find the largest power of 2 that fits, and subtract it.', 'Repeat with what is left.', `Put 1s in those places: ${bin}.`], { placeholder: 'e.g. 10110' });
    }
    if (level === 2) {
      const base = rng.pick([3, 5, 8]), n = rng.int(base + 2, base ** 3 - 1), s = n.toString(base);
      if (rng.chance(0.55)) {
        const terms = s.split('').map((d, i) => `${d} × ${base ** (s.length - 1 - i)}`);
        return num(`The Babylonians counted in base 60; computers use base 2. Convert ${s}${subs(base)} (base ${base}) to denary.`, n, `Place values in base ${base} are 1, ${base}, ${base * base}… So ${terms.join(' + ')} = ${n}.`, [`Columns in base ${base}: ${[base * base, base, 1].join(', ')}.`, `${terms.join(' + ')}.`, `= ${n}.`]);
      }
      return num(`Write ${n} in base ${base}.`, s, `${n} = ${s.split('').map((d, i) => `${d} × ${base ** (s.length - 1 - i)}`).join(' + ')}, so it is ${s}${subs(base)}.`, [`Column values: ${[base * base, base, 1].filter((v) => v <= n || v === 1).join(', ')}.`, 'See how many of each column value fit, largest first.', `${s}${subs(base)}.`], { placeholder: 'digits only' });
    }
    const kind = rng.pick(['add', 'hex', 'shift']);
    if (kind === 'add') {
      const a = rng.int(9, 40), b = rng.int(9, 40), s = (a + b).toString(2);
      return num(`Add these binary numbers, and give your answer in binary: ${a.toString(2)} + ${b.toString(2)}`, s, `${a.toString(2)} is ${a} and ${b.toString(2)} is ${b}. ${a} + ${b} = ${a + b} = ${s}${subs(2)}. (Or add column by column: 1 + 1 = 10, carry the 1.)`,
        ['Add column by column from the right: 1 + 1 = 0 carry 1.', '1 + 1 + 1 = 1 carry 1.', `Answer: ${s}. Check in denary: ${a} + ${b} = ${a + b}.`], { placeholder: 'e.g. 101101' });
    }
    if (kind === 'hex') {
      const n = rng.int(26, 255), h = n.toString(16).toUpperCase();
      return num(`Hexadecimal uses digits 0–9 and A–F (A = 10 … F = 15). Convert ${h}${subs(16)} to denary.`, n, `${h[0]} is worth ${parseInt(h[0], 16)} and ${h[1]} is worth ${parseInt(h[1], 16)}: ${parseInt(h[0], 16)} × 16 + ${parseInt(h[1], 16)} = ${n}.`, ['The left digit counts sixteens; the right digit counts ones.', `${h[0]} = ${parseInt(h[0], 16)}, so ${parseInt(h[0], 16)} × 16 = ${parseInt(h[0], 16) * 16}.`, `Add ${parseInt(h[1], 16)}: ${n}.`]);
    }
    const n = rng.int(3, 31), k = rng.int(1, 3), s = (n * 2 ** k).toString(2);
    return num(`Shift the binary number ${n.toString(2)} left by ${k} place${k > 1 ? 's' : ''}. What is the result, in binary?`, s, `A left shift adds ${k} zero${k > 1 ? 's' : ''} on the right, multiplying by ${2 ** k}: ${n} × ${2 ** k} = ${n * 2 ** k} = ${s}${subs(2)}.`, ['Each left shift multiplies by 2.', `Add ${k} zero${k > 1 ? 's' : ''} on the right.`, `${s}.`], { placeholder: 'e.g. 101100' });
  },

  // ---- laws of indices with algebra --------------------------------------------------------------
  y8nIndexLaws(level, rng) {
    const v = rng.pick(['x', 'y', 'a', 'p']);
    if (level === 1) {
      const m = rng.int(2, 9), n = rng.int(2, 8);
      const kind = rng.pick(['mul', 'div', 'pow']);
      if (kind === 'mul') return num(`${v}${sup(m)} × ${v}${sup(n)} = ${v}ⁿ. What is n?`, m + n, `Multiplying powers of the same base: add the indices. ${m} + ${n} = ${m + n}.`, ['Same base, multiplying: add the powers.', `${m} + ${n}.`, `n = ${m + n}.`]);
      if (kind === 'div') { const big = m + n; return num(`${v}${sup(big)} ÷ ${v}${sup(n)} = ${v}ⁿ. What is n?`, m, `Dividing powers of the same base: subtract the indices. ${big} − ${n} = ${m}.`, ['Same base, dividing: subtract the powers.', `${big} − ${n}.`, `n = ${m}.`]); }
      const a = rng.int(2, 5), b = rng.int(2, 5);
      return num(`(${v}${sup(a)})${sup(b)} = ${v}ⁿ. What is n?`, a * b, `A power of a power: multiply the indices. ${a} × ${b} = ${a * b}.`, ['A power of a power: multiply.', `${a} × ${b}.`, `n = ${a * b}.`]);
    }
    if (level === 2) {
      if (rng.chance(0.5)) {
        const c = rng.int(2, 5), p = rng.int(2, 5), k = rng.int(2, 3);
        const right = `${c ** k}${v}${sup(p * k)}`;
        return choice(`Simplify (${c}${v}${sup(p)})${sup(k)}.`, right, [`${c}${v}${sup(p * k)}`, `${c * k}${v}${sup(p * k)}`, `${c ** k}${v}${sup(p + k)}`, `${c ** k}${v}${sup(p)}`], rng, {
          explain: `Everything in the bracket is raised to the power ${k}: ${c}${sup(k)} = ${c ** k} and (${v}${sup(p)})${sup(k)} = ${v}${sup(p * k)}.`, steps: [`Raise the number: ${c}${sup(k)} = ${c ** k}.`, `Raise the letter: multiply the indices, ${p} × ${k} = ${p * k}.`, `${right}.`],
        });
      }
      const a = rng.int(2, 5), b = rng.int(2, 5), m = rng.int(4, 9), n = rng.int(1, m - 1), p = rng.int(2, 5), q = rng.int(1, p - 1);
      const fmt = (c, e1, e2) => `${c}x${e1 === 1 ? '' : sup(e1)}y${e2 === 1 ? '' : sup(e2)}`;
      return choice(`Simplify ${a * a * b}x${sup(m)}y${sup(p)} ÷ ${a}x${sup(n)}y${sup(q)}.`, fmt(a * b, m - n, p - q), [fmt(a * b, m + n, p + q), fmt(a * a * b - a, m - n, p - q), fmt(a * b, m / n, p - q), fmt(a, m - n, p - q)].filter((t) => !t.includes('.')), rng, {
        explain: `Divide the numbers (${a * a * b} ÷ ${a} = ${a * b}) and subtract the indices for each letter (x: ${m} − ${n}; y: ${p} − ${q}).`, steps: [`${a * a * b} ÷ ${a} = ${a * b}.`, `x${sup(m)} ÷ x${sup(n)} = x${sup(m - n)}.`, `y${sup(p)} ÷ y${sup(q)} = y${sup(p - q)}. Answer ${fmt(a * b, m - n, p - q)}.`],
      });
    }
    const kind = rng.pick(['pow2', 'pow3', 'mixed', 'frac', 'negx']);
    if (kind === 'pow2') { const x = rng.int(3, 10); return num(`Solve 2ˣ = ${2 ** x}.`, x, `2${sup(x)} = ${2 ** x}, so x = ${x}.`, ['Count how many 2s multiply to make it.', `2, 4, 8, 16, … reaches ${2 ** x} at 2${sup(x)}.`, `x = ${x}.`]); }
    if (kind === 'pow3') { const x = rng.int(2, 5), k = rng.int(1, 3); return num(`Solve 3ˣ⁺${sup(k)} = ${3 ** (x + k)}.`, x, `${3 ** (x + k)} = 3${sup(x + k)}, so x + ${k} = ${x + k} and x = ${x}.`, [`Write ${3 ** (x + k)} as a power of 3: 3${sup(x + k)}.`, `So x + ${k} = ${x + k}.`, `x = ${x}.`]); }
    if (kind === 'mixed') { const x = rng.int(2, 6); return num(`Solve 4ˣ = 2${sup(2 * x)}.`, x, `4 = 2², so 4ˣ = 2^(2x). Then 2x = ${2 * x} and x = ${x}.`, ['Write both sides with the same base: 4 = 2².', `4ˣ = 2²ˣ, so 2x = ${2 * x}.`, `x = ${x}.`]); }
    if (kind === 'frac') {
      const [b, t, base, eb, et] = rng.pick([[9, 27, 3, 2, 3], [8, 2, 2, 3, 1], [4, 8, 2, 2, 3], [27, 9, 3, 3, 2], [16, 8, 2, 4, 3], [8, 4, 2, 3, 2], [25, 125, 5, 2, 3]]);
      const x = F(et, eb);
      return num(`Solve ${b}ˣ = ${t}. Give x as a fraction.`, x.toString(), `${b} = ${base}${sup(eb)} and ${t} = ${base}${sup(et)}, so ${b}ˣ = ${base}${sup(eb)}ˣ. Matching the indices: ${eb}x = ${et}, so x = ${tex(x)}.`,
        [`Write both as powers of ${base}: ${b} = ${base}${sup(eb)}, ${t} = ${base}${sup(et)}.`, `Then ${eb}x = ${et}.`, `x = ${tex(x)}.`], { placeholder: 'e.g. 3/2' });
    }
    const x = rng.int(1, 4);
    return num(`Solve 2ˣ = {{1/${2 ** x}}}.`, -x, `{{1/${2 ** x}}} = 2${sup(-x)}, because a negative index means “one over”. So x = −${x}.`, [`${2 ** x} = 2${sup(x)}.`, `So {{1/${2 ** x}}} = 2${sup(-x)}.`, `x = −${x}.`], { keypad: false });
  },

  // ---- algebraic fractions -----------------------------------------------------------------------
  y8nAlgFrac(level, rng) {
    if (level === 1) {
      let a = rng.int(2, 12), b = rng.int(2, 12);
      while (a === b) b = rng.int(2, 12);
      const m = rng.int(2, 5), n = rng.int(1, m - 1), g = gcd(a, b);
      const top = a / g, bot = b / g, e = m - n;
      const xe = e === 1 ? 'x' : `x${sup(e)}`;
      const right = bot === 1 ? `${top === 1 ? '' : top}${xe}` : `{{${top === 1 ? '' : top}${xe}/${bot}}}`;
      const wrongs = bot === 1
        ? [`${co(top)}x${sup(m + n)}`, `{{${top}/${xe}}}`, `${a}${xe}`, e === 1 ? `${co(top)}x²` : `${co(top)}x`]
        : [`{{${co(top)}x${sup(m + n)}/${bot}}}`, `{{${top}/${bot}${xe}}}`, `{{${bot}${xe}/${top}}}`, e === 1 ? `{{${co(top)}x²/${bot}}}` : `{{${co(top)}x/${bot}}}`];
      return choice(`Simplify fully: {{${a}x${sup(m)}/${b}x${n === 1 ? '' : sup(n)}}}`, right, wrongs, rng, { explain: `Cancel the numbers by their HCF (${g}) and the x’s by subtracting the indices: x${sup(m)} ÷ x${n === 1 ? '' : sup(n)} = ${xe}.`, steps: [`Numbers: {{${a}/${b}}} = {{${top}/${bot}}}.`, `Letters: x${sup(m)} ÷ x${n === 1 ? '' : sup(n)} = ${xe}.`, `Answer: ${right.replace(/[{}]/g, '')}.`] });
    }
    if (level === 2) {
      let a = rng.int(2, 7), b = rng.int(2, 9);
      while (a === b) b = rng.int(2, 9);
      const plus = rng.chance(0.6);
      const f = plus ? F(1, a).add(F(1, b)) : F(1, a).sub(F(1, b));
      const frx = (c, d) => `{{${c < 0 ? '−' : ''}${Math.abs(c) === 1 ? '' : Math.abs(c)}x/${d}}}`;
      const right = frx(f.n, f.d);
      const wrongs = plus ? [`{{2x/${a + b}}}`, `{{x/${a * b}}}`, `{{2x/${a * b}}}`, `{{x/${a + b}}}`] : [`{{x/${Math.abs(b - a)}}}`, frx(-f.n, f.d), `{{x/${a * b}}}`, `{{x/${a + b}}}`];
      return choice(`Write as a single fraction: {{x/${a}}} ${plus ? '+' : '−'} {{x/${b}}}`, right, wrongs.filter(Boolean), rng, {
        explain: `Use a common denominator: {{x/${a}}} = {{${b}x/${a * b}}} and {{x/${b}}} = {{${a}x/${a * b}}}. ${b} ${plus ? '+' : '−'} ${a} = ${plus ? a + b : b - a}, so the result is {{${plus ? a + b : b - a}x/${a * b}}}, which simplifies to ${right}.`.replace('{{-', '{{−'),
        steps: [`Common denominator ${a * b}.`, `{{${b}x/${a * b}}} ${plus ? '+' : '−'} {{${a}x/${a * b}}} = {{${plus ? a + b : b - a}x/${a * b}}}.`.replace('{{-', '{{−'), `Simplify if you can: ${right}.`],
      });
    }
    const kind = rng.pick(['common', 'dots', 'quad', 'const']);
    const k = rng.int(2, 9);
    if (kind === 'common') return choice(`Simplify {{x² + ${k}x/x}}.`, `x + ${k}`, [`x² + ${k}`, `${k}x`, `x + ${k}x`, `${k + 1}x`], rng, { explain: `Factorise the top: x² + ${k}x = x(x + ${k}). Cancel the common factor x: x + ${k}.`, steps: ['Factorise the numerator first.', `x² + ${k}x = x(x + ${k}).`, `Cancel x: x + ${k}.`] });
    if (kind === 'dots') return choice(`Simplify {{x² − ${k * k}/x + ${k}}}.`, `x − ${k}`, [`x + ${k}`, `x − ${k * k}`, `x² − ${k}`, `{{x − ${k}/x + ${k}}}`], rng, { explain: `x² − ${k * k} is a difference of two squares: (x + ${k})(x − ${k}). Cancel (x + ${k}): x − ${k}.`, steps: [`x² − ${k * k} = (x + ${k})(x − ${k}).`, `The (x + ${k}) on top and bottom cancel.`, `x − ${k}.`] });
    if (kind === 'quad') {
      let p = rng.int(1, 6), q = rng.int(1, 6);
      while (p === q) q = rng.int(1, 6);
      return choice(`Simplify {{x² + ${p + q}x + ${p * q}/x + ${p}}}.`, `x + ${q}`, [`x + ${p}`, `x + ${p + q}`, `x + ${p * q}`, `x² + ${q}`], rng, { explain: `Factorise: x² + ${p + q}x + ${p * q} = (x + ${p})(x + ${q}). Cancel (x + ${p}): x + ${q}.`, steps: [`Find two numbers that multiply to ${p * q} and add to ${p + q}: ${p} and ${q}.`, `(x + ${p})(x + ${q}) ÷ (x + ${p}).`, `x + ${q}.`] });
    }
    const c = rng.int(2, 6);
    return choice(`Simplify {{${c}x + ${c * k}/x + ${k}}}.`, `${c}`, [`${c}x`, `${c * k}`, `x + ${c}`, `{{${c}/x}}`], rng, { explain: `Take out the common factor: ${c}x + ${c * k} = ${c}(x + ${k}). Cancel (x + ${k}): ${c}.`, steps: ['Factorise the top.', `${c}(x + ${k}) ÷ (x + ${k}).`, `= ${c}.`] });
  },

  // ---- harder factorising and expanding --------------------------------------------------------------
  y8nFactor2(level, rng) {
    if (level === 1) {
      let a = rng.int(2, 9), b = rng.int(2, 12);
      const g0 = rng.int(2, 4);
      a *= g0; b *= g0;
      const g = gcd(a, b), A = a / g, B = b / g;
      const right = `${g === 1 ? '' : g}x(${A === 1 ? '' : A}x + ${B})`;
      return choice(`Factorise fully: ${a}x² + ${b}x`, right, [`${g}(${A === 1 ? '' : A}x² + ${B}x)`, `x(${a}x + ${b})`, `${g}x(${A}x + ${b})`, `${g}x²(${A} + ${B}x)`].filter((t) => t !== right), rng, {
        explain: `The highest common factor of ${a}x² and ${b}x is ${g}x. ${a}x² ÷ ${g}x = ${A === 1 ? '' : A}x and ${b}x ÷ ${g}x = ${B}: ${right}.`, steps: [`HCF of ${a} and ${b} is ${g}; both terms contain x.`, `Take out ${g}x.`, `${right}. Expand to check.`],
      });
    }
    if (level === 2) {
      const k = rng.int(2, 12);
      if (rng.chance(0.6)) return alg(`Factorise x² − ${k * k}.`, `(x + ${k})(x - ${k})`, [`(x - ${k})(x + ${k})`, `(${k} + x)(x - ${k})`, `(x - ${k})(${k} + x)`], `This is a difference of two squares: a² − b² = (a + b)(a − b), with a = x and b = ${k}.`, [`x² − ${k * k} = x² − ${k}².`, 'a² − b² = (a + b)(a − b).', `(x + ${k})(x − ${k}).`], { placeholder: 'e.g. (x + 3)(x − 3)' });
      let a = rng.int(2, 5), b = rng.int(1, 9);
      while (gcd(a, b) !== 1) b = rng.int(1, 9);
      return alg(`Factorise ${a * a}x² − ${b * b}.`, `(${a}x + ${b})(${a}x - ${b})`, [`(${a}x - ${b})(${a}x + ${b})`], `${a * a}x² = (${a}x)² and ${b * b} = ${b}², so it is a difference of two squares: (${a}x + ${b})(${a}x − ${b}).`, [`${a * a}x² = (${a}x)².`, `${b * b} = ${b}².`, `(${a}x + ${b})(${a}x − ${b}).`], { placeholder: 'e.g. (2x + 3)(2x − 3)' });
    }
    const a = rng.int(2, 6), b = rng.int(-9, 9) || 4, c = rng.int(2, 5), d = rng.int(1, 4), e = rng.int(-8, 8) || -3;
    const p = rng.int(-6, 6) || 2;
    // a(bx + e) − c(dx + p)
    const xc = a * b - c * d, kc = a * e - c * p;
    if (xc === 0) return G.y8nFactor2(level, rng);
    const { answer, accept } = expr([[xc, 'x'], [kc, '']]);
    return alg(`Expand and simplify ${a}(${lin(b, e)}) − ${c}(${lin(d, p)}).`, answer, accept,
      `${a}(${lin(b, e)}) = ${lin(a * b, a * e)}. −${c}(${lin(d, p)}) = ${lin(-c * d, -c * p)} (the minus multiplies both terms). Collect: ${show(answer)}.`,
      [`${a} × each term: ${lin(a * b, a * e)}.`, `−${c} × each term: ${lin(-c * d, -c * p)}.`, `Collect like terms: ${show(answer)}.`]);
  },

  // ---- equations with fractions, and forming equations ---------------------------------------------
  y8nEqFrac(level, rng) {
    if (level === 1) {
      const a = rng.int(2, 9), x = a * rng.int(1, 12) * (rng.chance(0.15) ? -1 : 1), b = rng.int(1, 15);
      if (rng.chance(0.5)) return num(`Solve {{x/${a}}} + ${b} = ${x / a + b}.`, x, `Subtract ${b}: {{x/${a}}} = ${neg(x / a)}. Multiply by ${a}: x = ${neg(x)}.`, [`Undo the + ${b}: {{x/${a}}} = ${neg(x / a)}.`, `Undo the ÷ ${a}: multiply by ${a}.`, `x = ${neg(x)}.`], { keypad: x >= 0 });
      const c = rng.int(2, 9), y = c * rng.int(1, 10) - b;
      return num(`Solve {{x + ${b}/${c}}} = ${(y + b) / c}.`, y, `Multiply by ${c}: x + ${b} = ${y + b}. Subtract ${b}: x = ${neg(y)}.`, [`Multiply both sides by ${c}: x + ${b} = ${y + b}.`, `Subtract ${b}.`, `x = ${neg(y)}.`], { keypad: y >= 0 });
    }
    if (level === 2) {
      if (rng.chance(0.5)) {
        let m = rng.int(2, 6), n = rng.int(2, 7);
        while (m === n) n = rng.int(2, 7);
        const k = rng.int(1, 6), x = rng.int(-4, 12), a = m * k - x, b = n * k - x;
        return num(`Solve {{x + ${a}/${m}}} = {{x + ${b}/${n}}}.`.replace(/\+ -/g, '− '), x, `Cross-multiply: ${n}(x + ${a}) = ${m}(x + ${b}), so ${n}x + ${n * a} = ${m}x + ${m * b}. Then ${neg(n - m)}x = ${neg(m * b - n * a)}, x = ${neg(x)}.`.replace(/\+ -/g, '− '),
          [`Multiply both sides by ${m} × ${n} (or cross-multiply).`, `${n}x + ${n * a} = ${m}x + ${m * b}.`.replace(/\+ -/g, '− '), `Collect: ${neg(n - m)}x = ${neg(m * b - n * a)}, so x = ${neg(x)}.`], { keypad: x >= 0 });
      }
      let a = rng.int(2, 6), b = rng.int(2, 8);
      while (a === b) b = rng.int(2, 8);
      const L = (a * b) / gcd(a, b), x = L * rng.int(1, 4), c = x / a + x / b;
      return num(`Solve {{x/${a}}} + {{x/${b}}} = ${c}.`, x, `Multiply every term by ${L}: ${L / a}x + ${L / b}x = ${c * L}, so ${L / a + L / b}x = ${c * L} and x = ${x}.`, [`The LCM of ${a} and ${b} is ${L}.`, `× ${L}: ${L / a}x + ${L / b}x = ${c * L}.`, `${L / a + L / b}x = ${c * L}, x = ${x}.`]);
    }
    const kind = rng.pick(['triangle', 'rectangle', 'ages']);
    if (kind === 'triangle') {
      for (;;) {
        const p = rng.int(1, 3), q = rng.int(1, 4), r = rng.int(1, 3), u = rng.int(-30, 30), w = rng.int(-30, 30);
        const s = p + q + r, rest = 180 - u - w;
        if (rest % s) continue;
        const x = rest / s, A = [p * x, q * x + u, r * x + w];
        if (x < 5 || A.some((t) => t <= 0)) continue;
        return num(`The angles of a triangle are ${lin(p, 0)}, ${lin(q, u)} and ${lin(r, w)} degrees. Find x.`, x, `Angles in a triangle add to 180°: ${lin(s, u + w)} = 180, so ${s}x = ${rest} and x = ${x}. (The angles are ${A.join('°, ')}°.)`,
          ['Angles in a triangle sum to 180°.', `${lin(p, 0)} + (${lin(q, u)}) + (${lin(r, w)}) = ${lin(s, u + w)}.`, `${lin(s, u + w)} = 180 → x = ${x}.`]);
      }
    }
    if (kind === 'rectangle') {
      const a = rng.int(2, 4), b = rng.int(1, 9), c = rng.int(1, 3), d = rng.int(1, 6), x = rng.int(2, 12);
      const P = 2 * (a * x + b + c * x + d);
      return num(`A rectangular wrestling ring has length (${lin(a, b)}) m and width (${lin(c, d)}) m. Its perimeter is ${P} m. Find x.`, x, `Perimeter = 2(${lin(a, b)} + ${lin(c, d)}) = ${lin(2 * (a + c), 2 * (b + d))} = ${P}. So ${2 * (a + c)}x = ${P - 2 * (b + d)} and x = ${x}.`,
        ['Perimeter = 2 × (length + width).', `2(${lin(a + c, b + d)}) = ${lin(2 * (a + c), 2 * (b + d))}.`, `${lin(2 * (a + c), 2 * (b + d))} = ${P} → x = ${x}.`]);
    }
    const t = rng.int(5, 15), mult = rng.int(2, 4), diff = rng.int(1, 9), sum = t + mult * t + diff;
    return num(`Mira is ${diff} years older than ${mult} times Theo’s age. Together their ages add up to ${sum}. How old is Theo?`, t, `Let Theo be x. Mira is ${mult}x + ${diff}. x + ${mult}x + ${diff} = ${sum}, so ${mult + 1}x = ${sum - diff} and x = ${t}.`,
      ['Let Theo’s age be x.', `Mira: ${mult}x + ${diff}. Total: ${mult + 1}x + ${diff} = ${sum}.`, `${mult + 1}x = ${sum - diff}, x = ${t}.`]);
  },

  // ---- trial and improvement, and iteration ------------------------------------------------------
  y8nIteration(level, rng) {
    if (level === 1) {
      const a = rng.int(1, 6), n = rng.int(1, 6);
      const f = (x) => x ** 3 + a * x, lo = f(n), hi = f(n + 1);
      const T = rng.int(lo + 1, hi - 1);
      return num(`The equation x³ + ${co(a)}x = ${T} has a solution between two consecutive whole numbers. What is the smaller of the two?`, n, `Try whole numbers: ${n}³ + ${a} × ${n} = ${lo} (too small) and ${n + 1}³ + ${a} × ${n + 1} = ${hi} (too big). So x is between ${n} and ${n + 1}.`,
        [`Substitute whole numbers into x³ + ${co(a)}x.`, `x = ${n} gives ${lo}, x = ${n + 1} gives ${hi}.`, `${T} lies between, so the solution is between ${n} and ${n + 1}.`]);
    }
    if (level === 2) {
      const c = rng.int(2, 20), x0 = rng.int(0, 12);
      const x1 = F(x0 + c, 2), x2 = x1.add(c).div(2);
      return num(`Use the iteration formula xₙ₊₁ = {{xₙ + ${c}/2}} with x₀ = ${x0}. What is x₂?`, val(x2), `x₁ = (${x0} + ${c}) ÷ 2 = ${say(x1)}. x₂ = (${say(x1)} + ${c}) ÷ 2 = ${say(x2)}.`, ['Substitute x₀ to get x₁.', `x₁ = ${say(x1)}.`, `Substitute x₁: x₂ = ${say(x2)}.`]);
    }
    const c = rng.int(1, 4), x0 = rng.int(1, 3);
    const x1 = F(c).add(F(1, x0)), x2 = F(c).add(F(x1.d, x1.n));
    return num(`Use xₙ₊₁ = ${c} + {{1/xₙ}} with x₀ = ${x0}. What is x₂? Give it as a fraction.`, x2.toString(), `x₁ = ${c} + {{1/${x0}}} = ${tex(x1)}. x₂ = ${c} + 1 ÷ ${tex(x1)} = ${c} + ${tex(F(x1.d, x1.n))} = ${tex(x2)}.`,
      [`x₁ = ${c} + 1 ÷ ${x0} = ${tex(x1)}.`, `1 ÷ ${tex(x1)} = ${tex(F(x1.d, x1.n))} (flip it).`, `x₂ = ${c} + ${tex(F(x1.d, x1.n))} = ${tex(x2)}.`], { placeholder: 'e.g. 7/3' });
  },

  // ---- functions and inverse functions --------------------------------------------------------------
  y8nFunctions(level, rng) {
    const a = rng.int(2, 7), b = rng.int(-9, 12) || 5;
    const f = `f(x) = ${lin(a, b)}`;
    if (level === 1) {
      const k = rng.int(-5, 9);
      if (rng.chance(0.65)) return num(`${f}. Work out f(${neg(k)}).`, a * k + b, `Replace x with ${neg(k)}: ${a} × ${paren(k)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${neg(a * k + b)}.`, [`f(${neg(k)}) means put x = ${neg(k)}.`, `${a} × ${paren(k)} = ${neg(a * k)}.`, `${b < 0 ? '−' : '+'} ${Math.abs(b)} → ${neg(a * k + b)}.`], { keypad: a * k + b >= 0 });
      const c = rng.int(1, 20);
      return num(`g(x) = x² − ${c}. Work out g(${neg(k)}).`, k * k - c, `${paren(k)}² = ${k * k}; ${k * k} − ${c} = ${neg(k * k - c)}.`, [`Square first: ${paren(k)}² = ${k * k} (a negative squared is positive).`, `Then subtract ${c}.`, `= ${neg(k * k - c)}.`], { keypad: k * k - c >= 0 });
    }
    if (level === 2) {
      if (rng.chance(0.5)) {
        const right = `{{x ${b < 0 ? '+' : '−'} ${Math.abs(b)}/${a}}}`;
        return choice(`${f}. Which is the inverse function f⁻¹(x)?`, right, [`{{x ${b < 0 ? '−' : '+'} ${Math.abs(b)}/${a}}}`, lin(a, -b), `{{x/${a}}} ${b < 0 ? '+' : '−'} ${Math.abs(b)}`, `{{1/${lin(a, b)}}}`], rng, {
          explain: `f multiplies by ${a} then ${b < 0 ? 'subtracts' : 'adds'} ${Math.abs(b)}. The inverse undoes these in reverse order: ${b < 0 ? 'add' : 'subtract'} ${Math.abs(b)}, then divide by ${a}.`, steps: [`Write y = ${lin(a, b)}.`, `Rearrange for x: x = (y ${b < 0 ? '+' : '−'} ${Math.abs(b)}) ÷ ${a}.`, `Swap y for x: f⁻¹(x) = (x ${b < 0 ? '+' : '−'} ${Math.abs(b)}) ÷ ${a}.`],
        });
      }
      const x = rng.int(-4, 10), y = a * x + b;
      return num(`${f}. Find f⁻¹(${neg(y)}).`, x, `f⁻¹(${neg(y)}) is the input that gives ${neg(y)}: ${lin(a, b)} = ${neg(y)}, so ${a}x = ${neg(y - b)} and x = ${neg(x)}.`, [`Solve ${lin(a, b)} = ${neg(y)}.`, `${a}x = ${neg(y - b)}.`, `x = ${neg(x)}.`], { keypad: x >= 0 });
    }
    const k = rng.int(-4, 5);
    if (rng.chance(0.5)) return num(`${f} and g(x) = x². Work out fg(${neg(k)}). (Do g first.)`, a * k * k + b, `g(${neg(k)}) = ${k * k}. Then f(${k * k}) = ${a} × ${k * k} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${neg(a * k * k + b)}.`, [`fg(x) means f(g(x)): do g first.`, `g(${neg(k)}) = ${k * k}.`, `f(${k * k}) = ${neg(a * k * k + b)}.`], { keypad: a * k * k + b >= 0 });
    const inner = a * k + b;
    return num(`${f} and g(x) = x². Work out gf(${neg(k)}). (Do f first.)`, inner * inner, `f(${neg(k)}) = ${neg(inner)}. Then g(${neg(inner)}) = ${paren(inner)}² = ${inner * inner}.`, ['gf(x) means g(f(x)): do f first.', `f(${neg(k)}) = ${neg(inner)}.`, `g(${neg(inner)}) = ${inner * inner}.`]);
  },

  // ---- graphs of quadratics, cubics and reciprocals -----------------------------------------------
  y8nCurves(level, rng) {
    const sample = (fn, lo, hi, step = 0.1) => {
      const paths = [[]];
      for (let x = lo; x <= hi + 1e-9; x += step) {
        const y = fn(x);
        if (!Number.isFinite(y) || Math.abs(y) > 50) { if (paths.at(-1).length) paths.push([]); continue; }
        paths.at(-1).push([Math.round(x * 100) / 100, Math.round(y * 100) / 100]);
      }
      return paths.filter((p) => p.length > 1);
    };
    if (level === 1) {
      const kind = rng.pick(['quadratic', 'cubic', 'reciprocal', 'linear']);
      const k = rng.int(1, 4);
      const eq = { quadratic: `y = x² − ${k}`, cubic: `y = x³ − ${co(k)}x`, reciprocal: `y = {{${k + 1}/x}}`, linear: `y = ${co(k)}x − 1` };
      const fn = { quadratic: (x) => x * x - k, cubic: (x) => x ** 3 - k * x, reciprocal: (x) => (Math.abs(x) < 0.05 ? NaN : (k + 1) / x), linear: (x) => k * x - 1 };
      return choice('Which equation could this graph show?', eq[kind], Object.entries(eq).filter(([t]) => t !== kind).map(([, e]) => e), rng, {
        explain: { quadratic: 'An x² graph is a U-shaped parabola, symmetrical about a vertical line.', cubic: 'An x³ graph has an S-shape: it rises, wobbles and rises again (or the reverse).', reciprocal: 'A {{k/x}} graph has two separate branches and never touches the axes.', linear: 'A linear graph is a straight line.' }[kind],
        steps: ['Straight line: linear. U shape: quadratic.', 'S shape: cubic. Two separate curves near the axes: reciprocal.', `This one is ${kind}: ${eq[kind].replace(/[{}]/g, '')}.`],
        diagram: { type: 'curve', range: [-5, 5], paths: sample(fn[kind], -5, 5) },
      });
    }
    if (level === 2) {
      if (rng.chance(0.5)) {
        let p = rng.int(1, 6), q = rng.int(1, 6);
        while (p === q) q = rng.int(1, 6);
        const pos = rng.chance(0.5);
        return num(`The graph of y = (x − ${p})(x + ${q}) crosses the x-axis twice. What is the ${pos ? 'positive' : 'negative'} root?`, pos ? p : -q, `y = 0 when x − ${p} = 0 or x + ${q} = 0, so the roots are x = ${p} and x = −${q}.`, ['The graph crosses the x-axis where y = 0.', `(x − ${p})(x + ${q}) = 0 means one bracket is zero.`, `x = ${p} or x = −${q}.`], { keypad: pos });
      }
      const b = rng.int(-5, 5) || 3, c = rng.int(-6, 6) || -2, x = rng.int(-3, 3);
      const y = x * x + b * x + c;
      return num(`Complete the table for y = x² ${b < 0 ? '−' : '+'} ${co(Math.abs(b))}x ${c < 0 ? '−' : '+'} ${Math.abs(c)}: what is y when x = ${neg(x)}?`, y, `${paren(x)}² ${b < 0 ? '−' : '+'} ${Math.abs(b)} × ${paren(x)} ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${x * x} ${b * x < 0 ? '−' : '+'} ${Math.abs(b * x)} ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${neg(y)}.`, [`Square first: ${paren(x)}² = ${x * x}.`, `${b < 0 ? '−' : ''}${Math.abs(b)} × ${paren(x)} = ${neg(b * x)}.`, `Add up: ${neg(y)}.`], { keypad: y >= 0 });
    }
    const a = rng.int(-5, 5) || 2, bq = rng.int(-6, 6) || 3;
    if (rng.chance(0.5)) return pairQ(`What are the coordinates of the turning point of y = (x ${a < 0 ? '+' : '−'} ${Math.abs(a)})² ${bq < 0 ? '−' : '+'} ${Math.abs(bq)}?`, [a, bq], `(x ${a < 0 ? '+' : '−'} ${Math.abs(a)})² is smallest (zero) when x = ${neg(a)}, giving y = ${neg(bq)}. Turning point (${neg(a)}, ${neg(bq)}).`, ['A square is never negative, so its smallest value is 0.', `That happens when x = ${neg(a)}.`, `Then y = ${neg(bq)}: the minimum point is (${neg(a)}, ${neg(bq)}).`]);
    const c = bq + a * a;
    return pairQ(`By completing the square, find the turning point of y = x² ${a > 0 ? '−' : '+'} ${Math.abs(2 * a)}x ${c < 0 ? '−' : '+'} ${Math.abs(c)}.`, [a, bq], `x² ${a > 0 ? '−' : '+'} ${Math.abs(2 * a)}x = (x ${a > 0 ? '−' : '+'} ${Math.abs(a)})² − ${a * a}. So y = (x ${a > 0 ? '−' : '+'} ${Math.abs(a)})² ${bq < 0 ? '−' : '+'} ${Math.abs(bq)}, with turning point (${neg(a)}, ${neg(bq)}).`,
      [`Halve the x coefficient: ${neg(-a)}.`, `(x ${a > 0 ? '−' : '+'} ${Math.abs(a)})² = x² ${a > 0 ? '−' : '+'} ${Math.abs(2 * a)}x + ${a * a}, so subtract ${a * a}.`, `${c} − ${a * a} = ${neg(bq)}: turning point (${neg(a)}, ${neg(bq)}).`]);
  },

  // ---- distance–time and real-life graphs ----------------------------------------------------------
  y8nRealGraphs(level, rng) {
    for (;;) {
      const t1 = rng.int(1, 3), rest = rng.int(1, 2), t3 = rng.int(1, 3);
      const d1 = rng.int(2, 8) * 4;
      const back = rng.chance(0.5);
      const d3 = back ? 0 : d1 + rng.int(1, 5) * 4;
      if (t1 + rest + t3 > 7) continue;
      const xs = [], ys = [];
      for (let h = 0; h <= t1 + rest + t3; h++) {
        xs.push(String(h));
        ys.push(h <= t1 ? (d1 * h) / t1 : h <= t1 + rest ? d1 : d1 + ((d3 - d1) * (h - t1 - rest)) / t3);
      }
      if (ys.some((y) => !Number.isInteger(y) || y % 4)) continue;
      const dg = { type: 'line', title: 'Theo’s journey to the games at Olympia', xs, ys, ylabel: 'km' };
      const v1 = d1 / t1, v3 = Math.abs(d3 - d1) / t3;
      if (level === 1) {
        if (rng.chance(0.5)) return num('The graph shows Theo’s distance from home (km) against time (hours). For how many hours did he stop?', rest, `The flat part of the graph means his distance was not changing: from ${t1} to ${t1 + rest} hours, ${rest} hour${rest > 1 ? 's' : ''}.`, ['A horizontal line means no movement.', `It runs from ${t1} h to ${t1 + rest} h.`, `${rest} hour${rest > 1 ? 's' : ''}.`], { diagram: dg, unit: 'hours' });
        return num('The graph shows Theo’s distance from home (km) against time (hours). How far from home was he when he stopped?', d1, `The flat section is at ${d1} km.`, ['Find the horizontal section.', 'Read across to the distance axis.', `${d1} km.`], { diagram: dg, unit: 'km' });
      }
      if (level === 2) {
        if (rng.chance(0.5)) return num('What was Theo’s speed during the first part of the journey, in km/h?', v1, `Gradient = distance ÷ time = ${d1} ÷ ${t1} = ${v1} km/h.`, ['Speed is the gradient of a distance–time graph.', `He went ${d1} km in ${t1} hour${t1 > 1 ? 's' : ''}.`, `${d1} ÷ ${t1} = ${v1} km/h.`], { diagram: dg, unit: 'km/h' });
        if (!Number.isInteger(v3)) continue;
        return num(`What was Theo’s speed during the last part of the journey, in km/h?`, v3, `In the last part the distance changes by ${Math.abs(d3 - d1)} km in ${t3} hour${t3 > 1 ? 's' : ''}: ${Math.abs(d3 - d1)} ÷ ${t3} = ${v3} km/h.${back ? ' (The line slopes down because he is heading home.)' : ''}`, ['Find the change in distance and the time it took.', `${Math.abs(d3 - d1)} km in ${t3} h.`, `${v3} km/h.`], { diagram: dg, unit: 'km/h' });
      }
      const total = d1 + Math.abs(d3 - d1), T = t1 + rest + t3, avg = F(total, T);
      if (!fdec(avg)) continue;
      return num('What was Theo’s average speed for the whole journey, including the stop, in km/h?', val(avg), `Total distance travelled = ${d1} + ${Math.abs(d3 - d1)} = ${total} km. Total time = ${T} hours. Average speed = ${total} ÷ ${T} = ${say(avg)} km/h.`, ['Average speed = total distance ÷ total time.', `Distance ${total} km; time ${T} h (the stop counts).`, `${total} ÷ ${T} = ${say(avg)} km/h.`], { diagram: dg, unit: 'km/h' });
    }
  },

  // ---- similarity: length, area and volume scale factors ----------------------------------------
  y8nSimilar(level, rng) {
    if (level === 1) {
      const k = rng.pick([F(2), F(3), F(3, 2), F(5, 2), F(4)]);
      let a = rng.int(2, 9), b = rng.int(2, 12);
      if (k.d === 2) { a *= 2; b *= 2; }
      while (a === b) b += 2;
      const A2 = k.mul(a), B2 = k.mul(b);
      return num(`A model of the Parthenon is similar to the real temple plan. On the model two sides are ${a} cm and ${b} cm. On a larger similar model the ${a} cm side is ${say(A2)} cm. How long is the other side?`, val(B2), `Scale factor = ${say(A2)} ÷ ${a} = ${say(k)}. So the other side is ${b} × ${say(k)} = ${say(B2)} cm.`,
        ['Similar shapes: every length is multiplied by the same scale factor.', `Scale factor = ${say(A2)} ÷ ${a} = ${say(k)}.`, `${b} × ${say(k)} = ${say(B2)} cm.`], { unit: 'cm' });
    }
    if (level === 2) {
      const k = rng.int(2, 5), A = rng.int(3, 30);
      if (rng.chance(0.5)) return num(`A statue is enlarged by scale factor ${k}. The area of its base was ${A} cm². What is the area of the enlarged base?`, A * k * k, `Lengths × ${k}, so areas × ${k}² = ${k * k}: ${A} × ${k * k} = ${A * k * k} cm².`, [`Length scale factor ${k}.`, `Area scale factor ${k}² = ${k * k}.`, `${A} × ${k * k} = ${A * k * k} cm².`], { unit: 'cm²' });
      return num(`Two similar shields have areas ${A} cm² and ${A * k * k} cm². What is the length scale factor from the smaller to the larger?`, k, `Area scale factor = ${A * k * k} ÷ ${A} = ${k * k}. Length scale factor = √${k * k} = ${k}.`, ['Find the area scale factor first.', `${A * k * k} ÷ ${A} = ${k * k}.`, `Square root it: ${k}.`]);
    }
    const [p, q] = rng.pick([[2, 1], [3, 1], [3, 2], [4, 3], [5, 2], [4, 1]]);
    const unitV = rng.int(1, 4), Vs = unitV * q ** 3, Vl = unitV * p ** 3, hs = q * rng.int(2, 6);
    if (rng.chance(0.5)) return num(`Two similar amphorae have volumes ${Vs} litres and ${Vl} litres. The smaller one is ${hs} cm tall. How tall is the larger one?`, (hs * p) / q, `Volume scale factor = {{${Vl}/${Vs}}} = {{${p ** 3}/${q ** 3}}}, so the length scale factor is the cube root: {{${p}/${q}}}. Height = ${hs} × {{${p}/${q}}} = ${(hs * p) / q} cm.`,
      [`Volume scale factor {{${Vl}/${Vs}}} = {{${p ** 3}/${q ** 3}}}.`, `Cube root for lengths: {{${p}/${q}}}.`, `${hs} × {{${p}/${q}}} = ${(hs * p) / q} cm.`], { unit: 'cm' });
    return num(`Two similar statues have heights in the ratio ${q} : ${p}. The smaller one has a volume of ${Vs} litres. What is the volume of the larger one?`, Vl, `Length ratio ${q} : ${p}, so volume ratio ${q}³ : ${p}³ = ${q ** 3} : ${p ** 3}. ${Vs} × {{${p ** 3}/${q ** 3}}} = ${Vl} litres.`, [`Cube the length ratio: ${q ** 3} : ${p ** 3}.`, `Multiply ${Vs} by {{${p ** 3}/${q ** 3}}}.`, `= ${Vl} litres.`], { unit: 'litres' });
  },

  // ---- circles: parts, arcs and sectors -------------------------------------------------------------
  y8nSectors(level, rng) {
    if (level === 1) {
      const parts = [['chord', 'a straight line joining two points on the circle'], ['tangent', 'a straight line that touches the circle at exactly one point'], ['arc', 'part of the circumference'], ['sector', 'a “pizza slice” between two radii and an arc'], ['segment', 'the region between a chord and an arc'], ['diameter', 'a chord through the centre'], ['circumference', 'the distance all the way round the circle']];
      const [name, def] = rng.pick(parts);
      return choice(`What is the name for ${def}?`, `a${'aeiou'.includes(name[0]) ? 'n' : ''} ${name}`, parts.filter(([n]) => n !== name).map(([n]) => `a${'aeiou'.includes(n[0]) ? 'n' : ''} ${n}`), rng, {
        explain: `${name[0].toUpperCase() + name.slice(1)}: ${def}.`, steps: ['Chord: line across; diameter: chord through the centre.', 'Tangent: touches once. Arc: part of the edge.', 'Sector: slice between radii. Segment: cut off by a chord.'],
      });
    }
    const angles = [30, 36, 40, 45, 60, 72, 80, 90, 120, 135, 144, 150, 240, 270];
    if (level === 2) {
      for (;;) {
        const deg = rng.pick(angles), r = rng.int(2, 12);
        if (rng.chance(0.5)) {
          const k = F(deg * r, 180);
          if (k.d > 4) continue;
          return num(`A sector has radius ${r} cm and angle ${deg}°. Its arc length is kπ cm. What is k?`, val(k), `Arc length = {{${deg}/360}} × 2π × ${r} = ${say(k)}π cm.`, ['Arc length = {{θ/360}} × 2πr.', `{{${deg}/360}} × 2 × ${r} = ${say(k)}.`, `So k = ${say(k)}.`], { diagram: { type: 'sector', r, deg } });
        }
        const k = F(deg * r * r, 360);
        if (k.d > 4) continue;
        return num(`A sector has radius ${r} cm and angle ${deg}°. Its area is kπ cm². What is k?`, val(k), `Area = {{${deg}/360}} × π × ${r}² = {{${deg}/360}} × ${r * r}π = ${say(k)}π cm².`, ['Sector area = {{θ/360}} × πr².', `{{${deg}/360}} × ${r * r} = ${say(k)}.`, `So k = ${say(k)}.`], { diagram: { type: 'sector', r, deg } });
      }
    }
    for (;;) {
      const deg = rng.pick(angles), r = rng.int(3, 15);
      if (rng.chance(0.5)) {
        const arc = F(628 * deg * r, 36000), P = arc.add(2 * r);
        if (!fdec(P) || fdec(P).split('.')[1]?.length > 2) continue;
        return num(`A fan-shaped mosaic is a sector of radius ${r} cm with angle ${deg}°. Using π = 3.14, what is its perimeter?`, val(P), `Arc = {{${deg}/360}} × 2 × 3.14 × ${r} = ${say(arc)} cm. Add the two radii: ${say(arc)} + ${2 * r} = ${say(P)} cm.`, ['Perimeter = arc + two radii.', `Arc = {{${deg}/360}} × 2 × 3.14 × ${r} = ${say(arc)}.`, `${say(arc)} + ${r} + ${r} = ${say(P)} cm.`], { unit: 'cm', diagram: { type: 'sector', r, deg } });
      }
      const k = F(deg * r * r, 360);
      if (k.d !== 1) continue;
      return num(`A sector of radius ${r} cm has area ${k.n}π cm². What is the angle of the sector, in degrees?`, deg, `{{θ/360}} × π × ${r}² = ${k.n}π, so {{θ/360}} = {{${k.n}/${r * r}}} and θ = ${deg}°.`, [`Set {{θ/360}} × ${r * r}π = ${k.n}π.`, `{{θ/360}} = {{${k.n}/${r * r}}}.`, `θ = 360 × {{${k.n}/${r * r}}} = ${deg}°.`], { unit: '°' });
    }
  },

  // ---- angles in polygons with algebra --------------------------------------------------------------
  y8nPolyAlg(level, rng) {
    if (level === 1) {
      for (;;) {
        const p = rng.int(1, 5), q = rng.int(1, 5), r = rng.int(1, 6), s = p + q + r;
        if (180 % s || p === q && q === r) continue;
        const x = 180 / s;
        return num(`The angles of a triangle are ${lin(p, 0)}, ${lin(q, 0)} and ${lin(r, 0)}. Find x.`, x, `${lin(s, 0)} = 180, so x = ${x}°.`, ['Angles in a triangle add to 180°.', `${p}x + ${q}x + ${r}x = ${s}x.`, `${s}x = 180, x = ${x}.`], { unit: '°' });
      }
    }
    if (level === 2) {
      const sides = rng.pick([4, 5, 6]), total = (sides - 2) * 180;
      for (;;) {
        const terms = Array.from({ length: sides }, () => [rng.int(1, 3), rng.int(-20, 40)]);
        const sx = terms.reduce((a, [c]) => a + c, 0), sc = terms.reduce((a, [, k]) => a + k, 0);
        if ((total - sc) % sx) continue;
        const x = (total - sc) / sx;
        if (x < 5 || terms.some(([c, k]) => c * x + k <= 0 || c * x + k >= 180)) continue;
        const name = { 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon' }[sides];
        return num(`The angles of a ${name} are ${terms.map(([c, k]) => `(${lin(c, k)})°`).join(', ')}. Find x.`, x, `Interior angles of a ${name} add to (${sides} − 2) × 180 = ${total}°. ${lin(sx, sc)} = ${total}, so ${sx}x = ${total - sc} and x = ${x}.`,
          [`Angle sum = (n − 2) × 180 = ${total}°.`, `Add the expressions: ${lin(sx, sc)}.`, `${lin(sx, sc)} = ${total} → x = ${x}.`]);
      }
    }
    if (rng.chance(0.5)) {
      const n = rng.pick([5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36]), I = 180 - 360 / n;
      return num(`Each interior angle of a regular polygon is ${I}°. How many sides does it have?`, n, `Exterior angle = 180 − ${I} = ${360 / n}°. Exterior angles add to 360°, so n = 360 ÷ ${360 / n} = ${n}.`, ['Interior + exterior = 180°.', `Exterior = ${360 / n}°.`, `n = 360 ÷ ${360 / n} = ${n}.`]);
    }
    for (;;) {
      const a = rng.int(2, 7), b = rng.int(-10, 30), c = rng.int(-10, 20);
      if ((180 - b - c) % (a + 1)) continue;
      const x = (180 - b - c) / (a + 1), ext = x + c, int = a * x + b;
      if (ext <= 0 || int <= 0 || 360 % ext) continue;
      return num(`In a regular polygon, each exterior angle is (${lin(1, c)})° and each interior angle is (${lin(a, b)})°. Find x.`, x, `Interior + exterior = 180: ${lin(a + 1, b + c)} = 180, so ${a + 1}x = ${180 - b - c} and x = ${x}. (Exterior ${ext}°, so the polygon has ${360 / ext} sides.)`,
        ['At each corner, interior + exterior = 180°.', `${lin(a, b)} + ${lin(1, c)} = ${lin(a + 1, b + c)}.`, `${lin(a + 1, b + c)} = 180 → x = ${x}.`]);
    }
  },

  // ---- column vectors -----------------------------------------------------------------------------
  y8nVectors(level, rng) {
    const v = () => [rng.int(-6, 6) || 2, rng.int(-6, 6) || -3];
    const a = v(), b = v();
    const dg = (list) => ({ type: 'colvec', vectors: list });
    if (level === 1) {
      const plus = rng.chance(0.6), r = plus ? [a[0] + b[0], a[1] + b[1]] : [a[0] - b[0], a[1] - b[1]];
      return pairQ(`Using the vectors shown, work out a ${plus ? '+' : '−'} b. Type the top number then the bottom number.`, r, `${plus ? 'Add' : 'Subtract'} the top numbers and the bottom numbers separately: top ${neg(a[0])} ${plus ? '+' : '−'} ${paren(b[0])} = ${neg(r[0])}, bottom ${neg(a[1])} ${plus ? '+' : '−'} ${paren(b[1])} = ${neg(r[1])}.`,
        ['Work on the top row and bottom row separately.', `Top: ${neg(a[0])} ${plus ? '+' : '−'} ${paren(b[0])} = ${neg(r[0])}.`, `Bottom: ${neg(a[1])} ${plus ? '+' : '−'} ${paren(b[1])} = ${neg(r[1])}.`], { diagram: dg([['a', ...a], ['b', ...b]]), placeholder: 'top, bottom' });
    }
    if (level === 2) {
      const m = rng.int(2, 4), n = rng.int(1, 3) * (rng.chance(0.5) ? -1 : 1);
      const r = [m * a[0] + n * b[0], m * a[1] + n * b[1]];
      const nb = n < 0 ? `− ${-n === 1 ? '' : -n}b` : `+ ${n === 1 ? '' : n}b`;
      return pairQ(`Work out ${m}a ${nb}. Type the top number then the bottom number.`, r, `${m}a = (${neg(m * a[0])}, ${neg(m * a[1])}); ${n}b = (${neg(n * b[0])}, ${neg(n * b[1])}). Add: (${neg(r[0])}, ${neg(r[1])}).`,
        [`Multiply each part of a by ${m}.`, `Multiply each part of b by ${n}.`, `Add the tops and the bottoms: (${neg(r[0])}, ${neg(r[1])}).`], { diagram: dg([['a', ...a], ['b', ...b]]), placeholder: 'top, bottom' });
    }
    if (rng.chance(0.5)) {
      const A = [rng.int(-5, 5), rng.int(-5, 5)], B = [rng.int(-5, 5), rng.int(-5, 5)];
      if (A[0] === B[0] && A[1] === B[1]) return G.y8nVectors(level, rng);
      const r = [B[0] - A[0], B[1] - A[1]];
      return pairQ(`A is the point (${neg(A[0])}, ${neg(A[1])}) and B is (${neg(B[0])}, ${neg(B[1])}). Write the column vector AB⃗ (top number then bottom number).`, r, `AB⃗ = B − A: top ${neg(B[0])} − ${paren(A[0])} = ${neg(r[0])}, bottom ${neg(B[1])} − ${paren(A[1])} = ${neg(r[1])}.`, ['To go from A to B, subtract A’s coordinates from B’s.', `x: ${neg(B[0])} − ${paren(A[0])} = ${neg(r[0])}.`, `y: ${neg(B[1])} − ${paren(A[1])} = ${neg(r[1])}.`], { placeholder: 'top, bottom' });
    }
    const [p, q, h] = rng.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [9, 12, 15], [8, 15, 17]]);
    const s1 = rng.chance(0.5) ? -1 : 1, s2 = rng.chance(0.5) ? -1 : 1;
    return num('What is the magnitude (length) of the vector shown?', h, `|v| = √(${paren(s1 * p)}² + ${paren(s2 * q)}²) = √(${p * p} + ${q * q}) = √${h * h} = ${h}.`, ['The vector is the hypotenuse of a right-angled triangle.', `${p}² + ${q}² = ${p * p + q * q}.`, `√${p * p + q * q} = ${h}.`], { diagram: dg([['v', s1 * p, s2 * q]]) });
  },

  // ---- sets and Venn notation -----------------------------------------------------------------------
  y8nSets(level, rng) {
    if (level === 1) {
      const N = rng.pick([12, 15, 20]), m = rng.pick([2, 3, 4, 5]);
      let k = rng.pick([2, 3, 4, 5, 6]);
      while (k === m) k = rng.pick([2, 3, 4, 5, 6]);
      const A = Array.from({ length: N }, (_, i) => i + 1).filter((x) => x % m === 0), B = Array.from({ length: N }, (_, i) => i + 1).filter((x) => x % k === 0);
      const both = A.filter((x) => B.includes(x)), either = [...new Set([...A, ...B])];
      const inter = rng.chance(0.5);
      const ans = inter ? both.length : either.length;
      return num(`ξ = {1, 2, …, ${N}}. A = multiples of ${m}, B = multiples of ${k}. How many elements are in A ${inter ? '∩' : '∪'} B?`, ans, `A = {${A.join(', ')}}, B = {${B.join(', ')}}. A ${inter ? '∩' : '∪'} B (${inter ? 'in both' : 'in either or both'}) = {${(inter ? both : either.sort((p, q) => p - q)).join(', ') || ' '}}: ${ans} elements.`,
        [`List A and B.`, `∩ means “and” (in both); ∪ means “or” (in either).`, `${ans} element${ans === 1 ? '' : 's'}.`]);
    }
    const a = rng.int(2, 15), b = rng.int(2, 15), both = rng.int(1, 10), out = rng.int(1, 12), total = a + b + both + out;
    const dg = { type: 'venn', labels: ['A', 'B'], only: [a, b], both, out };
    if (level === 2) {
      const kind = rng.pick(['union', 'notA', 'AnotB', 'xi']);
      const [q, v2, how] = { union: ['A ∪ B', a + b + both, `${a} + ${both} + ${b}`], notA: ['A′ (not in A)', b + out, `${b} + ${out}`], AnotB: ['A ∩ B′ (in A but not B)', a, `just the A-only region: ${a}`], xi: ['ξ (everything)', total, `${a} + ${both} + ${b} + ${out}`] }[kind];
      return num(`The Venn diagram shows how many of the Argonauts are in sets A and B. How many are in ${q}?`, v2, `${q}: ${how} = ${v2}.`, ['Shade the region the symbol describes.', 'Add the numbers in the shaded regions.', `${v2}.`], { diagram: dg });
    }
    const kind = rng.pick(['inter', 'union', 'given']);
    if (kind === 'given') { const f = F(both, both + b); return num(`From the Venn diagram, one person is chosen at random from those in B. What is the probability they are also in A?`, f.toString(), `Only look inside B: ${b + both} people. Of those, ${both} are also in A. P = {{${both}/${b + both}}}${f.d !== b + both ? ` = ${tex(f)}` : ''}.`, ['The “given B” narrows the choice to circle B.', `B contains ${b} + ${both} = ${b + both}.`, `${both} of them are in A: ${tex(f)}.`], { diagram: dg, placeholder: 'e.g. 3/8' }); }
    const n = kind === 'inter' ? both : a + b + both, f = F(n, total);
    return num(`One person is chosen at random. Using the Venn diagram, what is P(A ${kind === 'inter' ? '∩' : '∪'} B)?`, f.toString(), `There are ${total} people in total. ${kind === 'inter' ? `${both} are in both` : `${a} + ${both} + ${b} = ${a + b + both} are in A or B`}. P = {{${n}/${total}}}${f.d !== total ? ` = ${tex(f)}` : ''}.`, [`Total: ${total}.`, `${kind === 'inter' ? 'Both' : 'Either'}: ${n}.`, `P = ${tex(f)}.`], { diagram: dg, placeholder: 'e.g. 3/8' });
  },

  // ---- systematic counting and the product rule -------------------------------------------------------
  y8nCounting(level, rng) {
    if (level === 1) {
      const kind = rng.pick(['menu', 'code', 'outfit']);
      if (kind === 'menu') { const s = rng.int(2, 5), m = rng.int(2, 6), d = rng.int(2, 4); return num(`A feast on Olympus offers ${s} starters, ${m} main courses and ${d} desserts. How many different three-course meals are possible?`, s * m * d, `Product rule: ${s} × ${m} × ${d} = ${s * m * d}.`, ['Each choice can go with every other choice.', 'Multiply the number of options at each stage.', `${s} × ${m} × ${d} = ${s * m * d}.`]); }
      if (kind === 'code') { const k = rng.int(2, 4); return num(`Hermes locks a scroll case with a ${k}-digit code using the digits 0–9 (repeats allowed). How many codes are possible?`, 10 ** k, `${Array(k).fill(10).join(' × ')} = ${comma(10 ** k)}.`, ['Each digit has 10 choices.', `There are ${k} digits.`, `10${sup(k)} = ${comma(10 ** k)}.`]); }
      const t = rng.int(2, 6), c = rng.int(2, 5);
      return num(`Mira has ${t} tunics and ${c} cloaks. How many different outfits of one tunic and one cloak can she make?`, t * c, `${t} × ${c} = ${t * c}.`, ['For each tunic there are ' + c + ' cloaks.', `${t} lots of ${c}.`, `${t * c}.`]);
    }
    if (level === 2) {
      const kind = rng.pick(['arrange', 'norepeat', 'firstnonzero']);
      if (kind === 'arrange') { const n = rng.int(3, 6), names = ['Mira', 'Theo', 'Kit', 'Ariadne', 'Jason', 'Helen'].slice(0, n); let f = 1; for (let i = 2; i <= n; i++) f *= i; return num(`In how many different orders can ${names.join(', ').replace(/, ([^,]*)$/, ' and $1')} stand in a line?`, f, `${n} choices for first, ${n - 1} for second, … : ${Array.from({ length: n }, (_, i) => n - i).join(' × ')} = ${f}.`, ['First place: any of them. Next: one fewer.', `${Array.from({ length: n }, (_, i) => n - i).join(' × ')}.`, `= ${f} (this is ${n}!, “${n} factorial”).`]); }
      if (kind === 'norepeat') { const k = rng.int(2, 4); let p = 1; for (let i = 0; i < k; i++) p *= 10 - i; return num(`How many ${k}-digit codes can be made from 0–9 if no digit may be repeated?`, p, `${Array.from({ length: k }, (_, i) => 10 - i).join(' × ')} = ${comma(p)}.`, ['First digit: 10 choices.', 'Each later digit has one fewer choice.', `${Array.from({ length: k }, (_, i) => 10 - i).join(' × ')} = ${comma(p)}.`]); }
      const k = rng.int(2, 4);
      return num(`How many ${k}-digit whole numbers are there? (The first digit cannot be 0.)`, 9 * 10 ** (k - 1), `First digit 9 choices (1–9), the others 10 each: 9 × ${Array(k - 1).fill(10).join(' × ')} = ${comma(9 * 10 ** (k - 1))}.`, ['The first digit can’t be 0: 9 choices.', 'Every other digit: 10 choices.', `${comma(9 * 10 ** (k - 1))}.`]);
    }
    const kind = rng.pick(['handshake', 'diagonals', 'repeat', 'pairs']);
    const n = rng.int(5, 15);
    if (kind === 'handshake') return num(`At a council of ${n} heroes, everyone shakes hands with everyone else once. How many handshakes are there?`, (n * (n - 1)) / 2, `Each of the ${n} shakes ${n - 1} hands, but that counts every handshake twice: ${n} × ${n - 1} ÷ 2 = ${(n * (n - 1)) / 2}.`, [`Each person: ${n - 1} handshakes.`, `${n} × ${n - 1} = ${n * (n - 1)} counts each one twice.`, `÷ 2 = ${(n * (n - 1)) / 2}.`]);
    if (kind === 'diagonals') return num(`How many diagonals does a ${n}-sided polygon have?`, (n * (n - 3)) / 2, `From each vertex you can draw a diagonal to ${n - 3} others (not itself or its two neighbours). ${n} × ${n - 3} ÷ 2 = ${(n * (n - 3)) / 2}.`, [`Each vertex: ${n - 3} diagonals.`, `${n} × ${n - 3} = ${n * (n - 3)} counts each twice.`, `÷ 2 = ${(n * (n - 3)) / 2}.`]);
    if (kind === 'pairs') { const k = Math.min(n, 9); return num(`A team of 2 is chosen from ${k} Argonauts. How many different pairs are possible?`, (k * (k - 1)) / 2, `${k} × ${k - 1} ordered choices, but each pair is counted twice: ${(k * (k - 1)) / 2}.`, [`First person ${k} ways, second ${k - 1}.`, 'The order doesn’t matter, so divide by 2.', `${(k * (k - 1)) / 2}.`]); }
    const [word, len, rep] = rng.pick([['ATHENA', 6, 2], ['ODYSSEUS', 8, 6], ['APOLLO', 6, 4], ['HELLAS', 6, 2], ['ARTEMIS', 7, 1]]);
    let f = 1; for (let i = 2; i <= len; i++) f *= i;
    return num(`How many different arrangements are there of the letters of ${word}?`, f / rep, `${len} letters give ${len}! = ${comma(f)} orders.${rep > 1 ? ` Repeated letters make identical arrangements, so divide by ${rep}: ${comma(f / rep)}.` : ' All the letters are different.'}`, [`${len}! = ${comma(f)}.`, rep > 1 ? `Divide by ${rep} for the repeated letter${rep > 2 ? 's' : ''} (swapping them changes nothing).` : 'No letter repeats, so nothing to divide by.', `${comma(f / rep)}.`]);
  },

  // ---- tree diagrams ---------------------------------------------------------------------------------
  y8nTrees(level, rng) {
    if (level === 1) {
      const p = F(rng.int(1, 4), 5), q = F(rng.int(1, 3), 4);
      const r = p.mul(q);
      const dg = { type: 'tree', a: [['Win race', p.toString()], ['Lose', F(1).sub(p).toString()]], b: [['Win', q.toString()], ['Lose', F(1).sub(q).toString()]] };
      return num(`Kit runs two races. The probability she wins the first is ${tex(p)} and the second is ${tex(q)}, independently. What is the probability she wins both?`, r.toString(), `Multiply along the branches: ${tex(p)} × ${tex(q)} = ${tex(r)}.`, ['“And” means multiply along the branches.', `${tex(p)} × ${tex(q)}.`, `= ${tex(r)}.`], { diagram: dg, placeholder: 'e.g. 3/20' });
    }
    const r = rng.int(2, 7), b = rng.int(2, 7), n = r + b;
    if (level === 2) {
      const kind = rng.pick(['both', 'mixed']);
      const pr = F(r, n), pb = F(b, n);
      const dg = { type: 'tree', a: [['Red', pr.toString()], ['Blue', pb.toString()]], b: [['Red', pr.toString()], ['Blue', pb.toString()]] };
      if (kind === 'both') { const ans = pr.mul(pr); return num(`A bag holds ${r} red and ${b} blue counters. Theo takes one, puts it back, and takes another. What is P(both red)?`, ans.toString(), `With replacement the probabilities stay the same: {{${r}/${n}}} × {{${r}/${n}}} = ${tex(ans)}.`, ['Replaced, so the second pick has the same probabilities.', `{{${r}/${n}}} × {{${r}/${n}}}.`, `= ${tex(ans)}.`], { diagram: dg, placeholder: 'e.g. 9/25' }); }
      const ans = pr.mul(pb).mul(2);
      return num(`A bag holds ${r} red and ${b} blue counters. Theo takes one, puts it back, and takes another. What is the probability of one of each colour?`, ans.toString(), `Two routes: red then blue, or blue then red. {{${r}/${n}}} × {{${b}/${n}}} + {{${b}/${n}}} × {{${r}/${n}}} = ${tex(ans)}.`, ['Find every route that gives one of each.', 'Multiply along each route.', `Add the routes: ${tex(ans)}.`], { diagram: dg, placeholder: 'e.g. 12/25' });
    }
    const kind = rng.pick(['both', 'atleast', 'same']);
    const dg = { type: 'tree', a: [['Red', F(r, n).toString()], ['Blue', F(b, n).toString()]], b2: [[['Red', F(r - 1, n - 1).toString()], ['Blue', F(b, n - 1).toString()]], [['Red', F(r, n - 1).toString()], ['Blue', F(b - 1, n - 1).toString()]]] };
    const rr = F(r * (r - 1), n * (n - 1)), bb = F(b * (b - 1), n * (n - 1));
    if (kind === 'both') return num(`A bag holds ${r} red and ${b} blue counters. Two are taken WITHOUT replacement. What is P(both red)?`, rr.toString(), `First red: {{${r}/${n}}}. Then ${r - 1} red are left out of ${n - 1}: {{${r - 1}/${n - 1}}}. Multiply: ${tex(rr)}.`, ['Without replacement, the second branch changes.', `{{${r}/${n}}} × {{${r - 1}/${n - 1}}}.`, `= ${tex(rr)}.`], { diagram: dg, placeholder: 'e.g. 2/15' });
    if (kind === 'atleast') { const ans = F(1).sub(rr); return num(`A bag holds ${r} red and ${b} blue counters. Two are taken without replacement. What is P(at least one blue)?`, ans.toString(), `P(at least one blue) = 1 − P(both red) = 1 − ${tex(rr)} = ${tex(ans)}.`, ['“At least one” is everything except “none”.', `P(both red) = {{${r}/${n}}} × {{${r - 1}/${n - 1}}} = ${tex(rr)}.`, `1 − ${tex(rr)} = ${tex(ans)}.`], { diagram: dg, placeholder: 'e.g. 13/15' }); }
    const ans = rr.add(bb);
    return num(`A bag holds ${r} red and ${b} blue counters. Two are taken without replacement. What is the probability they are the same colour?`, ans.toString(), `P(RR) = ${tex(rr)}, P(BB) = ${tex(bb)}. Add: ${tex(ans)}.`, [`Both red: {{${r}/${n}}} × {{${r - 1}/${n - 1}}}.`, `Both blue: {{${b}/${n}}} × {{${b - 1}/${n - 1}}}.`, `Add the two routes: ${tex(ans)}.`], { diagram: dg, placeholder: 'e.g. 7/15' });
  },

  // ---- quartiles, interquartile range and box plots ---------------------------------------------------
  y8nSpread(level, rng) {
    if (level === 1) {
      const n = rng.pick([7, 11]);
      const vals = Array.from({ length: n }, () => rng.int(10, 60)).sort((p, q) => p - q);
      const q1 = vals[(n + 1) / 4 - 1], q3 = vals[(3 * (n + 1)) / 4 - 1];
      const kind = rng.pick(['lq', 'uq', 'iqr']);
      const ans = { lq: q1, uq: q3, iqr: q3 - q1 }[kind];
      return num(`Times (seconds) for ${n} runners in the stadion race: ${vals.join(', ')}. What is the ${{ lq: 'lower quartile', uq: 'upper quartile', iqr: 'interquartile range' }[kind]}?`, ans, `With ${n} values in order, the lower quartile is the ${(n + 1) / 4}${(n + 1) / 4 === 2 ? 'nd' : 'rd'} value (${q1}) and the upper quartile the ${(3 * (n + 1)) / 4}th (${q3}). IQR = ${q3} − ${q1} = ${q3 - q1}.`,
        ['Put the data in order (done here).', `LQ is the {{n + 1/4}}th value = ${q1}; UQ is the {{3(n + 1)/4}}th = ${q3}.`, `IQR = UQ − LQ = ${q3 - q1}.`]);
    }
    const lo = rng.int(10, 30), q1 = lo + rng.int(2, 10), med = q1 + rng.int(2, 10), q3 = med + rng.int(2, 10), hi = q3 + rng.int(2, 12);
    const dg = { type: 'boxplot', min: lo, q1, med, q3, max: hi, lo: Math.floor((lo - 5) / 10) * 10, hi: Math.ceil((hi + 5) / 10) * 10, label: 'marks' };
    if (level === 2) {
      const kind = rng.pick(['iqr', 'range', 'median', 'percent']);
      if (kind === 'percent') return num('The box plot shows test marks. What percentage of the students scored more than the upper quartile?', 25, 'Quartiles split the data into four equal parts, so 25% lie above the upper quartile.', ['The box plot splits the data into quarters.', 'Above the upper quartile is the top quarter.', '25%.'], { diagram: dg, unit: '%' });
      const [q, v2, how] = { iqr: ['the interquartile range', q3 - q1, `${q3} − ${q1}`], range: ['the range', hi - lo, `${hi} − ${lo}`], median: ['the median', med, 'the line inside the box'] }[kind];
      return num(`The box plot shows test marks. What is ${q}?`, v2, `${q[0].toUpperCase() + q.slice(1)}: ${how} = ${v2}.`, ['Read the five values: lowest, LQ, median, UQ, highest.', `${lo}, ${q1}, ${med}, ${q3}, ${hi}.`, `${q}: ${v2}.`], { diagram: dg });
    }
    const med2 = med + rng.int(-6, 6), iqr2 = q3 - q1 + rng.int(-6, 6);
    if (med2 === med || iqr2 === q3 - q1 || iqr2 <= 0) return G.y8nSpread(level, rng);
    const higher = med2 > med ? 'Athens' : 'Sparta', consistent = iqr2 < q3 - q1 ? 'Athens' : 'Sparta';
    return choice(`Sparta’s marks have median ${med} and IQR ${q3 - q1}. Athens’s marks have median ${med2} and IQR ${iqr2}. Which comparison is correct?`, `${higher} did better on average, and ${consistent} was more consistent`, [`${higher === 'Athens' ? 'Sparta' : 'Athens'} did better on average, and ${consistent} was more consistent`, `${higher} did better on average, and ${consistent === 'Athens' ? 'Sparta' : 'Athens'} was more consistent`, 'They did equally well, because the ranges are unknown'], rng, {
      explain: `Compare averages with the median (${higher} is higher) and spread with the IQR (smaller means more consistent: ${consistent}).`, steps: ['Higher median: better on average.', 'Smaller IQR: more consistent.', `${higher} higher; ${consistent} more consistent.`],
    });
  },

  // ---- direct and inverse proportion -------------------------------------------------------------------
  y8nProportion(level, rng) {
    if (level === 1) {
      const k = rng.int(2, 12), x1 = rng.int(2, 9), x2 = rng.int(2, 15);
      if (x1 === x2) return G.y8nProportion(level, rng);
      return num(`y is directly proportional to x. When x = ${x1}, y = ${k * x1}. Find y when x = ${x2}.`, k * x2, `y = kx with k = ${k * x1} ÷ ${x1} = ${k}. When x = ${x2}, y = ${k} × ${x2} = ${k * x2}.`, ['Directly proportional: y = kx.', `k = ${k * x1} ÷ ${x1} = ${k}.`, `y = ${k} × ${x2} = ${k * x2}.`]);
    }
    if (level === 2) {
      const k = rng.pick([24, 36, 48, 60, 72, 120, 144]), divs = [2, 3, 4, 6, 8, 12].filter((d) => k % d === 0);
      const x1 = rng.pick(divs), x2 = rng.pick(divs.filter((d) => d !== x1));
      if (rng.chance(0.5)) return num(`y is inversely proportional to x. When x = ${x1}, y = ${k / x1}. Find y when x = ${x2}.`, k / x2, `y = {{k/x}} with k = ${x1} × ${k / x1} = ${k}. When x = ${x2}, y = ${k} ÷ ${x2} = ${k / x2}.`, ['Inversely proportional: y = {{k/x}}, so xy = k.', `k = ${x1} × ${k / x1} = ${k}.`, `y = ${k} ÷ ${x2} = ${k / x2}.`]);
      return num(`${x1} builders take ${k / x1} days to raise a temple wall. How many days would ${x2} builders take, working at the same rate?`, k / x2, `The work is ${x1} × ${k / x1} = ${k} builder-days. ${k} ÷ ${x2} = ${k / x2} days.`, ['More builders, fewer days: inverse proportion.', `Total work: ${x1} × ${k / x1} = ${k} builder-days.`, `${k} ÷ ${x2} = ${k / x2} days.`], { unit: 'days' });
    }
    const kind = rng.pick(['sq', 'invsq', 'root']);
    if (kind === 'sq') { const k = rng.int(2, 5), x1 = rng.int(2, 6); let x2 = rng.int(2, 8); while (x2 === x1) x2 = rng.int(2, 8); return num(`y is directly proportional to x². When x = ${x1}, y = ${k * x1 * x1}. Find y when x = ${x2}.`, k * x2 * x2, `y = kx²: k = ${k * x1 * x1} ÷ ${x1}² = ${k}. y = ${k} × ${x2}² = ${k * x2 * x2}.`, ['y = kx².', `k = ${k * x1 * x1} ÷ ${x1 * x1} = ${k}.`, `y = ${k} × ${x2 * x2} = ${k * x2 * x2}.`]); }
    if (kind === 'invsq') { const [x1, x2] = rng.pick([[2, 4], [1, 2], [3, 6], [2, 1], [4, 2], [1, 3]]), k = rng.pick([36, 72, 144, 288]), y1 = k / (x1 * x1), y2 = k / (x2 * x2); if (!Number.isInteger(y1) || !Number.isInteger(y2)) return G.y8nProportion(level, rng); return num(`The brightness of the Pharos lighthouse’s beam, y, is inversely proportional to the square of the distance, x. When x = ${x1}, y = ${y1}. Find y when x = ${x2}.`, y2, `y = {{k/x²}}: k = ${y1} × ${x1}² = ${k}. y = ${k} ÷ ${x2}² = ${y2}.`, ['y = {{k/x²}}, so k = y × x².', `k = ${y1} × ${x1 * x1} = ${k}.`, `y = ${k} ÷ ${x2 * x2} = ${y2}.`]); }
    const k = rng.int(2, 6), r1 = rng.int(2, 5);
    let r2 = rng.int(2, 9);
    while (r2 === r1) r2 = rng.int(2, 9);
    return num(`y is directly proportional to √x. When x = ${r1 * r1}, y = ${k * r1}. Find y when x = ${r2 * r2}.`, k * r2, `y = k√x: k = ${k * r1} ÷ √${r1 * r1} = ${k * r1} ÷ ${r1} = ${k}. y = ${k} × √${r2 * r2} = ${k * r2}.`, ['y = k√x.', `k = ${k * r1} ÷ ${r1} = ${k}.`, `y = ${k} × ${r2} = ${k * r2}.`]);
  },

  // ---- STRETCH: completing the square and the quadratic formula ----------------------------------------
  y8nQuadForm(level, rng) {
    if (level === 1) {
      const p = rng.int(-6, 6) || 3, c = rng.int(-10, 15) || 7, q = c - p * p;
      return num(`Write x² ${p < 0 ? '−' : '+'} ${Math.abs(2 * p)}x ${c < 0 ? '−' : '+'} ${Math.abs(c)} in the form (x ${p < 0 ? '−' : '+'} ${Math.abs(p)})² + q. What is q?`, q, `(x ${p < 0 ? '−' : '+'} ${Math.abs(p)})² = x² ${p < 0 ? '−' : '+'} ${Math.abs(2 * p)}x + ${p * p}. To get ${neg(c)} instead of ${p * p}, add ${neg(q)}: q = ${c} − ${p * p} = ${neg(q)}.`,
        [`Halve the x coefficient: ${neg(p)}.`, `(x ${p < 0 ? '−' : '+'} ${Math.abs(p)})² gives an extra ${p * p}.`, `q = ${c} − ${p * p} = ${neg(q)}.`], { keypad: q >= 0 });
    }
    if (level === 2) {
      for (;;) {
        const [a, b, c, d] = [rng.int(1, 3), rng.int(-7, 7), rng.int(1, 2), rng.int(-7, 7)];
        // (ax − b)(cx − d) = 0: roots b/a, d/c
        const A = a * c, B = -(a * d + b * c), C = b * d;
        if (B === 0 || C === 0 || gcd(gcd(A, Math.abs(B)), Math.abs(C)) !== 1) continue;
        const r1 = F(b, a), r2 = F(d, c);
        if (r1.eq(r2)) continue;
        const big = r1.cmp(r2) > 0 ? r1 : r2, D = B * B - 4 * A * C;
        const eq = `${A === 1 ? '' : A}x² ${B < 0 ? '−' : '+'} ${Math.abs(B) === 1 ? '' : Math.abs(B)}x ${C < 0 ? '−' : '+'} ${Math.abs(C)} = 0`;
        return num(`Use the quadratic formula to solve ${eq}. What is the LARGER solution?`, big.toString(), `x = {{−b ± √(b² − 4ac)/2a}} with a = ${A}, b = ${neg(B)}, c = ${neg(C)}. b² − 4ac = ${D} = ${Math.round(Math.sqrt(D))}². x = (${neg(-B)} ± ${Math.round(Math.sqrt(D))}) ÷ ${2 * A}, giving ${say(r1)} and ${say(r2)}. The larger is ${say(big)}.`,
          [`a = ${A}, b = ${neg(B)}, c = ${neg(C)}.`, `Discriminant b² − 4ac = ${D}, √${D} = ${Math.round(Math.sqrt(D))}.`, `x = (${neg(-B)} ± ${Math.round(Math.sqrt(D))}) ÷ ${2 * A}: ${say(r1)} or ${say(r2)}.`], { placeholder: 'e.g. 3/2 or -4' });
      }
    }
    for (;;) {
      const p = rng.int(-5, 5), D = rng.pick([2, 3, 5, 6, 7, 10, 11, 13]);
      // (x + p)² = D  →  x² + 2px + (p² − D) = 0
      const B = 2 * p, C = p * p - D;
      if (B === 0) continue;
      const right = `x = ${neg(-p)} ± √${D}`;
      return choice(`Solve x² ${B < 0 ? '−' : '+'} ${Math.abs(B)}x ${C < 0 ? '−' : '+'} ${Math.abs(C)} = 0, leaving your answer in surd form.`, right, [`x = ${neg(p)} ± √${D}`, `x = ${neg(-p)} ± √${D + 2 * p * p}`, `x = ${neg(-2 * p)} ± √${D}`, `x = ${neg(-p)} ± ${D}`], rng, {
        explain: `Complete the square: (x ${p < 0 ? '−' : '+'} ${Math.abs(p)})² − ${p * p} ${C < 0 ? '−' : '+'} ${Math.abs(C)} = 0, so (x ${p < 0 ? '−' : '+'} ${Math.abs(p)})² = ${D}. Square-root both sides: x = ${neg(-p)} ± √${D}.`,
        steps: [`(x ${p < 0 ? '−' : '+'} ${Math.abs(p)})² = x² ${B < 0 ? '−' : '+'} ${Math.abs(B)}x + ${p * p}.`, `So (x ${p < 0 ? '−' : '+'} ${Math.abs(p)})² = ${D}.`, `x ${p < 0 ? '−' : '+'} ${Math.abs(p)} = ± √${D}, so x = ${neg(-p)} ± √${D}.`],
      });
    }
  },

  // ---- STRETCH: surds ---------------------------------------------------------------------------------
  y8nSurds(level, rng) {
    const free = [2, 3, 5, 6, 7, 10];
    if (level === 1) {
      const b = rng.pick(free), a = rng.int(2, 7);
      return num(`√${a * a * b} can be written as k√${b}. What is k?`, a, `${a * a * b} = ${a * a} × ${b}, and √${a * a} = ${a}, so √${a * a * b} = ${a}√${b}.`, [`Find the largest square factor of ${a * a * b}: ${a * a}.`, `√${a * a * b} = √${a * a} × √${b}.`, `= ${a}√${b}, so k = ${a}.`]);
    }
    if (level === 2) {
      const kind = rng.pick(['mul', 'div', 'add']);
      if (kind === 'mul') { const b = rng.pick(free), m = rng.int(1, 4), n = rng.int(2, 5); return num(`Work out √${b * m * m} × √${b * n * n}.`, b * m * n, `√${b * m * m} × √${b * n * n} = √${b * m * m * b * n * n} = ${b * m * n}. (Or: ${m === 1 ? '' : m}√${b} × ${n}√${b} = ${m * n} × ${b}.)`, ['√a × √b = √(ab).', `${b * m * m} × ${b * n * n} = ${b * b * m * m * n * n}.`, `√${b * b * m * m * n * n} = ${b * m * n}.`]); }
      if (kind === 'div') { const b = rng.pick(free), n = rng.int(2, 6); return num(`Work out √${b * n * n} ÷ √${b}.`, n, `√${b * n * n} ÷ √${b} = √${n * n} = ${n}.`, ['√a ÷ √b = √(a ÷ b).', `${b * n * n} ÷ ${b} = ${n * n}.`, `√${n * n} = ${n}.`]); }
      const b = rng.pick([2, 3, 5]), m = rng.int(2, 4), n = rng.int(2, 5);
      return num(`√${b * m * m} + √${b * n * n} = k√${b}. What is k?`, m + n, `√${b * m * m} = ${m}√${b} and √${b * n * n} = ${n}√${b}, so the sum is ${m + n}√${b}.`, [`Simplify each surd: ${m}√${b} and ${n}√${b}.`, 'Like surds add like algebra terms.', `${m + n}√${b}.`]);
    }
    if (rng.chance(0.5)) {
      const a = rng.int(2, 9), b = rng.pick([2, 3, 5, 7, 11]);
      return num(`Expand and simplify (${a} + √${b})(${a} − √${b}).`, a * a - b, `Difference of two squares: ${a}² − (√${b})² = ${a * a} − ${b} = ${a * a - b}.`, ['(p + q)(p − q) = p² − q².', `${a}² = ${a * a} and (√${b})² = ${b}.`, `${a * a} − ${b} = ${a * a - b}.`], { keypad: a * a - b >= 0 });
    }
    const b = rng.pick([2, 3, 5, 6, 7]), k = rng.int(1, 4) * b;
    const c = k / b;
    const right = c === 1 ? `√${b}` : `${c}√${b}`;
    return choice(`Rationalise the denominator: {{${k}/√${b}}}`, right, [`${k}√${b}`, `{{√${b}/${k}}}`, `${k * b}√${b}`, `{{${k}√${b}/${b * b}}}`], rng, {
      explain: `Multiply top and bottom by √${b}: {{${k}√${b}/${b}}} = ${right}.`, steps: [`Multiply by {{√${b}/√${b}}} (which equals 1).`, `Top: ${k}√${b}. Bottom: √${b} × √${b} = ${b}.`, `{{${k}√${b}/${b}}} = ${right}.`],
    });
  },

  // ---- STRETCH: geometric sequences -------------------------------------------------------------------
  y8nGeometric(level, rng) {
    if (level === 1) {
      if (rng.chance(0.6)) {
        const a = rng.int(1, 6), r = rng.int(2, 4), t = [a, a * r, a * r * r, a * r ** 3];
        return num(`What is the next term of the geometric sequence ${t.join(', ')}, …?`, a * r ** 4, `Each term is multiplied by ${r} (the common ratio): ${t[3]} × ${r} = ${a * r ** 4}.`, ['Divide a term by the one before to find the ratio.', `${t[1]} ÷ ${t[0]} = ${r}.`, `${t[3]} × ${r} = ${a * r ** 4}.`]);
      }
      const r = rng.int(1, 3), a = 2 ** (r + 3) * rng.int(1, 3), t = [a, a / 2, a / 4, a / 8];
      return num(`What is the common ratio of ${t.join(', ')}, …? Give it as a fraction or decimal.`, '1/2', `Each term is half the one before: ${t[1]} ÷ ${t[0]} = {{1/2}}.`, ['Common ratio = a term ÷ the previous term.', `${t[1]} ÷ ${t[0]}.`, '= {{1/2}} (or 0.5).']);
    }
    if (level === 2) {
      const a = rng.int(1, 5), r = rng.int(2, 3), n = rng.int(5, 8);
      if (rng.chance(0.5)) return num(`A geometric sequence has first term ${a} and common ratio ${r}. What is the ${n}th term?`, a * r ** (n - 1), `uₙ = a × r^(n − 1) = ${a} × ${r}${sup(n - 1)} = ${a} × ${r ** (n - 1)} = ${a * r ** (n - 1)}.`, ['nth term = a × rⁿ⁻¹.', `${r}${sup(n - 1)} = ${r ** (n - 1)}.`, `${a} × ${r ** (n - 1)} = ${a * r ** (n - 1)}.`]);
      const seqs = [[`${a}, ${a * r}, ${a * r * r}, ${a * r ** 3}`, 'geometric'], [`${a}, ${a + r + 2}, ${a + 2 * (r + 2)}, ${a + 3 * (r + 2)}`, 'arithmetic'], [`1, 4, 9, 16`, 'neither (these are square numbers)'], [`1, 1, 2, 3, 5`, 'neither (each term is the sum of the two before)']];
      const [s, kind] = rng.pick(seqs);
      return choice(`Is ${s}, … arithmetic, geometric or neither?`, kind, ['geometric', 'arithmetic', 'neither (these are square numbers)', 'neither (each term is the sum of the two before)'].filter((x) => x !== kind).slice(0, 3), rng, {
        explain: 'Arithmetic sequences add the same amount each time; geometric sequences multiply by the same amount.', steps: ['Check the differences: all equal means arithmetic.', 'Check the ratios: all equal means geometric.', `This one: ${kind}.`],
      });
    }
    const a = rng.int(1, 5), r = rng.int(2, 3), k = rng.pick([2, 3]);
    const u2 = a * r, uk = a * r ** (k + 1);
    if (rng.chance(0.5)) return num(`In a geometric sequence the 2nd term is ${u2} and the ${k + 2}th term is ${uk}. What is the common ratio?`, r, `From the 2nd to the ${k + 2}th term you multiply by r ${k} times: r${sup(k)} = ${uk} ÷ ${u2} = ${r ** k}, so r = ${r}.`, [`${uk} ÷ ${u2} = ${r ** k}.`, `That is r${sup(k)}.`, `r = ${r}.`]);
    return num(`In a geometric sequence the 2nd term is ${u2} and the ${k + 2}th term is ${uk}. What is the first term?`, a, `r${sup(k)} = ${uk} ÷ ${u2} = ${r ** k}, so r = ${r}. The first term is ${u2} ÷ ${r} = ${a}.`, [`Find r: r${sup(k)} = ${r ** k}, r = ${r}.`, 'Go back one step from the 2nd term.', `${u2} ÷ ${r} = ${a}.`]);
  },

  // ---- STRETCH: 3D Pythagoras and the cosine rule ------------------------------------------------------
  y8n3D(level, rng) {
    if (level === 1) {
      const [a, b, c, d] = rng.pick([[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [3, 4, 12, 13], [2, 10, 11, 15], [1, 12, 12, 17], [8, 9, 12, 17]]);
      return num(`A cuboid tomb chamber measures ${a} m by ${b} m by ${c} m. How long is the longest straight pole that fits inside (corner to opposite corner)?`, d, `3D Pythagoras: d² = ${a}² + ${b}² + ${c}² = ${a * a + b * b + c * c}, so d = ${d} m.`, ['The space diagonal satisfies d² = a² + b² + c².', `${a * a} + ${b * b} + ${c * c} = ${d * d}.`, `d = √${d * d} = ${d} m.`], { unit: 'm' });
    }
    if (level === 2) {
      const [a, b, f, c, d] = rng.pick([[3, 4, 5, 12, 13], [6, 8, 10, 24, 26], [9, 12, 15, 20, 25], [5, 12, 13, 84, 85], [12, 16, 20, 21, 29]]);
      if (rng.chance(0.5)) return num(`A box is ${a} cm long, ${b} cm wide and ${c} cm tall. What is the length of the diagonal across its base?`, f, `Base diagonal: √(${a}² + ${b}²) = √${a * a + b * b} = ${f} cm.`, ['The base is a rectangle: use 2D Pythagoras.', `${a * a} + ${b * b} = ${f * f}.`, `√${f * f} = ${f} cm.`], { unit: 'cm' });
      return num(`A box is ${a} cm long, ${b} cm wide and ${c} cm tall. What is the length of the diagonal from a bottom corner to the opposite top corner?`, d, `Base diagonal √(${a}² + ${b}²) = ${f}. Then √(${f}² + ${c}²) = √${f * f + c * c} = ${d} cm.`, [`Base diagonal: ${f} cm.`, `That and the height make a right-angled triangle.`, `√(${f * f} + ${c * c}) = ${d} cm.`], { unit: 'cm' });
    }
    const obtuse = rng.chance(0.5);
    const [b, c, a] = rng.pick(obtuse ? [[3, 5, 7], [7, 8, 13], [6, 10, 14], [5, 16, 19], [9, 15, 21]] : [[3, 8, 7], [5, 8, 7], [8, 15, 13], [7, 15, 13], [5, 21, 19]]);
    return num(`A triangle has sides ${b} cm and ${c} cm with an angle of ${obtuse ? 120 : 60}° between them. Use the cosine rule, a² = b² + c² − 2bc cos A (cos ${obtuse ? 120 : 60}° = ${obtuse ? '−' : ''}{{1/2}}), to find the third side.`, a,
      `a² = ${b}² + ${c}² − 2 × ${b} × ${c} × ${obtuse ? '(−½)' : '½'} = ${b * b} + ${c * c} ${obtuse ? '+' : '−'} ${b * c} = ${a * a}, so a = ${a} cm.`,
      [`2bc cos A = 2 × ${b} × ${c} × ${obtuse ? '(−½)' : '½'} = ${obtuse ? '−' : ''}${b * c}.`, `a² = ${b * b} + ${c * c} ${obtuse ? '+' : '−'} ${b * c} = ${a * a}.`, `a = ${a} cm.`], { unit: 'cm' });
  },
};

export const Y8_MATHS2_GENERATORS = G;
