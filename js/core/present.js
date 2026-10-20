// Turn a stored item plus its memory state into a concrete question.
// Facts are promoted in format as they stabilise: recognise -> cued recall -> free recall.

import { GENERATORS } from '../gen/index.js';
import { chooseByTarget } from './elo.js';
import { normalise } from './checkers.js';

const RANK = ['choice', 'cued', 'typed'];
const MAP_RANK = ['choose', 'locate', 'name'];

function formatFor(stability, allowed, rank, cuts = [3, 12]) {
  const s = stability ?? 0;
  const want = s < cuts[0] ? 0 : s < cuts[1] ? 1 : 2;
  for (let r = want; r >= 0; r--) if (allowed.includes(rank[r])) return rank[r];
  return allowed[0];
}

export function cueFor(answer) {
  return answer
    .split(' ')
    .map((w) => w[0] + w.slice(1).replace(/[A-Za-z]/g, '_'))
    .join('   ');
}

function distractorsFor(item, db, rng, n = 3) {
  const answerN = normalise(item.answer);
  const bad = new Set([answerN, ...(item.accept || []).map(normalise)]);
  const out = [];
  const add = (d) => {
    const k = normalise(d);
    if (!bad.has(k)) { bad.add(k); out.push(d); }
  };
  rng.shuffle(item.distractors || []).forEach(add);
  // authored distractors are deliberate (misconceptions, yes/no pairs); only borrow
  // sibling answers for items without them, and only from the same kind of thing
  if (!item.distractors?.length || item.fill) {
    const siblings = (db.itemsByTopic[item.topic] || [])
      .map((id) => db.items[id])
      .filter((s) => s.id !== item.id && s.answer && s.kind === item.kind && s.layer === item.layer && s.group === item.group);
    rng.shuffle(siblings).forEach((s) => add(s.answer));
  }
  return out.slice(0, n);
}

function asChoice(base, item, db, rng) {
  const wrong = distractorsFor(item, db, rng);
  const options = rng.shuffle([{ text: item.answer, correct: true }, ...wrong.map((t) => ({ text: t, feedback: item.feedback?.[t] }))]);
  return { ...base, kind: 'choice', options };
}

export function templateLevel(item, state, rng) {
  const ability = state.subjects[item.subject]?.ability ?? 0;
  const cands = item.levels.map((level, i) => ({
    id: level,
    difficulty: state.templates[`${item.id}@${level}`]?.difficulty ?? item.seed?.[i] ?? level - 2,
  }));
  return chooseByTarget(cands, ability, rng, { spread: 2 }).id;
}

/**
 * @param item content item
 * @param card FSRS card or undefined
 * @param ctx { db, state, rng, level? (template override), format? (override) }
 */
export function present(item, card, { db, state, rng, level, format }) {
  const base = { itemId: item.id, topicId: item.topic, subject: item.subject, explain: item.explain, source: item.source, layer: item.layer || (item.map === 'europe' ? 'countries' : item.map === 'uk' ? 'features' : undefined), group: item.group };
  let q;
  switch (item.kind) {
    case 'fact': {
      const fmt = format || formatFor(card?.s, item.formats || RANK, RANK);
      const b = { ...base, fmt, prompt: item.prompt, image: item.image, answer: item.answer, accept: item.accept, strict: item.strict, map: item.map ? { id: item.map, highlight: item.feature } : undefined };
      if (fmt === 'choice') q = asChoice(b, item, db, rng);
      else q = { ...b, kind: 'typed', cue: fmt === 'cued' ? cueFor(item.answer) : undefined };
      break;
    }
    case 'mapfact': {
      const fmt = format || formatFor(card?.s, item.formats || MAP_RANK, MAP_RANK);
      const map = { id: item.map, highlight: fmt === 'locate' ? null : item.feature, focus: item.focus };
      const b = { ...base, fmt, map, answer: item.answer, accept: item.accept };
      if (fmt === 'choose') q = asChoice({ ...b, prompt: item.choosePrompt || 'Which place is highlighted?' }, item, db, rng);
      else if (fmt === 'locate') q = { ...b, kind: 'map', mode: 'locate', feature: item.feature, prompt: item.locatePrompt || `Tap ${item.answer}.` };
      else q = { ...b, kind: 'typed', prompt: item.namePrompt || 'Name the highlighted place.' };
      break;
    }
    case 'spell': {
      const fmt = format || ((card?.s ?? 0) < 4 ? 'cued' : 'typed');
      q = { ...base, fmt, kind: 'typed', strict: true, prompt: item.sentence, clue: item.clue, answer: item.word, accept: item.accept, say: item.word, cue: fmt === 'cued' ? cueFor(item.word) : undefined, spelling: true };
      break;
    }
    case 'mcq':
    case 'weighted': {
      const opts = item.keepOrder ? item.options : rng.shuffle(item.options);
      q = { ...base, fmt: 'choice', kind: 'choice', prompt: item.prompt, options: opts.map((o) => ({ ...o })), weighted: item.kind === 'weighted', image: item.image, diagram: item.diagram };
      break;
    }
    case 'order': {
      let display = rng.shuffle(item.items.map((_, i) => i));
      if (display.every((v, i) => v === i)) display = display.reverse();
      q = { ...base, fmt: 'order', kind: 'order', prompt: item.prompt, items: item.items, labels: item.labels, display, axis: item.axis };
      break;
    }
    case 'cloze':
      q = { ...base, fmt: 'cloze', kind: 'cloze', prompt: item.prompt, text: item.text, blanks: item.blanks, strict: item.strict };
      break;
    case 'template': {
      const lv = level ?? templateLevel(item, state, rng);
      const g = GENERATORS[item.gen](lv, rng);
      q = { ...base, fmt: 'template', ...g, level: lv, explain: g.explain };
      break;
    }
    default:
      throw new Error('cannot present ' + item.kind);
  }
  q.guess = q.kind === 'choice' ? 1 / q.options.length : 0;
  return q;
}

/** A short statement of the fact, used on "learn this" cards. */
export function learnText(item) {
  if (item.learn) return item.learn;
  if (item.kind === 'fact') return `${item.prompt} **${item.answer}**`;
  if (item.kind === 'mapfact') return `This is **${item.answer}**.`;
  if (item.kind === 'spell') return `**${item.word}**`;
  return item.explain || '';
}
