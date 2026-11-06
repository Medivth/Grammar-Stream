// Home: today's session, progress at a glance, and the journey map (js/ui/journey.js).
// Subject pages show each subject as a journey of topics.

import { h, mount } from '../ui/dom.js';
import { COMPANION_FACTS, speciesOf, companionNoun, capybaraEl, slotOf } from '../ui/capybara.js';
import { companionSpot } from '../ui/alive.js';
import { talkContext, companionLines } from '../ui/companion-talk.js';
import { journeyMap, journeyStrip } from '../ui/journey.js';
import { icon, SUBJECT_ICON } from '../ui/icons.js';
import { SUBJECT_BY_ID, COURSE, isStretch } from '../core/subjects.js';
import { paperSpec } from '../gen/paper.js';
import { topicStatus, stretchReady } from '../core/mastery.js';
import { daysPractisedThisMonth, planDay, extraStatus, bonusProgress, bonusStatusLine, bonusStatus } from '../core/session.js';
import { learnedCount, subjectStats, planSummary, isKnown } from '../core/progress.js';
import { formatDay } from '../core/dates.js';
import { restTime } from './util.js';
import { pieceDue, currentPiece, nextPrompt, filledPrompt, unseenFeedback, currentBooks, readingThisWeek } from '../core/writing.js';
import { handwritingLine, emptyHandwriting } from '../core/handwriting.js';
import { questsCard } from '../ui/quests.js';
import { familyNow, familyHomeCard, notesHomeStrip, homePopups } from '../ui/family.js';


export function subjectProgress(state, db, subject) {
  const st = subjectStats(state, db, subject);
  return { total: st.total, done: st.secure + st.mastered, mastered: st.mastered, started: st.learning + st.secure + st.mastered };
}

// --- home ----------------------------------------------------------------

function todayCard(app) {
  const { state, db } = app;
  const today = app.today();
  const c = state.profile?.companion || {};
  const rest = restTime(state.settings);
  let plan = state.plan?.day === today ? state.plan : null;
  if (!plan && !rest) { state.plan = planDay(state, db, today); plan = state.plan; app.save(); }
  const finished = !!plan?.finished;
  const inProgress = plan && plan.started && !finished;
  const species = speciesOf(c, COURSE.young);
  const facts = COMPANION_FACTS[species];
  const fact = facts[today % facts.length];

  let cls = 'today', eyebrow, title, sub, tags = [], btn = null, mood = 'neutral';
  if (finished) {
    cls += ' done'; mood = 'happy';
    const days = daysPractisedThisMonth(state, today);
    const right = plan.results.filter((r) => r.correct).length;
    eyebrow = 'Today'; title = 'Finished for today!';
    sub = `${c.name || `Your ${companionNoun(species)}`} is impressed. See you tomorrow.`;
    tags = [`${days} day${days === 1 ? '' : 's'} this month`, `${right} answers right today`];
  } else if (rest) {
    cls += ' rest'; mood = 'thinking';
    eyebrow = 'Rest time'; title = 'Time to rest'; sub = rest;
  } else if (inProgress) {
    const pct = Math.round((100 * plan.pos) / Math.max(1, plan.steps.length - 1));
    eyebrow = 'Today’s session'; title = 'Pick up where you left off'; sub = `You’re ${pct}% of the way through.`;
    tags = planSummary(plan);
    btn = h('button', { class: 'btn-start', onclick: () => app.go('#/play') }, icon('play'), ' Continue');
  } else {
    eyebrow = formatDay(today); title = 'Ready when you are';
    sub = `About ${state.settings.sessionMinutes} minutes, with a ${COURSE.young ? 'wiggle' : ''} break halfway.`.replace('a  break', 'a break');
    tags = planSummary(plan);
    btn = h('button', { class: 'btn-start', onclick: () => app.go('#/play') }, icon('play'), ' Start today’s session');
  }
  return h('section', { class: cls, 'aria-label': 'Today' }, h('div', { class: 'inner' },
    companionSpot(app, { ...c, mood }, companionLines(talkContext(state, db, today, { rest }))),
    h('div', {},
      h('div', { class: 'eyebrow' }, eyebrow),
      h('h1', {}, title),
      h('p', { style: { margin: 0 } }, sub),
      tags.length ? h('div', { class: 'tags' }, tags.map((t) => h('span', {}, t))) : h('div', { style: { height: '14px' } }),
      btn,
      h('p', { class: 'small', style: { margin: btn ? '14px 0 0' : '0', opacity: 0.85 } }, h('strong', {}, `${c.name || 'Your companion'}’s fact: `), fact))));
}

