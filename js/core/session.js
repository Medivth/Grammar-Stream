// Daily session: plan building, answer grading and state updates.
// Everything here is pure data manipulation so it runs (and is tested) in Node.

import { createFSRS, Rating } from './fsrs.js';
import { eloUpdate } from './elo.js';
import { recordTopicAttempt, topicStatus } from './mastery.js';
import { check } from './checkers.js';
import { present } from './present.js';
import { makeRng } from './rng.js';
import { sprintDue, sprintSeconds } from './sprint.js';
import { SUBJECTS, SUBJECT_BY_ID, PLACEMENT_ORDER, COURSE } from './subjects.js';
import { monthKey } from './dates.js';
import { needsPlacement } from './placement.js';

// placement runs for one subject a day, in this order, until all are placed
export { PLACEMENT_ORDER } from './subjects.js';

export const FAST_MS = { choice: 4000, typed: 8000, map: 5000, order: 12000, numberline: 6000, cloze: 10000 };
export const CONF = { guess: 0, think: 1, sure: 2 };
const GRADED = new Set(['review', 'quiz', 'diag', 'practice', 'faded', 'recall']);
const MAX_REASKS = 6;

const schedulers = {};
export function fsrsFor(subject) {
  const r = SUBJECT_BY_ID[subject]?.retention ?? 0.9;
  return (schedulers[r] ||= createFSRS({ retention: r }));
}

/** Rough seconds per step, for fitting new learning into the session she has set. */
export const STEP_SECONDS = { review: 18, quiz: 18, recall: 20, intro: 12, practice: 40, worked: 40, faded: 45, sentence: 120, yesterday: 25, written: 600 };
// a new fact costs its learn card, its quick check and (often) the end-of-session recall
const NEW_ITEM_SECONDS = STEP_SECONDS.intro + STEP_SECONDS.quiz + STEP_SECONDS.recall;
const TOPUP_SECONDS = STEP_SECONDS.intro + STEP_SECONDS.quiz;

export function budgets(minutes) {
  return {
    reviews: Math.round(minutes * 1.3),
    newFacts: minutes >= 30 ? 8 : minutes >= 20 ? 6 : 4,
    practice: minutes >= 30 ? 4 : 3,
  };
}

export function dueItems(state, db, today) {
  const out = [];
  for (const [id, c] of Object.entries(state.cards)) {
    const item = db.items[id];
    if (!item || item.kind === 'written' || c.state === 'new' || c.due > today) continue;
    out.push({ id, subject: item.subject, topic: item.topic, r: fsrsFor(item.subject).retrievability(c.s, today - c.lastDay) });
  }
  return out.sort((a, b) => a.r - b.r);
}

/**
 * Order items so no two consecutive share a topic (when that is possible), preferring
 * a change of subject and otherwise keeping the lowest-retrievability items early.
 */
