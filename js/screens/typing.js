// Touch typing: ten lessons from the home row to whole sentences, with an on-screen keyboard
// that shows the next key and which finger to use, plus a one-minute word race.

import { h, mount } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { capybaraEl } from '../ui/capybara.js';
import { TYPING_LESSONS, KEYBOARD_ROWS, drillText, wpm, unlockedLessons, recordLesson, fingerFor, PASS_ACCURACY } from '../core/practice.js';
import { makeRng } from '../core/rng.js';

const FINGER_COLOUR = { 'L little': '#d63d74', 'L ring': '#d97a12', 'L middle': '#0f9a6e', 'L index': '#2f74e8', 'R index': '#2f74e8', 'R middle': '#0f9a6e', 'R ring': '#d97a12', 'R little': '#d63d74', thumb: '#9a48d6' };

function wordBank(db) {
  const words = Object.values(db.items).filter((i) => i.kind === 'spell').map((i) => i.word).filter((w) => /^[a-z]+$/.test(w));
  const sentences = db.sentences.map((s) => s.model).filter((m) => m && m.length < 110 && !/[“”_*{}]/.test(m));
  return { words, sentences };
}

function keyboard(next) {
  const rows = KEYBOARD_ROWS.map((row, ri) => h('div', { class: 'kb-row', style: { paddingLeft: `${ri * 18}px` } }, [...row].map((k) => {
    const f = fingerFor(k);
    return h('span', { class: `kb-key${next && next.toLowerCase() === k ? ' next' : ''}`, style: { '--fc': FINGER_COLOUR[f] || 'var(--muted)' } }, k === ';' ? ';' : k);
  })));
  rows.push(h('div', { class: 'kb-row' }, h('span', { class: `kb-key space${next === ' ' ? ' next' : ''}`, style: { '--fc': FINGER_COLOUR.thumb } }, 'space')));
  return h('div', { class: 'kb' }, rows);
}

export function typingScreen(app) {
  const { state } = app;
  const typing = (state.typing ||= { lessons: {}, best: null });
  const unlocked = unlockedLessons(typing);
  const touch = window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(pointer: fine)').matches;
  mount(app.root,
    h('div', { class: 'topbar' }, h('button', { class: 'btn-icon', 'aria-label': 'Back', onclick: () => app.go('#/home') }, icon('back')), h('h1', {}, 'Touch typing'), h('span', { class: 'spacer' })),
    h('div', { class: 'narrow stack' },
      touch ? h('div', { class: 'card', style: { borderColor: 'var(--warn)' } }, h('p', {}, 'Touch typing needs a real keyboard. Open this on the computer, or plug a keyboard into the tablet.')) : null,
      h('div', { class: 'card' }, h('p', {}, 'Typing without looking is one of the most useful things you can learn before secondary school: homework, essays, coding. Ten short lessons, then race the river.'),
        typing.best ? h('p', { class: 'muted small' }, `Your best: ${typing.best.wpm} words a minute at ${Math.round(typing.best.acc * 100)}% accuracy.`) : null),
      h('div', { class: 'card stack' }, h('h2', {}, 'Lessons'),
        h('ol', { class: 'journey compact' }, TYPING_LESSONS.map((l, i) => {
          const r = typing.lessons[l.id];
          const locked = i >= unlocked;
          return h('li', {}, h('span', { class: `node ${locked ? 'locked' : r?.passed ? 'proficient' : 'available'}` }, icon(locked ? 'lock' : r?.passed ? 'check' : 'play')),
            h('button', { class: `jcard${locked ? ' locked' : ''}`, disabled: locked, onclick: () => lesson(app, i) }, h('h3', {}, l.title), h('div', { class: 'meta' }, r ? `${r.wpm} wpm · ${Math.round(r.acc * 100)}% accuracy` : locked ? 'finish the lesson before with 90% accuracy' : l.keys ? `new keys: ${l.keys.toUpperCase().split('').join(' ')}` : 'everything you’ve learned')));
        }))),
      h('div', { class: 'card stack' }, h('h2', {}, 'River race'), h('p', { class: 'muted' }, `Words float down the river towards your companion. Type each one and press space before it arrives. One minute.${typing.game ? ` Best: ${typing.game.score} words.` : ''}`),
        h('button', { class: 'btn-primary', disabled: unlocked < 4, onclick: () => race(app) }, unlocked < 4 ? 'Unlocks after lesson 3' : 'Play'))));
}

