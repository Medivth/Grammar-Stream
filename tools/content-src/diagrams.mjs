import { readdirSync } from 'node:fs';
// Labelled science diagrams, built into content/maps/<id>.json and used exactly like maps:
// highlight a part ("which part is this?"), tap a part ("tap the nucleus"), or name it.

import { ell, rect, many } from './diagram-helpers.mjs';
export { ell, rect, many };

const animalCell = {
  id: 'cell-animal', kind: 'diagram', viewBox: [0, 0, 420, 300], labelViewBox: [0, -44, 452, 400], labelSize: 18,
  features: [
    { id: 'cytoplasm', name: 'cytoplasm', d: ell(210, 150, 184, 124), fill: '#f6e7d2', label: [212, 344], at: [205, 228] },
    { id: 'nucleus', name: 'nucleus', d: ell(185, 140, 46, 42), fill: '#b9a2d6', label: [174, -20], at: [182, 104] },
    { id: 'mitochondria', name: 'mitochondria', d: many(ell(310, 105, 24, 11), ell(120, 215, 24, 11), ell(290, 215, 24, 11)), fill: '#e8a37a', label: [328, -20], at: [318, 100] },
    { id: 'ribosomes', name: 'ribosomes', d: many(...[[250, 70], [270, 160], [330, 160], [100, 120], [150, 240], [230, 230], [345, 120], [80, 170]].map(([x, y]) => ell(x, y, 4, 4))), fill: '#5b4a7a', label: [142, 318], at: [150, 240] },
    { id: 'membrane', name: 'cell membrane', d: ell(210, 150, 192, 132) + ell(210, 150, 184, 124), fill: '#8a6d4b', rule: 'evenodd', label: [316, 318], at: [304, 259] },
  ],
};

const plantCell = {
  id: 'cell-plant', kind: 'diagram', viewBox: [0, 0, 420, 300], labelViewBox: [-28, -66, 466, 434], labelSize: 18,
  features: [
    { id: 'cytoplasm', name: 'cytoplasm', d: rect(28, 28, 364, 244, 8), fill: '#eef3d6', label: [142, 344], at: [134, 240] },
    { id: 'vacuole', name: 'vacuole', d: rect(150, 62, 205, 176, 30), fill: '#cfe6f5', label: [312, 318], at: [300, 210] },
    { id: 'nucleus', name: 'nucleus', d: ell(88, 92, 32, 30), fill: '#b9a2d6', label: [80, -18], at: [88, 70] },
    { id: 'chloroplasts', name: 'chloroplasts', d: many(ell(62, 165, 16, 9), ell(105, 210, 16, 9), ell(66, 248, 16, 9), ell(205, 256, 16, 9), ell(300, 256, 16, 9), ell(375, 130, 10, 16), ell(375, 200, 10, 16)), fill: '#5fa857', label: [96, 318], at: [105, 212] },
    { id: 'mitochondria', name: 'mitochondria', d: many(ell(200, 45, 16, 7), ell(305, 45, 16, 7)), fill: '#e8a37a', label: [316, -18], at: [308, 44] },
    { id: 'membrane', name: 'cell membrane', d: rect(22, 22, 376, 256, 10) + rect(28, 28, 364, 244, 8), fill: '#8a6d4b', rule: 'evenodd', label: [122, -44], at: [130, 25] },
    { id: 'wall', name: 'cell wall', d: rect(8, 8, 404, 284, 18) + rect(22, 22, 376, 256, 10), fill: '#7c9a3f', rule: 'evenodd', label: [262, -44], at: [254, 15] },
  ],
};

const flower = {
  id: 'flower', kind: 'diagram', viewBox: [30, 88, 340, 272], labelViewBox: [-52, 88, 484, 272], labelSize: 18,
  decor: [{ d: rect(195, 240, 10, 115), fill: '#6d9a4b', under: true }],
  features: [
    { id: 'petal', name: 'petal', d: many(ell(118, 170, 72, 42), ell(282, 170, 72, 42)), fill: '#f2a7c3', label: [34, 170], at: [62, 170] },
    { id: 'sepal', name: 'sepal', d: 'M200,250L160,262L176,238ZM200,250L240,262L224,238Z', fill: '#7fb05a', label: [34, 292], at: [170, 254] },
    { id: 'ovary', name: 'ovary', d: ell(200, 224, 25, 21), fill: '#f4d06b', label: [366, 232], at: [222, 230] },
    { id: 'style', name: 'style', d: rect(195, 120, 10, 86), fill: '#d7c25a', label: [366, 164], at: [204, 166] },
    { id: 'stigma', name: 'stigma', d: ell(200, 112, 18, 10), fill: '#c46a2f', label: [366, 104], at: [214, 108] },
    { id: 'filament', name: 'filament', d: many(rect(148, 132, 8, 92), rect(244, 132, 8, 92)), fill: '#e2d9a8', label: [34, 238], at: [152, 216] },
    { id: 'anther', name: 'anther', d: many(ell(152, 124, 13, 9), ell(248, 124, 13, 9)), fill: '#e0a52c', label: [34, 116], at: [141, 121] },
  ],
};

// particle arrangements: deterministic positions
function particles() {
  const circles = [];
  const add = (x, y) => circles.push(ell(x, y, 13, 13));
  for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) add(47 + c * 29, 52 + r * 29); // solid: regular, touching
  const liquid = [[232, 168], [260, 170], [288, 166], [316, 168], [344, 169], [370, 165], [246, 143], [274, 141], [303, 140], [331, 142], [358, 139], [236, 117], [264, 114], [292, 112], [321, 115], [349, 112], [256, 88], [285, 86], [334, 87]];
  liquid.forEach(([x, y]) => add(x, y));
  [[440, 50], [520, 75], [470, 120], [555, 150], [430, 165], [500, 170]].forEach(([x, y]) => add(x, y));
  return {
    id: 'particles', kind: 'diagram', viewBox: [0, 0, 600, 210], labelViewBox: [0, 0, 600, 250], labelSize: 23,
    features: [
      { id: 'solid', name: 'solid', d: rect(20, 20, 170, 170, 8), fill: '#f3eadb', label: [80, 228], at: [72, 190] },
      { id: 'liquid', name: 'liquid', d: rect(215, 20, 170, 170, 8), fill: '#f3eadb', label: [274, 228], at: [266, 190] },
      { id: 'gas', name: 'gas', d: rect(410, 20, 170, 170, 8), fill: '#f3eadb', label: [478, 228], at: [470, 190] },
    ],
    decor: [{ d: circles.join(''), fill: '#4f8fc0' }],
  };
}

// more labelled diagrams, one file per group: tools/content-src/diagrams/*.mjs, each exporting a list
const dir = new URL('./diagrams/', import.meta.url);
const more = [];
for (const f of readdirSync(dir).filter((x) => x.endsWith('.mjs')).sort()) more.push(...(await import(new URL(f, dir))).default);

export const DIAGRAMS = [animalCell, plantCell, flower, particles(), ...more];
const ids = DIAGRAMS.map((d) => d.id);
if (new Set(ids).size !== ids.length) throw new Error(`diagram ids must be unique: ${ids.join(', ')}`);
