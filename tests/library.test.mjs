import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { buildIndex, bookFiles } from '../tools/build-library.mjs';
import { BOOKS, DIED } from '../tools/library/books.mjs';
import { parseXhtml } from '../tools/library/se.mjs';
import { buildSW } from '../tools/gen-precache.mjs';
import { emptyState } from '../js/core/store.js';
import { COURSES } from '../js/core/subjects.js';
import { validateBook, countWords, shelfFor, sameTitle, openBook, finishLibraryBook, creditReading, readingClock, place, setPlace, IDLE_MS, SESSION_CAP_MIN } from '../js/core/library.js';
import { readingThisWeek } from '../js/core/writing.js';

const lib = (f) => JSON.parse(readFileSync(new URL(`../library/${f}`, import.meta.url)));

test('every library book is valid and library/index.json is up to date', () => {
  const { books, errors } = buildIndex({ write: false });
  assert.deepEqual(errors, []);
  assert.equal(books.length, bookFiles().length);
  const index = lib('index.json');
  for (const b of index.books) {
    assert.deepEqual(Object.keys(b), ['id', 'title', 'author', 'year', 'kind', 'courses', 'level', 'blurb', 'words', 'chapters']);
    assert.ok(existsSync(new URL(`../library/${b.id}.json`, import.meta.url)), b.id);
  }
});

test('each course has a shelf of books, with both levels for the young courses', () => {
  const index = lib('index.json');
  for (const c of Object.keys(COURSES)) {
    const shelf = shelfFor(index, c);
    assert.ok(shelf.length >= 5, `${c}: ${shelf.length} books`);
    if (COURSES[c].young) {
      assert.ok(shelf.some((b) => b.level === 'read-together') && shelf.some((b) => b.level === 'on-my-own'), c);
      assert.equal(shelf[0].level, 'read-together', 'read-together books come first');
    }
  }
});

