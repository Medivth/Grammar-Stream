// Year 8 French grammar (tools/content-src/y8/french2.mjs and js/gen/y8french.js): the topics are the
// ones the card sets expect, every item can be answered, typed French is marked as French, and the
// generators are fuzzed with their answers re-derived independently from the rules (and, for the
// irregular verbs, from a second hand-typed table).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { setCourse } from '../js/core/subjects.js';
import { buildDB, validateDB } from '../js/core/content.js';
import { GENERATORS } from '../js/gen/index.js';
import { present } from '../js/core/present.js';
import { check, correctResponse, normalise } from '../js/core/checkers.js';
import { emptyState } from '../js/core/store.js';
import { makeRng } from '../js/core/rng.js';
import { assertWellFormed } from './generators.test.mjs';
import * as F from '../js/gen/y8french.js';

setCourse('y8');
const read = (p) => JSON.parse(readFileSync(new URL(`../content/${p}`, import.meta.url)));
const deck = read('y8/french/y8-grammar.json');
const index = read('index-y8.json');
const db = buildDB(index.decks.map(read));
const G = F.Y8_FRENCH_GENERATORS;

const TOPICS = {
  'g-gender': 'Nouns, gender and articles', 'g-er': 'The present tense: -er verbs', 'g-ir-re': 'The present tense: -ir and -re verbs',
  'g-irregular': 'Key irregular verbs: être, avoir, aller, faire', 'g-negatives': 'Negatives', 'g-adjectives': 'Adjectives: agreement and position',
  'g-possessives': 'Possessive adjectives', 'g-questions': 'Asking questions', 'g-partitive': 'Some and any: du, de la, des, de',
  'g-prepositions': 'To, at and in: à, au, en, aux', 'g-modals': 'Modal verbs: pouvoir, vouloir, devoir', 'g-reflexive': 'Reflexive verbs',
  'g-future': 'The near future: aller + infinitive', 'g-perfect-avoir': 'The perfect tense with avoir', 'g-perfect-etre': 'The perfect tense with être',
  'g-imperfect': 'The imperfect: c’était and il y avait', 'g-opinions': 'Opinions, reasons and connectives',
};

test('French grammar: the seventeen topics, titles and fields as listed', () => {
  assert.deepEqual(deck.topics.map((t) => t.id), Object.keys(TOPICS).map((k) => `french.${k}`));
  for (const t of deck.topics) {
    assert.equal(t.title, TOPICS[t.id.slice(7)], t.id);
    for (const k of ['intro', 'teach', 'talk', 'hook']) assert.ok(t[k]?.length > 20, `${t.id}: ${k}`);
    assert.ok(t.hook.includes('**'), `${t.id}: hook has a bold memory aid`);
    for (const p of t.prereqs) assert.ok(p.startsWith('french.'), `${t.id}: prereq ${p} is French`);
    assert.equal(t.prereqs.length === 0, t.id === 'french.g-gender', `${t.id}: only g-gender starts the deck`);
    assert.ok(t.visual, `${t.id}: a table`);
  }
  assert.ok(deck.topics.find((t) => t.id === 'french.g-perfect-etre').prereqs.includes('french.g-perfect-avoir'));
  assert.equal(deck.topics.find((t) => t.id === 'french.g-imperfect').tier, 'stretch');
  const errs = validateDB(db, GENERATORS).filter((e) => e.includes('french.g-'));
  assert.deepEqual(errs, []);
  for (const t of deck.topics) {
    const its = deck.items.filter((i) => i.topic === t.id && i.kind !== 'template');
    assert.ok(its.length >= 8 && its.length <= 13, `${t.id}: ${its.length} hand-written items`);
  }
});

