// Year 8 Ancient Greek drills that never run out: the article, noun endings (1st and 2nd
// declension), present-tense verbs and εἰμί, tense recognition, and transliteration.
// Every Greek answer is a choice (she cannot easily type Greek); transliteration is typed.
// Paradigms are written out in full (with accents) rather than computed, so they can be checked by eye.

const CASES = ['nominative', 'accusative', 'genitive', 'dative'];
const CASE_USE = { nominative: 'the subject', accusative: 'the object', genitive: '“of”', dative: '“to” or “for”' };

// the article: [masculine, feminine, neuter] × [nom, acc, gen, dat], singular then plural
const ART = {
  m: { sg: ['ὁ', 'τόν', 'τοῦ', 'τῷ'], pl: ['οἱ', 'τούς', 'τῶν', 'τοῖς'] },
  f: { sg: ['ἡ', 'τήν', 'τῆς', 'τῇ'], pl: ['αἱ', 'τάς', 'τῶν', 'ταῖς'] },
  n: { sg: ['τό', 'τό', 'τοῦ', 'τῷ'], pl: ['τά', 'τά', 'τῶν', 'τοῖς'] },
};
const GENDER = { m: 'masculine', f: 'feminine', n: 'neuter' };
// an oxytone article before its noun takes a grave accent: τὸν λόγον, τὴν τιμήν
const grave = (a) => a.replace('ό', 'ὸ').replace('ή', 'ὴ').replace('ά', 'ὰ').replace('ού', 'οὺ');

// [lemma, gender, meaning, singular forms, plural forms]
const DECL2 = [
  ['λόγος', 'm', 'word', ['λόγος', 'λόγον', 'λόγου', 'λόγῳ'], ['λόγοι', 'λόγους', 'λόγων', 'λόγοις']],
  ['ἄνθρωπος', 'm', 'man, person', ['ἄνθρωπος', 'ἄνθρωπον', 'ἀνθρώπου', 'ἀνθρώπῳ'], ['ἄνθρωποι', 'ἀνθρώπους', 'ἀνθρώπων', 'ἀνθρώποις']],
  ['θεός', 'm', 'god', ['θεός', 'θεόν', 'θεοῦ', 'θεῷ'], ['θεοί', 'θεούς', 'θεῶν', 'θεοῖς']],
  ['ἵππος', 'm', 'horse', ['ἵππος', 'ἵππον', 'ἵππου', 'ἵππῳ'], ['ἵπποι', 'ἵππους', 'ἵππων', 'ἵπποις']],
  ['δοῦλος', 'm', 'slave', ['δοῦλος', 'δοῦλον', 'δούλου', 'δούλῳ'], ['δοῦλοι', 'δούλους', 'δούλων', 'δούλοις']],
  ['ποταμός', 'm', 'river', ['ποταμός', 'ποταμόν', 'ποταμοῦ', 'ποταμῷ'], ['ποταμοί', 'ποταμούς', 'ποταμῶν', 'ποταμοῖς']],
  ['δῶρον', 'n', 'gift', ['δῶρον', 'δῶρον', 'δώρου', 'δώρῳ'], ['δῶρα', 'δῶρα', 'δώρων', 'δώροις']],
  ['ἔργον', 'n', 'work, deed', ['ἔργον', 'ἔργον', 'ἔργου', 'ἔργῳ'], ['ἔργα', 'ἔργα', 'ἔργων', 'ἔργοις']],
];
const DECL1 = [
  ['τιμή', 'f', 'honour', ['τιμή', 'τιμήν', 'τιμῆς', 'τιμῇ'], ['τιμαί', 'τιμάς', 'τιμῶν', 'τιμαῖς']],
  ['φωνή', 'f', 'voice', ['φωνή', 'φωνήν', 'φωνῆς', 'φωνῇ'], ['φωναί', 'φωνάς', 'φωνῶν', 'φωναῖς']],
  ['κόρη', 'f', 'girl', ['κόρη', 'κόρην', 'κόρης', 'κόρῃ'], ['κόραι', 'κόρας', 'κορῶν', 'κόραις']],
  ['χώρα', 'f', 'land, country', ['χώρα', 'χώραν', 'χώρας', 'χώρᾳ'], ['χῶραι', 'χώρας', 'χωρῶν', 'χώραις']],
  ['ἡμέρα', 'f', 'day', ['ἡμέρα', 'ἡμέραν', 'ἡμέρας', 'ἡμέρᾳ'], ['ἡμέραι', 'ἡμέρας', 'ἡμερῶν', 'ἡμέραις']],
  ['ἀγορά', 'f', 'market place', ['ἀγορά', 'ἀγοράν', 'ἀγορᾶς', 'ἀγορᾷ'], ['ἀγοραί', 'ἀγοράς', 'ἀγορῶν', 'ἀγοραῖς']],
];

