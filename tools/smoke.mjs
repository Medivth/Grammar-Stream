// Browser smoke test: onboarding, a full session, reload/resume, parent area.
// Usage: PW=$(npm root -g)/playwright node tools/smoke.mjs [screenshot-dir]
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || 'playwright');
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = process.argv[2] || '/tmp/gs-shots';
mkdirSync(OUT, { recursive: true });
const PORT = 8000 + Math.floor(Math.random() * 900);
const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: ROOT, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));

const errors = [];
const browser = await chromium.launch();
let failed = false;
try {
  for (const [label, viewport] of [['tablet', { width: 1024, height: 768 }], ['phone', { width: 390, height: 844 }]]) {
    const ctx = await browser.newContext({ viewport });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push(`${label}: ${e.message}`));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(`${label} console: ${m.text()}`); });
    // keep the session reachable regardless of the real time of day
    await page.addInitScript(() => { const D = Date; const fixed = new D(); fixed.setHours(16, 0, 0, 0); const off = fixed - D.now(); globalThis.Date = class extends D { constructor(...a) { super(...(a.length ? a : [D.now() + off])); } static now() { return D.now() + off; } }; });
    await page.goto(`http://127.0.0.1:${PORT}/`);
    await page.waitForSelector('#ob-name');
    await page.screenshot({ path: `${OUT}/${label}-01-welcome.png`, fullPage: true });
    await page.fill('#ob-name', 'Ada');
    await page.fill('#ob-pin', '1234');
    await page.fill('#ob-pin2', '1234');
    await page.click('text=Next: meet the capybara');
    await page.waitForSelector('#capy-name');
    await page.click('button:has-text("Flower")');
    await page.fill('#capy-name', 'Mochi');
    await page.screenshot({ path: `${OUT}/${label}-02-companion.png`, fullPage: true });
    await page.click('text=Let’s go!');
    await page.waitForSelector('.btn-start');
    await page.screenshot({ path: `${OUT}/${label}-03-home.png`, fullPage: true });
    // pretend yesterday's session happened, so today's plan includes the arithmetic sprint; keep it short
    await page.evaluate(() => { const a = window.__app; a.state.sessions.push({ day: Math.floor(Date.now() / 864e5) - 1, start: 1, end: 2, answered: 5, correct: 5, completed: true }); a.state.topics['english.read-mood'] = { ema: 0.6, n: 3, state: 'learning', profDay: null, delayed: 0, started: 1 }; for (const id of ['english.rd.sg1', 'english.rd.sg2', 'english.rd.sg3']) a.state.cards[id] = { state: 'review', s: 3, d: 5, lastDay: 1, due: 99999, ivl: 3, reps: 1, lapses: 0 }; a.state.plan = null; a.save(); });
    await page.click('.btn-start');

    const seen = new Set();
    let steps = 0, reloaded = false;
    while (steps++ < 300) {
      await page.waitForTimeout(80);
      if (await page.$('text=Finished for today!')) break;
      const stepType = await page.evaluate(() => window.__app.state.plan?.steps[window.__app.state.plan.pos]?.t);
      if (stepType && !seen.has(stepType)) {
        seen.add(stepType);
        await page.screenshot({ path: `${OUT}/${label}-step-${stepType}.png`, fullPage: true });
      }
      await page.evaluate(() => { window.__app.sprintSeconds = 6; });
      const sprintIn = await page.$('.sprint-in');
      if (sprintIn) {
        const v = await page.evaluate(() => window.__app.sprintCurrent?.value);
        try { await sprintIn.fill(String(v ?? 7)); await sprintIn.press('Enter'); } catch { /* the 6-second sprint ended mid-keystroke */ }
        continue;
      }
      if (!reloaded && steps === 12) { reloaded = true; await page.goto(`http://127.0.0.1:${PORT}/#/home`); await page.reload(); await page.waitForSelector('.btn-start'); await page.click('.btn-start'); continue; }
      if (await page.$('text=Which subject shall we look at today?')) { await page.click('.choice-card >> nth=2'); await page.waitForTimeout(100); continue; }
      // placement: answer some, skip others
      const skip = await page.$('button:has-text("I haven’t learned this yet")');
      if (skip) {
        const opt = await page.$('.option:not([disabled])');
        const typed = await page.$('.q-body input[type=text]');
        if (steps % 3 === 0 && (opt || typed)) {
          if (opt) await opt.click(); else await typed.fill('7');
          await page.click('button.btn-primary:has-text("Next")');
        } else await skip.click();
        continue;
      }
      // questions
      if (await page.$('.confidence')) {
        const opt = await page.$('.option:not([disabled])');
        const typed = await page.$('.q-body input[type=text]:not([disabled])');
        const mapTap = await page.$('.map-box [data-id]');
        const nl = await page.$('.nl-box svg');
        if (opt) await opt.click();
        else if (typed) {
          const ans = await page.evaluate(() => { const a = window.__app; const st = a.state.plan.steps[a.state.plan.pos]; return a.db.items[st.id]?.answer || a.db.items[st.id]?.word || '7'; });
          const inputs = await page.$$('.q-body input[type=text]:not([disabled])');
          for (const i of inputs) await i.fill(String(ans));
        } else if (mapTap) await mapTap.click({ force: true });
        else if (nl) { const b = await nl.boundingBox(); await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2); }
        await page.click('.confidence button:has-text("Think so")');
        await page.waitForSelector('.feedback');
        if (!seen.has('feedback')) { seen.add('feedback'); await page.screenshot({ path: `${OUT}/${label}-feedback.png`, fullPage: true }); }
        await page.click('button:has-text("Next")');
        continue;
      }
      if (await page.$('.choice-card')) { await page.click('.choice-card'); continue; }
      if (await page.$('.written textarea:not([disabled])')) {
        await page.fill('.written textarea', 'The writer makes the garden feel mysterious by calling the tangled roses a “hazy mantle”. '.repeat(4));
        await page.screenshot({ path: `${OUT}/${label}-step-written.png`, fullPage: true });
        await page.click('.written .btn-primary:not([disabled])');
        continue;
      }
      if (await page.$('textarea:not([disabled])')) {
        await page.fill('textarea', 'As a result, the old dog, which was tired, slept; everyone was happy.');
        const check = await page.$('button:has-text("Check")');
        if (check) { await check.click(); await page.waitForTimeout(50); const again = await page.$('button:has-text("Check again")'); if (again) await again.click(); continue; }
        const btn = await page.$('.q-wrap .btn-primary');
        if (btn) await btn.click();
        continue;
      }
      const opt = await page.$('.options .option:not([disabled])');
      if (opt) { await opt.click(); await page.waitForTimeout(50); }
      const btn = await page.$('.q-wrap .btn-primary:not([disabled])');
      if (btn) { await btn.click(); continue; }
      throw new Error(`stuck at step ${stepType}`);
    }
    await page.screenshot({ path: `${OUT}/${label}-04-done.png`, fullPage: true });
    console.log(`${label}: session finished in ${steps} actions; step types: ${[...seen].join(', ')}`);
    await page.click('button:has-text("20 min")');
    await page.click('text=Back home');
    await page.waitForSelector('.today.done');
    await page.screenshot({ path: `${OUT}/${label}-05-home-after.png`, fullPage: true });
    // parent area
    await page.click('[aria-label="Grown-ups"]');
    for (const d of '1234') await page.click(`.pin-pad button[aria-label="${d}"]`);
    await page.waitForSelector('text=This week');
    await page.screenshot({ path: `${OUT}/${label}-06-parent.png`, fullPage: true });
    const [download] = await Promise.all([page.waitForEvent('download'), page.click('text=Save a backup file >> nth=0')]);
    console.log(`${label}: backup downloaded as ${download.suggestedFilename()}`);
    // weekly writing: do a piece, then mark it as the grown-up
    await page.click('[aria-label="Back"]');
    await page.click('text=Weekly writing');
    await page.click('text=Start this piece');
    await page.click('text=Type it here');
    await page.fill('textarea >> nth=0', 'A note for the first box');
    await page.screenshot({ path: `${OUT}/${label}-08-writing-plan.png`, fullPage: true });
    await page.click('text=Start writing');
    await page.fill('textarea', 'The door was green. '.repeat(40));
    await page.screenshot({ path: `${OUT}/${label}-09-writing.png`, fullPage: true });
    await page.click('text=I’ve finished: check it');
    await page.click('#crit-0');
    await page.click('text=Hand it in');
    await page.click('text=Back home');
    await page.click('[aria-label="Grown-ups"]');
    for (const d of '1234') await page.click(`.pin-pad button[aria-label="${d}"]`);
    await page.waitForSelector('text=Writing to read');
    // mark the reading answer
    await page.click('.card:has-text("Reading answers to mark") .option >> nth=2');
    await page.click('.card:has-text("Reading answers to mark") button:has-text("Save")');
    await page.waitForTimeout(200);
    for (let i = 0; i < 4; i++) await page.click(`.field:has(label:has-text("${i + 1}.")) .option >> nth=2`);
    await page.click('button:has-text("Your opening really hooked me.")');
    await page.click('button:has-text("Vary your sentence lengths")');
    await page.screenshot({ path: `${OUT}/${label}-10-marking.png`, fullPage: true });
    await page.click('text=Save feedback');
    await page.click('[aria-label="Back"]');
    await page.click('text=Feedback on your writing');
    await page.waitForSelector('text=What worked');
    await page.screenshot({ path: `${OUT}/${label}-11-feedback.png`, fullPage: true });
    await page.click('text=Back home');
    // reading
    await page.click('.home-card:has-text("minutes read this week")');
    await page.click('text=I’m reading this >> nth=0');
    await page.click('text=+20 min');
    await page.screenshot({ path: `${OUT}/${label}-12-reading.png`, fullPage: true });
    await page.click('[aria-label="Back"]');
    // a subject page
    await page.click('.region >> nth=3');
    await page.waitForSelector('.journey li');
    await page.screenshot({ path: `${OUT}/${label}-07-subject.png`, fullPage: true });
    // a second child on the Year 2 course: add, set up, play a full session, then pick from "Who's learning?"
    await page.click('[aria-label="Back"]').catch(() => {});
    await page.goto(`http://127.0.0.1:${PORT}/#/parent`);
    for (const d of '1234') await page.click(`.pin-pad button[aria-label="${d}"]`);
    await page.click('text=Add another child');
    await page.waitForSelector('#ob-name');
    await page.fill('#ob-name', 'Leo');
    await page.selectOption('#ob-pron', 'he');
    await page.selectOption('#ob-course', 'ks1');
    await page.screenshot({ path: `${OUT}/${label}-20-add-child.png`, fullPage: true });
    await page.click('text=Next: meet the capybara');
    await page.waitForSelector('#capy-name');
    await page.fill('#capy-name', 'Zoom');
    await page.fill('#hero-name', 'Captain Thunder');
    await page.click('text=Let’s go!');
    await page.waitForSelector('.btn-start');
    await page.screenshot({ path: `${OUT}/${label}-21-ks1-home.png`, fullPage: true });
    const course = await page.evaluate(() => window.__app.state.course);
    if (course !== 'ks1') throw new Error(`second child course is ${course}`);
    await page.evaluate(() => { const a = window.__app; a.state.sessions.push({ day: Math.floor(Date.now() / 864e5) - 1, start: 1, end: 2, answered: 5, correct: 5, completed: true }); a.state.plan = null; a.save(); });
    const playYoung = async (tag) => {
    await page.click('.btn-start');
    const seen2 = new Set();
    for (let k = 0; k < 300; k++) {
      await page.waitForTimeout(60);
      if (await page.$('text=Finished for today!')) break;
      const t = await page.evaluate(() => window.__app.state.plan?.steps[window.__app.state.plan.pos]?.t);
      if (t && !seen2.has(t)) { seen2.add(t); await page.screenshot({ path: `${OUT}/${label}-${tag}-step-${t}.png`, fullPage: true }); }
      await page.evaluate(() => { window.__app.sprintSeconds = 4; });
      const sIn = await page.$('.sprint-in');
      if (sIn) { const v = await page.evaluate(() => window.__app.sprintCurrent?.value); try { await sIn.fill(String(v ?? 1)); await sIn.press('Enter'); } catch { /* sprint ended */ } continue; }
      if (await page.$('text=Which subject shall we look at today?')) { await page.click('.choice-card >> nth=0'); continue; }
      const skip = await page.$('button:has-text("I haven’t learned this yet")');
      if (skip) { await skip.click(); continue; }
      if (await page.$('.confidence')) {
        const opt = await page.$('.option:not([disabled])');
        const typed = await page.$('.q-body input[type=text]:not([disabled])');
        if (opt) await opt.click();
        else if (typed) { const ans = await page.evaluate(() => { const a = window.__app; const st = a.state.plan.steps[a.state.plan.pos]; return a.db.items[st.id]?.answer || a.db.items[st.id]?.word || '7'; }); for (const i of await page.$$('.q-body input[type=text]:not([disabled])')) await i.fill(String(ans)); }
        else { const tap = await page.$('.map-box [data-id]'); if (tap) await tap.click({ force: true }); }
        if (!seen2.has('say')) { seen2.add('say'); if (!(await page.$('.say-btn'))) throw new Error('no read-aloud button on a Year 2 question'); }
        await page.click('.confidence button:has-text("Think so")');
        await page.waitForSelector('.feedback');
        await page.click('button:has-text("Next")');
        continue;
      }
      if (await page.$('.choice-card')) { await page.click('.choice-card'); continue; }
      if (await page.$('textarea:not([disabled])')) {
        await page.fill('textarea', 'What does Earth look like from space, because I love racing cars, and when I smile but yesterday I played?');
        const c = await page.$('button:has-text("Check")'); if (c) { await c.click(); await page.waitForTimeout(50); const again = await page.$('button:has-text("Check again")'); if (again) await again.click(); continue; }
        const b = await page.$('.q-wrap .btn-primary'); if (b) await b.click(); continue;
      }
      const o = await page.$('.options .option:not([disabled])'); if (o) { await o.click(); await page.waitForTimeout(40); }
      const b = await page.$('.q-wrap .btn-primary:not([disabled])'); if (b) { await b.click(); continue; }
      throw new Error(`${tag} stuck at step ${t}`);
    }
    return seen2;
    };
    const seen2 = await playYoung('ks1');
    console.log(`${label}: Year 2 session step types: ${[...seen2].join(', ')}`);
    // a grown-up moves him up to Year 3: everything is kept, and a Year 3 session runs
    await page.goto(`http://127.0.0.1:${PORT}/#/parent`);
    await page.waitForSelector('.pin-pad, button:has-text("Move up to Year 3")');
    if (await page.$('.pin-pad')) for (const d of '1234') await page.click(`.pin-pad button[aria-label="${d}"]`);
    page.once('dialog', (d) => d.accept());
    const cardsBefore = await page.evaluate(() => Object.keys(window.__app.state.cards).length);
    await page.click('button:has-text("Move up to Year 3")');
    await page.waitForSelector('button:has-text("Go back to Year 2")');
    await page.screenshot({ path: `${OUT}/${label}-24-moved-up.png`, fullPage: true });
    const up = await page.evaluate(() => [window.__app.state.course, Object.keys(window.__app.state.cards).length, window.__app.state.settings.sessionMinutes]);
    if (up[0] !== 'y3' || up[1] !== cardsBefore || up[2] !== 15) throw new Error(`moving up gave ${up} (cards before ${cardsBefore})`);
    await page.goto(`http://127.0.0.1:${PORT}/#/home`);
    await page.waitForSelector('.btn-start');
    await page.evaluate(() => { const a = window.__app; a.state.sessions.push({ day: Math.floor(Date.now() / 864e5) - 1, start: 1, end: 2, answered: 5, correct: 5, completed: true }); a.state.plan = null; a.save(); });
    await page.goto(`http://127.0.0.1:${PORT}/#/home`);
    await page.waitForSelector('.btn-start');
    await page.screenshot({ path: `${OUT}/${label}-25-y3-home.png`, fullPage: true });
    const seen3 = await playYoung('y3');
    console.log(`${label}: Year 3 session step types: ${[...seen3].join(', ')}`);
    await page.screenshot({ path: `${OUT}/${label}-22-ks1-done.png`, fullPage: true });
    // reload: with two children the app asks who is learning
    await page.evaluate(() => sessionStorage.removeItem('gs.profile'));
    await page.goto(`http://127.0.0.1:${PORT}/`);
    await page.waitForSelector('.who-card');
    await page.screenshot({ path: `${OUT}/${label}-23-who.png`, fullPage: true });
    await page.click('.who-card:has-text("Ada")');
    await page.waitForSelector('.btn-start, .today');
    const back = await page.evaluate(() => [window.__app.state.course, window.__app.state.profile.childName]);
    if (back[0] !== 'y6' || back[1] !== 'Ada') throw new Error(`switching back gave ${back}`);
    // page must not scroll sideways
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 1) errors.push(`${label}: horizontal overflow ${overflow}px`);
    await ctx.close();
  }
} catch (e) {
  failed = true;
  console.error('SMOKE FAILED:', e.message);
} finally {
  await browser.close();
  server.kill();
}
if (errors.length) { console.error('errors:\n' + errors.join('\n')); failed = true; }
console.log(failed ? 'smoke: FAIL' : 'smoke: OK', `(screenshots in ${OUT})`);
process.exit(failed ? 1 : 0);
