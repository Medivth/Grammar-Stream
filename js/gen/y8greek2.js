// Year 8 Ancient Greek, part 2: drills for the year's grammar that never run out. The third
// declension, the weak and strong aorist, contracted verbs, the middle and passive, and
// participles. Same rules as y8greek.js: every Greek answer is a choice, and every paradigm
// is written out in full (with accents) rather than computed, so it can be checked by eye.

const CASES = ['nominative', 'accusative', 'genitive', 'dative'];
const CASE_USE = { nominative: 'the subject', accusative: 'the object', genitive: '“of”', dative: '“to”, “for” or “with”' };
const GENDER = { m: 'masculine', f: 'feminine', n: 'neuter' };
const ART = {
  m: { sg: ['ὁ', 'τόν', 'τοῦ', 'τῷ'], pl: ['οἱ', 'τούς', 'τῶν', 'τοῖς'] },
  f: { sg: ['ἡ', 'τήν', 'τῆς', 'τῇ'], pl: ['αἱ', 'τάς', 'τῶν', 'ταῖς'] },
  n: { sg: ['τό', 'τό', 'τοῦ', 'τῷ'], pl: ['τά', 'τά', 'τῶν', 'τοῖς'] },
};
const grave = (a) => a.replace('ό', 'ὸ').replace('ή', 'ὴ').replace('ά', 'ὰ').replace('ού', 'οὺ');
const PERSON = ['I', 'you (singular)', 'he, she or it', 'we', 'you (plural)', 'they'];
const PERSON_SHORT = ['I', 'you (sg)', 'he/she', 'we', 'you (pl)', 'they'];

function choice(prompt, correct, wrongs, rng, extra) {
  const seen = new Set([correct]);
  const ws = wrongs.filter((w) => !seen.has(w) && seen.add(w)).slice(0, 3);
  return { kind: 'choice', prompt, options: rng.shuffle([{ text: correct, correct: true }, ...ws.map((t) => ({ text: t }))]), ...extra };
}

// --- the third declension: [lemma, gender, meaning, genitive (for the dictionary entry), singular, plural or null]
const DECL3 = [
  ['φύλαξ', 'm', 'guard', 'φύλακος', ['φύλαξ', 'φύλακα', 'φύλακος', 'φύλακι'], ['φύλακες', 'φύλακας', 'φυλάκων', 'φύλαξι(ν)']],
  ['γίγας', 'm', 'giant', 'γίγαντος', ['γίγας', 'γίγαντα', 'γίγαντος', 'γίγαντι'], ['γίγαντες', 'γίγαντας', 'γιγάντων', 'γίγασι(ν)']],
  ['ἀγών', 'm', 'contest', 'ἀγῶνος', ['ἀγών', 'ἀγῶνα', 'ἀγῶνος', 'ἀγῶνι'], ['ἀγῶνες', 'ἀγῶνας', 'ἀγώνων', 'ἀγῶσι(ν)']],
  ['ῥήτωρ', 'm', 'speaker', 'ῥήτορος', ['ῥήτωρ', 'ῥήτορα', 'ῥήτορος', 'ῥήτορι'], ['ῥήτορες', 'ῥήτορας', 'ῥητόρων', 'ῥήτορσι(ν)']],
  ['παῖς', 'm', 'child', 'παιδός', ['παῖς', 'παῖδα', 'παιδός', 'παιδί'], ['παῖδες', 'παῖδας', 'παίδων', 'παισί(ν)']],
  ['Ἕλλην', 'm', 'Greek', 'Ἕλληνος', ['Ἕλλην', 'Ἕλληνα', 'Ἕλληνος', 'Ἕλληνι'], ['Ἕλληνες', 'Ἕλληνας', 'Ἑλλήνων', 'Ἕλλησι(ν)']],
  ['νύξ', 'f', 'night', 'νυκτός', ['νύξ', 'νύκτα', 'νυκτός', 'νυκτί'], ['νύκτες', 'νύκτας', 'νυκτῶν', 'νυξί(ν)']],
  ['λέων', 'm', 'lion', 'λέοντος', ['λέων', 'λέοντα', 'λέοντος', 'λέοντι'], ['λέοντες', 'λέοντας', 'λεόντων', 'λέουσι(ν)']],
];
const DECL3B = [
  ['σῶμα', 'n', 'body', 'σώματος', ['σῶμα', 'σῶμα', 'σώματος', 'σώματι'], ['σώματα', 'σώματα', 'σωμάτων', 'σώμασι(ν)']],
  ['ὄνομα', 'n', 'name', 'ὀνόματος', ['ὄνομα', 'ὄνομα', 'ὀνόματος', 'ὀνόματι'], ['ὀνόματα', 'ὀνόματα', 'ὀνομάτων', 'ὀνόμασι(ν)']],
  ['πρᾶγμα', 'n', 'thing, matter', 'πράγματος', ['πρᾶγμα', 'πρᾶγμα', 'πράγματος', 'πράγματι'], ['πράγματα', 'πράγματα', 'πραγμάτων', 'πράγμασι(ν)']],
  ['πόλις', 'f', 'city', 'πόλεως', ['πόλις', 'πόλιν', 'πόλεως', 'πόλει'], ['πόλεις', 'πόλεις', 'πόλεων', 'πόλεσι(ν)']],
  ['ἀνήρ', 'm', 'man, husband', 'ἀνδρός', ['ἀνήρ', 'ἄνδρα', 'ἀνδρός', 'ἀνδρί'], ['ἄνδρες', 'ἄνδρας', 'ἀνδρῶν', 'ἀνδράσι(ν)']],
  ['πατήρ', 'm', 'father', 'πατρός', ['πατήρ', 'πατέρα', 'πατρός', 'πατρί'], ['πατέρες', 'πατέρας', 'πατέρων', 'πατράσι(ν)']],
  ['μήτηρ', 'f', 'mother', 'μητρός', ['μήτηρ', 'μητέρα', 'μητρός', 'μητρί'], ['μητέρες', 'μητέρας', 'μητέρων', 'μητράσι(ν)']],
  ['γυνή', 'f', 'woman, wife', 'γυναικός', ['γυνή', 'γυναῖκα', 'γυναικός', 'γυναικί'], ['γυναῖκες', 'γυναῖκας', 'γυναικῶν', 'γυναιξί(ν)']],
  // the plural of βασιλεύς varies between older and later Attic, so it is drilled in the singular only
  ['βασιλεύς', 'm', 'king', 'βασιλέως', ['βασιλεύς', 'βασιλέα', 'βασιλέως', 'βασιλεῖ'], null],
];

