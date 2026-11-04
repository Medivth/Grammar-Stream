// The lamp prizes (Year 6's desk lamp, Florence Nightingale's lamp for Years 2/3) are switches:
// wherever the companion is drawn wearing one (home, the wardrobe, the session screens), tapping
// the lamp turns its light on or off. The light is remembered in state.profile.companion.lit
// (on unless it is false). capybaraSVG draws it ({ lit }) inside a group with class
// "companion-lamp"; this module makes that group a button and redraws on a tap.

import { wornList } from './capybara.js';

export const LAMPS = ['lamp', 'oillamp'];
export const LAMP_SELECTOR = '.companion-lamp, [data-lamp], .lamp';
const SVGNS = 'http://www.w3.org/2000/svg';

export const isLit = (c) => c?.lit !== false;
export const wearsLamp = (c) => wornList(c || {}).some((a) => LAMPS.includes(a));

/** Switch the companion's lamp on or off. Returns the new state (true = on). */
export function toggleLit(state) {
  state.profile ||= {};
  const c = (state.profile.companion ||= {});
  c.lit = !isLit(c);
  return c.lit;
}

/** The drawing a lamp belongs to (made by capybaraEl or companionEl, which remember their options). */
function hostOf(el) {
  for (let n = el; n; n = n.parentElement) if (n.companion) return n;
  return null;
}

/** Only the companion itself has a working lamp: not wardrobe thumbnails (they are buttons) or previews. */
const switchable = (g) => !g.closest('button, a, [data-no-lamp]') && !!hostOf(g);

function decorate(g) {
  const lit = isLit(hostOf(g).companion.opts);
  g.setAttribute('role', 'button');
  g.setAttribute('tabindex', '0');
  g.setAttribute('aria-pressed', String(lit));
  g.setAttribute('aria-label', 'Lamp light');
  if (g.dataset.lampReady) return;
  g.dataset.lampReady = '1';
  // the picture now holds a control, so it is a group rather than a flat image
  const svg = g.ownerSVGElement;
  if (svg?.getAttribute('role') === 'img') svg.setAttribute('role', 'group');
  // a bigger invisible target: the lamp is small on a phone
  try {
    const b = g.getBBox();
    if (b.width && b.height) {
      const pad = 8;
      const r = document.createElementNS(SVGNS, 'rect');
      for (const [k, v] of Object.entries({ x: b.x - pad, y: b.y - pad, width: b.width + 2 * pad, height: b.height + 2 * pad, rx: 6, fill: 'transparent', 'pointer-events': 'all', class: 'lamp-hit' })) r.setAttribute(k, v);
      g.insertBefore(r, g.firstChild);
    }
  } catch { /* not rendered yet */ }
}

function decorateIn(root) {
  for (const g of root.querySelectorAll(LAMP_SELECTOR)) if (switchable(g)) decorate(g);
}

function flip(app, g, byKey) {
  const lit = toggleLit(app.state);
  app.save();
  const tapped = hostOf(g);
  // every working lamp on the page shows the same light
  const hosts = new Set([...app.root.querySelectorAll(LAMP_SELECTOR)].filter(switchable).map(hostOf));
  for (const host of hosts) {
    const { opts, className, make } = host.companion;
    const next = { ...opts, lit };
    host.innerHTML = make(next, className).innerHTML; // in place, so the companion keeps bobbing
    host.companion = { ...host.companion, opts: next };
    host.classList.remove('lamp-on', 'lamp-off');
    void host.offsetWidth;
    host.classList.add(lit ? 'lamp-on' : 'lamp-off');
    decorateIn(host);
  }
  if (byKey) tapped?.querySelector(LAMP_SELECTOR)?.focus();
}

/** Watch the page for companions with a lamp, and make each lamp a switch. */
export function installLamps(app) {
  const root = app.root;
  root.addEventListener('click', (e) => {
    const g = e.target.closest?.(LAMP_SELECTOR);
    if (!g || !switchable(g)) return;
    e.preventDefault();
    e.stopPropagation();
    flip(app, g, false);
  });
  root.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const g = e.target.closest?.(LAMP_SELECTOR);
    if (!g || g !== e.target || !switchable(g)) return;
    e.preventDefault();
    e.stopPropagation();
    flip(app, g, true);
  });
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; decorateIn(root); });
  }).observe(root, { childList: true, subtree: true });
}
