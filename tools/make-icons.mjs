// Render app icons from the capybara SVG. Needs Playwright:
//   PW=$(npm root -g)/playwright node tools/make-icons.mjs
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { capybaraSVG } from '../js/ui/capybara.js';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || 'playwright');

const inner = capybaraSVG({ fur: 'caramel', accessory: 'yuzu', mood: 'happy' }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
const icon = (pad) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="${pad ? 0 : 112}" fill="#f4e4d4"/><g transform="translate(${256 - (pad ? 150 : 200)} ${256 - (pad ? 130 : 170)}) scale(${pad ? 1.5 : 2})">${inner}</g></svg>`;

writeFileSync(new URL('../icons/icon.svg', import.meta.url), icon(false));
const browser = await chromium.launch();
const page = await browser.newPage();
for (const [name, size, pad] of [['icon-192.png', 192, false], ['icon-512.png', 512, false], ['icon-maskable-512.png', 512, true]]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<body style="margin:0">${icon(pad).replace('<svg ', `<svg width="${size}" height="${size}" `)}</body>`);
  await page.screenshot({ path: new URL(`../icons/${name}`, import.meta.url).pathname, omitBackground: true });
}
await browser.close();
console.log('icons written');
