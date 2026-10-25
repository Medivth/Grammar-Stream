// Speed reading: a passage is revealed word by word at a set pace, then a few comprehension
// questions. The pace moves up only when she still understands what she read.

import { h, mount, rich } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { nextSpeed, speedPassages, speedRange } from '../core/practice.js';
import { makeRng } from '../core/rng.js';
import { formatDay } from '../core/dates.js';
import { COURSE } from '../core/subjects.js';

export function speedScreen(app) {
  const { state, db } = app;
  const records = (state.speed ||= []);
  const suggested = nextSpeed(records);
  let pace = suggested;
  const passages = speedPassages(db, records);
  const paceEl = h('strong', {}, `${pace} words a minute`);
  const setPace = (d) => { const [, min, max] = speedRange(); pace = Math.max(min, Math.min(max, pace + d)); paceEl.textContent = `${pace} words a minute`; };
  mount(app.root,
    h('div', { class: 'topbar' }, h('button', { class: 'btn-icon', 'aria-label': 'Back', onclick: () => app.go('#/home') }, icon('back')), h('h1', {}, 'Speed reading'), h('span', { class: 'spacer' })),
    h('div', { class: 'narrow stack' },
      h('div', { class: 'card stack' },
        h('p', {}, 'The words light up at a steady pace and you keep up with them. Then four questions check you really read it. Get three right and the pace goes up next time; understanding always comes first.'),
        h('p', {}, 'Pace: ', paceEl, records.length ? h('span', { class: 'muted small' }, ` (suggested from last time: ${suggested})`) : h('span', { class: 'muted small' }, ` (${COURSE.id === 'ks1' ? 'a typical Year 2 reader is about 40–90' : COURSE.id === 'y3' ? 'a typical Year 3 reader is about 60–110' : COURSE.id === 'y8' ? 'a typical Year 8 reader is about 180–250' : 'a typical Year 6 reader is 120–180'})`)),
        h('div', { class: 'row' }, h('button', { class: 'btn-ghost', onclick: () => setPace(COURSE.young ? -10 : -20) }, '− slower'), h('button', { class: 'btn-ghost', onclick: () => setPace(COURSE.young ? 10 : 20) }, '+ faster')),
        h('button', { class: 'btn-primary btn-big', disabled: !passages.length, onclick: () => read(app, passages[0], pace) }, passages.length ? `Read: ${heroFill(app, passages[0].label)}` : 'No passages available')),
      records.length ? h('div', { class: 'card' }, h('h2', {}, 'Your reads'),
        h('ul', { class: 'plain-list' }, records.slice(-8).reverse().map((r) => h('li', {}, h('strong', {}, `${r.wpm} wpm`), ` · ${r.correct} of ${r.total} right · ${r.title || r.passage.split(' — ').pop().split(',')[0]} · ${formatDay(r.day, { day: 'numeric', month: 'short' })}`)))) : null));
}

/** His own superhero's name in place of {hero} (Year 2 and 3 stories star him). */
const heroFill = (app, t) => (typeof t === 'string' ? t.replaceAll('{hero}', app.state.profile?.hero || 'Captain Comet') : t);

