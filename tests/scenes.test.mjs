// Scenes: every backdrop draws well-formed SVG, the companion stands in it, and scenes open with badges.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SCENES, SCENE_BY_ID, sceneSVG, sceneStatus, sceneOrder, FREE } from '../js/ui/scenes.js';
import { COURSES, setCourse } from '../js/core/subjects.js';
import { milestoneDefs } from '../js/core/progress.js';

const CLASSICAL = ['colosseum', 'forum', 'theatre', 'olympus', 'trireme', 'atrium', 'delphi', 'baths'];
const FIRST = ['space', 'underwater', 'racetrack', 'city', 'dino', 'castle', 'jungle', 'arctic', 'volcano', 'rocket', 'temple', 'library'];
// added for the boy in Years 2 and 3, and for the girl in Year 6
const BOY = ['moon', 'mars', 'pitlane', 'herohq', 'museum', 'joust', 'pirate', 'deepsea', 'pyramids'];
const GIRL = ['pompeii', 'hadrian', 'observatory', 'glasshouse', 'studio', 'lab', 'blossom', 'aurora'];
// which scenes each course has
const WANT = {
  ks1: [...FIRST, ...BOY], y3: [...FIRST, ...BOY],
  y6: [...FIRST, ...CLASSICAL, ...GIRL, 'moon', 'pyramids'],
  y8: [...FIRST, ...CLASSICAL, 'pompeii', 'observatory', 'hadrian', 'aurora'],
};

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
  assert.ok(SCENES.length >= 10 && SCENES.length <= 40);
  assert.equal(new Set(SCENES.map((s) => s.id)).size, SCENES.length, 'ids are unique');
  assert.deepEqual(SCENES.map((s) => s.id).sort(), [...new Set([...FIRST, ...CLASSICAL, ...BOY, ...GIRL])].sort(), 'every scene is listed here');
  assert.equal(new Set(SCENES.map((s) => s.name)).size, SCENES.length, 'names are unique');
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

test('three scenes are free (the space station among them), then at least one more per badge', () => {
  for (const id of Object.keys(COURSES)) {
    setCourse(id);
    const order = sceneOrder();
    assert.equal(new Set(order).size, order.length, `${id}: no scene twice`);
    assert.ok(order.every((s) => SCENE_BY_ID[s]), `${id}: only real scenes`);
    // each course has the first twelve and its own: the boy's for Years 2/3, the classical world and the girl's for 6 and 8
    assert.deepEqual([...order].sort(), [...WANT[id]].sort(), `${id}: its scenes, each once`);
    // the new order's own pace (scenes kept open from the first release are tested below)
    const pace = (n) => sceneStatus(n, order, null);
    const start = pace(0);
    assert.equal(start.filter((s) => s.open).length, FREE);
    assert.ok(start.find((s) => s.id === 'space').open, `${id}: space station is free`);
    // each badge opens at least one scene (sometimes two), in order, until all are open
    const needs = start.filter((s) => !s.open).map((s) => s.need);
    assert.equal(needs[0], 1);
    needs.forEach((n, i) => i && assert.ok(n - needs[i - 1] === 0 || n - needs[i - 1] === 1, `${id}: ${needs}`));
    let open = 0;
    for (let n = 0; n <= 20; n++) { const now = pace(n).filter((s) => s.open).length; assert.ok(now >= open); open = now; }
    // every scene can be earned with badges the course has, with a few to spare
    const all = needs.at(-1);
    assert.ok(all <= milestoneDefs().length - 3, `${id}: all scenes need ${all} of ${milestoneDefs().length} badges`);
    assert.ok(pace(all).every((s) => s.open && s.need === 0));
    assert.ok(!pace(all - 1).every((s) => s.open));
  }
  // every scene is in some course
  const used = new Set(Object.keys(COURSES).flatMap((id) => { setCourse(id); return sceneOrder(); }));
  assert.deepEqual(SCENES.filter((s) => !used.has(s.id)), []);
  setCourse('ks1');
  assert.deepEqual(sceneStatus(0).filter((s) => s.open).map((s) => s.id), ['space', 'racetrack', 'underwater']);
  assert.equal(sceneStatus(2).find((s) => s.id === 'jungle').need, 4); // kept from the first release
  // the new scenes for Years 2/3 come early: the Moon base is the first one earned, and most of them within ten badges
  assert.equal(sceneOrder()[FREE], 'moon');
  assert.ok(sceneStatus(0).filter((s) => BOY.includes(s.id) && s.need <= 10).length >= 6);
  setCourse('y6');
  assert.equal(sceneOrder()[FREE], 'pompeii');
  assert.ok(sceneStatus(0).filter((s) => GIRL.includes(s.id) && s.need <= 10).length >= 6);
  setCourse('y8');
  assert.deepEqual(sceneStatus(0).filter((s) => s.open).map((s) => s.id), ['space', 'underwater', 'temple']);
  // the Colosseum is the first one earned, and the classical scenes take turns with the others
  assert.equal(sceneOrder()[FREE], 'colosseum');
  assert.equal(sceneStatus(0).find((s) => s.id === 'colosseum').need, 1);
  assert.ok(sceneOrder().slice(FREE, FREE + 10).filter((s) => CLASSICAL.includes(s)).length >= 4);
  assert.equal(sceneStatus(2).find((s) => s.id === 'jungle').need, 2); // it opened with 4 badges in the first release
  assert.deepEqual(sceneOrder().slice(-4), ['pompeii', 'observatory', 'hadrian', 'aurora']); // her new ones come at the end
  setCourse('y6');
});

