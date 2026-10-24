// Choice questions must not give the answer away by length: across each subject the correct
// option should be the longest about as often as chance, and rarely by a clear margin.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildDB } from '../js/core/content.js';

const read = (p) => JSON.parse(readFileSync(new URL(`../content/${p}`, import.meta.url)));
const strip = (t) => String(t ?? '').replace(/\*\*|\{\{|\}\}|`/g, '').replace(/_/g, '');

for (const idx of ['index.json', 'index-ks1.json', 'index-y3.json', 'index-y8.json']) {
  test(`${idx}: the correct option is not usually the longest`, () => {
    const db = buildDB(read(idx).decks.map(read));
    const by = {};
    for (const it of Object.values(db.items)) {
      let opts;
      if (it.kind === 'mcq' && !it.options.some((o) => o.weight != null)) opts = it.options.map((o) => [strip(o.text).length, o.correct]);
      else if (it.kind === 'fact' && it.distractors?.length && (!it.formats || it.formats.includes('choice'))) opts = [[strip(it.answer).length, true], ...it.distractors.map((d) => [strip(d).length, false])];
      else continue;
      if (opts.length < 3 || opts.filter((o) => o[1]).length !== 1) continue;
      const c = opts.find((o) => o[1])[0], maxWrong = Math.max(...opts.filter((o) => !o[1]).map((o) => o[0]));
      const b = (by[it.subject] ||= { n: 0, longest: 0, clearly: 0, chance: 0 });
      b.n++; b.chance += 1 / opts.length;
      if (c > maxWrong) b.longest++;
      if (c > maxWrong * 1.3 && c - maxWrong >= 8) b.clearly++;
    }
    for (const [subject, b] of Object.entries(by)) {
      if (b.n < 40) continue;
      const pct = (x) => Math.round((100 * x) / b.n);
      assert.ok(pct(b.clearly) <= 8, `${subject}: correct option clearly longest in ${pct(b.clearly)}% of ${b.n}`);
      assert.ok(pct(b.longest) <= pct(b.chance) + 12, `${subject}: correct option longest in ${pct(b.longest)}% (chance ${pct(b.chance)}%)`);
    }
  });
}