test('French grammar items: answerable, typed French marked lang fr, hear never gives the answer away', () => {
  const state = emptyState(20000);
  state.profile = { childName: 'Test' };
  const rng = makeRng('fr-grammar');
  for (const item of deck.items) {
    const formats = item.kind === 'fact' ? (item.formats || ['choice', 'cued', 'typed']) : [undefined];
    if (item.kind === 'fact') {
      const isFrench = !/^What does /.test(item.prompt); // every other fact asks for French
      assert.equal(item.lang === 'fr', isFrench, `${item.id}: lang fr exactly when the answer is French (${item.answer})`);
      for (const d of item.distractors) assert.notEqual(normalise(d), normalise(item.answer), `${item.id}: distractor equals answer`);
    }
    if (item.hear) assert.ok(item.prompt.includes(item.hear.replace(/ /g, ' ')) || item.prompt.replace(/ /g, ' ').includes(item.hear.replace(/ /g, ' ')), `${item.id}: hear is in the prompt`);
    for (const format of formats) {
      for (let i = 0; i < (item.kind === 'template' ? 50 : 2); i++) {
        const q = present(item, undefined, { db, state, rng, format });
        if (item.kind === 'template') { assertWellFormed(q, item.id); continue; }
        assert.equal(check(q, correctResponse(q)).correct, true, `${item.id} [${format}]`);
        if (q.kind === 'choice') assert.equal(q.options.filter((o) => o.correct).length, 1, `${item.id}: one correct`);
      }
    }
  }
  // the Year-7 topics have a placement check made of two of their own choice items
  for (const id of ['g-gender', 'g-er', 'g-irregular', 'g-negatives', 'g-adjectives', 'g-possessives', 'g-questions', 'g-opinions']) {
    const t = deck.topics.find((x) => x.id === `french.${id}`);
    assert.equal(t.diagnostic?.length, 2, id);
  }
});

// ------------------------------------------------------------------------------------------------
// independent re-derivation of the verb tables
const VOWEL = /^[aeiouhéèêâîôœ]/;
function regularPresent(inf) {
  const stem = inf.slice(0, -2), end = inf.slice(-2);
  if (end === 'ir') return ['is', 'is', 'it', 'issons', 'issez', 'issent'].map((e) => stem + e);
  if (end === 're') return ['s', 's', '', 'ons', 'ez', 'ent'].map((e) => stem + e);
  const forms = ['e', 'es', 'e', 'ons', 'ez', 'ent'].map((e) => stem + e);
  if (stem.endsWith('g')) forms[3] = `${stem}eons`;
  if (stem.endsWith('c')) forms[3] = `${stem.slice(0, -1)}çons`;
  // stem changes in the four “boot” forms (je, tu, il, ils)
  const boot = (f) => [0, 1, 2, 5].forEach((i) => { forms[i] = f(forms[i]); });
  if (inf === 'acheter' || inf === 'lever' || inf === 'promener') boot((x) => x.replace(/e(t|v|n)(e|es|ent)$/, 'è$1$2'));
  if (inf === 'préférer' || inf === 'espérer') boot((x) => x.replace(/é(r)(e|es|ent)$/, 'è$1$2'));
  if (inf === 'appeler') boot((x) => x.replace(/l(e|es|ent)$/, 'll$1'));
  return forms;
}
// irregular verbs typed out a second time, separately from the generator file
const IRREGULAR_CHECK = {
  être: 'je suis, tu es, il est, nous sommes, vous êtes, ils sont | été', avoir: 'j’ai, tu as, il a, nous avons, vous avez, ils ont | eu',
  aller: 'je vais, tu vas, il va, nous allons, vous allez, ils vont | allé', faire: 'je fais, tu fais, il fait, nous faisons, vous faites, ils font | fait',
  prendre: 'je prends, tu prends, il prend, nous prenons, vous prenez, ils prennent | pris', comprendre: 'je comprends, tu comprends, il comprend, nous comprenons, vous comprenez, ils comprennent | compris',
  apprendre: 'j’apprends, tu apprends, il apprend, nous apprenons, vous apprenez, ils apprennent | appris', venir: 'je viens, tu viens, il vient, nous venons, vous venez, ils viennent | venu',
  devenir: 'je deviens, tu deviens, il devient, nous devenons, vous devenez, ils deviennent | devenu', revenir: 'je reviens, tu reviens, il revient, nous revenons, vous revenez, ils reviennent | revenu',
  sortir: 'je sors, tu sors, il sort, nous sortons, vous sortez, ils sortent | sorti', partir: 'je pars, tu pars, il part, nous partons, vous partez, ils partent | parti',
  dormir: 'je dors, tu dors, il dort, nous dormons, vous dormez, ils dorment | dormi', lire: 'je lis, tu lis, il lit, nous lisons, vous lisez, ils lisent | lu',
  écrire: 'j’écris, tu écris, il écrit, nous écrivons, vous écrivez, ils écrivent | écrit', boire: 'je bois, tu bois, il boit, nous buvons, vous buvez, ils boivent | bu',
  voir: 'je vois, tu vois, il voit, nous voyons, vous voyez, ils voient | vu', mettre: 'je mets, tu mets, il met, nous mettons, vous mettez, ils mettent | mis',
  dire: 'je dis, tu dis, il dit, nous disons, vous dites, ils disent | dit', pouvoir: 'je peux, tu peux, il peut, nous pouvons, vous pouvez, ils peuvent | pu',
  vouloir: 'je veux, tu veux, il veut, nous voulons, vous voulez, ils veulent | voulu', devoir: 'je dois, tu dois, il doit, nous devons, vous devez, ils doivent | dû',
  savoir: 'je sais, tu sais, il sait, nous savons, vous savez, ils savent | su', ouvrir: 'j’ouvre, tu ouvres, il ouvre, nous ouvrons, vous ouvrez, ils ouvrent | ouvert',
  courir: 'je cours, tu cours, il court, nous courons, vous courez, ils courent | couru', recevoir: 'je reçois, tu reçois, il reçoit, nous recevons, vous recevez, ils reçoivent | reçu',
  naître: 'je nais, tu nais, il naît, nous naissons, vous naissez, ils naissent | né',
};
const ETRE_VERBS = ['devenir', 'revenir', 'monter', 'rester', 'sortir', 'venir', 'aller', 'naître', 'descendre', 'entrer', 'rentrer', 'tomber', 'retourner', 'arriver', 'mourir', 'partir'];
const PRON = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];
const withPronoun = (p, f) => (p === 0 && VOWEL.test(f) ? `j’${f}` : `${PRON[p]} ${f}`);