test('the original texts: one file per recipe, public domain in the UK and US, omissions listed', () => {
  const ids = new Set();
  for (const r of BOOKS) {
    assert.ok(!ids.has(r.id), `duplicate ${r.id}`);
    ids.add(r.id);
    const b = lib(`${r.id}.json`);
    assert.equal(b.kind, 'original');
    assert.ok(b.year < 1931, `${r.id}: published before 1931 (US public domain)`);
    assert.ok(DIED[r.id] && Object.values(DIED[r.id]).every((y) => y < 1956), `${r.id}: author and translator died before 1956`);
    assert.match(b.sourceUrl, /^https:\/\/standardebooks\.org\/ebooks\//);
    for (const o of r.omit || []) assert.ok(b.note.includes(o.title) && b.note.includes(o.reason), `${r.id}: note lists ${o.title}`);
    assert.ok(!b.chapters.some((c) => (r.omit || []).some((o) => c.title === o.title || c.part === o.title)), `${r.id}: omitted stories are really gone`);
    // nothing from the Standard Ebooks pages around the text
    assert.ok(!JSON.stringify(b.chapters).includes('Standard Ebooks'), `${r.id}: no SE colophon or imprint`);
    assert.ok(b.chapters.every((c) => c.paragraphs.length), r.id);
  }
  // the slur in "How the Leopard Got His Spots" is not in the library
  for (const f of bookFiles()) assert.ok(!/\bnigger/i.test(readFileSync(new URL(`../library/${f}`, import.meta.url), 'utf8')), f);
});

test('validateBook reports bad book files', () => {
  const good = { id: 'a-book', title: 'A', author: 'B', year: 1900, kind: 'original', courses: ['y6'], level: 'on-my-own', blurb: 'x', note: '', source: 'S', sourceUrl: 'https://example.org', words: 3, chapters: [{ title: 'One', paragraphs: ['Three little words.'] }] };
  assert.deepEqual(validateBook(good, { courses: ['y6'] }), []);
  const errs = (patch) => validateBook({ ...good, ...patch }, { courses: ['y6'] }).join('\n');
  assert.match(errs({ courses: ['y9'] }), /unknown course/);
  assert.match(errs({ chapters: [] }), /no chapters/);
  assert.match(errs({ chapters: [{ title: 'One', paragraphs: [] }] }), /empty/);
  assert.match(errs({ words: 4 }), /words is 4 but the text has 3/);
  assert.match(errs({ level: 'hard' }), /level/);
  assert.match(errs({ kind: 'retold' }), /retoldBy/);
  assert.match(errs({ chapters: [{ title: 'One', paragraphs: ['He said "hi" to me.'] }], words: 5 }), /straight double quote/);
  assert.match(validateBook(good, { courses: ['y6'], file: 'other.json' }).join(), /file name/);
  assert.equal(countWords([{ paragraphs: ['Mr. McGregor’s *cabbage*-patch, a—b'] }]), 5);
});

test('Standard Ebooks XHTML becomes headings and plain paragraphs', () => {
  const src = `<html><head><title>x</title></head><body epub:type="bodymatter z3998:fiction">
    <section id="chapter-1" epub:type="chapter"><hgroup><h2 epub:type="z3998:ordinal z3998:roman">I</h2><p epub:type="title">The <i>Start</i></p></hgroup>
    <figure><img alt="A picture" src="x.jpg"/></figure>
    <p>“Hello,” said <abbr epub:type="z3998:name-title">Mr.</abbr> Fox, <i>very</i> loudly.<a href="endnotes.xhtml#note-1" epub:type="noteref">1</a></p>
    <blockquote epub:type="z3998:verse"><p><span>Twinkle, twinkle,</span>
      <br/><span class="i1">little star&#8288;—</span></p></blockquote>
    <hr/><p>The end &amp; more.</p></section></body></html>`;
  const { bodyType, events } = parseXhtml(src);
  assert.ok(bodyType.includes('bodymatter'));
  assert.deepEqual(events.map((e) => (e.t === 'h' ? e.parts : e.text)), [['I', 'The Start'], '“Hello,” said Mr. Fox, *very* loudly.', 'Twinkle, twinkle,\nlittle star—', '* * *', 'The end & more.']);
  assert.deepEqual(events[1].sections, ['chapter-1']);
});

test('opening a library book puts it in Reading now once; finishing it moves it to finished', () => {
  const s = emptyState(100);
  const entry = { id: 'potter-peter-rabbit', title: 'The Tale of Peter Rabbit', author: 'Beatrix Potter' };
  const b = openBook(s, entry, 100);
  openBook(s, entry, 101);
  assert.equal(s.books.length, 1);
  assert.deepEqual({ bookId: b.bookId, title: b.title, startDay: b.startDay, endDay: b.endDay }, { bookId: entry.id, title: entry.title, startDay: 100, endDay: null });
  setPlace(s, entry.id, 2, 7.25);
  assert.deepEqual([place(s, entry.id).ch, place(s, entry.id).at], [2, 7.25]);
  finishLibraryBook(s, entry, 103);
  assert.equal(s.books[0].endDay, 103);
  assert.equal(place(s, entry.id).done, 103);
  openBook(s, entry, 104); // re-reading a finished book does not add it again
  assert.equal(s.books.length, 1);
});

test('reading time: whole minutes are logged, seconds carry over, today’s entry grows, a sitting is capped', () => {
  const s = emptyState(100);
  const entry = { id: 'aesop-fables', title: 'Aesop’s Fables', author: 'Aesop' };
  openBook(s, entry, 100);
  assert.equal(creditReading(s, entry, 90, 100, true), 1);
  assert.equal(place(s, entry.id).sec, 30);
  assert.equal(creditReading(s, entry, 40, 100, true), 1); // 30 + 40 = 70 s
  assert.equal(s.reading.length, 1, 'merged into today’s entry');
  assert.deepEqual({ ...s.reading[0] }, { day: 100, minutes: 2, title: 'Aesop’s Fables', solo: true, lib: 'aesop-fables' });
  creditReading(s, entry, 120, 100, false); // read together: a separate entry
  assert.equal(s.reading.length, 2);
  assert.equal(readingThisWeek(s, 100, { solo: true }), 2);
  creditReading(s, entry, 5 * 3600, 101, false);
  assert.ok(s.reading.at(-1).minutes <= SESSION_CAP_MIN);
});

test('the reading clock counts visible, active time only', () => {
  let t = 0;
  const c = readingClock(() => t);
  c.start();
  t = 60000; c.activity();
  t = 120000;
  assert.equal(c.take(), 120);
  c.visibility(false); t = 600000; c.visibility(true);
  t = 630000;
  assert.equal(c.take(), 30, 'hidden time not counted');
  t += IDLE_MS + 600000; // left the tablet on the sofa
  assert.equal(Math.round(c.take()), (IDLE_MS - 30000) / 1000, 'counts only up to the idle limit after the last activity');
  c.activity(); t += 10000;
  assert.equal(c.take(), 10);
});

test('ladder titles find their library books', () => {
  assert.ok(sameTitle('Frankenstein; or, The Modern Prometheus', 'Frankenstein'));
  assert.ok(sameTitle('Strange Case of Dr. Jekyll and Mr. Hyde', 'Strange Case of Dr Jekyll and Mr Hyde'));
  assert.ok(sameTitle('Alice’s Adventures in Wonderland', 'Alice’s Adventures in Wonderland'));
  assert.ok(!sameTitle('The Odyssey', 'The Odyssey (translated by Emily Wilson)'));
});

test('offline: the library index is precached, books are cached when opened', () => {
  const sw = buildSW();
  const files = JSON.parse(sw.match(/const FILES = (\[[\s\S]*?\]);/)[1]);
  assert.ok(files.includes('./library/index.json'));
  assert.ok(!files.some((f) => /library\/(?!index)/.test(f)), 'book files are not precached for every child');
  assert.match(sw, /gs-library-v1/);
  assert.ok(!'gs-library-v1'.startsWith('grammar-stream-'), 'the book cache survives app updates');
  const isBook = new Function(`return ${sw.match(/const isBook = (.*);/)[1]}`)();
  assert.ok(isBook(new URL('https://x.org/app/library/homer-odyssey.json')));
  assert.ok(!isBook(new URL('https://x.org/app/library/index.json')));
});
