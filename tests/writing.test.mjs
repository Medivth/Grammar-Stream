import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildDB } from '../js/core/content.js';
import { emptyState } from '../js/core/store.js';
import { pieceDue, nextPrompt, startPiece, submitPiece, piecesToMark, markPiece, unseenFeedback, currentPiece, wordCount, startBook, finishBook, currentBooks, logReading, readingThisWeek } from '../js/core/writing.js';

const root = new URL('../content/', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root)));
const db = buildDB(read('index.json').decks.map(read));

test('content: 12 writing tasks across six types, 30 ladder books on five rungs', () => {
  assert.equal(db.pieces.length, 12);
  assert.equal(new Set(db.pieces.map((p) => p.type)).size, 6);
  for (let r = 1; r <= 5; r++) assert.ok(db.ladder.filter((b) => b.rung === r).length >= 5, `rung ${r}`);
});

test('one piece a week, rotating types, waiting for needed topics', () => {
  const s = emptyState(100);
  assert.ok(pieceDue(s, 100));
  const types = [];
  let day = 100;
  for (let i = 0; i < 6; i++) {
    const prompt = nextPrompt(s, db);
    assert.ok(!(prompt.needsTopics || []).length, 'history essays wait until the topic is started');
    types.push(prompt.type);
    const p = startPiece(s, prompt, day);
    assert.equal(currentPiece(s), p);
    assert.ok(pieceDue(s, day), 'an unfinished piece stays due');
    submitPiece(p, day);
    assert.ok(!pieceDue(s, day + 3));
    day += 7;
    assert.ok(pieceDue(s, day));
  }
  assert.equal(new Set(types).size, types.length - 1, `types rotate: ${types}`);
  s.topics['history.1066'] = { state: 'learning' };
  const all = db.pieces.filter((p) => p.needsTopics?.includes('history.1066'));
  assert.ok(all.length);
});

test('marking flow: to mark, then unseen feedback for her', () => {
  const s = emptyState(1);
  const p = startPiece(s, nextPrompt(s, db), 1);
  p.text = 'One two three four.';
  assert.equal(wordCount(p.text), 4);
  submitPiece(p, 2);
  assert.deepEqual(piecesToMark(s), [p]);
  markPiece(p, { scores: [2, 1, 1, 2], worked: ' Great hook ', next: 'Vary sentence length' }, 3);
  assert.equal(piecesToMark(s).length, 0);
  assert.equal(unseenFeedback(s)[0].mark.worked, 'Great hook');
});

test('reading: current books and minutes this week', () => {
  const s = emptyState(1);
  const b = startBook(s, { bookId: 'book.holes', title: 'Holes' }, 10);
  logReading(s, 20, 10, b);
  logReading(s, 30, 12, b);
  logReading(s, 15, 2);
  assert.equal(readingThisWeek(s, 12), 50);
  finishBook(s, b, 14);
  assert.equal(currentBooks(s).length, 0);
});
