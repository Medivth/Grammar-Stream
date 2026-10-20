// Home: today's session, progress at a glance, and the island map of five subjects.
// Subject pages show each subject as a journey of topics.

import { h, s, mount } from '../ui/dom.js';
import { capybaraEl, COMPANION_FACTS, speciesOf, companionNoun } from '../ui/capybara.js';
import { icon, iconPath, SUBJECT_ICON } from '../ui/icons.js';
import { SUBJECTS, SUBJECT_BY_ID, COURSE, isStretch } from '../core/subjects.js';
import { paperSpec } from '../gen/paper.js';
import { topicStatus, stretchReady } from '../core/mastery.js';
import { daysPractisedThisMonth, planDay } from '../core/session.js';
import { learnedCount, subjectStats, planSummary, isKnown } from '../core/progress.js';
import { formatDay } from '../core/dates.js';
import { restTime } from './util.js';
import { pieceDue, currentPiece, unseenFeedback, currentBooks, readingThisWeek } from '../core/writing.js';


export function subjectProgress(state, db, subject) {
  const st = subjectStats(state, db, subject);
  return { total: st.total, done: st.secure + st.mastered, mastered: st.mastered, started: st.learning + st.secure + st.mastered };
}

// --- island map -----------------------------------------------------------

/** A smooth, slightly wobbly closed blob around (cx, cy). */
function blob(cx, cy, r, seed) {
  const n = 9;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + 0.13 * Math.sin(seed * 3.1 + i * 2.3) + 0.07 * Math.cos(seed * 1.7 + i * 4.1);
    return [cx + Math.cos(a) * r * k * 1.12, cy + Math.sin(a) * r * k * 0.88];
  });
  let d = '';
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    if (i === 0) d += `M${p1[0].toFixed(1)},${p1[1].toFixed(1)}`;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
}

/** Mix two #rrggbb colours: t = 0 gives a, t = 1 gives b. */
export function mix(a, b, t) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, '0')).join('');
}