export function interleave(list, rng) {
  const pool = list.slice();
  const out = [];
  while (pool.length) {
    const prev = out[out.length - 1];
    const counts = {};
    for (const x of pool) counts[x.topic] = (counts[x.topic] || 0) + 1;
    const [bigTopic, bigCount] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    let idx;
    if (bigCount * 2 >= pool.length && (!prev || prev.topic !== bigTopic)) {
      // one topic dominates what is left: take it now or we will be forced to repeat it later
      idx = pool.findIndex((x) => x.topic === bigTopic);
    } else {
      const eligible = [];
      for (let i = 0; i < pool.length && eligible.length < 3; i++) {
        const x = pool[i];
        if (!prev || (x.topic !== prev.topic && x.subject !== prev.subject)) eligible.push(i);
      }
      if (!eligible.length) {
        for (let i = 0; i < pool.length && eligible.length < 3; i++) if (!prev || pool[i].topic !== prev.topic) eligible.push(i);
      }
      idx = eligible.length ? rng.pick(eligible) : 0;
    }
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

function selectReviews(due, budget) {
  const cap = Math.ceil(budget * 0.4);
  const counts = {};
  const chosen = [];
  const take = (limit) => {
    for (const d of due) {
      if (chosen.length >= budget) break;
      if (chosen.includes(d)) continue;
      if ((counts[d.subject] || 0) >= limit) continue;
      chosen.push(d);
      counts[d.subject] = (counts[d.subject] || 0) + 1;
    }
  };
  take(cap);
  take(Math.ceil(budget * 0.6));
  return chosen;
}

function unintroduced(state, db, topicId) {
  return (db.itemsByTopic[topicId] || []).filter((id) => !state.cards[id] && !['template', 'written'].includes(db.items[id].kind) && !db.items[id].reserve);
}

/** Share of a topic's questions she has been taught (templates and written answers aside). */
export function coverage(state, db, topicId) {
  const ids = (db.itemsByTopic[topicId] || []).filter((id) => !['template', 'written'].includes(db.items[id].kind) && !db.items[id].reserve);
  return ids.length ? ids.filter((id) => state.cards[id]).length / ids.length : 1;
}

/**
 * How well she is doing lately: the share right in her last 60 graded answers over the past
 * fortnight (null until there are 20). It sets the pace: strong form brings more new learning.
 */
export function recentForm(state, today) {
  const recent = (state.log || []).filter((e) => e[0] >= today - 14).slice(-60);
  return recent.length >= 20 ? recent.filter((e) => e[3]).length / recent.length : null;
}

/** Extra new questions per topic batch when she is flying; one fewer while she is struggling. */
export function rampBonus(state, today) {
  const f = recentForm(state, today);
  return f == null ? 0 : f >= 0.92 ? 2 : f >= 0.85 ? 1 : f < 0.7 ? -1 : 0;
}

/**
 * Questions not yet taught in topics that are already secure. Without these, a topic marked
 * secure after its first batch would keep its other questions unseen for good. A few are
 * mixed into each session, one subject after another, oldest topic first.
 */
export function topUpItems(state, db, n) {
  if (n <= 0) return [];
  const bySubject = SUBJECTS.map((s) => (db.topicOrder[s.id] || [])
    .filter((tid) => ['proficient', 'mastered'].includes(state.topics[tid]?.state))
    .flatMap((tid) => unintroduced(state, db, tid).slice(0, 3)));
  return alternate(...bySubject).slice(0, n);
}

function templatesOf(db, topicId) {
  return (db.itemsByTopic[topicId] || []).filter((id) => db.items[id].kind === 'template');
}

/** Topics she could start or continue in a subject, best first (max 3). */
export function topicChoices(state, db, subject) {
  const continuing = [], fresh = [], unfinished = [];
  for (const tid of db.topicOrder[subject] || []) {
    const t = db.topics[tid];
    const st = topicStatus(t, state.topics, db);
    if (st === 'locked') continue;
    const hasNewFacts = unintroduced(state, db, tid).length > 0;
    const hasTemplates = templatesOf(db, tid).length > 0;
    if (st === 'available') fresh.push(tid);
    else if (st === 'learning' && (hasNewFacts || hasTemplates)) continuing.push(tid);
    // secure (or marked mastered under the old rules) but with questions still to teach:
    // carry on with it too. Last year's course (after moving up) is left to the top-ups.
    else if ((st === 'proficient' || st === 'mastered') && hasNewFacts && (!COURSE.prev || t.deck?.startsWith(COURSE.id))) unfinished.push(tid);
  }
  // at most one of the two "carry on" places goes to finishing a secure topic
  continuing.push(...unfinished.slice(0, continuing.length < 2 ? 1 : 0));
  // Topics in a strand (phonics) take turns with the rest, starting with whichever has less
  // under way; after moving up, this year's new topics alternate with any left from last year.
  const strand = (tid) => db.topics[tid].strand || '';
  const busy = (k) => continuing.slice(0, 2).filter((tid) => strand(tid) === k).length;
  const balance = (list) => {
    const groups = [...new Set(list.map(strand))].sort((a, b) => busy(a) - busy(b)).map((k) => list.filter((tid) => strand(tid) === k));
    return alternate(...groups);
  };
  const own = fresh.filter((tid) => db.topics[tid].deck?.startsWith(COURSE.id));
  const older = fresh.filter((tid) => !own.includes(tid));
  return [...continuing.slice(0, 2), ...alternate(balance(own), balance(older))].slice(0, 3);
}

/** Take one from each list in turn: alternate([a, b], [c]) is [a, c, b]. */
function alternate(...lists) {
  const out = [];
  for (let i = 0; i < Math.max(0, ...lists.map((l) => l.length)); i++) for (const l of lists) if (i < l.length) out.push(l[i]);
  return out;
}

export function pickNewSubject(state, db, today, dueBySubject, cap) {
  const order = SUBJECTS.map((s) => s.id);
  const rot = today % order.length;
  const rotated = [...order.slice(rot), ...order.slice(0, rot)];
  // subjects take turns; one with a pile of reviews waits a few days longer, rather than
  // missing out altogether (that let one subject hog the new learning)
  const waitFor = (s) => (state.subjects[s]?.lastNew ?? -1) + ((dueBySubject[s] || 0) > cap ? 3 : 0);
  const candidates = rotated.filter((s) => topicChoices(state, db, s).length);
  candidates.sort((a, b) => waitFor(a) - waitFor(b));
  return candidates[0] || null;
}

/** The written answer for today, if one is due: a started topic where she has already met the
 * material (three answered items on the same passage, or in the topic when nothing else shares
 * it), not answered in the last three weeks, and no more than two written answers a week.
 * Subjects take turns: the one written in least recently goes first. */
export function writtenDue(state, db, today) {
  const recent = (state.answers || []).filter((a) => today - a.day < 7).length;
  if (recent >= 2) return null;
  const last = {}, lastBySubject = {};
  for (const a of state.answers || []) {
    last[a.itemId] = Math.max(last[a.itemId] ?? -1, a.day);
    const sub = db.items[a.itemId]?.subject;
    if (sub) lastBySubject[sub] = Math.max(lastBySubject[sub] ?? -1, a.day);
  }
  const met = (it) => {
    const ids = (db.itemsByTopic[it.topic] || []).filter((id) => id !== it.id && db.items[id].kind !== 'written');
    const same = it.passage ? ids.filter((id) => db.items[id].passage === it.passage) : [];
    return (same.length ? same : ids).filter((id) => state.cards[id]).length >= 3;
  };
  const due = Object.values(db.items).filter((it) => it.kind === 'written' && state.topics[it.topic] && !(last[it.id] >= today - 21) && met(it));
  due.sort((a, b) => (lastBySubject[a.subject] ?? -1) - (lastBySubject[b.subject] ?? -1));
  return due[0]?.id || null;
}

function sentenceOptions(state, db, today = 0) {
  const n = db.sentences.length || 1;
  const rot = (i) => (((i - today * 3) % n) + n) % n;
  const done = {};
  for (const w of state.writing) if (w.taskId) done[w.taskId] = Math.max(done[w.taskId] ?? -1, w.day);
  const sorted = db.sentences
    .map((s, i) => ({ s, i, last: done[s.id] ?? -1 }))
    // ones not done yet rotate day by day, so a skipped choice is not offered again tomorrow
    .sort((a, b) => a.last - b.last || rot(a.i) - rot(b.i));
  return sorted.slice(0, 3).map((x) => x.s.id);
}

export function planDay(state, db, today) {
  const rng = makeRng(`plan:${today}:${state.created}`);
  const b = budgets(state.settings.sessionMinutes);
  const due = dueItems(state, db, today);
  const dueBy = {};
  for (const d of due) dueBy[d.subject] = (dueBy[d.subject] || 0) + 1;
  const sprint = sprintDue(state);
  const written = writtenDue(state, db, today);
  const form = recentForm(state, today);
  // when nearly everything comes back right, reviews make room for new learning
  const reviewBudget = Math.round(b.reviews * (form >= 0.92 ? 0.7 : form >= 0.85 ? 0.85 : 1));
  const reviews = interleave(selectReviews(due, reviewBudget - (sprint ? 2 : 0) - (written ? 4 : 0)), rng);
  // a subject with a pile of reviews waits a little longer for new learning, unless she is doing well
  const cap = form >= 0.85 ? Infinity : Math.ceil(b.reviews * 0.4);
  const placeSubject = PLACEMENT_ORDER.find((s) => needsPlacement(state, db, s)) || null;
  // after placing a subject, start its next topic straight away
  const subject = placeSubject || pickNewSubject(state, db, today, dueBy, cap);
  // light review days (early on, or after a quiet spell) get a second new topic from another subject
  // the time left after reviews and the fixed parts goes on new learning
  const fixed = reviews.length * STEP_SECONDS.review + (sprint ? sprintSeconds() + 15 : 0) + (written ? STEP_SECONDS.written : 0)
    + STEP_SECONDS.sentence + (state.lastFeedback && state.lastFeedback.day < today ? STEP_SECONDS.yesterday : 0);
  const room = Math.max(0, state.settings.sessionMinutes * 60 - fixed);
  const newItems = Math.max(subject ? 3 : 0, Math.floor(room / NEW_ITEM_SECONDS));
  let second = null;
  if (subject && !placeSubject && newItems >= 10 && (reviews.length < b.reviews * 0.6 || form >= 0.9)) {
    const others = { ...state, subjects: { ...state.subjects, [subject]: { ...(state.subjects[subject] || {}), lastNew: today } } };
    second = pickNewSubject(others, db, today, dueBy, cap);
    if (second === subject) second = null;
  }

  const steps = [];
  const yesterday = state.lastFeedback && state.lastFeedback.day < today ? yesterdayEntries(state.lastFeedback) : [];
  if (yesterday.length) steps.push({ t: 'yesterday' });
  if ((state.answers || []).some((a) => a.mark && !a.seen)) steps.push({ t: 'marked' });
  if (sprint) steps.push({ t: 'sprint' });
  // she picks which subject to check; the default (first in order) stands if she doesn't
  if (placeSubject) steps.push({ t: 'placement', subject: placeSubject, options: PLACEMENT_ORDER.filter((s) => needsPlacement(state, db, s)) });
  const split = reviews.length >= 10 ? Math.ceil(reviews.length * 0.6) : reviews.length;
  reviews.slice(0, split).forEach((r) => steps.push({ t: 'review', id: r.id }));
  if (split < reviews.length) {
    steps.push({ t: 'break' });
    reviews.slice(split).forEach((r) => steps.push({ t: 'review', id: r.id }));
  }
  if (written) steps.push({ t: 'written', id: written });
  if (subject) steps.push({ t: 'choose', subject, options: topicChoices(state, db, subject), afterPlacement: !!placeSubject });
  if (second) steps.push({ t: 'choose', subject: second, options: topicChoices(state, db, second) });
  // a few untaught questions from topics already secure, in whatever time the new topics leave
  // (none while she is finding things hard)
  const perTopic = subject ? Math.max(3, Math.floor(newItems / (second ? 2 : 1))) : 0;
  const spare = room - perTopic * (second ? 2 : 1) * NEW_ITEM_SECONDS;
  const topUpCount = form != null && form < 0.7 ? 0 : Math.min(COURSE.young ? 2 : 4, Math.max(COURSE.young ? 1 : 2, Math.floor(spare / TOPUP_SECONDS)));
  const topUp = topUpItems(state, db, topUpCount);
  for (let i = 0; i < topUp.length; i += 3) {
    const group = topUp.slice(i, i + 3);
    group.forEach((id) => { if (db.topics[db.items[id].topic].kind !== 'reading') steps.push({ t: 'intro', id, topUp: true }); });
    rng.shuffle(group).forEach((id) => steps.push({ t: 'quiz', id, topUp: true }));
  }
  const sOpts = sentenceOptions(state, db, today);
  if (sOpts.length) steps.push({ t: 'sentence', options: sOpts });
  steps.push({ t: 'ritual' });
  steps.push({ t: 'done' });
  return { day: today, steps, pos: 0, results: [], yesterday, subject, topic: null, reasks: 0, started: null, dueTotal: due.length, perTopic };
}

function yesterdayEntries(fb) {
  // mistakes, and right answers that were only guesses; ones she knew are not worth the time
  const wrong = fb.entries.filter((e) => !e.correct);
  const guessed = fb.entries.filter((e) => e.correct && e.conf === CONF.guess);
  const seen = new Set();
  return [...wrong, ...guessed].filter((e) => !seen.has(e.itemId) && seen.add(e.itemId)).slice(0, 8);
}

/** The plan being played: the extra language practice while it is open, otherwise today's session. */
export const activePlan = (state) => (state.extraOn && state.extra) || state.plan;

/**
 * Extra practice in one subject (Latin, Greek), open any time of day: its reviews that are due
 * (not ones still waiting in today's session), then the next topic if one is ready. It never
 * touches today's main session, which carries on as normal.
 */
export function planExtra(state, db, today, subject) {
  const daily = state.plan?.day === today && !state.plan.finished ? state.plan : null;
  const waiting = new Set((daily ? daily.steps.slice(daily.pos) : []).map((s) => s.id).filter(Boolean));
  const rng = makeRng(`extra:${today}:${subject}:${state.sessions.length}`);
  const due = dueItems(state, db, today).filter((d) => d.subject === subject && !waiting.has(d.id));
  const steps = interleave(due.slice(0, 12), rng).map((r) => ({ t: 'review', id: r.id }));
  const options = topicChoices(state, db, subject);
  if (options.length) steps.push({ t: 'choose', subject, options });
  steps.push({ t: 'done' });
  return { day: today, extra: true, subject, steps, pos: 0, results: [], yesterday: [], reasks: 0, started: Date.now() };
}

/** What an extra-practice card can promise: reviews due now and whether a new topic is ready. */
export function extraStatus(state, db, today, subject) {
  return { due: dueItems(state, db, today).filter((d) => d.subject === subject).length, fresh: topicChoices(state, db, subject).length > 0 };
}

/** Expand the chosen topic into lesson steps inserted after the choose step. */
export function chooseTopic(state, db, topicId, today) {
  const plan = activePlan(state);
  const topic = db.topics[topicId];
  const b = budgets(state.settings.sessionMinutes);
  const started = !!state.topics[topicId];
  const steps = [];
  let recall = [];
  if (!started && topic.diagnostic?.length) {
    steps.push({ t: 'intro-topic', topic: topicId });
    topic.diagnostic.forEach((id) => steps.push({ t: 'diag', id }));
    steps.push({ t: 'diag-summary', topic: topicId });
  } else if (!started && topic.intro) {
    steps.push({ t: 'intro-topic', topic: topicId });
  }
  const tmpl = templatesOf(db, topicId);
  const fresh = unintroduced(state, db, topicId).filter((id) => !(topic.diagnostic || []).includes(id));
  if (tmpl.length) {
    const t0 = tmpl.find((id) => !state.cards[id]) || tmpl[Math.floor(today % tmpl.length)];
    const firstTime = !state.cards[t0];
    if (firstTime) {
      steps.push({ t: 'worked', id: t0, level: db.items[t0].levels[0] });
      steps.push({ t: 'faded', id: t0, level: db.items[t0].levels[0] });
    }
    for (let i = 0; i < b.practice; i++) steps.push({ t: 'practice', id: t0, level: firstTime && i === 0 ? db.items[t0].levels[0] : undefined });
  }
  if (fresh.length && (!tmpl.length || topic.kind !== 'skill')) {
    const bonus = rampBonus(state, today);
    // a bigger batch when she is flying, but never more than today's time allows
    const batch = fresh.slice(0, Math.max(3, Math.min((topic.batch || b.newFacts) + bonus, plan.perTopic || Infinity)));
    // reading comprehension: answer from the passage straight away, no learn card, in the author's order
    if (topic.kind === 'reading') batch.forEach((id) => steps.push({ t: 'quiz', id }));
    else for (let i = 0; i < batch.length; i += 3) {
      const group = batch.slice(i, i + 3);
      group.forEach((id) => steps.push({ t: 'intro', id }));
      makeRng(`quiz:${today}:${i}`).shuffle(group).forEach((id) => steps.push({ t: 'quiz', id }));
    }
    // recall today's new facts once more near the end, from memory where the format allows:
    // a second retrieval after a gap is what makes new learning stick
    if (topic.kind !== 'reading') recall = makeRng(`recall:${today}:${topicId}`).shuffle(batch.slice()).slice(0, COURSE.young ? 3 : 6).map((id) => ({ t: 'recall', id }));
  }
  const at = plan.pos + 1;
  plan.steps.splice(at, 0, ...steps);
  if (recall.length) plan.steps.splice(firstIndexOf(plan, ['sentence', 'ritual', 'done'], at + steps.length), 0, ...recall);
  plan.topic = topicId;
  (plan.topics ||= []).push(topicId);
  state.topics[topicId] ||= { ema: 0.5, n: 0, state: 'learning', profDay: null, delayed: 0, started: today };
  const subj = (state.subjects[topic.subject] ||= { ability: 0, attempts: 0, lastNew: null });
  subj.lastNew = today;
  return steps.length + recall.length;
}

export function skipChoose(state) {
  activePlan(state).subject = null;
}

export function questionFor(state, db, step, pos) {
  const item = db.items[step.id];
  const card = state.cards[step.id];
  const rng = makeRng(`q:${activePlan(state).day}:${pos}:${step.id}`);
  // diagnostics and first quizzes are always recognition format
  let format = step.t === 'diag' || step.t === 'quiz' ? (item.kind === 'mapfact' ? 'choose' : item.kind === 'spell' ? 'cued' : item.kind === 'fact' ? 'choice' : undefined) : undefined;
  // the end-of-session recall: first letter only, if the item can be typed
  if (step.t === 'recall' && item.kind === 'fact' && (item.formats || ['cued']).includes('cued')) format = 'cued';
  // ...or, for a place, finding it on the map
  if (step.t === 'recall' && item.kind === 'mapfact' && (item.formats || ['locate']).includes('locate')) format = 'locate';
  return present(item, card, { db, state, rng, level: step.level, format });
}

export function ratingFor(correct, ms, conf, kind) {
  if (!correct) return Rating.Again;
  if (conf === CONF.sure && ms != null && ms < (FAST_MS[kind] ?? 8000)) return Rating.Easy;
  return Rating.Good;
}

/**
 * Grade a response and update all learner state.
 * Returns { correct, score, message, rating, hyper, near }.
 */
export function submit(state, db, step, q, response, { ms = null, conf = null, now = Date.now(), today }) {
  const res = check(q, response);
  const item = db.items[step.id];
  const plan = activePlan(state);
  const out = { ...res, rating: null, hyper: !res.correct && conf === CONF.sure };
  if (!GRADED.has(step.t)) return out;

  const isFaded = step.t === 'faded';
  if (!isFaded) {
    const prev = state.cards[step.id];
    const rating = ratingFor(res.correct, ms, conf, q.kind);
    const rng = makeRng(`fuzz:${today}:${step.id}:${plan.pos}`);
    const elapsed = prev?.lastDay != null ? today - prev.lastDay : null;
    state.cards[step.id] = fsrsFor(item.subject).review(prev, rating, today, { rng });
    out.rating = rating;
    state.log.push([today, now, step.id, res.correct ? 1 : 0, rating, elapsed, ms, conf, q.fmt, q.level ?? null]);
  }

  // topic mastery (diagnostics measure prior knowledge, so they do not count)
  if (step.t !== 'diag') {
    state.topics[item.topic] = recordTopicAttempt(state.topics[item.topic], res.correct, today, { mixed: step.t === 'review', coverage: coverage(state, db, item.topic) });
    // a skill used in another subject is evidence for that skill too (only once she has started it)
    for (const tid of item.credits || []) {
      if (state.topics[tid]) state.topics[tid] = recordTopicAttempt(state.topics[tid], res.correct, today, { mixed: true, coverage: coverage(state, db, tid) });
    }
  }

  // ability rating for procedural templates
  if (item.kind === 'template' && q.level != null) {
    const key = `${item.id}@${q.level}`;
    const seedIdx = item.levels.indexOf(q.level);
    const tState = state.templates[key] || { difficulty: item.seed?.[seedIdx] ?? q.level - 2, attempts: 0 };
    const subj = state.subjects[item.subject] || { ability: 0, attempts: 0, lastNew: null };
    const { learner, item: it } = eloUpdate(subj, tState, res.correct, q.guess);
    state.subjects[item.subject] = { ...subj, ...learner };
    state.templates[key] = it;
  }

  // delayed feedback buffer for tomorrow's "yesterday's answers"
  if (!state.lastFeedback || state.lastFeedback.day !== today) state.lastFeedback = { day: today, entries: [] };
  if (!isFaded) {
    state.lastFeedback.entries.push({
      prompt: q.prompt,
      given: describeResponse(q, response),
      answer: describeAnswer(q),
      correct: res.correct,
      conf,
      explain: q.explain,
      hook: q.hook,
      itemId: step.id,
    });
  }

  plan.results.push({ pos: plan.pos, id: step.id, t: step.t, correct: res.correct, conf, score: res.score });

  // re-ask a missed item later in the same session (once)
  if (!res.correct && !step.reask && plan.reasks < MAX_REASKS && step.t !== 'diag' && !isFaded) {
    const gap = out.hyper ? 2 : 4;
    const at = Math.min(plan.pos + 1 + gap, firstIndexOf(plan, ['choose', 'written', 'sentence', 'ritual', 'done'], plan.pos + 1));
    plan.steps.splice(at, 0, { t: step.t === 'practice' ? 'practice' : 'review', id: step.id, reask: true, level: q.level });
    plan.reasks += 1;
  }
  return out;
}

function firstIndexOf(plan, types, from) {
  for (let i = from; i < plan.steps.length; i++) if (types.includes(plan.steps[i].t)) return i;
  return plan.steps.length;
}

export function describeResponse(q, r) {
  if (r == null) return '';
  switch (q.kind) {
    case 'choice': return q.options[r]?.text ?? '';
    case 'order': return r.map((i) => q.items[i]).join(' → ');
    case 'cloze': return r.join(' / ');
    case 'map': return q.mode === 'locate' ? (q.featureNames?.[r] ?? 'another place') : String(r);
    case 'numberline': return (Math.round(Number(r) * 100) / 100).toString();
    default: return String(r);
  }
}

export function describeAnswer(q) {
  switch (q.kind) {
    case 'choice': {
      if (q.weighted) {
        const best = Math.max(...q.options.map((o) => o.weight ?? 0));
        return q.options.find((o) => o.weight === best).text;
      }
      return q.options.find((o) => o.correct)?.text ?? '';
    }
    case 'typed': return q.numeric ? String(q.numeric.value).replace(/^-/, '−') : q.answer; // shown to the child: true minus sign
    case 'order': return q.items.join(' → ');
    case 'cloze': return q.blanks.map((b) => b.answer).join(' / ');
    case 'map': return q.answer;
    case 'numberline': return q.targetLabel ?? String(q.target);
    default: return '';
  }
}

export function startSession(state, today, now = Date.now()) {
  if (!state.plan || state.plan.day !== today) return false;
  if (!state.plan.started) {
    state.plan.started = now;
    state.sessions.push({ day: today, start: now, end: null, answered: 0, correct: 0, completed: false });
  }
  return true;
}

export function finishSession(state, now = Date.now()) {
  const plan = state.plan;
  const s = state.sessions.findLast?.((x) => x.day === plan.day) ?? [...state.sessions].reverse().find((x) => x.day === plan.day);
  if (s) {
    s.end = now;
    s.answered = plan.results.length;
    s.correct = plan.results.filter((r) => r.correct).length;
    s.completed = true;
  }
}

/** Distinct days practised in the month containing `today`. Only ever goes up within a month. */
export function daysPractisedThisMonth(state, today) {
  const m = monthKey(today);
  return new Set(state.sessions.filter((s) => s.completed && monthKey(s.day) === m).map((s) => s.day)).size;
}

/** When she was sure, how often was she right? Uses the last `n` confidence-rated answers. */
export function calibration(state, n = 200) {
  const rows = state.log.filter((r) => r[7] != null).slice(-n);
  const by = [0, 1, 2].map((c) => {
    const rs = rows.filter((r) => r[7] === c);
    return { n: rs.length, right: rs.filter((r) => r[3]).length };
  });
  return { guess: by[0], think: by[1], sure: by[2] };
}
