// The Year 6 electricity bonus module: the deck is well formed, every topic is a bonus topic,
// the generated circuit questions have the right answers (worked out again here, from the circuit
// diagram, without the generator's own code), and every circuit diagram can be drawn.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// a minimal DOM (as in pictures-render.test.mjs) so the diagram code runs under node
class Node {}
class El extends Node {
  constructor(tag) { super(); this.tag = tag; this.attrs = {}; this.children = []; this.style = { setProperty() {} }; }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  append(...c) { this.children.push(...c); }
  addEventListener() {}
  set className(v) { this.attrs.class = v; }
  set textContent(v) { this.children = [new Txt(v)]; }
}
class Txt extends Node { constructor(t) { super(); this.t = String(t); } }
globalThis.Node = Node;
globalThis.document = { createElementNS: (ns, tag) => new El(tag), createElement: (tag) => new El(tag), createTextNode: (t) => new Txt(t) };

const { ELECTRICITY_GENERATORS: GEN } = await import('../js/gen/electricity.js');
const { GENERATORS } = await import('../js/gen/index.js');
const { makeRng } = await import('../js/core/rng.js');
const { mathsDiagram } = await import('../js/ui/diagrams.js');
const { buildDB, validateDB } = await import('../js/core/content.js');
const { check, correctResponse } = await import('../js/core/checkers.js');
const src = (await import('../tools/content-src/bonus-electricity.mjs')).default;

const read = (p) => JSON.parse(readFileSync(new URL(`../content/${p}`, import.meta.url)));
const deck = read('science/bonus-electricity.json');

// ---------------------------------------------------------------- the deck
test('electricity bonus: the built deck matches its source and is registered for Year 6', () => {
  assert.equal(src.length, 1);
  assert.equal(deck.subject, 'science');
  assert.equal(deck.deck, 'bonus-electricity');
  assert.deepEqual(JSON.parse(JSON.stringify(src[0].items.map((i) => i.id))), deck.items.map((i) => i.id));
  assert.ok(read('index.json').decks.includes('science/bonus-electricity.json'));
});

test('electricity bonus: every topic is a bonus topic with an intro, teach prompt, hook and picture', () => {
  assert.ok(deck.topics.length >= 6 && deck.topics.length <= 8, `${deck.topics.length} topics`);
  for (const t of deck.topics) {
    assert.equal(t.bonus, 'electricity', t.id);
    assert.ok(t.id.startsWith('science.'), t.id);
    for (const k of ['intro', 'teach', 'talk', 'hook']) assert.ok(typeof t[k] === 'string' && t[k].length > 20, `${t.id}: ${k}`);
    assert.ok(t.visual, `${t.id}: picture`);
  }
});

test('electricity bonus: topics form a prerequisite chain inside the module', () => {
  const ids = new Set(deck.topics.map((t) => t.id));
  const roots = deck.topics.filter((t) => !t.prereqs.length);
  assert.equal(roots.length, 1, 'one starting topic');
  for (const t of deck.topics) for (const p of t.prereqs) assert.ok(ids.has(p), `${t.id}: prereq ${p} is in the module`);
  // every topic is reachable from the first, and appears after its prerequisites
  const order = deck.topics.map((t) => t.id);
  for (const t of deck.topics) for (const p of t.prereqs) assert.ok(order.indexOf(p) < order.indexOf(t.id), `${t.id} after ${p}`);
});

test('electricity bonus: items are well formed, plentiful and pass the content validator', () => {
  const fixed = deck.items.filter((i) => i.kind !== 'template');
  const tmpl = deck.items.filter((i) => i.kind === 'template');
  assert.ok(fixed.length >= 100 && fixed.length <= 140, `${fixed.length} fixed items`);
  assert.equal(new Set(deck.items.map((i) => i.id)).size, deck.items.length, 'unique ids');
  const topics = new Set(deck.topics.map((t) => t.id));
  for (const it of deck.items) assert.ok(topics.has(it.topic), `${it.id}: topic in module`);
  for (const t of tmpl) assert.ok(GEN[t.gen], `${t.id}: generator ${t.gen} is an electricity generator`);
  // every skill topic has a worked example (a template) and every topic has at least 12 items
  for (const t of deck.topics) {
    const mine = deck.items.filter((i) => i.topic === t.id);
    assert.ok(mine.length >= 12, `${t.id}: ${mine.length} items`);
    if (t.kind !== 'facts') assert.ok(mine.some((i) => i.kind === 'template'), `${t.id}: a worked example`);
  }
  // no duplicates of the core electricity topic's questions
  const core = read('science/core.json').items.filter((i) => i.topic === 'science.electricity').map((i) => i.prompt);
  for (const it of fixed) assert.ok(!core.includes(it.prompt), `${it.id} repeats a core question`);
  const db = buildDB(read('index.json').decks.map(read));
  assert.deepEqual(validateDB(db, GENERATORS).filter((e) => /elec|science\.eb\./.test(e)), []);
});

