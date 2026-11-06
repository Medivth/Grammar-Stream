// The family goal card and notes from a grown-up: on each child's home, and on the grown-ups'
// screen. Other children's saves are read for the shared bar; the only thing written into them
// is the shared reward flag (and a note the grown-up chose to send them).

import { h, toast, spoken } from './dom.js';
import { icon } from './icons.js';
import { capybaraSVG, speciesOf, slotOf, wornList } from './capybara.js';
import { sceneSVG, SCENE_BY_ID } from './scenes.js';
import { stickerSVG, STICKERS, stickerLabel } from './stickers.js';
import { speak } from '../platform/tts.js';
import { loadState, saveState, loadFamily, saveFamily } from '../platform/storage.js';
import { COURSES } from '../core/subjects.js';
import { weekStart, formatDay } from '../core/dates.js';
import {
  GOAL_TYPES, normalFamily, familyWeek, recordWeek, suggestedTarget, grantReward, hasFamilyReward, celebrationDue, markCelebrated,
  FAMILY_SCENE, addNote, nextNewNote, markShown, thankNote, noteStatus, signedBy, NOTE_MAX,
} from '../core/family.js';

// one friendly colour per child, by the order they were added (never by how much they did)
const COLOURS = ['#ff8a3d', '#7a5cd6', '#11a37f', '#e0457b', '#2f8fdc', '#d9a400'];
const dayShort = (d) => formatDay(d, { weekday: 'short', day: 'numeric', month: 'short' });

/** Every child on this device, in profile order; the current child's state is the live one. */
export function familyChildren(app) {
  const today = app.today();
  return app.profiles().map((p, i) => {
    const live = p.id === app.profileId;
    const res = live ? { state: app.state } : loadState(today, p.id);
    const state = res.fresh ? null : res.state;
    return { id: p.id, name: state?.profile?.childName || p.name || 'Me', course: state?.course || p.course || 'y6', state, colour: COLOURS[i % COLOURS.length], live };
  }).filter((c) => c.state);
}

/** Change one child's save: the live state if it is the child showing now, otherwise their stored save. */
function withChild(app, id, fn) {
  if (id === app.profileId) { fn(app.state); app.save(); return true; }
  const res = loadState(app.today(), id);
  if (res.fresh || res.warning) return false; // nothing saved there yet, or storage trouble: leave it alone
  fn(res.state);
  return saveState(res.state, id);
}

/** A grown-up's note into a child's save (the one showing now, or another). */
export const sendNote = (app, id, note) => withChild(app, id, (st) => addNote(st, note, app.today()));

/**
 * This week and last, worked out from every child's save and noted in the family record. When a
 * week is reached, every child gets the reward flag (the one write into another child's save).
 */
export function familyNow(app) {
  const today = app.today();
  const family = normalFamily(loadFamily());
  const children = familyChildren(app);
  const ws = weekStart(today);
  const week = familyWeek(children, family.goal, ws);
  const prevRec = family.weeks.find((w) => w.ws === ws - 7);
  const last = familyWeek(children, prevRec ? { type: prevRec.type, target: prevRec.target } : family.goal, ws - 7);
  let changed = false;
  if (children.length > 1) {
    // last week is only noted if it was already being tracked, so a new family starts with this week
    if (prevRec) changed = recordWeek(family, last, ws - 1) || changed;
    changed = recordWeek(family, week, today) || changed;
    if (changed) saveFamily(family);
    if (family.weeks.some((w) => w.reached)) {
      for (const c of children) if (!hasFamilyReward(c.state)) withChild(app, c.id, (st) => grantReward(st, today));
    }
  }
  return { family, children, week, last: family.weeks.find((w) => w.ws === ws - 7) || null, today };
}

/** A small head-and-shoulders picture of a child's companion (hats and glasses only). */
export function companionFace(comp, course) {
  const species = speciesOf(comp, COURSES[course]?.young);
  const wear = Object.fromEntries(wornList(comp || {}).filter((a) => ['head', 'face'].includes(slotOf(a))).map((a) => [slotOf(a), a]));
  const svg = capybaraSVG({ ...(comp || {}), species, wear, accessory: undefined, mood: 'happy', title: comp?.name || 'Companion' });
  const box = { capybara: '16 30 88 88', lion: '48 12 104 104', heroine: '66 2 68 68', hero: '66 8 68 68' }[species] || '0 0 200 160';
  return svg.replace('viewBox="0 0 200 160"', `viewBox="${box}"`);
}

