// The bonus topic: a special module chosen from the home page any time (Year 6: electricity;
// Years 2/3: Florence Nightingale), with a prize for finishing it.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { setCourse, COURSE, COURSES } from '../js/core/subjects.js';
import { buildDB } from '../js/core/content.js';
import { emptyState } from '../js/core/store.js';
import { planDay, planBonus, bonusTopics, bonusChoices, bonusProgress, bonusStatus, topicLearned, topicChoices, activePlan, chooseTopic, questionFor, submit, startSession, finishSession } from '../js/core/session.js';
import { topoOrder, needsPlacement } from '../js/core/placement.js';
import { unlockedAccessories, wardrobeAccessories, starterAccessories, prizeOf } from '../js/core/progress.js';
import { correctResponse } from '../js/core/checkers.js';
import { makeRng } from '../js/core/rng.js';
import { bonusCardInfo } from '../js/screens/home.js';
import { bonusLine } from '../js/screens/parent.js';
import { toggleLit, isLit, wearsLamp, LAMPS } from '../js/ui/lamp.js';

const read = (p) => JSON.parse(readFileSync(new URL(`../content/${p}`, import.meta.url)));
const decksFor = (idx) => read(idx).decks.map(read);
const GRADED = ['review', 'quiz', 'diag', 'practice', 'faded', 'recall'];
const COURSE_INDEX = { y6: 'index.json', ks1: 'index-ks1.json', y3: 'index-y3.json' };

/** A made-up bonus module (the real decks are filled separately): four parts in a chain, the first building on a main-course topic. */
function fakeBonus(id, subject, outside) {
  const topics = [1, 2, 3, 4].map((n) => ({ id: `${subject}.bx${n}`, title: `Bonus part ${n}`, bonus: id, prereqs: n === 1 ? [outside] : [`${subject}.bx${n - 1}`], intro: 'An introduction.' }));
  const items = topics.flatMap((t, ti) => Array.from({ length: 8 }, (_, i) => ({
    id: `${t.id}.q${i}`, topic: t.id, kind: 'fact', prompt: `Bonus question ${ti}-${i}?`, answer: `Answer ${ti}-${i}`,
    distractors: [`Wrong ${ti}-${i}a`, `Wrong ${ti}-${i}b`, `Wrong ${ti}-${i}c`], explain: 'Because.',
  })));
  // as in the real build, the bonus deck comes first in its subject
  return { subject, deck: `bonus-${id}`, topics, items };
}

function dbWithFake(course) {
  setCourse(course);
  const decks = decksFor(COURSE_INDEX[course]).filter((d) => !d.deck?.startsWith('bonus-'));
  const outside = course === 'y6' ? 'science.electricity' : 'history.past';
  return buildDB([fakeBonus(COURSE.bonus.id, COURSE.bonus.subject, outside), ...decks]);
}

function answerAll(state, db, plan, today, right = () => true) {
  for (; plan.steps[plan.pos].t !== 'done'; plan.pos++) {
    const step = plan.steps[plan.pos];
    if (step.t === 'choose') {
      const opts = step.bonus ? bonusChoices(state, db) : topicChoices(state, db, step.subject);
      if (opts.length) chooseTopic(state, db, opts[0], today);
      continue;
    }
    if (!GRADED.includes(step.t)) continue;
    const q = questionFor(state, db, step, plan.pos);
    submit(state, db, step, q, right(step) ? correctResponse(q) : null, { ms: 5000, conf: 1, now: today * 864e5, today });
  }
  plan.finished = true;
}

function bonusSession(state, db, today, right) {
  state.extra = planBonus(state, db, today);
  state.extraOn = true;
  answerAll(state, db, state.extra, today, right);
  state.extraOn = false;
  return state.extra;
}

const newState = (course, today) => { const s = emptyState(today); s.course = course; s.profile = { childName: 'Sam', companion: { name: 'Leo' } }; return s; };

