// What the companion says in its speech bubble on the home page: a few short, warm lines about the
// child's real day (reviews waiting, a new topic, the bonus topic, yesterday's sprint, a book on the
// go, a badge nearly earned), in a voice that suits the course. Never nagging, never guilt: nothing
// about days missed or streaks lost. talkContext() gathers the facts; companionLines() is pure, so
// it can be tested (and it is: tests/companion-talk.test.mjs).

import { COURSE, SUBJECT_BY_ID } from '../core/subjects.js';
import { bonusProgress, bonusStatusLine, extraStatus } from '../core/session.js';
import { milestones } from '../core/progress.js';
import { currentBooks } from '../core/writing.js';

/** The voice: playful for Years 2 and 3, friendly for Year 6 (who learns Latin), wittier and Greek-flavoured for Year 8. */
export const voiceOf = (course = COURSE) => (course.young ? 'young' : course.id === 'y8' ? 'y8' : 'y6');

// badges that count something up ("Finish 3 books"), which can be put as "Finish 2 more books"
const COUNT_UP = /^(Finish|Know|Secure|Hand in|Light up|Practise on|Have|Read|Master) (\d+) ([^:]+)/;
// counted within one month, so "nearly there" could turn into a race against the calendar
const NOT_NEARLY = new Set(['regular']);

const singular = (w) => (/ies$/.test(w) ? w.replace(/ies$/, 'y') : w.replace(/s$/, ''));
/** "Finish 3 books" with 2 to go is "Finish 2 more books"; with 1 to go, "Finish 1 more book". */
export function badgeStep(desc, left) {
  const m = COUNT_UP.exec(desc);
  if (!m) return null;
  const words = m[3].trim().split(' ');
  // the counted thing is the last word before "on", "in", "with" or "of" (events on the timeline, pieces of writing)
  let head = words.findIndex((w) => ['on', 'in', 'with', 'of'].includes(w)) - 1;
  if (head < 0) head = words.length - 1;
  if (left === 1) words[head] = singular(words[head]);
  return `${m[1]} ${left} more ${words.join(' ')}`;
}

/** The unearned badge nearest to being earned, if it is close: { title, step } or null. */
export function nearBadge(ms) {
  const near = ms
    .filter((m) => !m.done && m.value > 0 && !NOT_NEARLY.has(m.id) && COUNT_UP.test(m.desc))
    .map((m) => ({ m, left: m.goal - m.value }))
    .filter(({ m, left }) => left > 0 && left <= Math.max(2, Math.ceil(m.goal * 0.2)))
    .sort((a, b) => a.left / a.m.goal - b.left / b.m.goal || a.left - b.left)[0];
  return near ? { id: near.m.id, title: near.m.title, left: near.left, step: badgeStep(near.m.desc, near.left) } : null;
}

/** The facts the companion can talk about, read from the child's state. */
export function talkContext(state, db, today, { hour = new Date().getHours(), rest = null, course = COURSE } = {}) {
  const plan = state.plan?.day === today ? state.plan : null;
  const ahead = plan && !plan.finished ? plan.steps.slice(plan.pos || 0) : [];
  const phase = rest ? 'rest' : plan?.finished ? 'finished' : plan?.started ? 'going' : 'ready';
  const bp = course.bonus ? bonusProgress(state, db) : null;
  let bonus = null;
  if (bp?.total && !bp.prized && !rest) {
    const st = bonusStatusLine(state, db, today);
    if (!st.empty) bonus = { title: bp.def.title, done: bp.done, total: bp.total, started: bp.started > 0 };
  }
  const extra = rest ? [] : (course.extra || []).map((sub) => ({ name: SUBJECT_BY_ID[sub]?.name || sub, ...extraStatus(state, db, today, sub) })).filter((x) => x.due || x.fresh);
  return {
    voice: voiceOf(course),
    day: today,
    hour,
    child: state.profile?.childName || '',
    phase,
    reviews: ahead.filter((s) => s.t === 'review' && !s.reask).length,
    newTopics: ahead.filter((s) => s.t === 'choose').map((s) => SUBJECT_BY_ID[s.subject]?.name).filter(Boolean),
    sprintYesterday: Math.max(0, ...(state.sprints || []).filter((s) => s.day === today - 1).map((s) => s.correct)),
    book: currentBooks({ books: state.books || [] })[0]?.title || null,
    bonus,
    badge: rest ? null : nearBadge(milestones(state, db)),
    extra,
  };
}

