// Book talk questions and the "read on my own" reading log.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BOOK_TALK, TALK_KINDS, talkForDay, logTalk, talksThisWeek, talkedToday } from '../js/core/booktalk.js';
import { logReading, readingThisWeek } from '../js/core/writing.js';

test('the book talk bank is well formed', () => {
  assert.equal(new Set(BOOK_TALK.map((q) => q.id)).size, BOOK_TALK.length);
  for (const q of BOOK_TALK) assert.ok(TALK_KINDS[q.kind] && /[?.]$/.test(q.text), q.id);
});

test('each day offers a prediction, an inference and one more, and the set changes', () => {
  const days = Array.from({ length: 30 }, (_, d) => talkForDay(1000 + d));
  for (const [p, i, o] of days) {
    assert.equal(p.kind, 'predict'); assert.equal(i.kind, 'infer'); assert.ok(['link', 'words', 'think'].includes(o.kind));
  }
  assert.ok(new Set(days.map((d) => d.map((q) => q.id).join())).size > 10);
});

test('talks and solo reading are counted over the last week', () => {
  const state = { reading: [] };
  logTalk(state, 100, 'talk.1');
  logTalk(state, 92, 'talk.2');
  assert.equal(talksThisWeek(state, 100), 1);
  assert.deepEqual([...talkedToday(state, 100)], ['talk.1']);
  logReading(state, 20, 100, null, true);
  logReading(state, 30, 99, null);
  assert.equal(readingThisWeek(state, 100), 50);
  assert.equal(readingThisWeek(state, 100, { solo: true }), 20);
});
