// Maths diagrams for generated questions: shapes with dimensions, coordinate axes and charts.
// Everything is drawn in currentColor so it works in light and dark mode. Data charts use the
// maths blue for a single series and the subject palette (labelled) for pie sectors.

import { s } from './dom.js';

const INK = 'currentColor';
const BLUE = '#2f74e8';
const PIE = ['#2f74e8', '#d97a12', '#0f9a6e', '#9a48d6'];
const line = (x1, y1, x2, y2, extra = {}) => s('line', { x1, y1, x2, y2, stroke: INK, 'stroke-width': 2.5, 'stroke-linecap': 'round', ...extra });
const dash = (x1, y1, x2, y2) => line(x1, y1, x2, y2, { 'stroke-dasharray': '6 5', 'stroke-width': 2 });
const text = (x, y, t, extra = {}) => s('text', { x, y, fill: INK, 'font-size': 16, 'font-weight': 700, 'font-family': 'inherit', 'text-anchor': 'middle', ...extra }, t);
const small = (x, y, t, extra = {}) => s('text', { x, y, fill: INK, 'font-size': 13, 'font-family': 'inherit', 'text-anchor': 'middle', ...extra }, t);
const svg = (W, H, label, max = 360) => s('svg', { viewBox: `0 0 ${W} ${H}`, style: `max-width:${max}px;display:block;margin:0 auto 12px`, role: 'img', 'aria-label': label });
const rightAngle = (x, y, dx, dy) => s('path', { d: `M${x + dx} ${y} L${x + dx} ${y + dy} L${x} ${y + dy}`, fill: 'none', stroke: INK, 'stroke-width': 1.5 });
const unit = (v) => (typeof v === 'number' ? `${v} cm` : v);

export function mathsDiagram(d) {
  switch (d.type) {
    case 'rect': return rect(d);
    case 'tri': return tri(d);
    case 'para': return para(d);
    case 'lshape': return lshape(d);
    case 'cuboid': return cuboid(d);
    case 'axes': return axes(d);
    case 'bar': return bar(d);
    case 'pie': return pie(d);
    case 'line': return lineGraph(d);
    case 'parallel': return parallel(d);
    case 'clock': return clock(d);
    case 'tens': return tens(d);
    case 'fracshape': return fracShape(d);
    case 'coins': return coins(d);
    case 'array': return arrayDots(d);
    case 'pictogram': return pictogram(d);
    case 'numline': return numLine(d);
    case 'angle': return angle(d);
    case 'squares': return squares(d);
    case 'graph': return graph(d);
    case 'venn': return venn(d);
    case 'righttri': return rightTri(d);
    case 'trap': return trap(d);
    case 'curve': return curve(d);
    case 'sector': return sector(d);
    case 'colvec': return colvec(d);
    case 'tree': return tree(d);
    case 'boxplot': return boxplot(d);
    default: return null;
  }
}

function rect(d) {
  const W = 340, H = 220;
  const hv = typeof d.h === 'number' ? d.h : d.w * 0.6;
  const k = Math.min(220 / d.w, 130 / hv);
  const w = d.w * k, h = hv * k, x = (W - w) / 2 - 20, y = (H - h) / 2 - 10;
  const el = svg(W, H, 'Rectangle');
  el.append(s('rect', { x, y, width: w, height: h, fill: 'none', stroke: INK, 'stroke-width': 2.5, rx: 2 }),
    text(x + w / 2, y + h + 24, unit(d.w)), text(x + w + 12, y + h / 2 + 6, unit(d.h), { 'text-anchor': 'start' }));
  if (d.area) el.append(text(x + w / 2, y + h / 2 + 6, `Area = ${d.area} cm²`, { 'font-size': 15, 'font-weight': 600 }));
  return el;
}

function tri(d) {
  const W = 340, H = 230;
  const k = Math.min(230 / d.b, 140 / d.h);
  const b = d.b * k, h = d.h * k, x0 = (W - b) / 2 - 10, y0 = 180;
  const ax = x0 + b * 0.3; // apex, so the height is clearly inside
  const el = svg(W, H, 'Triangle');
  el.append(s('path', { d: `M${x0} ${y0} L${x0 + b} ${y0} L${ax} ${y0 - h} Z`, fill: 'none', stroke: INK, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }),
    dash(ax, y0 - h, ax, y0), rightAngle(ax, y0, 10, -10),
    text(x0 + b / 2, y0 + 26, unit(d.b)), text(ax - 10, y0 - h / 2 + 6, unit(d.h), { 'text-anchor': 'end' }),
    text((x0 + b + ax) / 2 + 14, y0 - h / 2, unit(d.s), { 'text-anchor': 'start', 'font-weight': 600 }));
  return el;
}

