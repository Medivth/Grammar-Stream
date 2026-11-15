// Read-aloud through the browser's speech synthesis (works offline with built-in voices).

let voice = null;
let frVoice = null; // for French words and phrases

function pickVoice() {
  const voices = window.speechSynthesis?.getVoices?.() || [];
  voice = voices.find((v) => v.lang === 'en-GB' && /female|libby|sonia|hazel|serena|kate/i.test(v.name))
    || voices.find((v) => v.lang === 'en-GB')
    || voices.find((v) => v.lang?.startsWith('en'))
    || null;
  frVoice = voices.find((v) => v.lang === 'fr-FR') || voices.find((v) => v.lang?.startsWith('fr')) || null;
}

export function ttsAvailable() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window; // (not under node, where the tests import screens)
}

if (ttsAvailable()) {
  pickVoice();
  window.speechSynthesis.onvoiceschanged = pickVoice;
}

// Read-aloud is off unless a grown-up turns it on in Settings; every read-aloud button asks here.
let enabled = false;
export function setReadAloud(on) { enabled = !!on; }
export function readAloudOn() { return enabled && ttsAvailable(); }

export function speak(text, { rate = 0.9, lang = 'en' } = {}) {
  if (!ttsAvailable()) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const fr = lang.startsWith('fr');
  const v = fr ? frVoice : voice;
  if (v) u.voice = v;
  u.lang = v?.lang || (fr ? 'fr-FR' : 'en-GB');
  u.rate = rate;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (ttsAvailable()) window.speechSynthesis.cancel();
}