test('verb tables: regular verbs match the rules, irregular ones match a second table, auxiliaries are right', () => {
  for (const vb of [...F.ER, ...F.ER_SPELL, ...F.IR, ...F.RE]) {
    assert.deepEqual(vb.pres, regularPresent(vb.inf), vb.inf);
    const end = vb.inf.slice(-2);
    assert.equal(vb.pp, vb.inf.slice(0, -2) + { er: 'é', ir: 'i', re: 'u' }[end], `${vb.inf}: past participle`);
    assert.equal(vb.aux, ETRE_VERBS.includes(vb.inf) ? 'être' : 'avoir', `${vb.inf}: auxiliary`);
  }
  for (const vb of F.REFLEXIVE) {
    const bare = vb.inf.replace(/^(se |s’)/, '');
    assert.deepEqual(vb.pres, regularPresent(bare), vb.inf);
    assert.equal(vb.pp, `${bare.slice(0, -2)}é`, vb.inf);
    assert.equal(vb.aux, 'être');
  }
  for (const [inf, line] of Object.entries(IRREGULAR_CHECK)) {
    const [forms, pp] = line.split(' | ');
    const vb = F.IRREG[inf];
    assert.ok(vb, inf);
    assert.equal(vb.pres.map((f, p) => withPronoun(p, f)).join(', '), forms, inf);
    assert.equal(vb.pp, pp, `${inf}: past participle`);
    assert.equal(vb.aux, ETRE_VERBS.includes(inf) ? 'être' : 'avoir', `${inf}: auxiliary`);
  }
  assert.deepEqual(Object.keys(F.IRREG).sort(), Object.keys(IRREGULAR_CHECK).sort());
  // wrong forms offered as distractors are never real forms of the verb
  for (const vb of [...F.ER_SPELL]) if (vb.wrong) for (const w of vb.wrong.split(' ')) assert.ok(!vb.pres.includes(w) && w !== vb.pp, `${vb.inf}: ${w}`);
  for (const vb of Object.values(F.IRREG)) for (const w of (vb.wrongPP || '').split(' ').filter(Boolean)) assert.ok(!vb.pres.includes(w) && w !== vb.pp && w !== vb.inf, `${vb.inf}: ${w}`);
});

