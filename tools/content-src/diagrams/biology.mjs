// Biology diagrams: a plant, an insect and a spider (Years 2–3), the skeleton, digestion and
// teeth (Year 3), and the heart, lungs and a leaf cross-section (Year 8). Part names follow the
// wording of the course questions. The shared helpers are copied here rather than imported from
// ../diagrams.mjs, which imports this file while it is still loading.

const r1 = (n) => Math.round(n * 10) / 10;
const pt = ([x, y]) => `${r1(x)},${r1(y)}`;
const ell = (cx, cy, rx, ry) => `M${r1(cx - rx)},${r1(cy)}a${rx},${ry} 0 1,0 ${r1(2 * rx)},0a${rx},${ry} 0 1,0 ${r1(-2 * rx)},0Z`;
const rect = (x, y, w, h, r = 0) => r
  ? `M${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x + r}Q${x},${y + h} ${x},${y + h - r}V${y + r}Q${x},${y} ${x + r},${y}Z`
  : `M${x},${y}H${x + w}V${y + h}H${x}Z`;
const many = (...ds) => ds.join('');
const poly = (pts) => `M${pts.map(pt).join('L')}Z`;
const mirror = (pts, cx) => pts.map(([x, y]) => [2 * cx - x, y]);

// an ellipse turned by deg degrees
const ellR = (cx, cy, rx, ry, deg) => {
  const a = (deg * Math.PI) / 180, ux = Math.cos(a) * rx, uy = Math.sin(a) * rx;
  const p = [cx - ux, cy - uy], q = [cx + ux, cy + uy];
  return `M${pt(p)}A${rx},${ry} ${deg} 1,0 ${pt(q)}A${rx},${ry} ${deg} 1,0 ${pt(p)}Z`;
};

