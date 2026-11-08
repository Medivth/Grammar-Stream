// The dressing-up clock: runs while the wardrobe or the companion picker is on screen and the app is
// visible, and closes them for the day when the allowance is used up (js/core/dressup.js).

import { h } from './dom.js';
import { addDressUp, dressUpLeft, minutesText } from '../core/dressup.js';

const TICK = 5000;
let timer = null;

/** Stop counting (called on every route change). */
export function stopDressUpClock() {
  if (timer) clearInterval(timer);
  timer = null;
}

/** Count time on this screen; `onOut` runs once when the day's allowance is used up. */
export function startDressUpClock(app, onOut) {
  stopDressUpClock();
  if (dressUpLeft(app.state, app.today()) === Infinity) return;
  let last = Date.now(), ticks = 0;
  timer = setInterval(() => {
    const now = Date.now();
    const gap = Math.min(now - last, TICK * 2); // a sleeping tablet does not eat the allowance
    last = now;
    if (document.visibilityState !== 'visible') return;
    addDressUp(app.state, app.today(), gap);
    if (dressUpLeft(app.state, app.today()) <= 0) {
      stopDressUpClock();
      app.save();
      onOut();
    } else if (++ticks % 6 === 0) app.save(); // about every half minute
  }, TICK);
}

/** A small note of the time left today, or null with no limit. */
export function dressUpNote(app) {
  const left = dressUpLeft(app.state, app.today());
  if (left === Infinity) return null;
  return h('p', { class: 'dressup-note muted small center' }, `Dressing-up time left today: ${minutesText(left)}`);
}

/** Shown instead of the wardrobe once today's time is used up. */
export function dressUpClosed(app) {
  const c = app.state.profile?.companion || {};
  const who = c.name || 'Your companion';
  return h('div', { class: 'card center dressup-closed' },
    h('h2', {}, 'Wardrobe closed until tomorrow'),
    h('p', {}, `That’s all the dressing-up time for today. ${who} is ready to learn with you, and the wardrobe opens again tomorrow.`),
    h('p', { class: 'muted small' }, 'Badges you earn today will be waiting when it opens.'),
    h('button', { class: 'btn-primary', onclick: () => app.go('#/home') }, 'Back to learning'));
}
