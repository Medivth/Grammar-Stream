// Small pure rules behind the answer reactions: runs of right answers, the themed progress track
// and whether sounds start on. Kept free of the DOM so they can be tested.

/** A run is celebrated at 3, 5 and 10 in a row, then at every fifth after that. */
export function isRunMilestone(run) {
  return run === 3 || run === 5 || (run >= 10 && run % 5 === 0);
}

/**
 * Right answers in a row at the end of a session's results. Diagnostic questions ask what she
 * thinks before learning, so they neither add to a run nor end one.
 */
export function currentRun(results = []) {
  let n = 0;
  for (let i = results.length - 1; i >= 0; i--) {
    const r = results[i];
    if (r.t === 'diag') continue;
    if (!r.correct) break;
    n++;
  }
  return n;
}

/** How far along the session is, 0 to 1: the last step (the finished screen) is 1. */
export function progressFraction(plan) {
  if (!plan?.steps?.length) return 0;
  const f = plan.pos / Math.max(1, plan.steps.length - 1);
  return Math.min(1, Math.max(0, f));
}

/** Which race the progress bar shows: a race car for Years 2/3, a rocket for Year 6, a chariot for Year 8. */
export function trackTheme(courseId) {
  if (courseId === 'ks1' || courseId === 'y3') return 'race';
  if (courseId === 'y8') return 'chariot';
  return 'rocket';
}

/**
 * Sounds start on for the younger courses and Year 6, where a chime makes each answer feel good,
 * and off for Year 8, who is more likely to practise near other people. A choice made by a
 * grown-up (or the mute button) always wins.
 */
export function soundsOn(settings, courseId) {
  if (typeof settings?.sounds === 'boolean') return settings.sounds;
  return courseId !== 'y8';
}

// Gentle lines from the companion after a wrong answer: about effort and learning, never blame.
const TRY_LINES = {
  young: ['Good try! Let’s look at it together.', 'Nearly! Every mistake helps your brain grow.', 'That was a tricky one. You’ll get it next time.', 'Good thinking. Now you know the answer!'],
  older: ['Good try. Now you’ve seen it, it’ll stick.', 'Mistakes are how memories get stronger.', 'A tricky one. Worth a careful look.', 'Close. Read why, and it will make sense.'],
};
export function tryLine(n, young) {
  const lines = TRY_LINES[young ? 'young' : 'older'];
  return lines[Math.abs(n | 0) % lines.length];
}
