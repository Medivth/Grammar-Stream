// Daily quests, the gentle streak with rest days, and the weekly challenge.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildDB } from '../js/core/content.js';
import { emptyState } from '../js/core/store.js';
import { setCourse, COURSES } from '../js/core/subjects.js';
import { weekStart } from '../js/core/dates.js';
import { streakInfo, streakCalendar, bestStreak, streakLine, REST_EVERY, REST_MAX, chooseQuests, ensureQuests, questStatus, todaysQuests, questRotation, answersOutside, sprintTarget, noteChapter, readingToday } from '../js/core/quests.js';
import { challengeTheme, challengeThisWeek, ghostFor, challengeStatus, challengeItems, challengePlan, runPosition, compareRuns, raceResult, resultLine, recordChallenge, CHALLENGE_GOAL } from '../js/core/weekly.js';
import { milestoneDefs } from '../js/core/progress.js';

const read = (p) => JSON.parse(readFileSync(new URL(`../content/${p}`, import.meta.url)));
const db = buildDB(read('index.json').decks.map(read));
const MON = weekStart(21000); // a Monday
const done = (state, ...days) => { for (const d of days) state.sessions.push({ day: d, start: 1, end: 2, answered: 5, correct: 5, completed: true }); return state; };
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

// --- streak -------------------------------------------------------------------------
test('no sessions: no streak, nothing banked, a friendly start line', () => {
  const s = emptyState(MON);
  const i = streakInfo(s, MON);
  assert.equal(i.streak, 0);
  assert.equal(i.bank, 0);
  assert.equal(i.fresh, false);
  assert.match(streakLine(i), /start a streak/);
});

test('a run of days counts up; today not done yet keeps yesterday’s streak', () => {
  const s = done(emptyState(MON), MON, MON + 1, MON + 2);
  assert.equal(streakInfo(s, MON + 2).streak, 3);
  assert.equal(streakInfo(s, MON + 2).doneToday, true);
  const i = streakInfo(s, MON + 3);
  assert.equal(i.streak, 3, 'today is not over, so nothing is lost');
  assert.equal(i.doneToday, false);
  assert.equal(i.days[MON + 3], undefined);
  assert.match(streakLine(i), /3-day streak\. Keep it going/);
});

test('every 7 days earns a rest day, at most 2 banked', () => {
  const s = done(emptyState(MON), ...range(MON, MON + 6));
  let i = streakInfo(s, MON + 6);
  assert.equal(i.streak, 7);
  assert.equal(i.bank, 1);
  assert.equal(i.toNext, REST_EVERY);
  done(s, ...range(MON + 7, MON + 13));
  assert.equal(streakInfo(s, MON + 13).bank, 2);
  assert.equal(streakInfo(s, MON + 13).toNext, null, 'full: nothing to count towards');
  done(s, ...range(MON + 14, MON + 20));
  i = streakInfo(s, MON + 20);
  assert.equal(i.streak, 21);
  assert.equal(i.bank, REST_MAX, 'never more than two');
});

test('a missed day uses a rest day instead of breaking the streak', () => {
  const s = done(emptyState(MON), ...range(MON, MON + 6), MON + 8);
  const i = streakInfo(s, MON + 8);
  assert.equal(i.days[MON + 7], 'rest');
  assert.equal(i.streak, 8, 'the rest day keeps it going, and does not count as a session');
  assert.equal(i.bank, 0);
  assert.equal(i.used, 1);
});

test('two missed days use two rest days; a third with none left starts afresh, kindly', () => {
  const s = done(emptyState(MON), ...range(MON, MON + 13)); // 14 days: 2 banked
  let i = streakInfo(s, MON + 16); // missed MON+14, MON+15; today MON+16 not done
  assert.deepEqual([i.days[MON + 14], i.days[MON + 15]], ['rest', 'rest']);
  assert.equal(i.streak, 14);
  assert.equal(i.bank, 0);
  i = streakInfo(s, MON + 17); // MON+16 also missed
  assert.equal(i.days[MON + 16], 'missed');
  assert.equal(i.streak, 0);
  assert.equal(i.fresh, true);
  assert.equal(streakLine(i), 'A fresh start today!');
  assert.equal(i.best, 14, 'the best streak is remembered');
  done(s, MON + 17);
  i = streakInfo(s, MON + 17);
  assert.equal(i.streak, 1);
  assert.equal(i.fresh, false);
});

