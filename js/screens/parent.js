// Grown-ups area: PIN gate, weekly card, conversation prompts, settings, backup.
// Deliberately no live failure feed: it shows patterns and prompts, not a list of mistakes.

import { h, mount, toast, rich } from '../ui/dom.js';
import { weekStart, formatDay } from '../core/dates.js';
import { calibration, daysPractisedThisMonth, PLACEMENT_ORDER } from '../core/session.js';
import { exportFile, pickBackupFile, removeProfile } from '../platform/storage.js';
import { emptyState } from '../core/store.js';
import { SUBJECTS, SUBJECT_BY_ID, COURSES } from '../core/subjects.js';
import { piecesToMark, markPiece, wordCount, answersToMark, markAnswer, ANSWER_LEVELS } from '../core/writing.js';
import { needsPlacement } from '../core/placement.js';
import { sprintSeconds } from '../core/sprint.js';
import { paperSpec } from '../gen/paper.js';

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
  const sprints = (state.sprints || []).filter((s) => s.day >= ws);
  const sprintBest = sprints.length ? sprints.reduce((a, b) => (b.correct > a.correct ? b : a)) : null;
  return { ws, days: new Set(sessions.map((s) => s.day)).size, minutes, answered: log.length, topicsTouched, started, secured, reading, old: old.length, oldRate, bySubject, sprintBest };
}

function dashboard(app) {
  const { state, db } = app;
  const today = app.today();
  const w = weekStats(state, db, today);
  const cal = calibration(state);
  const name = state.profile?.childName || '{She}';
  const prompts = [...new Set([...w.started, ...w.topicsTouched])].map((id) => db.topics[id]?.talk).filter(Boolean).slice(0, 3);
  const pct = (x) => (x.n ? `${Math.round((100 * x.right) / x.n)}% of the time (${x.right}/${x.n})` : null);
  const recentWriting = state.writing.slice(-6).reverse();
  const backupAge = state.lastBackup == null ? null : today - state.lastBackup;

  const settings = settingsForm(app);
  const course = courseCard(app);
  mount(app.root,
    h('div', { class: 'topbar' }, h('button', { class: 'btn-icon', 'aria-label': 'Back', onclick: () => { unlockedUntil = 0; app.go('#/home'); } }, '←'), h('h1', {}, 'Grown-ups'),
      h('span', { class: 'spacer' }), h('button', { class: 'btn-ghost', onclick: () => { unlockedUntil = 0; app.go('#/home'); } }, 'Lock')),
    h('div', { class: 'narrow stack' },
      backupAge == null || backupAge >= 7 ? h('div', { class: 'card', style: { borderColor: 'var(--warn)' } },
        h('h3', {}, 'Back up {her} progress'), h('p', {}, backupAge == null ? 'You haven’t made a backup yet. Progress lives only in this browser, so save a copy now and then.' : `Last backup was ${backupAge} days ago.`),
        h('button', { class: 'btn-primary', onclick: () => doExport(app) }, 'Save a backup file')) : null,

      course.ready ? course.el : null,
      markingCard(app),
      answersCard(app),

      h('div', { class: 'card' },
        h('h2', {}, `This week (from ${formatDay(w.ws, { weekday: 'short', day: 'numeric', month: 'short' })})`),
        h('div', { class: 'grid three' },
          stat(w.days, 'days practised'), stat(w.minutes, 'minutes on the app'), stat(w.reading, 'minutes reading')),
        h('p', { style: { marginTop: '12px' } }, `${w.answered} questions answered. Started ${w.started.length} topic${w.started.length === 1 ? '' : 's'}; ${w.secured.length} became secure.`),
        w.started.length ? h('p', { class: 'muted' }, 'New this week: ', w.started.map((id) => db.topics[id]?.title).filter(Boolean).join(', ')) : null,
        h('p', { class: 'muted small' }, SUBJECTS.map((s) => `${s.name} ${w.bySubject[s.id] || 0}`).join(' · ')),
        w.sprintBest ? h('p', { class: 'muted small' }, `Arithmetic sprint: best this week ${w.sprintBest.correct} right in ${sprintSeconds()} seconds (level ${w.sprintBest.level} of 5).`) : null,
        (state.papers || []).length ? h('p', { class: 'muted small' }, `Arithmetic papers: ${state.papers.length} done, best ${Math.max(...state.papers.map((p) => p.score))} / ${paperSpec().marks}, latest ${state.papers.at(-1).score} / ${paperSpec().marks}.`) : null),

      prompts.length ? h('div', { class: 'card' }, h('h2', {}, 'Things to talk about'), h('p', { class: 'muted' }, 'Interest helps more than checking. Try one of these at dinner or in the car:'), h('ul', {}, prompts.map((p) => h('li', {}, p)))) : null,

      h('div', { class: 'card' }, h('h2', {}, 'Is it working?'),
        h('p', {}, w.oldRate == null ? 'After about a month, this shows how much {she} still remembers of things first learned 30 or more days ago.' : `Of things {she} first learned 30+ days ago, {she} remembered ${w.oldRate}% this week (${w.old} answers).`),
        h('p', {}, cal.sure.n + cal.guess.n < 10 ? 'Calibration appears after a few more sessions: it compares how sure {she} felt with whether {she} was right.' : `Calibration. When {she} tapped “Sure”, {she} was right ${pct(cal.sure) ?? '(no answers yet)'}. When “Guessing”: ${pct(cal.guess) ?? '(no answers yet)'}. Good calibration (sure means right; guesses are often wrong) is a sign of real understanding.`),
        h('p', { class: 'muted small' }, `${daysPractisedThisMonth(state, today)} day${daysPractisedThisMonth(state, today) === 1 ? '' : 's'} practised this month. ${Object.keys(state.cards).length} items in {her} review deck.`)),

      h('div', { class: 'card' }, h('h2', {}, '{Her} sentences'),
        recentWriting.length ? recentWriting.map((wr) => h('div', { class: 'topic-row' }, h('div', { class: 'title' }, h('div', { class: 'muted small' }, `${db.sentenceById[wr.taskId]?.title || 'Sentence'} · ${formatDay(wr.day, { weekday: 'short', day: 'numeric', month: 'short' })}`), h('div', {}, wr.text || '(blank)')))) : h('p', { class: 'muted' }, 'Nothing yet.'),
        h('p', { class: 'muted small' }, 'Read these with {him} and ask what {she} was trying to do.')),

      course.ready ? null : course.el,
      levelsCard(app),
      settings,

      h('div', { class: 'card stack' }, h('h2', {}, 'Backup and moving devices'),
        h('p', { class: 'muted' }, 'Progress is stored only in this browser on this device. To move to the tablet, save a backup here and load it there.'),
        h('div', { class: 'row' },
          h('button', { class: 'btn-primary', onclick: () => doExport(app) }, 'Save a backup file'),
          h('button', { class: 'btn-ghost', onclick: () => doImport(app) }, 'Load a backup file'))),

      childrenCard(app),

      h('div', { class: 'card stack' }, h('h2', {}, 'Start again'),
        h('p', { class: 'muted' }, `This deletes ${state.profile?.childName || 'this child'}’s progress on this device. Save a backup first.`),
        h('button', { class: 'btn-ghost', onclick: () => doReset(app) }, 'Delete this child’s progress…'))));
}

