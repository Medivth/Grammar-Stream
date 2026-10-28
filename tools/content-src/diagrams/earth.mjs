// Earth and landscape diagrams for geography and science: rivers, volcanoes, the Earth's layers,
// coasts, glaciers, the water cycle, plate boundaries and drainage basins. Part names follow the
// courses' wording (geography-y7, stretch-geography, y8/geography, y3/science, ks1).

// ------------------------------------------------------------------ small drawing helpers
// ell, rect and many are copies of the helpers in ../diagrams.mjs, which imports this file while it
// is still loading (importing them from there would deadlock).
const ell = (cx, cy, rx, ry) => `M${cx - rx},${cy}a${rx},${ry} 0 1,0 ${2 * rx},0a${rx},${ry} 0 1,0 ${-2 * rx},0Z`;
const rect = (x, y, w, h, r = 0) => r
  ? `M${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x + r}Q${x},${y + h} ${x},${y + h - r}V${y + r}Q${x},${y} ${x + r},${y}Z`
  : `M${x},${y}H${x + w}V${y + h}H${x}Z`;
const many = (...ds) => ds.join('');
const n1 = (v) => Math.round(v * 10) / 10;
const pt = ([x, y]) => `${n1(x)},${n1(y)}`;
const poly = (pts) => `M${pts.map(pt).join('L')}Z`;
// smooth curve through points (Catmull-Rom as cubic Béziers): the commands after the first point
function bez(pts, closed = false) {
  const n = pts.length, out = [];
  const P = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    out.push(`C${pt([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6])} ${pt([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6])} ${pt(p2)}`);
  }
  return out.join('');
}
const blob = (pts) => `M${pt(pts[0])}${bez(pts, true)}Z`;
// the two edges of a band of width w (a number, [from, to], or a function of 0..1) along a centre line
function edges(c, w) {
  const n = c.length, L = [], R = [];
  const wf = typeof w === 'function' ? w : Array.isArray(w) ? (t) => w[0] + (w[1] - w[0]) * t : () => w;
  c.forEach((p, i) => {
    const a = c[Math.max(0, i - 1)], b = c[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1, h = wf(i / (n - 1)) / 2;
    dx /= len; dy /= len;
    L.push([p[0] - dy * h, p[1] + dx * h]); R.push([p[0] + dy * h, p[1] - dx * h]);
  });
  return [L, R];
}
// a river, ridge or arrow shaft: a smooth band along a centre line
function band(c, w) {
  const [L, R] = edges(c, w);
  R.reverse();
  return `M${pt(L[0])}${bez(L)}L${pt(R[0])}${bez(R)}Z`;
}
// a smooth arrow along a centre line that ends at the base of its head; tip is the point
function arrow(c, w, tip, hw) {
  const [L, R] = edges(c, w);
  const b = c[c.length - 1];
  let dx = tip[0] - b[0], dy = tip[1] - b[1];
  const len = Math.hypot(dx, dy); dx /= len; dy /= len;
  R.reverse();
  return `M${pt(L[0])}${bez(L)}L${pt([b[0] - dy * hw, b[1] + dx * hw])}L${pt(tip)}L${pt([b[0] + dy * hw, b[1] - dx * hw])}L${pt(R[0])}${bez(R)}Z`;
}
// points on an arc (degrees, 0 = east, clockwise on screen)
const arc = (cx, cy, r, a0, a1, n = 8) => Array.from({ length: n + 1 }, (_, i) => {
  const a = ((a0 + (a1 - a0) * i / n) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
});
// a puffy cloud: bumps along the top, a soft curve underneath
function cloud(x, y, w, h) {
  const p = [[0, 0.78], [0.1, 0.4], [0.33, 0.12], [0.62, 0.1], [0.86, 0.36], [1, 0.78]].map(([a, b]) => [x + a * w, y + b * h]);
  let d = `M${pt(p[0])}`;
  for (let i = 1; i < p.length; i++) {
    const r = n1(Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]) * 0.6);
    d += `A${r},${r} 0 0 1 ${pt(p[i])}`;
  }
  return `${d}Q${pt([x + w / 2, y + h * 1.12])} ${pt(p[0])}Z`;
}
// labelSize that reads at about 14px when the labelled frame is ~360px wide
const fit = (w) => Math.round((14 * w) / 360);