test('a scene open under any released order never locks again', () => {
  // the first release: twelve scenes, one per badge
  const first = {
    young: ['space', 'racetrack', 'underwater', 'dino', 'city', 'castle', 'rocket', 'volcano', 'jungle', 'arctic', 'library', 'temple'],
    y8: ['space', 'underwater', 'temple', 'library', 'castle', 'arctic', 'jungle', 'volcano', 'rocket', 'city', 'dino', 'racetrack'],
    y6: ['space', 'underwater', 'library', 'castle', 'jungle', 'temple', 'arctic', 'volcano', 'rocket', 'city', 'dino', 'racetrack'],
  };
  // the second (Years 6 and 8): the classical world joined, 20 scenes, some opening in pairs
  const second = {
    y8: ['space', 'underwater', 'temple', 'colosseum', 'library', 'trireme', 'castle', 'forum', 'arctic', 'theatre', 'jungle', 'olympus', 'volcano', 'atrium', 'rocket', 'delphi', 'city', 'baths', 'dino', 'racetrack'],
    y6: ['space', 'underwater', 'library', 'castle', 'jungle', 'temple', 'colosseum', 'arctic', 'forum', 'volcano', 'trireme', 'rocket', 'atrium', 'city', 'theatre', 'olympus', 'dino', 'baths', 'delphi', 'racetrack'],
  };
  for (const course of ['ks1', 'y3', 'y8', 'y6']) {
    setCourse(course);
    const key = COURSES[course].young ? 'young' : course;
    for (let earned = 0; earned <= 20; earned++) {
      const now = sceneStatus(earned), open = new Set(now.filter((x) => x.open).map((x) => x.id));
      first[key].forEach((id, i) => { if (earned >= Math.max(0, i - 2)) assert.ok(open.has(id), `${course}: ${id} with ${earned} badges`); });
      if (second[key]) sceneStatus(earned, second[key], null).forEach((x) => { if (x.open) assert.ok(open.has(x.id), `${course}: ${x.id} with ${earned} badges (second release)`); });
      // the badges a locked scene says it needs are exactly what opens it
      const at = (n, id) => sceneStatus(n).find((y) => y.id === id).open;
      for (const x of now) if (!x.open) assert.ok(at(earned + x.need, x.id) && !at(earned + x.need - 1, x.id), `${course}: ${x.id} opens after ${x.need} more`);
    }
  }
  setCourse('y6');
});
