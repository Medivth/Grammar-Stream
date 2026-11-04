// Year 6 electricity bonus module: circuit questions drawn as circuit diagrams (js/ui/diagrams.js,
// type 'circuit'), each with a "predict, then explain" worked example.
// The physics is the Year 6 model: identical cells (1.5 V each) and identical bulbs. A circuit only
// works as a complete loop; cells facing the same way add their push, a cell turned round cancels
// one; bulbs in series share the push (each is dimmer); each parallel branch gets the whole push.
// A filament bulb lights either way round, a motor spins the other way when the cell is turned round,
// and buzzers are never shown turned round (many only sound one way round).
// Every question carries `elec` saying what it asks, so tests can recompute the answer from the
// diagram independently.

const fmt = (x) => String(Math.round(x * 100) / 100);
const cap = (t) => t[0].toUpperCase() + t.slice(1);
const NAMES = ['Mia', 'Ravi', 'Zara', 'Leo', 'Amara', 'Sam', 'Priya', 'Tom', 'Isla', 'Kofi', 'Ella', 'Kit'];

/** A circuit part as an object (the same shorthand as the diagram: 'cell-r', 'switch-open', 'battery-3'). */
export function part(p) {
  if (typeof p !== 'string') return p;
  if (p === 'cell-r') return { k: 'cell', rev: true };
  if (p === 'switch-open') return { k: 'switch', open: true };
  const m = /^battery-(\d)(-r)?$/.exec(p);
  if (m) return { k: 'battery', n: +m[1], rev: !!m[2] };
  return { k: p };
}
/** The total push of the cells in a row, in cells: + for each facing the usual way, − for each turned round. */
export function push(row) {
  return row.map(part).reduce((a, p) => a + (p.k === 'cell' ? (p.rev ? -1 : 1) : p.k === 'battery' ? (p.rev ? -1 : 1) * p.n : 0), 0);
}
const cellCount = (row) => row.map(part).reduce((a, p) => a + (p.k === 'cell' ? 1 : p.k === 'battery' ? p.n : 0), 0);
const broken = (row) => row.map(part).some((p) => (p.k === 'switch' && p.open) || p.k === 'gap' || (p.k === 'test' && !p.conducts) || p.broken);
const count = (row, k) => row.map(part).filter((p) => p.k === k).length;
const choice = (prompt, correct, wrongs, rng, explain, steps, extra = {}) => {
  const seen = new Set([correct.text || correct]);
  const ws = wrongs.filter((w) => { const t = w.text || w; return !seen.has(t) && seen.add(t); });
  const opt = (o, ok) => (typeof o === 'string' ? { text: o, ...(ok ? { correct: true } : {}) } : { ...o, ...(ok ? { correct: true } : {}) });
  return { kind: 'choice', prompt, options: rng.shuffle([opt(correct, true), ...ws.map((w) => opt(w, false))]), explain, steps, ...extra };
};
const typed = (prompt, value, unit, explain, steps, extra = {}) => ({ kind: 'typed', prompt, numeric: { value: fmt(value), form: 'any' }, unit, explain, steps, ...extra });
const C = (bottom, top, extra = {}) => ({ type: 'circuit', bottom, top, ...extra });
const P = (bottom, branches, extra = {}) => ({ type: 'circuit', bottom, branches, ...extra });
const pic = (diagram, caption) => ({ kind: 'maths', diagram, ...(caption ? { caption } : {}) });
/** How a bulb is drawn glowing: 1 dim, 2 as with one cell for one bulb, 3 bright. */
export const glowFor = (perBulb) => (perBulb >= 1.5 ? 3 : perBulb >= 1 ? 2 : 1);
/** The same circuit drawn working: bulbs glowing as brightly as their share of the push, buzzers sounding, motors spinning. */
function working(d, spin = 1) {
  const v = Math.abs(push(d.bottom));
  const on = (row, live) => {
    const per = v / Math.max(1, count(row, 'bulb'));
    return row.map(part).map((p) => {
      if (!live) return p;
      if (p.k === 'bulb') return { ...p, lit: glowFor(per) };
      if (p.k === 'buzzer') return { ...p, sound: true };
      if (p.k === 'motor') return { ...p, spin };
      return p;
    });
  };
  const live = v !== 0 && !broken(d.bottom);
  if (d.branches) return { ...d, bottom: d.bottom.map(part), branches: d.branches.map((b) => on(b, live && !broken(b))) };
  return { ...d, bottom: d.bottom.map(part), top: on(d.top, live && !broken(d.top)) };
}
const TRACE = 'Trace the loop: start at one end of the cell, follow the wire all the way round and back to the other end.';
const VERB = { bulb: 'light', buzzer: 'sound', motor: 'spin' };