test('Year 6 has an electricity bonus in science; Years 2 and 3 a Florence Nightingale bonus in history; Year 8 none', () => {
  assert.deepEqual({ ...COURSES.y6.bonus, blurb: undefined, prizeText: undefined }, { id: 'electricity', subject: 'science', title: 'Electricity', blurb: undefined, prize: ['lamp', 'labcoat'], prizeText: undefined });
  for (const c of ['ks1', 'y3']) {
    const b = COURSES[c].bonus;
    assert.equal(b.id, 'nightingale');
    assert.equal(b.subject, 'history');
    assert.equal(b.title, 'Florence Nightingale');
    assert.deepEqual(b.prize, ['firstaid', 'oillamp', 'goldarmour']);
  }
  assert.equal(COURSES.y8.bonus, undefined);
  for (const c of ['y6', 'ks1', 'y3']) {
    const b = COURSES[c].bonus;
    assert.ok(b.blurb.length > 20 && b.blurb.length < 140, `${c} blurb is a short line`);
    assert.ok(b.prizeText && !/lightsaber/i.test(b.prizeText));
    assert.ok(COURSES[c].subjects.some((s) => s.id === b.subject));
  }
});

test('the prizes are never starters, show in the wardrobe as locked, and are not unlocked on day one', () => {
  for (const c of ['y6', 'ks1', 'y3', 'y8']) {
    setCourse(c);
    const prize = COURSE.bonus?.prize || [];
    for (const id of prize) {
      assert.ok(!starterAccessories().includes(id), `${c}: ${id} is not a starter`);
      assert.ok(wardrobeAccessories().has(id), `${c}: ${id} is in the wardrobe`);
      assert.equal(prizeOf(id), COURSE.bonus);
    }
    if (c === 'y8') for (const id of [...LAMPS, 'firstaid']) assert.ok(!starterAccessories().includes(id));
  }
});

