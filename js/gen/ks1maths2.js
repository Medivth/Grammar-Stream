// Year 2 maths generators, part 2: number lines, fact families, doubles, turns, scales,
// grouping, block charts, making amounts and durations; Year 3 tasters (×10/×100,
// perimeter, Roman numerals). Same contract as ks1maths.js.

import { timeWords } from './ks1maths.js';

const money = (p) => (p >= 100 ? `£${(p / 100).toFixed(2)}` : `${p}p`);
function choice(prompt, correct, wrongs, rng, extra = {}) {
  const seen = new Set([correct]);
  const ws = wrongs.map((w) => (typeof w === 'string' ? { text: w } : w)).filter((w) => !seen.has(w.text) && seen.add(w.text));
  return { kind: 'choice', prompt, options: rng.shuffle([{ text: correct, correct: true }, ...ws]), ...extra };
}
const typed = (prompt, value, explain, steps, extra = {}) => ({ kind: 'typed', prompt, numeric: { value: String(value), form: 'any' }, explain, steps, ...extra });

const DIRS = ['north', 'east', 'south', 'west'];
const ROMAN = (n) => [[50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']].reduce((acc, [v, s]) => { while (n >= v) { acc += s; n -= v; } return acc; }, '');

export const KS1_GENERATORS_2 = {
  k1NumberLine(level, rng) {
    const [min, max, step, labelEvery] = level === 1 ? [0, 20, 1, 10] : level === 2 ? [0, 100, 10, 50] : rng.pick([[0, 100, 5, 50], [0, 1000, 100, 500]]);
    const ticks = (max - min) / step;
    const k = rng.int(1, ticks - 1);
    const v = min + k * step;
    if (v % labelEvery === 0) return KS1_GENERATORS_2.k1NumberLine(level, rng);
    const labels = []; for (let x = min; x <= max; x += labelEvery) labels.push(x);
    return typed('What number is the arrow pointing to?', v, `Each small step is worth ${step}. The arrow is ${k} steps from ${min}: ${k} × ${step} = ${v}.`,
      [`First I work out what each step is worth: ${max - min} ÷ ${ticks} = ${step}.`, `I count the steps to the arrow: ${k}.`, `${k} × ${step} = ${v}.`], { diagram: { type: 'numline', min, max, step, labels, mark: v } });
  },

  k1FactFamily(level, rng) {
    if (level === 1) {
      const a = rng.int(3, 9), b = rng.int(3, 9), c = a + b;
      return typed(`${a} + ${b} = ${c}. So what is ${c} − ${b}?`, a, `Adding and taking away undo each other: ${c} − ${b} = ${a}.`, ['These numbers belong to the same fact family.', `If ${a} + ${b} = ${c}, then taking ${b} away again gets back to ${a}.`, `${c} − ${b} = ${a}.`]);
    }
    if (level === 2) {
      const a = rng.int(21, 54), b = rng.int(12, 35), c = a + b;
      return typed(`${a} + ${b} = ${c}. What is ${c} − ${a}?`, b, `It is the same fact family, so no working needed: ${c} − ${a} = ${b}.`, ['I spot that the numbers are the same ones.', `${a} + ${b} = ${c} means ${c} − ${a} = ${b}.`, `${b}.`]);
    }
    if (rng.chance(0.5)) {
      const a = rng.pick([2, 3, 4, 5, 10]), b = rng.int(2, 10);
      return typed(`${b} × ${a} = ${a * b}. So what is ${a * b} ÷ ${b}?`, a, `Multiplying and dividing undo each other: ${a * b} ÷ ${b} = ${a}.`, ['× and ÷ are inverses.', `${b} lots of ${a} make ${a * b}.`, `So ${a * b} shared into ${b} groups is ${a}.`]);
    }
    const a = rng.int(5, 9), b = rng.int(2, a - 1), c = a + b;
    return choice(`Which one is NOT in the fact family for ${a}, ${b} and ${c}?`, `${a} − ${b} = ${c}`, [`${b} + ${a} = ${c}`, `${c} − ${a} = ${b}`, `${c} − ${b} = ${a}`], rng, {
      explain: `The family is ${a} + ${b} = ${c}, ${b} + ${a} = ${c}, ${c} − ${a} = ${b} and ${c} − ${b} = ${a}. You always take away FROM the biggest number.`,
      steps: ['In a fact family the biggest number is the total.', `You add to make ${c}, or take away from ${c}.`, `${a} − ${b} = ${c} is wrong: it takes away from the wrong number.`],
    });
  },

  k1Doubles(level, rng) {
    if (level === 1) {
      if (rng.chance(0.5)) { const a = rng.int(2, 10); return typed(`Double ${a} =`, 2 * a, `${a} + ${a} = ${2 * a}.`, ['Double means add the number to itself.', `${a} + ${a}.`, `= ${2 * a}.`]); }
      const a = rng.int(1, 10) * 2; return typed(`Half of ${a} =`, a / 2, `Share ${a} into 2 equal groups: ${a / 2}. Check: ${a / 2} + ${a / 2} = ${a}.`, ['Half means 2 equal groups.', `${a / 2} + ${a / 2} = ${a}.`, `So half of ${a} is ${a / 2}.`]);
    }
    if (level === 2) {
      if (rng.chance(0.5)) { const a = rng.int(4, 9); return typed(`${a} + ${a + 1} =`, 2 * a + 1, `Near double: double ${a} is ${2 * a}, plus 1 more is ${2 * a + 1}.`, [`${a + 1} is one more than ${a}.`, `So ${a} + ${a + 1} is double ${a}, plus 1.`, `${2 * a} + 1 = ${2 * a + 1}.`]); }
      const a = rng.int(11, 25); return typed(`Double ${a} =`, 2 * a, `Double the tens: ${(a - (a % 10)) * 2}. Double the ones: ${(a % 10) * 2}. Together ${2 * a}.`, [`I split ${a} into ${a - (a % 10)} and ${a % 10}.`, `Double ${a - (a % 10)} = ${(a - (a % 10)) * 2}; double ${a % 10} = ${(a % 10) * 2}.`, `${(a - (a % 10)) * 2} + ${(a % 10) * 2} = ${2 * a}.`]);
    }
    const kind = rng.pick(['half-tens', 'double-big', 'quarter']);
    if (kind === 'half-tens') { const a = rng.pick([30, 50, 70, 90, 110, 130]); return typed(`Half of ${a} =`, a / 2, `Half of ${a - 10} is ${(a - 10) / 2}, and half of 10 is 5: ${a / 2}.`, [`${a} is ${a - 10} + 10.`, `Half of ${a - 10} = ${(a - 10) / 2}, half of 10 = 5.`, `${(a - 10) / 2} + 5 = ${a / 2}.`]); }
    if (kind === 'double-big') { const a = rng.int(26, 49); return typed(`Double ${a} =`, 2 * a, `Double ${a - (a % 10)} = ${(a - (a % 10)) * 2}, double ${a % 10} = ${(a % 10) * 2}: ${2 * a}.`, [`Split: ${a - (a % 10)} and ${a % 10}.`, `${(a - (a % 10)) * 2} and ${(a % 10) * 2}.`, `Total ${2 * a}.`]); }
    const a = rng.int(2, 12) * 4; return typed(`A quarter of ${a} =`, a / 4, `A quarter is half of a half: half of ${a} is ${a / 2}, half again is ${a / 4}.`, ['To find a quarter I can halve twice.', `Half of ${a} = ${a / 2}.`, `Half of ${a / 2} = ${a / 4}.`]);
  },

  k1Turns(level, rng) {
    const start = rng.int(0, 3), face = DIRS[start];
    const [who, short] = rng.pick([['Bleep the robot', 'Bleep'], ['Turbo', 'Turbo'], ['{hero}', '{hero}']]);
    if (level === 1) {
      const right = DIRS[(start + 2) % 4];
      return choice(`${who} is facing ${face} and makes a half turn. Which way is ${short} facing now?`, right, DIRS.filter((d) => d !== right), rng, { explain: `A half turn means turning to face the opposite way: ${face} → ${right}.`, steps: ['A half turn is two quarter turns.', 'You end up facing the opposite way.', `${face} → ${right}.`] });
    }
    const clockwise = rng.chance(0.5), quarters = level === 2 ? 1 : rng.pick([1, 3]);
    const end = DIRS[(start + (clockwise ? quarters : -quarters) + 8) % 4];
    const turn = quarters === 1 ? 'a quarter turn' : 'a three-quarter turn';
    return choice(`${who} is facing ${face} and makes ${turn} ${clockwise ? 'clockwise' : 'anticlockwise'}. Which way is ${short} facing now?`, end, DIRS.filter((d) => d !== end), rng, {
      explain: `Clockwise goes north → east → south → west. ${quarters === 3 ? 'Three quarter turns one way is the same as one quarter turn the other way. ' : ''}${face} → ${end}.`,
      steps: ['Clockwise is the way clock hands move: north, east, south, west.', `${quarters === 1 ? 'One step' : 'Three steps'} ${clockwise ? 'clockwise' : 'anticlockwise'} from ${face}.`, `${short} faces ${end}.`],
    });
  },

  k1Scales(level, rng) {
    const kind = rng.pick(['ruler', 'jug', 'thermometer']);
    if (kind === 'ruler') { const max = level === 1 ? 10 : 20, v = rng.int(2, max - 1); return typed('How long is it, in centimetres? (read where the arrow points)', v, `The scale goes up in 1 cm steps: ${v} cm.`, ['The ruler starts at 0.', 'Each mark is 1 cm.', `The arrow points to ${v} cm.`], { unit: 'cm', diagram: { type: 'numline', min: 0, max, step: 1, labels: Array.from({ length: max / 5 + 1 }, (_, i) => i * 5), mark: v } }); }
    if (kind === 'jug') { const step = level === 3 ? 50 : 100, max = 500, k = rng.int(1, max / step - 1), v = k * step; if (v % 250 === 0 && level === 3) return KS1_GENERATORS_2.k1Scales(level, rng); return typed('How much water is in the jug, in millilitres?', v, `The scale goes up in ${step} ml steps: ${v} ml.`, [`Each mark is ${step} ml.`, `Count the marks up to the arrow: ${k}.`, `${k} × ${step} = ${v} ml.`], { unit: 'ml', diagram: { type: 'numline', min: 0, max, step, labels: [0, 250, 500].filter((x) => x % step === 0), mark: v } }); }
    const step = level === 1 ? 5 : 2, every = level === 3 ? 20 : 10, max = level === 3 ? 40 : 50, k = rng.int(1, max / step - 1), v = k * step;
    if (v % every === 0) return KS1_GENERATORS_2.k1Scales(level, rng);
    return typed('What temperature does the thermometer show, in °C?', v, `Each mark is ${step}°C, so it shows ${v}°C.`, [`The labels go up in ${every}s, and each small mark is ${step}.`, `The arrow is ${k} marks along.`, `${k} × ${step} = ${v}°C.`], { unit: '°C', diagram: { type: 'numline', min: 0, max, step, labels: Array.from({ length: max / every + 1 }, (_, i) => i * every), mark: v } });
  },

  k1Grouping(level, rng) {
    if (level === 1) { const g = rng.pick([2, 5, 10]), n = rng.int(2, 6); return typed(`${g * n} children make teams of ${g}. How many teams are there?`, n, `${g * n} ÷ ${g} = ${n} teams.`, [`I count in ${g}s until I reach ${g * n}.`, Array.from({ length: n }, (_, i) => (i + 1) * g).join(', ') + '.', `That is ${n} teams.`]); }
    if (level === 2) { const g = rng.pick([2, 3, 4, 5]), n = rng.int(3, 10); return typed(`A car transporter carries ${g} cars. How many transporters are needed for ${g * n} cars?`, n, `${g * n} ÷ ${g} = ${n}.`, [`Each transporter takes ${g}.`, `${g * n} ÷ ${g}.`, `= ${n} transporters.`]); }
    const g = rng.pick([3, 4, 5]), n = rng.int(3, 8), r = rng.int(1, g - 1), total = g * n + r;
    if (rng.chance(0.5)) return typed(`A car transporter carries ${g} cars. How many transporters are needed for ${total} cars? Every car must go!`, n + 1, `${total} ÷ ${g} = ${n} remainder ${r}. The ${r} left over need one more transporter: ${n + 1}.`, [`${g} × ${n} = ${g * n}, which leaves ${r} cars.`, `Those ${r} cars still need a transporter.`, `So ${n} + 1 = ${n + 1}.`]);
    return typed(`${total} stickers are shared equally between ${g} friends. How many are left over?`, r, `${g} × ${n} = ${g * n}, and ${total} − ${g * n} = ${r} left over.`, [`Each friend gets ${n}: ${g} × ${n} = ${g * n}.`, `${total} − ${g * n} = ${r}.`, `${r} left over.`]);
  },

  k1Charts(level, rng) {
    const sets = [[['red', 'blue', 'green', 'yellow'], 'Favourite car colour', 'children', (c) => `How many children chose ${c}?`], [['Mars', 'Moon', 'Saturn', 'Venus'], 'Where would you fly?', 'votes', (c) => `How many votes did ${c === 'Moon' ? 'the Moon' : c} get?`], [['flying', 'speed', 'strength', 'invisible'], 'Best superpower', 'votes', (c) => `How many votes did “${c}” get?`]];
    const [cats, title, unit, ask] = rng.pick(sets);
    const step = level === 1 ? 1 : 2;
    const vals = cats.map(() => rng.int(1, 8) * step);
    if (new Set(vals).size < 3) return KS1_GENERATORS_2.k1Charts(level, rng);
    const dg = { type: 'bar', title, cats: cats.map((c, i) => ({ label: c, v: vals[i] })), step, ylabel: unit };
    if (level < 3) { const i = rng.int(0, 3); return typed(ask(cats[i]), vals[i], `Read along from the top of the bar to the scale: ${vals[i]}.`, ['I find the bar.', `I read across to the scale (it goes up in ${step}s).`, `${vals[i]}.`], { diagram: dg }); }
    if (rng.chance(0.5)) { const total = vals.reduce((a, b) => a + b, 0); return typed(`How many ${unit} altogether?`, total, `${vals.join(' + ')} = ${total}.`, ['I read every bar.', vals.join(', ') + '.', `Total: ${total}.`], { diagram: dg }); }
    const max = Math.max(...vals), min = Math.min(...vals);
    return typed(`How many fewer ${unit} did the least popular choice get than the most popular?`, max - min, `Most: ${max}. Least: ${min}. ${max} − ${min} = ${max - min}.`, ['Find the tallest and shortest bars.', `${max} and ${min}.`, `The difference is ${max - min}.`], { diagram: dg });
  },

  k1Amounts(level, rng) {
    if (level === 1) {
      const target = rng.pick([20, 30, 50, 60, 70]);
      const sets = { 20: ['10p + 10p', '10p + 5p', '5p + 5p + 5p'], 30: ['20p + 10p', '20p + 5p', '10p + 10p + 5p'], 50: ['20p + 20p + 10p', '20p + 20p + 5p', '20p + 10p + 10p'], 60: ['50p + 10p', '50p + 5p', '20p + 20p + 10p'], 70: ['50p + 20p', '50p + 10p', '20p + 20p + 20p'] };
      const [right, ...wrongs] = sets[target];
      return choice(`Which coins make exactly ${target}p?`, right, wrongs, rng, { explain: `${right} = ${target}p.`, steps: ['I add each set of coins.', `${right} = ${target}p.`, 'The others make a different amount.'] });
    }
    if (level === 2) { const c = rng.pick([2, 5, 10, 20, 50]); return typed(`How many ${c}p coins make £1?`, 100 / c, `£1 = 100p. 100 ÷ ${c} = ${100 / c}.`, ['£1 is 100p.', `I count in ${c}s to 100.`, `That is ${100 / c} coins.`]); }
    const pay = rng.pick([200, 500]), cost = rng.int(5, pay / 5 - 5) * 5;
    return typed(`A model rocket costs ${money(cost)}. You pay with ${money(pay)}. How much change, in pence?`, pay - cost, `${pay}p − ${cost}p = ${pay - cost}p${pay - cost >= 100 ? ` (${money(pay - cost)})` : ''}.`, [`Change pounds to pence: ${money(pay)} = ${pay}p, ${money(cost)} = ${cost}p.`, `Count on from ${cost} to ${pay}.`, `${pay - cost}p.`], { unit: 'p' });
  },

  k1Durations(level, rng) {
    if (level === 1) {
      const kind = rng.pick(['days', 'mins']);
      if (kind === 'days') { const w = rng.int(2, 4); return typed(`How many days are in ${w} weeks?`, 7 * w, `${w} × 7 = ${7 * w} days.`, ['A week has 7 days.', `${w} lots of 7.`, `${7 * w} days.`]); }
      const h = rng.int(1, 11), m = rng.pick([15, 30]); return typed(`How many minutes from ${h} o’clock to ${timeWords(h, m)}?`, m, `${timeWords(h, m)} is ${m} minutes after ${h} o’clock.`, [`${m === 15 ? 'Quarter past' : 'Half past'} means ${m} minutes past.`, `From ${h} o’clock that is ${m} minutes.`, `${m} minutes.`]);
    }
    if (level === 2) {
      const h = rng.int(1, 10), m = rng.pick([0, 15, 30, 45]), add = rng.pick([15, 30, 45, 60]);
      const tm = h * 60 + m + add, eh = Math.floor(tm / 60) % 12 || 12, em = tm % 60;
      const right = timeWords(eh, em);
      return choice(`The race starts at ${timeWords(h, m)}. It lasts ${add === 60 ? '1 hour' : `${add} minutes`}. When does it finish?`, right, [timeWords(eh % 12 + 1, em), timeWords(eh, (em + 15) % 60), timeWords(h, m)], rng, { explain: `${timeWords(h, m)} + ${add} minutes = ${right}.`, steps: [`Start: ${timeWords(h, m)}.`, `Count on ${add} minutes round the clock.`, `Finish: ${right}.`] });
    }
    const h = rng.int(1, 10), m1 = rng.pick([5, 10, 15, 20]), dur = rng.pick([15, 20, 25, 30, 35]);
    const m2 = m1 + dur;
    if (m2 >= 60) return KS1_GENERATORS_2.k1Durations(3, rng);
    return typed(`The film starts at ${timeWords(h, m1)} and finishes at ${timeWords(h, m2)}. How many minutes long is it?`, dur, `${m1} minutes past to ${m2} minutes past is ${dur} minutes.`, [`Start: ${m1} minutes past ${h}. Finish: ${m2} minutes past ${h}.`, `${m2} − ${m1}.`, `${dur} minutes.`]);
  },

  // --- Year 3 tasters ------------------------------------------------------------------
  k1Times10(level, rng) {
    if (level === 1) { const a = rng.int(2, 12); return typed(`${a} × 10 =`, a * 10, `Multiplying by 10 moves every digit one place bigger: ${a} → ${a * 10}.`, ['× 10 makes a number ten times bigger.', 'The digits move one place to the left, and a 0 fills the ones.', `${a * 10}.`]); }
    if (level === 2) { const a = rng.int(2, 9) * 10; return typed(`${a} ÷ 10 =`, a / 10, `Dividing by 10 moves the digits one place smaller: ${a} → ${a / 10}.`, ['÷ 10 makes a number ten times smaller.', 'The digits move one place to the right.', `${a / 10}.`]); }
    const a = rng.int(2, 9); return typed(`${a} × 100 =`, a * 100, `× 100 moves the digits two places: ${a} → ${a * 100}.`, ['× 100 is × 10, then × 10 again.', `${a} × 10 = ${a * 10}, × 10 again = ${a * 100}.`, `${a * 100}.`]);
  },

  k1Perimeter(level, rng) {
    if (level === 1) { const s = rng.int(2, 9); return typed(`A square has sides of ${s} cm. What is its perimeter?`, 4 * s, `A square has 4 equal sides: ${s} + ${s} + ${s} + ${s} = ${4 * s} cm.`, ['Perimeter is the distance all the way round.', `A square has 4 sides of ${s} cm.`, `4 × ${s} = ${4 * s} cm.`], { unit: 'cm' }); }
    const w = rng.int(4, 12), hgt = rng.int(2, w - 1);
    if (level === 2) return typed('What is the perimeter of this rectangle?', 2 * (w + hgt), `${w} + ${hgt} + ${w} + ${hgt} = ${2 * (w + hgt)} cm.`, ['Perimeter: add all four sides.', `Two sides of ${w} and two of ${hgt}.`, `${2 * w} + ${2 * hgt} = ${2 * (w + hgt)} cm.`], { unit: 'cm', diagram: { type: 'rect', w, h: hgt } });
    const p = 2 * (w + hgt);
    return typed(`A race track is a rectangle ${w} m long. Its perimeter is ${p} m. How wide is it?`, hgt, `Two long sides make ${2 * w} m. ${p} − ${2 * w} = ${2 * hgt}, shared between two short sides: ${hgt} m.`, [`The two long sides: 2 × ${w} = ${2 * w} m.`, `What is left: ${p} − ${2 * w} = ${2 * hgt} m.`, `Half of that for each short side: ${hgt} m.`], { unit: 'm' });
  },

  k1Roman(level, rng) {
    const max = level === 1 ? 10 : level === 2 ? 12 : 30;
    const n = rng.int(level === 3 ? 13 : 1, max);
    if (rng.chance(0.5)) return typed(`What number is ${ROMAN(n)} in Roman numerals?`, n, `${ROMAN(n)} = ${n}. I = 1, V = 5, X = 10. A smaller letter before a bigger one means take it away.`, ['I = 1, V = 5, X = 10.', `${ROMAN(n).split('').join(' ')}: add them up, but a smaller one before a bigger one is taken away.`, `${ROMAN(n)} = ${n}.`]);
    const wrongs = [ROMAN(n + 1), ROMAN(Math.max(1, n - 1)), ROMAN(n).split('').reverse().join('')].filter((w) => w !== ROMAN(n));
    return choice(`How do you write ${n} in Roman numerals?`, ROMAN(n), wrongs, rng, { explain: `${n} = ${ROMAN(n)}.`, steps: ['I = 1, V = 5, X = 10.', `Build ${n} from the biggest letters first.`, `${n} = ${ROMAN(n)}.`] });
  },
};
