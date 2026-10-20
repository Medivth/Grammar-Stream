// Grown-ups area: PIN gate, weekly card, conversation prompts, settings, backup.
// Deliberately no live failure feed: it shows patterns and prompts, not a list of mistakes.

import { h, mount, toast } from '../ui/dom.js';
import { weekStart, formatDay } from '../core/dates.js';
import { calibration, daysPractisedThisMonth } from '../core/session.js';
import { exportFile, pickBackupFile, saveState, wipe } from '../platform/storage.js';
import { emptyState } from '../core/store.js';
import { SUBJECTS } from '../core/subjects.js';

let unlockedUntil = 0;

export function parentScreen(app) {
  if (Date.now() < unlockedUntil) return dashboard(app);
  let entered = '';
  const dots = h('div', { class: 'pin-dots', 'aria-hidden': 'true' });
  const msg = h('p', { class: 'center muted', 'aria-live': 'polite' }, 'Enter the grown-ups’ PIN');
  const draw = () => dots.replaceChildren(...[0, 1, 2, 3].map((i) => h('span', { class: i < entered.length ? 'on' : '' })));
  const press = (d) => {
    if (d === 'del') entered = entered.slice(0, -1);
    else if (entered.length < 4) entered += d;
    draw();
    if (entered.length === 4) {
      if (entered === app.state.profile?.parentPin) { unlockedUntil = Date.now() + 10 * 60 * 1000; dashboard(app); }
      else { msg.textContent = 'That PIN isn’t right. Try again.'; entered = ''; draw(); }
    }
  };
  draw();
  mount(app.root,
    h('div', { class: 'topbar' }, h('button', { class: 'btn-icon', 'aria-label': 'Back', onclick: () => app.go('#/home') }, '←'), h('h1', {}, 'Grown-ups')),
    h('div', { class: 'narrow card' }, msg, dots,
      h('div', { class: 'pin-pad' }, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((d) => d ? h('button', { type: 'button', onclick: () => press(d), 'aria-label': d === 'del' ? 'Delete' : d }, d === 'del' ? '⌫' : d) : h('span')))));
}

function weekStats(state, db, today) {
  const ws = weekStart(today);
  const log = state.log.filter((r) => r[0] >= ws);
  const sessions = state.sessions.filter((s) => s.day >= ws && s.completed);
  const minutes = Math.round(sessions.reduce((a, s) => a + (s.end && s.start ? (s.end - s.start) / 60000 : 0), 0));
  const topicsTouched = [...new Set(log.map((r) => db.items[r[2]]?.topic).filter(Boolean))];
  const started = Object.entries(state.topics).filter(([, t]) => t.started >= ws).map(([id]) => id);
  const secured = Object.entries(state.topics).filter(([, t]) => t.profDay != null && t.profDay >= ws).map(([id]) => id);
  const reading = state.reading.filter((r) => r.day >= ws).reduce((a, r) => a + r.minutes, 0);
  // long-term memory: answers this week on items first seen 30+ days ago
  const firstSeen = {};
  for (const r of state.log) if (firstSeen[r[2]] == null) firstSeen[r[2]] = r[0];
  const old = log.filter((r) => firstSeen[r[2]] <= today - 30);
  const oldRate = old.length ? Math.round((100 * old.filter((r) => r[3]).length) / old.length) : null;
  const bySubject = {};
  for (const r of log) {
    const s = db.items[r[2]]?.subject;
    if (s) bySubject[s] = (bySubject[s] || 0) + 1;
  }
  return { ws, days: new Set(sessions.map((s) => s.day)).size, minutes, answered: log.length, topicsTouched, started, secured, reading, old: old.length, oldRate, bySubject };
}