test('elision, agreement and the small word tables', () => {
  assert.equal(F.subj('je', 'aime'), 'j’aime');
  assert.equal(F.subj('je', 'habite'), 'j’habite');
  assert.equal(F.subj('je', 'joue'), 'je joue');
  assert.equal(F.neg('ai'), 'n’ai');
  assert.equal(F.refl(0, 'habille'), 'm’habille');
  assert.equal(F.refl(3, 'habillons'), 'nous habillons');
  assert.equal(F.phraseFor('se lever tôt', 3), 'nous lever tôt');
  assert.equal(F.phraseFor('s’amuser', 0), 'm’amuser');
  const P = (fr, p, g, pl) => ({ fr, p, g, pl });
  const verb = F.verb;
  assert.equal(F.perfectEtre(verb('aller'), P('elle', 2, 'f', false), false), 'elle est allée');
  assert.equal(F.perfectEtre(verb('aller'), P('je', 0, 'f', false), true), 'je ne suis pas allée');
  assert.equal(F.perfectEtre(verb('arriver'), P('elles', 5, 'f', true), true), 'elles ne sont pas arrivées');
  assert.equal(F.perfectEtre(verb('se lever'), P('il', 2, 'm', false), true), 'il ne s’est pas levé');
  assert.equal(F.perfectEtre(verb('s’habiller'), P('nous', 3, 'f', true), false), 'nous nous sommes habillées');
  assert.equal(F.perfectEtre(verb('s’amuser'), P('tu', 1, 'm', false), false), 'tu t’es amusé');
  assert.equal(F.perfectEtre(verb('naître'), P('vous', 4, 'f', false), false), 'vous êtes née');
  assert.equal(F.perfectAvoir(verb('jouer'), P('je', 0, 'f', false), true), 'je n’ai pas joué');
  assert.equal(F.perfectAvoir(F.IRREG.être, P('nous', 3, 'm', true), false), 'nous avons été');
  // articles and partitives against the rule: le/la, l’ before a vowel; plurals in -eau, -al
  for (const n of F.NOUNS) {
    assert.equal(F.theFor(n), VOWEL.test(n.fr) ? 'l’' : n.g === 'm' ? 'le' : 'la', n.fr);
    const pl = /eau$/.test(n.fr) ? `${n.fr}x` : /al$/.test(n.fr) ? `${n.fr.slice(0, -2)}aux` : /[sxz]$/.test(n.fr) ? n.fr : `${n.fr}s`;
    if (!n.mass) assert.equal(n.plural, pl, n.fr);
  }
  for (const f of F.FOODS) assert.equal(F.partitive(f), f.pl ? 'des' : VOWEL.test(f.fr) ? 'de l’' : f.g === 'm' ? 'du' : 'de la', f.fr);
  // adjectives: regular ones follow +e/+s; the rest are listed
  const SPECIAL = { blanc: 'blanc blanche blancs blanches', beau: 'beau belle beaux belles', nouveau: 'nouveau nouvelle nouveaux nouvelles', vieux: 'vieux vieille vieux vieilles', gris: 'gris grise gris grises', marron: 'marron marron marron marron', long: 'long longue longs longues', heureux: 'heureux heureuse heureux heureuses', paresseux: 'paresseux paresseuse paresseux paresseuses', sérieux: 'sérieux sérieuse sérieux sérieuses', sportif: 'sportif sportive sportifs sportives', créatif: 'créatif créative créatifs créatives', gentil: 'gentil gentille gentils gentilles' };
  for (const [k, a] of [...Object.entries(F.ADJ), ...Object.entries(F.PADJ)]) {
    const want = SPECIAL[k] ? SPECIAL[k].split(' ') : k.endsWith('e') ? [k, k, `${k}s`, `${k}s`] : [k, `${k}e`, `${k}s`, `${k}es`];
    assert.deepEqual(a.forms, want, k);
  }
  // possessives
  const owned = (fr, g, pl) => ({ fr, g, pl });
  assert.equal(F.possForm('her', owned('frère', 'm', false)), 'son');
  assert.equal(F.possForm('his', owned('sœur', 'f', false)), 'sa');
  assert.equal(F.possForm('my', owned('amie', 'f', false)), 'mon');
  assert.equal(F.possForm('their', owned('parents', 'm', true)), 'leurs');
  assert.equal(F.possForm('our', owned('maison', 'f', false)), 'notre');
  // places: the phrase follows from the kind and gender stated in “why”
  for (const p of F.PLACES) {
    const want = p.kind === 'city' ? 'à' : p.kind === 'country' ? (/plural/.test(p.why) ? 'aux' : /masculine/.test(p.why) ? 'au' : 'en')
      : /plural/.test(p.why) ? 'aux' : /starts with/.test(p.why) ? 'à l’' : /masculine/.test(p.why) ? 'au' : 'à la';
    assert.equal(p.prep, want, p.phrase);
  }
  // negatives: the pattern is the positive with ne/n’ … X, and de after a negative
  for (const [pos, pattern] of [...F.NEG_SENTENCES, ...F.NEG_PERFECT]) {
    assert.match(pattern, /^\S+ (ne |n’)\S+ X /, pattern);
    assert.ok(!/ X (du|de la|des|un|une) /.test(pattern), `${pattern}: de after a negative`);
    const n = pattern.match(/(ne |n’)(\S)/);
    assert.equal(n[1] === 'n’', VOWEL.test(n[2]), `${pattern}: elision`);
    assert.ok(pos.endsWith('.') && pattern.endsWith('.'));
  }
});