// smooth curves through points (Catmull-Rom as cubic Béziers)
const curve = (pts) => {
  let d = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)];
    d += `C${pt([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6])} ${pt([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6])} ${pt(p2)}`;
  }
  return d;
};
// a smooth closed shape through points
const blob = (pts) => {
  const n = pts.length;
  let d = `M${pt(pts[0])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    d += `C${pt([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6])} ${pt([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6])} ${pt(p2)}`;
  }
  return d + 'Z';
};
// a thick smooth line (a leg, a root, a blood vessel) as a filled outline, tapering from w0 to w1
const tube = (pts, w0, w1 = w0, caps = true) => {
  const n = pts.length, L = [], R = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(i - 1, 0)], b = pts[Math.min(i + 1, n - 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
    const w = (w0 + (w1 - w0) * (i / (n - 1))) / 2, nx = (-dy / len) * w, ny = (dx / len) * w;
    L.push([pts[i][0] + nx, pts[i][1] + ny]);
    R.push([pts[i][0] - nx, pts[i][1] - ny]);
  }
  const R2 = [...R].reverse();
  const cap = (w, to) => (caps ? `A${r1(w / 2)},${r1(w / 2)} 0 0,0 ${pt(to)}` : `L${pt(to)}`);
  return `M${pt(L[0])}${curve(L)}${cap(w1, R2[0])}${curve(R2)}${cap(w0, L[0])}Z`;
};
// a leaf shape from its base to its tip
const leafShape = ([bx, by], [tx, ty], w) => {
  const dx = tx - bx, dy = ty - by, len = Math.hypot(dx, dy), nx = (-dy / len) * w, ny = (dx / len) * w;
  const at = (f, s) => [bx + dx * f + nx * s, by + dy * f + ny * s];
  return `M${pt([bx, by])}C${pt(at(0.2, 1))} ${pt(at(0.7, 0.9))} ${pt([tx, ty])}C${pt(at(0.7, -0.9))} ${pt(at(0.2, -1))} ${pt([bx, by])}Z`;
};
// a rounded box (squarer as n grows) turned by deg degrees
const box = (cx, cy, w, h, deg = 0, n = 4, k = 32) => {
  const a = (deg * Math.PI) / 180, out = [];
  for (let i = 0; i < k; i++) {
    const t = (2 * Math.PI * i) / k, c = Math.cos(t), s = Math.sin(t);
    const x = (w / 2) * Math.sign(c) * Math.abs(c) ** (2 / n), y = (h / 2) * Math.sign(s) * Math.abs(s) ** (2 / n);
    out.push([cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a)]);
  }
  return poly(out);
};

// ---------------------------------------------------------------- a flowering plant (Years 2–3)
function plant() {
  const petals = [0, 60, 120, 180, 240, 300].map((a) => {
    const t = (a * Math.PI) / 180;
    return ellR(150 + 25 * Math.cos(t), 78 + 25 * Math.sin(t), 22, 13, a);
  });
  const roots = [
    tube([[150, 286], [149, 315], [152, 345], [148, 380]], 9, 2),
    tube([[150, 298], [132, 311], [112, 330], [96, 354]], 5, 1.5),
    tube([[150, 296], [170, 308], [190, 326], [205, 350]], 5, 1.5),
    tube([[150, 322], [136, 340], [124, 368]], 4, 1.5),
    tube([[151, 330], [166, 348], [177, 374]], 4, 1.5),
  ];
  const leaves = [
    [[147, 234], [74, 204], 22], [[151, 188], [226, 158], 22], [[148, 150], [98, 122], 15],
  ];
  return {
    id: 'plant', kind: 'diagram', viewBox: [44, 8, 212, 390], labelViewBox: [-14, 8, 344, 390], labelSize: 14,
    decor: [
      { d: rect(50, 284, 200, 108, 14), fill: '#a8805a', under: true },
      { d: rect(50, 280, 200, 12, 6), fill: '#7a5638', under: true },
      { d: ell(150, 78, 12, 12), fill: '#f2c94c' },
      { d: many(...leaves.map(([b, t]) => tube([b, [(b[0] + t[0]) / 2, (b[1] + t[1]) / 2 - 3], t], 2, 0.8))), fill: '#3f7a2c' },
    ],
    features: [
      { id: 'roots', name: 'roots', d: many(...roots), fill: '#efdfb4', label: [30, 345], at: [111, 332] },
      { id: 'stem', name: 'stem', d: tube([[150, 290], [147, 240], [152, 190], [148, 140], [150, 96]], 11, 8), fill: '#4f8f3a', label: [30, 178], at: [149, 178] },
      { id: 'leaves', name: 'leaves', d: many(...leaves.map(([b, t, w]) => leafShape(b, t, w))), fill: '#73b54f', label: [270, 160], at: [205, 166] },
      { id: 'flower', name: 'flower', d: many(...petals), fill: '#e98bb8', label: [270, 70], at: [184, 72] },
    ],
  };
}

// ---------------------------------------------------------------- an insect: a bee from above
function insect() {
  const legL = [
    [[128, 98], [104, 88], [94, 62]],
    [[124, 110], [96, 118], [80, 142]],
    [[128, 122], [108, 150], [98, 196]],
  ];
  const legs = [...legL, ...legL.map((l) => mirror(l, 150))].map((l) => tube(l, 5, 3));
  const ant = [[143, 50], [134, 32], [116, 22]];
  // abdomen stripes: bands across the ellipse (150, 186) rx 34 ry 52
  const band = (y0, y1) => {
    const hw = (y) => 31 * Math.sqrt(Math.max(0, 1 - ((y - 180) / 46) ** 2));
    return poly([[150 - hw(y0), y0], [150 + hw(y0), y0], [150 + hw(y1), y1], [150 - hw(y1), y1]]);
  };
  return {
    id: 'insect', kind: 'diagram', viewBox: [40, 8, 220, 228], labelViewBox: [-38, 8, 368, 228], labelSize: 14,
    decor: [
      { d: many(band(156, 165), band(177, 186), band(198, 207)), fill: '#5a3f26' },
      { d: many(ellR(138, 58, 6, 10, -25), ellR(162, 58, 6, 10, 25)), fill: '#3a2c3f' },
    ],
    features: [
      { id: 'legs', name: 'legs', d: many(...legs), fill: '#7a5a3e', label: [30, 190], at: [98, 190] },
      { id: 'antennae', name: 'antennae', d: many(tube(ant, 4, 3), tube(mirror(ant, 150), 4, 3)), fill: '#7a5a3e', label: [30, 22], at: [117, 22] },
      { id: 'abdomen', name: 'abdomen', d: ell(150, 180, 32, 46), fill: '#f0c93e', label: [270, 200], at: [180, 196] },
      { id: 'thorax', name: 'thorax', d: ell(150, 110, 26, 26), fill: '#a87b45', label: [270, 140], at: [158, 128] },
      { id: 'head', name: 'head', d: ell(150, 64, 20, 17), fill: '#8a6440', label: [270, 52], at: [166, 56] },
      { id: 'wings', name: 'wings', d: many(ellR(96, 125, 48, 19, -31), ellR(105, 142, 37, 14, -40), ellR(204, 125, 48, 19, 31), ellR(195, 142, 37, 14, 40)), fill: 'rgba(196,226,246,0.72)', label: [30, 110], at: [70, 140] },
    ],
  };
}

// ---------------------------------------------------------------- a spider from above
function spider() {
  const legL = [
    [[132, 84], [104, 58], [86, 44], [76, 14]],
    [[127, 95], [92, 80], [66, 74], [44, 62]],
    [[127, 107], [92, 120], [66, 134], [48, 154]],
    [[131, 118], [106, 148], [88, 182], [80, 222]],
  ];
  const legs = [...legL, ...legL.map((l) => mirror(l, 150))].map((l) => tube(l, 6, 3));
  const palp = [[142, 72], [137, 60], [140, 52]];
  return {
    id: 'spider', kind: 'diagram', viewBox: [30, 4, 240, 236], labelViewBox: [-14, 4, 420, 236], labelSize: 16,
    decor: [
      { d: many(tube(palp, 5, 4), tube(mirror(palp, 150), 5, 4)), fill: '#6e523e', under: true },
      { d: many(ell(144, 78, 3, 3), ell(156, 78, 3, 3), ell(139, 84, 2.4, 2.4), ell(161, 84, 2.4, 2.4), ell(147, 72, 2.4, 2.4), ell(153, 72, 2.4, 2.4)), fill: '#2b2230' },
      { d: many(ell(150, 160, 7, 7), ell(137, 182, 6, 6), ell(163, 182, 6, 6), ell(150, 200, 6, 6), ell(140, 216, 4, 4), ell(160, 216, 4, 4)), fill: '#d6b48a' },
    ],
    features: [
      { id: 'legs', name: 'legs', d: many(...legs), fill: '#6e523e', label: [24, 150], at: [50, 150] },
      { id: 'abdomen', name: 'abdomen', d: ell(150, 186, 40, 48), fill: '#9b7356', label: [280, 200], at: [188, 200] },
      { id: 'cephalothorax', name: 'cephalothorax', d: ell(150, 100, 27, 31), fill: '#7d5c46', label: [280, 100], at: [172, 100] },
    ],
  };
}

// ---------------------------------------------------------------- the human skeleton, front view
function skeleton() {
  const vert = [];
  for (let y = 97; y < 290; y += 11) {
    const w = y < 128 ? 12 : y < 240 ? 14 : 18;
    vert.push(rect(130 - w / 2, y, w, 9, 3));
  }
  // ribs: from the breastbone out and down round the sides, widest in the middle of the chest
  const ribsR = [26, 34, 40, 44, 46, 46, 43].map((W, i) => {
    const y0 = 132 + i * 12;
    return [[134, y0], [130 + 0.5 * W, y0 + 3], [130 + 0.85 * W, y0 + 11], [130 + W, y0 + 24]];
  });
  const ribs = [...ribsR, ...ribsR.map((r) => mirror(r, 130))].map((r) => tube(r, 5, 4.5));
  const femurR = [[157, 316], [166, 330], [160, 380], [150, 426]];
  const femur = (p) => many(tube(p, 11, 10), ell(p[0][0], p[0][1] - 3, 8, 8), ell(p[3][0], p[3][1] + 4, 12, 7));
  const side = (right, pts) => (right ? pts : mirror(pts, 130));
  const arm = (r) => many(
    ell(...side(r, [[181, 129]])[0], 7, 7), tube(side(r, [[182, 130], [186, 175], [189, 214]]), 9, 8), ell(...side(r, [[189, 218]])[0], 7, 5),
    tube(side(r, [[193, 222], [196, 260], [199, 296]]), 6, 5), tube(side(r, [[186, 222], [188, 260], [191, 296]]), 5, 4),
    blob(side(r, [[188, 296], [203, 296], [206, 314], [187, 314]])),
    ...[190, 194, 198, 202].map((x, i) => tube(side(r, [[x, 312], [x + 1, 330 + (i === 1 || i === 2 ? 4 : 0)]]), 3, 2.5)));
  const leg = (r) => many(
    tube(side(r, [[147, 436], [146, 495], [145, 536]]), 9, 8), tube(side(r, [[158, 440], [159, 495], [156, 534]]), 4, 4),
    blob(side(r, [[138, 536], [153, 536], [166, 550], [171, 560], [140, 561]])));
  const clav = [[134, 123], [156, 118], [178, 125]];
  return {
    id: 'skeleton', kind: 'diagram', viewBox: [52, 4, 156, 562], labelViewBox: [-12, 4, 296, 562], labelSize: 16,
    decor: [
      { d: many(arm(true), arm(false), leg(true), leg(false), tube(clav, 6, 5), tube(mirror(clav, 130), 6, 5)), fill: '#d9c9a2', under: true },
      { d: many(ell(119, 50, 8, 9), ell(141, 50, 8, 9), poly([[130, 59], [125, 71], [135, 71]])), fill: '#6b5d4a' },
      { d: many(...[120, 125, 130, 135, 140].map((x) => rect(x - 2, 79, 4, 6, 1))), fill: '#d9c9a2' },
      { d: many(ell(150, 434, 6, 6), ell(110, 434, 6, 6)), fill: '#d9c9a2' },
    ],
    features: [
      { id: 'spine', name: 'spine', d: many(...vert), fill: '#eadfc2', label: [226, 104], at: [136, 104] },
      { id: 'ribs', name: 'ribs', d: many(rect(124, 127, 12, 70, 5), ...ribs), fill: '#f1e7cd', label: [34, 170], at: [88, 170] },
      { id: 'skull', name: 'skull', d: blob([[130, 8], [152, 14], [161, 34], [159, 56], [152, 70], [148, 84], [140, 93], [130, 95], [120, 93], [112, 84], [108, 70], [101, 56], [99, 34], [108, 14]]), fill: '#f1e7cd', label: [34, 40], at: [101, 40] },
      { id: 'pelvis', name: 'pelvis', d: blob([[130, 286], [150, 282], [172, 286], [180, 302], [172, 318], [160, 328], [146, 342], [130, 338], [114, 342], [100, 328], [88, 318], [80, 302], [88, 286], [110, 282]]) + ell(117, 328, 6, 7) + ell(143, 328, 6, 7), fill: '#f1e7cd', rule: 'evenodd', label: [226, 262], at: [174, 298] },
      { id: 'femur', name: 'femur', d: many(femur(femurR), femur(mirror(femurR, 130))), fill: '#f1e7cd', label: [226, 384], at: [161, 384] },
    ],
  };
}

// ---------------------------------------------------------------- the digestive system
function digestion() {
  const small = [[150, 256], [140, 272], [132, 290], [180, 290], [184, 304], [132, 304], [128, 318], [182, 318], [182, 332], [130, 332], [130, 346], [180, 346], [178, 360], [128, 362], [116, 364]];
  return {
    id: 'digestion', kind: 'diagram', viewBox: [56, 8, 190, 420], labelViewBox: [-12, 8, 420, 420], labelSize: 16,
    decor: [
      { d: many(ell(150, 50, 34, 38), rect(136, 80, 28, 30, 6), blob([[100, 106], [200, 106], [232, 128], [238, 230], [230, 330], [222, 424], [78, 424], [70, 330], [62, 230], [68, 128]])), fill: '#f3dcc6', under: true },
    ],
    features: [
      { id: 'liver', name: 'liver', d: blob([[84, 178], [120, 166], [160, 168], [180, 178], [170, 192], [146, 206], [118, 222], [96, 224], [82, 206]]), fill: '#9c4d4d', label: [46, 196], at: [94, 200] },
      { id: 'oesophagus', name: 'oesophagus', d: tube([[150, 76], [151, 110], [154, 150], [160, 180], [172, 196]], 9, 9), fill: '#e7a0a6', label: [252, 132], at: [154, 132] },
      { id: 'stomach', name: 'stomach', d: blob([[166, 196], [182, 184], [204, 186], [218, 200], [220, 226], [208, 248], [186, 260], [160, 262], [146, 254], [150, 244], [170, 240], [186, 228], [188, 212], [176, 204]]), fill: '#cf7fa8', label: [252, 214], at: [216, 214] },
      { id: 'large', name: 'large intestine', d: tube([[112, 372], [104, 330], [104, 290], [110, 268], [140, 262], [180, 264], [204, 272], [208, 300], [206, 345], [196, 372], [174, 384], [158, 388]], 24, 20), fill: '#c9a36a', label: [252, 352], at: [207, 340] },
      { id: 'small', name: 'small intestine', d: tube(small, 11, 11), fill: '#f2b6c6', label: [252, 296], at: [182, 298] },
      { id: 'rectum', name: 'rectum', d: tube([[160, 386], [154, 400], [152, 416]], 15, 12), fill: '#a87d52', label: [46, 406], at: [151, 406] },
      { id: 'mouth', name: 'mouth', d: ell(150, 72, 14, 7), fill: '#c8506a', label: [46, 72], at: [137, 72] },
    ],
  };
}

// ---------------------------------------------------------------- teeth: a lower jaw from above
function teeth() {
  // teeth along half an ellipse, front teeth at the top; each side from the middle: I I C P P M M M
  const cx = 160, cy = 250, rx = 118, ry = 190, k = 1.25;
  const at = (phi) => [cx + rx * Math.sin(phi), cy - ry * Math.cos(phi)];
  const seq = [['i', 20, 10], ['i', 17, 10], ['c', 19, 15], ['p', 20, 17], ['p', 20, 18], ['m', 30, 26], ['m', 29, 25], ['m', 27, 24]];
  const step = 0.002, gap = 2.5;
  const shapes = { i: [], c: [], p: [], m: [] }, mid = {};
  for (const side of [1, -1]) {
    let phi = 0;
    // walk along the arch by arc length
    const walk = (dist) => { let acc = 0; while (acc < dist) { const a = at(phi), b = at(phi + step); acc += Math.hypot(b[0] - a[0], b[1] - a[1]); phi += step; } };
    for (const [t, w0, d0] of seq) {
      const w = w0 * k, dpt = d0 * k;
      walk(gap / 2 + w / 2);
      const [x, y] = at(phi * side);
      const tan = Math.atan2(ry * Math.sin(phi * side), rx * Math.cos(phi * side)) * (180 / Math.PI);
      shapes[t].push(box(x, y, w, dpt, tan, t === 'm' ? 5 : t === 'p' ? 3 : t === 'c' ? 1.6 : 4));
      (mid[t + side] ||= []).push([r1(x), r1(y)]);
      walk(w / 2 + gap / 2);
    }
  }
  const avg = (l) => [r1(l.reduce((a, p) => a + p[0], 0) / l.length), r1(l.reduce((a, p) => a + p[1], 0) / l.length)];
  const arch = [];
  for (let p = 0; p <= 1.6; p += 0.1) arch.push(at(p));
  return {
    id: 'teeth', kind: 'diagram', viewBox: [22, 22, 276, 262], labelViewBox: [-70, 22, 446, 262], labelSize: 17,
    decor: [{ d: many(tube([...arch].reverse(), 50, 34), tube(mirror([...arch].reverse(), cx), 50, 34)), fill: '#e79aa8', under: true }],
    features: [
      { id: 'incisors', name: 'incisors', d: many(...shapes.i), fill: '#dcebf7', label: [40, 40], at: avg(mid['i-1']) },
      { id: 'canines', name: 'canines', d: many(...shapes.c), fill: '#f6d9e8', label: [300, 96], at: mid.c1[0] },
      { id: 'premolars', name: 'premolars', d: many(...shapes.p), fill: '#e3f0d4', label: [20, 150], at: avg(mid['p-1']) },
      { id: 'molars', name: 'molars', d: many(...shapes.m), fill: '#f6ecc8', label: [312, 200], at: avg(mid.m1) },
    ],
  };
}

// ---------------------------------------------------------------- the heart (Year 8), seen from the front
// The person's right side is on the viewer's left, as in textbooks. Labels sit above and below
// the drawing as well as beside it, so the heart stays big on a phone.
function heart() {
  const blue = '#5a86c8', red = '#c8466a', blueV = '#4f7cc0', redV = '#c04064';
  return {
    id: 'heart', kind: 'diagram', viewBox: [62, 12, 270, 368], labelViewBox: [-60, -36, 552, 480], labelSize: 18,
    decor: [
      { d: blob([[82, 112], [150, 100], [220, 104], [292, 114], [304, 170], [296, 240], [268, 304], [222, 356], [196, 374], [168, 352], [118, 296], [84, 236], [72, 170]]), fill: '#e7a7a0', under: true },
    ],
    features: [
      { id: 'vena-cava', name: 'vena cava', d: tube([[104, 18], [106, 70], [110, 130]], 28, 28, false), fill: blueV, label: [76, 52], at: [94, 52] },
      { id: 'aorta', name: 'aorta', d: tube([[196, 214], [194, 150], [192, 90], [204, 50], [240, 34], [278, 46], [292, 80], [294, 120]], 26, 24, false), fill: redV, label: [258, -14], at: [252, 24] },
      { id: 'pulmonary-artery', name: 'pulmonary artery', d: many(tube([[164, 212], [164, 150], [166, 108], [180, 88], [220, 84], [262, 86], [324, 94]], 24, 20, false), tube([[172, 98], [154, 90], [136, 88]], 20, 18, false)), fill: blueV, label: [132, -14], at: [142, 88] },
      { id: 'pulmonary-vein', name: 'pulmonary vein', d: many(tube([[276, 148], [328, 142]], 18, 18, false), tube([[276, 180], [328, 188]], 18, 18, false)), fill: redV, label: [340, 145], at: [322, 145] },
      { id: 'right-atrium', name: 'right atrium', d: blob([[92, 122], [140, 116], [150, 150], [146, 190], [98, 194], [86, 160]]), fill: blue, label: [66, 156], at: [92, 156] },
      { id: 'right-ventricle', name: 'right ventricle', d: blob([[100, 210], [150, 206], [178, 216], [182, 262], [176, 318], [164, 330], [130, 296], [104, 252]]), fill: blue, label: [116, 384], at: [134, 286] },
      { id: 'left-atrium', name: 'left atrium', d: blob([[220, 124], [276, 128], [286, 160], [280, 194], [226, 194], [214, 160]]), fill: red, label: [318, 234], at: [262, 186] },
      { id: 'left-ventricle', name: 'left ventricle', d: blob([[200, 212], [258, 208], [270, 242], [258, 290], [226, 334], [204, 344], [194, 300], [196, 252]]), fill: red, label: [246, 430], at: [238, 300] },
      { id: 'valves', name: 'valves', d: many(poly([[104, 196], [126, 196], [118, 214]]), poly([[122, 198], [144, 198], [132, 216]]), poly([[220, 198], [242, 198], [232, 216]]), poly([[238, 198], [262, 198], [250, 216]])), fill: '#f4ecd8', label: [66, 204], at: [108, 203] },
    ],
  };
}

// ---------------------------------------------------------------- the lungs (Year 8)
function lungs() {
  const pink = '#f0a6b4', airway = '#e8b4a0';
  const bL = [[180, 124], [158, 140], [136, 162]], bR = mirror(bL, 180);
  const twigs = (right) => {
    const f = right ? (p) => mirror(p, 180) : (p) => p;
    return [
      tube(f([[136, 162], [120, 150], [104, 138]]), 6, 3), tube(f([[136, 162], [118, 182], [102, 206]]), 6, 3),
      tube(f([[136, 162], [138, 196], [134, 236]]), 6, 3), tube(f([[118, 182], [96, 186]]), 4, 2),
      tube(f([[134, 236], [118, 262]]), 4, 2), tube(f([[134, 236], [144, 266]]), 4, 2), tube(f([[102, 206], [94, 236]]), 4, 2),
    ];
  };
  const wall = [[58, 96], [42, 150], [36, 210], [38, 270], [44, 312]];
  const ribAt = [[54, 108], [46, 138], [41, 168], [38, 198], [37, 228], [38, 258], [41, 288]];
  const ribs = many(...ribAt.map(([x, y]) => ellR(x, y, 9, 6, 75)), ...ribAt.map(([x, y]) => ellR(360 - x, y, 9, 6, -75)));
  const alv = [[292, 42], [306, 38], [318, 48], [314, 62], [300, 66], [287, 56], [302, 52]].map(([x, y]) => ell(x, y, 8, 8));
  const dome = [[30, 322], [80, 308], [130, 298], [180, 294], [230, 298], [280, 308], [330, 322]];
  const lungL = [[150, 92], [162, 120], [166, 190], [164, 262], [154, 290], [110, 296], [66, 304], [58, 240], [64, 160], [88, 112], [120, 90]];
  return {
    id: 'lungs', kind: 'diagram', viewBox: [16, 6, 330, 330], labelViewBox: [-88, 6, 562, 330], labelSize: 21,
    decor: [
      // chest wall: the muscles between the ribs
      { d: many(tube(wall, 14, 14), tube(mirror(wall, 180), 14, 14)), fill: '#d79a8a', under: true },
      // a bronchiole tip in the right lung, magnified in the circle: its air sacs
      { d: tube([[257, 136], [286, 84]], 1.6, 1.6), fill: '#a8858c', under: true },
      { d: ell(300, 50, 38, 38), fill: '#fbe8ec', under: true },
      { d: tube([[268, 24], [284, 40], [296, 50]], 6, 5), fill: airway, under: true },
      // trachea rings
      { d: many(...[34, 52, 70, 88, 106].map((y) => rect(169, y, 22, 4, 2))), fill: '#f6e4e0' },
    ],
    features: [
      { id: 'lungs', name: 'lungs', d: many(blob(lungL), blob([[210, 92], [240, 90], [272, 112], [296, 160], [302, 240], [294, 304], [250, 296], [212, 290], [206, 270], [222, 240], [198, 220], [196, 150]])), fill: pink, label: [20, 196], at: [70, 196] },
      { id: 'bronchioles', name: 'bronchioles', d: many(...twigs(false), ...twigs(true)), fill: airway, label: [342, 214], at: [262, 200] },
      { id: 'trachea', name: 'trachea', d: tube([[180, 20], [180, 70], [180, 126]], 24, 24, false), fill: airway, label: [20, 60], at: [168, 60] },
      { id: 'bronchi', name: 'bronchi', d: many(tube(bL, 15, 11), tube(bR, 15, 11)), fill: airway, label: [342, 130], at: [206, 142] },
      { id: 'ribs', name: 'ribs', d: ribs, fill: '#efe4c8', label: [20, 260], at: [38, 258] },
      { id: 'diaphragm', name: 'diaphragm', d: tube(dome, 12, 12), fill: '#b0607a', label: [20, 314], at: [42, 318] },
      { id: 'alveoli', name: 'alveoli', d: many(...alv), fill: '#e98ea4', label: [342, 50], at: [320, 50] },
    ],
  };
}

// ---------------------------------------------------------------- a leaf in cross-section (Year 8)
function leafSection() {
  const x0 = 20, x1 = 384, stomata = [110, 222];
  const upper = [], pal = [], chl = [], lower = [];
  for (let x = x0; x < x1 - 1; x += 36.4) upper.push(rect(r1(x + 1.5), 25, 33.4, 28, 6));
  for (let x = x0; x < x1 - 1; x += 28) {
    pal.push(rect(x + 2, 57, 24, 104, 9));
    for (let y = 68; y < 156; y += 15) chl.push(ell(x + 9 + (Math.round(y / 15) % 2) * 9, y, 4, 2.8));
  }
  // spongy cells with air spaces between them; none just above the stomata or in the vein
  const sp = [[44, 186], [98, 186], [152, 186], [206, 186], [260, 186], [362, 188],
    [70, 224], [124, 224], [178, 224], [232, 224], [362, 228],
    [44, 262], [166, 262], [276, 262]];
  const spongy = sp.map(([x, y], i) => ellR(x, y, 21 + (i % 3) * 2, 15, ((i * 37) % 50) - 25));
  for (let x = x0; x + 30 <= x1 + 1; x += 30) if (!stomata.some((s) => Math.abs(x + 15 - s) < 28)) lower.push(rect(x + 1.5, 287, 27, 26, 6));
  const guard = many(...stomata.map((s) => many(ellR(s - 12, 300, 12, 16, 0), ellR(s + 12, 300, 12, 16, 0))));
  const pores = many(...stomata.map((s) => rect(s - 4, 283, 8, 34, 3)));
  return {
    id: 'leaf-section', kind: 'diagram', viewBox: [12, 12, 380, 312], labelViewBox: [4, 12, 592, 342], labelSize: 22,
    decor: [
      { d: rect(18, 18, 368, 9, 4), fill: '#d6e6a8', under: true },
      { d: many(...chl, ...[[352, 182], [368, 192], [372, 178], [36, 258], [52, 266], [356, 230]].map(([x, y]) => ell(x, y, 4, 2.8))), fill: '#2f7a2b' },
      { d: many(ell(300, 210, 6, 6), ell(316, 204, 6, 6), ell(332, 210, 6, 6)), fill: '#c9d8f0' },
    ],
    features: [
      { id: 'air-spaces', name: 'air spaces', d: rect(x0, 164, x1 - x0, 120), fill: '#eef6fb', label: [402, 268], at: [322, 270] },
      { id: 'upper-epidermis', name: 'upper epidermis', d: many(...upper), fill: '#e8f1d4', label: [402, 34], at: [372, 40] },
      { id: 'palisade', name: 'palisade cells', d: many(...pal), fill: '#8cc56a', label: [402, 98], at: [378, 110] },
      { id: 'spongy', name: 'spongy layer', d: many(...spongy), fill: '#bcdc97', label: [402, 152], at: [368, 184] },
      { id: 'xylem', name: 'xylem', d: ell(316, 208, 26, 16), fill: '#7d9bd2', label: [402, 194], at: [340, 202] },
      { id: 'phloem', name: 'phloem', d: ell(316, 240, 22, 12), fill: '#d8c26a', label: [402, 232], at: [336, 242] },
      { id: 'lower-epidermis', name: 'lower epidermis', d: many(...lower), fill: '#e8f1d4', label: [402, 306], at: [372, 300] },
      { id: 'guard-cells', name: 'guard cells', d: guard, fill: '#7fbf5c', label: [242, 340], at: [234, 308] },
      { id: 'stomata', name: 'stomata', d: pores, fill: '#4b5a48', label: [100, 340], at: [110, 312] },
    ],
  };
}

export default [plant(), insect(), spider(), skeleton(), digestion(), teeth(), heart(), lungs(), leafSection()];
