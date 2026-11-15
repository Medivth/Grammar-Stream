// The word of the day card on the home page (words in js/core/words.js). The child sees the word
// in a sentence and guesses what it means before tapping to check; yesterday's word comes back
// as a quick "do you remember?", because recalling a word is what makes it stick.

import { h, rich } from './dom.js';
import { sayButton } from './qtypes.js';
import { COURSE } from '../core/subjects.js';
import { wordOfDay } from '../core/words.js';

/** Remember that today's word was opened (a short list of days, for "words learned"). */
function markSeen(app, today) {
  const days = (app.state.wordDays ||= []);
  if (!days.includes(today)) {
    days.push(today);
    if (days.length > 400) days.splice(0, days.length - 400);
    app.save();
  }
}

export function wordCard(app) {
  const today = app.today();
  const word = wordOfDay(COURSE.id, today);
  if (!word) return null;
  const seen = (app.state.wordDays || []).includes(today);
  const young = !!COURSE.young;
  const meaning = h('div', { class: 'word-meaning' });
  const showMeaning = () => {
    meaning.replaceChildren(...[
      h('p', { class: 'word-mean' }, h('strong', {}, 'Meaning: '), word.mean[0].toUpperCase() + word.mean.slice(1) + '.'),
      word.root ? h('p', { class: 'word-root muted small' }, `From ${word.root}`) : null,
      h('p', { class: 'word-try small' }, young ? `Can you use “${word.w}” in a sentence today?` : `Try to use “${word.w}” today, in speech or in writing.`)].filter(Boolean));
    reveal.hidden = true;
  };
  const reveal = h('button', { class: 'btn-ghost word-reveal', type: 'button', onclick: () => { markSeen(app, today); showMeaning(); } }, 'What do you think it means? Tap to check');
  if (seen) showMeaning();
  // yesterday's word, once it has been opened: a quick try at remembering it
  const prev = wordOfDay(COURSE.id, today - 1);
  const prevSeen = prev && prev.w !== word.w && (app.state.wordDays || []).includes(today - 1);
  const prevAns = h('span', { class: 'muted' });
  const prevBtn = prevSeen ? h('button', { class: 'word-prev-btn', type: 'button', onclick: () => { prevAns.textContent = ` ${prev.mean}.`; prevBtn.remove(); } }, 'Remember? Tap') : null;
  return h('section', { class: 'word-card card', 'aria-label': 'Word of the day' },
    h('div', { class: 'eyebrow' }, 'Word of the day'),
    h('div', { class: 'word-head' }, h('h2', { class: 'word-w' }, word.w), h('span', { class: 'chip word-cls' }, word.cls), sayButton(`${word.w}. ${word.eg.replace(/\*\*/g, '')}`, 'Hear the word')),
    rich('p', word.eg, { class: 'word-eg' }),
    reveal,
    meaning,
    prevSeen ? h('p', { class: 'word-prev small' }, 'Yesterday’s word: ', h('strong', {}, prev.w), '. ', prevBtn, prevAns) : null);
}