function slotsOf(noun) {
  const all = [...noun[4], ...(noun[5] || [])];
  const out = [];
  for (const [num, forms] of [['singular', noun[4]], ['plural', noun[5]]]) (forms || []).forEach((f, c) => { if (all.filter((x) => x === f).length === 1) out.push({ form: f, c, num }); });
  return out;
}

function decl3Drill(list, level, rng) {
  const noun = rng.pick(list);
  const [lemma, g, meaning, gen] = noun;
  const entry = `${lemma}, ${gen} (${GENDER[g]}): ${meaning}`;
  if (level === 3) {
    const num = noun[5] && rng.chance(0.5) ? 'plural' : 'singular';
    const c = rng.int(0, 3);
    const right = (num === 'singular' ? noun[4] : noun[5])[c];
    const wrongs = rng.shuffle([...noun[4], ...(noun[5] || [])].filter((f) => f !== right));
    return choice(`Which is the **${CASES[c]} ${num}** of **${lemma}** (genitive ${gen}, “${meaning}”)?`, right, wrongs, rng, {
      explain: `${entry}. Its ${CASES[c]} ${num} is ${grave(ART[g][num === 'singular' ? 'sg' : 'pl'][c])} ${right}, used for ${CASE_USE[CASES[c]]}.`,
      steps: [`Find the stem from the genitive: ${gen} minus -ος.`, `Add the third-declension ${CASES[c]} ${num} ending.`, `So: ${right}.`],
    });
  }
  const slots = slotsOf(noun).filter((s) => level === 2 || s.num === 'singular').filter((s) => !(level === 1 && s.c === 0));
  if (!slots.length) return decl3Drill(list, level, rng);
  const s = rng.pick(slots);
  const right = level === 1 ? CASES[s.c] : `${CASES[s.c]} ${s.num}`;
  const wrongs = level === 1 ? CASES.filter((x) => x !== right) : rng.shuffle(CASES.flatMap((c) => ['singular', 'plural'].map((n) => `${c} ${n}`))).filter((x) => x !== right);
  return choice(`**${s.form}** (from ${lemma}, ${gen}: “${meaning}”). Which ${level === 1 ? 'case' : 'case and number'} is it?`, right, wrongs, rng, {
    explain: `${s.form} is the ${CASES[s.c]} ${s.num} of ${lemma}: ${grave(ART[g][s.num === 'singular' ? 'sg' : 'pl'][s.c])} ${s.form}, used for ${CASE_USE[CASES[s.c]]}.`,
    steps: [`The stem of ${lemma} is the genitive ${gen} without -ος.`, 'Third-declension endings: singular -α, -ος, -ι; plural -ες, -ας, -ων, -σι(ν).', `${s.form} has the ${CASES[s.c]} ${s.num} ending.`],
  });
}

