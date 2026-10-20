// The daily session player: walks through the plan one step at a time.

import { h, rich, richHTML, mount, plain } from '../ui/dom.js';
import { renderQuestion } from '../ui/qtypes.js';
import { capybaraEl } from '../ui/capybara.js';
import { mapSVG, loadMap } from '../ui/mapview.js';
import { speak } from '../platform/tts.js';
import { planDay, chooseTopic, topicChoices, questionFor, submit, startSession, finishSession, daysPractisedThisMonth, CONF } from '../core/session.js';
import { startPlacement, nextProbe, probeQuestion, answerProbe, applyPlacement } from '../core/placement.js';
import { checkSentence } from '../core/checkers.js';
import { learnText, present } from '../core/present.js';
import { makeRng } from '../core/rng.js';
import { currentBooks, logReading } from '../core/writing.js';
import { SUBJECT_BY_ID } from '../core/subjects.js';

const GRADED = new Set(['review', 'quiz', 'diag', 'practice', 'faded']);

export async function playScreen(app) {
  const { state, db } = app;
  const today = app.today();
  if (!state.plan || state.plan.day !== today) {
    state.plan = planDay(state, db, today);
  }
  if (state.plan.finished) return app.go('#/home');
  startSession(state, today);
  app.save();
  await renderStep(app);
}

function header(app, label) {
  const plan = app.state.plan;
  const pct = Math.round((100 * plan.pos) / Math.max(1, plan.steps.length - 1));
  return h('div', { class: 'topbar q-wrap' },
    h('button', { class: 'btn-icon', type: 'button', 'aria-label': 'Pause and go home', onclick: () => app.go('#/home') }, '⏸'),
    h('div', { class: 'progress', role: 'progressbar', 'aria-valuenow': pct, 'aria-valuemin': 0, 'aria-valuemax': 100 }, h('div', { style: { width: `${pct}%` } })),
    label ? h('span', { class: 'chip' }, label) : null);
}

async function next(app) {
  app.state.plan.pos += 1;
  app.save();
  await renderStep(app);
}

async function renderStep(app) {
  const plan = app.state.plan;
  const step = plan.steps[plan.pos];
  const root = app.root;
  if (!step) return app.go('#/home');
  try {
    switch (step.t) {
      case 'yesterday': return yesterdayStep(app, root);
      case 'break': return breakStep(app, root);
      case 'choose': return chooseStep(app, root, step);
      case 'placement': return placementStep(app, root, step);
      case 'intro-topic': return introTopicStep(app, root, step);
      case 'diag-summary': return diagSummaryStep(app, root, step);
      case 'intro': return introStep(app, root, step);
      case 'worked': return workedStep(app, root, step);
      case 'sentence': return sentenceStep(app, root, step);
      case 'ritual': return ritualStep(app, root);
      case 'done': return doneStep(app, root);
      default:
        if (GRADED.has(step.t)) return questionStep(app, root, step);
        return next(app);
    }
  } catch (e) {
    console.error(e);
    mount(root, h('div', { class: 'q-wrap card' }, h('h2', {}, 'Something went wrong with this question.'), h('p', { class: 'muted' }, String(e.message || e)),
      h('button', { class: 'btn-primary', onclick: () => next(app) }, 'Skip it')));
  }
}

// ---------------------------------------------------------------- yesterday
function yesterdayStep(app, root) {
  const entries = app.state.plan.yesterday || [];
  const wrong = entries.filter((e) => !e.correct);
  mount(root, header(app, 'Yesterday'), h('div', { class: 'q-wrap stack' },
    h('h2', {}, 'Yesterday’s answers'),
    h('p', { class: 'muted' }, wrong.length ? 'A quick look back. Seeing the right answer a day later helps it stick.' : 'You got these right yesterday. A quick look helps them stick.'),
    entries.map((e) => h('div', { class: 'card' },
      rich('p', e.prompt, { style: { fontWeight: 700 } }),
      !e.correct && e.given ? h('p', {}, 'You said: ', rich('span', e.given)) : null,
      h('p', {}, e.correct ? '✓ ' : 'Answer: ', rich('strong', e.answer)),
      e.explain && !e.correct ? rich('p', e.explain, { class: 'muted small' }) : null)),
    h('button', { class: 'btn-primary btn-big', onclick: () => next(app), autofocus: true }, 'On we go')));
}

