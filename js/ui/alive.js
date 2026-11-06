// The living companion: on the home page (and the wardrobe preview) it blinks, breathes, swishes
// its tail or shifts its weight and now and then waves, all in CSS (see "living companion" in
// css/app.css); its scene moves gently too. Tapping it does a trick, always the next in a fixed
// order (jump, spin, wave, dance), with a little sparkle. Its lamp keeps its own tap (js/ui/lamp.js).
// Everything pauses while the page is hidden or the companion is scrolled out of sight, and the
// reduced-motion settings stop it altogether. companionSpot() adds the speech bubble.

import { h } from './dom.js';
import { icon } from './icons.js';
import { companionEl } from './scenes.js';
import { LAMP_SELECTOR, wearsLamp } from './lamp.js';
import { COURSE } from '../core/subjects.js';

export const TRICKS = ['jump', 'spin', 'wave', 'dance'];
const TRICK_MS = 950;
let nextTrick = 0;

const reducedMotion = () => document.documentElement.dataset.motion === 'reduce' || !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => document.documentElement.classList.toggle('page-hidden', document.hidden));
}

// only animate what is on screen
let watcher = null;
const watched = new Set();
function watch(el) {
  if (typeof IntersectionObserver === 'undefined') return;
  watcher ||= new IntersectionObserver((entries) => {
    for (const e of entries) { e.target.dataset.seen = '1'; e.target.classList.toggle('alive-off', !e.isIntersecting); }
  });
  // let go of companions from screens that have gone
  for (const w of watched) if (w.dataset.seen && !w.isConnected) { watcher.unobserve(w); watched.delete(w); }
  watcher.observe(el);
  watched.add(el);
}

function sparkle(el) {
  const box = h('span', { class: 'trick-sparks', 'aria-hidden': 'true' });
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI / 2 + (i - 3) * 0.48;
    box.append(h('i', { style: { '--dx': `${Math.round(Math.cos(a) * 54)}px`, '--dy': `${Math.round(Math.sin(a) * 46)}px`, animationDelay: `${i * 25}ms` } }));
  }
  el.append(box);
  setTimeout(() => box.remove(), TRICK_MS + 200);
}

/** Do the next trick (one this companion can do: a wave needs a free paw or a head to nod). */
export function doTrick(el) {
  if (el.dataset.trick) return null;
  let t = null;
  for (let i = 0; i < TRICKS.length && !t; i++) {
    const next = TRICKS[nextTrick++ % TRICKS.length];
    if (next !== 'wave' || el.querySelector('.cp-arm, .cp-paw, .cp-head')) t = next;
  }
  el.dispatchEvent(new CustomEvent('companion-trick', { bubbles: true, detail: { trick: t } }));
  if (reducedMotion()) return t;
  el.dataset.trick = t;
  el.classList.add(`trick-${t}`);
  sparkle(el);
  setTimeout(() => { el.classList.remove(`trick-${t}`); delete el.dataset.trick; }, TRICK_MS);
  return t;
}

/** The companion (in its scene, if it has one), alive: idle motion, and a trick when tapped. */
export function aliveCompanion(opts, className = 'capy') {
  const el = companionEl(opts, `${className} alive`);
  const label = `${opts?.name || 'Your companion'}: tap for a trick`;
  // a lamp inside is its own button, and buttons do not nest
  if (wearsLamp(opts)) el.title = label;
  else { el.setAttribute('role', 'button'); el.tabIndex = 0; el.setAttribute('aria-label', label); }
  el.addEventListener('click', (e) => { if (!e.target.closest?.(LAMP_SELECTOR)) doTrick(el); });
  el.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target === el) { e.preventDefault(); doTrick(el); }
  });
  watch(el);
  return el;
}

/**
 * The companion with a speech bubble above it. `lines` come from companionLines() (js/ui/companion-talk.js);
 * tapping the bubble shows the next one. On the young courses, with read-aloud on, it reads them out.
 */
export function companionSpot(app, opts, lines, className = 'capy bob') {
  const pet = aliveCompanion(opts, className);
  if (!lines?.length) return h('div', { class: 'companion-spot' }, pet);
  const aloud = !!COURSE.readAloud && app.state.settings?.tts !== false;
  let i = 0;
  const text = h('span', { class: 'talk-text' }, lines[0].text);
  const more = lines.length > 1 ? h('span', { class: 'talk-more', 'aria-hidden': 'true' }, `1/${lines.length}`) : null;
  const say = () => import('../platform/tts.js').then(({ speak, ttsAvailable }) => { if (ttsAvailable()) speak(lines[i].text); });
  const bubble = h('div', { class: 'talk-bubble', 'aria-live': 'polite' });
  const show = (k) => {
    i = k % lines.length;
    text.textContent = lines[i].text;
    if (more) more.textContent = `${i + 1}/${lines.length}`;
    bubble.classList.remove('talk-new');
    void bubble.offsetWidth;
    bubble.classList.add('talk-new');
    if (aloud) say();
  };
  bubble.append(
    h('button', { type: 'button', class: 'talk-line', title: more ? 'Tap for the next thing to say' : null, onclick: () => show(i + 1) }, text, more),
    aloud ? h('button', { type: 'button', class: 'talk-say', 'aria-label': 'Read it to me', onclick: say }, icon('speaker')) : null);
  // with motion turned down there are no tricks, so a tap on the companion moves the talk on instead
  pet.addEventListener('companion-trick', () => { if (reducedMotion()) show(i + 1); });
  return h('div', { class: 'companion-spot' }, bubble, pet);
}
