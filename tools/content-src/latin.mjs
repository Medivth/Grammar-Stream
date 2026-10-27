// Latin: a Year 7 head start. Vocabulary both ways (Latin→English, English→Latin), verb
// endings, nominative and accusative, plurals, Roman life, numbers, Latin inside English,
// and a short original story. No macrons, as in most school courses.

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `latin.${id}`, topic: `latin.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({ id: `latin.${id}`, topic: `latin.${topic}`, kind: 'mcq', prompt, options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra });
const choiceOnly = { formats: ['choice'] };

/** [latin, english, derivative hint, extra accepted English answers] */
const WORDS_1 = [
  ['puella', 'girl', 'puerile (childish) shares its root with puer, puella’s brother word', []],
  ['puer', 'boy', 'puerile means childish', []],
  ['servus', 'slave', 'servant, service, serve', ['servant']],
  ['dominus', 'master', 'dominate, dominant, domino', ['lord', 'owner']],
  ['villa', 'house', 'village grew out of villa: a country house and the settlement around it', ['country house', 'home']],
  ['hortus', 'garden', 'horticulture is the art of gardening', []],
  ['canis', 'dog', 'canine teeth are the pointed “dog teeth”', []],
  ['amicus', 'friend', 'amicable means friendly', []],
  ['mater', 'mother', 'maternal, maternity', ['mum', 'mom']],
  ['pater', 'father', 'paternal, paternity, patriot (father-land)', ['dad']],
  ['filius', 'son', 'filial means to do with a son or daughter', []],
  ['filia', 'daughter', 'filial means to do with a son or daughter', []],
  ['femina', 'woman', 'feminine', ['lady']],
  ['vir', 'man', 'virtue originally meant manliness, then goodness', []],
];
const WORDS_2 = [
  ['cibus', 'food', 'no common English word comes from it, so learn this one by heart', []],
  ['aqua', 'water', 'aquarium, aqueduct, aquatic', []],
  ['via', 'road', 'via (by way of), viaduct', ['street', 'way']],
  ['cena', 'dinner', 'the Romans’ main meal, eaten in the late afternoon', ['meal', 'supper']],
  ['culina', 'kitchen', 'culinary means to do with cooking', []],
  ['mensa', 'table', 'Mensa, the high-IQ society, means “table” (a round table of equals)', []],
  ['liber', 'book', 'library, libretto', []],
  ['equus', 'horse', 'equestrian, equine', []],
  ['ancilla', 'slave-girl', 'ancillary means helping or supporting', ['slave girl', 'maid', 'female slave']],
  ['coquus', 'cook', 'cook, cuisine, biscuit (twice-cooked)', []],
  ['mercator', 'merchant', 'merchant, mercantile, market', ['trader']],
  ['urbs', 'city', 'urban, suburb', ['town']],
  ['templum', 'temple', 'temple', []],
  ['forum', 'market-place', 'a forum is still a place for public discussion', ['market place', 'marketplace', 'town square', 'public square', 'forum']],
];
/** [latin 3rd-person verb, english, derivative] */
const VERBS = [
  ['laborat', 'works', 'laboratory, labour'],
  ['ambulat', 'walks', 'ambulance (originally a walking hospital), amble'],
  ['sedet', 'sits', 'sedentary, sediment'],
  ['dormit', 'sleeps', 'dormitory, dormant'],
  ['clamat', 'shouts', 'exclaim, clamour'],
  ['portat', 'carries', 'portable, transport, porter'],
  ['videt', 'sees', 'video, evident, visible'],
  ['audit', 'hears', 'audio, audience, audit'],
  ['amat', 'loves', 'amateur (someone who does it for love), amiable'],
  ['intrat', 'enters', 'entrance, enter'],
  ['currit', 'runs', 'current, courier, curriculum (a running course)'],
  ['salutat', 'greets', 'salute, salutation'],
  ['bibit', 'drinks', 'imbibe, beverage'],
  ['parat', 'prepares', 'prepare, apparatus'],
];
const NUMBERS = [['unus', 'one', 'unicorn, unit, unique'], ['duo', 'two', 'duet, duo, dual'], ['tres', 'three', 'trio, triple, triangle'], ['quattuor', 'four', 'quartet, quadrilateral'], ['quinque', 'five', 'quintet, quintuplets'], ['sex', 'six', 'sextet, sextuplets'], ['septem', 'seven', 'September was the seventh month of the old Roman year'], ['octo', 'eight', 'October (once the eighth month of the Roman year), octave, octet'], ['novem', 'nine', 'November (once the ninth month of the Roman year)'], ['decem', 'ten', 'December (once the tenth month of the Roman year), decimal']];
const PHRASES = [['salve', 'hello', 'literally “be well”; to more than one person, salvete', ['hi', 'greetings']], ['vale', 'goodbye', 'literally “be strong”; to more than one person, valete', ['farewell', 'bye']], ['gratias tibi ago', 'thank you', 'literally “I give thanks to you”; gratias on its own works too', ['thanks', 'thank you very much']], ['ita vero', 'yes', 'literally “thus truly”', ['yes indeed', 'indeed']], ['minime', 'no', 'literally “least of all”', ['not at all', 'no way']]];

const STORY = { passage: 'Marcus est pater. Iulia est mater. Lucius est filius. Flavia est filia.\nMarcus in horto sedet. Iulia in atrio laborat. Felix est servus. Felix in culina cenam parat.\nRufus est canis. Rufus in via dormit. Lucius canem videt. Lucius clamat: “Rufe!” Rufus ad Lucium currit.\nFlavia aquam portat. Felix cenam portat. familia in triclinio cenat. Rufus sub mensa dormit.', passageSource: 'A short story written for this app' };

const topics = [
  { id: 'latin.words-1', title: 'First words: people and places', kind: 'facts', prereqs: [], batch: 6, intro: 'Latin was the language of the Romans, and it is hiding inside half the words you already know. Start with fourteen words for people and places. Say each one aloud: Latin is pronounced as it is spelt, with “c” always hard as in “cat” and “v” said like “w”.', teach: 'Teach three Latin words and the English words that come from them.', talk: 'Ask her for the Latin for dog, and what “canine” means.' },
  { id: 'latin.verbs-1', title: 'Verbs: what people are doing', kind: 'facts', prereqs: ['latin.words-1'], batch: 6, intro: 'Latin verbs end in -t when they mean “he”, “she” or “it” does something: laborat means “he works” or “she works”. No separate word for “he” is needed.', teach: 'Explain how you can tell a Latin verb means “he” or “she” does something.', talk: 'Ask her what ambulat, dormit and clamat mean, then where “ambulance” comes from.' },
  { id: 'latin.sentences-1', title: 'Reading simple sentences', kind: 'facts', prereqs: ['latin.verbs-1'], batch: 5, intro: 'Latin usually puts the verb LAST: “servus laborat” is “the slave works”. Latin has no words for “the” or “a”, so you add them in English.', teach: 'Translate “puella in horto sedet” and explain the word order.', talk: 'Make up a three-word Latin sentence together.' },
  { id: 'latin.cases', title: 'Who does what: nominative and accusative', kind: 'facts', prereqs: ['latin.sentences-1'], batch: 5, intro: 'In Latin the ENDING tells you who is doing the action and who it is done to. “servus puellam videt”: the slave (servus) sees the girl (puellam). Swap the endings and the girl sees the slave, whatever the word order.', teach: 'Explain the difference between puella and puellam.', talk: '“canis puerum videt” or “canem puer videt”: who sees whom? (Same answer both times!)' },
  { id: 'latin.verbs-2', title: 'I, you, he: verb endings', kind: 'facts', prereqs: ['latin.verbs-1'], batch: 6, intro: 'Change the ending, change the person: ambulo (I walk), ambulas (you walk), ambulat (he or she walks). The verb “to be” is irregular, just like in English: sum, es, est.', teach: 'Explain what -o, -s and -t tell you at the end of a Latin verb.', talk: 'Ask her to say “I sleep”, “you sleep” and “she sleeps” in Latin.' },
  { id: 'latin.plurals', title: 'More than one: -ae, -i, -nt', kind: 'facts', prereqs: ['latin.cases'], batch: 5, intro: 'One girl is puella; two girls are puellae. One slave is servus; several are servi. When the subject is plural, the verb ends -nt: servi laborant.', teach: 'Explain how to make puella and servus plural, and what happens to the verb.', talk: 'Ask her the Latin for “the dogs are sleeping” (canes dormiunt is 3rd declension; try “servi dormiunt”).' },
  { id: 'latin.words-2', title: 'More words: food, home and the city', kind: 'facts', prereqs: ['latin.words-1'], batch: 6, intro: 'Fourteen more words, this time for food, the home and the city. Watch for the English words hiding inside them.', teach: 'Teach three words from this set with their English relatives.', talk: 'At dinner: ask her the Latin for food, water and table.' },
  { id: 'latin.numbers', title: 'Numbers and greetings', kind: 'facts', prereqs: ['latin.words-1'], batch: 5, intro: 'Counting to ten in Latin explains the names of four months and dozens of English words. Plus five phrases to greet a Roman politely.', teach: 'Count to ten in Latin and explain why September is not the seventh month.', talk: 'Greet each other in Latin for a day: salve in the morning, vale at bedtime.' },
  { id: 'latin.roots', title: 'Latin inside English', kind: 'facts', prereqs: ['latin.words-2', 'latin.verbs-1'], links: ['english'], batch: 6, intro: 'About half of English vocabulary comes from Latin, often through French. Knowing the Latin root lets you work out words you have never seen.', teach: 'Pick an English word, find the Latin inside it, and explain how the meaning connects.', talk: 'Spot three Latin-rooted words on a cereal box or in the news.' },
  { id: 'latin.romans', title: 'Roman life', kind: 'facts', prereqs: ['latin.words-2'], links: ['history'], batch: 6, intro: 'The words tell you how the Romans lived: a house with an open-roofed hall, dinner lying down, school with a wax tablet, and numbers you still see on clock faces.', teach: 'Describe a Roman house using the Latin names of its rooms.', talk: 'Find Roman numerals on a clock, a film’s end credits or a building.' },
  { id: 'latin.story', title: 'A short story: the family at home', kind: 'reading', prereqs: ['latin.plurals', 'latin.words-2'], batch: 8, intro: 'A whole story in Latin, using only words you know. Read it twice, aloud if you can, then answer the questions.', teach: 'Retell the story in English.', talk: 'Ask her to read the story aloud to you, then translate a sentence of your choice.' },
];

const items = [];
const meanings = (list) => list.map((w) => w[1]);
const vocab = (prefix, topic, list) => {
  list.forEach(([la, en, deriv, accept], i) => {
    const others = list.filter((w) => w[0] !== la);
    const wrongEn = [others[(i + 1) % others.length][1], others[(i + 4) % others.length][1], others[(i + 7) % others.length][1]];
    const wrongLa = [others[(i + 2) % others.length][0], others[(i + 5) % others.length][0], others[(i + 8) % others.length][0]];
    items.push(fact(`${prefix}.${la}`, topic, `What does **${la}** mean?`, en, wrongEn, `${la} = ${en}. ${deriv}.`, { accept: [...accept, `a ${en}`, `the ${en}`], learn: `**${la}** = ${en}\n_${deriv}._` }));
    items.push(fact(`${prefix}.en.${la}`, topic, `What is the Latin for **${en}**?`, la, wrongLa, `${en} = ${la}. ${deriv}.`, { strict: true }));
  });
  void meanings;
};
vocab('w1', 'words-1', WORDS_1);
vocab('w2', 'words-2', WORDS_2);

// works → working, but sits → sitting, carries → carrying, sees → seeing
const ING = { sits: 'sitting', runs: 'running', carries: 'carrying', sees: 'seeing', loves: 'loving', prepares: 'preparing' };
const ing = (en) => ING[en] || en.replace(/s$/, 'ing');
VERBS.forEach(([la, en, deriv], i) => {
  const others = VERBS.filter((v) => v[0] !== la);
  items.push(fact(`v1.${la}`, 'verbs-1', `What does **${la}** mean?`, `he or she ${en}`, [others[(i + 1) % 13][1], others[(i + 5) % 13][1], others[(i + 9) % 13][1]].map((e) => `he or she ${e}`), `${la} = he/she ${en}. English relatives: ${deriv}.`, { accept: [en, `he ${en}`, `she ${en}`, `it ${en}`, `is ${ing(en)}`, `he is ${ing(en)}`, `she is ${ing(en)}`, `he/she ${en}`], learn: `**${la}** = he or she ${en}\n_${deriv}._` }));
  items.push(fact(`v1.en.${la}`, 'verbs-1', `What is the Latin for **he ${en}**?`, la, [others[(i + 2) % 13][0], others[(i + 6) % 13][0], others[(i + 10) % 13][0]], `he ${en} = ${la}.`, { strict: true }));
});

// --- simple sentences
const SENT = [
  ['servus laborat.', 'The slave works.', ['The slave sleeps.', 'The master works.']],
  ['puella in horto sedet.', 'The girl sits in the garden.', ['The girl sits in the house.', 'The boy sits in the garden.']],
  ['canis dormit.', 'The dog sleeps.', ['The dog runs.', 'The cook sleeps.']],
  ['dominus in villa est.', 'The master is in the house.', ['The master is in the garden.', 'The slave is in the house.']],
  ['mater clamat.', 'The mother shouts.', ['The mother walks.', 'The daughter shouts.']],
  ['amicus intrat.', 'The friend enters.', ['The friend leaves.', 'The father enters.']],
  ['pater in via ambulat.', 'The father walks in the street.', ['The father runs in the street.', 'The father walks in the garden.']],
  ['puer aquam portat.', 'The boy carries water.', ['The boy drinks water.', 'The girl carries water.']],
  ['filia cibum parat.', 'The daughter prepares food.', ['The daughter eats food.', 'The son prepares food.']],
  ['femina canem audit.', 'The woman hears the dog.', ['The woman sees the dog.', 'The dog hears the woman.']],
];
SENT.forEach(([la, en, wrong], i) => items.push(fact(`s1.${i + 1}`, 'sentences-1', `Translate: **${la}**`, en, wrong, `${la} → “${en}”. Remember: the verb usually comes last, and English adds “the”.`, choiceOnly)));
items.push(fact('s1.order', 'sentences-1', 'Where does the verb usually go in a Latin sentence?', 'at the end', ['at the start', 'in the middle', 'anywhere; it doesn’t matter'], '“puella in horto sedet”: the verb sedet comes last. Latin can move words around for emphasis, but the end is normal.', choiceOnly));
items.push(fact('s1.the', 'sentences-1', 'How do you say “the” or “a” in Latin?', 'you don’t: there are no such words', ['ille for “the”, unus for “a”', 'with the ending -que', 'et'], 'servus can mean “slave”, “a slave” or “the slave”. You choose when you translate.', choiceOnly));
items.push(fact('s1.est', 'sentences-1', 'What does **est** mean?', 'is', ['and', 'he', 'the'], 'est = is. “Marcus est pater” = Marcus is the father.', { accept: ['he is', 'she is', 'it is'] }));
items.push(fact('s1.in', 'sentences-1', 'What does **in** mean in “in horto”?', 'in', ['into', 'on top of', 'near'], 'in + horto = in the garden. (With a different ending, in can also mean “into”, but not yet!)', choiceOnly));

// --- cases
const CASES = [
  ['servus puellam videt.', 'the slave', 'the girl'],
  ['puella servum videt.', 'the girl', 'the slave'],
  ['dominus canem audit.', 'the master', 'the dog'],
  ['canis dominum audit.', 'the dog', 'the master'],
  ['Marcus Iuliam salutat.', 'Marcus', 'Iulia'],
  ['puer puellam amat.', 'the boy', 'the girl'],
];
CASES.forEach(([la, subj, obj], i) => {
  const objWord = la.split(' ').find((w) => /m$/.test(w));
  items.push(mcq(`c.${i + 1}`, 'cases', `**${la}** Who is doing the action, and to whom?`, [[`${subj} → ${obj}`, true], [`${obj} → ${subj}`, false, `Look at the endings. The word ending in -m (${objWord}) is the accusative: the one the action is done TO.`]], `${la}: the subject (nominative) has its plain ending; the object (accusative) ends in -m: ${objWord}. So ${subj} does it to ${obj}.`));
});
items.push(fact('c.nom', 'cases', 'The form of a noun used for the person DOING the action (puella, servus) is called the…', 'nominative', ['accusative', 'genitive', 'plural'], 'Nominative = the subject. puella sedet: the girl is doing the sitting.'));
items.push(fact('c.acc', 'cases', 'The form of a noun used for the person the action is done TO (puellam, servum) is called the…', 'accusative', ['nominative', 'ablative', 'vocative'], 'Accusative = the object. servus puellam videt: the girl is seen.'));
items.push(fact('c.am', 'cases', 'What is the accusative (object) form of **puella**?', 'puellam', ['puellae', 'puellus', 'puello'], 'Words like puella change -a to -am: puella → puellam.', { strict: true }));
items.push(fact('c.um', 'cases', 'What is the accusative (object) form of **servus**?', 'servum', ['servi', 'serva', 'servo'], 'Words like servus change -us to -um: servus → servum.', { strict: true }));
items.push(mcq('c.order', 'cases', '**canem puer videt.** Who sees whom?', [['The boy sees the dog', true], ['The dog sees the boy', false, 'canem ends in -em (accusative): the dog is the object even though it comes first. Latin word order is flexible; endings are not.']], 'puer is nominative (subject), canem is accusative (object). Putting canem first just emphasises the dog.'));

// --- verb endings
const PERS = [['ambulo', 'I walk'], ['ambulas', 'you walk'], ['ambulat', 'he or she walks'], ['laboro', 'I work'], ['sedes', 'you sit'], ['dormis', 'you sleep'], ['video', 'I see'], ['audis', 'you hear'], ['clamo', 'I shout'], ['sum', 'I am'], ['es', 'you are'], ['est', 'he/she/it is']];
const PROG = { 'I walk': 'I am walking', 'you walk': 'you are walking', 'I work': 'I am working', 'you sit': 'you are sitting', 'you sleep': 'you are sleeping', 'I shout': 'I am shouting' };
PERS.forEach(([la, en], i) => {
  const others = PERS.filter((p) => p[0] !== la);
  items.push(fact(`v2.${la}`, 'verbs-2', `What does **${la}** mean?`, en, [others[(i + 1) % 11][1], others[(i + 4) % 11][1], others[(i + 7) % 11][1]], la === 'sum' ? 'sum = I am. sum is irregular: it ends in -m, not -o, but es (you are) and est (he/she/it is) follow the -s and -t pattern.' : `${la} = ${en}. The ending tells you the person: -o is I, -s is you, -t is he/she/it.`, { accept: en.startsWith('he or she') ? [en.replace('he or she ', 'he '), en.replace('he or she ', 'she ')] : en.startsWith('he/she/it') ? ['he is', 'she is', 'it is', 'is', 'he, she or it is'] : PROG[en] ? [PROG[en]] : [] }));
});
items.push(fact('v2.o', 'verbs-2', 'Which ending means “I” on a Latin verb?', '-o', ['-s', '-t', '-nt'], 'amo = I love, laboro = I work.', { accept: ['o'] }));
items.push(fact('v2.s', 'verbs-2', 'Which ending means “you” (one person) on a Latin verb?', '-s', ['-o', '-t', '-mus'], 'amas = you love, sedes = you sit.', { accept: ['s'] }));
items.push(fact('v2.t', 'verbs-2', 'Which ending means “he, she or it” on a Latin verb?', '-t', ['-s', '-o', '-nt'], 'amat = he/she loves. Add n before it (-nt) for “they”.', { accept: ['t'] }));

// --- plurals
const PL = [['puellae', 'girls'], ['servi', 'slaves'], ['pueri', 'boys'], ['amici', 'friends'], ['villae', 'houses'], ['horti', 'gardens'], ['domini', 'masters']];
PL.forEach(([la, en], i) => {
  const others = PL.filter((p) => p[0] !== la);
  items.push(fact(`pl.${la}`, 'plurals', `What does **${la}** mean?`, en, [others[(i + 1) % 6][1], others[(i + 3) % 6][1], others[(i + 5) % 6][1]], la === 'pueri' ? 'pueri = boys. puer does not end in -us, but it still takes -i in the plural, like servus → servi.' : `${la} = ${en}. -a words go to -ae; -us words go to -i.`, { accept: [`the ${en}`] }));
});
items.push(fact('pl.sunt', 'plurals', 'What does **sunt** mean?', 'they are', ['he is', 'you are', 'we are'], 'est = is (one); sunt = are (more than one). “servi in horto sunt” = the slaves are in the garden.', { accept: ['are'] }));
items.push(fact('pl.ant', 'plurals', 'Translate: **servi laborant.**', 'The slaves work.', ['The slave works.', 'The slaves sleep.', 'The masters work.'], 'servi (plural) + laborant (-nt = they): the slaves work.', choiceOnly));
items.push(fact('pl.ending', 'plurals', 'When the subject is “they” or a plural noun like servi, what does the verb end in?', '-nt', ['-t', '-s', '-ae'], 'servus laborat → servi laborant. puella clamat → puellae clamant.', { accept: ['nt'] }));
items.push(fact('pl.make', 'plurals', 'What is the plural of **puella**?', 'puellae', ['puellam', 'puelli', 'puella'], '-a becomes -ae: puella → puellae.', { strict: true }));
items.push(fact('pl.make2', 'plurals', 'What is the plural of **amicus**?', 'amici', ['amicae', 'amicum', 'amicus'], '-us becomes -i: amicus → amici.', { strict: true }));

// --- numbers and greetings
NUMBERS.forEach(([la, en, deriv], i) => {
  const others = NUMBERS.filter((n) => n[0] !== la);
  items.push(fact(`n.${la}`, 'numbers', `What number is **${la}**?`, en, [others[(i + 1) % 9][1], others[(i + 4) % 9][1], others[(i + 7) % 9][1]], `${la} = ${en}. ${deriv}.`, { accept: [String(i + 1)], learn: `**${la}** = ${en}\n_${deriv}._` }));
});
PHRASES.forEach(([la, en, note, accept], i) => {
  const others = PHRASES.filter((p) => p[0] !== la);
  items.push(fact(`ph.${i + 1}`, 'numbers', `What does **${la}** mean?`, en, [others[(i + 1) % 4][1], others[(i + 2) % 4][1], others[(i + 3) % 4][1]], `${la} = ${en}: ${note}.`, { accept, learn: `**${la}** = ${en}\n_${note}._` }));
  items.push(fact(`ph.en.${i + 1}`, 'numbers', `How do you say **${en}** in Latin?`, la, la.includes(' ') ? [la === 'ita vero' ? 'minime' : 'ita vero, amice', 'vale, mi amice', 'salvete, omnes'] : [others[(i + 1) % 4][0], others[(i + 2) % 4][0], others[(i + 3) % 4][0]], `${en} = ${la}: ${note}.`, { accept: la === 'gratias tibi ago' ? ['gratias', 'gratias ago'] : [] }));
});
items.push(fact('n.months', 'numbers', 'September, October, November and December are named after the numbers seven, eight, nine and ten. Why do the names not match our calendar?', 'the Roman year originally began in March', ['the Romans could not count', 'the names were chosen at random', 'the months were renamed by the Normans'], 'Starting from March, September really was the seventh month. Two months were later added at the start, and the names stayed.', choiceOnly));

// --- Latin inside English
const ROOTS = [
  ['aqua', 'water', 'aquarium', ['acrobat', 'square', 'liquorice']],
  ['liber', 'book', 'library', ['liberty', 'label', 'lever']],
  ['porto', 'I carry', 'portable', ['portion', 'potato', 'porch']],
  ['video', 'I see', 'evidence', ['divide', 'vivid', 'velvet']],
  ['audio', 'I hear', 'audience', ['odour', 'auburn', 'autumn']],
  ['manus', 'hand', 'manual', ['mansion', 'mandarin', 'many']],
  ['pes, pedis', 'foot', 'pedal', ['pest', 'pebble', 'petal']],
  ['caput', 'head', 'capital', ['capture', 'carpet', 'capsule']],
  ['scribo', 'I write', 'scribble', ['scrub', 'scramble', 'crisp']],
  ['dico', 'I say', 'dictionary', ['dice', 'ditch', 'dinosaur']],
  ['magnus', 'great', 'magnify', ['magnet', 'magpie', 'mango']],
  ['terra', 'land, earth', 'terrain', ['terror', 'terrible', 'tear']],
  ['annus', 'year', 'annual', ['annoy', 'anchor', 'anthem']],
  ['corpus', 'body', 'corpse', ['corn', 'corner', 'copper']],
];
ROOTS.forEach(([la, en, word, wrong], i) => items.push(fact(`r.${i + 1}`, 'roots', `**${la}** means “${en}”. Which English word comes from it?`, word, wrong, `${word} comes from ${la} (${en}).${word === 'capital' ? ' A capital city is the “head” city; a capital letter heads a sentence.' : word === 'manual' ? ' A manual is a handbook; manual work is done by hand.' : word === 'evidence' ? ' Evidence is what can be seen.' : word === 'annual' ? ' Annual means yearly; an anniversary is the turning of a year.' : ''}`, choiceOnly)));

// --- Roman life
items.push(fact('ro.forum', 'romans', 'What was the **forum**?', 'the town’s market-place', ['the public baths', 'the main dining room', 'the walled army camp'], 'Business, politics, shopping and gossip all happened in the forum. Rome’s Forum Romanum is still there.', choiceOnly));
items.push(fact('ro.thermae', 'romans', 'What were the **thermae**?', 'the public baths', ['the temples', 'the shops', 'the kitchens'], 'Thermae (from the Greek for heat): hot rooms, cold plunges, exercise yards. Bath in England is named after its Roman baths.', { accept: ['baths', 'public baths', 'the baths'] }));
items.push(fact('ro.atrium', 'romans', 'What was the **atrium** of a Roman house?', 'the entrance hall', ['the kitchen', 'the walled garden', 'the main bedroom'], 'The pool was the impluvium. Modern hotel atriums borrow the name.', choiceOnly));
items.push(fact('ro.triclinium', 'romans', 'What happened in the **triclinium**?', 'dinner', ['bathing', 'sleeping', 'lessons'], 'Tri-clinium = three couches, arranged round a low table. Guests reclined on their left elbow and ate with their right hand.', choiceOnly));
items.push(fact('ro.toga', 'romans', 'Who wore the **toga**?', 'adult male citizens', ['slaves at work', 'all Roman women', 'soldiers in battle'], 'A huge semicircle of wool, hard to put on without help. Everyday wear was the simpler tunica.', choiceOnly));
items.push(fact('ro.stilus', 'romans', 'Roman schoolchildren wrote with a **stilus** on a…', 'wax tablet (tabula)', ['sheet of paper', 'slate', 'computer'], 'Scratch letters in the wax with the point; smooth them out with the flat end. “Stylus” and “style” come from stilus.', choiceOnly));
items.push(fact('ro.ludus', 'romans', '**ludus** means both “school” and…', 'game', ['dinner', 'temple', 'war'], 'The same word for school and play. Gladiators trained in a ludus too.', { accept: ['games', 'play'] }));
items.push(fact('ro.amph', 'romans', 'What kind of building was the **amphitheatrum**?', 'an arena for gladiator fights', ['a semicircular theatre for plays', 'a temple to all the gods', 'a race-track for chariots'], 'Amphi = all round: seats on every side. The Colosseum in Rome held about 50,000 people. Chariots raced in the circus.', choiceOnly));
items.push(fact('ro.spqr', 'romans', 'What do the letters **SPQR**, seen on Roman standards and still on Rome’s drain covers, stand for?', 'Senatus Populusque Romanus', ['Super Potens Quattuor Reges', 'Senatus Pater Quirinus Rex', 'Semper Paratus Quis Regit'], 'The -que on Populusque means “and”: “the Senate and-People of-Rome”.', choiceOnly));
items.push(fact('ro.num1', 'romans', 'What number is **XIV** in Roman numerals?', '14', ['16', '9', '24'], 'X = 10, IV = 4 (one before five). 10 + 4 = 14.'));
items.push(fact('ro.num2', 'romans', 'What number is **XLII**?', '42', ['62', '38', '92'], 'XL = 40 (ten before fifty), II = 2.'));
items.push(fact('ro.num3', 'romans', 'Write **2026** in Roman numerals.', 'MMXXVI', ['MMXVI', 'MXXVI', 'MMXXIV'], 'M = 1000, so MM = 2000; XX = 20; VI = 6.', { strict: true }));

// --- the story
const Q = (id, prompt, right, wrongs, explain) => items.push(fact(`st.${id}`, 'story', prompt, right, wrongs, explain, { ...STORY, formats: ['choice'] }));
Q(1, 'Who is the mother?', 'Iulia', ['Flavia', 'Marcus', 'Felix'], '“Iulia est mater.”');
Q(2, 'Where is Marcus?', 'in the garden', ['in the kitchen', 'in the street', 'in the dining room'], '“Marcus in horto sedet”: he sits in the garden.');
Q(3, 'What is Felix doing?', 'preparing dinner', ['sleeping in the street', 'working in the atrium', 'carrying water'], '“Felix in culina cenam parat.” Felix is the servus (slave) and the cook.');
Q(4, 'Who is Rufus?', 'the dog', ['the son', 'the slave', 'a friend'], '“Rufus est canis.”');
Q(5, 'What does Lucius do when he sees the dog?', 'he shouts its name', ['he carries it', 'he runs away', 'he feeds it'], '“Lucius clamat: ‘Rufe!’” Rufe is the form of Rufus used when calling someone: the vocative.');
Q(6, 'What does Flavia carry?', 'water', ['dinner', 'a book', 'the dog'], '“Flavia aquam portat.” aquam is the accusative of aqua.');
Q(7, 'Where does the family eat?', 'in the triclinium', ['in the atrium', 'in the garden', 'in the kitchen'], '“familia in triclinio cenat.” cenat = dines, from cena.');
Q(8, 'Where does Rufus sleep at the end?', 'under the table', ['in the street', 'in the garden', 'on a couch'], '“Rufus sub mensa dormit.” sub = under.');

const TOPIC_HOOKS = {
  'latin.words-1': 'Latin hides inside English: **aqua** → aquarium, **villa** → village.',
  'latin.verbs-1': 'A Latin verb ending in **-t** means he or she is doing it: **amat**, he or she loves.',
  'latin.sentences-1': 'Find the verb first: Latin usually saves it for the end of the sentence.',
  'latin.cases': 'The **-m** marks who is on the receiving end: puella**m** is the girl as the object.',
  'latin.verbs-2': 'Chant the endings: **-o, -s, -t, -mus, -tis, -nt** (I, you, he or she, we, you all, they).',
  'latin.plurals': 'More than one: **-ae** and **-i** for the people, **-nt** on the verb: puellae ambulant.',
  'latin.words-2': 'Home and food words live on in English: **domus** → domestic, **panis** → pantry.',
  'latin.numbers': '**Unus, duo, tres**: a unicycle has one wheel, a duet has two singers, a triangle three corners.',
  'latin.roots': 'Spot the root: **port** = carry (porter, transport), **scrib** = write (scribble, script).',
  'latin.romans': 'The Romans gave us straight roads, public baths, and July and August (after Julius Caesar and Augustus).',
  'latin.story': 'Read Latin in chunks: find the verb at the end, then look for **-m** to see who it happens to.',
};
for (const t of topics) t.hook = TOPIC_HOOKS[t.id];

export default [{ subject: 'latin', deck: 'core', topics, items }];
