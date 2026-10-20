// "My progress": subject rings, the history timeline, places I know, milestones and the wardrobe.

import { h, s, mount, toast } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { capybaraEl, ACCESSORIES } from '../ui/capybara.js';
import { mapSVG, loadMap } from '../ui/mapview.js';
import { SUBJECTS } from '../core/subjects.js';
import { learnedCount, subjectStats, timelineStatus, placesStatus, milestones, unlockedAccessories, milestoneDefs, wardrobeAccessories } from '../core/progress.js';
import { daysPractisedThisMonth } from '../core/session.js';

const TABS = [['overview', 'Stats'], ['timeline', 'Timeline'], ['places', 'Places'], ['badges', 'Badges']];
const BADGE_ICON = { 'speed-racer': 'bolt', fifty: 'star', explorer: 'globe', scientist: 'flask', 'first-session': 'flag', 'first-mastered': 'star', hundred: 'bolt', 'all-rounder': 'target', globetrotter: 'globe', 'time-traveller': 'clock', 'lab-ready': 'flask', 'joined-up': 'link', sprinter: 'hourglass', paper: 'paper', typist: 'keyboard', 'speed-reader': 'eye', stretch: 'spark', wordsmith: 'pen', bookworm: 'book', calibrated: 'target', regular: 'check', 'five-hundred': 'trophy' };

export async function progressScreen(app, tab = 'overview') {
  const body = h('div', {});
  mount(app.root,
    h('div', { class: 'topbar' }, h('button', { class: 'btn-icon', 'aria-label': 'Back', onclick: () => app.go('#/home') }, icon('back')), h('h1', {}, 'My progress')),
    h('div', { class: 'tabs', role: 'tablist' }, TABS.map(([id, label]) => h('button', { role: 'tab', 'aria-selected': String(id === tab), onclick: () => app.go(`#/progress/${id}`) }, label))),
    body);
  if (tab === 'timeline') return timelineTab(app, body);
  if (tab === 'places') return placesTab(app, body);
  if (tab === 'badges') return badgesTab(app, body);
  return overviewTab(app, body);
}

function overviewTab(app, body) {
  const { state, db } = app;
  const today = app.today();
  const topics = Object.values(state.topics);
  const ms = milestones(state, db);
  body.append(
    h('div', { class: 'stat-strip' },
      h('div', { class: 'stat-tile' }, h('b', {}, String(learnedCount(state))), h('span', {}, 'things you know')),
      h('div', { class: 'stat-tile', style: { '--tile': 'var(--good)' } }, h('b', {}, String(topics.filter((t) => t.state === 'mastered').length)), h('span', {}, 'topics mastered')),
      h('div', { class: 'stat-tile', style: { '--tile': 'var(--warm)' } }, h('b', {}, String(daysPractisedThisMonth(state, today))), h('span', {}, 'days this month'))),
    h('div', { class: 'section-title' }, h('h2', {}, 'Subjects')),
    h('div', { class: 'subj-grid' }, SUBJECTS.map((sub) => {
      const st = subjectStats(state, db, sub.id);
      const pct = st.total ? Math.round((100 * (st.secure + st.mastered)) / st.total) : 0;
      return h('button', { class: 'subj-tile', style: { '--subj': sub.colour }, onclick: () => app.go(`#/subject/${sub.id}`) },
        h('div', { class: 'ring', style: { '--p': pct } }, h('span', {}, `${pct}%`)),
        h('h3', {}, sub.name), h('p', {}, `${st.secure + st.mastered}/${st.total} topics · ${st.known} known`));
    })),
    h('div', { class: 'section-title' }, h('h2', {}, 'Next badges'), h('button', { class: 'btn-ghost', onclick: () => app.go('#/progress/badges') }, 'See all')),
    h('div', { class: 'badge-grid' }, ms.filter((m) => !m.done).sort((a, b) => b.value / b.goal - a.value / a.goal).slice(0, 4).map(badge)));
}

function badge(m) {
  return h('div', { class: `badge${m.done ? '' : ' locked'}` },
    h('div', { class: 'medal' }, icon(BADGE_ICON[m.id] || 'star')),
    h('h3', {}, m.title), h('p', {}, m.desc),
    m.done ? h('div', { class: 'chip mastered' }, icon('check'), ' Earned') : h('div', {}, h('span', { class: 'mini-bar' }, h('i', { style: { width: `${Math.round((100 * m.value) / m.goal)}%` } })), h('div', { class: 'small muted' }, `${m.value} / ${m.goal}`)),
    m.unlock ? h('div', { class: 'reward' }, m.done ? `Unlocked: ${ACCESSORIES[m.unlock]}` : `Unlocks: ${ACCESSORIES[m.unlock]}`) : null);
}

