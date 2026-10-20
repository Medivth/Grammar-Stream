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