function arc(cx, cy, r, a0, a1) {
  const p = (a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${x0.toFixed(1)},${y0.toFixed(1)}A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(1)},${y1.toFixed(1)}`;
}

const LAYOUTS = {
  // island positions by slot, in subject order; the dotted sea route follows the slots
  wide6: { w: 800, h: 520, r: 74, pos: [[150, 120], [400, 100], [650, 120], [150, 390], [400, 410], [650, 390]], route: [0, 1, 2, 5, 4, 3] },
  tall6: { w: 380, h: 990, r: 70, pos: [[112, 110], [268, 262], [112, 414], [268, 566], [112, 718], [268, 870]], route: [0, 1, 2, 3, 4, 5] },
  wide5: { w: 800, h: 470, r: 78, pos: [[165, 135], [635, 125], [400, 245], [175, 360], [625, 360]], route: [0, 2, 1, 4, 3] },
  tall5: { w: 380, h: 840, r: 72, pos: [[112, 112], [268, 272], [112, 432], [268, 592], [112, 750]], route: [0, 1, 2, 3, 4] },
  wide7: { w: 800, h: 570, r: 66, pos: [[140, 112], [400, 96], [660, 112], [530, 285], [270, 285], [140, 458], [660, 458]], route: [0, 1, 2, 3, 4, 5, 6] },
  tall7: { w: 380, h: 1140, r: 70, pos: [[112, 110], [268, 262], [112, 414], [268, 566], [112, 718], [268, 870], [112, 1022]], route: [0, 1, 2, 3, 4, 5, 6] },
};

function islandMap(app) {
  const { state, db } = app;
  const L = LAYOUTS[`${window.matchMedia('(min-width: 640px)').matches ? 'wide' : 'tall'}${Math.min(7, Math.max(5, SUBJECTS.length))}`];
  const posOf = (id) => L.pos[SUBJECTS.findIndex((x) => x.id === id)];
  const svg = s('svg', { viewBox: `0 0 ${L.w} ${L.h}`, role: 'group', 'aria-label': `Your world: ${SUBJECTS.length} subject islands` });
  const defs = s('defs', {},
    s('linearGradient', { id: 'sea', x1: 0, y1: 0, x2: 0, y2: 1 }, s('stop', { offset: 0, 'stop-color': '#bfe0f7' }), s('stop', { offset: 1, 'stop-color': '#8fc4ee' })),
    ...SUBJECTS.map((sub) => s('radialGradient', { id: `g-${sub.id}`, cx: 0.35, cy: 0.3, r: 0.85 }, s('stop', { offset: 0, 'stop-color': mix(sub.colour, '#ffffff', 0.45) }), s('stop', { offset: 1, 'stop-color': sub.colour }))));
  svg.append(defs, s('rect', { x: 0, y: 0, width: L.w, height: L.h, fill: 'url(#sea)' }));
  // gentle waves
  for (let i = 0; i < 9; i++) {
    const x = (i * 97) % (L.w - 60) + 20, y = (i * 173) % (L.h - 40) + 20;
    svg.append(s('path', { d: `M${x},${y} q8,-6 16,0 t16,0`, stroke: '#ffffff', 'stroke-opacity': 0.55, 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round' }));
  }
  // sea routes between islands
  const route = L.route.map((i) => L.pos[i]).filter(Boolean);
  svg.append(s('path', { d: 'M' + route.map((p) => p.join(',')).join(' L'), stroke: '#ffffff', 'stroke-width': 3, 'stroke-dasharray': '2 11', 'stroke-linecap': 'round', fill: 'none', opacity: 0.9 }));

  SUBJECTS.forEach((sub, idx) => {
    const [cx, cy] = posOf(sub.id);
    const r = L.r;
    const ids = db.topicOrder[sub.id] || [];
    const states = ids.map((id) => topicStatus(db.topics[id], state.topics, db));
    const done = states.filter((x) => x === 'proficient' || x === 'mastered').length;
    const g = s('g', { class: 'region', tabindex: '0', role: 'link', 'aria-label': `${sub.name}: ${done} of ${ids.length} topics secure`, onclick: () => app.go(`#/subject/${sub.id}`), onkeydown: (e) => { if (e.key === 'Enter') app.go(`#/subject/${sub.id}`); } });
    g.append(
      s('path', { d: blob(cx + 4, cy + 10, r, idx + 1), fill: '#000', opacity: 0.12 }),
      s('path', { d: blob(cx, cy, r + 8, idx + 1), fill: '#f6e3b4' }),
      s('path', { class: 'isl', d: blob(cx, cy, r, idx + 1), fill: `url(#g-${sub.id})` }));
    // segmented ring: one segment per topic, lighting up as topics become secure (white) or mastered (gold)
    const ringR = r * 0.52, gap = 0.05;
    states.forEach((st, i) => {
      const a0 = -Math.PI / 2 + (i / states.length) * Math.PI * 2 + gap / 2;
      const a1 = -Math.PI / 2 + ((i + 1) / states.length) * Math.PI * 2 - gap / 2;
      const col = st === 'mastered' ? '#ffd166' : st === 'proficient' ? '#ffffff' : st === 'learning' ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.18)';
      g.append(s('path', { d: arc(cx, cy - 6, ringR, a0, a1), stroke: col, 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'butt' }));
    });
    g.append(s('circle', { cx, cy: cy - 6, r: ringR - 9, fill: '#ffffff', opacity: 0.95 }));
    const ic = s('g', { transform: `translate(${cx - 13} ${cy - 19}) scale(1.08)`, fill: 'none', stroke: sub.colour, 'stroke-width': 2.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s('path', { d: iconPath(SUBJECT_ICON[sub.id]) }));
    g.append(ic);
    // name pill
    const pw = Math.max(110, sub.name.length * 11 + 40);
    g.append(
      s('rect', { class: 'region-pill', x: cx - pw / 2, y: cy + r * 0.6, width: pw, height: 42, rx: 14, fill: sub.colour, stroke: '#fff', 'stroke-width': 2.5 }),
      s('text', { x: cx, y: cy + r * 0.6 + 19, 'text-anchor': 'middle', class: 'region-label' }, sub.name),
      s('text', { x: cx, y: cy + r * 0.6 + 35, 'text-anchor': 'middle', class: 'region-sub' }, `${done} / ${ids.length} topics`));
    svg.append(g);
  });
  return h('div', { class: 'world card' }, svg);
}