// --- timeline ---------------------------------------------------------------
// A piecewise scale gives room to recent history without a huge empty BC stretch.
const SEGMENTS = [[-3500, -500, 0, 360], [-500, 1000, 360, 820], [1000, 2000, 820, 1760]];
const xOf = (y) => {
  for (const [a, b, x0, x1] of SEGMENTS) if (y >= a && y <= b) return x0 + ((y - a) / (b - a)) * (x1 - x0);
  return y < -3500 ? 0 : 1760;
};
const PERIOD_COLOURS = ['#8f7d6a', '#b07d3a', '#7e8a55', '#c0392b', '#3b7a57', '#5143d9', '#d63d74', '#2f74e8', '#0f9a6e', '#9a48d6', '#d97a12'];

function timelineTab(app, body) {
  const { state, db } = app;
  const tl = timelineStatus(state, db);
  const W = 1800, H = 340, axisY = 190, pad = 20;
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img', 'aria-label': 'Timeline of British history' });
  svg.append(s('rect', { x: 0, y: 0, width: W, height: H, fill: 'var(--card)' }));
  tl.periods.forEach((p, i) => {
    const x0 = pad + xOf(p.from), x1 = pad + xOf(p.to);
    svg.append(s('rect', { x: x0, y: axisY - 14, width: Math.max(2, x1 - x0 - 2), height: 28, rx: 8, fill: PERIOD_COLOURS[i % PERIOD_COLOURS.length] }));
    if (x1 - x0 > 60) svg.append(s('text', { x: (x0 + x1) / 2, y: axisY + 5, 'text-anchor': 'middle', class: 'tl-period' }, p.name));
  });
  [-3000, -2000, -1000, 1, 500, 1000, 1200, 1400, 1600, 1800, 2000].forEach((y) => {
    const x = pad + xOf(y);
    svg.append(s('line', { x1: x, y1: axisY + 16, x2: x, y2: axisY + 24, stroke: 'var(--muted)', 'stroke-width': 2 }),
      s('text', { x, y: axisY + 40, 'text-anchor': 'middle', class: 'tl-year' }, y < 0 ? `${-y} BC` : y === 1 ? 'AD 1' : String(y)));
  });
  let flip = 0;
  const lastTop = [-999, -999];
  for (const e of tl.events) {
    const x = pad + xOf(e.year);
    // stagger labels on two levels above the axis, and two below, to avoid overlaps
    const lane = flip++ % 4;
    const y = [52, 104, 262, 312][lane];
    const above = lane < 2;
    void lastTop;
    svg.append(s('line', { x1: x, y1: above ? y + 10 : y - 24, x2: x, y2: above ? axisY - 14 : axisY + 14, stroke: e.known ? '#d97a12' : 'var(--line)', 'stroke-width': 2, 'stroke-dasharray': e.known ? '' : '3 4' }));
    svg.append(s('circle', { cx: x, cy: above ? axisY - 14 : axisY + 14, r: 6, fill: e.known ? '#ffd166' : 'var(--card)', stroke: e.known ? '#d97a12' : 'var(--muted)', 'stroke-width': 2 }));
    const yearText = e.year < 0 ? `${-e.year} BC` : e.year < 1000 ? `AD ${e.year}` : String(e.year);
    svg.append(s('text', { x, y: above ? y - 8 : y - 26 + 14, 'text-anchor': 'middle', class: 'tl-year' }, yearText),
      s('text', { x, y: above ? y + 6 : y + 2, 'text-anchor': 'middle', class: 'tl-label', opacity: e.known ? 1 : 0.55 }, e.known ? e.label : '?'));
  }
  const known = tl.events.filter((e) => e.known).length;
  const scroller = h('div', { class: 'timeline-scroll' }, svg);
  body.append(
    h('div', { class: 'card', style: { marginBottom: '14px' } }, h('h2', { style: { marginBottom: '4px' } }, `${known} of ${tl.events.length} events lit up`),
      h('p', { class: 'muted', style: { margin: 0 } }, 'Each event lights up once you know it. The “?” ones are still to discover. Scroll sideways to travel through time.')),
    scroller,
    h('div', { class: 'legend' }, h('span', {}, h('i', { style: { background: '#ffd166', border: '2px solid #d97a12' } }), 'You know this'), h('span', {}, h('i', { style: { background: 'var(--card)', border: '2px solid var(--muted)' } }), 'Still to discover')));
  // start scrolled to the most recently known event, so the interesting part is in view
  const lastKnown = [...tl.events].reverse().find((e) => e.known);
  requestAnimationFrame(() => { scroller.scrollLeft = Math.max(0, (lastKnown ? xOf(lastKnown.year) : xOf(1000)) - scroller.clientWidth / 2); });
}

