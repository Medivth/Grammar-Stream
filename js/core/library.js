// The library of free books: shelf, validation, reading place and reading-time helpers (pure).
// Book files live in library/<id>.json; library/index.json lists them (see tools/build-library.mjs).

import { startBook, finishBook, logReading } from './writing.js';

export const LEVELS = { 'read-together': 'Read together', 'on-my-own': 'On my own' };
export const KINDS = ['original', 'retold'];

/** Words as the library counts them: runs of letters/digits, with ’ ' and - inside a word. */
export const wordsIn = (text) => (String(text).replace(/\*/g, '').match(/[\p{L}\p{N}][\p{L}\p{N}’'\-]*/gu) || []).length;
export const countWords = (chapters) => chapters.reduce((n, c) => n + c.paragraphs.reduce((m, p) => m + wordsIn(p), 0), 0);

/** Problems with one book file; empty when it is good. */
export function validateBook(b, { courses, file } = {}) {
  const e = [];
  const where = file || b?.id || '?';
  const str = (k) => { if (typeof b[k] !== 'string' || !b[k].trim()) e.push(`${where}: ${k} missing`); };
  if (!b || typeof b !== 'object') return [`${where}: not an object`];
  ['id', 'title', 'author', 'blurb', 'source'].forEach(str);
  if (typeof b.note !== 'string') e.push(`${where}: note must be a string (empty if nothing left out)`);
  if (typeof b.sourceUrl !== 'string') e.push(`${where}: sourceUrl must be a string`);
  if (b.id && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(b.id)) e.push(`${where}: id "${b.id}" should be lower-case words joined by hyphens`);
  if (file && b.id && file !== `${b.id}.json`) e.push(`${where}: file name should be ${b.id}.json`);
  if (!Number.isInteger(b.year) || b.year > 2100) e.push(`${where}: year should be a whole number`);
  if (!KINDS.includes(b.kind)) e.push(`${where}: kind should be original or retold`);
  if (b.kind === 'retold' && (typeof b.retoldBy !== 'string' || !b.retoldBy.trim())) e.push(`${where}: a retelling needs retoldBy`);
  if (b.kind === 'original' && !/^https:\/\//.test(b.sourceUrl || '')) e.push(`${where}: an original needs its sourceUrl`);
  if (!LEVELS[b.level]) e.push(`${where}: level should be read-together or on-my-own`);
  if (!Array.isArray(b.courses) || !b.courses.length) e.push(`${where}: courses missing`);
  else for (const c of b.courses) if (courses && !courses.includes(c)) e.push(`${where}: unknown course "${c}"`);
  if (!Array.isArray(b.chapters) || !b.chapters.length) e.push(`${where}: no chapters`);
  else {
    b.chapters.forEach((c, i) => {
      if (!c || typeof c.title !== 'string' || !c.title.trim()) e.push(`${where}: chapter ${i + 1} has no title`);
      if (!Array.isArray(c?.paragraphs) || !c.paragraphs.length) e.push(`${where}: chapter ${i + 1} (${c?.title}) is empty`);
      else c.paragraphs.forEach((p, j) => {
        if (typeof p !== 'string' || !p.trim()) e.push(`${where}: chapter ${i + 1} paragraph ${j + 1} is empty`);
        else if (/["]/.test(p)) e.push(`${where}: chapter ${i + 1} paragraph ${j + 1} has a straight double quote (use “ ”)`);
      });
    });
    const n = countWords(b.chapters.filter((c) => Array.isArray(c?.paragraphs)));
    if (b.words !== n) e.push(`${where}: words is ${b.words} but the text has ${n} (run node tools/build-library.mjs)`);
  }
  return e;
}

/** The index entry for a book. */
export const indexEntry = (b) => ({ id: b.id, title: b.title, author: b.author, year: b.year, kind: b.kind, courses: b.courses, level: b.level, blurb: b.blurb, words: b.words, chapters: b.chapters.length });

/** Books on this course's shelf: read-together first for the young courses, then by length. */
export function shelfFor(index, courseId) {
  const order = (b) => (b.level === 'read-together' ? 0 : 1);
  return (index?.books || []).filter((b) => b.courses.includes(courseId)).sort((a, b) => order(a) - order(b) || a.words - b.words || a.title.localeCompare(b.title));
}

/** Is a reading-ladder title this library book? ("Frankenstein" is "Frankenstein; or, The Modern Prometheus".) */
export function sameTitle(a, b) {
  const norm = (t) => String(t).toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const main = (t) => norm(String(t).split(/[;:]/)[0]);
  return norm(a) === norm(b) || main(a) === norm(b) || norm(a) === main(b);
}

/** Minutes it takes to read, roughly, at a pace for the course. */
export const readingMinutes = (words, wpm) => Math.max(1, Math.round(words / wpm));

// --- the child's place in a book: state.library[id] = { ch, at, sec, opened, done, last, who } ---
// ch: chapter index; at: paragraph index at the top of the screen plus the fraction scrolled past it;
// sec: reading seconds not yet logged; who: 'solo' | 'together' when the child has chosen.
export function place(state, id) {
  state.library ||= {};
  return (state.library[id] ||= { ch: 0, at: 0, sec: 0, opened: null, done: null });
}

export function setPlace(state, id, ch, at) {
  const p = place(state, id);
  p.ch = ch;
  p.at = Math.max(0, Math.round((+at || 0) * 1000) / 1000); // paragraph index + how far through it
  return p;
}

/** Opening a library book puts it in "Reading now" (once), like choosing it from the ladder. */
export function openBook(state, entry, today) {
  const p = place(state, entry.id);
  p.opened ??= today;
  let b = state.books.find((x) => x.bookId === entry.id && !x.endDay);
  if (!b && !state.books.some((x) => x.bookId === entry.id && x.endDay)) b = startBook(state, { bookId: entry.id, title: entry.title, author: entry.author }, today);
  return b || state.books.find((x) => x.bookId === entry.id) || null;
}

export function finishLibraryBook(state, entry, today) {
  const p = place(state, entry.id);
  p.done = today;
  let b = state.books.find((x) => x.bookId === entry.id && !x.endDay);
  if (!b && !state.books.some((x) => x.bookId === entry.id)) b = startBook(state, { bookId: entry.id, title: entry.title, author: entry.author }, today);
  if (b) finishBook(state, b, today);
  return b;
}

// --- reading time ---------------------------------------------------------------------
export const SESSION_CAP_MIN = 45; // one sitting counts for at most this long
export const IDLE_MS = 4 * 60 * 1000; // no scroll, tap or key for this long: the reader has wandered off

/**
 * Credit reading time for a book: seconds carry over between sittings and whole minutes go into
 * the reading log (merged into today's entry for the same book), so short visits add up.
 * Returns the minutes logged now.
 */
export function creditReading(state, entry, seconds, today, solo = false) {
  if (!(seconds > 0)) return 0;
  const p = place(state, entry.id);
  const total = (p.sec || 0) + Math.min(seconds, SESSION_CAP_MIN * 60);
  const minutes = Math.floor(total / 60);
  p.sec = Math.round(total - minutes * 60);
  if (!minutes) return 0;
  const title = state.books.find((x) => x.bookId === entry.id)?.title || entry.title;
  const last = state.reading.findLast?.((r) => r.lib === entry.id) ?? [...state.reading].reverse().find((r) => r.lib === entry.id);
  if (last && last.day === today && !!last.solo === !!solo) last.minutes += minutes;
  else {
    logReading(state, minutes, today, { title }, solo);
    state.reading[state.reading.length - 1].lib = entry.id;
  }
  return minutes;
}

/**
 * A stopwatch for time spent reading: it runs only while the page is visible and the reader has
 * done something in the last IDLE_MS. `now` is injectable for tests.
 */
export function readingClock(now = () => Date.now()) {
  let ms = 0, since = null, lastActive = now(), visible = true;
  const settle = () => {
    if (since == null) return;
    const t = now();
    const until = Math.min(t, lastActive + IDLE_MS);
    if (until > since) ms += until - since;
    since = visible && t - lastActive < IDLE_MS ? t : null;
  };
  return {
    start() { lastActive = now(); since = visible ? now() : null; },
    activity() { settle(); lastActive = now(); if (visible && since == null) since = now(); },
    visibility(v) { settle(); visible = v; if (v) { lastActive = now(); since = now(); } else since = null; },
    /** Seconds counted so far, and reset. */
    take() { settle(); const s = ms / 1000; ms = 0; return s; },
  };
}