// --- home ----------------------------------------------------------------

function todayCard(app) {
  const { state, db } = app;
  const today = app.today();
  const c = state.profile?.companion || {};
  const rest = restTime(state.settings);
  let plan = state.plan?.day === today ? state.plan : null;
  if (!plan && !rest) { state.plan = planDay(state, db, today); plan = state.plan; app.save(); }
  const finished = !!plan?.finished;
  const inProgress = plan && plan.started && !finished;
  const species = speciesOf(c, COURSE.young);
  const facts = COMPANION_FACTS[species];
  const fact = facts[today % facts.length];

  let cls = 'today', eyebrow, title, sub, tags = [], btn = null, mood = 'neutral';
  if (finished) {
    cls += ' done'; mood = 'happy';
    const days = daysPractisedThisMonth(state, today);
    const right = plan.results.filter((r) => r.correct).length;
    eyebrow = 'Today'; title = 'Finished for today!';
    sub = `${c.name || `Your ${companionNoun(species)}`} is impressed. See you tomorrow.`;
    tags = [`${days} day${days === 1 ? '' : 's'} this month`, `${right} answers right today`];
  } else if (rest) {
    cls += ' rest'; mood = 'thinking';
    eyebrow = 'Rest time'; title = 'Time to rest'; sub = rest;
  } else if (inProgress) {
    const pct = Math.round((100 * plan.pos) / Math.max(1, plan.steps.length - 1));
    eyebrow = 'Today’s session'; title = 'Pick up where you left off'; sub = `You’re ${pct}% of the way through.`;
    tags = planSummary(plan);
    btn = h('button', { class: 'btn-start', onclick: () => app.go('#/play') }, icon('play'), ' Continue');
  } else {
    eyebrow = formatDay(today); title = 'Ready when you are';
    sub = `About ${state.settings.sessionMinutes} minutes, with a ${COURSE.young ? 'wiggle' : ''} break halfway.`.replace('a  break', 'a break');
    tags = planSummary(plan);
    btn = h('button', { class: 'btn-start', onclick: () => app.go('#/play') }, icon('play'), ' Start today’s session');
  }
  return h('section', { class: cls, 'aria-label': 'Today' }, h('div', { class: 'inner' },
    capybaraEl({ ...c, mood }, 'capy bob'),
    h('div', {},
      h('div', { class: 'eyebrow' }, eyebrow),
      h('h1', {}, title),
      h('p', { style: { margin: 0 } }, sub),
      tags.length ? h('div', { class: 'tags' }, tags.map((t) => h('span', {}, t))) : h('div', { style: { height: '14px' } }),
      btn,
      h('p', { class: 'small', style: { margin: btn ? '14px 0 0' : '0', opacity: 0.85 } }, h('strong', {}, `${c.name || 'Your companion'}’s fact: `), fact))));
}

function statStrip(app) {
  const { state, db } = app;
  const topics = Object.values(state.topics).filter((t) => t.state === 'proficient' || t.state === 'mastered').length;
  const books = (state.books || []).filter((b) => b.endDay).length;
  const tile = (n, label, colour) => h('button', { class: 'stat-tile', style: { '--tile': colour }, onclick: () => app.go('#/progress') }, h('b', {}, String(n)), h('span', {}, label));
  void db;
  return h('div', { class: 'stat-strip' },
    tile(learnedCount(state), 'things you know', 'var(--accent)'),
    tile(topics, 'topics secure', 'var(--good)'),
    tile(books, books === 1 ? 'book finished' : 'books finished', 'var(--warm)'));
}

