// The journey map: each subject is a region named after its `region`, and its topics are stepping
// stones along a winding road in learning order. A course has hundreds of topics, so each region
// shows only a short stretch of road around where the child is, with "+N" markers for the rest.
// Stretch topics climb a side path to a summit; bonus topics are a small star badge.
// The layout and state logic (regionModel, journeyModel, mapLayout) are pure and tested.

import { capybaraSVG } from './capybara.js';
import { iconPath, SUBJECT_ICON } from './icons.js';
import { SUBJECTS, isStretch } from '../core/subjects.js';
import { topicStatus } from '../core/mastery.js';
import { bonusStatus } from '../core/session.js';

const SECURE = ['proficient', 'mastered'];
const LEAD = 2; // stones shown behind the current one

export function stoneStatus(state, db, id) {
  const t = db.topics[id];
  return t.bonus ? bonusStatus(state, db, id) : topicStatus(t, state.topics, db);
}

/** The topic being worked on in a list: the learning one started most recently, else the next one open. */
function pickCurrent(state, list) {
  const order = Object.keys(state.topics);
  const learning = list.filter((x) => x.status === 'learning')
    .sort((a, b) => (state.topics[b.id].started ?? 0) - (state.topics[a.id].started ?? 0) || order.indexOf(b.id) - order.indexOf(a.id));
  return learning[0] || list.find((x) => x.status === 'available') || null;
}

/**
 * Which stones a region shows: `slots` places along the road, the ends becoming "+N" markers when
 * there are more topics than places. The current stone sits LEAD places in, so a few done stones show.
 */
export function stoneWindow(n, idx, slots) {
  if (n <= slots) return { a: 0, b: n, before: 0, after: 0 };
  let a = Math.max(0, idx - LEAD), b;
  const room = slots - (a > 0 ? 1 : 0);
  if (a + room >= n) { a = n - (slots - 1); b = n; } else b = a + room - 1;
  return { a, b, before: a, after: n - b };
}

/** Everything a region needs to draw itself (pure). */
export function regionModel(state, db, subjectId, { slots = 7 } = {}) {
  const ids = db.topicOrder[subjectId] || [];
  const all = ids.map((id) => ({ id, title: db.topics[id].title, status: stoneStatus(state, db, id), stretch: isStretch(db.topics[id]), bonus: !!db.topics[id].bonus }));
  const core = all.filter((x) => !x.stretch && !x.bonus);
  const stretch = all.filter((x) => x.stretch && !x.bonus);
  const bonus = all.filter((x) => x.bonus);
  const current = pickCurrent(state, [...core, ...stretch].filter((x) => x.status === 'learning')) || pickCurrent(state, core) || pickCurrent(state, stretch);
  const ci = current ? core.indexOf(current) : -1;
  // with nothing current on the main road (all done, or working up the stretch path) the road shows its end
  const win = stoneWindow(core.length, ci >= 0 ? ci : core.length - 1, slots);
  const sOpen = stretch.findIndex((x) => !SECURE.includes(x.status));
  const s0 = Math.max(0, Math.min(stretch.length - 3, stretch.includes(current) ? stretch.indexOf(current) - 1 : sOpen < 0 ? stretch.length - 3 : sOpen - 1));
  const count = (list) => list.filter((x) => SECURE.includes(x.status)).length;
  return {
    subject: subjectId,
    total: all.length,
    secure: count(all),
    mastered: all.filter((x) => x.status === 'mastered').length,
    reached: all.some((x) => state.topics[x.id]),
    complete: core.length > 0 && count(core) === core.length,
    current: current?.id || null,
    stones: core.slice(win.a, win.b),
    before: win.before, beforeSecure: core.slice(0, win.a).every((x) => SECURE.includes(x.status)), beforeId: core[win.a - 1]?.id || null,
    after: win.after, afterId: core[win.b]?.id || null,
    stretch: { total: stretch.length, secure: count(stretch), stones: stretch.slice(Math.max(0, s0), Math.max(0, s0) + 3) },
    bonus: bonus.length ? { total: bonus.length, secure: bonus.filter((x) => SECURE.includes(x.status)).length, next: (bonus.find((x) => !SECURE.includes(x.status)) || bonus[0]).id } : null,
  };
}

/**
 * The whole map: one model per subject. A region opens once any of its topics has been reached
 * (the first is open from the start); the companion stands on the most recently started topic.
 */
export function journeyModel(state, db, subjects = SUBJECTS, opts = {}) {
  const regions = subjects.map((sub, i) => {
    const m = regionModel(state, db, sub.id, opts);
    return { ...m, name: sub.name, region: sub.region, colour: sub.colour, open: i === 0 || m.reached };
  });
  const started = (id) => state.topics[id]?.started ?? -Infinity;
  let here = null;
  for (const r of regions) {
    if (!r.current || state.topics[r.current]?.state !== 'learning') continue;
    if (!here || started(r.current) > started(here.current)) here = r;
  }
  here ||= regions.find((r) => r.open && r.current) || regions[0];
  for (const r of regions) r.here = r === here;
  return { regions, here: here?.subject || null };
}

export const regionLabel = (r) => `${r.name}${r.region ? `, ${r.region}` : ''}: ${r.secure} of ${r.total} topics secure${r.mastered ? `, ${r.mastered} mastered` : ''}${r.open ? '' : '. Not started yet'}`;

// --- geometry -----------------------------------------------------------------

export const LAYOUT = {
  phone: { cols: 1, cw: 360, ch: 222, slots: 7, mid: 140, amp: 32, padX: 40, r: 13 },
  tablet: { cols: 2, cw: 400, ch: 232, slots: 7, mid: 146, amp: 34, padX: 44, r: 14 },
  strip: { cols: 1, cw: 360, ch: 164, slots: 7, mid: 102, amp: 28, padX: 40, r: 13, spur: [-30, -50, -58] },
  stripWide: { cols: 1, cw: 640, ch: 164, slots: 11, mid: 102, amp: 30, padX: 48, r: 14, spur: [-30, -50, -58] },
};

