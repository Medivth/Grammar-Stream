// Visual audit: simulate weeks of use, then screenshot the main screens.
// Usage: PW=$(npm root -g)/playwright node tools/shots.mjs <out-dir> [days]
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { buildDB } from '../js/core/content.js';
import { emptyState, serialize } from '../js/core/store.js';
import { planDay, chooseTopic, topicChoices, questionFor, submit, startSession, finishSession, fsrsFor } from '../js/core/session.js';
import { startPlacement, nextProbe, probeQuestion, answerProbe, applyPlacement } from '../js/core/placement.js';
import { correctResponse } from '../js/core/checkers.js';
import { makeRng } from '../js/core/rng.js';
import { dayNumber } from '../js/core/dates.js';
import { setCourse, COURSES } from '../js/core/subjects.js';
import { sprintLevel, recordSprint } from '../js/core/sprint.js';
import { submitAnswer, markAnswer, unseenMarks } from '../js/core/writing.js';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || 'playwright');
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = process.argv[2] || '/tmp/gs-audit';
const DAYS = +(process.argv[3] || 35);
mkdirSync(OUT, { recursive: true });

const read = (p) => JSON.parse(readFileSync(new URL('../content/' + p, import.meta.url)));
const COURSE_ID = process.env.COURSE || 'y6';
setCourse(COURSE_ID);
const db = buildDB(read(COURSES[COURSE_ID].index.replace('content/', '')).decks.map(read));

function wrong(q) {
  if (q.kind === 'choice') return q.options.findIndex((o) => !o.correct && !(o.weight > 0));
  if (q.kind === 'order') return q.items.map((_, i) => i).reverse();
  if (q.kind === 'numberline') return q.min;
  if (q.kind === 'cloze') return q.blanks.map(() => 'zzz');
  return 'zzz';
}

export function simulate(days, today = dayNumber()) {
  const start = today - days;
  const state = emptyState(start);
  state.course = COURSE_ID;
  if (COURSE_ID === 'ks1') state.settings.sessionMinutes = 12;
  state.profile = COURSE_ID === 'ks1' ? { childName: 'Leo', pronoun: 'he', hero: 'Captain Thunder', parentPin: '1234', companion: { name: 'Zoom', fur: 'chestnut', accessory: 'racehelmet' } } : { childName: 'Ada', parentPin: '1234', companion: { name: 'Mochi', fur: 'caramel', accessory: 'yuzu' } };
  const rng = makeRng('audit');
  for (let d = 0; d < days; d++) {
    const day = start + d;
    if (d % 7 === 5) continue;
    state.plan = planDay(state, db, day);
    startSession(state, day, day * 864e5);
    const plan = state.plan;
    while (plan.pos < plan.steps.length) {
      const st = plan.steps[plan.pos];
      if (st.t === 'placement') {
        const probe = startPlacement(state, db, st.subject);
        let p;
        while ((p = nextProbe(probe, state, db))) { const q = probeQuestion(state, db, p); answerProbe(probe, state, db, q, rng.chance(0.55) ? correctResponse(q) : null, day); }
        applyPlacement(probe, state, db, day);
      } else if (st.t === 'choose') {
        const o = topicChoices(state, db, st.subject);
        if (o.length) chooseTopic(state, db, rng.pick(o), day);
      } else if (['review', 'quiz', 'diag', 'practice', 'faded'].includes(st.t)) {
        const q = questionFor(state, db, st, plan.pos);
        const c = state.cards[st.id];
        const pr = c && c.state !== 'new' ? fsrsFor(db.items[st.id].subject).retrievability(c.s, day - c.lastDay) : 0.75;
        submit(state, db, st, q, rng.chance(pr) ? correctResponse(q) : wrong(q), { ms: 5000, conf: rng.pick([0, 1, 2, 2]), now: day * 864e5 + plan.pos, today: day });
      } else if (st.t === 'sprint') {
        const level = sprintLevel(state), answered = rng.int(8, 26);
        recordSprint(state, { day, level, answered, correct: Math.round(answered * rng.pick([0.6, 0.8, 0.95])) });
      } else if (st.t === 'written') {
        const a = submitAnswer(state, st.id, 'The writer uses the word “hazy” to make the garden feel mysterious. '.repeat(5), day);
        if (rng.chance(0.8)) markAnswer(state, a, { score: rng.pick([1, 2, 2]), note: 'Lovely quotation.' }, day, db.items[st.id].topic);
      } else if (st.t === 'marked') {
        unseenMarks(state).forEach((a) => { a.seen = true; });
      } else if (st.t === 'sentence') {
        state.writing.push({ day, taskId: st.options[0], text: db.sentenceById[st.options[0]].model, ok: true, tries: 1 });
      }
      plan.pos++;
    }
    plan.finished = true;
    finishSession(state, day * 864e5 + 25 * 60000);
    if (rng.chance(0.7)) state.reading.push({ day, minutes: rng.pick([15, 20, 30]), title: 'Holes' });
  }
  if (COURSE_ID === 'y6') state.books.push({ bookId: 'book.holes', title: 'Holes', author: 'Louis Sachar', startDay: today - 10, endDay: null });
  state.plan = null;
  return state;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const state = simulate(DAYS);
  const save = serialize(state);
  const PORT = 8000 + Math.floor(Math.random() * 900);
  const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: ROOT, stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 700));
  const browser = await chromium.launch();
  const routes = (process.env.ROUTES || 'home,subject/history,subject/geography,subject/latin,progress,progress/timeline,progress/places,reading,parent,paper,typing,speed,play').split(',');
  try {
    for (const [label, viewport] of [['tablet', { width: 1024, height: 768 }], ['phone', { width: 390, height: 844 }]]) {
      const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, colorScheme: process.env.DARK ? 'dark' : 'light' });
      await ctx.addInitScript(([s]) => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('grammar-stream.save', s); sessionStorage.setItem('seeded', '1'); } const D = Date; const f = new D(); f.setHours(16, 0, 0, 0); const off = f - D.now(); globalThis.Date = class extends D { constructor(...a) { super(...(a.length ? a : [D.now() + off])); } static now() { return D.now() + off; } }; }, [save]);
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      for (const r of routes) {
        await page.goto(`http://127.0.0.1:${PORT}/#/${r}`);
        await page.waitForTimeout(700);
        if (r === 'parent') { for (const d of '1234') await page.click(`.pin-pad button[aria-label="${d}"]`).catch(() => {}); await page.waitForTimeout(300); }
        if (r === 'play') {
          const start = await page.$('button.btn-primary');
          if (start) { await start.click().catch(() => {}); await page.waitForTimeout(500); }
        }
        await page.screenshot({ path: `${OUT}/${label}-${r.replace(/\//g, '_')}.png`, fullPage: true });
      }
      if (errors.length) console.log(label, 'errors:', errors);
      await ctx.close();
    }
  } finally {
    await browser.close();
    server.kill();
  }
  console.log('cards', Object.keys(state.cards).length, 'topics', Object.values(state.topics).filter((t) => t.state !== 'learning').length, 'shots in', OUT);
}
