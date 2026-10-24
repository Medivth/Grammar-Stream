// Extra language practice (Latin, Greek): open any time, separate from today's session.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { setCourse, COURSE, COURSES } from '../js/core/subjects.js';
import { buildDB } from '../js/core/content.js';
import { emptyState } from '../js/core/store.js';
import { planDay, planExtra, extraStatus, activePlan, chooseTopic, questionFor, submit, startSession } from '../js/core/session.js';
import { correctResponse } from '../js/core/checkers.js';

const read = (p) => JSON.parse(readFileSync(new URL(`../content/${p}`, import.meta.url)));
const dbFor = (idx) => buildDB(read(idx).decks.map(read));

test('the Year 6 and Year 8 courses offer Latin and Greek as extra practice; the younger ones do not', () => {
  assert.deepEqual(COURSES.y6.extra, ['latin']);
  assert.deepEqual(COURSES.y8.extra, ['greek']);
  assert.ok(!COURSES.ks1.extra && !COURSES.y3.extra);
  for (const id of ['ks1', 'y3']) for (const t of ['typing', 'speed']) assert.ok(COURSES[id].tools.includes(t), `${id} has ${t}`);
});

for (const [course, idx, lang] of [['y8', 'index-y8.json', 'greek'], ['y6', 'index.json', 'latin']]) {
  test(`${lang} practice on day one, before today's session, leaves the session untouched`, () => {
    setCourse(course);
    assert.equal(COURSE.id, course);
    const db = dbFor(idx);
    const today = 20800;
    const state = emptyState(today);
    state.course = course;
    state.plan = planDay(state, db, today);
    startSession(state, today, today * 864e5);
    const daily = JSON.stringify(state.plan);

    const st = extraStatus(state, db, today, lang);
    assert.ok(st.fresh, 'a first topic is ready straight away');
    state.extra = planExtra(state, db, today, lang);
    state.extraOn = true;
    assert.equal(activePlan(state), state.extra);
    const choose = state.extra.steps.find((s) => s.t === 'choose');
    assert.ok(choose && choose.subject === lang && choose.options.length);
    state.extra.pos = state.extra.steps.indexOf(choose);
    chooseTopic(state, db, choose.options[0], today);
    let answered = 0;
    for (state.extra.pos++; state.extra.steps[state.extra.pos].t !== 'done'; state.extra.pos++) {
      const step = state.extra.steps[state.extra.pos];
      if (!['quiz', 'practice', 'review', 'faded', 'diag'].includes(step.t)) continue;
      assert.equal(db.items[step.id].subject, lang, `${step.id} is ${lang}`);
      const q = questionFor(state, db, step, state.extra.pos);
      submit(state, db, step, q, correctResponse(q), { ms: 5000, conf: 1, now: today * 864e5, today });
      answered++;
    }
    assert.ok(answered >= 3, `answered ${answered}`);
    assert.ok(state.topics[choose.options[0]], 'the topic is started');
    assert.equal(JSON.stringify(state.plan), daily, "today's session is exactly as it was");
    state.extraOn = false;
    assert.equal(activePlan(state), state.plan);

    // a second practice the same day: reviews come only when due, and a next topic may follow
    const again = planExtra(state, db, today, lang);
    assert.ok(again.steps.every((s) => s.t === 'done' || s.t === 'choose' || db.items[s.id]?.subject === lang));
  });
}
