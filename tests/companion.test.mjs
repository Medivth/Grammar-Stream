// The companion: a capybara, a lion or (Year 8) a heroine, wearing one accessory per slot.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { capybaraSVG, wornList, toggleWear, speciesOf, speciesChoices, ACCESSORIES, SLOT, SLOT_GROUPS, slotOf, SPECIES, LOOKS, lookThumb, COMPANION_FACTS, companionNoun } from '../js/ui/capybara.js';
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

test('every accessory draws on every companion, alone and combined', () => {
  for (const species of Object.keys(SPECIES)) {
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

test('every course has a full wardrobe, and every reward and starter is a real accessory', async () => {
  const { COURSES } = await import('../js/core/subjects.js');
  const { MILESTONES, KS1_MILESTONES, Y3_MILESTONES, wardrobeAccessories } = await import('../js/core/progress.js');
  for (const list of [MILESTONES, KS1_MILESTONES, Y3_MILESTONES]) for (const m of list) if (m.unlock) assert.ok(ACCESSORIES[m.unlock], `${m.id} unlocks ${m.unlock}`);
  for (const id of Object.keys(COURSES)) {
    setCourse(id);
    for (const a of COURSES[id].starter) assert.ok(ACCESSORIES[a], `${id} starter ${a}`);
    assert.ok(wardrobeAccessories().size >= 20, `${id}: ${wardrobeAccessories().size} accessories`);
  }
  setCourse('y6');
  assert.equal(SLOT.shield, 'hand');
  const both = capybaraSVG({ species: 'lion', wear: { head: 'knight', back: 'cape', hand: 'shield', ride: 'scooter' } });
  assert.ok(both.includes('#c8913a') && both.includes('#d62f3a'), 'shield and cape drawn together');
});

/** Tags balance, attributes are quoted, and no number came out as NaN or undefined. */
function svgErrors(svg) {
  const errs = [];
  if (/NaN|undefined|Infinity|null/.test(svg)) errs.push('NaN, null or undefined in the markup');
  const stack = [];
  for (const [tag, close, name, attrs, self] of svg.matchAll(/<(\/?)([a-zA-Z]+)([^>]*?)(\/?)>/g)) {
    if (/=\s*[^"\s]/.test(attrs.replace(/="[^"]*"/g, ''))) errs.push(`unquoted attribute in ${tag}`);
    if (close) { if (stack.pop() !== name) errs.push(`unbalanced </${name}>`); } else if (!self) stack.push(name);
  }
  if (stack.length) errs.push(`unclosed ${stack.join(', ')}`);
  return errs;
}
const OUTFITS = {
  centurion: { head: 'galea', body: 'lorica', hand: 'scutum', hold: 'gladius', back: 'cloak' },
  hoplite: { head: 'corinthian', body: 'linothorax', hand: 'aspis', hold: 'dory' },
  scholar: { head: 'olive', body: 'himation', hold: 'scroll' },
  roman: { head: 'laurel', body: 'toga', hold: 'olivebranch', front: 'medal' },
  charioteer: { head: 'olive', body: 'chiton', hold: 'torch', ride: 'chariot' },
  everything: { head: 'racehelmet', face: 'mask', body: 'stola', front: 'scarf', back: 'wings', hold: 'lyre', hand: 'shield', ride: 'skateboard' },
  // Years 2 and 3
  knight: { head: 'knight', body: 'armour', hold: 'sword', hand: 'crestshield', back: 'cape', ride: 'horse' },
  racer: { head: 'racehelmet', face: 'goggles', body: 'racesuit', front: 'medal', hold: 'flag', ride: 'gokart' },
  astronaut: { head: 'astronaut', body: 'spacesuit', back: 'jetpack', hold: 'saturn', friend: 'alien', ride: 'rocket' },
  superhero: { face: 'mask', body: 'herosuit', back: 'cape', hand: 'heroshield', hold: 'trophy', friend: 'alien' },
  dinosaur: { head: 'dinohood', hold: 'fossilhammer', friend: 'babydino', ride: 'dinoride' },
  // Year 6
  artist: { head: 'beret', front: 'scarf', hand: 'palette', hold: 'paintbrush', friend: 'cat', ride: 'rollerskates' },
  explorer: { head: 'sunhat', front: 'camera', hold: 'telescope', friend: 'fox', ride: 'bicycle' },
  scientist: { head: 'headband', face: 'goggles', hold: 'microscope', back: 'backpack', friend: 'cat' },
  reader: { head: 'flowercrown', body: 'stola', hold: 'book', friend: 'fox', ride: 'pony' },
  musician: { head: 'laurel', body: 'toga', hold: 'violin', hand: 'scutum', ride: 'pony' },
};

test('the heroine: every look and mood, every accessory, and full Greek and Roman outfits draw well-formed SVG', () => {
  assert.ok(Object.keys(LOOKS).length >= 6 && Object.keys(LOOKS).length <= 8);
  assert.equal(new Set(Object.values(LOOKS).map((l) => l.label)).size, Object.keys(LOOKS).length, 'look labels are unique');
  for (const look of Object.keys(LOOKS)) {
    for (const mood of ['neutral', 'happy', 'thinking', 'oops']) {
      const svg = capybaraSVG({ species: 'heroine', look, mood });
      assert.deepEqual(svgErrors(svg), [], `${look} ${mood}`);
      assert.match(svg, /aria-label="Heroine"/);
    }
    assert.match(lookThumb(look), /viewBox="68 4 64 64"/);
    assert.notEqual(capybaraSVG({ species: 'heroine', look }), capybaraSVG({ species: 'heroine', look: look === 'braid' ? 'bun' : 'braid' }), `${look} looks different`);
  }
  // dressed by default, in a tunic that the clothes replace
  assert.match(capybaraSVG({ species: 'heroine' }), /#3f7f99/);
  assert.doesNotMatch(capybaraSVG({ species: 'heroine', accessory: 'toga' }), /#3f7f99/);
  // a fur choice from an animal does not break her, and an unknown look falls back
  assert.deepEqual(svgErrors(capybaraSVG({ species: 'heroine', fur: 'cocoa', look: 'nonsense' })), []);
  for (const species of Object.keys(SPECIES)) {
    for (const id of Object.keys(ACCESSORIES)) assert.deepEqual(svgErrors(capybaraSVG({ species, accessory: id, look: 'puff' })), [], `${species} ${id}`);
    for (const [name, wear] of Object.entries(OUTFITS)) {
      const svg = capybaraSVG({ species, wear, mood: 'happy' });
      assert.deepEqual(svgErrors(svg), [], `${species} ${name}`);
      for (const id of Object.values(wear)) assert.notEqual(svg, capybaraSVG({ species, wear: { ...wear, [slotOf(id)]: undefined }, mood: 'happy' }), `${species} ${name}: ${id} shows`);
    }
  }
});

test('slots: every accessory has one, every slot is in a wardrobe group, and outfits combine one per slot', () => {
  const grouped = SLOT_GROUPS.flatMap(([, slots]) => slots);
  assert.equal(new Set(grouped).size, grouped.length, 'each slot in one group');
  for (const id of Object.keys(ACCESSORIES)) if (id !== 'none') assert.ok(grouped.includes(slotOf(id)), `${id} is in a group`);
  for (const slot of Object.values(SLOT)) assert.ok(grouped.includes(slot), slot);
  assert.equal(new Set(Object.values(ACCESSORIES)).size, Object.keys(ACCESSORIES).length, 'labels are unique');
  const sensible = { dinohood: 'head', beret: 'head', sunhat: 'head', flowercrown: 'head', headband: 'head', camera: 'front', racesuit: 'body', spacesuit: 'body', herosuit: 'body', armour: 'body', heroshield: 'hand', crestshield: 'hand', palette: 'hand', flag: 'hold', trophy: 'hold', saturn: 'hold', fossilhammer: 'hold', sword: 'hold', paintbrush: 'hold', telescope: 'hold', microscope: 'hold', book: 'hold', violin: 'hold', alien: 'friend', babydino: 'friend', cat: 'friend', fox: 'friend', gokart: 'ride', rocket: 'ride', dinoride: 'ride', horse: 'ride', pony: 'ride', bicycle: 'ride', rollerskates: 'ride', galea: 'head', olive: 'head', chiton: 'body', himation: 'body', toga: 'body', stola: 'body', lorica: 'body', linothorax: 'body', scutum: 'hand', aspis: 'hand', shield: 'hand', gladius: 'hold', xiphos: 'hold', dory: 'hold', lyre: 'hold', scroll: 'hold', olivebranch: 'hold', torch: 'hold', cloak: 'back', chariot: 'ride' };
  for (const [id, slot] of Object.entries(sensible)) assert.equal(slotOf(id), slot, id);
  let c = {};
  for (const id of Object.values(OUTFITS.centurion)) c = toggleWear(c, id);
  assert.deepEqual(wornList(c).sort(), Object.values(OUTFITS.centurion).sort());
  c = toggleWear(c, 'toga'); // replaces the armour
  c = toggleWear(c, 'aspis'); // replaces the scutum
  c = toggleWear(c, 'scroll'); // replaces the gladius
  assert.deepEqual(wornList(c).sort(), ['aspis', 'cloak', 'galea', 'scroll', 'toga']);
  // layering on the heroine: cloak behind her, armour over her, then the helmet, then the shield in front
  const svg = capybaraSVG({ species: 'heroine', wear: OUTFITS.centurion });
  const at = (colour) => svg.indexOf(colour);
  assert.ok(at('#9e1f1f') < at('#b9c1cb'), 'cloak before armour');
  assert.ok(at('#b9c1cb') < at('#c4302b'), 'armour before the helmet crest');
  assert.ok(at('#c4302b') < svg.lastIndexOf('#b3261e'), 'shield last');
});

test('Year 8 offers the heroine; the other courses keep their animals', async () => {
  const { COURSES } = await import('../js/core/subjects.js');
  assert.deepEqual(speciesChoices(COURSES.y8), ['capybara', 'lion', 'heroine']);
  for (const id of ['y6', 'ks1', 'y3']) assert.ok(!speciesChoices(COURSES[id]).includes('heroine'), id);
  for (const sp of Object.keys(SPECIES)) {
    assert.ok(COMPANION_FACTS[sp]?.length >= 7, `${sp} has facts`);
    assert.ok(COMPANION_FACTS[sp].every((f) => /^[A-Z].*[.]$/.test(f) && f.length < 160), `${sp} facts are short sentences`);
  }
  assert.equal(companionNoun('heroine'), 'heroine');
  assert.equal(companionNoun('lion'), 'lion');
  assert.equal(companionNoun(undefined), 'capybara');
  assert.equal(speciesOf({ species: 'heroine' }, true), 'heroine');
});

test('Year 8 unlocks: a generous Greek and Roman starter set, the best pieces earned, earlier rewards unchanged', async () => {
  const { COURSES } = await import('../js/core/subjects.js');
  const { MILESTONES, Y8_MILESTONES, milestoneDefs, wardrobeAccessories, unlockedAccessories } = await import('../js/core/progress.js');
  // what the existing badges unlock must never change: she may already have earned them
  assert.deepEqual(Object.fromEntries(MILESTONES.filter((m) => m.unlock).map((m) => [m.id, m.unlock])), {
    'first-mastered': 'sunglasses', hundred: 'headphones', 'all-rounder': 'beanie', globetrotter: 'explorer', 'time-traveller': 'pirate', 'lab-ready': 'goggles', stretch: 'crown', typist: 'starglasses', 'speed-reader': 'wings', paper: 'bowtie', sprinter: 'jetpack', 'joined-up': 'surfboard', wordsmith: 'wizard', bookworm: 'backpack', calibrated: 'owl', regular: 'medal', 'five-hundred': 'gradcap',
  });
  setCourse('y8');
  const defs = milestoneDefs();
  assert.equal(new Set(defs.map((m) => m.id)).size, defs.length, 'badge ids are unique');
  assert.ok(Y8_MILESTONES.length >= 3 && Y8_MILESTONES.length <= 5);
  for (const m of Y8_MILESTONES) {
    assert.ok(defs.includes(m), `${m.id} is a Year 8 badge`);
    assert.ok(ACCESSORIES[m.unlock], `${m.id} unlocks ${m.unlock}`);
    assert.ok(!COURSES.y8.starter.includes(m.unlock), `${m.unlock} is earned, not free`);
  }
  const classical = ['chiton', 'himation', 'toga', 'stola', 'linothorax', 'lorica', 'aspis', 'scutum', 'dory', 'xiphos', 'gladius', 'lyre', 'scroll', 'olivebranch', 'torch', 'olive', 'galea', 'cloak', 'chariot'];
  const all = wardrobeAccessories();
  for (const id of classical) assert.ok(all.has(id), `Year 8 can get the ${id}`);
  assert.ok(classical.filter((id) => COURSES.y8.starter.includes(id)).length >= 10, 'most are free from the start');
  // nothing earned yet: the starters are open, the armour is not
  const empty = { sessions: [], topics: {}, cards: {}, log: [], typing: {}, speed: [], papers: [], sprints: [], pieces: [], books: [] };
  const db = { topics: {}, items: {}, topicOrder: {}, itemsByTopic: {}, timeline: { periods: [], events: [] } };
  const open = unlockedAccessories(empty, db);
  assert.ok(open.has('toga') && open.has('dory') && !open.has('lorica') && !open.has('galea'));
  // the Centurion badge counts different days practised
  const days = { ...empty, sessions: Array.from({ length: 120 }, (_, i) => ({ day: 1000 + Math.floor(i / 1.2), completed: true })) };
  assert.ok(unlockedAccessories(days, db).has('lorica'));
  for (const id of ['y6', 'ks1', 'y3']) {
    setCourse(id);
    assert.ok(!milestoneDefs().some((m) => Y8_MILESTONES.includes(m)), `${id} has no Year 8 badges`);
    // Year 6 shares the Roman pieces (she learns Latin), but not the Greek ones; the younger courses have neither
    const roman = id === 'y6' ? ['toga', 'stola', 'scroll', 'scutum', 'gladius', 'olivebranch', 'galea', 'lorica', 'chariot', 'laurel'] : [];
    assert.ok(![...wardrobeAccessories()].some((a) => classical.includes(a) && ![...roman, 'laurel', 'corinthian', 'shield'].includes(a)), `${id}: no Greek pieces`);
    for (const a of roman) assert.ok(wardrobeAccessories().has(a), `${id} can get the ${a}`);
  }
  setCourse('y6');
});

test('the heroine stands in every scene, in full outfits', async () => {
  const { SCENES, sceneSVG } = await import('../js/ui/scenes.js');
  for (const sc of SCENES) for (const wear of Object.values(OUTFITS)) {
    const svg = sceneSVG(sc.id, { species: 'heroine', look: 'curls', name: 'Io', wear }, { bob: true });
    assert.deepEqual(svgErrors(svg.replace(/<text[^]*?<\/text>/g, '')), [], sc.id);
    assert.match(svg, /aria-label="Io in the /);
  }
});

// what each course's wardrobe is meant to hold: the new themed sets, and who earns what
const YOUNG_NEW = ['racesuit', 'flag', 'trophy', 'gokart', 'spacesuit', 'saturn', 'alien', 'rocket', 'herosuit', 'heroshield', 'dinohood', 'fossilhammer', 'babydino', 'dinoride', 'armour', 'sword', 'crestshield', 'horse'];
const Y6_NEW = ['beret', 'palette', 'paintbrush', 'flowercrown', 'sunhat', 'headband', 'camera', 'telescope', 'microscope', 'book', 'violin', 'cat', 'fox', 'rollerskates', 'bicycle', 'pony'];
const emptyState = () => ({ sessions: [], topics: {}, cards: {}, log: [], typing: {}, speed: [], papers: [], sprints: [], pieces: [], books: [], talks: [], reading: [] });
const emptyDB = () => ({ topics: {}, items: {}, topicOrder: {}, itemsByTopic: {}, timeline: { periods: [], events: [] } });

test('Years 2/3 and Year 6 wardrobes: themed sets, fair starters, the best things earned with new badges, old rewards unchanged', async () => {
  const { COURSES } = await import('../js/core/subjects.js');
  const { MILESTONES, KS1_MILESTONES, Y3_MILESTONES, Y6_MILESTONES, milestoneDefs, wardrobeAccessories, unlockedAccessories } = await import('../js/core/progress.js');
  // the badges he may already have earned keep their rewards
  const was = { 'first-mastered': 'sunglasses', fifty: 'headphones', 'all-rounder': 'beanie', 'speed-racer': 'jetpack', typist: 'starglasses', explorer: 'explorer', 'time-traveller': 'knight', scientist: 'goggles', bookworm: 'backpack', paper: 'medal', regular: 'wings', hundred: 'gradcap', stretch: 'crown', 'book-talker': 'owl', 'own-reader': 'surfboard', author: 'bowtie' };
  for (const list of [KS1_MILESTONES, Y3_MILESTONES]) for (const [id, unlock] of Object.entries(was)) assert.equal(list.find((m) => m.id === id)?.unlock, unlock, id);
  assert.deepEqual(Object.fromEntries(Y3_MILESTONES.filter((m) => ['sprinter', 'year3-topics', 'three-hundred'].includes(m.id)).map((m) => [m.id, m.unlock])), { sprinter: 'pirate', 'year3-topics': 'wizard', 'three-hundred': 'scarf' });
  const youngNew = KS1_MILESTONES.filter((m) => !was[m.id] && m.id !== 'first-session');
  assert.ok(youngNew.length >= 3 && youngNew.length <= 5, `${youngNew.length} new Year 2 badges`);
  assert.ok(Y6_MILESTONES.length >= 3 && Y6_MILESTONES.length <= 5);
  for (const id of ['ks1', 'y3', 'y6']) {
    setCourse(id);
    const defs = milestoneDefs(), all = wardrobeAccessories(), starter = COURSES[id].starter;
    assert.equal(new Set(defs.map((m) => m.id)).size, defs.length, `${id}: badge ids are unique`);
    assert.equal(new Set(starter).size, starter.length, `${id}: no starter twice`);
    const rewards = defs.filter((m) => m.unlock).map((m) => m.unlock);
    assert.equal(new Set(rewards).size, rewards.length, `${id}: each reward is earned one way`);
    for (const m of defs) if (m.unlock) assert.ok(!starter.includes(m.unlock), `${id}: ${m.unlock} is earned, not free`);
    const mine = id === 'y6' ? Y6_NEW : YOUNG_NEW, theirs = id === 'y6' ? YOUNG_NEW : Y6_NEW;
    for (const a of mine) assert.ok(all.has(a), `${id} can get the ${a}`);
    for (const a of theirs) assert.ok(!all.has(a), `${id} does not show the ${a}`);
    const free = mine.filter((a) => starter.includes(a)).length;
    assert.ok(free >= mine.length * 0.6 && free < mine.length, `${id}: ${free} of ${mine.length} new things are free from the start`);
    for (const a of ['horse', 'rocket', 'dinoride', 'trophy', 'herosuit', 'pony', 'chariot', 'galea', 'lorica', 'laurel']) if (all.has(a)) assert.ok(!starter.includes(a), `${id}: the ${a} is earned`);
    // nothing earned: only the starters are open
    assert.deepEqual([...unlockedAccessories(emptyState(), emptyDB())].sort(), [...starter].sort());
  }
  // the new badges measure what they say
  setCourse('ks1');
  const db = { ...emptyDB(), topics: { 'science.space': { subject: 'science' }, 'science.explore': { subject: 'science' }, 'science.dinosaurs': { subject: 'science' }, 'science.rocks': { subject: 'science' }, 'history.castles': { subject: 'history' }, 'history.romans': { subject: 'history' }, 'history.fire': { subject: 'history' }, 'history.egypt': { subject: 'history' } } };
  const secure = (ids) => Object.fromEntries(ids.map((t) => [t, { state: 'proficient' }]));
  const st = { ...emptyState(), topics: secure(['science.space', 'science.explore', 'history.castles', 'history.romans', 'history.fire']), sprints: [{ correct: 25 }] };
  let open = unlockedAccessories(st, db);
  assert.ok(open.has('rocket') && open.has('trophy') && !open.has('horse') && !open.has('dinoride'));
  open = unlockedAccessories({ ...st, topics: { ...st.topics, ...secure(['history.egypt', 'science.dinosaurs', 'science.rocks']) } }, db);
  assert.ok(open.has('horse') && open.has('dinoride') && !open.has('herosuit'));
  setCourse('y3');
  assert.ok(unlockedAccessories({ ...emptyState(), pieces: Array.from({ length: 8 }, () => ({ submittedDay: 3 })) }, db).has('herosuit'));
  setCourse('y6');
  const latin = Object.fromEntries(Array.from({ length: 5 }, (_, i) => [`latin.t${i}`, { subject: 'latin' }]));
  const db6 = { ...emptyDB(), topics: latin, items: Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`latin.i${i}`, { topic: `latin.t${i % 5}` }])) };
  const cards = Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`latin.i${i}`, { state: 'review', s: 3 }]));
  open = unlockedAccessories({ ...emptyState(), topics: secure(Object.keys(latin)), cards, sprints: [{ correct: 30 }], pieces: Array.from({ length: 10 }, () => ({ submittedDay: 1 })), sessions: Array.from({ length: 40 }, (_, i) => ({ day: 100 + i, completed: true })) }, db6);
  for (const a of ['galea', 'lorica', 'laurel', 'chariot', 'pony']) assert.ok(open.has(a), `Year 6 earns the ${a}`);
  assert.ok(!unlockedAccessories({ ...emptyState(), sessions: Array.from({ length: 39 }, (_, i) => ({ day: 100 + i, completed: true })) }, db6).has('pony'));
  // Year 6's existing badges are the main ones, unchanged
  assert.ok(MILESTONES.every((m) => milestoneDefs().includes(m)));
});