test('a missed day with nothing banked restarts; a rest day earned after the restart is kept separately', () => {
  const s = done(emptyState(MON), MON, MON + 1, MON + 3, ...range(MON + 4, MON + 9));
  const i = streakInfo(s, MON + 9);
  assert.equal(i.days[MON + 2], 'missed');
  assert.equal(i.streak, 7);
  assert.equal(i.bank, 1);
});

test('a rest day earned on the seventh day covers the very next day; across the week boundary too', () => {
  // Thursday to Wednesday is 7 days, missing the Thursday after
  const s = done(emptyState(MON), ...range(MON + 3, MON + 9), MON + 11);
  const i = streakInfo(s, MON + 11);
  assert.equal(i.days[MON + 10], 'rest');
  assert.equal(i.streak, 8);
});

test('several sessions on one day count once; unfinished sessions do not count', () => {
  const s = done(emptyState(MON), MON, MON, MON + 1);
  s.sessions.push({ day: MON + 2, completed: false });
  const i = streakInfo(s, MON + 3);
  assert.equal(i.streak, 0, 'MON+2 missed with nothing banked');
  assert.equal(i.best, 2);
});

test('the calendar: four Monday-first weeks ending this week, with each day’s status', () => {
  const today = MON + 23; // Wednesday of the fourth week
  const s = done(emptyState(MON), ...range(MON, MON + 6), ...range(MON + 8, MON + 22));
  const { weeks, info } = streakCalendar(s, today);
  assert.equal(weeks.length, 4);
  assert.ok(weeks.every((w) => w.length === 7));
  assert.equal(weeks[0][0].day, MON, 'starts on a Monday');
  assert.equal(weeks[1][0].status, 'rest');
  assert.equal(weeks[3][2].status, 'open');
  assert.equal(weeks[3][2].today, true);
  assert.equal(weeks[3][3].status, 'future');
  assert.equal(info.streak, 22);
  const before = streakCalendar(done(emptyState(MON), MON + 20), MON + 21).weeks;
  assert.equal(before[0][0].status, 'before');
});

test('best streak for the badges, and the two streak badges are in every course', () => {
  const s = done(emptyState(MON), ...range(MON, MON + 9));
  assert.equal(bestStreak(s), 10);
  assert.equal(bestStreak(emptyState(MON)), 0);
  for (const id of Object.keys(COURSES)) {
    setCourse(id);
    const defs = milestoneDefs();
    for (const b of ['on-a-roll', 'steady']) {
      const m = defs.find((x) => x.id === b);
      assert.ok(m, `${id} has ${b}`);
      assert.equal(m.unlock, undefined, 'a streak badge changes no existing reward');
    }
    assert.equal(defs.find((x) => x.id === 'on-a-roll').measure(s), 10);
  }
  setCourse('y6');
});

// --- quests -------------------------------------------------------------------------
test('each course has its own rotation', () => {
  assert.deepEqual(questRotation(COURSES.ks1), ['read', 'talk', 'sprint', 'handwriting', 'chapter', 'bonus', 'writing']);
  assert.deepEqual(questRotation(COURSES.y6), ['read', 'extra', 'sprint', 'chapter', 'bonus', 'writing']);
  assert.deepEqual(questRotation(COURSES.y8), ['read', 'extra', 'sprint', 'chapter', 'writing']);
});

test('three quests a day, the session first, deterministic, and turning over day by day', () => {
  setCourse('y6');
  const s = done(emptyState(MON), MON - 1);
  const seen = new Set();
  for (let d = MON; d < MON + 7; d++) {
    const a = chooseQuests(s, db, d), b = chooseQuests(s, db, d);
    assert.deepEqual(a, b, 'the same day gives the same quests');
    assert.equal(a.length, 3);
    assert.equal(a[0].id, 'session');
    assert.equal(new Set(a.map((q) => q.id)).size, 3, 'no repeats');
    a.slice(1).forEach((q) => seen.add(q.id));
  }
  assert.ok(seen.size >= 3, `a variety over the week: ${[...seen]}`);
});

