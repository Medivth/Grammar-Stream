// The reader for library books (#/book/<id>): chapters, comfortable type, size and light/dark,
// the place kept per book, read-aloud per paragraph on the young courses, and reading time logged
// while the page is actually being read.

import { h, mount, toast, escapeHTML } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { COURSE } from '../core/subjects.js';
import { speak, stopSpeaking, ttsAvailable } from '../platform/tts.js';
import { place, setPlace, openBook, finishLibraryBook, creditReading, readingClock, SESSION_CAP_MIN, LEVELS } from '../core/library.js';
import { noteChapter, CHAPTER_SECONDS } from '../core/quests.js';

const SIZES = [0.85, 0.95, 1, 1.1, 1.2, 1.35, 1.5, 1.7];
const bookCache = new Map();

/** library/index.json, fetched once per visit (the service worker keeps it for offline). */
export async function loadLibrary(app) {
  if (app.library) return app.library;
  try {
    const r = await fetch('library/index.json');
    if (!r.ok) throw new Error(r.status);
    app.library = await r.json();
  } catch {
    app.library = null;
  }
  return app.library || { books: [] };
}

async function loadBook(id) {
  if (bookCache.has(id)) return bookCache.get(id);
  const r = await fetch(`library/${encodeURIComponent(id)}.json`);
  if (!r.ok) throw new Error(`${r.status}`);
  const b = await r.json();
  bookCache.clear();
  bookCache.set(id, b);
  return b;
}

/** Book text: escape, then *italics*; line breaks are kept by CSS (verse). */
const paraHTML = (t) => escapeHTML(t).replace(/\*([^*\s][^*]*?)\*/g, '<em>$1</em>');
const sayable = (t) => t.replace(/\*/g, '').replace(/\n/g, ' ');

