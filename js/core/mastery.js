// Topic mastery: exponential moving average of correctness with explicit states.
// locked -> available -> learning -> proficient -> mastered.
// "mastered" is only granted by later, delayed success in mixed review.

import { isStretch } from './subjects.js';

export const ALPHA = 0.25;
export const PROFICIENT_AT = 0.85;
export const MIN_ATTEMPTS = 5;
export const DELAYED_PASSES_FOR_MASTERY = 2;
export const DELAY_DAYS = 3;

export function newTopicState() {
  // Prior of 0.5: five straight correct answers reach 0.85.
  return { ema: 0.5, n: 0, state: 'learning', profDay: null, delayed: 0, started: null };
}

// A topic is secure only once at least half its questions have been taught, and mastered only
// when all have: otherwise its later questions would never be taught.
export const COVERAGE_FOR_PROFICIENT = 0.5;

export function recordTopicAttempt(t, correct, today, { mixed = true, coverage = 1 } = {}) {
  const s = { ...(t || newTopicState()) };
  if (s.started == null) s.started = today;
  s.ema += ALPHA * ((correct ? 1 : 0) - s.ema);
  s.n += 1;

  if (s.state === 'learning' && s.ema >= PROFICIENT_AT && s.n >= MIN_ATTEMPTS && coverage >= COVERAGE_FOR_PROFICIENT) {
    s.state = 'proficient';
    s.profDay = today;
    s.delayed = 0;
  } else if (s.state === 'proficient') {
    if (correct && mixed && today - s.profDay >= DELAY_DAYS) s.delayed += 1;
    if (s.delayed >= DELAYED_PASSES_FOR_MASTERY && s.ema >= PROFICIENT_AT && coverage >= 1) s.state = 'mastered';
    else if (s.ema < 0.6) s.state = 'learning';
  } else if (s.state === 'mastered' && s.ema < 0.7) {
    s.state = 'proficient';
    s.profDay = today;
    s.delayed = 0;
  }
  return s;
}

/** Topic is ready to start when every prerequisite is at least proficient. */
export function isAvailable(topic, topicStates) {
  return (topic.prereqs || []).every((p) => {
    const st = topicStates[p]?.state;
    return st === 'proficient' || st === 'mastered' || st === 'assumed';
  });
}

export const STRETCH_READY_AT = 0.7;

/** Stretch topics open once most of the subject's ordinary topics are secure (and prerequisites too). */
export function stretchReady(db, topicStates, subject) {
  const ids = (db.topicOrder[subject] || []).filter((id) => !isStretch(db.topics[id]));
  const secure = ids.filter((id) => ['proficient', 'mastered', 'assumed'].includes(topicStates[id]?.state)).length;
  return ids.length > 0 && secure / ids.length >= STRETCH_READY_AT;
}

export function topicStatus(topic, topicStates, db = null) {
  const st = topicStates[topic.id];
  if (st) return st.state;
  if (isStretch(topic) && db && !stretchReady(db, topicStates, topic.subject)) return 'locked';
  return isAvailable(topic, topicStates) ? 'available' : 'locked';
}
