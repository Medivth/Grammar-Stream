// Pure logic for the practice tools: touch-typing lessons and speed-reading pacing.

import { makeRng } from './rng.js';

// --- touch typing -------------------------------------------------------------------------

/** Lessons add keys row by row. `keys` are the new keys; drills use all keys learned so far. */
export const TYPING_LESSONS = [
  { id: 'home', title: 'Home row', keys: 'asdfjkl;', tip: 'Rest your fingers on A S D F and J K L ; (feel the bumps on F and J). Thumbs on the space bar.' },
  { id: 'ei', title: 'E and I', keys: 'ei', tip: 'Middle fingers reach up: left to E, right to I. Come straight back to the home row.' },
  { id: 'ru', title: 'R and U', keys: 'ru', tip: 'Index fingers reach up: left to R, right to U.' },
  { id: 'tg', title: 'T and G', keys: 'tg', tip: 'Left index finger stretches inwards to T (up) and G (across).' },
  { id: 'yh', title: 'Y and H', keys: 'yh', tip: 'Right index finger stretches inwards to Y (up) and H (across).' },
  { id: 'top', title: 'Q W O P', keys: 'qwop', tip: 'Little fingers and ring fingers reach up to the corners.' },
  { id: 'bottom', title: 'The bottom row', keys: 'zxcvbnm,.', tip: 'Fingers reach down. V and B are left index; N and M are right index.' },
  { id: 'caps', title: 'Capitals and punctuation', keys: '\'?!', shift: true, tip: 'Hold Shift with the little finger of the OTHER hand while you press the letter.' },
  { id: 'words', title: 'Real words', words: true, tip: 'Now every key, in real words. Accuracy first; speed follows.' },
  { id: 'sentences', title: 'Whole sentences', sentences: true, tip: 'Full sentences with capitals, spaces and punctuation. Keep your eyes on the screen, not your hands.' },
];

const FINGER = { a: 'L little', s: 'L ring', d: 'L middle', f: 'L index', g: 'L index', h: 'R index', j: 'R index', k: 'R middle', l: 'R ring', ';': 'R little', q: 'L little', w: 'L ring', e: 'L middle', r: 'L index', t: 'L index', y: 'R index', u: 'R index', i: 'R middle', o: 'R ring', p: 'R little', z: 'L little', x: 'L ring', c: 'L middle', v: 'L index', b: 'L index', n: 'R index', m: 'R index', ',': 'R middle', '.': 'R ring', '/': 'R little', '\'': 'R little', ' ': 'thumb' };
export const fingerFor = (ch) => FINGER[ch.toLowerCase()] || (ch === ch.toUpperCase() && /[a-z]/i.test(ch) ? `${FINGER[ch.toLowerCase()]} + Shift` : '');

export const KEYBOARD_ROWS = ['qwertyuiop', 'asdfghjkl;\'', 'zxcvbnm,./'];

/** Keys available by the time a lesson is reached. */
export function keysUpTo(lessonIdx) {
  return TYPING_LESSONS.slice(0, lessonIdx + 1).map((l) => l.keys || '').join('');
}

/** The text for a lesson: pseudo-words from learned keys, real words, or sentences. ~40 words. */
export function drillText(lessonIdx, seed, { words = [], sentences = [] } = {}) {
  const lesson = TYPING_LESSONS[lessonIdx];
  const rng = makeRng(`type:${lesson.id}:${seed}`);
  if (lesson.sentences && sentences.length) {
    const out = [];
    while (out.join(' ').length < 220) out.push(rng.pick(sentences));
    return out.join(' ');
  }
  const learned = keysUpTo(lessonIdx).replace(/[^a-z]/g, '');
  if (lesson.words || lesson.caps) {
    const usable = words.filter((w) => [...w.toLowerCase()].every((c) => learned.includes(c)));
    const pool = usable.length >= 20 ? usable : words;
    return Array.from({ length: 30 }, () => { const w = rng.pick(pool); return lesson.shift && rng.chance(0.4) ? w[0].toUpperCase() + w.slice(1) + rng.pick(['', '', '?', '!', '\'s']) : w; }).join(' ');
  }
  // pseudo-words: the new keys appear often, older keys fill in
  const fresh = lesson.keys, older = keysUpTo(lessonIdx - 1) || fresh;
  const word = () => Array.from({ length: rng.int(3, 5) }, () => (rng.chance(0.6) ? rng.pick([...fresh]) : rng.pick([...older]))).join('');
  return Array.from({ length: 36 }, word).join(' ');
}

/** Standard words per minute: five characters make a word. */
export function wpm(correctChars, ms) {
  return ms > 0 ? Math.round((correctChars / 5) / (ms / 60000)) : 0;
}

export const PASS_ACCURACY = 0.9;

/** Lessons unlocked: the first, plus every lesson after one passed with 90% accuracy. */
export function unlockedLessons(typing) {
  let n = 1;
  for (let i = 0; i < TYPING_LESSONS.length; i++) {
    const r = typing.lessons?.[TYPING_LESSONS[i].id];
    if (r?.passed) n = Math.max(n, i + 2);
  }
  return Math.min(n, TYPING_LESSONS.length);
}

export function recordLesson(typing, id, { wpm: w, acc }, day) {
  const prev = typing.lessons[id];
  const passed = acc >= PASS_ACCURACY || !!prev?.passed;
  if (!prev || w > prev.wpm || (w === prev.wpm && acc > prev.acc)) typing.lessons[id] = { wpm: w, acc, day, passed };
  else prev.passed = passed;
  if (acc >= 0.95 && (!typing.best || w > typing.best.wpm)) typing.best = { wpm: w, acc, day };
}

// --- speed reading --------------------------------------------------------------------------

export const SPEED_START = 150;
export const SPEED_MIN = 100;
export const SPEED_MAX = 600;

/** Next pace from the last result: up on strong comprehension, down on weak. */
export function nextSpeed(records) {
  const last = records.at(-1);
  if (!last) return SPEED_START;
  const rate = last.total ? last.correct / last.total : 0;
  const step = rate >= 0.75 ? 20 : rate < 0.5 ? -20 : 0;
  return Math.max(SPEED_MIN, Math.min(SPEED_MAX, last.wpm + step));
}

/** Passages with enough multiple-choice questions, least recently read first. */
export function speedPassages(db, records) {
  const by = new Map();
  for (const it of Object.values(db.items)) {
    if (!it.passage || it.kind !== 'mcq' || it.subject !== 'english') continue;
    const key = it.passageSource;
    if (!by.has(key)) by.set(key, { key, passage: it.passage.replace(/^\([^)]*\)\n\n/, ''), source: it.passageSource, items: [] });
    by.get(key).items.push(it);
  }
  const last = {};
  for (const r of records) last[r.passage] = Math.max(last[r.passage] ?? -1, r.day);
  return [...by.values()].filter((p) => p.items.length >= 3 && !/\n/.test(p.passage.trim().split('\n\n')[0].slice(0, 40)) || p.items.length >= 3).sort((a, b) => (last[a.key] ?? -1) - (last[b.key] ?? -1) || a.key.localeCompare(b.key));
}
