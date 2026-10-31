// App bootstrap and routing.

import { loadState, saveState, listProfiles, upsertProfile, newProfileId } from './platform/storage.js';
import { emptyState } from './core/store.js';
import { setCourse, COURSE } from './core/subjects.js';
import { setPronoun } from './core/pronoun.js';
import { loadContent } from './core/content.js';
import { dayNumber } from './core/dates.js';
import { h, mount, toast } from './ui/dom.js';
import { homeScreen, subjectScreen } from './screens/home.js';
import { playScreen } from './screens/play.js';
import { parentScreen } from './screens/parent.js';
import { welcomeScreen, companionScreen, displayScreen, whoScreen } from './screens/onboarding.js';
import { writingScreen, feedbackScreen } from './screens/writing.js';
import { readingScreen } from './screens/reading.js';
import { progressScreen } from './screens/progress.js';
import { paperScreen } from './screens/paper.js';
import { typingScreen } from './screens/typing.js';
import { speedScreen } from './screens/speed.js';
import { handwritingScreen } from './screens/handwriting.js';

const root = document.getElementById('app');

const dbCache = {};
const fetchJSON = (p) => fetch(p).then((r) => {
  if (!r.ok) throw new Error(`${p}: ${r.status}`);
  return r.json();
});

const app = {
  root,
  state: null,
  db: null,
  profileId: 'main',
  today: () => dayNumber(new Date()),
  save() {
    if (!saveState(app.state, app.profileId)) toast('Could not save progress on this device.');
    if (app.state.profile) upsertProfile(app.profileId, app.state);
  },
  profiles: () => listProfiles(),
  /** Switch to a child's save: course, pronouns, content and settings follow. */
  async useProfile(id) {
    const { state, warning } = loadState(app.today(), id);
    app.profileId = id;
    app.state = state;
    await app.useCourse(state.course || 'y6');
    setPronoun(state.profile?.pronoun || 'she');
    app.applySettings();
    try { sessionStorage.setItem('gs.profile', id); } catch { /* private mode */ }
    if (warning) toast(warning);
  },
  async useCourse(courseId) {
    setCourse(courseId);
    app.state.course = COURSE.id;
    app.db = dbCache[COURSE.id] ||= await loadContent(fetchJSON, COURSE.index);
  },
  /** Start setting up another child (a fresh save slot). */
  async addChild() {
    const pin = app.state?.profile?.parentPin;
    app.profileId = newProfileId();
    app.state = emptyState(app.today());
    app.state.pendingPin = pin || null;
    try { sessionStorage.setItem('gs.profile', app.profileId); } catch { /* private mode */ }
    app.go('#/welcome');
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
  if (hash === '#/who') return whoScreen(app);
  if (!p && hash !== '#/welcome') return app.go('#/welcome');
  if (p && !p.companion?.name && hash !== '#/companion' && hash !== '#/welcome') return app.go('#/companion');
  const [, page, arg] = hash.split('/');
  if (page !== 'play' && app.state) app.state.extraOn = false; // leaving extra practice returns to today's session
  switch (page) {
    case 'welcome': return welcomeScreen(app);
    case 'companion': return companionScreen(app);
    case 'play': return playScreen(app, arg);
    case 'subject': return subjectScreen(app, arg);
    case 'parent': return parentScreen(app);
    case 'display': return displayScreen(app);
    case 'writing': return writingScreen(app);
    case 'feedback': return feedbackScreen(app, arg);
    case 'reading': return readingScreen(app);
    case 'progress': return progressScreen(app, arg);
    case 'paper': return paperScreen(app);
    case 'typing': return typingScreen(app);
    case 'speed': return speedScreen(app);
    case 'handwriting': return handwritingScreen(app);
    default: return homeScreen(app);
  }
}

async function boot() {
  const profiles = listProfiles();
  let chosen = null;
  try { chosen = sessionStorage.getItem('gs.profile'); } catch { /* private mode */ }
  try {
    if (profiles.length > 1 && !profiles.some((p) => p.id === chosen)) {
      // more than one child on this device: ask who is learning (the main slot loads behind it)
      await app.useProfile(profiles[0].id);
      if (location.hash !== '#/who') history.replaceState(null, '', '#/who');
    } else {
      await app.useProfile(profiles.some((p) => p.id === chosen) ? chosen : profiles[0]?.id || 'main');
    }
  } catch (e) {
    mount(root, h('div', { class: 'narrow card' }, h('h1', {}, 'The lessons could not load'), h('p', {}, 'Check the internet connection the first time you open the app. After that it works offline.'), h('p', { class: 'muted small' }, String(e.message || e))));
    return;
  }
  window.addEventListener('hashchange', route);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') app.save(); });
  await route();
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch((e) => console.warn('service worker', e));
  }
}

// exposed for debugging and browser tests
window.__app = app;
boot();
