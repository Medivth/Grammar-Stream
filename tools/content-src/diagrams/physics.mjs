// Physics diagrams: circuits and circuit symbols, the solar system, the atom, waves, light
// (shadows and reflection), the light microscope and the eye. Original artwork, plain path data.
//
// Every shape here is wound clockwise (on screen), so the pieces of one path join up under the
// default fill rule; ring() and frame() cut holes by winding their inside the other way.

const r1 = (n) => Math.round(n * 10) / 10;
const D = Math.PI / 180;

// a closed polygon, wound clockwise
function pg(pts) {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length];
    a += x1 * y2 - x2 * y1;
  }
  const p = a < 0 ? [...pts].reverse() : pts;
  return `M${p.map(([x, y]) => `${r1(x)},${r1(y)}`).join('L')}Z`;
}
const circ = (cx, cy, r) => `M${r1(cx - r)},${r1(cy)}a${r1(r)},${r1(r)} 0 1,1 ${r1(2 * r)},0a${r1(r)},${r1(r)} 0 1,1 ${r1(-2 * r)},0Z`;
const circCCW = (cx, cy, r) => `M${r1(cx - r)},${r1(cy)}a${r1(r)},${r1(r)} 0 1,0 ${r1(2 * r)},0a${r1(r)},${r1(r)} 0 1,0 ${r1(-2 * r)},0Z`;
const oval = (cx, cy, rx, ry) => `M${r1(cx - rx)},${r1(cy)}a${r1(rx)},${r1(ry)} 0 1,1 ${r1(2 * rx)},0a${r1(rx)},${r1(ry)} 0 1,1 ${r1(-2 * rx)},0Z`;
const ring = (cx, cy, r, w) => circ(cx, cy, r + w / 2) + circCCW(cx, cy, r - w / 2);
function box(x, y, w, h, r = 0) {
  if (!r) return `M${r1(x)},${r1(y)}H${r1(x + w)}V${r1(y + h)}H${r1(x)}Z`;
  return `M${r1(x + r)},${r1(y)}H${r1(x + w - r)}Q${r1(x + w)},${r1(y)} ${r1(x + w)},${r1(y + r)}V${r1(y + h - r)}Q${r1(x + w)},${r1(y + h)} ${r1(x + w - r)},${r1(y + h)}H${r1(x + r)}Q${r1(x)},${r1(y + h)} ${r1(x)},${r1(y + h - r)}V${r1(y + r)}Q${r1(x)},${r1(y)} ${r1(x + r)},${r1(y)}Z`;
}
// an outline box (a frame of thickness t)
const frame = (x, y, w, h, t) => box(x - t / 2, y - t / 2, w + t, h + t) + `M${r1(x + t / 2)},${r1(y + t / 2)}V${r1(y + h - t / 2)}H${r1(x + w - t / 2)}V${r1(y + t / 2)}Z`;
// a thick straight line
function ln(x1, y1, x2, y2, w) {
  const L = Math.hypot(x2 - x1, y2 - y1) || 1, nx = (-(y2 - y1) / L) * (w / 2), ny = ((x2 - x1) / L) * (w / 2);
  return pg([[x1 + nx, y1 + ny], [x2 + nx, y2 + ny], [x2 - nx, y2 - ny], [x1 - nx, y1 - ny]]);
}
// a thick polyline with round joins
const pl = (pts, w) => pts.slice(1).map((p, i) => ln(...pts[i], ...p, w)).join('') + pts.slice(1, -1).map(([x, y]) => circ(x, y, w / 2)).join('');
// a dashed straight line
function dash(x1, y1, x2, y2, w, on = 8, off = 6) {
  const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
  let out = '';
  for (let s = 0; s < L; s += on + off) {
    const e = Math.min(L, s + on);
    out += ln(x1 + ux * s, y1 + uy * s, x1 + ux * e, y1 + uy * e, w);
  }
  return out;
}
// an arrowhead whose tip is at (x, y), pointing along angle a (degrees, 0 = right, 90 = up)
function head(x, y, a, len = 14, wid = 12) {
  const c = Math.cos(a * D), s = -Math.sin(a * D);
  const bx = x - c * len, by = y - s * len;
  return pg([[x, y], [bx - s * (wid / 2), by + c * (wid / 2)], [bx + s * (wid / 2), by - c * (wid / 2)]]);
}
const angleOf = (x1, y1, x2, y2) => Math.atan2(-(y2 - y1), x2 - x1) / D;
// a line from A to B with an arrowhead at B (and at A too if both)
function arrow(x1, y1, x2, y2, w, both = false, len = 14, wid = 12) {
  const a = angleOf(x1, y1, x2, y2), L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
  const sx = both ? x1 + ux * (len - 2) : x1, sy = both ? y1 + uy * (len - 2) : y1;
  return ln(sx, sy, x2 - ux * (len - 2), y2 - uy * (len - 2), w) + head(x2, y2, a, len, wid) + (both ? head(x1, y1, a + 180, len, wid) : '');
}
// a point on a circle, angle in degrees (0 = right, 90 = up)
const pt = (cx, cy, r, a) => [cx + r * Math.cos(a * D), cy - r * Math.sin(a * D)];
// a band along a circular arc from angle a0 to a1
function arcBand(cx, cy, r, a0, a1, w) {
  const n = Math.max(6, Math.ceil(Math.abs(a1 - a0) / 6)), outer = [], inner = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    outer.push(pt(cx, cy, r + w / 2, a));
    inner.unshift(pt(cx, cy, r - w / 2, a));
  }
  return pg([...outer, ...inner]);
}
// a pie slice from angle a0 to a1
function sector(cx, cy, r, a0, a1) {
  const n = Math.max(6, Math.ceil(Math.abs(a1 - a0) / 6)), p = [[cx, cy]];
  for (let i = 0; i <= n; i++) p.push(pt(cx, cy, r, a0 + ((a1 - a0) * i) / n));
  return pg(p);
}
// a thick curve through sampled points (each point gets its own normal)
function curve(pts, w) {
  const top = [], bot = [];
  pts.forEach(([x, y], i) => {
    const [ax, ay] = pts[Math.max(0, i - 1)], [bx, by] = pts[Math.min(pts.length - 1, i + 1)];
    const L = Math.hypot(bx - ax, by - ay), nx = (-(by - ay) / L) * (w / 2), ny = ((bx - ax) / L) * (w / 2);
    top.push([x + nx, y + ny]);
    bot.unshift([x - nx, y - ny]);
  });
  return pg([...top, ...bot]);
}
const many = (...ds) => ds.join('');
// part of an elliptical ring (outer rx, ry; inner rx2, ry2) from angle a0 to a1
function ovalBand(cx, cy, rx, ry, rx2, ry2, a0, a1) {
  const o = [], n = [];
  for (let a = a0; a <= a1 + 0.01; a += 6) {
    o.push([cx + rx * Math.cos(a * D), cy - ry * Math.sin(a * D)]);
    n.unshift([cx + rx2 * Math.cos(a * D), cy - ry2 * Math.sin(a * D)]);
  }
  return a1 - a0 >= 360 ? pg(o) + pg(n).replace(/^M(.*)Z$/, (m, b) => `M${b.split('L').reverse().join('L')}Z`) : pg([...o, ...n]);
}