// ---------------------------------------------------------------- break
function breakStep(app, root) {
  const c = app.state.profile?.companion || {};
  mount(root, h('div', { class: 'q-wrap stack center' },
    capybaraEl({ ...c, mood: 'happy' }, 'capy bob'),
    h('h2', {}, 'Brain break!'),
    h('p', {}, `You’ve done the first block. Stand up, stretch, get a drink of water. ${c.name || 'Your capybara'} is having a snack.`),
    h('div', { class: 'row', style: { justifyContent: 'center' } },
      h('button', { class: 'btn-primary btn-big', onclick: () => next(app) }, 'Keep going'),
      h('button', { class: 'btn-ghost btn-big', onclick: () => { app.state.plan.pos += 1; app.save(); app.go('#/home'); } }, 'Finish later today'))));
}

// ---------------------------------------------------------------- choose
function chooseStep(app, root, step) {
  const { db, state } = app;
  // worked out now, not when the day was planned, so placement results count
  const opts = topicChoices(state, db, step.subject);
  if (!opts.length) return next(app);
  const subj = SUBJECT_BY_ID[step.subject];
  mount(root, header(app, 'Choose'), h('div', { class: 'q-wrap stack' },
    h('h2', {}, `Something new in ${subj.name}`),
    h('p', { class: 'muted' }, 'Pick what you’d like to learn next.'),
    opts.map((id) => {
      const t = db.topics[id];
      const started = !!state.topics[id];
      return h('button', { class: 'choice-card', type: 'button', onclick: async () => { chooseTopic(state, db, id, app.today()); await next(app); } },
        h('div', { class: 'subj', style: { color: subj.colour } }, started ? `Continue · ${subj.name}` : `New · ${subj.name}`),
        h('h3', { style: { margin: '4px 0 0' } }, t.title));
    })));
}

function introTopicStep(app, root, step) {
  const t = app.db.topics[step.topic];
  const subj = SUBJECT_BY_ID[t.subject];
  mount(root, header(app, subj.name), h('div', { class: 'q-wrap stack' },
    h('div', { class: 'chip', style: { color: subj.colour } }, subj.name),
    h('h2', {}, t.title),
    t.intro ? rich('p', t.intro, { class: 'learn' }) : null,
    t.diagnostic?.length ? h('p', { class: 'muted' }, 'First, a few questions to see what you think already. Just answer honestly: it’s fine not to know yet.') : null,
    h('button', { class: 'btn-primary btn-big', onclick: () => next(app), autofocus: true }, 'Let’s go')));
}

function diagSummaryStep(app, root, step) {
  mount(root, header(app), h('div', { class: 'q-wrap stack' },
    h('h2', {}, 'Thanks!'),
    h('p', { class: 'learn' }, 'Those answers show what you think right now. Lots of people believe some of the wrong ideas, even adults. Now let’s learn the science properly.'),
    h('button', { class: 'btn-primary btn-big', onclick: () => next(app), autofocus: true }, 'Carry on')));
}

// ---------------------------------------------------------------- learn card
async function introStep(app, root, step) {
  const item = app.db.items[step.id];
  const subj = SUBJECT_BY_ID[item.subject];
  const parts = [h('p', { class: 'muted small' }, 'Learn this')];
  if (item.kind === 'spell') {
    parts.push(h('div', { class: 'big-word' }, item.word));
    parts.push(h('p', { class: 'center muted' }, item.clue));
    parts.push(rich('p', item.explain, { class: 'learn center' }));
    if (app.state.settings.tts !== false) parts.push(h('div', { class: 'center' }, h('button', { class: 'btn-ghost', onclick: () => speak(item.word) }, '🔊 Hear it')));
    parts.push(h('p', { class: 'muted small center' }, 'Look at it, say it, then cover it in your head and picture the letters.'));
  } else if (item.kind === 'mapfact') {
    const map = await loadMap(item.map);
    parts.push(mapSVG(map, { layer: item.layer, highlight: item.feature, markerType: item.group === 'peak' ? 'peak' : item.group === 'capital' ? 'capital' : undefined }).el);
    parts.push(h('div', { class: 'big-word' }, item.answer));
    parts.push(rich('p', item.explain, { class: 'learn' }));
  } else {
    if (item.map) {
      const map = await loadMap(item.map);
      parts.push(mapSVG(map, { layer: item.map === 'europe' ? 'countries' : 'features', highlight: item.feature }).el);
    }
    parts.push(rich('div', learnText(item), { class: 'learn' }));
    if (item.explain && !item.learn) parts.push(rich('p', item.explain, { class: 'muted' }));
  }
  mount(root, header(app, subj.name), h('div', { class: 'q-wrap stack card pop' }, parts,
    h('button', { class: 'btn-primary btn-big', onclick: () => next(app), autofocus: true }, 'Got it')));
}