/** What the bonus card says: progress, what is ready, and the prize (pure, so it can be tested). */
export function bonusCardInfo(state, db, today) {
  const bp = bonusProgress(state, db);
  if (!bp || !bp.total) return null;
  const st = bonusStatusLine(state, db, today);
  const ready = [st.due ? `${st.due} to review` : null, st.lesson ? (bp.started ? 'next lesson ready' : null) : null, st.practice ? 'a practice round ready' : null].filter(Boolean).join(' · ');
  const progress = `${bp.done} of ${bp.total} part${bp.total === 1 ? '' : 's'} finished`;
  if (bp.prized) {
    return { bp, complete: true, eyebrow: 'Bonus topic complete ✓', progress, ready, prize: `You won ${bp.def.prizeText}!`, button: st.empty ? null : 'Review it' };
  }
  return { bp, complete: false, eyebrow: 'Bonus topic', progress: bp.started ? progress : `${bp.total} parts`, ready, prize: `Finish it to win ${bp.def.prizeText}.`, button: !bp.started ? 'Start the bonus topic' : st.empty ? null : 'Carry on', waiting: st.empty ? 'More to do tomorrow, when some questions are ready to review.' : null };
}

/** The bonus topic, near the top of the page: open any time (not in the rest before bedtime). */
function bonusCard(app, rest) {
  const { state, db } = app;
  if (rest) return null;
  const info = bonusCardInfo(state, db, app.today());
  if (!info) return null;
  const { bp } = info;
  const c = state.profile?.companion || {};
  const subj = SUBJECT_BY_ID[bp.def.subject];
  const wear = { ...(c.wear || (c.accessory && c.accessory !== 'none' ? { [slotOf(c.accessory)]: c.accessory } : {})) };
  for (const id of bp.def.prize) wear[slotOf(id)] = id;
  const pct = Math.round((100 * bp.done) / bp.total);
  const go = () => app.go('#/play/bonus');
  return h('section', { class: `bonus-card${info.complete ? ' complete' : ''}`, style: { '--bonus': subj?.colour || 'var(--accent)' }, 'aria-label': `Bonus topic: ${bp.def.title}` },
    // a picture of the companion with the prize (just a preview: its lamp is not a switch here)
    h('div', { class: 'bonus-art', 'data-no-lamp': '', 'aria-hidden': 'true' }, capybaraEl({ ...c, wear, accessory: bp.def.prize.at(-1), mood: 'happy', scene: undefined, lit: true }, 'capy')),
    h('div', { class: 'bonus-txt' },
      h('div', { class: 'eyebrow' }, info.complete ? null : icon('star'), info.complete ? info.eyebrow : ` ${info.eyebrow}`),
      h('h2', {}, bp.def.title),
      info.complete ? null : h('p', { class: 'bonus-blurb' }, bp.def.blurb),
      h('div', { class: 'bonus-progress' },
        h('span', { class: 'bonus-bar', role: 'progressbar', 'aria-valuenow': pct, 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-label': info.progress }, h('i', { style: { width: `${pct}%` } })),
        h('span', {}, info.progress)),
      h('p', { class: 'bonus-prize' }, icon('trophy'), h('span', {}, info.prize)),
      info.ready && info.button ? h('p', { class: 'bonus-ready' }, info.ready) : null,
      info.button ? h('button', { class: 'btn-bonus', type: 'button', onclick: go }, icon('play'), ` ${info.button}`)
        : h('p', { class: 'bonus-ready' }, info.complete ? 'All reviewed for now. Its questions come back in your daily sessions.' : info.waiting)));
}

function statStrip(app) {
  const { state, db } = app;
  const topics = Object.values(state.topics).filter((t) => t.state === 'proficient' || t.state === 'mastered').length;
  const books = (state.books || []).filter((b) => b.endDay).length;
  const tile = (n, label, colour) => h('button', { class: 'stat-tile', style: { '--tile': colour }, onclick: () => app.go('#/progress') }, h('b', {}, String(n)), h('span', {}, label));
  void db;
  return h('div', { class: 'stat-strip' },
    tile(learnedCount(state), 'things you know', 'var(--accent)'),
    tile(topics, 'topics secure', 'var(--good)'),
    tile(books, books === 1 ? 'book finished' : 'books finished', 'var(--warm)'));
}

function homeCards(app, rest) {
  const { state, db } = app;
  const today = app.today();
  const cards = [];
  const card = (ico, tint, title, text, go, isNew) => h('button', { class: 'choice-card home-card', style: { '--tint': `color-mix(in srgb, ${tint} 14%, var(--card))`, '--tint-ink': tint }, onclick: () => app.go(go) },
    h('span', { class: 'ico' }, icon(ico)), h('span', { class: 'txt' }, h('h3', {}, title, isNew ? h('span', { class: 'badge-new' }, 'NEW') : null), h('p', {}, text)));
  for (const p of unseenFeedback(state)) cards.push(card('star', '#11855a', 'Feedback on your writing', filledPrompt(db.pieceById[p.promptId], state)?.title || '', `#/feedback/${encodeURIComponent(p.id)}`, true));
  // Year 2 and 3 tasks wait until he has read the text they build on
  if (COURSE.writing && !rest && pieceDue(state, today) && (currentPiece(state) || nextPrompt(state, db))) {
    const cur = currentPiece(state);
    cards.push(card('pen', (SUBJECT_BY_ID.english || SUBJECT_BY_ID.reading).colour, cur ? 'Carry on writing' : 'Weekly writing', cur ? filledPrompt(db.pieceById[cur.promptId], state)?.title : COURSE.young ? 'A story, letter, fact file or poem' : 'A longer piece, about 30 minutes', '#/writing'));
  }
  const book = currentBooks(state)[0];
  cards.push(card('book', '#c84a14', book ? book.title : 'Choose a book', `${readingThisWeek(state, today)} minutes read this week`, '#/reading'));
  cards.push(card('chart', '#5143d9', 'My progress', 'Timeline, places and badges', '#/progress'));
  const best = Math.max(0, ...(state.papers || []).map((p) => p.score));
  const spec = paperSpec();
  const TOOLS = {
    paper: () => card('paper', SUBJECT_BY_ID.maths.colour, COURSE.young ? 'Maths test' : 'Arithmetic paper', best ? `${spec.questions} questions in ${spec.minutes} minutes · best ${best}/${spec.marks}` : `${spec.questions} questions in ${spec.minutes} minutes, like the real test`, '#/paper'),
    typing: () => card('keyboard', '#5143d9', 'Touch typing', state.typing?.best ? `best ${state.typing.best.wpm} words a minute` : 'Ten lessons, then race the river', '#/typing'),
    handwriting: () => card('joins', '#0f9a6e', 'Handwriting joins', handwritingLine(state.handwriting || emptyHandwriting()), '#/handwriting'),
    speed: () => card('eye', '#d63d74', 'Speed reading', (state.speed || []).length ? `last read at ${state.speed.at(-1).wpm} words a minute` : 'Read faster without losing the thread', '#/speed'),
  };
  // Latin or Greek any time, as often as she likes, whether or not today's session is done
  const extras = (COURSE.extra || []).map((sub) => {
    const s = SUBJECT_BY_ID[sub], st = extraStatus(state, db, today, sub);
    const text = rest ? 'Resting before bedtime' : st.due || st.fresh ? `${[st.due ? `${st.due} to review` : null, st.fresh ? 'a new topic ready' : null].filter(Boolean).join(' · ')}. Any time you like.` : 'All caught up for now';
    return card(SUBJECT_ICON[sub], s.colour, `${s.name} practice`, text, rest ? '#/home' : `#/play/${sub}`);
  });
  const tools = [...extras, ...COURSE.tools.map((t) => TOOLS[t]())];
  return h('div', {}, h('div', { class: 'home-cards' }, cards), h('div', { class: 'section-title' }, h('h2', {}, 'Practice tools')), h('div', { class: 'home-cards' }, tools));
}

export function homeScreen(app) {
  const { state } = app;
  const rest = restTime(state.settings);
  let fam = null; // the family goal reads every child's save: a damaged one must not stop home drawing
  try { fam = familyNow(app); } catch (e) { console.warn('family goal', e); }
  mount(app.root,
    h('div', { class: 'topbar' },
      h('div', {}, h('div', { class: 'eyebrow' }, 'Grammar Stream'), h('h1', {}, `Hi ${state.profile?.childName || 'there'}!`)),
      h('span', { class: 'spacer' }),
      app.profiles().length > 1 ? h('button', { class: 'btn-icon', 'aria-label': 'Switch child', title: 'Switch child', onclick: () => app.go('#/who') }, icon('swap')) : null,
      h('button', { class: 'btn-icon', 'aria-label': 'My progress', title: 'My progress', onclick: () => app.go('#/progress') }, icon('chart')),
      h('button', { class: 'btn-icon', 'aria-label': 'How it looks', title: 'How it looks', onclick: () => app.go('#/display') }, icon('text')),
      h('button', { class: 'btn-icon', 'aria-label': 'Grown-ups', title: 'Grown-ups', onclick: () => app.go('#/parent') }, icon('lock'))),
    todayCard(app),
    questsCard(app, rest),
    bonusCard(app, rest),
    notesHomeStrip(app),
    statStrip(app),
    fam ? familyHomeCard(app, fam) : null,
    homeCards(app, rest),
    h('div', { class: 'section-title' }, h('h2', {}, 'Your journey'), h('span', { class: 'muted small' }, 'Tap a place to explore')),
    journeyMap(app),
    h('p', { class: 'muted small center', style: { marginTop: '12px' } }, 'Stones light up as you learn: coloured for secure, gold for mastered.'));
  homePopups(app, fam);
}

// --- subject journey ------------------------------------------------------

export function subjectScreen(app, subjectId, focusId = null) {
  const { state, db } = app;
  const subj = SUBJECT_BY_ID[subjectId];
  if (!subj) return app.go('#/home');
  const ids = db.topicOrder[subjectId] || [];
  const st = subjectStats(state, db, subjectId);
  const pct = st.total ? Math.round((100 * (st.secure + st.mastered)) / st.total) : 0;
  const LABEL = { locked: 'Locked', available: 'Up next', learning: 'Learning', proficient: 'Secure', mastered: 'Mastered' };
  const ICON = { locked: 'lock', available: 'spark', learning: 'play', proficient: 'check', mastered: 'star' };
  const rows = ids.map((id) => {
    const t = db.topics[id];
    // a bonus part is open any time (from the bonus card); only the parts before it set its order
    const status = t.bonus ? bonusStatus(state, db, id) : topicStatus(t, state.topics, db);
    const items = (db.itemsByTopic[id] || []).filter((i) => !['template', 'written'].includes(db.items[i].kind));
    const known = items.filter((i) => isKnown(state.cards[i])).length;
    return h('li', { 'data-topic': id },
      h('span', { class: `node ${status}` }, icon(ICON[status])),
      h('div', { class: `jcard${status === 'locked' ? ' locked' : ''}` },
        h('h3', {}, t.title),
        h('div', { class: 'meta' },
          h('span', { class: `chip ${status}` }, LABEL[status]),
          t.links ? h('span', { class: 'chip uses' }, icon('link'), ` uses ${t.links.map((l) => SUBJECT_BY_ID[l].name).join(' & ')}`) : null,
          isStretch(t) ? h('span', { class: 'chip stretch' }, icon('spark'), ' stretch') : null,
          t.bonus ? h('span', { class: 'chip stretch' }, icon('star'), ' bonus') : null,
          status === 'locked' && t.bonus ? h('span', {}, `after ${t.prereqs.filter((p) => db.topics[p]?.bonus === t.bonus).map((p) => db.topics[p]?.title).join(' and ')}`)
            : status === 'locked' && isStretch(t) && !stretchReady(db, state.topics, subjectId) ? h('span', {}, `when most of ${subj.name} is secure`)
            : status === 'locked' ? h('span', {}, `after ${t.prereqs.map((p) => db.topics[p]?.title).join(' and ')}`)
            : items.length ? [h('span', { class: 'mini-bar', 'aria-hidden': 'true' }, h('i', { style: { width: `${Math.round((100 * known) / items.length)}%` } })), h('span', {}, `${known} / ${items.length} known`)]
              : h('span', {}, 'a skill you practise'))));
  });
  const extra = subjectId === 'history' ? h('button', { class: 'btn-ghost', onclick: () => app.go('#/progress/timeline') }, icon('clock'), ' Open my timeline')
    : subjectId === 'geography' ? h('button', { class: 'btn-ghost', onclick: () => app.go('#/progress/places') }, icon('globe'), ' Places I know')
    : subjectId === 'maths' ? h('button', { class: 'btn-ghost', onclick: () => app.go('#/paper') }, icon('paper'), COURSE.young ? ' Maths test' : ' Arithmetic paper')
    : subjectId === 'science' && COURSE.young ? h('button', { class: 'btn-ghost', onclick: () => app.go('#/progress/places') }, icon('globe'), ' Places I know') : null;
  mount(app.root,
    h('div', { class: 'topbar' }, h('button', { class: 'btn-icon', 'aria-label': 'Back', onclick: () => app.go('#/home') }, icon('back')), h('span', { class: 'spacer' }), extra),
    h('div', { class: 'narrow', style: { '--subj': subj.colour } },
      h('div', { class: 'banner' },
        h('div', { class: 'ring', style: { '--p': pct } }, h('span', {}, `${pct}%`)),
        h('div', {}, h('div', { class: 'eyebrow', style: { color: 'rgba(255,255,255,.8)' } }, subj.region), h('h1', {}, subj.name),
          h('p', {}, `${st.secure + st.mastered} of ${st.total} topics secure · ${st.mastered} mastered · ${st.known} things known`))),
      journeyStrip(app, subj, (id) => focusTopic(app.root, id)),
      h('p', { class: 'muted small' }, 'Topics become “mastered” when you still know them in mixed reviews days later.'),
      h('ol', { class: 'journey' }, rows)));
  if (focusId) focusTopic(app.root, focusId, 'auto');
}

/** Scroll a subject page to one topic and light it up briefly (from a tapped stone on a journey map). */
function focusTopic(root, id, behavior = 'smooth') {
  const li = [...root.querySelectorAll('.journey li[data-topic]')].find((x) => x.dataset.topic === id);
  if (!li) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'reduce';
  li.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : behavior });
  li.classList.remove('jr-focus');
  void li.offsetWidth; // restart the highlight if the same stone is tapped twice
  li.classList.add('jr-focus');
}