test('rides carry the companion: it stays in the 200×160 box with its feet, wheels or hooves on the ground', async () => {
  const { MOUNTS } = await import('../js/ui/capybara.js');
  for (const [id, M] of Object.entries(MOUNTS)) {
    assert.equal(SLOT[id], 'ride', id);
    for (const species of Object.keys(SPECIES)) {
      const [k, tx, ty] = M.seat[species];
      // the companion's own drawing reaches from about y -2 (the tallest hats) to its feet at y 150
      assert.ok(k > 0.5 && k <= 1 && tx >= 0 && tx + 200 * k <= 204 && ty - 2 * k >= -2.5 && ty + 150 * k <= 150, `${id} ${species}: seat ${M.seat[species]}`);
      const svg = capybaraSVG({ species, accessory: id, fit: true });
      assert.deepEqual(svgErrors(svg), [], `${species} ${id}`);
      assert.equal((svg.match(/<svg/g) || []).length, 1, `${species} ${id}: one svg`);
      assert.equal((svg.match(/opacity=".08"/g) || []).length, 1, `${species} ${id}: one shadow`);
      assert.match(svg, new RegExp(`aria-label="${SPECIES[species]}"`));
    }
  }
  // a friend rides along, and the companion keeps its other things on
  const svg = capybaraSVG({ species: 'lion', wear: { head: 'knight', hold: 'sword', friend: 'cat', ride: 'horse' } });
  assert.ok(svg.includes('#9aa3ad') && svg.includes('#d4a64a') && svg.includes('#a9b1bb'), 'cat, sword and helmet');
  assert.match(capybaraSVG({ species: 'heroine', accessory: 'horse', fit: true }), /viewBox="0 0 200 160"/, 'the heroine is not cropped on a horse');
  assert.match(capybaraSVG({ species: 'heroine', accessory: 'rollerskates', fit: true }), /viewBox="30 0 140 160"/);
});
