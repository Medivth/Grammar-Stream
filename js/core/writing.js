// Weekly extended writing, written reading answers and the reading log: pure state helpers.

import { recordTopicAttempt } from './mastery.js';

const TYPE_ORDER = ['narrative', 'history', 'viewpoint', 'science', 'analytical', 'geography'];
export const PIECE_INTERVAL = 7;

export function currentPiece(state) {
  return state.pieces.find((p) => !p.submittedDay) || null;
}

/** A new piece is due when none has been started in the last week. */
export function pieceDue(state, today) {
  if (currentPiece(state)) return true;
  const last = state.pieces[state.pieces.length - 1];
  return !last || today - last.startDay >= PIECE_INTERVAL;
}

/** Rotate through writing types; skip tasks needing topics she hasn't started yet. */
export function nextPrompt(state, db) {
  const used = new Set(state.pieces.map((p) => p.promptId));
  const ready = (p) => (p.needsTopics || []).every((t) => state.topics[t]);
  const lastType = db.pieceById[state.pieces[state.pieces.length - 1]?.promptId]?.type;
  const start = lastType ? TYPE_ORDER.indexOf(lastType) + 1 : 0;
  for (let i = 0; i < TYPE_ORDER.length; i++) {
    const type = TYPE_ORDER[(start + i) % TYPE_ORDER.length];
    const p = db.pieces.find((x) => x.type === type && !used.has(x.id) && ready(x));
    if (p) return p;
  }
  // everything used: start the cycle again with the least recent
  return db.pieces.find(ready) || db.pieces[0];
}

export function startPiece(state, prompt, today) {
  const piece = { id: `${prompt.id}@${today}`, promptId: prompt.id, startDay: today, mode: null, plan: {}, text: '', checked: [], submittedDay: null, mark: null, seen: false };
  state.pieces.push(piece);
  return piece;
}

export const wordCount = (t) => (String(t || '').trim().match(/\S+/g) || []).length;

export function submitPiece(piece, today) {
  piece.submittedDay = today;
}

export function piecesToMark(state) {
  return state.pieces.filter((p) => p.submittedDay && !p.mark);
}

export function markPiece(piece, { scores, worked, next }, today) {
  piece.mark = { scores, worked: worked.trim(), next: next.trim(), day: today };
  piece.seen = false;
}

export function unseenFeedback(state) {
  return state.pieces.filter((p) => p.mark && !p.seen);
}

// --- reading
export function currentBooks(state) {
  return state.books.filter((b) => !b.endDay);
}

export function startBook(state, { bookId = null, title, author = '' }, today) {
  const b = { bookId, title, author, startDay: today, endDay: null };
  state.books.push(b);
  return b;
}

export function finishBook(state, book, today) {
  book.endDay = today;
}

export function logReading(state, minutes, today, book = null) {
  state.reading.push({ day: today, minutes, title: book?.title ?? null });
}

export function readingThisWeek(state, today) {
  return state.reading.filter((r) => r.day > today - 7).reduce((a, r) => a + r.minutes, 0);
}

// --- written reading answers -----------------------------------------------------------
export const ANSWER_LEVELS = ['Not yet', 'Getting there', 'Yes!'];

export function submitAnswer(state, itemId, text, today) {
  const a = { day: today, itemId, text, mark: null, seen: false };
  state.answers.push(a);
  return a;
}

export function answersToMark(state) {
  return state.answers.filter((a) => !a.mark);
}

/** The grown-up's verdict feeds the topic: a full "Yes!" counts as a correct attempt. */
export function markAnswer(state, answer, { score, note }, today, topicId) {
  answer.mark = { score, note: (note || '').trim(), day: today };
  if (topicId && state.topics[topicId]) state.topics[topicId] = recordTopicAttempt(state.topics[topicId], score === 2, today, { mixed: false });
}

export function unseenMarks(state) {
  return state.answers.filter((a) => a.mark && !a.seen);
}
