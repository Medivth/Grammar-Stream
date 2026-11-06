// The quests card on home (today's three quests, the streak with its rest days, the weekly
// challenge) and the streak calendar on the progress page. Ticks come only from real state.

import { h } from './dom.js';
import { icon } from './icons.js';
import { COURSE } from '../core/subjects.js';
import { formatDay } from '../core/dates.js';
import { todaysQuests, streakInfo, streakLine, streakCalendar, REST_MAX, REST_EVERY } from '../core/quests.js';
import { challengeStatus, CHALLENGE_GOAL } from '../core/weekly.js';
import { trackTheme } from '../core/juice.js';
import { raceway, starBurst, calmMotion } from './raceway.js';
import { sparkle } from '../platform/sfx.js';

const FLAME = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c.6 3.2 4.2 5 5.6 8.6 1.9 4.8-1.3 10.4-5.6 10.4S4.4 18 5.8 13.4c.7-2.2 2.2-3.2 2.6-5.6 1.4 1 1.8 2.4 1.8 3.6 1.8-1.6 2.2-5.4 1.8-8.9z" fill="#ff8a3d"/><path d="M12 12.2c.4 1.7 2.6 2.7 2.6 5 0 1.8-1.2 3-2.6 3s-2.7-1-2.6-2.8c.1-1.4 1-1.9 1.3-3.2.6.4.9 1 .9 1.6.6-.9.6-2.4.4-3.6z" fill="#ffd166"/></svg>';
// a rest day: a little moon on a pillow
const MOON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 3.2A8.6 8.6 0 1 0 20.8 15 7 7 0 0 1 15.5 3.2z" fill="currentColor"/></svg>';

const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;

/** Saved rest days as two little moons, filled when saved. */
function restMoons(bank) {
  return h('span', { class: 'rest-moons', 'aria-hidden': 'true' }, Array.from({ length: REST_MAX }, (_, i) => h('span', { class: `rest-moon${i < bank ? ' on' : ''}`, html: MOON })));
}

function questRow(app, q) {
  const inner = [
    h('span', { class: `quest-tick${q.done ? ' on' : ''}`, 'aria-hidden': 'true' }, q.done ? icon('check') : null),
    h('span', { class: 'quest-txt' }, h('b', {}, q.title), q.hint && !q.done ? h('small', {}, q.hint) : null),
  ];
  const label = `${q.title}: ${q.done ? 'done' : 'not done yet'}`;
  // a quest is a way to somewhere, not a box to tick: done ones are just shown
  return h('li', { class: `quest${q.done ? ' done' : ''}` }, q.done || !q.go
    ? h('div', { class: 'quest-row', 'aria-label': label }, inner)
    : h('button', { class: 'quest-row', type: 'button', 'aria-label': `${label}. Go`, onclick: () => app.go(q.go) }, inner, h('span', { class: 'quest-go', 'aria-hidden': 'true' }, '›')));
}

function weeklyRow(app, rest) {
  const { state } = app;
  const st = challengeStatus(state, app.today());
  const t = st.theme;
  const mini = raceway({ theme: trackTheme(COURSE.id), p: st.open ? 0.35 : st.run.finished ? 1 : st.run.correct / CHALLENGE_GOAL, key: 'weekly-home' });
  ['role', 'aria-label', 'aria-valuemin', 'aria-valuemax', 'aria-valuenow', 'aria-valuetext'].forEach((a) => mini.removeAttribute(a));
  mini.setAttribute('aria-hidden', 'true');
  mini.classList.add('wk-mini');
  let text, btn = null;
  if (!st.open) {
    text = `Done this week ✓ ${st.run.finished ? `Finished in ${Math.round(st.run.ms / 1000)} seconds.` : `${st.run.correct} right.`} The next race opens on ${formatDay(st.nextWeek, { weekday: 'long' })}.`;
  } else if (rest) {
    text = 'Resting before bedtime. It’s open all week.';
  } else {
    text = st.ghost ? `${t.pitch} ${st.ghost.finished ? `Ghost time: ${Math.round(st.ghost.ms / 1000)} seconds.` : `Ghost score: ${st.ghost.correct} of ${CHALLENGE_GOAL}.`}` : `Get ${CHALLENGE_GOAL} right to reach the finish. This week’s run becomes next week’s ghost.`;
    btn = h('button', { class: 'btn-primary wk-go', type: 'button', onclick: () => app.go('#/play/challenge') }, icon('flag'), ' Race');
  }
  return h('div', { class: `weekly-row${st.open ? '' : ' done'}` },
    h('div', { class: 'weekly-txt' }, h('div', { class: 'eyebrow' }, `Weekly ${t.title}`), h('p', {}, text)),
    mini, btn);
}

