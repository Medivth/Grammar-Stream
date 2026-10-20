// Home: companion, today's session, and the world map of five subject regions.

import { h, s, mount } from '../ui/dom.js';
import { capybaraEl } from '../ui/capybara.js';
import { SUBJECTS, SUBJECT_BY_ID } from '../core/subjects.js';
import { topicStatus } from '../core/mastery.js';
import { daysPractisedThisMonth } from '../core/session.js';
import { restTime } from './util.js';
import { pieceDue, currentPiece, unseenFeedback, currentBooks, readingThisWeek } from '../core/writing.js';

const ISLANDS = {
  english: { d: 'M60 70 q40 -50 120 -30 q70 10 80 60 q10 60 -50 80 q-60 20 -120 -5 q-60 -30 -30 -105z', lx: 155, ly: 120 },
  maths: { d: 'M520 50 q80 -30 160 10 q50 30 30 90 q-20 50 -100 50 q-80 0 -110 -50 q-25 -60 20 -100z', lx: 610, ly: 115 },
  history: { d: 'M70 290 q60 -40 150 -10 q70 25 60 85 q-10 60 -90 60 q-90 0 -130 -50 q-30 -50 10 -85z', lx: 170, ly: 350 },
  geography: { d: 'M520 280 q90 -40 170 0 q50 30 30 90 q-20 55 -110 55 q-80 0 -110 -50 q-30 -60 20 -95z', lx: 620, ly: 345 },
  science: { d: 'M320 180 q60 -40 130 -10 q50 25 40 75 q-10 50 -80 55 q-70 5 -100 -35 q-30 -45 10 -85z', lx: 400, ly: 235 },
};

export function subjectProgress(state, db, subject) {
  const ids = db.topicOrder[subject] || [];
  const states = ids.map((id) => topicStatus(db.topics[id], state.topics));
  return {
    total: ids.length,
    done: states.filter((x) => x === 'proficient' || x === 'mastered').length,
    mastered: states.filter((x) => x === 'mastered').length,
    started: states.filter((x) => x !== 'locked' && x !== 'available').length,
  };
}

function worldMap(app) {
  const { state, db } = app;
  const svg = s('svg', { viewBox: '0 0 780 460', role: 'group', 'aria-label': 'Your world: five subject regions' },
    s('rect', { x: 0, y: 0, width: 780, height: 460, rx: 24, fill: 'var(--map-sea)' }));
  for (const subj of SUBJECTS) {
    const isl = ISLANDS[subj.id];
    const p = subjectProgress(state, db, subj.id);
    const frac = p.total ? p.done / p.total : 0;
    const g = s('g', { class: 'region', tabindex: '0', role: 'link', 'aria-label': `${subj.name}: ${p.done} of ${p.total} topics secure`, onclick: () => app.go(`#/subject/${subj.id}`), onkeydown: (e) => { if (e.key === 'Enter') app.go(`#/subject/${subj.id}`); } },
      s('path', { d: isl.d, fill: subj.colour, opacity: 0.25 + 0.6 * frac, stroke: subj.colour, 'stroke-width': 3 }),
      s('text', { x: isl.lx, y: isl.ly - 8, 'text-anchor': 'middle', class: 'region-label' }, subj.name),
      s('text', { x: isl.lx, y: isl.ly + 12, 'text-anchor': 'middle', class: 'region-sub' }, subj.region),
      s('rect', { x: isl.lx - 50, y: isl.ly + 22, width: 100, height: 8, rx: 4, fill: 'var(--card)', opacity: 0.9 }),
      s('rect', { x: isl.lx - 50, y: isl.ly + 22, width: Math.max(2, 100 * frac), height: 8, rx: 4, fill: subj.colour }),
      s('text', { x: isl.lx, y: isl.ly + 48, 'text-anchor': 'middle', class: 'region-sub' }, `${p.done} of ${p.total} topics`));
    svg.append(g);
  }
  return h('div', { class: 'world card', style: { padding: '8px' } }, svg);
}