// verbs: [lemma, English (I …), English he-form, English -ing form, imperfect (6), future (6)]
const VERBS = [
  ['λύω', 'free', 'frees', 'freeing', ['ἔλυον', 'ἔλυες', 'ἔλυε(ν)', 'ἐλύομεν', 'ἐλύετε', 'ἔλυον'], ['λύσω', 'λύσεις', 'λύσει', 'λύσομεν', 'λύσετε', 'λύσουσι(ν)']],
  ['παιδεύω', 'teach', 'teaches', 'teaching', ['ἐπαίδευον', 'ἐπαίδευες', 'ἐπαίδευε(ν)', 'ἐπαιδεύομεν', 'ἐπαιδεύετε', 'ἐπαίδευον'], ['παιδεύσω', 'παιδεύσεις', 'παιδεύσει', 'παιδεύσομεν', 'παιδεύσετε', 'παιδεύσουσι(ν)']],
  ['πέμπω', 'send', 'sends', 'sending', ['ἔπεμπον', 'ἔπεμπες', 'ἔπεμπε(ν)', 'ἐπέμπομεν', 'ἐπέμπετε', 'ἔπεμπον'], ['πέμψω', 'πέμψεις', 'πέμψει', 'πέμψομεν', 'πέμψετε', 'πέμψουσι(ν)']],
  ['γράφω', 'write', 'writes', 'writing', ['ἔγραφον', 'ἔγραφες', 'ἔγραφε(ν)', 'ἐγράφομεν', 'ἐγράφετε', 'ἔγραφον'], ['γράψω', 'γράψεις', 'γράψει', 'γράψομεν', 'γράψετε', 'γράψουσι(ν)']],
  ['πιστεύω', 'trust', 'trusts', 'trusting', ['ἐπίστευον', 'ἐπίστευες', 'ἐπίστευε(ν)', 'ἐπιστεύομεν', 'ἐπιστεύετε', 'ἐπίστευον'], ['πιστεύσω', 'πιστεύσεις', 'πιστεύσει', 'πιστεύσομεν', 'πιστεύσετε', 'πιστεύσουσι(ν)']],
  ['ἄγω', 'lead', 'leads', 'leading', ['ἦγον', 'ἦγες', 'ἦγε(ν)', 'ἤγομεν', 'ἤγετε', 'ἦγον'], ['ἄξω', 'ἄξεις', 'ἄξει', 'ἄξομεν', 'ἄξετε', 'ἄξουσι(ν)']],
];
// present only (no imperfect/future drills): [lemma, I-form, he-form]
const MORE_PRESENT = [['ἔχω', 'have', 'has'], ['ἀκούω', 'hear', 'hears'], ['λέγω', 'say', 'says'], ['φέρω', 'carry', 'carries'], ['μένω', 'stay', 'stays'], ['φεύγω', 'flee', 'flees'], ['διώκω', 'chase', 'chases'], ['ἐθέλω', 'wish', 'wishes']];
const ENDINGS = ['ω', 'εις', 'ει', 'ομεν', 'ετε', 'ουσι(ν)'];
const present = (lemma) => ENDINGS.map((e) => lemma.slice(0, -1) + e);
const EIMI = ['εἰμί', 'εἶ', 'ἐστί(ν)', 'ἐσμέν', 'ἐστέ', 'εἰσί(ν)'];
const PERSON = ['I', 'you (singular)', 'he, she or it', 'we', 'you (plural)', 'they'];
const PERSON_SHORT = ['I', 'you (sg)', 'he/she', 'we', 'you (pl)', 'they'];

function englishPresent(i, v) { return `${PERSON_SHORT[i]} ${i === 2 ? v.he : v.base}`; }
function englishBe(i) { return ['I am', 'you (sg) are', 'he/she/it is', 'we are', 'you (pl) are', 'they are'][i]; }
function englishTense(tense, i, v) {
  const p = PERSON_SHORT[i];
  if (tense === 'present') return englishPresent(i, v);
  if (tense === 'imperfect') return `${p} ${i === 0 || i === 2 ? 'was' : 'were'} ${v.ing}`;
  return `${p} will ${v.base}`;
}