// ---------------------------------------------------------------- will it work?
function willItWork(level, rng) {
  const who = rng.pick(NAMES);
  if (level === 1) {
    const kind = rng.pick(['complete', 'switch', 'open', 'gap', 'nocell']);
    const d = {
      complete: C(['cell'], ['bulb']),
      switch: C(['cell', 'switch'], ['bulb']),
      open: C(['cell', 'switch-open'], ['bulb']),
      gap: rng.chance(0.5) ? C(['cell', 'gap'], ['bulb']) : C(['cell'], ['bulb', 'gap']),
      nocell: C(['wire'], ['bulb', 'switch']),
    }[kind];
    const Y = 'Yes: the loop is complete, with a cell';
    const NS = 'No: the open switch leaves a gap';
    const NG = 'No: a wire has come loose, leaving a gap';
    const NC = 'No: there is no cell to push a current';
    const right = { complete: Y, switch: Y, open: NS, gap: NG, nocell: NC }[kind];
    const others = rng.shuffle([Y, NS, NG, NC].filter((o) => o !== right && (right === Y || o !== Y)));
    const wrongs = right === Y ? others.slice(0, 2) : [Y, others[0]];
    const see = {
      complete: 'The wire goes from the cell, through the bulb and back to the cell with no gaps.',
      switch: 'The switch is **closed**, so it completes the loop. There are no gaps.',
      open: 'The switch is **open**: there is a gap between its contacts.',
      gap: 'Two wire ends are not joined: there is a **gap** in the loop.',
      nocell: 'There is no cell anywhere in the loop, so nothing pushes the current.',
    }[kind];
    const lights = right === Y;
    return choice(`${who} builds this circuit. Will the bulb light?`, right, wrongs, rng,
      lights ? 'A complete loop with a cell: current flows all the way round and the bulb lights.' : kind === 'nocell' ? 'A loop of wire is not enough: a cell (or battery) is needed to push the current.' : 'Current can only flow round a complete loop. A gap anywhere stops it everywhere, so the bulb stays off.',
      [TRACE, see, lights ? '**Predict:** the bulb lights. **Explain:** the loop is complete, so the cell pushes a current all the way round, through the bulb.' : `**Predict:** the bulb stays off. **Explain:** ${kind === 'nocell' ? 'without a cell, there is no push to make a current flow.' : 'a current can only flow round a complete loop, and the gap breaks it.'}`],
      { diagram: d, elec: { ask: 'works', target: 'bulb' }, ...(lights ? { visual: pic(working(d), 'Complete loop: the bulb lights.') } : {}) });
  }
  if (level === 2) {
    const target = rng.pick(['bulb', 'buzzer', 'motor']);
    const extra = rng.pick([null, ...['bulb', 'buzzer', 'motor'].filter((k) => k !== target)]);
    const cells = rng.pick(['cell', 'battery-2', 'battery-3']);
    const kinds = ['complete', 'open', 'gap', 'two-switches'];
    if (target === 'bulb' && !extra) kinds.push('reversed', 'reversed');
    const kind = rng.pick(kinds);
    const tag = (k) => (k === target && extra ? { k, tag: 'X' } : k);
    const top = rng.shuffle([target, extra].filter(Boolean)).map(tag);
    let bottom = [cells, 'switch'];
    if (kind === 'open') bottom = [cells, 'switch-open'];
    if (kind === 'gap') top.push('gap');
    if (kind === 'two-switches') bottom = rng.shuffle(['switch', 'switch-open']).concat([cells]);
    if (kind === 'reversed') bottom = [cells === 'cell' ? 'cell-r' : `${cells}-r`, 'switch'];
    const d = C(bottom, top);
    const name = extra ? `the ${target} (X)` : `the ${target}`;
    const q = `Will ${name} ${VERB[target]}?`;
    const Y = 'Yes: there is one complete loop';
    const NS = 'No: an open switch leaves a gap';
    const NG = 'No: a loose wire leaves a gap';
    const NR = 'No: the bulb only works one way round';
    const YR = 'Yes: a bulb works either way round';
    let right, wrongs, see, works;
    if (kind === 'reversed') { right = YR; wrongs = [NR, NS]; works = true; see = 'The cell has been turned round. That changes the direction of the current, but the loop is still complete.'; }
    else if (kind === 'complete') { right = Y; wrongs = [NS, rng.pick([NG, 'No: each part needs its own cell'])]; works = true; see = `The switch is closed and there are no gaps, so everything${extra ? ` (the ${target} and the ${extra})` : ''} is in one complete loop.`; }
    else if (kind === 'gap') { right = NG; wrongs = [Y, NS]; works = false; see = 'Two wire ends are not joined: there is a gap in the loop.'; }
    else { right = NS; wrongs = [Y, NG]; works = false; see = kind === 'two-switches' ? 'One switch is closed, but the other is **open**. One gap is enough to break the loop.' : 'The switch is **open**: there is a gap between its contacts.'; }
    const does = `${name} ${VERB[target]}s`;
    return choice(`${who} builds this circuit. ${q}`, right, wrongs, rng,
      works ? `The loop is complete, so a current flows all the way round and ${does}.${kind === 'reversed' ? ' A filament bulb lights whichever way the current flows through it.' : ''}` : `A gap anywhere in a series circuit stops the current everywhere, so nothing in the loop works.`,
      [TRACE, see, works ? `**Predict:** ${does}. **Explain:** the cell pushes a current all the way round the loop${extra ? ', through both components' : ''}.` : `**Predict:** ${name} does not ${VERB[target]}. **Explain:** a current can only flow round a complete loop, and the gap breaks it.`],
      { diagram: d, elec: { ask: 'works', target }, ...(works ? { visual: pic(working(d)) } : {}) });
  }
  const kind = rng.pick(['oppose', 'three-one', 'motor', 'tagged-switches', 'bulb-turned']);
  if (kind === 'oppose') {
    const d = C(['cell', 'cell-r'], ['bulb']);
    return choice(`${who} puts two cells in this circuit, as shown. Will the bulb light?`, 'No: the two cells push against each other', ['Yes: two cells make the bulb brighter', 'Yes: a bulb works either way round'], rng,
      'The cells face opposite ways (look at the long and short lines), so their pushes cancel out: 1.5 V − 1.5 V = 0 V. With no overall push, no current flows.',
      [TRACE, 'Look at the cells: the long line (+) is on the left in one cell and on the right in the other. They face **opposite ways**.', '**Predict:** the bulb stays off. **Explain:** the two pushes cancel (1.5 V − 1.5 V = 0 V), so no current flows, even though the loop is complete.'],
      { diagram: d, elec: { ask: 'works', target: 'bulb' } });
  }
  if (kind === 'three-one') {
    const bottom = rng.shuffle(['cell', 'cell', 'cell-r']);
    const d = C(bottom, ['bulb']);
    return choice(`One of these three cells has been put in the wrong way round. Will the bulb light?`, 'Yes, as brightly as with one cell', ['No: one cell is the wrong way round', 'Yes, as brightly as with three cells'], rng,
      'Two cells push one way and one pushes back. One push cancels another, leaving the push of one cell (1.5 V), so the bulb lights as if there were one cell.',
      [TRACE, 'Look at the cells: two face one way and one faces the other way.', 'Two pushes forward, one push back: 1.5 + 1.5 − 1.5 = 1.5 V.', '**Predict:** the bulb lights, as brightly as with one cell. **Explain:** the reversed cell cancels one of the others.'],
      { diagram: d, elec: { ask: 'works', target: 'bulb' }, visual: pic(working(d)) });
  }
  if (kind === 'motor') {
    const d = C(['cell-r', 'switch'], ['motor']);
    const before = rng.pick(['clockwise', 'anticlockwise']), after = before === 'clockwise' ? 'anticlockwise' : 'clockwise';
    return choice(`With the cell the other way round, this motor spun ${before}. ${who} turns the cell round, as shown. What will the motor do?`, `Spin the other way (${after})`, [`Spin ${before} again, but faster`, 'Stop: it only works one way round'], rng,
      'Turning the cell round makes the current flow the other way round the circuit, and a motor spins the other way when its current is reversed.',
      [TRACE, 'The loop is complete, so a current still flows. But turning the cell round has reversed the **direction** of the current.', `**Predict:** the motor spins ${after}. **Explain:** reversing the current reverses a motor.`],
      { diagram: d, elec: { ask: 'reverse', target: 'motor' }, visual: pic(working(d, after === 'clockwise' ? 1 : -1), `The motor now spins ${after}.`) });
  }
  if (kind === 'tagged-switches') {
    const openOne = rng.pick(['A', 'B']), closed = openOne === 'A' ? 'B' : 'A';
    const sw = (t) => ({ k: 'switch', open: t === openOne, tag: t });
    const target = rng.pick(['bulb', 'buzzer']);
    const d = C(['battery-2', sw('A')], [target, sw('B')]);
    return choice(`Switch ${closed} is closed and switch ${openOne} is open. Will the ${target} ${VERB[target]}?`, `No: switch ${openOne} leaves a gap`, [`Yes: switch ${closed} is closed`, 'Yes, but only very quietly or dimly'], rng,
      `In a series circuit, every switch must be closed. Switch ${openOne} leaves a gap, so no current flows anywhere.`,
      [TRACE, `Switch ${closed} is closed, but switch ${openOne} is open: there is a gap.`, `**Predict:** the ${target} does not ${VERB[target]}. **Explain:** one gap breaks the whole loop, so both switches must be closed for it to work.`],
      { diagram: d, elec: { ask: 'works', target } });
  }
  const d = C(['battery-2-r'], ['bulb', 'bulb']);
  return choice(`${who} turns the battery round in this circuit with two bulbs. What happens?`, 'Both bulbs still light, just as brightly', ['Both bulbs go out: the battery is backwards', 'Only the bulb nearer the + end lights'], rng,
    'A filament bulb lights whichever way the current flows through it, so turning the battery round changes nothing you can see. (An LED is different: it only lights one way round.)',
    [TRACE, 'The loop is complete; turning the battery round only reverses the direction of the current.', '**Predict:** both bulbs light as before. **Explain:** filament bulbs work either way round, and the current is the same all the way round a series loop.'],
    { diagram: d, elec: { ask: 'works', target: 'bulb' }, visual: pic(working(d)) });
}

