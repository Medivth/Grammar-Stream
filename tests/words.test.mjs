// Word of the day: a list for each course, one word a day, and the ear muffs that go over a helmet.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { WORD_LISTS, wordOfDay } from '../js/core/words.js';
import { COURSES, setCourse } from '../js/core/subjects.js';
import { ACCESSORIES, slotOf, toggleWear, wornList, capybaraSVG } from '../js/ui/capybara.js';
import { starterAccessories } from '../js/core/progress.js';

test('every course has its own list of words, each with a meaning and an example using the word', () => {
  for (const c of Object.keys(COURSES)) {
    const list = WORD_LISTS[c];
    assert.ok(list?.length >= 50, `${c} has a good list`);
    assert.equal(new Set(list.map((x) => x.w)).size, list.length, `${c}: no repeats`);
    for (const x of list) {
      assert.ok(x.w && x.cls && x.mean && x.eg, `${c}: ${x.w} is complete`);
      assert.match(x.eg, /\*\*[^*]+\*\*/, `${c}: ${x.w}'s example shows the word in bold`);
      assert.ok(!/[.]$/.test(x.mean), `${c}: ${x.w}'s meaning has no full stop (the card adds one)`);
    }
  }
  // the older two learn where their words come from
  for (const c of ['y6', 'y8']) assert.ok(WORD_LISTS[c].every((x) => x.root), `${c}: every word has its root`);
  assert.equal(WORD_LISTS.ks1, WORD_LISTS.y3, 'Years 2 and 3 share his list');
});

test('one word a day, the same all day, a new one tomorrow, and the list comes round again', () => {
  const a = wordOfDay('y6', 20800), b = wordOfDay('y6', 20801);
  assert.equal(wordOfDay('y6', 20800), a);
  assert.notEqual(a.w, b.w);
  assert.equal(wordOfDay('y6', 20800 + WORD_LISTS.y6.length).w, a.w);
  assert.equal(wordOfDay('nope', 20800), null);
});

test('ear muffs go on over the ears, so they can be worn with the space helmet', () => {
  assert.equal(ACCESSORIES.earmuffs, 'Ear muffs');
  assert.equal(slotOf('earmuffs'), 'ears');
  let c = toggleWear({ wear: { head: 'astronaut' } }, 'earmuffs');
  assert.deepEqual(new Set(wornList(c)), new Set(['astronaut', 'earmuffs']), 'both are worn');
  c = toggleWear(c, 'racehelmet');
  assert.deepEqual(new Set(wornList(c)), new Set(['racehelmet', 'earmuffs']), 'a different helmet keeps the ear muffs on');
  for (const species of ['lion', 'hero', 'capybara', 'heroine']) {
    const plain = capybaraSVG({ species, wear: { ears: 'earmuffs' } });
    const helmet = capybaraSVG({ species, wear: { head: 'astronaut', ears: 'earmuffs' } });
    assert.ok(plain.includes('#f6f2ea') && helmet.includes('#f6f2ea'), `${species} wears them`);
    assert.notEqual(plain.replace(/[\s\S]*?#d62f3a/, ''), helmet.replace(/[\s\S]*?#d62f3a/, ''), `${species}: bigger, round the helmet's bubble`);
  }
  for (const course of Object.keys(COURSES)) { setCourse(course); assert.ok(starterAccessories().includes('earmuffs'), `${course}: free to wear`); }
});