// ------------------------------------------------------------------ shared colours
const WATER = '#5aa3d8', SEA = '#4a8cc7', DEEP = '#3a74ad', FOAM = '#e4f3fc';
const LAND = '#d4e7ad', GRASS = '#9cc47a', HILL = '#93ba6f', HILL_DARK = '#7ea65c';
const ROCK = '#a99d8e', ROCK_DARK = '#8a7f72', SNOW = '#f3f6f9', SAND = '#ecd9a0';
const CLIFF = '#e2d6ba', CLIFF_SIDE = '#c9b791', CAVE = '#4a4038', SOIL = '#a8875f';
const MAGMA = '#c62f2c', LAVA = '#e0452c', MANTLE = '#b9555f', CLEAR = 'rgba(255,255,255,0)';

// ================================================================== 1. a river from source to mouth
function river() {
  const W = 300, H = 440;
  const hills = 'M0,206L0,66L30,46L55,28L82,46L112,20L142,40L168,26L200,48L232,28L258,42L282,24L300,38L300,180Q240,166 180,188Q120,210 60,210Q25,210 0,206Z';
  const snow = many(...[[55, 28], [112, 20], [168, 26], [232, 28], [282, 24]].map(([x, y]) => `M${x},${y}L${x - 9},${y + 8}L${x - 4},${y + 9}L${x},${y + 6}L${x + 5},${y + 10}L${x + 9},${y + 7}Z`));
  const stream1 = band([[63, 78], [69, 92], [77, 104], [85, 114]], [4, 6]);
  const stream2 = band([[87, 142], [90, 160], [94, 180], [99, 197], [110, 208], [124, 216], [136, 220]], [6, 9]);
  const riverA = band([[146, 228], [158, 240], [174, 248], [192, 252]], [11, 12]);
  const riverB = band([[188, 311], [168, 316], [153, 331], [154, 349], [170, 362], [196, 370], [218, 374]], [12, 13]);
  const oxbow = arc(234, 338, 22, -115, 115, 8);
  return {
    id: 'river', kind: 'diagram', viewBox: [0, 0, W, H], labelViewBox: [0, 0, 472, H], labelSize: fit(472),
    decor: [
      { d: rect(0, 0, W, H, 12), fill: '#dceffb', under: true },
      { d: 'M0,150H300V428Q300,440 288,440H12Q0,440 0,428Z', fill: LAND, under: true },
      { d: hills, fill: HILL, under: true },
      { d: 'M0,206L0,120L40,140L70,128L96,150L124,136L150,160L190,150L230,158L270,150L300,160L300,180Q240,166 180,188Q120,210 60,210Q25,210 0,206Z', fill: HILL_DARK, under: true },
      { d: snow, fill: SNOW, under: true },
      { d: poly([[60, 110], [108, 107], [110, 124], [58, 126]]), fill: ROCK_DARK, under: true },
      { d: poly([[60, 140], [97, 138], [98, 200]]), fill: '#82ac5e', under: true },
      { d: poly([[97, 138], [124, 136], [98, 200]]), fill: '#5f8a42', under: true },
      // streams, river and splashes drawn over the parts
      { d: many(stream1, stream2, riverA, riverB), fill: WATER },
      { d: ell(87, 142, 11, 4), fill: WATER },
      { d: many(rect(83, 116, 2, 22), rect(89, 117, 2, 22)), fill: '#9fd0ee' },
      { d: ell(236, 58, 7, 5), fill: WATER },
    ],
    features: [
      { id: 'floodplain', name: 'floodplain', d: blob([[110, 238], [180, 232], [250, 240], [286, 266], [292, 330], [294, 398], [220, 412], [130, 416], [50, 412], [44, 344], [66, 280]]), fill: '#e8eeb6', label: [312, 292], at: [274, 296] },
      { id: 'sea', name: 'sea', d: 'M0,416C40,406 90,424 140,416S230,404 262,404S290,398 300,394V428Q300,440 288,440H12Q0,440 0,428Z', fill: SEA, label: [312, 430], at: [190, 428] },
      { id: 'valley', name: 'V-shaped valley', d: poly([[60, 140], [124, 136], [98, 200]]), fill: CLEAR, label: [312, 178], at: [108, 168] },
      { id: 'waterfall', name: 'waterfall', d: poly([[79, 111], [94, 111], [98, 142], [76, 142]]), fill: FOAM, label: [312, 140], at: [94, 128] },
      { id: 'source', name: 'source', d: ell(62, 74, 11, 7), fill: WATER, label: [312, 66], at: [66, 72] },
      { id: 'tributary', name: 'tributary', d: band([[236, 60], [231, 80], [223, 103], [211, 126], [197, 149], [181, 171], [163, 192], [148, 208], [139, 217]], [6, 9]), fill: WATER, label: [312, 104], at: [221, 108] },
      { id: 'confluence', name: 'confluence', d: ell(140, 222, 13, 11), fill: WATER, label: [312, 216], at: [142, 220] },
      { id: 'meander', name: 'meander', d: band([[188, 251], [212, 254], [234, 266], [243, 285], [233, 303], [211, 311], [186, 312]], 12), fill: WATER, label: [312, 254], at: [242, 284] },
      { id: 'oxbow', name: 'ox-bow lake', d: band(oxbow, (t) => 5 + 5 * Math.sin(Math.PI * t)), fill: WATER, label: [312, 334], at: [254, 336] },
      { id: 'estuary', name: 'estuary', d: band([[214, 373], [232, 379], [248, 387], [260, 397]], [12, 30]), fill: WATER, label: [312, 370], at: [242, 383] },
      { id: 'mouth', name: 'mouth', d: band([[258, 395], [270, 408]], [30, 36]), fill: WATER, label: [312, 402], at: [270, 405] },
    ],
  };
}