/** The child's course, and moving up to the next one when the current one is nearly used up. */
function courseCard(app) {
  const { state, db } = app;
  const course = COURSES[state.course];
  const next = COURSES[course?.next], prev = COURSES[course?.prev];
  const ids = Object.keys(db.topics);
  const started = ids.filter((id) => state.topics[id]).length;
  const secure = ids.filter((id) => ['proficient', 'mastered', 'assumed'].includes(state.topics[id]?.state)).length;
  const ready = !!next && started / ids.length >= 0.75;
  const move = async (to, msg) => {
    await app.useCourse(to.id);
    if (state.settings.sessionMinutes < to.minutes) { state.settings.sessionMinutes = to.minutes; msg += ` Sessions are now ${to.minutes} minutes (you can change this in Settings).`; }
    state.plan = null;
    app.save();
    toast(msg);
    dashboard(app);
  };
  const el = h('div', { class: 'card stack', style: ready ? { borderColor: 'var(--accent, #5143d9)' } : {} },
    h('h2', {}, ready ? `Ready for ${next.title.replace(' greater depth', '')}?` : 'Course'),
    h('p', {}, `${course?.title}: {she} has started ${started} of ${ids.length} topics, and ${secure} are secure.`),
    next ? h('p', { class: 'muted' }, `${next.title} includes everything in ${course.title.replace(' greater depth', '')}, so nothing is lost: {her} reviews carry on, unfinished topics stay, and the new topics follow on from what {she} knows. ${ready ? 'Most topics here are under way, so now is a good time.' : 'Most children move up when about three quarters of these topics are started, but you can move up any time.'}`) : null,
    next ? h('button', { class: ready ? 'btn-primary' : 'btn-ghost', onclick: () => { if (confirm(`Move ${state.profile?.childName || 'this child'} up to ${next.title}? All progress is kept.`)) move(next, `Moved up to ${next.title}.`); } }, `Move up to ${next.title}`) : null,
    prev ? h('button', { class: 'btn-ghost', onclick: () => { if (confirm(`Go back to ${prev.title}? Progress on the new topics is kept and returns if you move up again.`)) move(prev, `Back to ${prev.title}.`); } }, `Go back to ${prev.title}`) : null);
  return { el, ready };
}

