// Arithmetic paper: a timed, KS2-style test of 36 questions. Standalone practice, scored
// out of 40, with results kept so she can see herself improve.

import { h, rich, mount } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { parseNumber } from '../core/fraction.js';
import { arithmeticPaper, PAPER_QUESTIONS, PAPER_MARKS, PAPER_MINUTES } from '../gen/paper.js';
import { formatDay } from '../core/dates.js';

function markPaper(questions, answers) {
  return questions.map((q, i) => {
    const given = answers[i];
    const p = given != null && given !== '' ? parseNumber(given) : null;
    const ok = !!p && p.value.eq(parseNumber(q.value).value);
    return { ...q, given, ok, got: ok ? q.marks : 0 };
  });
}

export function paperScreen(app) {
  const { state } = app;
  const past = state.papers || [];
  const best = past.length ? Math.max(...past.map((p) => p.score)) : null;
  const back = () => app.go('#/subject/maths');
  mount(app.root,
    h('div', { class: 'topbar' }, h('button', { class: 'btn-icon', 'aria-label': 'Back', onclick: back }, icon('back')), h('h1', {}, 'Arithmetic paper'), h('span', { class: 'spacer' })),
    h('div', { class: 'narrow stack' },
      h('div', { class: 'card stack' },
        h('p', {}, `${PAPER_QUESTIONS} questions, ${PAPER_MARKS} marks, ${PAPER_MINUTES} minutes: the same shape as the Year 6 arithmetic test. Have paper and a pencil ready for the long ones. Fractions can be typed like 3/4 or 1 1/2.`),
        h('p', { class: 'muted small' }, 'Every paper is different. Skip anything you’re stuck on and come back to it at the end if there is time.'),
        h('button', { class: 'btn-primary btn-big', onclick: () => run(app) }, 'Start a paper')),
      past.length ? h('div', { class: 'card' }, h('h2', {}, 'Your papers'), h('p', { class: 'muted small' }, `Best so far: ${best} / ${PAPER_MARKS}`),
        h('ul', { class: 'plain-list' }, past.slice(-8).reverse().map((p) => h('li', {}, h('strong', {}, `${p.score} / ${PAPER_MARKS}`), ` · ${formatDay(p.day, { day: 'numeric', month: 'short' })} · ${Math.round(p.seconds / 60)} min${p.score === best ? ' · best' : ''}`)))) : null));
}

function run(app) {
  const { state } = app;
  const seed = `${app.today()}:${(state.papers || []).length}:${state.created}`;
  const questions = arithmeticPaper(seed);
  const answers = Array(questions.length).fill('');
  let i = 0, done = false;
  const t0 = performance.now();
  const timer = h('span', { class: 'paper-timer' });
  const tick = setInterval(() => {
    const left = Math.max(0, PAPER_MINUTES * 60000 - (performance.now() - t0));
    const m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000);
    timer.textContent = `${m}:${String(s).padStart(2, '0')}`;
    if (left <= 0) finish();
  }, 250);

  const show = () => {
    const q = questions[i];
    const input = h('input', { type: 'text', class: 'paper-in', autocomplete: 'off', inputmode: 'decimal', 'aria-label': 'Your answer', value: answers[i] });
    const save = () => { answers[i] = input.value.trim(); };
    const go = (k) => { save(); i = Math.max(0, Math.min(questions.length - 1, k)); show(); };
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); if (i === questions.length - 1) finish(); else go(i + 1); } });
    const dots = h('div', { class: 'paper-dots' }, questions.map((_, k) => h('button', { type: 'button', class: `dot${k === i ? ' cur' : ''}${answers[k] ? ' done' : ''}`, 'aria-label': `Question ${k + 1}`, onclick: () => go(k) }, String(k + 1))));
    mount(app.root,
      h('div', { class: 'topbar' }, h('span', { class: 'eyebrow' }, `Question ${i + 1} of ${questions.length}`), h('span', { class: 'spacer' }), timer),
      h('div', { class: 'narrow stack' },
        h('div', { class: 'card paper-card' },
          rich('div', q.prompt, { class: 'paper-q' }),
          h('div', { class: 'typed-row' }, input),
          q.marks > 1 ? h('p', { class: 'muted small' }, `${q.marks} marks: show your working on paper.`) : null),
        h('div', { class: 'row', style: { justifyContent: 'space-between' } },
          h('button', { class: 'btn-ghost', disabled: i === 0, onclick: () => go(i - 1) }, 'Back'),
          i === questions.length - 1 ? h('button', { class: 'btn-primary', onclick: () => { save(); finish(); } }, 'Finish') : h('button', { class: 'btn-primary', onclick: () => go(i + 1) }, answers[i] || input.value ? 'Next' : 'Skip')),
        dots,
        h('div', { class: 'center' }, h('button', { class: 'btn-ghost small', onclick: () => { save(); finish(); } }, 'Hand in early'))));
    input.focus();
    input.addEventListener('input', () => { const nb = app.root.querySelector('.btn-primary'); if (nb && i < questions.length - 1) nb.textContent = input.value.trim() ? 'Next' : 'Skip'; });
  };

  const finish = () => {
    if (done) return;
    done = true;
    clearInterval(tick);
    const seconds = Math.round((performance.now() - t0) / 1000);
    const marked = markPaper(questions, answers);
    const score = marked.reduce((s, m) => s + m.got, 0);
    (state.papers ||= []).push({ day: app.today(), score, max: PAPER_MARKS, seconds, wrong: marked.filter((m) => !m.ok).map((m) => m.n) });
    app.save();
    const prevBest = Math.max(0, ...state.papers.slice(0, -1).map((p) => p.score));
    mount(app.root,
      h('div', { class: 'topbar' }, h('h1', {}, 'Marked'), h('span', { class: 'spacer' })),
      h('div', { class: 'narrow stack' },
        h('div', { class: 'card center' },
          h('div', { class: 'sprint-result' }, h('span', { class: 'big' }, `${score}`), h('span', {}, `out of ${PAPER_MARKS} · ${Math.round(seconds / 60)} minutes`)),
          h('p', {}, score > prevBest && state.papers.length > 1 ? 'A new best!' : score === PAPER_MARKS ? 'Full marks!' : score >= 32 ? 'Strong. Check the ones below and you’re there.' : 'Every paper you do makes the next one feel easier. Look at the corrections below.')),
        h('div', { class: 'card' }, h('h2', {}, 'Answers'),
          h('ol', { class: 'paper-review' }, marked.map((m) => h('li', { class: m.ok ? 'ok' : 'no' }, rich('span', m.prompt), ' ', h('strong', {}, m.value), !m.ok && m.given ? h('span', { class: 'muted' }, ` (you put ${m.given})`) : !m.ok ? h('span', { class: 'muted' }, ' (skipped)') : null)))),
        h('button', { class: 'btn-primary btn-big', onclick: () => paperScreen(app) }, 'Done')));
  };
  show();
}