function para(d) {
  const W = 360, H = 230;
  const k = Math.min(200 / d.b, 130 / d.h);
  const b = d.b * k, h = d.h * k, off = Math.min(60, h * 0.6), x0 = (W - b - off) / 2 - 10, y0 = 180;
  const el = svg(W, H, 'Parallelogram');
  el.append(s('path', { d: `M${x0} ${y0} L${x0 + b} ${y0} L${x0 + b + off} ${y0 - h} L${x0 + off} ${y0 - h} Z`, fill: 'none', stroke: INK, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }),
    dash(x0 + off, y0 - h, x0 + off, y0), rightAngle(x0 + off, y0, 10, -10),
    text(x0 + b / 2 + off / 2, y0 + 26, unit(d.b)), text(x0 + off + 10, y0 - h / 2 + 6, unit(d.h), { 'text-anchor': 'start' }),
    text(x0 + b + off + 8, y0 - h / 2 + 6, unit(d.s), { 'text-anchor': 'start', 'font-weight': 600 }));
  return el;
}

function lshape(d) {
  const W = 340, H = 260;
  const k = Math.min(200 / d.W, 170 / d.H);
  const w = d.W * k, h = d.H * k, cw = d.w * k, ch = d.h * k, x0 = (W - w) / 2 - 30, y0 = 30;
  const el = svg(W, H, 'L-shape');
  el.append(s('path', { d: `M${x0} ${y0} L${x0 + w - cw} ${y0} L${x0 + w - cw} ${y0 + ch} L${x0 + w} ${y0 + ch} L${x0 + w} ${y0 + h} L${x0} ${y0 + h} Z`, fill: 'none', stroke: INK, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }),
    text(x0 + w / 2, y0 + h + 24, unit(d.W)), text(x0 - 10, y0 + h / 2 + 6, unit(d.H), { 'text-anchor': 'end' }),
    text(x0 + w - cw / 2, y0 + ch + 20, unit(d.w), { 'font-size': 14 }), text(x0 + w - cw - 8, y0 + ch / 2 + 6, unit(d.h), { 'text-anchor': 'end', 'font-size': 14 }));
  return el;
}

function cuboid(d) {
  const W = 360, H = 240;
  const lv = +d.l, wv = +d.w, hv = typeof d.h === 'number' ? d.h : Math.max(lv, wv) * 0.6;
  const k = Math.min(200 / lv, 120 / wv, 120 / hv);
  const l = lv * k, w = wv * k * 0.5, h = hv * k, x0 = (W - l - w) / 2 - 20, y0 = 40 + w;
  const el = svg(W, H, 'Cuboid');
  const front = s('rect', { x: x0, y: y0, width: l, height: h, fill: 'none', stroke: INK, 'stroke-width': 2.5 });
  const top = s('path', { d: `M${x0} ${y0} L${x0 + w} ${y0 - w} L${x0 + l + w} ${y0 - w} L${x0 + l} ${y0} Z`, fill: 'none', stroke: INK, 'stroke-width': 2.5, 'stroke-linejoin': 'round' });
  const side = s('path', { d: `M${x0 + l} ${y0} L${x0 + l + w} ${y0 - w} L${x0 + l + w} ${y0 - w + h} L${x0 + l} ${y0 + h} Z`, fill: 'none', stroke: INK, 'stroke-width': 2.5, 'stroke-linejoin': 'round' });
  el.append(front, top, side,
    text(x0 + l / 2, y0 + h + 24, unit(d.l)), text(x0 - 10, y0 + h / 2 + 6, unit(d.h), { 'text-anchor': 'end' }),
    text(x0 + l + w / 2 + 12, y0 + h - w / 2 + 6, unit(d.w), { 'text-anchor': 'start' }));
  return el;
}

function axes(d) {
  const [lo, hi] = d.range, n = hi - lo;
  const cell = n > 10 ? 22 : 28, m = 30;
  const W = n * cell + 2 * m, H = n * cell + 2 * m;
  const X = (x) => m + (x - lo) * cell, Y = (y) => m + (hi - y) * cell;
  const el = svg(W, H, 'Coordinate grid', 400);
  for (let k = lo; k <= hi; k++) {
    el.append(line(X(k), Y(lo), X(k), Y(hi), { stroke: INK, 'stroke-width': 0.6, opacity: 0.45 }), line(X(lo), Y(k), X(hi), Y(k), { stroke: INK, 'stroke-width': 0.6, opacity: 0.45 }));
  }
  const ox = lo <= 0 ? 0 : lo, oy = lo <= 0 ? 0 : lo;
  el.append(line(X(lo), Y(oy), X(hi), Y(oy), { 'stroke-width': 2 }), line(X(ox), Y(lo), X(ox), Y(hi), { 'stroke-width': 2 }));
  for (let k = lo; k <= hi; k++) {
    if (k === 0 && lo < 0) continue;
    if (n > 10 && k % 2 !== 0) continue;
    el.append(small(X(k), Y(oy) + 16, k < 0 ? `−${-k}` : String(k)), small(X(ox) - 8, Y(k) + 4, k < 0 ? `−${-k}` : String(k), { 'text-anchor': 'end' }));
  }
  el.append(text(X(hi) + 10, Y(oy) + 5, 'x', { 'font-size': 14, 'text-anchor': 'start', 'font-style': 'italic' }), text(X(ox), Y(hi) - 10, 'y', { 'font-size': 14, 'font-style': 'italic' }));
  for (const p of d.points) {
    el.append(s('circle', { cx: X(p.x), cy: Y(p.y), r: 6, fill: BLUE, stroke: 'var(--card, #fff)', 'stroke-width': 2 }),
      text(X(p.x) + 9, Y(p.y) - 8, p.label, { 'text-anchor': 'start', 'font-size': 15 }));
  }
  return el;
}