test('electricity bonus: choice answers do not give themselves away by length', () => {
  const strip = (t) => String(t).replace(/\*\*/g, '');
  let n = 0, longest = 0, clearly = 0, chance = 0;
  for (const it of deck.items) {
    let opts;
    if (it.kind === 'mcq') opts = it.options.map((o) => [strip(o.text).length, o.correct]);
    else if (it.kind === 'fact' && it.distractors?.length && (!it.formats || it.formats.includes('choice'))) opts = [[strip(it.answer).length, true], ...it.distractors.map((d) => [strip(d).length, false])];
    else continue;
    const c = opts.find((o) => o[1])[0], mw = Math.max(...opts.filter((o) => !o[1]).map((o) => o[0]));
    n++; chance += 1 / opts.length;
    if (c > mw) longest++;
    if (c > mw * 1.3 && c - mw >= 8) clearly++;
  }
  assert.ok(longest / n <= chance / n + 0.05, `correct longest in ${longest} of ${n}`);
  assert.ok(clearly <= 2, `clearly longest in ${clearly}`);
});

test('electricity bonus: the dates and names in the history topic agree with each other', () => {
  const text = deck.items.filter((i) => i.topic === 'science.elec-scientists').map((i) => JSON.stringify(i)).join(' ');
  for (const [who, year] of [['Volta', '1800'], ['Franklin', '1752'], ['1821', '1821'], ['1831', '1831'], ['Edison', '1879'], ['Savoy', '1881'], ['Ayrton', '1899']]) assert.ok(text.includes(who) && text.includes(year), `${who} ${year}`);
  const tl = deck.topics.find((t) => t.id === 'science.elec-scientists').visual;
  assert.deepEqual(tl.events.map((e) => e[0]), [1752, 1800, 1821, 1831, 1879, 1888]);
});

// ---------------------------------------------------------------- physics, worked out independently
// Parts: 'cell', 'cell-r', 'battery-N(-r)', 'bulb', 'buzzer', 'motor', 'switch', 'switch-open', 'gap',
// 'test', 'ammeter', 'resistor', 'wire', or objects { k, rev, open, n, tag, read }.
function norm(p) {
  if (typeof p === 'object') return p;
  const m = /^battery-(\d)(-r)?$/.exec(p);
  if (m) return { k: 'battery', n: +m[1], rev: !!m[2] };
  if (p === 'cell-r') return { k: 'cell', rev: true };
  if (p === 'switch-open') return { k: 'switch', open: true };
  return { k: p };
}
const CONDUCTS = [['graphite', true], ['plastic', false], ['wood', false], ['steel', true], ['aluminium', true], ['rubber', false], ['glass', false], ['iron', true], ['brass', true], ['cotton', false], ['paper', false], ['coin', true], ['cork', false], ['copper', true], ['bead', false], ['gold', true], ['china', false]];
const conducts = (object) => { const m = CONDUCTS.find(([w]) => object.includes(w)); assert.ok(m, `material of ${object}`); return m[1]; };
function analyse(d, testConducts = null) {
  const bottom = d.bottom.map(norm);
  const rows = (d.branches || [d.top]).map((r) => r.map(norm));
  let push = 0, cells = 0;
  for (const p of bottom) {
    if (p.k === 'cell') { push += p.rev ? -1 : 1; cells++; }
    if (p.k === 'battery') { push += (p.rev ? -1 : 1) * p.n; cells += p.n; }
  }
  const gap = (r) => r.some((p) => (p.k === 'switch' && p.open) || p.k === 'gap' || (p.k === 'test' && !testConducts));
  const mainOk = !gap(bottom) && push !== 0;
  const live = rows.map((r) => mainOk && !gap(r));
  const bulbs = rows.map((r) => r.filter((p) => p.k === 'bulb').length);
  return { bottom, rows, push, cells, live, perBulb: rows.map((r, i) => (live[i] ? Math.abs(push) / Math.max(1, bulbs[i]) : 0)), parallel: !!d.branches };
}
const right = (q) => q.options.find((o) => o.correct).text;
const near = (a, b) => Math.abs(a - b) < 1e-9;
const tagged = (d, t) => [...d.bottom, ...(d.branches || [d.top]).flat()].map(norm).find((p) => p.tag === t);