// --- the aorist: [lemma, I-form, past, -ing, imperfect (6), aorist (6)]
const WEAK = [
  ['λύω', 'free', 'freed', 'freeing', ['ἔλυον', 'ἔλυες', 'ἔλυε(ν)', 'ἐλύομεν', 'ἐλύετε', 'ἔλυον'], ['ἔλυσα', 'ἔλυσας', 'ἔλυσε(ν)', 'ἐλύσαμεν', 'ἐλύσατε', 'ἔλυσαν']],
  ['παιδεύω', 'teach', 'taught', 'teaching', ['ἐπαίδευον', 'ἐπαίδευες', 'ἐπαίδευε(ν)', 'ἐπαιδεύομεν', 'ἐπαιδεύετε', 'ἐπαίδευον'], ['ἐπαίδευσα', 'ἐπαίδευσας', 'ἐπαίδευσε(ν)', 'ἐπαιδεύσαμεν', 'ἐπαιδεύσατε', 'ἐπαίδευσαν']],
  ['πέμπω', 'send', 'sent', 'sending', ['ἔπεμπον', 'ἔπεμπες', 'ἔπεμπε(ν)', 'ἐπέμπομεν', 'ἐπέμπετε', 'ἔπεμπον'], ['ἔπεμψα', 'ἔπεμψας', 'ἔπεμψε(ν)', 'ἐπέμψαμεν', 'ἐπέμψατε', 'ἔπεμψαν']],
  ['γράφω', 'write', 'wrote', 'writing', ['ἔγραφον', 'ἔγραφες', 'ἔγραφε(ν)', 'ἐγράφομεν', 'ἐγράφετε', 'ἔγραφον'], ['ἔγραψα', 'ἔγραψας', 'ἔγραψε(ν)', 'ἐγράψαμεν', 'ἐγράψατε', 'ἔγραψαν']],
  ['πιστεύω', 'trust', 'trusted', 'trusting', ['ἐπίστευον', 'ἐπίστευες', 'ἐπίστευε(ν)', 'ἐπιστεύομεν', 'ἐπιστεύετε', 'ἐπίστευον'], ['ἐπίστευσα', 'ἐπίστευσας', 'ἐπίστευσε(ν)', 'ἐπιστεύσαμεν', 'ἐπιστεύσατε', 'ἐπίστευσαν']],
  ['διώκω', 'chase', 'chased', 'chasing', ['ἐδίωκον', 'ἐδίωκες', 'ἐδίωκε(ν)', 'ἐδιώκομεν', 'ἐδιώκετε', 'ἐδίωκον'], ['ἐδίωξα', 'ἐδίωξας', 'ἐδίωξε(ν)', 'ἐδιώξαμεν', 'ἐδιώξατε', 'ἐδίωξαν']],
  ['ἀκούω', 'hear', 'heard', 'hearing', ['ἤκουον', 'ἤκουες', 'ἤκουε(ν)', 'ἠκούομεν', 'ἠκούετε', 'ἤκουον'], ['ἤκουσα', 'ἤκουσας', 'ἤκουσε(ν)', 'ἠκούσαμεν', 'ἠκούσατε', 'ἤκουσαν']],
  ['κελεύω', 'order', 'ordered', 'ordering', ['ἐκέλευον', 'ἐκέλευες', 'ἐκέλευε(ν)', 'ἐκελεύομεν', 'ἐκελεύετε', 'ἐκέλευον'], ['ἐκέλευσα', 'ἐκέλευσας', 'ἐκέλευσε(ν)', 'ἐκελεύσαμεν', 'ἐκελεύσατε', 'ἐκέλευσαν']],
];
const STRONG = [
  ['λαμβάνω', 'take', 'took', 'taking', ['ἐλάμβανον', 'ἐλάμβανες', 'ἐλάμβανε(ν)', 'ἐλαμβάνομεν', 'ἐλαμβάνετε', 'ἐλάμβανον'], ['ἔλαβον', 'ἔλαβες', 'ἔλαβε(ν)', 'ἐλάβομεν', 'ἐλάβετε', 'ἔλαβον']],
  ['φεύγω', 'flee', 'fled', 'fleeing', ['ἔφευγον', 'ἔφευγες', 'ἔφευγε(ν)', 'ἐφεύγομεν', 'ἐφεύγετε', 'ἔφευγον'], ['ἔφυγον', 'ἔφυγες', 'ἔφυγε(ν)', 'ἐφύγομεν', 'ἐφύγετε', 'ἔφυγον']],
  ['μανθάνω', 'learn', 'learned', 'learning', ['ἐμάνθανον', 'ἐμάνθανες', 'ἐμάνθανε(ν)', 'ἐμανθάνομεν', 'ἐμανθάνετε', 'ἐμάνθανον'], ['ἔμαθον', 'ἔμαθες', 'ἔμαθε(ν)', 'ἐμάθομεν', 'ἐμάθετε', 'ἔμαθον']],
  ['βάλλω', 'throw', 'threw', 'throwing', ['ἔβαλλον', 'ἔβαλλες', 'ἔβαλλε(ν)', 'ἐβάλλομεν', 'ἐβάλλετε', 'ἔβαλλον'], ['ἔβαλον', 'ἔβαλες', 'ἔβαλε(ν)', 'ἐβάλομεν', 'ἐβάλετε', 'ἔβαλον']],
  ['ἄγω', 'lead', 'led', 'leading', ['ἦγον', 'ἦγες', 'ἦγε(ν)', 'ἤγομεν', 'ἤγετε', 'ἦγον'], ['ἤγαγον', 'ἤγαγες', 'ἤγαγε(ν)', 'ἠγάγομεν', 'ἠγάγετε', 'ἤγαγον']],
  ['πάσχω', 'suffer', 'suffered', 'suffering', ['ἔπασχον', 'ἔπασχες', 'ἔπασχε(ν)', 'ἐπάσχομεν', 'ἐπάσχετε', 'ἔπασχον'], ['ἔπαθον', 'ἔπαθες', 'ἔπαθε(ν)', 'ἐπάθομεν', 'ἐπάθετε', 'ἔπαθον']],
  ['λέγω', 'say', 'said', 'saying', ['ἔλεγον', 'ἔλεγες', 'ἔλεγε(ν)', 'ἐλέγομεν', 'ἐλέγετε', 'ἔλεγον'], ['εἶπον', 'εἶπες', 'εἶπε(ν)', 'εἴπομεν', 'εἴπετε', 'εἶπον']],
];
const PRESENT_ENDINGS = ['ω', 'εις', 'ει', 'ομεν', 'ετε', 'ουσι(ν)'];
const presentOf = (lemma) => PRESENT_ENDINGS.map((e) => lemma.slice(0, -1) + e);
const he = (base) => (/(sh|ch|s|x|o)$/.test(base) ? `${base}es` : `${base}s`);
function english(tense, i, v) {
  const p = PERSON_SHORT[i];
  if (tense === 'present') return `${p} ${i === 2 ? he(v.base) : v.base}`;
  if (tense === 'imperfect') return `${p} ${i === 0 || i === 2 ? 'was' : 'were'} ${v.ing}`;
  return `${p} ${v.past}`;
}