// ---------------------------------------------------------------- reading circuit symbols
const SYMBOL = {
  bulb: ['a bulb (lamp)', 'a circle with a cross inside'],
  cell: ['a cell', 'one long thin line and one short thick line'],
  battery: ['a battery of cells', 'two or more cell symbols joined together'],
  buzzer: ['a buzzer', 'a dome shape on a flat base'],
  motor: ['a motor', 'a circle with the letter M inside'],
  'switch-open': ['an open switch', 'a line hinged at one contact, lifted away from the other'],
  switch: ['a closed switch', 'a line joining two small contacts'],
  ammeter: ['an ammeter', 'a circle with the letter A inside'],
  resistor: ['a resistor', 'an empty rectangle'],
};
const CONFUSE = {
  bulb: ['motor', 'buzzer', 'ammeter'], cell: ['battery', 'switch', 'resistor'], battery: ['cell', 'resistor'], buzzer: ['bulb', 'motor'],
  motor: ['bulb', 'ammeter', 'buzzer'], 'switch-open': ['switch', 'cell'], switch: ['switch-open', 'cell'], ammeter: ['motor', 'bulb'], resistor: ['cell', 'battery'],
};
function symbolsRead(level, rng) {
  if (level === 1 || level === 3 && rng.chance(0.4)) {
    const pool = level === 1 ? ['bulb', 'cell', 'battery', 'buzzer', 'motor', 'switch-open', 'switch'] : ['ammeter', 'resistor', 'battery', 'switch', 'switch-open', 'motor'];
    const x = rng.pick(pool);
    const tagged = x === 'battery' ? { k: 'battery', n: rng.int(2, 3), tag: 'X' } : x === 'switch-open' ? { k: 'switch', open: true, tag: 'X' } : { k: x, tag: 'X' };
    let d;
    if (x === 'cell' || x === 'battery') d = C([tagged, 'switch'], [rng.pick(['bulb', 'buzzer', 'motor'])]);
    else if (x === 'switch' || x === 'switch-open') d = C(['battery-2', tagged], [rng.pick(['bulb', 'buzzer', 'motor'])]);
    else d = C([rng.pick(['cell', 'battery-2']), 'switch'], rng.shuffle([tagged, rng.pick(['bulb', 'buzzer', 'motor', 'wire'].filter((k) => k !== x))]));
    const wrongs = rng.shuffle(CONFUSE[x]).slice(0, 2).map((k) => SYMBOL[k][0]);
    const [name, look] = SYMBOL[x];
    return choice('In this circuit diagram, what is component X?', name, wrongs, rng,
      `${cap(name)}: its symbol is ${look}.`,
      ['Find the part marked X and look closely at its shape.', `Its symbol is ${look}.`, `So X is **${name}**.`],
      { diagram: d, elec: { ask: 'name' } });
  }
  if (level === 2) {
    const what = rng.pick(['cell', 'bulb', 'switch']);
    const bottom = rng.pick([['battery-2'], ['battery-3'], ['cell', 'cell'], ['battery-2', 'cell'], ['cell'], ['battery-4']]).slice();
    const top = rng.shuffle([...Array(rng.int(1, 3)).fill('bulb'), rng.pick(['buzzer', 'motor', 'wire'])]);
    const sw = rng.int(1, 2);
    for (let i = 0; i < sw; i++) bottom.push(rng.pick(['switch', 'switch-open']));
    const d = C(bottom, top);
    const n = what === 'cell' ? cellCount(bottom) : what === 'bulb' ? count(top, 'bulb') : count(bottom, 'switch');
    const word = { cell: 'cells', bulb: 'bulbs', switch: 'switches' }[what];
    return typed(`How many ${word} are in this circuit diagram?`, n, '', `There ${n === 1 ? 'is' : 'are'} ${n} ${n === 1 ? word.replace(/e?s$/, '') : word}.${what === 'cell' ? ' Each pair of long and short lines is one cell; cells joined together make a battery.' : what === 'switch' ? ' Open and closed switches both count.' : ''}`,
      [`Look for the ${what} symbol: ${SYMBOL[what][1]}.`, what === 'cell' ? 'Count each long-and-short pair of lines once, including every cell in a battery.' : 'Go round the loop once and count each one as you pass it.', `There ${n === 1 ? 'is' : 'are'} **${n}**.`],
      { diagram: d, elec: { ask: 'count', what } });
  }
  // which description matches?
  const n = rng.int(1, 3), b = rng.int(1, 2), open = rng.chance(0.5), other = rng.pick([null, 'buzzer', 'motor']);
  const bottom = [n === 1 ? 'cell' : `battery-${n}`, open ? 'switch-open' : 'switch'];
  const top = rng.shuffle([...Array(b).fill('bulb'), ...(other ? [other] : [])]);
  const describe = (nn, bb, oo, ot) => `${nn} cell${nn > 1 ? 's' : ''}, ${bb} bulb${bb > 1 ? 's' : ''}${ot ? `, a ${ot}` : ''} and ${oo ? 'an open' : 'a closed'} switch`;
  const right = describe(n, b, open, other);
  const wrongs = rng.shuffle([describe(n, b, !open, other), describe(n === 1 ? 2 : n - 1, b, open, other), describe(n, b === 1 ? 2 : 1, open, other), describe(n, b, open, other === 'motor' ? 'buzzer' : other === 'buzzer' ? 'motor' : 'motor')]).slice(0, 3);
  return choice('Which description matches this circuit diagram?', right, wrongs, rng,
    `It has ${right}.`,
    ['Count the cells: each long-and-short pair of lines is one cell.', 'Count the bulbs (circles with crosses) and look for any other components.', `Check the switch: is the lever touching both contacts? Here it has ${open ? 'a gap, so it is open' : 'no gap, so it is closed'}.`, `So the diagram shows **${right}**.`],
    { diagram: C(bottom, top), elec: { ask: 'describe' } });
}