/** Where each region's cell sits: rows snake back and forth, so the road reads as one journey. */
export function mapLayout(n, L) {
  const cells = [];
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / L.cols), k = i % L.cols, dir = row % 2 ? -1 : 1;
    cells.push({ x: (dir > 0 ? k : L.cols - 1 - k) * L.cw, y: row * L.ch, dir });
  }
  return { cells, w: L.cols * L.cw, h: Math.ceil(n / L.cols) * L.ch };
}

/** Slot positions along a region's road, in the cell's coordinates. */
export function slotPoints(m, L, dir) {
  return Array.from({ length: m }, (_, i) => {
    const t = m === 1 ? 0.5 : i / (m - 1);
    const x = L.padX + t * (L.cw - 2 * L.padX);
    return { x: dir > 0 ? x : L.cw - x, y: L.mid + L.amp * Math.sin(2 * Math.PI * t), t };
  });
}

const f = (v) => Math.round(v * 10) / 10;
const esc = (t) => String(t ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function roadPath(L, dir) {
  const pts = [];
  for (let i = 0; i <= 30; i++) {
    const t = i / 30, x = L.padX + t * (L.cw - 2 * L.padX);
    pts.push(`${f(dir > 0 ? x : L.cw - x)},${f(L.mid + L.amp * Math.sin(2 * Math.PI * t))}`);
  }
  return 'M' + pts.join('L');
}

/** A soft, slightly wobbly rounded land shape filling the cell. */
function landPath(w, h, seed) {
  const n = 22, pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    // a squircle, so the land fills its cell, with a little wobble
    const k = 1 + 0.018 * Math.sin(seed * 2.3 + i * 1.7);
    pts.push([w / 2 + (w / 2 - 8) * Math.sign(c) * Math.abs(c) ** 0.3 * k, h / 2 + (h / 2 - 8) * Math.sign(s) * Math.abs(s) ** 0.3 * k]);
  }
  let d = '';
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    if (!i) d += `M${f(p1[0])},${f(p1[1])}`;
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
  }
  return d + 'Z';
}

// --- decorations (original flat art; each drawn standing on (0, 0)) ----------------

const C = { rock: '#8f88aa', rock2: '#726b93', snow: '#ffffff', gold: '#ffc94a', red: '#e4572e', blue: '#3a86ff', navy: '#2b2d6e', green: '#3aa55d', dgreen: '#2a7a44', wood: '#a0663a', marble: '#f6f1e7', marble2: '#d8cdb9', water: '#5bb6e8', orange: '#ff8a3d', purple: '#8e4fd6', dark: '#3b3752', terracotta: '#c8612d' };
const shadow = (w) => `<ellipse cx="0" cy="1" rx="${w}" ry="${f(w * 0.16)}" fill="#000" opacity=".08"/>`;
const sparkle = (x, y, r, c = C.gold) => `<path d="M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z" fill="${c}"/>`;
const star5 = (x, y, r, c) => {
  const p = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; return `${f(x + rr * Math.cos(a))},${f(y + rr * Math.sin(a))}`; });
  return `<path d="M${p.join('L')}Z" fill="${c}"/>`;
};
const car = (c = C.red) => `<rect x="-17" y="-12" width="34" height="8" rx="4" fill="${c}"/><path d="M-7 -12q7 -9 14 0z" fill="${c}"/><circle cx="0" cy="-15" r="3.4" fill="${C.gold}"/><rect x="13" y="-15" width="6" height="3" rx="1" fill="${c}"/><circle cx="-10" cy="-3.5" r="4.2" fill="#2b2b3a"/><circle cx="10" cy="-3.5" r="4.2" fill="#2b2b3a"/><circle cx="-10" cy="-3.5" r="1.6" fill="#ccc"/><circle cx="10" cy="-3.5" r="1.6" fill="#ccc"/>`;
const flagPole = (body) => `<rect x="-1.5" y="-48" width="3" height="48" rx="1.5" fill="${C.dark}"/>${body}`;