/** The quests card, just under today's session on the home page. */
export function questsCard(app, rest) {
  const { state, db } = app;
  const today = app.today();
  const qs = todaysQuests(state, db, today);
  const info = streakInfo(state, today);
  const celebrate = qs.all && !qs.celebrated;
  if (celebrate) state.quests.celebrated = true;
  app.save();
  const head = qs.all ? 'All three done!' : `${qs.done} of 3 done`;
  const card = h('section', { class: `quests card${qs.all ? ' all' : ''}${celebrate ? ' just' : ''}`, 'aria-label': 'Today’s quests' },
    h('div', { class: 'quests-head' },
      h('div', {}, h('div', { class: 'eyebrow' }, 'Today’s quests'), h('h2', {}, head, qs.all ? h('span', { class: 'quests-star', 'aria-hidden': 'true' }, icon('star')) : null)),
      h('div', { class: `streak-pill${info.streak ? '' : ' zero'}`, title: 'Days with your session done' },
        h('span', { class: 'flame', html: FLAME }), h('b', {}, String(info.streak)), h('span', {}, info.streak === 1 ? 'day' : 'days'))),
    h('ul', { class: 'quest-list' }, qs.list.map((q) => questRow(app, q))),
    h('div', { class: 'streak-row' },
      h('p', { class: 'streak-line' }, streakLine(info)),
      h('p', { class: 'rest-days', title: `A saved rest day keeps your streak safe if you miss a day. You earn one for every ${REST_EVERY} days.` },
        restMoons(info.bank),
        h('span', {}, info.bank ? `${plural(info.bank, 'rest day')} saved` : 'No rest days saved yet',
          info.toNext != null && info.streak ? h('small', {}, ` · next in ${plural(info.toNext, 'day')}` ) : null))),
    weeklyRow(app, rest));
  if (celebrate && !calmMotion()) {
    requestAnimationFrame(() => { starBurst(card.querySelector('.quests-head h2'), { count: 14, spread: 90 }); sparkle(); });
  }
  return card;
}

const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const CELL_LABEL = { done: 'session done', rest: 'rest day used', missed: 'no session', open: 'today', future: '', before: '' };

/** The last four weeks of the streak, for the progress page. */
export function streakCalendarEl(state, today) {
  const { weeks, info } = streakCalendar(state, today, 4);
  const cell = (d) => h('span', { class: `sc-day ${d.status}${d.today ? ' sc-today' : ''}`, role: 'gridcell', 'aria-label': `${formatDay(d.day, { weekday: 'long', day: 'numeric', month: 'long' })}${CELL_LABEL[d.status] ? `: ${CELL_LABEL[d.status]}` : ''}` },
    d.status === 'done' ? icon('check') : d.status === 'rest' ? h('span', { class: 'sc-moon', html: MOON }) : h('span', { class: 'sc-num' }, formatDay(d.day, { day: 'numeric' })));
  return h('div', { class: 'card streak-cal' },
    h('div', { class: 'sc-head' },
      h('div', {}, h('h2', {}, info.streak ? `${info.streak}-day streak` : info.fresh ? 'A fresh start' : 'Your streak'),
        h('p', { class: 'muted small', style: { margin: 0 } }, `Best: ${plural(info.best, 'day')} · ${info.bank ? `${plural(info.bank, 'rest day')} saved` : 'no rest days saved yet'}`)),
      h('span', { class: 'flame big', html: FLAME })),
    h('div', { class: 'sc-body' },
      h('div', { class: 'sc-grid', role: 'grid', 'aria-label': 'The last four weeks' },
        h('div', { class: 'sc-week sc-dow', role: 'row', 'aria-hidden': 'true' }, DOW.map((d) => h('span', {}, d))),
        weeks.map((w) => h('div', { class: 'sc-week', role: 'row' }, w.map(cell)))),
      h('div', { class: 'sc-notes' },
        h('p', { class: 'muted small sc-key' },
          h('span', { class: 'sc-day done mini', 'aria-hidden': 'true' }), ' session done ',
          h('span', { class: 'sc-day rest mini', 'aria-hidden': 'true' }), ' rest day used'),
        h('p', { class: 'muted small', style: { margin: 0 } }, `Every ${REST_EVERY} days of streak earns a rest day (you can save ${REST_MAX}). If you miss a day, a saved rest day keeps your streak going by itself.`))));
}
