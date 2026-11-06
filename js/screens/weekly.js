// The weekly challenge (#/play/challenge): a two-minute race to ten right answers against a ghost
// of last week's run, on the course's themed track. Questions are things she already knows well,
// mixed with quick sums, so it is a celebration of what has stuck rather than a test. Leaving
// mid-race stores nothing: she can race again any time that week.

import { h, rich, richHTML, mount } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { sayButton } from '../ui/qtypes.js';
import { raceway, finishMoment, starBurst, calmMotion } from '../ui/raceway.js';
import { capybaraEl } from '../ui/capybara.js';
import { chime, softTone, flourish } from '../platform/sfx.js';
import { COURSE } from '../core/subjects.js';
import { formatDay } from '../core/dates.js';
import { makeRng } from '../core/rng.js';
import { present } from '../core/present.js';
import { check } from '../core/checkers.js';
import { parseNumber } from '../core/fraction.js';
import { trackTheme } from '../core/juice.js';
import { freshSprintQuestion } from '../gen/sprint.js';
import { challengeStatus, challengePlan, runPosition, raceResult, resultLine, recordChallenge, CHALLENGE_GOAL, CHALLENGE_MS } from '../core/weekly.js';
import { restTime } from './util.js';

const secs = (ms) => Math.round(ms / 1000);
const clock = (ms) => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const ghostWho = (g) => (g?.weeksAgo > 1 ? 'Your last run' : 'Last week');

function topbar(app, title, extra = null) {
  return h('div', { class: 'q-head q-wrap' },
    h('button', { class: 'btn-icon', type: 'button', 'aria-label': 'Stop and go home', title: 'Home', onclick: () => app.go('#/home') }, icon('back')),
    h('span', { class: 'chip wk-chip' }, icon('flag'), ` ${title}`),
    h('span', { style: { flex: 1 } }),
    extra);
}

/** Two lanes on the course's track: her own vehicle, and the ghost of last time. */
function raceLanes(theme, ghost) {
  const lane = (who, cls, key) => {
    const el = raceway({ theme, p: 0, key });
    ['role', 'aria-valuemin', 'aria-valuemax', 'aria-valuenow', 'aria-valuetext', 'aria-label'].forEach((a) => el.removeAttribute(a));
    el.classList.add('wk-track', cls);
    return { row: h('div', { class: `wk-lane ${cls}` }, h('span', { class: 'wk-who' }, who), el), mover: el.querySelector('.rw-mover'), el };
  };
  const you = lane('You', 'wk-you', 'weekly-you');
  const g = ghost ? lane(ghostWho(ghost), 'wk-ghost', 'weekly-ghost') : null;
  const set = (m, p) => m && m.style.setProperty('--p', String(Math.max(0, Math.min(1, p))));
  return {
    el: h('div', { class: 'wk-lanes', 'aria-hidden': 'true' }, you.row, g?.row),
    you: (p) => set(you.mover, p),
    ghost: (p) => set(g?.mover, p),
    youEl: you.el,
  };
}

export function challengeScreen(app) {
  const { state } = app;
  state.extraOn = false;
  const today = app.today();
  const st = challengeStatus(state, today);
  const t = st.theme;
  const track = trackTheme(COURSE.id);
  const c = state.profile?.companion || {};
  const rest = restTime(state.settings);
  if (!st.open) return resultScreen(app, st.run, st.ghost, { already: true });
  if (rest) {
    mount(app.root, topbar(app, t.title), h('div', { class: 'q-wrap stack center' },
      capybaraEl({ ...c, mood: 'thinking' }, 'capy bob'), h('h2', {}, 'Resting before bedtime'), h('p', {}, rest),
      h('p', { class: 'muted' }, `${t.name[0].toUpperCase() + t.name.slice(1)} is open all week. Come back tomorrow!`),
      h('button', { class: 'btn-primary btn-big', onclick: () => app.go('#/home') }, 'Back home')));
    return;
  }
  const g = st.ghost;
  const preview = raceLanes(track, g);
  preview.you(0);
  mount(app.root, topbar(app, t.title), h('div', { class: 'q-wrap stack center wk-intro' },
    h('div', { class: 'eyebrow' }, `This week’s ${t.title}`),
    h('h1', {}, t.pitch.replace(' last week’s you', g ? (g.weeksAgo > 1 ? ' your last run' : ' last week’s you') : ' the clock')),
    preview.el,
    h('p', {}, `Get ${CHALLENGE_GOAL} right to reach ${t.finish}. You have ${CHALLENGE_MS / 60000} minutes. Wrong answers don’t move you back: just try the next one.`),
    g ? h('p', { class: 'wk-ghost-note' }, h('span', { class: 'wk-ghost-dot', 'aria-hidden': 'true' }), g.finished
      ? ` The see-through one is ${g.weeksAgo > 1 ? 'you last time' : 'you last week'}: ${t.ghost} reached the finish in ${secs(g.ms)} seconds.`
      : ` The see-through one is ${g.weeksAgo > 1 ? 'you last time' : 'you last week'}: ${t.ghost} got ${g.correct} right.`)
      : h('p', { class: 'muted' }, `Your first ${t.title}! This run becomes your ghost to race next week.`),
    h('p', { class: 'muted small' }, 'Questions are things you already know, mixed with quick sums. Once a week, so make it count. Have fun!'),
    h('button', { class: 'btn-primary btn-big wk-start', type: 'button', autofocus: true, onclick: () => race(app) }, icon('flag'), ' Go!')));
}