// re-derive a typed answer from its prompt, independently of the generator’s own code paths
const SUBJ = { je: 0, tu: 1, il: 2, elle: 2, nous: 3, vous: 4, ils: 5, elles: 5 };
function rederive(name, q) {
  const m = q.prompt.match(/^Write the present tense of \*\*(.+?)\*\* \(to .+?\) for \*\*(\w+)\*\*\.$/);
  if (m && /Er|IrRe|Irregular|Reflexive/.test(name)) {
    const vb = F.verb(m[1]); const p = SUBJ[m[2]];
    if (name === 'y8frgReflexive') return `${m[2]} ${F.refl(p, regularPresent(m[1].replace(/^(se |s’)/, ''))[p])}`;
    const forms = F.IRREG[m[1]] ? IRREGULAR_CHECK[m[1]].split(' | ')[0].split(', ').map((x) => x.replace(/^(je |j’|tu |il |nous |vous |ils )/, '')) : regularPresent(vb.inf);
    return p === 0 && VOWEL.test(forms[p]) ? `j’${forms[p]}` : `${m[2]} ${forms[p]}`;
  }
  const pe = q.prompt.match(/^Write the perfect tense of \*\*(.+?)\*\* \(to .+?\) for \*\*(.+?)\*\*(?: \((.+?)\))?(, in the negative)?/);
  if (pe) {
    const [, inf, who, note, negative] = pe;
    const vb = F.verb(inf);
    const person = F.PEOPLE.find((x) => x.fr === who && (x.who || undefined) === note);
    const etre = ETRE_VERBS.includes(inf) || F.REFLEXIVE.includes(vb);
    const aux = (etre ? 'suis es est sommes êtes sont' : 'ai as a avons avez ont').split(' ')[person.p];
    let pp = vb.pp;
    if (etre) pp += (person.g === 'f' ? 'e' : '') + (person.pl ? 's' : '');
    const reflexive = F.REFLEXIVE.includes(vb);
    let core = reflexive ? `${['me', 'te', 'se', 'nous', 'vous', 'se'][person.p]} ${aux}`.replace(/^(m|t|s)e ([aeiouéèê])/, '$1’$2') : aux;
    if (negative) core = `${VOWEL.test(core) ? 'n’' : 'ne '}${core} pas`;
    const whole = `${core} ${pp}`;
    return who === 'je' && VOWEL.test(whole) ? `j’${whole}` : `${who} ${whole}`;
  }
  return null;
}

