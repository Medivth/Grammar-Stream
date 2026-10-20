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
    await page.click('text=Next: hand over to her');
    await page.waitForSelector('#capy-name');
    await page.click('button:has-text("Flower")');
    await page.fill('#capy-name', 'Mochi');
    await page.screenshot({ path: `${OUT}/${label}-02-companion.png`, fullPage: true });
    await page.click('text=Let’s go!');
    await page.waitForSelector('text=Start today’s session');
    await page.screenshot({ path: `${OUT}/${label}-03-home.png`, fullPage: true });
    await page.click('text=Start today’s session');

    const seen = new Set();
    let steps = 0, reloaded = false;
    while (steps++ < 200) {
      await page.waitForTimeout(80);
      if (await page.$('text=Finished for today!')) break;
      const stepType = await page.evaluate(() => window.__app.state.plan?.steps[window.__app.state.plan.pos]?.t);
      if (stepType && !seen.has(stepType)) {
        seen.add(stepType);
        await page.screenshot({ path: `${OUT}/${label}-step-${stepType}.png`, fullPage: true });
      }
      if (!reloaded && steps === 12) { reloaded = true; await page.goto(`http://127.0.0.1:${PORT}/#/home`); await page.reload(); await page.waitForSelector('text=Continue today’s session'); await page.click('text=Continue today’s session'); continue; }
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
    await page.waitForSelector('text=Finished for today! See you tomorrow.');
    await page.screenshot({ path: `${OUT}/${label}-05-home-after.png`, fullPage: true });
    // parent area
    await page.click('[aria-label="Grown-ups"]');
    for (const d of '1234') await page.click(`.pin-pad button[aria-label="${d}"]`);
    await page.waitForSelector('text=This week');
    await page.screenshot({ path: `${OUT}/${label}-06-parent.png`, fullPage: true });
    const [download] = await Promise.all([page.waitForEvent('download'), page.click('text=Save a backup file >> nth=0')]);
    console.log(`${label}: backup downloaded as ${download.suggestedFilename()}`);
    // a subject page
    await page.click('[aria-label="Back"]');
    await page.click('.region >> nth=3');
    await page.waitForSelector('.topic-row');
    await page.screenshot({ path: `${OUT}/${label}-07-subject.png`, fullPage: true });
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