const faceEl = (c, cls = 'fam-face') => h('span', { class: cls, 'aria-hidden': 'true', html: companionFace(c.state?.profile?.companion, c.course) });

function unitText(type, n) {
  const u = GOAL_TYPES[type].unit;
  return `${n} ${u}${n === 1 ? '' : 's'}`;
}

/** The shared bar: one coloured segment per child, in profile order, with their companion's face. */
function familyBar(children, week) {
  const scale = Math.max(week.target, week.total) || 1;
  return h('div', { class: 'fam-bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': week.target, 'aria-valuenow': Math.min(week.total, week.target), 'aria-label': `Family goal: ${week.total} of ${unitText(week.type, week.target)}` },
    week.parts.map((p) => {
      const c = children.find((x) => x.id === p.id);
      if (!p.amount || !c) return null;
      const pct = (100 * p.amount) / scale;
      return h('span', { class: 'fam-seg', style: { width: `${pct}%`, '--c': c.colour } }, pct >= 9 ? faceEl(c) : null);
    }));
}

function rewardThumb(comp) {
  return h('span', { class: 'fam-reward-pic', 'aria-hidden': 'true', html: sceneSVG(FAMILY_SCENE, comp ? { ...comp, mood: 'happy' } : null) });
}

// --- on the child's home ------------------------------------------------------------------
/** The family goal card on a child's home (only when there is more than one child here). */
export function familyHomeCard(app, fam = familyNow(app)) {
  const { children, week, last } = fam;
  if (children.length < 2) return null;
  const me = children.find((c) => c.live);
  const mine = week.parts.find((p) => p.id === app.profileId)?.amount || 0;
  const G = GOAL_TYPES[week.type];
  const unlocked = hasFamilyReward(app.state);
  const comp = app.state.profile?.companion;
  return h('section', { class: `fam-card${week.reached ? ' reached' : ''}`, 'aria-label': 'Family goal' },
    h('div', { class: 'fam-top' },
      h('div', {}, h('div', { class: 'eyebrow' }, week.reached ? 'Family goal reached!' : 'Family goal · this week'),
        h('h2', {}, week.reached ? 'You did it together!' : G.line(week.target))),
      h('span', { class: 'fam-count' }, h('b', {}, String(week.total)), ` / ${unitText(week.type, week.target)}`)),
    familyBar(children, week),
    h('ul', { class: 'fam-who', 'aria-label': 'Everyone helping' }, children.map((c) => h('li', { style: { '--c': c.colour } }, faceEl(c, 'fam-face sm'), h('span', {}, c.live ? `${c.name} (you)` : c.name)))),
    h('p', { class: 'fam-you' }, me ? `${G.you(mine)}.` : null, week.reached ? ' Thank you for helping!' : ''),
    h('div', { class: 'fam-reward' }, rewardThumb(comp),
      h('p', {}, unlocked
        ? [h('strong', {}, 'Family picnic: open for everyone. '), 'Choose it in Badges, under Scenes.']
        : [h('strong', {}, 'The reward: '), 'when the bar is full, everyone unlocks the Family picnic scene.'])),
    last?.reached && !week.reached ? h('p', { class: 'muted small fam-last' }, icon('star'), ' Last week you reached the family goal together.') : null);
}

/** "Notes from your grown-up": a small strip on home once any have arrived. */
export function notesHomeStrip(app) {
  const notes = app.state.notes || [];
  if (!notes.length) return null;
  const recent = notes.slice(-3).reverse();
  return h('button', { type: 'button', class: 'notes-strip', onclick: () => notesList(app) },
    h('span', { class: 'notes-minis', 'aria-hidden': 'true' }, recent.map((n) => h('span', { class: 'notes-mini', html: n.sticker ? stickerSVG(n.sticker) : stickerSVG('heart') }))),
    h('span', { class: 'notes-txt' }, h('strong', {}, 'Notes from your grown-up'), h('span', { class: 'muted small' }, `${notes.length} note${notes.length === 1 ? '' : 's'} · tap to read`)));
}