function childrenCard(app) {
  const list = app.profiles();
  return h('div', { class: 'card stack' }, h('h2', {}, 'Children on this device'),
    h('p', { class: 'muted' }, 'Each child has their own course, companion, progress and backup file. When there is more than one, the app asks “Who’s learning?” when it opens.'),
    h('ul', { class: 'plain-list' }, list.map((p) => h('li', { class: 'row', style: { justifyContent: 'space-between', alignItems: 'center' } },
      h('span', {}, h('strong', {}, p.name || '(not set up)'), h('span', { class: 'muted small' }, ` · ${COURSES[p.course]?.title || ''}${p.id === app.profileId ? ' · showing now' : ''}`)),
      p.id === app.profileId ? null : h('button', { class: 'btn-ghost', onclick: async () => { await app.useProfile(p.id); unlockedUntil = Date.now() + 10 * 60 * 1000; dashboard(app); } }, 'Switch to')))),
    h('button', { class: 'btn-primary', onclick: () => app.addChild() }, 'Add another child'));
}

const PHRASES = {
  worked: ['Your opening really hooked me.', 'Your paragraphs flowed well.', 'You used precise evidence.', 'You explained WHY, not just what.', 'Brilliant word choices.', 'You kept going on a hard task.'],
  next: ['Vary your sentence lengths: add one very short sentence for impact.', 'Use a quotation in every paragraph.', 'Start each paragraph with a clear point.', 'Explain the effect on the reader of one specific word.', 'Use linking words like “As a result” and “However”.', 'Check capital letters and full stops.'],
};

function markingCard(app) {
  const { state, db } = app;
  const todo = piecesToMark(state);
  const marked = state.pieces.filter((p) => p.mark).slice(-3).reverse();
  if (!todo.length && !marked.length) {
    if (!COURSES[state.course]?.writing) return null;
    return h('div', { class: 'card' }, h('h2', {}, 'Weekly writing'), h('p', { class: 'muted' }, 'Once a week {she} writes a longer piece (a story, a speech, a history essay…). When {she} hands it in, you mark it here with a four-line guide. It takes about 10 minutes, and your interest in it matters more than the marks.'));
  }
  return h('div', { class: 'card stack' }, h('h2', {}, todo.length ? `Writing to read (${todo.length})` : 'Weekly writing'),
    todo.map((p) => markForm(app, p, db.pieceById[p.promptId])),
    marked.length ? h('div', {}, h('h3', {}, 'Recently marked'), marked.map((p) => h('p', { class: 'muted small' }, `${db.pieceById[p.promptId]?.title}: ${p.mark.scores.reduce((a, b) => a + b, 0)}/8 · next step: ${p.mark.next || '–'}`))) : null);
}

