// Year 8 French, reading, translation and culture (tools/content-src/y8/french3.mjs): the topics
// are the ones the card sets expect, every question can be answered in every format, typed French
// is checked as French (accents forgiven, endings not), wrong answers are never accepted, the
// passages are the right length, and French text uses French typography.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildDB } from '../js/core/content.js';
import { present } from '../js/core/present.js';
import { check, correctResponse, normalise } from '../js/core/checkers.js';
import { emptyState } from '../js/core/store.js';
import { makeRng } from '../js/core/rng.js';
import { setCourse } from '../js/core/subjects.js';

setCourse('y8');
const src = (await import('../tools/content-src/y8/french3.mjs'));
const { expand } = src;
const [deck] = src.default;
const built = JSON.parse(readFileSync(new URL('../content/y8/french/y8-reading.json', import.meta.url)));
const index = JSON.parse(readFileSync(new URL('../content/index-y8.json', import.meta.url)));
const db = buildDB([built]);
const items = Object.values(db.items);
const words = (s) => s.split(/\s+/).filter((w) => /[\p{L}\d]/u.test(w)).length;

const TOPICS = [
  ['r-cognates', 'Cognates and false friends'],
  ['r-read-1', 'Reading: an email about school'],
  ['r-read-2', 'Reading: a blog about the weekend'],
  ['r-read-3', 'Reading: holiday plans'],
  ['r-read-4', 'Reading: a fable'],
  ['r-translate-1', 'Translating into English'],
  ['r-translate-2', 'Translating into French'],
  ['r-culture', 'France and the French-speaking world'],
];

test('French reading deck: the listed topics, built and registered for Year 8', () => {
  assert.equal(deck.subject, 'french');
  assert.deepEqual(deck.topics.map((t) => [t.id.replace('french.', ''), t.title]), TOPICS);
  assert.deepEqual(JSON.parse(JSON.stringify(deck)), built, 'content/y8/french/y8-reading.json is up to date');
  assert.ok(index.decks.includes('y8/french/y8-reading.json'));
  for (const t of deck.topics) {
    for (const k of ['intro', 'teach', 'talk', 'hook']) assert.ok(typeof t[k] === 'string' && t[k].length > 20, `${t.id}: ${k}`);
    assert.match(t.hook, /\*\*[^*]+\*\*/, `${t.id}: the hook has a bold mnemonic`);
    for (const p of t.prereqs) assert.match(p, /^french\./, `${t.id}: prerequisites stay within French`);
  }
  assert.deepEqual(deck.topics.find((t) => t.id === 'french.r-cognates').prereqs, [], 'the first topic has no prerequisites');
  for (const it of items) assert.match(it.id, /^french\.rt\./);
  assert.equal(new Set(items.map((i) => i.id)).size, items.length);
});

test('every question can be presented in every format, and its own answer is accepted', () => {
  const state = emptyState(20000);
  const rng = makeRng('french-reading');
  for (const item of items) {
    const formats = item.kind === 'fact' ? (item.formats || ['choice', 'cued', 'typed']) : [undefined];
    for (const format of formats) for (let i = 0; i < 3; i++) {
      const q = present(item, undefined, { db, state, rng, format });
      const label = `${item.id} [${format ?? q.kind}]`;
      assert.ok(!/undefined|NaN/.test(`${q.prompt} ${q.explain} ${q.passage || ''} ${q.cue || ''}`), label);
      if (q.kind === 'choice') {
        assert.equal(q.options.filter((o) => o.correct).length, 1, `${label}: one correct option`);
        assert.equal(new Set(q.options.map((o) => normalise(o.text))).size, q.options.length, `${label}: duplicate options`);
        assert.ok(q.options.length >= 3, `${label}: at least three options`);
      }
      assert.equal(check(q, correctResponse(q)).correct, true, `${label}: own answer accepted`);
    }
  }
});

test('typed French is marked as French: accents forgiven, wrong endings and distractors refused', () => {
  const asksForFrench = (it) => /French (for|in the)|into French|Write the French|write the French/.test(it.prompt);
  const fr = items.filter((it) => it.kind === 'fact' && asksForFrench(it));
  assert.ok(fr.length >= 22, `${fr.length} typed French answers`);
  for (const it of items.filter((x) => x.kind === 'fact')) assert.equal(it.lang === 'fr', asksForFrench(it), `${it.id}: lang 'fr' exactly when the answer is French`);
  for (const it of items.filter((x) => x.topic === 'french.r-translate-2')) assert.equal(it.lang, 'fr', it.id);
  for (const it of fr) {
    const q = { kind: 'typed', answer: it.answer, accept: it.accept, lang: 'fr' };
    for (const a of [it.answer, ...(it.accept || [])]) {
      const bare = a.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/œ/g, 'oe');
      const r = check(q, bare);
      assert.ok(r.correct, `${it.id}: “${bare}” without accents is accepted`);
      if (bare !== a) assert.ok(r.near && /accents/.test(r.message), `${it.id}: with a note about accents`);
      assert.equal(check(q, a.replace(/[.?!\s]+$/, '') + 's').correct, false, `${it.id}: a wrong ending is refused`);
    }
  }
});

test('no distractor is ever accepted as a right answer', () => {
  for (const it of items) {
    if (it.kind === 'fact') {
      const q = { kind: 'typed', answer: it.answer, accept: it.accept, lang: it.lang, strict: it.strict };
      for (const d of it.distractors || []) assert.equal(check(q, d).correct, false, `${it.id}: distractor “${d}” is accepted`);
    }
    if (it.kind === 'mcq') {
      const right = it.options.find((o) => o.correct).text;
      for (const o of it.options.filter((x) => !x.correct)) {
        assert.notEqual(normalise(o.text), normalise(right), it.id);
        assert.ok(o.feedback || it.explain, `${it.id}: feedback for “${o.text}”`);
      }
    }
  }
});

