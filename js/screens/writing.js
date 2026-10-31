// Weekly writing piece: read the task, plan, write (here or on paper), self-check, hand in.
// Years 2 and 3 write on paper by default, with words to borrow and an "Add, change, check" edit.

import { h, rich, mount, toast } from '../ui/dom.js';
import { capybaraEl, companionNoun, speciesOf } from '../ui/capybara.js';
import { sayButton } from '../ui/qtypes.js';
import { COURSE } from '../core/subjects.js';
import { currentPiece, nextPrompt, startPiece, submitPiece, wordCount, filledPrompt, pieceWords } from '../core/writing.js';

const TYPE_NAMES = {
  narrative: 'Story', viewpoint: 'Persuasive writing', analytical: 'Analysing a text', history: 'History essay', science: 'Science conclusion', geography: 'Geography enquiry',
  story: 'Story', recount: 'Recount', instructions: 'Instructions', letter: 'Letter', report: 'Fact file', poem: 'Poem',
};

function top(app, title) {
  return h('div', { class: 'topbar' }, h('button', { class: 'btn-icon', 'aria-label': 'Back home', onclick: () => app.go('#/home') }, '←'), h('h1', {}, title));
}

const aim = (prompt) => { const w = pieceWords(prompt, COURSE.id); return `Aim for ${w[0]}–${w[1]} words.`; };
const say = (text) => (COURSE.readAloud ? sayButton(text) : null);
const plainText = (t) => String(t || '').replace(/\*\*/g, '');
const withSay = (tag, text, attrs = {}) => (COURSE.readAloud ? h('div', { class: 'q-prompt-row' }, sayButton(plainText(text)), rich(tag, text, attrs)) : rich(tag, text, attrs));
/** The grown-up's own words: plain text, with a read-aloud button for young readers. */
const sayPlain = (text, attrs = {}) => (COURSE.readAloud ? h('div', { class: 'q-prompt-row' }, sayButton(text), h('p', attrs, text)) : h('p', attrs, text));

/** Words to borrow and the sentence trick: on the task, the plan and the writing page. */
function wordBank(prompt) {
  if (!prompt.borrow) return null;
  return h('div', { class: 'card stack' },
    h('h3', { style: { margin: 0 } }, 'Words to borrow from ', h('em', {}, prompt.text)),
    h('div', { class: 'row', style: { gap: '6px' } }, prompt.borrow.map((w) => h('span', { class: 'chip', style: { fontSize: '0.95rem', whiteSpace: 'normal' } }, w))),
    h('h3', { style: { margin: '6px 0 0' } }, `Sentence trick: ${prompt.trick.name}`),
    withSay('p', `${prompt.trick.how} ${prompt.trick.example}`, { class: 'learn', style: { margin: 0 } }));
}

function taskCard(prompt) {
  return h('div', { class: 'card stack' },
    h('div', { class: 'chip' }, TYPE_NAMES[prompt.type]),
    h('h2', {}, prompt.title),
    prompt.edit ? withSay('p', prompt.task, { class: 'learn' }) : rich('p', prompt.task, { class: 'learn' }),
    prompt.passage ? h('blockquote', { class: 'card', style: { background: 'var(--bg-2)', whiteSpace: 'pre-line', margin: 0 } }, prompt.passage, h('p', { class: 'muted small', style: { marginTop: '8px' } }, prompt.passageSource)) : null,
    prompt.data ? h('div', {}, h('p', { class: 'muted small' }, prompt.data.caption),
      h('table', { style: { borderCollapse: 'collapse', width: '100%' } }, prompt.data.rows.map(([a, b]) => h('tr', { style: { borderBottom: '1px solid var(--line)' } }, h('td', { style: { padding: '6px 4px' } }, a), h('td', { style: { padding: '6px 4px', fontWeight: 700 } }, b))))) : null,
    h('p', { class: 'muted small' }, aim(prompt)));
}