test('quests not open today are skipped (no sprint before the first session, no Latin with nothing to do)', () => {
  setCourse('y6');
  const s = emptyState(MON);
  for (let d = MON; d < MON + 6; d++) {
    const ids = chooseQuests(s, db, d).map((q) => q.id);
    assert.ok(!ids.includes('sprint'), 'the sprint starts after the first session');
  }
  setCourse('y8');
  const y8 = emptyState(MON);
  y8.course = 'y8';
  for (let d = MON; d < MON + 5; d++) assert.ok(!chooseQuests(y8, db, d).some((q) => q.id === 'bonus'), 'Year 8 has no bonus topic');
  setCourse('y6');
});

test('the day’s quests are kept once chosen, and a new set comes the next day', () => {
  setCourse('y6');
  const s = done(emptyState(MON), MON - 1);
  const q1 = ensureQuests(s, db, MON);
  s.sessions.push({ day: MON, completed: true }); // what is open changes during the day...
  assert.equal(ensureQuests(s, db, MON), q1, '...but the quests stay put');
  assert.equal(ensureQuests(s, db, MON + 1).day, MON + 1);
});

test('completion comes only from real state', () => {
  setCourse('ks1');
  const s = emptyState(MON);
  s.course = 'ks1';
  const st = (id, extra = {}) => questStatus({ id, ...extra }, s, db, MON, COURSES.ks1).done;
  assert.equal(st('session'), false);
  s.sessions.push({ day: MON, completed: false });
  assert.equal(st('session'), false, 'started is not finished');
  s.sessions[0].completed = true;
  assert.equal(st('session'), true);

  s.reading.push({ day: MON, minutes: 5 });
  assert.equal(st('read'), false);
  assert.match(questStatus({ id: 'read' }, s, db, MON, COURSES.ks1).hint, /5 of 10/);
  s.reading.push({ day: MON, minutes: 6, lib: 'x' });
  assert.equal(readingToday(s, MON), 11);
  assert.equal(st('read'), true, 'logged and library minutes add up');
  s.reading.push({ day: MON - 1, minutes: 60 });
  assert.equal(readingToday(s, MON), 11, 'only today counts');

  assert.equal(st('talk'), false);
  s.talks = [{ day: MON - 1, q: 'talk.1' }];
  assert.equal(st('talk'), false);
  s.talks.push({ day: MON, q: 'talk.2' });
  assert.equal(st('talk'), true);

  assert.equal(st('handwriting'), false);
  s.handwriting.days.push(MON);
  assert.equal(st('handwriting'), true);

  assert.equal(st('sprint', { target: 8 }), false);
  s.sprints.push({ day: MON, level: 1, answered: 9, correct: 7 });
  assert.equal(st('sprint', { target: 8 }), false);
  s.sprints.push({ day: MON, level: 1, answered: 9, correct: 8 });
  assert.equal(st('sprint', { target: 8 }), true);

  assert.equal(st('chapter'), false);
  assert.equal(noteChapter(s, 'book', 0, MON), true);
  assert.equal(noteChapter(s, 'book', 0, MON), false, 'once per chapter a day');
  assert.equal(st('chapter'), true);

  assert.equal(st('writing'), false);
  s.pieces.push({ id: 'p', promptId: 'x', startDay: MON });
  assert.equal(st('writing'), true);
  setCourse('y6');
});

test('extra practice counts answers outside the daily session only', () => {
  setCourse('y6');
  const s = emptyState(MON);
  const latin = Object.values(db.items).filter((i) => i.subject === 'latin' && i.kind === 'fact').slice(0, 8).map((i) => i.id);
  assert.ok(latin.length >= 6);
  const maths = Object.values(db.items).find((i) => i.subject === 'maths').id;
  s.plan = { day: MON, steps: [], pos: 0, results: [] };
  // three Latin reviews in today's session do not count
  for (const id of latin.slice(0, 3)) { s.log.push([MON, 0, id, 1, 3]); s.plan.results.push({ id, t: 'review', correct: true }); }
  s.log.push([MON, 0, maths, 1, 3]);
  s.log.push([MON, 0, latin[3], 1, null, null, null, null, 'placement']); // the level check is part of the session
  s.log.unshift([MON - 1, 0, latin[4], 1, 3]); // yesterday (the log is in time order)
  const isLatin = (it) => it.subject === 'latin';
  assert.equal(answersOutside(s, db, MON, isLatin), 0);
  assert.equal(questStatus({ id: 'extra' }, s, db, MON, COURSES.y6).done, false);
  for (const id of latin.slice(0, 5)) s.log.push([MON, 0, id, 1, 3]);
  assert.equal(answersOutside(s, db, MON, isLatin), 5);
  assert.equal(questStatus({ id: 'extra' }, s, db, MON, COURSES.y6).done, true);
  // or a short extra practice finished today, with whatever was ready
  const t = emptyState(MON);
  t.extra = { day: MON, subject: 'latin', finished: true, results: [{ id: latin[0], correct: true }] };
  assert.equal(questStatus({ id: 'extra' }, t, db, MON, COURSES.y6).done, true);
  t.extra = { day: MON, subject: 'science', bonus: 'electricity', finished: true, results: [{ id: latin[0], correct: true }] };
  assert.equal(questStatus({ id: 'extra' }, t, db, MON, COURSES.y6).done, false, 'a bonus session is not Latin');
  assert.equal(questStatus({ id: 'bonus' }, t, db, MON, COURSES.y6).done, true);
});

