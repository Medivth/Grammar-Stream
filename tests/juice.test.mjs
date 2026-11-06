// Answer reactions: runs of right answers, the progress track and the sound setting.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { currentRun, isRunMilestone, progressFraction, trackTheme, soundsOn, tryLine } from '../js/core/juice.js';
import { emptyState, serialize, deserialize } from '../js/core/store.js';

const r = (correct, t = 'review') => ({ t, correct });

test('a run counts the right answers at the end, and a miss resets it', () => {
  assert.equal(currentRun([]), 0);
  assert.equal(currentRun([r(true), r(true), r(true)]), 3);
  assert.equal(currentRun([r(true), r(false), r(true), r(true)]), 2);
  assert.equal(currentRun([r(true), r(true), r(false)]), 0);
});

test('diagnostic questions neither add to a run nor end one', () => {
  assert.equal(currentRun([r(true), r(true), r(false, 'diag'), r(true, 'diag'), r(true)]), 3);
});

test('runs are celebrated at 3, 5, 10 and every fifth after', () => {
  const hits = Array.from({ length: 31 }, (_, i) => i).filter(isRunMilestone);
  assert.deepEqual(hits, [3, 5, 10, 15, 20, 25, 30]);
});

test('progress runs from 0 at the first step to 1 at the finished screen, and never goes back after a re-ask', () => {
  assert.equal(progressFraction(null), 0);
  assert.equal(progressFraction({ pos: 0, steps: [1, 2, 3, 4, 5] }), 0);
  assert.equal(progressFraction({ pos: 2, steps: [1, 2, 3, 4, 5] }), 0.5);
  assert.equal(progressFraction({ pos: 4, steps: [1, 2, 3, 4, 5] }), 1);
  assert.equal(progressFraction({ pos: 9, steps: [1, 2] }), 1);
  assert.equal(progressFraction({ pos: 0, steps: [1] }), 0);
  // a wrong answer inserts a second try further on: the next step is still further along
  for (let len = 2; len < 40; len++) {
    for (let pos = 0; pos < len - 1; pos++) {
      const before = progressFraction({ pos, steps: Array(len) });
      const after = progressFraction({ pos: pos + 1, steps: Array(len + 1) });
      assert.ok(after >= before, `${pos}/${len}`);
    }
  }
});

test('each course has its own race', () => {
  assert.equal(trackTheme('ks1'), 'race');
  assert.equal(trackTheme('y3'), 'race');
  assert.equal(trackTheme('y6'), 'rocket');
  assert.equal(trackTheme('y8'), 'chariot');
});

test('sounds start on except for Year 8, and a choice always wins', () => {
  const s = emptyState(1).settings;
  assert.equal(s.sounds, null);
  for (const c of ['ks1', 'y3', 'y6']) assert.equal(soundsOn(s, c), true, c);
  assert.equal(soundsOn(s, 'y8'), false);
  assert.equal(soundsOn({}, 'y6'), true); // older saves have no sounds field
  assert.equal(soundsOn(undefined, 'y8'), false);
  assert.equal(soundsOn({ sounds: false }, 'ks1'), false);
  assert.equal(soundsOn({ sounds: true }, 'y8'), true);
  assert.equal(deserialize(serialize(emptyState(1))).data.settings.sounds, null);
});

test('the companion’s words after a wrong answer are kind and never mention losing anything', () => {
  for (const young of [true, false]) {
    for (let n = 0; n < 8; n++) {
      const line = tryLine(n, young);
      assert.ok(line.length > 10);
      assert.doesNotMatch(line, /lost|fail|wrong|bad|streak/i);
    }
  }
});