function race(app) {
  const { state, db } = app;
  const today = app.today();
  const st = challengeStatus(state, today);
  if (!st.open) return resultScreen(app, st.run, st.ghost, { already: true });
  const g = st.ghost;
  const t = st.theme;
  const plan = challengePlan(state, db, today);
  const rng = makeRng(`challenge-q:${plan.week}:${state.created}`);
  const lanes = raceLanes(trackTheme(COURSE.id), g);
  const timer = h('span', { class: 'paper-timer wk-timer', 'aria-label': 'Time left' }, clock(CHALLENGE_MS));
  const score = h('p', { class: 'wk-score', 'aria-live': 'polite' }, `0 of ${CHALLENGE_GOAL}`);
  const box = h('div', { class: 'card wk-q' });
  const recent = [];
  let i = 0, correct = 0, answered = 0, over = false, busy = false;
  const times = [];
  const t0 = performance.now();
  const now = () => performance.now() - t0;

  const stop = () => { over = true; clearInterval(tick); };
  window.addEventListener('hashchange', stop, { once: true });
  const tick = setInterval(() => {
    const ms = now();
    timer.textContent = clock(CHALLENGE_MS - ms);
    timer.classList.toggle('low', CHALLENGE_MS - ms < 15000);
    lanes.ghost(runPosition(g, ms));
    if (ms >= CHALLENGE_MS) finish(false);
  }, 150);

  const finish = (reached) => {
    if (over) return;
    stop();
    window.removeEventListener('hashchange', stop);
    const run = { correct, answered, ms: reached ? times.at(-1) : CHALLENGE_MS, finished: reached, times };
    recordChallenge(state, run, today);
    app.save();
    // a beat on the finish line before the result
    setTimeout(() => { if (location.hash === '#/play/challenge') resultScreen(app, run, g, { justRaced: true }); }, reached && !calmMotion() ? 700 : 250);
  };

  const after = (ok, el) => {
    answered++;
    if (ok) {
      correct++;
      times.push(now());
      lanes.you(correct / CHALLENGE_GOAL);
      chime();
      if (!calmMotion()) starBurst(lanes.youEl.querySelector('.rw-vehicle'), { count: 6, spread: 34 });
    } else softTone();
    score.textContent = `${correct} of ${CHALLENGE_GOAL}`;
    box.classList.remove('ok', 'no');
    void box.offsetWidth;
    box.classList.add(ok ? 'ok' : 'no');
    if (correct >= CHALLENGE_GOAL) return finish(true);
    // a right answer moves straight on; a wrong one shows the answer for a moment
    setTimeout(() => { busy = false; if (!over) ask(); }, ok ? 220 : 900);
    void el;
  };

  const askFact = (id) => {
    const item = db.items[id];
    const q = present(item, state.cards[id], { db, state, rng, format: item.kind === 'fact' ? 'choice' : undefined });
    if (q.kind !== 'choice' || q.options.length < 2) return false;
    app.challengeCurrent = { ...q, index: q.options.findIndex((o) => o.correct) }; // for browser tests
    const btns = q.options.map((o, k) => h('button', { class: 'option', type: 'button', html: richHTML(o.text), onclick: () => {
      if (busy || over) return;
      busy = true;
      const ok = check(q, k).correct;
      btns.forEach((b, j) => { b.disabled = true; if (q.options[j].correct) b.classList.add('right'); else if (j === k) b.classList.add('wrong'); });
      after(ok, btns[k]);
    } }));
    const say = COURSE.readAloud && state.settings.tts !== false ? sayButton(`${q.prompt}. ${q.options.map((o) => o.text).join('. ')}`, 'Read it to me') : null;
    box.replaceChildren(say ? h('div', { class: 'q-prompt-row' }, say, rich('div', q.prompt, { class: 'q-prompt' })) : rich('div', q.prompt, { class: 'q-prompt' }),
      h('div', { class: 'options' }, btns));
    return true;
  };

  const askSum = (level) => {
    const q = freshSprintQuestion(level, rng, recent);
    app.challengeCurrent = q; // for browser tests, like the sprint
    const input = h('input', { type: 'text', class: 'sprint-in', autocomplete: 'off', 'aria-label': 'Your answer', inputmode: q.keypad ? 'decimal' : 'text' });
    const note = h('p', { class: 'muted small center wk-note', 'aria-live': 'polite' });
    const go = () => {
      if (busy || over || !input.value.trim()) return;
      busy = true;
      const p = parseNumber(input.value);
      const ok = !!p && p.value.eq(parseNumber(String(q.value)).value);
      input.disabled = true;
      if (!ok) note.textContent = `${q.prompt.replace(/\s*=\s*\?$/, '')} = ${String(q.value).replace(/^-/, '−')}`;
      after(ok, input);
    };
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
    box.replaceChildren(h('div', { class: 'sprint-q', html: richHTML(q.prompt) }),
      h('div', { class: 'typed-row wk-typed' }, input, h('button', { class: 'btn-primary', type: 'button', 'aria-label': 'Check', onclick: go }, icon('check'))), note);
    input.focus();
    return true;
  };

  const ask = () => {
    for (let tries = 0; tries < 3; tries++) {
      const step = plan.steps[i++] || { sum: plan.level };
      if (step.item ? askFact(step.item) : askSum(step.sum)) return;
    }
    askSum(plan.level);
  };

  mount(app.root, topbar(app, t.title, timer), h('div', { class: 'q-wrap stack wk-race' }, lanes.el, score, box));
  ask();
}