function aoristDrill(list, level, rng, kind) {
  const vv = rng.pick(list);
  const v = { base: vv[1], past: vv[2], ing: vv[3] };
  const tables = { present: presentOf(vv[0]), imperfect: vv[4], aorist: vv[5] };
  const clue = {
    present: 'no augment, and the present stem',
    imperfect: `an augment and the present stem (${vv[4][2].replace('(ν)', '')}…)`,
    aorist: kind === 'weak' ? 'an augment and -σα- (or ψ, ξ) before the ending' : `an augment and the aorist stem (${vv[5][2].replace('(ν)', '')}…), different from the present stem`,
  };
  if (level === 1) {
    const tense = rng.pick(['present', 'imperfect', 'aorist', 'aorist']);
    const form = tables[tense][rng.int(0, 5)];
    return choice(`Which tense is **${form}** (from ${vv[0]}, “I ${v.base}”)?`, tense, ['present', 'imperfect', 'aorist'].filter((t) => t !== tense), rng, {
      explain: `${form} is ${tense}: it has ${clue[tense]}.`,
      steps: ['An augment at the front (ἐ-, or a lengthened first vowel) means a past tense.', kind === 'weak' ? 'Then look before the ending: -σα- (ψα, ξα) marks the weak aorist; the imperfect has none.' : `Then look at the stem: the imperfect keeps the present stem; the strong aorist has its own stem (${vv[5][0]}).`, `${form}: ${tense}.`],
    });
  }
  // persons 1 and 6 look the same in the imperfect and the strong aorist, so avoid them when the person matters
  const safe = kind === 'weak' ? [0, 1, 2, 3, 4, 5] : [1, 2, 3, 4];
  if (level === 2) {
    const tense = rng.chance(0.7) ? 'aorist' : 'imperfect';
    const i = rng.pick(tense === 'imperfect' ? [1, 2, 3, 4] : safe);
    const form = tables[tense][i];
    const other = tense === 'aorist' ? 'imperfect' : 'aorist';
    const wrongs = rng.shuffle([english(other, i, v), english('present', i, v), english(tense, i === 3 ? 4 : 3, v), english(tense, i === 2 ? 1 : 2, v)]);
    return choice(`What does **${form}** mean?`, english(tense, i, v), wrongs, rng, {
      explain: `${form} is the ${tense} of ${vv[0]} (${PERSON[i]}): “${english(tense, i, v)}”.`,
      steps: [`Tense: ${form} has ${clue[tense]}, so it is ${tense}.`, `Person: the ending shows ${PERSON[i]}.`, `So: “${english(tense, i, v)}”.`],
    });
  }
  const i = rng.int(0, 5);
  const form = tables.aorist[i];
  const near = rng.shuffle([tables.imperfect[i], tables.present[i], ...rng.shuffle(tables.aorist.filter((f) => f !== form))]);
  return choice(`Which Greek form means **${english('aorist', i, v)}**?`, form, near, rng, {
    explain: `“${english('aorist', i, v)}” is aorist, ${PERSON[i]}: ${form}.`,
    steps: [`“${english('aorist', i, v)}” is a single past action, so I need the aorist: ${clue.aorist}.`, `The ending must show ${PERSON[i]}.`, `${form}.`],
  });
}