// ---------------------------------------------------------------- conductors and insulators
// [object, material phrase, conducts, why]
export const TEST_OBJECTS = [
  ['a steel spoon', 'steel', true, 'Steel is a metal, mostly iron. Metals conduct electricity.'],
  ['a plastic ruler', 'plastic', false, 'Plastic is an electrical insulator.'],
  ['a wooden lolly stick', 'wood', false, 'Dry wood is an electrical insulator.'],
  ['a strip of aluminium foil', 'aluminium', true, 'Aluminium is a metal, and metals conduct electricity.'],
  ['a steel paper clip', 'steel', true, 'Steel is a metal, so the paper clip conducts.'],
  ['a rubber band', 'rubber', false, 'Rubber is an electrical insulator.'],
  ['a glass marble', 'glass', false, 'Glass is an electrical insulator.'],
  ['an iron nail', 'iron', true, 'Iron is a metal, and metals conduct electricity.'],
  ['a brass key', 'brass', true, 'Brass is a metal (a mixture of copper and zinc), so it conducts.'],
  ['a piece of cotton string', 'cotton', false, 'Dry cotton is an electrical insulator.'],
  ['a paper straw', 'paper', false, 'Dry paper is an electrical insulator.'],
  ['a 2p coin', 'the metal', true, 'Coins are made of metal, so they conduct.'],
  ['a cork', 'cork', false, 'Cork is an electrical insulator.'],
  ['a plastic spoon', 'plastic', false, 'Plastic is an electrical insulator.'],
];
export const TRICKY_OBJECTS = [
  ['the graphite “lead” in a pencil, sharpened at both ends', 'graphite', true, 'Graphite is a form of carbon. It is not a metal, but it does conduct electricity.'],
  ['the plastic handles of a pair of scissors', 'plastic', false, 'The handles are plastic, an insulator, even though the blades are metal.'],
  ['the steel blades of a pair of scissors', 'steel', true, 'The blades are steel, a metal, so they conduct.'],
  ['the plastic coating of a piece of wire', 'plastic', false, 'The coating is plastic, an insulator: that is exactly why wires are coated.'],
  ['the bare copper end of a piece of wire', 'copper', true, 'Copper is one of the best conductors, which is why wires are made of it.'],
  ['a shiny plastic bead', 'plastic', false, 'Being shiny does not make something conduct: plastic is an insulator.'],
  ['a gold ring', 'gold', true, 'Gold is a metal and a very good conductor.'],
  ['the painted wood on the outside of a pencil', 'wood', false, 'The clips touch only painted wood, an insulator, not the graphite inside.'],
  ['a 20p coin', 'the metal', true, 'Coins are made of metal (a 20p is copper and nickel), so they conduct.'],
  ['a china mug', 'china (ceramic)', false, 'Ceramics such as china are insulators: power lines hang from ceramic or glass discs.'],
];
function conductor(level, rng) {
  const who = rng.pick(NAMES);
  const d = (conducts) => C(['cell', 'switch'], [{ k: 'test', text: '?', conducts }, 'bulb']);
  const steps = (obj, mat, ok, why) => ['The object fills the gap between the two clips. The switch is closed, so this is the only possible gap.', `Is it a conductor? ${why}`, ok ? `**Predict:** the bulb lights. **Explain:** ${mat} lets the current through, so the loop is complete.` : `**Predict:** the bulb stays off. **Explain:** ${mat} does not let a current through, so there is still a gap.`];
  if (level === 2) {
    const wantYes = rng.chance(0.6);
    const yes = TEST_OBJECTS.filter((o) => o[2] === wantYes), no = TEST_OBJECTS.filter((o) => o[2] !== wantYes);
    const right = rng.pick(yes), wrongs = rng.sample(no, 2);
    return choice(`${who} tests objects in the gap in this circuit. Which object would ${wantYes ? 'make the bulb light' : '**not** let the bulb light'}?`, right[0], wrongs.map((o) => o[0]), rng,
      `${right[3]} ${wantYes ? `The others (${wrongs.map((o) => o[0]).join(' and ')}) are insulators.` : `The others (${wrongs.map((o) => o[0]).join(' and ')}) are made of metal, which conducts.`}`,
      ['The bulb lights only if the object in the gap is a conductor.', 'Metals conduct; plastic, rubber, wood, glass, cork, paper and cotton insulate.', `So the answer is **${right[0]}**.`],
      { diagram: d(true), elec: { ask: 'conductor-pick', want: wantYes, object: right[0] } });
  }
  const [obj, mat, ok, why] = rng.pick(level === 1 ? TEST_OBJECTS : TRICKY_OBJECTS);
  const yes = `Yes: ${mat} conducts electricity`, no = `No: ${mat} is an electrical insulator`;
  const right = ok ? yes : no;
  const wrongs = ok ? [no, rng.pick(['No: only wire can complete a circuit', 'No: the current is used up by the object'])] : [yes, rng.pick(['Yes, if the cell is turned round', 'Yes, but only very dimly at first'])];
  return choice(`${who} clips ${obj} into the gap in this circuit. Will the bulb light?`, right, wrongs, rng, why, steps(obj, mat, ok, why),
    { diagram: d(ok), elec: { ask: 'conductor', object: obj }, ...(ok ? { visual: pic(working(d(true)), mat === 'graphite' ? 'Graphite conducts, though less well than metals, so the bulb may be a little dimmer.' : 'A conductor completes the loop.') } : {}) });
}

// ---------------------------------------------------------------- changing the circuit
const bulbsRow = (n) => Array(n).fill('bulb');
const battery = (n) => (n === 1 ? 'cell' : `battery-${n}`);
function change(level, rng) {
  const who = rng.pick(NAMES);
  if (level === 1) {
    if (rng.chance(0.5)) {
      const n = rng.int(2, 6);
      const d = C([battery(n)], [rng.pick(['bulb', 'buzzer', 'motor'])]);
      return typed(`Each cell in this battery is 1.5 V. What is the voltage of the whole battery?`, n * 1.5, 'V', `${n} cells × 1.5 V = ${fmt(n * 1.5)} V. Cells joined the same way round add up their pushes.`,
        ['Count the cells: each long-and-short pair of lines is one cell.', `There are ${n} cells, all facing the same way, so their pushes add up.`, `${n} × 1.5 V = **${fmt(n * 1.5)} V**.`],
        { diagram: d, elec: { ask: 'voltage' } });
    }
    const [a, b] = rng.shuffle([1, 2, 3]).slice(0, 2);
    const comp = rng.pick(['bulb', 'bulb', 'buzzer', 'motor']);
    const q = { bulb: ['In which circuit is the bulb brighter?', 'brighter', 'bulb'], buzzer: ['In which circuit is the buzzer louder?', 'louder', 'buzzer'], motor: ['In which circuit does the motor spin faster?', 'faster', 'motor'] }[comp];
    const d = { type: 'circuit', many: [{ name: 'A', bottom: [battery(a)], top: [comp] }, { name: 'B', bottom: [battery(b)], top: [comp] }] };
    const win = a > b ? 'A' : 'B';
    return choice(q[0], `Circuit ${win}`, [`Circuit ${win === 'A' ? 'B' : 'A'}`, 'They are both the same'], rng,
      `Circuit ${win} has more cells, so a bigger voltage pushes a bigger current through the ${comp}.`,
      [`Count the cells: circuit A has ${a}, circuit B has ${b}.`, 'More cells (facing the same way) means a bigger voltage: a bigger push.', `**Predict:** circuit ${win}’s ${comp} is ${q[1]}. **Explain:** a bigger push drives a bigger current through it.`],
      { diagram: d, elec: { ask: comp === 'bulb' ? 'brightest' : 'strongest' } });
  }
  if (level === 2) {
    const combos = [];
    for (let c = 1; c <= 3; c++) for (let bb = 1; bb <= 3; bb++) combos.push([c, bb]);
    let set;
    const dim = rng.chance(0.35);
    for (;;) {
      set = rng.sample(combos, 3);
      const r = set.map(([c, bb]) => c / bb);
      const best = dim ? Math.min(...r) : Math.max(...r);
      if (r.filter((x) => x === best).length === 1) break;
    }
    const names = ['A', 'B', 'C'];
    const ratios = set.map(([c, bb]) => c / bb);
    const best = dim ? Math.min(...ratios) : Math.max(...ratios);
    const win = names[ratios.indexOf(best)];
    const d = { type: 'circuit', many: set.map(([c, bb], i) => ({ name: names[i], bottom: [battery(c)], top: bulbsRow(bb) })) };
    const word = dim ? 'dimmest' : 'brightest';
    return choice(`All the cells are the same and all the bulbs are the same. Which circuit has the ${word} bulbs?`, `Circuit ${win}`, names.filter((n) => n !== win).map((n) => `Circuit ${n}`), rng,
      `Compare the cells for each bulb: ${set.map(([c, bb], i) => `${names[i]} has ${c} cell${c > 1 ? 's' : ''} for ${bb} bulb${bb > 1 ? 's' : ''}`).join('; ')}. Circuit ${win} has the ${dim ? 'least' : 'most'} push per bulb.`,
      ['More cells give a bigger push; more bulbs in a loop share that push, so each is dimmer.', `Work out the push for each bulb: ${set.map(([c, bb], i) => `${names[i]}: ${c} ÷ ${bb} = ${fmt(c / bb)}`).join(', ')}.`, `**Predict:** circuit ${win} has the ${word} bulbs. **Explain:** it has the ${dim ? 'smallest' : 'biggest'} share of push for each bulb.`],
      { diagram: d, elec: { ask: dim ? 'dimmest' : 'brightest' } });
  }
  if (rng.chance(0.5)) {
    // equal brightness: one pair with the same push per bulb
    const pairs = [[[1, 1], [2, 2]], [[1, 1], [3, 3]], [[2, 2], [3, 3]], [[2, 1], [4, 2]]];
    const [x, y] = rng.pick(pairs);
    let z;
    do { z = [rng.int(1, 3), rng.int(1, 3)]; } while (z[0] / z[1] === x[0] / x[1]);
    const set = rng.shuffle([x, y, z]);
    const names = ['A', 'B', 'C'];
    const pair = names.filter((_, i) => set[i] !== z);
    const d = { type: 'circuit', many: set.map(([c, bb], i) => ({ name: names[i], bottom: [battery(c)], top: bulbsRow(bb) })) };
    const all = [['A', 'B'], ['A', 'C'], ['B', 'C']].map((p) => `${p[0]} and ${p[1]}`);
    const right = `${pair[0]} and ${pair[1]}`;
    return choice('All the cells are the same and all the bulbs are the same. In which two circuits are the bulbs equally bright?', right, all.filter((t) => t !== right), rng,
      `Circuits ${pair[0]} and ${pair[1]} have the same push for each bulb, so their bulbs are equally bright.`,
      ['Brightness depends on the push for each bulb: the number of cells divided by the number of bulbs in the loop.', set.map(([c, bb], i) => `${names[i]}: ${c} ÷ ${bb} = ${fmt(c / bb)}`).join(', ') + '.', `**Predict:** ${right} are equally bright. **Explain:** they share out the same push per bulb, even though the numbers of cells are different.`],
      { diagram: d, elec: { ask: 'equal' } });
  }
  // a battery with cells turned round
  const f = rng.int(2, 4), r = rng.int(1, f - 1);
  const cells = rng.shuffle([...Array(f).fill('cell'), ...Array(r).fill('cell-r')]);
  const v = (f - r) * 1.5;
  return typed(`${who} has made a battery of 1.5 V cells, but ${r === 1 ? 'one cell is' : `${r} cells are`} the wrong way round. What is the total voltage pushing the current?`, v, 'V',
    `${f} cells push one way and ${r} push back: (${f} − ${r}) × 1.5 V = ${fmt(v)} V.`,
    ['Look at each cell: which side is the long line on?', `${f} cells face one way and ${r} face the other way. Each one turned round cancels one of the others.`, `(${f} − ${r}) × 1.5 V = **${fmt(v)} V**.`],
    { diagram: C(cells, ['bulb']), elec: { ask: 'voltage' } });
}