function resultScreen(app, run, ghost, { already = false, justRaced = false } = {}) {
  const { state } = app;
  const st = challengeStatus(state, app.today());
  const t = st.theme;
  const res = raceResult(run, ghost);
  const line = resultLine(res, ghost, t);
  const c = state.profile?.companion || {};
  const won = res.kind === 'beat' || res.kind === 'first';
  if (justRaced) (won || run.finished ? flourish : chime)();
  const tile = (n, label, colour) => h('div', { class: 'stat-tile', style: { '--tile': colour } }, h('b', {}, n), h('span', {}, label));
  const mine = run.finished ? `${secs(run.ms)}s` : `${run.correct}/${CHALLENGE_GOAL}`;
  const theirs = ghost ? (ghost.finished ? `${secs(ghost.ms)}s` : `${ghost.correct}/${CHALLENGE_GOAL}`) : null;
  mount(app.root, topbar(app, t.title), h('div', { class: 'q-wrap stack wk-result' },
    run.finished ? finishMoment(trackTheme(COURSE.id)) : h('div', { class: 'center' }, capybaraEl({ ...c, mood: 'happy' }, 'capy bob')),
    h('div', { class: 'center' },
      h('div', { class: 'eyebrow' }, already ? `This week’s ${t.title}` : `${t.title} result`),
      h('h1', {}, line.head),
      h('p', {}, line.text)),
    h('div', { class: 'stat-strip', style: { margin: 0 } },
      tile(String(run.correct), 'right answers', 'var(--good)'),
      tile(mine, run.finished ? 'to the finish' : 'of the way', 'var(--accent)'),
      theirs ? tile(theirs, ghostWho(ghost).toLowerCase() === 'last week' ? 'last week' : 'last time', 'var(--muted)') : tile(String(run.answered), 'questions tried', 'var(--warm)')),
    h('p', { class: 'muted center' }, `The next ${t.title} opens on ${formatDay(st.nextWeek)}. You’ll race this run.`),
    h('div', { class: 'row', style: { justifyContent: 'center' } },
      h('button', { class: 'btn-primary btn-big', type: 'button', autofocus: true, onclick: () => app.go('#/home') }, 'Back home'),
      h('button', { class: 'btn-big', type: 'button', onclick: () => app.go('#/progress') }, icon('chart'), ' Progress'))));
}