// ================================================================== 2. a volcano in cross-section
function volcano() {
  // the cone: concave flanks rising to a crater; nested copies make the layers of ash and lava
  const P = { l0: [40, 270], lc: [148, 256], l1: [174, 104], r0: [226, 104], rc: [252, 256], r1: [360, 270] };
  const coneAt = (s) => {
    const T = ([x, y]) => [200 + (x - 200) * s, 300 + (y - 300) * s];
    return `M${pt(T(P.l0))}Q${pt(T(P.lc))} ${pt(T(P.l1))}Q${pt(T([200, 156]))} ${pt(T(P.r0))}Q${pt(T(P.rc))} ${pt(T(P.r1))}Z`;
  };
  const q = (a, c, b, t) => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];
  // a lava flow lying on a flank, from t0 to t1 along it, nudged outwards
  const flow = (a, c, b, t0, t1, out, w) => {
    const pts = Array.from({ length: 7 }, (_, i) => q(a, c, b, t0 + (t1 - t0) * i / 6)).map(([x, y]) => [x + out[0], y + out[1]]);
    return band(pts, w);
  };
  const layers = [1, 0.86, 0.72, 0.58, 0.44].map((s, i) => ({ d: coneAt(s), fill: i % 2 ? '#c4b093' : '#8d7059', under: true }));
  return {
    id: 'volcano', kind: 'diagram', viewBox: [0, 0, 400, 380], labelViewBox: [-12, 0, 524, 412], labelSize: fit(524),
    decor: [
      ...layers,
      { d: rect(0, 268, 400, 112), fill: '#b59874', under: true },
      { d: many(rect(0, 300, 400, 6), rect(0, 352, 400, 6)), fill: '#9f8160', under: true },
      { d: many(rect(0, 264, 42, 6), rect(358, 264, 42, 6)), fill: GRASS, under: true },
      // glowing bits in the magma and bombs in the ash
      { d: many(ell(170, 328, 10, 4), ell(232, 338, 12, 4), ell(198, 346, 8, 3)), fill: '#f2a03a' },
      { d: many(ell(150, 44, 3, 3), ell(190, 30, 3, 3), ell(236, 40, 3, 3), ell(262, 56, 3, 3), ell(170, 60, 2.5, 2.5), ell(214, 56, 2.5, 2.5)), fill: '#5b5860' },
    ],
    features: [
      { id: 'layers', name: 'layers of ash and lava', d: coneAt(1), fill: CLEAR, label: [262, 120], at: [256, 190] },
      { id: 'vent', name: 'main vent', d: 'M193,312L192,250L194,180L195,126L205,126L206,180L208,250L207,312Z', fill: MAGMA, label: [100, 160], at: [196, 168] },
      { id: 'side-vent', name: 'side vent', d: band([[205, 238], [226, 226], [244, 214], [259, 204.5]], 10), fill: MAGMA, label: [276, 168], at: [240, 217] },
      { id: 'chamber', name: 'magma chamber', d: ell(200, 332, 96, 30), fill: MAGMA, label: [200, 398], at: [200, 352] },
      { id: 'crater', name: 'crater', d: 'M174,104Q200,156 226,104Z', fill: '#5d4a3c', label: [150, 92], at: [192, 116] },
      { id: 'lava', name: 'lava', d: many(flow(P.l1, P.lc, P.l0, 0.02, 0.5, [-2, -1], [8, 5]), flow(P.r0, P.rc, P.r1, 0.42, 0.78, [2, -1], [8, 5])), fill: LAVA, label: [96, 200], at: [140, 200] },
      { id: 'ash', name: 'ash cloud', d: 'M188,104L178,74Q150,80 128,70A22,22 0 0 1 120,40A26,26 0 0 1 160,20A30,30 0 0 1 215,14A28,28 0 0 1 262,28A24,24 0 0 1 290,58Q262,80 222,74L212,104Z', fill: '#908c95', label: [100, 34], at: [136, 46] },
    ],
  };
}