export function homeScreen(app) {
  const { state } = app;
  const today = app.today();
  const c = state.profile?.companion || {};
  const plan = state.plan?.day === today ? state.plan : null;
  const finished = !!plan?.finished;
  const inProgress = plan && plan.started && !finished;
  const rest = restTime(state.settings);
  let msg, btn;
  if (finished) {
    msg = `Finished for today! See you tomorrow.`;
    btn = null;
  } else if (rest) {
    msg = rest;
    btn = h('button', { class: 'btn-primary btn-big', disabled: true }, 'Resting');
  } else if (inProgress) {
    msg = 'Shall we carry on where we left off?';
    btn = h('button', { class: 'btn-primary btn-big', onclick: () => app.go('#/play') }, 'Continue today’s session');
  } else {
    msg = `Ready? Today’s session is about ${state.settings.sessionMinutes} minutes, with a break in the middle.`;
    btn = h('button', { class: 'btn-primary btn-big', onclick: () => app.go('#/play') }, 'Start today’s session');
  }
  const days = daysPractisedThisMonth(state, today);
  mount(app.root,
    h('div', { class: 'topbar' }, h('h1', {}, `Hi ${state.profile?.childName || 'there'}!`), h('span', { class: 'spacer' }),
      h('button', { class: 'btn-icon', 'aria-label': 'Display settings', onclick: () => app.go('#/display') }, 'Aa'),
      h('button', { class: 'btn-icon', 'aria-label': 'Grown-ups', onclick: () => app.go('#/parent') }, '🔒')),
    h('div', { class: 'card hero', style: { marginBottom: '16px' } },
      capybaraEl({ ...c, mood: finished ? 'happy' : 'neutral' }, 'capy bob'),
      h('div', { class: 'stack' },
        h('div', { class: 'speech' }, h('strong', {}, `${c.name || 'Capy'}: `), msg),
        btn,
        finished ? h('p', { class: 'record' }, h('b', {}, String(days)), ` day${days === 1 ? '' : 's'} practised this month`) : null)),
    extras(app, rest),
    worldMap(app),
    h('p', { class: 'muted small center', style: { marginTop: '12px' } }, 'Tap a region to see your topics. Read a real book every day too!'));
}

function extras(app, rest) {
  const { state, db } = app;
  const today = app.today();
  const cards = [];
  for (const p of unseenFeedback(state)) {
    cards.push(h('button', { class: 'choice-card', onclick: () => app.go(`#/feedback/${encodeURIComponent(p.id)}`) },
      h('div', { class: 'subj', style: { color: 'var(--good)' } }, 'New!'), h('h3', { style: { margin: '4px 0 0' } }, `Feedback on “${db.pieceById[p.promptId]?.title}”`)));
  }
  if (!rest && pieceDue(state, today)) {
    const cur = currentPiece(state);
    cards.push(h('button', { class: 'choice-card', onclick: () => app.go('#/writing') },
      h('div', { class: 'subj', style: { color: SUBJECT_BY_ID.english.colour } }, cur ? 'Carry on' : 'This week'),
      h('h3', { style: { margin: '4px 0 0' } }, cur ? `Writing: ${db.pieceById[cur.promptId]?.title}` : 'Your weekly writing piece'),
      h('p', { class: 'muted small', style: { margin: '4px 0 0' } }, 'A longer piece, about 30 minutes. Do it on a different day from your session if you like.')));
  }
  const book = currentBooks(state)[0];
  cards.push(h('button', { class: 'choice-card', onclick: () => app.go('#/reading') },
    h('div', { class: 'subj', style: { color: 'var(--accent)' } }, '📚 My reading'),
    h('h3', { style: { margin: '4px 0 0' } }, book ? book.title : 'Choose a book'),
    h('p', { class: 'muted small', style: { margin: '4px 0 0' } }, `${readingThisWeek(state, today)} minutes in the last 7 days`)));
  return h('div', { class: 'grid two', style: { marginBottom: '16px' } }, cards);
}

export function subjectScreen(app, subjectId) {
  const { state, db } = app;
  const subj = SUBJECT_BY_ID[subjectId];
  if (!subj) return app.go('#/home');
  const ids = db.topicOrder[subjectId] || [];
  const LABEL = { locked: 'Locked', available: 'Ready', learning: 'Learning', proficient: 'Secure', mastered: 'Mastered', assumed: 'Secure' };
  const rows = ids.map((id) => {
    const t = db.topics[id];
    const st = topicStatus(t, state.topics);
    const items = db.itemsByTopic[id] || [];
    const seen = items.filter((i) => state.cards[i]).length;
    const isSkill = items.some((i) => db.items[i].kind === 'template');
    return h('div', { class: 'topic-row' },
      h('div', { class: 'title' }, h('div', { style: { fontWeight: 700 } }, t.title),
        st === 'locked' ? h('div', { class: 'muted small' }, `Needs: ${t.prereqs.map((p) => db.topics[p]?.title).join(', ')}`)
          : isSkill ? null : h('div', { class: 'muted small' }, `${seen} of ${items.length} learned`)),
      h('span', { class: `chip ${st}` }, LABEL[st] || st));
  });
  const p = subjectProgress(state, db, subjectId);
  mount(app.root,
    h('div', { class: 'topbar' }, h('button', { class: 'btn-icon', 'aria-label': 'Back', onclick: () => app.go('#/home') }, '←'),
      h('h1', { style: { color: subj.colour } }, subj.name), h('span', { class: 'spacer' }), h('span', { class: 'muted' }, subj.region)),
    h('div', { class: 'narrow stack' },
      h('div', { class: 'card' }, h('p', { style: { margin: 0 } }, `${p.done} of ${p.total} topics secure, ${p.mastered} mastered. Topics become “mastered” when you still know them in mixed review days later.`)),
      h('div', { class: 'card' }, rows)));
}