// --- places -----------------------------------------------------------------
async function placesTab(app, body) {
  const { state, db } = app;
  const p = placesStatus(state, db);
  const maps = ['world', 'europe', 'uk'].filter((k) => p.totals[k].size > 0);
  const stored = sessionStorage.getItem('places-map');
  const choice = maps.includes(stored) ? stored : maps.includes('europe') ? 'europe' : maps[0] || 'world';
  const continents = Object.values(db.items).some((i) => i.map === 'world' && i.layer === 'continents');
  const holder = h('div', {});
  const LABEL = { world: 'World', europe: 'Europe', uk: 'UK' };
  const draw = async (which) => {
    try { sessionStorage.setItem('places-map', which); } catch { /* private mode */ }
    const map = await loadMap(which);
    const layer = which === 'world' ? (continents ? 'continents' : 'countries') : which === 'europe' ? 'countries' : 'features';
    const view = mapSVG(map, { layer, markerType: which === 'uk' ? undefined : undefined });
    for (const id of p.known[which]) view.mark(id, 'map-known');
    holder.replaceChildren(
      h('div', { class: 'tabs', role: 'tablist', style: { marginBottom: '10px' } }, maps.map((k) => h('button', { role: 'tab', 'aria-selected': String(k === which), onclick: () => draw(k) }, `${LABEL[k]} ${p.known[k].size}/${p.totals[k].size}`))),
      view.el,
      h('p', { class: 'muted small', style: { marginTop: '8px' } }, which === 'uk' ? 'Green shows the parts of the UK, rivers and places you know.' : continents ? 'Green continents are ones you can find on the map.' : 'Green countries are ones you can find on a map or know the capital of.'));
  };
  const total = continents ? p.known.world.size + p.known.uk.size : p.known.world.size + p.known.europe.size;
  body.append(h('div', { class: 'card', style: { marginBottom: '14px' } }, h('h2', { style: { marginBottom: '4px' } }, continents ? `You know ${total} place${total === 1 ? '' : 's'}` : `You know ${total} countr${total === 1 ? 'y' : 'ies'}`),
    h('p', { class: 'muted', style: { margin: 0 } }, continents ? 'Every continent, ocean and part of the UK you learn turns green. Can you find them all?' : 'Every country you learn turns green. Can you colour in the whole of Europe?')), holder);
  await draw(choice);
}

// --- badges and wardrobe ----------------------------------------------------
function badgesTab(app, body) {
  const { state, db } = app;
  const ms = milestones(state, db);
  const unlocked = unlockedAccessories(state, db);
  const c = state.profile?.companion || {};
  const lockedBy = Object.fromEntries(milestoneDefs().filter((m) => m.unlock).map((m) => [m.unlock, m]));
  const shown = wardrobeAccessories();
  const wardrobe = h('div', { class: 'wardrobe' }, Object.entries(ACCESSORIES).filter(([id]) => shown.has(id)).map(([id, label]) => {
    const open = unlocked.has(id);
    return h('button', { type: 'button', class: open ? '' : 'locked', 'aria-pressed': String(c.accessory === id), 'aria-label': open ? `Wear ${label}` : `${label}: locked`, onclick: () => {
      if (!open) return toast(`Earn “${lockedBy[id]?.title}” to unlock the ${label.toLowerCase()}.`);
      state.profile.companion.accessory = id;
      app.save();
      badgesTab(app, body.replaceChildren() || body);
    } }, capybaraEl({ ...c, accessory: id, mood: open ? 'happy' : 'neutral' }), h('span', {}, open ? label : '🔒 ' + label));
  }));
  body.append(
    h('div', { class: 'section-title' }, h('h2', {}, 'Badges'), h('span', { class: 'muted small' }, `${ms.filter((m) => m.done).length} of ${ms.length} earned`)),
    h('div', { class: 'badge-grid' }, ms.map(badge)),
    h('div', { class: 'section-title' }, h('h2', {}, `${c.name || 'Capy'}’s wardrobe`)),
    h('p', { class: 'muted' }, 'Tap an outfit to wear it. Locked ones are earned with badges.'),
    wardrobe);
}