// two parallel lines cut by a transversal; one angle known, one marked ?
function parallel(d) {
  const W = 320, H = 210, y0 = 60, y1 = 150;
  const el = svg(W, H, 'Parallel lines and a transversal');
  // transversal from bottom-left to top-right; crossings at the two lines
  const slope = 0.9, xAt = (y) => 160 + (105 - y) * slope;
  el.append(line(20, y0, 300, y0), line(20, y1, 300, y1), line(xAt(190), 190, xAt(20), 20));
  const arrow = (y) => s('path', { d: `M250 ${y - 6} l10 6 l-10 6`, fill: 'none', stroke: INK, 'stroke-width': 2 });
  el.append(arrow(y0), arrow(y1));
  const OFF = { rt: [22, -12], lt: [-22, -12], lb: [-22, 20], rb: [22, 20] };
  const place = (pos, label) => {
    const cy = pos.line === 0 ? y0 : y1, cx = xAt(cy);
    const [dx, dy] = OFF[pos.r];
    el.append(text(cx + dx * 1.3, cy + dy, label, { 'text-anchor': dx < 0 ? 'end' : 'start' }));
  };
  place(d.known, `${d.a}°`);
  place(d.ask, '?');
  return el;
}

function bar(d) {
  const W = 380, H = 260, m = { l: 44, r: 10, t: 30, b: 40 };
  const max = Math.max(...d.cats.map((c) => c.v));
  const top = Math.ceil(max / d.step) * d.step + d.step;
  const pw = W - m.l - m.r, ph = H - m.t - m.b;
  const Y = (v) => m.t + ph - (v / top) * ph;
  const el = svg(W, H, d.title, 420);
  el.append(text(W / 2, 18, d.title, { 'font-size': 14, 'font-weight': 600 }));
  for (let v = 0; v <= top; v += d.step) {
    el.append(line(m.l, Y(v), W - m.r, Y(v), { 'stroke-width': v === 0 ? 1.5 : 0.6, opacity: v === 0 ? 1 : 0.4 }), small(m.l - 6, Y(v) + 4, String(v), { 'text-anchor': 'end' }));
  }
  const slot = pw / d.cats.length, bw = slot * 0.6;
  d.cats.forEach((c, i) => {
    const x = m.l + slot * i + (slot - bw) / 2;
    el.append(s('rect', { x, y: Y(c.v), width: bw, height: Y(0) - Y(c.v), fill: BLUE, rx: 3 }), small(x + bw / 2, H - m.b + 18, c.label));
  });
  el.append(small(m.l - 6, m.t - 8, d.ylabel, { 'text-anchor': 'end', 'font-size': 12 }));
  return el;
}

function pie(d) {
  const W = 360, H = 300, cx = 180, cy = 160, R = 100;
  const el = svg(W, H, d.title, 380);
  el.append(text(W / 2, 18, d.title, { 'font-size': 14, 'font-weight': 600 }));
  let a = -90;
  const pt = (deg, r) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
  d.sectors.forEach((sec, i) => {
    const [x1, y1] = pt(a, R), [x2, y2] = pt(a + sec.deg, R);
    const large = sec.deg > 180 ? 1 : 0;
    el.append(s('path', { d: `M${cx} ${cy} L${x1} ${y1} A${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`, fill: PIE[i % PIE.length], stroke: 'var(--card, #fff)', 'stroke-width': 2 }));
    const [lx, ly] = pt(a + sec.deg / 2, R + 22);
    el.append(small(lx, ly + 4, sec.label, { 'font-weight': 700, 'text-anchor': lx < cx - 5 ? 'end' : lx > cx + 5 ? 'start' : 'middle' }));
    a += sec.deg;
  });
  return el;
}

function lineGraph(d) {
  const W = 400, H = 270, m = { l: 44, r: 16, t: 30, b: 44 };
  const max = Math.max(...d.ys), min = Math.min(0, ...d.ys);
  const step = max - min > 16 ? 4 : 2;
  const top = Math.ceil((max + 1) / step) * step, bottom = Math.floor(min / step) * step;
  const pw = W - m.l - m.r, ph = H - m.t - m.b;
  const X = (i) => m.l + (i / (d.xs.length - 1)) * pw, Y = (v) => m.t + ph - ((v - bottom) / (top - bottom)) * ph;
  const el = svg(W, H, d.title, 440);
  el.append(text(W / 2, 18, d.title, { 'font-size': 14, 'font-weight': 600 }));
  for (let v = bottom; v <= top; v += step) el.append(line(m.l, Y(v), W - m.r, Y(v), { 'stroke-width': v === 0 ? 1.5 : 0.6, opacity: v === 0 ? 1 : 0.4 }), small(m.l - 6, Y(v) + 4, String(v), { 'text-anchor': 'end' }));
  d.xs.forEach((x, i) => el.append(line(X(i), m.t, X(i), Y(bottom), { 'stroke-width': 0.6, opacity: 0.4 }), small(X(i), H - m.b + 18, x, { 'font-size': 12 })));
  el.append(s('polyline', { points: d.ys.map((v, i) => `${X(i)},${Y(v)}`).join(' '), fill: 'none', stroke: BLUE, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }));
  d.ys.forEach((v, i) => el.append(s('circle', { cx: X(i), cy: Y(v), r: 4.5, fill: BLUE, stroke: 'var(--card, #fff)', 'stroke-width': 2 })));
  el.append(small(m.l - 6, m.t - 8, d.ylabel, { 'text-anchor': 'end', 'font-size': 12 }));
  return el;
}