function dashboard(app) {
  const { state, db } = app;
  const today = app.today();
  const w = weekStats(state, db, today);
  const cal = calibration(state);
  const name = state.profile?.childName || 'She';
  const prompts = [...new Set([...w.started, ...w.topicsTouched])].map((id) => db.topics[id]?.talk).filter(Boolean).slice(0, 3);
  const pct = (x) => (x.n ? `${Math.round((100 * x.right) / x.n)}% of the time (${x.right}/${x.n})` : null);
  const recentWriting = state.writing.slice(-6).reverse();
  const backupAge = state.lastBackup == null ? null : today - state.lastBackup;

  const settings = settingsForm(app);
  mount(app.root,
    h('div', { class: 'topbar' }, h('button', { class: 'btn-icon', 'aria-label': 'Back', onclick: () => { unlockedUntil = 0; app.go('#/home'); } }, '←'), h('h1', {}, 'Grown-ups'),
      h('span', { class: 'spacer' }), h('button', { class: 'btn-ghost', onclick: () => { unlockedUntil = 0; app.go('#/home'); } }, 'Lock')),
    h('div', { class: 'narrow stack' },
      backupAge == null || backupAge >= 7 ? h('div', { class: 'card', style: { borderColor: 'var(--warn)' } },
        h('h3', {}, 'Back up her progress'), h('p', {}, backupAge == null ? 'You haven’t made a backup yet. Progress lives only in this browser, so save a copy now and then.' : `Last backup was ${backupAge} days ago.`),
        h('button', { class: 'btn-primary', onclick: () => doExport(app) }, 'Save a backup file')) : null,

      h('div', { class: 'card' },
        h('h2', {}, `This week (from ${formatDay(w.ws, { weekday: 'short', day: 'numeric', month: 'short' })})`),
        h('div', { class: 'grid three' },
          stat(w.days, 'days practised'), stat(w.minutes, 'minutes on the app'), stat(w.reading, 'minutes reading')),
        h('p', { style: { marginTop: '12px' } }, `${w.answered} questions answered. Started ${w.started.length} topic${w.started.length === 1 ? '' : 's'}; ${w.secured.length} became secure.`),
        w.started.length ? h('p', { class: 'muted' }, 'New this week: ', w.started.map((id) => db.topics[id]?.title).filter(Boolean).join(', ')) : null,
        h('p', { class: 'muted small' }, SUBJECTS.map((s) => `${s.name} ${w.bySubject[s.id] || 0}`).join(' · '))),

      prompts.length ? h('div', { class: 'card' }, h('h2', {}, 'Things to talk about'), h('p', { class: 'muted' }, 'Interest helps more than checking. Try one of these at dinner or in the car:'), h('ul', {}, prompts.map((p) => h('li', {}, p)))) : null,

      h('div', { class: 'card' }, h('h2', {}, 'Is it working?'),
        h('p', {}, w.oldRate == null ? 'After about a month, this shows how much she still remembers of things first learned 30 or more days ago.' : `Of things she first learned 30+ days ago, she remembered ${w.oldRate}% this week (${w.old} answers).`),
        h('p', {}, cal.sure.n + cal.guess.n < 10 ? 'Calibration appears after a few more sessions: it compares how sure she felt with whether she was right.' : `Calibration. When she tapped “Sure”, she was right ${pct(cal.sure) ?? '(no answers yet)'}. When “Guessing”: ${pct(cal.guess) ?? '(no answers yet)'}. Good calibration (sure means right; guesses are often wrong) is a sign of real understanding.`),
        h('p', { class: 'muted small' }, `${daysPractisedThisMonth(state, today)} day${daysPractisedThisMonth(state, today) === 1 ? '' : 's'} practised this month. ${Object.keys(state.cards).length} items in her review deck.`)),

      h('div', { class: 'card' }, h('h2', {}, 'Her sentences'),
        recentWriting.length ? recentWriting.map((wr) => h('div', { class: 'topic-row' }, h('div', { class: 'title' }, h('div', { class: 'muted small' }, `${db.sentenceById[wr.taskId]?.title || 'Sentence'} · ${formatDay(wr.day, { weekday: 'short', day: 'numeric', month: 'short' })}`), h('div', {}, wr.text || '(blank)')))) : h('p', { class: 'muted' }, 'Nothing yet.'),
        h('p', { class: 'muted small' }, 'Read these with her and ask what she was trying to do. The weekly extended-writing task comes in the next update.')),

      settings,

      h('div', { class: 'card stack' }, h('h2', {}, 'Backup and moving devices'),
        h('p', { class: 'muted' }, 'Progress is stored only in this browser on this device. To move to the tablet, save a backup here and load it there.'),
        h('div', { class: 'row' },
          h('button', { class: 'btn-primary', onclick: () => doExport(app) }, 'Save a backup file'),
          h('button', { class: 'btn-ghost', onclick: () => doImport(app) }, 'Load a backup file'))),

      h('div', { class: 'card stack' }, h('h2', {}, 'Start again'),
        h('p', { class: 'muted' }, 'This deletes all progress on this device. Save a backup first.'),
        h('button', { class: 'btn-ghost', onclick: () => doReset(app) }, 'Delete all progress…'))));
}