// ================================================================== 3. the Earth's layers
function earthLayers() {
  const cx = 180, cy = 180;
  const half = (ro, ri) => ri
    ? `M${cx},${cy - ro}A${ro},${ro} 0 0 1 ${cx},${cy + ro}L${cx},${cy + ri}A${ri},${ri} 0 0 0 ${cx},${cy - ri}Z`
    : `M${cx},${cy - ro}A${ro},${ro} 0 0 1 ${cx},${cy + ro}Z`;
  return {
    id: 'earth-layers', kind: 'diagram', viewBox: [14, 14, 332, 332], labelViewBox: [14, 14, 440, 332], labelSize: fit(440),
    decor: [
      { d: ell(cx, cy, 160, 160), fill: SEA, under: true },
      { d: many(
        blob([[70, 84], [110, 62], [150, 68], [164, 100], [138, 122], [124, 150], [142, 186], [150, 232], [130, 280], [112, 300], [100, 262], [86, 222], [62, 192], [46, 152], [52, 112]]),
        blob([[40, 230], [64, 240], [70, 270], [52, 276], [38, 256]]),
        blob([[128, 30], [160, 24], [176, 26], [176, 40], [146, 44]]),
      ), fill: '#7fb05a', under: true },
    ],
    features: [
      { id: 'crust', name: 'crust', d: half(160, 145), fill: '#9c7a56', label: [354, 58], at: [268, 55] },
      { id: 'mantle', name: 'mantle', d: half(145, 88), fill: MANTLE, label: [354, 128], at: [292, 150] },
      { id: 'outer-core', name: 'outer core', d: half(88, 40), fill: '#e7b443', label: [354, 198], at: [240, 202] },
      { id: 'inner-core', name: 'inner core', d: half(40), fill: '#f8e48a', label: [354, 268], at: [196, 205] },
    ],
  };
}

