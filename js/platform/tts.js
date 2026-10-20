// Read-aloud through the browser's speech synthesis (works offline with built-in voices).

let voice = null;

function pickVoice() {
  const voices = window.speechSynthesis?.getVoices?.() || [];
  voice = voices.find((v) => v.lang === 'en-GB' && /female|libby|sonia|hazel|serena|kate/i.test(v.name))
    || voices.find((v) => v.lang === 'en-GB')
    || voices.find((v) => v.lang?.startsWith('en'))
    || null;
}

export function ttsAvailable() {
  return 'speechSynthesis' in window;
}

if (ttsAvailable()) {
  pickVoice();
  window.speechSynthesis.onvoiceschanged = pickVoice;
}

export function speak(text, { rate = 0.9 } = {}) {
  if (!ttsAvailable()) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  if (voice) u.voice = voice;
  u.lang = voice?.lang || 'en-GB';
  u.rate = rate;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (ttsAvailable()) window.speechSynthesis.cancel();
}