// Short written reading answers: a three-level verdict and one line of comment.
function answersCard(app) {
  const { state, db } = app;
  const todo = answersToMark(state);
  if (!todo.length) return null;
  return h('div', { class: 'card stack' }, h('h2', {}, `Reading answers to mark (${todo.length})`),
    h('p', { class: 'muted small' }, 'Two minutes each. Compare {her} paragraph with the model answer: does {she} make a point, quote the text, and explain the effect of the words?'),
    todo.map((a) => {
      const item = db.items[a.itemId] || {};
      let score = null;
      const note = h('input', { type: 'text', placeholder: 'One line for {him} (optional)', maxlength: '160' });
      const btns = ANSWER_LEVELS.map((label, lv) => h('button', { type: 'button', class: 'option', 'aria-pressed': 'false', style: { minHeight: '48px' }, onclick: () => { score = lv; btns.forEach((b, j) => b.setAttribute('aria-pressed', String(j === lv))); } }, label));
      return h('div', { class: 'card stack', style: { background: 'var(--bg)' } },
        h('p', { class: 'muted small' }, item.passageSource || ''),
        rich('p', item.prompt || '', { style: { fontWeight: 700 } }),
        h('div', { class: 'card', style: { whiteSpace: 'pre-wrap' } }, a.text),
        h('details', {}, h('summary', { style: { cursor: 'pointer' } }, 'Model answer and what to look for'), h('ul', {}, (item.hints || []).map((t) => h('li', {}, t))), h('p', { class: 'learn', style: { marginTop: '8px' } }, item.model || '')),
        h('div', { class: 'options plain' }, btns),
        note,
        h('button', { class: 'btn-primary', onclick: () => {
          if (score == null) return toast('Choose a level first.');
          markAnswer(state, a, { score, note: note.value }, app.today(), item.topic);
          app.save();
          toast('Saved. {She}’ll see it at the start of {her} next session.');
          dashboard(app);
        } }, 'Save'));
    }));
}

function markForm(app, piece, prompt) {
  const scores = prompt.rubric.map(() => null);
  const worked = h('textarea', { placeholder: 'One thing that worked well', style: { minHeight: '70px' } });
  const next = h('textarea', { placeholder: 'One next step (just one!)', style: { minHeight: '70px' } });
  const chips = (list, ta) => h('div', { class: 'row', style: { gap: '6px' } }, list.map((t) => h('button', { type: 'button', class: 'btn-ghost small', style: { minHeight: '40px', padding: '6px 12px' }, onclick: () => { ta.value = t; } }, t)));
  const lines = prompt.rubric.map((r, i) => {
    const btns = r.levels.map((desc, lv) => h('button', { type: 'button', class: 'option', 'aria-pressed': 'false', style: { minHeight: '48px', padding: '8px 12px' }, onclick: () => {
      scores[i] = lv;
      btns.forEach((b, j) => b.setAttribute('aria-pressed', String(j === lv)));
    } }, h('strong', {}, `${lv} `), desc));
    return h('div', { class: 'field' }, h('label', {}, `${i + 1}. ${r.name}`), h('div', { class: 'options plain' }, btns));
  });
  return h('div', { class: 'card stack', style: { background: 'var(--bg)' } },
    h('h3', {}, prompt.title), h('p', { class: 'muted small' }, prompt.task),
    piece.mode === 'paper' ? h('p', { class: 'chip' }, 'Written on paper: ask {him} for it') : h('div', {}, h('p', { class: 'muted small' }, `${wordCount(piece.text)} words`), h('div', { class: 'card', style: { whiteSpace: 'pre-wrap', maxHeight: '50vh', overflow: 'auto' } }, piece.text)),
    h('details', {}, h('summary', { style: { cursor: 'pointer' } }, 'What {she} was aiming for'), h('ul', {}, prompt.criteria.map((c, i) => h('li', {}, `${piece.checked.includes(i) ? '✓' : '○'} ${c}`))), h('p', { class: 'muted small' }, '✓ = {she} ticked it in {her} self-check.')),
    lines,
    h('div', { class: 'field' }, h('label', {}, 'What worked'), worked, chips(PHRASES.worked, worked)),
    h('div', { class: 'field' }, h('label', {}, 'One next step'), next, chips(PHRASES.next, next)),
    h('button', { class: 'btn-primary', onclick: () => {
      if (scores.some((s) => s == null)) return toast('Choose a level for all four lines.');
      if (!worked.value.trim()) return toast('Write one thing that worked. It is the most important part!');
      markPiece(piece, { scores, worked: worked.value, next: next.value }, app.today());
      app.save();
      toast('Feedback saved. {She}’ll see it next time {she} opens the app.');
      dashboard(app);
    } }, 'Save feedback'));
}