// ================================================================== 4. a headland worn away by the sea
function coast() {
  // headland top A(95,96) B(175,92) C(300,166) D(250,184); its long face runs A–D, its end face D–C
  const land = 'M0,40H420V88L175,92L300,166L250,184L95,96Q60,62 0,78Z';
  const hole = 'M208,203C208,192 214,186 225,186C236,186 242,194 243,222Z';
  return {
    id: 'coast', kind: 'diagram', viewBox: [0, 40, 420, 250], labelViewBox: [-56, 0, 526, 320], labelSize: fit(526),
    decor: [
      { d: 'M0,52Q0,40 12,40H408Q420,40 420,52V278Q420,290 408,290H12Q0,290 0,278Z', fill: SEA, under: true },
      { d: land, fill: GRASS, under: true },
      { d: poly([[175, 92], [420, 88], [420, 116], [222, 120]]), fill: CLIFF_SIDE, under: true },
      { d: poly([[95, 96], [250, 184], [250, 226], [95, 138]]), fill: CLIFF_SIDE, under: true },
      { d: poly([[250, 184], [300, 166], [300, 208], [250, 226]]), fill: CLIFF, under: true },
      { d: hole, fill: SEA, under: true },
      { d: 'M208,203C208,192 214,186 225,186C231,186 235,189 238,194C228,194 218,198 215,207Z', fill: '#2f5f8f', under: true },
      // the stack and the stump
      { d: poly([[316, 194], [340, 186], [352, 194], [328, 203]]), fill: GRASS, under: true },
      { d: poly([[316, 194], [328, 203], [328, 255], [316, 246]]), fill: CLIFF_SIDE, under: true },
      { d: poly([[328, 203], [352, 194], [352, 246], [328, 255]]), fill: CLIFF, under: true },
      { d: poly([[370, 246], [392, 240], [404, 246], [384, 252]]), fill: '#cbbd9f', under: true },
      { d: poly([[370, 246], [384, 252], [384, 262], [370, 256]]), fill: CLIFF_SIDE, under: true },
      { d: poly([[384, 252], [404, 246], [404, 256], [384, 262]]), fill: CLIFF, under: true },
      // surf
      { d: many(band([[300, 252], [326, 262], [354, 252]], 3), band([[364, 262], [386, 268], [410, 260]], 3), band([[136, 172], [190, 202], [250, 232], [300, 214]], 3), band([[8, 122], [44, 112], [84, 128]], 3)), fill: FOAM },
    ],
    features: [
      { id: 'bay', name: 'bay', d: 'M0,104Q55,90 95,120V138L128,157Q70,176 0,164Z', fill: '#6aaee0', label: [-8, 140], at: [40, 140] },
      { id: 'beach', name: 'beach', d: 'M0,78Q60,62 95,96V120Q55,90 0,104Z', fill: SAND, label: [40, 20], at: [40, 86] },
      { id: 'headland', name: 'headland', d: poly([[95, 96], [175, 92], [300, 166], [300, 208], [250, 226], [95, 138]]), fill: CLEAR, label: [190, 20], at: [190, 126] },
      { id: 'crack', name: 'crack', d: poly([[117, 111], [133, 120], [129, 128], [133, 137], [127, 152], [123, 152], [125, 139], [120, 131], [123, 122]]), fill: CAVE, label: [116, 304], at: [126, 142] },
      { id: 'cave', name: 'cave', d: 'M160,175C160,156 166,146 175,146C184,146 190,160 190,192Z', fill: CAVE, label: [172, 304], at: [172, 176] },
      { id: 'arch', name: 'arch', d: `${poly([[200, 156], [260, 142], [300, 166], [300, 208], [250, 226], [200, 198]])}${hole}`, fill: CLEAR, rule: 'evenodd', label: [236, 304], at: [236, 184] },
      { id: 'stack', name: 'stack', d: poly([[316, 194], [340, 186], [352, 194], [352, 246], [328, 255], [316, 246]]), fill: CLEAR, label: [330, 304], at: [330, 240] },
      { id: 'stump', name: 'stump', d: poly([[370, 246], [392, 240], [404, 246], [404, 256], [384, 262], [370, 256]]), fill: CLEAR, label: [392, 304], at: [392, 254] },
    ],
  };
}

