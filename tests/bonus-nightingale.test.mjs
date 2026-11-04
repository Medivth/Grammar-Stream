// The Years 2/3 Florence Nightingale bonus module (tools/content-src/ks1/bonus-nightingale.mjs):
// a well-formed deck in both courses, every topic marked bonus: 'nightingale', dates that agree
// with each other everywhere they appear, and reading passages that are used.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildDB, validateDB } from '../js/core/content.js';
import { GENERATORS } from '../js/gen/index.js';

const root = new URL('../content/', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root)));
const PATH = 'ks1/history/bonus-nightingale.json';
const deck = read(PATH);
const { topics, items } = deck;
const T = Object.fromEntries(topics.map((t) => [t.id, t]));
const visualsOf = (x) => (x.visual ? (Array.isArray(x.visual) ? x.visual : [x.visual]) : []);
const textOf = (it) => [it.prompt, it.answer, ...(it.distractors || []), ...(it.options || []).flatMap((o) => [o.text, o.feedback]), ...(it.items || []), it.explain, it.hook, it.example, ...visualsOf(it).map((v) => v.caption)].filter(Boolean).join('\n');
const allText = [...topics.flatMap((t) => [t.title, t.intro, t.teach, t.talk, t.hook, ...visualsOf(t).map((v) => v.caption)]), ...items.map(textOf), ...new Set(items.map((i) => i.passage).filter(Boolean))].filter(Boolean).join('\n');

test('the deck is in the Year 2 and Year 3 courses and valid there', () => {
  assert.equal(deck.subject, 'history');
  assert.equal(deck.deck, 'bonus-nightingale');
  for (const idx of ['index-ks1.json', 'index-y3.json']) {
    const index = read(idx);
    assert.ok(index.decks.includes(PATH), `${idx} lists the deck`);
    const db = buildDB(index.decks.map(read));
    assert.deepEqual(validateDB(db, GENERATORS), [], idx);
    for (const t of topics) assert.ok(db.topics[t.id], `${idx}: ${t.id}`);
  }
});

test('topics: all bonus nightingale, 6-9 of them, a prerequisite chain inside the module, each one taught', () => {
  assert.ok(topics.length >= 6 && topics.length <= 9, `${topics.length} topics`);
  for (const t of topics) {
    assert.equal(t.bonus, 'nightingale', t.id);
    assert.ok(t.id.startsWith('history.fn-'), t.id);
    assert.ok(t.intro && t.teach && t.talk, `${t.id}: intro, teach and talk`);
    if (t.kind === 'facts') assert.ok(t.hook && visualsOf(t).length, `${t.id}: a memory hook and a picture`);
  }
  // the first topic has no prerequisites; every other one depends only on earlier topics of the module
  assert.deepEqual(topics[0].prereqs, []);
  const seen = new Set();
  for (const t of topics) {
    for (const p of t.prereqs) assert.ok(seen.has(p), `${t.id}: prereq ${p} comes earlier in the module`);
    if (t !== topics[0]) assert.ok(t.prereqs.length, `${t.id} has a prerequisite`);
    seen.add(t.id);
  }
  // and the chain reaches every topic from the first
  const reach = new Set([topics[0].id]);
  for (const t of topics) if (t.prereqs.some((p) => reach.has(p))) reach.add(t.id);
  assert.equal(reach.size, topics.length);
});

test('items: plenty of them, a mix of kinds, kind feedback on wrong answers', () => {
  assert.ok(items.length >= 70 && items.length <= 120, `${items.length} items`);
  const kinds = {};
  for (const it of items) kinds[it.kind] = (kinds[it.kind] || 0) + 1;
  assert.ok(kinds.fact >= 15 && kinds.mcq >= 40 && kinds.order >= 3, JSON.stringify(kinds));
  const tf = items.filter((i) => i.kind === 'mcq' && i.prompt.startsWith('True or false?'));
  assert.ok(tf.length >= 3, 'true or false questions');
  assert.ok(tf.some((i) => i.options.find((o) => o.correct).text === 'True') && tf.some((i) => i.options.find((o) => o.correct).text === 'False'), 'both answers occur');
  assert.ok(items.filter((i) => i.prompt?.startsWith('Then, now or both?')).length >= 5, 'then-and-now sorting');
  for (const it of items) {
    assert.ok(T[it.topic], `${it.id}: topic in the module`);
    assert.ok(it.id.startsWith('history.fn.'), it.id);
    assert.ok(it.explain, `${it.id}: explain`);
    if (it.kind === 'mcq') {
      assert.equal(it.options.filter((o) => o.correct).length, 1, `${it.id}: one correct`);
      for (const o of it.options.filter((x) => !x.correct)) assert.ok(o.feedback?.length > 10, `${it.id}: feedback for “${o.text}”`);
    }
    if (it.kind === 'fact') assert.ok(it.distractors.length >= 2 && it.formats?.includes('choice'), `${it.id}: a choice question`);
    if (it.kind === 'order') assert.equal(new Set(it.items).size, it.items.length, it.id);
  }
});