function choice(prompt, correct, wrongs, rng, extra) {
  const seen = new Set([correct]);
  const ws = wrongs.filter((w) => !seen.has(w) && seen.add(w)).slice(0, 3);
  return { kind: 'choice', prompt, options: rng.shuffle([{ text: correct, correct: true }, ...ws.map((t) => ({ text: t }))]), ...extra };
}

/** Forms that appear only once in a paradigm, so “what case is it?” has one answer. */
function uniqueSlots(noun) {
  const all = [...noun[3], ...noun[4]];
  const out = [];
  for (const [num, forms] of [['singular', noun[3]], ['plural', noun[4]]]) forms.forEach((f, c) => { if (all.filter((x) => x === f).length === 1) out.push({ form: f, c, num }); });
  return out;
}

function nounDrill(list, level, rng, label) {
  const noun = rng.pick(list);
  const [lemma, g, meaning] = noun;
  if (level === 3) {
    const num = rng.pick(['singular', 'plural']), c = rng.int(0, 3);
    const right = (num === 'singular' ? noun[3] : noun[4])[c];
    const wrongs = rng.shuffle([...noun[3], ...noun[4]].filter((f) => f !== right));
    return choice(`Which is the **${CASES[c]} ${num}** of **${lemma}** (${meaning})?`, right, wrongs, rng, {
      explain: `${lemma} is ${label}. Its ${CASES[c]} ${num} is ${right}, used for ${CASE_USE[CASES[c]]}.`,
      steps: [`${lemma} (${GENDER[g]}) follows the ${label} pattern.`, `The ${CASES[c]} is used for ${CASE_USE[CASES[c]]}.`, `${CASES[c]} ${num}: ${grave(ART[g][num === 'singular' ? 'sg' : 'pl'][c])} ${right}.`],
    });
  }
  const slots = uniqueSlots(noun).filter((s) => level === 2 || s.num === 'singular');
  if (!slots.length) return nounDrill(list, level, rng, label);
  const s = rng.pick(slots);
  const right = level === 1 ? CASES[s.c] : `${CASES[s.c]} ${s.num}`;
  const wrongs = level === 1 ? CASES.filter((x) => x !== right) : rng.shuffle(CASES.flatMap((c) => ['singular', 'plural'].map((n) => `${c} ${n}`))).filter((x) => x !== right);
  return choice(`**${s.form}** (${s.form === lemma ? '' : `from ${lemma}, `}“${meaning}”). Which ${level === 1 ? 'case' : 'case and number'} is it?`, right, wrongs, rng, {
    explain: `${s.form} is the ${CASES[s.c]} ${s.num}${s.c === 0 ? '' : ` of ${lemma}`}: ${grave(ART[g][s.num === 'singular' ? 'sg' : 'pl'][s.c])} ${s.form}, used for ${CASE_USE[CASES[s.c]]}.`,
    steps: [`Look at the ending of ${s.form}.`, `In the ${label} pattern that ending belongs to the ${CASES[s.c]} ${s.num}.`, `So it would mean ${CASE_USE[CASES[s.c]]} in a sentence.`],
  });
}

// --- transliteration -------------------------------------------------------------------
const LETTERS = { α: 'a', β: 'b', γ: 'g', δ: 'd', ε: 'e', ζ: 'z', η: 'e', θ: 'th', ι: 'i', κ: 'k', λ: 'l', μ: 'm', ν: 'n', ξ: 'x', ο: 'o', π: 'p', ρ: 'r', σ: 's', ς: 's', τ: 't', υ: 'u', φ: 'ph', χ: 'ch', ψ: 'ps', ω: 'o' };
/** All acceptable Latin-letter spellings: k or c, u or y, ch or kh. The first is the main answer. */
export function transliterate(word) {
  const nfd = word.normalize('NFD');
  const rough = nfd.slice(0, 4).includes('\u0314'); // a rough breathing sits on the first vowel (or the second of a diphthong)
  const bare = nfd.replace(/[\u0300-\u036f\u0345]/g, '').toLowerCase();
  let out = [''];
  for (let i = 0; i < bare.length; i++) {
    const ch = bare[i], next = bare[i + 1], prev = bare[i - 1];
    let opts;
    if (ch === 'ο' && next === 'υ') { opts = ['ou', 'u']; i++; } // ου: “ou”, or “u” as in Medusa
    else if (ch === 'γ' && 'γκχξ'.includes(next || '-')) opts = ['n'];
    else if (ch === 'υ' && 'αεη'.includes(prev || '-')) opts = ['u'];
    else if (ch === 'υ') opts = ['u', 'y'];
    else if (ch === 'κ') opts = ['k', 'c'];
    else if (ch === 'χ') opts = ['ch', 'kh'];
    else if (ch === 'ρ' && i === 0 && rough) opts = ['rh'];
    else opts = [LETTERS[ch] ?? ch];
    out = out.flatMap((s) => opts.map((o) => s + o));
  }
  if (rough && bare[0] !== 'ρ') out = out.map((s) => 'h' + s);
  return [...new Set(out)];
}
const TRANSLIT = {
  1: ['λόγος', 'θεός', 'ἵππος', 'ποταμός', 'φίλος', 'κόσμος', 'δρᾶμα', 'χάος', 'ἰδέα', 'κρίσις', 'βίος', 'μῦθος'],
  2: ['ἄνθρωπος', 'ἀδελφός', 'στρατηγός', 'ψυχή', 'φωνή', 'θέατρον', 'ἀγορά', 'πόλεμος', 'ἥλιος', 'χρόνος', 'ἡμέρα', 'σοφία'],
  3: ['Ζεύς', 'Ἀθηνᾶ', 'Ἑρμῆς', 'Ἄρτεμις', 'Ποσειδῶν', 'Ἀφροδίτη', 'Ὀδυσσεύς', 'Θησεύς', 'Ἡρακλῆς', 'Κύκλωψ', 'Μέδουσα', 'Περσεύς', 'Ἀχιλλεύς', 'Ἕκτωρ'],
};