// ================================================================== 5. glacial landforms
function glacier() {
  // skyline: left arête (0,128)–(168,92), peak (210,14), right ridge (252,92)–(420,124)
  // valley: head (170,118)–(250,118), floor (190,132)–(232,132) widening to (110,286)–(312,286)
  const profile = 'Q60,226 80,262Q92,284 110,286H312Q332,284 344,262Q366,224 396,212';
  const hollow = [[56, 124], [90, 114], [122, 118], [132, 136], [116, 152], [72, 160], [52, 142]];
  const hang = [[288, 108], [330, 112], [354, 128], [340, 176], [320, 163], [300, 150]];
  return {
    id: 'glacier', kind: 'diagram', viewBox: [0, 0, 420, 330], labelViewBox: [-34, -6, 506, 392], labelSize: fit(506),
    decor: [
      { d: 'M0,128L168,92L170,118L24,214L0,210Z', fill: '#9cb882', under: true },
      { d: 'M252,92L420,124V208L396,212L250,118Z', fill: '#90ad76', under: true },
      { d: `M170,118L24,214${profile.split('H')[0]}L190,132Z`, fill: '#86a76a', under: true },
      { d: 'M250,118L396,212Q366,224 344,262Q332,284 312,286L232,132Z', fill: '#7a9a5f', under: true },
      { d: 'M190,132L232,132L312,286H110Z', fill: '#c3dd9c', under: true },
      { d: 'M168,92L252,92L250,118L232,132H190L170,118Z', fill: ROCK, under: true },
      { d: `M0,210L24,214${profile}L420,208V318Q420,330 408,330H12Q0,330 0,318Z`, fill: SOIL, under: true },
      { d: many(band([[0, 252], [60, 290], [210, 304], [360, 290], [420, 250]], 3), band([[0, 290], [100, 314], [320, 314], [420, 288]], 3)), fill: '#937351', under: true },
      // the peak's faces and snow, the right-hand ridge
      { d: poly([[210, 14], [164, 96], [210, 112]]), fill: '#bdb6ad', under: true },
      { d: poly([[210, 14], [210, 112], [256, 96]]), fill: '#978e84', under: true },
      { d: 'M210,14L196,38L204,42L210,36L216,44L224,38Z', fill: SNOW, under: true },
      { d: band([[250, 94], [300, 102], [360, 112], [420, 124]], 9), fill: ROCK, under: true },
      // the corrie: a steep rock back wall above a hollow floor
      { d: blob(hollow), fill: '#b2cf9a', under: true },
      { d: 'M56,126Q88,104 124,120L124,134Q90,120 58,142Z', fill: ROCK_DARK, under: true },
      { d: blob(hang), fill: '#9fbf84', under: true },
      { d: band([[302, 114], [318, 126], [326, 142], [326, 160]], [10, 14]), fill: '#cde6b0', under: true },
      // the hanging valley's waterfall and stones on the moraine
      { d: band([[322, 166], [310, 186], [298, 206], [286, 226]], 4), fill: FOAM },
      { d: many(ell(146, 266, 3, 2), ell(176, 262, 3, 2), ell(232, 264, 3, 2), ell(268, 270, 3, 2), ell(204, 261, 2.5, 2)), fill: '#7a6a58' },
    ],
    features: [
      { id: 'valley', name: 'U-shaped valley', d: `M170,118L24,214${profile}L250,118Z`, fill: CLEAR, label: [168, 352], at: [176, 282] },
      { id: 'peak', name: 'pyramidal peak', d: poly([[210, 14], [164, 96], [210, 112], [256, 96]]), fill: CLEAR, label: [150, 16], at: [200, 60] },
      { id: 'arete', name: 'arête', d: band([[0, 129], [60, 117], [120, 104], [168, 93]], 12), fill: ROCK, label: [100, 54], at: [120, 104] },
      { id: 'corrie', name: 'corrie', d: blob(hollow), fill: CLEAR, label: [30, 100], at: [64, 132] },
      { id: 'tarn', name: 'tarn', d: ell(92, 145, 22, 7), fill: WATER, label: [56, 78], at: [86, 144] },
      { id: 'hanging', name: 'hanging valley', d: blob(hang), fill: CLEAR, label: [326, 62], at: [318, 136] },
      { id: 'ribbon', name: 'ribbon lake', d: blob([[206, 142], [216, 142], [228, 180], [240, 226], [236, 252], [214, 256], [194, 246], [190, 206], [198, 168]]), fill: WATER, label: [232, 352], at: [230, 236] },
      { id: 'moraine', name: 'moraine', d: band([[124, 268], [170, 261], [210, 261], [250, 263], [298, 272]], 13), fill: '#b3a38c', label: [304, 352], at: [290, 270] },
    ],
  };
}

