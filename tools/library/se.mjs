// Turn a Standard Ebooks source tree (src/epub/...) into the app's book format: plain paragraphs
// grouped into chapters. No dependencies: SE's XHTML is regular enough for a small tokenizer.
//
// Kept: chapter/story headings, paragraphs (and list items), verse line breaks (as "\n"),
// italics (as *word*), scene breaks (as "* * *"). Dropped: images, footnote markers, page
// furniture, and every front/back-matter file (title page, imprint, colophon, uncopyright...).

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decode = (t) => t.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) => (e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : +e.slice(1)) : ENT[e] ?? m));
const attrsOf = (s) => Object.fromEntries([...s.matchAll(/([^\s=]+)="([^"]*)"/g)].map(([, k, v]) => [k, decode(v)]));
const types = (a) => (a['epub:type'] || '').split(/\s+/);

const SKIP = new Set(['head', 'figure', 'img', 'nav', 'script', 'style']);
const BLOCK = new Set(['p', 'li', 'dt', 'dd']);
const VOID = new Set(['br', 'hr', 'img', 'link', 'meta']);

/** Clean a run of text: collapse source whitespace, keep verse line breaks, drop word joiners. */
export function tidy(t) {
  return t.replace(/⁠/g, '').replace(/[ \t\r\n]+/g, ' ').replace(/ ?\u0001 ?/g, '\n').replace(/\*\s+\*/g, ' ').replace(/\*\*/g, '')
    .split('\n').map((l) => l.trim()).filter((l, i, a) => l || (i > 0 && i < a.length - 1)).join('\n').trim();
}

/**
 * Parse one SE XHTML file into events:
 *   { t: 'h', level, parts: [text...], sections: [ids] }   a heading (an <hgroup> gives several parts)
 *   { t: 'p', text, sections: [ids] }                      a paragraph
 * `sections` lists the ids of the open <section>/<article> elements, outermost first.
 */
export function parseXhtml(src) {
  const body = src.slice(src.indexOf('<body'));
  const bodyType = types(attrsOf(body.slice(0, body.indexOf('>'))));
  const events = [];
  const stack = []; // { tag, attrs }
  const sections = [];
  let skip = 0; // depth inside skipped elements
  let buf = null; // text of the current block/heading
  let hgroup = null; // parts of an open <hgroup>
  let headLevel = 0;
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z0-9]+)((?:\s+[^\s=>/]+(?:="[^"]*")?)*)\s*(\/?)>|([^<]+)/g;
  for (const m of body.matchAll(re)) {
    const [, close, rawTag, rawAttrs, selfClose, text] = m;
    if (text != null) { if (!skip && buf != null) buf.push(decode(text)); continue; }
    if (!rawTag) continue;
    const tag = rawTag.toLowerCase();
    if (!close) {
      const a = attrsOf(rawAttrs || '');
      const isVoid = selfClose || VOID.has(tag);
      if (skip || SKIP.has(tag) || (tag === 'a' && types(a).includes('noteref'))) { if (!isVoid) { skip++; stack.push({ tag, skipped: true }); } continue; }
      if (tag === 'br') { if (buf) buf.push('\u0001'); continue; }
      if (tag === 'hr') { events.push({ t: 'p', text: '* * *', sections: [...sections] }); continue; }
      if (isVoid) continue;
      stack.push({ tag, attrs: a });
      if (tag === 'section' || tag === 'article') sections.push(a.id || '');
      else if (tag === 'hgroup') { hgroup = []; headLevel = 0; }
      else if (/^h[1-6]$/.test(tag)) { buf = []; headLevel = headLevel || +tag[1]; }
      else if (BLOCK.has(tag) && buf == null) buf = [];
      else if ((tag === 'i' || tag === 'em') && buf && !hgroup && !/^h/.test(stack.at(-2)?.tag || '')) buf.push('*');
    } else {
      const top = stack.pop();
      if (!top) continue;
      if (top.skipped) { skip--; continue; }
      if (tag === 'section' || tag === 'article') sections.pop();
      else if (tag === 'hgroup') {
        if (hgroup.length) events.push({ t: 'h', level: headLevel || 2, parts: hgroup, sections: [...sections] });
        hgroup = null; headLevel = 0;
      } else if (/^h[1-6]$/.test(tag)) {
        const txt = tidy(buf.join('')).replace(/\n/g, ' ');
        buf = null;
        if (hgroup) { if (txt) hgroup.push(txt); } else { if (txt) events.push({ t: 'h', level: +tag[1], parts: [txt], sections: [...sections] }); headLevel = 0; }
      } else if (BLOCK.has(tag) && buf && !stack.some((s) => BLOCK.has(s.tag))) {
        const txt = tidy(buf.join(''));
        buf = null;
        if (!txt) continue;
        if (hgroup) hgroup.push(txt.replace(/\n/g, ' ').replace(/\*/g, ''));
        else events.push({ t: 'p', text: txt, sections: [...sections] });
      } else if ((tag === 'i' || tag === 'em') && buf && !hgroup) buf.push('*');
    }
  }
  return { bodyType, events };
}

/** Reading order from content.opf (file names under src/epub/text). */
export function spine(dir) {
  const opf = readFileSync(join(dir, 'src/epub/content.opf'), 'utf8');
  return [...opf.matchAll(/<itemref idref="([^"]+)"/g)].map((m) => m[1]);
}

const NEVER = /^(titlepage|imprint|colophon|uncopyright|loi|toc|halftitlepage|endnotes|glossary)\.xhtml$/;
const ROMAN = /^[IVXLC]+\.?$/;

/** "Book" + "I" → "Book I"; a bare numeral gets the recipe's label ("Chapter I"). */
function headingTitle(parts, label) {
  const [first, ...rest] = parts.map((p) => p.replace(/\*/g, ''));
  const head = ROMAN.test(first) || /^\d+$/.test(first) ? (label ? `${label} ${first.replace(/\.$/, '')}` : first) : first;
  return [head, ...rest].join(': ');
}

/**
 * Build chapters from a book's files.
 * recipe: { files?: [names], only?: [section ids], omit?: [{ id, title?, reason }], label?: 'Chapter',
 *           splitLevel?: n (deeper headings become an italic line inside the chapter) }
 */
export function chaptersFrom(dir, recipe) {
  const omitIds = new Set((recipe.omit || []).map((o) => o.id));
  const only = recipe.only ? new Set(recipe.only) : null;
  const files = (recipe.files || spine(dir)).filter((f) => !NEVER.test(f));
  const chapters = [];
  const heads = {}; // level -> title
  let cur = null, fresh = true;
  for (const f of files) {
    const fid = f.replace(/\.xhtml$/, '');
    const { bodyType, events } = parseXhtml(readFileSync(join(dir, 'src/epub/text', f), 'utf8'));
    if (!recipe.files && !bodyType.includes('bodymatter')) continue;
    for (const e of events) {
      const ids = [fid, ...e.sections];
      if (ids.some((id) => omitIds.has(id))) continue;
      if (only && !ids.some((id) => only.has(id))) continue;
      if (e.t === 'h') {
        const title = headingTitle(e.parts, recipe.label === undefined ? 'Chapter' : recipe.label);
        if (recipe.splitLevel && e.level > recipe.splitLevel) {
          if (cur) cur.paragraphs.push(`*${title}*`);
          continue;
        }
        for (const l of Object.keys(heads)) if (+l >= e.level) delete heads[l];
        heads[e.level] = title;
        fresh = true;
        continue;
      }
      if (fresh || !cur) {
        const levels = Object.keys(heads).map(Number).sort((a, b) => a - b);
        const title = levels.length ? heads[levels.at(-1)] : recipe.untitled || 'Untitled';
        const part = levels.slice(0, -1).map((l) => heads[l]).join(' · ');
        cur = { title, ...(part ? { part } : {}), paragraphs: [] };
        chapters.push(cur);
        fresh = false;
      }
      cur.paragraphs.push(e.text);
    }
  }
  // one shared part (a single "Part I" kept from a bigger book) says nothing: drop it
  const parts = new Set(chapters.map((c) => c.part));
  if (parts.size === 1) for (const c of chapters) delete c.part;
  return chapters;
}

export { countWords } from '../../js/core/library.js';
