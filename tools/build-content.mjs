// Build content/<subject>/<deck>.json and content/index.json from tools/content-src/*.mjs.
// Run: node tools/build-content.mjs        (writes files)
//      node tools/build-content.mjs --check (exits 1 if committed JSON is stale)

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const SOURCES = ['english', 'english-y7', 'maths', 'history', 'history-y7', 'geography', 'geography-y7', 'science', 'science-y7', 'reading-writing', 'timeline', 'synoptic', 'reading', 'stretch-maths', 'stretch-english', 'stretch-history', 'stretch-geography', 'stretch-science', 'latin'];
const MAPS = { world: 'maps/world.json', europe: 'maps/europe.json', uk: 'maps/uk.json' };
const { DIAGRAMS } = await import(new URL('./content-src/diagrams.mjs', import.meta.url));
const { attachDiagrams } = await import(new URL('./content-src/attach-diagrams.mjs', import.meta.url));

// the Year 2 course: tools/content-src/ks1/*.mjs -> content/ks1/<subject>/<deck>.json, content/index-ks1.json
const KS1_SOURCES = ['maths', 'maths2', 'maths3', 'phonics', 'reading', 'reading2', 'reading3', 'reading4', 'spelling', 'spelling2', 'spelling3', 'writing', 'science', 'science2', 'history', 'history2', 'books'];
// the Year 3 course: every Year 2 deck (Year 2 stretch topics count as core there) plus
// tools/content-src/y3/*.mjs -> content/y3/...; its own reading ladder and the merged timeline come last.
const Y3_SOURCES = ['maths', 'phonics', 'reading', 'spelling', 'science', 'history', 'books'];
// the Year 8 course (its own content only): tools/content-src/y8/*.mjs -> content/y8/..., content/index-y8.json
const Y8_SOURCES = ['english', 'english2', 'english-lang', 'english-lang2', 'maths', 'maths2', 'maths3', 'science', 'science2', 'history', 'history2', 'geography', 'geography2', 'computing', 'computing2', 'greek', 'greek2', 'greek3', 'books'];

export async function buildAll() {
  const files = {};
  const decks = [];
  const ks1Decks = [];
  const y3Decks = [];
  const y8Decks = [];
  let y3Ladder = false;
  for (const [list, dir, out] of [[SOURCES, '', decks], [KS1_SOURCES, 'ks1/', ks1Decks], [Y3_SOURCES, 'y3/', y3Decks], [Y8_SOURCES, 'y8/', y8Decks]]) {
    for (const s of list) {
      const mod = await import(new URL(`./content-src/${dir}${s}.mjs`, import.meta.url));
      for (const deck of mod.default) {
        if (dir === 'ks1/') for (const t of deck.topics || []) if (t.tier === 'stretch') t.coreIn = ['y3'];
        if (dir === 'y3/' && deck.ladder) y3Ladder = true;
        attachDiagrams(deck, dir ? dir.slice(0, -1) : 'y6');
        const path = `${dir}${deck.subject}/${deck.deck}.json`;
        files[path] = JSON.stringify(deck, null, 1) + '\n';
        out.push(path);
      }
    }
  }
  const maps = { ...MAPS };
  for (const d of DIAGRAMS) {
    files[`maps/${d.id}.json`] = JSON.stringify(d) + '\n';
    maps[d.id] = `maps/${d.id}.json`;
  }
  files['index.json'] = JSON.stringify({ version: 1, decks, maps }, null, 1) + '\n';
  files['index-ks1.json'] = JSON.stringify({ version: 1, course: 'ks1', decks: ks1Decks, maps }, null, 1) + '\n';
  // Year 3 children have usually finished Set 2 and 3 Speed Sounds, so the Year 2 phonics deck
  // comes last there: still available for revision, but Year 3 topics are offered first.
  const y2Phonics = 'ks1/reading/phonics.json';
  const y3All = [...ks1Decks.filter((p) => p !== y2Phonics && !(y3Ladder && p === 'ks1/reading/books.json')), ...y3Decks, y2Phonics];
  files['index-y3.json'] = JSON.stringify({ version: 1, course: 'y3', decks: y3All, maps }, null, 1) + '\n';
  files['index-y8.json'] = JSON.stringify({ version: 1, course: 'y8', decks: y8Decks, maps }, null, 1) + '\n';
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