// ================================================================== 6. the water cycle
function waterCycle() {
  const wavy = (x, y0, y1, amp = 7) => Array.from({ length: 6 }, (_, i) => [x + (i % 2 ? amp : -amp) * (i && i < 5 ? 1 : 0), y0 + (y1 - y0) * i / 5]);
  const evap = [34, 70, 106].map((x) => arrow(wavy(x, 206, 112), 8, [x, 96], 9));
  const trans = [262, 290].map((x) => arrow(wavy(x, 154, 124, 5), 6, [x, 114], 7));
  return {
    id: 'water-cycle', kind: 'diagram', viewBox: [0, 0, 440, 300], labelViewBox: [0, -14, 440, 338], labelSize: fit(440),
    decor: [
      // sun, sea, land and mountain
      { d: ell(30, 30, 16, 16), fill: '#f4c542', under: true },
      { d: many(...[0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const r = (a * Math.PI) / 180; return band([[30 + 21 * Math.cos(r), 30 + 21 * Math.sin(r)], [30 + 29 * Math.cos(r), 30 + 29 * Math.sin(r)]], 3.5); })), fill: '#f4c542', under: true },
      { d: 'M0,212H176Q196,222 202,240Q206,270 206,288Q206,300 194,300H12Q0,300 0,288Z', fill: SEA, under: true },
      { d: 'M176,212Q202,196 240,196L318,192L382,64L412,100L440,110V288Q440,300 428,300H194Q206,300 206,288Q206,256 198,234Q192,220 176,212Z', fill: GRASS, under: true },
      { d: 'M344,142L382,64L412,100L404,118L380,112L362,130Z', fill: ROCK, under: true },
      { d: 'M382,64L370,84L380,80L386,88L394,82L401,87Z', fill: SNOW, under: true },
      { d: many(band([[12, 232], [40, 228], [68, 232]], 3), band([[90, 252], [118, 248], [146, 252]], 3), band([[24, 272], [52, 268], [80, 272]], 3)), fill: '#7db5e4', under: true },
      // trees
      { d: many(rect(259, 176, 6, 22), rect(287, 176, 6, 22)), fill: '#7a5a3c', under: true },
      { d: many(ell(262, 170, 13, 15), ell(290, 170, 13, 15)), fill: '#4f8f42', under: true },
      // the rain cloud (over the top of the rain), the wind blowing clouds inland, the river reaching the sea
      { d: cloud(326, 8, 110, 50), fill: '#97a3b0' },
      { d: arrow([[236, 44], [276, 44]], 5, [292, 44], 8), fill: '#6c7a8c' },
      { d: arrow([[226, 246], [212, 256]], 5, [200, 264], 8), fill: '#2f6fae' },
      { d: many(...[[340, 66], [362, 70], [384, 64], [406, 70], [426, 66], [350, 94], [372, 98], [394, 92], [416, 98]].map(([x, y]) => band([[x, y], [x - 4, y + 12]], 3.2))), fill: '#2f6fae' },
    ],
    features: [
      { id: 'evaporation', name: 'evaporation', d: many(...evap), fill: '#8ccbec', label: [120, 176], at: [108, 176] },
      { id: 'transpiration', name: 'transpiration', d: many(...trans), fill: '#a8d98e', label: [250, 140], at: [262, 140] },
      { id: 'condensation', name: 'condensation', d: cloud(110, 14, 116, 54), fill: '#eef2f6', label: [168, -2], at: [168, 20] },
      { id: 'precipitation', name: 'precipitation', d: 'M338,40H432L424,104L404,112L380,108L356,118L330,112Z', fill: 'rgba(90,163,216,0.22)', label: [328, 96], at: [342, 96] },
      { id: 'collection', name: 'collection', d: band([[376, 122], [362, 150], [344, 176], [318, 196], [286, 208], [254, 218], [222, 228], [194, 232]], [5, 12]), fill: WATER, label: [300, 318], at: [280, 210] },
    ],
  };
}