// --- Year 2 diagrams ---------------------------------------------------------------------

function clock(d) {
  const el = svg(220, 220, `Clock showing ${d.h}:${String(d.m).padStart(2, '0')}`, 240);
  const c = 110, R = 96;
  el.append(s('circle', { cx: c, cy: c, r: R, fill: 'var(--card, #fff)', stroke: INK, 'stroke-width': 4 }));
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2, big = i % 5 === 0;
    el.append(line(c + Math.sin(a) * (R - (big ? 12 : 6)), c - Math.cos(a) * (R - (big ? 12 : 6)), c + Math.sin(a) * (R - 2), c - Math.cos(a) * (R - 2), { 'stroke-width': big ? 3 : 1.2 }));
  }
  for (let n = 1; n <= 12; n++) {
    const a = (n / 12) * Math.PI * 2;
    el.append(text(c + Math.sin(a) * (R - 28), c - Math.cos(a) * (R - 28) + 6, String(n), { 'font-size': 18 }));
  }
  const ma = (d.m / 60) * Math.PI * 2, ha = (((d.h % 12) + d.m / 60) / 12) * Math.PI * 2;
  el.append(line(c, c, c + Math.sin(ha) * 50, c - Math.cos(ha) * 50, { 'stroke-width': 7 }),
    line(c, c, c + Math.sin(ma) * 76, c - Math.cos(ma) * 76, { 'stroke-width': 4, stroke: BLUE }),
    s('circle', { cx: c, cy: c, r: 6, fill: INK }));
  return el;
}

// base-ten blocks: tall rods of ten and small cubes
function tens(d) {
  const n = d.tens, o = d.ones, hundreds = d.hundreds || 0;
  const W = Math.max(200, hundreds * 74 + n * 20 + Math.ceil(o / 5) * 20 + 60), H = 170;
  const el = svg(W, H, `${hundreds ? `${hundreds} hundreds, ` : ''}${n} tens and ${o} ones`, 420);
  let x = 16;
  for (let i = 0; i < hundreds; i++) {
    for (let r = 0; r < 10; r++) for (let k = 0; k < 10; k++) el.append(s('rect', { x: x + k * 6.4, y: 18 + r * 13, width: 6.4, height: 13, fill: '#ffd166', stroke: '#b98a1b', 'stroke-width': 0.6 }));
    x += 74;
  }
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < 10; k++) el.append(s('rect', { x, y: 18 + k * 13, width: 14, height: 13, fill: BLUE, stroke: '#1f5cc4', 'stroke-width': 1 }));
    x += 20;
  }
  x += 14;
  for (let i = 0; i < o; i++) el.append(s('rect', { x: x + Math.floor(i / 5) * 20, y: 18 + (i % 5) * 20, width: 14, height: 14, rx: 2, fill: '#d97a12', stroke: '#a85c0c', 'stroke-width': 1 }));
  return el;
}

function fracShape(d) {
  const el = svg(200, 200, `A shape split into ${d.parts} equal parts with ${d.shaded} shaded`, 220);
  const fill = (i) => (i < d.shaded ? BLUE : 'var(--card, #fff)');
  if (d.shape === 'circle') {
    const c = 100, R = 80;
    for (let i = 0; i < d.parts; i++) {
      const a0 = (i / d.parts) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / d.parts) * Math.PI * 2 - Math.PI / 2;
      const large = 1 / d.parts > 0.5 ? 1 : 0;
      el.append(s('path', { d: `M${c} ${c} L${c + R * Math.cos(a0)} ${c + R * Math.sin(a0)} A${R} ${R} 0 ${large} 1 ${c + R * Math.cos(a1)} ${c + R * Math.sin(a1)} Z`, fill: fill(i), stroke: INK, 'stroke-width': 3 }));
    }
  } else {
    const cols = d.parts <= 4 ? d.parts : d.parts / 2, rows = d.parts / cols, w = 160 / cols, hh = (d.parts <= 4 ? 90 : 140) / rows;
    for (let i = 0; i < d.parts; i++) el.append(s('rect', { x: 20 + (i % cols) * w, y: 30 + Math.floor(i / cols) * hh, width: w, height: hh, fill: fill(i), stroke: INK, 'stroke-width': 3 }));
  }
  return el;
}

