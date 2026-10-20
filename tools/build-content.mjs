// Build content/<subject>/<deck>.json and content/index.json from tools/content-src/*.mjs.
// Run: node tools/build-content.mjs        (writes files)
//      node tools/build-content.mjs --check (exits 1 if committed JSON is stale)

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const SOURCES = ['english', 'maths', 'history', 'geography', 'science'];
const MAPS = { world: 'maps/world.json', europe: 'maps/europe.json', uk: 'maps/uk.json' };

export async function buildAll() {
  const files = {};
  const decks = [];
  for (const s of SOURCES) {
    const mod = await import(new URL(`./content-src/${s}.mjs`, import.meta.url));
    for (const deck of mod.default) {
      const path = `${deck.subject}/${deck.deck}.json`;
      files[path] = JSON.stringify(deck, null, 1) + '\n';
      decks.push(path);
    }
  }
  files['index.json'] = JSON.stringify({ version: 1, decks, maps: MAPS }, null, 1) + '\n';
  return files;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const check = process.argv.includes('--check');
  const files = await buildAll();
  const root = new URL('../content/', import.meta.url);
  let stale = 0;
  for (const [path, text] of Object.entries(files)) {
    const url = new URL(path, root);
    if (check) {
      if (!existsSync(url) || readFileSync(url, 'utf8') !== text) { console.error('stale:', path); stale++; }
    } else {
      mkdirSync(new URL('.', url), { recursive: true });
      writeFileSync(url, text);
    }
  }
  if (check && stale) process.exit(1);
  if (!check) console.log(`wrote ${Object.keys(files).length} files`);
}
