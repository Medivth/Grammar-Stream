// Generate sw.js with the list of files to precache and a content hash as the version.
// Run after changing any app file: node tools/gen-precache.mjs   (--check to verify only)

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const INCLUDE = ['index.html', 'manifest.webmanifest', 'css', 'js', 'content', 'fonts', 'icons'];
const SKIP = /(^|\/)\.|LICENSE|\.md$/;

function walk(p, out) {
  const full = join(ROOT, p);
  if (!existsSync(full)) return;
  if (statSync(full).isDirectory()) for (const f of readdirSync(full).sort()) walk(join(p, f), out);
  else if (!SKIP.test(p)) out.push(p.split('\\').join('/'));
}

export function buildSW() {
  const files = [];
  for (const p of INCLUDE) walk(p, files);
  const hash = createHash('sha256');
  for (const f of files) hash.update(f).update(readFileSync(join(ROOT, f)));
  const version = hash.digest('hex').slice(0, 12);
  const list = ['./', ...files.map((f) => './' + f)];
  const template = readFileSync(join(ROOT, 'tools/sw-template.js'), 'utf8');
  return template.replace('__VERSION__', version).replace('__FILES__', JSON.stringify(list, null, 1));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const out = buildSW();
  const target = join(ROOT, 'sw.js');
  if (process.argv.includes('--check')) {
    if (!existsSync(target) || readFileSync(target, 'utf8') !== out) { console.error('sw.js is stale: run node tools/gen-precache.mjs'); process.exit(1); }
  } else {
    writeFileSync(target, out);
    console.log('wrote sw.js', relative(ROOT, target));
  }
}
