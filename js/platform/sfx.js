// Little synthesised sounds (Web Audio, no files, so they work offline): a chime for a right answer,
// a soft low tone for a wrong one, a fanfare for a run, a flourish at the finish and a sparkle for
// reveals. The audio context is made on first use after a tap, and everything is kept quiet.
//
// Other screens can call these freely: they do nothing when sounds are off or audio is unavailable.

let enabled = true;
let ctx = null;
let master = null;
const VOLUME = 0.22;

export function setSoundOn(on) {
  enabled = !!on;
}
export const soundOn = () => enabled;

function audio() {
  if (!enabled || typeof window === 'undefined') return null;
  if (document.visibilityState === 'hidden') return null;
  // browsers only allow audio after the page has been tapped; before that, stay silent
  if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = VOLUME;
      master.connect(ctx.destination);
    } catch {
      ctx = null;
      return null;
    }
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

/** One soft note: a quick rise, then a smooth fade (exponential, so it never clicks). */
function note(freq, { at = 0, dur = 0.3, type = 'sine', gain = 0.6, slideTo = null } = {}) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + 0.01 + at;
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g);
  g.connect(master);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

/** A right answer: two bright notes rising, with a faint shimmer an octave up. */
export function chime() {
  note(784, { dur: 0.22, type: 'triangle', gain: 0.5 });
  note(1175, { at: 0.09, dur: 0.38, type: 'triangle', gain: 0.5 });
  note(2350, { at: 0.09, dur: 0.3, gain: 0.08 });
}

/** A wrong answer: calm and low, falling a little. Not a buzzer. */
export function softTone() {
  note(262, { dur: 0.32, gain: 0.35, slideTo: 220 });
  note(196, { at: 0.12, dur: 0.38, gain: 0.25 });
}

/** A run of right answers: a quick rising arpeggio. */
export function fanfare() {
  [523, 659, 784, 1047].forEach((f, i) => note(f, { at: i * 0.075, dur: i === 3 ? 0.5 : 0.18, type: 'triangle', gain: 0.45 }));
  note(1568, { at: 0.3, dur: 0.45, gain: 0.1 });
}

/** The end of a session: a longer flourish up the scale, landing on a chord. */
export function flourish() {
  [392, 494, 587, 784, 988].forEach((f, i) => note(f, { at: i * 0.07, dur: 0.2, type: 'triangle', gain: 0.4 }));
  [784, 988, 1175, 1568].forEach((f) => note(f, { at: 0.4, dur: 0.9, type: 'triangle', gain: 0.22 }));
  sparkle(0.5);
}

/** A reveal (a card, a badge): a little sprinkle of high notes. */
export function sparkle(at = 0) {
  [2093, 2637, 3136, 2794, 3520].forEach((f, i) => note(f, { at: at + i * 0.055, dur: 0.16, gain: 0.12 }));
}
