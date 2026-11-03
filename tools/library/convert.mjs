// Rebuild the library's original texts from Standard Ebooks, then the library index.
//   node tools/library/convert.mjs [--src DIR] [book-id ...]
// Each source repository is shallow-cloned into DIR (default: a folder in the system temp
// directory) at the commit pinned in tools/library/books.mjs, so the output is reproducible.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BOOKS } from './books.mjs';
import { chaptersFrom } from './se.mjs';
import { countWords } from '../../js/core/library.js';
import { buildIndex } from '../build-library.mjs';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const args = process.argv.slice(2);
const srcAt = args.indexOf('--src');
const SRC = srcAt >= 0 ? args.splice(srcAt, 2)[1] : join(tmpdir(), 'standardebooks');
const wanted = new Set(args);

const git = (...a) => execFileSync('git', a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }).trim();

function checkout(repo, commit) {
  const dir = join(SRC, repo);
  if (!existsSync(dir)) {
    mkdirSync(SRC, { recursive: true });
    git('clone', '-q', '--depth', '1', `https://github.com/standardebooks/${repo}.git`, dir);
  }
  if (git('-C', dir, 'rev-parse', 'HEAD') !== commit) {
    git('-C', dir, 'fetch', '-q', '--depth', '1', 'origin', commit);
    git('-C', dir, 'checkout', '-q', commit);
  }
  return dir;
}

/** The book file for one recipe. */
export function convert(recipe, dir) {
  const chapters = chaptersFrom(dir, recipe);
  const left = (recipe.omit || []).map((o) => `“${o.title}” (${o.reason})`);
  const note = [recipe.onlyNote, left.length ? `Left out: ${left.join('; ')}.` : '', recipe.note].filter(Boolean).join(' ');
  const { id, title, author, year, kind, courses, level, blurb, source, sourceUrl } = recipe;
  return { id, title, author, year, kind, courses, level, blurb, note, source, sourceUrl, words: countWords(chapters), chapters };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const r of BOOKS) {
    if (wanted.size && !wanted.has(r.id)) continue;
    const book = convert(r, checkout(r.repo, r.commit));
    writeFileSync(join(ROOT, 'library', `${r.id}.json`), JSON.stringify(book, null, 1) + '\n');
    console.log(`${r.id}: ${book.chapters.length} chapters, ${book.words} words`);
  }
  const { books, errors } = buildIndex();
  if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
  console.log(`library/index.json: ${books.length} books`);
}