/** A friendly overlay card; resolves when it is closed. */
function popup(cls, build) {
  return new Promise((resolve) => {
    const prev = document.activeElement;
    const close = () => { wrap.remove(); document.removeEventListener('keydown', key); prev?.focus?.(); resolve(); };
    const key = (e) => { if (e.key === 'Escape') close(); };
    const card = h('div', { class: `fam-pop-card ${cls}`, role: 'dialog', 'aria-modal': 'true' });
    const wrap = h('div', { class: 'fam-pop', onclick: (e) => { if (e.target === wrap) close(); } }, card);
    card.append(...build(close));
    document.addEventListener('keydown', key);
    document.body.append(wrap);
    (card.querySelector('.btn-primary') || card.querySelector('button'))?.focus({ preventScroll: true });
  });
}

const sayBtn = (app, text) => (app.state.settings.tts !== false ? h('button', { class: 'say-btn', type: 'button', 'aria-label': 'Read it aloud', title: 'Read aloud', onclick: () => speak(spoken(text), { rate: 0.85 }) }, icon('speaker')) : null);

function noteCard(app, note, close, { list = false } = {}) {
  const from = signedBy(note);
  const head = `A note from ${from}`;
  const thanks = h('button', { type: 'button', class: note.thanked != null ? 'btn-ghost' : 'btn-primary', disabled: note.thanked != null, onclick: () => {
    thankNote(note, app.today());
    app.save();
    toast(`Thank-you sent to ${from}!`);
    if (list) { thanks.disabled = true; thanks.className = 'btn-ghost'; thanks.textContent = 'You said thanks ✓'; } else close();
  } }, note.thanked != null ? 'You said thanks ✓' : 'Thanks!');
  return [
    note.sticker ? h('div', { class: 'note-sticker', html: stickerSVG(note.sticker) }) : null,
    h('div', { class: 'eyebrow' }, `${dayShort(note.day)}`),
    h('h2', {}, head.charAt(0).toUpperCase() + head.slice(1)),
    note.text ? h('div', { class: 'note-text-row' }, h('p', { class: 'note-text' }, note.text), sayBtn(app, `${head}. ${note.text}`)) : h('p', { class: 'note-text' }, `${from.charAt(0).toUpperCase() + from.slice(1)} sent you a ${stickerLabel(note.sticker).toLowerCase()} sticker!`),
    h('div', { class: 'row note-actions' }, thanks, list ? null : h('button', { type: 'button', class: 'btn-ghost', onclick: close }, 'Close')),
  ];
}

function notesList(app) {
  const notes = [...(app.state.notes || [])].reverse();
  return popup('notes-list', (close) => [
    h('div', { class: 'row', style: { justifyContent: 'space-between', alignItems: 'center' } }, h('h2', { style: { margin: 0 } }, 'Your notes'), h('button', { type: 'button', class: 'btn-ghost', onclick: close }, 'Close')),
    h('div', { class: 'notes-scroll' }, notes.map((n) => { markShown(n, app.today()); return h('div', { class: 'note-item' }, ...noteCard(app, n, close, { list: true })); })),
  ]).then(() => app.save());
}

function confetti() {
  const cols = ['#ff8a3d', '#ffd166', '#7a5cd6', '#11a37f', '#e0457b', '#2f8fdc'];
  return h('div', { class: 'fam-confetti', 'aria-hidden': 'true' }, Array.from({ length: 18 }, (_, i) => h('i', { style: { left: `${(i * 37) % 100}%`, background: cols[i % cols.length], animationDelay: `${(i % 6) * 0.12}s`, '--r': `${(i * 47) % 360}deg` } })));
}