test('the sprint target follows her recent best, within sensible bounds', () => {
  const s = emptyState(MON);
  assert.equal(sprintTarget(s, COURSES.ks1), 5);
  s.sprints.push({ day: 1, level: 1, answered: 9, correct: 8 });
  assert.equal(sprintTarget(s, COURSES.ks1), 8);
  s.sprints.push({ day: 2, level: 2, answered: 30, correct: 28 });
  assert.equal(sprintTarget(s, COURSES.ks1), 10);
  assert.equal(sprintTarget(s, COURSES.y8), 15);
});

test('all three done is noticed, and the celebration is remembered', () => {
  setCourse('ks1');
  const s = emptyState(MON);
  s.course = 'ks1';
  s.quests = { day: MON, list: [{ id: 'session' }, { id: 'read' }, { id: 'talk' }], celebrated: false };
  let t = todaysQuests(s, db, MON, COURSES.ks1);
  assert.equal(t.done, 0);
  assert.equal(t.all, false);
  done(s, MON);
  s.reading.push({ day: MON, minutes: 10 });
  s.talks = [{ day: MON, q: 'talk.1' }];
  t = todaysQuests(s, db, MON, COURSES.ks1);
  assert.equal(t.done, 3);
  assert.equal(t.all, true);
  assert.equal(t.celebrated, false);
  setCourse('y6');
});

// --- weekly challenge ---------------------------------------------------------------
test('a theme for each course: a Grand Prix, a rocket race, an Olympiad', () => {
  assert.equal(challengeTheme(COURSES.ks1).id, 'grandprix');
  assert.equal(challengeTheme(COURSES.y3).id, 'grandprix');
  assert.equal(challengeTheme(COURSES.y6).id, 'rocket');
  assert.equal(challengeTheme(COURSES.y8).id, 'olympiad');
});

const run = (o) => ({ correct: 10, answered: 11, ms: 80000, finished: true, times: range(1, 10).map((k) => k * 8000), ...o });

test('once a week: it resets on Monday, and last week’s run becomes the ghost', () => {
  const s = emptyState(MON);
  assert.equal(challengeStatus(s, MON + 2).open, true);
  assert.equal(ghostFor(s, MON + 2), null);
  assert.equal(recordChallenge(s, run(), MON + 2), true);
  assert.equal(recordChallenge(s, run({ ms: 1000 }), MON + 4), false, 'a second go the same week is not stored');
  assert.equal(challengeThisWeek(s, MON + 6).ms, 80000, 'Sunday is still the same week');
  assert.equal(challengeStatus(s, MON + 6).open, false);
  assert.equal(challengeStatus(s, MON + 7).open, true, 'open again on Monday');
  const g = ghostFor(s, MON + 7);
  assert.equal(g.ms, 80000);
  assert.equal(g.weeksAgo, 1);
  assert.equal(ghostFor(s, MON + 6), null, 'this week’s own run is not its ghost');
  assert.equal(ghostFor(s, MON + 21).weeksAgo, 3, 'a missed week or two: the most recent run');
  recordChallenge(s, run({ ms: 70000 }), MON + 8);
  assert.equal(ghostFor(s, MON + 14).ms, 70000, 'always the latest earlier week');
  assert.equal(challengeStatus(s, MON + 8).nextWeek, MON + 14);
});

