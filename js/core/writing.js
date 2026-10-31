// Weekly extended writing, written reading answers and the reading log: pure state helpers.

import { recordTopicAttempt } from './mastery.js';

// Writing types rotate in this order; each course uses the types its pieces have.
const TYPE_ORDER = ['narrative', 'history', 'viewpoint', 'science', 'analytical', 'geography', 'story', 'recount', 'instructions', 'letter', 'report', 'poem'];
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

/**
 * Rotate through writing types; skip tasks needing topics not started yet (Year 2 tasks build
 * on a text he has read). Null when nothing is ready.
 */
export function nextPrompt(state, db) {
  const used = new Set(state.pieces.map((p) => p.promptId));
  const ready = (p) => (p.needsTopics || []).every((t) => state.topics[t]);
  const types = TYPE_ORDER.filter((t) => db.pieces.some((p) => p.type === t));
  const lastType = db.pieceById[state.pieces[state.pieces.length - 1]?.promptId]?.type;
  const start = types.includes(lastType) ? types.indexOf(lastType) + 1 : 0;
  for (let i = 0; i < types.length; i++) {
    const type = types[(start + i) % types.length];
    const p = db.pieces.find((x) => x.type === type && !used.has(x.id) && ready(x));
    if (p) return p;
  }
  // everything used: start the cycle again with the least recent
  const lastUse = (p) => Math.max(-1, ...state.pieces.filter((x) => x.promptId === p.id).map((x) => x.startDay));
  return db.pieces.filter(ready).sort((a, b) => lastUse(a) - lastUse(b))[0] || null;
}

/** The prompt with his own superhero's name in place of {hero} (as in the Year 2 stories). */
export function filledPrompt(prompt, state) {
  if (!prompt) return prompt;
  const hero = state?.profile?.hero || 'Captain Comet';
  const fill = (t) => (typeof t === 'string' ? t.replaceAll('{hero}', hero) : t);
  return { ...prompt, title: fill(prompt.title), task: fill(prompt.task), text: fill(prompt.text), starter: fill(prompt.starter), borrow: prompt.borrow?.map(fill) };
}

/** Year 3 aims a little higher than Year 2 on the same task. */
export const pieceWords = (prompt, courseId) => (courseId === 'y3' && prompt.wordsY3) || prompt.words;

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

/** Scores are 0-2 per rubric line; null for a line not marked (handwriting on a typed piece). */
export function markPiece(piece, { scores, worked, next }, today) {
  piece.mark = { scores, worked: worked.trim(), next: next.trim(), day: today };
  piece.seen = false;
}

export function markTotal(mark) {
  const marked = mark.scores.filter((s) => s != null);
  return { got: marked.reduce((a, b) => a + b, 0), out: marked.length * 2 };
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

// solo: read on their own (rather than together with a grown-up)
export function logReading(state, minutes, today, book = null, solo = false) {
  state.reading.push({ day: today, minutes, title: book?.title ?? null, ...(solo ? { solo: true } : {}) });
}

export function readingThisWeek(state, today, { solo = false } = {}) {
  return state.reading.filter((r) => r.day > today - 7 && (!solo || r.solo)).reduce((a, r) => a + r.minutes, 0);
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