// ---------------------------------------------------------------- worked example
function workedStep(app, root, step) {
  const q = questionFor(app.state, app.db, step, app.state.plan.pos);
  const steps = q.steps || [];
  let shown = 1;
  const list = h('ol', { class: 'steps' });
  const btn = h('button', { class: 'btn-primary btn-big' });
  const draw = () => {
    list.replaceChildren(...steps.slice(0, shown).map((t) => rich('li', t)));
    btn.textContent = shown < steps.length ? 'Next step' : 'I see how it works';
  };
  btn.onclick = () => { if (shown < steps.length) { shown++; draw(); } else next(app); };
  draw();
  mount(root, header(app, 'Worked example'), h('div', { class: 'q-wrap stack' },
    h('p', { class: 'muted' }, 'Watch how I solve this one. Read each step.'),
    rich('div', q.prompt, { class: 'q-prompt' }),
    list, btn));
  btn.focus();
}

// ---------------------------------------------------------------- question
async function questionStep(app, root, step) {
  const { state, db } = app;
  const plan = state.plan;
  const q = questionFor(state, db, step, plan.pos);
  const subj = SUBJECT_BY_ID[q.subject];
  const label = step.t === 'diag' ? 'What do you think?' : step.t === 'quiz' ? 'Quick check' : step.reask ? 'Second try' : step.t === 'faded' ? 'Your turn' : step.t === 'practice' ? 'Practice' : subj.name;
  const t0 = performance.now();

  const confBtns = [];
  const view = await renderQuestion(q, { onChange: (ok) => confBtns.forEach((b) => (b.disabled = !ok)), settings: state.settings });

  let fadedBox = null;
  if (step.t === 'faded' && q.steps) {
    fadedBox = h('div', {}, h('p', { class: 'muted' }, 'Here is most of the working. Finish it off.'),
      h('ol', { class: 'steps' }, q.steps.slice(0, -1).map((t) => rich('li', t)), h('li', { class: 'blank' }, 'Your answer…')));
  }

  const feedback = h('div', { 'aria-live': 'polite' });
  const conf = h('div', { class: 'confidence' },
    h('p', {}, 'How sure are you?'),
    h('div', { class: 'row' },
      [['guess', 'Guessing'], ['think', 'Think so'], ['sure', 'Sure']].map(([k, text], i) => {
        const b = h('button', { class: i === 2 ? 'btn-primary' : '', type: 'button', disabled: !view.hasResponse(), onclick: () => answer(CONF[k]) }, text);
        confBtns.push(b);
        return b;
      })));

  let answered = false;
  const answer = (c) => {
    if (answered || !view.hasResponse()) return;
    answered = true;
    const ms = Math.round(performance.now() - t0);
    const res = submit(state, db, step, q, view.getResponse(), { ms, conf: c, today: app.today() });
    app.save();
    view.showResult(res);
    conf.remove();
    feedback.replaceChildren(feedbackPanel(q, res, step, c));
    const nb = h('button', { class: 'btn-primary btn-big', style: { marginTop: '16px' }, onclick: () => next(app) }, 'Next');
    feedback.append(nb);
    nb.focus();
  };

  const onKey = (e) => {
    if (!document.body.contains(conf) && e.key === 'Enter' && answered) return;
    if (!answered && view.hasResponse() && ['1', '2', '3'].includes(e.key) && document.activeElement?.tagName !== 'INPUT') answer(+e.key - 1);
  };
  document.onkeydown = onKey;
  if (view.input) view.input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && view.hasResponse()) { e.preventDefault(); confBtns[1].focus(); } });

  mount(root, header(app, label), h('div', { class: 'q-wrap' }, fadedBox, view.el, conf, feedback));
  view.focus();
}