// --- contracted verbs
const E_VERBS = [
  ['φιλέω', 'love', 'loves', ['φιλῶ', 'φιλεῖς', 'φιλεῖ', 'φιλοῦμεν', 'φιλεῖτε', 'φιλοῦσι(ν)']],
  ['ποιέω', 'make', 'makes', ['ποιῶ', 'ποιεῖς', 'ποιεῖ', 'ποιοῦμεν', 'ποιεῖτε', 'ποιοῦσι(ν)']],
  ['ζητέω', 'seek', 'seeks', ['ζητῶ', 'ζητεῖς', 'ζητεῖ', 'ζητοῦμεν', 'ζητεῖτε', 'ζητοῦσι(ν)']],
  ['οἰκέω', 'live', 'lives', ['οἰκῶ', 'οἰκεῖς', 'οἰκεῖ', 'οἰκοῦμεν', 'οἰκεῖτε', 'οἰκοῦσι(ν)']],
  ['βοηθέω', 'help', 'helps', ['βοηθῶ', 'βοηθεῖς', 'βοηθεῖ', 'βοηθοῦμεν', 'βοηθεῖτε', 'βοηθοῦσι(ν)']],
];
const A_VERBS = [
  ['τιμάω', 'honour', 'honours', ['τιμῶ', 'τιμᾷς', 'τιμᾷ', 'τιμῶμεν', 'τιμᾶτε', 'τιμῶσι(ν)']],
  ['ὁράω', 'see', 'sees', ['ὁρῶ', 'ὁρᾷς', 'ὁρᾷ', 'ὁρῶμεν', 'ὁρᾶτε', 'ὁρῶσι(ν)']],
  ['νικάω', 'conquer', 'conquers', ['νικῶ', 'νικᾷς', 'νικᾷ', 'νικῶμεν', 'νικᾶτε', 'νικῶσι(ν)']],
];
const UNCONTRACTED = ['ω', 'εις', 'ει', 'ομεν', 'ετε', 'ουσι(ν)'];
const RULE = ['ε + ω = ω', 'ε + ει = ει', 'ε + ει = ει', 'ε + ο = ου', 'ε + ε = ει', 'ε + ου = ου'];
const engPresent = (i, base, hes) => `${PERSON_SHORT[i]} ${i === 2 ? hes : base}`;

