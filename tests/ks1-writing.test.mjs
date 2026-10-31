// Years 2 and 3: weekly writing built on his reading, and spelling and punctuation in use.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { setCourse, COURSES } from '../js/core/subjects.js';
import { buildDB, validateDB } from '../js/core/content.js';
import { GENERATORS } from '../js/gen/index.js';
import { emptyState } from '../js/core/store.js';
import { nextPrompt, startPiece, submitPiece, markPiece, markTotal, pieceWords, filledPrompt, PIECE_INTERVAL, pieceDue } from '../js/core/writing.js';

setCourse('ks1');
const root = new URL('../content/', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root)));
const dbFor = (index) => buildDB(read(index).decks.map(read));
const db = dbFor('index-ks1.json');
const y3 = dbFor('index-y3.json');

const YOUNG_TYPES = ['story', 'recount', 'instructions', 'letter', 'report', 'poem'];

test('Years 2 and 3 offer weekly writing; Years 6 and 8 still do', () => {
  for (const id of ['ks1', 'y3']) assert.ok(COURSES[id].writing && COURSES[id].young && COURSES[id].readAloud, id);
  for (const id of ['y6', 'y8']) assert.ok(COURSES[id].writing, id);
  assert.deepEqual(validateDB(db, GENERATORS), []);
  assert.deepEqual(validateDB(y3, GENERATORS), []);
  assert.deepEqual(y3.pieces.map((p) => p.id), db.pieces.map((p) => p.id), 'Year 3 has the same tasks');
});

test('14 to 18 young prompts across six purposes, each built on a text he has read', () => {
  assert.ok(db.pieces.length >= 14 && db.pieces.length <= 18, `${db.pieces.length} prompts`);
  assert.deepEqual([...new Set(db.pieces.map((p) => p.type))].sort(), [...YOUNG_TYPES].sort());
  for (const p of db.pieces) {
    const where = p.id;
    assert.ok(p.id.startsWith('piece.ks1.'), where);
    assert.equal(p.needsTopics.length, 1, where);
    const topic = p.needsTopics[0];
    assert.ok(topic.startsWith('reading.') && db.topics[topic], `${where}: needs a Year 2 reading topic`);
    // the named text is a passage in that topic, and the task names it in bold
    const passages = db.itemsByTopic[topic].map((id) => db.items[id]).filter((it) => it.passage && (it.passage.split('\n')[0].includes(p.text) || (it.passageSource || '').includes(p.text)));
    assert.ok(passages.length, `${where}: ${p.text} is read in ${topic}`);
    assert.ok(p.task.includes(`**${p.text}**`), `${where}: the task names the text`);
    // words to borrow come from that text
    const text = passages.map((it) => it.passage).join(' ').toLowerCase();
    assert.ok(p.borrow.length >= 5 && p.borrow.length <= 8, `${where}: 5 to 8 words to borrow`);
    for (const w of p.borrow) assert.ok(text.includes(w.toLowerCase()), `${where}: “${w}” is in ${p.text}`);
    assert.ok(p.trick.name && p.trick.how && p.trick.example, `${where}: a sentence trick with an example`);
    assert.ok(p.plan.length >= 2 && p.plan.length <= 4, `${where}: a simple plan`);
    assert.ok(p.words[0] >= 40 && p.words[1] <= 150 && p.words[0] < p.words[1], `${where}: Year 2 words`);
    assert.ok(p.wordsY3[0] > p.words[0] && p.wordsY3[1] > p.words[1], `${where}: Year 3 aims higher`);
    assert.deepEqual(p.criteria, [...p.edit.add, ...p.edit.change, ...p.edit.check], where);
    assert.ok(p.edit.add.length >= 2 && p.edit.change.length >= 1 && p.edit.check.length >= 6, `${where}: add, change, check`);
    assert.deepEqual(p.paperOnly.map((i) => p.criteria[i]), ['Some joined-up letters'], `${where}: handwriting is checked only on paper`);
    assert.ok(p.starter && !p.starter.includes('___'), where);
  }
  const plans = Object.fromEntries(db.pieces.map((p) => [p.type, p.plan]));
  assert.deepEqual(db.pieces.find((p) => p.type === 'story').plan.map((x) => x.split(':')[0]), ['Beginning', 'Problem', 'Ending']);
  assert.deepEqual(plans.instructions.map((x) => x.split(':')[0]), ['You need', 'Steps']);
  assert.ok(plans.letter[0].startsWith('Who') && plans.letter[2].includes('end'));
});