// ---------------------------------------------------------------- series and parallel
function seriesParallel(level, rng) {
  const tags = ['A', 'B', 'C'];
  if (level === 1) {
    const n = rng.int(2, 3), k = rng.int(0, n - 1);
    const bulbs = tags.slice(0, n).map((t) => ({ k: 'bulb', tag: t }));
    if (rng.chance(0.5)) {
      const d = C([battery(n)], bulbs);
      return choice(`In this series circuit, the filament in bulb ${tags[k]} breaks. What happens to the other bulb${n > 2 ? 's' : ''}?`, `${n > 2 ? 'They go' : 'It goes'} out too`, [`${n > 2 ? 'They stay' : 'It stays'} lit, just as before`, `${n > 2 ? 'They get' : 'It gets'} brighter instead`], rng,
        'A series circuit is one loop. A broken filament makes a gap, so no current flows anywhere and every bulb goes out.',
        ['A series circuit has only one path: the current flows through every bulb in turn.', `The broken filament in bulb ${tags[k]} makes a gap in that one path.`, '**Predict:** all the bulbs go out. **Explain:** with a gap in the only loop, no current can flow at all.'],
        { diagram: d, elec: { ask: 'break', broken: tags[k] } });
    }
    const d = P(['battery-2'], bulbs.map((b) => [b]));
    const after = P(['battery-2'], bulbs.map((b, i) => [i === k ? b : { ...b, lit: 2 }]));
    return choice(`In this parallel circuit, the filament in bulb ${tags[k]} breaks. What happens to the other bulb${n > 2 ? 's' : ''}?`, `${n > 2 ? 'They stay' : 'It stays'} lit, just as bright`, [`${n > 2 ? 'They go' : 'It goes'} out too`, `${n > 2 ? 'They get' : 'It gets'} much dimmer`], rng,
      'Each bulb is on its own branch, its own loop through the battery. Breaking one branch leaves the others complete, and each still gets the full push of the battery.',
      ['A parallel circuit has separate branches: each bulb has its own path back to the battery.', `Bulb ${tags[k]}’s branch now has a gap, but the other branch${n > 2 ? 'es are' : ' is'} still complete.`, '**Predict:** the other bulbs stay lit, just as bright. **Explain:** each branch still gets the whole push of the battery.'],
      { diagram: d, elec: { ask: 'break', broken: tags[k] }, visual: pic(after, `Bulb ${tags[k]} is broken; the others stay lit.`) });
  }
  if (level === 2) {
    const n = rng.int(2, 3);
    const where = rng.int(-1, n - 1); // −1: in the main line by the battery
    const series = rng.chance(0.2);
    const S = { k: 'switch', tag: 'S' };
    let d, after, right;
    if (series) {
      d = C([battery(n), S], tags.slice(0, n).map((t) => ({ k: 'bulb', tag: t })));
      right = 'All the bulbs go out';
      after = null;
    } else {
      const branches = tags.slice(0, n).map((t, i) => (i === where ? [{ k: 'bulb', tag: t }, S] : [{ k: 'bulb', tag: t }]));
      d = P(where === -1 ? ['battery-2', S] : ['battery-2'], branches);
      right = where === -1 ? 'All the bulbs go out' : `Only bulb ${tags[where]} goes out`;
      after = P(where === -1 ? ['battery-2', { ...S, open: true }] : ['battery-2'], branches.map((b, i) => b.map((p) => (p.k === 'switch' ? { ...p, open: true } : where !== -1 && i !== where && p.k === 'bulb' ? { ...p, lit: 2 } : p))));
    }
    const pool = ['All the bulbs go out', ...tags.slice(0, n).map((t) => `Only bulb ${t} goes out`), 'Nothing changes at all'];
    const wrongs = rng.shuffle(pool.filter((t) => t !== right)).slice(0, 2);
    const inMain = series || where === -1;
    return choice('All the bulbs are lit. What happens when switch S is opened?', right, wrongs, rng,
      inMain ? `Switch S is in the part of the circuit that every current passes through${series ? ' (a series circuit has only one path)' : ', next to the battery'}, so opening it stops the current to every bulb.` : `Switch S is on bulb ${tags[where]}’s branch only. Opening it breaks that branch; the other branches are still complete loops through the battery.`,
      [series ? 'This is a series circuit: one loop through everything.' : 'This is a parallel circuit: find the branches, and the main line that runs through the battery.', `Where is switch S? ${inMain ? 'In the part every current must flow through.' : `On the branch with bulb ${tags[where]}.`}`, `**Predict:** ${right.toLowerCase()}. **Explain:** ${inMain ? 'opening S makes a gap that every path must cross.' : `opening S makes a gap in one branch only; the others still get the full push, so they stay lit.`}`],
      { diagram: d, elec: { ask: 'switch' }, ...(after ? { visual: pic(after, 'After switch S is opened.') } : {}) });
  }
  // currents
  const I = (x) => `${fmt(x)} A`;
  const kind = rng.pick(['series', 'add', 'subtract', 'identical']);
  if (kind === 'series') {
    const a = rng.pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]);
    const d = C([battery(2), { k: 'ammeter', tag: '1', read: I(a) }], ['bulb', { k: 'ammeter', tag: '2', read: '?' }, 'bulb']);
    return typed(`Ammeter 1 reads ${I(a)}. What does ammeter 2 read?`, a, 'A', `In a series circuit the current is the same all the way round: ${I(a)}. The bulbs transfer energy, but they do not use up any current.`,
      ['This is a series circuit: one loop, so the same current passes every point.', 'Current is not used up by the bulbs: the charge keeps flowing round; it is the energy that is transferred.', `So ammeter 2 also reads **${I(a)}**.`],
      { diagram: d, elec: { ask: 'current' } });
  }
  const a = rng.pick([0.1, 0.2, 0.3, 0.4]), b = rng.pick([0.15, 0.25, 0.35, 0.5, 0.6]);
  if (kind === 'identical') {
    const d = P(['battery-2', { k: 'ammeter', tag: '3', read: '?' }], [['bulb', { k: 'ammeter', tag: '1', read: I(a) }], ['bulb', { k: 'ammeter', tag: '2' }]]);
    return typed(`The two bulbs are identical. Ammeter 1 reads ${I(a)}. What does ammeter 3, next to the battery, read?`, 2 * a, 'A', `Identical bulbs on parallel branches each get the same current, ${I(a)}. The currents join up again: ${I(a)} + ${I(a)} = ${I(2 * a)}.`,
      ['The bulbs are identical and each gets the full push, so each branch carries the same current: ammeter 2 also reads ' + I(a) + '.', 'At a junction the current splits; where the branches join, the currents add up again.', `${fmt(a)} + ${fmt(a)} = **${I(2 * a)}**.`],
      { diagram: d, elec: { ask: 'current' } });
  }
  const d = P(['battery-2', { k: 'ammeter', tag: '3', read: kind === 'add' ? '?' : I(a + b) }], [['bulb', { k: 'ammeter', tag: '1', read: I(a) }], ['motor', { k: 'ammeter', tag: '2', read: kind === 'add' ? I(b) : '?' }]]);
  if (kind === 'add') {
    return typed(`Ammeter 1 reads ${I(a)} and ammeter 2 reads ${I(b)}. What does ammeter 3, next to the battery, read?`, a + b, 'A', `The current from the battery splits between the branches, so the branch currents add up to the total: ${fmt(a)} + ${fmt(b)} = ${I(a + b)}.`,
      ['This is a parallel circuit: the current from the battery splits at the junction and joins again.', 'The total current through the battery = the currents in the branches added together.', `${fmt(a)} + ${fmt(b)} = **${I(a + b)}**.`],
      { diagram: d, elec: { ask: 'current' } });
  }
  return typed(`Ammeter 3, next to the battery, reads ${I(a + b)}. Ammeter 1 reads ${I(a)}. What does ammeter 2 read?`, b, 'A', `The branch currents add up to the total, so the motor’s branch carries ${fmt(a + b)} − ${fmt(a)} = ${I(b)}.`,
    ['The total current splits between the two branches.', `Total = branch 1 + branch 2, so branch 2 = total − branch 1.`, `${fmt(a + b)} − ${fmt(a)} = **${I(b)}**.`],
    { diagram: d, elec: { ask: 'current' } });
}

