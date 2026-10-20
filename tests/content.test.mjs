import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildDB, validateDB } from '../js/core/content.js';
import { GENERATORS } from '../js/gen/index.js';
import { present } from '../js/core/present.js';
import { check, correctResponse, checkSentence } from '../js/core/checkers.js';
import { emptyState } from '../js/core/store.js';
import { makeRng } from '../js/core/rng.js';
import { buildAll } from '../tools/build-content.mjs';
import { assertWellFormed } from './generators.test.mjs';

const root = new URL('../content/', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root)));
const index = read('index.json');
const db = buildDB(index.decks.map(read));
const maps = Object.fromEntries(Object.entries(index.maps).map(([k, p]) => [k, read(p)]));

test('committed content JSON matches its sources', async () => {
  const files = await buildAll();
  for (const [path, text] of Object.entries(files)) {
    assert.equal(readFileSync(new URL(path, root), 'utf8'), text, `${path} is stale: run node tools/build-content.mjs`);
  }
});

test('content passes structural validation', () => {
  const errs = validateDB(db, GENERATORS);
  assert.deepEqual(errs, []);
});

test('every subject has topics and a sensible amount of content', () => {
  for (const s of ['english', 'maths', 'history', 'geography', 'science']) {
    assert.ok(db.topicOrder[s]?.length >= 5, `${s} topics`);
  }
  assert.ok(Object.keys(db.items).length > 350, `total items ${Object.keys(db.items).length}`);
});

test('every item can be presented in every format and its own answer is accepted', () => {
  const state = emptyState(20000);
  const rng = makeRng('content');
  for (const item of Object.values(db.items)) {
    const formats = item.kind === 'fact' ? (item.formats || ['choice', 'cued', 'typed'])
      : item.kind === 'mapfact' ? (item.formats || ['choose', 'locate', 'name'])
        : item.kind === 'spell' ? ['cued', 'typed'] : [undefined];
    for (const format of formats) {
      const reps = item.kind === 'template' ? 30 : 3;
      for (let i = 0; i < reps; i++) {
        const q = present(item, undefined, { db, state, rng, format });
        const label = `${item.id} [${format ?? q.kind}]`;
        if (item.kind === 'template') { assertWellFormed(q, label); continue; }
        assert.ok(q.prompt, `${label}: prompt`);
        if (q.kind === 'choice') {
          assert.ok(q.options.length >= 2, `${label}: options`);
          assert.equal(new Set(q.options.map((o) => o.text.toLowerCase())).size, q.options.length, `${label}: duplicate options`);
          if (!q.weighted) assert.equal(q.options.filter((o) => o.correct).length, 1, `${label}: one correct`);
        }
        assert.equal(check(q, correctResponse(q)).correct, true, `${label}: own answer accepted`);
      }
    }
  }
});

test('fact multiple-choice has 4 options wherever a topic has enough siblings', () => {
  const state = emptyState(20000);
  const rng = makeRng('four');
  for (const item of Object.values(db.items).filter((i) => i.kind === 'fact' || i.kind === 'mapfact')) {
    const q = present(item, undefined, { db, state, rng, format: item.kind === 'fact' ? 'choice' : 'choose' });
    if (q.kind !== 'choice') continue;
    const want = item.distractors?.length < 2 && !item.fill ? 1 + item.distractors.length : 3;
    assert.ok(q.options.length >= want, `${item.id}: only ${q.options.length} options`);
  }
});

test('every map item points at a real feature on its map layer', () => {
  for (const item of Object.values(db.items).filter((i) => i.kind === 'mapfact' || (i.kind === 'fact' && i.map))) {
    const m = maps[item.map];
    assert.ok(m, `${item.id}: map ${item.map}`);
    const layer = item.layer || 'features';
    const pool = layer === 'markers' ? m.markers : layer === 'countries' ? m.features : m[layer];
    assert.ok(pool?.some((f) => f.id === item.feature), `${item.id}: feature ${item.feature} not in ${item.map}.${layer}`);
  }
});

test('the English spelling deck is exactly the statutory Year 5/6 list', () => {
  const OFFICIAL = 'accommodate accompany according achieve aggressive amateur ancient apparent appreciate attached available average awkward bargain bruise category cemetery committee communicate community competition conscience conscious controversy convenience correspond criticise curiosity definite desperate determined develop dictionary disastrous embarrass environment equipment especially exaggerate excellent existence explanation familiar foreign forty frequently government guarantee harass hindrance identity immediately individual interfere interrupt language leisure lightning marvellous mischievous muscle necessary neighbour nuisance occupy occur opportunity parliament persuade physical prejudice privilege profession programme pronunciation queue recognise recommend relevant restaurant rhyme rhythm sacrifice secretary shoulder signature sincere soldier stomach sufficient suggest symbol system temperature thorough twelfth variety vegetable vehicle yacht'.split(' ');
  const words = Object.values(db.items).filter((i) => i.kind === 'spell' && i.subject === 'english').map((i) => i.word).sort();
  assert.equal(OFFICIAL.length, 100);
  assert.deepEqual(words, [...OFFICIAL].sort());
});

test('every sentence task model answer passes its own checks, and a lazy answer fails', () => {
  for (const s of db.sentences) {
    const r = checkSentence(s, s.model);
    assert.equal(r.correct, true, `${s.id}: model fails: ${r.failed.join('; ')}`);
    assert.equal(checkSentence(s, 'i dont know').correct, false, `${s.id}: lazy answer passes`);
  }
});
