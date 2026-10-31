// Scenes: every backdrop draws well-formed SVG, the companion stands in it, and scenes open with badges.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SCENES, SCENE_BY_ID, sceneSVG, sceneStatus, sceneOrder, FREE, PER_SCENE } from '../js/ui/scenes.js';
import { COURSES, setCourse } from '../js/core/subjects.js';
import { milestoneDefs } from '../js/core/progress.js';

/** Tags balance, attributes are quoted, and no number came out as NaN or undefined. */
function svgErrors(svg) {
  const errs = [];
  if (/NaN|undefined|Infinity/.test(svg)) errs.push('NaN or undefined in the markup');
  if (!svg.startsWith('<svg') || !svg.endsWith('</svg>')) errs.push('not one <svg> element');
  const stack = [];
  for (const [tag, close, name, attrs, self] of svg.matchAll(/<(\/?)([a-zA-Z]+)([^>]*?)(\/?)>/g)) {
    if (/=\s*[^"\s]/.test(attrs.replace(/="[^"]*"/g, ''))) errs.push(`unquoted attribute in ${tag}`);
    if (close) { if (stack.pop() !== name) errs.push(`unbalanced </${name}>`); } else if (!self) stack.push(name);
  }
  if (stack.length) errs.push(`unclosed ${stack.join(', ')}`);
  if (/<text/.test(svg)) errs.push('scenes carry no words');
  return errs;
}

test('every scene draws well-formed, compact SVG, alone and with either companion', () => {
  assert.ok(SCENES.length >= 10 && SCENES.length <= 12);
  assert.equal(new Set(SCENES.map((s) => s.id)).size, SCENES.length, 'ids are unique');
  for (const id of ['space', 'underwater']) assert.ok(SCENE_BY_ID[id], `has ${id}`);
  for (const sc of SCENES) {
    const plain = sceneSVG(sc.id);
    assert.deepEqual(svgErrors(plain), [], sc.id);
    assert.match(plain, new RegExp(`aria-label="${sc.name}"`));
    assert.ok(plain.length < 12000, `${sc.id} is ${plain.length} characters`);
    assert.equal(plain, sceneSVG(sc.id), `${sc.id} draws the same every time`);
    for (const species of ['lion', 'capybara']) {
      const svg = sceneSVG(sc.id, { species, name: 'Zoom', wear: { head: 'racehelmet', back: 'cape', ride: 'skateboard' } }, { bob: true });
      assert.deepEqual(svgErrors(svg.replace(/<text[^]*?<\/text>/g, '')), [], `${sc.id} with a ${species}`); // the helmet's number is the companion's
      assert.equal(svg.match(/<svg/g).length, 1, 'the companion is a group, not a nested <svg>');
      assert.match(svg, /aria-label="Zoom in the /);
    }
  }
  assert.equal(sceneSVG('nowhere'), '');
});

test('three scenes are free (the space station among them), then one more per badge', () => {
  for (const id of Object.keys(COURSES)) {
    setCourse(id);
    const order = sceneOrder();
    assert.deepEqual([...order].sort(), SCENES.map((s) => s.id).sort(), `${id}: every scene once`);
    const start = sceneStatus(0);
    assert.equal(start.filter((s) => s.open).length, FREE);
    assert.ok(start.find((s) => s.id === 'space').open, `${id}: space station is free`);
    assert.deepEqual(start.filter((s) => !s.open).map((s) => s.need), Array.from({ length: SCENES.length - FREE }, (_, i) => (i + 1) * PER_SCENE));
    // opening never goes backwards, and every scene can be earned with badges the course has
    let open = 0;
    for (let n = 0; n <= 20; n++) { const now = sceneStatus(n).filter((s) => s.open).length; assert.ok(now >= open); open = now; }
    const all = (SCENES.length - FREE) * PER_SCENE;
    assert.ok(all <= milestoneDefs().length - 3, `${id}: all scenes need ${all} of ${milestoneDefs().length} badges`);
    assert.ok(sceneStatus(all).every((s) => s.open && s.need === 0));
  }
  setCourse('ks1');
  assert.deepEqual(sceneStatus(0).filter((s) => s.open).map((s) => s.id), ['space', 'racetrack', 'underwater']);
  setCourse('y8');
  assert.deepEqual(sceneStatus(0).filter((s) => s.open).map((s) => s.id), ['space', 'underwater', 'temple']);
  assert.equal(sceneStatus(2).find((s) => s.id === 'jungle').need, 2);
  setCourse('y6');
});