const COIN = { 1: ['#c47a3a', 26], 2: ['#c47a3a', 32], 5: ['#c9ccd2', 24], 10: ['#c9ccd2', 32], 20: ['#c9ccd2', 28], 50: ['#c9ccd2', 34], 100: ['#e2c044', 32], 200: ['#e2c044', 38] };
function coins(d) {
  const W = Math.max(220, d.coins.length * 80 + 20);
  const el = svg(W, 100, 'Coins', Math.min(560, W + 40));
  d.coins.forEach((v, i) => {
    const [col, r] = COIN[v];
    const cx = 50 + i * 80, cy = 50;
    const label = v >= 100 ? `£${v / 100}` : `${v}p`;
    if (v === 20 || v === 50) {
      const pts = Array.from({ length: 7 }, (_, k) => { const a = (k / 7) * Math.PI * 2 - Math.PI / 2; return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`; }).join(' ');
      el.append(s('polygon', { points: pts, fill: col, stroke: '#7b7f88', 'stroke-width': 2 }));
    } else {
      el.append(s('circle', { cx, cy, r, fill: col, stroke: v >= 100 ? '#a88419' : v <= 2 ? '#8a5226' : '#7b7f88', 'stroke-width': 2 }));
      if (v === 200) el.append(s('circle', { cx, cy, r: r - 10, fill: '#c9ccd2' }));
    }
    el.append(text(cx, cy + 6, label, { 'font-size': 15, fill: '#1f1d2e' }));
  });
  return el;
}

function arrayDots(d) {
  const W = d.cols * 34 + 30, H = d.rows * 34 + 30;
  const el = svg(W, H, `An array of ${d.rows} rows of ${d.cols}`, Math.min(360, W * 1.4));
  for (let r = 0; r < d.rows; r++) for (let c = 0; c < d.cols; c++) el.append(s('circle', { cx: 30 + c * 34, cy: 30 + r * 34, r: 12, fill: d.colour || '#d62f3a' }));
  return el;
}

// pictogram: one picture stands for `key` things; a half picture for half of that
function pictogram(d) {
  const W = 360, rowH = 40, H = d.rows.length * rowH + 50;
  const el = svg(W, H, d.title, 400);
  el.append(text(W / 2, 18, d.title, { 'font-size': 14, 'font-weight': 600 }));
  d.rows.forEach((row, i) => {
    const y = 34 + i * rowH;
    el.append(small(70, y + 22, row.label, { 'text-anchor': 'end', 'font-weight': 700 }));
    const whole = Math.floor(row.n / d.key), half = row.n % d.key !== 0;
    for (let k = 0; k < whole + (half ? 1 : 0); k++) {
      const x = 84 + k * 32;
      const g = s('g', {});
      g.append(s('circle', { cx: x + 13, cy: y + 16, r: 13, fill: '#ffd166', stroke: '#b98a1b', 'stroke-width': 1.5 }), s('path', { d: `M${x + 13} ${y + 6} l3 7 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1z`, fill: '#d97a12' }));
      if (half && k === whole) { const clip = s('rect', { x: x + 13, y: y, width: 16, height: 32, fill: 'var(--card, #fff)' }); g.append(clip); }
      el.append(g);
    }
  });
  el.append(small(W / 2, H - 6, `Key: one star = ${d.key} ${d.unit}`, { 'font-weight': 700 }));
  return el;
}

function numLine(d) {
  const W = 400, H = 90, x0 = 30, x1 = 370;
  const X = (v) => x0 + ((v - d.min) / (d.max - d.min)) * (x1 - x0);
  const el = svg(W, H, 'Number line', 440);
  el.append(line(x0, 50, x1, 50));
  for (let v = d.min; v <= d.max; v += d.step) {
    el.append(line(X(v), 42, X(v), 58, { 'stroke-width': 2 }));
    if (d.labels?.includes(v) || v === d.min || v === d.max) el.append(small(X(v), 78, String(v)));
  }
  if (d.mark != null) el.append(s('path', { d: `M${X(d.mark)} 38 l-8 -14 h16 z`, fill: '#d62f3a' }), text(X(d.mark), 18, '?', { fill: '#d62f3a' }));
  return el;
}

// an angle between two arms (degrees, measured anticlockwise from the bottom arm); no right-angle mark, so it is a fair question
function angle(d) {
  const W = 300, H = 200, vy = 165, L = 130;
  const a = (d.deg * Math.PI) / 180;
  const vx = Math.max(40, 24 - Math.cos(a) * L * 0.85); // room on the left for an obtuse arm
  const el = svg(W, H, 'An angle', 320);
  el.append(line(vx, vy, vx + L, vy, { 'stroke-width': 4 }), line(vx, vy, vx + Math.cos(a) * L * 0.85, vy - Math.sin(a) * L * 0.85, { 'stroke-width': 4 }));
  const r = 34;
  el.append(s('path', { d: `M${vx + r} ${vy} A${r} ${r} 0 0 0 ${vx + Math.cos(a) * r} ${vy - Math.sin(a) * r}`, fill: 'none', stroke: '#d62f3a', 'stroke-width': 3 }));
  el.append(s('circle', { cx: vx, cy: vy, r: 4, fill: INK }));
  return el;
}

// squared paper with some squares shaded: area by counting
function squares(d) {
  const size = Math.min(34, Math.floor(300 / Math.max(d.cols, d.rows))), W = d.cols * size + 20, H = d.rows * size + 20;
  const el = svg(W, H, `A shape made of ${d.cells.length} squares`, Math.min(360, W * 1.3));
  for (const [r, c] of d.cells) el.append(s('rect', { x: 10 + c * size, y: 10 + r * size, width: size, height: size, fill: BLUE, opacity: 0.75 }));
  for (let r = 0; r <= d.rows; r++) el.append(line(10, 10 + r * size, 10 + d.cols * size, 10 + r * size, { 'stroke-width': 1, opacity: 0.45 }));
  for (let c = 0; c <= d.cols; c++) el.append(line(10 + c * size, 10, 10 + c * size, 10 + d.rows * size, { 'stroke-width': 1, opacity: 0.45 }));
  return el;
}

// ---- Year 8 ------------------------------------------------------------------------------

// coordinate grid with straight lines y = mx + c drawn across it: { range: [lo, hi], lines: [{ m, c }] }
function graph(d) {
  const [lo, hi] = d.range, n = hi - lo;
  const cell = n > 10 ? 22 : 28, m = 30;
  const W = n * cell + 2 * m, H = n * cell + 2 * m;
  const X = (x) => m + (x - lo) * cell, Y = (y) => m + (hi - y) * cell;
  const el = svg(W, H, 'Graph of a straight line', 400);
  for (let k = lo; k <= hi; k++) {
    el.append(line(X(k), Y(lo), X(k), Y(hi), { 'stroke-width': 0.6, opacity: 0.45 }), line(X(lo), Y(k), X(hi), Y(k), { 'stroke-width': 0.6, opacity: 0.45 }));
  }
  el.append(line(X(lo), Y(0), X(hi), Y(0), { 'stroke-width': 2 }), line(X(0), Y(lo), X(0), Y(hi), { 'stroke-width': 2 }));
  for (let k = lo; k <= hi; k++) {
    if (k === 0 || (n > 10 && k % 2 !== 0)) continue;
    el.append(small(X(k), Y(0) + 16, k < 0 ? `−${-k}` : String(k)), small(X(0) - 8, Y(k) + 4, k < 0 ? `−${-k}` : String(k), { 'text-anchor': 'end' }));
  }
  el.append(text(X(hi) + 10, Y(0) + 5, 'x', { 'font-size': 14, 'text-anchor': 'start', 'font-style': 'italic' }), text(X(0), Y(hi) - 10, 'y', { 'font-size': 14, 'font-style': 'italic' }));
  for (const L of d.lines || []) {
    // clip y = mx + c to the square [lo, hi] x [lo, hi]
    let x1 = lo, x2 = hi;
    if (L.m !== 0) {
      const a = (lo - L.c) / L.m, b = (hi - L.c) / L.m;
      x1 = Math.max(lo, Math.min(a, b)); x2 = Math.min(hi, Math.max(a, b));
    }
    el.append(line(X(x1), Y(L.m * x1 + L.c), X(x2), Y(L.m * x2 + L.c), { stroke: BLUE, 'stroke-width': 3 }));
  }
  return el;
}

// two-set Venn diagram: { labels: [A, B], only: [a, b], both, out }
function venn(d) {
  const W = 340, H = 210, cy = 108, r = 72, c1 = 128, c2 = 212;
  const el = svg(W, H, 'Venn diagram', 380);
  el.append(s('rect', { x: 8, y: 8, width: W - 16, height: H - 16, rx: 10, fill: 'none', stroke: INK, 'stroke-width': 2 }),
    s('circle', { cx: c1, cy, r, fill: BLUE, 'fill-opacity': 0.12, stroke: INK, 'stroke-width': 2.5 }),
    s('circle', { cx: c2, cy, r, fill: '#d97a12', 'fill-opacity': 0.12, stroke: INK, 'stroke-width': 2.5 }),
    text(c1 - r + 6, cy - r + 8, d.labels[0], { 'text-anchor': 'start' }), text(c2 + r - 6, cy - r + 8, d.labels[1], { 'text-anchor': 'end' }),
    text(c1 - 34, cy + 6, String(d.only[0]), { 'font-size': 18 }), text((c1 + c2) / 2, cy + 6, String(d.both), { 'font-size': 18 }),
    text(c2 + 34, cy + 6, String(d.only[1]), { 'font-size': 18 }), text(W - 30, H - 22, String(d.out), { 'font-size': 18 }));
  return el;
}

// right-angled triangle, right angle bottom-left; labels on the left side, the bottom and the
// hypotenuse ('' for none); angle: true marks θ at the bottom-right corner
function rightTri(d) {
  const W = 320, H = 220, x0 = 70, y0 = 180, bw = 190, h = 140;
  const el = svg(W, H, 'Right-angled triangle', 340);
  el.append(s('path', { d: `M${x0} ${y0} L${x0 + bw} ${y0} L${x0} ${y0 - h} Z`, fill: 'none', stroke: INK, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }),
    rightAngle(x0, y0, 14, -14));
  if (d.left) el.append(text(x0 - 10, y0 - h / 2 + 6, d.left, { 'text-anchor': 'end' }));
  if (d.bottom) el.append(text(x0 + bw / 2, y0 + 26, d.bottom));
  if (d.hyp) el.append(text(x0 + bw / 2 + 14, y0 - h / 2 - 8, d.hyp, { 'text-anchor': 'start' }));
  if (d.angle) {
    const r = 36, a = Math.atan2(h, bw);
    el.append(s('path', { d: `M${x0 + bw - r} ${y0} A${r} ${r} 0 0 1 ${x0 + bw - r * Math.cos(a)} ${y0 - r * Math.sin(a)}`, fill: 'none', stroke: '#d62f3a', 'stroke-width': 2.5 }),
      text(x0 + bw - r - 16, y0 - 8, 'θ', { fill: '#d62f3a', 'font-style': 'italic' }));
  }
  return el;
}

// trapezium with parallel sides a (top) and b (bottom) and perpendicular height h
function trap(d) {
  const W = 360, H = 230;
  const k = Math.min(240 / d.b, 130 / d.h);
  const b = d.b * k, a = d.a * k, h = d.h * k, x0 = (W - b) / 2, y0 = 185, off = (b - a) * 0.35;
  const el = svg(W, H, 'Trapezium');
  el.append(s('path', { d: `M${x0} ${y0} L${x0 + b} ${y0} L${x0 + off + a} ${y0 - h} L${x0 + off} ${y0 - h} Z`, fill: 'none', stroke: INK, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }),
    dash(x0 + off, y0 - h, x0 + off, y0), rightAngle(x0 + off, y0, 10, -10),
    text(x0 + off + a / 2, y0 - h - 10, unit(d.a)), text(x0 + b / 2, y0 + 26, unit(d.b)), text(x0 + off + 10, y0 - h / 2 + 6, unit(d.h), { 'text-anchor': 'start' }));
  return el;
}

// --- Year 8 diagrams, part 2 -------------------------------------------------------------------

// a curve on a square grid: { range: [lo, hi], paths: [[[x, y], …], …] } (points outside are clipped)
function curve(d) {
  const [lo, hi] = d.range, n = hi - lo;
  const cell = n > 10 ? 22 : 28, m = 30;
  const W = n * cell + 2 * m, H = n * cell + 2 * m;
  const X = (x) => m + (x - lo) * cell, Y = (y) => m + (hi - y) * cell;
  const el = svg(W, H, 'Graph of a curve', 400);
  for (let k = lo; k <= hi; k++) {
    el.append(line(X(k), Y(lo), X(k), Y(hi), { 'stroke-width': 0.6, opacity: 0.45 }), line(X(lo), Y(k), X(hi), Y(k), { 'stroke-width': 0.6, opacity: 0.45 }));
  }
  el.append(line(X(lo), Y(0), X(hi), Y(0), { 'stroke-width': 2 }), line(X(0), Y(lo), X(0), Y(hi), { 'stroke-width': 2 }));
  for (let k = lo; k <= hi; k++) {
    if (k === 0 || (n > 10 && k % 2 !== 0)) continue;
    el.append(small(X(k), Y(0) + 16, k < 0 ? `−${-k}` : String(k)), small(X(0) - 8, Y(k) + 4, k < 0 ? `−${-k}` : String(k), { 'text-anchor': 'end' }));
  }
  el.append(text(X(hi) + 10, Y(0) + 5, 'x', { 'font-size': 14, 'text-anchor': 'start', 'font-style': 'italic' }), text(X(0), Y(hi) - 10, 'y', { 'font-size': 14, 'font-style': 'italic' }));
  for (const path of d.paths || []) {
    let seg = [];
    const flush = () => { if (seg.length > 1) el.append(s('polyline', { points: seg.join(' '), fill: 'none', stroke: BLUE, 'stroke-width': 3, 'stroke-linejoin': 'round' })); seg = []; };
    for (const [x, y] of path) {
      if (y < lo - 0.5 || y > hi + 0.5 || x < lo || x > hi) { flush(); continue; }
      seg.push(`${X(x).toFixed(1)},${Y(y).toFixed(1)}`);
    }
    flush();
  }
  return el;
}

// a sector of a circle: { r, deg } with the radius and angle labelled
function sector(d) {
  const W = 300, H = 240, cx = 120, cy = 140, R = 95;
  const a = (d.deg * Math.PI) / 180;
  const ex = cx + R * Math.cos(a), ey = cy - R * Math.sin(a);
  const el = svg(W, H, `Sector with angle ${d.deg} degrees`, 320);
  el.append(s('circle', { cx, cy, r: R, fill: 'none', stroke: INK, 'stroke-width': 1, 'stroke-dasharray': '4 5', opacity: 0.5 }),
    s('path', { d: `M${cx} ${cy} L${cx + R} ${cy} A${R} ${R} 0 ${d.deg > 180 ? 1 : 0} 0 ${ex.toFixed(1)} ${ey.toFixed(1)} Z`, fill: BLUE, 'fill-opacity': 0.18, stroke: INK, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }),
    s('circle', { cx, cy, r: 3, fill: INK }));
  const ar = 26;
  el.append(s('path', { d: `M${cx + ar} ${cy} A${ar} ${ar} 0 ${d.deg > 180 ? 1 : 0} 0 ${(cx + ar * Math.cos(a)).toFixed(1)} ${(cy - ar * Math.sin(a)).toFixed(1)}`, fill: 'none', stroke: '#d62f3a', 'stroke-width': 2 }));
  const mid = a / 2;
  el.append(text(cx + 46 * Math.cos(mid), cy - 46 * Math.sin(mid) + 6, `${d.deg}°`, { fill: '#d62f3a', 'font-size': 15 }),
    text(cx + R / 2, cy + 22, `${d.r} cm`));
  return el;
}

// column vectors side by side: { vectors: [[name, x, y], …] }
function colvec(d) {
  const per = 130, W = per * d.vectors.length + 10, H = 110;
  const el = svg(W, H, 'Column vectors', Math.min(420, W * 1.2));
  const neg = (v) => (v < 0 ? `−${-v}` : String(v));
  d.vectors.forEach(([name, x, y], i) => {
    const x0 = 10 + i * per;
    el.append(text(x0 + 20, 62, `${name} =`, { 'font-size': 20, 'font-style': 'italic', 'text-anchor': 'start' }));
    const bx = x0 + 62;
    el.append(s('path', { d: `M${bx + 8} 18 Q${bx - 6} 55 ${bx + 8} 92`, fill: 'none', stroke: INK, 'stroke-width': 2.5 }),
      s('path', { d: `M${bx + 46} 18 Q${bx + 60} 55 ${bx + 46} 92`, fill: 'none', stroke: INK, 'stroke-width': 2.5 }),
      text(bx + 27, 46, neg(x), { 'font-size': 20 }), text(bx + 27, 82, neg(y), { 'font-size': 20 }));
  });
  return el;
}

// two-stage probability tree: { a: [[label, p], [label, p]], b: [[label, p], [label, p]] }
// or b2: [[…second-stage pair after the first branch], […after the second]] when they differ
function tree(d) {
  const W = 380, H = 250, x0 = 18, x1 = 150, x2 = 300, ys = [70, 180], leaf = [[30, 110], [140, 220]];
  const el = svg(W, H, 'Probability tree', 420);
  const branch = (xa, ya, xb, yb, label, p, above) => {
    el.append(line(xa, ya, xb, yb, { 'stroke-width': 2 }));
    const mx = (xa + xb) / 2, my = (ya + yb) / 2;
    el.append(small(mx - 4, my + (above ? -8 : 18), p, { 'font-size': 14, 'font-weight': 700, fill: BLUE }));
    el.append(small(xb + 6, yb + 5, label, { 'text-anchor': 'start', 'font-size': 14 }));
  };
  d.a.forEach(([label, p], i) => {
    branch(x0, H / 2, x1, ys[i], label, p, i === 0);
    const second = d.b2 ? d.b2[i] : d.b;
    second.forEach(([l2, p2], j) => branch(x1 + 62, ys[i], x2, leaf[i][j], l2, p2, j === 0));
  });
  return el;
}

// box plot on a scale: { min, q1, med, q3, max, lo, hi, label }
function boxplot(d) {
  const W = 400, H = 150, L = 30, R = 370, y = 60;
  const X = (v) => L + ((v - d.lo) / (d.hi - d.lo)) * (R - L);
  const el = svg(W, H, 'Box plot', 440);
  el.append(line(X(d.min), y, X(d.q1), y, { 'stroke-width': 2 }), line(X(d.q3), y, X(d.max), y, { 'stroke-width': 2 }),
    line(X(d.min), y - 14, X(d.min), y + 14, { 'stroke-width': 2 }), line(X(d.max), y - 14, X(d.max), y + 14, { 'stroke-width': 2 }),
    s('rect', { x: X(d.q1), y: y - 24, width: X(d.q3) - X(d.q1), height: 48, fill: BLUE, 'fill-opacity': 0.15, stroke: INK, 'stroke-width': 2.5 }),
    line(X(d.med), y - 24, X(d.med), y + 24, { 'stroke-width': 3 }));
  const ay = 112;
  el.append(line(L, ay, R, ay, { 'stroke-width': 1.5 }));
  const step = d.hi - d.lo > 60 ? 10 : 5;
  for (let v = d.lo; v <= d.hi; v += step) el.append(line(X(v), ay, X(v), ay + 6, { 'stroke-width': 1.2 }), small(X(v), ay + 22, String(v), { 'font-size': 12 }));
  if (d.label) el.append(small(R, ay - 8, d.label, { 'text-anchor': 'end', 'font-size': 12 }));
  return el;
}
