// Year 8's school focus: the ten areas from her maths report, as a front-page module, red first.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { setCourse, COURSE, COURSES, bonusWords } from '../js/core/subjects.js';
import { buildDB } from '../js/core/content.js';
import { emptyState } from '../js/core/store.js';
import { bonusTopics, planBonus, bonusChoices, chooseTopic, questionFor, submit, bonusProgress } from '../js/core/session.js';
import { GENERATORS } from '../js/gen/index.js';
import { makeRng } from '../js/core/rng.js';
import { correctResponse } from '../js/core/checkers.js';
import { bonusCardInfo } from '../js/screens/home.js';
import { wardrobeAccessories, starterAccessories, prizeOf } from '../js/core/progress.js';
import { ACCESSORIES, capybaraSVG } from '../js/ui/capybara.js';

const read = (p) => JSON.parse(readFileSync(new URL(`../content/${p.replace(/^content\//, '')}`, import.meta.url)));
setCourse('y8');
const db = buildDB(read('index-y8.json').decks.map(read));
const REPORT = ['Pythagoras: problem solving', 'Reverse percentages', 'Drawing linear graphs and parallel lines', 'Gradient and y-intercept', 'Estimation', 'Lines of symmetry', 'Solving equations', 'Using a calculator', 'Angles in triangles', 'Fraction calculations'];

test('every area on her report is a part of the school focus, in the report’s order (red, then amber, then green)', () => {
  const ids = bonusTopics(db);
  assert.deepEqual(ids.map((id) => db.topics[id].title), REPORT);
  const rank = { red: 0, amber: 1, green: 2 };
  const rags = ids.map((id) => COURSE.bonus.rag[id]);
  assert.ok(rags.every(Boolean), 'each part has its colour');
  assert.deepEqual(rags, [...rags].sort((a, b) => rank[a] - rank[b]), 'red first, green last');
  assert.deepEqual(Object.keys(COURSE.bonus.rag).sort(), [...ids].sort(), 'no colour for a part that is not there');
  for (const id of ids) {
    const t = db.topics[id];
    assert.equal(t.subject, 'maths');
    assert.ok(t.intro && t.hook && t.teach, `${id} is taught properly`);
    const tmpl = Object.values(db.items).filter((i) => i.topic === id);
    assert.ok(tmpl.length >= 1 && tmpl.every((i) => GENERATORS[i.gen]), `${id}: its generators exist`);
  }
});

test('every focus generator makes well-formed questions at every level', () => {
  for (const id of bonusTopics(db)) for (const it of Object.values(db.items).filter((i) => i.topic === id)) {
    for (const level of it.levels) for (let k = 0; k < 150; k++) {
      const q = GENERATORS[it.gen](level, makeRng(`${it.gen}:${level}:${k}`));
      assert.ok(q.prompt && q.explain && q.steps?.length, `${it.gen} L${level}`);
      assert.ok(!/undefined|NaN/.test(JSON.stringify(q)), `${it.gen} L${level}: ${q.prompt}`);
      if (q.kind === 'choice') assert.equal(q.options.filter((o) => o.correct).length, 1, q.prompt);
    }
  }
});

test('it is called “School focus” on screen; the other courses keep “Bonus topic”', () => {
  assert.deepEqual(bonusWords(COURSE.bonus), { label: 'School focus', short: 'Focus', the: 'your school focus' });
  assert.equal(bonusWords(COURSES.y6.bonus).label, 'Bonus topic');
  const st = emptyState(20800); st.course = 'y8'; st.profile = { childName: 'Ada', companion: { name: 'Pip' } };
  const info = bonusCardInfo(st, db, 20800);
  assert.equal(info.eyebrow, 'School focus');
  assert.equal(info.button, 'Start your school focus');
});

test('the first lesson offered is a red one, and a session teaches it with worked examples', () => {
  const today = 20800;
  const st = emptyState(today); st.course = 'y8'; st.profile = { childName: 'Ada', companion: { name: 'Pip' } };
  const opts = bonusChoices(st, db);
  assert.equal(COURSE.bonus.rag[opts[0]], 'red');
  const plan = st.extra = planBonus(st, db, today); st.extraOn = true;
  for (; plan.steps[plan.pos].t !== 'done'; plan.pos++) {
    const step = plan.steps[plan.pos];
    if (step.t === 'choose') { chooseTopic(st, db, bonusChoices(st, db)[0], today); continue; }
    if (!['review', 'quiz', 'practice', 'faded', 'recall', 'diag'].includes(step.t)) continue;
    const q = questionFor(st, db, step, plan.pos);
    submit(st, db, step, q, correctResponse(q), { ms: 5000, conf: 2, now: today * 864e5, today });
  }
  assert.ok(plan.steps.some((s) => s.t === 'worked'), 'a worked example first');
  assert.ok(st.topics['maths.focus-pythag'], 'Pythagoras problem solving is under way');
  // all right in a full lesson: it may already be finished; otherwise it is the part she is on
  const bp = bonusProgress(st, db);
  assert.ok(st.bonusParts?.['maths.focus-pythag'] != null || bp.now === 1, JSON.stringify(st.topics['maths.focus-pythag']));
});

test('her prize is the golden laurel wreath: locked until she finishes, then hers to wear', () => {
  assert.deepEqual(COURSE.bonus.prize, ['goldlaurel']);
  assert.ok(ACCESSORIES.goldlaurel);
  assert.ok(wardrobeAccessories().has('goldlaurel'));
  assert.ok(!starterAccessories().includes('goldlaurel'));
  assert.equal(prizeOf('goldlaurel'), COURSE.bonus);
  for (const species of ['capybara', 'lion', 'heroine']) assert.ok(capybaraSVG({ species, wear: { head: 'goldlaurel' } }).includes('#e8b923'), species);
});
