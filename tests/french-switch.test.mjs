// Year 8 swapped Computing for French: accent-tolerant French marking, and old Computing prizes kept.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { check } from '../js/core/checkers.js';
import { COURSES, setCourse } from '../js/core/subjects.js';
import { emptyState } from '../js/core/store.js';
import { wonCardRewards } from '../js/core/cards.js';
import { buildDB } from '../js/core/content.js';

test('Year 8 learns French instead of Computing', () => {
  const ids = COURSES.y8.subjects.map((s) => s.id);
  assert.ok(ids.includes('french') && !ids.includes('computing'));
  assert.ok(COURSES.y8.placement.includes('french') && !COURSES.y8.placement.includes('computing'));
});

test('French typed answers: accents are forgiven with a note, wrong endings never are', () => {
  const q = { kind: 'typed', answer: 'été', lang: 'fr' };
  assert.equal(check(q, 'été').correct, true);
  const r = check(q, 'ete');
  assert.ok(r.correct && r.near && /accents/.test(r.message));
  assert.equal(check(q, 'etait').correct, false);
  const v = { kind: 'typed', answer: 'tu manges', lang: 'fr' };
  assert.equal(check(v, 'tu mange').correct, false, 'no one-letter slip in French');
  assert.equal(check({ kind: 'typed', answer: "j'aime", lang: 'fr' }, 'j’aime').correct, true);
  assert.equal(check({ kind: 'typed', answer: 'le cœur', lang: 'fr' }, 'le coeur').correct, true);
  // English answers keep their old one-slip tolerance
  assert.equal(check({ kind: 'typed', answer: 'Napoleon' }, 'Napolean').correct, true);
});

test('a prize won with a Computing card set stays won after Computing is gone', () => {
  setCourse('y8');
  const db = buildDB([]);
  const s = emptyState(1);
  assert.deepEqual(wonCardRewards(s, db).acc, []);
  s.cardSets = { '8c-data': 5, '8c-python': 6 };
  assert.deepEqual(new Set(wonCardRewards(s, db).acc), new Set(['cat', 'astronaut']));
});
