// App bootstrap and routing.

import { loadState, saveState } from './platform/storage.js';
import { loadContent } from './core/content.js';
import { dayNumber } from './core/dates.js';
import { h, mount, toast } from './ui/dom.js';
import { homeScreen, subjectScreen } from './screens/home.js';
import { playScreen } from './screens/play.js';
import { parentScreen } from './screens/parent.js';
import { welcomeScreen, companionScreen, displayScreen } from './screens/onboarding.js';
import { writingScreen, feedbackScreen } from './screens/writing.js';
import { readingScreen } from './screens/reading.js';

const root = document.getElementById('app');

const app = {
  root,
  state: null,
  db: null,
  today: () => dayNumber(new Date()),
  save() {
    if (!saveState(app.state)) toast('Could not save progress on this device.');
  },
  go(hash) {
    if (location.hash === hash) route();
    else location.hash = hash;
  },
  applySettings() {
    const st = app.state.settings;
    const el = document.documentElement;
    el.dataset.font = st.font || 'default';
    if (st.theme) el.dataset.theme = st.theme; else delete el.dataset.theme;
    el.dataset.motion = st.reduceMotion ? 'reduce' : 'full';
    el.style.setProperty('--scale', st.textScale || 1);
  },
};

async function route() {
  document.onkeydown = null;
  const hash = location.hash || '#/home';
  const p = app.state.profile;
  if (!p && hash !== '#/welcome') return app.go('#/welcome');
  if (p && !p.companion?.name && hash !== '#/companion' && hash !== '#/welcome') return app.go('#/companion');
  const [, page, arg] = hash.split('/');
  switch (page) {
    case 'welcome': return welcomeScreen(app);
    case 'companion': return companionScreen(app);
    case 'play': return playScreen(app);
    case 'subject': return subjectScreen(app, arg);
    case 'parent': return parentScreen(app);
    case 'display': return displayScreen(app);
    case 'writing': return writingScreen(app);
    case 'feedback': return feedbackScreen(app, arg);
    case 'reading': return readingScreen(app);
    default: return homeScreen(app);
  }
}

async function boot() {
  const { state, warning } = loadState(app.today());
  app.state = state;
  app.applySettings();
  try {
    app.db = await loadContent((p) => fetch(p).then((r) => {
      if (!r.ok) throw new Error(`${p}: ${r.status}`);
      return r.json();
    }));
  } catch (e) {
    mount(root, h('div', { class: 'narrow card' }, h('h1', {}, 'The lessons could not load'), h('p', {}, 'Check the internet connection the first time you open the app. After that it works offline.'), h('p', { class: 'muted small' }, String(e.message || e))));
    return;
  }
  window.addEventListener('hashchange', route);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') app.save(); });
  await route();
  if (warning) toast(warning);
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch((e) => console.warn('service worker', e));
  }
}

// exposed for debugging and browser tests
window.__app = app;
boot();
