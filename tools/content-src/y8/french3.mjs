// Year 8 French: reading, translation and culture. Four original reading passages (an email, a
// blog, holiday plans, and La Fontaine's "Le Corbeau et le Renard" retold in simple modern French,
// with the fox's moral in La Fontaine's own words, 1668), translation both ways, cognates and
// false friends, and the French-speaking world. Comprehension answers are in English; every typed
// French answer carries lang: 'fr' (accents forgiven with a note, wrong endings never).

const fact = (id, topic, prompt, answer, distractors, explain, extra = {}) => ({ id: `french.rt.${id}`, topic: `french.${topic}`, kind: 'fact', prompt, answer, distractors, explain, ...extra });
const mcq = (id, topic, prompt, options, explain, extra = {}) => ({ id: `french.rt.${id}`, topic: `french.${topic}`, kind: 'mcq', prompt, options: options.map(([text, correct, feedback]) => ({ text, correct: !!correct, feedback })), explain, ...extra });
const order = (id, topic, prompt, items, explain, extra = {}) => ({ id: `french.rt.${id}`, topic: `french.${topic}`, kind: 'order', prompt, items, labels: null, explain, ...extra });
const C = { formats: ['choice'] };
const FR = { lang: 'fr' };

// French typography: curly apostrophes, a narrow no-break space before ! ? ; and a no-break space before : and
// inside « », so punctuation never wraps onto a line of its own on a phone.
const fr = (s) => s.replace(/'/g, '’').replace(/ ([!?;])/g, ' $1').replace(/ :/g, ' :').replace(/« /g, '« ').replace(/ »/g, ' »');

// Accepted answers from a pattern: {a|b} picks one, nested freely; the first expansion is the
// model answer. Commas are optional in typed answers, so a comma-free copy of each is added.
export function expand(p) {
  const i = p.indexOf('{');
  if (i < 0) return [p];
  let depth = 0, j = i;
  const cuts = [];
  for (; j < p.length; j++) {
    if (p[j] === '{') depth++;
    else if (p[j] === '}') { if (--depth === 0) break; } else if (p[j] === '|' && depth === 1) cuts.push(j);
  }
  const inner = [i, ...cuts, j].slice(0, -1).map((a, k, arr) => p.slice(a + 1, k + 1 < arr.length ? arr[k + 1] : j));
  const rest = expand(p.slice(j + 1));
  return inner.flatMap((alt) => expand(alt).flatMap((a) => rest.map((r) => p.slice(0, i) + a + r)));
}
const tidy = (s) => s.replace(/\s+/g, ' ').replace(/ ([,.])/g, '$1').trim();
function variants(pattern, french) {
  const out = [];
  for (const v of expand(pattern).map(tidy)) for (const w of [v, v.replace(/,/g, '')]) {
    const x = french ? fr(tidy(w)) : tidy(w);
    if (!out.includes(x)) out.push(x);
  }
  return out;
}

// ---------------------------------------------------------------- passages
const passage = (title, body, glossary, source) => ({ passage: `${fr(title)}\n\n${fr(body)}\n\nGlossary: ${glossary}`, passageSource: source, hear: fr(body) });

const EMAIL = passage('Objet : mon collège', `Salut Emily,

Merci pour ton message ! Je m'appelle Chloé, j'ai douze ans et j'habite à Lyon avec ma mère, mon beau-père et mon petit frère. Je suis en cinquième dans un grand collège près du centre-ville.

Les cours commencent à huit heures et finissent à seize heures trente. Le mercredi après-midi, on n'a pas cours : c'est génial ! Ma matière préférée, c'est l'histoire-géo, parce que le prof est très drôle et j'adore le passé. Par contre, je déteste les maths : c'est difficile et on a trop de devoirs. J'apprends aussi l'anglais et l'espagnol. L'anglais, c'est utile, mais la prof parle trop vite !

À midi, je mange à la cantine avec mes copines. La nourriture n'est pas mauvaise, mais il y a toujours beaucoup de bruit. Le jeudi, après les cours, je fais du théâtre.

Dans mon collège, on ne porte pas d'uniforme, mais on n'a pas le droit d'utiliser son portable. La semaine dernière, ma classe a visité un musée des sciences. C'était super intéressant !

Et toi ? Est-ce que tu portes un uniforme ? Quelle est ta matière préférée ?

Grosses bises,
Chloé`, 'par contre = on the other hand; la nourriture = food; le bruit = noise; les copines = (girl) friends; le théâtre = drama; grosses bises = lots of love.', 'An email written for this app');

const BLOG = passage('Mon week-end', `Le blog de Karim, 13 ans, Marseille

Samedi matin, j'ai fait la grasse matinée jusqu'à dix heures. Ensuite, j'ai joué un match de foot avec mon club contre une équipe d'Aix-en-Provence. On a gagné trois à un, et j'ai marqué un but !

L'après-midi, je suis allé en ville avec mon cousin Sami. Nous avons fait les magasins et j'ai acheté un maillot de l'OM avec mon argent de poche. Le soir, nous avons mangé des pizzas devant la télé et nous avons regardé un film d'horreur. Ma petite sœur a crié pendant tout le film ! Moi, j'ai trouvé ça nul.

Dimanche, il a plu toute la journée, alors je suis resté à la maison. J'ai fait mes devoirs (beurk !) et j'ai aidé mon père à préparer le déjeuner : un poulet rôti avec des frites. L'après-midi, ma grand-mère est venue chez nous et nous avons joué aux cartes. C'était sympa, mais elle a gagné toutes les parties !

Le week-end prochain, je vais aller au Vélodrome avec mon oncle pour voir un match de l'OM. J'ai hâte !`, 'marquer un but = to score a goal; faire les magasins = to go shopping; l’argent de poche = pocket money; une partie = a game; l’OM = Olympique de Marseille, the city’s football club; le Vélodrome = its stadium; j’ai hâte = I can’t wait.', 'A blog written for this app');

const HOLIDAY = passage('Mes grandes vacances', `par Inès

Cet été, ma famille et moi, nous allons passer deux semaines en Bretagne, chez mes grands-parents. Ils habitent à Saint-Malo, une jolie ville au bord de la mer. Nous allons prendre le train, parce que c'est plus rapide et moins fatigant que la voiture.

S'il fait beau, nous allons aller à la plage tous les jours. Mon frère va faire de la voile et moi, je vais essayer le kayak pour la première fois. S'il pleut, nous allons visiter l'aquarium ou jouer à des jeux de société avec Mamie et Papi. Et bien sûr, je vais manger des crêpes au moins une fois par jour !

L'année dernière, nous sommes allés à la montagne, dans les Alpes. J'ai fait des randonnées tous les jours, mais je n'ai pas aimé ça : c'était trop fatigant et il n'y avait pas de piscine.

En août, je vais partir en colonie de vacances avec ma meilleure amie, Léa. On va dormir sous la tente et faire du cheval. J'ai un peu peur des chevaux, mais je suis très contente !

Mais je ne veux pas penser à la rentrée…`, 'au bord de la mer = by the sea; faire de la voile = to go sailing; les jeux de société = board games; Mamie et Papi = Granny and Grandpa; une randonnée = a hike; une colonie de vacances = a holiday camp for children; avoir peur de = to be afraid of.', 'A piece of writing written for this app');

const FABLE = passage('Le Corbeau et le Renard', `d'après Jean de La Fontaine

Un jour, Maître Corbeau est perché sur un arbre. Dans son bec, il tient un gros fromage. Il est très content.

Maître Renard passe sous l'arbre. Il sent l'odeur du fromage et il a très faim. Alors, il lève la tête et dit au corbeau :
« Bonjour, Monsieur du Corbeau ! Que vous êtes joli ! Que vous êtes beau ! Vos plumes sont magnifiques. Si votre voix est aussi belle que vos plumes, vous êtes le roi des oiseaux de la forêt ! »

Le corbeau est très fier. Il veut montrer sa belle voix au renard. Il ouvre un large bec pour chanter… et il laisse tomber son fromage !

Le renard attrape le fromage et dit :
« Mon bon Monsieur,
Apprenez que tout flatteur
Vit aux dépens de celui qui l'écoute.
Cette leçon vaut bien un fromage, sans doute. »

Puis il part avec le fromage. Le corbeau a honte. Il jure qu'il ne va plus jamais écouter les flatteurs… mais c'est un peu tard !`, 'Maître = Master (an old title of respect); perché = perched; le bec = beak; il tient = he is holding; il sent = he smells; laisser tomber = to drop; attraper = to catch; un flatteur = a flatterer; aux dépens de = at the expense of; celui qui l’écoute = the one who listens to him; vaut = is worth; avoir honte = to be ashamed; jurer = to swear, to promise.', 'Retold for this app from Jean de La Fontaine, Fables, book 1 (1668); the fox’s last four lines are La Fontaine’s own');

// ---------------------------------------------------------------- topics
const topics = [
  { id: 'french.r-cognates', title: 'Cognates and false friends', kind: 'facts', prereqs: [], batch: 6, diagnostic: ['french.rt.cg.librairie', 'french.rt.cg.delicieux'],
    intro: 'Thousands of French words look like English ones, because English borrowed them from the Normans after 1066. These cognates (« mots apparentés ») and a few spelling patterns let you read far more than you have learned. But watch out for false friends (« faux amis »): they look familiar and mean something else.',
    teach: 'Explain the difference between a cognate and a false friend, with two examples of each.',
    talk: 'Find something with French on it (a food packet, a shampoo bottle, a leaflet) and ask {him} to find five words {she} can understand without a dictionary.',
    hook: '**Hat on, s gone**: a circumflex often marks a lost s, so forêt = forest, hôpital = hospital, fête = feast. And **false friends lie**: une librairie sells books but does not lend them.',
    example: 'In a French town, « Pharmacie » and « Toilettes » are easy cognates, but « Sortie » (exit) and « Gare » (station) have to be learned.' },
  { id: 'french.r-read-1', title: 'Reading: an email about school', kind: 'reading', prereqs: ['french.r-cognates', 'french.v-school'], batch: 10,
    intro: 'Chloé, from Lyon, writes to her English pen pal about her school. Read the whole email once for the gist, then read each question and hunt for the answer: the questions follow the order of the text. Stuck on a word? Look for a cognate and use the context before you reach for the glossary.',
    teach: 'Tell someone three differences between Chloé’s school and yours, in English, then say one of them in French.',
    talk: 'Ask {him} what Chloé thinks of maths and why, then what {she} would write back about {her} own school.',
    hook: '**Skim, scan, dig**: skim for the gist, scan for the key word in the question, then read that sentence closely.' },
  { id: 'french.r-read-2', title: 'Reading: a blog about the weekend', kind: 'reading', prereqs: ['french.r-read-1', 'french.g-perfect-avoir'], batch: 10,
    intro: 'Karim, who is 13 and lives in Marseille, blogs about his weekend. It is full of the perfect tense (j’ai fait, je suis allé), and time words such as samedi matin, dimanche and le week-end prochain tell you when each thing happened.',
    teach: 'Pick three verbs in the perfect tense from the blog and explain how each one is made.',
    talk: 'Ask {him} to tell you about Karim’s weekend in English, then about {her} own last weekend with at least one French verb in it.',
    hook: '**Time words are signposts**: hier, samedi dernier and le week-end prochain tell you the tense before the verb does.' },
  { id: 'french.r-read-3', title: 'Reading: holiday plans', kind: 'reading', prereqs: ['french.r-read-1', 'french.g-future'], batch: 11,
    intro: 'Inès is looking forward to her summer in Brittany. Most of her plans use the near future, aller + infinitive (nous allons passer, je vais essayer), but one paragraph looks back at last year’s holiday. Spot the change of tense.',
    teach: 'Find two sentences about the future and one about the past, and explain how you can tell which is which.',
    talk: 'Plan your next family day out together, and ask {him} to say two things you are going to do in French, starting « On va… ».',
    hook: '**ALLER + infinitive = going to**: je vais essayer = I am going to try; nous allons partir = we are going to leave.' },
  { id: 'french.r-read-4', title: 'Reading: a fable', kind: 'reading', prereqs: ['french.r-read-2'], batch: 11,
    intro: 'Jean de La Fontaine published his first Fables in 1668, and French children still learn « Le Corbeau et le Renard » by heart. Here it is retold in simple modern French, with the fox’s famous moral in La Fontaine’s own words. Like many of his fables, it goes back to Aesop.',
    teach: 'Retell the fable in English in five sentences, then explain the moral in your own words.',
    talk: 'Ask {him} for an example of someone flattering a person to get something: in a story, an advert or real life.',
    hook: '**The flatterer gets the cheese**: anyone who praises you too much may want something from you.' },
  { id: 'french.r-translate-1', title: 'Translating into English', kind: 'reading', prereqs: ['french.r-cognates', 'french.g-perfect-avoir', 'french.g-future'], batch: 6,
    intro: 'Translating means carrying the meaning across, not swapping word for word. Read the whole French sentence, find the verb and its tense, then write what an English speaker would really say: « j’ai douze ans » is “I am twelve”, not “I have twelve years”.',
    teach: 'Explain three French phrases that you cannot translate word for word.',
    talk: 'Read {him} the English of one sentence from this topic and ask {him} to say the French it came from.',
    hook: '**Meaning, not words**: il y a = there is, il fait beau = the weather is nice, le samedi = on Saturdays.' },
  { id: 'french.r-translate-2', title: 'Translating into French', kind: 'reading', prereqs: ['french.r-translate-1', 'french.g-perfect-etre', 'french.g-adjectives'], batch: 7,
    intro: 'Translating into French uses everything you know at once. Write your sentence, then check it with GATE: Gender (un or une?), Agreement (does the adjective need an -e or an -s?), Tense (and the right helping verb), Elision (je + aime = j’aime).',
    teach: 'Take a sentence you got wrong and explain the mistake using GATE.',
    talk: 'Say a short English sentence about your day and ask {him} to put it into French, then to check it with GATE.',
    hook: '**GATE before you go**: Gender, Agreement, Tense, Elision.' },
  { id: 'french.r-culture', title: 'France and the French-speaking world', kind: 'facts', prereqs: [], batch: 6, diagnostic: ['french.rt.cu.14juillet', 'french.rt.cu.musique'],
    intro: 'French is spoken by about 320 million people on five continents: in France, Belgium, Switzerland and Luxembourg, in Quebec, across West and Central Africa, in the Caribbean and beyond. Here are the festivals, symbols and places that French speakers know.',
    teach: 'Explain what happens on le 14 juillet and what it remembers.',
    talk: 'Look at a world map together and ask {him} to point to four places where French is spoken.',
    hook: '**Liberté, Égalité, Fraternité**: the motto on French town halls and schools, and on French euro coins.' },
];

// ---------------------------------------------------------------- items
const items = [];
const push = (...xs) => items.push(...xs);

// --- cognates and false friends
push(
  mcq('cg.librairie', 'r-cognates', 'What is **une librairie**?', [['a bookshop', true], ['a library', false, 'A false friend! A library is une bibliothèque.'], ['a bookcase', false, 'A bookcase is une bibliothèque too (or une étagère).'], ['a bakery', false, 'A bakery is une boulangerie.']], 'Une librairie sells books; une bibliothèque lends them.', { hear: 'une librairie' }),
  fact('cg.delicieux', 'r-cognates', 'French -eux often matches English -ous. What does **délicieux** mean?', 'delicious', ['delightful', 'dangerous', 'delicate'], '-eux = -ous: délicieux = delicious, dangereux = dangerous, nerveux = nervous.', { accept: ['tasty'], hear: 'délicieux' }),
  mcq('cg.foret', 'r-cognates', 'A circumflex (ˆ) often marks a lost s. What does **la forêt** mean?', [['the forest', true], ['the fortress', false, 'A fortress is une forteresse.'], ['the party', false, 'A party is une fête (fête = feast: another lost s).'], ['the fort', false, 'A fort is un fort.']], 'Put the s back after the ê: for-ê-t → for-es-t.', { hear: 'la forêt' }),
  fact('cg.hopital', 'r-cognates', 'Put back the lost s: what does **l’hôpital** mean?', 'the hospital', ['the hotel', 'the chemist', 'the police station'], 'hôpital → hospital. (Hôtel was once hostel: another lost s.)', { accept: ['a hospital', 'hospital'], hear: 'l’hôpital' }),
  mcq('cg.rapidement', 'r-cognates', 'French -ment often matches English -ly. What does **rapidement** mean?', [['quickly', true], ['a rapid', false, 'The -ment ending here makes an adverb, not a noun.'], ['quick', false, 'Quick is rapide; -ment adds the -ly.'], ['slowly', false, 'Slowly is lentement.']], 'rapide + -ment = rapidement, rapidly or quickly.', { hear: 'rapidement' }),
  mcq('cg.sensible', 'r-cognates', 'What does the French adjective **sensible** mean?', [['sensitive', true], ['sensible', false, 'A false friend! “Sensible” in English is raisonnable.'], ['sensational', false, 'That is sensationnel.'], ['senseless', false, 'That is insensé.']], 'Elle est très sensible = she is very sensitive.', { hear: 'sensible' }),
  mcq('cg.actuellement', 'r-cognates', 'What does **actuellement** mean?', [['at the moment', true], ['actually', false, 'A false friend! “Actually” is en fait.'], ['accurately', false, 'That is avec précision.'], ['eventually', false, 'Another false friend: éventuellement means “possibly”. “Eventually” is finalement.']], 'Actuellement, j’habite à Leeds = at the moment, I live in Leeds.', { hear: 'actuellement' }),
  mcq('cg.college', 'r-cognates', 'In France, what is **le collège**?', [['a secondary school for 11- to 15-year-olds', true], ['a college or university for adults', false, 'University is l’université (la fac).'], ['a sixth-form college for 16- to 18-year-olds', false, 'That is le lycée.'], ['a primary school for children under 11', false, 'That is l’école primaire.']], 'French pupils go to l’école primaire, then le collège (11 to 15), then le lycée (15 to 18).', { hear: 'le collège' }),
  fact('cg.rester', 'r-cognates', 'What does the verb **rester** mean?', 'to stay', ['to rest', 'to arrest', 'to restore'], 'A false friend: rester = to stay; “to rest” is se reposer.', { accept: ['stay', 'to remain', 'remain'], hear: 'rester' }),
  fact('cg.attendre', 'r-cognates', 'What does the verb **attendre** mean?', 'to wait (for)', ['to attend', 'to attack', 'to listen'], 'A false friend: attendre = to wait for; “to attend” is assister à.', { accept: ['to wait', 'wait', 'wait for', 'to wait for'], hear: 'attendre' }),
  fact('cg.journee', 'r-cognates', 'What does **une journée** mean?', 'a day', ['a journey', 'a newspaper', 'a diary'], 'Une journée = a (whole) day; a journey is un voyage, a newspaper un journal.', { accept: ['day', 'the day', 'a whole day', 'one day'], hear: 'une journée' }),
  mcq('cg.veste', 'r-cognates', 'Which of these French words is a **false friend**?', [['une veste', true, 'Right: une veste is a jacket, not a vest.'], ['la musique', false, 'La musique is music: a true cognate.'], ['le chocolat', false, 'Le chocolat is chocolate: a true cognate.'], ['important', false, 'Important means important: a true cognate.']], 'Une veste = a jacket. A vest is un maillot de corps.'),
  mcq('cg.electrique', 'r-cognates', 'French -ique often matches English -ic or -ical. What does **électrique** mean?', [['electric', true], ['electricity', false, 'Electricity is l’électricité (-té = -ty).'], ['electrician', false, 'An electrician is un électricien.'], ['election', false, 'An election is une élection.']], 'électrique = electric or electrical; historique = historic or historical.', { hear: 'électrique' }),
  fact('cg.liberte', 'r-cognates', 'French -té often matches English -ty. Write the French for **liberty** (with “la”).', 'la liberté', ['le liberté', 'la libertie', 'la libertée'], '-ty = -té, and these nouns are feminine: la liberté, la société, l’université.', { ...FR, accept: ['liberté'], hear: 'la liberté' }),
  fact('cg.chateau', 'r-cognates', 'Castle comes from an old word, castel. Using the circumflex pattern, write the French for **the castle**.', 'le château', ['la château', 'le chasteau', 'le châteaux'], 'castel → chastel → château: the s fell out and left its hat on the â.', { ...FR, accept: ['château'], hear: 'le château' }),
  mcq('cg.strategy', 'r-cognates', 'You meet a French word you don’t know. What is the best first step?', [['Look for an English word inside it, then check the context', true], ['Assume that it always means what it looks like in English', false, 'False friends will catch you out: check the context.'], ['Skip the whole sentence and go on to the next one', false, 'You can usually work most of it out.'], ['Look up every single word in the dictionary before you read', false, 'Slow, and you lose the gist. Use the dictionary last.']], 'Cognate, then context, then dictionary.'),
);

// --- reading 1: Chloé's email
push(
  fact('rd1.family', 'r-read-1', 'Who does Chloé live with?', 'her mum, her stepdad and her little brother', ['her mum, her dad and her big brother', 'her dad, her stepmum and her little sister', 'her grandparents and her little brother'], '« ma mère, mon beau-père et mon petit frère ». Beau-père means stepfather (or father-in-law), not “handsome father”!', { ...C, ...EMAIL }),
  mcq('rd1.year', 'r-read-1', 'Chloé is « en cinquième ». Which school year is that in England?', [['Year 8', true], ['Year 5', false, 'French secondary years count down: sixième is the first year of collège.'], ['Year 7', false, 'Year 7 is sixième.'], ['Year 10', false, 'Year 10 is troisième.']], 'Sixième = Year 7, cinquième = Year 8, quatrième = Year 9, troisième = Year 10: the years count down.', EMAIL),
  fact('rd1.finish', 'r-read-1', 'What time do lessons finish? (Write the time in English.)', '4.30 pm', ['6.30 pm', '4.15 pm', '1.30 pm'], '« seize heures trente » = 16:30, half past four. Seize (16) is not six, and trente (30) is not quinze (15).', { ...EMAIL, accept: ['4.30', '4:30', '4:30 pm', '4.30pm', '4:30pm', '4.30 p.m.', '4:30 p.m.', '16:30', '16.30', '16h30', 'half past four', 'half four', 'half past four in the afternoon'], strict: true }),
  mcq('rd1.wednesday', 'r-read-1', 'What is special about Wednesday afternoons?', [['There are no lessons', true], ['She does drama club', false, 'Drama (le théâtre) is on Thursdays.'], ['They have a long maths lesson', false, 'Look for « on n’a pas cours ».'], ['She goes to the museum', false, 'The museum visit was last week.']], '« Le mercredi après-midi, on n’a pas cours » = there are no lessons on Wednesday afternoons. Many French collèges have no lessons then.', EMAIL),
  mcq('rd1.history', 'r-read-1', 'Why is history-geography her favourite subject?', [['The teacher is funny and she loves the past', true], ['It is easy and there is no homework at all', false, 'She doesn’t say that: look after « parce que ».'], ['All of her best friends are in the same class', false, 'Her friends come up at lunchtime, not here.'], ['She wants to be a history teacher one day', false, 'She doesn’t mention her future.']], '« parce que le prof est très drôle et j’adore le passé »: parce que (because) introduces the reasons.', EMAIL),
  fact('rd1.maths', 'r-read-1', 'Give one reason why Chloé hates maths.', 'it’s difficult', ['the teacher is strict', 'it’s boring', 'the lessons are too early'], '« c’est difficile et on a trop de devoirs »: it is difficult, and they get too much homework.', { ...EMAIL, accept: ['it is difficult', 'difficult', 'it is hard', 'it’s hard', 'hard', 'too much homework', 'there is too much homework', 'they get too much homework', 'they have too much homework', 'lots of homework', 'it is difficult and there is too much homework', 'it’s difficult and there’s too much homework'] }),
  mcq('rd1.phones', 'r-read-1', 'What is the rule about mobile phones at her school?', [['Pupils are not allowed to use them', true], ['Pupils may use them at lunchtime', false, '« on n’a pas le droit d’utiliser son portable »: no phones.'], ['Pupils can use them in English lessons', false, 'The rule has no exceptions in the email.'], ['Pupils have to leave them at home', false, 'She says they cannot use them, not that they cannot bring them.']], '« on n’a pas le droit de… » = we are not allowed to… Since 2018, French law has banned pupils from using mobile phones at primary school and collège.', EMAIL),
  mcq('rd1.museum', 'r-read-1', '« C’était super intéressant ! » What does Chloé say about the museum trip?', [['It was really interesting', true], ['It is going to be interesting', false, 'C’était is the past: it was.'], ['It wasn’t very interesting', false, 'There is no ne… pas here.'], ['It is always interesting', false, 'C’était is the past, not the present.']], 'C’était = it was. Super is everyday French for “really”.', EMAIL),
  fact('rd1.homework', 'r-read-1', 'Find the French in the email for **too much homework**.', 'trop de devoirs', ['trop des devoirs', 'très de devoirs', 'beaucoup devoirs'], 'After trop (too much) and beaucoup (a lot), use de, never des: trop de devoirs.', { ...EMAIL, ...FR }),
  fact('rd1.favourite', 'r-read-1', 'Find the French in the email for **my favourite subject**.', 'ma matière préférée', ['mon matière préféré', 'ma préférée matière', 'ma matière préféré'], 'Matière is feminine, so ma… préférée (with an extra -e). Préféré goes after the noun.', { ...EMAIL, ...FR }),
);

// --- reading 2: Karim's blog
push(
  mcq('rd2.morning', 'r-read-2', 'What did Karim do on Saturday morning before his match?', [['He had a lie-in until ten', true], ['He did his homework until ten', false, 'The homework was on Sunday.'], ['He went shopping with his cousin', false, 'That was in the afternoon.'], ['He trained with his club at ten', false, 'Look at « la grasse matinée ».']], '« faire la grasse matinée » = to have a lie-in (literally, “to do the fat morning”).', BLOG),
  fact('rd2.score', 'r-read-2', 'What was the score in Karim’s match? (His team first.)', '3–1', ['1–3', '3–0', '2–1'], '« On a gagné trois à un » = we won three–one.', { ...BLOG, accept: ['3-1', '3–1', '3 1', 'three one', 'three-one', '3 to 1', 'three to one', 'they won 3-1', 'they won 3–1', 'won 3-1', '3-1 to karim’s team', '3–1 to karim’s team', '3–1 to them', '3-1 to them'] }),
  mcq('rd2.bought', 'r-read-2', 'What did Karim buy in town?', [['a Marseille football shirt', true], ['a swimsuit for the beach', false, 'Un maillot de bain is a swimsuit, but un maillot de l’OM is a Marseille football shirt.'], ['a ticket for the next match', false, 'His uncle is taking him next weekend.'], ['a new football for his club', false, 'A football is un ballon.']], '« un maillot de l’OM »: un maillot is a sports shirt, and l’OM is Olympique de Marseille.', BLOG),
  mcq('rd2.film', 'r-read-2', 'What did Karim think of the horror film?', [['He thought it was rubbish', true], ['He found it terrifying', false, 'It was his sister who screamed.'], ['He thought it was great', false, 'Nul is the opposite of génial.'], ['He fell asleep during it', false, 'He doesn’t say that.']], '« Moi, j’ai trouvé ça nul » = I thought it was rubbish. Trouver can mean “to think of” as well as “to find”.', BLOG),
  fact('rd2.sunday', 'r-read-2', 'Why did Karim stay at home on Sunday?', 'it rained all day', ['he was ill', 'he had too much homework', 'his grandmother was coming'], '« il a plu toute la journée, alors je suis resté à la maison »: il a plu is the perfect tense of pleuvoir, to rain.', { ...BLOG, accept: ['it rained', 'because it rained', 'because it rained all day', 'it was raining', 'it was raining all day', 'because it was raining', 'rain', 'the rain', 'it rained all day long'] }),
  fact('rd2.cards', 'r-read-2', 'Who won the card games?', 'his grandmother', ['Karim', 'his father', 'his little sister'], '« elle a gagné toutes les parties »: elle is his grandmother, who came round in the afternoon.', { ...BLOG, accept: ['grandmother', 'his grandma', 'grandma', 'his gran', 'gran', 'granny', 'his granny', 'his nan', 'nan', 'karim’s grandmother', 'karim’s grandma'] }),
  mcq('rd2.next', 'r-read-2', 'What is Karim going to do next weekend?', [['watch a Marseille match with his uncle', true], ['play a match at the Vélodrome himself', false, '« pour voir un match » = to see a match.'], ['go to the cinema with his uncle', false, 'Le Vélodrome is a football stadium.'], ['visit his grandmother with his uncle', false, 'His grandmother came last Sunday.']], '« je vais aller au Vélodrome… pour voir un match de l’OM »: the near future, aller + infinitive.', BLOG),
  mcq('rd2.etre', 'r-read-2', 'Why does Karim write « je suis allé », not « j’ai allé »?', [['Aller takes être in the perfect tense', true], ['Allé is irregular, so it changes', false, 'The past participle allé is regular; it is the helping verb that matters.'], ['J’ai allé would mean “I will go”', false, 'J’ai allé is simply wrong.'], ['Karim is writing chatty, informal French', false, 'Je suis allé is correct in all French, formal or not.']], 'Verbs of movement and staying (aller, venir, rester, partir…) take être: je suis allé, je suis resté, elle est venue.', BLOG),
  fact('rd2.stayed', 'r-read-2', 'Find the French in the blog for **I stayed at home**.', 'je suis resté à la maison', ['j’ai resté à la maison', 'je reste à la maison', 'je suis rester à la maison'], 'Rester takes être: je suis resté (restée if a girl writes it).', { ...BLOG, ...FR, accept: ['je suis restée à la maison'] }),
  fact('rd2.won', 'r-read-2', 'Find the French in the blog for **we won**.', 'on a gagné', ['on est gagné', 'on gagne', 'on a gagner'], 'In everyday French, on often means “we”: on a gagné = nous avons gagné.', { ...BLOG, ...FR, accept: ['nous avons gagné'] }),
);

// --- reading 3: Inès's holiday plans
push(
  fact('rd3.long', 'r-read-3', 'How long is Inès going to spend in Brittany?', 'two weeks', ['two months', 'ten days', 'one week'], '« nous allons passer deux semaines en Bretagne » = we are going to spend two weeks in Brittany.', { ...HOLIDAY, accept: ['2 weeks', 'a fortnight', 'fortnight'] }),
  fact('rd3.where', 'r-read-3', 'Where are they going to stay?', 'with her grandparents', ['in a hotel by the sea', 'at a campsite', 'with her best friend'], '« chez mes grands-parents »: chez = at the house of.', { ...HOLIDAY, accept: ['her grandparents', 'grandparents', 'with grandparents', 'at her grandparents', 'at her grandparents’', 'at her grandparents’ house', 'at her grandparents house', 'at her grandparents’ home', 'with her grandparents in saint-malo', 'in saint-malo with her grandparents'] }),
  mcq('rd3.train', 'r-read-3', 'Why are they taking the train?', [['It is quicker and less tiring than the car', true], ['It is cheaper and greener than the car', false, 'Look at « plus rapide et moins fatigant ».'], ['Her parents haven’t got a car any more', false, 'She doesn’t say that.'], ['Her grandparents will meet them at the station', false, 'She doesn’t mention the station.']], 'plus rapide = quicker, moins fatigant = less tiring: plus and moins make comparisons.', HOLIDAY),
  fact('rd3.try', 'r-read-3', 'What is Inès going to try for the first time?', 'kayaking', ['sailing', 'surfing', 'horse riding'], '« je vais essayer le kayak pour la première fois ». Sailing (la voile) is her brother’s activity.', { ...HOLIDAY, accept: ['kayak', 'the kayak', 'going kayaking', 'a kayak'] }),
  mcq('rd3.rain', 'r-read-3', 'What are they going to do if it rains?', [['visit the aquarium or play board games', true], ['go to the beach anyway, in coats', false, 'The beach is for « s’il fait beau ».'], ['go to the cinema or go shopping in town', false, 'Look after « S’il pleut ».'], ['stay in bed and read their books', false, 'Look after « S’il pleut ».']], '« S’il pleut, nous allons visiter l’aquarium ou jouer à des jeux de société »: s’il = si + il.', HOLIDAY),
  fact('rd3.lastyear', 'r-read-3', 'Where did the family go on holiday last year?', 'the Alps', ['Brittany', 'the seaside', 'Saint-Malo'], '« L’année dernière, nous sommes allés à la montagne, dans les Alpes »: the perfect tense, and a time signpost.', { ...HOLIDAY, accept: ['to the alps', 'alps', 'the mountains', 'to the mountains', 'mountains', 'the mountains in the alps', 'the french alps'] }),
  mcq('rd3.why', 'r-read-3', 'Why didn’t Inès enjoy last year’s holiday?', [['It was too tiring and there was no pool', true], ['It was too hot and there was no beach', false, 'Look after « je n’ai pas aimé ça ».'], ['It rained and there was nothing to do', false, 'Look after « je n’ai pas aimé ça ».'], ['Her brother was ill for the whole week', false, 'Her brother isn’t mentioned there.']], '« c’était trop fatigant et il n’y avait pas de piscine »: c’était = it was, il n’y avait pas de = there wasn’t a.', HOLIDAY),
  mcq('rd3.rentree', 'r-read-3', 'Inès doesn’t want to think about « la rentrée ». What is it?', [['going back to school in September', true], ['the end of her holiday camp', false, 'Close, but la rentrée is a bigger event than that.'], ['coming home from her grandparents', false, 'Close, but la rentrée is a bigger event than that.'], ['the first day of the summer holidays', false, 'That would be good news!']], 'La rentrée is the start of the school year in early September, when the whole country goes back to school and work after the summer.', HOLIDAY),
  mcq('rd3.past', 'r-read-3', 'Which sentence from the text is about the **past**?', [['Nous sommes allés à la montagne.', true], ['Nous allons prendre le train.', false, 'Allons + infinitive: the near future.'], ['Mon frère va faire de la voile.', false, 'Va + infinitive: the near future.'], ['Je vais manger des crêpes.', false, 'Vais + infinitive: the near future.']], 'Sommes allés = être + past participle: the perfect tense. Allons + infinitive = the near future. Same verb, different times!', HOLIDAY),
  fact('rd3.ifrain', 'r-read-3', 'Find the French in the text for **if it rains**.', 's’il pleut', ['si il pleut', 's’il pleuve', 's’il a plu'], 'Si + il shortens to s’il (but si + elle stays si elle).', { ...HOLIDAY, ...FR }),
  fact('rd3.trying', 'r-read-3', 'Find the French in the text for **I am going to try**.', 'je vais essayer', ['je vais essayé', 'je vais à essayer', 'j’ai essayé'], 'Aller + infinitive: je vais essayer. The infinitive ends in -er; essayé (with é) is the past participle.', { ...HOLIDAY, ...FR }),
);

// --- reading 4: the fable
push(
  fact('rd4.beak', 'r-read-4', 'What is the crow holding in its beak?', 'a big cheese', ['a piece of bread', 'a fish', 'a worm'], '« Dans son bec, il tient un gros fromage. »', { ...FABLE, accept: ['cheese', 'a cheese', 'some cheese', 'a large cheese', 'a piece of cheese', 'a big piece of cheese', 'a fat cheese'] }),
  mcq('rd4.fox', 'r-read-4', 'Why does the fox stop under the tree?', [['He smells the cheese and he is hungry', true], ['He wants to rest in the shade of the tree', false, 'Look at « il sent l’odeur du fromage ».'], ['He hears the crow singing', false, 'The crow hasn’t sung yet.'], ['He is looking for his friend', false, 'Look at « il sent l’odeur du fromage ».']], '« Il sent l’odeur du fromage et il a très faim »: avoir faim = to be hungry.', FABLE),
  mcq('rd4.flatter', 'r-read-4', 'How does the fox flatter the crow?', [['He praises his looks and his feathers', true], ['He says the crow is clever and strong', false, 'He talks about looks, not brains.'], ['He says the crow’s cheese looks tasty', false, 'He is careful not to mention the cheese!'], ['He says the crow sings beautifully', false, 'He has never heard the crow sing: he only says “if your voice is as beautiful”.']], '« Que vous êtes joli ! Que vous êtes beau ! Vos plumes sont magnifiques. »', FABLE),
  mcq('rd4.open', 'r-read-4', 'Why does the crow open his beak?', [['to show off his voice', true], ['to eat the cheese', false, 'Look at « pour chanter ».'], ['to shout at the fox', false, 'Look at « pour chanter ».'], ['to say thank you', false, 'Look at « pour chanter ».']], '« Il veut montrer sa belle voix… il ouvre un large bec pour chanter »: pour + infinitive = in order to.', FABLE),
  mcq('rd4.large', 'r-read-4', 'In « il ouvre un large bec », what does **large** mean?', [['wide', true], ['long', false, 'Long is long in French too.'], ['sharp', false, 'Sharp is pointu.'], ['tiny', false, 'Tiny is tout petit.']], 'A false friend: large = wide. Big or large is grand or gros. He opens his beak wide!', FABLE),
  order('rd4.order', 'r-read-4', 'Put the events of the fable in order.', ['The crow sits in a tree with a cheese', 'The fox praises the crow’s feathers', 'The crow opens his beak to sing', 'The fox catches the falling cheese', 'The fox teaches the crow a lesson'], 'Cheese, flattery, song, drop, moral.', FABLE),
  mcq('rd4.moral', 'r-read-4', 'What is the moral of the fable, in English?', [['Flatterers live off the people who listen to them', true], ['Slow and steady wins the race in the end', false, 'That is the moral of the tortoise and the hare (also a La Fontaine fable).'], ['You should always share food with the hungry', false, 'The fox is hungry, but that isn’t the lesson.'], ['Never talk to strangers, however polite they may seem', false, 'Close, but the lesson is about flattery.']], '« Apprenez que tout flatteur vit aux dépens de celui qui l’écoute »: learn that every flatterer lives at the expense of the one who listens to him.', FABLE),
  mcq('rd4.promise', 'r-read-4', 'What does the crow promise at the end?', [['never to listen to flatterers again', true], ['to sing for the fox every single day', false, 'Look at « ne va plus jamais écouter ».'], ['to find another cheese tomorrow', false, 'Look at « ne va plus jamais écouter ».'], ['to get his cheese back', false, 'Look at « ne va plus jamais écouter ».']], '« il ne va plus jamais écouter les flatteurs »: ne… plus jamais = never again. But it is too late (« un peu tard »)!', FABLE),
  fact('rd4.feathers', 'r-read-4', 'Find the French in the fable for **feathers**.', 'les plumes', ['les ailes', 'les poils', 'les feuilles'], 'Les plumes = feathers (a quill pen is une plume too). Les ailes are wings.', { ...FABLE, ...FR, accept: ['plumes', 'vos plumes'] }),
  fact('rd4.proud', 'r-read-4', 'Find the French in the fable for **the crow is very proud**.', 'le corbeau est très fier', ['le corbeau est très fière', 'le corbeau a très fier', 'le corbeau est très fiers'], 'Fier (proud) agrees like any adjective: il est fier, elle est fière.', { ...FABLE, ...FR }),
  mcq('rd4.lafontaine', 'r-read-4', 'Who was Jean de La Fontaine?', [['a French poet of the 1600s who wrote fables', true], ['a Greek storyteller of about 2,500 years ago', false, 'That is Aesop, whose fables La Fontaine retold in verse.'], ['a Belgian artist who drew comic strips', false, 'That is Hergé, the creator of Tintin.'], ['a French king who loved animal stories', false, 'He wrote in the reign of Louis XIV but was not a king.']], 'La Fontaine (1621–1695) published his Fables from 1668. Many go back to Aesop.', FABLE),
);

// --- translating into English: [id, French, accepted English (pattern), wrong translations, explanation]
// Strict: one wrong letter can change the meaning (has/had), so no slips are forgiven here.
const TR1 = [
  ['saturday', 'Le samedi, je joue au tennis avec mon frère.', '{{On Saturdays|Every Saturday}, I play tennis with my brother|I play tennis with my brother {on Saturdays|every Saturday}}.', ['On Saturday, I played tennis with my brother.', 'On Saturdays, I play tennis with my sister.', 'I like playing tennis with my brother on Saturdays.'], '“Le samedi” means every Saturday; “samedi” on its own means this Saturday. Jouer au tennis = to play tennis.'],
  ['hair', 'Ma sœur a les cheveux longs et les yeux bleus.', 'My sister has long hair and blue eyes.', ['My sister has short hair and blue eyes.', 'My sister had long hair and blue eyes.', 'My sisters have long hair and blue eyes.'], 'French puts the adjective after the noun (les yeux bleus = blue eyes), and hair is plural in French (les cheveux) but not in English.'],
  ['maths', 'Je n’aime pas les maths parce que c’est difficile.', '{I {don’t|do not} like|I dislike} maths because {it’s|it is} {difficult|hard}.', ['I like maths because it’s difficult.', 'I don’t like maths because it’s easy.', 'I didn’t like maths because it was difficult.'], 'Ne… pas wraps round the verb: je n’aime pas = I don’t like. French needs “les” after aimer; English just says “maths”.'],
  ['park', 'Il y a un grand parc près de chez moi.', 'There{’s| is} a {big|large} park near {my house|my home|where I live|me}.', ['There was a big park near my house.', 'He has a big park near my house.', 'There is a big park far from my house.'], 'Il y a = there is or there are (not “he has”). Près de chez moi = near my house: chez moi means “at my place”.'],
  ['castle', 'Nous allons visiter le château demain.', '{{We are|We’re} going to visit the {castle|château|chateau} tomorrow|Tomorrow, {we are|we’re} going to visit the {castle|château|chateau}|We will visit the {castle|château|chateau} tomorrow}.', ['We visited the castle yesterday.', 'We are going to the castle today.', 'You are going to visit the castle tomorrow.'], 'Aller + infinitive = “going to”: nous allons visiter = we are going to visit. Demain = tomorrow.'],
  ['film', 'Hier soir, j’ai regardé un film avec mes amis.', '{{Last night|Yesterday evening}, I watched a {film|movie} with my friends|I watched a {film|movie} with my friends {last night|yesterday evening}}.', ['Tonight, I am watching a film with my friends.', 'Last night, I looked for a film with my friends.', 'Last night, I watched a film with my parents.'], 'J’ai regardé is the perfect tense (avoir + past participle): I watched. Regarder = to watch; chercher = to look for.'],
  ['market', 'Mon père est allé au marché pour acheter des pommes.', 'My {father|dad} {went|has gone} to the market to buy {some |}apples.', ['My father is going to the market to buy apples.', 'My father went to the market to buy potatoes.', 'My mother went to the market to buy apples.'], 'Est allé = went (aller takes être). Pour + infinitive = (in order) to. Pommes are apples; potatoes are pommes de terre, “earth apples”.'],
  ['chocolate', 'Je voudrais un chocolat chaud, s’il vous plaît.', 'I{ would|’d} like a hot chocolate, please.', ['I would like a chocolate cake, please.', 'I would like a hot coffee, please.', 'I like hot chocolate, thank you.'], 'Je voudrais = I would like, the polite way to ask for something. Chaud = hot (the C on a French tap means chaud!).'],
  ['meat', 'Elle ne mange jamais de viande.', 'She {never eats|{doesn’t|does not} ever eat} meat.', ['She doesn’t eat much meat.', 'She always eats meat.', 'She never eats vegetables.'], 'Ne… jamais = never. After a negative, du, de la and des become de: jamais de viande.'],
  ['cycling', 'Quand il fait beau, on fait du vélo à la campagne.', '{When {the weather is {nice|good|fine|sunny}|it is {nice|sunny}|it’s {nice|sunny}}, we {go cycling|cycle|go for a bike ride|go for bike rides} in the countryside|We {go cycling|cycle|go for a bike ride|go for bike rides} in the countryside when {the weather is {nice|good|fine|sunny}|it is {nice|sunny}|it’s {nice|sunny}}}.', ['When it is cold, we go cycling in the countryside.', 'When the weather is nice, we go cycling in town.', 'When the weather was nice, we went cycling in the countryside.'], 'Il fait beau = the weather is nice (French uses faire for weather). On often means “we”. Faire du vélo = to cycle.'],
  ['rain', 'Ce week-end, je vais rester à la maison parce qu’il va pleuvoir.', '{This weekend, {I am|I’m} going to stay {at home|in|home} because {it is|it’s} going to rain|{I am|I’m} going to stay {at home|in|home} this weekend because {it is|it’s} going to rain}.', ['This weekend, I am going to rest at home because it is going to rain.', 'This weekend, I stayed at home because it rained.', 'This weekend, I am going to stay at home because it is raining.'], 'Rester = to stay (a false friend: “to rest” is se reposer). Both verbs are in the near future: je vais rester, il va pleuvoir.'],
  ['town', 'Ma ville est assez petite, mais il y a beaucoup de choses à faire.', 'My {town|city} is {quite|fairly|rather|pretty} small, but there {are {lots of|a lot of|many|plenty of} things to do|is {lots|a lot|plenty} to do}.', ['My town is too small, but there are lots of things to do.', 'My town is quite big, but there are lots of things to do.', 'My town is quite small, and there is nothing to do.'], 'Assez = quite (or enough); trop = too. Beaucoup de = lots of: always de, never des.'],
];
for (const [id, french, pattern, wrong, explain] of TR1) {
  const [answer, ...accept] = variants(pattern, false);
  push(fact(`tr1.${id}`, 'r-translate-1', `Translate into English: **${fr(french)}**`, answer, wrong, explain, { accept, hear: fr(french), strict: true }));
}

// --- translating into French: [id, English, accepted French (pattern; the first is the model), wrong translations, explanation]
const TR2 = [
  ['age', 'I am twelve years old.', '{J’ai {douze|12} ans|Je suis {âgé|âgée} de {douze|12} ans}.', ['Je suis douze ans.', 'J’ai douze ans vieux.', 'Je suis douze.'], 'In French you have your age: avoir + number + ans. Never « je suis douze ».'],
  ['football', 'I play football on Saturdays.', '{Je joue au {foot|football} {le samedi|tous les samedis}|Le samedi, je joue au {foot|football}}.', ['Je joue le foot le samedi.', 'Je joue du foot le samedi.', 'Je joue au foot samedis.'], 'Jouer à + a sport, and à + le = au. « Le samedi » = on Saturdays (every week).'],
  ['tall', 'My brother is tall and my sister is small.', 'Mon frère est grand et ma sœur est petite.', ['Mon frère est grand et ma sœur est petit.', 'Mon frère est grande et ma sœur est petit.', 'Ma frère est grand et mon sœur est petite.'], 'Adjectives agree: grand for a boy, petite (+e) for a girl. Possessives agree with the noun: mon frère, ma sœur.'],
  ['house', 'We live in a house in the countryside.', '{Nous habitons|On habite|Nous vivons|On vit} {dans |}une maison à la campagne.', ['Nous habitons dans un maison à la campagne.', 'Nous habitez dans une maison à la campagne.', 'Nous habitent dans une maison à la campagne.'], 'Nous + -ons: nous habitons (or on habite). Maison is feminine: une maison.'],
  ['vegetables', 'I don’t like vegetables.', 'Je n’aime pas les légumes.', ['Je ne aime pas les légumes.', 'Je n’aime pas des légumes.', 'Je n’aime les légumes pas.'], 'Ne becomes n’ before a vowel. After aimer, adorer and détester use le, la or les, even in the negative.'],
  ['cinema', 'Yesterday I went to the cinema.', '{Hier, je suis {allé(e)|allé|allée} au {cinéma|ciné}|Je suis {allé|allée|allé(e)} au {cinéma|ciné} hier}.', ['Hier, j’ai allé au cinéma.', 'Hier, je vais au cinéma.', 'Hier, je suis allé à le cinéma.'], 'Aller takes être in the perfect: je suis allé, or je suis allée if you are a girl. À + le = au.'],
  ['restaurant', 'We are going to eat at the restaurant tonight.', '{{Nous allons|On va} manger au restaurant ce soir|Ce soir, {nous allons|on va} manger au restaurant}.', ['Nous allons mangé au restaurant ce soir.', 'Nous allons manger à le restaurant ce soir.', 'Nous allons à manger au restaurant ce soir.'], 'The near future is aller + infinitive (manger, not mangé). Nous allons, or on va in everyday French.'],
  ['library', 'There is a library, but there isn’t a cinema.', 'Il y a une bibliothèque, mais il n’y a pas de cinéma.', ['Il y a une librairie, mais il n’y a pas de cinéma.', 'Il y a une bibliothèque, mais il n’y a pas un cinéma.', 'Il est une bibliothèque, mais il n’est pas de cinéma.'], 'Une bibliothèque is a library (une librairie is a bookshop). After a negative, un and une become de: il n’y a pas de cinéma.'],
  ['pets', 'She has a black cat and two white dogs.', 'Elle a un chat noir et deux chiens blancs.', ['Elle a un noir chat et deux blancs chiens.', 'Elle a un chat noir et deux chiens blanc.', 'Elle est un chat noir et deux chiens blancs.'], 'Colours go after the noun and agree with it: deux chiens blancs (+s for the plural).'],
  ['subject', 'My favourite subject is history because it’s interesting.', 'Ma matière préférée {est|, c’est|c’est} l’histoire {parce que|car} c’est intéressant.', ['Mon matière préféré est l’histoire parce que c’est intéressant.', 'Ma matière préférée est histoire parce que c’est intéressant.', 'Ma matière préférée est l’histoire parce que c’est intéressante.'], 'Matière is feminine: ma matière préférée. Subjects need the article (l’histoire), and c’est is followed by the masculine adjective: c’est intéressant.'],
  ['getup', 'I get up at seven o’clock.', 'Je me lève à {sept heures|7 heures|7h|7 h}.', ['Je lève à sept heures.', 'Je me lève à sept heure.', 'Je me lève sept heures.'], 'Se lever is reflexive: je me lève (literally, I get myself up). After any number above one, heures takes an -s.'],
  ['spain', 'Last summer, we went to Spain.', '{L’été dernier, {nous sommes {allés|allées}|on est {allés|allé|allées}} en Espagne|{Nous sommes {allés|allées}|On est {allés|allé|allées}} en Espagne l’été dernier}.', ['L’été dernier, nous avons allés en Espagne.', 'L’été dernier, nous sommes allés à l’Espagne.', 'L’été dernier, nous allons en Espagne.'], 'Être verbs agree with the subject: nous sommes allés (allées if you are all girls). Use en with feminine countries: en Espagne, en France.'],
  ['help', 'Can you help me, please?', '{{Est-ce que tu peux|Tu peux|Peux-tu} m’aider, s’il te plaît|{Est-ce que vous pouvez|Vous pouvez|Pouvez-vous} m’aider, s’il vous plaît} ?', ['Est-ce que tu peux m’aide, s’il te plaît ?', 'Est-ce que tu peux me aider, s’il te plaît ?', 'Est-ce que tu peux aider moi, s’il te plaît ?'], 'Pouvoir + infinitive: tu peux m’aider. Me goes before the verb and becomes m’ before a vowel. Say s’il vous plaît to an adult you don’t know.'],
];
for (const [id, english, pattern, wrong, explain] of TR2) {
  const [answer, ...accept] = variants(pattern, true);
  push(fact(`tr2.${id}`, 'r-translate-2', `Translate into French: **${english}**`, answer, wrong.map(fr), explain, { ...FR, accept }));
}

// --- France and the French-speaking world
push(
  mcq('cu.14juillet', 'r-culture', 'What does France celebrate on **14 July** (le 14 juillet)?', [['Its national day: the storming of the Bastille', true], ['The end of the Second World War in Europe, in 1945', false, 'That is 8 May (le 8 mai), also a public holiday.'], ['The birthday of Napoleon, its first emperor', false, 'Napoleon was born on 15 August 1769.'], ['The first day of the long summer holidays', false, 'The holidays start in early July, but 14 July is the national day.']], 'Le 14 juillet (Bastille Day in English) remembers the storming of the Bastille prison in Paris in 1789, at the start of the French Revolution. There is a military parade on the Champs-Élysées and fireworks all over France.', { hear: 'le quatorze juillet' }),
  mcq('cu.musique', 'r-culture', 'What happens at **la Fête de la Musique** on 21 June?', [['Free concerts in streets and squares all over France', true], ['A song contest shown on television across Europe', false, 'That is the Eurovision Song Contest, in May.'], ['A grand classical concert at the Paris opera house', false, 'It is for every kind of music, everywhere, and free.'], ['Every pupil in France takes a music exam', false, 'No exams: anyone can play.']], 'Since 1982, on 21 June (around the longest day of the year) anyone can play music in the street. Many other countries now hold one too.', { hear: 'la Fête de la Musique' }),
  fact('cu.seine', 'r-culture', 'Which river flows through Paris?', 'la Seine', ['la Loire', 'le Rhône', 'la Garonne'], 'The Seine flows through Paris and out into the English Channel at Le Havre. The Loire is the longest river in France.', { accept: ['seine', 'the seine', 'the river seine', 'river seine'], hear: 'la Seine' }),
  mcq('cu.motto', 'r-culture', 'What is the motto of the French Republic, written on town halls and schools?', [['Liberté, Égalité, Fraternité', true], ['Dieu et mon droit', false, 'That is the motto of the British monarch, in French!'], ['Unie dans la diversité', false, 'That is the motto of the European Union, “United in diversity”.'], ['Paix, Travail, Patrie', false, 'That is the motto of Cameroon, a French-speaking country in Africa.']], 'Liberty, equality, fraternity (brotherhood): the motto comes from the Revolution and is written into the French constitution.', { hear: 'Liberté, Égalité, Fraternité' }),
  fact('cu.anthem', 'r-culture', 'What is the French national anthem called?', 'la Marseillaise', ['la Parisienne', 'l’Hymne à la joie', 'la Bastille'], 'It was written in Strasbourg in 1792 by Rouget de Lisle, and is named after volunteer soldiers from Marseille who sang it as they marched into Paris. (L’Hymne à la joie, “Ode to Joy”, is the anthem of the European Union.)', { accept: ['marseillaise', 'the marseillaise'], hear: 'la Marseillaise' }),
  mcq('cu.euro', 'r-culture', 'Which currency does France use?', [['the euro', true], ['the franc', false, 'The franc was replaced by the euro: notes and coins arrived on 1 January 2002.'], ['the pound', false, 'The pound is the UK’s currency.'], ['the Swiss franc', false, 'That is Switzerland’s currency; Switzerland is not in the EU.']], 'France was one of the six countries that founded the European Economic Community in 1957, which grew into today’s European Union. Euro notes and coins arrived in 2002.'),
  mcq('cu.strasbourg', 'r-culture', 'Which French city is the official seat of the European Parliament?', [['Strasbourg', true], ['Paris', false, 'Paris is the capital of France, but the Parliament meets in Strasbourg.'], ['Lyon', false, 'The Parliament meets in Strasbourg, on the border with Germany.'], ['Lille', false, 'The Parliament meets in Strasbourg, on the border with Germany.']], 'MEPs meet in Strasbourg for most of their voting sessions; much of their other work happens in Brussels, where French and Dutch are both official languages.'),
  fact('cu.quebec', 'r-culture', 'In which Canadian province is French the only official language?', 'Quebec', ['Ontario', 'British Columbia', 'Nova Scotia'], 'Canada has two official languages, English and French, but Quebec’s only official language is French, and most Quebecers speak it as their first language. Montreal is one of the largest French-speaking cities in the world.', { accept: ['québec'] }),
  mcq('cu.speakers', 'r-culture', 'Roughly how many people speak French around the world?', [['about 320 million', true], ['about 70 million', false, 'That is roughly the population of France alone.'], ['about 30 million', false, 'Far more: French is spoken on five continents.'], ['about 3 billion', false, 'That would be over a third of the world!']], 'French is an official language in around 30 countries, and it is one of the two working languages of the United Nations and of the Olympic Games (with English).'),
  mcq('cu.africa', 'r-culture', 'On which continent do most of the people who use French every day live?', [['Africa', true], ['Europe', false, 'France is in Europe, but most daily French speakers live in Africa.'], ['North America', false, 'Quebec has about 9 million people; Africa has far more French speakers.'], ['Asia', false, 'French is much less used in Asia.']], 'Countries such as Senegal, Côte d’Ivoire, Cameroon and the Democratic Republic of the Congo use French in schools, government and business. Kinshasa, capital of the DR Congo, is one of the biggest French-speaking cities in the world.'),
  mcq('cu.senegal', 'r-culture', 'In which of these countries is French an official language?', [['Senegal', true], ['Brazil', false, 'Brazilians speak Portuguese.'], ['Kenya', false, 'Kenya’s official languages are English and Swahili.'], ['Mexico', false, 'Mexicans speak Spanish.']], 'Senegal, in West Africa, has French as its official language; its capital is Dakar, and many people also speak Wolof.'),
  mcq('cu.geneva', 'r-culture', 'Switzerland has four national languages. Which of these Swiss cities is French-speaking?', [['Geneva', true], ['Zurich', false, 'Zurich is German-speaking.'], ['Lugano', false, 'Lugano is Italian-speaking.'], ['Bern', false, 'Bern, the capital, is German-speaking.']], 'French is spoken in the west of Switzerland, in Geneva and Lausanne. The other national languages are German, Italian and Romansh.'),
  mcq('cu.galette', 'r-culture', 'In January, French families share **la galette des rois**, with a tiny charm (la fève) hidden inside. What happens to whoever finds it?', [['They become king or queen and wear a crown', true], ['They have to do all the washing-up', false, 'No chores: it is a happy custom!'], ['They make a secret wish for the year', false, 'There is a crown, not a wish.'], ['They have to give the charm back to the baker', false, 'People keep the fève; some collect them.']], 'The galette is eaten around Epiphany (6 January), when the Three Kings visited the baby Jesus. Bakeries sell it with a gold paper crown.', { hear: 'la galette des rois' }),
  mcq('cu.poisson', 'r-culture', 'What is **un poisson d’avril**?', [['a paper fish stuck on someone’s back as a joke', true], ['a fish dish that families eat on Easter Sunday', false, 'It is a joke, not a meal.'], ['a big fishing competition held every spring', false, 'It is a joke, not a competition.'], ['a spring flower that grows beside rivers', false, 'It is a joke, not a flower.']], 'On 1 April, children try to stick a paper fish on someone’s back without them noticing, then shout « Poisson d’avril ! »: the French April Fool.', { hear: 'un poisson d’avril' }),
  fact('cu.guiana', 'r-culture', 'French Guiana is part of France, and of the EU. On which continent is it?', 'South America', ['Africa', 'Asia', 'Oceania'], 'French Guiana borders Brazil and Suriname. Europe’s rockets are launched from Kourou there, close to the equator. Martinique, Guadeloupe, Réunion and Mayotte are also part of France.', { accept: ['s america', 'south-america'] }),
  mcq('cu.bise', 'r-culture', '**Faire la bise** means…', [['greeting people you know with kisses on the cheeks', true], ['shaking hands with everyone you meet at school each day', false, 'A handshake is une poignée de main.'], ['bowing your head politely to an older person', false, 'That is not a French custom.'], ['waving to a friend from across the street', false, 'That is faire signe.']], 'Usually one light kiss on each cheek, but it can be from one to four depending on the region. Adults meeting for work usually shake hands instead.', { hear: 'faire la bise' }),
  mcq('cu.tintin', 'r-culture', 'Tintin, the famous comic-strip reporter, was created by…', [['Hergé, a Belgian artist, in 1929', true], ['Goscinny and Uderzo, who created Astérix', false, 'Astérix, first published in 1959, is French.'], ['Jules Verne, a French adventure writer', false, 'Jules Verne wrote novels such as Around the World in Eighty Days.'], ['Walt Disney, an American film-maker', false, 'Tintin is Belgian.']], 'Comics (les bandes dessinées, or BD) are hugely popular in France and Belgium, and are read by adults as well as children.'),
  mcq('cu.olympics', 'r-culture', 'In 2024, Paris hosted…', [['the Olympic and Paralympic Games', true], ['the men’s football World Cup final', false, 'France hosted that in 1998, and won it.'], ['the Eurovision Song Contest', false, 'It was the Olympic and Paralympic Games.'], ['the Commonwealth Games', false, 'France is not in the Commonwealth.']], 'It was the third time Paris had hosted the Olympics, after 1900 and 1924.'),
  mcq('cu.louvre', 'r-culture', 'Which famous painting can you see in the Louvre, in Paris?', [['the Mona Lisa, by Leonardo da Vinci', true], ['The Starry Night, by Vincent van Gogh', false, 'That is in New York.'], ['The Hay Wain, by John Constable', false, 'That is in the National Gallery in London.'], ['The Scream, by Edvard Munch', false, 'That is in Oslo.']], 'In French the Mona Lisa is called la Joconde. The Louvre is the most visited museum in the world, and its glass pyramid entrance opened in 1989.'),
  fact('cu.bastille', 'r-culture', 'What is le 14 juillet usually called in English?', 'Bastille Day', ['Liberation Day', 'Revolution Day', 'Republic Day'], 'The French just call it le 14 juillet or la fête nationale.', { accept: ['bastille'] }),
);

// ---------------------------------------------------------------- pictures (js/ui/visuals.js)
const TOPIC_VISUALS = {
  'french.r-cognates': [
    { kind: 'table', head: ['French', 'English', 'examples'], rows: [
      ['ê, ô, â, î', 'a lost s', 'forêt = forest, hôpital = hospital, île = isle'],
      ['-ique', '-ic, -\u2060ical', 'électrique, historique'],
      ['-eux', '-ous', 'délicieux, dangereux'],
      ['-té', '-ty', 'liberté, université'],
      ['-ment', '-ly', 'rapidement, finalement'],
    ], caption: 'Patterns that turn French words into English ones.' },
    { kind: 'table', head: ['false friend', 'really means', 'the English word is…'], rows: [
      ['une librairie', 'a bookshop', 'library = une bibliothèque'],
      ['sensible', 'sensitive', 'sensible = raisonnable'],
      ['actuellement', 'at the moment', 'actually = en fait'],
      ['rester', 'to stay', 'to rest = se reposer'],
      ['attendre', 'to wait (for)', 'to attend = assister à'],
      ['une journée', 'a day', 'a journey = un voyage'],
      ['une veste', 'a jacket', 'a vest = un maillot de corps'],
      ['large', 'wide', 'large = grand'],
    ] },
  ],
  'french.r-read-1': { kind: 'table', head: ['collège', 'England', 'age'], rows: [['sixième (6e)', 'Year 7', '11–12'], ['cinquième (5e)', 'Year 8', '12–13'], ['quatrième (4e)', 'Year 9', '13–14'], ['troisième (3e)', 'Year 10', '14–15']], caption: 'At collège the years count down. Lycée follows: seconde, première, terminale.' },
  'french.r-read-2': { kind: 'table', head: ['with avoir', 'with être'], rows: [['j’ai fait', 'je suis allé'], ['j’ai acheté', 'je suis resté'], ['nous avons regardé', 'ma grand-mère est venue'], ['il a plu', '']], caption: 'Most verbs take avoir. Verbs of coming, going and staying take être, and agree: venue (+e) for a woman.' },
  'french.r-read-3': { kind: 'table', head: ['when?', 'signpost', 'verb'], rows: [['past', 'l’année dernière', 'nous **sommes allés**'], ['present', 'maintenant', 'ils **habitent**'], ['future', 'cet été, en août', 'nous **allons passer**']], caption: 'Time words and verb forms both tell you when.' },
  'french.r-translate-1': { kind: 'table', head: ['French', 'not…', 'but…'], rows: [['il y a', 'it there has', 'there is, there are'], ['j’ai douze ans', 'I have twelve years', 'I am twelve'], ['il fait beau', 'it makes beautiful', 'the weather is nice'], ['le samedi', 'the Saturday', 'on Saturdays'], ['j’ai regardé', 'I have watched', 'I watched']], caption: 'Translate the meaning, not the words.' },
  'french.r-translate-2': { kind: 'table', head: ['', 'check', 'for example'], rows: [['**G**', 'Gender', 'une maison, un parc'], ['**A**', 'Agreement', 'petite, chiens blancs, allée'], ['**T**', 'Tense', 'j’ai mangé, je vais manger'], ['**E**', 'Elision', 'j’aime, je n’aime pas, s’il']], caption: 'GATE: four checks before you hand it in.' },
  'french.r-culture': { kind: 'table', head: ['where', 'continent', 'good to know'], rows: [
    ['France', 'Europe', 'about 68 million people'],
    ['Belgium', 'Europe', 'French, Dutch and German'],
    ['Switzerland', 'Europe', 'one of four languages'],
    ['Quebec', 'North America', 'French is the official language'],
    ['Senegal', 'Africa', 'capital Dakar'],
    ['DR Congo', 'Africa', 'capital Kinshasa'],
    ['Haiti', 'Caribbean', 'French and Haitian Creole'],
    ['Martinique', 'Caribbean', 'part of France'],
  ], caption: 'Some of the places where French is spoken.' },
};
for (const [id, v] of Object.entries(TOPIC_VISUALS)) { const t = topics.find((x) => x.id === id); if (!t) throw new Error(`picture for unknown topic ${id}`); t.visual = v; }
// guillemets stay with their words in English text too (French strings were done by fr() above)
const glue = (x) => (typeof x === 'string' ? x.replace(/« /g, '«\u00a0').replace(/ »/g, '\u00a0»') : x);
for (const t of topics) for (const k of ['intro', 'teach', 'talk', 'hook', 'example']) t[k] = glue(t[k]);
for (const it of items) {
  for (const k of ['prompt', 'explain', 'answer']) it[k] = glue(it[k]);
  if (it.distractors) it.distractors = it.distractors.map(glue);
  if (it.options) it.options = it.options.map((o) => ({ ...o, text: glue(o.text), feedback: glue(o.feedback) }));
}
for (const t of topics) for (const d of t.diagnostic || []) if (!items.some((i) => i.id === d)) throw new Error(`diagnostic ${d} is not an item`);

export default [{ subject: 'french', deck: 'y8-reading', topics, items }];
