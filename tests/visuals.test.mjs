// Pictures: every visual in every course has the shape it needs, names a diagram that exists and a
// part that diagram has, and labelled diagrams keep their labels inside the drawing.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { visualErrors } from '../js/core/content.js';
import { PERIODS } from '../js/core/periods.js';

const read = (p) => JSON.parse(readFileSync(new URL(`../content/${p}`, import.meta.url)));
const INDEXES = ['index.json', 'index-ks1.json', 'index-y3.json', 'index-y8.json'];
const maps = read('index.json').maps;
const diagrams = Object.fromEntries(Object.entries(maps).map(([id, p]) => [id, read(p)]).filter(([, m]) => m.kind === 'diagram'));

function* allVisuals() {
  const seen = new Set();
  for (const idx of INDEXES) for (const p of read(idx).decks) {
    if (seen.has(p)) continue; seen.add(p);
    const d = read(p);
    for (const x of [...(d.topics || []), ...(d.items || [])]) if (x.visual) for (const v of [].concat(x.visual)) yield [x.id, v];
  }
}

test('the shape check catches broken visuals', () => {
  assert.deepEqual(visualErrors({ kind: 'cycle', steps: ['a', 'b', 'c'] }, 'x'), []);
  assert.equal(visualErrors({ kind: 'cycle', steps: ['a'] }, 'x').length, 1);
  assert.equal(visualErrors({ kind: 'sketch' }, 'x').length, 1);
  assert.equal(visualErrors([{ kind: 'timeline', from: 10, to: 5 }], 'x').length, 1);
});

test('every visual in every course is well formed and names real diagrams and parts', () => {
  for (const [id, v] of allVisuals()) {
    assert.deepEqual(visualErrors(v, id), [], id);
    if (v.kind === 'diagram') {
      assert.ok(diagrams[v.id], `${id}: no diagram ${v.id}`);
      if (v.highlight) assert.ok(diagrams[v.id].features.some((f) => f.id === v.highlight), `${id}: ${v.id} has no part ${v.highlight}`);
    }
    if (v.kind === 'timeline' && v.set) assert.ok(PERIODS[v.set], `${id}: no period set ${v.set}`);
    if (v.kind === 'timeline') for (const [y] of v.events || []) assert.ok(y >= v.from && y <= v.to && y !== 0, `${id}: event ${y} outside ${v.from}–${v.to} (and there is no year 0)`);
  }
});

test('labelled diagrams: every label has a point, and stays inside the frame drawn with labels', () => {
  for (const [id, m] of Object.entries(diagrams)) {
    const [x0, y0, w, h] = m.labelViewBox || m.viewBox;
    const ids = new Set();
    for (const f of m.features) {
      assert.ok(!ids.has(f.id), `${id}: part ${f.id} twice`); ids.add(f.id);
      assert.ok(f.name, `${id}: ${f.id} needs a name`);
      if (!f.label) continue;
      assert.ok(f.at, `${id}: ${f.id} label needs the point it names`);
      const [lx, ly] = f.label;
      assert.ok(lx >= x0 && lx <= x0 + w && ly >= y0 && ly <= y0 + h, `${id}: ${f.id} label outside the frame`);
    }
  }
});

test('the shared periods run in order without gaps or overlaps', () => {
  for (const [set, bands] of Object.entries(PERIODS)) {
    for (let i = 1; i < bands.length; i++) assert.equal(bands[i][0], bands[i - 1][1], `${set}: ${bands[i][2]} should start where ${bands[i - 1][2]} ends`);
  }
});

test('the gallery page and tool exist for checking pictures by eye', () => {
  assert.ok(existsSync(new URL('../tools/gallery.html', import.meta.url)));
});