function celebrate(app, fam, wk) {
  const comp = app.state.profile?.companion || {};
  const first = !(app.state.family?.celebrated || []).length;
  markCelebrated(app.state, wk.ws);
  app.save();
  const did = { reading: `read ${wk.total} minutes`, sessions: `finished ${wk.total} sessions`, topics: `made ${wk.total} topics secure` }[wk.type] || '';
  return popup('fam-celebrate', (close) => [
    confetti(),
    h('div', { class: 'fam-cel-pic', 'aria-hidden': 'true', html: sceneSVG(FAMILY_SCENE, { ...comp, mood: 'happy' }) }),
    h('div', { class: 'eyebrow' }, wk.ws < weekStart(app.today()) ? 'Last week’s family goal' : 'Family goal reached!'),
    h('h2', {}, 'You did it together!'),
    h('p', {}, `Together you ${did}. The goal was ${unitText(wk.type, wk.target)}.`),
    h('ul', { class: 'fam-who center' }, fam.children.map((c) => h('li', { style: { '--c': c.colour } }, faceEl(c, 'fam-face sm'), h('span', {}, c.name)))),
    h('p', { style: { fontWeight: 700 } }, first ? 'Everyone has unlocked the Family picnic scene!' : 'The Family picnic is open for everyone, any time.'),
    h('div', { class: 'row note-actions' },
      h('button', { type: 'button', class: 'btn-primary', onclick: close }, 'Hooray!'),
      comp.scene === FAMILY_SCENE || !SCENE_BY_ID[FAMILY_SCENE] ? null : h('button', { type: 'button', class: 'btn-ghost', onclick: () => { app.state.profile.companion = { ...comp, scene: FAMILY_SCENE }; app.save(); close(); app.go('#/home'); } }, `Take ${comp.name || 'your companion'} to the picnic`)),
  ]);
}

/** After home is drawn: a family celebration (once per reached week), then any new notes, one at a time. */
export async function homePopups(app, fam) {
  if (document.querySelector('.fam-pop')) return;
  const here = location.hash;
  const wk = fam && fam.children.length > 1 ? celebrationDue(app.state, fam.family, app.today()) : null;
  if (wk) await celebrate(app, fam, wk);
  for (let note = nextNewNote(app.state); note && location.hash === here; note = nextNewNote(app.state)) {
    markShown(note, app.today());
    app.save();
    const n = note;
    await popup('note-pop', (close) => noteCard(app, n, close));
  }
}

// --- on the grown-ups' screen ------------------------------------------------------------
export function familyParentCard(app, redraw) {
  const fam = familyNow(app);
  const { family, children, week } = fam;
  if (children.length < 2) {
    return h('div', { class: 'card stack' }, h('h2', {}, 'Family goal'),
      h('p', { class: 'muted' }, 'With two or more children on this device, you can set a weekly goal they work towards together (reading minutes, sessions or topics). Everyone’s effort fills one shared bar, with no ranking, and reaching it unlocks a Family picnic scene for every child. Add a child below to start.'));
  }
  const courses = children.map((c) => c.course);
  const type = h('select', { id: 'fam-type' }, Object.entries(GOAL_TYPES).map(([k, g]) => h('option', { value: k, selected: k === family.goal.type }, g.label)));
  const target = h('input', { type: 'number', id: 'fam-target', min: 1, max: 5000, inputmode: 'numeric', value: family.goal.target ?? '', placeholder: String(suggestedTarget(family.goal.type, courses)) });
  const hint = h('p', { class: 'muted small', style: { margin: '4px 0 0' } });
  const sync = () => { const s = suggestedTarget(type.value, courses); target.placeholder = String(s); hint.textContent = `Leave blank for the suggestion for these ${children.length} children: ${unitText(type.value, s)} a week (it grows with their ages).`; };
  type.onchange = sync;
  sync();
  const history = family.weeks.filter((w) => w.ws < week.ws).slice(-4).reverse();
  return h('div', { class: 'card stack' }, h('h2', {}, 'Family goal'),
    h('p', { class: 'muted' }, `A weekly target shared by all ${children.length} children here (weeks start on Monday). Each child sees one bar filled by everyone, in the order they were added, never ranked. When it’s full, every child unlocks the Family picnic scene and gets a small celebration the next time they open the app.`),
    h('div', {}, h('strong', {}, `This week: ${week.total} of ${unitText(week.type, week.target)}`), week.reached ? h('span', { class: 'chip', style: { marginLeft: '8px' } }, 'Reached ✓') : null),
    familyBar(children, week),
    h('ul', { class: 'fam-who' }, children.map((c) => h('li', { style: { '--c': c.colour } }, faceEl(c, 'fam-face sm'), h('span', {}, `${c.name}: ${week.parts.find((p) => p.id === c.id)?.amount || 0}`)))),
    history.length ? h('p', { class: 'muted small' }, 'Recent weeks: ', history.map((w) => `${dayShort(w.ws)}: ${w.total} of ${w.target}${w.reached ? ' ✓' : ''}`).join(' · ')) : null,
    h('div', { class: 'grid two' },
      h('div', { class: 'field' }, h('label', { for: 'fam-type' }, 'What counts'), type),
      h('div', { class: 'field' }, h('label', { for: 'fam-target' }, 'Weekly target'), target)),
    hint,
    h('button', { class: 'btn-primary', onclick: () => {
      const n = target.value.trim() ? Math.round(+target.value) : null;
      if (n != null && !(n >= 1 && n <= 5000)) return toast('Choose a target between 1 and 5000, or leave it blank.');
      const f = normalFamily(loadFamily());
      f.goal = { type: type.value, target: n };
      saveFamily(f);
      toast('Family goal saved.');
      redraw();
    } }, 'Save family goal'));
}

