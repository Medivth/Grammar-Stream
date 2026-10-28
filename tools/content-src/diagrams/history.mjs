// History diagrams: a stone castle and a motte and bailey castle, a Roman legionary, an Iron Age
// hill fort, a medieval village, a First World War trench (told gently), and two theatres for
// English: Shakespeare's Globe and an ancient Greek theatre. Part names follow the wording of the
// course questions. The shared helpers are copied here rather than imported from ../diagrams.mjs,
// which imports this file while it is still loading.

const r1 = (n) => Math.round(n * 10) / 10;
const pt = ([x, y]) => `${r1(x)},${r1(y)}`;
const ell = (cx, cy, rx, ry) => `M${r1(cx - rx)},${r1(cy)}a${rx},${ry} 0 1,0 ${r1(2 * rx)},0a${rx},${ry} 0 1,0 ${r1(-2 * rx)},0Z`;
// the same ellipse drawn the other way round: a hole in a nonzero shape
const ellRev = (cx, cy, rx, ry) => `M${r1(cx - rx)},${r1(cy)}a${rx},${ry} 0 1,1 ${r1(2 * rx)},0a${rx},${ry} 0 1,1 ${r1(-2 * rx)},0Z`;
const rect = (x, y, w, h, r = 0) => r
  ? `M${r1(x + r)},${r1(y)}H${r1(x + w - r)}Q${r1(x + w)},${r1(y)} ${r1(x + w)},${r1(y + r)}V${r1(y + h - r)}Q${r1(x + w)},${r1(y + h)} ${r1(x + w - r)},${r1(y + h)}H${r1(x + r)}Q${r1(x)},${r1(y + h)} ${r1(x)},${r1(y + h - r)}V${r1(y + r)}Q${r1(x)},${r1(y)} ${r1(x + r)},${r1(y)}Z`
  : `M${r1(x)},${r1(y)}H${r1(x + w)}V${r1(y + h)}H${r1(x)}Z`;
// a rectangle drawn the other way round: a hole in a nonzero shape (decor has no fill-rule)
const rectRev = (x, y, w, h) => `M${r1(x)},${r1(y)}V${r1(y + h)}H${r1(x + w)}V${r1(y)}Z`;
const many = (...ds) => ds.join('');
const poly = (pts) => `M${pts.map(pt).join('L')}Z`;
const range = (n) => Array.from({ length: n }, (_, i) => i);
const rad = (deg) => (deg * Math.PI) / 180;
// a thick straight line from a to b, as a filled shape
const bar = ([x1, y1], [x2, y2], w) => {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), nx = (-dy / len) * (w / 2), ny = (dx / len) * (w / 2);
  return poly([[x1 + nx, y1 + ny], [x2 + nx, y2 + ny], [x2 - nx, y2 - ny], [x1 - nx, y1 - ny]]);
};
// a thin band along a polyline (for wavy lines and arcs)
const band = (pts, w) => poly([...pts.map(([x, y]) => [x, y - w / 2]), ...pts.slice().reverse().map(([x, y]) => [x, y + w / 2])]);
// points along an ellipse, angles in degrees (0 = right, 90 = bottom)
const arcPts = (cx, cy, rx, ry, a0, a1, n = 24) => range(n + 1).map((i) => { const a = rad(a0 + ((a1 - a0) * i) / n); return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; });
// crenellations: merlons evenly spaced from x0 to x1, sitting on the wall top y
const merlons = (x0, x1, y, w = 11, h = 11) => {
  const n = Math.max(2, Math.round((x1 - x0 + 8) / (w + 8))), gap = (x1 - x0 - n * w) / (n - 1);
  return range(n).map((i) => rect(x0 + i * (w + gap), y - h, w, h)).join('');
};
// a gable-roofed little house, front on: walls w wide, h high, standing on y
const house = (x, y, w, h, roof = 10) => poly([[x, y], [x, y - h], [x - 3, y - h], [x + w / 2, y - h - roof], [x + w + 3, y - h], [x + w, y - h], [x + w, y]]);
// a pointed wooden stake standing on (x, y)
const stake = (x, y, h = 14, w = 5) => poly([[x - w / 2, y + 1], [x - w / 2, y - h + 3], [x, y - h], [x + w / 2, y - h + 3], [x + w / 2, y + 1]]);

// The frame drawn with labels: the drawing plus every label's estimated extent, with a label size
// that reads at about 13px when the frame is drawn ~350px wide.
function fit(d) {
  let S = 18, box;
  for (let i = 0; i < 8; i++) {
    let [x0, y0, w, h] = d.viewBox, x1 = x0 + w, y1 = y0 + h;
    for (const f of d.features) {
      const [lx, ly] = f.label, [ax] = f.at, tw = (f.short || f.name).length * 0.58 * S;
      const l = lx < ax - 4 ? lx - tw : lx > ax + 4 ? lx : lx - tw / 2;
      x0 = Math.min(x0, l - 6); x1 = Math.max(x1, l + tw + 6); y0 = Math.min(y0, ly - S * 0.75); y1 = Math.max(y1, ly + S * 0.75);
    }
    box = [x0, y0, x1 - x0, y1 - y0];
    S = Math.max(14, Math.min(26, 0.037 * box[2]));
  }
  return { ...d, labelViewBox: box.map(r1), labelSize: r1(S) };
}

