// Visuals for topics and questions: labelled diagrams, maths diagrams, timelines, cycles, flow
// charts, family trees, tables, coloured word/sentence blocks and phonics sound buttons.
// A visual is plain data (from content) and is drawn here. Shown on topic intros, learn cards,
// worked examples and after a wrong answer; inside the question only when `question: true`.

import { h, s, rich } from './dom.js';
import { mathsDiagram } from './diagrams.js';
import { loadMap, mapSVG } from './mapview.js';
import { PERIODS } from '../core/periods.js';

/** One visual spec, or a list of them, as a single element (or null). */
export function renderVisual(spec, opts = {}) {
  if (!spec) return null;
  const list = (Array.isArray(spec) ? spec : [spec]).filter((v) => !opts.inQuestion || v.question);
  if (!list.length) return null;
  const out = list.map((v) => {
    const body = (KINDS[v.kind] || unknown)(v, opts);
    return h('figure', { class: `visual visual-${v.kind}` }, body, v.caption ? rich('figcaption', v.caption) : null);
  });
  return out.length === 1 ? out[0] : h('div', { class: 'visual-group' }, out);
}



const unknown = (v) => h('p', { class: 'muted small' }, `(no picture for “${v.kind}”)`);

const KINDS = {
  // a labelled drawing from content/maps (the same engine as the maps), optionally with one part picked out
  diagram(v, opts) {
    const box = h('div', { class: 'visual-diagram-box' });
    loadMap(v.id).then((map) => {
      const view = mapSVG(map, { highlight: v.highlight, labels: v.labels !== false && !opts.inQuestion, hideLabel: opts.inQuestion ? v.highlight : null });
      box.replaceChildren(view.el);
    }).catch(() => box.replaceChildren(h('p', { class: 'muted small' }, 'The picture could not be loaded.')));
    return box;
  },
  maths: (v) => mathsDiagram(v.diagram) || unknown({ kind: v.diagram?.type }),
  timeline,
  cycle,
  flow,
  tree,
  table,
  blocks,
  sounds,
};

// ---------------------------------------------------------------- text in SVG
const INK = 'currentColor';
function wrap(text, max) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (cur && (cur + ' ' + w).length > max) { lines.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w;
  }
  if (cur) lines.push(cur);
  return lines;
}
function textLines(x, y, lines, attrs = {}) {
  const lh = attrs.lh || 15;
  const t = s('text', { x, y: y - ((lines.length - 1) * lh) / 2, 'text-anchor': 'middle', 'dominant-baseline': 'middle', fill: INK, 'font-size': 13.5, 'font-family': 'inherit', ...attrs });
  lines.forEach((l, i) => t.append(s('tspan', { x, dy: i ? lh : 0 }, l)));
  return t;
}
const tone = (i) => `var(--v${(i % 6) + 1})`;
const toneSoft = (i) => `var(--v${(i % 6) + 1}-soft)`;