function praise(q, res, step, conf) {
  if (step.reask) return 'You fixed it on the second try. That is exactly how memories get stronger.';
  if (q.level === 3) return 'You cracked a stretch question.';
  if (q.kind === 'map' && q.mode === 'locate') return 'You found it on the map.';
  if (q.kind === 'typed' && !q.numeric && q.fmt !== 'template') return q.cue ? 'You remembered it with just the first letter.' : 'You recalled that from memory, with no options to help.';
  if (q.kind === 'typed' && q.numeric) return 'You worked that out carefully.';
  if (conf === CONF.sure) return 'You were sure, and you were right.';
  if (conf === CONF.guess) return 'A good guess. Read why it’s right so next time you’ll know.';
  return 'You thought it through.';
}

function feedbackPanel(q, res, step, conf) {
  const answerText = describe(q);
  if (res.correct) {
    return h('div', { class: 'feedback good pop' },
      h('h3', {}, '✓ Yes!'),
      h('p', {}, praise(q, res, step, conf)),
      res.near ? h('p', {}, res.message) : null,
      res.message && !res.near && q.weighted ? rich('p', res.message) : null,
      (step.t === 'diag' || step.t === 'quiz' || conf === CONF.guess || q.weighted) && q.explain ? rich('p', q.explain, { class: 'muted' }) : null);
  }
  const parts = [h('h3', {}, step.t === 'diag' ? 'Interesting! Here’s the science' : 'Not quite')];
  if (res.score > 0 && res.score < 1 && !q.weighted && q.kind !== 'choice') parts.push(h('p', {}, 'Part of that was right.'));
  if (res.message) parts.push(rich('p', res.message));
  parts.push(h('p', {}, 'The answer: ', h('span', { class: 'answer', html: richHTML(answerText) })));
  if (res.hyper) {
    parts.push(h('div', { class: 'deep' }, h('p', {}, h('strong', {}, 'You were sure about this one, so it’s worth a closer look.')), q.explain ? rich('p', q.explain) : null,
      q.steps ? h('ol', { class: 'steps' }, q.steps.map((t) => rich('li', t))) : null));
  } else {
    if (q.explain) parts.push(rich('p', q.explain, { class: 'muted' }));
    if (q.steps && (step.t === 'practice' || step.t === 'faded')) parts.push(h('ol', { class: 'steps' }, q.steps.map((t) => rich('li', t))));
  }
  parts.push(h('p', { class: 'small muted' }, step.t === 'diag' ? 'Now you know!' : step.reask ? 'This one will come back tomorrow.' : 'You’ll see this again in a few minutes.'));
  return h('div', { class: 'feedback warn pop' }, parts);
}

function describe(q) {
  if (q.kind === 'choice') {
    if (q.weighted) {
      const best = Math.max(...q.options.map((o) => o.weight ?? 0));
      return q.options.filter((o) => o.weight === best).map((o) => o.text).join(' OR ');
    }
    return q.options.find((o) => o.correct)?.text ?? '';
  }
  if (q.kind === 'typed') return q.numeric ? `${q.prefix ? q.prefix + ' ' : ''}${q.unitBefore ? q.unit : ''}${q.numeric.value}${q.unit && !q.unitBefore ? q.unit : ''}` : q.answer;
  if (q.kind === 'order') return q.items.join(' → ');
  if (q.kind === 'map') return q.answer;
  if (q.kind === 'numberline') return `${q.targetLabel} (shown in green)`;
  if (q.kind === 'cloze') return q.blanks.map((b) => b.answer).join(', ');
  return '';
}