for (const course of ['y6', 'ks1', 'y3']) {
  test(`${course}: every topic in the bonus deck is marked as the course's bonus, in its subject`, () => {
    setCourse(course);
    const decks = decksFor(COURSE_INDEX[course]);
    const deck = decks.find((d) => d.deck === `bonus-${COURSE.bonus.id}`);
    assert.ok(deck, 'the bonus deck is registered');
    assert.equal(deck.subject, COURSE.bonus.subject);
    for (const t of deck.topics) assert.equal(t.bonus, COURSE.bonus.id, `${t.id} carries bonus: '${COURSE.bonus.id}'`);
    const db = buildDB(decks);
    assert.deepEqual(new Set(bonusTopics(db)), new Set(deck.topics.map((t) => t.id)));
    // nothing outside the deck claims to be part of it
    for (const t of Object.values(db.topics)) if (t.bonus) assert.equal(t.deck, deck.deck, `${t.id}`);
  });

  test(`${course}: bonus topics are never new learning in the daily session, nor placed`, () => {
    const db = dbWithFake(course);
    const ids = bonusTopics(db);
    assert.equal(ids.length, 4);
    const state = newState(course, 20800);
    for (const s of COURSE.subjects) assert.ok(!topicChoices(state, db, s.id).some((t) => ids.includes(t)));
    assert.ok(!topoOrder(db, COURSE.bonus.subject).some((t) => ids.includes(t)));
    // 25 simulated days of the daily session: the bonus parts are never started by it
    const rng = makeRng('bonus-daily');
    for (let d = 20800; d < 20825; d++) {
      state.plan = planDay(state, db, d);
      startSession(state, d, d * 864e5);
      for (const step of state.plan.steps) if (step.t === 'placement') state.subjects[step.subject] = { ...(state.subjects[step.subject] || { ability: 0, attempts: 0, lastNew: null }), placed: true };
      answerAll(state, db, state.plan, d, () => rng.chance(0.85));
      finishSession(state, d * 864e5);
    }
    assert.ok(Object.keys(state.topics).length > 3, 'the daily session taught other topics');
    for (const id of ids) assert.equal(state.topics[id], undefined, `${id} was not started by the daily session`);
    assert.ok(!needsPlacement({ ...state, subjects: {} }, { ...db, topicOrder: { [COURSE.bonus.subject]: ids } }, COURSE.bonus.subject), 'bonus topics never need placing');
  });

  test(`${course}: a bonus session teaches the first part straight away (main-course prerequisites do not block it), leaving today's session alone`, () => {
    const db = dbWithFake(course);
    const ids = bonusTopics(db);
    const today = 20800;
    const state = newState(course, today);
    state.plan = planDay(state, db, today);
    startSession(state, today, today * 864e5);
    const daily = JSON.stringify(state.plan);
    assert.equal(bonusStatus(state, db, ids[0]), 'available');
    assert.equal(bonusStatus(state, db, ids[1]), 'locked');
    const plan = planBonus(state, db, today);
    assert.equal(plan.extra, true);
    assert.equal(plan.bonus, COURSE.bonus.id);
    const choose = plan.steps.find((s) => s.t === 'choose');
    assert.ok(choose?.bonus, 'a lesson is offered');
    assert.deepEqual(choose.options, [ids[0]]);
    const lastNew = state.subjects[COURSE.bonus.subject]?.lastNew ?? null;
    state.extra = plan;
    state.extraOn = true;
    assert.equal(activePlan(state), plan);
    answerAll(state, db, plan, today);
    state.extraOn = false;
    assert.ok(state.topics[ids[0]], 'the first part is started');
    assert.ok(plan.steps.filter((s) => s.t === 'intro').length >= 3, 'with the normal learn cards');
    assert.ok(plan.steps.some((s) => s.t === 'recall'), 'and the end-of-lesson recall');
    assert.equal(JSON.stringify(state.plan), daily, "today's session is exactly as it was");
    assert.equal(state.subjects[COURSE.bonus.subject]?.lastNew ?? null, lastNew, 'the subject keeps its turn for new learning');
  });

  test(`${course}: the parts come in order, reviews come back (in bonus and daily sessions), and finishing wins the prize once`, () => {
    const db = dbWithFake(course);
    const ids = bonusTopics(db);
    let today = 20800;
    const state = newState(course, today);
    const prize = COURSE.bonus.prize;
    for (const id of prize) assert.ok(!unlockedAccessories(state, db).has(id));
    let info = bonusCardInfo(state, db, today);
    assert.equal(info.button, 'Start the bonus topic');
    assert.match(info.prize, /^Finish it to win /);
    assert.equal(info.complete, false);

    const order = [];
    let sessions = 0;
    while (!bonusProgress(state, db).complete && sessions < 30) {
      const plan = bonusSession(state, db, today);
      for (const t of plan.topics || []) if (!order.includes(t)) order.push(t);
      sessions++;
      // two sessions some days, as a keen child might
      if (sessions % 2) today++;
      if (sessions === 2) {
        info = bonusCardInfo(state, db, today);
        assert.match(info.progress, /of 4 parts finished/);
        assert.equal(info.button, 'Carry on');
      }
    }
    assert.deepEqual(order, ids, 'taught in prerequisite order');
    const bp = bonusProgress(state, db);
    assert.ok(bp.complete, `complete after ${sessions} sessions`);
    if (process.env.BONUS_DEBUG) console.log(course, 'sessions to finish', sessions, 'days', today - 20800);
    assert.ok(sessions <= 16, `finishing takes a handful of sessions, not weeks (${sessions})`);
    for (const id of ids) assert.ok(topicLearned(state, db, id) && ['proficient', 'mastered'].includes(state.topics[id].state));
    for (const id of prize) assert.ok(unlockedAccessories(state, db).has(id), `${id} unlocked`);
    assert.equal(bp.won, false, 'not yet marked as won: the finished screen does that, once');
    state.bonusWon = { [COURSE.bonus.id]: today };
    info = bonusCardInfo(state, db, today);
    assert.equal(info.complete, true);
    assert.equal(info.eyebrow, 'Bonus topic complete ✓');
    assert.match(info.prize, /^You won /);
    assert.match(bonusLine(state, db), /4 of 4 parts finished.*Prize won/);

    // once won, the prize stays even if a part slips back
    state.topics[ids[2]] = { ...state.topics[ids[2]], state: 'learning', ema: 0.4 };
    assert.equal(bonusProgress(state, db).complete, false);
    for (const id of prize) assert.ok(unlockedAccessories(state, db).has(id), `${id} kept`);

    // bonus reviews come back in the daily session too
    const later = today + 40;
    const daily = planDay(state, db, later);
    assert.ok(daily.steps.some((s) => s.t === 'review' && ids.includes(db.items[s.id]?.topic)), 'bonus reviews in the daily session');
    // ...and the bonus session does not repeat ones already waiting there
    state.plan = daily;
    const waiting = new Set(daily.steps.map((s) => s.id).filter(Boolean));
    const bonusPlan = planBonus(state, db, later);
    assert.ok(bonusPlan.steps.every((s) => !s.id || !waiting.has(s.id)));
  });

  test(`${course}: when every lesson is done but a part is not secure, the bonus session offers a practice round`, () => {
    const db = dbWithFake(course);
    const ids = bonusTopics(db);
    let today = 20800;
    const state = newState(course, today);
    // get every part taught, with a lot wrong in the last one
    for (let i = 0; i < 30 && !ids.every((id) => topicLearned(state, db, id)); i++) {
      bonusSession(state, db, today, (step) => db.items[step.id].topic !== ids[3] || step.t === 'intro' || (step.id.length + step.t.length + i) % 2 === 0);
      today++;
    }
    assert.ok(ids.every((id) => topicLearned(state, db, id)), 'all taught');
    state.topics[ids[3]] = { ...state.topics[ids[3]], state: 'learning', ema: 0.55 };
    // the next day, with nothing due
    for (const c of Object.values(state.cards)) c.due = today + 5;
    const plan = planBonus(state, db, today);
    assert.ok(!plan.steps.some((s) => s.t === 'choose'), 'no lesson left');
    const practice = plan.steps.filter((s) => s.practice);
    assert.ok(practice.length >= 3, 'a practice round');
    assert.ok(practice.every((s) => db.items[s.id].topic === ids[3]), 'on the part that is not secure');
    assert.equal(bonusCardInfo(state, db, today).button, 'Carry on');
    // answering them well finishes it
    state.extra = plan;
    state.extraOn = true;
    answerAll(state, db, plan, today);
    assert.equal(state.topics[ids[3]].state, 'proficient');
    assert.ok(bonusProgress(state, db).complete);
  });
}

