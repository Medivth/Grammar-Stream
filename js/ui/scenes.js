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
];
export const SCENE_BY_ID = Object.fromEntries(SCENES.map((s) => [s.id, s]));

// Unlocking: the first FREE scenes are open from the start, then one more for every PER_SCENE
// badges. Every course has 14–18 badges, so the last scene needs 9 of them: a few months' work.
export const FREE = 3, PER_SCENE = 1;
const ORDER = {
  young: ['space', 'racetrack', 'underwater', 'dino', 'city', 'castle', 'rocket', 'volcano', 'jungle', 'arctic', 'library', 'temple'],
  y8: ['space', 'underwater', 'temple', 'library', 'castle', 'arctic', 'jungle', 'volcano', 'rocket', 'city', 'dino', 'racetrack'],
  y6: ['space', 'underwater', 'library', 'castle', 'jungle', 'temple', 'arctic', 'volcano', 'rocket', 'city', 'dino', 'racetrack'],
};
/** The order this course's scenes unlock in: what this child likes most comes first. */
export const sceneOrder = (course = COURSE) => ORDER[course.young ? 'young' : course.id] || ORDER.y6;

/** Each scene in unlock order, with whether it is open and how many more badges it needs. */
export function sceneStatus(earned, order = sceneOrder()) {
  return order.map((id, i) => {
    const goal = Math.max(0, i - FREE + 1) * PER_SCENE;
    return { id, name: SCENE_BY_ID[id].name, open: earned >= goal, need: Math.max(0, goal - earned) };
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