export function notesParentCard(app, redraw) {
  const children = familyChildren(app);
  const family = normalFamily(loadFamily());
  let sticker = null;
  const to = h('select', { id: 'note-to' }, children.map((c) => h('option', { value: c.id, selected: c.live }, c.name)));
  const text = h('textarea', { id: 'note-text', maxlength: NOTE_MAX, placeholder: 'e.g. I loved hearing about the Romans at tea. Proud of you for sticking at it!', style: { minHeight: '80px' } });
  const from = h('input', { type: 'text', id: 'note-from', maxlength: 30, value: family.signoff, placeholder: 'Your grown-up' });
  const btns = STICKERS.map((id) => h('button', { type: 'button', class: 'sticker-pick', 'aria-pressed': 'false', 'aria-label': stickerLabel(id), title: stickerLabel(id), onclick: () => {
    sticker = sticker === id ? null : id;
    btns.forEach((b, i) => b.setAttribute('aria-pressed', String(STICKERS[i] === sticker)));
  }, html: stickerSVG(id) }));
  const sent = children.flatMap((c) => (c.state.notes || []).map((n) => ({ ...n, child: c }))).sort((a, b) => b.at - a.at).slice(0, 6);
  const STATUS = { waiting: 'not opened yet', seen: 'seen', thanked: 'said thanks' };
  return h('div', { class: 'card stack' }, h('h2', {}, 'Notes and stickers'),
    h('p', { class: 'muted' }, 'Send a short note, a sticker, or both. It pops up once on their home page, then stays in a Notes list they can reopen. You’ll see here when they’ve read it.'),
    children.length > 1 ? h('div', { class: 'field' }, h('label', { for: 'note-to' }, 'To'), to) : null,
    h('div', { class: 'field' }, h('label', { for: 'note-text' }, 'Note (optional)'), text),
    h('div', { class: 'field' }, h('label', {}, 'Sticker (optional)'), h('div', { class: 'sticker-grid', role: 'group', 'aria-label': 'Sticker' }, btns)),
    h('div', { class: 'field' }, h('label', { for: 'note-from' }, 'Sign it from (optional)'), from, h('p', { class: 'muted small', style: { margin: '4px 0 0' } }, 'For example Mum, Dad or Grandpa. Left blank, it says “your grown-up”.')),
    h('button', { class: 'btn-primary', onclick: () => {
      if (!text.value.trim() && !sticker) return toast('Write a note or choose a sticker first.');
      const f = normalFamily(loadFamily());
      f.signoff = from.value.trim();
      saveFamily(f);
      const id = children.length > 1 ? to.value : app.profileId;
      const child = children.find((c) => c.id === id);
      const ok = sendNote(app, id, { text: text.value, sticker, from: f.signoff });
      if (!ok) return toast('That note could not be saved.');
      toast(`Sent. ${child?.name || 'They'} will see it on their home page.`);
      redraw();
    } }, 'Send'),
    sent.length ? h('div', {}, h('h3', {}, 'Sent recently'),
      h('ul', { class: 'plain-list notes-sent' }, sent.map((n) => h('li', {},
        n.sticker ? h('span', { class: 'notes-mini', html: stickerSVG(n.sticker), 'aria-hidden': 'true' }) : h('span', { class: 'notes-mini' }),
        h('span', {}, h('strong', {}, n.child.name), ` · ${dayShort(n.day)} · `, n.text ? `“${n.text.length > 60 ? n.text.slice(0, 57) + '…' : n.text}”` : `${stickerLabel(n.sticker)} sticker`,
          h('span', { class: `note-status ${noteStatus(n)}` }, ` ${STATUS[noteStatus(n)]}${n.thanked != null ? ` ✓ ${dayShort(n.thanked)}` : n.shown != null ? ` ${dayShort(n.shown)}` : ''}`)))))) : null);
}
