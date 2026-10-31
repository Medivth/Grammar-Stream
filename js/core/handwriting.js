// Handwriting joins (KS1 greater depth: "use the diagonal and horizontal strokes needed to join
// some letters"). Six short lessons in the usual UK teaching order, then a daily warm-up drawn
// from the lessons already done. Pure data and logic; the screen is js/screens/handwriting.js.
//
// The model writing is Playwrite GB J (fully joined). Its letters with calt turned off are the
// same shapes unjoined, which is what each join is compared with. Playwrite GB S is the
// semi-joined style: it lifts after letters with a tail (and after b, f, s, x), so lesson 5
// shows break letters with it.

import { makeRng } from './rng.js';

// kind: which stroke the diagram shows. demo: the two letters the diagram is drawn with.
// pairs: joins to trace (and then write three times on paper); words: practice words.
export const HANDWRITING_LESSONS = [
  {
    id: 'diag', title: 'Diagonal joins', kind: 'diagonal', demo: 'in',
    say: 'Start at the bottom of the first letter and go up in a slope to the top of the next small letter.',
    pairs: ['in', 'an', 'cu', 'du'],
    words: ['time', 'came', 'nine', 'space'],
  },
  {
    id: 'horiz', title: 'Joins along the top', kind: 'horizontal', demo: 'ou',
    say: 'o, r, v and w finish at the top, so the join goes straight across, like a bridge.',
    pairs: ['ou', 'oa', 'wi', 're'],
    words: ['zoom', 'win', 'rover', 'wave'],
  },
  {
    id: 'diag-tall', title: 'Diagonal joins to tall letters', kind: 'diagonal-tall', demo: 'ch',
    say: 'Go up in a slope all the way to the top of the tall letter, then come straight back down.',
    pairs: ['ch', 'th', 'ck', 'il'],
    words: ['the', 'think', 'black', 'helmet'],
  },
  {
    id: 'horiz-tall', title: 'Joins along to tall letters', kind: 'horizontal-tall', demo: 'ol',
    say: 'Go across from the top, then curve up to the top of the tall letter.',
    pairs: ['ol', 'wh', 'ot', 'ok'],
    words: ['what', 'book', 'world', 'robot'],
  },
  {
    id: 'break', title: 'Break letters', kind: 'break', demo: 'go',
    say: 'Letters with a tail, like g, j, p, q and y, are break letters: finish the tail, lift your pencil, then start the next letter.',
    note: 'Some schools join these with a loop instead. You will see both ways. Do it the way your teacher shows you.',
    pairs: ['go', 'ju', 'pi', 'qu'],
    words: ['jump', 'pony', 'giant', 'yellow'],
  },
  {
    id: 'words', title: 'Joining whole words', kind: 'words', demo: 'careful',
    say: 'Write the word, then join on the ending: -ful, -less, -ness, -ment and -ly.',
    pairs: ['ful', 'less', 'ness', 'ment', 'ly'],
    words: ['because', 'beautiful', 'kindness', 'quickly'],
  },
];

export const LESSON_BY_ID = Object.fromEntries(HANDWRITING_LESSONS.map((l) => [l.id, l]));

export const emptyHandwriting = () => ({ lessons: {}, days: [] });

/** Lessons open in order: the first, plus one after each lesson done. */
export function unlockedHandwriting(hw) {
  let n = 1;
  HANDWRITING_LESSONS.forEach((l, i) => { if (hw?.lessons?.[l.id]) n = Math.max(n, i + 2); });
  return Math.min(n, HANDWRITING_LESSONS.length);
}

/** The first lesson not yet done, or null when all are done. */
export function nextHandwriting(hw) {
  const i = HANDWRITING_LESSONS.findIndex((l) => !hw?.lessons?.[l.id]);
  return i < 0 ? null : { lesson: HANDWRITING_LESSONS[i], index: i };
}

/** Mark a lesson (or the warm-up, id null) done today. */
export function recordHandwriting(hw, id, day) {
  if (id) {
    const prev = hw.lessons[id];
    hw.lessons[id] = { day: prev?.day ?? day, last: day, times: (prev?.times || 0) + 1 };
  }
  if (!hw.days.includes(day)) hw.days.push(day);
}

/** Days in a row ending today or yesterday (so the streak survives until bedtime). */
export function handwritingStreak(hw, today) {
  const days = new Set(hw?.days || []);
  let d = days.has(today) ? today : today - 1, n = 0;
  while (days.has(d)) { n++; d--; }
  return n;
}

/** Three joins and two words from the lessons done so far, the same all day. */
export function warmup(hw, day) {
  const done = HANDWRITING_LESSONS.filter((l) => hw?.lessons?.[l.id]);
  if (!done.length) return null;
  const rng = makeRng(`hw:${day}`);
  const pairs = rng.shuffle(done.flatMap((l) => l.pairs.map((p) => ({ text: p, lesson: l.id })))).slice(0, 3);
  const words = rng.shuffle(done.flatMap((l) => l.words.map((w) => ({ text: w, lesson: l.id })))).slice(0, 2);
  return { pairs, words };
}

/** One line for the home card. */
export function handwritingLine(hw) {
  const next = nextHandwriting(hw);
  if (next) return `Lesson ${next.index + 1} of ${HANDWRITING_LESSONS.length}: ${next.lesson.title.toLowerCase()}`;
  const n = hw.days.length;
  return `All ${HANDWRITING_LESSONS.length} lessons done · ${n} day${n === 1 ? '' : 's'} of practice`;
}
