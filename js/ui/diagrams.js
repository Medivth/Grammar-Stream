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
const HALO = { stroke: 'var(--card, #fff)', 'stroke-width': 4, 'paint-order': 'stroke', 'stroke-linejoin': 'round' };
const small = (x, y, t, extra = {}) => s('text', { x, y, fill: INK, 'font-size': 14.5, 'font-family': 'inherit', 'text-anchor': 'middle', ...extra }, t);
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
    case 'line': return d.xs ? lineGraph(d) : null; // without data it is the straight-line angle drawing (qtypes)
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
    case 'barmodel': return barModel(d);
    case 'pvgrid': return pvGrid(d);
    case 'areamodel': return areaModel(d);
    case 'fracwall': return fracWall(d);
    case 'hundredsq': return hundredSquare(d);
    case 'possgrid': return possGrid(d);
    case 'polygon': return polygonSides(d);
    case 'solid': return solid(d);
    case 'flat': return flatShapes(d);
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
  el.append(small(m.l - 6, m.t - 8, d.ylabel, { 'text-anchor': 'end', 'font-size': 13.5 }));
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
  // one line ({ xs, ys }) or several ({ xs, series: [{ name, ys }] }); optional step and min for the y axis
  const series = d.series || [{ ys: d.ys }];
  const all = series.flatMap((x) => x.ys).filter((v) => v != null);
  const W = 400, H = 270 + (d.series ? 22 : 0), m = { l: 48, r: 16, t: 30, b: 44 + (d.series ? 22 : 0) };
  const max = Math.max(...all), min = d.min ?? Math.min(0, ...all);
  // gridlines: the old 2s and 4s for small values (generated questions rely on them), a round step for larger ones
  const nice = (span) => { const raw = span / 6, p = 10 ** Math.floor(Math.log10(raw)); return [1, 2, 5, 10].map((k) => k * p).find((k) => k >= raw); };
  const step = d.step || (max - min > 60 || d.min != null ? nice(max - min) : max - min > 16 ? 4 : 2);
  const top = Math.ceil((max + (d.step || max - min > 60 ? 0 : 1)) / step) * step, bottom = Math.floor(min / step) * step;
  const pw = W - m.l - m.r, ph = H - m.t - m.b;
  // scaleX: space the points by their x values (years, times) rather than evenly
  const xv = d.scaleX ? d.xs.map(Number) : null;
  const X = (i) => m.l + (xv ? (xv[i] - xv[0]) / (xv.at(-1) - xv[0]) : i / (d.xs.length - 1)) * pw, Y = (v) => m.t + ph - ((v - bottom) / (top - bottom)) * ph;
  const el = svg(W, H, d.title, 440);
  el.append(text(W / 2, 18, d.title, { 'font-size': 14, 'font-weight': 600 }));
  for (let v = bottom; v <= top + 1e-9; v += step) el.append(line(m.l, Y(v), W - m.r, Y(v), { 'stroke-width': v === 0 ? 1.5 : 0.6, opacity: v === 0 ? 1 : 0.4 }), small(m.l - 6, Y(v) + 4, String(+v.toFixed(6)), { 'text-anchor': 'end' }));
  d.xs.forEach((x, i) => el.append(line(X(i), m.t, X(i), Y(bottom), { 'stroke-width': 0.6, opacity: 0.4 }), small(X(i), H - m.b + 19, x, { 'font-size': 13.5 })));
  series.forEach((sr, k) => {
    const colour = PIE[k % PIE.length];
    const pts = sr.ys.map((v, i) => (v == null ? null : [X(i), Y(v)])).filter(Boolean);
    el.append(s('polyline', { points: pts.map((p) => p.join(',')).join(' '), fill: 'none', stroke: colour, 'stroke-width': 2.5, 'stroke-linejoin': 'round', 'stroke-dasharray': k % 2 ? '7 4' : null }));
    pts.forEach(([x, y]) => el.append(s('circle', { cx: x, cy: y, r: 4.5, fill: colour, stroke: 'var(--card, #fff)', 'stroke-width': 2 })));
    if (d.series) {
      const lx = m.l + k * 150;
      el.append(line(lx, H - 14, lx + 22, H - 14, { stroke: colour, 'stroke-width': 3, 'stroke-dasharray': k % 2 ? '7 4' : null }), small(lx + 28, H - 10, sr.name, { 'text-anchor': 'start', 'font-size': 13.5 }));
    }
  });
  el.append(small(m.l - 6, m.t - 8, d.ylabel, { 'text-anchor': 'end', 'font-size': 13.5 }));
  if (d.xlabel) el.append(small(W - m.r, H - m.b + 36, d.xlabel, { 'text-anchor': 'end', 'font-size': 13.5 }));
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
  const ma = (d.m / 60) * Math.PI * 2, ha = (((d.h % 12) + d.m / 60) / 12) * Math.PI * 2;
  el.append(line(c, c, c + Math.sin(ha) * 50, c - Math.cos(ha) * 50, { 'stroke-width': 7 }),
    line(c, c, c + Math.sin(ma) * 76, c - Math.cos(ma) * 76, { 'stroke-width': 4, stroke: BLUE }),
    s('circle', { cx: c, cy: c, r: 6, fill: INK }));
  // numbers on top of the hands (with a halo), so the number the long hand points at can be read
  for (let n = 1; n <= 12; n++) {
    const a = (n / 12) * Math.PI * 2;
    el.append(text(c + Math.sin(a) * (R - 28), c - Math.cos(a) * (R - 28) + 6, String(n), { 'font-size': 18, ...HALO }));
  }
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
    if (d.labels?.includes(v) || v === d.min || v === d.max) el.append(small(X(v), 78, v < 0 ? `−${-v}` : String(v)));
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
  // axis numbers go on last, with a halo, so a line crossing them never hides them
  const nums = [];
  for (let k = lo; k <= hi; k++) {
    if (k === 0 || (n > 10 && k % 2 !== 0)) continue;
    nums.push(small(X(k), Y(0) + 16, k < 0 ? `−${-k}` : String(k), HALO), small(X(0) - 8, Y(k) + 4, k < 0 ? `−${-k}` : String(k), { 'text-anchor': 'end', ...HALO }));
  }
  el.append(text(X(hi) + 10, Y(0) + 5, 'x', { 'font-size': 14, 'text-anchor': 'start', 'font-style': 'italic' }), text(X(0), Y(hi) - 10, 'y', { 'font-size': 14, 'font-style': 'italic' }));
  (d.lines || []).forEach((L, k) => {
    // clip y = mx + c to the square [lo, hi] x [lo, hi]
    let x1 = lo, x2 = hi;
    if (L.m !== 0) {
      const a = (lo - L.c) / L.m, b = (hi - L.c) / L.m;
      x1 = Math.max(lo, Math.min(a, b)); x2 = Math.min(hi, Math.max(a, b));
    }
    // two or more lines get their own colours, so the caption can say which is which
    el.append(line(X(x1), Y(L.m * x1 + L.c), X(x2), Y(L.m * x2 + L.c), { stroke: (d.lines.length > 1 ? PIE : [BLUE])[k % 4], 'stroke-width': 3 }));
  });
  el.append(...nums);
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
  const nums = []; // axis numbers drawn last, over the curves
  for (let k = lo; k <= hi; k++) {
    el.append(line(X(k), Y(lo), X(k), Y(hi), { 'stroke-width': 0.6, opacity: 0.45 }), line(X(lo), Y(k), X(hi), Y(k), { 'stroke-width': 0.6, opacity: 0.45 }));
  }
  el.append(line(X(lo), Y(0), X(hi), Y(0), { 'stroke-width': 2 }), line(X(0), Y(lo), X(0), Y(hi), { 'stroke-width': 2 }));
  for (let k = lo; k <= hi; k++) {
    if (k === 0 || (n > 10 && k % 2 !== 0)) continue;
    nums.push(small(X(k), Y(0) + 16, k < 0 ? `−${-k}` : String(k), HALO), small(X(0) - 8, Y(k) + 4, k < 0 ? `−${-k}` : String(k), { 'text-anchor': 'end', ...HALO }));
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
  el.append(...nums);
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
  const lr = d.deg < 60 ? R + 34 : 46; // narrow sectors: label outside the arc
  el.append(text(cx + lr * Math.cos(mid), cy - lr * Math.sin(mid) + 6, `${d.deg}°`, { fill: '#d62f3a', 'font-size': 15 }),
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

// ---------------------------------------------------------------- models for reasoning
// Bar model: rows of equal-sized boxes, so ratios and fractions of amounts can be seen.
// { rows: [{ label, parts, shaded?, text?, total? }], total?: 'whole label' }
// Rows may instead be cut into sized pieces, all on one scale, so two amounts can be compared
// and the extra bit marked: { label, segs: [{ v, text?, shaded?, mark?, out? }] } (mark: the extra
// bit, in orange; out: a part taken away, dashed). side: 'label' brackets all the rows together.
function barModel(d) {
  const segs = d.rows.some((r) => r.segs);
  const sum = (r) => (r.segs ? r.segs.reduce((a, g) => a + g.v, 0) : r.parts);
  const labelW = d.rows.some((r) => r.label) ? 86 : 10;
  const sideW = d.side ? 26 + String(d.side).length * 9.5 : 0;
  const longest = Math.max(...d.rows.map(sum));
  // sized bars are only as wide as their pieces need, so a short sum is not shrunk to fit a phone
  const pieces = Math.max(...d.rows.map((r) => (r.segs ? r.segs.length : 0)));
  const unitW = segs ? Math.min(420 - labelW - 20 - sideW, Math.max(230, 60 * pieces)) / longest : Math.min(64, (420 - labelW - 20) / longest);
  const W = labelW + unitW * longest + 20 + sideW, rowH = 46;
  const top = d.total ? 40 : 14;
  // a row with its own total needs room underneath for it
  const gapAfter = (r) => (r.total ? 30 : 12);
  const rowY = d.rows.map((_, i) => top + d.rows.slice(0, i).reduce((a, r) => a + rowH + gapAfter(r), 0));
  const H = top + d.rows.reduce((a, r) => a + rowH + gapAfter(r), 0) + 4;
  const el = svg(W, H, `Bar model: ${d.rows.map((r) => `${r.label || 'bar'} ${r.segs ? r.segs.length : r.parts} parts`).join(', ')}`, 440);
  if (d.total) {
    const x2 = labelW + unitW * sum(d.rows[0]);
    el.append(s('path', { d: `M${labelW} ${top - 6} v-10 H${x2} v10`, fill: 'none', stroke: INK, 'stroke-width': 2 }), text((labelW + x2) / 2, top - 22, d.total, { 'font-size': 17 }));
  }
  const box = (x, y, w, t, { shaded, mark, out } = {}, fit = false) => {
    const fill = shaded ? BLUE : mark ? '#d97a12' : 'var(--card, #fff)';
    el.append(s('rect', { x, y, width: w, height: rowH, fill, 'fill-opacity': shaded || mark ? 0.85 : 1, stroke: INK, 'stroke-width': 2, ...(out ? { 'stroke-dasharray': '5 4', opacity: 0.6 } : {}) }));
    if (t == null || t === '') return;
    const str = String(t), size = w < 40 ? 14 : 16.5;
    // a sized piece too small for its text leaves it out (the caption gives the value)
    if (fit && str.length * size * 0.5 + 6 > w) return;
    el.append(text(x + w / 2, y + rowH / 2 + 5, str, { 'font-size': size, fill: shaded || mark ? '#fff' : INK, ...(out ? { opacity: 0.7 } : {}) }));
  };
  d.rows.forEach((r, i) => {
    const y = rowY[i];
    if (r.label) el.append(text(labelW - 10, y + rowH / 2 + 5, r.label, { 'text-anchor': 'end', 'font-size': 16 }));
    if (r.segs) {
      let x = labelW;
      for (const g of r.segs) { box(x, y, g.v * unitW, g.text, g, true); x += g.v * unitW; }
    } else {
      for (let k = 0; k < r.parts; k++) box(labelW + k * unitW, y, unitW, r.text, { shaded: k < (r.shaded || 0) });
    }
    if (r.total) el.append(small(labelW + (sum(r) * unitW) / 2, y + rowH + 16, r.total));
  });
  if (d.side) {
    const x = labelW + unitW * longest + 10, y0 = rowY[0], y1 = rowY.at(-1) + rowH;
    el.append(s('path', { d: `M${x} ${y0} h8 V${y1} h-8`, fill: 'none', stroke: INK, 'stroke-width': 2 }), text(x + 14, (y0 + y1) / 2 + 6, d.side, { 'text-anchor': 'start', 'font-size': 17 }));
  }
  return el;
}

// Place-value grid: column headings and digits; shift: 1 or -1 draws arrows for ×10 / ÷10.
// { cols: ['H','T','O'], rows: [['3','4','5'], ['3','4','5','0']], shift?: 1, point?: index of the column after the decimal point }
function pvGrid(d) {
  const n = d.cols.length, cw = n > 6 ? 40 : 54, ch = 42;
  const W = n * cw + 24, H = 34 + d.rows.length * ch + (d.shift ? 10 : 6);
  const el = svg(W, H, `Place-value grid with columns ${d.cols.join(', ')}`, Math.min(460, W * 1.15));
  const x0 = 12;
  d.cols.forEach((c, i) => {
    el.append(s('rect', { x: x0 + i * cw, y: 6, width: cw, height: 28, fill: i >= (d.point ?? n) ? 'var(--v4-soft, #fdeed8)' : 'var(--v1-soft, #e3edfc)', stroke: INK, 'stroke-width': 1.5 }));
    el.append(text(x0 + i * cw + cw / 2, 25, String(c), { 'font-size': String(c).length > 3 ? 12 : 15 }));
  });
  d.rows.forEach((row, r) => {
    const y = 34 + r * ch;
    for (let i = 0; i < n; i++) el.append(s('rect', { x: x0 + i * cw, y, width: cw, height: ch, fill: 'none', stroke: INK, 'stroke-width': 1.5 }));
    // digits are right-aligned to the ones column (or to the end of the grid)
    const offset = d.align === 'left' ? 0 : n - row.length;
    row.forEach((dg, i) => { if (dg !== '' && dg != null) el.append(text(x0 + (i + offset) * cw + cw / 2, y + ch / 2 + 7, String(dg), { 'font-size': 22 })); });
  });
  if (d.point != null) el.append(s('circle', { cx: x0 + d.point * cw, cy: 34 + d.rows.length * ch - 6, r: 4, fill: INK }));
  if (d.shift && d.rows.length >= 2) {
    // each digit of the first row moves d.shift columns to the left (×10) or right (÷10)
    const r0 = d.rows[0], off0 = d.align === 'left' ? 0 : n - r0.length, yA = 34 + ch - 9, yB = 34 + ch + 9;
    el.append(s('defs', {}, s('marker', { id: 'pv-head', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto' }, s('path', { d: 'M0,0 L10,5 L0,10 z', fill: '#d97a12' }))));
    r0.forEach((dg, i) => {
      if (dg === '' || dg == null) return;
      const xa = x0 + (i + off0) * cw + cw / 2, xb = xa - d.shift * cw;
      if (xb < x0 || xb > x0 + n * cw) return;
      el.append(s('line', { x1: xa, y1: yA, x2: xb, y2: yB, stroke: '#d97a12', 'stroke-width': 2.2, 'marker-end': 'url(#pv-head)' }));
    });
  }
  return el;
}

// Area model for multiplying: a rectangle split by place value. { across: [30, 4], down: [20, 3], show?: true }
const fmt = (v) => (typeof v === 'number' ? v.toLocaleString('en-GB') : String(v)); // 3,696
function areaModel(d) {
  const W = 380, H = 250, x0 = 50, y0 = 34, maxW = 300, maxH = 190;
  const sa = d.across.reduce((a, b) => a + b, 0), sd = d.down.reduce((a, b) => a + b, 0);
  const kx = maxW / sa, ky = maxH / sd, k = Math.min(kx, ky, 999);
  const scaleX = (v) => Math.max(34, v * kx), scaleY = (v) => Math.max(30, v * ky);
  const el = svg(W, H, `Area model: ${d.across.join(' + ')} by ${d.down.join(' + ')}`, 400);
  let y = y0;
  const colors = ['var(--v1-soft, #e3edfc)', 'var(--v4-soft, #fdeed8)', 'var(--v3-soft, #dcf3e7)', 'var(--v5-soft, #efe5fc)'];
  d.down.forEach((dv, r) => {
    let x = x0;
    const hh = scaleY(dv);
    el.append(text(x0 - 10, y + hh / 2 + 5, fmt(dv), { 'text-anchor': 'end' }));
    d.across.forEach((av, c) => {
      const ww = scaleX(av);
      el.append(s('rect', { x, y, width: ww, height: hh, fill: colors[(r + c) % 4], stroke: INK, 'stroke-width': 2 }));
      if (r === 0) el.append(text(x + ww / 2, y0 - 10, fmt(av)));
      if (d.show !== false) el.append(text(x + ww / 2, y + hh / 2 + 5, d.show === 'q' ? '?' : fmt(av * dv), { 'font-size': 14, 'font-weight': 600 }));
      x += ww;
    });
    y += hh;
  });
  el.setAttribute('viewBox', `0 0 ${W} ${Math.max(H, y + 10)}`);
  return el;
}

// Fraction wall: one whole, then halves, thirds… { rows: [1, 2, 3, 4, 6, 8], shade?: { 4: 3 } }
function fracWall(d) {
  const W = 420, rowH = 34, x0 = 10, w = 400;
  const H = d.rows.length * (rowH + 4) + 8;
  const el = svg(W, H, `Fraction wall: ${d.rows.map((r) => (r === 1 ? 'one whole' : `${r}ths`)).join(', ')}`, 460);
  d.rows.forEach((n, i) => {
    const y = 4 + i * (rowH + 4);
    for (let k = 0; k < n; k++) {
      const on = k < ((d.shade || {})[n] || 0);
      el.append(s('rect', { x: x0 + (k * w) / n, y, width: w / n, height: rowH, fill: on ? BLUE : PIE[(i + 1) % 4], 'fill-opacity': on ? 0.9 : 0.18, stroke: INK, 'stroke-width': 1.5 }));
      el.append(text(x0 + (k * w) / n + w / n / 2, y + rowH / 2 + 5, n === 1 ? '1' : `1/${n}`, { 'font-size': n > 10 ? 12 : n > 6 ? 14 : 16, 'font-weight': 600, fill: on ? '#fff' : INK }));
    }
  });
  return el;
}

// Hundred square with some numbers shaded. { start: 1, shade: [..], ring?: [..] }
function hundredSquare(d) {
  const c = 30, W = c * 10 + 8, H = c * 10 + 8, start = d.start ?? 1;
  const el = svg(W, H, `Hundred square from ${start}`, 340);
  const shade = new Set(d.shade || []), ring = new Set(d.ring || []);
  for (let i = 0; i < 100; i++) {
    const v = start + i, x = 4 + (i % 10) * c, y = 4 + Math.floor(i / 10) * c;
    el.append(s('rect', { x, y, width: c, height: c, fill: shade.has(v) ? 'var(--v4, #c46d0c)' : 'var(--card, #fff)', 'fill-opacity': shade.has(v) ? 0.45 : 1, stroke: INK, 'stroke-width': 0.8 }));
    el.append(small(x + c / 2, y + c / 2 + 4.5, String(v), { 'font-size': 11.5, 'font-weight': ring.has(v) || shade.has(v) ? 700 : 400 }));
    if (ring.has(v)) el.append(s('circle', { cx: x + c / 2, cy: y + c / 2, r: c / 2 - 2, fill: 'none', stroke: '#d62f3a', 'stroke-width': 2 }));
  }
  return el;
}

// Two-way grid of outcomes (two dice, coin and dice, Punnett square). { a: [...], b: [...], op?: 'sum'|'product', cells?: [[..]], shade?: [values] }
function possGrid(d) {
  const n = d.a.length, m = d.b.length, c = Math.min(46, 300 / Math.max(n, m));
  const W = (n + 1) * c + 12, H = (m + 1) * c + 12;
  const el = svg(W, H, `Grid of outcomes: ${d.a.length} by ${d.b.length}`, Math.min(380, W * 1.25));
  const val = (i, j) => (d.cells ? d.cells[j][i] : d.op === 'product' ? d.a[i] * d.b[j] : d.op === 'sum' ? d.a[i] + d.b[j] : `${d.a[i]}${d.b[j]}`);
  const shade = new Set((d.shade || []).map(String));
  for (let i = 0; i < n; i++) { el.append(s('rect', { x: 6 + (i + 1) * c, y: 6, width: c, height: c, fill: 'var(--v1-soft, #e3edfc)', stroke: INK, 'stroke-width': 1.5 }), text(6 + (i + 1.5) * c, 6 + c / 2 + 6, String(d.a[i]))); }
  for (let j = 0; j < m; j++) { el.append(s('rect', { x: 6, y: 6 + (j + 1) * c, width: c, height: c, fill: 'var(--v4-soft, #fdeed8)', stroke: INK, 'stroke-width': 1.5 }), text(6 + c / 2, 6 + (j + 1.5) * c + 6, String(d.b[j]))); }
  el.append(text(6 + c / 2, 6 + c / 2 + 6, d.op === 'product' ? '×' : d.op === 'sum' ? '+' : '', { 'font-size': 18 }));
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
    const v = val(i, j);
    el.append(s('rect', { x: 6 + (i + 1) * c, y: 6 + (j + 1) * c, width: c, height: c, fill: shade.has(String(v)) ? 'var(--v4, #c46d0c)' : 'var(--card, #fff)', 'fill-opacity': shade.has(String(v)) ? 0.45 : 1, stroke: INK, 'stroke-width': 1 }));
    el.append(text(6 + (i + 1.5) * c, 6 + (j + 1.5) * c + 5, String(v), { 'font-size': c < 40 ? 13 : 15, 'font-weight': shade.has(String(v)) ? 800 : 500 }));
  }
  return el;
}

// A regular polygon with its sides numbered and corners marked, for counting sides and vertices.
// { sides: 5, name?: 'pentagon', numbered?: true, corners?: true }
function polygonSides(d) {
  const W = 240, H = 230, cx = 120, cy = 118, R = 86, n = d.sides;
  const el = svg(W, H, `${d.name || 'A shape'} with ${n} sides`, 260);
  const pts = Array.from({ length: n }, (_, i) => { const a = -Math.PI / 2 + (Math.PI * 2 * i) / n + (n % 2 ? 0 : Math.PI / n); return [cx + R * Math.cos(a), cy + R * Math.sin(a)]; });
  el.append(s('path', { d: `M${pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join(' L')} Z`, fill: 'var(--v1-soft, #e3edfc)', stroke: BLUE, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }));
  if (d.numbered !== false) pts.forEach((p, i) => {
    const q = pts[(i + 1) % n], mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
    const ox = (mx - cx) * 0.22, oy = (my - cy) * 0.22;
    el.append(s('circle', { cx: mx + ox, cy: my + oy, r: 11, fill: '#d97a12' }), text(mx + ox, my + oy + 5, String(i + 1), { 'font-size': 13, fill: '#fff' }));
  });
  if (d.corners) pts.forEach((p) => el.append(s('circle', { cx: p[0], cy: p[1], r: 5.5, fill: '#d62f3a' })));
  return el;
}

// Flat shapes side by side, each named underneath; lines: true draws every line of symmetry
// (dashed red). A circle's lines never end, so it shows a few. { shapes: ['kite', 'isosceles'], lines? }
const FLAT = {
  square: ['square', () => [[-50, -50], [50, -50], [50, 50], [-50, 50]], [[[0, -62], [0, 62]], [[-62, 0], [62, 0]], [[-58, -58], [58, 58]], [[58, -58], [-58, 58]]]],
  rectangle: ['rectangle', () => [[-62, -36], [62, -36], [62, 36], [-62, 36]], [[[0, -48], [0, 48]], [[-74, 0], [74, 0]]]],
  isosceles: ['isosceles triangle', () => [[0, -55], [40, 52], [-40, 52]], [[[0, -66], [0, 62]]]],
  equilateral: ['equilateral triangle', () => [[0, -50], [55, 45.3], [-55, 45.3]], null],
  kite: ['kite', () => [[0, -55], [45, -15], [0, 55], [-45, -15]], [[[0, -66], [0, 66]]]],
  scalene: ['right-angled triangle', () => [[-50, -40], [60, 45], [-50, 45]], []],
  semicircle: ['semicircle', null, [[[0, -44], [0, 42]]]],
  circle: ['circle', null, [0, 45, 90, 135].map((a) => { const r = 66, t = (a * Math.PI) / 180; return [[-r * Math.cos(t), -r * Math.sin(t)], [r * Math.cos(t), r * Math.sin(t)]]; })],
  letterA: ['', null, [[[0, -68], [0, 66]]]],
  letterT: ['', null, [[[0, -68], [0, 66]]]],
  letterH: ['', null, [[[0, -68], [0, 66]], [[-62, 0], [62, 0]]]],
  letterF: ['', null, []],
};
// capital letters drawn as thick strokes, each a list of points
const LETTER = {
  letterA: [[[-44, 58], [0, -44], [44, 58]], [[-27, 20], [27, 20]]],
  letterT: [[[-44, -50], [44, -50]], [[0, -50], [0, 58]]],
  letterH: [[[-36, -54], [-36, 58]], [[36, -54], [36, 58]], [[-36, 2], [36, 2]]],
  letterF: [[[-28, 58], [-28, -50], [34, -50]], [[-28, 2], [24, 2]]],
};
function flatShapes(d) {
  const n = d.shapes.length, cw = 160, W = cw * n, H = d.shapes.every((k) => !FLAT[k][0]) ? 150 : n > 2 ? 206 : 190, cy = 72;
  const el = svg(W, H, d.shapes.map((k) => FLAT[k]?.[0] || `letter ${k.slice(-1)}`).join(' and '), Math.min(440, W * 1.15));
  const st = { fill: 'var(--v1-soft, #e3edfc)', stroke: BLUE, 'stroke-width': 3.5, 'stroke-linejoin': 'round' };
  d.shapes.forEach((k, i) => {
    const [name, pts, lines] = FLAT[k], cx = cw * i + cw / 2;
    const P = ([x, y]) => `${(cx + x).toFixed(1)} ${(cy + y).toFixed(1)}`;
    if (pts) el.append(s('path', { d: `M${pts().map(P).join(' L')} Z`, ...st }));
    else if (k === 'semicircle') el.append(s('path', { d: `M${P([-62, 30])} A62 62 0 0 1 ${P([62, 30])} Z`, ...st }));
    else if (k === 'circle') el.append(s('circle', { cx, cy, r: 55, ...st }));
    else el.append(s('path', { d: LETTER[k].map((ps) => `M${ps.map(P).join(' L')}`).join(' '), fill: 'none', stroke: BLUE, 'stroke-width': 15, 'stroke-linejoin': 'miter' }));
    if (d.lines) {
      // an equilateral triangle's lines run from each corner to the middle of the side opposite
      const ls = lines || pts().map((p, j, a) => { const q = a[(j + 1) % 3], r = a[(j + 2) % 3], m = [(q[0] + r[0]) / 2, (q[1] + r[1]) / 2]; return [[p[0] - (m[0] - p[0]) * 0.12, p[1] - (m[1] - p[1]) * 0.12], [m[0] + (m[0] - p[0]) * 0.14, m[1] + (m[1] - p[1]) * 0.14]]; });
      for (const [a, b] of ls) el.append(s('path', { d: `M${P(a)} L${P(b)}`, stroke: '#d62f3a', 'stroke-width': 2.5, 'stroke-dasharray': '7 5', fill: 'none' }));
    }
    // long names go on two lines ("isosceles / triangle") so they stay readable when three share a row
    const words = name.length > 12 ? [name.slice(0, name.lastIndexOf(' ')), name.slice(name.lastIndexOf(' ') + 1)] : [name];
    // three in a row are drawn smaller on a phone, so their names are set bigger
    const fs = n > 2 ? 21 : 16;
    words.forEach((w, j) => el.append(small(cx, H - 30 + j * (fs + 3) - (words.length - 1) * 6, w, { 'font-size': fs })));
  });
  return el;
}

// 3D solids as line drawings, hidden edges dashed. { shape: 'cube'|'cuboid'|'pyramid'|'prism'|'cylinder'|'cone'|'sphere', faces?: true }
function solid(d) {
  const W = 220, H = 200;
  const el = svg(W, H, `A ${d.shape}`, 230);
  const st = { fill: 'none', stroke: INK, 'stroke-width': 2.5, 'stroke-linejoin': 'round' };
  const hid = { ...st, 'stroke-dasharray': '6 5', 'stroke-width': 1.6 };
  const P = (pts, attrs = st) => s('path', { d: pts, ...attrs });
  const face = (pts, fill) => s('path', { d: pts, fill, 'fill-opacity': 0.35, stroke: 'none' });
  switch (d.shape) {
    case 'cube': case 'cuboid': {
      const w = d.shape === 'cube' ? 100 : 130, h = d.shape === 'cube' ? 100 : 80, dx = 40, dy = -34, x = 30, y = 70;
      el.append(face(`M${x} ${y} h${w} v${h} h${-w} Z`, BLUE), face(`M${x} ${y} l${dx} ${dy} h${w} l${-dx} ${-dy} Z`, '#d97a12'), face(`M${x + w} ${y} l${dx} ${dy} v${h} l${-dx} ${-dy} Z`, '#0f9a6e'));
      el.append(P(`M${x} ${y} h${w} v${h} h${-w} Z M${x} ${y} l${dx} ${dy} h${w} l${-dx} ${-dy} M${x + w + dx} ${y + dy} v${h} l${-dx} ${-dy}`),
        P(`M${x + dx} ${y + dy} v${h} h${w} M${x + dx} ${y + dy + h} l${-dx} ${-dy}`, hid));
      break;
    }
    case 'pyramid': {
      const A = [40, 160], B = [150, 160], C = [190, 130], D = [80, 130], T = [112, 26];
      el.append(face(`M${A} L${B} L${T} Z`, BLUE), face(`M${B} L${C} L${T} Z`, '#0f9a6e'));
      el.append(P(`M${A} L${B} L${C} M${A} L${T} L${B} M${T} L${C}`), P(`M${A} L${D} L${C} M${D} L${T}`, hid));
      break;
    }
    case 'prism': {
      const A = [30, 160], B = [110, 160], C = [70, 92], dx = 80, dy = -40;
      el.append(face(`M${A} L${B} L${C} Z`, BLUE), face(`M${B} l${dx} ${dy} L${C[0] + dx} ${C[1] + dy} L${C} Z`, '#0f9a6e'));
      el.append(P(`M${A} L${B} L${C} Z M${B} l${dx} ${dy} L${C[0] + dx} ${C[1] + dy} L${C}`), P(`M${A} l${dx} ${dy} L${B[0] + dx} ${B[1] + dy} M${A[0] + dx} ${A[1] + dy} L${C[0] + dx} ${C[1] + dy}`, hid));
      break;
    }
    case 'cylinder': {
      el.append(face('M50 50 A60 18 0 0 0 170 50 V150 A60 18 0 0 1 50 150 Z', BLUE), face('M50 50 A60 18 0 0 1 170 50 A60 18 0 0 1 50 50 Z', '#d97a12'));
      el.append(P('M50 50 A60 18 0 0 1 170 50 A60 18 0 0 1 50 50 M50 50 V150 A60 18 0 0 0 170 150 V50'), P('M50 150 A60 18 0 0 1 170 150', hid));
      break;
    }
    case 'cone': {
      el.append(face('M110 24 L50 150 A60 18 0 0 0 170 150 Z', BLUE));
      el.append(P('M110 24 L50 150 A60 18 0 0 0 170 150 Z'), P('M50 150 A60 18 0 0 1 170 150', hid));
      break;
    }
    default: { // sphere
      el.append(s('circle', { cx: 110, cy: 100, r: 72, fill: BLUE, 'fill-opacity': 0.3, stroke: INK, 'stroke-width': 2.5 }), P('M38 100 A72 22 0 0 0 182 100'), P('M38 100 A72 22 0 0 1 182 100', hid));
    }
  }
  return el;
}