// --- the middle and passive (present): persons 1, 3, 4, 5, 6 (the 2nd singular λύει clashes with the active)
const MP_PERSONS = [0, 2, 3, 4, 5];
const PASSIVE = [
  ['λύω', 'freed', ['λύομαι', null, 'λύεται', 'λυόμεθα', 'λύεσθε', 'λύονται'], ['λύω', null, 'λύει', 'λύομεν', 'λύετε', 'λύουσι(ν)'], 'free'],
  ['παιδεύω', 'taught', ['παιδεύομαι', null, 'παιδεύεται', 'παιδευόμεθα', 'παιδεύεσθε', 'παιδεύονται'], ['παιδεύω', null, 'παιδεύει', 'παιδεύομεν', 'παιδεύετε', 'παιδεύουσι(ν)'], 'teach'],
  ['πέμπω', 'sent', ['πέμπομαι', null, 'πέμπεται', 'πεμπόμεθα', 'πέμπεσθε', 'πέμπονται'], ['πέμπω', null, 'πέμπει', 'πέμπομεν', 'πέμπετε', 'πέμπουσι(ν)'], 'send'],
  ['διώκω', 'chased', ['διώκομαι', null, 'διώκεται', 'διωκόμεθα', 'διώκεσθε', 'διώκονται'], ['διώκω', null, 'διώκει', 'διώκομεν', 'διώκετε', 'διώκουσι(ν)'], 'chase'],
];
const DEPONENT = [
  ['βούλομαι', 'want', 'wants', ['βούλομαι', null, 'βούλεται', 'βουλόμεθα', 'βούλεσθε', 'βούλονται']],
  ['γίγνομαι', 'become', 'becomes', ['γίγνομαι', null, 'γίγνεται', 'γιγνόμεθα', 'γίγνεσθε', 'γίγνονται']],
  ['ἔρχομαι', 'come', 'comes', ['ἔρχομαι', null, 'ἔρχεται', 'ἐρχόμεθα', 'ἔρχεσθε', 'ἔρχονται']],
  ['μάχομαι', 'fight', 'fights', ['μάχομαι', null, 'μάχεται', 'μαχόμεθα', 'μάχεσθε', 'μάχονται']],
  ['δέχομαι', 'receive', 'receives', ['δέχομαι', null, 'δέχεται', 'δεχόμεθα', 'δέχεσθε', 'δέχονται']],
];
const BE = ['I am', null, 'he/she is', 'we are', 'you (pl) are', 'they are'];
const passiveEng = (i, pp) => `${BE[i]} (being) ${pp}`;

// --- participles
const ARTICULAR = [
  ['φεύγω', 'fleeing', { ms: 'φεύγων', fs: 'φεύγουσα', mp: 'φεύγοντες', fp: 'φεύγουσαι' }],
  ['μένω', 'staying', { ms: 'μένων', fs: 'μένουσα', mp: 'μένοντες', fp: 'μένουσαι' }],
  ['γράφω', 'writing', { ms: 'γράφων', fs: 'γράφουσα', mp: 'γράφοντες', fp: 'γράφουσαι' }],
  ['φυλάσσω', 'guarding', { ms: 'φυλάσσων', fs: 'φυλάσσουσα', mp: 'φυλάσσοντες', fp: 'φυλάσσουσαι' }],
];
const ARTICULAR_ENG = { ms: ['ὁ', 'the man who is'], fs: ['ἡ', 'the woman who is'], mp: ['οἱ', 'the men who are'], fp: ['αἱ', 'the women who are'] };
const SUBJ = [['ὁ δοῦλος', 'the slave', 'm'], ['ὁ στρατηγός', 'the general', 'm'], ['ἡ κόρη', 'the girl', 'f'], ['ἡ θεά', 'the goddess', 'f']];
const OBJ = [['τὸν ἵππον', 'the horse', 'm'], ['τὸν φίλον', 'the friend', 'm'], ['τὴν κόρην', 'the girl', 'f'], ['τὴν θεάν', 'the goddess', 'f']];
const AGREE = [
  ['φεύγω', 'fleeing', { nm: 'φεύγων', nf: 'φεύγουσα', am: 'φεύγοντα', af: 'φεύγουσαν' }],
  ['μένω', 'waiting', { nm: 'μένων', nf: 'μένουσα', am: 'μένοντα', af: 'μένουσαν' }],
  ['τρέχω', 'running', { nm: 'τρέχων', nf: 'τρέχουσα', am: 'τρέχοντα', af: 'τρέχουσαν' }],
];
// [present participle, aorist participle, -ing, past participle, Greek object, English object]
const TIMING = [
  ['λύων', 'λύσας', 'freeing', 'freed', 'τὸν ἵππον', 'the horse'],
  ['πέμπων', 'πέμψας', 'sending', 'sent', 'τὸν δοῦλον', 'the slave'],
  ['γράφων', 'γράψας', 'writing', 'written', 'τὴν ἐπιστολήν', 'the letter'],
  ['διώκων', 'διώξας', 'chasing', 'chased', 'τοὺς πολεμίους', 'the enemy'],
  ['λαμβάνων', 'λαβών', 'taking', 'taken', 'τὴν ἀσπίδα', 'the shield'],
  ['ἀκούων', 'ἀκούσας', 'hearing', 'heard', 'τὴν φωνήν', 'the voice'],
];
const MAIN = [['φεύγει', 'flees'], ['μένει', 'stays'], ['βοᾷ', 'shouts']];
const cap = (s) => s[0].toUpperCase() + s.slice(1);