test('with nothing at all to do, the card says so rather than offering an empty session', () => {
  const db = dbWithFake('y6');
  const ids = bonusTopics(db);
  const today = 20800;
  const state = newState('y6', today);
  for (let i = 0; i < 12 && !ids.every((id) => topicLearned(state, db, id)); i++) bonusSession(state, db, today);
  for (const id of ids) state.topics[id] = { ...state.topics[id], state: 'proficient', ema: 0.95 };
  for (const c of Object.values(state.cards)) c.due = today + 5;
  const info = bonusCardInfo(state, db, today);
  assert.equal(info.complete, true);
  assert.equal(info.button, null);
  assert.equal(planBonus(state, db, today).steps.length, 1);
});

test('no bonus card for a course without one, or before its content exists', () => {
  setCourse('y8');
  const db8 = buildDB(decksFor('index-y8.json'));
  assert.equal(bonusProgress(newState('y8', 20800), db8), null);
  assert.equal(bonusCardInfo(newState('y8', 20800), db8, 20800), null);
  setCourse('y6');
  const empty = buildDB(decksFor('index.json').map((d) => (d.deck === 'bonus-electricity' ? { ...d, topics: [], items: [] } : d)));
  assert.equal(bonusCardInfo(newState('y6', 20800), empty, 20800), null);
});

test('tapping the lamp switches it off and on again, remembered on the companion (on by default)', () => {
  const state = newState('y6', 20800);
  assert.equal(isLit(state.profile.companion), true);
  assert.equal(toggleLit(state), false);
  assert.equal(state.profile.companion.lit, false);
  assert.equal(isLit(state.profile.companion), false);
  assert.equal(toggleLit(state), true);
  assert.equal(isLit(state.profile.companion), true);
  assert.ok(wearsLamp({ wear: { hold: 'lamp' } }));
  assert.ok(wearsLamp({ accessory: 'oillamp' }));
  assert.ok(!wearsLamp({ wear: { hold: 'firstaid' } }));
  assert.ok(!wearsLamp({}));
});
