// Collectible cards on screen: one card, the enlarged (flipped) card, the album (Progress → Cards)
// and the "New card!" reveal on the finished screen. The rules live in js/core/cards.js.
//
// Album cards show the set's emblem only (cheap: a few hundred can be on screen); the topic's own
// picture is drawn when a card is enlarged or revealed.

import { h, rich } from './dom.js';
import { renderVisual } from './visuals.js';
import { emblemSVG, emblemFor } from './cardart.js';
import { capybaraEl, ACCESSORIES } from './capybara.js';
import { sceneSVG, SCENE_BY_ID } from './scenes.js';
import * as sfx from '../platform/sfx.js';
import { SUBJECTS, SUBJECT_BY_ID } from '../core/subjects.js';
import { cardSets, setProgress, collected, cardCount, cardFact, cardNumber, cardTheme, syncCollection, setOfTopic } from '../core/cards.js';

// pictures that still read at card size (big tables and timelines do not)
const CARD_VISUALS = new Set(['diagram', 'maths', 'cycle', 'tree', 'sounds', 'blocks', 'flow']);
const LOOK = { young: 'Trading card', y6: 'Specimen', y8: 'Pottery' };

const rewardName = (r) => (!r ? 'Gold cards' : r.acc ? ACCESSORIES[r.acc] || r.acc : `${SCENE_BY_ID[r.scene]?.name || r.scene} scene`);
const theRewardName = (r) => {
  const n = rewardName(r);
  if (!r) return 'gold cards';
  return /^(Greek|Roman|Viking|Tudor|Regency|Victorian|Saturn|Mount|Mars|Pompeii)\b/.test(n) ? `the ${n}` : `the ${n[0].toLowerCase()}${n.slice(1)}`;
};

/** Black-figure or red-figure (Year 8): alternate by set, so a page of the album has both. */
function figure(db, set) {
  const i = cardSets(db).findIndex((s) => s.id === set?.id);
  return i % 2 ? 'gc-red' : 'gc-black';
}

/**
 * One card. opts.big draws the full card (fact and the topic's picture); otherwise a compact
 * album card. opts.have = false draws the silhouette of a card still to collect.
 */
export function cardEl(db, topicId, { big = false, have = true, gold = false, tag = 'div', onclick = null } = {}) {
  const t = db.topics[topicId];
  const set = setOfTopic(db, topicId);
  const sub = SUBJECT_BY_ID[t.subject] || { name: t.subject, colour: '#5143d9' };
  const theme = cardTheme();
  const no = String(cardNumber(db, topicId)).padStart(3, '0');
  const em = emblemFor(topicId, set?.emblems);
  const cls = ['gcard', `gc-${theme}`, theme === 'y8' ? figure(db, set) : '', big ? 'gc-big' : '', have ? '' : 'gc-locked', have && gold ? 'gc-gold' : ''].filter(Boolean).join(' ');
  const pic = h('div', { class: 'gc-pic', html: emblemSVG(em) });
  if (big && have) {
    const v = (Array.isArray(t.visual) ? t.visual : t.visual ? [t.visual] : []).find((x) => CARD_VISUALS.has(x.kind));
    if (v) {
      const drawn = renderVisual({ ...v, caption: undefined });
      if (drawn) { pic.classList.add('gc-pic-visual'); pic.replaceChildren(drawn); }
    }
  }
  const label = have ? `${t.title}. ${sub.name} card${set ? `, ${set.name} set` : ''}.` : `${t.title}: not collected yet. Secure this topic to collect it.`;
  const attrs = { class: cls, style: { '--subj': sub.colour } };
  if (tag === 'button') Object.assign(attrs, { type: 'button', 'aria-label': label, onclick });
  else attrs['aria-label'] = label;
  if (tag !== 'button') attrs.role = 'img';
  return h(tag, attrs,
    h('div', { class: 'gc-face' },
      h('div', { class: 'gc-top' }, h('span', { class: 'gc-subj' }, sub.name), h('span', { class: 'gc-no' }, `No. ${no}`)),
      pic,
      h('div', { class: 'gc-title' }, t.title),
      big ? (have ? rich('p', cardFact(t), { class: 'gc-fact' }) : h('p', { class: 'gc-fact gc-hint' }, 'Secure this topic to collect it.')) : null,
      h('div', { class: 'gc-set' }, have || big ? set?.name || sub.name : 'Secure it to collect')));
}

/** The back of a card (seen before it flips). */
function backEl(theme, colour) {
  return h('div', { class: `gc-back gc-${theme}`, style: { '--subj': colour }, 'aria-hidden': 'true', html: `<div class="gc-back-in">${emblemSVG(theme === 'y8' ? 'amphora' : theme === 'y6' ? 'leaf' : 'star')}</div>` });
}