// ---------------------------------------------------------------- fair tests
/** The index of the one reading whose removal leaves a steadily rising or falling pattern (or −1). */
export function oddOneOut(ys) {
  const steady = (a) => a.every((y, i) => i === 0 || y > a[i - 1]) || a.every((y, i) => i === 0 || y < a[i - 1]);
  if (steady(ys)) return -1;
  const fits = ys.map((_, i) => steady(ys.filter((__, j) => j !== i)));
  return fits.filter(Boolean).length === 1 ? fits.indexOf(true) : -1;
}
// [question, change, measure, keep the same, wrong (not a variable that matters), heading for the results, values for 1..5, unit, rising?]
const INVESTIGATIONS = [
  { q: 'Does the number of cells affect how bright a bulb is?', change: 'the number of cells', measure: 'the brightness of the bulb', same: 'the same bulb and wires', silly: 'the colour of the wires', iv: 'Number of cells', dv: 'Light level (lux)', xs: [1, 2, 3, 4], base: [40, 150, 330, 590], up: true, concl: ['The more cells, the brighter the bulb', 'The more cells, the dimmer the bulb', 'The number of cells makes no difference'] },
  { q: 'Does the number of cells affect how loud a buzzer is?', change: 'the number of cells', measure: 'the loudness of the buzzer', same: 'the same buzzer, the same distance from the sound meter', silly: 'the time of day', iv: 'Number of cells', dv: 'Loudness (dB)', xs: [1, 2, 3, 4], base: [58, 64, 69, 73], up: true, concl: ['The more cells, the louder the buzzer', 'The more cells, the quieter the buzzer', 'The number of cells makes no difference'] },
  { q: 'Does the number of bulbs in a series circuit affect how bright they are?', change: 'the number of bulbs', measure: 'the brightness of a bulb', same: 'the same battery and wires', silly: 'the shape of the table', iv: 'Number of bulbs', dv: 'Light level (lux)', xs: [1, 2, 3, 4], base: [590, 240, 120, 70], up: false, concl: ['The more bulbs, the dimmer each one', 'The more bulbs, the brighter each one', 'The number of bulbs makes no difference'] },
  { q: 'Does the length of a thin wire in the circuit affect how bright a bulb is?', change: 'the length of the thin wire', measure: 'the brightness of the bulb', same: 'the same thickness and type of wire, and the same cells', silly: 'the colour of the bulb holder', iv: 'Length of wire (cm)', dv: 'Light level (lux)', xs: [10, 20, 30, 40, 50], base: [400, 310, 240, 190, 150], up: false, concl: ['The longer the wire, the dimmer the bulb', 'The longer the wire, the brighter the bulb', 'The length of the wire makes no difference'] },
  { q: 'Does the number of cells affect how quickly a motor winds up a small weight?', change: 'the number of cells', measure: 'the time to lift the weight 50 cm', same: 'the same motor and the same weight', silly: 'the name of the motor', iv: 'Number of cells', dv: 'Time to lift (s)', xs: [1, 2, 3, 4], base: [24, 12, 8, 6], up: false, concl: ['The more cells, the faster the motor lifts it', 'The more cells, the slower the motor lifts it', 'The number of cells makes no difference'] },
];
function fairTest(level, rng) {
  const inv = rng.pick(INVESTIGATIONS), who = rng.pick(NAMES);
  if (level === 1) {
    return choice(`${who} asks: “${inv.q}” What should ${who} change?`, cap(inv.change), [cap(inv.measure), cap(inv.silly)], rng,
      `The thing you change on purpose is the independent variable: ${inv.change}. ${cap(inv.measure)} is what you measure.`,
      ['A fair test changes **one** thing and measures what happens.', `The question asks whether ${inv.change} makes a difference, so that is what to change.`, `Change **${inv.change}**; measure ${inv.measure}; keep everything else the same.`],
      { elec: { ask: 'variable' } });
  }
  if (level === 2) {
    if (rng.chance(0.5)) {
      return choice(`${who} asks: “${inv.q}” What should ${who} measure?`, cap(inv.measure), [cap(inv.change), cap(inv.silly)], rng,
        `What you measure is the dependent variable: ${inv.measure}. ${cap(inv.change)} is what you change.`,
        ['The question has two parts: what is changed, and what might change because of it.', `${cap(inv.change)} is changed on purpose.`, `So measure **${inv.measure}**.`],
        { elec: { ask: 'variable' } });
    }
    return choice(`${who} asks: “${inv.q}” To make it a fair test, what should ${who} keep the same?`, cap(inv.same), [cap(inv.change), `Nothing: change as much as possible`], rng,
      `Keep ${inv.same} so that only ${inv.change} changes. Otherwise you cannot tell what caused the difference.`,
      ['In a fair test only one thing changes, so you know it caused any difference.', `${cap(inv.change)} is the one thing being changed.`, `Keep the rest the same: **${inv.same}**.`],
      { elec: { ask: 'variable' } });
  }
  // a results table: spot the odd result, or draw the conclusion
  const scale = rng.pick([0.9, 1, 1.1]);
  const ys = inv.base.map((y) => Math.round(y * scale));
  const head = [inv.iv, inv.dv];
  if (rng.chance(0.5)) {
    // below (or, falling, above) the reading two places back: then it is the only one that breaks the pattern
    const k = rng.int(2, ys.length - 1);
    const odd = ys.slice();
    odd[k] = Math.round(ys[k - 2] * (inv.up ? rng.pick([0.5, 0.6, 0.7]) : rng.pick([1.3, 1.4, 1.5])));
    const qTable = { kind: 'table', head, rows: inv.xs.map((x, i) => [String(x), String(odd[i])]), tint: 'cols', question: true };
    const xs = inv.xs.map(String);
    return choice(`${who} investigated: “${inv.q}” Which result does not fit the pattern?`, `The result for ${xs[k]}`, rng.shuffle(xs.filter((_, i) => i !== k)).slice(0, 2).map((x) => `The result for ${x}`), rng,
      `The readings ${inv.up ? 'go up' : 'go down'} steadily, except for ${xs[k]}, where the reading is ${odd[k]}. That anomalous result should be measured again.`,
      [`Find the pattern: as ${inv.iv.toLowerCase().replace(/ \(.*\)/, '')} increases, the readings ${inv.up ? 'go up' : 'go down'}.`, 'Check each reading against its neighbours to find one that breaks the pattern.', `The result for **${xs[k]}** (${odd[k]}) does not fit: it is anomalous, so ${who} should repeat it.`],
      { visual: [qTable], elec: { ask: 'anomaly', up: inv.up } });
  }
  const table = { kind: 'table', head, rows: inv.xs.map((x, i) => [String(x), String(ys[i])]), tint: 'cols', question: true };
  return choice(`${who} investigated: “${inv.q}” What do these results show?`, inv.concl[0], inv.concl.slice(1), rng,
    `${inv.concl[0]}: the readings ${inv.up ? 'rise' : 'fall'} steadily as ${inv.change} increases.`,
    ['Read down the table: what happens to the reading each time the first column goes up?', `The readings ${inv.up ? 'go up' : 'go down'} every time.`, `Conclusion: **${inv.concl[0].toLowerCase()}**.`],
    { visual: [table], elec: { ask: 'conclusion', up: inv.up } });
}