// ---------------------------------------------------------------------------------------------
// A stone castle, front on, for Years 2–3.
function castle() {
  const arch = (x0, x1, yTop, yBot) => { const r = (x1 - x0) / 2; return `M${x0},${yBot}V${yTop}A${r},${r} 0 0,1 ${x1},${yTop}V${yBot}Z`; };
  const gate = arch(182, 218, 192, 236);
  // portcullis: an iron grid, half lowered, with spikes along the bottom
  const pcBottom = 216;
  const spikes = range(7).map((i) => [[218 - i * 6, pcBottom], [215 - i * 6, pcBottom + 6]]).flat();
  const pcOuter = `M182,${pcBottom}V192A18,18 0 0,1 218,192V${pcBottom}` + spikes.map((p) => `L${pt(p)}`).join('') + 'L182,' + pcBottom + 'Z';
  const holes = [];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 6; j++) {
    const x = 185 + i * 8.3, y = 177 + j * 6.6, w = 5.2, h = 3.8;
    const inside = [[x, y], [x + w, y]].every(([px, py]) => py > 192 || Math.hypot(px - 200, py - 192) < 16.5);
    if (inside && y + h < pcBottom - 1.5) holes.push(rect(x, y, w, h));
  }
  const slit = (x, y) => many(rect(x - 3, y, 6, 24, 1.5), rect(x - 7, y + 9, 14, 5, 1.5));
  return {
    id: 'castle', kind: 'diagram', viewBox: [0, -4, 400, 300], labelViewBox: [-96, -64, 592, 404], labelSize: 21,
    decor: [
      { d: rect(0, 230, 400, 66), fill: '#9fcf7c', under: true },
      { d: gate, fill: '#3a3036', under: true },
      // flag on the keep
      { d: many(rect(198.8, -2, 2.6, 30)), fill: '#5b4a3a' },
      { d: poly([[201.4, -1], [229, 6], [201.4, 13]]), fill: '#3f7fc4' },
      // drawbridge planks and chains
      { d: many(...[246, 256, 266, 276].map((y) => { const t = (y - 236) / 48; return rect(182 - 10 * t, y, 36 + 20 * t, 1.6); })), fill: '#6e4a2a' },
      { d: many(bar([176, 166], [175, 283], 2.2), bar([224, 166], [225, 283], 2.2)), fill: '#5a5560' },
      // ripples on the moat
      { d: many(rect(30, 258, 26, 2.2, 1), rect(90, 266, 22, 2.2, 1), rect(270, 260, 26, 2.2, 1), rect(338, 267, 22, 2.2, 1)), fill: '#d6ecfa' },
      // a few stones
      { d: many(rect(96, 150, 18, 8, 2), rect(132, 196, 18, 8, 2), rect(250, 140, 18, 8, 2), rect(290, 205, 18, 8, 2), rect(36, 210, 16, 8, 2), rect(350, 140, 16, 8, 2), rect(162, 60, 16, 8, 2), rect(222, 74, 16, 8, 2)), fill: 'rgba(90,70,50,0.16)' },
    ],
    features: [
      { id: 'keep', name: 'keep', d: rect(140, 40, 120, 100), fill: '#b9ae98', label: [276, -22], at: [252, 66] },
      { id: 'tower', name: 'tower', d: many(rect(28, 82, 56, 154), rect(316, 82, 56, 154)), fill: '#c6bba5', label: [-10, 120], at: [40, 140] },
      { id: 'wall', name: 'curtain wall', d: many(rect(84, 125, 84, 111), rect(232, 125, 84, 111)), fill: '#d6ccb7', label: [-10, 214], at: [106, 214] },
      { id: 'gatehouse', name: 'gatehouse', d: rect(160, 98, 80, 138) + gate, rule: 'evenodd', fill: '#cbc0aa', label: [410, 98], at: [234, 120] },
      { id: 'battlements', name: 'battlements', d: many(merlons(140, 260, 40), merlons(28, 84, 82), merlons(316, 372, 82), merlons(88, 158, 125), merlons(242, 312, 125), merlons(160, 240, 98)), fill: '#bdb19a', label: [70, -22], at: [64, 120] },
      { id: 'portcullis', name: 'portcullis', d: pcOuter + holes.join(''), rule: 'evenodd', fill: '#4b4650', label: [140, 318], at: [194, 206] },
      { id: 'slits', name: 'arrow slits', d: many(slit(56, 104), slit(56, 168), slit(344, 104), slit(344, 168), slit(126, 158), slit(274, 158), slit(172, 112), slit(228, 112), slit(200, 52)), fill: '#3b3438', label: [410, 160], at: [351, 180] },
      { id: 'moat', name: 'moat', d: 'M0,248Q25,243 50,248T100,248T150,248T200,248T250,248T300,248T350,248T400,248V277H0Z', fill: '#6aa6d6', label: [-10, 262], at: [20, 262] },
      { id: 'drawbridge', name: 'drawbridge', d: poly([[182, 236], [218, 236], [228, 284], [172, 284]]), fill: '#9a6a3f', label: [250, 318], at: [222, 270] },
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// A Norman motte and bailey castle, seen from above at an angle.
function motteBailey() {
  const bailey = [290, 190, 112, 48];
  const fence = [];
  for (let a = 0; a < 360; a += 7) {
    if (a > 150 && a < 212) continue; // where the bailey meets the motte's ditch
    if (a > 82 && a < 98) continue; // the gate
    const [x, y] = arcPts(bailey[0], bailey[1], bailey[2], bailey[3], a, a, 1)[0];
    fence.push(stake(x, y, 15, 5));
  }
  const top = [];
  for (let a = 0; a < 360; a += 20) {
    const [x, y] = arcPts(88, 92, 28, 7, a, a, 1)[0];
    if (Math.sin(rad(a)) < 0 && x > 66 && x < 110) continue; // hidden behind the keep
    top.push(stake(x, y, 10, 4));
  }
  const A = [114, 98], B = [186, 176];
  return {
    id: 'motte-bailey', kind: 'diagram', viewBox: [0, 0, 420, 262], labelViewBox: [-60, -40, 540, 332], labelSize: 19,
    decor: [
      { d: ell(212, 188, 212, 76), fill: '#d3e8b0', under: true },
      // buildings in the bailey: a hall, a stable and a hut
      { d: many(rect(262, 160, 56, 26), rect(206, 178, 34, 18), rect(334, 176, 28, 18)), fill: '#e8d7b3' },
      { d: many(poly([[256, 162], [290, 142], [324, 162]]), poly([[202, 180], [223, 166], [244, 180]]), poly([[330, 178], [348, 164], [366, 178]])), fill: '#9a6b45' },
      { d: many(rect(285, 172, 10, 14), rect(218, 184, 9, 12), rect(343, 184, 8, 10)), fill: '#5a4636' },
      // planks on the keep and the bridge's posts
      { d: many(rect(81, 52, 1.6, 40), rect(88, 52, 1.6, 40), rect(95, 52, 1.6, 40), rect(84, 60, 9, 10)), fill: 'rgba(60,40,20,0.45)' },
      { d: many(bar([140, 128], [140, 160], 3), bar([164, 152], [164, 182], 3)), fill: '#6b4a2c' },
      { d: many(rect(87, 0, 2.2, 18), poly([[89.2, 1], [106, 5], [89.2, 9]])), fill: '#3f7fc4' },
    ],
    features: [
      { id: 'ditch', name: 'ditch', d: many(ell(290, 190, 126, 58), ellRev(290, 190, 112, 48), ell(88, 180, 82, 38), ellRev(88, 180, 68, 28)), fill: '#6f8a4f', label: [-10, 230], at: [30, 206] },
      { id: 'bailey', name: 'bailey', d: ell(...bailey), fill: '#bcdd90', label: [430, 236], at: [330, 210] },
      { id: 'motte', name: 'motte', d: 'M20,182C40,178 52,140 64,94Q88,82 112,94C124,140 136,178 156,182Q88,212 20,182Z', fill: '#98bb60', label: [-10, 150], at: [50, 156] },
      { id: 'keep', name: 'keep', short: 'wooden keep', d: many(rect(74, 44, 28, 48), rect(68, 34, 40, 14), poly([[64, 36], [88, 14], [112, 36]])), fill: '#a8794c', label: [130, 20], at: [104, 40] },
      { id: 'palisade', name: 'palisade', d: many(...fence, ...top), fill: '#8b5e36', label: [430, 150], at: [398, 176] },
      { id: 'bridge', name: 'bridge', d: bar(A, B, 11), fill: '#b98a5a', label: [196, 110], at: [146, 132] },
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// A Roman legionary, standing, for Year 3.
function romanSoldier() {
  const skin = '#e8c29c';
  return {
    id: 'roman-soldier', kind: 'diagram', viewBox: [40, 0, 240, 416], labelViewBox: [-110, -10, 520, 430], labelSize: 20,
    decor: [
      { d: ell(160, 404, 76, 7), fill: 'rgba(0,0,0,0.12)', under: true },
      // legs, neck, face and the arm that holds the pilum
      { d: many(rect(128, 226, 18, 150, 6), rect(158, 226, 18, 150, 6), rect(143, 82, 18, 16), ell(152, 64, 19, 22), bar([118, 104], [100, 150], 17), bar([100, 150], [92, 168], 15)), fill: skin, under: true },
      // red tunic: sleeve and skirt
      { d: many(ell(116, 110, 13, 15), poly([[118, 184], [186, 184], [194, 232], [110, 232]])), fill: '#a5303f', under: true },
      // face
      { d: many(ell(145, 66, 2.4, 2.8), ell(159, 66, 2.4, 2.8)), fill: '#3b2a20' },
      { d: 'M145,76Q152,81 159,76Q152,79 145,76Z', fill: '#8a4a3a' },
      // crest on the helmet
      { d: 'M136,30Q152,4 168,30Q160,22 152,22Q144,22 136,30Z', fill: '#a5303f' },
      // armour hoops and shoulder plates
      { d: many(...[124, 138, 152, 166].map((y) => band([[116, y], [150, y + 4], [184, y]], 2.2)), band(arcPts(118, 112, 16, 14, 190, 350, 8), 2)), fill: '#6c7680' },
      // neck scarf
      { d: ell(152, 97, 16, 6), fill: '#efe6d4' },
      // belt with its hanging straps
      { d: many(rect(114, 182, 72, 8, 2), ...[132, 142, 152, 162].map((x) => rect(x, 190, 5, 36, 1.5))), fill: '#6a4a2e' },
      { d: many(...[132, 142, 152, 162].flatMap((x) => [ell(x + 2.5, 200, 2, 2), ell(x + 2.5, 212, 2, 2), ell(x + 2.5, 224, 2, 2)])), fill: '#e2c46a' },
      // the hand round the pilum
      { d: ell(91, 170, 9, 8), fill: skin },
      // shield decoration: rim, boss, wings and thunderbolts
      { d: many(rect(178, 122, 92, 182, 10) + rect(183, 127, 82, 172, 8)), rule: 'evenodd', fill: '#e2c46a' },
      { d: many(ell(224, 213, 15, 15), bar([224, 140], [224, 196], 4), bar([224, 230], [224, 286], 4), bar([192, 213], [207, 213], 4), bar([241, 213], [256, 213], 4), poly([[200, 170], [214, 196], [206, 196]]), poly([[248, 170], [234, 196], [242, 196]]), poly([[200, 256], [214, 230], [206, 230]]), poly([[248, 256], [234, 230], [242, 230]])), fill: '#e2c46a' },
      { d: many(rect(178, 122, 7, 182, 3), rect(263, 122, 7, 182, 3)), fill: 'rgba(0,0,0,0.18)' },
      // iron shank of the pilum and the gladius's brass fittings
      { d: many(rect(89.4, 20, 3.4, 118), poly([[87, 22], [91.1, 4], [95.2, 22]])), fill: '#8d949c' },
      { d: many(ell(117, 168, 6, 4.5), rect(108, 178, 18, 5, 2), rect(110, 214, 14, 3), rect(110, 238, 13, 3)), fill: '#e2c46a' },
      // sandal straps show the feet through them
      { d: many(...[132, 164].flatMap((x) => [rect(x, 378, 10, 4, 1.5), rect(x, 388, 10, 4, 1.5), rect(x + 1, 368, 8, 3, 1.5)])), fill: skin },
    ],
    features: [
      { id: 'pilum', name: 'pilum (throwing spear)', short: 'pilum (spear)', d: many(rect(87.6, 146, 7, 254, 2), poly([[86, 150], [96.6, 150], [94.5, 136], [88.1, 136]]), rect(89.4, 20, 3.4, 118), poly([[87, 22], [91.1, 4], [95.2, 22]])), fill: '#9c7444', label: [36, 26], at: [91, 40] },
      { id: 'armour', name: 'armour', d: 'M110,106Q150,88 192,106L186,188L116,188Z', fill: '#a7b1bb', label: [36, 150], at: [128, 150] },
      { id: 'helmet', name: 'helmet', d: 'M128,68C126,42 138,30 152,30C166,30 178,42 176,68L182,74L172,72L170,90L162,92L164,58Q152,52 140,58L142,92L134,90L132,72L122,74Z', fill: '#c3cbd3', label: [36, 84], at: [130, 60] },
      { id: 'gladius', name: 'gladius (short sword)', short: 'gladius (sword)', d: many(rect(110, 182, 14, 66, 3), poly([[110, 246], [124, 246], [117, 262]]), rect(113, 166, 8, 16, 2), ell(117, 166, 6, 4.5)), fill: '#7b5634', label: [36, 232], at: [114, 232] },
      { id: 'scutum', name: 'scutum (shield)', d: rect(178, 122, 92, 182, 10), fill: '#9b2a35', label: [292, 168], at: [262, 168] },
      { id: 'caligae', name: 'caligae (sandals)', d: many(...[129, 161].map((x) => `M${x + 2},364H${x + 14}L${x + 17},392Q${x + 26},396 ${x + 25},404H${x - 7}Q${x - 8},396 ${x + 1},392Z`)), fill: '#6e4a2c', label: [292, 392], at: [184, 398] },
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// Shakespeare's Globe, seen from above at an angle, with the stage at the far side of the yard.
function globe() {
  const cx = 210, cy = 150, H = 70; // roof level centred on cy; the ground is H lower on the page
  const RO = [180, 144], RH = [118, 94];
  const yGy = cy + H;
  // where the roof's inner edge meets the yard's far edge
  const yi = (cy + yGy) / 2, xi = RH[0] * Math.sqrt(1 - ((yGy - yi) / RH[1]) ** 2);
  const L = [cx - xi, yi], R = [cx + xi, yi];
  const upper = (ecy, x) => ecy - RH[1] * Math.sqrt(Math.max(0, 1 - ((x - cx) / RH[0]) ** 2));
  const galleries = `M${pt(L)}A${RH[0]},${RH[1]} 0 1,1 ${pt(R)}A${RH[0]},${RH[1]} 0 0,0 ${pt(L)}Z`;
  const yard = `M${pt(L)}A${RH[0]},${RH[1]} 0 0,0 ${pt(R)}A${RH[0]},${RH[1]} 0 0,0 ${pt(L)}Z`;
  const outerWall = `M${cx - RO[0]},${cy}A${RO[0]},${RO[1]} 0 0,0 ${cx + RO[0]},${cy}V${cy + H}A${RO[0]},${RO[1]} 0 0,1 ${cx - RO[0]},${cy + H}Z`;
  // tiers inside the galleries: floors as thin arcs between the yard's edge and the roof
  const tier = (d) => {
    const ecy = cy + d, yy = (ecy + yGy) / 2, xx = RH[0] * Math.sqrt(1 - ((yGy - yy) / RH[1]) ** 2);
    return band(range(25).map((i) => { const x = cx - xx + (2 * xx * i) / 24; return [x, upper(ecy, x)]; }), 2.4);
  };
  const posts = [];
  for (let x = cx - 104; x <= cx + 104; x += 16) posts.push(rect(x - 1.2, upper(cy, x) + 2, 2.4, upper(yGy, x) - upper(cy, x) - 2));
  // the tiring house: a flat front behind the stage, from the yard up to a gabled roof
  const t0 = 146, t1 = 274, tBase = 142;
  const tiring = poly([...range(9).map((i) => { const x = t0 + ((t1 - t0) * i) / 8; return [x, upper(cy, x)]; }).slice().reverse().map(([x, y]) => [x, y]).reverse(), [t1, tBase], [t0, tBase]]);
  const hut = poly([[t0 + 6, upper(cy, t0 + 6) + 1], [t0 + 22, 36], [t1 - 22, 36], [t1 - 6, upper(cy, t1 - 6) + 1], [cx, upper(cy, cx) + 1]]);
  // thatch: a ring with radial bundles
  const thatchLines = range(36).map((i) => { const a = rad(i * 10 + 5); return bar([cx + (RH[0] + 3) * Math.cos(a), cy + (RH[1] + 3) * Math.sin(a)], [cx + (RO[0] - 3) * Math.cos(a), cy + (RO[1] - 3) * Math.sin(a)], 1.4); });
  // timber framing on the outside wall
  const frame = [];
  for (let a = 8; a <= 172; a += 11) { const x = cx + RO[0] * Math.cos(rad(a)), y = cy + RO[1] * Math.sin(rad(a)); frame.push(rect(x - 1.3, y, 2.6, H)); }
  for (const d of [H / 3, (2 * H) / 3]) frame.push(band(arcPts(cx, cy + d, RO[0], RO[1], 2, 178, 30), 2.2));
  // stage: platform top, front face, and the heavens over the back half on two pillars
  const sx0 = 152, sx1 = 268, sBack = 131, sFront = 204;
  const heavens = poly([[sx0 - 4, 112], [sx0 + 8, 88], [sx1 - 8, 88], [sx1 + 4, 112]]);
  const crowd = [];
  const spots = [[118, 168], [128, 186], [114, 204], [134, 206], [140, 222], [126, 226], [282, 168], [292, 186], [306, 204], [286, 206], [280, 222], [296, 226], [158, 224], [172, 232], [190, 226], [206, 234], [222, 226], [238, 232], [254, 224], [166, 242], [250, 242], [210, 244], [146, 238], [272, 238], [120, 222], [302, 222]];
  for (const [x, y] of spots) crowd.push(ell(x, y - 6, 3.6, 3.6), ell(x, y + 2, 5, 5.5));
  return {
    id: 'globe-theatre', kind: 'diagram', viewBox: [20, 0, 380, 368], labelViewBox: [-70, -30, 560, 440], labelSize: 20,
    decor: [
      { d: outerWall, fill: '#f2e8d4', under: true },
      { d: frame.join(''), fill: '#5d4632', under: true },
      { d: thatchLines.join(''), fill: 'rgba(120,90,30,0.45)' },
      // gallery floors and posts, and heads in the galleries
      { d: many(tier(22), tier(44), ...posts), fill: '#8a6a48' },
      { d: many(...[-80, -56, -32, 32, 56, 80].flatMap((dx) => [ell(cx + dx, upper(cy + 22, cx + dx) - 4, 3, 3), ell(cx + dx + 8, upper(cy + 44, cx + dx + 8) - 4, 3, 3)])), fill: '#6a5a7a' },
      // tiring-house doors and windows, above the heavens
      { d: many(rect(172, 74, 10, 10, 2), rect(196, 70, 10, 10, 2), rect(220, 70, 10, 10, 2), rect(244, 74, 10, 10, 2)), fill: '#5d4632' },
      // stage front, pillars holding up the heavens, and the heavens' painted stars
      { d: rect(sx0, sFront - 10, sx1 - sx0, 10), fill: '#8a6440' },
      { d: many(rect(sx0 + 12, 112, 5, 66), rect(sx1 - 17, 112, 5, 66)), fill: '#c9a24a' },
      { d: many(...[[176, 100], [196, 94], [214, 104], [232, 96], [250, 102], [186, 108], [222, 92]].map(([x, y]) => poly([[x, y - 3.2], [x + 1, y - 1], [x + 3.2, y], [x + 1, y + 1], [x, y + 3.2], [x - 1, y + 1], [x - 3.2, y], [x - 1, y - 1]]))), fill: '#f2d36b' },
      // the flag flying from the hut
      { d: many(rect(209, 8, 2.4, 30), poly([[211.4, 9], [234, 15], [211.4, 21]])), fill: '#3f7fc4' },
    ],
    features: [
      { id: 'roof', name: 'thatched roof', d: ell(cx, cy, ...RO) + ell(cx, cy, ...RH), rule: 'evenodd', fill: '#d2b166', label: [10, 8], at: [62, 70] },
      { id: 'galleries', name: 'galleries', d: galleries, fill: '#ebdcbc', label: [10, 150], at: [112, 140] },
      { id: 'yard', name: 'yard', d: yard, fill: '#c9b38a', label: [10, 268], at: [104, 212] },
      { id: 'tiring', name: 'tiring house', d: tiring + hut, fill: '#c2a57a', label: [410, 26], at: [258, 50] },
      { id: 'stage', name: 'stage', d: rect(sx0, sBack, sx1 - sx0, sFront - sBack - 10), fill: '#d6b07a', label: [410, 168], at: [260, 166] },
      { id: 'heavens', name: 'the heavens', d: heavens, fill: '#3f5f9e', label: [410, 92], at: [262, 102] },
      { id: 'groundlings', name: 'groundlings', d: crowd.join(''), fill: '#5c6d99', label: [410, 268], at: [300, 226] },
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// An ancient Greek theatre, seen from above and behind the seats, looking towards the skene.
function greekTheatre() {
  const cx = 210, cy = 112, k = 0.6, r0 = 72, r1x = 188, a0 = -14, a1 = 194;
  const at = (r, a) => [cx + r * Math.cos(rad(a)), cy + r * k * Math.sin(rad(a))];
  const arc = (r, b0, b1, n = 40) => range(n + 1).map((i) => at(r, b0 + ((b1 - b0) * i) / n));
  const theatron = poly([...arc(r1x, a0, a1), ...arc(r0, a1, a0)]);
  const rows = [];
  for (let r = r0 + 10; r < r1x - 4; r += 10) rows.push(poly([...arc(r, a0, a1), ...arc(r + (r === r0 + 60 ? 4.5 : 1.8), a1, a0)]));
  const aisles = [];
  for (const a of [10, 40, 70, 90, 110, 140, 170]) aisles.push(poly([at(r0, a - 1.2), at(r1x, a - 0.8), at(r1x, a + 0.8), at(r0, a + 1.2)]));
  const L0 = at(r0, a1), L1 = at(r1x, a1), R0 = at(r0, a0), R1 = at(r1x, a0);
  const parodos = many(poly([L1, L0, [L0[0] + 4, L0[1] - 22], [L1[0], L1[1] - 24]]), poly([R1, R0, [R0[0] - 4, R0[1] - 22], [R1[0], R1[1] - 24]]));
  const chorus = [];
  for (const [x, y] of [[186, 118], [198, 128], [212, 132], [226, 126], [236, 116], [194, 108], [228, 104]]) chorus.push(ell(x, y - 7, 2.6, 2.6), poly([[x - 3.6, y + 3], [x - 2.2, y - 4], [x + 2.2, y - 4], [x + 3.6, y + 3]]));
  return {
    id: 'greek-theatre', kind: 'diagram', viewBox: [12, 14, 396, 232], labelViewBox: [-40, -26, 500, 310], labelSize: 18,
    decor: [
      { d: ell(cx, 132, 206, 118), fill: '#d3e6b1', under: true },
      { d: many(...rows), fill: '#b3a283' },
      { d: many(...aisles), fill: '#9c8b6c' },
      // skene roof, doors and the altar in the middle of the orchestra
      { d: rect(124, 30, 172, 10), fill: '#8f7552' },
      { d: many(rect(150, 56, 14, 22, 3), rect(200, 52, 20, 26, 3), rect(256, 56, 14, 22, 3)), fill: '#5a4636' },
      { d: many(rect(205, 114, 10, 6, 1)), fill: '#9c8b6c' },
      { d: many(...chorus), fill: '#7a4f86' },
      // cypress trees
      { d: many(ell(56, 52, 9, 24), ell(372, 48, 9, 26), ell(34, 70, 7, 18)), fill: '#4f8a4a' },
    ],
    features: [
      { id: 'theatron', name: 'theatron', short: 'theatron (seating)', d: theatron, fill: '#e4d9c3', label: [300, 270], at: [264, 222] },
      { id: 'orchestra', name: 'orchestra', d: ell(cx, cy, 60, 36), fill: '#ead6a8', label: [410, 108], at: [266, 116] },
      { id: 'skene', name: 'skene', short: 'skene (stage building)', d: rect(124, 36, 172, 46), fill: '#cdb48c', label: [310, 0], at: [284, 44] },
      { id: 'parodos', name: 'parodos', short: 'parodos (entrance)', d: parodos, fill: '#efe2c4', label: [10, 50], at: [60, 86] },
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// A medieval village and its fields, as a plan with little pictures of the buildings.
function village() {
  const strips = (x0, y0, w, h, step, vertical) => range(Math.floor((vertical ? w : h) / step) - 1).map((i) => vertical ? rect(x0 + (i + 1) * step - 0.8, y0 + 3, 1.6, h - 6) : rect(x0 + 3, y0 + (i + 1) * step - 0.8, w - 6, 1.6)).join('');
  const sheep = (x, y) => many(ell(x, y, 6, 4.2));
  const cottages = [[112, 160], [146, 160], [180, 160], [124, 198], [160, 198], [232, 198]];
  return {
    id: 'village', kind: 'diagram', viewBox: [0, 0, 420, 320], labelViewBox: [-70, -40, 560, 400], labelSize: 20,
    decor: [
      { d: rect(0, 0, 362, 320), fill: '#dcebc0', under: true },
      // the river and the lanes
      { d: 'M368,0C384,40 360,80 376,120S392,200 372,240S380,300 374,320H400C406,300 398,260 402,240S414,160 400,120S396,40 392,0Z', fill: '#7fb6e0', under: true },
      { d: many(rect(0, 168, 372, 10, 3), rect(197, 0, 10, 172), rect(197, 176, 10, 144)), fill: '#e2cfa6', under: true },
      // strips in the open fields, weeds in the fallow field
      { d: many(strips(8, 8, 186, 106, 14, true), strips(8, 212, 186, 100, 12.5, false)), fill: '#b19a4a' },
      { d: many(...[[222, 230], [250, 250], [282, 228], [316, 252], [236, 286], [270, 292], [330, 288], [300, 270]].map(([x, y]) => many(ell(x, y, 5, 3), ell(x + 7, y + 2, 4, 2.5)))), fill: '#93a85e' },
      // sheep and trees on the common land
      { d: many(sheep(232, 70), sheep(262, 54), sheep(298, 80), sheep(318, 46), sheep(244, 96)), fill: '#fbfaf5' },
      { d: many(ell(226, 69, 2.6, 2.6), ell(256, 53, 2.6, 2.6), ell(292, 79, 2.6, 2.6), ell(312, 45, 2.6, 2.6), ell(238, 95, 2.6, 2.6)), fill: '#3b3530' },
      { d: many(ell(222, 24, 12, 11), ell(340, 30, 12, 11), ell(336, 96, 10, 9)), fill: '#5c9a4c' },
      // church tower's cross, windows and doors
      { d: many(rect(36, 104, 2.4, 12), rect(32.2, 107, 10, 2.4)), fill: '#5a5a5a' },
      { d: many(rect(34, 128, 6, 9, 2), rect(56, 145, 6, 9, 2), rect(72, 145, 6, 9, 2), rect(283, 136, 8, 8), rect(305, 136, 8, 8), rect(294, 148, 9, 14)), fill: '#4f4038' },
      { d: many(...cottages.map(([x, y]) => rect(x - 2.5, y - 8, 5, 8))), fill: '#4f4038' },
      // the mill's water wheel spokes
      { d: many(bar([374, 189], [374, 215], 2), bar([361, 202], [387, 202], 2)), fill: '#5a4636' },
    ],
    features: [
      { id: 'fields', name: 'open fields', d: many(rect(8, 8, 186, 106, 4), rect(8, 212, 186, 100, 4)), fill: '#e6d38a', label: [70, -18], at: [60, 40] },
      { id: 'common', name: 'common land', d: rect(212, 8, 150, 106, 4), fill: '#a3d184', label: [236, -18], at: [270, 30] },
      { id: 'fallow', name: 'fallow field', d: rect(212, 212, 150, 100, 4), fill: '#c9bc93', label: [300, 344], at: [290, 300] },
      { id: 'church', name: 'church', d: many(rect(28, 116, 18, 46), poly([[26, 118], [37, 104], [48, 118]]), house(46, 162, 46, 22, 12)), fill: '#c8c3bc', label: [-10, 140], at: [30, 140] },
      { id: 'manor', name: 'manor house', d: many(house(272, 164, 52, 34, 16), rect(312, 118, 7, 16)), fill: '#dcc394', label: [212, -18], at: [300, 126] },
      { id: 'houses', name: 'villeins’ houses', d: many(...cottages.map(([x, y]) => house(x - 11, y, 22, 14, 9))), fill: '#d3b064', label: [150, 344], at: [196, 196] },
      { id: 'mill', name: 'mill', d: many(house(330, 212, 28, 22, 10), ell(374, 202, 15, 15)), fill: '#b08d62', label: [420, 200], at: [386, 196] },
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// An Iron Age hill fort, seen from above at an angle.
function hillFort() {
  const cx = 210, E = [[120, 46, 120], [138, 54, 128], [156, 62, 136], [178, 72, 146], [198, 82, 156]]; // rx, ry, cy
  const e = (i) => ell(cx, E[i][2], E[i][0], E[i][1]);
  const fence = [];
  for (let a = 0; a < 360; a += 6) {
    if (a > 80 && a < 100) continue; // the gateway
    const [x, y] = arcPts(cx, 124, 129, 50, a, a, 1)[0];
    fence.push(stake(x, y, 13, 4.6));
  }
  const rh = (x, y, s = 1) => many(rect(x - 14 * s, y - 12 * s, 28 * s, 12 * s), ell(x, y, 14 * s, 4 * s), poly([[x - 17 * s, y - 10 * s], [x, y - 34 * s], [x + 17 * s, y - 10 * s]]));
  const houses = [[150, 108, 1], [196, 96, 0.95], [246, 104, 1], [180, 134, 1.05], [232, 140, 1.05], [278, 128, 0.95]];
  return {
    id: 'hill-fort', kind: 'diagram', viewBox: [0, 30, 420, 238], labelViewBox: [-60, -6, 540, 300], labelSize: 19,
    decor: [
      { d: 'M0,250C40,206 70,150 210,140C350,150 380,206 420,250V268H0Z', fill: '#9cc873', under: true },
      { d: ell(cx, 156, 198, 82), fill: '#9cc873', under: true },
      { d: e(0), fill: '#c3df98', under: true },
      // doors and walls of the roundhouses, and smoke from one roof
      { d: many(...houses.map(([x, y, s]) => rect(x - 4 * s, y - 10 * s, 8 * s, 10 * s, 2))), fill: '#4f3b2c' },
      { d: 'M199,58C193,52 205,48 199,42C194,37 203,33 200,28C206,33 199,37 204,42C210,48 198,52 203,58Z', fill: 'rgba(160,160,170,0.7)' },
      // gate posts and lintel across the gateway
      { d: many(rect(196, 152, 4, 22), rect(220, 152, 4, 22), rect(194, 150, 32, 4)), fill: '#6b4a2c' },
      // sheep grazing inside
      { d: many(ell(130, 140, 5, 3.6), ell(292, 150, 5, 3.6)), fill: '#fbfaf5' },
    ],
    features: [
      { id: 'ditches', name: 'ditches', d: many(e(1), e(2), e(3), e(4)), rule: 'evenodd', fill: '#6f9a4f', label: [430, 222], at: [372, 200] },
      { id: 'ramparts', name: 'ramparts', short: 'ramparts (banks)', d: many(e(0), e(1), e(2), e(3)), rule: 'evenodd', fill: '#c9e3a0', label: [-10, 186], at: [50, 186] },
      { id: 'gateway', name: 'gateway', d: poly([[198, 168], [222, 168], [228, 242], [192, 242]]), fill: '#d8c08f', label: [250, 290], at: [214, 230] },
      { id: 'palisade', name: 'palisade', short: 'palisade (fence)', d: fence.join(''), fill: '#8b5e36', label: [-10, 96], at: [96, 104] },
      { id: 'roundhouses', name: 'roundhouses', d: many(...houses.map(([x, y, s]) => rh(x, y, s))), fill: '#c9a65a', label: [300, 40], at: [256, 82] },
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// A First World War trench in cross-section: the home side on the left, no man's land on the right.
function trench() {
  const soil = '#a07f58', G = 100; // ground level
  const bag = (x, y, w = 22) => rect(x, y, w, 11, 5);
  const bags = [bag(250, 89), bag(273, 89), bag(296, 89), bag(260, 78), bag(283, 78), bag(272, 67, 22), bag(104, 89), bag(127, 89), bag(115, 78)];
  const coil = (x, y) => many(ell(x, y, 11, 13), ellRev(x, y, 8.6, 10.6));
  return {
    id: 'trench', kind: 'diagram', viewBox: [0, 30, 440, 210], labelViewBox: [-60, -10, 560, 290], labelSize: 19,
    decor: [
      // the soil, cut through; the far wall of the trench is darker
      { d: rect(0, G, 440, 140), fill: soil, under: true },
      { d: poly([[150, G], [240, G], [240, 228], [150, 228]]), fill: '#6e5239', under: true },
      // home ground with grass and poppies
      { d: rect(0, G - 4, 104, 6, 2), fill: '#7fae58', under: true },
      // wooden planks lining the trench wall
      { d: many(...range(6).map((i) => rect(152, 108 + i * 18, 86, 2.2))), fill: '#4f3a28' },
      // water under the duckboards
      { d: rect(150, 216, 90, 12), fill: '#6f8ea0' },
      // a soldier on the fire step, looking over the parapet
      { d: many(ell(222, 76, 6.4, 7.4), rect(214, 82, 16, 34, 4), rect(214, 112, 7, 42, 3), rect(223, 112, 7, 42, 3), bar([226, 90], [244, 84], 6)), fill: '#7c7a52' },
      { d: ell(222, 75, 6, 6.6), fill: '#e3bf98' },
      { d: many(ell(222, 70, 12, 3), 'M212,70Q222,58 232,70Z'), fill: '#5e6a4c' },
      // the dugout's props, bunk and lantern
      { d: many(rect(62, 160, 6, 46), rect(130, 160, 6, 46), rect(60, 156, 78, 6), rect(70, 186, 40, 5)), fill: '#8a6a44' },
      { d: many(ell(100, 172, 4, 5), rect(98.6, 162, 2.8, 6)), fill: '#f2d36b' },
      // poppies
      { d: many(ell(30, 94, 3.4, 3.4), ell(58, 93, 3.4, 3.4), ell(84, 95, 3.4, 3.4)), fill: '#c7322f' },
      // posts holding up the wire
      { d: many(rect(358, 70, 4, 34), rect(394, 70, 4, 34), rect(430, 74, 4, 30)), fill: '#5a4636' },
      // a shell hole in no man's land
    ],
    features: [
      { id: 'nomansland', name: 'no man’s land', d: 'M300,100H330Q350,96 360,100Q372,118 390,116Q404,114 410,100H440V112H410Q404,126 390,128Q370,130 356,112H300Z', fill: '#8a7356', label: [440, 140], at: [424, 106] },
      { id: 'parapet', name: 'parapet', d: poly([[240, G], [240, 92], [250, 86], [320, 86], [334, G]]), fill: '#7d6043', label: [330, 44], at: [318, 92] },
      { id: 'sandbags', name: 'sandbags', d: many(...bags), fill: '#dcc79c', label: [150, 44], at: [270, 72] },
      { id: 'firestep', name: 'fire step', d: rect(206, 154, 34, 74), fill: '#a8865a', label: [300, 160], at: [236, 168] },
      { id: 'duckboards', name: 'duckboards', d: many(rect(150, 210, 56, 8), ...range(5).map((i) => rect(153 + i * 11, 218, 4, 8))), fill: '#c39b62', label: [130, 262], at: [176, 214] },
      { id: 'dugout', name: 'dugout', d: rect(56, 150, 94, 58, 6), fill: '#4b3826', label: [-10, 200], at: [70, 200] },
      { id: 'wire', name: 'barbed wire', d: many(coil(350, 84), coil(366, 86), coil(382, 84), coil(398, 86), coil(414, 84), coil(430, 86), rect(344, 82, 96, 2.4)), rule: 'nonzero', fill: '#5f6470', label: [430, 44], at: [398, 74] },
    ],
  };
}

export default [castle(), motteBailey(), romanSoldier(), globe(), greekTheatre(), village(), hillFort(), trench()];
