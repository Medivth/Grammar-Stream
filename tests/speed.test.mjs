// Speed reading: every question asked after a passage is about that passage.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildDB } from '../js/core/content.js';
import { speedPassages, passageTitle } from '../js/core/practice.js';

const read = (p) => JSON.parse(readFileSync(new URL(`../content/${p}`, import.meta.url)));

for (const idx of ['index.json', 'index-ks1.json', 'index-y3.json', 'index-y8.json']) {
  test(`${idx}: speed-reading questions match the passage shown`, () => {
    const db = buildDB(read(idx).decks.map(read));
    const ps = speedPassages(db, []);
    assert.ok(ps.length >= 10, `${ps.length} passages`);
    assert.equal(new Set(ps.map((p) => p.key)).size, ps.length, 'each passage has its own key');
    for (const p of ps) {
      assert.ok(p.items.length >= 3, `${p.key}: ${p.items.length} questions`);
      for (const it of p.items) assert.equal(it.passage.replace(/^\([^)]*\)\n\n/, ''), p.passage, `${it.id} is not about “${p.title}”`);
    }
  });
}

test('passage titles: a title line, or the opening words', () => {
  assert.equal(passageTitle('The Hare and the Tortoise\n\nA hare was always boasting…'), 'The Hare and the Tortoise');
  assert.equal(passageTitle('Fact file: Emperor penguins\n\nEmperor penguins are…'), 'Emperor penguins');
  assert.match(passageTitle('It was the best of times, it was the worst of times, it was the age of wisdom'), /…$/);
});