function homeCards(app, rest) {
  const { state, db } = app;
  const today = app.today();
  const cards = [];
  const card = (ico, tint, title, text, go, isNew) => h('button', { class: 'choice-card home-card', style: { '--tint': `color-mix(in srgb, ${tint} 14%, var(--card))`, '--tint-ink': tint }, onclick: () => app.go(go) },
    h('span', { class: 'ico' }, icon(ico)), h('span', { class: 'txt' }, h('h3', {}, title, isNew ? h('span', { class: 'badge-new' }, 'NEW') : null), h('p', {}, text)));
  for (const p of unseenFeedback(state)) cards.push(card('star', '#11855a', 'Feedback on your writing', db.pieceById[p.promptId]?.title || '', `#/feedback/${encodeURIComponent(p.id)}`, true));
  if (COURSE.writing && !rest && pieceDue(state, today)) {
    const cur = currentPiece(state);
    cards.push(card('pen', SUBJECT_BY_ID.english.colour, cur ? 'Carry on writing' : 'Weekly writing', cur ? db.pieceById[cur.promptId]?.title : 'A longer piece, about 30 minutes', '#/writing'));
  }
  const book = currentBooks(state)[0];
  cards.push(card('book', '#c84a14', book ? book.title : 'Choose a book', `${readingThisWeek(state, today)} minutes read this week`, '#/reading'));
  cards.push(card('chart', '#5143d9', 'My progress', 'Timeline, places and badges', '#/progress'));
  const best = Math.max(0, ...(state.papers || []).map((p) => p.score));
  const spec = paperSpec();
  const TOOLS = {
    paper: () => card('paper', SUBJECT_BY_ID.maths.colour, COURSE.young ? 'Maths test' : 'Arithmetic paper', best ? `${spec.questions} questions in ${spec.minutes} minutes · best ${best}/${spec.marks}` : `${spec.questions} questions in ${spec.minutes} minutes, like the real test`, '#/paper'),
    typing: () => card('keyboard', '#5143d9', 'Touch typing', state.typing?.best ? `best ${state.typing.best.wpm} words a minute` : 'Ten lessons, then race the river', '#/typing'),
    speed: () => card('eye', '#d63d74', 'Speed reading', (state.speed || []).length ? `last read at ${state.speed.at(-1).wpm} words a minute` : 'Read faster without losing the thread', '#/speed'),
  };
  const tools = COURSE.tools.map((t) => TOOLS[t]());
  return h('div', {}, h('div', { class: 'home-cards' }, cards), h('div', { class: 'section-title' }, h('h2', {}, 'Practice tools')), h('div', { class: 'home-cards' }, tools));
}

export function homeScreen(app) {
  const { state } = app;
  const rest = restTime(state.settings);
  mount(app.root,
    h('div', { class: 'topbar' },
      h('div', {}, h('div', { class: 'eyebrow' }, 'Grammar Stream'), h('h1', {}, `Hi ${state.profile?.childName || 'there'}!`)),
      h('span', { class: 'spacer' }),
      app.profiles().length > 1 ? h('button', { class: 'btn-icon', 'aria-label': 'Switch child', title: 'Switch child', onclick: () => app.go('#/who') }, icon('swap')) : null,
      h('button', { class: 'btn-icon', 'aria-label': 'My progress', title: 'My progress', onclick: () => app.go('#/progress') }, icon('chart')),
      h('button', { class: 'btn-icon', 'aria-label': 'How it looks', title: 'How it looks', onclick: () => app.go('#/display') }, icon('text')),
      h('button', { class: 'btn-icon', 'aria-label': 'Grown-ups', title: 'Grown-ups', onclick: () => app.go('#/parent') }, icon('lock'))),
    todayCard(app),
    statStrip(app),
    homeCards(app, rest),
    h('div', { class: 'section-title' }, h('h2', {}, 'Your world'), h('span', { class: 'muted small' }, 'Tap an island')),
    islandMap(app),
    h('p', { class: 'muted small center', style: { marginTop: '12px' } }, 'Each ring lights up as you learn: white for secure, gold for mastered.'));
}

