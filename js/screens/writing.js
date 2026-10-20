// Weekly writing piece: read the task, plan, write (here or on paper), self-check, hand in.

import { h, rich, mount, toast } from '../ui/dom.js';
import { capybaraEl } from '../ui/capybara.js';
import { currentPiece, nextPrompt, startPiece, submitPiece, wordCount } from '../core/writing.js';

const TYPE_NAMES = { narrative: 'Story', viewpoint: 'Persuasive writing', analytical: 'Analysing a text', history: 'History essay', science: 'Science conclusion', geography: 'Geography enquiry' };

function top(app, title) {
  return h('div', { class: 'topbar' }, h('button', { class: 'btn-icon', 'aria-label': 'Back home', onclick: () => app.go('#/home') }, '←'), h('h1', {}, title));
}

function taskCard(prompt) {
  return h('div', { class: 'card stack' },
    h('div', { class: 'chip' }, TYPE_NAMES[prompt.type]),
    h('h2', {}, prompt.title),
    rich('p', prompt.task, { class: 'learn' }),
    prompt.passage ? h('blockquote', { class: 'card', style: { background: 'var(--bg-2)', whiteSpace: 'pre-line', margin: 0 } }, prompt.passage, h('p', { class: 'muted small', style: { marginTop: '8px' } }, prompt.passageSource)) : null,
    prompt.data ? h('div', {}, h('p', { class: 'muted small' }, prompt.data.caption),
      h('table', { style: { borderCollapse: 'collapse', width: '100%' } }, prompt.data.rows.map(([a, b]) => h('tr', { style: { borderBottom: '1px solid var(--line)' } }, h('td', { style: { padding: '6px 4px' } }, a), h('td', { style: { padding: '6px 4px', fontWeight: 700 } }, b))))) : null,
    h('p', { class: 'muted small' }, `Aim for ${prompt.words[0]}–${prompt.words[1]} words.`));
}

export function writingScreen(app) {
  const { state, db } = app;
  let piece = currentPiece(state);
  if (!piece) {
    const prompt = nextPrompt(state, db);
    mount(app.root, top(app, 'This week’s writing'), h('div', { class: 'narrow stack' },
      taskCard(prompt),
      h('p', { class: 'muted' }, 'This is a longer piece, about 30 to 40 minutes. You can stop and come back: everything is saved.'),
      h('button', { class: 'btn-primary btn-big', onclick: () => { startPiece(state, prompt, app.today()); app.save(); writingScreen(app); } }, 'Start this piece')));
    return;
  }
  const prompt = db.pieceById[piece.promptId];
  if (!piece.mode) return chooseMode(app, piece, prompt);
  if (!piece.planned) return planStage(app, piece, prompt);
  if (piece.mode === 'paper' || piece.drafted) return checkStage(app, piece, prompt);
  return writeStage(app, piece, prompt);
}

function chooseMode(app, piece, prompt) {
  const pick = (mode) => { piece.mode = mode; app.save(); writingScreen(app); };
  mount(app.root, top(app, 'This week’s writing'), h('div', { class: 'narrow stack' },
    taskCard(prompt),
    h('h3', {}, 'How will you write it?'),
    h('div', { class: 'grid two' },
      h('button', { class: 'choice-card', onclick: () => pick('app') }, h('h3', { style: { margin: 0 } }, '⌨️ Type it here'), h('p', { class: 'muted', style: { margin: '6px 0 0' } }, 'Good typing practice for secondary school.')),
      h('button', { class: 'choice-card', onclick: () => pick('paper') }, h('h3', { style: { margin: 0 } }, '✏️ On paper'), h('p', { class: 'muted', style: { margin: '6px 0 0' } }, 'Good handwriting practice. Give it to your grown-up when done.')))));
}

function planStage(app, piece, prompt) {
  const boxes = prompt.plan.map((label, i) => {
    const ta = h('textarea', { 'aria-label': label, style: { minHeight: '70px' }, placeholder: 'Notes are fine: no need for full sentences', oninput: () => { piece.plan[i] = ta.value; app.save(); } });
    ta.value = piece.plan[i] || '';
    return h('div', { class: 'field' }, h('label', {}, `${i + 1}. ${label}`), ta);
  });
  mount(app.root, top(app, 'Plan it'), h('div', { class: 'narrow stack' },
    h('details', { class: 'card' }, h('summary', { style: { fontWeight: 700, cursor: 'pointer' } }, `The task: ${prompt.title}`), taskCard(prompt)),
    h('div', { class: 'card stack' }, h('p', { class: 'muted' }, piece.mode === 'paper' ? 'Plan here or on paper, whichever you like.' : 'Good writers plan first. Jot down your ideas for each part.'), boxes),
    h('div', { class: 'card' }, h('p', { class: 'muted small' }, 'Need a way in? One possible opening:'), rich('p', `“${prompt.starter}”`, { class: 'learn' }), h('p', { class: 'muted small' }, 'Use your own opening if you have a better one!')),
    h('button', { class: 'btn-primary btn-big', onclick: () => { piece.planned = true; app.save(); writingScreen(app); } }, piece.mode === 'paper' ? 'I’m ready to write on paper' : 'Start writing')));
}