export function writingScreen(app) {
  const { state, db } = app;
  const piece = currentPiece(state);
  if (!piece) {
    const next = nextPrompt(state, db);
    if (!next) {
      mount(app.root, top(app, 'This week’s writing'), h('div', { class: 'narrow stack' }, h('div', { class: 'card stack' },
        h('h2', {}, 'Read a story first'),
        h('p', { class: 'learn' }, 'Your writing will build on a story or fact file you have read here. Do a reading topic, and your first writing task will be ready.'),
        h('button', { class: 'btn-primary btn-big', onclick: () => app.go('#/home') }, 'Back home'))));
      return;
    }
    const prompt = filledPrompt(next, state);
    mount(app.root, top(app, 'This week’s writing'), h('div', { class: 'narrow stack' },
      taskCard(prompt),
      wordBank(prompt),
      h('p', { class: 'muted' }, COURSE.young ? 'About 20 minutes. You can stop and come back: everything is saved.' : 'This is a longer piece, about 30 to 40 minutes. You can stop and come back: everything is saved.'),
      h('button', { class: 'btn-primary btn-big', onclick: () => {
        const p = startPiece(state, prompt, app.today());
        if (COURSE.young) p.mode = 'paper'; // handwriting matters at this age; typing stays an option
        app.save(); writingScreen(app);
      } }, COURSE.young ? 'Let’s start' : 'Start this piece')));
    return;
  }
  const prompt = filledPrompt(db.pieceById[piece.promptId], state);
  if (!prompt) return app.go('#/home');
  if (!piece.mode) return chooseMode(app, piece, prompt);
  if (!piece.planned) return planStage(app, piece, prompt);
  if (piece.mode === 'paper' && prompt.edit && !piece.drafted) return paperStage(app, piece, prompt);
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

/** Years 2 and 3: switch between paper (the default) and typing. */
function switchMode(app, piece) {
  const toPaper = piece.mode === 'app';
  return h('button', { class: 'btn-ghost', onclick: () => { piece.mode = toPaper ? 'paper' : 'app'; app.save(); writingScreen(app); } }, toPaper ? '✏️ Write it on paper instead' : '⌨️ Type it instead');
}

function planStage(app, piece, prompt) {
  const young = !!prompt.edit;
  const boxes = prompt.plan.map((label, i) => {
    const ta = h('textarea', { 'aria-label': label, style: { minHeight: young ? '60px' : '70px' }, placeholder: young ? 'A few words is enough' : 'Notes are fine: no need for full sentences', oninput: () => { piece.plan[i] = ta.value; app.save(); } });
    ta.value = piece.plan[i] || '';
    return h('div', { class: 'field' }, h('label', {}, `${i + 1}. ${label}`), ta);
  });
  const paper = piece.mode === 'paper';
  mount(app.root, top(app, 'Plan it'), h('div', { class: 'narrow stack' },
    h('details', { class: 'card' }, h('summary', { style: { fontWeight: 700, cursor: 'pointer' } }, `The task: ${prompt.title}`), taskCard(prompt)),
    h('div', { class: 'card stack' }, h('p', { class: 'muted' }, young ? 'Jot down your ideas for each part, here or on paper.' : paper ? 'Plan here or on paper, whichever you like.' : 'Good writers plan first. Jot down your ideas for each part.'), boxes),
    young ? wordBank(prompt) : null,
    h('div', { class: 'card' }, h('p', { class: 'muted small' }, young ? 'Stuck? You could start like this:' : 'Need a way in? One possible opening:'), rich('p', `“${prompt.starter}”`, { class: 'learn' }), h('p', { class: 'muted small' }, 'Use your own opening if you have a better one!')),
    h('button', { class: 'btn-primary btn-big', onclick: () => { piece.planned = true; app.save(); writingScreen(app); } }, young ? 'I’m ready to write' : paper ? 'I’m ready to write on paper' : 'Start writing'),
    young ? switchMode(app, piece) : null));
}

function planList(piece, prompt) {
  return h('ol', {}, prompt.plan.map((label, i) => h('li', {}, h('strong', {}, label), piece.plan[i] ? h('div', { class: 'muted' }, piece.plan[i]) : null)));
}

/** Years 2 and 3 on paper: everything they need beside the page while they write. */
function paperStage(app, piece, prompt) {
  mount(app.root, top(app, 'Write it on paper'), h('div', { class: 'narrow stack' },
    h('div', { class: 'card stack' },
      h('h2', {}, prompt.title),
      h('ul', { class: 'learn', style: { margin: 0, paddingLeft: '22px' } },
        h('li', {}, 'Use your best handwriting. Join the letters you have learned to join.'),
        h('li', {}, 'Write on every other line, so there is room to add things later.'),
        h('li', {}, aim(prompt)))),
    h('details', { class: 'card', open: true }, h('summary', { style: { fontWeight: 700, cursor: 'pointer' } }, 'My plan'), planList(piece, prompt)),
    wordBank(prompt),
    h('div', { class: 'card' }, h('p', { class: 'muted small' }, 'You could start like this:'), rich('p', `“${prompt.starter}”`, { class: 'learn' })),
    h('button', { class: 'btn-primary btn-big', onclick: () => { piece.drafted = true; app.save(); writingScreen(app); } }, 'I’ve finished writing'),
    h('div', { class: 'row' },
      h('button', { class: 'btn-ghost', onclick: () => { toast('Saved. Come back any time.'); app.go('#/home'); } }, 'Stop for now'),
      switchMode(app, piece))));
}

function writeStage(app, piece, prompt) {
  const words = pieceWords(prompt, COURSE.id);
  // young writers proof-read for themselves in the check stage, so no red underlines for them
  const ta = h('textarea', { 'aria-label': 'Your writing', spellcheck: prompt.edit ? 'false' : 'true', style: { minHeight: '50vh', fontSize: '1.05rem' } });
  ta.value = piece.text || '';
  const count = h('span', { class: 'muted small' });
  const updateCount = () => {
    const n = wordCount(ta.value);
    count.textContent = `${n} words (aim for ${words[0]}–${words[1]})`;
  };
  let timer;
  ta.addEventListener('input', () => { updateCount(); clearTimeout(timer); timer = setTimeout(() => { piece.text = ta.value; app.save(); }, 600); });
  updateCount();
  mount(app.root, top(app, prompt.title), h('div', { class: 'narrow stack' },
    h('details', { class: 'card' }, h('summary', { style: { fontWeight: 700, cursor: 'pointer' } }, 'My plan'), planList(piece, prompt)),
    prompt.edit ? h('details', { class: 'card' }, h('summary', { style: { fontWeight: 700, cursor: 'pointer' } }, 'Words to borrow'), wordBank(prompt)) : null,
    h('details', { class: 'card' }, h('summary', { style: { fontWeight: 700, cursor: 'pointer' } }, 'The task'), taskCard(prompt)),
    ta, count,
    h('div', { class: 'row' },
      h('button', { class: 'btn-ghost', onclick: () => { piece.text = ta.value; app.save(); toast('Saved. Come back any time.'); app.go('#/home'); } }, 'Save and stop for now'),
      h('button', { class: 'btn-primary btn-big', onclick: () => {
        piece.text = ta.value;
        if (wordCount(piece.text) < Math.min(60, words[0] / 2)) return toast('Write a bit more before checking.');
        piece.drafted = true; app.save(); writingScreen(app);
      } }, prompt.edit ? 'I’ve finished writing' : 'I’ve finished: check it')),
    prompt.edit ? switchMode(app, piece) : null));
  ta.focus();
}

function tickBox(app, piece, i, text) {
  const cb = h('input', { type: 'checkbox', id: `crit-${i}`, checked: piece.checked.includes(i), style: { width: '28px', height: '28px', flex: '0 0 auto' }, onchange: () => {
    piece.checked = cb.checked ? [...new Set([...piece.checked, i])] : piece.checked.filter((x) => x !== i);
    app.save();
  } });
  return h('div', { class: 'row', style: { flexWrap: 'nowrap', alignItems: 'flex-start', marginBottom: '10px' } }, cb, h('label', { for: `crit-${i}`, style: { fontWeight: 400, margin: 0 } }, text));
}

/** Years 2 and 3: read it aloud, then add, change and check, ticking each thing done. */
function editSteps(app, piece, prompt) {
  const c = app.state.profile?.companion || {};
  const pal = c.name || `your ${companionNoun(speciesOf(c, COURSE.young))}`;
  const paper = piece.mode === 'paper';
  let i = 0;
  const group = (title, lead, list, extra) => {
    const rows = list.map((text) => { const n = i++; return prompt.paperOnly?.includes(n) && !paper ? null : tickBox(app, piece, n, text); });
    return h('div', { class: 'card stack' },
      h('div', { class: 'row', style: { flexWrap: 'nowrap', alignItems: 'center' } }, say(`${title}. ${lead} ${list.join('. ')}.`), h('h2', { style: { margin: 0 } }, title)),
      h('p', { class: 'muted', style: { margin: 0 } }, lead), rows, extra);
  };
  return [
    h('div', { class: 'card stack' },
      h('div', { class: 'row', style: { flexWrap: 'nowrap', alignItems: 'center' } }, say(`Read it aloud to your grown-up, or to ${pal}. Does it make sense? Does it sound good?`), h('h2', { style: { margin: 0 } }, 'Read it aloud')),
      h('p', { class: 'learn', style: { margin: 0 } }, `Read your writing aloud to your grown-up, or to ${pal}. Does it make sense? Does it sound good?`),
      h('p', { class: 'muted', style: { margin: 0 } }, paper ? 'Make your changes in a different colour pencil, so your grown-up can see how you made it better.' : 'Go back and make each change, then tick it here.')),
    group('Add', 'Add one or more of these:', prompt.edit.add),
    group('Change', 'Make it better:', prompt.edit.change, h('div', { class: 'row', style: { gap: '6px' } }, prompt.borrow.map((w) => h('span', { class: 'chip', style: { fontSize: '0.95rem', whiteSpace: 'normal' } }, w)))),
    group('Check', 'Look carefully for:', prompt.edit.check),
  ];
}

function checkStage(app, piece, prompt) {
  const young = !!prompt.edit;
  const c = app.state.profile?.companion || {};
  const boxes = young ? null : prompt.criteria.map((text, i) => tickBox(app, piece, i, text));
  mount(app.root, top(app, young ? 'Add, change, check' : 'Check it'), h('div', { class: 'narrow stack' },
    young ? editSteps(app, piece, prompt) : h('div', { class: 'card stack' },
      h('h2', {}, 'Read it through once, slowly'),
      h('p', { class: 'muted' }, piece.mode === 'paper' ? 'Read your paper copy aloud quietly. Tick each thing you did. If something is missing, add it now.' : 'Read it aloud quietly. Tick each thing you did. If something is missing, go back and add it.'),
      boxes),
    piece.mode === 'app' ? h('button', { class: 'btn-ghost', onclick: () => { piece.drafted = false; app.save(); writingScreen(app); } }, young ? 'Go back and change it' : 'Go back and edit') : null,
    h('button', { class: 'btn-primary btn-big', onclick: () => {
      submitPiece(piece, app.today());
      app.save();
      mount(app.root, h('div', { class: 'narrow stack center' }, capybaraEl({ ...c, species: speciesOf(c, COURSE.young), mood: 'happy' }, 'capy bob'),
        h('h1', {}, 'Handed in!'),
        h('p', { class: 'learn' }, piece.mode === 'paper' ? 'Give your paper to your grown-up. They’ll leave you some feedback in the app.' : 'Your grown-up will read it and leave you some feedback.'),
        h('p', { class: 'muted' }, `That was a big piece of work. ${c.name || 'Your companion'} is impressed.`),
        h('button', { class: 'btn-primary btn-big', onclick: () => app.go('#/home') }, 'Back home')));
    } }, 'Hand it in')));
}

export function feedbackScreen(app, pieceId) {
  const piece = app.state.pieces.find((p) => p.id === decodeURIComponent(pieceId));
  if (!piece?.mark) return app.go('#/home');
  const prompt = filledPrompt(app.db.pieceById[piece.promptId], app.state);
  if (!prompt) return app.go('#/home');
  piece.seen = true;
  app.save();
  const c = app.state.profile?.companion || {};
  const strong = prompt.rubric.filter((_, i) => piece.mark.scores[i] === 2).map((r) => r.name);
  mount(app.root, top(app, 'Feedback'), h('div', { class: 'narrow stack' },
    h('div', { class: 'hero' }, capybaraEl({ ...c, species: speciesOf(c, COURSE.young), mood: 'happy' }, 'capy'), h('div', {}, h('h2', {}, prompt.title), h('p', { class: 'muted' }, 'Your grown-up read your writing.'))),
    piece.mark.worked ? h('div', { class: 'feedback good' }, h('h3', {}, 'What worked'), sayPlain(piece.mark.worked)) : null,
    strong.length ? h('div', { class: 'card' }, h('p', {}, h('strong', {}, 'You did these really well: '), strong.join(', '), '.')) : null,
    piece.mark.next ? h('div', { class: 'card' }, h('h3', {}, 'Your next step'), sayPlain(piece.mark.next, { class: 'learn' }), h('p', { class: 'muted small' }, 'Try it in your next piece of writing, or in a sentence workshop.')) : null,
    piece.text ? h('details', { class: 'card' }, h('summary', { style: { cursor: 'pointer', fontWeight: 700 } }, 'Read your piece again'), h('p', { style: { whiteSpace: 'pre-wrap' } }, piece.text)) : null,
    h('button', { class: 'btn-primary btn-big', onclick: () => app.go('#/home') }, 'Back home')));
}
