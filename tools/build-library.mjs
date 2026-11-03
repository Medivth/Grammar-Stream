// Validate every library/<id>.json book file and write library/index.json (the small list the
// shelf reads; the book files themselves are fetched, and cached, only when opened).
//   node tools/build-library.mjs          fix word counts, write the index
//   node tools/build-library.mjs --check  report problems only (exit 1 if any, or if the index is stale)

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COURSES } from '../js/core/subjects.js';
import { validateBook, indexEntry, countWords } from '../js/core/library.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
export const LIB = join(ROOT, 'library');

export const bookFiles = () => (existsSync(LIB) ? readdirSync(LIB).filter((f) => f.endsWith('.json') && f !== 'index.json').sort() : []);

/** Read, check and index the library. With write, word counts are corrected and the index written. */
export function buildIndex({ write = true } = {}) {
  const errors = [];
  const books = [];
  const seen = new Map();
  for (const f of bookFiles()) {
    let b;
    try { b = JSON.parse(readFileSync(join(LIB, f), 'utf8')); } catch (e) { errors.push(`${f}: not valid JSON (${e.message})`); continue; }
    if (write && Array.isArray(b.chapters) && b.chapters.every((c) => Array.isArray(c?.paragraphs))) {
      const n = countWords(b.chapters);
      if (b.words !== n) { b.words = n; writeFileSync(join(LIB, f), JSON.stringify(b, null, 1) + '\n'); }
    }
    errors.push(...validateBook(b, { courses: Object.keys(COURSES), file: f }));
    if (seen.has(b.id)) errors.push(`${f}: id ${b.id} is also used by ${seen.get(b.id)}`);
    seen.set(b.id, f);
    if (Array.isArray(b.chapters)) books.push(indexEntry(b));
  }
  books.sort((a, b) => a.id.localeCompare(b.id));
  const index = JSON.stringify({ books }, null, 1) + '\n';
  const target = join(LIB, 'index.json');
  if (write) { mkdirSync(LIB, { recursive: true }); writeFileSync(target, index); }
  else if (!existsSync(target) || readFileSync(target, 'utf8') !== index) errors.push('library/index.json is stale: run node tools/build-library.mjs');
  return { books, errors };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const check = process.argv.includes('--check');
  const { books, errors } = buildIndex({ write: !check });
  if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
  console.log(`${check ? 'checked' : 'wrote'} library/index.json: ${books.length} books, ${books.reduce((a, b) => a + b.words, 0)} words`);
}
