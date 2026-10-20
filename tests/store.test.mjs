import { test } from 'node:test';
import assert from 'node:assert/strict';
import { serialize, deserialize, emptyState, SaveError, checksum } from '../js/core/store.js';

test('round trip', () => {
  const s = emptyState(20000);
  s.cards['geo.x'] = { s: 2.3, d: 5, due: 20003 };
  const back = deserialize(serialize(s)).data;
  assert.deepEqual(back, s);
});

test('rejects damaged, foreign and newer saves', () => {
  const txt = serialize(emptyState(1));
  const env = JSON.parse(txt);
  env.data.created = 2;
  assert.throws(() => deserialize(JSON.stringify(env)), /damaged/);
  assert.throws(() => deserialize('{"hello":1}'), SaveError);
  assert.throws(() => deserialize('not json'), SaveError);
  const newer = JSON.parse(txt);
  newer.schema_version = 99;
  assert.throws(() => deserialize(JSON.stringify(newer)), /newer/);
});

// a save exactly as version 1 of the app wrote it
function v1Save() {
  const d = emptyState(5);
  delete d.pieces; delete d.books; delete d.settings.readingRung;
  d.cards['english.sp.yacht'] = { state: 'review', s: 3, d: 5, lastDay: 4, due: 7 };
  const body = JSON.stringify(d);
  return JSON.stringify({ app: 'grammar-stream', schema_version: 1, saved_at: 1, checksum: checksum(body), data: d });
}

test('a real version 1 save upgrades to the current version without losing progress', () => {
  const { data, version } = deserialize(v1Save());
  assert.equal(version, 1);
  assert.deepEqual(data.pieces, []);
  assert.deepEqual(data.books, []);
  assert.equal(data.settings.readingRung, 1);
  assert.equal(data.cards['english.sp.yacht'].s, 3);
  assert.equal(data.settings.sessionMinutes, 25);
});

test('a save survives a schema bump through the migration chain', () => {
  const v1 = v1Save();
  const migrations = {
    1: (d) => ({ ...d, settings: { ...d.settings, theme: 'meadow' } }),
    2: (d) => ({ ...d, renamed: d.taught, taught: undefined }),
  };
  const { data } = deserialize(v1, { migrations, target: 3 });
  assert.equal(data.settings.theme, 'meadow');
  assert.deepEqual(data.renamed, []);
  assert.throws(() => deserialize(v1, { migrations: {}, target: 2 }), /No upgrade path/);
});