test('the young rubric: six KS1 greater-depth lines, handwriting marked only on paper', () => {
  for (const p of db.pieces) {
    assert.deepEqual(p.rubric.map((r) => r.name), ['Right for the purpose and the reader', 'Words and sentences from reading', 'Punctuation', 'Spelling', 'Handwriting', 'Editing: add, change, check']);
    assert.ok(p.rubric.every((r) => r.levels.length === 3));
    assert.deepEqual(p.rubric.map((r) => !!r.paper), [false, false, false, false, true, false]);
  }
  const s = emptyState(1);
  s.topics['reading.fables'] = { state: 'learning' };
  const piece = startPiece(s, nextPrompt(s, db), 1);
  piece.mode = 'app';
  submitPiece(piece, 2);
  markPiece(piece, { scores: [2, 1, 2, 1, null, 2], worked: 'Great words', next: 'Use because' }, 3);
  assert.deepEqual(markTotal(piece.mark), { got: 8, out: 10 });
  markPiece(piece, { scores: [2, 2, 2, 2, 1, 2], worked: 'x', next: '' }, 3);
  assert.deepEqual(markTotal(piece.mark), { got: 11, out: 12 });
});

test('writing waits until he has read a text, then rotates purposes', () => {
  const s = emptyState(100);
  assert.equal(nextPrompt(s, db), null, 'nothing before any reading');
  s.topics['reading.fables'] = { state: 'learning' };
  s.topics['reading.adventures'] = { state: 'learning' };
  s.topics['reading.facts'] = { state: 'learning' };
  const types = [];
  let day = 100;
  for (let i = 0; i < 6; i++) {
    const prompt = nextPrompt(s, db);
    assert.ok(prompt.needsTopics.every((t) => s.topics[t]), `${prompt.id} is ready`);
    types.push(prompt.type);
    submitPiece(startPiece(s, prompt, day), day);
    day += PIECE_INTERVAL;
    assert.ok(pieceDue(s, day));
  }
  assert.deepEqual(types, YOUNG_TYPES, 'the early texts give one task of every kind');
  // when every ready task has been used, the least recent comes round again
  for (let i = 0; i < 20; i++) { const p = nextPrompt(s, db); submitPiece(startPiece(s, p, day), day); day += 7; }
  const used = s.pieces.map((p) => p.promptId);
  assert.ok(used.slice(-3).every((id, k, a) => a.indexOf(id) === k), 'no immediate repeats');
});

test('Year 3 aims for more words; his hero fills the {hero} tasks', () => {
  const p = db.pieceById['piece.ks1.hero-rescue'];
  assert.deepEqual(pieceWords(p, 'ks1'), p.words);
  assert.deepEqual(pieceWords(p, 'y3'), p.wordsY3);
  const s = emptyState(1);
  s.profile = { hero: 'Captain Thunder' };
  const f = filledPrompt(p, s);
  assert.ok(f.title.includes('Captain Thunder') && f.task.includes('Captain Thunder') && !JSON.stringify(f).includes('{hero}'));
  assert.ok(p.title.includes('{hero}'), 'the content itself is unchanged');
});