// ================================================================== 7. a destructive plate boundary
function plateBoundary() {
  return {
    id: 'plate-boundary', kind: 'diagram', viewBox: [0, 0, 420, 300], labelViewBox: [-8, -16, 436, 352], labelSize: fit(436),
    decor: [
      { d: 'M0,80H248L225,180Q205,142 180,140H0Z', fill: SEA, under: true },
      // plate movement arrows, magma rising to the volcano
      { d: many(arrow([[30, 154], [90, 154]], 6, [106, 154], 9), arrow([[410, 132], [372, 132]], 6, [356, 132], 9), arrow([[300, 240], [330, 261]], 6, [343, 270], 9)), fill: '#f4efe6' },
      { d: many(band([[262, 196], [292, 166], [322, 128], [350, 88], [370, 44]], [10, 6]), ell(262, 202, 14, 9), ell(284, 216, 9, 6)), fill: MAGMA },
    ],
    features: [
      { id: 'mantle', name: 'mantle', d: 'M0,168H170Q190,170 209,203L348,300H12Q0,300 0,288ZM239,190H420V288Q420,300 408,300H397Z', fill: MANTLE, label: [100, 326], at: [100, 250] },
      { id: 'oceanic', name: 'oceanic plate', d: 'M0,140H180Q205,142 225,180L209,203Q190,170 170,168H0Z', fill: '#59636f', label: [60, -2], at: [60, 154] },
      { id: 'subduction', name: 'subduction zone', d: poly([[225, 180], [397, 300], [348, 300], [209, 203]]), fill: '#6e7884', label: [300, 326], at: [300, 260] },
      { id: 'continental', name: 'continental plate', d: 'M250,74H420V190H239L225,180Z', fill: '#c6a77b', label: [300, 32], at: [306, 100] },
      { id: 'trench', name: 'ocean trench', d: 'M180,140H234L225,180Q205,142 180,140Z', fill: DEEP, label: [210, 62], at: [220, 152] },
      { id: 'volcano', name: 'volcano', d: 'M326,74L364,30L370,34L376,34L382,30L418,74Z', fill: '#8d7059', label: [372, 4], at: [372, 44] },
    ],
  };
}

// ================================================================== 8. a drainage basin
function drainageBasin() {
  const S = (pts) => pts.map(([x, y]) => [180 + (x - 180) * 0.8, y]);
  const rim = S([[176, 362], [150, 330], [104, 276], [58, 214], [34, 146], [52, 76], [104, 32], [178, 20], [252, 30], [306, 70], [326, 134], [306, 204], [264, 268], [222, 322], [204, 362]]);
  const trib = (c) => band(S(c), [3, 4.5]);
  return {
    id: 'drainage-basin', kind: 'diagram', viewBox: [0, 0, 360, 400], labelViewBox: [-12, 0, 420, 400], labelSize: fit(420),
    decor: [
      { d: 'M0,376C60,364 120,382 180,370S300,362 360,376V388Q360,400 348,400H12Q0,400 0,388Z', fill: SEA, under: true },
      { d: many(
        trib([[64, 124], [100, 150], [140, 166], [174, 172]]),
        trib([[84, 230], [128, 250], [174, 266]]),
        trib([[276, 226], [236, 262], [196, 290]]),
        trib([[112, 56], [140, 86], [174, 108]]),
        trib([[240, 46], [214, 80], [182, 98]]),
        trib([[120, 300], [158, 316], [186, 322]]),
      ), fill: WATER },
    ],
    features: [
      { id: 'basin', name: 'drainage basin', d: `M${pt(rim[0])}${bez(rim)}Z`, fill: '#cfe4a8', label: [126, 356], at: [140, 262] },
      { id: 'watershed', name: 'watershed', d: band(rim, 9), fill: '#8a6b4a', label: [306, 40], at: [286, 76] },
      { id: 'main', name: 'main river', d: band(S([[176, 66], [181, 118], [172, 168], [184, 214], [178, 268], [188, 318], [190, 360]]), [5, 12]), fill: '#3f86c6', label: [290, 300], at: [187, 300] },
      { id: 'tributary', name: 'tributary', d: band(S([[292, 96], [256, 140], [226, 176], [200, 198], [182, 208]]), [4, 6.5]), fill: '#3f86c6', label: [306, 150], at: [238, 146] },
      { id: 'source', name: 'source', d: ell(176.8, 64, 8, 8), fill: '#2d6aa6', label: [130, 14], at: [174, 60] },
      { id: 'confluence', name: 'confluence', d: ell(181.6, 208, 10, 10), fill: '#2d6aa6', label: [290, 226], at: [188, 212] },
      { id: 'mouth', name: 'mouth', d: band(S([[190, 356], [192, 384]]), [12, 34]), fill: '#3f86c6', label: [250, 352], at: [196, 372] },
    ],
  };
}

export default [river(), volcano(), earthLayers(), coast(), glacier(), waterCycle(), plateBoundary(), drainageBasin()];