// ---------------------------------------------------------------- sentence task
function sentenceStep(app, root, step) {
  const { db, state } = app;
  if (!step.picked) {
    const opts = step.options.map((id) => db.sentenceById[id]).filter(Boolean);
    if (!opts.length) return next(app);
    mount(root, header(app, 'Writing'), h('div', { class: 'q-wrap stack' },
      h('h2', {}, 'Sentence workshop'),
      h('p', { class: 'muted' }, 'Choose a sentence challenge.'),
      opts.map((s) => h('button', { class: 'choice-card', type: 'button', onclick: () => { step.picked = s.id; app.save(); sentenceStep(app, root, step); } }, h('h3', { style: { margin: 0 } }, s.title)))));
    return;
  }
  const task = db.sentenceById[step.picked];
  let tries = 0;
  const ta = h('textarea', { 'aria-label': 'Your sentence', placeholder: 'Write your sentence here…', spellcheck: 'true' });
  const out = h('div', { 'aria-live': 'polite' });
  const checkBtn = h('button', { class: 'btn-primary btn-big', type: 'button' }, 'Check my sentence');
  const finish = (ok) => {
    state.writing.push({ day: app.today(), taskId: task.id, text: ta.value.trim(), ok, tries });
    app.save();
    ta.disabled = true;
    checkBtn.remove();
    out.append(h('div', { class: 'card', style: { marginTop: '12px' } }, h('p', { class: 'muted small' }, 'One good answer'), rich('p', task.model, { class: 'learn' }), task.tip ? rich('p', `Tip: ${task.tip}`, { class: 'muted' }) : null),
      h('button', { class: 'btn-primary btn-big', style: { marginTop: '16px' }, onclick: () => next(app) }, 'Next'));
  };
  checkBtn.onclick = () => {
    const text = ta.value.trim();
    if (!text) return;
    tries++;
    const r = checkSentence(task, text);
    if (r.correct) {
      out.replaceChildren(h('div', { class: 'feedback good pop' }, h('h3', {}, '✓ That works!'), h('p', {}, 'Your sentence does everything the challenge asked.')));
      return finish(true);
    }
    out.replaceChildren(h('div', { class: 'feedback warn pop' }, h('h3', {}, tries === 1 ? 'Nearly. Check these:' : 'Still a couple of things:'), h('ul', {}, r.failed.map((f) => h('li', {}, f)))));
    if (tries >= 2) finish(false);
    else checkBtn.textContent = 'Check again';
  };
  mount(root, header(app, 'Writing'), h('div', { class: 'q-wrap stack' },
    h('h2', {}, task.title), rich('p', task.prompt, { class: 'q-prompt' }), ta, checkBtn, out));
  ta.focus();
}