function verify(q, label) {
  const e = q.elec;
  assert.ok(e && e.ask, `${label}: says what it asks`);
  const d = q.diagram;
  switch (e.ask) {
    case 'works': {
      const a = analyse(d);
      const works = a.rows.some((r, i) => a.live[i] && r.some((p) => p.k === e.target));
      const says = /^Yes|still light/.test(right(q));
      assert.equal(says, works, `${label}: ${q.prompt} → ${right(q)}`);
      break;
    }
    case 'reverse': {
      const a = analyse(d);
      assert.ok(a.live[0] && a.push < 0, `${label}: the motor runs, the other way round`);
      assert.match(right(q), /other way/, label);
      break;
    }
    case 'name': {
      const x = tagged(d, 'X');
      const k = x.k === 'switch' ? (x.open ? 'open switch' : 'closed switch') : x.k;
      assert.ok(right(q).includes(k), `${label}: X is ${k}, answer ${right(q)}`);
      break;
    }
    case 'count': {
      const a = analyse(d);
      const all = [...a.bottom, ...a.rows.flat()];
      const n = e.what === 'cell' ? a.cells : all.filter((p) => p.k === e.what).length;
      assert.equal(+q.numeric.value, n, `${label}: ${e.what}s`);
      break;
    }
    case 'describe': {
      const a = analyse(d);
      const m = /^(\d) cells?, (\d) bulbs?(?:, a (motor|buzzer))? and (an open|a closed) switch$/.exec(right(q));
      assert.ok(m, `${label}: ${right(q)}`);
      const top = a.rows[0];
      assert.equal(+m[1], a.cells, label);
      assert.equal(+m[2], top.filter((p) => p.k === 'bulb').length, label);
      assert.equal(m[3] || null, top.find((p) => p.k === 'motor' || p.k === 'buzzer')?.k || null, label);
      assert.equal(m[4] === 'an open', a.bottom.some((p) => p.k === 'switch' && p.open), label);
      break;
    }
    case 'conductor': {
      const ok = conducts(e.object);
      assert.equal(/^Yes/.test(right(q)), ok, `${label}: ${e.object}`);
      assert.equal(analyse(d, ok).live[0], ok, `${label}: the circuit agrees`);
      break;
    }
    case 'conductor-pick':
      assert.equal(conducts(right(q)), e.want, `${label}: ${right(q)}`);
      for (const o of q.options.filter((x) => !x.correct)) assert.equal(conducts(o.text), !e.want, `${label}: ${o.text}`);
      break;
    case 'voltage':
      assert.ok(near(+q.numeric.value, 1.5 * Math.abs(analyse(d).push)), `${label}: ${q.numeric.value} V`);
      break;
    case 'brightest': case 'dimmest': case 'strongest': {
      const per = d.many.map((c) => analyse(c).perBulb[0] || Math.abs(analyse(c).push));
      const best = e.ask === 'dimmest' ? Math.min(...per) : Math.max(...per);
      assert.equal(per.filter((x) => x === best).length, 1, `${label}: one ${e.ask}`);
      assert.equal(right(q), `Circuit ${d.many[per.indexOf(best)].name}`, label);
      break;
    }
    case 'equal': {
      const per = d.many.map((c) => analyse(c).perBulb[0]);
      const pairs = [[0, 1], [0, 2], [1, 2]].filter(([i, j]) => near(per[i], per[j]));
      assert.equal(pairs.length, 1, `${label}: one equal pair`);
      assert.equal(right(q), `${d.many[pairs[0][0]].name} and ${d.many[pairs[0][1]].name}`, label);
      break;
    }
    case 'break': {
      const a = analyse(d);
      // break the tagged bulb's filament and see what is still lit
      const rows = a.rows.map((r) => (r.some((p) => p.tag === e.broken) ? [...r, 'gap'] : r));
      const after = analyse({ bottom: d.bottom, ...(a.parallel ? { branches: rows } : { top: rows[0] }) });
      const othersLit = after.rows.some((r, i) => after.live[i] && r.some((p) => p.k === 'bulb' && p.tag !== e.broken));
      assert.equal(/stays? lit/.test(right(q)), othersLit, `${label}: ${right(q)}`);
      if (othersLit) assert.match(right(q), /just as bright/, label);
      break;
    }
    case 'switch': {
      const open = (r) => r.map(norm).map((p) => (p.tag === 'S' ? { ...p, open: true } : p));
      const a = analyse(d);
      assert.ok(a.live.every(Boolean), `${label}: all lit to start with`);
      const after = analyse({ bottom: open(d.bottom), ...(d.branches ? { branches: d.branches.map(open) } : { top: open(d.top) }) });
      const out = a.rows.flatMap((r, i) => (after.live[i] ? [] : r.filter((p) => p.k === 'bulb').map((p) => p.tag)));
      const total = a.rows.flat().filter((p) => p.k === 'bulb').length;
      const expect = out.length === total ? 'All the bulbs go out' : out.length === 1 ? `Only bulb ${out[0]} goes out` : 'Nothing changes at all';
      assert.equal(right(q), expect, label);
      break;
    }
    case 'current': {
      const a = analyse(d);
      const meters = [...a.bottom.map((p) => [p, -1]), ...a.rows.flatMap((r, i) => r.map((p) => [p, i]))].filter(([p]) => p.k === 'ammeter');
      const val = (p) => (p.read && p.read !== '?' ? parseFloat(p.read) : null);
      const asked = meters.find(([p]) => p.read === '?');
      let expect;
      if (!a.parallel) expect = val(meters.find(([p]) => val(p) != null)[0]);
      else {
        const branch = a.rows.map((r, i) => { const m = meters.find(([p, j]) => j === i); return m && val(m[0]); });
        // identical branches (same components) carry the same current
        a.rows.forEach((r, i) => { if (branch[i] == null) { const twin = a.rows.findIndex((s, j) => j !== i && branch[j] != null && JSON.stringify(s.map((p) => p.k)) === JSON.stringify(r.map((p) => p.k))); if (twin >= 0) branch[i] = branch[twin]; } });
        const main = val(meters.find(([, j]) => j === -1)[0]);
        if (asked[1] === -1) expect = branch.reduce((s, x) => s + x, 0);
        else expect = main - branch.reduce((s, x, i) => s + (i === asked[1] ? 0 : x), 0);
      }
      assert.ok(near(Math.round(+q.numeric.value * 100), Math.round(expect * 100)), `${label}: ${q.numeric.value} A, expected ${expect}`);
      break;
    }
    case 'anomaly': case 'conclusion': {
      const t = [].concat(q.visual).find((v) => v.kind === 'table' && v.question);
      const ys = t.rows.map((r) => +r[1]);
      const steady = (s) => s.every((y, i) => !i || y > s[i - 1]) || s.every((y, i) => !i || y < s[i - 1]);
      if (e.ask === 'conclusion') {
        assert.ok(steady(ys), label);
        const rising = ys[1] > ys[0];
        const time = /time/i.test(t.head[1]);
        // a falling time means the motor works faster
        assert.match(right(q), time ? (rising ? /slower/ : /faster/) : rising ? /brighter|louder/ : /dimmer/, `${label}: ${right(q)}`);
      } else {
        const fits = ys.map((_, i) => steady(ys.filter((__, j) => j !== i)));
        assert.ok(!steady(ys) && fits.filter(Boolean).length === 1, `${label}: one odd result in ${ys}`);
        assert.equal(right(q), `The result for ${t.rows[fits.indexOf(true)][0]}`, label);
      }
      break;
    }
    case 'renewable':
      assert.equal(/^Renewable/.test(right(q)), /wind|sunlight|water|tides/.test(q.prompt), `${label}: ${q.prompt}`);
      break;
    case 'compare': case 'wh': {
      const uses = [...q.prompt.matchAll(/(\d+) W\)? for (\d+) (hours?|minutes)/g)].map((m) => [+m[1] * +m[2] / (m[3].startsWith('min') ? 60 : 1)]);
      if (e.ask === 'wh') {
        const m = /rated (\d+) W.* in (\d+) (hours?|minutes)/.exec(q.prompt);
        assert.ok(near(+q.numeric.value, +m[1] * +m[2] / (m[3].startsWith('min') ? 60 : 1)), `${label}: ${q.prompt}`);
      } else {
        const names = [...q.prompt.matchAll(/(?:: |or )(an? [^(]+?) \(/g)].map((m) => m[1]);
        assert.equal(uses.length, 2, label);
        const big = uses[0][0] > uses[1][0] ? names[0] : names[1];
        assert.equal(right(q).toLowerCase(), big.toLowerCase(), `${label}: ${q.prompt}`);
      }
      break;
    }
    case 'variable': case 'safety':
      assert.equal(q.options.length, 3, label);
      break;
    default: assert.fail(`${label}: unknown ask ${e.ask}`);
  }
}

test('electricity generators: every answer is right, worked out again from the circuit', () => {
  const asks = new Set();
  for (const [name, gen] of Object.entries(GEN)) for (const level of [1, 2, 3]) {
    const rng = makeRng(`elec-verify:${name}:${level}`);
    for (let i = 0; i < 300; i++) {
      const q = gen(level, rng), label = `${name} L${level} #${i}`;
      verify(q, label);
      asks.add(q.elec.ask);
      assert.equal(check(q, correctResponse(q)).correct, true, label);
      assert.ok(q.steps?.length >= 3, `${label}: a worked example in steps`);
      assert.ok(!/used up/i.test(q.steps.join(' ').replace(/(not|never|n’t|nor) [a-z ]*used up/gi, '')), `${label}: never says current is used up`);
    }
  }
  for (const a of ['works', 'reverse', 'name', 'count', 'describe', 'conductor', 'conductor-pick', 'voltage', 'brightest', 'dimmest', 'equal', 'break', 'switch', 'current', 'anomaly', 'conclusion', 'renewable', 'compare', 'wh']) assert.ok(asks.has(a), `some question asks ${a}`);
});

// ---------------------------------------------------------------- drawing
const BAD = /NaN|undefined|Infinity|\[object/;
function walk(el, out = { bad: [], tags: [], texts: [] }) {
  if (el instanceof Txt) { if (BAD.test(el.t)) out.bad.push(el.t); out.texts.push(el.t); return out; }
  if (!(el instanceof El)) return out;
  for (const [k, v] of Object.entries(el.attrs)) if (BAD.test(v)) out.bad.push(`${el.tag}.${k}=${v}`);
  out.tags.push(el);
  for (const c of el.children) walk(c, out);
  return out;
}
function drawsCircuit(d, label) {
  let el;
  assert.doesNotThrow(() => { el = mathsDiagram(d); }, `${label}: throws`);
  assert.ok(el, `${label}: draws nothing`);
  const w = walk(el);
  assert.deepEqual(w.bad, [], label);
  const svgs = w.tags.filter((t) => t.tag === 'svg');
  assert.equal(svgs.length, d.many ? d.many.length : 1, `${label}: one drawing per circuit`);
  for (const [s, c] of svgs.map((s, i) => [s, d.many ? d.many[i] : d])) {
    const parts = [...c.bottom, ...(c.branches || [c.top]).flat()].map(norm);
    // the description read out by screen readers names what is drawn
    for (const k of ['bulb', 'motor', 'buzzer', 'ammeter', 'resistor']) if (parts.some((p) => p.k === k)) assert.match(s.attrs['aria-label'], new RegExp(k), `${label}: ${k}`);
    // each tag letter and reading is drawn as text
    for (const p of parts) for (const t of [p.tag, p.read]) if (t) assert.ok(walk(s).texts.includes(t), `${label}: label ${t}`);
  }
}

test('electricity: every circuit diagram, generated or fixed, can be drawn', () => {
  for (const [name, gen] of Object.entries(GEN)) for (const level of [1, 2, 3]) {
    const rng = makeRng(`elec-draw:${name}:${level}`);
    for (let i = 0; i < 80; i++) {
      const q = gen(level, rng), label = `${name} L${level} #${i}`;
      if (q.diagram) drawsCircuit(q.diagram, label);
      for (const v of [].concat(q.visual || [])) if (v.kind === 'maths') drawsCircuit(v.diagram, `${label} picture`);
    }
  }
  for (const x of [...deck.topics, ...deck.items]) {
    if (x.diagram) drawsCircuit(x.diagram, x.id);
    for (const v of [].concat(x.visual || [])) if (v.kind === 'maths') drawsCircuit(v.diagram, `${x.id} picture`);
  }
});