// ---------------------------------------------------------------------------------------------
// 1. A simple circuit, as a picture (Years 2–3): battery, wires, bulb, switch and buzzer.
const WIRE = '#3f86d8';
function circuit(open) {
  const L = 60, R = 340, T = 110, B = 270, w = 9;
  const bulbOn = !open;
  const lever = open ? [[60, 218], [92, 172]] : [[60, 218], [60, 162]];
  const rays = bulbOn ? [-10, 20, 50, 90, 130, 160, 190].map((a) => ln(...pt(200, 50, 38, a), ...pt(200, 50, 50, a), 5)).join('') : '';
  const sound = bulbOn ? arcBand(340, 190, 38, -32, 32, 4) + arcBand(340, 190, 49, -32, 32, 4) : '';
  return {
    id: open ? 'circuit-open' : 'circuit', kind: 'diagram',
    viewBox: [26, -6, 350, 304], labelViewBox: [-76, -6, 546, 318], labelSize: 19,
    decor: [
      // bulb glass outline, under the glass
      { d: circ(200, 50, 32) + pg([[182, 68], [218, 68], [216, 84], [184, 84]]), fill: bulbOn ? '#c9a400' : '#8d99ad', under: true },
      // bulb base, holder and filament
      { d: box(186, 78, 28, 22, 3), fill: '#a9b4c2' },
      { d: many(ln(186, 84, 214, 82, 2), ln(186, 90, 214, 88, 2)), fill: '#7d8899' },
      { d: box(166, 98, 68, 22, 6), fill: '#5f6f8f' },
      { d: many(pl([[193, 80], [193, 58], [197, 50], [200, 58], [203, 50], [207, 58], [207, 80]], 2.4)), fill: bulbOn ? '#8a6100' : '#6b7486' },
      { d: rays, fill: '#f2c200' },
      // battery: gold positive end, terminal, + sign
      { d: many(box(232, 252, 20, 36, 6), box(232, 252, 10, 36), box(252, 262, 7, 16, 2)), fill: '#e8c547' },
      { d: many(box(238, 268.5, 10, 3), box(241.5, 265, 3, 10), box(162, 268.5, 10, 3)), fill: '#4a3b07' },
      // switch: wire ends, contacts, lever and its knob
      { d: many(ln(60, 148, 60, 164, w), ln(60, 216, 60, 232, w)), fill: WIRE },
      { d: many(circ(60, 162, 6), circ(60, 218, 6), ln(...lever[0], ...lever[1], 7)), fill: '#4d5868' },
      { d: circ(...lever[1], 6), fill: '#2f3a4a' },
      // buzzer: holes, and sound when it is working
      { d: many(circ(340, 190, 6), ...[0, 60, 120, 180, 240, 300].map((a) => circ(...pt(340, 190, 15, a), 3))), fill: '#2e1f57' },
      { d: sound, fill: '#7048b8' },
    ],
    features: [
      { id: 'wires', name: 'wires', d: box(L - w / 2, T - w / 2, R - L + w, B - T + w, 12) + box(L + w / 2, T + w / 2, R - L - w, B - T - w, 6), rule: 'evenodd', fill: WIRE, label: [-6, 128], at: [58, 128] },
      { id: 'battery', name: 'battery', d: box(150, 252, 100, 36, 6), fill: '#3c9a5f', label: [394, 300], at: [246, 286] },
      { id: 'bulb', name: 'bulb', d: circ(200, 50, 30) + pg([[184, 70], [216, 70], [214, 84], [186, 84]]), fill: bulbOn ? '#ffe45c' : '#e8edf3', label: [262, 26], at: [222, 34] },
      { id: 'switch', name: 'switch', d: box(38, 148, 44, 84, 7), fill: '#c9a878', label: [-6, 196], at: [40, 196] },
      { id: 'buzzer', name: 'buzzer', d: circ(340, 190, 27), fill: '#7d5bd0', label: [394, 248], at: [356, 210] },
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// 2. Circuit symbols (Years 6 and 8), each on its own tile so it is easy to tap.
function symbols() {
  const INK = '#24324d', TILE = '#e4ecf6', w = 3;
  const cols = [0, 262], rowH = 64, TW = 116, TH = 52;
  const list = [
    ['cell', 'cell'], ['battery', 'battery'], ['bulb', 'bulb'], ['switch-open', 'open switch'], ['switch-closed', 'closed switch'], ['fuse', 'fuse'],
    ['buzzer', 'buzzer'], ['motor', 'motor'], ['ammeter', 'ammeter'], ['voltmeter', 'voltmeter'], ['resistor', 'resistor'],
  ];
  const draw = {
    cell: (x, y) => many(ln(x - 46, y, x - 5, y, w), ln(x + 5, y, x + 46, y, w), box(x - 6.5, y - 17, 3, 34), box(x + 3, y - 8, 6, 16)),
    battery: (x, y) => many(ln(x - 46, y, x - 17, y, w), ln(x - 9, y, x + 9, y, w), ln(x + 17, y, x + 46, y, w),
      box(x - 18.5, y - 17, 3, 34), box(x - 10, y - 8, 6, 16), box(x + 6, y - 17, 3, 34), box(x + 14.5, y - 8, 6, 16)),
    bulb: (x, y) => { const r = 14, k = r * Math.SQRT1_2; return many(ln(x - 46, y, x - r, y, w), ln(x + r, y, x + 46, y, w), ring(x, y, r, w), ln(x - k, y - k, x + k, y + k, w), ln(x - k, y + k, x + k, y - k, w)); },
    'switch-open': (x, y) => many(ln(x - 46, y, x - 18, y, w), ln(x + 18, y, x + 46, y, w), ring(x - 15, y, 3, 2.4), ring(x + 15, y, 3, 2.4), ln(...pt(x - 15, y, 2, 30), ...pt(x - 15, y, 31, 30), w)),
    'switch-closed': (x, y) => many(ln(x - 46, y, x - 18, y, w), ln(x + 18, y, x + 46, y, w), ring(x - 15, y, 3, 2.4), ring(x + 15, y, 3, 2.4), ln(x - 13, y - 2.5, x + 14, y - 2.5, w)),
    fuse: (x, y) => many(ln(x - 46, y, x + 46, y, w), frame(x - 18, y - 7, 36, 14, w)),
    resistor: (x, y) => many(ln(x - 46, y, x - 18, y, w), ln(x + 18, y, x + 46, y, w), frame(x - 18, y - 8, 36, 16, w)),
    buzzer: (x, y) => {
      const pts = []; for (let a = 0; a <= 180; a += 10) pts.push(pt(x, y + 4, 16, a));
      const dome = pg(pts) ;
      return many(dome, ln(x - 46, y + 14, x - 7, y + 14, w), ln(x + 7, y + 14, x + 46, y + 14, w), ln(x - 8.5, y + 4, x - 8.5, y + 15.5, w), ln(x + 8.5, y + 4, x + 8.5, y + 15.5, w));
    },
    motor: (x, y) => many(ln(x - 46, y, x - 15, y, w), ln(x + 15, y, x + 46, y, w), ring(x, y, 15, w), pl([[x - 7, y + 7], [x - 7, y - 7], [x, y + 2], [x + 7, y - 7], [x + 7, y + 7]], 2.6)),
    ammeter: (x, y) => many(ln(x - 46, y, x - 15, y, w), ln(x + 15, y, x + 46, y, w), ring(x, y, 15, w), pl([[x - 6.5, y + 8], [x, y - 8], [x + 6.5, y + 8]], 2.6), ln(x - 3.7, y + 2.5, x + 3.7, y + 2.5, 2.4)),
    voltmeter: (x, y) => many(ln(x - 46, y, x - 15, y, w), ln(x + 15, y, x + 46, y, w), ring(x, y, 15, w), pl([[x - 6.5, y - 8], [x, y + 8], [x + 6.5, y - 8]], 2.6)),
  };
  const features = [], ink = [];
  list.forEach(([id, name], i) => {
    const col = i < 6 ? 0 : 1, row = i < 6 ? i : i - 6;
    const x = cols[col] + TW / 2, y = row * rowH + TH / 2;
    features.push({ id, name, d: box(x - TW / 2, y - TH / 2, TW, TH, 9), fill: TILE, label: [x + TW / 2 + 12, y], at: [x + TW / 2 - 2, y] });
    ink.push(draw[id](x, y));
  });
  return {
    id: 'circuit-symbols', kind: 'diagram',
    viewBox: [-8, -8, 394, 6 * rowH], labelViewBox: [-8, -8, 506, 6 * rowH], labelSize: 18,
    decor: [{ d: ink.join(''), fill: INK }],
    features,
  };
}

// ---------------------------------------------------------------------------------------------
// 3. The solar system: the Sun and the eight planets in order (sizes and distances not to scale).
function solarSystem() {
  const S = [-70, 100], SR = 112, y = 100;
  const P = [
    ['mercury', 'Mercury', 64, 8, '#a7a29c'], ['venus', 'Venus', 98, 11, '#e3c27a'], ['earth', 'Earth', 136, 12, '#3d7fd6'],
    ['mars', 'Mars', 194, 9.5, '#b0452f'], ['jupiter', 'Jupiter', 252, 28, '#d8b48a'], ['saturn', 'Saturn', 336, 21, '#e2cd8c'],
    ['uranus', 'Uranus', 410, 15, '#8fd6de'], ['neptune', 'Neptune', 454, 15, '#4867d6'],
  ];
  const orbits = P.map(([, , x]) => { const R = x - S[0]; const a = Math.asin(Math.min(0.99, 92 / R)) / D; return arcBand(S[0], S[1], R, -a, a, 1.2); }).join('');
  const moon = [163, 80];
  const labels = {
    mercury: [[64, 94], [70, 20]], venus: [[98, 109], [104, 178]], earth: [[136, 110], [142, 156]], mars: [[194, 107], [200, 178]],
    jupiter: [[252, 72], [258, 20]], saturn: [[336, 121], [342, 150]], uranus: [[410, 87], [416, 44]], neptune: [[454, 113], [448, 188]],
  };
  return {
    id: 'solar-system', kind: 'diagram',
    viewBox: [-6, 34, 482, 132], labelViewBox: [-6, 4, 546, 202], labelSize: 23,
    decor: [
      { d: orbits, fill: 'rgba(141,156,184,0.5)', under: true },
      // Earth's land, Jupiter's bands and spot, Saturn's rings
      { d: many(pg([[129, 93], [136, 91], [139, 98], [134, 104], [130, 100]]), pg([[140, 104], [145, 103], [143, 109], [138, 110]])), fill: '#5aa35a' },
      { d: many(box(226, 88, 52, 4), box(225, 102, 54, 5), box(229, 113, 46, 3)), fill: '#b4865a' },
      { d: oval(262, 108, 5, 3), fill: '#a8513a' },
      { d: ovalBand(336, 100, 42, 10, 29, 6, 180, 360), fill: '#b39a5e' },
      { d: ovalBand(336, 100, 42, 10, 29, 6, 0, 360), fill: '#b39a5e', under: true },
      { d: circ(...S, SR + 6), fill: '#ffe680', under: true },
    ],
    features: [
      { id: 'sun', name: 'Sun', d: circ(...S, SR), fill: '#ffcd29', label: [18, 188], at: [12, 150] },
      ...P.map(([id, name, x, r, fill]) => ({ id, name, d: circ(x, y, r), fill, label: labels[id][1], at: labels[id][0] })),
      { id: 'moon', name: 'Moon', d: circ(...moon, 6), fill: '#c9c6c0', label: [169, 44], at: [163, 76] },
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// 4. A carbon atom: 6 protons and 6 neutrons in the nucleus, 6 electrons in shells (2, 4).
function atom() {
  const C = [150, 150];
  // three particles in the middle and nine round them, touching but not overlapping
  const ball = [...[90, 210, 330].map((a) => pt(0, 0, 9.6, a)), ...Array.from({ length: 9 }, (_, k) => pt(0, 0, 26.5, 100 + k * 40))];
  const protons = [0, 3, 5, 7, 9, 11], neutrons = [1, 2, 4, 6, 8, 10];
  const at = (i) => [C[0] + ball[i][0], C[1] + ball[i][1]];
  const e1 = [90, 270].map((a) => pt(...C, 58, a)), e2 = [45, 135, 225, 315].map((a) => pt(...C, 106, a));
  return {
    id: 'atom', kind: 'diagram',
    viewBox: [34, 34, 232, 232], labelViewBox: [-76, 34, 540, 232], labelSize: 18,
    decor: [
      // + on each proton, – on each electron
      { d: many(...protons.map((i) => { const [x, y] = at(i); return box(x - 4, y - 1.2, 8, 2.4) + box(x - 1.2, y - 4, 2.4, 8); }), ...[...e1, ...e2].map(([x, y]) => box(x - 4.5, y - 1.3, 9, 2.6))), fill: '#ffffff' },
    ],
    features: [
      { id: 'shells', name: 'electron shells', d: ring(...C, 58, 5) + ring(...C, 106, 5), fill: '#8d9cb8', label: [292, 236], at: [...pt(...C, 106, -32)] },
      { id: 'nucleus', name: 'nucleus', d: circ(...C, 38), fill: '#f6d5e2', label: [24, 108], at: [...pt(...C, 36, 125)] },
      { id: 'protons', name: 'protons', d: many(...protons.map((i) => circ(...at(i), 8.3))), fill: '#d6336c', label: [24, 150], at: [...at(5)] },
      { id: 'neutrons', name: 'neutrons', d: many(...neutrons.map((i) => circ(...at(i), 8.3))), fill: '#7d8ba3', label: [24, 192], at: [...at(6)] },
      { id: 'electrons', name: 'electrons', d: many(...[...e1, ...e2].map(([x, y]) => circ(x, y, 9))), fill: '#2f8fd8', label: [292, 60], at: [...e2[0]] },
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// 5. A transverse wave: crest, trough, wavelength, amplitude, rest position. The labels sit in
// the empty spaces around the wave, so they can be large.
function wave() {
  const x0 = 50, lam = 200, A = 60, y0 = 130;
  const yAt = (x) => y0 - A * Math.sin((2 * Math.PI * (x - x0)) / lam);
  const pts = []; for (let x = x0; x <= x0 + 2 * lam; x += 5) pts.push([x, yAt(x)]);
  const c1 = x0 + lam / 4, c2 = c1 + lam, t1 = x0 + (3 * lam) / 4;
  const top = y0 - A, bot = y0 + A, ay = 30, ax = 384;
  return {
    id: 'wave', kind: 'diagram',
    viewBox: [0, 12, 476, 210], labelViewBox: [0, -8, 504, 230], labelSize: 18,
    decor: [
      { d: dash(4, y0, 466, y0, 2.5, 9, 7), fill: '#6f7f99' },
      { d: curve(pts, 5), fill: '#2f7fd8' },
      // guide lines from the crests up to the wavelength arrow, and across to the amplitude arrow
      { d: many(dash(c1, top - 6, c1, ay - 8, 1.6, 5, 4), dash(c2, top - 6, c2, ay - 8, 1.6, 5, 4), dash(c2 + 8, top, ax + 8, top, 1.6, 5, 4)), fill: '#6f7f99' },
      { d: arrow(c1, ay, c2, ay, 3, true, 13, 12), fill: '#6a43b5' },
      { d: arrow(ax, y0, ax, top, 3, true, 12, 11), fill: '#b5306a' },
    ],
    features: [
      { id: 'rest', name: 'rest position', d: box(2, y0 - 8, 468, 16, 6), fill: 'rgba(111,127,153,0.16)', label: [16, 160], at: [10, y0 + 2] },
      { id: 'crest', name: 'crest', d: circ(c1, top, 17) + circ(c2, top, 17), fill: 'rgba(47,127,216,0.22)', label: [126, 56], at: [c1 + 13, top - 6] },
      { id: 'trough', name: 'trough', d: circ(t1, bot, 17) + circ(t1 + lam, bot, 17), fill: 'rgba(47,127,216,0.22)', label: [228, 202], at: [t1 + 13, bot + 5] },
      { id: 'wavelength', name: 'wavelength', d: box(c1, ay - 11, lam, 22, 8), fill: 'rgba(106,67,181,0.18)', label: [206, 6], at: [200, ay] },
      { id: 'amplitude', name: 'amplitude', d: box(ax - 11, top, 22, A, 8), fill: 'rgba(181,48,106,0.18)', label: [ax + 14, 98], at: [ax + 3, 98] },
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// 6a. Shadows: light travels in straight lines from a torch; an opaque object blocks some of it.
function shadow() {
  const src = [104, 140], ball = [222, 140], br = 26, sx = 372;
  const d0 = ball[0] - src[0], half = Math.asin(br / d0) / D; // the rays that just touch the object
  const hit = (a) => [sx, src[1] - (sx - src[0]) * Math.tan(a * D)];
  const free = [half, 19, -half, -19];
  const blocked = [0, 7, -7];
  const rays = [
    ...free.map((a) => ln(...src, ...hit(a), 3.5) + head(...pt(...src, 160, a), a, 12, 11)),
    ...blocked.map((a) => {
      const L = d0 * Math.cos(a * D) - Math.sqrt(br * br - (d0 * Math.sin(a * D)) ** 2); // where the ray meets the object
      return ln(...src, ...pt(...src, L + 2, a), 3.5) + (a === 0 ? head(...pt(...src, 64, a), a, 12, 11) : '');
    }),
  ];
  const [, sTop] = hit(half), [, sBot] = hit(-half);
  return {
    id: 'ray-diagram', kind: 'diagram',
    viewBox: [20, 20, 380, 240], labelViewBox: [20, -14, 470, 300], labelSize: 18,
    decor: [
      // the dark region behind the object, where no light reaches
      { d: pg([pt(...ball, br, 90 + half), [sx - 6, sTop], [sx - 6, sBot], pt(...ball, br, -90 - half)]), fill: 'rgba(60,66,84,0.18)', under: true },
      // torch details: lens and switch
      { d: oval(97, 140, 6, 20), fill: '#fff2a8' },
      { d: box(54, 128, 12, 6, 2), fill: '#2f3d5c' },
    ],
    features: [
      { id: 'source', name: 'light source', d: many(box(30, 126, 52, 28, 6), pg([[78, 126], [96, 116], [96, 164], [78, 154]])), fill: '#5b7db1', label: [60, 194], at: [54, 152] },
      { id: 'rays', name: 'light rays', d: rays.join(''), fill: '#e8b400', label: [236, 4], at: [...pt(...src, 105, 19)] },
      { id: 'object', name: 'object', d: circ(...ball, br), fill: '#3f9a6b', label: [244, 236], at: [228, 164] },
      { id: 'screen', name: 'screen', d: pg([[sx - 6, 30], [sx + 18, 46], [sx + 18, 262], [sx - 6, 246]]), fill: '#cfd7e2', label: [404, 254], at: [384, 238] },
      { id: 'shadow', name: 'shadow', d: oval(sx + 6, (sTop + sBot) / 2 + 8, 9, (sBot - sTop) / 2), fill: '#3a4152', label: [404, 108], at: [380, 120] },
    ],
  };
}

// 6b. Reflection at a plane mirror: angle of incidence = angle of reflection, both measured from
// the normal. The mirror stands on the right; light comes in from the upper left.
function reflection() {
  const P = [300, 150], i = 40, L = 172, mirrorTop = 26, mirrorBot = 274, RAY = '#d99a00';
  const A = pt(...P, L, 180 - i), B = pt(...P, L, 180 + i);
  const hatch = []; for (let y = mirrorTop + 8; y < mirrorBot; y += 14) hatch.push(ln(306, y, 318, y - 9, 2.2));
  const mid = (a, f) => pt(...P, L * f, a);
  return {
    id: 'reflection', kind: 'diagram',
    viewBox: [110, 16, 216, 268], labelViewBox: [16, -6, 372, 296], labelSize: 18,
    decor: [
      { d: hatch.join(''), fill: '#7a8aa6', under: true },
      { d: dash(P[0] - 4, P[1], 122, P[1], 2.5, 8, 6), fill: '#4f5d78' },
      // rays, each with an arrow showing which way the light goes
      { d: many(head(...mid(180 - i, 0.42), -i, 17, 15), head(...mid(180 + i, 0.62), 180 + i, 17, 15)), fill: '#8a5a00' },
    ],
    features: [
      { id: 'mirror', name: 'mirror', d: box(296, mirrorTop, 10, mirrorBot - mirrorTop, 3), fill: '#9cc3e4', label: [314, 10], at: [301, mirrorTop + 10] },
      { id: 'normal', name: 'normal', d: box(118, P[1] - 9, P[0] - 120, 18, 6), fill: 'rgba(79,93,120,0.16)', label: [110, 150], at: [124, 150] },
      { id: 'angle-i', name: 'angle of incidence', d: sector(...P, 64, 180 - i, 180), fill: 'rgba(122,92,214,0.38)', label: [226, 120], at: [258, 138] },
      { id: 'angle-r', name: 'angle of reflection', d: sector(...P, 64, 180, 180 + i), fill: 'rgba(47,158,143,0.38)', label: [226, 180], at: [258, 162] },
      { id: 'incident', name: 'incident ray', d: ln(...A, ...pt(...P, 2, 180 - i), 7), fill: RAY, label: [160, 34], at: [...mid(180 - i, 0.88)] },
      { id: 'reflected', name: 'reflected ray', d: ln(...pt(...P, 2, 180 + i), ...B, 7), fill: RAY, label: [160, 266], at: [...mid(180 + i, 0.88)] },
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// 7. A light microscope, from the side: tube on the left, arm on the right.
// a rectangle of width w and height h centred on (cx, cy), turned by a degrees
function rbox(cx, cy, w, h, a) {
  const c = Math.cos(a * D), s = Math.sin(a * D);
  return pg([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]].map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c]));
}
function microscope() {
  const BODY = '#7f91b0';
  const arm = []; for (let t = 0; t <= 1.001; t += 0.05) {
    const p0 = [150, 300], p1 = [196, 176], p2 = [110, 74];
    arm.push([(1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0], (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]]);
  }
  return {
    id: 'microscope', kind: 'diagram',
    viewBox: [26, 0, 190, 330], labelViewBox: [-118, 0, 492, 330], labelSize: 18,
    decor: [
      // arm, base, body tube, nosepiece and lamp post, under the named parts
      { d: many(curve(arm, 26), box(40, 298, 168, 26, 10), box(82, 40, 32, 116, 3), pg([[72, 152], [124, 152], [118, 170], [78, 170]]), box(92, 266, 12, 34)), fill: BODY, under: true },
      // the slide, held by two clips
      { d: box(64, 204, 68, 5, 1), fill: '#cfe9f5' },
      { d: many(box(54, 201, 26, 4, 2), box(116, 201, 26, 4, 2)), fill: '#2f3a50' },
      // light shining up from the lamp
      { d: pg([[88, 252], [108, 252], [101, 220], [95, 220]]), fill: 'rgba(255,214,64,0.6)', under: true },
    ],
    features: [
      { id: 'eyepiece', name: 'eyepiece', d: many(box(86, 8, 24, 36, 3), box(82, 4, 32, 9, 3)), fill: '#2f9e8f', label: [32, 24], at: [84, 24] },
      { id: 'objective', name: 'objective lens', d: many(box(89, 168, 18, 30, 3), rbox(76, 180, 13, 24, 25), rbox(120, 180, 13, 24, -25)), fill: '#4b6fd6', label: [32, 178], at: [72, 180] },
      { id: 'stage', name: 'stage', d: box(44, 208, 128, 11, 3), fill: '#566582', label: [32, 213], at: [46, 213] },
      { id: 'light', name: 'light source', d: oval(98, 260, 18, 9), fill: '#f2c94c', label: [32, 260], at: [80, 260] },
      { id: 'coarse', name: 'coarse focus knob', d: circ(170, 196, 16), fill: '#7a4fc0', label: [200, 156], at: [176, 184] },
      { id: 'fine', name: 'fine focus knob', d: circ(166, 252, 10), fill: '#c25aa8', label: [200, 276], at: [172, 258] },
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// 8. The eye, cut through from the side, with light entering from the left.
function eye() {
  const C = [200, 150], R = 100;
  // the cornea bulges out in front of the iris and meets the white of the eye at ±32°
  const lim = 32, [lx, ly] = pt(...C, R, 180 - lim), cx = 82 + 58.9;
  const corneaA = Math.atan2(150 - ly, lx - cx) / D;
  const cornea = arcBand(cx, 150, 58.9, corneaA, 360 - corneaA, 6);
  return {
    id: 'eye', kind: 'diagram',
    viewBox: [70, 40, 300, 220], labelViewBox: [-4, 14, 488, 252], labelSize: 18,
    decor: [
      { d: circ(...C, R + 4), fill: '#bba692', under: true },
      { d: circ(...C, R), fill: '#f6f1e7', under: true },
      // the clear front of the eye, behind the cornea
      { d: sector(cx, 150, 58, corneaA, 360 - corneaA), fill: '#e3f2fa', under: true },
    ],
    features: [
      { id: 'cornea', name: 'cornea', d: cornea, fill: '#6db8de', label: [60, 64], at: [92, 112] },
      { id: 'retina', name: 'retina', d: arcBand(...C, R - 6, -126, 126, 8), fill: '#d9536f', label: [330, 44], at: [...pt(...C, R - 6, 56)] },
      { id: 'optic-nerve', name: 'optic nerve', d: pg([[290, 138], [356, 130], [360, 156], [290, 166]]), fill: '#e5c45c', label: [372, 182], at: [346, 152] },
      { id: 'lens', name: 'lens', d: oval(134, 150, 12, 32), fill: '#b9dcff', label: [168, 30], at: [136, 122] },
      { id: 'iris', name: 'iris', d: box(113, 102, 7, 34, 3) + box(113, 164, 7, 34, 3), fill: '#3d8a7a', label: [60, 216], at: [115, 190] },
      { id: 'pupil', name: 'pupil', d: box(113, 136, 7, 28), fill: '#1d2230', label: [60, 150], at: [114, 150] },
    ],
  };
}

export default [circuit(false), circuit(true), symbols(), solarSystem(), atom(), wave(), shadow(), reflection(), microscope(), eye()];