// --- subject journey ------------------------------------------------------

export function subjectScreen(app, subjectId) {
  const { state, db } = app;
  const subj = SUBJECT_BY_ID[subjectId];
  if (!subj) return app.go('#/home');
  const ids = db.topicOrder[subjectId] || [];
  const st = subjectStats(state, db, subjectId);
  const pct = st.total ? Math.round((100 * (st.secure + st.mastered)) / st.total) : 0;
  const LABEL = { locked: 'Locked', available: 'Up next', learning: 'Learning', proficient: 'Secure', mastered: 'Mastered' };
  const ICON = { locked: 'lock', available: 'spark', learning: 'play', proficient: 'check', mastered: 'star' };
  const rows = ids.map((id) => {
    const t = db.topics[id];
    const status = topicStatus(t, state.topics, db);
    const items = (db.itemsByTopic[id] || []).filter((i) => !['template', 'written'].includes(db.items[i].kind));
    const known = items.filter((i) => isKnown(state.cards[i])).length;
    return h('li', {},
      h('span', { class: `node ${status}` }, icon(ICON[status])),
      h('div', { class: `jcard${status === 'locked' ? ' locked' : ''}` },
        h('h3', {}, t.title),
        h('div', { class: 'meta' },
          h('span', { class: `chip ${status}` }, LABEL[status]),
          t.links ? h('span', { class: 'chip uses' }, icon('link'), ` uses ${t.links.map((l) => SUBJECT_BY_ID[l].name).join(' & ')}`) : null,
          isStretch(t) ? h('span', { class: 'chip stretch' }, icon('spark'), ' stretch') : null,
          status === 'locked' && isStretch(t) && !stretchReady(db, state.topics, subjectId) ? h('span', {}, `when most of ${subj.name} is secure`)
            : status === 'locked' ? h('span', {}, `after ${t.prereqs.map((p) => db.topics[p]?.title).join(' and ')}`)
            : items.length ? [h('span', { class: 'mini-bar', 'aria-hidden': 'true' }, h('i', { style: { width: `${Math.round((100 * known) / items.length)}%` } })), h('span', {}, `${known} / ${items.length} known`)]
              : h('span', {}, 'a skill you practise'))));
  });
  const extra = subjectId === 'history' ? h('button', { class: 'btn-ghost', onclick: () => app.go('#/progress/timeline') }, icon('clock'), ' Open my timeline')
    : subjectId === 'geography' ? h('button', { class: 'btn-ghost', onclick: () => app.go('#/progress/places') }, icon('globe'), ' Places I know')
    : subjectId === 'maths' ? h('button', { class: 'btn-ghost', onclick: () => app.go('#/paper') }, icon('paper'), COURSE.young ? ' Maths test' : ' Arithmetic paper')
    : subjectId === 'science' && COURSE.young ? h('button', { class: 'btn-ghost', onclick: () => app.go('#/progress/places') }, icon('globe'), ' Places I know') : null;
  mount(app.root,
    h('div', { class: 'topbar' }, h('button', { class: 'btn-icon', 'aria-label': 'Back', onclick: () => app.go('#/home') }, icon('back')), h('span', { class: 'spacer' }), extra),
    h('div', { class: 'narrow', style: { '--subj': subj.colour } },
      h('div', { class: 'banner' },
        h('div', { class: 'ring', style: { '--p': pct } }, h('span', {}, `${pct}%`)),
        h('div', {}, h('div', { class: 'eyebrow', style: { color: 'rgba(255,255,255,.8)' } }, subj.region), h('h1', {}, subj.name),
          h('p', {}, `${st.secure + st.mastered} of ${st.total} topics secure · ${st.mastered} mastered · ${st.known} things known`))),
      h('p', { class: 'muted small' }, 'Topics become “mastered” when you still know them in mixed reviews days later.'),
      h('ol', { class: 'journey' }, rows)));
}