test('the ghost glides between its right answers and stops where it stopped', () => {
  const g = run({ finished: false, correct: 3, ms: 120000, times: [10000, 20000, 40000] });
  assert.equal(runPosition(g, 0), 0);
  assert.equal(runPosition(g, 5000), 0.05);
  assert.equal(runPosition(g, 10000), 0.1);
  assert.equal(runPosition(g, 30000), 0.25);
  assert.equal(runPosition(g, 100000), 0.3);
  assert.equal(runPosition(run(), 80000), 1);
  assert.equal(runPosition(run(), 999999), 1);
  assert.equal(runPosition(null, 5000), 0);
});

test('race results: finishing first wins, then sooner, then more right; kind words either way', () => {
  const ghost = { ...run({ ms: 80000 }), weeksAgo: 1 };
  assert.deepEqual(raceResult(run({ ms: 71000 }), ghost), { kind: 'beat', by: 9, unit: 'seconds' });
  assert.deepEqual(raceResult(run({ ms: 83000 }), ghost), { kind: 'behind', by: 3, unit: 'seconds' });
  assert.deepEqual(raceResult(run({ ms: 80300 }), ghost), { kind: 'level' });
  const slow = { ...run({ finished: false, correct: 7, ms: 120000 }), weeksAgo: 1 };
  assert.deepEqual(raceResult(run(), slow), { kind: 'beat', by: 3, unit: 'answers' });
  assert.deepEqual(raceResult(run({ finished: false, correct: 9 }), slow), { kind: 'beat', by: 2, unit: 'answers' });
  assert.deepEqual(raceResult(run({ finished: false, correct: 7 }), slow), { kind: 'level' });
  assert.deepEqual(raceResult(run({ finished: false, correct: 6 }), ghost), { kind: 'behind', by: 4, unit: 'answers' });
  assert.equal(raceResult(run(), null).kind, 'first');
  assert.ok(compareRuns(run(), slow) > 0 && compareRuns(slow, run()) < 0);
  assert.ok(compareRuns(run({ ms: 1 }), run()) > 0);
  assert.equal(resultLine({ kind: 'beat', by: 3, unit: 'answers' }, ghost).head, 'You beat last week’s you by 3!');
  assert.match(resultLine({ kind: 'beat', by: 1, unit: 'seconds' }, ghost).head, /by 1 second!$/);
  assert.match(resultLine({ kind: 'beat', by: 2, unit: 'answers' }, { ...ghost, weeksAgo: 2 }).head, /your last run/);
  const behind = resultLine({ kind: 'behind', by: 2, unit: 'answers' }, ghost);
  assert.doesNotMatch(`${behind.head} ${behind.text}`, /lost|fail|bad|worse|only/i);
});

test('race questions: secure, known, quick facts mixed with sums; the same all week', () => {
  setCourse('y6');
  const s = emptyState(MON);
  assert.equal(challengeItems(s, db, MON).length, 0, 'nothing secure yet');
  assert.ok(challengePlan(s, db, MON).steps.every((x) => x.sum), 'all sums then');
  const topic = Object.values(db.topics).find((t) => t.subject === 'history' && (db.itemsByTopic[t.id] || []).filter((id) => db.items[id].kind === 'fact' && !db.items[id].visual).length >= 8);
  s.topics[topic.id] = { state: 'proficient', ema: 0.9, n: 10 };
  for (const id of db.itemsByTopic[topic.id]) s.cards[id] = { state: 'review', s: 5, d: 5, lastDay: MON - 3, due: MON + 9 };
  s.cards['not-an-item'] = { state: 'review', s: 5 };
  const items = challengeItems(s, db, MON);
  assert.ok(items.length >= 6 && items.length <= 12);
  for (const id of items) {
    const it = db.items[id];
    assert.equal(it.topic, topic.id);
    assert.ok(!it.visual && !it.map && !it.passage);
  }
  assert.deepEqual(challengeItems(s, db, MON + 5), items, 'the same questions all week');
  const plan = challengePlan(s, db, MON);
  assert.ok(plan.steps[0].item && plan.steps[1].sum, 'a fact, then a sum');
  assert.ok(plan.steps.length >= CHALLENGE_GOAL * 2);
});
