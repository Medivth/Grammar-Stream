// Scenes: flat backdrops the companion can stand in, earned with badges. Each is drawn on a
// 240×180 canvas with the floor from y = 132, and the companion is nested over it (see sceneSVG),
// so its feet land on the floor. Scenes use fixed colours: they look the same in light and dark mode.
// The middle of the picture is mostly hidden by the companion, so the detail sits at the top and
// the two sides.

import { COURSE } from '../core/subjects.js';
import { capybaraSVG, capybaraEl } from './capybara.js';

export const W = 240, H = 180, FLOOR = 132;
// where the 200×160 companion goes: feet (y 150) land at about y 164, well onto the floor
const PET = { x: 36, y: 38, s: 0.84 };

const n1 = (v) => +v.toFixed(1);
const R = (x, y, w, h, fill, rx = 0, more = '') => `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}"${rx ? ` rx="${rx}"` : ''} fill="${fill}"${more}/>`;
const C = (cx, cy, r, fill, more = '') => `<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r)}" fill="${fill}"${more}/>`;
const E = (cx, cy, rx, ry, fill, more = '') => `<ellipse cx="${n1(cx)}" cy="${n1(cy)}" rx="${n1(rx)}" ry="${n1(ry)}" fill="${fill}"${more}/>`;
const P = (d, fill, more = '') => `<path d="${d}" fill="${fill}"${more}/>`;
const L = (d, stroke, w = 2, more = '') => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${more}/>`;
const G = (t, body) => `<g transform="${t}">${body}</g>`;
const sky = (fill) => R(0, 0, W, H, fill);
const floor = (fill, edge) => R(0, FLOOR, W, H - FLOOR, fill) + (edge ? R(0, FLOOR, W, 3, edge) : '');

/** A small seeded random source, so every scene draws the same each time. */
function rng(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
const pick = (r, list) => list[Math.floor(r() * list.length)];

function starfield(seed, n, x0, y0, w, h, keep = () => true, fill = '#fff') {
  const r = rng(seed);
  let out = '';
  for (let i = 0; i < n * 3 && n > 0; i++) {
    const x = x0 + r() * w, y = y0 + r() * h, size = 0.6 + r() * 1.1;
    if (!keep(x, y)) continue;
    out += C(x, y, size, fill, size > 1.4 ? '' : ' opacity=".8"');
    n--;
  }
  return out;
}
const star5 = (cx, cy, r, fill) => P(Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; return `${i ? 'L' : 'M'}${n1(cx + Math.cos(a) * rr)} ${n1(cy + Math.sin(a) * rr)}`; }).join(' ') + 'Z', fill);
const cloud = (x, y, s = 1, fill = '#fff') => G(`translate(${x} ${y}) scale(${s})`, E(0, 0, 16, 7, fill) + C(-6, -5, 7, fill) + C(5, -7, 9, fill));
const fish = (x, y, s, col, flip = false) => G(`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`, P('M-8 0 L-15 -6 L-15 6Z', col) + E(0, 0, 10, 6, col) + C(5, -1.5, 1.4, '#1c1a33'));
const palm = (x, y, h, lean = 1) => L(`M${x} ${y} Q${x + 4 * lean} ${y - h / 2} ${x + 8 * lean} ${y - h}`, '#8a5a35', 5)
  + G(`translate(${x + 8 * lean} ${y - h})`, ['M0 0 Q-14 -8 -24 2', 'M0 0 Q14 -8 24 2', 'M0 0 Q-6 -14 -18 -14', 'M0 0 Q8 -14 20 -12', 'M0 0 Q-2 6 -12 14', 'M0 0 Q4 6 12 14'].map((d) => L(d, '#3f9a4a', 5)).join(''));
const bolt = (cx, cy, r, n, fill) => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return C(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 1.6, fill); }).join('');

// --- the scenes -------------------------------------------------------------------------------

function space() {
  const inWin = (cx, cy, r) => (x, y) => (x - cx) ** 2 + (y - cy) ** 2 < (r - 3) ** 2;
  return sky('#2b3166')
    + R(0, 0, W, 12, '#20254f') + [16, 70, 124, 178].map((x) => R(x, 4, 40, 4, '#9fe8ff', 2)).join('')
    + R(0, 92, W, 10, '#353c78') + L('M80 12 V132 M160 12 V132', '#232858', 2)
    // left porthole: the Earth
    + C(50, 52, 35, '#8c95c4') + C(50, 52, 28, '#0b1030') + bolt(50, 52, 31.5, 10, '#c3c9e6')
    + starfield(3, 14, 22, 24, 56, 56, inWin(50, 52, 28))
    + C(57, 60, 15, '#3d8be0') + P('M48 52 q6 -6 12 -2 q2 6 -5 8 q-4 4 -8 -1z M58 66 q6 -3 9 2 q-2 6 -8 6 q-4 -3 -1 -8z', '#4caf50')
    + E(54, 54, 3, 2, '#fff', ' opacity=".7"') + C(57, 60, 16, 'none', ' stroke="#9fd3ff" stroke-width="1.5"')
    // right porthole: the Moon and stars
    + C(196, 48, 30, '#8c95c4') + C(196, 48, 24, '#0b1030') + bolt(196, 48, 27, 9, '#c3c9e6')
    + starfield(11, 12, 172, 24, 48, 48, inWin(196, 48, 24))
    + C(203, 41, 8, '#ece8d6') + C(201, 39, 1.8, '#cfc9b0') + C(206, 44, 1.4, '#cfc9b0')
    // a panel of switches on the left, the control desk on the right
    + R(6, 98, 36, 30, '#3c4485', 4) + [14, 24, 34].map((x, i) => R(x - 2, 104, 4, 12, '#20254f', 2) + C(x, i === 1 ? 106 : 114, 3, i === 1 ? '#ffd166' : '#5fd6a0')).join('')
    + R(10, 120, 28, 3, '#5fd6a0', 1.5)
    + R(206, 70, 32, 26, '#20254f', 4) + R(209, 73, 26, 20, '#0f1a3a', 2) + L('M211 85 l4 -6 l4 8 l4 -10 l4 8 l4 -4', '#5fd6a0', 1.6)
    + P('M198 132 L206 106 L240 106 L240 132Z', '#4a5291') + R(206, 104, 34, 4, '#6c76b8')
    + C(214, 116, 3, '#ff5f6d') + C(223, 116, 3, '#ffd166') + C(232, 116, 3, '#5fd6a0') + R(210, 122, 24, 3, '#9fe8ff', 1.5)
    + floor('#59628f', '#7480b5')
    + [-60, -20, 20, 60, 100, 140, 180, 220, 260, 300].map((x) => L(`M${120 + (x - 120) * 0.55} ${FLOOR + 3} L${x} ${H}`, '#4b5380', 1.5)).join('')
    + L(`M0 150 H${W} M0 166 H${W}`, '#4b5380', 1.5);
}

function underwater() {
  const r = rng(5);
  const kelp = (x, h, col) => L(`M${x} ${FLOOR + 4} q-6 ${-h / 4} 0 ${-h / 2} q6 ${-h / 4} 0 ${-h / 2}`, col, 5)
    + [0.3, 0.6, 0.85].map((t, i) => E(x + (i % 2 ? 5 : -5), FLOOR + 4 - h * t, 5, 2.5, col, ` transform="rotate(${i % 2 ? -30 : 30} ${x + (i % 2 ? 5 : -5)} ${n1(FLOOR + 4 - h * t)})"`)).join('');
  const dome = (cx, rad) => {
    const base = FLOOR + 2;
    return E(cx, base - 4, rad * 0.5, 4, '#7a8aa0') + R(cx - rad * 0.25, base - rad * 0.55, rad * 0.5, rad * 0.5, '#e9edf3', 4) + C(cx, base - rad * 0.32, rad * 0.1, '#ffd166')
      + P(`M${cx - rad} ${base} A${rad} ${rad} 0 0 1 ${cx + rad} ${base}Z`, '#c8f0ff', ' opacity=".4"')
      + L(`M${cx - rad} ${base} A${rad} ${rad} 0 0 1 ${cx + rad} ${base} M${cx} ${base - rad} V${base} M${cx - rad * 0.7} ${base - rad * 0.7} Q${cx} ${base - rad * 0.45} ${cx + rad * 0.7} ${base - rad * 0.7}`, '#e8f8ff', 2.5)
      + L(`M${cx - rad * 0.55} ${base - rad * 0.55} q6 -10 16 -14`, '#fff', 3, ' opacity=".7"')
      + R(cx - rad - 4, base - 4, rad * 2 + 8, 8, '#8a96a8', 3);
  };
  return sky('#2a86c0') + R(0, 0, W, 44, '#3597cf') + R(0, 0, W, 16, '#45a9dc')
    + ['M30 0 L58 0 L18 132 L-6 132Z', 'M120 0 L136 0 L118 132 L94 132Z', 'M190 0 L214 0 L238 132 L210 132Z'].map((d) => P(d, '#fff', ' opacity=".08"')).join('')
    + P('M0 112 Q30 96 60 108 Q100 92 140 106 Q180 94 240 104 V132 H0Z', '#2373a8')
    + R(96, 108, 92, 12, '#9fb3c4', 6) + [110, 130, 150, 170].map((x) => C(x, 114, 3, '#ffd166')).join('')
    + kelp(8, 64, '#2e9e5b') + kelp(234, 80, '#2e9e5b') + kelp(170, 48, '#3bb26a')
    + dome(60, 44) + dome(206, 25)
    + fish(196, 22, 1.1, '#ff8a3d', true) + fish(222, 38, 0.8, '#ffd166', true) + fish(30, 26, 0.9, '#ff6f91') + fish(150, 46, 0.6, '#ffd166')
    + [[118, 40, 4], [124, 26, 3], [116, 14, 2.5], [126, 5, 2], [92, 36, 2.5], [96, 22, 2]].map(([x, y, s]) => C(x, y, s, 'none', ' stroke="#dff6ff" stroke-width="1.5"')).join('')
    + floor('#e8d39b', '#f2e2b4')
    + Array.from({ length: 7 }, (_, i) => L(`M${10 + i * 34 + r() * 8} ${146 + (i % 3) * 10} q6 -3 12 0`, '#d4bb7c', 2)).join('')
    + star5(24, 162, 9, '#ff8a3d') + C(24, 162, 2.5, '#ffb37a')
    + P('M214 166 q8 -14 16 0z', '#f6a5b8') + L('M216 165 l6 -10 M222 164 v-10 M228 165 l-6 -10', '#e27c96', 1.2)
    + E(196, 172, 5, 3, '#c9b37c') + E(44, 174, 4, 2.5, '#c9b37c');
}

function racetrack() {
  const r = rng(9);
  const crowd = ['#ff5f6d', '#ffd166', '#5fd6a0', '#4d8fd6', '#ffffff', '#ff8a3d', '#b38cff'];
  let fans = '';
  for (let row = 0; row < 4; row++) for (let i = 0; i < 25; i++) fans += C(6 + i * 9.4 + (row % 2) * 4.5, 74 + row * 9, 3.2, pick(r, crowd));
  const flagCell = (x, y, s) => Array.from({ length: 12 }, (_, i) => R(x + (i % 4) * s, y + Math.floor(i / 4) * s, s, s, (i % 4 + Math.floor(i / 4)) % 2 ? '#1c1a33' : '#ffffff')).join('');
  return sky('#9fd8f7') + cloud(170, 30, 1.1) + cloud(60, 18, 0.8)
    // grandstand with a red roof and the crowd
    + R(0, 66, W, 46, '#7d8aa3') + P('M-4 66 L244 66 L236 56 L4 56Z', '#d62f3a') + fans
    // starting lights on a gantry
    + R(80, 0, 4, 24, '#4a4f60') + R(156, 0, 4, 24, '#4a4f60') + R(88, 8, 64, 18, '#2b2a33', 5) + [100, 114, 128, 142].map((x) => C(x, 17, 5, '#ff4b4b')).join('')
    // the barrier: red and white blocks
    + Array.from({ length: 16 }, (_, i) => R(i * 15, 112, 15, 20, i % 2 ? '#ffffff' : '#d62f3a')).join('')
    // chequered flag
    + R(14, 30, 4, 102, '#d9dde6', 2) + G('translate(18 32)', flagCell(0, 0, 8))
    // the track, a kerb and the grid
    + floor('#5d6170') + Array.from({ length: 16 }, (_, i) => R(i * 15, FLOOR, 15, 6, i % 2 ? '#ffffff' : '#d62f3a')).join('')
    + L(`M0 172 H${W}`, '#ffffff', 3, ' stroke-dasharray="18 14"')
    + L('M6 152 h30 v12 M204 152 h30 v12', '#ffffff', 2.5)
    // a stack of tyres
    + [0, 1, 2].map((i) => E(222, 160 - i * 9, 14, 6, '#2b2a33') + E(222, 158 - i * 9, 14, 5, '#3c3b46') + E(222, 158 - i * 9, 6, 2.2, '#1c1a24')).join('');
}

function city() {
  const r = rng(21);
  const building = (x, y, w, col, lit) => {
    let win = '';
    for (let yy = y + 6; yy < FLOOR - 6; yy += 9) for (let xx = x + 4; xx < x + w - 5; xx += 8) if (r() < lit) win += R(xx, yy, 4, 5, '#ffd166');
    return R(x, y, w, FLOOR - y, col) + win;
  };
  const far = [[0, 70, 26], [24, 56, 22], [46, 80, 30], [74, 48, 24], [96, 66, 30], [124, 40, 22], [144, 62, 30], [172, 74, 20], [190, 50, 26], [214, 64, 30]];
  return sky('#1b2150') + starfield(7, 26, 0, 0, W, 60)
    + C(206, 28, 15, '#fff4c9') + C(201, 24, 3, '#ece0ad') + C(211, 33, 2.2, '#ece0ad')
    + P('M60 132 L0 8 L22 4Z', '#ffffff', ' opacity=".09"') + P('M150 132 L132 0 L156 0Z', '#ffffff', ' opacity=".07"')
    + far.map(([x, y, w]) => building(x, y, w, '#2a3170', 0.25)).join('')
    + [[0, 92, 34], [30, 100, 26], [178, 96, 28], [206, 86, 34]].map(([x, y, w]) => building(x, y, w, '#353d85', 0.45)).join('')
    // the rooftop: a ledge, a water tank, a vent and an aerial with a red light
    + R(0, 124, W, 10, '#5f6582') + floor('#4b5068', '#6a7090')
    + L('M10 124 L14 96 M38 124 L34 96 M12 110 H36', '#3a3f58', 3) + R(6, 70, 36, 28, '#7a5a44', 4) + P('M4 72 L24 58 L44 72Z', '#5c4332') + L('M8 80 H40 M8 90 H40', '#5c4332', 1.5)
    + L('M226 124 V64 M218 78 L226 70 L234 78 M220 90 L226 84 L232 90', '#8d96a3', 2.5) + C(226, 62, 3.2, '#ff4b4b')
    + R(196, 140, 28, 18, '#6a7090', 3) + L('M200 146 h20 M200 151 h20', '#4b5068', 2)
    + L('M0 150 H240', '#43485e', 1.5) + L('M30 166 H210', '#43485e', 1.5);
}

function dino() {
  return sky('#ffe2a8') + R(0, 0, W, 26, '#ffd48a') + C(36, 26, 14, '#fff4c9')
    // the volcano, smoking, far away on the right
    + P('M168 104 L200 44 L216 44 L248 104Z', '#8b5e4a') + P('M200 44 L216 44 L212 52 L204 50Z', '#6d4637') + P('M207 46 q-3 14 2 24 q4 8 -1 18 l5 0 q4 -12 -1 -20 q-3 -10 0 -22z', '#ff7a2e')
    + [[208, 36, 6], [215, 27, 7], [223, 18, 8]].map(([x, y, s]) => C(x, y, s, '#c9c2b8', ' opacity=".9"')).join('')
    + P('M0 98 Q40 82 90 96 Q140 84 180 96 Q214 86 240 94 V132 H0Z', '#9ccc65')
    // a long-necked dinosaur on the far hill
    + G('translate(28 98)', L('M-14 0 Q-28 2 -36 10', '#4f8a3f', 5) + L('M12 -4 Q22 -12 24 -34', '#4f8a3f', 7) + E(28, -36, 7, 4, '#4f8a3f') + C(30, -37, 1.2, '#1c1a33')
      + R(-12, 2, 6, 14, '#4f8a3f', 2) + R(8, 2, 6, 14, '#4f8a3f', 2) + E(0, 0, 18, 10, '#4f8a3f') + R(-4, 4, 6, 12, '#3f7432', 2))
    + G('translate(120 22)', P('M-14 -2 Q-6 -8 0 0 Q6 -8 14 -2 Q6 -2 0 4 Q-6 -2 -14 -2Z', '#7a5a8a') + P('M0 0 l6 -3 l-2 4z', '#7a5a8a'))
    + P('M0 116 Q60 104 120 116 Q180 106 240 114 V132 H0Z', '#7cb342')
    + palm(232, 134, 46, -1)
    + floor('#8bc34a', '#9ad35a')
    + ['M4 140 Q0 120 -8 112', 'M8 140 Q10 118 4 104', 'M12 140 Q20 122 26 112', 'M10 140 Q26 130 34 126'].map((d) => L(d, '#3f8a3a', 5)).join('')
    + E(40, 150, 20, 4, '#7cb342') + E(200, 170, 26, 5, '#7cb342')
    + [[24, 164], [46, 172]].map(([x, y]) => E(x, y, 4, 3, '#6d9a3a') + C(x - 4, y - 5, 1.8, '#6d9a3a') + C(x, y - 6, 1.8, '#6d9a3a') + C(x + 4, y - 5, 1.8, '#6d9a3a')).join('')
    // a nest of eggs
    + E(214, 150, 18, 7, '#a1887f') + E(208, 145, 5, 7, '#f5f0e1') + E(220, 145, 5, 7, '#f5f0e1') + C(207, 143, 1.2, '#9ccc65') + C(221, 146, 1.2, '#9ccc65') + E(214, 152, 18, 4, '#8d6e63');
}

function castle() {
  const merlons = (x0, x1, y, col) => { let o = ''; for (let x = x0; x < x1; x += 14) o += R(x, y, 8, 8, col); return o; };
  const banner = (x, col, mark) => R(x, 76, 18, 30, col) + P(`M${x} 106 L${x + 9} 100 L${x + 18} 106 V112 L${x + 9} 106 L${x} 112Z`, col) + mark;
  const tower = (x, flag) => R(x, 44, 44, 88, '#a9a193') + P(`M${x - 4} 46 L${x + 22} 16 L${x + 48} 46Z`, '#c0453a')
    + L(`M${x + 22} 16 V3`, '#5c4332', 2) + P(`M${x + 22} 3 L${x + 36} 8 L${x + 22} 13Z`, flag)
    + R(x + 16, 60, 12, 18, '#4a4540', 6) + L(`M${x + 6} 96 h10 M${x + 26} 112 h12 M${x + 8} 122 h14`, '#958d7f', 2);
  return sky('#a8dcf5') + cloud(120, 22, 1.2) + cloud(80, 40, 0.7)
    + R(0, 70, W, 62, '#b9b2a4') + merlons(40, 200, 62, '#b9b2a4')
    + L('M50 86 h16 M150 92 h14 M96 112 h18 M168 116 h12', '#a39b8d', 2)
    + R(96, 82, 48, 50, '#7a6a58', 24) + R(100, 86, 40, 46, '#4a4540', 20) + L('M106 94 V132 M114 88 V132 M122 87 V132 M130 88 V132 M138 94 V132 M100 104 H140 M100 118 H140', '#8d96a3', 2)
    + banner(58, '#2f74e8', star5(67, 90, 5, '#ffd166')) + banner(164, '#d62f3a', C(173, 90, 4.5, '#ffd166'))
    + tower(0, '#2f74e8') + tower(196, '#ffd166')
    + P('M14 82 l3 -8 l3 8z', '#ff8a3d') + R(15, 82, 4, 8, '#5c4332') + P('M220 82 l3 -8 l3 8z', '#ff8a3d') + R(221, 82, 4, 8, '#5c4332')
    + floor('#d8cdb6', '#e6dcc6')
    + L(`M0 150 H${W} M0 168 H${W} M30 132 L20 150 M90 132 L86 150 M150 132 L154 150 M210 132 L220 150 M10 150 L0 168 M60 150 L54 168 M120 150 V168 M180 150 L186 168 M236 150 L244 168`, '#c2b69c', 1.5)
    // a barrel
    + R(12, 140, 24, 30, '#9a6a3c', 7) + L('M12 148 h24 M12 162 h24', '#5c4332', 2.5);
}

function jungle() {
  const leaf = (x, y, rx, ry, rot, col) => E(x, y, rx, ry, col, ` transform="rotate(${rot} ${x} ${y})"`) + L(`M${x - rx * 0.85} ${y} H${x + rx * 0.85}`, '#1a5233', 1.4, ` transform="rotate(${rot} ${x} ${y})"`);
  const vine = (x, len) => L(`M${x} 0 q-6 ${len / 3} 0 ${(len * 2) / 3} q4 ${len / 6} 0 ${len / 3}`, '#2a6b3f', 2.5)
    + [0.3, 0.55, 0.8].map((t, i) => E(x + (i % 2 ? 4 : -4), len * t, 4, 2.2, '#3f9a4a')).join('');
  const flower = (x, y, col) => [0, 72, 144, 216, 288].map((a) => E(x, y - 4, 2.6, 4.2, col, ` transform="rotate(${a} ${x} ${y})"`)).join('') + C(x, y, 2.2, '#ffd166');
  return sky('#2f7d4f')
    + P('M0 70 Q30 50 60 66 Q90 40 130 60 Q170 38 200 58 Q224 46 240 56 V132 H0Z', '#3c9a5f')
    // a waterfall between two cliffs
    + P('M18 28 L44 28 L50 132 L12 132Z', '#5a7d5a') + R(24, 28, 14, 104, '#7fd0f0') + L('M28 40 v20 M33 58 v24 M29 90 v20', '#e6f7ff', 2) + E(31, 128, 16, 5, '#cfeffc')
    + P('M0 100 Q50 86 110 102 Q170 88 240 100 V132 H0Z', '#2f8a52')
    + vine(70, 40) + vine(150, 32) + vine(176, 54)
    // a parrot on a branch
    + L('M196 46 Q216 40 240 44', '#6b4e33', 4) + G('translate(218 34)', E(0, 0, 6, 9, '#e5373f') + C(1, -8, 5, '#e5373f') + P('M5 -9 q5 1 3 5 q-3 -1 -3 -5z', '#ffd166') + C(2, -9, 1.2, '#1c1a33') + P('M-4 0 q-3 10 0 16 l3 -6z', '#2f74e8') + P('M-2 8 l-4 12 l5 -2z', '#2f9e5b'))
    + leaf(10, 20, 22, 9, 30, '#256b40') + leaf(220, 8, 24, 9, -20, '#256b40') + leaf(110, 6, 18, 7, 10, '#2f8a52')
    + floor('#5f7f33', '#6d9140')
    + leaf(14, 126, 26, 9, -60, '#1f6b3c') + leaf(30, 128, 22, 8, -30, '#2a7d47') + leaf(228, 124, 26, 9, 60, '#1f6b3c') + leaf(208, 128, 20, 8, 30, '#2a7d47')
    + flower(20, 160, '#ff6fa8') + flower(222, 150, '#ffa53d') + flower(46, 170, '#ffd166')
    + E(120, 172, 60, 4, '#557230');
}

function arctic() {
  return sky('#24356b') + starfield(13, 18, 0, 0, W, 50)
    + P('M0 40 Q40 20 80 34 T160 26 T240 30 V44 Q200 36 160 42 T80 46 T0 54Z', '#5ef2b0', ' opacity=".35"')
    + P('M0 22 Q50 6 100 18 T200 10 T240 14 V22 Q200 18 160 24 T80 28 T0 30Z', '#7de3ff', ' opacity=".25"')
    + P('M0 104 L30 76 L52 92 L84 62 L120 96 L150 70 L184 98 L214 74 L240 92 V132 H0Z', '#c9dcef')
    + P('M84 62 L96 96 L120 96Z M150 70 L160 98 L184 98Z M30 76 L36 104 L52 92Z M214 74 L220 100 L240 92Z', '#a9c2de')
    // the research hut, lit up inside
    + R(2, 96, 58, 36, '#d84a3a') + P('M0 98 Q31 74 62 98Z', '#b93a2d') + R(10, 106, 14, 10, '#ffd166', 2) + R(36, 108, 14, 24, '#8e2c22', 2) + C(46, 120, 1.4, '#ffd166')
    // a radar dome and a weather mast
    + R(204, 106, 6, 26, '#8d96a3') + C(207, 98, 16, '#f1f6fb') + L('M193 94 Q207 88 221 94 M192 102 Q207 108 222 102', '#c9d6e4', 1.5)
    + L('M232 132 V58 M226 62 H238', '#8d96a3', 2) + C(226, 62, 2.6, '#ff5f6d') + C(238, 62, 2.6, '#ff5f6d')
    + floor('#eef5fa', '#ffffff')
    + E(40, 136, 44, 6, '#ffffff') + E(210, 136, 40, 6, '#ffffff')
    + L(`M10 154 q30 -6 60 0 M170 164 q34 -6 64 0 M80 174 q40 -4 80 0`, '#d6e6f3', 2.5)
    + starfield(17, 10, 0, 50, W, 70, () => true, '#ffffff');
}

function volcano() {
  return sky('#8fd3f4') + C(208, 26, 13, '#fff2b0') + cloud(150, 22, 0.9)
    + R(0, 92, W, 40, '#3fa7d6') + L('M120 104 q6 -3 12 0 M170 112 q6 -3 12 0 M200 98 q6 -3 12 0 M140 122 q6 -3 12 0', '#e0f4ff', 2)
    // the volcano island with lava and a big plume of smoke
    + P('M-20 112 L26 44 L48 44 L100 112Z', '#7a4f3c') + P('M26 44 L48 44 L44 52 L30 52Z', '#5c3a2c')
    + P('M34 46 q-6 16 0 30 q6 14 -4 34 l8 0 q8 -18 2 -32 q-4 -14 2 -32z', '#ff6a2a') + P('M42 48 q4 12 12 18 l3 -3 q-8 -6 -11 -15z', '#ffb03a')
    + [[38, 34, 8], [47, 24, 9], [58, 15, 10]].map(([x, y, s]) => C(x, y, s, '#9c9aa6', ' opacity=".85"')).join('')
    + P('M-10 112 Q50 98 110 112Z', '#4f9a4a')
    // a little island with a palm
    + E(222, 96, 26, 6, '#f2d98d') + palm(222, 94, 34, -1)
    + floor('#f2d98d') + P(`M0 ${FLOOR} q20 6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 V${FLOOR - 2} H0Z`, '#ffffff', ' opacity=".85"')
    + palm(8, 140, 50, 1)
    + E(30, 170, 6, 3, '#e4c472') + P('M206 168 q6 -10 12 0z', '#f6a5b8')
    + G('translate(220 154)', E(0, 0, 8, 5, '#e5373f') + L('M-6 -2 l-5 -5 M6 -2 l5 -5 M-6 3 l-6 2 M6 3 l6 2', '#e5373f', 2) + C(-3, -5, 1.4, '#1c1a33') + C(3, -5, 1.4, '#1c1a33'));
}

function rocket() {
  const hazard = Array.from({ length: 24 }, (_, i) => P(`M${i * 10} ${FLOOR + 8} l5 -8 h5 l-5 8z`, '#1c1a33')).join('');
  return sky('#8e6bd6') + R(0, 40, W, 30, '#b86fc4') + R(0, 70, W, 26, '#ff8f70') + R(0, 96, W, 36, '#ffb36b') + starfield(19, 12, 0, 0, W, 36)
    + P('M0 112 Q60 98 120 110 Q180 96 240 108 V132 H0Z', '#5b4a8a')
    // the launch tower and the rocket on the left
    + L('M4 132 V18 M16 132 V18 M4 30 L16 44 L4 58 L16 72 L4 86 L16 100 L4 114 L16 128 M16 30 L4 44 L16 58 L4 72 L16 86 L4 100 L16 114', '#c94f3a', 2) + L('M16 40 H24 M16 84 H24', '#c94f3a', 3)
    + R(24, 30, 20, 86, '#f3f4f8', 6) + P('M24 34 Q34 6 44 34Z', '#e5373f') + C(34, 52, 5, '#4d8fd6') + C(34, 52, 5, 'none', ' stroke="#c7ced9" stroke-width="2"')
    + P('M24 98 L14 120 L24 116Z M44 98 L54 120 L44 116Z', '#e5373f') + R(28, 116, 12, 8, '#8d96a3') + L('M24 70 H44', '#c7ced9', 2)
    + [[22, 128, 10], [36, 130, 12], [50, 128, 9], [10, 130, 8]].map(([x, y, s]) => C(x, y, s, '#ffffff', ' opacity=".95"')).join('')
    // fuel tanks and a floodlight on the right
    + R(200, 96, 18, 36, '#e3e7ee', 9) + R(220, 104, 16, 28, '#e3e7ee', 8) + L('M200 108 h18 M220 114 h16', '#c7ced9', 2)
    + L('M228 104 V30', '#8d96a3', 2.5) + R(220, 24, 16, 8, '#4a4f60', 2) + [224, 228, 232].map((x) => C(x, 28, 1.8, '#fff6c9')).join('')
    + floor('#8a8d99') + R(0, FLOOR, W, 8, '#ffd166') + hazard
    + L(`M0 160 H${W} M60 140 V180 M180 140 V180`, '#757884', 1.5);
}

function temple() {
  const cols = [14, 26, 38, 50, 62].map((x) => R(x, 34, 6, 26, '#f7f2e4') + L(`M${x + 2} 36 V58 M${x + 4} 36 V58`, '#e2d8c0', 0.8)).join('');
  const olive = (x, y) => L(`M${x} ${y} q-2 -10 2 -18`, '#7a5a3c', 4) + C(x - 6, y - 22, 9, '#8fa86a') + C(x + 6, y - 24, 10, '#8fa86a') + C(x, y - 32, 9, '#9cb879') + [[-6, -20], [5, -27], [1, -34]].map(([dx, dy]) => C(x + dx, y + dy, 1.4, '#3d4a2c')).join('');
  return sky('#9fd6f5') + C(206, 26, 13, '#ffe38a') + cloud(140, 18, 0.8)
    + R(0, 92, W, 20, '#4aa3d6') + L('M150 100 q5 -3 10 0 M190 104 q5 -3 10 0', '#e0f4ff', 1.5)
    + P('M0 64 Q50 60 90 72 Q140 92 170 112 L0 112Z', '#8cc265')
    // the temple on the hilltop
    + R(6, 60, 70, 4, '#e9e2d0') + R(2, 64, 78, 4, '#ddd4bd') + cols + R(8, 28, 66, 6, '#f7f2e4') + P('M8 28 L41 12 L74 28Z', '#f7f2e4') + P('M16 26 L41 15 L66 26Z', '#e5dcc6')
    + P('M0 112 Q60 96 120 108 Q180 98 240 104 V132 H0Z', '#9fcf6f')
    + G('translate(104 0)', P('M0 104 Q-6 70 0 42 Q6 70 0 104Z', '#2f6b3a')) + G('translate(116 6)', P('M0 100 Q-5 72 0 50 Q5 72 0 100Z', '#2f6b3a'))
    + olive(216, 128) + olive(232, 112)
    + floor('#b5d57c', '#c4e08e') + P('M80 132 L160 132 L200 180 L40 180Z', '#e8dfc8') + L('M60 156 H180 M100 132 L90 180 M140 132 L150 180', '#d4c8ab', 1.5)
    // an amphora
    + G('translate(20 140)', P('M-4 0 h8 v4 q10 4 10 16 q0 12 -8 18 h-12 q-8 -6 -8 -18 q0 -12 10 -16z', '#c8643a') + L('M-4 4 q-8 -2 -8 6 M4 4 q8 -2 8 6', '#c8643a', 2) + R(-10, 14, 20, 4, '#2b2a33') + R(-6, 30, 12, 3, '#2b2a33'));
}

function library() {
  const r = rng(31);
  const books = ['#d62f3a', '#2f74e8', '#11855a', '#ffd166', '#9a48d6', '#ff8a3d', '#e9e2d0', '#0e7490'];
  const shelf = (x0, x1) => {
    let o = R(x0, 6, x1 - x0, 126, '#5a3a2c');
    for (const y of [10, 42, 74, 106]) {
      o += R(x0 + 3, y, x1 - x0 - 6, 26, '#3e271d');
      for (let x = x0 + 4; x < x1 - 8;) { const w = 4 + Math.floor(r() * 4), hh = 16 + Math.floor(r() * 9); o += R(x, y + 26 - hh, w, hh, pick(r, books), 1); x += w + 1; }
      o += R(x0, y + 26, x1 - x0, 4, '#6d4535');
    }
    return o;
  };
  return sky('#8a5a44') + R(0, 96, W, 36, '#6d4535') + L(`M0 96 H${W}`, '#5a3a2c', 3)
    // a round-topped window with the night outside
    + P('M88 56 V26 a32 22 0 0 1 64 0 V56Z', '#5a3a2c') + P('M93 54 V27 a27 18 0 0 1 54 0 V54Z', '#27306b') + starfield(23, 8, 95, 12, 50, 40, () => true)
    + C(134, 22, 6, '#fff4c9') + L('M120 9 V54 M93 34 H147', '#5a3a2c', 3)
    + shelf(0, 50) + shelf(192, W)
    // a hanging lamp, glowing
    + L('M172 0 V20', '#3e271d', 1.5) + C(172, 30, 18, '#ffd166', ' opacity=".18"') + P('M162 30 L166 20 L178 20 L182 30Z', '#ffd166') + C(172, 31, 3, '#fff6c9')
    + floor('#a8754f', '#b98560') + L(`M0 148 H${W} M0 164 H${W} M40 132 V148 M130 148 V164 M200 132 V148 M70 164 V180 M180 164 V180`, '#966644', 1.5)
    + E(120, 164, 96, 14, '#e6b34a') + E(120, 164, 90, 11, '#c0453a') + E(120, 164, 60, 6, '#d65a4a')
    // a stack of books and a pot plant
    + [['#2f74e8', 0], ['#ffd166', 2], ['#11855a', -1]].map(([col, dx], i) => R(10 + dx, 164 - i * 7, 30, 7, col, 2)).join('') + L('M12 158 h24', '#fff', 1, ' opacity=".5"')
    + R(210, 152, 18, 18, '#c8643a', 3) + E(212, 146, 8, 4, '#3f9a4a', ' transform="rotate(-30 212 146)"') + E(226, 144, 8, 4, '#3f9a4a', ' transform="rotate(30 226 144)"') + E(219, 140, 4, 8, '#4caf50');
}

// --- the classical world (Year 8 learns Ancient Greek; Year 6 learns Latin) -------------------

const cypress = (x, y, h, col = '#2f5a35') => E(x, y - h / 2, h / 7, h / 2, col);
const pine = (x, y, h) => L(`M${x} ${y} q2 ${-h / 2} -2 ${-h}`, '#6b4e33', 3) + E(x - 2, y - h, 15, 5, '#3d6b3a') + E(x + 3, y - h - 4, 10, 4, '#4a7d45');
// a run of fluted columns: x positions, top and bottom, width, colour, shade
const columns = (xs, y0, y1, w, col, shade) => xs.map((x) => R(x, y0, w, y1 - y0, col) + L(`M${n1(x + w / 3)} ${y0 + 2} V${y1 - 1} M${n1(x + (2 * w) / 3)} ${y0 + 2} V${y1 - 1}`, shade, 0.7)
  + R(x - 1.5, y0 - 3, w + 3, 3, col) + R(x - 1, y1, w + 2, 2, shade)).join('');
const steam = (pts, col = '#fff') => pts.map(([x, y, s]) => L(`M${x} ${y} q${-4 * s} ${-6 * s} 0 ${-12 * s} q${4 * s} ${-6 * s} 0 ${-12 * s}`, col, 2.5 * s, ' opacity=".55"')).join('');

// The Colosseum from outside: the curving travertine wall with three arcaded storeys and the attic
// on top, and on the left the broken outer ring, where you see the lower inner ring behind it.
function colosseum() {
  const D = 3, K = 186, H0 = 124, deg = Math.PI / 180;
  // a point on a ring (r = 1 is the outer wall) seen from in front, so the walls curve away from us
  const at = (t, y, r = 1) => { const s = (D - 1) / (D - r * Math.cos(t)); return [n1(120 + K * r * Math.sin(t) * s), n1(H0 + (y - H0) * s)]; };
  const ring = (r, t0, t1, n, top, storeys, attic, wall, hole, trim) => {
    const ts = Array.from({ length: n + 1 }, (_, i) => (t0 + ((t1 - t0) * i) / n) * deg), dt = ts[1] - ts[0];
    const tops = ts.map((t, i) => top(t / deg, i));
    let sil = '', holes = '', lines = '';
    ts.forEach((t, i) => { const [x, y] = at(t, tops[i], r); sil += `${i ? 'L' : 'M'}${x} ${y}`; });
    sil += `L${at(ts[n], 134, r)[0]} 134 L${at(ts[0], 134, r)[0]} 134Z`;
    for (let i = 0; i < n; i++) {
      const tm = ts[i] + dt / 2, cut = Math.max(tops[i], tops[i + 1]);
      const [xa] = at(ts[i] + dt * 0.21, 0, r), [xb] = at(ts[i + 1] - dt * 0.21, 0, r), rr = n1((xb - xa) / 2);
      for (const [yb, yt] of storeys) {
        if (cut > yb - 6) continue;
        const b = at(tm, yb, r)[1], tp = at(tm, yt, r)[1], c = at(tm, cut, r)[1];
        holes += cut < yt ? `M${xa} ${b}V${n1(tp + rr)}A${rr} ${rr} 0 0 1 ${xb} ${n1(tp + rr)}V${b}Z` : `M${xa} ${b}V${n1(c + 2)}H${xb}V${b}Z`;
      }
      if (attic && cut <= attic[1] && i % 2) { const [x1, y1] = at(tm - dt * 0.15, attic[0], r), [x2, y2] = at(tm + dt * 0.15, attic[0] + 6, r); holes += `M${x1} ${y1}H${x2}V${y2}H${x1}Z`; }
      // the cornices between the storeys, where the wall still stands
      for (const y of [...storeys.map(([, yt]) => yt - 3), ...(attic ? [attic[1] - 22] : [])]) if (cut <= y) { const a = at(ts[i], y, r), b2 = at(ts[i + 1], y, r); lines += `M${a[0]} ${a[1]}L${b2[0]} ${b2[1]}`; }
    }
    // half-columns between the arches
    let piers = '';
    ts.forEach((t, i) => { if (i === 0 || i === n) return; for (const [yb, yt] of storeys) { const lim = Math.max(tops[i], yt - 2); if (lim < yb - 4) { const a = at(t, yb, r), b = at(t, lim, r); piers += `M${a[0]} ${a[1]}V${b[1]}`; } } });
    return P(sil, wall) + L(piers, trim, 2.4) + P(holes, hole) + L(lines, trim, 3.2, ' stroke-linecap="butt"');
  };
  const out = (t, i) => (t > -14 ? 12 : Math.min(88, 12 + (-14 - t) * 4) + (i % 2 ? 6 : -2));
  return sky('#8fcdf0') + C(206, 20, 11, '#fff2b0') + cloud(30, 22, 0.7)
    + G('translate(150 14)', L('M0 0 q3 -3 6 0 q3 -3 6 0 M14 8 q2.5 -2.5 5 0 q2.5 -2.5 5 0', '#4b5a6a', 1.3))
    // the inner ring, seen through the broken part
    + ring(0.84, -64, 6, 10, () => 36, [[126, 98], [92, 72], [64, 48]], null, '#d6bd92', '#5b4331', '#e6d1a9')
    // the outer wall: three storeys of arches, then the attic with its small windows
    + ring(1, -66, 66, 22, out, [[127, 96], [90, 68], [62, 44]], [22, 38], '#e9d5ab', '#6e5238', '#f7ead0')
    + floor('#d9ccb2', '#e8dcc4')
    + L(`M0 152 H${W} M0 170 H${W} M40 132 L34 152 M120 132 V152 M200 132 L206 152 M14 152 L6 170 M80 152 L76 170 M160 152 L164 170 M226 152 L234 170`, '#c6b796', 1.5)
    // a broken column and a capital
    + E(24, 166, 15, 4, '#c9b48c') + R(13, 138, 22, 28, '#ecdcb8') + L('M18 141 V165 M24 140 V165 M30 141 V165', '#d2bf98', 1.2) + P('M13 140 l5 -4 l4 3 l6 -5 l7 4 v2z', '#ecdcb8') + E(24, 140, 11, 2.5, '#d9c7a0')
    + R(206, 150, 26, 6, '#e3d3b0') + P('M208 150 l4 -8 h18 l4 8z', '#ead9b5') + C(211, 144, 3, '#d2bf98') + C(229, 144, 3, '#d2bf98');
}

// The Roman Forum: the Temple of Saturn's columns, three tall columns of Castor and Pollux, the
// triple Arch of Septimius Severus, the Palatine with its umbrella pines, and the basalt paving.
function forum() {
  const r = rng(41);
  let slabs = '';
  for (let y = FLOOR + 4, row = 0; y < H; y += 11, row++) for (let x = -10 + (row % 2) * 9; x < W; x += 18 + r() * 8) slabs += `M${n1(x)} ${y}l${n1(2 + r() * 3)} 10`;
  return sky('#a9daf3') + cloud(176, 14, 0.8) + cloud(56, 30, 0.6)
    + P('M0 92 Q40 64 92 74 Q140 58 180 72 Q214 64 240 78 V132 H0Z', '#9cbf6e')
    // brick ruins of the palaces on the Palatine
    + R(150, 56, 50, 30, '#b9785a') + [154, 166, 178, 190].map((x) => P(`M${x} 86 V70 a4 4 0 0 1 8 0 V86Z`, '#6d3f2c')).join('')
    + pine(96, 76, 20) + pine(140, 66, 18) + pine(214, 72, 22) + cypress(122, 76, 26) + cypress(206, 80, 22)
    // three tall Corinthian columns with their bit of entablature
    + columns([92, 106, 120], 22, 96, 7, '#efe6d2', '#cfc2a6') + R(88, 12, 42, 10, '#e9dfc8') + R(88, 18, 42, 2, '#cfc2a6') + R(84, 22, 12, 3, '#d8ccb2')
    + P('M0 98 Q60 88 120 96 Q180 86 240 96 V132 H0Z', '#c9b896')
    // the Temple of Saturn on its high podium
    + R(0, 92, 74, 40, '#d8c9a6') + R(0, 92, 74, 4, '#e8dcc2') + L('M0 104 H74 M0 116 H74', '#c4b38e', 1.2)
    + columns([2, 18, 34, 50], 40, 92, 9, '#d4c5b6', '#ab9a8c') + [6.5, 22.5, 38.5, 54.5].map((x) => C(x - 3, 37, 2, '#e8dcc2') + C(x + 3, 37, 2, '#e8dcc2')).join('')
    + R(0, 22, 66, 13, '#e8dcc2') + R(0, 26, 66, 5, '#d5c7a8') + R(0, 20, 70, 3, '#f2e8d4')
    // the Arch of Septimius Severus: three arches, columns in front, the tall attic
    + R(162, 40, 80, 92, '#e6d8b8') + R(162, 22, 80, 18, '#ddcfae') + R(168, 26, 68, 10, '#d3c3a0') + R(160, 38, 84, 4, '#f2e8d2')
    + P('M190 132 V82 a14 14 0 0 1 28 0 V132Z M168 132 V96 a7 7 0 0 1 14 0 V132Z M226 132 V96 a7 7 0 0 1 14 0 V132Z', '#5f4a3a')
    + columns([164, 183, 220, 238], 50, 116, 5, '#f2ead6', '#cfc0a0') + [164, 183, 220, 238].map((x) => R(x - 2, 116, 9, 16, '#d8caa8')).join('')
    + L('M174 60 h10 M226 60 h10 M196 56 h16', '#cbbb98', 1.5)
    + floor('#8e8b86', '#a3a09a') + L(`M0 143 H${W} M0 154 H${W} M0 165 H${W} M0 176 H${W}`, '#77746f', 1.4) + L(slabs, '#77746f', 1.4)
    // a fallen column and a broken capital on the paving
    + R(4, 150, 40, 11, '#ece3cf', 5) + L('M10 151 V160 M18 151 V160 M26 151 V160 M34 151 V160', '#d3c7ab', 1) + E(44, 155.5, 3, 5.5, '#d8ccb2')
    + P('M206 168 l5 -12 h22 l5 12z', '#ece3cf') + C(210, 157, 3.5, '#d8ccb2') + C(234, 157, 3.5, '#d8ccb2') + R(204, 168, 36, 4, '#d3c7ab');
}

// A Greek theatre like Epidaurus, seen from the round orchestra: rows of stone seats curving up the
// hillside with stairways and the walkway across them, the gateway on the left and the skene on the right.
function theatre() {
  const cx = 120, cy = 152, half = (rx, ry) => `M${n1(cx - rx)} ${cy}A${n1(rx)} ${n1(ry)} 0 0 1 ${n1(cx + rx)} ${cy}Z`;
  let rows = '';
  for (let k = 16; k >= 0; k--) {
    const rx = 112 + k * 9.5, ry = 30 + k * 6.2;
    rows += k === 10 ? P(half(rx, ry), '#c4b291') + P(half(rx - 4, ry - 5), '#e6dbc2') : P(half(rx, ry), '#b9a681') + P(half(rx - 1.5, ry - 2.6), '#ece3cf');
  }
  // stairways: more in the upper tier than the lower one
  const stair = (a, k0, k1) => { const p = (k) => [n1(cx + Math.cos(a) * (112 + k * 9.5)), n1(cy - Math.sin(a) * (30 + k * 6.2))]; const [x0, y0] = p(k0), [x1, y1] = p(k1); return `M${x0} ${y0}L${x1} ${y1}`; };
  let stairs = '';
  for (let i = 1; i < 12; i++) stairs += stair((i * Math.PI) / 12, 0, 10);
  for (let i = 1; i < 24; i += 2) stairs += stair((i * Math.PI) / 24, 10.4, 16.6);
  return sky('#a6d8f2') + C(30, 14, 9, '#fff2b0')
    + P('M0 40 Q40 14 90 24 Q140 8 190 22 Q220 14 240 26 V70 H0Z', '#7fae5e')
    + [[10, 44, 18], [58, 30, 16], [178, 28, 16], [230, 38, 18], [100, 24, 14], [146, 22, 12]].map(([x, y, h]) => cypress(x, y, h)).join('')
    + [[32, 34], [124, 22], [204, 30]].map(([x, y]) => C(x, y, 7, '#5f8f47') + C(x + 7, y + 2, 6, '#6a9b50')).join('')
    + rows + L(stairs, '#b29f7a', 2.2)
    // the gateway into the orchestra, on the left
    + R(0, 76, 52, 8, '#e3d7bd') + R(0, 84, 52, 48, '#d9cdb0') + P('M8 132 V92 H22 V132Z M30 132 V92 H44 V132Z', '#8a7a62') + R(4, 88, 4, 44, '#efe6d2') + R(22, 88, 8, 44, '#efe6d2') + R(44, 88, 6, 44, '#efe6d2') + R(0, 72, 54, 4, '#f2eadb')
    // the skene: the stage building with its columns, on the right
    + R(196, 84, 44, 48, '#c9b28c') + R(194, 80, 46, 5, '#ddc9a5') + columns([200, 212, 224, 236], 96, 130, 4, '#efe6d2', '#cbbd9e') + R(196, 92, 44, 4, '#ddc9a5')
    + P('M206 132 V112 h8 V132Z M228 132 V112 h8 V132Z', '#6d5a44', ' opacity=".6"')
    // the round orchestra: beaten earth inside a ring of stone, the altar at its centre
    + floor('#dcc596', '#e7d4aa')
    + E(cx, 158, 136, 26, 'none', ' stroke="#f1e8d4" stroke-width="5"') + E(cx, 158, 128, 22, 'none', ' stroke="#cbb27e" stroke-width="1.5"')
    + R(12, 160, 18, 10, '#e9dfc8') + R(10, 158, 22, 3, '#f4ecdb') + steam([[21, 156, 0.5]], '#9a8f80')
    + E(222, 168, 10, 3, '#c3a876') + R(216, 156, 12, 12, '#cfa45e', 3) + R(214, 154, 16, 3, '#e0b873');
}

// Mount Olympus at sunrise: rocky peaks above a sea of cloud, the gods' hall gleaming on a summit,
// Zeus's eagle in the sky, and a marble terrace to stand on.
function olympus() {
  return sky('#55579e') + R(0, 22, W, 22, '#7d64ad') + R(0, 44, W, 22, '#c46f9f') + R(0, 66, W, 22, '#f08c86') + R(0, 88, W, 44, '#ffb877')
    + starfield(37, 8, 0, 0, W, 20)
    + C(198, 92, 26, '#ffd98a', ' opacity=".5"') + C(198, 92, 17, '#fff1bf')
    // the peaks, lit pink on the sunrise side, with snow on top
    + P('M60 112 L104 30 L118 44 L134 22 L170 84 L190 112Z', '#8a7f9e') + P('M134 22 L170 84 L150 90 L138 56Z', '#a596b2')
    + P('M104 30 L112 44 L118 44 L126 34 L134 22 L142 36 L136 42 L128 38 L120 50 L112 48 L106 40 L98 42Z', '#fff4f6')
    + P('M-12 112 L8 54 L50 54 L70 112Z', '#7a7092') + P('M8 54 L50 54 L54 66 L44 62 L36 68 L24 62 L14 68 L5 62Z', '#fff4f6')
    + P('M176 112 L210 64 L250 112Z', '#7a7092') + P('M210 64 L218 76 L206 76Z', '#fff4f6')
    // the hall of the gods on the left summit: white marble and gold
    + L('M29 6 V0 M12 12 L6 6 M46 12 L52 6 M60 22 H68', '#fff3c4', 1.6, ' opacity=".8"')
    + R(4, 46, 50, 4, '#f2c14e') + columns([8, 18, 28, 38, 48], 30, 46, 4, '#fffaf0', '#e8dcc0') + R(4, 24, 50, 5, '#fffaf0') + P('M4 24 L29 12 L54 24Z', '#f2c14e') + P('M11 22 L29 15 L47 22Z', '#ffe08a') + C(29, 10, 2.5, '#f2c14e')
    // Zeus's eagle
    + G('translate(80 18)', P('M-14 -2 Q-6 -8 0 0 Q6 -8 14 -2 Q6 -2 0 4 Q-6 -2 -14 -2Z', '#4a3a5c') + C(0, -1, 2, '#4a3a5c'))
    // the sea of cloud
    + P('M0 104 q12 -12 26 -4 q10 -14 26 -4 q14 -10 26 0 q12 -12 28 -2 q14 -12 28 0 q12 -10 26 -2 q14 -12 28 0 q12 -10 24 -2 q12 -10 24 2 V132 H0Z', '#fde7ef')
    + P('M0 116 q14 -10 28 -2 q14 -12 30 0 q14 -10 30 0 q16 -12 32 0 q14 -10 30 0 q16 -12 32 0 q14 -10 30 0 q12 -8 28 0 V132 H0Z', '#ffffff')
    // the marble terrace with a golden edge
    + floor('#f6f1e7', '#f2c14e') + R(0, FLOOR + 3, W, 2, '#d9a93a')
    + L(`M0 154 H${W} M60 135 L50 154 M180 135 L190 154 M120 154 V180 M20 154 L10 180 M220 154 L230 180`, '#e4dccb', 1.5)
    + cloud(18, 172, 0.9) + cloud(222, 176, 1)
    // a golden tripod and a laurel bough on the terrace
    + L('M206 158 l-6 16 M214 158 V176 M222 158 l6 16', '#d9a93a', 2.2) + P('M202 150 h24 q-2 9 -12 9 q-10 0 -12 -9z', '#f2c14e') + steam([[214, 148, 0.6]], '#ffffff');
}

// A trireme on the blue Aegean: three banks of oars, a square sail, an eye painted on the bow and a
// bronze ram, seen from a stone quay.
function trireme() {
  let oars = '';
  for (let i = 0; i < 16; i++) for (const [dy, dx] of [[0, 0], [5, 4], [10, 8]]) { const x = 32 + i * 11.4 + dx, y = 80 + dy; oars += `M${n1(x)} ${y}l-9 ${24 - dy}`; }
  return sky('#9fd8f7') + C(36, 22, 11, '#fff2b0') + cloud(200, 18, 0.8)
    + R(0, 62, W, 70, '#1f7fc0') + R(0, 62, W, 4, '#4aa3d6')
    // an island on the horizon with a little white temple
    + P('M150 64 Q170 46 196 52 Q214 50 236 64Z', '#7c9a8a') + R(188, 44, 14, 6, '#ffffff') + P('M186 44 L195 39 L204 44Z', '#ffffff')
    // the sail on its yard and mast, lined with brails
    + L('M126 82 V8', '#6b4e33', 3) + L('M86 12 Q126 6 166 12', '#6b4e33', 3)
    + P('M90 13 Q126 8 162 13 L158 56 Q126 50 94 56Z', '#f4ead2') + L('M106 12 V54 M118 11 V52 M134 11 V52 M146 12 V54 M93 26 Q126 20 160 26 M93 40 Q126 34 159 40', '#d9c9a4', 1.1)
    + P('M120 22 l6 -6 l6 6 l-6 14z', '#c0453a')
    // the oars dipping into the water, under the outrigger
    + L(oars, '#c7a273', 1.4)
    // the hull: black with a red stripe, the ram at the bow, the curling stern
    + P('M12 92 L22 78 L216 78 Q228 76 232 62 Q236 48 226 40 Q238 42 240 56 Q240 80 222 96 L24 96Z', '#3a2a24')
    + R(22, 77, 196, 4, '#b8432f') + R(28, 81, 184, 5, '#7a5236')
    + P('M12 92 L2 94 L2 97 L14 97Z', '#c58b3b') + L('M2 94.5 H10', '#8c5f25', 1) + L('M20 80 Q12 76 14 66', '#3a2a24', 4)
    + E(30, 87, 6, 3.4, '#ffffff') + C(31, 87, 2.2, '#1c1a33') + L('M24 84 q6 -3 12 0', '#b8432f', 1.2)
    + L('M222 96 l12 16 M228 90 l10 20', '#6b4e33', 2.5)
    + L('M60 102 q4 -2 8 0 M110 104 q4 -2 8 0 M170 102 q4 -2 8 0 M20 110 q5 -3 10 0 M200 116 q5 -3 10 0 M40 122 q5 -3 10 0', '#d6efff', 1.6)
    // the stone quay
    + floor('#d6c6a2', '#e7d9b8') + L(`M0 148 H${W} M0 164 H${W} M30 132 V148 M90 132 V148 M150 132 V148 M210 132 V148 M10 148 V164 M60 148 V164 M120 148 V164 M180 148 V164 M230 148 V164 M40 164 V180 M100 164 V180 M160 164 V180 M220 164 V180`, '#bfae88', 1.5)
    // a bollard with its rope, and an amphora
    + R(12, 146, 14, 18, '#6b6f78', 4) + R(10, 144, 18, 5, '#7d828c', 2) + E(19, 168, 14, 4, '#a7804e') + E(19, 166, 9, 2.5, '#8d6a3f')
    + G('translate(222 142)', P('M-4 0 h8 v4 q10 4 10 16 q0 12 -8 18 h-12 q-8 -6 -8 -18 q0 -12 10 -16z', '#c8643a') + L('M-4 4 q-8 -2 -8 6 M4 4 q8 -2 8 6', '#c8643a', 2) + R(-9, 16, 18, 3, '#2b2a33'));
}

// The atrium of a Roman house: red painted walls, the opening in the roof above the impluvium pool,
// four columns, a little household shrine and a black-and-white mosaic floor.
function atrium() {
  const panel = (x, w, col) => R(x, 46, w, 56, col) + R(x + 4, 50, w - 8, 48, 'none', 0, ' stroke="#e9c46a" stroke-width="1.2"');
  return sky('#b23a2b')
    // the ceiling and the opening in the roof, with the sky above
    + R(0, 0, W, 34, '#5a3a2c') + P('M64 0 H176 L160 22 H80Z', '#9fd8f7') + P('M60 0 L80 22 L72 26 L50 0Z M180 0 L160 22 L168 26 L190 0Z', '#c0643a')
    + L('M80 22 H160', '#7a4a2c', 3) + [86, 98, 110, 122, 134, 146, 158].map((x) => P(`M${x - 2} 22 l2 4 l2 -4z`, '#c0643a')).join('')
    + P('M80 22 H160 L196 132 H44Z', '#fff7d6', ' opacity=".16"')
    // painted walls: panels framed in gold, a white frieze, a black dado
    + R(0, 34, W, 8, '#f3ead8') + L(`M0 38 H${W}`, '#b23a2b', 1.4, ' stroke-dasharray="4 4"')
    + panel(30, 30, '#b23a2b') + panel(178, 30, '#b23a2b') + panel(64, 18, '#e2b14e') + panel(158, 18, '#e2b14e')
    + R(0, 102, W, 30, '#2b2324') + L(`M0 104 H${W}`, '#e9c46a', 1.4)
    + C(45, 72, 5, '#3f9a4a') + E(45, 79, 2, 3, '#f3ead8') + C(193, 72, 5, '#5b8fd6') + E(193, 79, 2, 3, '#f3ead8')
    // the household shrine on the left wall
    + R(4, 70, 22, 22, '#f3ead8') + P('M2 70 L15 60 L28 70Z', '#f3ead8') + R(8, 74, 14, 14, '#8a5a35') + C(15, 81, 3, '#ffd166') + R(2, 92, 26, 3, '#d9cdb7')
    // back columns at the far corners of the pool
    + columns([78, 156], 26, 128, 6, '#f6f0e2', '#d8ccb2') + R(78, 100, 6, 28, '#b23a2b') + R(156, 100, 6, 28, '#b23a2b')
    // the mosaic floor
    + floor('#efe6d2', '#d9cdb7')
    + L(`M0 172 H${W} M0 176 H${W}`, '#2b2324', 1.4) + Array.from({ length: 24 }, (_, i) => P(`M${i * 10 + 5} 170 l4 4 l-4 4 l-4 -4z`, '#2b2324')).join('')
    // the impluvium: a shallow pool in a marble kerb, with the light from above on the water
    + P('M58 136 H182 L196 156 H44Z', '#f6f0e2') + P('M64 138 H176 L187 153 H53Z', '#3f95c4') + P('M96 140 H140 L130 150 H84Z', '#8fd0ee', ' opacity=".7"')
    // the front columns, painted red below, framing the room
    + columns([14, 216], 30, 166, 10, '#f6f0e2', '#d8ccb2') + R(14, 124, 10, 42, '#b23a2b') + R(216, 124, 10, 42, '#b23a2b')
    // a marble table with a bronze bowl, and a pot plant
    + R(30, 152, 22, 4, '#f6f0e2') + R(34, 156, 4, 12, '#d8ccb2') + R(44, 156, 4, 12, '#d8ccb2') + P('M33 152 q8 -8 16 0z', '#b8863b')
    + R(194, 158, 14, 12, '#c8643a', 3) + E(196, 152, 6, 3, '#3f9a4a', ' transform="rotate(-30 196 152)"') + E(206, 151, 6, 3, '#3f9a4a', ' transform="rotate(30 206 151)"') + E(201, 148, 3, 6, '#4caf50');
}

// Delphi: the grey-pink cliffs of Parnassus, the Temple of Apollo on its terrace, the round tholos,
// the Pythia's bronze tripod with smoke rising and the omphalos, the navel stone of the world.
function delphi() {
  return sky('#b9dff5') + cloud(206, 16, 0.6)
    + P('M0 0 H240 V40 Q220 52 200 46 Q180 58 160 50 Q130 62 110 54 Q80 64 60 52 Q36 60 0 50Z', '#c8a894')
    + L('M14 6 V44 M32 2 V50 M50 8 V46 M78 0 V52 M100 6 V50 M130 2 V54 M152 8 V48 M176 0 V46 M196 6 V42 M220 2 V44', '#a88b79', 1.6)
    + P('M0 50 Q36 60 60 52 Q80 64 110 54 Q130 62 160 50 Q180 58 200 46 Q220 52 240 40 V132 H0Z', '#93ad6c')
    + [[96, 74], [130, 66], [150, 80], [186, 64], [112, 92]].map(([x, y]) => C(x, y, 6, '#7d9a58') + C(x + 6, y + 2, 5, '#869f60')).join('')
    + cypress(84, 96, 26) + cypress(168, 74, 22) + cypress(232, 74, 24)
    // the Temple of Apollo on its terrace
    + R(0, 98, 76, 8, '#d8ccb2') + R(0, 94, 72, 4, '#ece3cf') + columns([2, 15, 28, 41, 54, 67], 66, 94, 6, '#f4ede0', '#d8ccb2') + R(0, 58, 76, 8, '#ece3cf') + P('M0 58 L38 44 L76 58Z', '#f4ede0') + P('M8 56 L38 46 L68 56Z', '#e3d8c2')
    // the tholos: a ring of columns with a conical roof
    + R(176, 112, 60, 6, '#d8ccb2') + R(180, 108, 52, 4, '#ece3cf') + R(184, 82, 44, 26, '#cbbd9f')
    + columns([182, 191, 200, 209, 218, 227], 80, 108, 4.5, '#f4ede0', '#d8ccb2') + R(178, 72, 56, 8, '#ece3cf') + P('M178 72 Q206 46 234 72Z', '#b77a5c') + L('M186 66 Q206 52 226 66', '#9e6449', 1.2)
    + floor('#ddd2bb', '#ece3cf') + L(`M0 150 H${W} M0 168 H${W} M44 132 L40 150 M110 132 V150 M196 132 L200 150 M20 150 L16 168 M80 150 L78 168 M160 150 L162 168 M226 150 L230 168`, '#c8bb9f', 1.5)
    // the Pythia's tripod, smoking, with a laurel sprig
    + steam([[30, 116, 1], [38, 110, 0.8]], '#ffffff')
    + L('M24 128 l-8 40 M34 128 V170 M44 128 l8 40', '#a8742f', 3) + P('M18 116 h32 q-2 14 -16 14 q-14 0 -16 -14z', '#c58b3b') + R(16, 114, 36, 4, '#d8a24a', 2)
    + L('M54 128 q8 -6 14 -2', '#4f7d3a', 2) + [[58, 125], [62, 122], [66, 124]].map(([x, y]) => E(x, y - 2, 1.8, 3.4, '#5f9446')).join('')
    // the omphalos, wrapped in its knotted net
    + R(204, 164, 32, 6, '#c8bb9f') + P('M206 164 Q206 136 220 134 Q234 136 234 164Z', '#e6dccb')
    + L('M209 156 L222 140 L233 152 M207 146 L226 162 M213 138 L231 158 M210 162 L225 146', '#b8a98a', 1.3) + [[216, 148], [222, 154], [226, 146], [214, 158]].map(([x, y]) => C(x, y, 1.6, '#b8a98a')).join('');
}

// The great bath: a barrel-vaulted hall with a big half-moon window, a warm green pool with steam
// rising, a lion-head spout, and the stone edge of the pool to stand on.
function baths() {
  let coffers = '';
  for (let i = 1; i < 12; i++) { const a = (i * Math.PI) / 12; coffers += `M${n1(120 - Math.cos(a) * 104)} ${n1(104 - Math.sin(a) * 100)}L${n1(120 - Math.cos(a) * 118)} ${n1(104 - Math.sin(a) * 114)}`; }
  return sky('#8a6a4c')
    // the vault, ribbed with coffers, over the back wall
    + P('M2 104 A118 114 0 0 1 238 104Z', '#c9a77a') + L(coffers, '#9c7a52', 3) + P('M16 104 A104 100 0 0 1 224 104Z', '#e8d8b8')
    // the half-moon window, in three lights
    + P('M64 76 A56 50 0 0 1 176 76Z', '#a7dbf5') + L('M64 76 A56 50 0 0 1 176 76Z M101 76 V30 M139 76 V30', '#c9a77a', 4)
    // arches into the rooms on either side, and columns
    + P('M30 104 V76 a12 12 0 0 1 24 0 V104Z M186 104 V76 a12 12 0 0 1 24 0 V104Z', '#7a5a3e') + R(26, 76, 4, 28, '#f3ead6') + R(54, 76, 4, 28, '#f3ead6') + R(182, 76, 4, 28, '#f3ead6') + R(210, 76, 4, 28, '#f3ead6')
    // the warm green pool with steam rising
    + R(0, 100, W, 32, '#3fa79a') + R(0, 100, W, 3, '#2d8a7f') + L('M20 112 q6 -3 12 0 M90 118 q6 -3 12 0 M150 110 q6 -3 12 0 M200 120 q6 -3 12 0 M50 124 q6 -3 12 0', '#a4e6dc', 1.6)
    + steam([[40, 104, 1.1], [76, 100, 0.9], [168, 102, 1], [204, 100, 1.2], [120, 96, 0.8]])
    // great piers with a lion-head spout pouring into the pool
    + R(0, 0, 18, 132, '#d9c39c') + R(222, 0, 18, 132, '#d9c39c') + R(0, 92, 20, 6, '#ecdcbc') + R(220, 92, 20, 6, '#ecdcbc') + L('M9 0 V92 M231 0 V92', '#c4ad86', 1.5)
    + C(18, 112, 7, '#b8863b') + C(18, 112, 4, '#d8a24a') + C(20, 113, 1.6, '#5c4022') + L('M24 115 q6 2 6 16', '#bfeee6', 3)
    + floor('#ece2cc', '#f6efe0')
    + L(`M0 172 H${W}`, '#2b5a6a', 3) + Array.from({ length: 12 }, (_, i) => P(`M${i * 20 + 4} 176 q6 -6 12 0`, 'none', ' stroke="#2b5a6a" stroke-width="2"')).join('')
    + L(`M0 150 H${W} M40 135 V150 M120 135 V150 M200 135 V150 M80 150 V170 M160 150 V170`, '#d6c9ad', 1.5)
    // a folded towel, an oil flask and a strigil
    + R(8, 152, 34, 10, '#e46a5a', 3) + L('M8 157 H42', '#c94f3f', 1.2)
    + G('translate(214 152)', C(0, 6, 8, '#3f7fb5') + R(-2, -6, 4, 6, '#3f7fb5') + R(-4, -8, 8, 3, '#2b5a8a'))
    + L('M190 168 q-2 -12 8 -10 q6 2 2 6', '#b8863b', 2.4);
}

// The full list, in the order the oldest course meets them; sceneOrder() reorders per course.
export const SCENES = [
  { id: 'space', name: 'Space station', draw: space },
  { id: 'underwater', name: 'Underwater base', draw: underwater },
  { id: 'racetrack', name: 'Race track', draw: racetrack },
  { id: 'city', name: 'Hero rooftop', draw: city },
  { id: 'dino', name: 'Dinosaur valley', draw: dino },
  { id: 'castle', name: 'Castle courtyard', draw: castle },
  { id: 'jungle', name: 'Jungle', draw: jungle },
  { id: 'arctic', name: 'Arctic base', draw: arctic },
  { id: 'volcano', name: 'Volcano island', draw: volcano },
  { id: 'rocket', name: 'Launch pad', draw: rocket },
  { id: 'temple', name: 'Greek temple', draw: temple },
  { id: 'library', name: 'Cosy library', draw: library },
  { id: 'colosseum', name: 'Colosseum', draw: colosseum },
  { id: 'forum', name: 'Roman Forum', draw: forum },
  { id: 'theatre', name: 'Greek theatre', draw: theatre },
  { id: 'olympus', name: 'Mount Olympus', draw: olympus },
  { id: 'trireme', name: 'Trireme harbour', draw: trireme },
  { id: 'atrium', name: 'Roman villa', draw: atrium },
  { id: 'delphi', name: 'Oracle at Delphi', draw: delphi },
  { id: 'baths', name: 'Roman baths', draw: baths },
];
export const SCENE_BY_ID = Object.fromEntries(SCENES.map((s) => [s.id, s]));

// Unlocking: the first FREE scenes are open from the start, then one more for every PER_SCENE
// badge. Every course has 17 or more badges; a course with more scenes than LAST opens a few of them
// in pairs, so its last scene still needs only LAST badges.
export const FREE = 3, PER_SCENE = 1, LAST = 14;
const ORDER = {
  young: ['space', 'racetrack', 'underwater', 'dino', 'city', 'castle', 'rocket', 'volcano', 'jungle', 'arctic', 'library', 'temple'],
  // Year 8 learns Ancient Greek: the classical scenes come early, taking turns with the others
  y8: ['space', 'underwater', 'temple', 'colosseum', 'library', 'trireme', 'castle', 'forum', 'arctic', 'theatre', 'jungle', 'olympus', 'volcano', 'atrium', 'rocket', 'delphi', 'city', 'baths', 'dino', 'racetrack'],
  // Year 6 learns Latin: the Roman scenes come a little sooner than the Greek ones
  y6: ['space', 'underwater', 'library', 'castle', 'jungle', 'temple', 'colosseum', 'arctic', 'forum', 'volcano', 'trireme', 'rocket', 'atrium', 'city', 'theatre', 'olympus', 'dino', 'baths', 'delphi', 'racetrack'],
};
/** The order this course's scenes unlock in: what this child likes most comes first. */
export const sceneOrder = (course = COURSE) => ORDER[course.young ? 'young' : course.id] || ORDER.y6;

// The orders as first released (12 scenes, one per badge): a scene a child had open then stays open
// now that the classical scenes have joined the queue in front of it.
const RELEASED = {
  y8: ['space', 'underwater', 'temple', 'library', 'castle', 'arctic', 'jungle', 'volcano', 'rocket', 'city', 'dino', 'racetrack'],
  y6: ['space', 'underwater', 'library', 'castle', 'jungle', 'temple', 'arctic', 'volcano', 'rocket', 'city', 'dino', 'racetrack'],
};

/** Each scene in unlock order, with whether it is open and how many more badges it needs. */
export function sceneStatus(earned, order = sceneOrder(), released = order === sceneOrder() ? RELEASED[COURSE.id] : null) {
  const locked = order.length - FREE;
  const before = new Set((released || []).filter((_, i) => earned >= Math.max(0, i - FREE + 1)));
  return order.map((id, i) => {
    const k = Math.max(0, i - FREE + 1);
    const goal = locked * PER_SCENE > LAST ? Math.ceil((k * LAST) / locked) : k * PER_SCENE;
    const open = earned >= goal || before.has(id);
    return { id, name: SCENE_BY_ID[id].name, open, need: open ? 0 : goal - earned };
  });
}

/** A scene as an SVG string; with `companion` (capybaraSVG options), the companion stands in it. */
export function sceneSVG(id, companion = null, { bob = false } = {}) {
  const sc = SCENE_BY_ID[id];
  if (!sc) return '';
  // the companion's drawing, moved and scaled into place (a group, not a nested <svg>, which page CSS would resize)
  const pet = companion ? `<g transform="translate(${PET.x} ${PET.y}) scale(${PET.s})">${capybaraSVG(companion).replace(/^\s*<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</g>` : '';
  const label = companion ? `${companion.title || companion.name || 'Your companion'} in the ${sc.name.toLowerCase()}` : sc.name;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label.replace(/"/g, '&quot;')}" xmlns="http://www.w3.org/2000/svg">${sc.draw()}${pet ? (bob ? `<g class="bob">${pet}</g>` : pet) : ''}</svg>`;
}

/** The companion in its chosen scene (opts.scene), or on its own when there is none. */
export function companionEl(opts, className = 'capy') {
  if (!SCENE_BY_ID[opts?.scene]) return capybaraEl(opts, className);
  const bob = /\bbob\b/.test(className);
  const wrap = document.createElement('div');
  wrap.className = `${className.replace(/\bbob\b/, '').trim()} in-scene`;
  wrap.innerHTML = sceneSVG(opts.scene, opts, { bob });
  return wrap;
}