// ---------------------------------------------------------------- safety
// [situation, right, wrong, wrong, hazard, science, what to do]
const SAFETY = {
  1: [
    ['Ella dries her hair with a mains hairdryer while sitting in the bath.', 'Dangerous: the water could conduct to her', ['Safe: hot air dries the water quickly', 'Safe, as long as the bath water is warm'], 'Mains electricity near water.', 'Bath water has substances dissolved in it, so it conducts. If the hairdryer touched the water, current could flow through her body.', 'Never use mains appliances near water. That is why most UK bathrooms have pull-cord light switches and no ordinary sockets.'],
    ['Sam pokes a metal knife into a plugged-in toaster to get the toast out.', 'Dangerous: the metal knife conducts', ['Safe: toasters only use a little electricity', 'Safe: a knife is an electrical insulator'], 'A metal object inside a mains appliance.', 'Metal conducts, so the knife could touch the live wires inside and carry the current into his hand.', 'Switch off and unplug the toaster and let it cool before getting the toast out.'],
    ['Kit builds a circuit with a 1.5 V cell, wires and a bulb on the kitchen table.', 'Safe: one cell gives only a small push', ['Dangerous: all electricity can kill', 'Dangerous: the bulb is sure to explode'], 'Nothing serious: this is a low-voltage cell.', 'A 1.5 V cell cannot push enough current through your body to hurt you. Mains is 230 V, over 150 times more.', 'This is how scientists explore circuits safely: with cells, never with mains sockets.'],
    ['Maya flies her kite in a field right next to overhead power lines.', 'Dangerous: power lines are at a high voltage', ['Safe: the wires are high above her', 'Safe: kites are made of plastic'], 'A kite near overhead lines.', 'Overhead lines can be at up to 400,000 V. If the kite or its string touches or even gets close to a line, the current can flow down it and through her.', 'Fly kites in wide open spaces, well away from overhead lines.'],
    ['Ravi changes the batteries in the TV remote.', 'Safe: the cells give only a small voltage', ['Dangerous: the cells could give him a shock', 'Safe, but only if the TV is unplugged'], 'Nothing serious: remote controls run on low-voltage cells.', 'Two AA cells give 3 V, far too little to push a harmful current through his body.', 'Put the new cells in the right way round (match the + signs) and recycle the old ones.'],
    ['Zara pulls a plug out of the wall by tugging on its cable.', 'Dangerous: it can damage the wires inside', ['Safe: the cable is coated in plastic', 'Safe: the plug is still switched on'], 'Pulling on a mains cable.', 'Tugging can loosen or break the wires inside the plug, so bare live metal might end up where it can be touched.', 'Switch off at the socket, then hold the plug itself and pull it out.'],
  ],
  2: [
    ['Tom switches the light on with wet hands.', 'Dangerous: water can carry the current to him', ['Safe: light switches are made of plastic', 'Safe: only the bulb carries electricity'], 'Water near a mains switch.', 'Water can seep inside the switch to the live parts, and wet skin lets current through much more easily than dry skin.', 'Always dry your hands before touching switches, plugs or appliances.'],
    ['Amara plugs adaptor after adaptor into one wall socket to power six things.', 'Dangerous: the socket could overheat', ['Safe: a socket can supply any amount', 'Safe: adaptors make extra electricity'], 'An overloaded socket.', 'Every appliance draws current through the same socket. Too much current heats the wires and plug, which can start a fire.', 'Use a fused extension lead and do not plug in more than the socket can take.'],
    ['Leo’s football bounces over the fence into an electricity substation.', 'Stay out and ask an adult to phone for help', ['Climb in quickly while no one is looking', 'Hook it out with a long metal pole'], 'Very high voltages inside a substation.', 'The equipment inside works at very high voltages. Electricity can jump to a person who gets close, even without touching.', 'Never go in. In Great Britain an adult can call 105, the number for the local electricity network.'],
    ['Isla notices that a table lamp’s cable is split, with the wires inside showing.', 'Switch it off, unplug it and stop using it', ['Wrap it in sticky tape and carry on', 'Keep using it, but only for an hour'], 'Damaged insulation on a mains cable.', 'The plastic coating is an insulator that keeps the current inside the wires. Where it is split, the live wire can be touched.', 'Stop using it and ask an adult to replace the lamp or have it repaired properly.'],
    ['Someone is touching a faulty kettle and getting an electric shock.', 'Switch off at the socket before touching them', ['Pull them away with your bare hands', 'Throw a cup of water over the kettle'], 'A person in contact with a live appliance.', 'While the current is flowing, it could flow through you too if you touch them, and water conducts.', 'Switch off at the socket or the fuse box first, then call 999. Only touch them once the power is off.'],
  ],
  3: [
    ['Why is a 230 V mains socket dangerous when a 1.5 V cell is not?', 'Its bigger push drives a bigger current through you', ['Mains electricity is made of a different kind of energy', 'Cells contain no electricity, only chemicals'], 'Comparing voltages.', 'Voltage is the push. 230 V is enough to push a dangerous current through a human body; 1.5 V is not.', 'Never experiment with mains. Use cells and batteries.'],
    ['Why can a bird sit safely on a single overhead power line?', 'It touches one wire only, so no current flows through it', ['Its feathers are thick enough to block the current', 'Power lines only carry electricity at night'], 'A bird on a live wire.', 'A current only flows through something that is part of a complete path. Both of the bird’s feet are on the same wire, so there is no path through its body.', 'People are not so lucky: a ladder, kite or person touching a line and the ground does complete a path.'],
    ['Why do the wires on pylons hang from strings of glass or ceramic discs?', 'The discs insulate the wires from the metal pylon', ['The discs store spare electricity for later', 'The discs make the current flow faster'], 'Keeping high-voltage wires apart from the pylon.', 'Glass and ceramic are insulators. Without them the current could flow down the steel pylon into the ground.', 'Never climb a pylon: the voltages are high enough to jump gaps.'],
    ['Why is it dangerous to shelter under a tall, lone tree in a thunderstorm?', 'Lightning tends to strike the tallest thing around', ['Trees attract rain, which makes lightning', 'Leaves hold static that makes thunder'], 'A tall object in a storm.', 'Lightning is a giant spark of static electricity. It usually strikes the tallest thing around, and the current can jump from the tree to a person.', 'Go indoors or into a car. Stay away from tall, lone trees, water and metal fences.'],
    ['Why must you never touch a fallen power line, even if it looks dead?', 'It may still be live, at a very high voltage', ['Fallen wires store electricity like a cell', 'The wire will be too hot to touch'], 'A fallen line.', 'You cannot see whether a wire is live. A fallen line may still be connected at a very high voltage.', 'Keep well away and ask an adult to call 105 (in Great Britain) or 999 if someone is in danger.'],
  ],
};
function safety(level, rng) {
  const [sit, right, wrongs, hazard, science, todo] = rng.pick(SAFETY[level]);
  const prompt = level === 3 ? sit : level === 2 ? `${sit} Which is right?` : `${sit} Safe or dangerous?`;
  return choice(prompt, right, wrongs, rng, `${science} ${todo}`,
    [`**Spot the hazard:** ${hazard}`, `**Think about the science:** ${science}`, `**Decide:** ${right}. ${todo}`],
    { elec: { ask: 'safety' } });
}