export const Y8_GREEK_GENERATORS = {
  y8gArticle(level, rng) {
    const noun = rng.pick([...DECL2, ...DECL1]);
    const [lemma, g, meaning] = noun;
    const num = level === 3 ? rng.pick(['singular', 'plural']) : 'singular';
    const c = level === 1 ? rng.int(0, 1) : rng.int(0, 3);
    const n = num === 'singular' ? 'sg' : 'pl';
    const form = noun[n === 'sg' ? 3 : 4][c];
    const right = ART[g][n][c];
    const sameGender = [...ART[g].sg, ...ART[g].pl];
    const sameCase = ['m', 'f', 'n'].map((x) => ART[x][n][c]);
    const wrongs = rng.shuffle([...new Set([...sameCase, ...sameGender])].filter((a) => a !== right));
    return choice(`Which form of the article (“the”) goes with **${form}**, the ${CASES[c]} ${num} of ${lemma} (${meaning})?`, right, wrongs, rng, {
      explain: `${lemma} is ${GENDER[g]}, so the ${CASES[c]} ${num} is ${grave(right)} ${form}. The article matches its noun in gender, case and number.`,
      steps: [`${lemma} is ${GENDER[g]} (its dictionary form is ${grave(ART[g].sg[0])} ${lemma}).`, `I need the ${CASES[c]} ${num} of the ${GENDER[g]} article: ${right}.`, `Together: ${grave(right)} ${form}.`],
    });
  },

  y8gNoun2(level, rng) { return nounDrill(DECL2, level, rng, 'second declension'); },
  y8gNoun1(level, rng) { return nounDrill(DECL1, level, rng, 'first declension'); },

  y8gVerb(level, rng) {
    const useBe = level === 3 && rng.chance(0.35);
    const pool = level === 1 ? VERBS.slice(0, 2).map((v) => [v[0], v[1], v[2]]) : [...VERBS.map((v) => [v[0], v[1], v[2]]), ...MORE_PRESENT];
    const [lemma, base, he] = rng.pick(pool);
    const v = { base, he };
    const forms = useBe ? EIMI : present(lemma);
    const eng = (i) => (useBe ? englishBe(i) : englishPresent(i, v));
    const i = rng.int(0, 5);
    if (level === 3 && rng.chance(0.5)) {
      return choice(`Which Greek form means **${eng(i)}**?`, forms[i], rng.shuffle(forms.filter((_, k) => k !== i)), rng, {
        explain: useBe ? `${eng(i)} = ${forms[i]}. εἰμί is irregular, so its forms are learned by heart.` : `${eng(i)} = ${forms[i]}. The ending -${ENDINGS[i]} shows the person: ${PERSON[i]}.`,
        steps: [`${eng(i)} is ${PERSON[i]} (${i < 3 ? 'singular' : 'plural'}).`, useBe ? 'εἰμί is irregular, so learn it by heart: εἰμί, εἶ, ἐστί(ν), ἐσμέν, ἐστέ, εἰσί(ν).' : `Present endings: -ω, -εις, -ει, -ομεν, -ετε, -ουσι(ν).`, `So: ${forms[i]}.`],
      });
    }
    const wrongs = rng.shuffle([0, 1, 2, 3, 4, 5].filter((k) => k !== i)).map(eng);
    return choice(`What does **${forms[i]}** mean?`, eng(i), wrongs, rng, {
      explain: `${forms[i]} = ${eng(i)}${useBe ? ' (from εἰμί, “I am”)' : ` (from ${lemma}, “I ${base}”)`}. Greek needs no separate word for I, you or they: the ending tells you.`,
      steps: [useBe ? 'εἰμί, εἶ, ἐστί(ν), ἐσμέν, ἐστέ, εἰσί(ν): I am, you are, he is, we are, you are, they are.' : `The present endings are -ω, -εις, -ει, -ομεν, -ετε, -ουσι(ν).`, `${forms[i]} has the ${PERSON[i]} form.`, `So it means “${eng(i)}”.`],
    });
  },

  y8gTense(level, rng) {
    const vv = rng.pick(VERBS);
    const v = { base: vv[1], he: vv[2], ing: vv[3] };
    const tables = { present: present(vv[0]), imperfect: vv[4], future: vv[5] };
    const tense = rng.pick(['present', 'imperfect', 'future']);
    // ἔλυον is both “I was freeing” and “they were freeing”, so avoid persons 1 and 6 for the imperfect when the person matters
    const i = tense === 'imperfect' && level > 1 ? rng.pick([1, 2, 3, 4]) : rng.int(0, 5);
    const form = tables[tense][i];
    const clue = { present: 'no augment and no σ', imperfect: 'an augment (ἐ- or a lengthened first vowel) and present-stem endings -ον, -ες, -ε', future: 'a σ (or ψ, ξ) before the ending, and no augment' }[tense];
    if (level === 1) {
      return choice(`Which tense is **${form}** (from ${vv[0]})?`, tense, ['present', 'imperfect', 'future'].filter((t) => t !== tense), rng, {
        explain: `${form} is ${tense}: it has ${clue}.`,
        steps: ['Look at the front of the word: an ἐ- or a lengthened vowel (the augment) means a past tense.', 'Look before the ending: σ, ψ or ξ usually means the future.', `${form}: ${clue}, so it is ${tense}.`],
      });
    }
    if (level === 2) {
      const wrongs = rng.shuffle([...['present', 'imperfect', 'future'].filter((t) => t !== tense).map((t) => englishTense(t, i, v)), englishTense(tense, i === 5 ? 3 : 5, v)]);
      return choice(`What does **${form}** mean?`, englishTense(tense, i, v), wrongs, rng, {
        explain: `${form} is the ${tense} of ${vv[0]} (${PERSON[i]}): “${englishTense(tense, i, v)}”.`,
        steps: [`Tense: ${form} has ${clue}, so it is ${tense}.`, `Person: the ending shows ${PERSON[i]}.`, `So: “${englishTense(tense, i, v)}”.`],
      });
    }
    const all = ['present', 'imperfect', 'future'].flatMap((t) => tables[t]).filter((f) => f !== form);
    const near = rng.shuffle([...['present', 'imperfect', 'future'].filter((t) => t !== tense).map((t) => tables[t][i]), ...rng.shuffle(all)]);
    return choice(`Which Greek form means **${englishTense(tense, i, v)}**?`, form, near, rng, {
      explain: `“${englishTense(tense, i, v)}” is ${tense}, ${PERSON[i]}: ${form}.`,
      steps: [`“${englishTense(tense, i, v)}” is the ${tense} tense, so I need ${clue}.`, `The ending must show ${PERSON[i]}.`, `${form}.`],
    });
  },

  y8gTranslit(level, rng) {
    const word = rng.pick(TRANSLIT[Math.max(1, Math.min(3, level))]);
    const [answer, ...accept] = transliterate(word);
    return {
      kind: 'typed', prompt: `Write **${word}** in English letters.`, answer, accept, strict: true, placeholder: 'e.g. logos',
      explain: `${word} = ${answer}${accept.length ? ` (also fine: ${accept.slice(0, 3).join(', ')})` : ''}. Remember: θ = th, φ = ph, χ = ch, ψ = ps, η = e, ω = o, and a rough breathing (ʽ) adds an h.`,
      steps: ['Go letter by letter, left to right.', 'Watch for the double-letter sounds: θ th, φ ph, χ ch, ψ ps, ξ x, and γγ = ng.', `A rough breathing at the start adds h. So: ${answer}.`],
    };
  },
};
