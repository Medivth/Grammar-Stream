// The session progress bar as a little race: a race car on a track to a chequered flag (Years 2/3),
// a rocket flying to a ringed planet (Year 6), a chariot racing to the victor's wreath (Year 8).
// Also the star burst after a right answer, the run badge, and the finish-line moment.

import { h } from './dom.js';

/** True when animation should be cut (the device setting or the app's own "No animations"). */
export function calmMotion() {
  if (typeof document === 'undefined') return true;
  if (document.documentElement.dataset.motion === 'reduce') return true;
  return !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

// side views facing right, in the app's flat style
const VEHICLE = {
  race: `<svg viewBox="0 0 48 28" aria-hidden="true"><path d="M1.5 9h7.5v3H1.5z" fill="#1f2430"/><path d="M5 12v5" stroke="#1f2430" stroke-width="2"/><path d="M3 21.5l1-6.5 12-1.5 5-4.5h9l4 4.5 10 1.5q3.5 1 2.5 4.5l-1 2z" fill="#e63946"/><path d="M22.5 10.4H29l2.5 3.1h-11z" fill="#bfe3ff"/><circle cx="25.2" cy="11.8" r="2.3" fill="#ffd166"/><path d="M8 17.6h35" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><circle cx="12.5" cy="21.5" r="4.3" fill="#1f2430"/><circle cx="12.5" cy="21.5" r="1.7" fill="#c9ccd6"/><circle cx="37.5" cy="21.5" r="4.3" fill="#1f2430"/><circle cx="37.5" cy="21.5" r="1.7" fill="#c9ccd6"/></svg>`,
  rocket: `<svg viewBox="0 0 48 28" aria-hidden="true"><g transform="rotate(-14 24 14)"><path class="rw-flame" d="M9 14L0 9.5q3.5 4.5 0 9z" fill="#ffb347"/><path d="M9 14l-5-2.5q2 2.5 0 5z" fill="#fff3b0"/><path d="M11 9.5L6.5 3.5 18 9.5zM11 18.5l-4.5 6 11.5-6z" fill="#e63946"/><path d="M8.5 9.5H30q11 0 16 4.5-5 4.5-16 4.5H8.5z" fill="#f3f4fb" stroke="#b9bcd6" stroke-width="1"/><path d="M37 10.2q6 1.2 9 3.8-3 2.6-9 3.8z" fill="#e63946"/><circle cx="29" cy="14" r="3.1" fill="#7cc0ea" stroke="#5143d9" stroke-width="1.3"/></g></svg>`,
  chariot: `<svg viewBox="0 0 56 30" aria-hidden="true"><path d="M15.5 9.5L52 8.6" stroke="#3b2414" stroke-width=".9"/><path d="M30 12.5q-5 0-7 4" stroke="#5b3a1e" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M32 16l-4.5 7.5M34.5 17l.5 9" stroke="#74482b" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="37.5" cy="14" rx="8.5" ry="4.6" fill="#8a5a3b"/><path d="M41 12.5L46 5q2-2 4-1l4.5 4q.5 1.5-1 1.8l-4-.8-3 6z" fill="#8a5a3b"/><path d="M45.5 5q-3 3-4.5 7" stroke="#3b2414" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M48.3 3.8l.7-2.2 1 2.4" fill="#8a5a3b"/><circle cx="50.6" cy="6" r=".8" fill="#1f2430"/><path d="M42.5 16.5l5.5 5M40.5 17.5l2.5 8.5" stroke="#8a5a3b" stroke-width="2.4" stroke-linecap="round"/><path d="M17 18l14-2.5" stroke="#5b3a1e" stroke-width="1.6"/><path d="M8 14l1.5-6.5H13l1 6.5z" fill="#f4f1ea"/><circle cx="11.3" cy="5" r="2.6" fill="#f4c9a0"/><path d="M8.7 4.6q2.6-3.4 5.2 0z" fill="#3b2a1a"/><path d="M12.5 9l3.4.5" stroke="#f4c9a0" stroke-width="1.6" stroke-linecap="round"/><path d="M3.5 21q0-8.5 5.5-9h8q2 0 1 9z" fill="#c8102e"/><path d="M4.3 15h14.3" stroke="#ffd166" stroke-width="1.5"/><circle cx="10" cy="22.5" r="5.8" fill="#fff" fill-opacity=".15" stroke="#5b3a1e" stroke-width="2.2"/><path d="M10 16.7v11.6M4.2 22.5h11.6M5.9 18.4l8.2 8.2M14.1 18.4l-8.2 8.2" stroke="#5b3a1e" stroke-width="1.1"/><circle cx="10" cy="22.5" r="1.6" fill="#ffd166"/></svg>`,
};

// what waits at the end of the track
const GOAL = {
  race: `<svg viewBox="0 0 20 28" aria-hidden="true"><path d="M3 2v26" stroke="#5f5c7a" stroke-width="1.6"/><g transform="translate(3.8 2)"><rect width="14" height="10" fill="#fff" stroke="#1f2430" stroke-width=".8"/><path d="M0 0h3.5v2.5H0zM7 0h3.5v2.5H7zM3.5 2.5H7V5H3.5zM10.5 2.5H14V5h-3.5zM0 5h3.5v2.5H0zM7 5h3.5v2.5H7zM3.5 7.5H7V10H3.5zM10.5 7.5H14V10h-3.5z" fill="#1f2430"/></g></svg>`,
  rocket: `<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M23.5 2.5l.9 2 2 .9-2 .9-.9 2-.9-2-2-.9 2-.9z" fill="#ffd166"/><circle cx="14" cy="16" r="8" fill="#ff9d5c"/><path d="M7 13.5q7 2.5 14 0M6.5 18q7.5 2 15 0" stroke="#e0692e" stroke-width="1.4" fill="none"/><ellipse cx="14" cy="16.5" rx="13" ry="3.4" fill="none" stroke="#ffd166" stroke-width="1.6" transform="rotate(-12 14 16.5)"/></svg>`,
  chariot: `<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M14 25C6 24 3 17 4.5 9M14 25c8-1 11-8 9.5-16" stroke="#6b8e23" stroke-width="1.6" fill="none"/><g fill="#7fa33a"><ellipse cx="4.6" cy="11" rx="1.8" ry="3" transform="rotate(-20 4.6 11)"/><ellipse cx="5.4" cy="16" rx="1.8" ry="3" transform="rotate(-40 5.4 16)"/><ellipse cx="8" cy="20.6" rx="1.8" ry="3" transform="rotate(-60 8 20.6)"/><ellipse cx="23.4" cy="11" rx="1.8" ry="3" transform="rotate(20 23.4 11)"/><ellipse cx="22.6" cy="16" rx="1.8" ry="3" transform="rotate(40 22.6 16)"/><ellipse cx="20" cy="20.6" rx="1.8" ry="3" transform="rotate(60 20 20.6)"/></g><path d="M11 26.5l3-3 3 3" stroke="#c8102e" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>`,
};

const NAMES = { race: 'race car', rocket: 'rocket', chariot: 'chariot' };

function track(theme, p, extra = '') {
  const mover = h('div', { class: 'rw-mover', style: { '--p': String(p) } },
    h('span', { class: 'rw-trail' }),
    h('span', { class: 'rw-vehicle', html: VEHICLE[theme] || VEHICLE.rocket }));
  return {
    mover,
    el: h('div', { class: `rw rw-${theme} ${extra}`.trim() },
      h('div', { class: 'rw-road', 'aria-hidden': 'true' }),
      h('div', { class: 'rw-goal', html: GOAL[theme] || GOAL.rocket }),
      h('div', { class: 'rw-lane', 'aria-hidden': 'true' }, mover)),
  };
}

// where the vehicle was last drawn, so on the next step it can zoom on from there
let last = { key: null, p: 0 };

/**
 * The session progress track. `key` names the session (so a new session starts from the line);
 * `p` is 0..1; `step`/`of` give the screen-reader text.
 */
export function raceway({ theme, p, key, step, of }) {
  const pct = Math.round(p * 100);
  const from = last.key === key && last.p <= p ? last.p : p;
  last = { key, p };
  const { el, mover } = track(theme, from);
  el.setAttribute('role', 'progressbar');
  el.setAttribute('aria-label', `Session progress (the ${NAMES[theme] || 'rocket'})`);
  el.setAttribute('aria-valuemin', '0');
  el.setAttribute('aria-valuemax', '100');
  el.setAttribute('aria-valuenow', String(pct));
  if (step && of) el.setAttribute('aria-valuetext', `Step ${step} of ${of}`);
  if (from !== p) {
    // two frames: the first paints the old place, the second starts the transition to the new one
    requestAnimationFrame(() => requestAnimationFrame(() => {
      mover.style.setProperty('--p', String(p));
      if (!calmMotion()) {
        el.classList.add('rw-zoom');
        setTimeout(() => el.classList.remove('rw-zoom'), 800);
      }
    }));
  }
  return el;
}

const FINISH_TEXT = {
  race: 'Over the finish line!',
  rocket: 'Touchdown! You reached the planet.',
  chariot: 'Victory! The wreath is yours.',
};

/** The finished-screen moment: the vehicle crosses the line, then stars. */
export function finishMoment(theme) {
  const calm = calmMotion();
  const { el } = track(theme, 1, `rw-finish${calm ? '' : ' rw-crossing'}`);
  const wrap = h('div', { class: 'rw-finish-wrap' }, el, h('p', { class: 'rw-finish-text' }, FINISH_TEXT[theme] || FINISH_TEXT.rocket));
  if (!calm) setTimeout(() => { if (wrap.isConnected) starBurst(el.querySelector('.rw-goal'), { count: 16, spread: 120 }); }, 850);
  return wrap;
}

const STAR = 'M12 2l2.9 6.5 7.1.7-5.3 4.8 1.5 7L12 17.4 5.8 21l1.5-7L2 9.2l7.1-.7z';
const STAR_COLOURS = ['#ffd166', '#ff8a3d', '#5fd6a0', '#7cc0ea', '#ff7aa8', '#b49cff'];

/** A quick burst of stars from an element (about 600 ms), drawn over the page; never blocks taps. */
export function starBurst(anchor, { count = 12, spread = 70 } = {}) {
  if (!anchor || calmMotion() || !anchor.isConnected) return;
  const r = anchor.getBoundingClientRect();
  const box = h('div', { class: 'juice-burst', 'aria-hidden': 'true', style: { left: `${r.left + r.width / 2 + window.scrollX}px`, top: `${r.top + r.height / 2 + window.scrollY}px` } });
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + (i % 2 ? 0.25 : 0);
    const d = spread * (i % 3 === 0 ? 1 : i % 3 === 1 ? 0.7 : 0.85);
    const size = 12 + (i % 3) * 5;
    box.append(h('span', {
      class: 'juice-star',
      style: { '--dx': `${Math.cos(a) * d}px`, '--dy': `${Math.sin(a) * d * 0.8}px`, '--s': `${size}px`, animationDelay: `${(i % 4) * 25}ms` },
      html: `<svg viewBox="0 0 24 24"><path d="${STAR}" fill="${STAR_COLOURS[i % STAR_COLOURS.length]}"/></svg>`,
    }));
  }
  document.body.append(box);
  setTimeout(() => box.remove(), 900);
}

/** "5 in a row!": shown from 3 right answers in a row; `pop` when it has just reached a milestone. */
export function runBadge(run, pop = false) {
  if (run < 3) return null;
  return h('span', { class: `run-badge${pop ? ' run-pop' : ''}` },
    h('span', { class: 'run-star', 'aria-hidden': 'true', html: `<svg viewBox="0 0 24 24"><path d="${STAR}" fill="currentColor"/></svg>` }),
    pop ? `${run} in a row!` : `${run} in a row`);
}
