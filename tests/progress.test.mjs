import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildDB } from '../js/core/content.js';
import { emptyState } from '../js/core/store.js';
import { isKnown, learnedCount, subjectStats, timelineStatus, placesStatus, milestones, unlockedAccessories, planSummary } from '../js/core/progress.js';
import { planDay } from '../js/core/session.js';

const root = new URL('../content/', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root)));
const db = buildDB(read('index.json').decks.map(read));
const known = { state: 'review', s: 5, d: 5, lastDay: 1, due: 9, reps: 2 };

test('known means recalled at least once (or assumed by placement)', () => {
  assert.equal(isKnown(undefined), false);
  assert.equal(isKnown({ state: 'review', s: 0.2 }), false);
  assert.equal(isKnown({ state: 'review', s: 2.3 }), true);
  assert.equal(isKnown({ state: 'review', s: 1, assumed: true }), true);
});

test('timeline events light up from their linked questions', () => {
  const s = emptyState(1);
  assert.ok(db.timeline.events.length >= 20);
  assert.equal(timelineStatus(s, db).events.filter((e) => e.known).length, 0);
  s.cards['history.t.hastings'] = known;
  const ev = timelineStatus(s, db).events.find((e) => e.year === 1066);
  assert.equal(ev.known, true);
});

test('places: countries known from map or capital questions', () => {
  const s = emptyState(1);
  s.cards['geography.eu.fra'] = known;
  s.cards['geography.cap.deu'] = known;
  s.cards['geography.w.bra'] = known;
  const p = placesStatus(s, db);
  assert.deepEqual([...p.known.europe].sort(), ['DEU', 'FRA']);
  assert.ok(p.known.world.has('BRA'));
  assert.ok(p.totals.europe.size >= 40 && p.totals.world.size >= 30);
});

test('milestones and accessory unlocks are fixed and earned', () => {
  const s = emptyState(1);
  assert.equal(milestones(s, db).filter((m) => m.done).length, 0);
  assert.ok(!unlockedAccessories(s, db).has('headphones'));
  Object.keys(db.items).slice(0, 120).forEach((id) => (s.cards[id] = known));
  assert.equal(learnedCount(s), 120);
  assert.ok(milestones(s, db).find((m) => m.id === 'hundred').done);
  assert.ok(unlockedAccessories(s, db).has('headphones'));
  assert.ok(!unlockedAccessories(s, db).has('gradcap'));
  const st = subjectStats(s, db, 'english');
  assert.ok(st.known > 0 && st.total === db.topicOrder.english.length);
});

test('plan summary for the home screen', () => {
  const s = emptyState(20000);
  const parts = planSummary(planDay(s, db, 20000));
  assert.ok(parts.includes('level check'));
});