function writeStage(app, piece, prompt) {
  const ta = h('textarea', { 'aria-label': 'Your writing', spellcheck: 'true', style: { minHeight: '50vh', fontSize: '1.05rem' } });
  ta.value = piece.text || '';
  const count = h('span', { class: 'muted small' });
  const updateCount = () => {
    const n = wordCount(ta.value);
    count.textContent = `${n} words (aim for ${prompt.words[0]}–${prompt.words[1]})`;
  };
  let timer;
  ta.addEventListener('input', () => { updateCount(); clearTimeout(timer); timer = setTimeout(() => { piece.text = ta.value; app.save(); }, 600); });
  updateCount();
  mount(app.root, top(app, prompt.title), h('div', { class: 'narrow stack' },
    h('details', { class: 'card' }, h('summary', { style: { fontWeight: 700, cursor: 'pointer' } }, 'My plan'), h('ol', {}, prompt.plan.map((label, i) => h('li', {}, h('strong', {}, label), piece.plan[i] ? h('div', { class: 'muted' }, piece.plan[i]) : null)))),
    h('details', { class: 'card' }, h('summary', { style: { fontWeight: 700, cursor: 'pointer' } }, 'The task'), taskCard(prompt)),
    ta, count,
    h('div', { class: 'row' },
      h('button', { class: 'btn-ghost', onclick: () => { piece.text = ta.value; app.save(); toast('Saved. Come back any time.'); app.go('#/home'); } }, 'Save and stop for now'),
      h('button', { class: 'btn-primary btn-big', onclick: () => {
        piece.text = ta.value;
        if (wordCount(piece.text) < Math.min(60, prompt.words[0] / 2)) return toast('Write a bit more before checking.');
        piece.drafted = true; app.save(); writingScreen(app);
      } }, 'I’ve finished: check it'))));
  ta.focus();
}

function checkStage(app, piece, prompt) {
  const boxes = prompt.criteria.map((c, i) => {
    const cb = h('input', { type: 'checkbox', id: `crit-${i}`, checked: piece.checked.includes(i), style: { width: '28px', height: '28px', flex: '0 0 auto' }, onchange: () => {
      piece.checked = cb.checked ? [...new Set([...piece.checked, i])] : piece.checked.filter((x) => x !== i);
      app.save();
    } });
    return h('div', { class: 'row', style: { flexWrap: 'nowrap', alignItems: 'flex-start', marginBottom: '10px' } }, cb, h('label', { for: `crit-${i}`, style: { fontWeight: 400, margin: 0 } }, c));
  });
  const c = app.state.profile?.companion || {};
  mount(app.root, top(app, 'Check it'), h('div', { class: 'narrow stack' },
    h('div', { class: 'card stack' },
      h('h2', {}, 'Read it through once, slowly'),
      h('p', { class: 'muted' }, piece.mode === 'paper' ? 'Read your paper copy aloud quietly. Tick each thing you did. If something is missing, add it now.' : 'Read it aloud quietly. Tick each thing you did. If something is missing, go back and add it.'),
      boxes),
    piece.mode === 'app' ? h('button', { class: 'btn-ghost', onclick: () => { piece.drafted = false; app.save(); writingScreen(app); } }, 'Go back and edit') : null,
    h('button', { class: 'btn-primary btn-big', onclick: () => {
      submitPiece(piece, app.today());
      app.save();
      mount(app.root, h('div', { class: 'narrow stack center' }, capybaraEl({ ...c, mood: 'happy' }, 'capy bob'),
        h('h1', {}, 'Handed in!'),
        h('p', { class: 'learn' }, piece.mode === 'paper' ? 'Give your paper to your grown-up. They’ll leave you some feedback in the app.' : 'Your grown-up will read it and leave you some feedback.'),
        h('p', { class: 'muted' }, `That was a big piece of work. ${c.name || 'Your companion'} is impressed.`),
        h('button', { class: 'btn-primary btn-big', onclick: () => app.go('#/home') }, 'Back home')));
    } }, 'Hand it in')));
}

export function feedbackScreen(app, pieceId) {
  const piece = app.state.pieces.find((p) => p.id === decodeURIComponent(pieceId));
  if (!piece?.mark) return app.go('#/home');
  const prompt = app.db.pieceById[piece.promptId];
  piece.seen = true;
  app.save();
  const c = app.state.profile?.companion || {};
  const strong = prompt.rubric.filter((_, i) => piece.mark.scores[i] === 2).map((r) => r.name);
  mount(app.root, top(app, 'Feedback'), h('div', { class: 'narrow stack' },
    h('div', { class: 'hero' }, capybaraEl({ ...c, mood: 'happy' }, 'capy'), h('div', {}, h('h2', {}, prompt.title), h('p', { class: 'muted' }, 'Your grown-up read your writing.'))),
    piece.mark.worked ? h('div', { class: 'feedback good' }, h('h3', {}, 'What worked'), h('p', {}, piece.mark.worked)) : null,
    strong.length ? h('div', { class: 'card' }, h('p', {}, h('strong', {}, 'You did these really well: '), strong.join(', '), '.')) : null,
    piece.mark.next ? h('div', { class: 'card' }, h('h3', {}, 'Your next step'), h('p', { class: 'learn' }, piece.mark.next), h('p', { class: 'muted small' }, 'Try it in your next piece of writing, or in a sentence workshop.')) : null,
    piece.text ? h('details', { class: 'card' }, h('summary', { style: { cursor: 'pointer', fontWeight: 700 } }, 'Read your piece again'), h('p', { style: { whiteSpace: 'pre-wrap' } }, piece.text)) : null,
    h('button', { class: 'btn-primary btn-big', onclick: () => app.go('#/home') }, 'Back home')));
}
