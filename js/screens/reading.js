// Reading: current books, minutes log, and the five-rung reading ladder.

import { h, mount, toast } from '../ui/dom.js';
import { currentBooks, startBook, finishBook, logReading, readingThisWeek } from '../core/writing.js';
import { talkForDay, logTalk, talkedToday, talksThisWeek, TALK_KINDS } from '../core/booktalk.js';
import { COURSE } from '../core/subjects.js';
import { shelfFor, place, LEVELS, readingMinutes, sameTitle } from '../core/library.js';
import { loadLibrary } from './book.js';

// rough silent-reading pace for the time estimates on the shelf
const PACE = { ks1: 70, y3: 90, y6: 170, y8: 220 };
const aboutTime = (words) => {
  const m = readingMinutes(words, PACE[COURSE.id] || 150);
  return m < 60 ? `about ${m} min` : `about ${Math.round(m / 60)} hour${Math.round(m / 60) === 1 ? '' : 's'}`;
};

export function readingScreen(app) {
  const { state, db } = app;
  const today = app.today();
  const current = currentBooks(state);
  const finished = state.books.filter((b) => b.endDay);
  const rung = state.settings.readingRung || 1;
  const reading = new Set(state.books.map((b) => b.bookId).filter(Boolean));

  // young readers say whether they read on their own, which is what "reads independently" means
  const solo = COURSE.young ? state.settings.readSolo !== false : false;
  const soloSwitch = () => h('div', { class: 'row', role: 'group', 'aria-label': 'Who read?' }, [[true, 'On my own'], [false, 'Together']].map(([v, label]) =>
    h('button', { class: v === solo ? 'btn-primary' : 'btn-ghost', 'aria-pressed': String(v === solo), onclick: () => { state.settings.readSolo = v; app.save(); readingScreen(app); } }, label)));
  const logRow = (book) => h('div', { class: 'stack', style: { gap: '8px' } }, COURSE.young ? soloSwitch() : null, h('div', { class: 'row' }, [10, 20, 30, 45].map((m) => h('button', { class: 'btn-ghost', onclick: () => {
    logReading(state, m, today, book, solo);
    app.save();
    toast(`${m} minutes of ${book ? book.title : 'reading'} logged${solo ? ': read on your own!' : '.'}`);
    readingScreen(app);
  } }, `+${m} min`))));

  // the library: free books to read right here, for this course
  const shelfEl = h('div', { class: 'card stack' });
  const libBook = (id) => app.library?.books.find((b) => b.id === id);
  const renderShelf = (index) => {
    const books = shelfFor(index, COURSE.id);
    shelfEl.replaceChildren(h('h2', {}, 'Library: books you can read here'),
      h('p', { class: 'muted', style: { margin: 0 } }, COURSE.young ? 'Free books to read in the app. “Read together” books are for sharing with your grown-up; “On my own” books are ones you can try by yourself.'
        : 'Classic books, free to read in the app. Each one keeps your place, and works offline once you have opened it.'),
      books.length ? h('div', { class: 'shelf' }, books.map((b) => {
        const pl = state.library?.[b.id];
        const status = pl?.done ? 'Finished ✓' : pl?.opened != null ? `Chapter ${Math.min(pl.ch + 1, b.chapters)} of ${b.chapters}` : null;
        return h('a', { class: 'shelf-book', href: `#/book/${encodeURIComponent(b.id)}` },
          h('span', { class: 'shelf-title' }, b.title),
          h('span', { class: 'muted small' }, `${b.author}, ${b.year < 0 ? `${-b.year} BC` : b.year}`),
          h('span', { class: 'shelf-chips' },
            COURSE.young ? h('span', { class: `chip ${b.level === 'read-together' ? 'proficient' : 'mastered'}` }, LEVELS[b.level]) : null,
            b.kind === 'retold' ? h('span', { class: 'chip stretch' }, 'Retold') : null,
            h('span', { class: 'chip' }, aboutTime(b.words))),
          h('span', { class: 'small shelf-blurb' }, b.blurb),
          status ? h('span', { class: `small shelf-status${pl?.done ? ' done' : ''}` }, status) : null);
      })) : h('p', { class: 'muted' }, index ? 'No library books for this course yet.' : 'The library could not load. Connect to the internet once, and it will be here offline after that.'));
  };
  if (app.library) renderShelf(app.library);
  else {
    shelfEl.append(h('h2', {}, 'Library: books you can read here'), h('p', { class: 'muted' }, 'Opening the library…'));
    // once it has loaded, draw the page again so the ladder can point to books in the library too
    loadLibrary(app).then(() => { if (location.hash === '#/reading' && shelfEl.isConnected) { if (app.library) readingScreen(app); else renderShelf(null); } });
  }

  // book talk is about the book read most recently
  const recency = (b) => (b.bookId && state.library?.[b.bookId]?.last) || b.startDay * 864e5;
  const talkBook = current.slice().sort((a, b) => recency(b) - recency(a))[0];

  // three things to chat about with a grown-up, from the book being read
  const talked = talkedToday(state, today);
  const talkCard = (book) => h('div', { class: 'card stack' },
    h('h2', {}, 'Book talk'),
    h('p', { class: 'muted', style: { margin: 0 } }, `Chat about ${book ? book.title : 'your book'} with your grown-up. Pick one question (or all three!). Good readers explain their ideas with clues from the book.`),
    talkForDay(today).map((q) => h('div', { class: 'stack', style: { gap: '6px', borderTop: '1px solid var(--line)', paddingTop: '10px' } },
      h('div', {}, h('span', { class: 'chip' }, TALK_KINDS[q.kind])),
      h('p', { class: 'learn', style: { margin: 0 } }, q.text),
      h('div', {}, talked.has(q.id) ? h('span', { class: 'chip mastered' }, 'Talked ✓')
        : h('button', { class: 'btn-ghost', onclick: () => { logTalk(state, today, q.id, book); app.save(); toast('Great talking! Your grown-up will love that.'); readingScreen(app); } }, 'We talked about it')))),
    h('p', { class: 'muted small', style: { margin: 0 } }, `Book talks this week: ${talksThisWeek(state, today)}`));

  const titleIn = h('input', { type: 'text', placeholder: 'Title', 'aria-label': 'Book title' });
  const authorIn = h('input', { type: 'text', placeholder: 'Author (optional)', 'aria-label': 'Author' });

  const rungBooks = (r) => db.ladder.filter((b) => b.rung === r);
  const here = (b) => shelfFor(app.library, COURSE.id).find((x) => sameTitle(x.title, b.title));
  const bookCard = (b) => h('div', { class: 'topic-row' },
    h('div', { class: 'title' }, h('div', { style: { fontWeight: 700 } }, b.title), h('div', { class: 'muted small' }, `${b.author}, ${b.year}. ${b.note}${here(b) ? ' Free in the library above.' : b.free ? ' Free on Project Gutenberg.' : ''}`)),
    here(b) ? h('button', { class: 'btn-ghost', onclick: () => app.go(`#/book/${encodeURIComponent(here(b).id)}`) }, 'Read it here')
      : reading.has(b.id) ? h('span', { class: 'chip mastered' }, state.books.find((x) => x.bookId === b.id)?.endDay ? 'Read' : 'Reading')
      : h('button', { class: 'btn-ghost', onclick: () => { startBook(state, { bookId: b.id, title: b.title, author: b.author }, today); app.save(); readingScreen(app); } }, 'I’m reading this'));

  mount(app.root,
    h('div', { class: 'topbar' }, h('button', { class: 'btn-icon', 'aria-label': 'Back', onclick: () => app.go('#/home') }, '←'), h('h1', {}, 'My reading')),
    h('div', { class: 'narrow stack' },
      h('div', { class: 'card' }, h('p', { class: 'record', style: { margin: 0 } }, h('b', {}, String(readingThisWeek(state, today))), ' minutes read in the last 7 days'),
        COURSE.young ? h('p', { style: { margin: '6px 0 0' } }, h('b', {}, String(readingThisWeek(state, today, { solo: true }))), ' of them on your own') : null,
        h('p', { class: 'muted small', style: { margin: '6px 0 0' } }, 'Twenty minutes a day makes a huge difference, and it counts even when it’s a book you love re-reading.')),

      h('div', { class: 'card stack' }, h('h2', {}, 'Reading now'),
        current.length ? current.map((b) => h('div', { class: 'stack', style: { borderBottom: '1px solid var(--line)', paddingBottom: '12px' } },
          h('div', { class: 'row' }, h('div', { style: { flex: 1 } }, h('strong', {}, b.title), b.author ? h('span', { class: 'muted' }, ` by ${b.author}`) : null),
            b.bookId && libBook(b.bookId) ? h('button', { class: 'btn-ghost', onclick: () => app.go(`#/book/${encodeURIComponent(b.bookId)}`) }, 'Open') : null,
            h('button', { class: 'btn-primary', onclick: () => { finishBook(state, b, today); if (b.bookId && state.library?.[b.bookId]) place(state, b.bookId).done = today; app.save(); toast(`Finished ${b.title}! Brilliant.`); readingScreen(app); } }, 'Finished it!')),
          logRow(b)))
          : h('p', { class: 'muted' }, 'Open a book from the library below, pick one from the ladder, or add your own.'),
        h('details', {}, h('summary', { style: { cursor: 'pointer', fontWeight: 700 } }, 'Add a different book'),
          h('div', { class: 'stack', style: { marginTop: '10px' } }, titleIn, authorIn,
            h('button', { class: 'btn-ghost', onclick: () => {
              if (!titleIn.value.trim()) return toast('Type the title first.');
              startBook(state, { title: titleIn.value.trim(), author: authorIn.value.trim() }, today);
              app.save(); readingScreen(app);
            } }, 'Add it')))),

      shelfEl,

      COURSE.young ? talkCard(talkBook) : null,

      finished.length ? h('div', { class: 'card' }, h('h2', {}, `Books finished: ${finished.length}`), h('ul', {}, finished.slice().reverse().map((b) => h('li', {}, b.title)))) : null,

      h('div', { class: 'card stack' }, h('h2', {}, 'The reading ladder'),
        h('p', { class: 'muted' }, COURSE.young ? 'Climb the ladder one book at a time. Read some on your own, and share the bigger books with your grown-up. Try one book from a higher rung alongside books you love.'
          : 'Climbing the ladder gets you ready for secondary school, where you’ll read older books and a whole Shakespeare play. Try one book from a higher rung alongside books you love.'),
        ...[rung, Math.min(5, rung + 1)].filter((r, i, a) => a.indexOf(r) === i).map((r) => h('div', {}, h('h3', {}, `Rung ${r}: ${db.rungs[r - 1]}${r === rung ? ' (your level)' : ' (next step up)'}`), rungBooks(r).map(bookCard))),
        h('details', {}, h('summary', { style: { cursor: 'pointer', fontWeight: 700 } }, 'See the whole ladder'),
          [1, 2, 3, 4, 5].filter((r) => r !== rung && r !== rung + 1).map((r) => h('div', {}, h('h3', {}, `Rung ${r}: ${db.rungs[r - 1]}`), rungBooks(r).map(bookCard)))))));
}