test('reading passages: original, the right length, curly quotes, each used by several questions', () => {
  const reading = topics.filter((t) => t.kind === 'reading').map((t) => t.id);
  assert.ok(reading.length >= 2);
  const uses = new Map();
  for (const it of items) {
    if (reading.includes(it.topic)) assert.ok(it.passage && it.passageSource, `${it.id}: a reading question carries its passage`);
    else assert.ok(!it.passage, `${it.id}: passages belong in the reading topics (no learn card gives the answer away)`);
    if (it.passage) uses.set(it.passage, (uses.get(it.passage) || 0) + 1);
  }
  assert.ok(uses.size >= 5, `${uses.size} passages`);
  for (const [p, n] of uses) {
    const title = p.split('\n')[0];
    const words = p.split(/\s+/).filter(Boolean).length;
    assert.ok(n >= 4, `${title}: used by ${n} questions`);
    assert.ok(words >= 120 && words <= 280, `${title}: ${words} words`);
    assert.ok(!/["']/.test(p), `${title}: straight quotes`);
  }
  // an option or explanation that quotes the passage quotes it exactly
  for (const it of items.filter((i) => i.passage)) {
    for (const s of [...(it.options || []).map((o) => o.text), it.explain]) {
      for (const m of s.matchAll(/“([^”]+)”/g)) {
        for (const part of m[1].split('…').map((x) => x.trim().replace(/[.,]$/, '')).filter(Boolean)) assert.ok(it.passage.toLowerCase().includes(part.toLowerCase()), `${it.id}: “${part}” is not in its passage`);
      }
    }
  }
});

// ---------------------------------------------------------------- dates
const KEY = { born: 1820, kaiserswerth: 1851, scutari: 1854, home: 1856, rose: 1858, notes: 1859, school: 1860, merit: 1907, died: 1910 };
const LABELS = [[/born/i, 'born'], [/trains|Kaiserswerth/i, 'kaiserswerth'], [/Scutari/i, 'scutari'], [/home from the war/i, 'home'], [/rose diagram/i, 'rose'], [/Notes on Nursing/i, 'notes'], [/nursing school|school opens/i, 'school'], [/Order of Merit/i, 'merit'], [/dies/i, 'died']];

test('timelines put each event of Florence’s life in the right year', () => {
  const lines = [...topics, ...items].flatMap(visualsOf).filter((v) => v.kind === 'timeline');
  assert.ok(lines.length >= 3);
  let checked = 0;
  for (const v of lines) {
    for (const [year, label] of v.events) {
      assert.ok(year >= v.from && year <= v.to, `${label} is inside its timeline`);
      const hit = LABELS.find(([re]) => re.test(label));
      if (hit) { assert.equal(year, KEY[hit[1]], `${label}`); checked++; }
    }
  }
  assert.ok(checked >= 10, `${checked} events checked`);
});

test('every year written in the module is one of the known dates, and each fact keeps its own year', () => {
  // real dates taught, plus the deliberately wrong years used as distractors
  const KNOWN = new Set([1805, 1820, 1851, 1853, 1854, 1855, 1856, 1857, 1858, 1859, 1860, 1907, 1910, 1926, 1928, 1948, 1975, 1994, 2016]);
  const DISTRACTORS = new Set([1066, 1666, 1920, 1940, 1960]);
  for (const m of allText.matchAll(/\b(1[0-9]{3}|20[0-9]{2})\b/g)) {
    const y = Number(m[1]);
    assert.ok(KNOWN.has(y) || DISTRACTORS.has(y), `unexpected year ${y}: …${allText.slice(Math.max(0, m.index - 60), m.index + 20)}…`);
  }
  for (const y of DISTRACTORS) for (const it of items) if (it.answer === String(y) || it.options?.some((o) => o.correct && o.text.includes(String(y)))) assert.fail(`${it.id}: a distractor year is an answer`);
  // in any sentence that names one of these and holds exactly one year, it is the right year
  const RULES = [
    [/Order of Merit|special honour/, [1907]], [/Notes on Nursing|famous book about caring/, [1859]], [/nursing school|Training School/i, [1860]], [/Statistical Society/, [1858]],
    [/Sanitary Commission|drains/i, [1855]], [/penicillin|antibiotic/i, [1928]], [/\bNHS\b|health service/i, [1948]], [/£10 note/, [1975, 1994]],
    [/Mary[^.]*\bborn\b|\bborn\b[^.]*Mary/, [1805]], [/Seacole[^.]*statue|statue[^.]*Seacole/i, [2016]],
    [/arrive[sd]? at Scutari|to Scutari|arrived on|set out/i, [1854]], [/Seacole remembered/, [2016]], [/Mary Seacole was born/, [1805]], [/Florence Nightingale died|Florence dies/, [1910]],
  ];
  const sentences = allText.split(/(?<=[.!?])\s+|\n+/);
  let checked = 0;
  for (const s of sentences) {
    const years = [...s.matchAll(/\b(1[89][0-9]{2}|20[0-9]{2})\b/g)].map((m) => Number(m[1]));
    if (years.length !== 1) continue;
    for (const [re, ok] of RULES) if (re.test(s)) { if (process.env.SHOW) console.log(years[0], s); assert.ok(ok.includes(years[0]), `“${s}” should say ${ok.join(' or ')}`); checked++; }
  }
  assert.ok(checked >= 10, `${checked} sentences checked`);
  // Florence: born 12 May 1820, died 13 August 1910 aged 90; Mary born 1805, 15 years earlier
  assert.ok(/12 May 1820/.test(allText) && /13 August 1910/.test(allText));
  assert.equal(KEY.died - KEY.born, 90);
  assert.ok(/aged 90|she was 90/.test(allText) && !/aged (?!90)\d+/.test(allText));
  assert.ok(/15 years before Florence/.test(allText) && 1820 - 1805 === 15);
});

test('order questions list events in time order, as their explanations say', () => {
  for (const it of items.filter((i) => i.kind === 'order' && !i.passage)) {
    const years = [...it.explain.matchAll(/\b(1[89][0-9]{2})\b/g)].map((m) => Number(m[1]));
    assert.equal(years.length, it.items.length, `${it.id}: one year per event in the explanation`);
    assert.deepEqual(years, [...years].sort((a, b) => a - b), `${it.id}: earliest first`);
  }
});

test('myths are not taught', () => {
  assert.ok(!/invented nursing|first ever nurse/i.test(allText.replace(/did not invent it/g, '')));
  assert.ok(/Turkish lantern/.test(allText), 'her lamp was a Turkish lantern');
  assert.ok(!/light ?saber/i.test(allText));
  const tf = Object.fromEntries(items.filter((i) => i.prompt?.startsWith('True or false?')).map((i) => [i.id, i.options.find((o) => o.correct).text]));
  assert.equal(tf['history.fn.tf-first'], 'False');
  assert.equal(tf['history.fn.tf-chart'], 'False');
});

test('choice questions do not give the answer away by length', () => {
  let n = 0, longest = 0, clearly = 0, chance = 0;
  for (const it of items) {
    const opts = it.kind === 'mcq' ? it.options.map((o) => [o.text.replace(/_/g, '').length, o.correct]) : it.kind === 'fact' ? [[it.answer.length, true], ...it.distractors.map((d) => [d.length, false])] : null;
    if (!opts || opts.length < 3) continue;
    const c = opts.find((o) => o[1])[0], w = Math.max(...opts.filter((o) => !o[1]).map((o) => o[0]));
    n++; chance += 1 / opts.length;
    if (c > w) longest++;
    if (c > w * 1.3 && c - w >= 8) clearly++;
  }
  assert.ok(clearly / n <= 0.05, `clearly longest ${clearly} of ${n}`);
  assert.ok(longest / n <= chance / n + 0.05, `longest ${longest} of ${n}`);
});