const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const andList = (xs) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} and ${xs.at(-1)}` : xs[0]);
// a different wording on different days, so the companion does not sound like a recording
const vary = (ctx, list, k = 0) => list[(Math.abs(ctx.day || 0) + k) % list.length];

function greeting(ctx) {
  const name = ctx.child ? `, ${ctx.child}` : '';
  if (ctx.voice === 'y8') return `Chaire${name}!`; // the Ancient Greek hello
  if (ctx.voice === 'y6') return `Salve${name}!`; // and the Latin one
  return `${ctx.hour < 12 ? 'Good morning' : ctx.hour < 18 ? 'Good afternoon' : 'Good evening'}${name}!`;
}

const LINES = {
  going: {
    young: () => 'We’re part-way through our adventure. Let’s keep going when you’re ready!',
    y6: () => 'You’re part-way through today’s session. Carry on whenever you’re ready.',
    y8: () => 'Part-way up Olympus already. Onwards when you’re ready.',
  },
  reviews: {
    young: (n, c) => vary(c, [`I’ve got ${plural(n, 'quick question')} to see what you remember!`, `${plural(n, 'memory question')} ${n === 1 ? 'is' : 'are'} ready. Let’s see how much you know!`]),
    y6: (n, c) => vary(c, [`${plural(n, 'review')} ${n === 1 ? 'is' : 'are'} waiting. Reviews are what make learning stick.`, `${plural(n, 'review')} today, to keep what you know fresh.`]),
    y8: (n, c) => vary(c, [`${plural(n, 'review')} today. Mnemosyne, goddess of memory, approves.`, `${plural(n, 'review')} ready. Coming back to things is how they stick.`]),
  },
  newTopic: {
    young: (s) => (s.length > 1 ? `There are brand-new ${andList(s)} adventures waiting for you!` : `There’s a brand-new ${s[0]} adventure waiting for you!`),
    y6: (s) => (s.length > 1 ? `New ${andList(s)} topics are ready for you to choose.` : `A new ${s[0]} topic is ready for you to choose.`),
    y8: (s) => `${s.length > 1 ? `New ${andList(s)} topics await` : `A new ${s[0]} topic awaits`}. Every odyssey starts somewhere.`,
  },
  finished: {
    young: (c) => vary(c, ['We did it! High five!', 'All done! You were brilliant today.']),
    y6: (c) => vary(c, ['All done for today. Brilliant work!', 'Session finished. That’s another day of learning in the bank.']),
    y8: (c) => vary(c, ['Session complete. “We are what we repeatedly do”, as Aristotle (more or less) said.', 'Done for today. Even Hercules had his labours one at a time.']),
  },
  restNight: {
    young: () => 'It’s nearly bedtime. Sleep helps your brain remember what you learned!',
    y6: () => 'Rest time. Your brain tidies up today’s learning while you sleep.',
    y8: () => 'Even Hypnos says it’s time to rest. Sleep is when memories settle.',
  },
  restEarly: {
    young: () => 'It’s very early! Let’s have breakfast first, then learn something fun.',
    y6: () => 'Early bird! Sessions open after breakfast.',
    y8: () => 'Eos has barely risen. Sessions open after breakfast.',
  },
  sprint: {
    young: (n) => `Yesterday you zoomed to ${n} right in your sprint. Vroom!`,
    y6: (n) => `Yesterday’s sprint: ${n} right. Nice going!`,
    y8: (n) => `${n} right in yesterday’s sprint. Pheidippides would be proud.`,
  },
  book: {
    young: (t) => `How’s ${t} going? I can’t wait to find out what happens!`,
    y6: (t) => `How are you getting on with ${t}? I’d love to know what happens next.`,
    y8: (t) => `How’s ${t}? No spoilers, please.`,
  },
  bookRest: {
    young: (t) => `A few pages of ${t} would be a cosy way to end the day.`,
    y6: (t) => `A few pages of ${t} would be a lovely way to wind down.`,
    y8: (t) => `A chapter of ${t}, perhaps? The perfect way to wind down.`,
  },
  badge: {
    young: (b) => `${b.step} and you’ll earn the ${b.title} badge!`,
    y6: (b) => `${b.step} to earn the ${b.title} badge.`,
    y8: (b) => `${b.step} and “${b.title}” is yours.`,
  },
  bonusNew: {
    young: (b) => `Psst! The ${b.title} bonus topic is ready whenever you are.`,
    y6: (b) => `Fancy something extra? The ${b.title} bonus topic is ready.`,
    y8: (b) => `A bonus topic awaits: ${b.title}.`,
  },
  bonusGoing: {
    young: (b) => `${b.done} of ${b.total} parts of ${b.title} done. Your prize is waiting at the end!`,
    y6: (b) => `${b.done} of ${b.total} parts of ${b.title} done. Your prize is waiting at the end.`,
    y8: (b) => `${b.done} of ${b.total} parts of ${b.title} done. A prize awaits the finisher.`,
  },
  extra: {
    young: (x) => (x.fresh ? `A new ${x.name} topic is ready whenever you like.` : `${plural(x.due, `${x.name} review`)} whenever you like.`),
    y6: (x) => (x.fresh ? `A new ${x.name} topic is ready, any time you like.` : `${plural(x.due, `${x.name} review`)} whenever you like. Optime!`),
    y8: (x) => (x.fresh ? `A new ${x.name} topic is ready, any time you like.` : `${plural(x.due, `${x.name} review`)} whenever you like. Euge!`),
  },
  trick: {
    young: () => 'Tap me and I’ll do a trick!',
    y6: () => 'Tap me if you’d like to see a trick.',
    y8: () => 'Tap me for a trick. I’ve been practising.',
  },
  hello: {
    young: () => 'I’m so happy to see you!',
    y6: () => 'Lovely to see you.',
    y8: () => 'Good to see you.',
  },
};

/**
 * The lines for the bubble, most useful first. The first one starts with a greeting. Each line is
 * { id, text } (the id says what it is about, for tests).
 */
export function companionLines(ctx) {
  const v = ctx.voice || 'y6';
  const say = (id, key, ...args) => ({ id, text: LINES[key][v](...args, ctx) });
  const out = [];
  if (ctx.phase === 'rest') {
    out.push(say('rest', ctx.hour < 12 ? 'restEarly' : 'restNight'));
    if (ctx.book) out.push(say('book', 'bookRest', ctx.book));
  } else {
    if (ctx.phase === 'finished') out.push(say('finished', 'finished'));
    if (ctx.phase === 'going') out.push(say('going', 'going'));
    if (ctx.phase !== 'finished') {
      if (ctx.reviews > 0) out.push(say('reviews', 'reviews', ctx.reviews));
      if (ctx.newTopics?.length) out.push(say('new', 'newTopic', [...new Set(ctx.newTopics)]));
    }
    if (ctx.badge?.step) out.push(say('badge', 'badge', ctx.badge));
    if (ctx.bonus) out.push(say('bonus', ctx.bonus.started ? 'bonusGoing' : 'bonusNew', ctx.bonus));
    if (ctx.sprintYesterday > 0) out.push(say('sprint', 'sprint', ctx.sprintYesterday));
    if (ctx.book) out.push(say('book', 'book', ctx.book));
    for (const x of ctx.extra || []) out.push(say('extra', 'extra', x));
  }
  if (!out.length) out.push(say('hello', 'hello'));
  out.push(say('trick', 'trick'));
  out[0] = { ...out[0], text: `${greeting(ctx)} ${out[0].text}` };
  return out;
}
