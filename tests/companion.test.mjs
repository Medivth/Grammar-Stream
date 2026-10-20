// The companion: a capybara or a lion, wearing one accessory per slot.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { capybaraSVG, wornList, toggleWear, speciesOf, ACCESSORIES, SLOT } from '../js/ui/capybara.js';
import { setCourse } from '../js/core/subjects.js';

test('old saves with a single accessory still work; slots replace, toggle and clear', () => {
  assert.deepEqual(wornList({ accessory: 'racehelmet' }), ['racehelmet']);
  assert.deepEqual(wornList({ accessory: 'none' }), []);
  let c = { accessory: 'racehelmet' };
  c = toggleWear(c, 'skateboard');
  assert.deepEqual(wornList(c).sort(), ['racehelmet', 'skateboard']);
  c = toggleWear(c, 'crown'); // same slot as the helmet: replaces it
  assert.deepEqual(wornList(c).sort(), ['crown', 'skateboard']);
  c = toggleWear(c, 'cape');
  c = toggleWear(c, 'skateboard'); // tapping again takes it off
  assert.deepEqual(wornList(c).sort(), ['cape', 'crown']);
  c = toggleWear(c, 'none');
  assert.deepEqual(wornList(c), []);
  assert.equal(c.accessory, 'none');
});

test('the younger courses get a lion unless a species was chosen', () => {
  assert.equal(speciesOf({}, true), 'lion');
  assert.equal(speciesOf({}, false), 'capybara');
  assert.equal(speciesOf({ species: 'capybara' }, true), 'capybara');
  setCourse('ks1');
  assert.match(capybaraSVG({ name: 'Zoom' }), /aria-label="Lion"/);
  setCourse('y6');
  assert.match(capybaraSVG({}), /aria-label="Capybara"/);
});

test('every accessory draws on both animals, alone and combined', () => {
  for (const species of ['capybara', 'lion']) {
    for (const id of Object.keys(ACCESSORIES)) {
      const svg = capybaraSVG({ species, accessory: id });
      assert.ok(svg.startsWith('<svg') && svg.includes('</svg>') && !/undefined|NaN/.test(svg), `${species} ${id}`);
      if (id !== 'none') assert.ok(svg.length > capybaraSVG({ species }).length, `${species} ${id} draws something`);
    }
    const all = capybaraSVG({ species, wear: { head: 'racehelmet', face: 'mask', back: 'cape', front: 'scarf', ride: 'skateboard' } });
    assert.ok(!/undefined|NaN/.test(all));
  }
  assert.equal(SLOT.skateboard, 'ride');
});
