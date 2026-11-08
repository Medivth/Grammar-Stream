// The daily dressing-up allowance on the Badges page, and read-aloud starting off.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyState, serialize, deserialize, checksum } from '../js/core/store.js';
import { dressUpMinutes, dressUpUsed, dressUpLeft, addDressUp, minutesText, DRESSUP_DEFAULT_MINUTES } from '../js/core/dressup.js';

test('every child gets fifteen minutes of dressing up a day by default', () => {
  const st = emptyState(100);
  assert.equal(DRESSUP_DEFAULT_MINUTES, 15);
  assert.equal(dressUpMinutes(st.settings), 15);
  assert.equal(dressUpMinutes({}), 15, 'older saves without the setting get the default');
  assert.equal(dressUpLeft(st, 100), 15 * 60000);
});

test('time adds up through the day and runs out at the limit', () => {
  const st = emptyState(100);
  addDressUp(st, 100, 10 * 60000);
  addDressUp(st, 100, 4 * 60000);
  assert.equal(dressUpUsed(st, 100), 14 * 60000);
  assert.equal(dressUpLeft(st, 100), 60000);
  addDressUp(st, 100, 2 * 60000);
  assert.equal(dressUpLeft(st, 100), 0, 'never below zero');
});

test('a new day starts afresh', () => {
  const st = emptyState(100);
  addDressUp(st, 100, 15 * 60000);
  assert.equal(dressUpLeft(st, 101), 15 * 60000);
  addDressUp(st, 101, 60000);
  assert.deepEqual(st.dressUp, { day: 101, ms: 60000 });
});

test('a grown-up can change the allowance or remove it', () => {
  const st = emptyState(100);
  st.settings.dressUpMinutes = 5;
  assert.equal(dressUpLeft(st, 100), 5 * 60000);
  st.settings.dressUpMinutes = 0;
  assert.equal(dressUpLeft(st, 100), Infinity);
});

test('time left reads naturally', () => {
  assert.equal(minutesText(30000), 'less than a minute');
  assert.equal(minutesText(60000), '1 minute');
  assert.equal(minutesText(12.5 * 60000), '12 minutes');
});

test('read-aloud starts off for new children', () => {
  assert.equal(emptyState(1).settings.tts, false);
});

test('read-aloud is switched off once for children already on the device', () => {
  const data = { ...emptyState(1), settings: { ...emptyState(1).settings, tts: true } };
  const body = JSON.stringify(data);
  const v5 = JSON.stringify({ app: 'grammar-stream', schema_version: 5, saved_at: 1, checksum: checksum(body), data });
  assert.equal(deserialize(v5).data.settings.tts, false);
  // after that, a grown-up's choice is kept
  const on = emptyState(1); on.settings.tts = true;
  assert.equal(deserialize(serialize(on)).data.settings.tts, true);
});
