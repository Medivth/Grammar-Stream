// Year 8 French vocabulary deck (tools/content-src/y8/french.mjs) and the number, price, date and
// time generators (js/gen/y8french2.js). The generators' answers are re-derived here with an
// independent reader of French number words, dates and times.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildDB, validateDB } from '../js/core/content.js';
import { GENERATORS } from '../js/gen/index.js';
import { Y8_FRENCH2_GENERATORS } from '../js/gen/y8french2.js';
import { present } from '../js/core/present.js';
import { check, correctResponse, normalise } from '../js/core/checkers.js';
import { emptyState } from '../js/core/store.js';
import { makeRng } from '../js/core/rng.js';

const deck = JSON.parse(readFileSync(new URL('../content/y8/french/y8.json', import.meta.url)));
const db = buildDB([deck]);
const TOPICS = [
  ['v-greetings', 'Greetings and introductions'], ['v-numbers', 'Numbers and prices'], ['v-dates', 'Days, months, dates and birthdays'],
  ['v-time', 'Telling the time'], ['v-family', 'Family and pets'], ['v-describe', 'Describing people'],
  ['v-school', 'School: subjects, opinions and the timetable'], ['v-freetime', 'Free time and sport'], ['v-food', 'Food, drink and meals'],
  ['v-cafe', 'At the café and the market'], ['v-town', 'My town and directions'], ['v-home', 'Home and my bedroom'],
  ['v-weather', 'Weather and seasons'], ['v-holidays', 'Holidays and travel'], ['v-clothes', 'Clothes, colours and shopping'],
  ['v-routine', 'My daily routine'], ['v-health', 'The body and health'], ['v-tech', 'Media, technology and the internet'],
];
const BAD = /undefined|NaN|null|\[object|Infinity/;

test('the vocabulary deck has exactly the agreed topics, each well taught', () => {
  assert.deepEqual(deck.topics.map((t) => [t.id, t.title]), TOPICS.map(([id, title]) => [`french.${id}`, title]));
  assert.deepEqual(validateDB(db, GENERATORS), []);
  for (const t of deck.topics) {
    for (const k of ['intro', 'teach', 'talk', 'hook']) assert.ok(t[k] && t[k].length > 20, `${t.id}: ${k}`);
    assert.match(t.hook, /\*\*/, `${t.id}: the hook has a bold mnemonic`);
    for (const p of t.prereqs) assert.ok(p.startsWith('french.'), `${t.id}: prerequisite ${p} is French`);
    const n = db.itemsByTopic[t.id].length;
    assert.ok(n >= 10 && n <= 16, `${t.id}: ${n} items`);
  }
  for (const id of ['v-greetings', 'v-numbers']) assert.deepEqual(db.topics[`french.${id}`].prereqs, [], `${id} comes first`);
  assert.ok(deck.topics.filter((t) => t.diagnostic?.length === 2).length >= 8, 'Year 7 topics have placement checks');
  for (const id of ['v-numbers', 'v-dates', 'v-time']) assert.ok(db.itemsByTopic[`french.${id}`].some((i) => db.items[i].kind === 'template'), `${id} has a generator`);
});

test('every item can be presented in each of its formats and its own answer is accepted', () => {
  const state = emptyState(20000);
  const rng = makeRng('french-vocab');
  for (const item of Object.values(db.items)) {
    const formats = item.kind === 'fact' ? (item.formats || ['choice', 'cued', 'typed']) : [undefined];
    for (const format of formats) {
      for (let i = 0; i < (item.kind === 'template' ? 50 : 3); i++) {
        const q = present(item, undefined, { db, state, rng, format });
        const label = `${item.id} [${format ?? q.kind}]`;
        assert.ok(!BAD.test(`${q.prompt} ${q.explain} ${(q.steps || []).join(' ')} ${(q.options || []).map((o) => o.text).join(' ')}`), `${label}: ${q.prompt}`);
        if (q.kind === 'choice') {
          assert.equal(q.options.filter((o) => o.correct).length, 1, `${label}: one correct option`);
          assert.equal(new Set(q.options.map((o) => (item.kind === 'mcq' ? o.text : normalise(o.text)))).size, q.options.length, `${label}: duplicate options`);
          assert.ok(q.options.length >= 3, `${label}: at least three options`);
        }
        assert.equal(check(q, correctResponse(q)).correct, true, `${label}: own answer accepted`);
      }
    }
  }
});

test('French answers are marked as French; French prompts can be heard; hearing never gives the answer away', () => {
  const frenchy = /[àâçéèêëîïôûùüœ]|\b[ljdmtsnc]’|\b(le|la|les|un|une|des|je|il|elle|mon|ma|mes|du|de|est|au|en)\b/i;
  for (const it of Object.values(db.items).filter((i) => i.kind === 'fact')) {
    const typed = !it.formats || it.formats.includes('typed');
    if (it.prompt.startsWith('How do you say')) assert.equal(it.lang, 'fr', `${it.id}: English → French needs lang: 'fr'`);
    if (typed && frenchy.test(it.answer.replace(/’(s|ll|m|re|ve|t)\b/g, '').replace(/\b[A-Z]\S*/gu, ''))) assert.equal(it.lang, 'fr', `${it.id}: “${it.answer}” looks French`);
    if (it.lang === 'fr') assert.ok(!it.hear || !normalise(it.hear).includes(normalise(it.answer)), `${it.id}: hear gives the answer away`);
    if (it.prompt.startsWith('What does')) assert.ok(it.hear, `${it.id}: French in the prompt should be hearable`);
    // a wrong option must never be accepted when the answer is typed (accents are forgiven in French)
    if (typed) for (const d of it.distractors || []) assert.equal(check({ kind: 'typed', answer: it.answer, accept: it.accept, lang: it.lang, strict: it.strict }, d).correct, false, `${it.id}: distractor “${d}” would be accepted`);
  }
  for (const it of Object.values(db.items).filter((i) => i.kind === 'mcq')) {
    const right = it.options.find((o) => o.correct).text;
    for (const o of it.options.filter((x) => !x.correct)) assert.notEqual(o.text.normalize('NFD').replace(/[̀-ͯ]/g, ''), right.normalize('NFD').replace(/[̀-ͯ]/g, ''), `${it.id}: options differ only in accents`);
  }
});

test('French typography: curly apostrophes, a non-breaking space before ? ! : ;', () => {
  const text = JSON.stringify(deck);
  assert.ok(!/[A-Za-zÀ-ÿ]'[A-Za-zÀ-ÿ]/.test(text), 'straight apostrophe');
  assert.ok(!/ [?!;:]/.test(text), 'ordinary space before ? ! ; :');
  assert.ok(!/[a-z] [?!]\*\*$/.test(''), 'sanity');
  for (const name of Object.keys(Y8_FRENCH2_GENERATORS)) {
    const rng = makeRng(`typo:${name}`);
    for (let i = 0; i < 300; i++) {
      const q = Y8_FRENCH2_GENERATORS[name](1 + (i % 3), rng);
      const all = [q.prompt, q.explain, ...q.steps, ...(q.options || []).map((o) => o.text), q.answer || ''].join(' ');
      assert.ok(!/ [?!;:]/.test(all), `${name}: ${all}`);
      assert.ok(!/[a-z] \?/.test(q.prompt.replace(/combien \?|demain \?|hier \?/g, '')), `${name}: English question with a French space: ${q.prompt}`);
    }
  }
});

// ------------------------------------------------------------- an independent reader of French
const VAL = { zéro: 0, un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7, huit: 8, neuf: 9, dix: 10, onze: 11, douze: 12, treize: 13, quatorze: 14, quinze: 15, seize: 16, vingt: 20, vingts: 20, trente: 30, quarante: 40, cinquante: 50, soixante: 60, premier: 1 };
/** The value of French number words (lenient: it reads wrong spellings too, to tell numbers apart). */
function readNumber(w) {
  const toks = w.trim().replace(/-/g, ' ').split(/\s+/).filter((t) => t && t !== 'et');
  let total = 0, cur = 0;
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (t === 'mille' || t === 'mil' || t === 'milles') { total += (cur || 1) * 1000; cur = 0; } else if (t === 'cent' || t === 'cents') cur = (cur || 1) * 100;
    else if ((t === 'vingt' || t === 'vingts') && toks[i - 1] === 'quatre') cur += 76;
    else if (t in VAL) cur += VAL[t];
    else return NaN;
  }
  return total + cur;
}
/** Correct traditional spelling, written out a different way from the generator. */
function spell(n) {
  const small = 'zéro un deux trois quatre cinq six sept huit neuf dix onze douze treize quatorze quinze seize dix-sept dix-huit dix-neuf'.split(' ');
  if (n >= 1000) return `${n >= 2000 ? `${spell(Math.floor(n / 1000))} ` : ''}mille${n % 1000 ? ` ${spell(n % 1000)}` : ''}`;
  if (n >= 100) { const h = Math.floor(n / 100); return `${h > 1 ? `${small[h]} ` : ''}cent${h > 1 && n % 100 === 0 ? 's' : ''}${n % 100 ? ` ${spell(n % 100)}` : ''}`; }
  if (n < 20) return small[n];
  const table = { 2: 'vingt', 3: 'trente', 4: 'quarante', 5: 'cinquante', 6: 'soixante' };
  const t = Math.floor(n / 10), u = n % 10;
  if (t <= 6) return u === 0 ? table[t] : u === 1 ? `${table[t]} et un` : `${table[t]}-${small[u]}`;
  if (t === 7) return u === 1 ? 'soixante et onze' : `soixante-${small[10 + u]}`;
  if (n === 80) return 'quatre-vingts';
  return `quatre-vingt-${small[n - 80]}`;
}
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
/** “le jeudi trente et un mai deux mille treize” → { day, d, m, y } */
function readDate(s) {
  const toks = s.replace(/\*\*/g, '').trim().split(/\s+/);
  const mi = toks.findIndex((t) => MONTHS.includes(t));
  if (mi < 0) return null;
  let start = toks[0] === 'le' ? 1 : 0, day = null;
  if (DAYS.includes(toks[start])) day = DAYS.indexOf(toks[start++]);
  const dw = toks.slice(start, mi).join(' ');
  const d = /^\d+$/.test(dw) ? Number(dw) : dw === '1er' ? 1 : readNumber(dw);
  const yw = toks.slice(mi + 1).join(' ');
  return { day, d, m: MONTHS.indexOf(toks[mi]), y: yw ? readNumber(yw) : null };
}
/** “neuf heures moins le quart” → minutes after midnight (12-hour readings stay below 13:00). */
function readTime(s) {
  s = s.replace(/^il est /i, '').replace(/^à /, '').trim();
  let base, rest;
  if (s.startsWith('midi') || s.startsWith('minuit')) { base = 12; rest = s.replace(/^(midi|minuit)\s*/, ''); } else {
    const m = s.match(/^(.*?) heures?\b\s*(.*)$/);
    if (!m) return NaN;
    base = readNumber(m[1]); rest = m[2];
  }
  let delta = 0;
  if (rest === 'et quart') delta = 15;
  else if (rest === 'et demie' || rest === 'et demi') delta = 30;
  else if (rest === 'moins le quart') delta = -15;
  else if (rest.startsWith('moins ')) delta = -readNumber(rest.slice(6));
  else if (rest) delta = readNumber(rest);
  return base * 60 + delta;
}
const minutesOf = (dig) => { const [h, m] = dig.split(':').map(Number); return h * 60 + m; };
const PRICE = /^(\d+),(\d\d) €$/;
const readPrice = (s) => { const m = s.match(/^(.*?) euros?(?: (.*))?$/); return m ? readNumber(m[1]) * 100 + (m[2] ? readNumber(m[2]) : 0) : NaN; };
const figPrice = (s) => { const m = s.match(PRICE); return m ? Number(m[1]) * 100 + Number(m[2]) : NaN; };

test('the independent reader agrees with known French numbers', () => {
  const known = { 0: 'zéro', 16: 'seize', 21: 'vingt et un', 61: 'soixante et un', 70: 'soixante-dix', 71: 'soixante et onze', 77: 'soixante-dix-sept', 80: 'quatre-vingts', 81: 'quatre-vingt-un', 90: 'quatre-vingt-dix', 91: 'quatre-vingt-onze', 99: 'quatre-vingt-dix-neuf', 100: 'cent', 101: 'cent un', 200: 'deux cents', 201: 'deux cent un', 280: 'deux cent quatre-vingts', 1000: 'mille', 1789: 'mille sept cent quatre-vingt-neuf', 1980: 'mille neuf cent quatre-vingts', 2000: 'deux mille', 2026: 'deux mille vingt-six', 9999: 'neuf mille neuf cent quatre-vingt-dix-neuf' };
  for (const [n, w] of Object.entries(known)) { assert.equal(spell(Number(n)), w); assert.equal(readNumber(w), Number(n)); }
  for (let n = 0; n <= 9999; n++) assert.equal(readNumber(spell(n)), n, `${n}: ${spell(n)}`);
});

// ------------------------------------------------------------- the generators, fuzzed
const SEEDS = 3000;
function fuzz(name, verify) {
  test(`${name}: ${SEEDS} questions per level are well formed and right`, () => {
    for (const level of [1, 2, 3]) {
      const rng = makeRng(`fr-vocab:${name}:${level}`);
      for (let i = 0; i < SEEDS; i++) {
        const q = Y8_FRENCH2_GENERATORS[name](level, rng);
        const label = `${name} L${level} #${i}: ${q.prompt}`;
        const texts = [q.prompt, q.explain, ...(q.steps || []), ...(q.options || []).map((o) => o.text), q.answer ?? '', ...(q.accept || []), q.hear ?? ''];
        for (const t of texts) assert.ok(typeof t === 'string' && !BAD.test(t), `${label}: bad text “${t}”`);
        assert.equal(q.steps?.length, 3, `${label}: three worked steps`);
        assert.ok(q.explain, `${label}: explain`);
        if (q.kind === 'choice') {
          assert.equal(q.options.filter((o) => o.correct).length, 1, `${label}: one correct option`);
          assert.ok(q.options.length >= 3, `${label}: ${q.options.length} options`);
          assert.equal(new Set(q.options.map((o) => normalise(o.text))).size, q.options.length, `${label}: duplicate options`);
        } else {
          assert.equal(q.kind, 'typed');
          if (!q.numeric && !/in English/.test(q.prompt)) assert.equal(q.lang, 'fr', `${label}: typed French is marked`);
          if (q.lang === 'fr' && q.hear) assert.ok(!normalise(q.hear).includes(normalise(q.answer)), `${label}: hear gives it away`);
        }
        assert.equal(check(q, correctResponse(q)).correct, true, `${label}: own answer accepted`);
        verify(q, label, level);
      }
    }
  });
}
const right = (q) => q.options.find((o) => o.correct).text;
const wrongs = (q) => q.options.filter((o) => !o.correct).map((o) => o.text);
const bold = (s) => s.match(/\*\*(.+?)\*\*/)[1];

fuzz('y8frNumbers', (q, label, level) => {
  const range = [[0, 69], [70, 99], [100, 9999]][level - 1];
  if (q.numeric) {
    const n = Number(q.numeric.value);
    assert.equal(readNumber(bold(q.prompt)), n, label);
    assert.equal(bold(q.prompt), spell(n), label);
    assert.ok(n >= range[0] && n <= range[1], label);
    return;
  }
  const n = Number(bold(q.prompt));
  assert.ok(n >= range[0] && n <= range[1], label);
  if (q.kind === 'choice') {
    assert.equal(right(q), spell(n), label);
    for (const w of wrongs(q)) assert.ok(w !== spell(n) && w !== spell(n).replace(/ /g, '-'), `${label}: “${w}” is also right`);
  } else {
    assert.equal(q.answer, spell(n), label);
    for (const a of q.accept) assert.equal(readNumber(a), n, `${label}: accepts ${a}`);
    assert.equal(check(q, 'quatre-vingt').correct && n !== 80, false, label);
  }
});

fuzz('y8frPrices', (q, label) => {
  if (/Ça fait combien/.test(q.prompt)) {
    const unit = readPrice(bold(q.prompt));
    const k = { deux: 2, trois: 3, quatre: 4 }[q.prompt.match(/J’en achète (\S+)\./)[1]];
    assert.equal(figPrice(right(q)), unit * k, label);
    for (const w of wrongs(q)) assert.notEqual(figPrice(w), unit * k, label);
    return;
  }
  if (q.prompt.startsWith('Ça coûte')) {
    const c = readPrice(bold(q.prompt));
    assert.equal(figPrice(right(q)), c, label);
    assert.ok(c % 100 === 0 || c % 100 >= 10, `${label}: no prices with 1 to 9 cents`);
    for (const w of wrongs(q)) assert.ok(PRICE.test(w) && figPrice(w) !== c, `${label}: ${w}`);
    return;
  }
  const c = figPrice(bold(q.prompt));
  assert.ok(c % 100 === 0 || c % 100 >= 10, `${label}: no prices with 1 to 9 cents`);
  const said = (x) => `${spell(Math.floor(x / 100))} ${Math.floor(x / 100) === 1 ? 'euro' : 'euros'}${x % 100 ? ` ${spell(x % 100)}` : ''}`;
  if (q.kind === 'choice') {
    assert.equal(right(q), said(c), label);
    for (const w of wrongs(q)) assert.notEqual(w, said(c), label);
  } else {
    assert.equal(q.answer, said(c), label);
    for (const a of q.accept) assert.equal(readPrice(a.replace(/ et (.*) centimes$/, ' $1').replace(/ centimes$/, '')), c, `${label}: accepts ${a}`);
  }
});

fuzz('y8frDates', (q, label, level) => {
  if (level === 1) {
    if (q.prompt.startsWith('What does')) assert.equal(DAYS.indexOf(bold(q.prompt)), ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(right(q)), label);
    else if (q.prompt.startsWith('What is the day after')) assert.equal(q.answer, DAYS[(DAYS.indexOf(bold(q.prompt)) + 1) % 7], label);
    else assert.equal(q.kind === 'choice' ? right(q) : q.answer, MONTHS[MONTHS_EN.indexOf(bold(q.prompt))], label);
    return;
  }
  if (/Et (demain|hier)/.test(q.prompt)) {
    const t = readDate(bold(q.prompt)), r = readDate(right(q));
    const when = new Date(Date.UTC(2023, t.m, t.d + (/demain/.test(q.prompt) ? 1 : -1))); // 2023: not a leap year (and February is never crossed)
    assert.deepEqual([r.d, r.m], [when.getUTCDate(), when.getUTCMonth()], label);
    assert.equal(r.day, (t.day + (/demain/.test(q.prompt) ? 1 : 6)) % 7, label);
    assert.ok(right(q).includes(r.d === 1 ? 'premier' : spell(r.d)), label);
    for (const w of wrongs(q)) { const x = readDate(w); assert.ok(!x || x.d !== r.d || x.m !== r.m || x.day !== r.day || /\bun\b/.test(w), `${label}: ${w}`); }
    return;
  }
  if (q.prompt.startsWith('Write this date in English')) {
    const f = readDate(bold(q.prompt));
    assert.equal(q.answer, `${f.d} ${MONTHS_EN[f.m]}`, label);
    assert.ok(q.strict, `${label}: no near misses for dates`);
    assert.equal(check(q, `${f.d === 28 ? 27 : f.d + 1} ${MONTHS_EN[f.m]}`).correct, false, `${label}: the wrong day is not accepted`);
    return;
  }
  const m = bold(q.prompt).match(/^(\d+) (\w+)(?: (\d{4}))?$/);
  const [d, mo, y] = [Number(m[1]), MONTHS_EN.indexOf(m[2]), m[3] ? Number(m[3]) : null];
  const expected = `le ${d === 1 ? 'premier' : spell(d)} ${MONTHS[mo]}${y ? ` ${spell(y)}` : ''}`;
  if (q.kind === 'choice') {
    assert.equal(right(q), expected, label);
    for (const w of wrongs(q)) assert.notEqual(w, expected, label);
  } else {
    assert.equal(q.answer, expected, label);
    for (const a of q.accept) { const x = readDate(a); assert.deepEqual([x.d, x.m], [d, mo], `${label}: accepts ${a}`); }
    if (d === 11 || d === 8) assert.equal(check(q, `l’${spell(d)} ${MONTHS[mo]}`).correct, false, `${label}: no elision`);
  }
});

fuzz('y8frTime', (q, label, level) => {
  if (q.prompt.includes('24-hour clock?')) {
    const said = bold(q.prompt);
    const add = /après-midi|soir/.test(said) ? 12 * 60 : 0;
    assert.equal(readTime(said.replace(/ (du matin|de l’après-midi|du soir)$/, '')) + add, minutesOf(right(q)), label);
    return;
  }
  if (/What time is (it|that)\?/.test(q.prompt)) {
    const t = readTime(bold(q.prompt));
    assert.equal(t, minutesOf(right(q)), label);
    for (const w of wrongs(q)) assert.notEqual(minutesOf(w) % 720, t % 720, `${label}: ${w} is the same time`);
    return;
  }
  const t = minutesOf(bold(q.prompt).replace(/^It is |\.$/g, ''));
  const forms = q.kind === 'choice' ? [right(q)] : [q.answer, ...q.accept];
  for (const f of forms) {
    const v = readTime(f);
    if (level === 3) assert.equal(v, t, `${label}: ${f}`);
    else assert.equal(v % 720, t % 720, `${label}: ${f}`);
  }
  if (q.kind === 'choice') for (const w of wrongs(q)) assert.ok(Number.isNaN(readTime(w)) || readTime(w) % 720 !== t % 720 || /demi$|heure$|un heure|quarte/.test(w), `${label}: ${w} is also right`);
  if (q.kind === 'typed' && t % 60 === 30 && level < 3) assert.equal(check(q, q.answer.replace(/demie$/, 'demi')).correct, false, `${label}: et demi is wrong after heures`);
});