export const Y8_GREEK2_GENERATORS = {
  y8hDecl3(level, rng) { return decl3Drill(DECL3, level, rng); },
  y8hDecl3b(level, rng) { return decl3Drill(DECL3B, level, rng); },
  y8hAorist(level, rng) { return aoristDrill(WEAK, level, rng, 'weak'); },
  y8hAorist2(level, rng) { return aoristDrill(STRONG, level, rng, 'strong'); },

  y8hContract(level, rng) {
    if (level === 2) {
      const [lemma, base, hes, forms] = rng.pick(E_VERBS);
      const i = rng.int(0, 5);
      const open = lemma.slice(0, -1) + UNCONTRACTED[i];
      return choice(`**${open}** (from ${lemma}, “I ${base}”) contracts to which form?`, forms[i], rng.shuffle(forms.filter((f) => f !== forms[i])), rng, {
        explain: `${open} → ${forms[i]} (${RULE[i]}): “${engPresent(i, base, hes)}”.`,
        steps: ['The stem ends in ε, which merges with the ending.', `Here: ${RULE[i]}.`, `${open} → ${forms[i]}.`],
      });
    }
    const [lemma, base, hes, forms] = rng.pick(level === 3 ? A_VERBS : E_VERBS);
    const i = rng.int(0, 5);
    if (rng.chance(0.5)) {
      const wrongs = rng.shuffle([0, 1, 2, 3, 4, 5].filter((k) => k !== i)).map((k) => engPresent(k, base, hes));
      return choice(`What does **${forms[i]}** (from ${lemma}) mean?`, engPresent(i, base, hes), wrongs, rng, {
        explain: `${forms[i]} = ${engPresent(i, base, hes)}. ${lemma} is a contracted verb: the stem vowel (${level === 3 ? 'α' : 'ε'}) has merged with the ending.`,
        steps: [`Contracted ${level === 3 ? '-άω' : '-έω'} present: ${forms.join(', ')}.`, `${forms[i]} is the ${PERSON[i]} form.`, `So: “${engPresent(i, base, hes)}”.`],
      });
    }
    return choice(`Which Greek form means **${engPresent(i, base, hes)}** (from ${lemma})?`, forms[i], rng.shuffle(forms.filter((f) => f !== forms[i])), rng, {
      explain: `“${engPresent(i, base, hes)}” = ${forms[i]}.`,
      steps: [`The full present of ${lemma}: ${forms.join(', ')}.`, `I need the ${PERSON[i]} form.`, `${forms[i]}.`],
    });
  },

  y8hMiddle(level, rng) {
    const i = rng.pick(MP_PERSONS);
    if (level === 1) {
      const [lemma, , mp, act] = rng.pick(PASSIVE);
      const voice = rng.chance(0.5) ? 'active' : 'middle or passive';
      const form = (voice === 'active' ? act : mp)[i];
      return choice(`Is **${form}** (from ${lemma}) active, or middle/passive?`, voice, ['active', 'middle or passive'].filter((x) => x !== voice), rng, {
        explain: `${form} is ${voice}. Middle and passive endings: -ομαι, -εται, -ομεθα, -εσθε, -ονται; active: -ω, -ει, -ομεν, -ετε, -ουσι(ν).`,
        steps: ['Look at the ending.', voice === 'active' ? 'It is one of the active endings: -ω, -εις, -ει, -ομεν, -ετε, -ουσι(ν).' : 'It is one of the middle/passive endings: -ομαι, -εται, -ομεθα, -εσθε, -ονται.', `So ${form} is ${voice}.`],
      });
    }
    if (level === 2) {
      const [lemma, pp, mp, , base] = rng.pick(PASSIVE);
      const others = MP_PERSONS.filter((k) => k !== i);
      const wrongs = rng.shuffle([engPresent(i, base, he(base)), ...rng.shuffle(others).slice(0, 2).map((k) => passiveEng(k, pp))]);
      return choice(`What does **${mp[i]}** (from ${lemma}) mean?`, passiveEng(i, pp), wrongs, rng, {
        explain: `${mp[i]} is present passive, ${PERSON[i]}: “${passiveEng(i, pp)}”.`,
        steps: [`The ending of ${mp[i]} is middle/passive.`, `It shows ${PERSON[i]}.`, `Passive: “${passiveEng(i, pp)}”.`],
      });
    }
    const [lemma, base, hes, forms] = rng.pick(DEPONENT);
    const eng = engPresent(i, base, hes);
    if (rng.chance(0.5)) {
      const wrongs = rng.shuffle(MP_PERSONS.filter((k) => k !== i)).map((k) => engPresent(k, base, hes));
      return choice(`What does **${forms[i]}** mean?`, eng, wrongs, rng, {
        explain: `${forms[i]} = ${eng}. ${lemma} is a deponent: middle/passive endings, but an active meaning.`,
        steps: [`${lemma} has middle/passive endings: ${forms.filter(Boolean).join(', ')}.`, 'But it is a deponent, so the meaning is active.', `${forms[i]} (${PERSON[i]}) = “${eng}”.`],
      });
    }
    return choice(`Which Greek form means **${eng}**?`, forms[i], rng.shuffle(forms.filter((f) => f && f !== forms[i])), rng, {
      explain: `“${eng}” = ${forms[i]} (from ${lemma}, a deponent verb).`,
      steps: [`${lemma} is deponent: middle/passive endings with an active meaning.`, `I need the ${PERSON[i]} ending.`, `${forms[i]}.`],
    });
  },

  y8hPart(level, rng) {
    if (level === 1) {
      const [lemma, ing, forms] = rng.pick(ARTICULAR);
      const key = rng.pick(['ms', 'fs', 'mp', 'fp']);
      const [art, eng] = ARTICULAR_ENG[key];
      const phrase = `${art} ${forms[key]}`;
      const right = `${eng} ${ing}`;
      const wrongs = ['ms', 'fs', 'mp', 'fp'].filter((k) => k !== key).map((k) => `${ARTICULAR_ENG[k][1]} ${ing}`);
      return choice(`What does **${phrase}** mean?`, right, wrongs, rng, {
        explain: `${phrase} = ${right}. The article + a participle means “the one(s) who…”; the article and the ending show gender and number.`,
        steps: [`${forms[key]} is the present participle of ${lemma} (${ing}).`, `${art} shows ${key[0] === 'm' ? 'masculine' : 'feminine'} ${key[1] === 's' ? 'singular' : 'plural'}.`, `So: ${right}.`],
      });
    }
    if (level === 2) {
      const s = rng.pick(SUBJ);
      const o = rng.pick(OBJ.filter((x) => x[1] !== s[1]));
      const [lemma, ing, forms] = rng.pick(AGREE);
      const withSubj = rng.chance(0.5);
      const part = withSubj ? forms[`n${s[2]}`] : forms[`a${o[2]}`];
      const right = withSubj ? s[1] : o[1];
      const sentence = `${s[0]} ${o[0]} ${part} ὁρᾷ.`;
      return choice(`**${sentence}** (ὁρᾷ = sees; ${part} is from ${lemma}). Who is ${ing}?`, right, [withSubj ? o[1] : s[1], 'both of them'], rng, {
        explain: `${part} is ${withSubj ? 'nominative' : 'accusative'} ${s[2] === 'm' && withSubj || o[2] === 'm' && !withSubj ? 'masculine' : 'feminine'} singular, so it agrees with ${withSubj ? s[0] : o[0]}: ${right} is ${ing}.`,
        steps: ['A participle agrees with its noun in gender, case and number.', `${part} is ${withSubj ? 'nominative, like the subject' : 'accusative, like the object'}.`, `So ${right} is ${ing}.`],
      });
    }
    const [pres, aor, ing, pp, objG, objE] = rng.pick(TIMING);
    const [mainG, mainE] = rng.pick(MAIN);
    const useAor = rng.chance(0.6);
    const part = useAor ? aor : pres;
    const sentence = `ὁ στρατηγὸς ${objG} ${part} ${mainG}.`;
    const having = `Having ${pp} ${objE}, the general ${mainE}.`;
    const whileing = `While ${ing} ${objE}, the general ${mainE}.`;
    const swapped = `Having ${pp} the general, ${objE} ${mainE.replace(/s$/, '')}${objE === 'the enemy' ? '' : 's'}.`;
    const right = useAor ? having : whileing;
    return choice(`Translate **${sentence}**`, right, [useAor ? whileing : having, swapped], rng, {
      explain: `${part} is ${useAor ? 'an aorist participle: the action came first (“having…”)' : 'a present participle: the action is happening at the same time (“while…”)'}. It is nominative masculine, so it goes with ὁ στρατηγός.`,
      steps: [`${part}: ${useAor ? 'aorist' : 'present'} participle, nominative masculine singular.`, 'Nominative, so the general is the one doing it.', `${cap(useAor ? 'having' : 'while')} …: ${right}`],
    });
  },
};
