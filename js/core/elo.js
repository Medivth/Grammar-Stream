// Elo-style ability/difficulty ratings on a logit scale (Math Garden / Klinkenberg 2011).
// Learner ability per subject, difficulty per question template level.

export const TARGET_SUCCESS = 0.77;
const ITEM_K = 0.1;

export function pSuccess(ability, difficulty, guess = 0) {
  const p = 1 / (1 + Math.exp(difficulty - ability));
  return guess + (1 - guess) * p;
}

export function learnerK(attempts) {
  return Math.max(0.15, 0.4 / (1 + attempts / 50));
}

/**
 * Update both ratings after one attempt.
 * guess: chance of answering correctly by guessing (1/options for multiple choice).
 */
export function eloUpdate({ ability, attempts }, { difficulty, attempts: itemAttempts }, correct, guess = 0) {
  const expected = pSuccess(ability, difficulty, guess);
  const err = (correct ? 1 : 0) - expected;
  const itemK = ITEM_K / (1 + (itemAttempts || 0) / 200);
  return {
    learner: { ability: ability + learnerK(attempts || 0) * err, attempts: (attempts || 0) + 1 },
    item: { difficulty: difficulty - itemK * err, attempts: (itemAttempts || 0) + 1 },
  };
}

/**
 * Choose among candidates [{id, difficulty}] the one whose predicted success is
 * closest to the target, randomising among the nearest `spread` to avoid repetition.
 */
export function chooseByTarget(candidates, ability, rng, { target = TARGET_SUCCESS, spread = 3 } = {}) {
  if (!candidates.length) return null;
  const scored = candidates
    .map((c) => ({ c, gap: Math.abs(pSuccess(ability, c.difficulty) - target) }))
    .sort((a, b) => a.gap - b.gap);
  const pool = scored.slice(0, Math.min(spread, scored.length));
  return rng.pick(pool).c;
}