// ---------------------------------------------------------------- companion ritual
function ritualStep(app, root) {
  const { state, db } = app;
  const plan = state.plan;
  const c = state.profile?.companion || { name: 'Capy' };
  const topicId = plan.topics?.[0] || plan.results.map((r) => db.items[r.id]?.topic).find((t) => db.topics[t]?.teach);
  const topic = db.topics[topicId];
  const ta = h('textarea', { placeholder: `Type it for ${c.name}, or say it out loud`, 'aria-label': `Explain to ${c.name}` });
  const teach = () => {
    if (ta.value.trim()) state.taught.push({ day: app.today(), topicId, text: ta.value.trim() });
    app.save();
    mistakeStage();
  };
  if (!topic) return mistakeStage();
  mount(root, h('div', { class: 'q-wrap stack' },
    h('div', { class: 'hero' }, capybaraEl({ ...c, mood: 'thinking' }, 'capy bob'),
      h('div', { class: 'speech' }, h('p', { style: { margin: 0 } }, `I want to learn too! Can you teach me?`), h('p', { style: { margin: '8px 0 0', fontWeight: 700 } }, topic.teach))),
    ta,
    h('button', { class: 'btn-primary btn-big', onclick: teach }, `I explained it to ${c.name}`)));

  function mistakeStage() {
    const rng = makeRng(`mistake:${plan.day}`);
    const pool = plan.results.filter((r) => r.correct && ['fact', 'mapfact'].includes(db.items[r.id]?.kind));
    if (!pool.length) return next(app);
    const item = db.items[rng.pick(pool).id];
    const q = present(item, state.cards[item.id], { db, state, rng, format: item.kind === 'mapfact' ? 'choose' : 'choice' });
    const wrongs = q.options.filter((o) => !o.correct);
    if (!wrongs.length) return next(app);
    const claim = wrongs[0].text;
    const asked = item.kind === 'mapfact' ? `What is this place called? (${item.answer} is highlighted on your map.)` : plain(item.prompt);
    const options = rng.shuffle([
      { text: `No, it’s ${item.answer}`, ok: true },
      { text: `Yes, ${c.name} is right`, ok: false },
      ...(wrongs[1] ? [{ text: `No, it’s ${wrongs[1].text}`, ok: false }] : []),
    ]);
    const out = h('div', { 'aria-live': 'polite' });
    const btns = options.map((o) => h('button', { class: 'option', type: 'button', html: richHTML(o.text), onclick: () => {
      btns.forEach((b) => (b.disabled = true));
      out.replaceChildren(h('div', { class: `feedback ${o.ok ? 'good' : 'warn'} pop` },
        h('p', {}, o.ok ? `Thanks for correcting me! I’ll remember: ${item.answer}.` : `Hmm, I don’t think so. It’s actually ${item.answer}. We both learned something!`)),
        h('button', { class: 'btn-primary btn-big', style: { marginTop: '16px' }, onclick: () => next(app) }, 'Finish'));
    } }));
    mount(root, h('div', { class: 'q-wrap stack' },
      h('div', { class: 'hero' }, capybaraEl({ ...c, mood: 'oops' }, 'capy'),
        h('div', { class: 'speech' }, h('p', { style: { margin: 0 } }, `Someone asked me: “${asked}”`), h('p', { style: { margin: '8px 0 0' } }, h('span', {}, 'I said: '), h('strong', { html: richHTML(claim) })), h('p', { style: { margin: '8px 0 0' } }, 'Was I right?'))),
      h('div', { class: 'options' }, btns), out));
  }
}

// ---------------------------------------------------------------- done
function doneStep(app, root) {
  const { state, db } = app;
  const plan = state.plan;
  if (!plan.finished) {
    finishSession(state);
    plan.finished = true;
    app.save();
  }
  const c = state.profile?.companion || {};
  const res = plan.results;
  const remembered = res.filter((r) => r.t === 'review' && r.correct).length;
  const sure = res.filter((r) => r.conf === CONF.sure);
  const sureRight = sure.filter((r) => r.correct).length;
  const learned = (plan.topics || []).map((t) => db.topics[t]?.title).filter(Boolean);
  const days = daysPractisedThisMonth(state, app.today());
  const readBox = h('div', {});
  const book = currentBooks(state)[0] || null;
  const logRead = (mins) => {
    logReading(state, mins, app.today(), book);
    app.save();
    readBox.replaceChildren(h('p', {}, `📚 ${mins} minutes of reading logged. Brilliant.`));
  };
  const alreadyRead = state.reading.some((r) => r.day === app.today());
  readBox.append(alreadyRead ? h('p', {}, '📚 Reading logged for today.') : h('div', {}, h('p', { style: { fontWeight: 700 } }, book ? `Did you read ${book.title} today?` : 'Did you read a book today?'),
    h('div', { class: 'row' }, [10, 20, 30, 45].map((m) => h('button', { class: 'btn-ghost', onclick: () => logRead(m) }, `${m}${m === 45 ? '+' : ''} min`)), h('button', { class: 'btn-ghost', onclick: () => readBox.replaceChildren(h('p', { class: 'muted' }, 'Maybe tonight, then!')) }, 'Not yet'))));

  mount(root, h('div', { class: 'q-wrap stack' },
    h('div', { class: 'hero' }, capybaraEl({ ...c, mood: 'happy' }, 'capy bob'),
      h('div', {}, h('h1', {}, 'Finished for today!'), h('p', { class: 'record' }, h('b', {}, String(days)), ` day${days === 1 ? '' : 's'} practised this month`))),
    h('div', { class: 'card stack' },
      h('h3', {}, 'What you did'),
      h('ul', {},
        remembered ? h('li', {}, `You remembered ${remembered} thing${remembered === 1 ? '' : 's'} from earlier days.`) : null,
        learned.length ? h('li', {}, `You started: ${learned.join(', ')}.`) : null,
        state.writing.some((w) => w.day === app.today()) ? h('li', {}, 'You wrote a sentence in the workshop.') : null,
        state.taught.some((t) => t.day === app.today()) ? h('li', {}, `You taught ${c.name || 'your capybara'} something new.`) : null,
        h('li', {}, `You answered ${res.length} questions.`)),
      sure.length ? h('p', { class: 'muted' }, `When you said “Sure”, you were right ${sureRight} out of ${sure.length} times.${sure.length >= 4 && sureRight / sure.length > 0.9 ? ' You know what you know!' : ''}`) : null),
    h('div', { class: 'card' }, readBox),
    h('button', { class: 'btn-primary btn-big', onclick: () => app.go('#/home') }, 'Back home')));
}