function stat(n, label) {
  return h('div', { class: 'stat' }, h('b', {}, String(n)), h('span', { class: 'muted small' }, label));
}

function settingsForm(app) {
  const st = app.state;
  const name = h('input', { type: 'text', value: st.profile?.childName || '', id: 'set-name' });
  const comp = h('input', { type: 'text', value: st.profile?.companion?.name || '', id: 'set-comp' });
  const bed = h('input', { type: 'time', value: st.settings.bedtime, id: 'set-bed' });
  const early = h('input', { type: 'time', value: st.settings.earliest || '06:30', id: 'set-early' });
  const mins = h('select', { id: 'set-mins' }, [15, 20, 25, 30, 40].map((m) => h('option', { value: m, selected: m === st.settings.sessionMinutes }, `${m} minutes`)));
  const pin = h('input', { type: 'password', inputmode: 'numeric', maxlength: 4, placeholder: 'Leave blank to keep', id: 'set-pin' });
  const tts = h('input', { type: 'checkbox', id: 'set-tts', checked: st.settings.tts !== false, style: { width: '28px', height: '28px' } });
  return h('div', { class: 'card stack' }, h('h2', {}, 'Settings'),
    h('div', { class: 'field' }, h('label', { for: 'set-name' }, 'Her first name'), name),
    h('div', { class: 'field' }, h('label', { for: 'set-comp' }, 'Capybara’s name'), comp),
    h('div', { class: 'grid two' },
      h('div', { class: 'field' }, h('label', { for: 'set-bed' }, 'Bedtime (app rests 1 hour before)'), bed),
      h('div', { class: 'field' }, h('label', { for: 'set-early' }, 'Earliest start'), early)),
    h('div', { class: 'field' }, h('label', { for: 'set-mins' }, 'Daily session length'), mins),
    h('div', { class: 'field row' }, tts, h('label', { for: 'set-tts', style: { margin: 0 } }, 'Read-aloud buttons (spelling)')),
    h('div', { class: 'field' }, h('label', { for: 'set-pin' }, 'New 4-digit PIN'), pin),
    h('button', { class: 'btn-primary', onclick: () => {
      if (pin.value && !/^\d{4}$/.test(pin.value)) return toast('The PIN must be 4 digits.');
      st.profile.childName = name.value.trim() || st.profile.childName;
      st.profile.companion.name = comp.value.trim() || st.profile.companion.name;
      st.settings.bedtime = bed.value || st.settings.bedtime;
      st.settings.earliest = early.value || st.settings.earliest;
      st.settings.sessionMinutes = +mins.value;
      st.settings.tts = tts.checked;
      if (pin.value) st.profile.parentPin = pin.value;
      app.save();
      toast('Settings saved.');
    } }, 'Save settings'));
}

function doExport(app) {
  const name = exportFile(app.state, app.today());
  app.state.lastBackup = app.today();
  app.save();
  toast(`Saved ${name}. Keep it somewhere safe.`);
  dashboard(app);
}

async function doImport(app) {
  try {
    const { data, savedAt } = await pickBackupFile();
    const when = new Date(savedAt).toLocaleString('en-GB');
    if (!confirm(`Load this backup from ${when}? It will replace the progress on this device.`)) return;
    app.state = data;
    saveState(app.state);
    toast('Backup loaded.');
    app.go('#/home');
  } catch (e) {
    toast(e.message || 'That file could not be loaded.');
  }
}

function doReset(app) {
  const typed = prompt('Type DELETE to remove all progress on this device.');
  if (typed !== 'DELETE') return;
  wipe();
  app.state = emptyState(app.today());
  app.save();
  app.go('#/welcome');
}