// ---------------------------------------------------------------- generating and saving energy
// [resource, renewable?, reason, tempting wrong reason]
// [resource, short name, renewable?, reason, tempting wrong reason]
const RESOURCES = [
  ['wind', 'the wind', true, 'the wind keeps blowing, driven by the Sun', 'Non-renewable: one day the wind will stop'],
  ['sunlight (solar power)', 'sunlight', true, 'the Sun will shine for billions of years', 'Non-renewable: it only works in summer'],
  ['falling water (hydroelectric power)', 'the water', true, 'rain keeps refilling the reservoirs', 'Non-renewable: the water gets used up'],
  ['the tides', 'the tides', true, 'the Moon’s pull raises the tides every day', 'Non-renewable: the tides will run out'],
  ['coal', 'coal', false, 'it took millions of years to form', 'Renewable: plenty is still underground'],
  ['natural gas', 'natural gas', false, 'it took millions of years to form', 'Renewable: it comes from plants and animals'],
  ['oil', 'oil', false, 'it took millions of years to form', 'Renewable: new oil forms in a few years'],
  ['uranium (nuclear power)', 'uranium', false, 'the uranium dug from the ground will run out', 'Renewable: it gives off no carbon dioxide'],
];
// [appliance, watts, [times], unit of time]
const APPLIANCES = [
  ['an LED bulb', 8, [2, 3, 5, 10], 'h'], ['an old filament bulb', 60, [1, 2, 3, 5], 'h'], ['a TV', 80, [1, 2, 3], 'h'], ['a games console', 150, [1, 2, 3], 'h'],
  ['a laptop', 50, [2, 3, 4], 'h'], ['a kettle', 2000, [3, 6], 'min'], ['an electric shower', 9000, [4, 6, 10], 'min'], ['a hairdryer', 1500, [4, 8], 'min'],
  ['a microwave oven', 1200, [5, 10], 'min'], ['a tumble dryer', 2500, [1, 2], 'h'],
];
const wh = ([, w], t, u) => (u === 'h' ? w * t : (w * t) / 60);
const when = (t, u) => `${t} ${u === 'h' ? (t === 1 ? 'hour' : 'hours') : 'minutes'}`;
function energy(level, rng) {
  if (level === 1) {
    const [name, short, renew, reason, tempt] = rng.pick(RESOURCES);
    const right = `${renew ? 'Renewable' : 'Non-renewable'}: ${reason}`;
    const other = rng.pick(RESOURCES.filter((r) => r[2] !== renew));
    return choice(`Is ${name} a renewable or a non-renewable energy resource?`, right, [tempt, `${renew ? 'Renewable' : 'Non-renewable'}: ${other[3]}`], rng,
      `${cap(name)}: ${renew ? 'renewable' : 'non-renewable'}, because ${reason}.`,
      ['Renewable resources are topped up by nature as fast as we use them. Non-renewable ones will run out.', `Ask: will ${short} run out? ${cap(reason)}.`, `So it is **${renew ? 'renewable' : 'non-renewable'}**.`],
      { elec: { ask: 'renewable', renewable: renew } });
  }
  const pickUse = () => { const a = rng.pick(APPLIANCES); const t = rng.pick(a[2]); return [a, t, a[3]]; };
  if (level === 2) {
    let x, y;
    do { x = pickUse(); y = pickUse(); } while (x[0] === y[0] || Math.max(wh(...x), wh(...y)) < 1.25 * Math.min(wh(...x), wh(...y)));
    const ex = wh(...x), ey = wh(...y);
    const say = ([a, t, u]) => `${a[0]} (${a[1]} W) for ${when(t, u)}`;
    const big = ex > ey ? x : y, small = ex > ey ? y : x;
    const line = ([a, t, u]) => (u === 'h' ? `${a[1]} W × ${t} h = ${fmt(wh(a, t, u))} Wh` : `${a[1]} W × ${t} min = ${a[1]} × ${t} ÷ 60 = ${fmt(wh(a, t, u))} Wh`);
    return choice(`Which transfers more energy: ${say(x)}, or ${say(y)}?`, cap(big[0][0]), [cap(small[0][0]), 'They both transfer the same'], rng,
      `Energy = power × time. ${line(x)}; ${line(y)}.`,
      ['Energy transferred = power (watts) × time. Using hours gives watt-hours (Wh).', `${cap(line(x))}. ${cap(line(y))}.`, `**${cap(big[0][0])}** transfers more: ${fmt(wh(...big))} Wh against ${fmt(wh(...small))} Wh.`],
      { elec: { ask: 'compare' } });
  }
  const [a, t, u] = pickUse();
  const e = wh(a, t, u);
  return typed(`${cap(a[0])} is rated ${a[1]} W. How many watt-hours (Wh) of energy does it transfer in ${when(t, u)}?`, e, 'Wh',
    `Energy = power × time = ${a[1]} W × ${u === 'h' ? `${t} h` : `${t} ÷ 60 h`} = ${fmt(e)} Wh${e >= 1000 ? `, or ${fmt(e / 1000)} kWh: the “units” on an electricity bill` : ''}.`,
    ['Energy transferred = power × time, with the time in hours.', u === 'h' ? `${a[1]} W × ${t} h.` : `${t} minutes is ${t} ÷ 60 of an hour, so ${a[1]} × ${t} ÷ 60.`, `= **${fmt(e)} Wh**.`],
    { elec: { ask: 'wh' } });
}

export const ELECTRICITY_GENERATORS = {
  elecWillItWork: willItWork,
  elecSymbols: symbolsRead,
  elecConductor: conductor,
  elecChange: change,
  elecSeriesParallel: seriesParallel,
  elecFairTest: fairTest,
  elecSafety: safety,
  elecEnergy: energy,
};
