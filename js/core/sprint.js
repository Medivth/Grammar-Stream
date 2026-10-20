// Arithmetic sprint bookkeeping: level ladder and personal bests.
// Results live in state.sprints: [{ day, level, answered, correct }].

import { SPRINT_LEVELS } from '../gen/sprint.js';

export const SPRINT_SECONDS = 90;
export const SPRINT_START_LEVEL = 1;
export const LEVEL_UP_AT = { correct: 15, accuracy: 0.9 };
export const LEVEL_DOWN_BELOW = 0.6;

/** The level for her next sprint, from the most recent result. */
export function sprintLevel(state) {
  const last = state.sprints?.at(-1);
  if (!last) return SPRINT_START_LEVEL;
  const acc = last.answered ? last.correct / last.answered : 0;
  if (last.correct >= LEVEL_UP_AT.correct && acc >= LEVEL_UP_AT.accuracy) return Math.min(SPRINT_LEVELS, last.level + 1);
  if (last.answered >= 5 && acc < LEVEL_DOWN_BELOW) return Math.max(1, last.level - 1);
  return last.level;
}

/** Best "correct" count at a level before this attempt (null if first time). */
export function sprintBest(state, level) {
  const prev = (state.sprints || []).filter((s) => s.level === level);
  return prev.length ? Math.max(...prev.map((s) => s.correct)) : null;
}

export function recordSprint(state, { day, level, answered, correct }) {
  (state.sprints ||= []).push({ day, level, answered, correct });
}

/** A sprint runs on every day after the first session, so day one stays about settling in. */
export function sprintDue(state) {
  return state.sessions.some((s) => s.completed);
}