function levelsCard(app) {
  const { state, db } = app;
  return h('div', { class: 'card stack' }, h('h2', {}, 'Starting levels'),
    h('p', { class: 'muted' }, 'In {her} first week, each subject begins with a 10-minute check so {she} skips what {she} already knows. Run it again after a long break, or if things look too easy.'),
    SUBJECTS.map((s) => {
      const placed = state.subjects[s.id]?.placed;
      const secure = Object.entries(state.topics).filter(([id, t]) => db.topics[id]?.subject === s.id && t.assumed).length;
      return h('div', { class: 'topic-row' },
        h('div', { class: 'title' }, h('strong', {}, s.name), h('div', { class: 'muted small' }, placed ? `Checked ${formatDay(placed, { day: 'numeric', month: 'short' })}; ${secure} topic${secure === 1 ? '' : 's'} already known` : !PLACEMENT_ORDER.includes(s.id) ? 'No check: everyone starts from the beginning' : needsPlacement(state, db, s.id) ? 'Check coming up in a session soon' : 'All topics started')),
        placed ? h('button', { class: 'btn-ghost', onclick: () => { state.subjects[s.id].placed = false; if (state.plan?.day === app.today() && !state.plan.started) state.plan = null; app.save(); toast(`${s.name} will be checked again in {her} next session.`); dashboard(app); } }, 'Check again') : null);
    }));
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
  const mins = h('select', { id: 'set-mins' }, [8, 10, 12, 15, 20, 25, 30, 40].map((m) => h('option', { value: m, selected: m === st.settings.sessionMinutes }, `${m} minutes`)));
  const pin = h('input', { type: 'password', inputmode: 'numeric', maxlength: 4, placeholder: 'Leave blank to keep', id: 'set-pin' });
  const tts = h('input', { type: 'checkbox', id: 'set-tts', checked: st.settings.tts !== false, style: { width: '28px', height: '28px' } });
  const rung = h('select', { id: 'set-rung' }, (app.db.rungs || []).map((r, i) => h('option', { value: i + 1, selected: i + 1 === (st.settings.readingRung || 1) }, `${i + 1}. ${r} (e.g. ${app.db.ladder.find((b) => b.rung === i + 1)?.title})`)));
  return h('div', { class: 'card stack' }, h('h2', {}, 'Settings'),
    h('div', { class: 'field' }, h('label', { for: 'set-name' }, '{Her} first name'), name),
    h('div', { class: 'field' }, h('label', { for: 'set-comp' }, 'Companion’s name'), comp),
    h('div', { class: 'grid two' },
      h('div', { class: 'field' }, h('label', { for: 'set-bed' }, 'Bedtime (app rests 1 hour before)'), bed),
      h('div', { class: 'field' }, h('label', { for: 'set-early' }, 'Earliest start'), early)),
    h('div', { class: 'field' }, h('label', { for: 'set-mins' }, 'Daily session length'), mins),
    h('div', { class: 'field row' }, tts, h('label', { for: 'set-tts', style: { margin: 0 } }, 'Read-aloud buttons')),
    h('div', { class: 'field' }, h('label', { for: 'set-rung' }, 'Reading ladder: what {she} reads comfortably now'), rung),
    h('div', { class: 'field' }, h('label', { for: 'set-pin' }, 'New 4-digit PIN'), pin),
    h('button', { class: 'btn-primary', onclick: () => {
      if (pin.value && !/^\d{4}$/.test(pin.value)) return toast('The PIN must be 4 digits.');
      st.profile.childName = name.value.trim() || st.profile.childName;
      st.profile.companion.name = comp.value.trim() || st.profile.companion.name;
      st.settings.bedtime = bed.value || st.settings.bedtime;
      st.settings.earliest = early.value || st.settings.earliest;
      st.settings.sessionMinutes = +mins.value;
      st.settings.tts = tts.checked;
      st.settings.readingRung = +rung.value;
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
    if (!confirm(`Load this backup from ${when}${data.profile?.childName ? ` (${data.profile.childName})` : ''}? It will replace ${app.state.profile?.childName || 'this child'}’s progress on this device.`)) return;
    app.state = data;
    app.save();
    await app.useProfile(app.profileId);
    toast('Backup loaded.');
    app.go('#/home');
  } catch (e) {
    toast(e.message || 'That file could not be loaded.');
  }
}

function doReset(app) {
  const typed = prompt('Type DELETE to remove all progress on this device.');
  if (typed !== 'DELETE') return;
  removeProfile(app.profileId);
  const rest = app.profiles();
  if (rest.length) { app.useProfile(rest[0].id).then(() => app.go(rest.length > 1 ? '#/who' : '#/home')); return; }
  app.state = emptyState(app.today());
  app.profileId = 'main';
  app.go('#/welcome');
}