export async function bookScreen(app, id) {
  const { state } = app;
  const today = app.today();
  const index = await loadLibrary(app);
  const entry = index.books.find((b) => b.id === id);
  const back = () => app.go('#/reading');
  const topbar = (title, ...extra) => h('div', { class: 'topbar book-top' }, h('button', { class: 'btn-icon', 'aria-label': 'Back to my reading', onclick: back }, icon('back')), h('h1', { class: 'book-top-title' }, title), ...extra);
  if (!entry) {
    mount(app.root, topbar('Book'), h('div', { class: 'narrow card' }, h('p', {}, 'That book is not in the library.'), h('button', { class: 'btn-primary', onclick: back }, 'Back to my reading')));
    return;
  }
  mount(app.root, topbar(entry.title), h('div', { class: 'narrow card' }, h('p', { class: 'muted' }, 'Opening the book…')));
  let book;
  try {
    book = await loadBook(id);
  } catch {
    mount(app.root, topbar(entry.title), h('div', { class: 'narrow card stack' },
      h('h2', {}, 'This book isn’t saved on this device yet'),
      h('p', {}, 'Connect to the internet and open it once: after that it stays on this device and opens offline.'),
      h('button', { class: 'btn-primary', onclick: () => bookScreen(app, id) }, 'Try again')));
    return;
  }
  if (location.hash !== `#/book/${id}`) return; // moved on while it loaded

  const st = state.settings;
  const p = place(state, id);
  openBook(state, entry, today);
  p.last = Date.now();
  app.save();
  const young = !!COURSE.young;
  const canSay = young && st.tts !== false && ttsAvailable();
  // who is reading: on-my-own books count as solo unless the child says they read together
  const solo = () => young && (p.who ? p.who === 'solo' : book.level === 'on-my-own');

  // --- reading time: only while the page is visible and being used, and capped per sitting
  const clock = readingClock();
  let sessionSec = 0, loggedNow = 0, finishedNow = false;
  const flush = () => {
    const secs = Math.min(clock.take(), Math.max(0, SESSION_CAP_MIN * 60 - sessionSec));
    sessionSec += secs;
    const m = creditReading(state, entry, secs, app.today(), solo());
    loggedNow += m;
    return m;
  };
  const onActive = () => clock.activity();
  const onVisible = () => {
    const v = document.visibilityState === 'visible';
    clock.visibility(v);
    if (!v) { flush(); savePlace(); app.save(); stopSpeaking(); }
  };
  const tick = setInterval(() => { if (document.visibilityState === 'visible') { flush(); app.save(); } }, 60000);
  const ACTIVE = ['scroll', 'pointerdown', 'keydown', 'touchstart', 'wheel'];
  ACTIVE.forEach((ev) => window.addEventListener(ev, onActive, { passive: true }));
  document.addEventListener('visibilitychange', onVisible);
  clock.start();

  // --- theme for reading (light/dark), restored when leaving the book
  const root = document.documentElement;
  const effectiveDark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches);
  const applyTheme = () => { if (st.bookTheme) root.dataset.theme = st.bookTheme; };
  applyTheme();

  const leave = () => {
    clearInterval(tick);
    ACTIVE.forEach((ev) => window.removeEventListener(ev, onActive));
    document.removeEventListener('visibilitychange', onVisible);
    window.removeEventListener('scroll', onScroll);
    stopSpeaking();
    savePlace();
    flush();
    app.save();
    if (!location.hash.startsWith('#/book/')) app.applySettings();
    const mins = loggedNow ? ` ${loggedNow} minute${loggedNow === 1 ? '' : 's'} of reading logged${solo() ? ': read on your own!' : '.'}` : '';
    if (finishedNow) toast(`Finished ${book.title}! Brilliant.${mins}`);
    else if (mins) toast(mins.trim());
  };
  window.addEventListener('hashchange', leave, { once: true });

  // --- layout
  let ch = Math.min(p.ch || 0, book.chapters.length - 1);
  const size = () => st.bookSize || 1;
  const textEl = h('article', { class: 'book-text', lang: 'en-GB' });
  const bar = h('div', { style: { width: '0%' } });
  const prog = h('div', { class: 'progress book-progress', 'aria-hidden': 'true' }, bar);
  const toc = h('div', { class: 'card book-toc hidden' });
  const prefs = h('div', { class: 'card book-prefs hidden' });
  const tocBtn = h('button', { class: 'btn-icon', 'aria-label': 'Chapters', 'aria-expanded': 'false', title: 'Chapters', onclick: () => toggle(toc, tocBtn, prefs, prefsBtn) }, icon('list'));
  const prefsBtn = h('button', { class: 'btn-icon book-aa', 'aria-label': 'Text size and colours', 'aria-expanded': 'false', title: 'Text size and colours', onclick: () => toggle(prefs, prefsBtn, toc, tocBtn) }, 'Aa');
  const toggle = (el, btn, other, otherBtn) => {
    const show = el.classList.contains('hidden');
    el.classList.toggle('hidden', !show); btn.setAttribute('aria-expanded', String(show));
    other.classList.add('hidden'); otherBtn.setAttribute('aria-expanded', 'false');
  };

  const setSize = (d) => {
    const at = currentAt();
    const i = Math.max(0, Math.min(SIZES.length - 1, SIZES.findIndex((s) => s >= size() - 0.001) + d));
    st.bookSize = SIZES[i];
    textEl.style.setProperty('--book-size', st.bookSize);
    app.save();
    renderPrefs();
    requestAnimationFrame(() => scrollToAt(at));
  };
  const renderPrefs = () => {
    const dark = effectiveDark();
    const seg = (label, ...btns) => h('div', { class: 'book-pref-row', role: 'group', 'aria-label': label }, h('span', { class: 'book-pref-label' }, label), h('div', { class: 'book-seg' }, ...btns));
    const who = solo() ? 'solo' : 'together';
    prefs.replaceChildren(
      seg('Text size',
        h('button', { class: 'btn-ghost', 'aria-label': 'Smaller text', disabled: size() <= SIZES[0], onclick: () => setSize(-1) }, 'A−'),
        h('span', { class: 'muted small book-size-now', 'aria-live': 'polite' }, `${Math.round(size() * 100)}%`),
        h('button', { class: 'btn-ghost book-aplus', 'aria-label': 'Bigger text', disabled: size() >= SIZES.at(-1), onclick: () => setSize(1) }, 'A+')),
      seg('Page',
        h('button', { class: dark ? 'btn-ghost' : 'btn-primary', 'aria-pressed': String(!dark), onclick: () => { st.bookTheme = 'light'; applyTheme(); app.save(); renderPrefs(); } }, '☀ Light'),
        h('button', { class: dark ? 'btn-primary' : 'btn-ghost', 'aria-pressed': String(dark), onclick: () => { st.bookTheme = 'dark'; applyTheme(); app.save(); renderPrefs(); } }, '☾ Dark')),
      young ? seg('Reading', ...[['solo', 'On my own'], ['together', 'Together']].map(([v, label]) => h('button', { class: who === v ? 'btn-primary' : 'btn-ghost', 'aria-pressed': String(who === v), onclick: () => { flush(); p.who = v; app.save(); renderPrefs(); renderWho(); } }, label))) : null,
      h('p', { class: 'muted small', style: { margin: 0 } }, 'The letters follow the font chosen in Display settings.'));
  };
  const whoEl = h('p', { class: 'muted small book-who' });
  const renderWho = () => { if (!young) return; whoEl.textContent = young ? (solo() ? 'Reading on my own. Reading with a grown-up? Change it with Aa.' : 'Reading together with a grown-up.') : ''; };

  const renderToc = () => {
    let lastPart;
    toc.replaceChildren(h('h2', {}, 'Chapters'), h('ol', { class: 'book-toc-list' }, book.chapters.map((c, i) => {
      const head = c.part && c.part !== lastPart ? h('li', { class: 'book-toc-part', 'aria-hidden': 'true' }, c.part) : null;
      lastPart = c.part;
      return [head, h('li', {}, h('button', { class: `book-toc-item${i === ch ? ' cur' : ''}`, 'aria-current': i === ch ? 'true' : null, onclick: () => { toc.classList.add('hidden'); tocBtn.setAttribute('aria-expanded', 'false'); go(i, 0); } }, c.title, i < ch || p.done ? h('span', { class: 'sr-only' }, ' (read)') : null))];
    })), source());
  };

  const source = () => h('p', { class: 'muted small book-source' }, book.kind === 'retold' ? `${book.retoldBy}.` : `${book.source}.`, book.note ? ` ${book.note}` : '');
  const meta = () => h('div', { class: 'book-meta' },
    h('p', { class: 'muted small', style: { margin: 0 } }, `${book.author}, ${book.year}`,
      young ? h('span', { class: `chip ${book.level === 'read-together' ? 'proficient' : 'mastered'}`, style: { marginLeft: '8px' } }, LEVELS[book.level]) : null,
      book.kind === 'retold' ? h('span', { class: 'chip stretch', style: { marginLeft: '6px' } }, 'Retold') : null),
    young ? whoEl : null);

  let paras = [];
  const renderChapter = () => {
    const c = book.chapters[ch];
    paras = c.paragraphs.map((t, i) => {
      if (t === '* * *') return h('p', { class: 'book-break', 'aria-label': 'Section break' }, '⁂');
      const el = h('p', { class: t.includes('\n') ? 'verse' : null, html: paraHTML(t), 'data-i': i });
      if (!canSay) return el;
      return h('div', { class: 'book-say-row', 'data-i': i },
        h('button', { class: 'say-btn', type: 'button', 'aria-label': 'Read this part aloud', title: 'Read aloud', onclick: (e) => { e.stopPropagation(); clock.activity(); speak(sayable(t), { rate: 0.85 }); } }, icon('speaker')), el);
    });
    const last = ch === book.chapters.length - 1;
    textEl.style.setProperty('--book-size', size());
    textEl.replaceChildren(...[
      meta(),
      // a short word for the reader about language of its time, before the first chapter
      ch === 0 && book.before ? h('div', { class: 'card book-before' }, h('strong', {}, 'Before you read'), h('p', { style: { margin: '6px 0 0' } }, book.before)) : null,
      c.part ? h('p', { class: 'eyebrow book-part' }, c.part) : null,
      h('h2', { class: 'book-ch-title' }, c.title),
      ...paras,
      h('div', { class: 'book-end' },
        last ? finishCard() : null,
        h('div', { class: 'row book-nav' },
          ch > 0 ? h('button', { class: 'btn-ghost', onclick: () => go(ch - 1, 0) }, '← Previous') : h('span'),
          !last ? h('button', { class: 'btn-primary btn-big', onclick: () => go(ch + 1, 0) }, 'Next chapter →') : null),
        h('p', { class: 'muted small center' }, `Chapter ${ch + 1} of ${book.chapters.length}`),
        last ? source() : null)].filter(Boolean));
    renderToc();
    bar.style.width = `${(100 * (ch + 1)) / book.chapters.length}%`;
  };
  const finishCard = () => (p.done
    ? h('div', { class: 'card book-finish center' }, h('p', { style: { margin: 0 } }, 'You’ve finished this book. You can read it again any time.'), h('button', { class: 'btn-ghost', onclick: back }, 'Back to my reading'))
    : h('div', { class: 'card book-finish center stack' },
      h('h3', {}, 'The end!'),
      h('p', { style: { margin: 0 } }, `Have you read all of ${book.title}?`),
      h('button', { class: 'btn-primary btn-big', onclick: () => { flush(); chapterRead(); finishLibraryBook(state, entry, app.today()); finishedNow = true; app.save(); back(); } }, 'Finished it!')));

  // --- place: the paragraph at the top of the screen, plus how far through it
  const topOffset = () => (document.querySelector('.book-top')?.getBoundingClientRect().bottom || 0) + 12;
  const currentAt = () => {
    const top = topOffset();
    for (let i = 0; i < paras.length; i++) {
      const r = paras[i].getBoundingClientRect();
      if (r.bottom > top) return i + Math.max(0, Math.min(0.99, (top - r.top) / Math.max(1, r.height)));
    }
    return paras.length ? paras.length - 1 : 0;
  };
  const scrollToAt = (at) => {
    const i = Math.floor(at || 0);
    const el = paras[Math.min(i, paras.length - 1)];
    if (!el || !(at > 0)) { window.scrollTo(0, 0); return; }
    const r = el.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + r.top + (at - i) * r.height - topOffset());
  };
  const savePlace = () => { if (paras.length) setPlace(state, id, ch, currentAt()); };
  let scrollT = null, lastSave = 0;
  const onScroll = () => {
    if (scrollT) return;
    scrollT = setTimeout(() => {
      scrollT = null;
      savePlace();
      if (Date.now() - lastSave > 5000) { lastSave = Date.now(); app.save(); }
    }, 300);
  };
  // for the daily quest "read a chapter": moving on from a chapter that was open a while
  let chOpened = Date.now();
  const chapterRead = () => { if (Date.now() - chOpened >= CHAPTER_SECONDS * 1000) noteChapter(state, id, ch, app.today()); };
  const go = (i, at) => {
    stopSpeaking();
    if (i === ch + 1) chapterRead();
    if (i !== ch) chOpened = Date.now();
    ch = Math.max(0, Math.min(book.chapters.length - 1, i));
    setPlace(state, id, ch, at);
    app.save();
    renderChapter();
    requestAnimationFrame(() => scrollToAt(at));
  };

  mount(app.root,
    h('div', { class: 'book-head' }, topbar(book.title, prefsBtn, tocBtn), prog, h('div', { class: 'book-panels' }, prefs, toc)),
    textEl);
  renderPrefs();
  renderWho();
  renderChapter();
  document.onkeydown = (e) => {
    if (e.target.closest?.('input, textarea')) return;
    if (e.key === 'ArrowRight' && ch < book.chapters.length - 1) go(ch + 1, 0);
    else if (e.key === 'ArrowLeft' && ch > 0) go(ch - 1, 0);
  };
  const restore = () => { if (location.hash === `#/book/${id}`) scrollToAt(p.ch === ch ? p.at : 0); };
  requestAnimationFrame(restore);
  (document.fonts?.ready || Promise.resolve()).then(() => requestAnimationFrame(restore));
  window.addEventListener('scroll', onScroll, { passive: true });
}