// ---------------------------------------------------------------- placement
async function placementStep(app, root, step) {
  const { state, db } = app;
  const subj = SUBJECT_BY_ID[step.subject];
  if (!step.probe) {
    step.probe = startPlacement(state, db, step.subject);
    app.save();
    mount(root, header(app, 'Finding your level'), h('div', { class: 'q-wrap stack' },
      h('h2', {}, `Let’s find your level in ${subj.name}`),
      h('p', { class: 'learn' }, 'I’ll ask some questions that get harder as you go, so I can skip what you already know.'),
      h('p', {}, 'Some will be things you haven’t learned yet. That’s the point! Just tap “I haven’t learned this yet” and we’ll move on.'),
      h('p', { class: 'muted' }, 'There are no marks for this part, and it takes about 10 minutes.'),
      h('button', { class: 'btn-primary btn-big', onclick: () => placementStep(app, root, step), autofocus: true }, 'Start')));
    return;
  }
  const probe = step.probe;
  const p = nextProbe(probe, state, db);
  app.save();
  if (!p) {
    const summary = applyPlacement(probe, state, db, app.today());
    app.save();
    const known = summary.passed.map((t) => db.topics[t].title);
    const nextUp = topicChoices(state, db, step.subject).map((t) => db.topics[t].title);
    mount(root, header(app, 'Finding your level'), h('div', { class: 'q-wrap stack' },
      h('h2', {}, 'Thank you!'),
      known.length ? h('div', { class: 'card' }, h('p', {}, h('strong', {}, `You already know ${known.length} topic${known.length === 1 ? '' : 's'}:`)), h('ul', {}, known.map((k) => h('li', {}, k))),
        h('p', { class: 'muted small' }, 'We’ll check these now and then in your reviews, so they stay strong.'))
        : h('p', { class: 'learn' }, `Now I know where to start. Everything in ${subj.name} will be new and interesting!`),
      nextUp.length ? h('p', {}, 'Ready to learn next: ', nextUp.slice(0, 3).join(', '), '.') : null,
      h('button', { class: 'btn-primary btn-big', onclick: () => next(app), autofocus: true }, 'Carry on')));
    return;
  }
  const q = probeQuestion(state, db, p);
  const nextBtn = h('button', { class: 'btn-primary btn-big', type: 'button', disabled: true }, 'Next');
  const view = await renderQuestion(q, { onChange: (ok) => (nextBtn.disabled = !ok), settings: state.settings });
  const go = (response) => {
    answerProbe(probe, state, db, q, response, app.today());
    app.save();
    placementStep(app, root, step);
  };
  nextBtn.onclick = () => view.hasResponse() && go(view.getResponse());
  if (view.input) view.input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && view.hasResponse()) { e.preventDefault(); go(view.getResponse()); } });
  const topic = db.topics[probe.current?.topic];
  mount(root, header(app, 'Finding your level'), h('div', { class: 'q-wrap' },
    h('p', { class: 'muted small' }, `${subj.name}${topic ? ' · ' + topic.title : ''} · question ${probe.asked + 1}`),
    view.el,
    h('div', { class: 'row', style: { marginTop: '18px' } }, nextBtn,
      h('button', { class: 'btn-ghost btn-big', type: 'button', onclick: () => go(null) }, 'I haven’t learned this yet'))));
  view.focus();
}