const DECO = {
  peaks: () => `${shadow(56)}<path d="M-58 0L-22 -56L10 0Z" fill="${C.rock}"/><path d="M-22 -56L-33 -39L-27 -41L-22 -35L-16 -41L-11 -39Z" fill="${C.snow}"/><path d="M-8 0L26 -44L58 0Z" fill="${C.rock2}"/><path d="M26 -44L17 -32L22 -33L26 -29L30 -33L35 -32Z" fill="${C.snow}"/>`,
  track: () => `${shadow(52)}<path d="M-52 -4C-52 -36 52 -36 52 -4" stroke="#5b5870" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M-52 -4C-52 -36 52 -36 52 -4" stroke="#fff" stroke-width="1.6" stroke-dasharray="5 5" fill="none"/><g transform="translate(6 -26) rotate(-4)">${car()}</g>`,
  flag: () => `${shadow(10)}${flagPole(`<path d="M1.5 -48h24v16h-24z" fill="#fff"/><path d="M1.5 -48h6v4h-6zM13.5 -48h6v4h-6zM7.5 -44h6v4h-6zM19.5 -44h6v4h-6zM1.5 -40h6v4h-6zM13.5 -40h6v4h-6zM7.5 -36h6v4h-6zM19.5 -36h6v4h-6z" fill="#2b2b3a"/>`)}`,
  pennant: (c) => `${shadow(10)}${flagPole(`<path d="M1.5 -48L28 -40L1.5 -32Z" fill="${c}"/>`)}`,
  planet: (c) => `<circle cx="0" cy="-26" r="17" fill="${c}"/><circle cx="-6" cy="-31" r="3.5" fill="#fff" opacity=".35"/><circle cx="5" cy="-20" r="2.5" fill="#000" opacity=".12"/><ellipse cx="0" cy="-26" rx="28" ry="7" fill="none" stroke="${C.gold}" stroke-width="3" transform="rotate(-14 0 -26)"/>${sparkle(30, -48, 5)}${sparkle(-30, -8, 4)}`,
  stars: () => `${sparkle(-14, -30, 6)}${sparkle(12, -14, 4.5, '#fff')}${sparkle(16, -40, 3.5)}${sparkle(-6, -6, 3, '#fff')}`,
  rocket: () => `${shadow(14)}<path d="M0 -62C10 -52 11 -32 8 -14H-8C-11 -32 -10 -52 0 -62Z" fill="#fff" stroke="#d9d4e8" stroke-width="1.5"/><path d="M0 -62C5 -57 7 -52 8 -48H-8C-7 -52 -5 -57 0 -62Z" fill="${C.red}"/><circle cx="0" cy="-36" r="4.5" fill="${C.blue}" stroke="#fff" stroke-width="1.5"/><path d="M-8 -26L-16 -10L-8 -14ZM8 -26L16 -10L8 -14Z" fill="${C.red}"/><path d="M-5 -13Q0 2 5 -13Z" fill="${C.orange}"/>`,
  bookRocket: (c) => `${shadow(40)}<path d="M-40 -2Q-20 -12 0 -4Q20 -12 40 -2V-16Q20 -26 0 -18Q-20 -26 -40 -16Z" fill="${c}"/><path d="M-36 -8Q-18 -18 -2 -10V-22Q-18 -30 -36 -20Z M36 -8Q18 -18 2 -10V-22Q18 -30 36 -20Z" fill="#fff"/><g transform="translate(14 -26) rotate(20) scale(.6)">${'' /* the rocket rises from the book */}<path d="M0 -62C10 -52 11 -32 8 -14H-8C-11 -32 -10 -52 0 -62Z" fill="#fff" stroke="#d9d4e8" stroke-width="2"/><path d="M0 -62C5 -57 7 -52 8 -48H-8C-7 -52 -5 -57 0 -62Z" fill="${C.red}"/><circle cx="0" cy="-36" r="5" fill="${C.blue}"/><path d="M-8 -26L-16 -10L-8 -14ZM8 -26L16 -10L8 -14Z" fill="${C.red}"/><path d="M-5 -13Q0 6 5 -13Z" fill="${C.orange}"/></g>${sparkle(-26, -44, 5)}${sparkle(34, -52, 4)}`,
  tower: (c) => `${shadow(40)}<rect x="-36" y="-34" width="22" height="34" rx="3" fill="${C.navy}"/><rect x="14" y="-40" width="22" height="40" rx="3" fill="${C.navy}"/><rect x="-15" y="-70" width="30" height="70" rx="4" fill="${c}"/><path d="M-15 -70L0 -84L15 -70Z" fill="${C.navy}"/><circle cx="0" cy="-54" r="10" fill="${C.gold}"/>${star5(0, -54, 7, C.red)}${[-30, -22, 20, 28].map((x) => `<rect x="${x}" y="-26" width="4" height="6" rx="1" fill="${C.gold}" opacity=".8"/>`).join('')}<rect x="-5" y="-16" width="10" height="16" rx="5" fill="${C.navy}"/>`,
  bolt: () => `<path d="M4 -46L-12 -18H-1L-6 0L12 -28H1Z" fill="${C.gold}" stroke="#e0a11b" stroke-width="1.5" stroke-linejoin="round"/>`,
  shield: (c) => `${shadow(14)}<path d="M-15 -42H15V-24C15 -10 6 -3 0 0C-6 -3 -15 -10 -15 -24Z" fill="${c}" stroke="#fff" stroke-width="2"/><path d="M-3 -38H3V-26H11V-20H3V-6H-3V-20H-11V-26H-3Z" fill="${C.gold}"/>`,
  castle: (c) => `${shadow(46)}<rect x="-32" y="-38" width="64" height="38" fill="${C.marble2}"/>${[-30, -18, -6, 6, 18].map((x) => `<rect x="${x + 2}" y="-44" width="8" height="7" fill="${C.marble2}"/>`).join('')}<rect x="-46" y="-56" width="18" height="56" fill="#cbbfa8"/><rect x="28" y="-56" width="18" height="56" fill="#cbbfa8"/>${[-46, -40, -34, 28, 34, 40].map((x) => `<rect x="${x}" y="-62" width="5" height="7" fill="#cbbfa8"/>`).join('')}<path d="M-9 0V-14A9 9 0 0 1 9 -14V0Z" fill="${C.dark}"/><rect x="-40" y="-44" width="5" height="8" rx="2.5" fill="${C.dark}"/><rect x="35" y="-44" width="5" height="8" rx="2.5" fill="${C.dark}"/><rect x="-38" y="-80" width="2" height="18" fill="${C.dark}"/><path d="M-36 -80L-22 -75L-36 -70Z" fill="${c}"/><rect x="36" y="-80" width="2" height="18" fill="${C.dark}"/><path d="M38 -80L52 -75L38 -70Z" fill="${c}"/>`,
  lighthouse: () => `${shadow(44)}<path d="M-46 0C-44 -20 -30 -30 -6 -32C14 -33 30 -26 46 0Z" fill="${C.rock}"/><path d="M8 -32L10 -74H22L24 -32Z" fill="#fff"/><path d="M9.3 -60H22.7L23.2 -50H8.8ZM8.3 -42H23.7L24 -36H8Z" fill="${C.red}"/><rect x="8" y="-82" width="16" height="9" rx="2" fill="${C.gold}"/><path d="M6 -84Q16 -92 26 -84Z" fill="${C.red}"/><path d="M26 -80L50 -88V-72Z" fill="${C.gold}" opacity=".45"/>`,
  books: () => `${shadow(24)}<rect x="-22" y="-10" width="44" height="10" rx="2" fill="${C.blue}"/><rect x="-18" y="-20" width="38" height="10" rx="2" fill="${C.red}"/><rect x="-20" y="-30" width="34" height="10" rx="2" fill="${C.green}"/><rect x="-16" y="-27" width="26" height="2" fill="#fff" opacity=".6"/><rect x="-14" y="-17" width="28" height="2" fill="#fff" opacity=".6"/>`,
  gull: () => `<path d="M-14 -40Q-7 -48 0 -40Q7 -48 14 -40" stroke="${C.dark}" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M4 -24Q9 -30 14 -24Q19 -30 24 -24" stroke="${C.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  abacus: () => `${shadow(30)}<rect x="-30" y="-48" width="60" height="44" rx="4" fill="none" stroke="${C.wood}" stroke-width="5"/>${[-36, -24, -12].map((y, j) => `<line x1="-28" y1="${y}" x2="28" y2="${y}" stroke="${C.wood}" stroke-width="1.5"/>${[0, 1, 2, 3].map((k) => `<circle cx="${-20 + k * 9 + j * 6}" cy="${y}" r="4.5" fill="${[C.red, C.blue, C.gold][j]}"/>`).join('')}`).join('')}<rect x="-26" y="-4" width="6" height="4" fill="${C.wood}"/><rect x="20" y="-4" width="6" height="4" fill="${C.wood}"/>`,
  river: () => `<path d="M-56 -8C-36 -22 -18 4 4 -10S40 -20 56 -8V2C40 -10 26 -6 4 2S-36 -10 -56 4Z" fill="${C.water}"/><path d="M-30 -8q6 -4 12 0M14 -10q6 -4 12 0" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".8"/>`,
  hourglass: () => `${shadow(14)}<rect x="-15" y="-46" width="30" height="5" rx="2" fill="${C.wood}"/><rect x="-15" y="-5" width="30" height="5" rx="2" fill="${C.wood}"/><path d="M-11 -41H11Q11 -30 2 -23Q11 -16 11 -5H-11Q-11 -16 -2 -23Q-11 -30 -11 -41Z" fill="#e8f4ff" stroke="#b9c6d6" stroke-width="1.5"/><path d="M-7 -36H7Q5 -30 0 -27Q-5 -30 -7 -36ZM-9 -5Q-8 -13 0 -15Q8 -13 9 -5Z" fill="${C.gold}"/>`,
  tree: () => `${shadow(18)}<rect x="-3" y="-22" width="6" height="22" rx="2" fill="${C.wood}"/><circle cx="0" cy="-32" r="16" fill="${C.green}"/><circle cx="-7" cy="-37" r="6" fill="#fff" opacity=".15"/>`,
  palm: () => `${shadow(16)}<path d="M-2 0Q2 -24 10 -44" stroke="${C.wood}" stroke-width="5" fill="none" stroke-linecap="round"/>${[[-30, -6], [10, -16], [40, -2], [-70, 10], [80, 14]].map(([a, d]) => `<ellipse cx="10" cy="${-44 + d * 0}" rx="18" ry="5" fill="${C.green}" transform="rotate(${a} 10 -44) translate(14 0)"/>`).join('')}<circle cx="8" cy="-40" r="3" fill="${C.wood}"/>`,
  compass: () => `<circle cx="0" cy="-22" r="20" fill="#fff" stroke="${C.gold}" stroke-width="3"/><path d="M0 -40L5 -22L0 -4L-5 -22Z" fill="${C.red}"/><path d="M-18 -22L0 -27L18 -22L0 -17Z" fill="${C.dark}" opacity=".7"/><circle cx="0" cy="-22" r="2.5" fill="${C.gold}"/>`,
  boat: (c) => `<path d="M-52 2C-30 -6 -10 6 10 -2S40 -6 52 2V8H-52Z" fill="${C.water}" opacity=".85"/><path d="M-26 -4H26L18 6H-18Z" fill="${C.wood}"/><rect x="-1.5" y="-50" width="3" height="46" fill="${C.dark}"/><path d="M2 -48L26 -10H2Z" fill="#fff"/><path d="M-2 -44L-22 -10H-2Z" fill="#fff" opacity=".9"/><path d="M1.5 -50L14 -46L1.5 -42Z" fill="${c}"/>`,
  lagoon: (c) => `<ellipse cx="0" cy="-8" rx="50" ry="13" fill="${C.water}"/><ellipse cx="0" cy="-10" rx="38" ry="7" fill="#fff" opacity=".25"/><g transform="translate(18 -14) scale(.8)">${DECO_FLASK(c)}</g>${[[-24, -30, 4], [-14, -40, 3], [-30, -46, 2.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${C.water}" stroke-width="1.8"/>`).join('')}`,
  flask: (c) => `${shadow(14)}${DECO_FLASK(c)}`,
  bubbles: () => [[-8, -12, 6], [6, -24, 4.5], [-4, -36, 3.5], [10, -44, 2.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${C.water}" stroke-width="2"/>`).join(''),
  dino: () => `${shadow(30)}<path d="M-34 -14C-30 -30 -10 -34 4 -30C12 -40 14 -54 22 -56C30 -58 36 -54 36 -48C36 -44 30 -44 26 -44C24 -36 22 -26 18 -18L22 0H14L10 -12H-8L-10 0H-18L-18 -12C-26 -12 -36 -8 -44 -4C-40 -8 -36 -10 -34 -14Z" fill="${C.green}"/><circle cx="29" cy="-51" r="1.8" fill="${C.dark}"/>${[-22, -12, -2].map((x) => `<path d="M${x} -31l4 -6l4 5z" fill="${C.dgreen}"/>`).join('')}`,
  temple: () => `${shadow(46)}<rect x="-44" y="-6" width="88" height="6" fill="${C.marble2}"/><rect x="-40" y="-11" width="80" height="5" fill="${C.marble}"/>${[-33, -17, -1, 15, 31].map((x) => `<rect x="${x - 1}" y="-44" width="8" height="33" fill="${C.marble}"/><rect x="${x + 1}" y="-44" width="2" height="33" fill="${C.marble2}"/>`).join('')}<rect x="-42" y="-49" width="84" height="6" fill="${C.marble}"/><path d="M-44 -49L0 -68L44 -49Z" fill="${C.marble}" stroke="${C.marble2}" stroke-width="1.5"/><circle cx="0" cy="-56" r="3" fill="${C.gold}"/>`,
  arch: () => `${shadow(30)}<path d="M-30 0V-46H30V0H16V-24A16 16 0 0 0 -16 -24V0Z" fill="${C.marble}" stroke="${C.marble2}" stroke-width="1.5"/><rect x="-33" y="-52" width="66" height="7" fill="${C.marble2}"/><path d="M-14 -36h28" stroke="${C.marble2}" stroke-width="1.5"/>`,
  column: () => `${shadow(12)}<rect x="-11" y="-5" width="22" height="5" fill="${C.marble2}"/><rect x="-7" y="-42" width="14" height="37" fill="${C.marble}"/><path d="M-3 -42v37M3 -42v37" stroke="${C.marble2}" stroke-width="1.2"/><path d="M-12 -48h24l-4 6h-16z" fill="${C.marble2}"/><circle cx="-11" cy="-46" r="3" fill="${C.marble2}"/><circle cx="11" cy="-46" r="3" fill="${C.marble2}"/>`,
  scroll: () => `${shadow(22)}<rect x="-18" y="-24" width="36" height="20" fill="#f3e2b8"/><path d="M-12 -18h22M-12 -13h18M-12 -8h20" stroke="${C.wood}" stroke-width="1.2" opacity=".6"/><rect x="-24" y="-27" width="7" height="26" rx="3.5" fill="#e2c88f"/><rect x="17" y="-27" width="7" height="26" rx="3.5" fill="#e2c88f"/>`,
  lyre: () => `${shadow(14)}<path d="M-14 -46C-20 -30 -14 -12 0 -6C14 -12 20 -30 14 -46" stroke="${C.gold}" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="-14" y="-44" width="28" height="3" rx="1.5" fill="${C.wood}"/>${[-6, -2, 2, 6].map((x) => `<line x1="${x}" y1="-41" x2="${x}" y2="-10" stroke="${C.dark}" stroke-width=".9"/>`).join('')}<rect x="-6" y="-8" width="12" height="4" rx="2" fill="${C.wood}"/>`,
  triangle: (c) => `${shadow(26)}<path d="M-26 0V-40L26 0Z" fill="${c}" opacity=".85"/><path d="M-26 -8h8v8" stroke="#fff" stroke-width="2" fill="none"/>`,
  volcano: () => `${shadow(50)}<path d="M-52 0L-16 -46H16L52 0Z" fill="#7d5a4f"/><path d="M-16 -46H16L22 -38L10 -40L4 -30L-4 -40L-14 -34Z" fill="${C.orange}"/><path d="M-6 -46Q-12 -60 -2 -66Q4 -76 14 -68Q22 -68 20 -58" fill="#fff" opacity=".55"/>`,
  anvil: () => `${shadow(26)}<path d="M-24 -28H18Q28 -28 30 -22H14V-16H6L10 -6H16V0H-16V-6H-10L-6 -16H-14Q-24 -18 -24 -28Z" fill="#4b4a5c"/><rect x="-8" y="-46" width="5" height="22" rx="2" fill="${C.wood}" transform="rotate(-35 -6 -36)"/><rect x="-20" y="-50" width="16" height="9" rx="2" fill="#6d6c80" transform="rotate(-35 -12 -45)"/>${sparkle(18, -38, 4, C.orange)}${sparkle(26, -46, 3, C.gold)}`,
  flame: () => `${shadow(10)}<path d="M0 -40C10 -28 14 -18 10 -8C8 -2 4 0 0 0C-6 0 -11 -4 -11 -12C-11 -20 -4 -24 0 -40Z" fill="${C.orange}"/><path d="M0 -20C5 -14 6 -8 4 -4C2 -1 -3 -1 -4 -5C-5 -10 -2 -13 0 -20Z" fill="${C.gold}"/>`,
  amphora: () => `${shadow(14)}<path d="M-6 -48H6V-42C16 -36 18 -20 10 -8L6 0H-6L-10 -8C-18 -20 -16 -36 -6 -42Z" fill="${C.terracotta}"/><path d="M-6 -42C-14 -42 -16 -34 -12 -30M6 -42C14 -42 16 -34 12 -30" stroke="${C.terracotta}" stroke-width="3" fill="none"/><rect x="-14" y="-28" width="28" height="7" fill="#2b2b3a" opacity=".75"/><path d="M-10 -24h4M-2 -24h4M6 -24h4" stroke="${C.terracotta}" stroke-width="2"/>`,
  laurel: () => `${[-1, 1].map((sd) => `<path d="M0 -4C${sd * 18} -8 ${sd * 22} -24 ${sd * 12} -40" stroke="${C.dgreen}" stroke-width="2" fill="none"/>${[0, 1, 2, 3].map((k) => `<ellipse cx="${sd * (12 + 5 * Math.sin(k))}" cy="${-10 - k * 8}" rx="6" ry="2.8" fill="${C.green}" transform="rotate(${sd * (40 + k * 12)} ${sd * (12 + 5 * Math.sin(k))} ${-10 - k * 8})"/>`).join('')}`).join('')}`,
  globe: () => `${shadow(20)}<path d="M-24 -34A24 24 0 0 0 10 -6" stroke="${C.wood}" stroke-width="3" fill="none"/><rect x="-3" y="-8" width="6" height="8" fill="${C.wood}"/><rect x="-12" y="-3" width="24" height="3" rx="1.5" fill="${C.wood}"/><circle cx="0" cy="-30" r="19" fill="${C.water}"/><path d="M-12 -40q8 -4 10 4q-2 6 -8 6q-6 -2 -2 -10zM4 -26q8 -4 10 2q0 8 -6 10q-6 -4 -4 -12zM-4 -16q4 0 4 4h-6z" fill="${C.green}"/>`,
  labyrinth: () => `${shadow(30)}<rect x="-28" y="-54" width="56" height="54" rx="4" fill="${C.marble}"/><path d="M-22 -6V-48H22V-12H-14V-40H14V-20H-6V-32H6" stroke="${C.rock2}" stroke-width="4" fill="none" stroke-linejoin="round"/>`,
  wings: () => `${[-1, 1].map((sd) => `<path d="M${sd * 4} -22C${sd * 16} -40 ${sd * 40} -42 ${sd * 48} -36C${sd * 40} -32 ${sd * 42} -26 ${sd * 34} -24C${sd * 38} -20 ${sd * 34} -14 ${sd * 26} -14C${sd * 24} -8 ${sd * 14} -8 ${sd * 4} -16Z" fill="#fff" stroke="${C.marble2}" stroke-width="1.5"/>`).join('')}<rect x="-4" y="-26" width="8" height="14" rx="4" fill="${C.wood}"/>`,
  gear: () => `${shadow(16)}<g transform="translate(0 -20)">${Array.from({ length: 8 }, (_, k) => `<rect x="-4" y="-21" width="8" height="9" rx="1.5" fill="#8a8aa0" transform="rotate(${k * 45})"/>`).join('')}<circle r="15" fill="#8a8aa0"/><circle r="6" fill="#fff" opacity=".85"/></g>`,
  tripod: () => `${shadow(16)}<path d="M-14 0L-6 -26M14 0L6 -26M0 0V-26" stroke="${C.gold}" stroke-width="3" stroke-linecap="round"/><path d="M-14 -30H14Q12 -22 0 -22Q-12 -22 -14 -30Z" fill="${C.gold}"/><path d="M-2 -34Q-8 -42 -2 -48Q4 -54 0 -62M6 -34Q2 -42 8 -46" stroke="${C.rock}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/>`,
  tholos: () => `${shadow(40)}<rect x="-38" y="-6" width="76" height="6" fill="${C.marble2}"/>${[-30, -16, -2, 12, 26].map((x) => `<rect x="${x}" y="-38" width="7" height="32" fill="${C.marble}"/>`).join('')}<rect x="-36" y="-44" width="72" height="6" fill="${C.marble}"/><path d="M-32 -44Q0 -70 32 -44Z" fill="${C.marble2}"/><rect x="-1" y="-66" width="2" height="6" fill="${C.gold}"/>`,
};
function DECO_FLASK(c) {
  return `<path d="M-6 -40H6V-28L18 -6Q20 0 14 0H-14Q-20 0 -18 -6L-6 -28Z" fill="#eaf4ff" stroke="#b9c6d6" stroke-width="1.5"/><path d="M-12 -12H12L16 -5Q17 -1 13 -1H-13Q-17 -1 -16 -5Z" fill="${c}"/><rect x="-8" y="-43" width="16" height="4" rx="2" fill="#b9c6d6"/>`;
}

// Three places for pictures in each region: z1 above the road's dip, z2 below its crest (the biggest), z3 a corner.
const THEMES = {
  'Speedway Peaks': ['track', 'peaks', 'flag'],
  'Story Galaxy': ['planet', 'bookRocket', 'stars'],
  'Hero Academy': ['shield', 'tower', 'bolt'],
  'Planet Lab': ['planet', 'dino', 'rocket'],
  'Castle Command': ['shield', 'castle', 'pennant'],
  'Library Cliffs': ['books', 'lighthouse', 'gull'],
  'Number Peaks': ['abacus', 'peaks', 'triangle'],
  'Timeline River': ['hourglass', 'river', 'tree'],
  'Explorer Coast': ['compass', 'boat', 'palm'],
  'Lab Lagoon': ['flask', 'lagoon', 'bubbles'],
  'Forum Isle': ['arch', 'temple', 'column'],
  'Library of the Muses': ['scroll', 'temple', 'lyre'],
  'Pythagoras Peaks': ['triangle', 'peaks', 'compass'],
  'Forge of Hephaestus': ['anvil', 'volcano', 'flame'],
  'Hall of Clio': ['amphora', 'temple', 'laurel'],
  'Atlas Range': ['globe', 'peaks', 'compass'],
  'Daedalus Workshop': ['wings', 'labyrinth', 'gear'],
  'Oracle of Delphi': ['tripod', 'tholos', 'laurel'],
};
const BY_SUBJECT = { maths: ['abacus', 'peaks', 'triangle'], english: ['books', 'temple', 'scroll'], reading: ['books', 'bookRocket', 'stars'], spelling: ['books', 'tower', 'bolt'], science: ['flask', 'planet', 'bubbles'], history: ['hourglass', 'castle', 'pennant'], geography: ['compass', 'boat', 'palm'], latin: ['arch', 'temple', 'column'], greek: ['tripod', 'tholos', 'laurel'], computing: ['wings', 'gear', 'gear'] };
export const themeOf = (r) => THEMES[r.region] || BY_SUBJECT[r.subject] || ['tree', 'peaks', 'tree'];

const place = (kind, x, y, sc, colour) => `<g transform="translate(${f(x)} ${f(y)}) scale(${sc})">${(DECO[kind] || DECO.tree)(colour)}</g>`;

// --- drawing ------------------------------------------------------------------

const TICK = (x, y) => `<path d="M${f(x - 5)} ${f(y)}l3.6 3.6l6.6 -7" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

function stoneSVG(st, x, y, r, current) {
  const glow = SECURE.includes(st.status) ? `<ellipse class="jr-glow" cx="${f(x)}" cy="${f(y)}" rx="${r + 7}" ry="${f((r + 7) * 0.82)}"/>` : '';
  const mark = st.status === 'mastered' ? star5(x, y - 1, r * 0.55, '#fff')
    : st.status === 'proficient' ? TICK(x, y - 1)
    : st.status === 'learning' ? `<circle class="jr-dot" cx="${f(x)}" cy="${f(y - 1)}" r="${f(r * 0.35)}"/>` : '';
  const here = current ? `<ellipse class="jr-here" cx="${f(x)}" cy="${f(y)}" rx="${r + 8}" ry="${f((r + 8) * 0.82)}"/>` : '';
  return `<g class="jr-stone s-${st.status}" data-topic="${esc(st.id)}">${glow}${here}<ellipse class="jr-side" cx="${f(x)}" cy="${f(y + 3)}" rx="${r}" ry="${f(r * 0.78)}"/><ellipse class="jr-top" cx="${f(x)}" cy="${f(y)}" rx="${r}" ry="${f(r * 0.78)}"/>${mark}<title>${esc(st.title)}</title></g>`;
}

function pill(x, y, text, topic, cls = '') {
  const w = 12 + text.length * 7.2;
  return `<g class="jr-more ${cls}" ${topic ? `data-topic="${esc(topic)}"` : ''}><rect x="${f(x - w / 2)}" y="${f(y - 11)}" width="${f(w)}" height="22" rx="11"/><text x="${f(x)}" y="${f(y + 4)}" text-anchor="middle">${esc(text)}</text></g>`;
}

/** The small companion, standing on (x, y). The drawings face left, so it turns to face the way the road goes. */
function companionAt(companion, x, y, dir, size = 66) {
  const h = size * 0.8;
  const svg = capybaraSVG({ ...companion, mood: 'happy', title: ' ' }).replace(/role="img" aria-label="[^"]*"/, 'aria-hidden="true"');
  const flip = dir > 0 ? ` transform="translate(${f(2 * x)} 0) scale(-1 1)"` : '';
  return `<g class="jr-companion"${flip}>${svg.replace('<svg ', `<svg x="${f(x - size / 2)}" y="${f(y - h + 4)}" width="${size}" height="${f(h)}" `)}</g>`;
}

/** The stretch path's stones climb from the end of the road towards the far top corner. */
export function spurPt(L, dir, k) {
  const x = L.cw - L.padX + [14, -6, -32][k];
  return { x: dir > 0 ? x : L.cw - x, y: L.mid + (L.spur || [-38, -64, -76])[k] };
}

/** One region, drawn in its cell's coordinates. */
export function regionSVG(r, L, dir, { companion, header = true, seed = 1 } = {}) {
  const pts = slotPoints(r.before || r.after ? L.slots : Math.max(1, r.stones.length), L, dir);
  const X = (x) => (dir > 0 ? x : L.cw - x);
  const [z1, z2, z3] = themeOf(r);
  const out = [];
  out.push(`<path class="jr-land" d="${landPath(L.cw, L.ch, seed)}"/>`);
  // pictures first, so the road and stones sit on top
  out.push(place(z1, X(L.padX + 0.25 * (L.cw - 2 * L.padX)), L.mid + L.amp - 36, 0.72, r.colour));
  out.push(place(z2, X(L.padX + 0.72 * (L.cw - 2 * L.padX)), L.ch - 14, 0.8, r.colour));
  if (!r.bonus) out.push(place(z3, X(L.padX - 6), L.ch - 14, 0.62, r.colour));
  // stretch: a side path up to a summit at the far end
  if (r.stretch.total && r.open) {
    const e = pts.at(-1), sx = (k) => spurPt(L, dir, k).x, sy = (k) => spurPt(L, dir, k).y;
    const n = r.stretch.stones.length;
    out.push(`<path class="jr-summit" d="M${f(X(L.cw - L.padX - 78))},${f(L.mid - 30)} Q${f(sx(2))},${f(sy(2) - 50)} ${f(X(L.cw - 12))},${f(L.mid - 20)}Z"/>`);
    out.push(`<path class="jr-spur" d="M${f(e.x)},${f(e.y)} ${Array.from({ length: n }, (_, k) => `L${f(sx(k))},${f(sy(k))}`).join(' ')}"/>`);
    r.stretch.stones.forEach((st, k) => out.push(stoneSVG(st, sx(k), sy(k), L.r - 4, st.id === r.current)));
    const fx = sx(n - 1) + (dir > 0 ? -16 : 16), fy = sy(n - 1) - 2;
    out.push(`<g class="jr-flag"><rect x="${f(fx - 1)}" y="${f(fy - 22)}" width="2" height="22" rx="1"/><path d="M${f(fx + 1)} ${f(fy - 22)}l12 4l-12 4z"/></g>`);
    out.push(`<text class="jr-spur-t" x="${f(fx + (dir > 0 ? -6 : 6))}" y="${f(fy + 12)}" text-anchor="${dir > 0 ? 'end' : 'start'}">stretch ${r.stretch.secure}/${r.stretch.total}</text>`);
  }
  out.push(`<path class="jr-road" d="${roadPath(L, dir)}"/><path class="jr-steps" d="${roadPath(L, dir)}"/>`);
  if (r.bonus) {
    const bx = X(L.padX - 2), by = L.ch - 46;
    out.push(`<g class="jr-bonus" data-topic="${esc(r.bonus.next)}"><circle cx="${f(bx)}" cy="${f(by)}" r="15"/>${star5(bx, by, 9, '#fff')}<text x="${f(bx)}" y="${f(by + 27)}" text-anchor="middle">bonus ${r.bonus.secure}/${r.bonus.total}</text></g>`);
  }
  let i = 0, herePt = null;
  if (r.before) out.push(pill(pts[i].x, pts[i++].y, r.beforeSecure ? `✓ ${r.before}` : `+${r.before}`, r.beforeId, r.beforeSecure ? 'done' : ''));
  for (const st of r.stones) {
    const p = pts[i++];
    if (st.id === r.current) herePt = p;
    out.push(stoneSVG(st, p.x, p.y, L.r, st.id === r.current));
  }
  if (r.after && r.open) out.push(pill(pts[i].x, pts[i].y, `+${r.after}`, r.afterId));
  if (!r.open) {
    // still in the clouds: the first stones show, the rest is waiting
    const cx = X(L.cw * 0.6), cy = L.mid - 4, k = Math.min(1, (L.cw * 0.4 - 12) / 144);
    out.push(`<g class="jr-cloud">${[[-74, 8, 30], [-34, -12, 38], [16, -6, 42], [66, -2, 38], [112, 10, 32], [0, 20, 34], [-50, 22, 26], [56, 26, 30], [100, 30, 22]].map(([dx, dy, rr]) => `<circle cx="${f(cx + dx * k)}" cy="${f(cy + dy)}" r="${f(rr * (0.5 + k / 2))}"/>`).join('')}<text x="${f(cx)}" y="${f(cy + 4)}" text-anchor="middle">Opens soon</text><text class="jr-cloud-sub" x="${f(cx)}" y="${f(cy + 22)}" text-anchor="middle">with the first ${esc(r.name)} topic</text></g>`);
  }
  if (header) {
    const hx = dir > 0 ? 22 : L.cw - 22, anchor = dir > 0 ? 'start' : 'end', ix = dir > 0 ? hx + 13 : hx - 13, tx = dir > 0 ? hx + 34 : hx - 34;
    out.push(`<g class="jr-badge"><circle cx="${ix}" cy="34" r="14"/><g transform="translate(${ix - 9} 25) scale(.75)" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="${iconPath(SUBJECT_ICON[r.subject])}"/></g></g>`);
    out.push(`<text class="jr-title" x="${tx}" y="33" text-anchor="${anchor}">${esc(r.region || r.name)}</text>`);
    out.push(`<text class="jr-sub" x="${tx}" y="50" text-anchor="${anchor}">${esc(r.name)} · ${r.secure} of ${r.total} secure${r.complete ? ' ✓' : ''}</text>`);
  }
  if (companion && herePt) out.push(companionAt(companion, herePt.x, herePt.y, dir));
  else if (companion && r.current && r.stretch.stones.some((s) => s.id === r.current)) {
    const p = spurPt(L, dir, r.stretch.stones.findIndex((s) => s.id === r.current));
    out.push(companionAt(companion, p.x, p.y, dir, 48));
  }
  return out.join('');
}

/** The road between two regions: from where one ends to where the next begins. */
function connector(a, b) {
  const dy = b.y - a.y, sameRow = Math.abs(dy) < 1;
  const c1 = sameRow ? [a.x + a.dir * 34, a.y + 30] : [a.x + a.dir * 36, a.y + 64];
  const c2 = sameRow ? [b.x - b.dir * 34, b.y - 30] : [b.x - b.dir * 36, b.y - 64];
  return `M${f(a.x)},${f(a.y)} C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(b.x)},${f(b.y)}`;
}

/** The whole map as SVG markup (the companion's drawing included). */
export function journeySVG(model, L, companion) {
  const { cells, w, h } = mapLayout(model.regions.length, L);
  const roads = [], regions = [];
  model.regions.forEach((r, i) => {
    const c = cells[i], pts = slotPoints(r.before || r.after ? L.slots : Math.max(1, r.stones.length), L, c.dir);
    const next = cells[i + 1];
    if (next) {
      const nr = model.regions[i + 1], np = slotPoints(nr.before || nr.after ? L.slots : Math.max(1, nr.stones.length), L, next.dir);
      roads.push(connector({ x: c.x + pts.at(-1).x, y: c.y + pts.at(-1).y, dir: c.dir }, { x: next.x + np[0].x, y: next.y + np[0].y, dir: next.dir }));
    }
    regions.push(`<g class="jr-region${r.open ? '' : ' closed'}${r.here ? ' here' : ''}" data-region="${esc(r.subject)}" role="button" tabindex="0" aria-label="${esc(regionLabel(r))}" style="--rc:${r.colour}" transform="translate(${c.x} ${c.y})">${regionSVG(r, L, c.dir, { companion: r.here ? companion : null, seed: i + 1 })}</g>`);
  });
  return `<svg class="jr-map" viewBox="0 0 ${w} ${h}" role="group" aria-label="Your journey: ${model.regions.length} places to explore" xmlns="http://www.w3.org/2000/svg"><rect class="jr-sea" x="0" y="0" width="${w}" height="${h}"/>${roads.map((d) => `<path class="jr-link" d="${d}"/><path class="jr-link-steps" d="${d}"/>`).join('')}${regions.join('')}</svg>`;
}

// --- DOM ----------------------------------------------------------------------

const wide = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches;
const route = (subject, topic) => `#/subject/${subject}${topic ? `/${encodeURIComponent(topic)}` : ''}`;

/** The home page's map. Tapping a stone opens its subject at that topic; tapping a region, at the current one. */
export function journeyMap(app) {
  const L = wide() ? LAYOUT.tablet : LAYOUT.phone;
  const model = journeyModel(app.state, app.db, SUBJECTS, { slots: L.slots });
  const box = document.createElement('div');
  box.className = 'journey-map card';
  box.dataset.noLamp = '';
  box.innerHTML = journeySVG(model, L, app.state.profile?.companion || {});
  const open = (e) => {
    const g = e.target.closest('[data-region]');
    if (!g) return;
    const r = model.regions.find((x) => x.subject === g.dataset.region);
    const topic = e.target.closest('[data-topic]')?.dataset.topic || r.current;
    app.go(route(r.subject, topic));
  };
  box.addEventListener('click', open);
  box.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('[data-region]')) { e.preventDefault(); open(e); } });
  return box;
}

/** A single region for the top of a subject's page; a tapped stone calls onStone(topicId). */
export function journeyStrip(app, subject, onStone) {
  const L = wide() ? LAYOUT.stripWide : LAYOUT.strip;
  const r = { ...regionModel(app.state, app.db, subject.id, { slots: L.slots }), name: subject.name, region: subject.region, colour: subject.colour, open: true };
  const box = document.createElement('div');
  box.className = 'journey-strip';
  box.dataset.noLamp = '';
  box.innerHTML = `<svg class="jr-map" viewBox="0 0 ${L.cw} ${L.ch}" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><g class="jr-region" style="--rc:${subject.colour}">${regionSVG(r, L, 1, { companion: app.state.profile?.companion || {}, header: false })}</g></svg>`;
  box.addEventListener('click', (e) => { const t = e.target.closest('[data-topic]'); if (t) onStone(t.dataset.topic); });
  return box;
}