// ---------------------------------------------------------------- timeline
// { from, to, set?: 'britain' | ..., bands?: [[start, end, label]], events?: [[year, label]], mark?: label }
// Years are numbers; negative means BC. There is no year 0.
export function yearLabel(y, bcad) {
  if (y < 0) return `${-y} BC`;
  return bcad ? `AD ${y}` : String(y);
}
function timeline(v) {
  const W = 640, PAD = 18, barH = 36, FS = 13.5, LH = 15;
  const from = v.from, to = v.to;
  const X = (y) => PAD + ((y - from) / (to - from)) * (W - 2 * PAD);
  const bcad = from < 0 || to < 1100;
  const bands = (v.bands || PERIODS[v.set] || []).map(([a, b, label], i) => ({ a: Math.max(a, from), b: Math.min(b, to), label, i })).filter((p) => p.b > p.a);
  const events = (v.events || []).filter(([y]) => y >= from && y <= to).sort((a, b) => a[0] - b[0]);
  // lay the event labels out in rows above and below the bar, each in the first row where it
  // does not overlap the label before it, so close dates never print on top of each other
  const ROW = 3 * LH + 10;
  const rows = {}; // "up0" -> right edge of the last label placed there
  const placed = events.map(([y, label]) => {
    const x = X(y);
    const lines = wrap(`${yearLabel(y, bcad)}: ${label}`, 22).slice(0, 3);
    const w = Math.max(...lines.map((l) => l.length)) * FS * 0.53 + 6;
    const anchor = x - w / 2 < PAD ? 'start' : x + w / 2 > W - PAD ? 'end' : 'middle';
    const left = anchor === 'start' ? x - 4 : anchor === 'end' ? x - w + 4 : x - w / 2;
    let slot = null;
    for (let level = 0; level < 6 && !slot; level++) for (const side of ['up', 'down']) {
      const key = side + level;
      if (!slot && (rows[key] ?? -Infinity) < left - 8) slot = { side, level, key };
    }
    slot ||= { side: 'up', level: 5, key: 'up5' };
    rows[slot.key] = left + w;
    return { x, lines, anchor, ...slot };
  });
  const upRows = Math.max(-1, ...placed.filter((p) => p.side === 'up').map((p) => p.level)) + 1;
  const downRows = Math.max(-1, ...placed.filter((p) => p.side === 'down').map((p) => p.level)) + 1;
  const barY = 10 + upRows * ROW + (upRows ? 8 : 0);
  const below = barY + barH + 22; // the start/end years sit just under the bar
  const H = below + downRows * ROW + 8;
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': `Timeline from ${yearLabel(from, bcad)} to ${yearLabel(to, bcad)}`, class: 'visual-svg' });
  for (const p of bands) {
    const x1 = X(p.a), x2 = X(p.b), w = x2 - x1;
    const on = v.mark && p.label === v.mark;
    svg.append(s('rect', { x: x1, y: barY, width: Math.max(w, 1), height: barH, fill: on ? tone(p.i) : toneSoft(p.i), stroke: tone(p.i), 'stroke-width': 1 }));
    const lines = wrap(p.label, Math.max(4, Math.floor(w / 7.2)));
    const longest = Math.max(...lines.map((l) => l.length));
    const size = longest * (lines.length > 1 ? 6.4 : 7.2) <= w - 4 ? (lines.length > 1 ? 11.5 : 13) : longest * 5.6 <= w - 2 ? 10 : 0;
    if (w > 26 && lines.length <= 2 && size) svg.append(textLines(x1 + w / 2, barY + barH / 2, lines, { 'font-size': size, lh: size - 0.5, 'font-weight': on ? 800 : 600, fill: on ? 'var(--card)' : INK }));
  }
  if (!bands.length) svg.append(s('rect', { x: PAD, y: barY + barH / 2 - 3, width: W - 2 * PAD, height: 6, rx: 3, fill: 'var(--line)' }));
  const small = (x, t, anchor, bold) => s('text', { x, y: barY + barH + 15, 'text-anchor': anchor, fill: bold ? INK : 'var(--muted)', 'font-size': 12.5, 'font-weight': bold ? 700 : 400, 'font-family': 'inherit' }, t);
  // the BC/AD boundary, when it is in view; an end year too close to it is left off
  const xBoundary = from < 0 && to > 0 ? X(0.5) : null;
  const clear = (x) => xBoundary == null || Math.abs(x - xBoundary) > 70;
  if (clear(PAD)) svg.append(small(PAD, yearLabel(from, bcad), 'start'));
  if (clear(W - PAD)) svg.append(small(W - PAD, yearLabel(to, bcad), 'end'));
  if (from < 0 && to > 0) {
    const x = X(0.5);
    svg.append(s('line', { x1: x, y1: barY - 6, x2: x, y2: barY + barH + 4, stroke: INK, 'stroke-width': 2.5 }), small(x, 'BC | AD', 'middle', true));
  }
  for (const p of placed) {
    const up = p.side === 'up';
    const yMid = up ? barY - 12 - p.level * ROW - (p.lines.length * LH) / 2 : below + 6 + p.level * ROW + (p.lines.length * LH) / 2;
    const yEnd = up ? yMid + (p.lines.length * LH) / 2 : yMid - (p.lines.length * LH) / 2;
    svg.append(s('line', { x1: p.x, y1: up ? barY : barY + barH, x2: p.x, y2: yEnd, stroke: INK, 'stroke-width': 1.3, 'stroke-dasharray': p.level ? '3 3' : null }));
    svg.append(s('circle', { cx: p.x, cy: up ? barY : barY + barH, r: 4.5, fill: INK }));
    svg.append(textLines(p.x, yMid, p.lines, { 'font-size': FS, lh: LH, 'text-anchor': p.anchor }));
  }
  return h('div', { class: 'visual-scroll' }, svg);
}