test('reading topics: an original passage of 120 to 250 words, comprehension in English, and “find the French”', () => {
  for (const n of [1, 2, 3, 4]) {
    const its = items.filter((i) => i.topic === `french.r-read-${n}`);
    const passages = new Set(its.map((i) => i.passage));
    assert.equal(passages.size, 1, `r-read-${n}: one passage`);
    assert.ok(its.every((i) => i.passageSource && i.hear), `r-read-${n}: source and French audio`);
    const body = its[0].hear;
    assert.ok(words(body) >= 120 && words(body) <= 250, `r-read-${n}: ${words(body)} words`);
    assert.ok(its[0].passage.includes('Glossary:'), `r-read-${n}: a glossary`);
    const find = its.filter((i) => i.lang === 'fr');
    assert.ok(find.length >= 2, `r-read-${n}: find the French`);
    const comp = its.length - find.length;
    assert.ok(comp >= 6 && comp <= 9, `r-read-${n}: ${comp} comprehension questions`);
    const low = body.toLowerCase();
    for (const f of find) assert.ok([f.answer, ...(f.accept || [])].some((a) => low.includes(a.toLowerCase())), `${f.id}: the answer is in the passage`);
    // a mix of typed and choice answers
    assert.ok(its.some((i) => i.kind === 'fact' && !i.lang && !i.formats), `r-read-${n}: a typed English answer`);
    assert.ok(its.some((i) => i.kind === 'mcq'), `r-read-${n}: a choice question`);
  }
  assert.match(items.find((i) => i.topic === 'french.r-read-4').passage, /Apprenez que tout flatteur\nVit aux dépens de celui qui l’écoute\./, 'the fable keeps La Fontaine’s moral');
});

test('translation topics: 10 to 14 sentences each, with accepted variants', () => {
  for (const t of ['r-translate-1', 'r-translate-2']) {
    const its = items.filter((i) => i.topic === `french.${t}`);
    assert.ok(its.length >= 10 && its.length <= 14, `${t}: ${its.length}`);
    for (const it of its) {
      assert.equal(it.distractors.length, 3, it.id);
      if (it.answer.includes(',')) assert.ok(it.accept.includes(it.answer.replace(/,/g, '')), `${it.id}: commas optional`);
    }
  }
  for (const it of items.filter((i) => i.topic === 'french.r-translate-1')) assert.ok(it.prompt.includes(it.hear), `${it.id}: hear the French sentence`);
  const q = (id) => { const it = db.items[`french.rt.${id}`]; return { kind: 'typed', answer: it.answer, accept: it.accept, lang: it.lang }; };
  assert.ok(check(q('tr2.cinema'), 'hier je suis allee au cinema').correct, 'a girl’s agreement, without accents');
  assert.ok(check(q('tr2.help'), 'Pouvez-vous m’aider, s’il vous plaît?').correct, 'vous as well as tu');
  assert.equal(check(q('tr2.help'), 'Pouvez-vous m’aider, s’il te plaît ?').correct, false, 'but not vous with s’il te plaît');
  assert.ok(check(q('tr1.rain'), "I'm going to stay in this weekend because it's going to rain").correct);
  assert.equal(check(q('tr1.rain'), 'This weekend I am going to rest at home because it is going to rain').correct, false, 'rester is not “to rest”');
  assert.equal(check(q('tr1.saturday'), 'On Saturday I played tennis with my brother').correct, false);
});

test('French text uses French typography', () => {
  const frText = [];
  for (const it of items) {
    if (it.hear) frText.push([it.id, it.hear]);
    if (it.lang === 'fr') frText.push(...[it.answer, ...(it.accept || []), ...(it.distractors || [])].map((t) => [it.id, t]));
  }
  for (const [id, t] of frText) {
    assert.ok(!/ [!?;:»]|« /.test(t), `${id}: an ordinary space next to French punctuation in “${t}”`);
    assert.ok(!t.includes("'"), `${id}: a straight apostrophe in “${t}”`);
  }
});

test('answer patterns expand every combination, nested', () => {
  assert.deepEqual(expand('a {b|c} d'), ['a b d', 'a c d']);
  assert.deepEqual(expand('{x {1|2}|y}!'), ['x 1!', 'x 2!', 'y!']);
  assert.deepEqual(expand('{a|}{b|c}'), ['ab', 'ac', 'b', 'c']);
});

test('choice questions do not give the answer away by length', () => {
  let n = 0, longest = 0, clearly = 0, chance = 0;
  for (const it of items) {
    let opts;
    if (it.kind === 'mcq') opts = it.options.map((o) => [o.text.length, o.correct]);
    else if (it.kind === 'fact' && it.distractors?.length) opts = [[it.answer.length, true], ...it.distractors.map((d) => [d.length, false])];
    else continue;
    const c = opts.find((o) => o[1])[0], max = Math.max(...opts.filter((o) => !o[1]).map((o) => o[0]));
    n++; chance += 1 / opts.length;
    if (c > max) longest++;
    if (c > max * 1.3 && c - max >= 8) clearly++;
  }
  assert.ok(longest / n <= chance / n + 0.05, `correct option longest in ${longest} of ${n} (chance ${Math.round(chance)})`);
  assert.ok(clearly / n <= 0.05, `clearly longest in ${clearly} of ${n}`);
});