test('generators: thousands of seeds per level, well formed, answers re-derived', () => {
  let rederived = 0;
  for (const [name, gen] of Object.entries(G)) {
    assert.ok(GENERATORS[name] === gen, `${name} is registered`);
    for (const level of [1, 2, 3]) {
      const rng = makeRng(`fr-fuzz:${name}:${level}`);
      for (let i = 0; i < 2000; i++) {
        const q = gen(level, rng);
        const label = `${name} L${level} #${i}`;
        assertWellFormed(q, label);
        assert.equal(q.steps.length, 3, `${label}: three worked steps`);
        const all = [q.prompt, q.explain, ...q.steps, q.answer, ...(q.options || []).map((o) => o.text)].filter(Boolean).join(' ');
        assert.ok(!/undefined|NaN|null|\[object|\s\s|\.\.(?!\.)/.test(all.replace(/\u00a0/g, ' ')), `${label}: ${all}`);
        assert.ok(![q.answer, ...(q.options || []).map((o) => o.text)].some((t) => /’ /.test(t || '')), `${label}: a space after an apostrophe`);
        assert.ok(!/\bje [aeiouéèêh]/i.test(`${q.answer || ''} ${(q.options || []).filter((o) => o.correct).map((o) => o.text)}`), `${label}: je before a vowel`);
        assert.ok(!/\b(ne|me|te|se|le|la|de) [aeiouéèêâîôœ]/i.test(`${q.answer || ''} ${(q.options || []).filter((o) => o.correct).map((o) => o.text)}`.replace(/\bde la\b/g, '').replace(/\b(le|la|de) (haricot)/, '')), `${label}: missing elision in the answer`);
        if (q.kind === 'typed') {
          assert.equal(q.lang, 'fr', `${label}: typed French is lang fr`);
          assert.equal(check(q, q.answer).correct, true);
          // a one-letter slip is never accepted
          const slip = q.answer.endsWith('s') ? q.answer.slice(0, -1) : `${q.answer}s`;
          if (![q.answer, ...q.accept].map(normalise).includes(normalise(slip))) assert.equal(check(q, slip).correct, false, `${label}: ${slip}`);
          const want = rederive(name, q);
          if (want) { assert.equal(q.answer, want, label); rederived++; }
        }
        if (q.hear) assert.ok(q.prompt.includes(q.hear), `${label}: hear is in the prompt`);
      }
    }
  }
  assert.ok(rederived > 3000, `re-derived ${rederived} typed answers`);
});

test('generators: every choice option for a conjugation differs from the right answer, and wrong ones are not real alternatives', () => {
  // in the être/avoir choice, a transitive verb never gets “il est + participle” (a real passive)
  for (let i = 0; i < 3000; i++) {
    const q = G.y8frgPerfectAvoir(1, makeRng(`pa${i}`));
    if (!q.prompt.startsWith('Which is the perfect')) continue;
    const inf = q.prompt.match(/\*\*(.+?)\*\*/)[1];
    if (!['dormir', 'marcher', 'nager', 'voyager'].includes(inf)) assert.ok(!q.options.some((o) => / (suis|es|est|sommes|êtes|sont) /.test(` ${o.text} `)), `${inf}: ${q.options.map((o) => o.text)}`);
  }
  // reflexive level 1 never offers another person’s object pronoun (je te lève is real French)
  for (let i = 0; i < 3000; i++) {
    const q = G.y8frgReflexive(1, makeRng(`rf${i}`));
    const s = q.prompt.match(/for \*\*(\w+)\*\*/)[1];
    const own = { je: 'me', tu: 'te', nous: 'nous', vous: 'vous' }[s];
    const forbidden = ['me', 'te', 'nous', 'vous'].filter((x) => x !== own);
    for (const o of q.options.filter((x) => !x.correct)) {
      const pron = o.text.split(' ')[1].replace(/^(m|t)’.*/, '$1e');
      assert.ok(!forbidden.includes(pron), `${s}: ${o.text}`);
    }
  }
});