// ---------------------------------------------------------------- spelling
// National curriculum English, Appendix 1: the statutory common exception words.
const CEW_Y1 = 'the a do to today of said says are were was is his has I you your they be he me she we no go so by my here there where love come some one once ask friend school put push pull full house our'.split(' ');
const CEW_Y2 = 'door floor poor because find kind mind behind child children wild climb most only both old cold gold hold told every everybody even great break steak pretty beautiful after fast last past father class grass pass plant path bath hour move prove improve sure sugar eye could should would who whole any many clothes busy people water again half money Mr Mrs parents Christmas'.split(' ');

test('every Year 1 and Year 2 common exception word is taught, and Year 2 words are used in sentences', () => {
  assert.equal(CEW_Y1.length, 45);
  assert.equal(CEW_Y2.length, 64);
  const spell = Object.values(db.items).filter((it) => it.kind === 'spell');
  const words = new Set(spell.map((it) => it.word.toLowerCase()));
  for (const w of [...CEW_Y1, ...CEW_Y2]) assert.ok(words.has(w.toLowerCase()), `${w} is a spelling item`);
  const inUse = spell.filter((it) => it.topic.startsWith('spelling.cew-use'));
  assert.deepEqual(inUse.map((it) => it.word).sort(), [...CEW_Y2].sort());
  for (const it of spell.filter((x) => x.id.startsWith('spelling.cu.') || x.topic === 'spelling.cew-extra')) {
    assert.equal((it.sentence.match(/___/g) || []).length, 1, it.id);
    assert.ok(it.clue && it.explain && it.learn, it.id);
  }
});

const RULE_ROOT = (root, ending) => {
  if (/[^aeiou]y$/.test(root)) return `${root.slice(0, -1)}i${ending}`;
  if (ending === 'ly' && /[^aeiou]le$/.test(root)) return `${root.slice(0, -2)}ly`;
  return root + ending;
};

test('the new spelling topics are well formed, kind and correct', () => {
  const ids = ['spelling.proofread', 'spelling.suffix-use', 'spelling.cew-extra', 'spelling.cew-use', 'spelling.cew-use-2', 'spelling.punct-use'];
  for (const id of ids) {
    const t = db.topics[id];
    assert.ok(t && t.intro && t.teach && t.talk && t.prereqs.length && !t.tier, id);
    for (const p of t.prereqs) assert.ok(db.topics[p], `${id}: ${p}`);
    assert.ok(db.itemsByTopic[id].length >= 12, id);
  }
  assert.ok(db.topics['spelling.suffix-use'].visual?.kind === 'blocks');
  // endings follow the Year 2 rules: just add, y → i after a consonant, -le → -ly
  for (const id of db.itemsByTopic['spelling.suffix-use']) {
    const it = db.items[id];
    const [, ending, root] = it.prompt.match(/^Add -(\w+) to “(\w+)”/);
    assert.equal(it.answer, RULE_ROOT(root, ending), id);
    assert.ok(it.strict && !it.distractors.includes(it.answer), id);
    assert.ok(it.prompt.includes('___'), id);
  }
  for (const id of [...db.itemsByTopic['spelling.proofread'], ...db.itemsByTopic['spelling.punct-use']]) {
    const it = db.items[id];
    assert.ok(it.explain, id);
    if (it.kind === 'mcq') {
      assert.equal(it.options.filter((o) => o.correct).length, 1, id);
      for (const o of it.options.filter((x) => !x.correct)) assert.ok(o.feedback, `${id}: feedback on “${o.text}”`);
    } else {
      assert.ok(it.strict, id);
      // proof-reading: the sentence holds a misspelling (one of the options), not the answer
      if (id.startsWith('spelling.pr.')) {
        const sentence = it.prompt.split('“')[1];
        assert.ok(it.distractors.some((d) => new RegExp(`\\b${d}\\b`).test(sentence)), `${id}: the mistake is offered as an option`);
        assert.ok(!new RegExp(`\\b${it.answer}\\b`, 'i').test(sentence), `${id}: the right spelling is not already there`);
      }
    }
  }
});