/** A card that flips over from its back (the flip is skipped when motion is reduced). */
export function flipCard(db, topicId, { delay = 0, sound = false, gold = false } = {}) {
  const t = db.topics[topicId];
  const theme = cardTheme();
  const front = cardEl(db, topicId, { big: true, gold });
  const wrap = h('div', { class: 'gc-flip', style: { '--delay': `${delay}ms` } },
    h('div', { class: 'gc-inner' }, front, backEl(theme, SUBJECT_BY_ID[t.subject]?.colour)));
  if (sound) setTimeout(() => sfx.sparkle?.(), delay + 380);
  return wrap;
}

// ---------------------------------------------------------------- the enlarged card
let lastFocus = null;
export function zoomCard(app, topicId, have, gold = false) {
  closeZoom();
  lastFocus = document.activeElement;
  const { db } = app;
  const t = db.topics[topicId];
  const sub = SUBJECT_BY_ID[t.subject];
  const close = h('button', { type: 'button', class: 'gc-close', 'aria-label': 'Close' }, '×');
  const card = have ? flipCard(db, topicId, { gold }) : h('div', { class: 'gc-flip gc-noflip' }, cardEl(db, topicId, { big: true, have: false }));
  const go = have ? null : h('button', { type: 'button', class: 'btn-ghost gc-go', onclick: () => { closeZoom(); app.go(`#/subject/${t.subject}`); } }, `See ${sub?.name || 'the subject'} topics`);
  const box = h('div', { class: 'gc-zoom', role: 'dialog', 'aria-modal': 'true', 'aria-label': t.title, onclick: (e) => { if (e.target === box) closeZoom(); } },
    h('div', { class: 'gc-zoom-in' }, close, card, go));
  close.addEventListener('click', closeZoom);
  box.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeZoom();
    if (e.key === 'Tab') { e.preventDefault(); (document.activeElement === close && go ? go : close).focus(); }
  });
  document.body.append(box);
  close.focus({ preventScroll: true });
}
export function closeZoom() {
  const z = document.querySelector('.gc-zoom');
  if (!z) return;
  z.remove();
  lastFocus?.focus?.({ preventScroll: true });
  lastFocus = null;
}
// leaving the screen (back button, a link) takes the enlarged card with it
addEventListener('hashchange', closeZoom);

// ---------------------------------------------------------------- the album
function rewardEl(app, s) {
  const c = app.state.profile?.companion || {};
  const r = s.reward;
  const pic = !r ? h('div', { class: 'gc-reward-pic gc-reward-gold', html: emblemSVG('star') })
    : r.acc ? h('div', { class: 'gc-reward-pic' }, capybaraEl({ ...c, wear: undefined, accessory: r.acc, mood: s.won ? 'happy' : 'neutral' }))
      : h('div', { class: 'gc-reward-pic gc-reward-scene', html: sceneSVG(r.scene) });
  const where = !r ? 'Every card in the set turned gold.' : r.acc ? 'It’s in the wardrobe (Badges), and the cards turned gold.' : 'Choose it under Scenes (Badges). The cards turned gold too.';
  return h('div', { class: `gc-reward${s.won ? ' won' : ''}` }, pic,
    h('div', {},
      h('div', { class: 'eyebrow' }, s.won ? 'Set complete: you won' : r ? 'Complete the set to win' : 'Complete the set and'),
      h('b', {}, r ? rewardName(r) : 'its cards turn gold'),
      s.won ? h('div', { class: 'small muted' }, where) : r ? h('div', { class: 'small muted' }, 'and gold cards') : null));
}