function read(app, p, pace) {
  const words = heroFill(app, p.passage).split(/(\s+)/);
  const spans = words.map((w) => (/^\s+$/.test(w) ? document.createTextNode(w) : h('span', { class: 'sr-word' }, w)));
  const wordSpans = spans.filter((s) => s.nodeType === 1);
  const box = h('div', { class: 'card sr-text' }, spans);
  const bar = h('div', { style: { width: '0%' } });
  let i = 0, timer = null, started = null;
  const interval = 60000 / pace;
  const tick = () => {
    if (i >= wordSpans.length) { clearInterval(timer); return setTimeout(() => quiz(app, p, pace, Math.round((performance.now() - started) / 1000)), 600); }
    if (i > 0) wordSpans[i - 1].classList.replace('cur', 'read');
    wordSpans[i].classList.add('cur');
    if (i % 8 === 0) wordSpans[i].scrollIntoView({ block: 'center', behavior: 'smooth' });
    bar.style.width = `${(100 * (i + 1)) / wordSpans.length}%`;
    i++;
  };
  const start = () => { started = performance.now(); startBtn.remove(); timer = setInterval(tick, interval); tick(); };
  const startBtn = h('button', { class: 'btn-primary btn-big', onclick: start, autofocus: true }, 'Start');
  mount(app.root,
    h('div', { class: 'topbar' }, h('button', { class: 'btn-icon', 'aria-label': 'Back', onclick: () => { clearInterval(timer); speedScreen(app); } }, icon('back')), h('div', { class: 'progress', style: { '--bar': 'var(--accent)' } }, bar), h('span', { class: 'chip' }, `${pace} wpm`)),
    h('div', { class: 'narrow stack' },
      h('p', { class: 'muted small' }, heroFill(app, `${p.title} · ${p.source}`)),
      h('div', { class: 'center' }, startBtn),
      box));
}

function quiz(app, p, pace, seconds) {
  const { state } = app;
  const rng = makeRng(`sr:${app.today()}:${p.key}:${state.speed.length}`);
  const qs = rng.sample(p.items, Math.min(4, p.items.length));
  let k = 0, correct = 0;
  const show = () => {
    const it = qs[k];
    const opts = rng.shuffle(it.options.map((o, idx) => ({ ...o, text: heroFill(app, o.text), feedback: heroFill(app, o.feedback), idx })));
    let answered = false;
    const out = h('div', { 'aria-live': 'polite' });
    const btns = opts.map((o) => h('button', { class: 'option', type: 'button', onclick: () => {
      if (answered) return;
      answered = true;
      if (o.correct) correct++;
      btns.forEach((b, j) => { b.disabled = true; if (opts[j].correct) b.classList.add('right'); else if (opts[j] === o) b.classList.add('wrong'); });
      out.append(h('div', { class: `feedback ${o.correct ? 'good' : 'warn'} pop` }, h('p', {}, o.correct ? '✓ Yes.' : (o.feedback || heroFill(app, it.explain))), h('button', { class: 'btn-primary', style: { marginTop: '10px' }, onclick: () => { k++; k < qs.length ? show() : finish(); } }, k + 1 < qs.length ? 'Next question' : 'See my result')));
    } }, o.text));
    mount(app.root, h('div', { class: 'topbar' }, h('span', { class: 'eyebrow' }, `Question ${k + 1} of ${qs.length}`), h('span', { class: 'spacer' })),
      h('div', { class: 'narrow stack' }, rich('div', heroFill(app, it.prompt), { class: 'q-prompt' }), h('div', { class: 'options' }, btns), out));
  };
  const finish = () => {
    const actual = Math.round((p.passage.split(/\s+/).length / Math.max(1, seconds)) * 60);
    state.speed.push({ day: app.today(), passage: p.key, title: p.label, wpm: pace, actual, correct, total: qs.length });
    app.save();
    const next = nextSpeed(state.speed);
    mount(app.root, h('div', { class: 'topbar' }, h('h1', {}, 'Result'), h('span', { class: 'spacer' })),
      h('div', { class: 'narrow stack center' },
        h('div', { class: 'sprint-result' }, h('span', { class: 'big' }, `${correct}/${qs.length}`), h('span', {}, `understood at ${pace} words a minute`)),
        h('p', {}, next > pace ? `Excellent: next time the pace goes up to ${next}.` : next < pace ? `That was a bit fast to take in. Next time: ${next}, and that is the right call.` : 'Good. Same pace next time, then up.'),
        h('div', { class: 'row', style: { justifyContent: 'center' } }, h('button', { class: 'btn-primary btn-big', onclick: () => speedScreen(app) }, 'Done'))));
  };
  show();
}