// ---------------------------------------------------------------- cycle
// { steps: [...] } drawn round a circle with arrows, so the last step leads back to the first
function cycle(v) {
  const n = v.steps.length;
  const W = 420, H = 380, cx = W / 2, cy = H / 2, R = n <= 4 ? 125 : 140;
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': `Cycle: ${v.steps.join(', then ')}`, class: 'visual-svg' });
  svg.append(s('defs', {}, s('marker', { id: 'vc-arrow', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, s('path', { d: 'M0,0 L10,5 L0,10 z', fill: 'var(--muted)' }))));
  const pos = (i) => { const a = -Math.PI / 2 + (2 * Math.PI * i) / n; return [cx + R * Math.cos(a), cy + R * Math.sin(a), a]; };
  const gap = Math.min(0.5, (Math.PI / n) * 0.55);
  for (let i = 0; i < n; i++) {
    const a1 = -Math.PI / 2 + (2 * Math.PI * i) / n + gap, a2 = -Math.PI / 2 + (2 * Math.PI * (i + 1)) / n - gap;
    const p1 = [cx + R * Math.cos(a1), cy + R * Math.sin(a1)], p2 = [cx + R * Math.cos(a2), cy + R * Math.sin(a2)];
    svg.append(s('path', { d: `M${p1[0]},${p1[1]} A${R},${R} 0 0,1 ${p2[0]},${p2[1]}`, fill: 'none', stroke: 'var(--muted)', 'stroke-width': 2.5, 'marker-end': 'url(#vc-arrow)' }));
  }
  v.steps.forEach((st, i) => {
    const [x, y] = pos(i);
    const lines = wrap(st, 13).slice(0, 3);
    const w = Math.max(...lines.map((l) => l.length)) * 7.6 + 22, hh = lines.length * 15 + 16;
    svg.append(s('rect', { x: x - w / 2, y: y - hh / 2, width: w, height: hh, rx: 10, fill: toneSoft(i), stroke: tone(i), 'stroke-width': 1.5 }));
    svg.append(textLines(x, y, lines, { 'font-weight': 700 }));
  });
  if (v.centre) svg.append(textLines(cx, cy, wrap(v.centre, 16), { 'font-size': 13, fill: 'var(--muted)' }));
  return svg;
}

// ---------------------------------------------------------------- flow chart / sequence
// { steps: [...] } top to bottom, or { steps, across: true } left to right where there is room
function flow(v) {
  // side by side only while the steps fit across a tablet; longer sequences run down the page
  const across = v.across && v.steps.length <= 6 && v.steps.every((x) => x.length <= 18);
  return h('ol', { class: `vflow${across ? ' across' : ''}` }, v.steps.map((st, i) => h('li', { style: { '--c': tone(i), '--cs': toneSoft(i) } }, rich('span', st))));
}

// ---------------------------------------------------------------- tree (family tree, hierarchy)
// { root: { n: 'name', note?: 'm. …', c: [children] } }
function tree(v) {
  const node = (n) => h('li', {}, h('div', { class: `vtree-node${n.mark ? ' mark' : ''}` }, rich('strong', n.n), n.note ? rich('span', n.note) : null),
    n.c?.length ? h('ul', {}, n.c.map(node)) : null);
  const box = h('div', { class: 'visual-scroll' }, h('ul', { class: 'vtree' }, node(v.root)));
  // a tree wider than the screen opens centred on its top, so the root is in view
  requestAnimationFrame(() => { if (box.scrollWidth > box.clientWidth) box.scrollLeft = (box.scrollWidth - box.clientWidth) / 2; });
  return box;
}

// ---------------------------------------------------------------- table (endings, comparisons)
// { head: [...], rows: [[...]], tint?: 'rows' | 'cols' } cells may use **bold** for the part to notice
function table(v) {
  const tint = (r, c) => (v.tint === 'cols' && c > 0 ? { background: toneSoft(c - 1) } : v.tint === 'rows' ? { background: toneSoft(r) } : undefined);
  return h('div', { class: 'visual-scroll' }, h('table', { class: 'vtable' },
    v.head ? h('thead', {}, h('tr', {}, v.head.map((x, c) => rich('th', String(x), { style: tint(-1, c) && c ? { background: tone(c - 1), color: 'var(--card)' } : undefined })))) : null,
    h('tbody', {}, v.rows.map((row, r) => h('tr', {}, row.map((x, c) => rich(c === 0 ? 'th' : 'td', String(x), { style: tint(r, c) })))))));
}

// ---------------------------------------------------------------- blocks (word parts, sentence parts)
// { rows: [{ parts: [[text, role, label?]], result? }], legend?: true }
export const ROLES = {
  subject: 0, verb: 1, object: 2, adverbial: 3, conjunction: 4, clause: 5, subordinate: 3, preposition: 4, adjective: 2, noun: 0, pronoun: 5, article: 5,
  prefix: 4, root: 0, suffix: 2, stem: 0, ending: 1, augment: 4, tense: 3, person: 5,
};
function blocks(v) {
  const rows = v.rows.map((row) => h('div', { class: 'vblocks-row' },
    row.parts.map(([t, role, label], i) => [
      i && row.join ? h('span', { class: 'vblocks-join', 'aria-hidden': 'true' }, row.join) : null,
      h('span', { class: 'vblock', style: role ? { '--c': tone(ROLES[role] ?? 5), '--cs': toneSoft(ROLES[role] ?? 5) } : undefined },
        rich('span', t, { class: 'vblock-t' }), label || role ? h('span', { class: 'vblock-l' }, label ?? role) : null),
    ]),
    row.result ? [h('span', { class: 'vblocks-join', 'aria-hidden': 'true' }, '='), rich('strong', row.result, { class: 'vblocks-result' })] : null));
  return h('div', { class: 'vblocks' }, rows);
}

// ---------------------------------------------------------------- sound buttons (phonics)
// { words: ['sh.i.p', 'c.a_e.k'] } graphemes split by "."; a grapheme of two or more letters gets a
// dash, one letter a dot; "a_e" is a split digraph: its e goes to the end, joined by an arc
function sounds(v) {
  return h('div', { class: 'vsounds' }, v.words.map((w) => {
    const letters = []; // [char, graphemeIndex]
    const marks = [];
    let tailE = null;
    w.split('.').forEach((g, gi) => {
      if (g.includes('_')) { const [a, b] = g.split('_'); marks.push({ gi, split: true, start: letters.length }); letters.push([a, gi]); tailE = [b, gi]; return; }
      marks.push({ gi, start: letters.length, len: g.length });
      for (const ch of g) letters.push([ch, gi]);
    });
    if (tailE) letters.push(tailE);
    const CW = 26, W = letters.length * CW + 10, H = 70;
    const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'vsound-svg', role: 'img', 'aria-label': `${w.replace(/[._]/g, '')}: ${marks.length} sounds` });
    letters.forEach(([ch], i) => svg.append(s('text', { x: 5 + i * CW + CW / 2, y: 30, 'text-anchor': 'middle', 'font-size': 28, 'font-weight': 700, fill: INK, 'font-family': 'inherit' }, ch)));
    for (const m of marks) {
      const x = 5 + m.start * CW + CW / 2;
      if (m.split) {
        const xe = 5 + (letters.length - 1) * CW + CW / 2;
        svg.append(s('path', { d: `M${x},44 Q${(x + xe) / 2},66 ${xe},44`, fill: 'none', stroke: 'var(--v2)', 'stroke-width': 3, 'stroke-linecap': 'round' }));
      } else if (m.len > 1) {
        svg.append(s('line', { x1: x - 6, y1: 48, x2: 5 + (m.start + m.len - 1) * CW + CW / 2 + 6, y2: 48, stroke: 'var(--v2)', 'stroke-width': 4, 'stroke-linecap': 'round' }));
      } else {
        svg.append(s('circle', { cx: x, cy: 48, r: 5, fill: 'var(--v1)' }));
      }
    }
    return svg;
  }));
}