export function albumTab(app, body) {
  const { state, db } = app;
  // anything secured since the last session ends up stored for good
  const fresh = syncCollection(state, db, app.today());
  if (fresh.cards.length || fresh.sets.length) app.save();
  const have = collected(state, db);
  const sets = setProgress(state, db);
  const { have: n, total } = cardCount(state, db);
  const subjects = SUBJECTS.filter((sub) => sets.some((s) => s.subject === sub.id));
  // open on the subject last viewed, or the one with the newest card
  let pick = null;
  try { pick = sessionStorage.getItem('album-subject'); } catch { /* private mode */ }
  if (!subjects.some((x) => x.id === pick)) {
    const newest = Object.entries(state.collection || {}).filter(([id]) => db.topics[id]).sort((a, b) => b[1] - a[1])[0];
    pick = newest ? db.topics[newest[0]].subject : subjects[0]?.id;
  }
  const holder = h('div', {});
  const draw = (subjectId) => {
    try { sessionStorage.setItem('album-subject', subjectId); } catch { /* private mode */ }
    const mine = sets.filter((s) => s.subject === subjectId);
    holder.replaceChildren(
      h('div', { class: 'album-chips', role: 'tablist', 'aria-label': 'Subjects' }, subjects.map((sub) => {
        const ss = sets.filter((s) => s.subject === sub.id);
        const a = ss.reduce((x, s) => x + s.have, 0), b = ss.reduce((x, s) => x + s.total, 0);
        return h('button', { type: 'button', role: 'tab', class: 'album-chip', style: { '--subj': sub.colour }, 'aria-selected': String(sub.id === subjectId), onclick: () => draw(sub.id) }, sub.name, h('span', {}, `${a}/${b}`));
      })),
      mine.map((s) => h('section', { class: `gc-set-box${s.won ? ' won' : ''}`, style: { '--subj': SUBJECT_BY_ID[s.subject]?.colour } },
        h('div', { class: 'gc-set-head' },
          h('h3', {}, s.name),
          h('span', { class: 'gc-count' }, `${s.have} of ${s.total}`)),
        h('div', { class: 'mini-bar gc-set-bar' }, h('i', { style: { width: `${Math.round((100 * s.have) / s.total)}%` } })),
        rewardEl(app, s),
        h('div', { class: 'gc-grid' }, s.topics.map((id) => {
          const got = have.has(id);
          return cardEl(db, id, { have: got, gold: s.won, tag: 'button', onclick: () => zoomCard(app, id, got, s.won) });
        })))));
  };
  body.append(
    h('div', { class: 'card album-head' },
      h('div', {}, h('h2', {}, `${n} of ${total} cards`), h('p', { class: 'muted', style: { margin: 0 } }, 'Every topic you secure earns its card, and it stays yours. Collect a whole set to win its prize. Tap a card to look closer.')),
      h('div', { class: 'album-meter', 'aria-hidden': 'true' }, h('i', { style: { width: `${total ? Math.round((100 * n) / total) : 0}%` } }))),
    holder);
  if (pick) draw(pick);
}

/** "Cards: 12 of 180" for the Progress overview. */
export function cardsLine(app) {
  const { have, total } = cardCount(app.state, app.db);
  return h('button', { type: 'button', class: 'cards-line', onclick: () => app.go('#/progress/cards') },
    h('span', { class: 'cards-line-em', html: emblemSVG(cardTheme() === 'y8' ? 'amphora' : cardTheme() === 'y6' ? 'leaf' : 'star') }),
    h('span', {}, h('b', {}, `Cards: ${have} of ${total}`), h('span', { class: 'muted small' }, ` · ${LOOK[cardTheme()]} album`)),
    h('span', { class: 'cards-line-go' }, 'Open'));
}

// ---------------------------------------------------------------- the reveal
const SHOW = 3;
/**
 * New cards earned this session (topics secured since it started), for the finished screen.
 * The new ids are kept on the plan, so the reveal shows again if the screen is reloaded.
 */
export function newCardsReveal(app, plan) {
  const { state, db } = app;
  if (!plan.newCards) {
    const fresh = syncCollection(state, db, app.today());
    const before = plan.cardsBefore ? new Set(plan.cardsBefore) : null;
    // cards stored mid-session (the album was opened) still count as new for this session
    const since = before ? [...collected(state, db)].filter((id) => !before.has(id) && cardSets(db).some((s) => s.topics.includes(id))) : [];
    plan.newCards = [...new Set([...fresh.cards, ...since])];
    plan.newSets = fresh.sets;
    delete plan.cardsBefore;
    app.save();
  }
  const ids = plan.newCards.filter((id) => db.topics[id]);
  if (!ids.length) return null;
  const progress = setProgress(state, db);
  const sets = progress.filter((s) => (plan.newSets || []).includes(s.id));
  const wonSet = new Set(progress.filter((s) => s.won).map((s) => s.id));
  const more = ids.length - SHOW;
  return h('section', { class: 'gc-reveal', role: 'status' },
    h('div', { class: 'eyebrow' }, ids.length === 1 ? 'New card!' : `${ids.length} new cards!`),
    h('h2', {}, ids.length === 1 ? `You secured ${db.topics[ids[0]].title}` : 'You secured new topics'),
    h('div', { class: 'gc-reveal-row' }, ids.slice(0, SHOW).map((id, i) => flipCard(db, id, { delay: 900 + i * 260, sound: i === 0, gold: wonSet.has(setOfTopic(db, id)?.id) }))),
    more > 0 ? h('p', { class: 'muted' }, `And ${more} more in your album.`) : null,
    sets.map((s) => h('p', { class: 'gc-set-won' }, `Set complete: ${s.name}! You won ${theRewardName(s.reward)}.`)),
    h('button', { type: 'button', class: 'btn-ghost', onclick: () => app.go('#/progress/cards') }, 'See your album'));
}

/** What to remember at the start of a session, so its finished screen can show new cards. */
export const cardsBefore = (state, db) => [...collected(state, db)];