function lesson(app, idx) {
  const { state, db } = app;
  const L = TYPING_LESSONS[idx];
  const text = drillText(idx, `${app.today()}:${Date.now() % 1000}`, wordBank(db));
  const chars = [...text];
  let pos = 0, typed = 0, wrong = 0, t0 = null, done = false;
  const spans = chars.map((c) => h('span', { class: 'tc' }, c === ' ' ? ' ' : c));
  spans[0].classList.add('cur');
  const line = h('div', { class: 'type-text', 'aria-label': 'Text to type' }, spans);
  const kbBox = h('div', {}, keyboard(chars[0]));
  const hint = h('p', { class: 'muted small center' }, `Next: ${chars[0] === ' ' ? 'space' : chars[0]} · ${fingerFor(chars[0])}`);
  const stats = h('p', { class: 'muted small center' }, '0 wpm · 100%');
  const refresh = () => {
    const c = chars[pos];
    kbBox.replaceChildren(keyboard(c));
    hint.textContent = c == null ? '' : `Next: ${c === ' ' ? 'space' : c} · ${fingerFor(c)}`;
    if (t0) { const acc = typed ? (typed - wrong) / typed : 1; stats.textContent = `${wpm(pos, performance.now() - t0)} wpm · ${Math.round(acc * 100)}%`; }
  };
  const onKey = (e) => {
    if (done || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Backspace') { e.preventDefault(); if (pos > 0 && !spans[pos - 1].classList.contains('ok')) { spans[pos].classList.remove('cur'); pos--; spans[pos].className = 'tc cur'; refresh(); } return; }
    if (e.key.length !== 1) return;
    e.preventDefault();
    t0 ||= performance.now();
    typed++;
    const want = chars[pos];
    if (e.key === want) {
      spans[pos].classList.remove('cur', 'bad');
      spans[pos].classList.add('ok');
      pos++;
      if (pos >= chars.length) return finish();
      spans[pos].classList.add('cur');
    } else {
      wrong++;
      spans[pos].classList.add('bad');
    }
    refresh();
  };
  const finish = () => {
    done = true;
    document.onkeydown = null;
    const ms = performance.now() - t0, w = wpm(chars.length, ms), acc = typed ? (typed - wrong) / typed : 1;
    recordLesson(state.typing, L.id, { wpm: w, acc }, app.today());
    app.save();
    const passed = acc >= PASS_ACCURACY;
    mount(app.root, h('div', { class: 'topbar' }, h('h1', {}, L.title), h('span', { class: 'spacer' })),
      h('div', { class: 'narrow stack center' },
        capybaraEl({ ...(state.profile?.companion || {}), mood: passed ? 'happy' : 'thinking' }, 'capy bob'),
        h('div', { class: 'sprint-result' }, h('span', { class: 'big' }, `${w}`), h('span', {}, `words a minute · ${Math.round(acc * 100)}% accuracy`)),
        h('p', {}, passed ? (idx + 1 < TYPING_LESSONS.length ? 'Passed! The next lesson is unlocked.' : 'Passed the last lesson. You can touch type!') : 'Under 90% accuracy, so this one stays open. Slow down a little: speed comes by itself once your fingers know the way.'),
        h('div', { class: 'row', style: { justifyContent: 'center' } },
          h('button', { class: 'btn-primary btn-big', onclick: () => lesson(app, idx) }, 'Again'),
          h('button', { class: 'btn-ghost btn-big', onclick: () => typingScreen(app) }, 'Lessons'))));
  };
  document.onkeydown = onKey;
  mount(app.root,
    h('div', { class: 'topbar' }, h('button', { class: 'btn-icon', 'aria-label': 'Back', onclick: () => { document.onkeydown = null; typingScreen(app); } }, icon('back')), h('h1', {}, L.title), h('span', { class: 'spacer' }), stats),
    h('div', { class: 'narrow stack' },
      h('p', { class: 'muted' }, L.tip),
      h('div', { class: 'card type-card' }, line),
      hint, kbBox,
      h('p', { class: 'muted small center' }, 'Just start typing. Backspace fixes a mistake.')));
}

// one minute: words drift from the right; type a word and press space to clear it
function race(app) {
  const { state, db } = app;
  const { words } = wordBank(db);
  const rng = makeRng(`race:${Date.now()}`);
  const pool = words.filter((w) => w.length <= 9);
  const river = h('div', { class: 'river' });
  const input = h('div', { class: 'river-input' }, '');
  const scoreEl = h('span', { class: 'paper-timer' }, '0');
  const timeEl = h('span', { class: 'paper-timer' }, '60');
  const capy = capybaraEl({ ...(state.profile?.companion || {}), mood: 'happy' });
  capy.classList.add('river-capy');
  let live = [], buf = '', score = 0, missed = 0, done = false, lastSpawn = 0, t0 = performance.now(), raf;
  const spawn = (now) => {
    const w = rng.pick(pool);
    const el = h('span', { class: 'river-word' }, w);
    river.append(el);
    live.push({ w, el, x: 100, speed: 8 + score * 0.6 + rng.int(0, 4), y: rng.int(8, 70) });
    el.style.top = `${live.at(-1).y}%`;
    lastSpawn = now;
  };
  const step = (now) => {
    if (done) return;
    const dt = (now - (step.last || now)) / 1000; step.last = now;
    const left = Math.max(0, 60 - (now - t0) / 1000);
    timeEl.textContent = String(Math.ceil(left));
    if (left <= 0) return finish();
    if (now - lastSpawn > Math.max(900, 2200 - score * 60) || !live.length) spawn(now);
    for (const o of live) { o.x -= o.speed * dt; o.el.style.left = `${o.x}%`; if (o.x < 12) { o.el.remove(); missed++; } }
    live = live.filter((o) => o.x >= 12);
    raf = requestAnimationFrame(step);
  };
  const onKey = (e) => {
    if (done || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Backspace') { buf = buf.slice(0, -1); input.textContent = buf; e.preventDefault(); return; }
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const hit = live.find((o) => o.w === buf);
      if (hit) { hit.el.classList.add('hit'); setTimeout(() => hit.el.remove(), 200); live = live.filter((o) => o !== hit); score++; scoreEl.textContent = String(score); }
      else input.classList.add('shake'), setTimeout(() => input.classList.remove('shake'), 300);
      buf = ''; input.textContent = '';
      return;
    }
    if (e.key.length === 1) { e.preventDefault(); buf += e.key; input.textContent = buf; }
  };
  const finish = () => {
    done = true;
    cancelAnimationFrame(raf);
    document.onkeydown = null;
    if (!state.typing.game || score > state.typing.game.score) state.typing.game = { score, day: app.today() };
    app.save();
    mount(app.root, h('div', { class: 'topbar' }, h('h1', {}, 'Time!'), h('span', { class: 'spacer' })),
      h('div', { class: 'narrow stack center' },
        h('div', { class: 'sprint-result' }, h('span', { class: 'big' }, String(score)), h('span', {}, `words cleared · ${missed} reached your companion`)),
        h('p', {}, score >= (state.typing.game?.score || 0) && score > 0 ? 'A new best!' : `Best so far: ${state.typing.game?.score || 0}.`),
        h('div', { class: 'row', style: { justifyContent: 'center' } }, h('button', { class: 'btn-primary btn-big', onclick: () => race(app) }, 'Again'), h('button', { class: 'btn-ghost btn-big', onclick: () => typingScreen(app) }, 'Back'))));
  };
  document.onkeydown = onKey;
  mount(app.root,
    h('div', { class: 'topbar' }, h('button', { class: 'btn-icon', 'aria-label': 'Back', onclick: () => { done = true; cancelAnimationFrame(raf); document.onkeydown = null; typingScreen(app); } }, icon('back')), h('h1', {}, 'River race'), h('span', { class: 'spacer' }), h('span', { class: 'muted small' }, 'words '), scoreEl, h('span', { class: 'muted small' }, ' · seconds '), timeEl),
    h('div', { class: 'narrow stack' },
      h('div', { class: 'river-box card' }, river, capy),
      h('div', { class: 'center' }, h('span', { class: 'muted small' }, 'Type a word, then space: '), input)));
  raf = requestAnimationFrame(step);
}
