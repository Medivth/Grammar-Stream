// Draws every visual in the content in a real browser and screenshots each one, in light and dark
// and at phone and tablet width, so the pictures can be checked by eye. Fails on any page error.
// Usage: PW=$(npm root -g)/playwright node tools/visual-gallery.mjs <out-dir> [query, e.g. "course=y6" or "diagrams=1"]
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || 'playwright');
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = process.argv[2] || '/tmp/gs-gallery';
const QUERY = process.argv[3] || '';
const SHOTS = process.env.SHOTS !== '0';
mkdirSync(OUT, { recursive: true });
const PORT = 8000 + Math.floor(Math.random() * 900);
const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: ROOT, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));

const problems = [];
const browser = await chromium.launch();
try {
  for (const [label, viewport, scheme] of [['phone-light', { width: 390, height: 844 }, 'light'], ['tablet-dark', { width: 900, height: 900 }, 'dark']]) {
    const ctx = await browser.newContext({ viewport, colorScheme: scheme, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => problems.push(`${label}: ${e.message}`));
    page.on('console', (m) => { if (m.type() === 'error') problems.push(`${label} console: ${m.text()}`); });
    await page.goto(`http://127.0.0.1:${PORT}/tools/gallery.html?${QUERY}`);
    await page.waitForFunction(() => window.__gallery, null, { timeout: 60000 });
    await page.waitForTimeout(600); // labelled diagrams load their drawing asynchronously
    const { errors, count } = await page.evaluate(() => window.__gallery);
    problems.push(...errors.map((e) => `${label}: ${e}`));
    // anything wider than the screen (outside the scroll boxes made for it) is a layout bug
    const wide = await page.evaluate(() => [...document.querySelectorAll('.g-card')].filter((c) => c.scrollWidth > c.clientWidth + 2 && !c.querySelector('.visual-scroll')).map((c) => c.dataset.id));
    problems.push(...wide.map((id) => `${label}: too wide: ${id}`));
    const empty = await page.evaluate(() => [...document.querySelectorAll('.g-card')].filter((c) => !c.querySelector('svg, ol, ul, table, .vblocks, .vsounds')).map((c) => c.dataset.id));
    problems.push(...empty.map((id) => `${label}: nothing drawn: ${id}`));
    console.log(`${label}: ${count} visuals`);
    if (SHOTS) {
      const cards = await page.$$('.g-card');
      for (const [i, c] of cards.entries()) {
        const id = (await c.getAttribute('data-id')).replace(/[^a-z0-9.-]+/gi, '_').slice(0, 90);
        await c.screenshot({ path: `${OUT}/${label}-${String(i).padStart(3, '0')}-${id}.png` });
      }
    }
    await ctx.close();
  }
} finally {
  await browser.close();
  server.kill();
}
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log('gallery: OK');
